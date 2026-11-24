import React, {useMemo} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';

/**
 * Procedural photoreal-ish eyeball in black & white (Analytics "Mind" reference object).
 * Iris faces +Z at rest; aim it with yaw (+ = screen right) and pitch (+ = up), in radians.
 * Texture is painted per pixel from the true direction on the sphere (no UV distortion), deterministic.
 */
export const Eyeball3D: React.FC<{yaw?: number; pitch?: number; scale?: number; position?: [number, number, number]; pupil?: number}> = ({
  yaw = 0, pitch = 0, scale = 1, position = [0, 0, 0], pupil = 0.16,
}) => {
  const texture = useMemo(() => cached(pupil), [pupil]);
  return (
    <mesh rotation={[-pitch, yaw, 0]} position={position} scale={scale}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhysicalMaterial map={texture} roughness={0.45} clearcoat={1} clearcoatRoughness={0.06} />
    </mesh>
  );
};

const cache = new Map<number, THREE.CanvasTexture>();
const cached = (pupil: number) => {
  if (!cache.has(pupil)) cache.set(pupil, buildEye(pupil));
  return cache.get(pupil)!;
};

const buildEye = (pupilR: number) => {
  const W = 1024;
  const H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  const fibres = Array.from({length: 7}, (_, k) => ({f: 9 + k * 7, ph: random(`iris-ph-${k}`) * 6.28, a: 0.5 / (k + 1.5)}));
  const veins = Array.from({length: 9}, (_, k) => ({az: random(`vein-az-${k}`) * 6.28, w: 0.03 + random(`vein-w-${k}`) * 0.04, f: 5 + random(`vein-f-${k}`) * 6}));
  const irisR = 0.5;
  for (let y = 0; y < H; y++) {
    const theta = (y / H) * Math.PI;
    for (let x = 0; x < W; x++) {
      const phi = (x / W) * Math.PI * 2;
      // three.js SphereGeometry parametrisation
      const vx = -Math.cos(phi) * Math.sin(theta);
      const vy = Math.cos(theta);
      const vz = Math.sin(phi) * Math.sin(theta);
      const a = Math.acos(Math.max(-1, Math.min(1, vz))); // angle from the +Z front
      const az = Math.atan2(vy, vx);
      let c: number;
      if (a < pupilR) {
        c = 10;
      } else if (a < irisR) {
        const r = (a - pupilR) / (irisR - pupilR);
        let n = 0;
        for (const fb of fibres) n += fb.a * Math.sin(az * fb.f + fb.ph + r * 3);
        const collar = Math.exp(-((r - 0.32) ** 2) / 0.006) * 40;
        c = 120 + n * 70 + collar - r * 25 - Math.max(0, r - 0.85) * 500 - Math.max(0, 0.08 - r) * 900;
      } else {
        // sclera with a soft limbal shadow and faint veins toward the back
        c = 236 - Math.exp(-((a - irisR) ** 2) / 0.004) * 70 - Math.max(0, a - 1.6) * 30;
        for (const v of veins) {
          const d = Math.abs(Math.sin((az - v.az) * 0.5 + Math.sin(a * v.f) * 0.05));
          if (a > 0.9) c -= Math.max(0, 1 - d / v.w) * 40 * Math.min(1, (a - 0.9) * 1.5);
        }
      }
      const i = (y * W + x) * 4;
      const g = Math.max(0, Math.min(255, c));
      img.data[i] = g;
      img.data[i + 1] = g;
      img.data[i + 2] = g;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};
