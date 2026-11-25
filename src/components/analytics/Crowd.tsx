import React from 'react';

/**
 * Low-poly grey "3D" floor with capsule people (MessiWalks reference crowd scene), drawn as SVG with a
 * simple pinhole projection. World units: metres; x right, z forward (into screen), camera at z=0.
 */
export type Person = {x: number; z: number; tone?: string; marker?: boolean; markerColor?: string; scale?: number; lean?: number};

export const Crowd: React.FC<{
  width: number; height: number;
  people: Person[];
  horizon?: number; // px from top
  camH?: number; // camera height (m)
  f?: number; // focal length px
  camX?: number;
  grid?: number;
  children?: React.ReactNode;
}> = ({width: Wd, height: Ht, people, horizon = Ht * 0.3, camH = 2.2, f = 900, camX = 0, grid = 1}) => {
  const proj = (x: number, z: number, y = 0) => ({sx: Wd / 2 + ((x - camX) * f) / z, sy: horizon + ((camH - y) * f) / z, s: f / z});
  const lines: React.ReactNode[] = [];
  for (let z = 2; z <= 60; z += z < 10 ? 2 : 6) {
    const a = proj(-60, z), b = proj(60, z);
    lines.push(<line key={`z${z}`} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke="rgba(0,0,0,0.07)" strokeWidth={1.5} />);
  }
  for (let x = -40; x <= 40; x += 5) {
    const a = proj(x, 1.2), b = proj(x, 80);
    lines.push(<line key={`x${x}`} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke="rgba(0,0,0,0.06)" strokeWidth={1.5} />);
  }
  const sorted = [...people].map((p, i) => ({...p, i})).sort((a, b) => b.z - a.z);
  return (
    <svg width={Wd} height={Ht} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="crowdFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E4E8" />
          <stop offset="100%" stopColor="#F1F1F3" />
        </linearGradient>
      </defs>
      <rect x={0} y={horizon} width={Wd} height={Ht - horizon} fill="url(#crowdFloor)" opacity={grid} />
      <g opacity={grid}>{lines}</g>
      {sorted.map((p) => {
        const sc = p.scale ?? 1;
        const base = proj(p.x, p.z);
        const s = base.s * sc;
        const tone = p.tone ?? '#9A9AA0';
        const legH = 0.85 * s, bodyH = 0.75 * s, bw = 0.42 * s, lw = 0.13 * s, hr = 0.15 * s;
        return (
          <g key={p.i} transform={`translate(${base.sx} ${base.sy}) rotate(${p.lean ?? 0})`}>
            {p.marker && <ellipse cx={0} cy={0} rx={0.75 * s} ry={0.16 * s} fill="none" stroke={p.markerColor ?? '#1D1D1F'} strokeWidth={Math.max(2, 0.03 * s)} />}
            <ellipse cx={0.08 * s} cy={0} rx={0.38 * s} ry={0.07 * s} fill="rgba(0,0,0,0.10)" />
            <rect x={-bw * 0.32 - lw / 2} y={-legH} width={lw} height={legH} rx={lw / 2} fill={tone} />
            <rect x={bw * 0.32 - lw / 2} y={-legH} width={lw} height={legH} rx={lw / 2} fill={tone} />
            <rect x={-bw / 2} y={-legH - bodyH * 0.92} width={bw} height={bodyH} rx={bw * 0.32} fill={tone} />
            <circle cx={0} cy={-legH - bodyH - hr * 0.9} r={hr} fill={tone} />
          </g>
        );
      })}
    </svg>
  );
};

/** Screen position helper matching Crowd's projection (for labels). */
export const crowdProject = (x: number, z: number, o: {width: number; height: number; horizon?: number; camH?: number; f?: number; camX?: number}, y = 0) => {
  const horizon = o.horizon ?? o.height * 0.3, f = o.f ?? 900, camH = o.camH ?? 2.2, camX = o.camX ?? 0;
  return {x: o.width / 2 + ((x - camX) * f) / z, y: horizon + ((camH - y) * f) / z, s: f / z};
};
