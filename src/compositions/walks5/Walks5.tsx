import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {interFamily} from '../../design/fonts';
import {fonts, paper, paperEase} from '../../design/tokens';
import {FlyWords, PaperBackground, useT} from '../../components/ios';
import {Grain} from '../../components/backgrounds/GradientBackground';
import {Sfx} from '../../sfx/Sfx';
import {Big, Halftone, Stack} from '../dribbles10/Dribbles10';

/**
 * "Messi walks on purpose" — 5 s teaser (+ end card). Analytics "Mind" look, no photos:
 * a faceless halftone figure walks on paper → camera dives into his head → top-down dark pitch,
 * his vision cone scans left / right / behind → he bursts through the gap. Layout at 1080×1920.
 */
export const WALKS5_DURATION_SEC = 6.5;
const T = {zoom: 1.8, dark: 2.05, scans: [2.45, 2.85, 3.25, 3.6], burst: 3.85, close: 5.0, end: 5.45};
const CX = 540;
const CY = 1120;
const R = 340;
const INK = '#2A2A2D';

/* ───────────── Paper: the walking figure ───────────── */
const deg = (d: number) => (d * Math.PI) / 180;
const limb = (x: number, y: number, a: number, len: number) => [x + Math.sin(deg(a)) * len, y + Math.cos(deg(a)) * len] as const;

export const Walker: React.FC<{ink?: string; dot?: string; shadow?: boolean}> = ({ink = INK, dot = '#4A4A4F', shadow = true}) => {
  const {t} = useT();
  const ph = (t / 1.0) * 2 * Math.PI; // one stride cycle per second: an unhurried walk
  const bob = Math.abs(Math.cos(ph)) * 7;
  const hip = {x: 540, y: 1150 - bob};
  const sh = {x: 540, y: 905 - bob};
  const leg = (s: 1 | -1) => {
    const th = 24 * Math.sin(ph) * s;
    const knee = limb(hip.x, hip.y, th, 175);
    const bend = Math.max(0, Math.sin(ph + (s > 0 ? Math.PI / 2 : -Math.PI / 2))) * 38;
    const foot = limb(knee[0], knee[1], th - bend, 170);
    return {knee, foot, toe: [foot[0] + 34, foot[1]] as const};
  };
  const arm = (s: 1 | -1) => {
    const th = -20 * Math.sin(ph) * s;
    const el = limb(sh.x, sh.y, th, 135);
    const hand = limb(el[0], el[1], th + 18, 120);
    return {el, hand};
  };
  const path = (pts: readonly (readonly [number, number])[]) => 'M' + pts.map((p) => p.join(' ')).join(' L');
  const L = leg(1), Rl = leg(-1), A = arm(1), B = arm(-1);
  const stroke = (o: number) => ({fill: 'none', stroke: 'url(#ht)', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, opacity: o});
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <pattern id="ht" width={7} height={7} patternUnits="userSpaceOnUse">
          <rect width={7} height={7} fill={ink} />
          <circle cx={3.5} cy={3.5} r={1.4} fill={dot} />
        </pattern>
        <filter id="soft"><feGaussianBlur stdDeviation={18} /></filter>
      </defs>
      {shadow && <ellipse cx={560} cy={1500} rx={190} ry={22} fill="rgba(0,0,0,0.16)" filter="url(#soft)" />}
      {/* far side limbs lighter for depth */}
      <path d={path([[hip.x, hip.y], Rl.knee, Rl.foot, Rl.toe])} strokeWidth={60} {...stroke(0.55)} />
      <path d={path([[sh.x, sh.y], B.el, B.hand])} strokeWidth={46} {...stroke(0.55)} />
      <path d={path([[sh.x, sh.y], [hip.x, hip.y]])} strokeWidth={118} {...stroke(1)} />
      <path d={path([[hip.x, hip.y], L.knee, L.foot, L.toe])} strokeWidth={62} {...stroke(1)} />
      <path d={path([[sh.x, sh.y], A.el, A.hand])} strokeWidth={48} {...stroke(1)} />
      <circle cx={548} cy={790 - bob} r={66} fill="url(#ht)" />
    </svg>
  );
};

