// Equipment and fixture library. Units are feet; +Y is up.
import * as THREE from '../lib/three.module.js';
import { textPlate, woodSlat, mirrorish } from './textures.js';

const S = (o) => new THREE.MeshStandardMaterial(o);

export const MAT = {
  metalDark: S({ color: 0x24262b, metalness: 0.85, roughness: 0.38 }),
  metalMid: S({ color: 0x585c63, metalness: 0.8, roughness: 0.4 }),
  chrome: S({ color: 0xc4c9ce, metalness: 1.0, roughness: 0.16 }),
  pad: S({ color: 0x16171a, roughness: 0.72, metalness: 0.05 }),
  padRed: S({ color: 0x8d2b23, roughness: 0.65, metalness: 0.05 }),
  rubber: S({ color: 0x101114, roughness: 0.95, metalness: 0.0 }),
  plastic: S({ color: 0xe9eaec, roughness: 0.45, metalness: 0.0 }),
  screen: S({ color: 0x05070c, roughness: 0.25, metalness: 0.4, emissive: 0x0a1626, emissiveIntensity: 0.9 }),
  wood: S({ color: 0xa87a4d, roughness: 0.55, metalness: 0.0 }),
  woodDark: S({ color: 0x4e3626, roughness: 0.6, metalness: 0.0 }),
  cedar: S({ color: 0xc08a4e, roughness: 0.75, metalness: 0.0 }),
  white: S({ color: 0xf2f1ee, roughness: 0.5, metalness: 0.0 }),
  stone: S({ color: 0x2f3237, roughness: 0.4, metalness: 0.1 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: 0xdff0f2, metalness: 0, roughness: 0.03, transmission: 0.0,
    transparent: true, opacity: 0.16, side: THREE.DoubleSide,
  }),
  mirror: S({ map: mirrorish(), color: 0xd6dfe4, metalness: 0.55, roughness: 0.14, envMapIntensity: 2.1 }),
  greenery: S({ color: 0x2f5d3a, roughness: 0.85 }),
  brass: S({ color: 0xbe9a5c, metalness: 1, roughness: 0.28 }),
};

export const emissive = (color, intensity = 2.4) =>
  new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: intensity, roughness: 1 });

const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 18);
const SPH = new THREE.SphereGeometry(1, 16, 12);

export function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(BOX, mat);
  m.scale.set(w, h, d);
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = true;
  return m;
}
export function boxC(w, h, d, mat, x = 0, y = 0, z = 0) { // centered on y
  const m = box(w, h, d, mat, x, 0, z);
  m.position.y = y;
  return m;
}
export function cyl(r, h, mat, x = 0, y = 0, z = 0, axis = 'y') {
  const m = new THREE.Mesh(CYL, mat);
  m.scale.set(r, h, r);
  m.position.set(x, y, z);
  if (axis === 'x') m.rotation.z = Math.PI / 2;
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  m.castShadow = m.receiveShadow = true;
  return m;
}
export function sph(r, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(SPH, mat);
  m.scale.setScalar(r);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  return m;
}
const G = (...kids) => { const g = new THREE.Group(); kids.forEach((k) => k && g.add(k)); return g; };

// ---------------------------------------------------------------- cardio ----

export function treadmill() {
  const g = G();
  g.add(box(2.9, 0.62, 5.6, MAT.metalDark, 0, 0, 0));          // deck housing
  g.add(box(2.35, 0.1, 4.9, MAT.rubber, 0, 0.62, -0.1));       // belt
  g.add(box(2.6, 0.5, 0.9, MAT.metalMid, 0, 0.3, 2.65));       // motor cowl
  // uprights + console
  g.add(cyl(0.11, 3.5, MAT.metalMid, -1.25, 2.0, 2.3));
  g.add(cyl(0.11, 3.5, MAT.metalMid, 1.25, 2.0, 2.3));
  g.add(box(2.9, 0.16, 0.16, MAT.metalMid, 0, 3.7, 2.3));
  const cons = box(2.7, 1.5, 0.5, MAT.metalDark, 0, 3.15, 2.45);
  g.add(cons);
  const scr = box(2.2, 1.15, 0.08, MAT.screen, 0, 3.32, 2.72);
  g.add(scr);
  // handrails
  g.add(box(0.14, 0.14, 3.1, MAT.metalMid, -1.25, 2.55, 0.9));
  g.add(box(0.14, 0.14, 3.1, MAT.metalMid, 1.25, 2.55, 0.9));
  return g;
}

