import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {interFamily} from '../../design/fonts';
import {fonts, paper, paperEase} from '../../design/tokens';
import {FlyWords, PaperBackground, useT} from '../../components/ios';
import {Eyeball3D, Scene3D} from '../../components/three';
import {Sfx} from '../../sfx/Sfx';
import {Big, Halftone, Stack} from '../dribbles10/Dribbles10';
import {Walker} from './Walks5';

/**
 * "Messi walks on purpose" — 5 s teaser, v2: closer to the owner's reference.
 * Chamfered B&W card (walking figure) splits like doors → halftone 3D eyeball on paper with hairline
 * connectors scans LEFT / RIGHT / BEHIND / LEFT AGAIN → the eye shrinks into Messi's dot on a light-grey
 * pitch (paper only, no black) → soft grey vision cone → he bursts through the gap. Layout at 1080×1920, absolute seconds.
 */
export const WALKS5EYE_DURATION_SEC = 6.5;
const T = {doors: 1.25, looks: [1.95, 2.35, 2.75, 3.1], dive: 3.35, dark: 3.62, burst: 4.05, close: 5.0, end: 5.45};
const EYE = {x: 540, y: 1060, r: 255};
const CARD = {x: 230, y: 600, w: 620, h: 940, c: 64};
const CX = 540;
const CY = 1060; // = EYE.y, so the eye shrinks straight into the player dot
const R = 340;

const chamfer = (x: number, y: number, w: number, h: number, c: number) =>
  `${x + c},${y} ${x + w - c},${y} ${x + w},${y + c} ${x + w},${y + h - c} ${x + w - c},${y + h} ${x + c},${y + h} ${x},${y + h - c} ${x},${y + c}`;

/** gaze keys: [time, yaw, pitch, label] — snaps like a real saccade */
const GAZE: [number, number, number][] = [[0, 0, 0], [T.looks[0], -0.62, 0.05], [T.looks[1], 0.62, 0.05], [T.looks[2], 0.85, 0.42], [T.looks[3], -0.62, 0.0], [T.dive, 0, 0]];
const LABELS = ['Left.', 'Right.', 'Behind.', 'Left again.'];

const useGaze = () => {
  const {t, p} = useT();
  let yaw = 0, pitch = 0;
  for (let i = 1; i < GAZE.length; i++) {
    const [t1, y1, p1] = GAZE[i];
    const [, y0, p0] = GAZE[i - 1];
    if (t < t1 - 0.16) break;
    const k = p(t1 - 0.16, 0.16, paperEase.arrive);
    yaw = y0 + (y1 - y0) * k;
    pitch = p0 + (p1 - p0) * k;
  }
  return {yaw, pitch};
};

/* ───────────── Paper act: card → doors → eye ───────────── */
const CardLayer: React.FC<{half?: -1 | 1}> = ({half}) => {
  const {p} = useT();
  const k = p(T.doors, 0.75, paperEase.glide);
  const clip = half === undefined ? '' : half < 0 ? `inset(0 ${1080 - 540}px 0 0)` : 'inset(0 0 0 540px)';
  return (
    <AbsoluteFill style={{clipPath: clip || undefined, translate: half ? `${half * k * 620}px 0` : undefined}}>
      <AbsoluteFill style={{clipPath: `polygon(${chamfer(CARD.x, CARD.y, CARD.w, CARD.h, CARD.c).split(' ').map((q) => q.replace(',', 'px ') + 'px').join(',')})`}}>
        <AbsoluteFill style={{background: 'radial-gradient(80% 60% at 50% 35%, #5A5A5F 0%, #2C2C30 70%, #1C1C1F 100%)'}} />
        <Halftone color="rgba(255,255,255,0.5)" opacity={0.08} size={6} />
        <Walker ink="#D9D9DD" dot="#B5B5BA" shadow={false} />
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <polygon points={chamfer(CARD.x - 10, CARD.y - 10, CARD.w + 20, CARD.h + 20, CARD.c + 4)} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={2.5} />
      </svg>
    </AbsoluteFill>
  );
};

