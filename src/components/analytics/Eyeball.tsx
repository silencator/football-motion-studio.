import React, {useId} from 'react';

/**
 * Glossy 3D-looking eyeball (MessiWalks reference) in pure SVG. `yaw`/`pitch` in degrees turn the
 * iris over the sphere with correct foreshortening; |yaw| > 90 hides it behind the ball.
 */
export const Eyeball: React.FC<{size: number; yaw: number; pitch?: number; iris?: string; dilate?: number; style?: React.CSSProperties}> = ({size, yaw, pitch = 0, iris = '#3A3A3E', dilate = 0, style}) => {
  const id = useId().replace(/:/g, '');
  const R = size / 2;
  const y = (yaw * Math.PI) / 180;
  const pt = (pitch * Math.PI) / 180;
  const cx = R + R * Math.sin(y) * Math.cos(pt);
  const cy = R - R * Math.sin(pt);
  const fx = Math.max(0.02, Math.cos(y));
  const fy = Math.max(0.02, Math.cos(pt));
  const ir = R * 0.42;
  const visible = Math.cos(y) * Math.cos(pt) > -0.05;
  const rays = Array.from({length: 64}, (_, i) => i);
  return (
    <svg width={size} height={size * 1.18} viewBox={`0 0 ${size} ${size * 1.18}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <radialGradient id={`b${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#EDEDF0" />
          <stop offset="85%" stopColor="#B9B9BF" />
          <stop offset="100%" stopColor="#8E8E95" />
        </radialGradient>
        <radialGradient id={`i${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#111" />
          <stop offset="38%" stopColor="#1A1A1C" />
          <stop offset="42%" stopColor={iris} />
          <stop offset="85%" stopColor="#6B6B70" />
          <stop offset="100%" stopColor="#1C1C1E" />
        </radialGradient>
        <radialGradient id={`s${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.28)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id={`h${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <clipPath id={`c${id}`}><circle cx={R} cy={R} r={R} /></clipPath>
      </defs>
      {/* contact shadow */}
      <ellipse cx={R} cy={size * 1.06} rx={R * 0.85} ry={R * 0.12} fill={`url(#s${id})`} />
      <circle cx={R} cy={R} r={R} fill={`url(#b${id})`} />
      {visible && (
        <g clipPath={`url(#c${id})`}>
          <g transform={`translate(${cx} ${cy}) scale(${fx} ${fy})`}>
            <circle r={ir} fill={`url(#i${id})`} />
            {rays.map((i) => {
              const a = (i / rays.length) * Math.PI * 2;
              const r0 = ir * (0.4 + dilate * 0.1), r1 = ir * (0.92 - (i % 3) * 0.05);
              return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={i % 2 ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.35)'} strokeWidth={ir * 0.03} />;
            })}
            <circle r={ir * (0.38 + dilate * 0.1)} fill="#0A0A0B" />
          </g>
          {/* rim shading over the iris for depth */}
          <circle cx={R} cy={R} r={R} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={R * 0.18} />
        </g>
      )}
      {/* specular highlights */}
      <ellipse cx={R * 0.66} cy={R * 0.5} rx={R * 0.2} ry={R * 0.13} fill={`url(#h${id})`} transform={`rotate(-30 ${R * 0.66} ${R * 0.5})`} />
      <circle cx={R * 1.32} cy={R * 0.62} r={R * 0.035} fill="rgba(255,255,255,0.85)" />
    </svg>
  );
};
