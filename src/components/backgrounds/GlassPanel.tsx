import React from 'react';
import {colors, radius} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';

/** Frosted glass card: backdrop blur, inner highlight, hairline border, soft shadow. */
export const GlassPanel: React.FC<{children?: React.ReactNode; style?: React.CSSProperties; padding?: number; tint?: string}> = ({
  children,
  style,
  padding = 48,
  tint = 'rgba(255,255,255,0.06)',
}) => {
  const {s} = useLayout();
  return (
    <div
      style={{
        position: 'relative',
        padding: s(padding),
        borderRadius: s(radius.lg),
        background: `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, ${tint} 100%)`,
        backdropFilter: 'blur(40px) saturate(160%)',
        WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        border: `1px solid ${colors.hairline}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 ${s(30)}px ${s(80)}px rgba(0,0,0,0.45)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
