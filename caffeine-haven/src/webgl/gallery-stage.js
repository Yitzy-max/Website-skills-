import * as THREE from 'three';

/**
 * A pinned, scroll-scrubbed Three.js "stage" that crossfades between the
 * gallery images with an organic grain-dissolve wipe instead of a flat
 * opacity blend. Kept deliberately simple: one full-screen quad, one shader,
 * no post-processing chain — refinement over spectacle.
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
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform float uProgress; // 0..1 across this single transition
  uniform vec2 uFromScale; // cover-fit scale per texture
  uniform vec2 uToScale;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  vec2 coverUv(vec2 uv, vec2 scale) {
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uvFrom = coverUv(vUv, uFromScale);
    vec2 uvTo = coverUv(vUv, uToScale);

    float n = hash(floor(vUv * 140.0));
    float edge = 0.12;
    float threshold = smoothstep(uProgress - edge, uProgress + edge, n * 0.85 + vUv.y * 0.15);

    vec3 colFrom = texture2D(uFrom, uvFrom - vec2(0.0, uProgress * 0.015)).rgb;
    vec3 colTo = texture2D(uTo, uvTo + vec2(0.0, (1.0 - uProgress) * 0.015)).rgb;

    vec3 color = mix(colFrom, colTo, threshold);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createGalleryStage({ canvas, captionIndexEl, captionLabelEl, labels, images }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const loader = new THREE.TextureLoader();
  const textures = images.map((src) => {
    const tex = loader.load(src);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  });

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uFrom: { value: textures[0] },
      uTo: { value: textures[1] || textures[0] },
      uProgress: { value: 0 },
      uFromScale: { value: new THREE.Vector2(1, 1) },
      uToScale: { value: new THREE.Vector2(1, 1) },
    },
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  function coverScale(tex) {
    const img = tex.image;
    if (!img || !img.width) return new THREE.Vector2(1, 1);
    const canvasAspect = canvas.clientWidth / canvas.clientHeight;
    const imgAspect = img.width / img.height;
    if (imgAspect > canvasAspect) {
      return new THREE.Vector2(imgAspect / canvasAspect, 1);
    }
    return new THREE.Vector2(1, canvasAspect / imgAspect);
  }

  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    render();
  }

  let currentLabelIndex = -1;

  function render() {
    renderer.render(scene, camera);
  }

  /** progress: continuous 0..(count-1) across the whole pinned scroll range */
  function setProgress(progress) {
    const count = textures.length;
    const clamped = Math.max(0, Math.min(count - 1, progress));
    const idx = Math.floor(clamped);
    const nextIdx = Math.min(count - 1, idx + 1);
    const frac = clamped - idx;

    const fromTex = textures[idx];
    const toTex = textures[nextIdx];

    if (fromTex.image && fromTex.image.complete !== false) {
      material.uniforms.uFrom.value = fromTex;
      material.uniforms.uFromScale.value = coverScale(fromTex);
    }
    if (toTex.image) {
      material.uniforms.uTo.value = toTex;
      material.uniforms.uToScale.value = coverScale(toTex);
    }
    material.uniforms.uProgress.value = frac;

    const labelIndex = frac > 0.5 ? nextIdx : idx;
    if (labelIndex !== currentLabelIndex) {
      currentLabelIndex = labelIndex;
      if (captionIndexEl) captionIndexEl.textContent = String(labelIndex + 1).padStart(2, '0');
      if (captionLabelEl) captionLabelEl.textContent = labels[labelIndex] || '';
      document.querySelectorAll('[data-thumb]').forEach((el) => {
        el.classList.toggle('is-active', Number(el.dataset.index) === labelIndex);
      });
    }

    render();
  }

  window.addEventListener('resize', resize);
  resize();

  return { setProgress, resize, frameCount: textures.length };
}
