import React from 'react';
import {paper, paperEase} from '../../design/tokens';
import {useT} from './scene';

/** Rounded device-like card (white or black "island"), rises with a soft shadow. */
export const Card: React.FC<{at: number; dark?: boolean; radius?: number; padding?: number; children?: React.ReactNode; style?: React.CSSProperties; exitAt?: number; from?: 'below' | 'scale'}> = ({
  at, dark = false, radius = 64, padding = 56, children, style, exitAt, from = 'below',
}) => {
  const {p} = useT();
  const k = p(at - 0.05, 0.7);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.4, paperEase.exit);
  return (
    <div
      style={{
        borderRadius: radius,
        padding,
        background: dark ? paper.island : paper.card,
        color: dark ? paper.islandText : paper.text,
        boxShadow: dark ? '0 30px 80px rgba(0,0,0,0.28), 0 4px 10px rgba(0,0,0,0.12)' : paper.shadow,
        opacity: Math.min(1, k * 1.5) * (1 - out),
        translate: from === 'below' ? `0 ${(1 - k) * 140 - out * 40}px` : undefined,
        scale: String(from === 'scale' ? 0.85 + 0.15 * k - out * 0.05 : 1 - out * 0.04),
        filter: `blur(${(1 - k) * 12 + out * 12}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
