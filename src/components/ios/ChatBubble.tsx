import React from 'react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useT} from './scene';

/** iMessage-style bubble that springs in from its tail corner (reference "Buttery Smooth" bubbles). */
export const ChatBubble: React.FC<{at: number; children: React.ReactNode; background?: string; tail?: string; color?: string; side?: 'left' | 'right'; size?: number; exitAt?: number; style?: React.CSSProperties}> = ({
  at, children, background = paper.blue, tail, color = '#fff', side = 'left', size = 46, exitAt, style,
}) => {
  const {p} = useT();
  const k = p(at - 0.06, 0.55, paperEase.lock);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.35, paperEase.exit);
  const r = size * 1.1;
  return (
    <div style={{position: 'relative', display: 'inline-block', transformOrigin: side === 'left' ? '0% 100%' : '100% 100%', scale: String(0.4 + 0.6 * k), opacity: Math.min(1, k * 2) * (1 - out), filter: `blur(${(1 - Math.min(1, k)) * 10 + out * 10}px)`, ...style}}>
      <div style={{background, color, borderRadius: r, padding: `${size * 0.45}px ${size * 0.75}px`, fontFamily: fonts.text, fontSize: size, fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap', boxShadow: paper.shadowSoft, display: 'flex', alignItems: 'center', gap: size * 0.4}}>
        {children}
      </div>
      <svg width={size * 0.9} height={size * 0.8} viewBox="0 0 36 32" style={{position: 'absolute', bottom: -size * 0.12, [side]: -size * 0.18, transform: side === 'right' ? 'scaleX(-1)' : undefined}}>
        <path d="M14 0 C14 14 8 24 0 30 C12 30 24 26 32 14 Z" fill={tail ?? (background.startsWith('linear') ? paper.blue : background)} />
      </svg>
    </div>
  );
};
