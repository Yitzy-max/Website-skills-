#!/usr/bin/env node
/**
 * Renders walkthrough/index.html to an MP4 by stepping the tour deterministically
 * in headless Chromium and piping JPEG frames into ffmpeg.
 *
 *   node tools/render-walkthrough.js [--w 1920] [--h 1080] [--fps 30]
 *                                    [--out videos/gym-lakewood-walkthrough.mp4]
 *                                    [--start 0] [--end <seconds>]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ffmpegPath = require('ffmpeg-static');
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i === -1 ? d : argv[i + 1]; };

const WIDTH = +arg('w', 1920);
const HEIGHT = +arg('h', 1080);
const FPS = +arg('fps', 30);
const OUT = path.resolve(ROOT, arg('out', 'videos/gym-lakewood-walkthrough.mp4'));
const START = +arg('start', 0);
const END = arg('end', null);
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
};

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]);
      const file = path.join(ROOT, rel === '/' ? 'index.html' : rel);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404); return res.end('not found');
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

const write = (stream, buf) =>
  stream.write(buf) ? Promise.resolve() : new Promise((r) => stream.once('drain', r));

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const { server, port } = await serve();

  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      '--force-color-profile=srgb', '--disable-dev-shm-usage', '--no-sandbox',
      '--hide-scrollbars', '--js-flags=--max-old-space-size=4096'],
  });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE:', m.text()); });

  const url = `http://127.0.0.1:${port}/walkthrough/index.html?capture=1&w=${WIDTH}&h=${HEIGHT}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__walkthrough && window.__walkthrough.ready, null, { timeout: 90000 });

  const total = await page.evaluate(() => window.__walkthrough.TOTAL);
  const endT = END === null ? total : Math.min(+END, total);
  const frames = Math.max(1, Math.round((endT - START) * FPS));
  console.log(`tour ${total.toFixed(1)}s | rendering ${frames} frames @ ${FPS}fps ${WIDTH}x${HEIGHT}`);

  const ff = spawn(ffmpegPath, [
    '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', 'pipe:0',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-x264-params', 'keyint=60:min-keyint=30',
    OUT,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });
  let ffErr = '';
  ff.stderr.on('data', (d) => { ffErr += d.toString().slice(-2000); });
  const done = new Promise((res, rej) => {
    ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c + '\n' + ffErr.slice(-1500)))));
  });

  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    const t = START + i / FPS;
    await page.evaluate((tt) => window.__walkthrough.frame(tt), t);
    const shot = await page.screenshot({ type: 'jpeg', quality: 94 });
    await write(ff.stdin, shot);
    if (i === 0 || (i + 1) % 25 === 0 || i === frames - 1) {
      const el = (Date.now() - t0) / 1000;
      const rate = (i + 1) / el;
      process.stdout.write(
        `\r  ${i + 1}/${frames}  ${(100 * (i + 1) / frames).toFixed(1)}%  ` +
        `${rate.toFixed(2)} fps  eta ${Math.round((frames - i - 1) / rate)}s   `);
    }
    if (i === Math.round(frames * 0.62)) {
      fs.writeFileSync(OUT.replace(/\.mp4$/, '-poster.jpg'), shot);
    }
  }
  ff.stdin.end();
  await done;
  process.stdout.write('\n');

  await browser.close();
  server.close();
  const mb = (fs.statSync(OUT).size / 1048576).toFixed(1);
  console.log(`done -> ${path.relative(ROOT, OUT)} (${mb} MB, ${(frames / FPS).toFixed(1)}s)`);
})().catch((e) => { console.error(e); process.exit(1); });
