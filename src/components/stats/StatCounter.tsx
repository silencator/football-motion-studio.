import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, ease, fonts, type} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {mix, progress} from '../../lib/anim';

export type StatCounterProps = {
  value: number;
  label: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  /** Seconds to count. */
  duration?: number;
  color?: string;
  gradient?: string;
  align?: 'left' | 'center';
  size?: number;
};

/** Big number that counts up with tabular figures, label fades beneath. */
export const StatCounter: React.FC<StatCounterProps> = ({
  value, label, decimals = 0, prefix = '', suffix = '', delay = 0, duration = 1.6, color = colors.white, gradient, align = 'left', size = type.stat.fontSize,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s} = useLayout();
  const p = progress(frame, delay, duration * fps, ease.out);
  const appear = progress(frame, delay, 0.6 * fps);
  const shown = (value * p).toLocaleString('en-GB', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: s(12)}}>
      <div
        style={{
          fontFamily: fonts.display, ...type.stat, fontSize: s(size), color,
          fontVariantNumeric: 'tabular-nums', opacity: appear, filter: `blur(${mix(appear, 12, 0)}px)`,
          ...(gradient ? {backgroundImage: gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'} : {}),
        }}
      >
        {prefix}{shown}{suffix}
      </div>
      <div style={{fontFamily: fonts.text, ...type.kicker, fontSize: s(type.kicker.fontSize), color: colors.mist, opacity: progress(frame, delay + 0.3 * fps, 0.6 * fps)}}>
        {label}
      </div>
    </div>
  );
};
