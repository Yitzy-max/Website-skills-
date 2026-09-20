import * as THREE from './lib/three.module.js';
import { RoomEnvironment } from './lib/RoomEnvironment.js';
import { buildGym, buildLights, B } from './scene/gym.js';
import { sample, SHOTS, TOTAL } from './scene/tour.js';

const qs = new URLSearchParams(location.search);
const CAPTURE = qs.get('capture') === '1';
const W = +(qs.get('w') || 0), H = +(qs.get('h') || 0);

const canvas = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(CAPTURE ? 1 : Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e1014);
scene.fog = new THREE.Fog(0x141821, 260, 1000);

const camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.4, 900);

// image-based lighting so the PBR materials have something to reflect
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

const gym = buildGym();
scene.add(gym.root);
buildLights(scene);

// Sky dome for the exterior beats
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(520, 32, 20),
  new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { top: { value: new THREE.Color(0x1f3a5c) }, bot: { value: new THREE.Color(0xd8a072) } },
    vertexShader: 'varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} ',
    fragmentShader: 'uniform vec3 top; uniform vec3 bot; varying float h; void main(){ gl_FragColor = vec4(mix(bot, top, smoothstep(-0.08, 0.5, h)), 1.0);} ',
  }));
sky.position.set(B.W / 2, 0, B.D / 2);
scene.add(sky);

// Water ripple ---------------------------------------------------------------
const waterGeo = gym.water.geometry;
const basePos = waterGeo.attributes.position.array.slice();
function rippleWater(t) {
  const p = waterGeo.attributes.position.array;
  for (let i = 0; i < p.length; i += 3) {
    const x = basePos[i], y = basePos[i + 1];
    p[i + 2] = Math.sin(x * 0.55 + t * 1.6) * 0.055
             + Math.sin(y * 0.4 - t * 1.15) * 0.07
             + Math.sin((x + y) * 0.22 + t * 0.7) * 0.05;
  }
  waterGeo.attributes.position.needsUpdate = true;
  waterGeo.computeVertexNormals();
}

// Caption overlay ------------------------------------------------------------
const ui = {
  label: document.getElementById('label'),
  sub: document.getElementById('sub'),
  caption: document.getElementById('caption'),
  bar: document.getElementById('bar'),
  chapters: document.getElementById('chapters'),
};
SHOTS.forEach((s, i) => {
  const b = document.createElement('button');
  b.textContent = s.label;
  b.onclick = () => { time = SHOTS.slice(0, i).reduce((a, x) => a + x.dur, 0) + 0.01; playing = true; };
  ui.chapters.appendChild(b);
});

let lastLabel = '';
function applyFrame(t) {
  const f = sample(t);
  camera.position.copy(f.pos);
  camera.lookAt(f.look);
  if (Math.abs(camera.fov - f.fov) > 1e-4) { camera.fov = f.fov; camera.updateProjectionMatrix(); }

  if (f.label !== lastLabel) {
    ui.label.textContent = f.label;
    ui.sub.textContent = f.sub;
    lastLabel = f.label;
  }
  ui.caption.style.opacity = f.alpha.toFixed(3);
  ui.bar.style.width = (f.progress * 100).toFixed(2) + '%';

  gym.ceilings.visible = f.ceilAlpha > 0.02;
  gym.ceilings.traverse((o) => {
    if (o.material && o.material.transparent !== undefined) {
      o.material.transparent = true;
      o.material.opacity = f.ceilAlpha;
    }
  });
  gym.labels.traverse((o) => { if (o.material) o.material.opacity = f.labelAlpha; });

  rippleWater(t);
}

function resize() {
  const w = W || innerWidth, h = H || innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, !CAPTURE);
}
addEventListener('resize', resize);
resize();

// Playback -------------------------------------------------------------------
let time = 0, playing = !CAPTURE, prev = performance.now();

function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - prev) / 1000, 0.05);
  prev = now;
  if (playing) {
    time += dt;
    if (time >= TOTAL) { time = TOTAL - 0.001; playing = false; }
  }
  applyFrame(time);
  renderer.render(scene, camera);
}

document.getElementById('playpause').onclick = (e) => {
  if (time >= TOTAL - 0.01) time = 0;
  playing = !playing;
  e.target.textContent = playing ? 'Pause' : 'Play';
};
document.getElementById('restart').onclick = () => { time = 0; playing = true; };
addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); playing = !playing; }
  if (e.code === 'ArrowRight') time = Math.min(TOTAL - 0.01, time + 2);
  if (e.code === 'ArrowLeft') time = Math.max(0, time - 2);
});

// Deterministic hook used by the offline renderer -----------------------------
// Nothing in the scene moves except the water surface and the camera, so the
// shadow map only has to be rasterised once.
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;

window.__walkthrough = {
  TOTAL,
  frame(t) { applyFrame(t); renderer.render(scene, camera); },
  ready: true,
};

if (CAPTURE) {
  applyFrame(0);
  renderer.render(scene, camera);
  document.body.classList.add('capture');
} else {
  requestAnimationFrame(loop);
}
