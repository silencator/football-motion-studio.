import React from 'react';

/**
 * Grey capsule stick figure (MessiWalks reference). Pose is driven by joint angles (degrees),
 * near limbs dark, far limbs light. Helpers give walk/run cycles and a "fallen" pose.
 */
export type Pose = {
  lean: number; // torso lean (+ forward)
  armN: [number, number]; armF: [number, number]; // shoulder, elbow
  legN: [number, number]; legF: [number, number]; // hip, knee
};

export const stand: Pose = {lean: 0, armN: [8, -10], armF: [-8, -10], legN: [4, 0], legF: [-4, 0]};

/** Gait cycle; phase in turns, k 0 = walk, 1 = sprint. */
export const gait = (phase: number, k = 0): Pose => {
  const s = Math.sin(phase * Math.PI * 2);
  const c = Math.cos(phase * Math.PI * 2);
  const amp = 26 + 22 * k;
  return {
    lean: 4 + 14 * k,
    armN: [-s * (amp * 0.9), -(20 + 70 * k)],
    armF: [s * (amp * 0.9), -(20 + 70 * k)],
    legN: [s * amp, Math.max(0, -c) * (20 + 70 * k) + 6],
    legF: [-s * amp, Math.max(0, c) * (20 + 70 * k) + 6],
  };
};

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const l = (x: number, y: number) => x + (y - x) * t;
  const l2 = (x: [number, number], y: [number, number]): [number, number] => [l(x[0], y[0]), l(x[1], y[1])];
  return {lean: l(a.lean, b.lean), armN: l2(a.armN, b.armN), armF: l2(a.armF, b.armF), legN: l2(a.legN, b.legN), legF: l2(a.legF, b.legF)};
};

const rad = (d: number) => (d * Math.PI) / 180;

export const Figure: React.FC<{
  height: number;
  pose: Pose;
  facing?: 1 | -1;
  dark?: string;
  light?: string;
  rotate?: number; // whole-body rotation about the feet (falling)
  style?: React.CSSProperties;
  head?: boolean;
}> = ({height: H, pose, facing = 1, dark = '#6E6E73', light = '#AEAEB2', rotate = 0, style, head = true}) => {
  const w = H * 0.115; // limb thickness
  const leg = H * 0.25, shin = H * 0.24, torso = H * 0.3, upper = H * 0.17, fore = H * 0.16, headR = H * 0.085;
  const hip = {x: 0, y: -(leg + shin)};
  const lean = rad(pose.lean);
  const sh = {x: hip.x + Math.sin(lean) * torso, y: hip.y - Math.cos(lean) * torso};
  const limb = (o: {x: number; y: number}, a: [number, number], l1: number, l2: number, down = true) => {
    const a1 = rad(a[0]) + (down ? 0 : 0);
    const k = {x: o.x + Math.sin(a1) * l1, y: o.y + Math.cos(a1) * l1};
    const a2 = a1 + rad(down ? -a[1] : a[1]);
    const e = {x: k.x + Math.sin(a2) * l2, y: k.y + Math.cos(a2) * l2};
    return `M${o.x} ${o.y} L${k.x} ${k.y} L${e.x} ${e.y}`;
  };
  // legs: knee bends backwards (negative), arms: elbow bends forwards
  const legF = limb(hip, pose.legF, leg, shin, true);
  const legN = limb(hip, pose.legN, leg, shin, true);
  const armF = limb({x: sh.x, y: sh.y + w * 0.4}, [pose.armF[0], -Math.abs(pose.armF[1])], upper, fore, true);
  const armN = limb({x: sh.x, y: sh.y + w * 0.4}, [pose.armN[0], -Math.abs(pose.armN[1])], upper, fore, true);
  const hd = {x: sh.x + Math.sin(lean) * headR * 1.5, y: sh.y - Math.cos(lean) * headR * 1.5};
  const W = H * 1.2;
  const common = {fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={W} height={H * 1.08} viewBox={`${-W / 2} ${-H * 1.02} ${W} ${H * 1.08}`} style={{overflow: 'visible', ...style}}>
      <ellipse cx={0} cy={H * 0.01} rx={H * 0.2} ry={H * 0.018} fill="rgba(0,0,0,0.10)" />
      <g transform={`rotate(${rotate * facing}) scale(${facing} 1)`}>
        <path d={legF} stroke={light} strokeWidth={w} {...common} />
        <path d={armF} stroke={light} strokeWidth={w * 0.85} {...common} />
        <path d={`M${hip.x} ${hip.y} L${sh.x} ${sh.y}`} stroke={dark} strokeWidth={w * 1.55} {...common} />
        <path d={legN} stroke={dark} strokeWidth={w} {...common} />
        <path d={armN} stroke={dark} strokeWidth={w * 0.85} {...common} />
        {head && <circle cx={hd.x} cy={hd.y} r={headR} fill={dark} />}
      </g>
    </svg>
  );
};