export function elliptical() {
  const g = G();
  g.add(box(2.2, 0.55, 5.4, MAT.metalDark, 0, 0, 0));
  g.add(cyl(0.78, 0.5, MAT.metalDark, 0, 1.25, -2.1, 'x'));     // flywheel shroud
  g.add(cyl(0.34, 0.56, MAT.metalMid, 0, 1.25, -2.1, 'x'));
  g.add(cyl(0.16, 4.6, MAT.metalDark, 0, 2.3, 1.9));
  g.add(box(1.9, 1.2, 0.35, MAT.metalDark, 0, 4.2, 1.9));
  g.add(box(1.5, 0.9, 0.06, MAT.screen, 0, 4.35, 2.1));
  for (const s of [-1, 1]) {
    const arm = box(0.13, 0.13, 4.4, MAT.metalMid, s * 0.85, 2.6, 0.2);
    arm.rotation.x = 0.22;
    g.add(arm);
    g.add(box(0.95, 0.12, 2.0, MAT.rubber, s * 0.8, 0.6, 0.6)); // foot pedal
  }
  return g;
}

export function gymBike() {
  const g = G();
  g.add(box(1.2, 0.35, 4.2, MAT.metalDark, 0, 0, 0));
  g.add(cyl(0.72, 0.42, MAT.metalDark, 0, 1.35, -1.4, 'x'));
  const post = cyl(0.14, 2.4, MAT.metalMid, 0, 1.4, 0.6); post.rotation.x = -0.18; g.add(post);
  g.add(box(1.0, 0.35, 1.2, MAT.pad, 0, 2.55, 0.85));
  g.add(cyl(0.13, 3.4, MAT.metalMid, 0, 2.0, -1.0));
  g.add(box(1.5, 0.9, 0.25, MAT.metalDark, 0, 3.85, -1.05));
  g.add(box(1.2, 0.65, 0.05, MAT.screen, 0, 3.95, -0.9));
  return g;
}

export function spinBike(accent = 0xd81b60) {
  const g = G();
  const acc = S({ color: accent, metalness: 0.5, roughness: 0.35 });
  g.add(box(0.5, 0.22, 3.4, MAT.metalDark, 0, 0, 0));
  g.add(box(2.1, 0.2, 0.3, MAT.metalDark, 0, 0, 1.5));
  g.add(box(2.1, 0.2, 0.3, MAT.metalDark, 0, 0, -1.5));
  // flywheel
  const fw = cyl(0.95, 0.16, MAT.chrome, 0, 1.15, -1.25, 'x'); g.add(fw);
  g.add(cyl(0.28, 0.2, acc, 0, 1.15, -1.25, 'x'));
  // frame
  const d1 = cyl(0.1, 2.5, acc, 0, 1.35, -0.55); d1.rotation.x = 0.55; g.add(d1);
  const d2 = cyl(0.1, 2.9, acc, 0, 1.6, 0.45); d2.rotation.x = -0.28; g.add(d2);
  // seat + bars
  g.add(cyl(0.09, 1.5, MAT.chrome, 0, 2.5, 0.82));
  g.add(box(0.55, 0.22, 1.05, MAT.pad, 0, 3.2, 0.82));
  g.add(cyl(0.09, 1.9, MAT.chrome, 0, 2.7, -0.42));
  g.add(box(1.5, 0.12, 0.12, MAT.pad, 0, 3.6, -0.42));
  g.add(box(0.12, 0.12, 0.9, MAT.pad, -0.7, 3.6, -0.75));
  g.add(box(0.12, 0.12, 0.9, MAT.pad, 0.7, 3.6, -0.75));
  // crank + pedals
  g.add(cyl(0.26, 0.22, MAT.chrome, 0, 0.95, -0.15, 'x'));
  g.add(box(0.55, 0.08, 0.35, MAT.metalDark, 0.5, 0.55, -0.15));
  g.add(box(0.55, 0.08, 0.35, MAT.metalDark, -0.5, 1.35, -0.15));
  return g;
}