const PaperAct: React.FC = () => {
  const {t, p} = useT();
  const {yaw, pitch} = useGaze();
  const open = p(T.doors, 0.75, paperEase.glide);
  const eyeIn = p(T.doors + 0.05, 0.7, paperEase.arrive);
  const dive = p(T.dive, T.dark - T.dive, paperEase.glide);
  const shrink = interpolate(dive, [0, 1], [1, 24 / EYE.r]);
  const push = 1 + t * 0.008;
  if (t > T.dark + 0.05) return null;

  // hairline through the eye, along the gaze (reference)
  const gx = Math.sin(yaw), gy = -Math.sin(pitch);
  const gl = Math.hypot(gx, gy) || 1;
  const look = GAZE.findIndex((g, i) => i > 0 && i <= 4 && t >= g[0] - 0.1 && t < (GAZE[i + 1]?.[0] ?? 99) - 0.1);
  const lineO = p(T.looks[0] - 0.2, 0.2) * (1 - p(T.dive - 0.1, 0.15));
  const lx = EYE.x + (gx / gl) * 900, ly = EYE.y + (gy / gl) * 900;
  const labelD = 390;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{scale: String(push), transformOrigin: `${EYE.x}px ${EYE.y}px`}}>
        <AbsoluteFill style={{scale: String(shrink), transformOrigin: `${EYE.x}px ${EYE.y}px`, opacity: 1 - p(T.dark - 0.08, 0.1)}}>
        {/* soft offset shadow under the eye */}
        <div style={{position: 'absolute', left: EYE.x - EYE.r + 30, top: EYE.y - EYE.r + 50, width: EYE.r * 2, height: EYE.r * 2, borderRadius: EYE.r, background: 'rgba(0,0,0,0.28)', filter: 'blur(40px)', opacity: eyeIn}} />
        {/* connectors: eye → inner corners of the opening doors */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: open * (1 - p(T.looks[0] + 0.3, 0.5))}}>
          {[-1, 1].map((s) =>
            [CARD.y + CARD.c, CARD.y + CARD.h - CARD.c].map((cy) => (
              <line key={`${s}${cy}`} x1={EYE.x} y1={EYE.y} x2={540 + s * open * 620} y2={cy} stroke="rgba(0,0,0,0.45)" strokeWidth={2} />
            )),
          )}
          <line x1={0} y1={EYE.y} x2={1080} y2={EYE.y} stroke="rgba(0,0,0,0.25)" strokeWidth={2} opacity={1 - lineO} />
        </svg>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: lineO}}>
          <line x1={EYE.x} y1={EYE.y} x2={lx} y2={ly} stroke="rgba(0,0,0,0.5)" strokeWidth={2.5} />
          <circle cx={EYE.x + (gx / gl) * labelD} cy={EYE.y + (gy / gl) * labelD} r={7} fill={paper.text} />
        </svg>
        {look > 0 && (
          <div style={{position: 'absolute', left: EYE.x + (gx / gl) * labelD - 200, top: EYE.y + (gy / gl) * labelD + 22, width: 400, textAlign: 'center',
            fontFamily: fonts.text, fontSize: 38, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: paper.text, opacity: lineO * p(GAZE[look][0] - 0.1, 0.15)}}>
            {LABELS[look - 1]}
          </div>
        )}
        {/* the eye */}
        <AbsoluteFill style={{opacity: eyeIn, scale: String(0.82 + 0.18 * eyeIn), filter: `blur(${(1 - eyeIn) * 14}px)`}}>
          <Scene3D tone="neutral" cameraZ={6}>
            <Eyeball3D yaw={yaw} pitch={pitch} scale={0.5} position={[0, -0.197, 0]} />
          </Scene3D>
        </AbsoluteFill>
        {/* halftone on the eye (print look) */}
        <div style={{position: 'absolute', left: EYE.x - EYE.r, top: EYE.y - EYE.r, width: EYE.r * 2, height: EYE.r * 2, borderRadius: EYE.r, overflow: 'hidden', opacity: 0.22 * eyeIn, mixBlendMode: 'multiply'}}>
          <Halftone color="rgba(0,0,0,0.9)" opacity={1} size={5} />
        </div>
        </AbsoluteFill>
        {/* the card, then its two doors */}
        {t < T.doors ? <CardLayer /> : t < T.doors + 0.9 ? <><CardLayer half={-1} /><CardLayer half={1} /></> : null}
      </AbsoluteFill>

      <Stack top={300}>
        <FlyWords words={[{text: 'Messi', at: 0.05}, {text: 'just', at: 0.12}]} size={62} weight={600} color={paper.text2} lead={0.05} dur={0.45} exitAt={T.doors} />
        <Big at={0.2} size={250} color={paper.text} exitAt={T.doors}>walks.</Big>
      </Stack>
      <Stack top={300}>
        <FlyWords words={[{text: 'Lazy?', at: T.doors + 0.3}, {text: 'Watch', at: T.doors + 0.45}, {text: 'his', at: T.doors + 0.52}]} size={62} weight={600} color={paper.text2} exitAt={T.dive} />
        <Big at={T.doors + 0.5} size={250} color={paper.text} exitAt={T.dive}>head.</Big>
      </Stack>
    </AbsoluteFill>
  );
};

/* ───────────── Pitch act (paper): grey pitch, vision cone, burst ───────────── */
const DEF = [{x: -230, y: -120}, {x: -125, y: -250}, {x: 150, y: -245}, {x: 245, y: -60}, {x: -210, y: 170}, {x: 190, y: 190}];
const INK = '#1D1D1F';

