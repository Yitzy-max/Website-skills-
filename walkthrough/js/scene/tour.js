// Camera choreography for the walkthrough. Each shot is a dolly move with its
// own look-at track, focal length and caption. Cuts happen between shots.
import * as THREE from '../lib/three.module.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const linear = (t) => t;
const EASE = { easeInOut, easeOut, linear };

export const SHOTS = [
  {
    label: 'THE GYM', sub: 'Lakewood, NJ  ·  Proposed Floor Plan, Option 2',
    dur: 5.0, ease: 'easeInOut', fov: [38, 44],
    cam: [V(168, 11, 30), V(104, 6.6, 30)],
    look: [V(100, 7, 30), V(88, 5.6, 30)],
  },
  {
    label: 'RECEPTION', sub: '87 SF  ·  towel pickup',
    dur: 4.4, ease: 'easeInOut', fov: [46, 50],
    cam: [V(99, 5.8, 30), V(91, 5.8, 33)],
    look: [V(86, 5.4, 29.5), V(84, 6.6, 29)],
  },
  {
    label: 'JUICE BAR', sub: '137 SF  ·  prep with sink  ·  vending',
    dur: 5.2, ease: 'easeInOut', fov: [50, 54],
    cam: [V(94, 5.9, 20), V(88.5, 5.7, 12.5)],
    look: [V(90, 4.6, 9), V(90, 4.4, 4.5)],
  },
  {
    label: 'SEATING AREA', sub: '125 SF',
    dur: 3.6, ease: 'easeInOut', fov: [52, 52],
    cam: [V(86, 5.8, 16.5), V(79.5, 5.8, 18.5)],
    look: [V(81, 4.2, 16), V(75.5, 4.2, 16.5)],
  },
  {
    label: 'SPIN STUDIO', sub: '250 SF  ·  20 bikes',
    dur: 6.0, ease: 'easeInOut', fov: [54, 50],
    cam: [V(67, 5.6, 22.5), V(62, 5.1, 12.5)],
    look: [V(62.5, 5.2, 8), V(62, 5.6, 3)],
  },
  {
    label: 'LOCKER ROOM', sub: '506 SF  ·  100 lockers  ·  8 open lockers',
    dur: 4.8, ease: 'easeInOut', fov: [52, 52],
    cam: [V(46.5, 5.7, 24), V(41.5, 5.5, 17)],
    look: [V(41.5, 4.8, 12), V(41.5, 4.4, 3.5)],
  },
  {
    label: 'SHOWERS', sub: '190 SF  ·  toilets 177 SF',
    dur: 4.2, ease: 'easeInOut', fov: [54, 54],
    cam: [V(28, 5.7, 13.5), V(22.5, 5.5, 11.5)],
    look: [V(21, 4.6, 6), V(18, 4.4, 4.5)],
  },
  {
    label: 'SAUNA', sub: 'cedar-lined  ·  dry heat',
    dur: 4.0, ease: 'easeInOut', fov: [50, 50],
    cam: [V(12.5, 5.4, 31), V(8.2, 5.2, 27.6)],
    look: [V(8, 4.4, 24), V(7.6, 4.0, 20.5)],
  },
  {
    label: 'POOL', sub: '1,886 SF  ·  four lanes',
    dur: 8.0, ease: 'easeInOut', fov: [58, 50],
    cam: [V(18, 11.5, 33), V(18, 6.8, 62)],
    look: [V(18, 2.0, 52), V(18, 0.6, 94)],
  },
  {
    label: 'POOL DECK', sub: 'loungers  ·  rinse shower',
    dur: 4.4, ease: 'easeInOut', fov: [54, 54],
    cam: [V(31.5, 5.6, 92), V(31.5, 5.6, 54)],
    look: [V(20, 1.2, 86), V(16, 1.0, 46)],
  },
  {
    label: 'WORKOUT AREA', sub: '1,458 SF  ·  cardio + selectorized',
    dur: 5.6, ease: 'easeInOut', fov: [54, 52],
    cam: [V(39.5, 6.2, 41), V(46, 5.8, 62)],
    look: [V(52, 4.4, 44), V(66, 4.2, 52)],
  },
  {
    label: 'FREE WEIGHTS', sub: '865 SF  ·  racks, benches, dumbbells',
    dur: 5.6, ease: 'easeInOut', fov: [54, 52],
    cam: [V(92.6, 6.1, 39), V(92.6, 5.6, 68)],
    look: [V(85, 4.4, 48), V(96.5, 3.6, 77)],
  },
  {
    label: 'GROUP EXERCISE', sub: '2,040 SF  ·  open room',
    dur: 5.8, ease: 'easeInOut', fov: [56, 52],
    cam: [V(94, 6.4, 80), V(58, 6.0, 85)],
    look: [V(76, 4.2, 94), V(43, 4.0, 95)],
  },
  {
    label: 'THE GYM  ·  LAKEWOOD, NJ', sub: '~10,000 SF  ·  Proposed Floor Plan, Option 2',
    dur: 9.0, ease: 'easeInOut', fov: [52, 34], reveal: true,
    cam: [V(62, 6.2, 88), V(118, 208, 178)],
    look: [V(56, 2.0, 70), V(49, 0, 53)],
  },
];

export const TOTAL = SHOTS.reduce((a, s) => a + s.dur, 0);

const _p = new THREE.Vector3(), _l = new THREE.Vector3();

export function sample(t) {
  t = Math.max(0, Math.min(TOTAL - 0.0001, t));
  let acc = 0, shot = SHOTS[0], local = 0, index = 0;
  for (let i = 0; i < SHOTS.length; i++) {
    if (t < acc + SHOTS[i].dur) { shot = SHOTS[i]; local = (t - acc) / SHOTS[i].dur; index = i; break; }
    acc += SHOTS[i].dur;
  }
  const e = (EASE[shot.ease] || easeInOut)(local);
  _p.copy(shot.cam[0]).lerp(shot.cam[1], e);
  _l.copy(shot.look[0]).lerp(shot.look[1], e);
  const fov = shot.fov[0] + (shot.fov[1] - shot.fov[0]) * e;

  // subtle handheld float so the move never feels like a CAD turntable
  const sway = shot.reveal ? 0.25 : 1;
  _p.x += Math.sin(t * 1.7) * 0.035 * sway;
  _p.y += Math.sin(t * 2.3 + 1.1) * 0.045 * sway;
  _p.z += Math.cos(t * 1.3 + 0.4) * 0.035 * sway;

  // caption fade: in over 0.45s, out over the last 0.55s of the shot
  const sec = local * shot.dur;
  let alpha = Math.min(1, Math.max(0, (sec - 0.25) / 0.45));
  alpha = Math.min(alpha, Math.max(0, (shot.dur - sec) / 0.55));

  // ceiling dissolve + plan labels during the final pull-out
  let ceilAlpha = 1, labelAlpha = 0;
  if (shot.reveal) {
    ceilAlpha = 1 - Math.min(1, Math.max(0, (local - 0.12) / 0.26));
    labelAlpha = Math.min(1, Math.max(0, (local - 0.55) / 0.22));
  }

  return {
    pos: _p, look: _l, fov, index,
    label: shot.label, sub: shot.sub, alpha, ceilAlpha, labelAlpha,
    progress: t / TOTAL,
  };
}
