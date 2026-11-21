import React from 'react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useT} from './scene';

export type FlyWord = {text: string; at: number; color?: string; weight?: number; size?: number};

/**
 * Reference signature: each word flies in from its own height/scale with motion blur and
 * settles into one clean line on its spoken timestamp (absolute seconds).
 */
export const FlyWords: React.FC<{
  words: FlyWord[];
  size?: number;
  weight?: number;
  color?: string;
  align?: 'center' | 'left';
  lead?: number; // seconds the motion starts before the spoken word
  dur?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
  exitAt?: number;
}> = ({words, size = 96, weight = 700, color = paper.text, align = 'center', lead = 0.1, dur = 0.55, maxWidth = 920, style, exitAt}) => {
  const {p} = useT();
  const out = exitAt === undefined ? 0 : p(exitAt, 0.35, paperEase.exit);
  const offs = [-1.0, 0.7, -0.45, 1.1, -0.8, 0.5];
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', alignItems: 'baseline', columnGap: size * 0.26, rowGap: size * 0.08, maxWidth, fontFamily: fonts.display, ...style}}>
      {words.map((w, i) => {
        const k = p(w.at - lead, dur);
        const fs = w.size ?? size;
        const o = offs[i % offs.length];
        return (
          <span
            key={i}
            style={{
              fontSize: fs,
              fontWeight: w.weight ?? weight,
              letterSpacing: '-0.035em',
              lineHeight: 1.04,
              color: w.color ?? color,
              display: 'inline-block',
              opacity: Math.min(1, k * 1.6) * (1 - out),
              translate: `${(1 - k) * fs * 0.25 * o}px ${(1 - k) * fs * 0.9 * o - out * 30}px`,
              scale: String(1 + (1 - k) * 0.35 * Math.sign(o)),
              filter: `blur(${(1 - k) * 14 + out * 12}px)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