const PitchAct: React.FC = () => {
  const {t, p} = useT();
  if (t < T.dive) return null;
  const intro = p(T.dive + 0.1, 0.7, paperEase.arrive);
  const b = p(T.burst, 0.5, paperEase.arrive);
  const me = {x: CX + 8 * b, y: CY - 450 * b};
  const coneW = 34 - 26 * p(T.burst - 0.2, 0.2);
  const coneO = p(T.dark, 0.3) * (1 - p(T.burst + 0.1, 0.3));
  const tan = Math.tan(((coneW / 2) * Math.PI) / 180) * 900;
  const late = p(T.burst + 0.2, 0.5, paperEase.glide);
  const out = p(T.close - 0.1, 0.4, paperEase.exit);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 12}px)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="pdisc" cx="50%" cy="40%"><stop offset="0" stopColor="#ECECEF" /><stop offset="1" stopColor="#DCDCE0" /></radialGradient>
          <linearGradient id="pcone" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#8E8E93" stopOpacity={0.45} /><stop offset="1" stopColor="#8E8E93" stopOpacity={0} /></linearGradient>
          <filter id="pshadow"><feGaussianBlur stdDeviation={22} /></filter>
        </defs>
        {/* pitch hairlines in light grey */}
        <g fill="none" stroke="rgba(29,29,31,0.10)" strokeWidth={3} opacity={intro}>
          <line x1={0} y1={CY} x2={1080} y2={CY} />
          <circle cx={CX} cy={CY} r={R + 90} />
          <rect x={250} y={1640} width={580} height={300} />
          <rect x={400} y={1800} width={280} height={140} />
        </g>
        {/* grey disc on soft shadow, like the reference's paper objects */}
        <circle cx={CX + 18} cy={CY + 30} r={R * (0.5 + 0.5 * intro)} fill="rgba(0,0,0,0.18)" filter="url(#pshadow)" opacity={intro} />
        <circle cx={CX} cy={CY} r={R * (0.5 + 0.5 * intro)} fill="url(#pdisc)" opacity={intro} />
        {/* his vision cone, soft grey */}
        <polygon points={`${me.x - 12},${me.y} ${me.x + 12},${me.y} ${me.x + tan},${me.y - 900} ${me.x - tan},${me.y - 900}`} fill="url(#pcone)" opacity={coneO} />
        {DEF.map((d, i) => {
          const gap = i === 1 || i === 2;
          const x = CX + d.x + (gap ? (i === 1 ? 40 : -40) * late : 0);
          const y = CY + d.y + (gap ? -30 * late : 0);
          return <circle key={i} cx={x} cy={y} r={17 * intro} fill="#A9A9AE" />;
        })}
        {/* burst: ink line draws through the gap */}
        <line x1={CX} y1={CY} x2={me.x} y2={me.y} stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={b > 0 ? 1 : 0} />
        <circle cx={me.x} cy={me.y} r={24} fill={INK} opacity={p(T.dark - 0.1, 0.1)} />
      </svg>
      <Stack top={300}>
        <FlyWords words={[{text: 'Then…', at: T.dark}]} size={62} weight={600} color={paper.text2} />
        <Big at={T.burst} size={270} color={paper.text}>burst.</Big>
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
    <AbsoluteFill style={{opacity: k}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: fonts.display, fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em', color: paper.text, opacity: txt, filter: `blur(${(1 - txt) * 8}px)`, translate: `0 ${(1 - txt) * 14}px`}}>
          Produced by Shaljr
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Walks5Eye: React.FC = () => (
  <AbsoluteFill style={{fontFamily: interFamily}}>
    <PaperBackground grain={0.07} />
    <Halftone color="rgba(0,0,0,0.5)" opacity={0.07} />
    <PitchAct />
    <PaperAct />
    <Close />

    <Sfx at={0.0} name="whoosh-soft" volume={0.25} />
    <Sfx at={0.2} name="impact-soft" volume={0.45} />
    {[0.25, 0.75].map((at) => <Sfx key={at} at={at} name="tick" volume={0.14} />)}
    <Sfx at={T.doors - 0.05} name="click" volume={0.3} />
    <Sfx at={T.doors} name="whoosh-low" volume={0.42} />
    <Sfx at={T.doors + 0.08} name="pop" volume={0.22} />
    <Sfx at={T.doors + 0.5} name="impact-soft" volume={0.38} />
    {T.looks.map((s) => <Sfx key={s} at={s - 0.16} name="whoosh-fast" volume={0.14} />)}
    {T.looks.map((s) => <Sfx key={`c${s}`} at={s - 0.03} name="click" volume={0.24} />)}
    <Sfx at={T.dive} name="whoosh-low" volume={0.45} />
    <Sfx at={T.dark} name="impact-soft" volume={0.35} />
    <Sfx at={T.burst - 0.12} name="whoosh-fast" volume={0.35} />
    <Sfx at={T.burst} name="impact" volume={0.6} />
    <Sfx at={T.burst + 0.05} name="kick" volume={0.3} />
    <Sfx at={T.close - 0.05} name="whoosh-low" volume={0.3} />
  </AbsoluteFill>
);