export function rower() {
  const g = G();
  g.add(box(0.5, 0.3, 7.5, MAT.metalDark, 0, 0.7, 0));
  g.add(box(1.1, 0.25, 1.1, MAT.pad, 0, 0.95, 0.6));
  g.add(cyl(0.95, 0.5, MAT.plastic, 0, 1.4, -3.2, 'x'));
  g.add(box(1.6, 0.2, 0.6, MAT.rubber, 0, 0.55, 2.9));
  return g;
}

// ------------------------------------------------------------ free weights --

export function plate(r, w, mat = MAT.rubber) { return cyl(r, w, mat, 0, 0, 0, 'x'); }

export function barbell(loaded = true, len = 7.2) {
  const g = G();
  g.add(cyl(0.075, len, MAT.chrome, 0, 0, 0, 'x'));
  if (loaded) {
    for (const s of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const p = plate(0.75 - i * 0.02, 0.2);
        p.position.x = s * (len / 2 - 0.55 - i * 0.24);
        g.add(p);
      }
      const clip = cyl(0.2, 0.18, MAT.metalMid, s * (len / 2 - 1.25), 0, 0, 'x');
      g.add(clip);
    }
  }
  return g;
}

export function squatRack() {
  const g = G();
  for (const x of [-1.6, 1.6]) for (const z of [-1.3, 1.3]) g.add(box(0.36, 8.2, 0.36, MAT.metalDark, x, 0, z));
  g.add(box(3.9, 0.3, 0.3, MAT.metalDark, 0, 8.1, -1.3));
  g.add(box(3.9, 0.3, 0.3, MAT.metalDark, 0, 8.1, 1.3));
  g.add(box(0.3, 0.3, 2.9, MAT.metalDark, -1.6, 8.1, 0));
  g.add(box(0.3, 0.3, 2.9, MAT.metalDark, 1.6, 8.1, 0));
  for (const x of [-1.6, 1.6]) { // J-hooks
    const h = box(0.28, 0.5, 0.75, MAT.padRed, x, 4.0, -0.9); g.add(h);
  }
  const bar = barbell(true);
  bar.position.set(0, 4.6, -0.9);
  g.add(bar);
  g.add(box(4.2, 0.14, 3.2, MAT.rubber, 0, 0, 0)); // platform
  return g;
}

export function flatBench(incline = 0) {
  const g = G();
  const pad = box(1.25, 0.4, 4.2, MAT.pad, 0, 1.3, 0);
  pad.rotation.x = -incline;
  g.add(pad);
  g.add(box(1.4, 1.35, 0.35, MAT.metalDark, 0, 0, -1.6));
  g.add(box(1.4, 1.35, 0.35, MAT.metalDark, 0, 0, 1.6));
  g.add(box(0.3, 0.25, 3.4, MAT.metalDark, 0, 1.1, 0));
  if (incline > 0) {
    const back = box(1.25, 0.4, 2.4, MAT.pad, 0, 1.55, -1.5);
    back.rotation.x = -0.75; g.add(back);
  }
  return g;
}

export function dumbbell(size = 1) {
  const g = G();
  g.add(cyl(0.09, 0.55 * size, MAT.chrome, 0, 0, 0, 'x'));
  for (const s of [-1, 1]) {
    const head = cyl(0.3 * size, 0.42 * size, MAT.rubber, s * 0.42 * size, 0, 0, 'x');
    g.add(head);
  }
  return g;
}

export function dumbbellRack(pairs = 10) {
  const g = G();
  const L = pairs * 1.05;
  g.add(box(L, 0.35, 2.6, MAT.metalDark, 0, 0, 0));
  for (const t of [0, 1]) {
    const y = 1.25 + t * 1.05;
    const z = 0.55 - t * 1.05;
    const shelf = box(L, 0.22, 0.75, MAT.metalDark, 0, y, z);
    shelf.rotation.x = -0.12;
    g.add(shelf);
    for (let i = 0; i < pairs; i++) {
      const d = dumbbell(0.85 + t * 0.35);
      d.position.set(-L / 2 + 0.6 + i * (L - 1.2) / (pairs - 1), y + 0.52 + t * 0.12, z);
      d.rotation.y = Math.PI / 2;
      g.add(d);
    }
  }
  for (const s of [-1, 1]) g.add(box(0.2, 3.0, 2.4, MAT.metalDark, s * (L / 2 - 0.1), 0, 0));
  return g;
}

