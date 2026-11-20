import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {progress} from '../../lib/anim';

export type RadarSeries = {name: string; values: number[]; color: string};

/** Player attribute radar (values 0–100). Supports 1–2 overlaid series for comparisons. */
export const RadarChart: React.FC<{axes: string[]; series: RadarSeries[]; delay?: number; size?: number}> = ({axes, series, delay = 0, size = 640}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s} = useLayout();
  const D = s(size);
  const R = D * 0.36;
  const cx = D / 2;
  const n = axes.length;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * R * v, cx + Math.sin(a) * R * v] as const;
  };
  const grid = progress(frame, delay, 0.8 * fps);
  return (
    <svg width={D} height={D} style={{overflow: 'visible', fontFamily: fonts.text}}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <polygon key={g} points={axes.map((_, i) => pt(i, g * grid).join(',')).join(' ')} fill="none" stroke={colors.hairline} strokeWidth={1} />
      ))}
      {axes.map((ax, i) => {
        const [x, y] = pt(i, 1.18);
        const [lx, ly] = pt(i, grid);
        return (
          <g key={ax} opacity={grid}>
            <line x1={cx} y1={cx} x2={lx} y2={ly} stroke={colors.hairline} />
            <text x={x} y={y} fill={colors.mist} fontSize={s(22)} fontWeight={600} textAnchor="middle" dominantBaseline="middle" letterSpacing="0.1em">
              {ax.toUpperCase()}
            </text>
          </g>
        );
      })}
      {series.map((sr, si) => {
        const p = progress(frame, delay + (0.5 + si * 0.25) * fps, 1.2 * fps);
        return (
          <polygon key={sr.name} points={sr.values.map((v, i) => pt(i, (v / 100) * p).join(',')).join(' ')}
            fill={sr.color} fillOpacity={0.18} stroke={sr.color} strokeWidth={Math.max(2, s(3))} strokeLinejoin="round"
            style={{filter: `drop-shadow(0 0 ${s(16)}px ${sr.color})`}} />
        );
      })}
    </svg>
  );
};
