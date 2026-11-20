import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, type} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {progress} from '../../lib/anim';

/** Circular percentage ring (pass accuracy, possession, conversion rate). */
export const RingStat: React.FC<{value: number; label: string; delay?: number; color?: string; size?: number}> = ({
  value, label, delay = 0, color = colors.accent, size = 320,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s} = useLayout();
  const D = s(size);
  const sw = Math.max(2, s(14));
  const r = (D - sw) / 2;
  const c = 2 * Math.PI * r;
  const p = progress(frame, delay, 1.4 * fps);
  return (
    <div style={{width: D, height: D, position: 'relative', fontFamily: fonts.display}}>
      <svg width={D} height={D} style={{rotate: '-90deg'}}>
        <circle cx={D / 2} cy={D / 2} r={r} stroke={colors.hairline} strokeWidth={sw} fill="none" />
        <circle cx={D / 2} cy={D / 2} r={r} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - (value / 100) * p)} style={{filter: `drop-shadow(0 0 ${s(12)}px ${color})`}} />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...type.h1, fontSize: s(size * 0.28), color: colors.white, fontVariantNumeric: 'tabular-nums'}}>{Math.round(value * p)}%</div>
        <div style={{...type.kicker, fontSize: s(18), color: colors.mist, marginTop: s(8)}}>{label}</div>
      </div>
    </div>
  );
};