export function kettlebell(r = 0.42) {
  const g = G();
  g.add(sph(r, MAT.metalDark, 0, r, 0));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(r * 0.62, r * 0.16, 8, 16, Math.PI), MAT.metalDark);
  handle.position.y = r * 1.75;
  handle.castShadow = true;
  g.add(handle);
  return g;
}

export function plateTree() {
  const g = G();
  g.add(box(2.4, 0.3, 2.4, MAT.metalDark, 0, 0, 0));
  g.add(cyl(0.22, 5.0, MAT.metalDark, 0, 2.5, 0));
  for (let i = 0; i < 4; i++) {
    const y = 1.1 + i * 1.1;
    for (const s of [-1, 1]) {
      const peg = cyl(0.11, 1.0, MAT.metalMid, s * 0.5, y, 0, 'x'); g.add(peg);
      for (let k = 0; k < 3; k++) {
        const p = plate(0.7 - i * 0.07, 0.18);
        p.position.set(s * (0.55 + k * 0.2), y, 0);
        g.add(p);
      }
    }
  }
  return g;
}

export function weightStackMachine(w = 3.6, d = 5.0, h = 7.0) {
  const g = G();
  g.add(box(w, 0.35, d, MAT.metalDark, 0, 0, 0));
  g.add(box(0.4, h, 0.4, MAT.metalDark, -w / 2 + 0.3, 0, -d / 2 + 0.4));
  g.add(box(0.4, h, 0.4, MAT.metalDark, w / 2 - 0.3, 0, -d / 2 + 0.4));
  g.add(box(w - 0.8, 0.35, 0.4, MAT.metalDark, 0, h, -d / 2 + 0.4));
  // weight stack
  g.add(box(1.7, 4.4, 1.5, MAT.metalMid, 0, 0.4, -d / 2 + 0.45));
  for (let i = 0; i < 11; i++) g.add(box(1.75, 0.3, 1.55, i < 4 ? MAT.padRed : MAT.pad, 0, 0.45 + i * 0.38, -d / 2 + 0.45));
  g.add(cyl(0.05, 4.0, MAT.chrome, 0, 5.4, -d / 2 + 0.45));
  // seat + back pad
  g.add(box(1.7, 0.4, 1.5, MAT.pad, 0, 1.55, 0.6));
  const back = box(1.7, 0.4, 2.4, MAT.pad, 0, 2.6, 1.5);
  back.rotation.x = 1.35; g.add(back);
  g.add(box(0.35, 1.6, 0.35, MAT.metalDark, 0, 0, 0.6));
  // arms
  for (const s of [-1, 1]) {
    const arm = cyl(0.11, 2.6, MAT.metalMid, s * 1.3, 4.6, -0.4);
    arm.rotation.z = s * 0.25; g.add(arm);
    g.add(box(0.5, 0.5, 0.5, MAT.padRed, s * 1.6, 5.7, -0.4));
  }
  return g;
}

export function cableTower() {
  const g = G();
  const W = 8.0;
  for (const s of [-1, 1]) {
    g.add(box(0.45, 9.0, 0.45, MAT.metalDark, s * W / 2, 0, 0));
    g.add(box(1.9, 4.6, 1.7, MAT.metalMid, s * (W / 2 - 1.2), 0.3, 0));
    for (let i = 0; i < 11; i++) g.add(box(1.95, 0.3, 1.75, MAT.pad, s * (W / 2 - 1.2), 0.4 + i * 0.38, 0));
    g.add(cyl(0.3, 0.2, MAT.chrome, s * W / 2, 8.4, 0, 'x'));
    const cable = cyl(0.035, 4.4, MAT.metalDark, s * (W / 2 - 0.12), 6.4, 0); g.add(cable);
    g.add(box(1.2, 0.16, 0.16, MAT.metalDark, s * (W / 2 - 0.12), 4.2, 0));
  }
  g.add(box(W, 0.4, 0.4, MAT.metalDark, 0, 8.9, 0));
  g.add(box(W - 1.4, 0.32, 0.32, MAT.chrome, 0, 7.6, 0)); // pull-up bar
  return g;
}

