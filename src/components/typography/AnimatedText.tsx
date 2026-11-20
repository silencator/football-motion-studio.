import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, ease, fonts, timing, type} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {mix, progress} from '../../lib/anim';

type Variant = keyof typeof type;

export type AnimatedTextProps = {
  text: string;
  variant?: Variant;
  /** 'word' for headlines, 'char' for short hero words, 'line' for body copy. */
  split?: 'word' | 'char' | 'line';
  /** Start frame relative to parent Sequence. */
  delay?: number;
  /** Seconds between units. */
  stagger?: number;
  /** Seconds per unit reveal. */
  duration?: number;
  color?: string;
  /** CSS gradient applied as text fill (e.g. gradients.goldText). */
  gradient?: string;
  align?: 'left' | 'center' | 'right';
  /** Optional exit start frame (relative). */
  exitAt?: number;
  style?: React.CSSProperties;
};

/** Signature reveal: rise + de-blur + fade, staggered per unit. */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  variant = 'h1',
  split = 'word',
  delay = 0,
  stagger = timing.stagger,
  duration = timing.reveal,
  color = colors.white,
  gradient,
  align = 'left',
  exitAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s} = useLayout();
  const t = type[variant];
  const units = split === 'char' ? Array.from(text) : split === 'word' ? text.split(/(\s+)/) : text.split('\n');
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, 0.5 * fps, ease.in);

  let i = 0;
  return (
    <div
      style={{
        fontFamily: fonts.display,
        ...t,
        fontSize: s(t.fontSize),
        color,
        textAlign: align,
        whiteSpace: split === 'line' ? 'pre-line' : 'pre-wrap',
        ...style,
      }}
    >
      {units.map((u, idx) => {
        if (/^\s+$/.test(u)) return <span key={idx}>{u}</span>;
        const p = progress(frame, delay + i++ * stagger * fps, duration * fps);
        return (
          <span
            key={idx}
            style={{
              display: split === 'line' ? 'block' : 'inline-block',
              opacity: p * (1 - exit),
              translate: `0 ${mix(p, 0.45, 0) * t.fontSize * 0.6 - exit * 20}px`,
              filter: `blur(${mix(p, 14, 0) + exit * 10}px)`,
              ...(gradient
                ? {backgroundImage: gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}
                : {}),
            }}
          >
            {u}
          </span>
        );
      })}
    </div>
  );
};