const PaperBeat: React.FC = () => {
  const {t, p} = useT();
  const dive = p(T.zoom, T.dark - T.zoom + 0.1, paperEase.glide);
  const scale = (1 + t * 0.012) * interpolate(dive, [0, 1], [1, 14]);
  if (t > T.dark + 0.15) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - p(T.dark - 0.05, 0.15)}}>
      <AbsoluteFill style={{scale: String(scale), transformOrigin: '548px 790px', filter: `blur(${dive * 10}px)`}}>
        <PaperBackground grain={0.07} />
        <Halftone color="rgba(0,0,0,0.5)" opacity={0.07} />
        <Walker />
        <div style={{position: 'absolute', left: 650, top: 700}}>
          <FlyWords words={[{text: 'Lazy?', at: 1.15}]} size={64} weight={700} color={paper.text2} />
        </div>
      </AbsoluteFill>
      <Stack top={300}>
        <FlyWords words={[{text: 'Messi', at: 0.05}, {text: 'just', at: 0.12}]} size={62} weight={600} color={paper.text2} lead={0.05} dur={0.45} exitAt={T.zoom} />
        <Big at={0.2} size={250} color={paper.text} exitAt={T.zoom}>walks.</Big>
      </Stack>
    </AbsoluteFill>
  );
};

/* ───────────── Dark: top-down scan + burst ───────────── */
const DEF = [
  {x: -230, y: -120}, {x: -125, y: -250}, {x: 150, y: -245}, {x: 245, y: -60}, {x: -210, y: 170}, {x: 190, y: 190},
];
// head direction keys (deg, 0 = forward/up, clockwise): left, right, behind, left again, then forward for the burst
const KEYS: [number, number][] = [[T.dark, 0], [T.scans[0], -90], [T.scans[1], 90], [T.scans[2], 180], [T.scans[3], 270], [T.burst - 0.1, 360]];
const LABELS = ['Left.', 'Right.', 'Behind.', 'Left again.'];

const Dark: React.FC = () => {
  const {t, p} = useT();
  const intro = p(T.dark - 0.05, 0.9, paperEase.arrive);
  // cone angle: quick head snaps (arrive easing) between keys
  let ang = 0;
  for (let i = 1; i < KEYS.length; i++) {
    const [t0, a0] = KEYS[i - 1];
    const [t1, a1] = KEYS[i];
    if (t >= t1 - 0.22) ang = a0 + (a1 - a0) * p(t1 - 0.22, 0.22, paperEase.arrive);
    if (t < t1 - 0.22) break;
    void t0;
  }
  const b = p(T.burst, 0.5, paperEase.arrive);
  const me = {x: CX + 8 * b, y: CY - 450 * b};
  const coneW = 34 - 22 * p(T.burst - 0.15, 0.2);
  const coneO = intro * (1 - p(T.burst + 0.1, 0.3));
  const cam = 1.18 - 0.18 * intro + p(T.burst, 0.8) * 0.06;
  const tan = Math.tan(deg(coneW / 2)) * 900;
  const label = T.scans.findIndex((s, i) => t >= s - 0.12 && t < (T.scans[i + 1] ?? T.burst) - 0.12);
  const scanned = (i: number) => {
    // ring appears on the defenders each look reveals
    const hits = [[0, 4], [3, 5], [], [1, 0]];
    const k = hits.findIndex((h) => h.includes(i));
    return k < 0 ? 0 : p(T.scans[k] - 0.05, 0.3);
  };
  const late = p(T.burst + 0.2, 0.5, paperEase.glide);

  return (
    <AbsoluteFill style={{background: '#0A0A0B', opacity: p(T.dark - 0.1, 0.2)}}>
      <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 50% 58%, #1C1C1F 0%, #0A0A0B 70%)'}} />
      <Halftone color="rgba(255,255,255,0.6)" opacity={0.035} size={6} />
      <AbsoluteFill style={{scale: String(cam), transformOrigin: `${CX}px ${CY}px`}}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <defs>
            <radialGradient id="disc" cx="50%" cy="40%"><stop offset="0" stopColor="#222226" /><stop offset="1" stopColor="#151517" /></radialGradient>
            <linearGradient id="cone" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff" stopOpacity={0.55} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation={9} /></filter>
          </defs>
          <g fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={3} opacity={intro}>
            <line x1={0} y1={CY} x2={1080} y2={CY} />
            <circle cx={CX} cy={CY} r={R + 90} />
            <rect x={250} y={-10} width={580} height={250} />
            <rect x={250} y={1680} width={580} height={250} />
          </g>
          <circle cx={CX} cy={CY} r={R * (0.55 + 0.45 * intro)} fill="url(#disc)" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} opacity={intro} />
          {/* vision cone */}
          <g transform={`rotate(${ang} ${me.x} ${me.y})`} opacity={coneO}>
            <polygon points={`${me.x - 10},${me.y} ${me.x + 10},${me.y} ${me.x + tan},${me.y - 900} ${me.x - tan},${me.y - 900}`} fill="url(#cone)" />
          </g>
          {/* defenders: relaxed grey dots; rings show what he has read; the two by the gap turn late */}
          {DEF.map((d, i) => {
            const gap = i === 1 || i === 2;
            const x = CX + d.x + (gap ? (i === 1 ? 40 : -40) * late : 0);
            const y = CY + d.y + (gap ? -30 * late : 0);
            const s = scanned(i);
            return (
              <g key={i} opacity={intro}>
                <circle cx={x} cy={y} r={22 + 16 * s} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} opacity={s} />
                <circle cx={x} cy={y} r={15} fill="#5A5A60" />
              </g>
            );
          })}
          {/* burst trail */}
          <line x1={CX} y1={CY} x2={me.x} y2={me.y} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={b > 0 ? 1 - p(T.burst + 0.9, 0.5) * 0.6 : 0} />
          <line x1={CX} y1={CY} x2={me.x} y2={me.y} stroke="#fff" strokeWidth={18} filter="url(#glow)" opacity={b > 0 ? 0.6 : 0} />
          <circle cx={me.x} cy={me.y} r={34} fill="#fff" filter="url(#glow)" opacity={0.7 * intro} />
          <circle cx={me.x} cy={me.y} r={20} fill="#F5F5F7" opacity={intro} />
        </svg>
        {/* scan label at the cone tip */}
        {label >= 0 && (
          <div style={{position: 'absolute', left: me.x + Math.sin(deg(ang)) * 300 - 200, top: me.y - Math.cos(deg(ang)) * 300 - 75, width: 400, textAlign: 'center',
            fontFamily: fonts.text, fontSize: 40, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5F5F7',
            opacity: p(T.scans[label] - 0.12, 0.2) * (1 - p((T.scans[label + 1] ?? T.burst) - 0.2, 0.08))}}>
            {LABELS[label]}
          </div>
        )}
      </AbsoluteFill>
      <Grain opacity={0.07} />
      <Stack top={300}>
        <FlyWords words={[{text: 'Watch', at: T.dark + 0.05}, {text: 'his', at: T.dark + 0.12}]} size={62} weight={600} color="rgba(245,245,247,0.55)" exitAt={T.burst - 0.2} />
        <Big at={T.dark + 0.1} size={250} color="#F5F5F7" exitAt={T.burst - 0.2}>head.</Big>
      </Stack>
      <Stack top={300}>
        <FlyWords words={[{text: 'Then…', at: T.burst - 0.15}]} size={62} weight={600} color="rgba(245,245,247,0.55)" />
        <Big at={T.burst} size={270} color="#F5F5F7">burst.</Big>
      </Stack>
    </AbsoluteFill>
  );
};

