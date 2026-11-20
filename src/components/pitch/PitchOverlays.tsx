import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../../design/tokens';
import {progress} from '../../lib/anim';
import {usePitch} from './Pitch';

/** All overlays live INSIDE <Pitch> and use pitch metres (x 0–105, y 0–68). */

export const PlayerDot: React.FC<{x: number; y: number; label?: string; color?: string; delay?: number}> = ({x, y, label, color = colors.teamA, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {portrait} = usePitch();
  const p = progress(frame, delay, 0.6 * fps);
  return (
    <g opacity={p} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p})${portrait ? ' rotate(-90)' : ''}`}>
      <circle r={2.6} fill={color} fillOpacity={0.18} />
      <circle r={1.3} fill={color} stroke="#fff" strokeWidth={0.25} />
      {label && <text y={-3.4} textAnchor="middle" fontSize={2} fontWeight={600} fill={colors.white} fontFamily={fonts.text}>{label}</text>}
    </g>
  );
};

/** Animated pass / run / shot arrow along an optional curve. */
export const PassArrow: React.FC<{from: [number, number]; to: [number, number]; curve?: number; color?: string; delay?: number; duration?: number; dashed?: boolean}> = ({
  from, to, curve = 0, color = colors.white, delay = 0, duration = 0.9, dashed = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, delay, duration * fps);
  const mx = (from[0] + to[0]) / 2 - (to[1] - from[1]) * curve;
  const my = (from[1] + to[1]) / 2 + (to[0] - from[0]) * curve;
  const d = `M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={0.45} strokeLinecap="round" pathLength={1}
        strokeDasharray={dashed ? '0.02 0.015' : 1} strokeDashoffset={dashed ? 0 : 1 - p}
        opacity={dashed ? p : 1} style={{filter: `drop-shadow(0 0 0.6px ${color})`}} />
      <circle cx={to[0]} cy={to[1]} r={0.9 * p} fill={color} opacity={p > 0.95 ? 1 : 0} />
    </g>
  );
};

/** Soft heat zone (gaussian-like radial). */
export const HeatZone: React.FC<{x: number; y: number; r?: number; intensity?: number; color?: string; delay?: number}> = ({
  x, y, r = 10, intensity = 0.6, color = colors.teamB, delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, delay, 1.2 * fps);
  const id = `heat-${Math.round(x * 10)}-${Math.round(y * 10)}`;
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={color} stopOpacity={intensity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * p} fill={`url(#${id})`} />
    </g>
  );
};
