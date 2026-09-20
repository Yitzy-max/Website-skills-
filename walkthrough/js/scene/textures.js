// Procedural textures. Everything is drawn to a canvas at load time so the
// walkthrough has zero external image dependencies and works offline.
import * as THREE from '../lib/three.module.js';

const cache = new Map();

function canvas(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  return c;
}

function make(key, size, draw, repeat = [1, 1], srgb = true) {
  if (cache.has(key)) return cache.get(key);
  const tex = new THREE.CanvasTexture(canvas(size, draw));
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 8;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

function noise(ctx, size, amount, alpha) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
    if (alpha !== undefined) d[i + 3] = alpha;
  }
  ctx.putImageData(img, 0, 0);
}

// --- Floors -----------------------------------------------------------------

export const woodFloor = (repeat = [10, 10]) => make('wood' + repeat, 512, (ctx, s) => {
  ctx.fillStyle = '#b98f5e';
  ctx.fillRect(0, 0, s, s);
  const plankH = s / 8;
  for (let row = 0; row < 8; row++) {
    const offset = (row % 2) * (s / 4);
    for (let col = -1; col < 3; col++) {
      const x = col * (s / 2) + offset;
      const y = row * plankH;
      const tone = 155 + Math.random() * 40;
      ctx.fillStyle = `rgb(${tone + 40}, ${tone - 8}, ${tone - 60})`;
      ctx.fillRect(x, y, s / 2 - 2, plankH - 2);
      // grain
      ctx.strokeStyle = `rgba(90,60,30,${0.05 + Math.random() * 0.08})`;
      ctx.lineWidth = 1;
      for (let g = 0; g < 14; g++) {
        const gy = y + Math.random() * plankH;
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.bezierCurveTo(x + s / 6, gy + 2, x + s / 3, gy - 2, x + s / 2, gy);
        ctx.stroke();
      }
    }
  }
  noise(ctx, s, 14);
}, repeat);

export const rubberFloor = (repeat = [14, 14]) => make('rubber' + repeat, 256, (ctx, s) => {
  ctx.fillStyle = '#2b2d31';
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 2600; i++) {
    const g = 70 + Math.random() * 90;
    ctx.fillStyle = `rgba(${g},${g + 4},${g + 10},${0.12 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(Math.random() * s, Math.random() * s, 0.7 + Math.random() * 1.6, 0, 7);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, s, s);
}, repeat);

export const concreteFloor = (repeat = [8, 8]) => make('concrete' + repeat, 512, (ctx, s) => {
  ctx.fillStyle = '#6a6a6d';
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
    ctx.beginPath();
    ctx.arc(Math.random() * s, Math.random() * s, Math.random() * 40, 0, 7);
    ctx.fill();
  }
  noise(ctx, s, 22);
}, repeat);

export const tileFloor = (repeat = [10, 10], light = '#d9d6cf', grout = '#a6a29a') =>
  make('tile' + repeat + light, 512, (ctx, s) => {
    ctx.fillStyle = grout;
    ctx.fillRect(0, 0, s, s);
    const n = 4, t = s / n;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = 1 + (Math.random() - 0.5) * 0.06;
        ctx.fillStyle = light;
        ctx.globalAlpha = v;
        ctx.fillRect(x * t + 2, y * t + 2, t - 4, t - 4);
        ctx.globalAlpha = 1;
      }
    }
    noise(ctx, s, 8);
  }, repeat);

export const poolTile = (repeat = [10, 16]) => make('pooltile' + repeat, 512, (ctx, s) => {
  ctx.fillStyle = '#7fb6c9';
  ctx.fillRect(0, 0, s, s);
  const n = 16, t = s / n;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const b = 150 + Math.random() * 60;
      ctx.fillStyle = `rgb(${b - 60}, ${b + 10}, ${b + 30})`;
      ctx.fillRect(x * t + 1, y * t + 1, t - 2, t - 2);
    }
  }
}, repeat);

// --- Walls ------------------------------------------------------------------

export const plasterWall = (repeat = [4, 2], color = '#e8e5e0') =>
  make('plaster' + repeat + color, 256, (ctx, s) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, s, s);
    noise(ctx, s, 9);
  }, repeat);

export const woodSlat = (repeat = [6, 1]) => make('slat' + repeat, 256, (ctx, s) => {
  ctx.fillStyle = '#1b1613';
  ctx.fillRect(0, 0, s, s);
  const n = 16, w = s / n;
  for (let i = 0; i < n; i++) {
    const tone = 92 + Math.random() * 34;
    ctx.fillStyle = `rgb(${tone + 46}, ${tone + 4}, ${tone - 26})`;
    ctx.fillRect(i * w + 1.5, 0, w - 3, s);
  }
}, repeat);

// --- Signage / labels -------------------------------------------------------

export function textPlate(text, {
  w = 1024, h = 256, bg = 'rgba(0,0,0,0)', color = '#ffffff',
  font = '600 120px Inter, Helvetica, Arial, sans-serif', letter = 6, glow = 0,
} = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = letter + 'px';
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; }
  ctx.fillStyle = color;
  ctx.fillText(text, w / 2, h / 2);
  if (glow) { ctx.fillText(text, w / 2, h / 2); }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export const mirrorish = () => make('mirror', 128, (ctx, s) => {
  const g = ctx.createLinearGradient(0, 0, s, s);
  g.addColorStop(0, '#b9c3c9');
  g.addColorStop(0.5, '#8e9aa2');
  g.addColorStop(1, '#aab4bb');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
}, [1, 1]);
