import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useVideoConfig} from 'remotion';

/**
 * Light "paper" 3D kit (analytics look): transparent canvas over PaperBackground, soft studio light,
 * shadows caught on an invisible floor, matte grey/black/red materials. Camera is set per frame (CameraRig).
 * RULE: everything is driven by props computed from useCurrentFrame() in the parent — no useFrame().
 */
export type V3 = [number, number, number];

const CameraRig: React.FC<{pos: V3; look: V3; fov: number; shift: number; w: number; h: number}> = ({pos, look, fov, shift, w, h}) => {
  const {camera} = useThree();
  (camera as THREE.PerspectiveCamera).setViewOffset(w, h, 0, -shift, w, h);
  camera.position.set(...pos);
  (camera as THREE.PerspectiveCamera).fov = fov;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(...look);
  return null;
};

/** shift: px to push the whole 3D picture DOWN the frame (keeps players clear of the headline band). */
export const Stage3D: React.FC<{children: React.ReactNode; cam: V3; look?: V3; fov?: number; light?: V3; dark?: boolean; style?: React.CSSProperties; shift?: number}> = ({
  children, cam, look = [0, 0, 0], fov = 32, light = [4, 9, 6], dark = false, style, shift = 0,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <div style={{position: 'absolute', inset: 0, ...style}}>
      <ThreeCanvas width={width} height={height} shadows gl={{antialias: true, alpha: true}} dpr={1} camera={{position: cam, fov}}>
        <CameraRig pos={cam} look={look} fov={fov} shift={shift} w={width} h={height} />
        <hemisphereLight args={[dark ? '#8A8A99' : '#FFFFFF', dark ? '#111114' : '#C9C9CF', dark ? 0.6 : 1.25]} />
        <directionalLight position={light} intensity={dark ? 2.2 : 2.0} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} shadow-radius={6} />
        <directionalLight position={[-6, 4, -3]} intensity={dark ? 0.8 : 0.5} />
        {children}
      </ThreeCanvas>
    </div>
  );
};

/** Invisible floor that only shows soft shadows (sits on the paper background). */
export const ShadowFloor: React.FC<{size?: number; opacity?: number; y?: number}> = ({size = 60, opacity = 0.16, y = 0}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <planeGeometry args={[size, size]} />
    <shadowMaterial transparent opacity={opacity} />
  </mesh>
);

/** Matte light-grey pitch slab with white markings (portrait-friendly 40×26 m crop of a pitch). */
export const Pitch3D: React.FC<{w?: number; d?: number; opacity?: number; tone?: string; line?: string}> = ({w = 16, d = 24, opacity = 1, tone = '#E4E4E8', line = '#FFFFFF'}) => {
  const lw = 0.08;
  const L: React.FC<{x: number; z: number; sx: number; sz: number}> = ({x, z, sx, sz}) => (
    <mesh position={[x, 0.011, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[sx, sz]} />
      <meshStandardMaterial color={line} transparent opacity={opacity} roughness={1} />
    </mesh>
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={tone} transparent opacity={opacity} roughness={0.95} />
      </mesh>
      <L x={0} z={-d / 2 + lw / 2} sx={w} sz={lw} />
      <L x={0} z={d / 2 - lw / 2} sx={w} sz={lw} />
      <L x={-w / 2 + lw / 2} z={0} sx={lw} sz={d} />
      <L x={w / 2 - lw / 2} z={0} sx={lw} sz={d} />
      <L x={0} z={0} sx={w} sz={lw} />
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 2.9 + lw, 96]} />
        <meshStandardMaterial color={line} transparent opacity={opacity} />
      </mesh>
      {/* penalty boxes */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <L x={0} z={s * (d / 2 - 5)} sx={9} sz={lw} />
          <L x={-4.5} z={s * (d / 2 - 2.5)} sx={lw} sz={5} />
          <L x={4.5} z={s * (d / 2 - 2.5)} sx={lw} sz={5} />
        </group>
      ))}
    </group>
  );
};

/** Capsule player pin. lean tilts the whole body (radians) toward heading; glow adds emissive. */
export const Pin: React.FC<{position: V3; heading?: number; lean?: number; color?: string; glow?: number; scale?: number; ring?: string; squash?: number}> = ({
  position, heading = 0, lean = 0, color = '#B5B5BB', glow = 0, scale = 1, ring, squash = 0,
}) => (
  <group position={position} rotation={[0, heading, 0]} scale={scale}>
    <group rotation={[lean, 0, 0]} scale={[1 + squash * 0.15, 1 - squash * 0.25, 1 + squash * 0.15]}>
      <mesh position={[0, 0.78, 0]} castShadow>
        <capsuleGeometry args={[0.34, 0.85, 8, 24]} />
        <meshStandardMaterial color={color} roughness={0.55} emissive={color} emissiveIntensity={glow} />
      </mesh>
      <mesh position={[0, 1.78, 0]} castShadow>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} emissive={color} emissiveIntensity={glow} />
      </mesh>
    </group>
    {ring && (
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.72, 64]} />
        <meshBasicMaterial color={ring} transparent opacity={0.95} />
      </mesh>
    )}
  </group>
);

/** Flat marker disc / token. */
export const Token: React.FC<{position: V3; rotation?: V3; color?: string; glow?: number; r?: number; h?: number}> = ({position, rotation = [0, 0, 0], color = '#D9D9DE', glow = 0, r = 0.42, h = 0.14}) => (
  <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <cylinderGeometry args={[r, r, h, 40]} />
    <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} emissive={color} emissiveIntensity={glow} />
  </mesh>
);

/** Dashed trail on the floor through points (x,z). */
export const Trail: React.FC<{pts: [number, number][]; progress: number; color?: string; width?: number; dash?: number}> = ({pts, progress, color = '#FF3B30', width = 0.09, dash = 0.45}) => {
  const segs = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0.03, z)));
    const len = curve.getLength();
    const n = Math.floor(len / dash);
    return Array.from({length: n}, (_, i) => {
      const a = curve.getPointAt(i / n), b = curve.getPointAt(Math.min(1, (i + 0.55) / n));
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const ang = Math.atan2(b.x - a.x, b.z - a.z);
      return {mid, ang, l: a.distanceTo(b), f: i / n};
    });
  }, [pts, dash]);
  return (
    <group>
      {segs.filter((s) => s.f <= progress).map((s, i) => (
        <mesh key={i} position={s.mid} rotation={[-Math.PI / 2, 0, ang(s.ang)]}>
          <planeGeometry args={[width, s.l]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
};
const ang = (a: number) => a;

/** Catmull-Rom position along a floor path at u∈[0,1] → [x, z, heading]. */
export const along = (pts: [number, number][], u: number): [number, number, number] => {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)));
  const k = Math.min(0.999, Math.max(0, u));
  const p = curve.getPointAt(k);
  const t = curve.getTangentAt(k);
  return [p.x, p.z, Math.atan2(t.x, t.z)];
};
