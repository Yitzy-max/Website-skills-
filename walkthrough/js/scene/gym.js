// The Gym Lakewood - Proposed Floor Plan, Option 2 (2024.04.28)
// Modelled from the architect's plan. Units are feet, origin at the NW corner,
// +X runs east, +Z runs south, +Y is up.
import * as THREE from '../lib/three.module.js';
import * as P from './props.js';
import { MAT, box, boxC, cyl, sph, emissive } from './props.js';
import * as T from './textures.js';

export const B = { W: 100, D: 104, H: 12, POOL_H: 17 };

// Room boxes: [x0, z0, x1, z1] with the square footage printed on the plan.
export const ROOMS = {
  toilets:   { r: [2, 2, 16, 16],     name: 'RESTROOMS',            sf: 177 },
  showers:   { r: [16, 2, 30, 16],    name: 'SHOWERS',              sf: 190 },
  sauna:     { r: [2, 18, 13, 27],    name: 'SAUNA',                sf: 99 },
  utility:   { r: [13, 18, 30, 28],   name: 'UTILITY ROOM',         sf: 362 },
  lockers:   { r: [33, 2, 50, 26],    name: 'LOCKER ROOM',          sf: 506 },
  spin:      { r: [53, 2, 71, 24],    name: 'SPIN STUDIO',          sf: 250 },
  storage:   { r: [73, 2, 80, 9],     name: 'STORAGE',              sf: 77 },
  office:    { r: [73, 11, 80, 18],   name: 'OFFICE',               sf: 77 },
  juice:     { r: [82, 2, 98, 12],    name: 'JUICE BAR',            sf: 137 },
  seating:   { r: [74, 13, 98, 22],   name: 'SEATING AREA',         sf: 125 },
  reception: { r: [84, 24, 100, 36],  name: 'RECEPTION',            sf: 87 },
  pool:      { r: [2, 32, 34, 102],   name: 'POOL',                 sf: 1886 },
  workout:   { r: [38, 36, 72, 74],   name: 'WORKOUT AREA',         sf: 1458 },
  weights:   { r: [82, 38, 98, 78],   name: 'FREE WEIGHTS',         sf: 865 },
  group:     { r: [36, 78, 98, 102],  name: 'GROUP EXERCISE',       sf: 2040 },
};

const cx = (k) => (ROOMS[k].r[0] + ROOMS[k].r[2]) / 2;
const cz = (k) => (ROOMS[k].r[1] + ROOMS[k].r[3]) / 2;
export const center = (k) => new THREE.Vector3(cx(k), 0, cz(k));

const WALL = new THREE.MeshStandardMaterial({ map: T.plasterWall([3, 1]), color: 0xeceae5, roughness: 0.92 });
const WALL_DARK = new THREE.MeshStandardMaterial({ map: T.plasterWall([3, 1], '#3a3d42'), color: 0x3a3d42, roughness: 0.85 });
const WALL_SLAT = new THREE.MeshStandardMaterial({ map: T.woodSlat([8, 1]), color: 0xd2a06a, roughness: 0.7 });
const CEIL = new THREE.MeshStandardMaterial({ color: 0xf4f3f0, roughness: 0.95, side: THREE.DoubleSide, transparent: true });
const CEIL_DARK = new THREE.MeshStandardMaterial({ color: 0x1b1d20, roughness: 0.9, side: THREE.DoubleSide, transparent: true });