export function matRoll(color = 0x3a3f46) {
  const m = cyl(0.42, 2.4, S({ color, roughness: 0.9 }), 0, 0.42, 0, 'x');
  return G(m);
}
export function stabilityBall(color = 0x3f7fb5, r = 1.1) { return G(sph(r, S({ color, roughness: 0.55 }), 0, r, 0)); }

// ---------------------------------------------------------- rooms/fixtures --

export function lockerBank(count = 8, tiers = 2, faceColor = 0x2e2b27) {
  const g = G();
  const w = 1.25, h = 3.4, d = 1.6;
  const face = S({ color: faceColor, roughness: 0.45, metalness: 0.15 });
  g.add(box(count * w + 0.2, tiers * h + 0.35, d + 0.1, MAT.metalDark, 0, 0, 0));
  for (let t = 0; t < tiers; t++) {
    for (let i = 0; i < count; i++) {
      const x = -count * w / 2 + w / 2 + i * w;
      const y = 0.2 + t * h;
      const door = box(w - 0.12, h - 0.14, 0.12, face, x, y, d / 2 + 0.06);
      g.add(door);
      g.add(box(0.1, 0.5, 0.1, MAT.brass, x + w / 2 - 0.25, y + h / 2, d / 2 + 0.16));
      const vent = box(w - 0.5, 0.06, 0.06, MAT.metalMid, x, y + h - 0.5, d / 2 + 0.17);
      g.add(vent);
    }
  }
  return g;
}

export function woodBench(len = 6) {
  const g = G();
  g.add(box(len, 0.24, 1.5, MAT.wood, 0, 1.35, 0));
  for (const s of [-1, 1]) g.add(box(0.25, 1.35, 1.3, MAT.metalDark, s * (len / 2 - 0.7), 0, 0));
  return g;
}

export function showerStall(w = 4, d = 4.5, h = 8.2) {
  const g = G();
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, d), MAT.glass);
  glass.position.set(w / 2, h / 2, 0); g.add(glass);
  const glass2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, d), MAT.glass);
  glass2.position.set(-w / 2, h / 2, 0); g.add(glass2);
  g.add(box(w, h, 0.25, S({ color: 0x3b3f44, roughness: 0.25, metalness: 0.15 }), 0, 0, -d / 2));
  g.add(cyl(0.06, 1.6, MAT.chrome, 0, 7.0, -d / 2 + 0.5));
  const head = cyl(0.55, 0.14, MAT.chrome, 0, 6.3, -d / 2 + 1.2); g.add(head);
  g.add(box(0.5, 1.1, 0.2, MAT.chrome, 0, 3.6, -d / 2 + 0.18));
  return g;
}

export function vanity(len = 8) {
  const g = G();
  g.add(box(len, 0.35, 2.2, MAT.stone, 0, 2.7, 0));
  g.add(box(len - 0.6, 2.4, 1.9, MAT.woodDark, 0, 0.25, -0.1));
  const n = Math.max(1, Math.floor(len / 4));
  for (let i = 0; i < n; i++) {
    const x = -len / 2 + len / (n * 2) + i * (len / n);
    g.add(cyl(0.7, 0.16, MAT.white, x, 3.0, 0.1));
    const sp = cyl(0.07, 1.1, MAT.chrome, x, 3.5, -0.55); g.add(sp);
    g.add(box(0.07, 0.07, 0.6, MAT.chrome, x, 3.95, -0.3));
    const mir = box(len / n - 0.8, 3.4, 0.1, MAT.mirror, x, 3.6, -1.05);
    g.add(mir);
  }
  return g;
}

