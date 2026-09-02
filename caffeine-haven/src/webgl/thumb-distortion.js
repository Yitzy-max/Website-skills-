import * as THREE from 'three';

/**
 * Subtle WebGL hover distortion for gallery thumbnails: a gentle ripple
 * radiating from the cursor plus a whisper of chromatic aberration.
 * Intentionally restrained — this should read as polish, not a gimmick.
 */
const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform vec2 uMouse;     // 0..1, canvas space
  uniform float uHover;    // eased 0..1
  uniform float uTime;
  uniform vec2 uScale;     // cover-fit scale

  vec2 coverUv(vec2 uv, vec2 scale) {
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    vec2 toMouse = uv - uMouse;
    float dist = length(toMouse);

    float ripple = sin(dist * 22.0 - uTime * 2.2) * 0.5 + 0.5;
    float falloff = smoothstep(0.45, 0.0, dist);
    float amount = uHover * falloff * ripple * 0.018;

    vec2 dir = normalize(toMouse + 1e-5);
    vec2 offset = dir * amount;

    vec2 uvR = coverUv(uv + offset * 1.15, uScale);
    vec2 uvG = coverUv(uv + offset, uScale);
    vec2 uvB = coverUv(uv + offset * 0.85, uScale);

    float r = texture2D(uMap, uvR).r;
    float g = texture2D(uMap, uvG).g;
    float b = texture2D(uMap, uvB).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export function createThumbDistortion(canvas, src) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const texture = new THREE.TextureLoader().load(src, () => resize());
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uMap: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uScale: { value: new THREE.Vector2(1, 1) },
    },
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  let hoverTarget = 0;
  let running = true;

  function coverScale() {
    const img = texture.image;
    if (!img || !img.width) return;
    const canvasAspect = canvas.clientWidth / canvas.clientHeight || 1;
    const imgAspect = img.width / img.height;
    material.uniforms.uScale.value.set(
      imgAspect > canvasAspect ? imgAspect / canvasAspect : 1,
      imgAspect > canvasAspect ? 1 : canvasAspect / imgAspect
    );
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    coverScale();
  }

  function setMouse(x, y) {
    material.uniforms.uMouse.value.set(x, 1 - y);
  }

  function setHover(isHovering) {
    hoverTarget = isHovering ? 1 : 0;
  }

  const clock = new THREE.Clock();
  function tick() {
    if (!running) return;
    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uHover.value += (hoverTarget - material.uniforms.uHover.value) * 0.08;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  tick();

  return {
    setMouse,
    setHover,
    destroy() {
      running = false;
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