const Close: React.FC = () => {
  const {t, p} = useT();
  if (t < T.close) return null;
  const k = p(T.close, 0.7, paperEase.glide);
  const txt = p(T.end, 0.9, paperEase.arrive);
  return (
    <AbsoluteFill style={{clipPath: `circle(${k * 1500}px at ${CX + 8}px ${CY - 450}px)`}}>
      <PaperBackground />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: fonts.display, fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em', color: paper.text, opacity: txt, filter: `blur(${(1 - txt) * 8}px)`, translate: `0 ${(1 - txt) * 14}px`}}>
          Produced by Shaljr
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Walks5: React.FC = () => (
  <AbsoluteFill style={{fontFamily: interFamily, background: '#0A0A0B'}}>
    <Dark />
    <PaperBeat />
    <Close />

    <Sfx at={0.0} name="whoosh-soft" volume={0.25} />
    <Sfx at={0.2} name="impact-soft" volume={0.45} />
    {[0.25, 0.75, 1.25].map((at) => <Sfx key={at} at={at} name="tick" volume={0.14} />)}
    <Sfx at={1.13} name="pop" volume={0.25} />
    <Sfx at={T.zoom} name="whoosh-low" volume={0.45} />
    <Sfx at={T.dark + 0.08} name="impact-soft" volume={0.35} />
    {T.scans.map((s) => <Sfx key={s} at={s - 0.2} name="whoosh-fast" volume={0.16} />)}
    {T.scans.map((s) => <Sfx key={`c${s}`} at={s - 0.05} name="click" volume={0.22} />)}
    <Sfx at={T.burst - 0.12} name="whoosh-fast" volume={0.35} />
    <Sfx at={T.burst} name="impact" volume={0.6} />
    <Sfx at={T.burst + 0.05} name="kick" volume={0.3} />
    <Sfx at={T.close - 0.05} name="whoosh-low" volume={0.3} />
  </AbsoluteFill>
);