export function toiletStall(w = 3.5, d = 5, h = 7) {
  const g = G();
  const pm = S({ color: 0x2b2e33, roughness: 0.4 });
  g.add(box(0.12, h - 0.9, d, pm, -w / 2, 0.9, 0));
  g.add(box(0.12, h - 0.9, d, pm, w / 2, 0.9, 0));
  g.add(box(w, h - 0.9, 0.12, pm, 0, 0.9, d / 2));
  g.add(box(1.4, 1.3, 2.2, MAT.white, 0, 0, -d / 2 + 1.3));
  g.add(box(1.5, 1.6, 0.6, MAT.white, 0, 1.2, -d / 2 + 0.35));
  return g;
}

export function sauna(w = 11, d = 9, h = 8) {
  const g = G();
  const slats = new THREE.MeshStandardMaterial({ map: woodSlat([5, 2]), color: 0xd0a46a, roughness: 0.8 });
  const slatsV = new THREE.MeshStandardMaterial({ map: woodSlat([3, 1]), color: 0xc79a62, roughness: 0.8 });
  g.add(box(w, h, 0.35, slats, 0, 0, -d / 2));      // back wall
  g.add(box(0.35, h, d, slatsV, -w / 2, 0, 0));
  g.add(box(0.35, h, d, slatsV, w / 2, 0, 0));
  g.add(box(w, 0.3, d, slats, 0, h, 0));            // ceiling
  g.add(box(w - 1.2, 0.35, 2.4, MAT.cedar, 0, 1.4, -d / 2 + 1.5)); // lower bench
  g.add(box(w - 1.2, 0.35, 2.4, MAT.cedar, 0, 3.3, -d / 2 + 3.2)); // upper bench
  g.add(box(2.0, 2.2, 1.8, MAT.metalDark, -w / 2 + 1.6, 0, d / 2 - 2.0)); // heater
  const rocks = G();
  for (let i = 0; i < 10; i++) rocks.add(sph(0.22 + Math.random() * 0.12, MAT.stone, (Math.random() - 0.5) * 1.5, 2.3, (Math.random() - 0.5) * 1.3));
  rocks.position.set(-w / 2 + 1.6, 0, d / 2 - 2.0);
  g.add(rocks);
  const glow = new THREE.PointLight(0xff8c3a, 60, 26, 2);
  glow.position.set(0, 4.2, 1);
  g.add(glow);
  const strip = new THREE.Mesh(new THREE.BoxGeometry(w - 1.4, 0.1, 0.1), emissive(0xffa552, 3.2));
  strip.position.set(0, 5.4, -d / 2 + 0.6);
  g.add(strip);
  return g;
}

// ------------------------------------------------------------------- pool ---

export function poolLadder() {
  const g = G();
  for (const s of [-1, 1]) {
    const rail = cyl(0.09, 4.2, MAT.chrome, s * 0.8, 1.6, 0);
    g.add(rail);
    const curve = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.09, 8, 14, Math.PI / 2), MAT.chrome);
    curve.position.set(s * (0.8 - s * 0.55), 3.7, 0);
    curve.rotation.y = Math.PI / 2;
    curve.rotation.z = s > 0 ? 0 : Math.PI / 2;
    g.add(curve);
  }
  for (let i = 0; i < 3; i++) g.add(cyl(0.07, 1.7, MAT.chrome, 0, 0.4 - i * 1.1, 0, 'x'));
  return g;
}

export function lounger() {
  const g = G();
  const frame = S({ color: 0xd8d4cc, roughness: 0.5 });
  const seat = box(2.4, 0.22, 5.0, frame, 0, 1.0, 0); g.add(seat);
  const back = box(2.4, 0.22, 2.4, frame, 0, 1.55, -2.5); back.rotation.x = -0.72; g.add(back);
  for (const s of [-1, 1]) for (const z of [-1.8, 1.8]) g.add(cyl(0.08, 1.0, MAT.metalMid, s * 1.0, 0.5, z));
  g.add(box(2.0, 0.14, 4.2, S({ color: 0xa8c0c4, roughness: 0.85 }), 0, 1.16, 0.2));
  const pil = box(1.5, 0.22, 0.7, S({ color: 0xeceae4, roughness: 0.9 }), 0, 1.9, -2.0);
  pil.rotation.x = -0.72; g.add(pil);
  return g;
}

