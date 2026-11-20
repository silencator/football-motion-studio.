import React, {useMemo} from 'react';
import * as THREE from 'three';

/**
 * Procedural premium football: pentagon panels painted into a generated texture
 * (no external model, no floating geometry). Pentagons = Voronoi cells of the 12 icosahedron vertices.
 */
export const Football3D: React.FC<{
  rotation?: [number, number, number];
  position?: [number, number, number];
  scale?: number;
  panel?: string;
  base?: string;
}> = ({rotation = [0, 0, 0], position = [0, 0, 0], scale = 1, panel = '#101218', base = '#F2F2F4'}) => {
  const texture = useMemo(() => buildBall(panel, base), [panel, base]);
  return (
    <mesh rotation={rotation} position={position} scale={scale}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhysicalMaterial map={texture} roughness={0.32} clearcoat={1} clearcoatRoughness={0.12} />
    </mesh>
  );
};

const buildBall = (panelHex: string, baseHex: string) => {
  const ico = new THREE.IcosahedronGeometry(1, 0);
  const pos = ico.attributes.position as THREE.BufferAttribute;
  const map = new Map<string, THREE.Vector3>();
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
    map.set(v.toArray().map((n) => n.toFixed(3)).join(','), v);
  }
  ico.dispose();
  const centres = [...map.values()].map((v) => [v.x, v.y, v.z]);
  // Equirectangular texture painted per pixel with anti-aliased pentagon edges.
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  const dark = new THREE.Color(panelHex);
  const light = new THREE.Color(baseHex);
  const aa = 0.0035; // edge softness (≈1px)
  for (let y = 0; y < H; y++) {
    const phi = (y + 0.5) / H * Math.PI; // matches SphereGeometry UVs
    for (let x = 0; x < W; x++) {
      const theta = (x + 0.5) / W * Math.PI * 2;
      const px = -Math.cos(theta) * Math.sin(phi);
      const py = Math.cos(phi);
      const pz = Math.sin(theta) * Math.sin(phi);
      let best = -2;
      let second = -2;
      for (const c of centres) {
        const d = px * c[0] + py * c[1] + pz * c[2];
        if (d > best) {
          second = best;
          best = d;
        } else if (d > second) second = d;
      }
      const m = best - second; // pentagonal level sets around each centre
      const k = THREE.MathUtils.smoothstep(m, 0.21 - aa, 0.21 + aa);
      const seam = 1 - 0.25 * Math.max(0, 1 - Math.abs(m) / 0.004); // faint hexagon seams
      const i = (y * W + x) * 4;
      img.data[i] = 255 * (light.r + (dark.r - light.r) * k) * seam;
      img.data[i + 1] = 255 * (light.g + (dark.g - light.g) * k) * seam;
      img.data[i + 2] = 255 * (light.b + (dark.b - light.b) * k) * seam;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};
