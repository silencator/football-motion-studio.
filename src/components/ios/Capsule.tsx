import React from 'react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useT} from './scene';

type Variant = 'light' | 'island' | 'blue' | 'custom';

/**
 * Pill that grows out of its leading icon (reference: logo → "Motion Graphics" pill).
 * The icon pops first, then the pill expands to the right revealing the label.
 */
export const Capsule: React.FC<{
  at: number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  variant?: Variant;
  background?: string;
  color?: string;
  size?: number; // font size
  exitAt?: number;
  style?: React.CSSProperties;
}> = ({at, label, icon, variant = 'light', background, color, size = 44, exitAt, style}) => {
  const {p} = useT();
  const pop = p(at - 0.08, 0.45, paperEase.lock);
  const grow = p(at + (icon ? 0.12 : 0), 0.6, paperEase.arrive);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.35, paperEase.exit);
  const bg = background ?? (variant === 'island' ? paper.island : variant === 'blue' ? paper.blue : paper.card);
  const fg = color ?? (variant === 'light' ? paper.text : '#FFFFFF');
  const h = size * 2.05;
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.32, opacity: 1 - out, filter: `blur(${out * 10}px)`, translate: `0 ${-out * 20}px`, ...style}}>
      {icon && (
        <div style={{width: h, height: h, borderRadius: h, display: 'grid', placeItems: 'center', background: bg, boxShadow: paper.shadowSoft, scale: String(pop), opacity: Math.min(1, pop * 2)}}>
          {icon}
        </div>
      )}
      <div
        style={{
          height: h,
          padding: `0 ${size * 0.8}px`,
          borderRadius: h,
          display: 'flex',
          alignItems: 'center',
          background: bg,
          color: fg,
          boxShadow: paper.shadowSoft,
          fontFamily: fonts.text,
          fontSize: size,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          clipPath: `inset(0 ${(1 - grow) * 100}% 0 0 round ${h}px)`,
          translate: `${(1 - grow) * -size}px 0`,
        }}
      >
        <span style={{opacity: grow, filter: `blur(${(1 - grow) * 8}px)`}}>{label}</span>
      </div>
    </div>
  );
};