export function towelStack(n = 5) {
  const g = G();
  for (let i = 0; i < n; i++) {
    const t = box(1.7, 0.3, 1.1, S({ color: 0xf4f2ee, roughness: 0.9 }), (Math.random() - 0.5) * 0.12, i * 0.32, 0);
    t.rotation.y = (Math.random() - 0.5) * 0.08;
    g.add(t);
  }
  return g;
}

// -------------------------------------------------------- lobby / juice bar --

export function barCounter(len = 16) {
  const g = G();
  g.add(box(len, 3.3, 2.6, MAT.woodDark, 0, 0, 0));
  g.add(box(len + 0.5, 0.25, 3.0, MAT.stone, 0, 3.3, 0));
  const glow = new THREE.Mesh(new THREE.BoxGeometry(len - 0.6, 0.08, 0.08), emissive(0xffd9a0, 2.0));
  glow.position.set(0, 0.35, 1.35);
  g.add(glow);
  return g;
}

export function backBar(len = 16, h = 8) {
  const g = G();
  g.add(box(len, h, 1.4, MAT.woodDark, 0, 0, 0));
  const bottleCols = ['#8fd14f', '#f2a03d', '#e05263', '#f5e663', '#7fc8d6'];
  for (let sh = 0; sh < 3; sh++) {
    const y = 2.2 + sh * 1.9;
    g.add(box(len - 1.0, 0.16, 1.2, MAT.wood, 0, y, 0.25));
    const strip = new THREE.Mesh(new THREE.BoxGeometry(len - 1.2, 0.06, 0.06), emissive(0xffe6bd, 2.6));
    strip.position.set(0, y + 1.6, 0.75);
    g.add(strip);
    for (let i = 0; i < Math.floor(len * 0.8); i++) {
      const c = bottleCols[(i + sh) % bottleCols.length];
      const b = cyl(0.17, 1.1, S({ color: c, roughness: 0.25, metalness: 0.05 }), -len / 2 + 0.9 + i * 1.15, y + 0.72, 0.3);
      g.add(b);
    }
  }
  return g;
}

export function barStool() {
  const g = G();
  g.add(cyl(0.65, 0.3, MAT.wood, 0, 2.5, 0));
  g.add(cyl(0.12, 2.5, MAT.metalDark, 0, 1.25, 0));
  g.add(cyl(0.7, 0.12, MAT.metalDark, 0, 0.06, 0));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 6, 16), MAT.metalDark);
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.85; g.add(ring);
  return g;
}

export function cafeTable(r = 1.5) {
  const g = G();
  g.add(cyl(r, 0.18, MAT.wood, 0, 2.4, 0));
  g.add(cyl(0.16, 2.4, MAT.metalDark, 0, 1.2, 0));
  g.add(cyl(0.9, 0.12, MAT.metalDark, 0, 0.06, 0));
  return g;
}

export function chair() {
  const g = G();
  g.add(box(1.5, 0.2, 1.5, MAT.wood, 0, 1.4, 0));
  const back = box(1.5, 1.7, 0.18, MAT.wood, 0, 1.6, -0.65); back.rotation.x = -0.12; g.add(back);
  for (const s of [-1, 1]) for (const z of [-1, 1]) g.add(cyl(0.07, 1.4, MAT.metalDark, s * 0.6, 0.7, z * 0.6));
  return g;
}

export function pendant(color = 0xffe3b8) {
  const g = G();
  const cord = cyl(0.03, 3.0, MAT.metalDark, 0, -1.5, 0); g.add(cord);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.9, 16, 1, true), S({ color: 0x1c1b19, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide }));
  shade.position.y = -3.4; g.add(shade);
  const bulb = sph(0.26, emissive(color, 6), 0, -3.72, 0); g.add(bulb);
  return g;
}

export function receptionDesk(len = 12) {
  const g = G();
  g.add(box(len, 3.4, 3.2, MAT.woodDark, 0, 0, 0));
  g.add(box(len + 0.8, 0.28, 3.8, MAT.stone, 0, 3.4, 0));
  const glow = new THREE.Mesh(new THREE.BoxGeometry(len + 0.4, 0.1, 0.1), emissive(0xffd9a0, 2.4));
  glow.position.set(0, 0.5, 1.75);
  g.add(glow);
  g.add(box(1.6, 0.1, 1.1, MAT.screen, -len / 4, 3.68, 0.4));
  return g;
}

