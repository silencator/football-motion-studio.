import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, type} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {progress} from '../../lib/anim';

export type StatRow = {label: string; a: number; b: number; format?: (n: number) => string};

/** Head-to-head comparison bars (team A left, team B right), staggered rows. */
export const StatBars: React.FC<{rows: StatRow[]; delay?: number; colorA?: string; colorB?: string; width?: number}> = ({
  rows, delay = 0, colorA = colors.teamA, colorB = colors.teamB, width = 1200,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s} = useLayout();
  const W = s(width);
  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', gap: s(40), fontFamily: fonts.text}}>
      {rows.map((r, i) => {
        const p = progress(frame, delay + i * 0.12 * fps, 1.1 * fps);
        const total = r.a + r.b || 1;
        const fmt = r.format ?? ((n: number) => Math.round(n).toString());
        return (
          <div key={r.label} style={{opacity: progress(frame, delay + i * 0.12 * fps, 0.5 * fps)}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(12)}}>
              <span style={{...type.h3, fontSize: s(type.h3.fontSize), color: colors.white, fontVariantNumeric: 'tabular-nums'}}>{fmt(r.a * p)}</span>
              <span style={{...type.kicker, fontSize: s(22), color: colors.mist}}>{r.label}</span>
              <span style={{...type.h3, fontSize: s(type.h3.fontSize), color: colors.white, fontVariantNumeric: 'tabular-nums'}}>{fmt(r.b * p)}</span>
            </div>
            <div style={{display: 'flex', gap: s(6), height: s(10)}}>
              <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', background: colors.hairline, borderRadius: 99}}>
                <div style={{width: `${(r.a / total) * 100 * p}%`, background: colorA, borderRadius: 99, boxShadow: `0 0 ${s(24)}px ${colorA}`}} />
              </div>
              <div style={{flex: 1, background: colors.hairline, borderRadius: 99}}>
                <div style={{width: `${(r.b / total) * 100 * p}%`, height: '100%', background: colorB, borderRadius: 99, boxShadow: `0 0 ${s(24)}px ${colorB}`}} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
