import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, type} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {progress} from '../../lib/anim';

/** Small uppercase eyebrow label with a hairline that draws in. */
export const Kicker: React.FC<{text: string; delay?: number; color?: string}> = ({text, delay = 0, color = colors.accentSoft}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s} = useLayout();
  const p = progress(frame, delay, 0.8 * fps);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: s(20), fontFamily: fonts.text, ...type.kicker, fontSize: s(type.kicker.fontSize), color}}>
      <div style={{width: s(56) * p, height: Math.max(1, s(2)), background: color}} />
      <span style={{opacity: p, letterSpacing: `${0.18 + (1 - p) * 0.2}em`}}>{text}</span>
    </div>
  );
};