export function logoWall(text, w = 14, h = 8, color = '#ffffff') {
  const g = G();
  g.add(box(w, h, 0.4, S({ color: 0x1d1a17, roughness: 0.6 }), 0, 0, 0));
  const tex = textPlate(text, { w: 1024, h: 256, color, glow: 26, letter: 14 });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.72, w * 0.72 / 4),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  plane.position.set(0, h * 0.5, 0.25);
  g.add(plane);
  return g;
}

export function vendingMachine() {
  const g = G();
  g.add(box(3.4, 7.0, 2.6, MAT.metalDark, 0, 0, 0));
  g.add(box(2.9, 5.4, 0.12, S({ color: 0x0d2233, roughness: 0.1, metalness: 0.2, emissive: 0x123a52, emissiveIntensity: 0.7 }), 0, 1.2, 1.32));
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 5; c++)
      g.add(box(0.4, 0.7, 0.3, S({ color: [0xe0563f, 0x4fa3d1, 0x6fbf5a, 0xe9c23f][(r + c) % 4], roughness: 0.4 }), -1.1 + c * 0.55, 1.6 + r * 1.2, 1.15));
  return g;
}

export function towelCubby(w = 6, h = 7) {
  const g = G();
  g.add(box(w, h, 1.8, MAT.woodDark, 0, 0, 0));
  for (let r = 0; r < 4; r++) {
    g.add(box(w - 0.4, 0.12, 1.6, MAT.wood, 0, 0.5 + r * 1.6, 0.1));
    const t = towelStack(3);
    t.scale.setScalar(0.62);
    t.position.set(0, 0.62 + r * 1.6, 0.15);
    g.add(t);
  }
  return g;
}

const LEAF = new THREE.SphereGeometry(1, 6, 4);
export function plant(scale = 1, seed = Math.random()) {
  const g = G();
  const rnd = (() => { let s = seed * 9973; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  g.add(cyl(0.78, 1.5, S({ color: 0x33302b, roughness: 0.85 }), 0, 0.75, 0));
  g.add(cyl(0.72, 0.22, S({ color: 0x2b2722, roughness: 0.95 }), 0, 1.55, 0));
  const dark = S({ color: 0x27452f, roughness: 0.88 });
  const mid = S({ color: 0x36603f, roughness: 0.85 });
  for (let i = 0; i < 44; i++) {
    const a = rnd() * Math.PI * 2;
    const reach = 0.35 + rnd() * 1.5;
    const len = 1.1 + rnd() * 1.5;
    const leaf = new THREE.Mesh(LEAF, i % 3 ? mid : dark);
    leaf.scale.set(0.2 + rnd() * 0.1, len * 0.5, 0.055);
    leaf.position.set(Math.cos(a) * reach, 1.7 + len * 0.42 + rnd() * 0.9, Math.sin(a) * reach);
    leaf.rotation.set(0.45 + rnd() * 0.5, a, 0);
    leaf.rotation.z = (rnd() - 0.5) * 0.5;
    g.add(leaf);
  }
  g.scale.setScalar(scale);
  return g;
}

export function wallScreen(w = 6, h = 3.4) {
  const g = G();
  g.add(box(w + 0.25, h + 0.25, 0.22, MAT.metalDark, 0, 0, 0));
  g.add(box(w, h, 0.06, MAT.screen, 0, 0.12, 0.15));
  return g;
}

export function mirrorWall(w, h = 7.5) {
  const g = G();
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), MAT.mirror);
  m.position.y = h / 2 + 0.6;
  g.add(m);
  g.add(box(w, 0.2, 0.16, MAT.metalDark, 0, 0.5, 0.02));
  g.add(box(w, 0.2, 0.16, MAT.metalDark, 0, h + 0.6, 0.02));
  return g;
}

export function balletBarre(len = 20) {
  const g = G();
  g.add(cyl(0.11, len, MAT.wood, 0, 3.4, 0, 'x'));
  for (let i = 0; i <= 3; i++) {
    const x = -len / 2 + (len / 3) * i;
    g.add(box(0.3, 3.4, 0.5, MAT.metalDark, x, 0, 0.35));
  }
  return g;
}
