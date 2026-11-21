import React from 'react';

/** Minimal flat football glyph (SVG), for counters and 2D football moments. */
export const FootballIcon: React.FC<{size: number; rotate?: number}> = ({size, rotate = 0}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{rotate: `${rotate}deg`, overflow: 'visible'}}>
    <defs>
      <radialGradient id="ballShade" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#EDEDF0" />
        <stop offset="100%" stopColor="#C9C9CF" />
      </radialGradient>
    </defs>
    <circle r={48} fill="url(#ballShade)" stroke="#1D1D1F" strokeWidth={2.5} />
    <polygon points="0,-17 16,-5 10,14 -10,14 -16,-5" fill="#1D1D1F" />
    {[0, 72, 144, 216, 288].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <line x1={0} y1={-17} x2={0} y2={-33} stroke="#1D1D1F" strokeWidth={2.5} />
        <path d="M-11,-44 L0,-33 L11,-44 A48 48 0 0 0 -11,-44 Z" fill="#1D1D1F" />
      </g>
    ))}
  </svg>
);