export function buildGym() {
  const root = new THREE.Group();
  const ceilings = new THREE.Group();
  const labels = new THREE.Group();
  root.add(ceilings, labels);

  const add = (o) => { root.add(o); return o; };
  const at = (o, x, z, ry = 0) => { o.position.x = x; o.position.z = z; o.rotation.y = ry; return o; };

  // ---------------------------------------------------------------- shell ---
  // The pool is a void in the slab, so every floor plate is cut around it
  // rather than drawn as one sheet.
  const POOL = { x0: 6, z0: 40, x1: 30, z1: 96, depth: 5.5 };

  const groundMat = new THREE.MeshStandardMaterial({ color: 0x2c2e31, roughness: 0.96 });
  const groundPlate = (x0, z0, x1, z1) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), groundMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set((x0 + x1) / 2, -0.02, (z0 + z1) / 2);
    m.receiveShadow = true;
    return add(m);
  };
  groundPlate(-320, -320, POOL.x0, 320);
  groundPlate(POOL.x1, -320, 320, 320);
  groundPlate(POOL.x0, -320, POOL.x1, POOL.z0);
  groundPlate(POOL.x0, POOL.z1, POOL.x1, 320);

  // parking stripes east of the entry
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0x6d6a62, roughness: 0.95 });
  for (let i = 0; i < 9; i++) add(box(18, 0.03, 0.5, stripeMat, B.W + 34, 0, 14 + i * 10));

  // Floor finishes per zone
  const floor = (x0, z0, x1, z1, mat, y = 0.06) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
    m.receiveShadow = true;
    return add(m);
  };
  const F = {
    poured: new THREE.MeshStandardMaterial({ map: T.concreteFloor([10, 10]), color: 0x8e8f92, roughness: 0.55, metalness: 0.08 }),
    rubber: new THREE.MeshStandardMaterial({ map: T.rubberFloor([12, 12]), color: 0xffffff, roughness: 0.88 }),
    wood: new THREE.MeshStandardMaterial({ map: T.woodFloor([9, 5]), color: 0xffffff, roughness: 0.42, metalness: 0.02 }),
    tile: new THREE.MeshStandardMaterial({ map: T.tileFloor([8, 8]), color: 0xe6e2da, roughness: 0.32, metalness: 0.04, envMapIntensity: 0.7 }),
    wetTile: new THREE.MeshStandardMaterial({ map: T.tileFloor([10, 22], '#cfd8d6', '#9aa8a5'), color: 0xc9d2d2, roughness: 0.3, metalness: 0.04, envMapIntensity: 0.6 }),
    lobby: new THREE.MeshStandardMaterial({ map: T.concreteFloor([6, 6]), color: 0xa9a49b, roughness: 0.25, metalness: 0.1 }),
  };
  floor(0, 0, 34, 30, F.poured, 0.02);             // north-west block base
  floor(34, 0, B.W, B.D, F.poured, 0.02);          // everything east of the pool hall
  floor(2, 2, 30, 30, F.tile);                     // wet block
  floor(33, 2, 50, 26, F.tile);                    // locker room
  floor(53, 2, 71, 24, F.rubber);                  // spin
  floor(74, 0, 100, 36, F.lobby);                  // lobby / juice / reception
  floor(38, 34, 74, 76, F.rubber);                 // workout
  floor(80, 36, 98, 80, F.rubber);                 // free weights
  floor(36, 76, 98, 102, F.wood);                  // group exercise
  // pool deck: four plates around the water so the basin stays open
  floor(0, 30, 34, POOL.z0, F.wetTile);
  floor(0, POOL.z1, 34, B.D, F.wetTile);
  floor(0, POOL.z0, POOL.x0, POOL.z1, F.wetTile);
  floor(POOL.x1, POOL.z0, 34, POOL.z1, F.wetTile);

  // Exterior envelope
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x33363a, roughness: 0.65, metalness: 0.12 });
  const ext = (x0, z0, x1, z1, h, mat = shellMat) => {
    const w = Math.max(x1 - x0, 0.6), d = Math.max(z1 - z0, 0.6);
    return add(box(w, h, d, mat, (x0 + x1) / 2, 0, (z0 + z1) / 2));
  };
  ext(-0.8, -0.8, B.W + 0.8, 0, B.H + 2.5);                    // north
  ext(-0.8, B.D, 35, B.D + 0.8, B.POOL_H + 3);                 // south, pool wing
  ext(35, B.D, B.W + 0.8, B.D + 0.8, B.H + 2.5);               // south, main block
  ext(-0.8, 0, 0, 30, B.H + 2.5);                              // west, main block
  ext(-0.8, 30, 0, B.D + 0.8, B.POOL_H + 3);                   // west, pool wing
  ext(B.W, 0, B.W + 0.8, 24, B.H + 2.5);                       // east above entry
  ext(B.W, 36, B.W + 0.8, B.D, B.H + 2.5);                     // east below entry
  // Entry storefront: glass + slat canopy
  const storefront = new THREE.Mesh(new THREE.BoxGeometry(0.4, 11, 12), MAT.glass);
  storefront.position.set(B.W + 0.2, 5.5, 30);
  add(storefront);
  for (const z of [24.2, 30.0, 35.8]) ext(B.W - 0.05, z - 0.12, B.W + 0.35, z + 0.12, 11, MAT.metalDark);
  ext(-1.4, 29.4, 35.6, 30.6, B.POOL_H + 3.6);                 // pool wing parapet
  const canopy = box(14, 0.8, 22, WALL_SLAT, B.W + 6, 12, 30); add(canopy);
  for (const z of [21, 39]) add(cyl(0.35, 12, MAT.metalDark, B.W + 11.5, 6, z));
  const extSign = new THREE.Mesh(new THREE.PlaneGeometry(17, 4.3),
    new THREE.MeshBasicMaterial({ map: T.textPlate('THE GYM', { color: '#ffffff', glow: 34, letter: 20 }), transparent: true }));
  extSign.position.set(B.W + 0.55, 8.2, 14);
  extSign.rotation.y = Math.PI / 2;
  add(extSign);

  // Interior partitions ------------------------------------------------------
  const wall = (x0, z0, x1, z1, h = B.H, mat = WALL, t = 0.55) => {
    const horiz = Math.abs(x1 - x0) > Math.abs(z1 - z0);
    const w = horiz ? Math.abs(x1 - x0) : t;
    const d = horiz ? t : Math.abs(z1 - z0);
    // +0.4 so partitions poke through the ceiling plane and leave no seam
    return add(box(w, h + (h >= B.H ? 0.4 : 0), d, mat, (x0 + x1) / 2, 0, (z0 + z1) / 2));
  };
  // north service block
  wall(2, 16, 30, 16);                 // toilets/showers south wall
  wall(16, 2, 16, 13);                 // between toilets + showers
  wall(2, 18, 13, 18, B.H, WALL_SLAT); // sauna front
  wall(13, 18, 13, 28);
  wall(13, 28, 30, 28);
  wall(30, 2, 30, 28);                 // wet block east wall
  // locker room
  wall(33, 2, 33, 26); wall(50, 2, 50, 26); wall(33, 26, 44, 26);
  // spin studio (glass front to the walkway)
  wall(53, 2, 53, 24, B.H, WALL_DARK); wall(71, 2, 71, 24, B.H, WALL_DARK);
  wall(53, 24, 62, 24, B.H, WALL_DARK);
  const spinGlass = new THREE.Mesh(new THREE.BoxGeometry(9, B.H - 1, 0.3), MAT.glass);
  spinGlass.position.set(66.5, (B.H - 1) / 2, 24); add(spinGlass);
  // storage + office
  wall(73, 2, 73, 18); wall(80, 2, 80, 18); wall(73, 9, 80, 9); wall(73, 18, 80, 18);
  wall(73, 11, 80, 11);
  // lobby back wall + reception feature wall
  wall(74, 22, 82, 22);
  wall(82, 22, 82, 38, B.H, WALL_SLAT);
  // free weights / walkway divider (half-height so the space reads open)
  wall(80.5, 38, 80.5, 58, 4.2, WALL_DARK, 0.9);
  // pool hall separation
  wall(34, 29.8, 34, 103, B.POOL_H + 2, WALL);
  wall(2, 30, 34.3, 30, B.POOL_H + 2, WALL);
  // group exercise north wall (mirrored on the studio side)
  wall(36, 76, 98, 76, B.H, WALL_DARK);

  // Ceilings -----------------------------------------------------------------
  const ceil = (x0, z0, x1, z1, y, mat = CEIL) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat.clone());
    m.rotation.x = Math.PI / 2;
    m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
    ceilings.add(m);
    return m;
  };
  ceil(-1, -1, B.W + 1, 31, B.H);
  ceil(33, 29, B.W + 1, B.D + 1, B.H);
  ceil(-1, 28.5, 35, B.D + 1, B.POOL_H);
  ceil(53, 2, 71, 24, B.H - 0.05, CEIL_DARK);     // spin studio black ceiling
  ceil(74, 0, B.W, 24, B.H - 0.05, CEIL_DARK);    // lobby dark ceiling
  ceil(36, 76, 98, 102, B.H - 0.05, CEIL_DARK);   // studio

  // Linear LED coves ---------------------------------------------------------
  const strip = (x, z, len, horiz, color = 0xfff2dd, inten = 2.2, y = B.H - 0.25) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(horiz ? len : 0.42, 0.14, horiz ? 0.42 : len),
      emissive(color, inten));
    m.position.set(x, y, z);
    ceilings.add(m);
    return m;
  };
  for (let i = 0; i < 6; i++) strip(4 + i * 5, 9, 26, false);            // wet block
  for (let i = 0; i < 4; i++) strip(35.5 + i * 4.5, 14, 22, false);      // lockers
  for (let i = 0; i < 5; i++) strip(56 + i * 3.5, 13, 20, false, 0xff4f9a, 3.4, B.H - 0.35); // spin neon
  for (let i = 0; i < 5; i++) strip(76 + i * 5.5, 11, 20, false, 0xffe6c2, 2.6, B.H - 0.4);  // lobby
  for (let i = 0; i < 8; i++) strip(40 + i * 4.3, 55, 38, false);        // workout
  for (let i = 0; i < 4; i++) strip(82 + i * 4.5, 58, 40, false);        // weights
  for (let i = 0; i < 9; i++) strip(39 + i * 7, 89, 24, false, 0xfff0d8, 2.4); // studio
  for (let i = 0; i < 5; i++) strip(18, 40 + i * 14, 30, true, 0xdff3ff, 2.4, B.POOL_H - 0.4); // pool

  // ------------------------------------------------------------- restrooms --
  for (let i = 0; i < 3; i++) add(at(P.toiletStall(), 4.5 + i * 3.8, 5.5));
  add(at(P.vanity(9), 10, 14.2, Math.PI));
  // showers
  for (let i = 0; i < 3; i++) add(at(P.showerStall(4.2, 4.6), 19.5 + i * 4.4, 5.0));
  add(at(P.woodBench(7), 23, 13.5));
  add(at(P.towelCubby(5, 6.5), 29.2, 11, -Math.PI / 2));

  // ----------------------------------------------------------------- sauna --
  add(at(P.sauna(10.6, 8.6, 8.2), 7.6, 23.2));

  // ----------------------------------------------------------- locker room --
  // 100 lockers: 4 banks of 2 tiers
  add(at(P.lockerBank(9, 2), 41.5, 3.4));
  add(at(P.lockerBank(9, 2), 41.5, 24.5, Math.PI));
  add(at(P.lockerBank(7, 2), 34.4, 14, Math.PI / 2));
  add(at(P.lockerBank(7, 2), 48.6, 14, -Math.PI / 2));
  add(at(P.woodBench(9), 41.5, 9.5));
  add(at(P.woodBench(9), 41.5, 19));
  add(at(P.plant(1.1), 46.5, 6.5));

  // ---------------------------------------------------------- spin studio ---
  const spinAccents = [0xff2d78, 0x18c9ff, 0xff2d78, 0x18c9ff];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const b = P.spinBike(spinAccents[r]);
      at(b, 56.5 + c * 3.4, 10 + r * 3.6);
      b.rotation.y = Math.PI;
      add(b);
    }
  }
  const podium = box(6, 1.1, 4, MAT.metalDark, 62, 0, 5.2); add(podium);
  const coachBike = P.spinBike(0xffffff); at(coachBike, 62, 5.2); coachBike.position.y = 1.1;
  coachBike.rotation.y = 0; add(coachBike);
  // "RIDE" neon on the front wall
  const ride = new THREE.Mesh(new THREE.PlaneGeometry(13, 3.3),
    new THREE.MeshBasicMaterial({ map: T.textPlate('RIDE', { color: '#ff3d86', glow: 46, letter: 26 }), transparent: true }));
  ride.position.set(62, 6.4, 2.45); add(ride);
  for (let i = 0; i < 4; i++) {
    const arc = new THREE.Mesh(new THREE.BoxGeometry(17, 0.22, 0.22), emissive(i % 2 ? 0x18c9ff : 0xff2d78, 4.0));
    arc.position.set(62, 9.9 - i * 0.62, 2.6 + i * 0.4); add(arc);
  }
  const spinLight = new THREE.PointLight(0xff3d86, 150, 44, 2);
  spinLight.position.set(62, 8.5, 9); add(spinLight);
  const spinLight2 = new THREE.PointLight(0x18c9ff, 110, 38, 2);
  spinLight2.position.set(62, 8.5, 20); add(spinLight2);

  // ----------------------------------------------------- office / storage ---
  add(at(box(5.5, 2.5, 2.4, MAT.woodDark, 0, 0, 0), 76.5, 15));
  add(at(P.chair(), 76.5, 16.8, Math.PI));
  add(at(P.wallScreen(4, 2.4), 76.5, 11.4));
  ceilings.add(new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 0.3), emissive(0xffeccf, 1.8)).translateX(76.5).translateY(B.H - 0.3).translateZ(15));
  for (let i = 0; i < 3; i++) add(at(box(6, 2, 2, MAT.metalMid, 0, i * 2.1, 0), 76.5, 5.5));

  // ------------------------------------------------- juice bar / seating ----
  add(at(P.backBar(15, 8.5), 90, 2.9));
  add(at(P.barCounter(15), 90, 7.4));
  for (let i = 0; i < 5; i++) add(at(P.barStool(), 84 + i * 3, 10.4));
  add(at(box(3, 3.2, 2.2, MAT.metalDark, 0, 0, 0), 97, 8));        // prep counter w/ sink
  add(at(P.vendingMachine(), 97, 15, -Math.PI / 2));
  for (let i = 0; i < 4; i++) {
    const tx = 76.5 + (i % 2) * 6.5, tz = 15.5 + Math.floor(i / 2) * 5.5;
    add(at(P.cafeTable(1.5), tx, tz));
    add(at(P.chair(), tx - 2.4, tz, Math.PI / 2));
    add(at(P.chair(), tx + 2.4, tz, -Math.PI / 2));
  }
  for (let i = 0; i < 4; i++) {
    const p = P.pendant(0xffd9a8);
    p.position.set(84 + i * 4, B.H - 0.2, 7.4);
    add(p);
  }
  add(at(P.plant(1.3), 73.5, 21));

  // ------------------------------------------------------------ reception ---
  add(at(P.receptionDesk(13), 89, 29, -Math.PI / 2));
  const logo = P.logoWall('THE GYM', 13, 9.5);
  at(logo, 82.6, 29, Math.PI / 2); add(logo);
  add(at(P.towelCubby(6, 7), 84.5, 36.5, Math.PI));
  const towelSign = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.25),
    new THREE.MeshBasicMaterial({ map: T.textPlate('TOWELS', { color: '#e9dfcd', letter: 12, font: '500 92px Inter, Arial, sans-serif' }), transparent: true }));
  towelSign.position.set(84.5, 8.4, 36.2); towelSign.rotation.y = Math.PI; add(towelSign);
  add(at(P.plant(1.35, 0.42), 96.5, 23.5));
  add(at(P.plant(1.15, 0.68), 96.5, 35.0));
  const recLight = new THREE.PointLight(0xffe0b8, 150, 52, 2);
  recLight.position.set(89, 9, 26); add(recLight);

  // ----------------------------------------------------------------- pool ---
  const basin = new THREE.Group();
  // pool shell (sunk below the deck)
  const bw = POOL.x1 - POOL.x0, bd = POOL.z1 - POOL.z0;
  const poolMat = new THREE.MeshStandardMaterial({
    map: T.poolTile([bw / 5, bd / 5]), color: 0x4d87a2, roughness: 0.5,
    metalness: 0.0, envMapIntensity: 0.25,
  });
  const bottom = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), poolMat);
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.set((POOL.x0 + POOL.x1) / 2, -POOL.depth, (POOL.z0 + POOL.z1) / 2);
  bottom.receiveShadow = true; basin.add(bottom);
  const sideMat = new THREE.MeshStandardMaterial({
    map: T.poolTile([6, 2]), color: 0x5993ad, roughness: 0.45, envMapIntensity: 0.25,
  });
  basin.add(boxC(bw, POOL.depth, 0.4, sideMat, (POOL.x0 + POOL.x1) / 2, -POOL.depth / 2, POOL.z0));
  basin.add(boxC(bw, POOL.depth, 0.4, sideMat, (POOL.x0 + POOL.x1) / 2, -POOL.depth / 2, POOL.z1));
  basin.add(boxC(0.4, POOL.depth, bd, sideMat, POOL.x0, -POOL.depth / 2, (POOL.z0 + POOL.z1) / 2));
  basin.add(boxC(0.4, POOL.depth, bd, sideMat, POOL.x1, -POOL.depth / 2, (POOL.z0 + POOL.z1) / 2));
  // coping
  const cope = new THREE.MeshStandardMaterial({ color: 0xd9d4c8, roughness: 0.5 });
  basin.add(box(bw + 2.4, 0.18, 1.2, cope, (POOL.x0 + POOL.x1) / 2, 0.02, POOL.z0 - 0.6));
  basin.add(box(bw + 2.4, 0.18, 1.2, cope, (POOL.x0 + POOL.x1) / 2, 0.02, POOL.z1 + 0.6));
  basin.add(box(1.2, 0.18, bd + 2.4, cope, POOL.x0 - 0.6, 0.02, (POOL.z0 + POOL.z1) / 2));
  basin.add(box(1.2, 0.18, bd + 2.4, cope, POOL.x1 + 0.6, 0.02, (POOL.z0 + POOL.z1) / 2));
  add(basin);

  // water surface (animated in app.js)
  const waterGeo = new THREE.PlaneGeometry(bw - 0.3, bd - 0.3, 30, 64);
  const water = new THREE.Mesh(waterGeo, new THREE.MeshStandardMaterial({
    color: 0x12678b, roughness: 0.34, metalness: 0.45, transparent: true, opacity: 0.82,
    emissive: 0x05303f, emissiveIntensity: 0.4, envMapIntensity: 0.85, side: THREE.DoubleSide,
  }));
  water.rotation.x = -Math.PI / 2;
  water.position.set((POOL.x0 + POOL.x1) / 2, -0.55, (POOL.z0 + POOL.z1) / 2);
  water.name = 'water';
  add(water);
  const underGlow = new THREE.PointLight(0x7ce0ff, 14, 44, 2);
  underGlow.position.set(18, -3.4, 58); add(underGlow);
  const hallLight = new THREE.PointLight(0xe6f4ff, 110, 62, 2);
  hallLight.position.set(32, 13, 46); add(hallLight);
  const hallLight2 = new THREE.PointLight(0xe6f4ff, 110, 62, 2);
  hallLight2.position.set(32, 13, 90); add(hallLight2);

  // lane markers on the bottom
  for (let i = 1; i < 4; i++) {
    const lane = box(0.55, 0.05, bd - 3, new THREE.MeshStandardMaterial({ color: 0x143247, roughness: 0.6 }),
      POOL.x0 + (bw / 4) * i, -POOL.depth + 0.02, (POOL.z0 + POOL.z1) / 2);
    add(lane);
  }
  const ropeA = new THREE.MeshStandardMaterial({ color: 0xe8ecef, roughness: 0.7 });
  const ropeB = new THREE.MeshStandardMaterial({ color: 0x2a5f9e, roughness: 0.7 });
  for (let l = 1; l < 4; l++) {
    const x = POOL.x0 + (bw / 4) * l;
    for (let k = 0; k < 36; k++) {
      const z = POOL.z0 + 1.2 + k * ((bd - 2.4) / 35);
      const disc = cyl(0.26, 0.5, k % 2 ? ropeA : ropeB, x, -0.42, z, 'z');
      add(disc);
    }
  }
  add(at(P.poolLadder(), 28.4, 46));
  add(at(P.poolLadder(), 28.4, 88));
  for (let i = 0; i < 4; i++) add(at(P.lounger(), 9 + i * 6.4, 36, Math.PI));
  add(at(P.towelStack(6), 32.2, 43));
  add(at(P.plant(1.5, 0.21), 32, 98));
  add(at(P.plant(1.3, 0.77), 32.2, 50));
  add(at(P.showerStall(3.6, 3.6), 5.0, 100.0, Math.PI));
  // frosted clerestory on the west wall of the pool hall
  const dayGlass = new THREE.MeshBasicMaterial({ color: 0xdcecf7, transparent: true, opacity: 0.94 });
  for (let i = 0; i < 6; i++) {
    const g = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 8), dayGlass);
    g.position.set(0.35, 10.5, 36 + i * 11); add(g);
    add(box(0.5, 5.6, 0.4, MAT.metalDark, 0.4, 7.7, 32 + i * 11));
  }
  add(box(0.5, 5.6, 0.4, MAT.metalDark, 0.4, 7.7, 98));

  // -------------------------------------------------------- workout area ---
  for (let i = 0; i < 6; i++) add(at(P.treadmill(), 41 + i * 5.2, 40));
  for (let i = 0; i < 4; i++) add(at(P.elliptical(), 42 + i * 5.6, 50));
  for (let i = 0; i < 4; i++) add(at(P.gymBike(), 42 + i * 5.6, 58));
  for (let i = 0; i < 3; i++) add(at(P.rower(), 66, 44 + i * 6, Math.PI / 2));
  for (let i = 0; i < 4; i++) add(at(P.weightStackMachine(), 42 + i * 7, 68, Math.PI));
  add(at(P.cableTower(), 62, 70, Math.PI));
  add(at(P.plateTree(), 70, 66));
  add(at(P.wallScreen(7, 4), 55, 36.4));
  add(at(P.wallScreen(7, 4), 45, 36.4));
  add(at(P.plant(1.2), 37.5, 72));

  // -------------------------------------------------------- free weights ---
  add(at(P.dumbbellRack(9), 89, 39.5, 0));
  add(at(P.dumbbellRack(11), 96.4, 57, -Math.PI / 2));
  for (let i = 0; i < 3; i++) add(at(P.squatRack(), 84.0, 46 + i * 9, Math.PI / 2));
  for (let i = 0; i < 3; i++) add(at(P.flatBench(i === 1 ? 0.35 : 0), 88.5, 45 + i * 9, Math.PI / 2));
  for (let i = 0; i < 6; i++) add(at(P.kettlebell(0.34 + i * 0.035), 95.5, 71 + i * 1.15));
  add(at(P.plateTree(), 84.5, 73));
  add(at(P.plateTree(), 96, 43));
  add(at(P.matRoll(0x39434d), 82.5, 66, Math.PI / 2));
  const mw = P.mirrorWall(36, 7.5);
  at(mw, 98.6, 58, -Math.PI / 2); add(mw);
  const fwSign = new THREE.Mesh(new THREE.PlaneGeometry(11, 2.4),
    new THREE.MeshBasicMaterial({ map: T.textPlate('FREE WEIGHTS', { color: '#f0e9db', letter: 10, font: '600 86px Inter, Arial, sans-serif' }), transparent: true }));
  fwSign.position.set(81.3, 8.6, 50); fwSign.rotation.y = Math.PI / 2; add(fwSign);

  // ------------------------------------------------------ group exercise ---
  const gmw = P.mirrorWall(58, 7.5);
  at(gmw, 67, 101.9, Math.PI); add(gmw);
  add(at(P.balletBarre(24), 55, 101.6, Math.PI));
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.09, 5.6),
        new THREE.MeshStandardMaterial({ color: [0x3f5d78, 0x6b4f6b, 0x3d6b5a][j], roughness: 0.85 }));
      m.position.set(48 + i * 5.5, 0.08, 84 + j * 6.5);
      m.receiveShadow = true; add(m);
    }
  }
  for (let i = 0; i < 4; i++) add(at(P.stabilityBall([0x3f7fb5, 0x8d5aa8, 0x55a06a, 0xc06a4a][i], 1.05), 90 + (i % 2) * 3.4, 82 + Math.floor(i / 2) * 3.4));
  add(at(P.dumbbellRack(7), 84, 79.5));
  for (let i = 0; i < 3; i++) {
    const step = box(3.4, 0.55, 1.5, MAT.plastic, 40 + i * 4.2, 0.06, 96);
    add(step);
    add(box(3.0, 0.45, 1.3, MAT.metalDark, 40 + i * 4.2, 0.61, 96));
  }
  for (let i = 0; i < 6; i++) add(at(P.kettlebell(0.3 + i * 0.03), 92 + (i % 3) * 1.4, 95 + Math.floor(i / 3) * 1.6));
  add(at(P.wallScreen(8, 4.6), 52, 76.6));
  for (let i = 0; i < 4; i++) add(at(P.matRoll([0x39434d, 0x4d3a45, 0x35483f, 0x4a4436][i]), 38.5, 80 + i * 2.6, Math.PI / 2));
  add(at(P.plant(1.6, 0.33), 94, 97.5));
  const studioSign = new THREE.Mesh(new THREE.PlaneGeometry(14, 3),
    new THREE.MeshBasicMaterial({ map: T.textPlate('STUDIO', { color: '#f3ead8', letter: 18, font: '300 96px Inter, Arial, sans-serif' }), transparent: true }));
  studioSign.position.set(67, 9.2, 76.3); add(studioSign);

  // --------------------------------------------------------- walkway trim ---
  for (let i = 0; i < 4; i++) add(at(P.plant(0.85 + (i % 2) * 0.2, 0.13 * (i + 1)), 76.5, 33 + i * 12));
  const wayMat = new THREE.MeshStandardMaterial({ color: 0x8b7a5e, roughness: 0.5, metalness: 0.15 });
  add(box(0.5, 0.04, 44, wayMat, 74.5, 0.05, 56));
  add(box(0.5, 0.04, 44, wayMat, 79.5, 0.05, 56));

  // -------------------------------------------------------- floating tags ---
  // Staggered heights keep the labels from colliding in the dense north strip.
  const TAG_Y = {
    toilets: 44, showers: 38, sauna: 32, utility: 26, lockers: 44, spin: 32,
    storage: 44, office: 38, juice: 32, seating: 26, reception: 38,
    pool: 30, workout: 24, weights: 30, group: 22,
  };
  for (const [key, def] of Object.entries(ROOMS)) {
    const [x0, z0, x1, z1] = def.r;
    const tex = T.textPlate(`${def.name}   ·   ${def.sf.toLocaleString()} SF`, {
      w: 1400, h: 150, color: '#ffffff', letter: 9, glow: 16,
      font: '600 78px Inter, Arial, sans-serif',
    });
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, opacity: 0 }));
    sp.position.set((x0 + x1) / 2, TAG_Y[key] || 22, (z0 + z1) / 2);
    sp.scale.set(34, 3.65, 1);
    labels.add(sp);
  }

  return { root, ceilings, labels, water, POOL };
}

// ------------------------------------------------------------------ lights ---
export function buildLights(scene) {
  const hemi = new THREE.HemisphereLight(0xe2eefa, 0x5b554c, 1.55);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff0dc, 2.6);
  sun.position.set(180, 150, -60);
  sun.target.position.set(B.W / 2, 0, B.D / 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const c = sun.shadow.camera;
  c.left = -130; c.right = 130; c.top = 130; c.bottom = -130; c.near = 1; c.far = 480;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.05;
  scene.add(sun, sun.target);

  const fill = new THREE.DirectionalLight(0xbdd6ef, 0.85);
  fill.position.set(-120, 90, 160);
  scene.add(fill);

  // One warm accent in the lobby; every other room is carried by the emissive
  // LED coves, the hemisphere light and image-based lighting. Keeping the
  // punctual-light count low is what makes the offline render tractable.
  const juice = new THREE.PointLight(0xffd7a6, 150, 46, 2);
  juice.position.set(90, 8.6, 9);
  scene.add(juice);
  return { sun, hemi };
}
