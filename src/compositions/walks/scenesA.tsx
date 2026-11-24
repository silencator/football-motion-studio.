import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useT} from '../../components/ios';
import {Eyeball3D, Scene3D} from '../../components/three';
import {Walker} from '../walks5/Walks5';
import {W} from './words';
import {Card, CardFill, Dot, GREY, Halftone, INK, Label, MessiPhoto, PaperPitch, Title} from './kit';

/* S1–S3 · Hook: photo card → doors → walking figure → "subbed." */
export const Hook: React.FC = () => {
  const {t, p} = useT();
  const box: [number, number, number, number] = [140, 700, 800, 760];
  const photo = (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(70% 60% at 50% 30%, #EDEDF0 0%, #D9D9DE 100%)'}} />
      <Halftone color="rgba(0,0,0,0.5)" opacity={0.06} size={6} />
      <MessiPhoto at={0} x={560} y={1090} w={1100} />
    </>
  );
  const walkOut = p(W.subbed, 0.7, paperEase.exit);
  const fadeGrey = p(W.subbed - 0.1, 0.4);
  const board = p(W.subbed - 0.35, 0.5);
  return (
    <AbsoluteFill>
      {/* the walker behind the card */}
      <AbsoluteFill style={{opacity: p(W.he - 0.2, 0.4) * (1 - fadeGrey * 0.55), translate: `${-walkOut * 700}px 0`}}>
        <Walker id="hk" style={{translate: '0 -40px'}} />
      </AbsoluteFill>
      {/* substitution board */}
      <div style={{position: 'absolute', left: 620, top: 820, width: 300, height: 230, borderRadius: 34, background: '#fff', boxShadow: paper.shadow,
        opacity: board * (1 - p(7.1, 0.2)), scale: String(0.7 + 0.3 * board), translate: `0 ${(1 - board) * 40}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
        <div style={{fontFamily: fonts.text, fontSize: 28, fontWeight: 700, letterSpacing: '0.16em', color: paper.text2}}>OUT</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <svg width={50} height={50}><path d="M25 44 L4 14 H46 Z" fill="#FF3B30" /></svg>
          <div style={{fontFamily: fonts.display, fontSize: 110, fontWeight: 800, letterSpacing: '-0.05em', color: INK, lineHeight: 1}}>7</div>
        </div>
      </div>
      {t < W.he + 0.9 && (t < W.he - 0.12 ? <Card box={box}>{photo}</Card> : <><Card box={box} half={-1} openAt={W.he - 0.12}>{photo}</Card><Card box={box} half={1} openAt={W.he - 0.12}>{photo}</Card></>)}
      <Title small={[["Messi's", 0.0], ['most', 0.44], ['dangerous', 0.68], ['move', 1.28], ["doesn't", 1.6], ['use', 2.04], ['the', 2.28]]} big="ball." bigAt={W.ball} strikeAt={2.75} exitAt={W.he - 0.2} top={200} />
      <Title small={[['He', W.he]]} big="walks." bigAt={W.walks} exitAt={W.any - 0.15} />
      <Title small={[['Any', 4.33], ['other', 4.65], ['player', 4.85], ['walks', 5.25], ['like', 5.53], ['this,', 5.77]]} big="subbed." bigAt={W.subbed} top={240} />
    </AbsoluteFill>
  );
};

/* S4 · "When Messi does it, the game starts working for him." */
export const WorksForHim: React.FC = () => {
  const {p} = useT();
  const head = {x: 560, y: 1200}; // centre of his head: every line runs into it, behind the hair
  const N = 9;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: N}, (_, i) => {
          const a = -Math.PI * 0.88 + (i / (N - 1)) * Math.PI * 0.76;
          const k = p(8.5 + i * 0.07, 1.3, paperEase.glide);
          const r0 = 900, r1 = 430;
          const r = r0 + (r1 - r0) * k;
          const x = head.x + Math.cos(a) * r, y = head.y + Math.sin(a) * r * 0.95;
          const line = p(9.6 + i * 0.04, 0.5);
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + (head.x - x) * line} y2={y + (head.y - y) * line} stroke="rgba(29,29,31,0.35)" strokeWidth={2} />
              <Dot x={x} y={y} r={17} fill={GREY} o={p(8.4 + i * 0.07, 0.3)} />
            </g>
          );
        })}
      </svg>
      <MessiPhoto at={7.3} x={560} y={1565} w={940} file="messi-close.png" aspect={1152 / 896} halftone={0.18} fade={0.72} />
      <Title small={[['When', W.when], ['Messi', 7.48], ['does', 7.88], ['it,', 8.12]]} smallSize={76} exitAt={8.42} top={330} />
      <Title small={[['The', 8.47], ['game', W.game], ['starts', 8.87], ['working', W.working]]} big="for him." bigAt={9.75} top={200} size={210} />
    </AbsoluteFill>
  );
};

/* S5–S6 · Hands on hips (card) → doors → eyeball scans LEFT / RIGHT / BEHIND / LEFT AGAIN */
const EYE = {x: 540, y: 1080, r: 255};
const GAZE: [number, number, number][] = [[0, 0, 0], [W.left, -0.62, 0.05], [W.right, 0.62, 0.05], [W.behind, 0.85, 0.42], [W.leftAgain, -0.62, 0], [16.25, 0, 0]];
const LABELS = ['Left.', 'Right.', 'Behind.', 'Left again.'];

export const useGaze = (keys: [number, number, number][]) => {
  const {t, p} = useT();
  let yaw = 0, pitch = 0;
  for (let i = 1; i < keys.length; i++) {
    const [t1, y1, p1] = keys[i];
    const [, y0, p0] = keys[i - 1];
    if (t < t1 - 0.12) break;
    const k = p(t1 - 0.12, 0.16, paperEase.arrive);
    yaw = y0 + (y1 - y0) * k;
    pitch = p0 + (p1 - p0) * k;
  }
  return {yaw, pitch};
};

/** Halftone 3D eyeball on paper with soft offset shadow. */
export const Eye: React.FC<{at: number; yaw: number; pitch: number; cx?: number; cy?: number}> = ({at, yaw, pitch, cx = EYE.x, cy = EYE.y}) => {
  const {p} = useT();
  const k = p(at, 0.7);
  const unit = 1920 / (2 * 6 * Math.tan((17.5 * Math.PI) / 180)); // px per world unit at z=0
  return (
    <AbsoluteFill style={{opacity: k, scale: String(0.82 + 0.18 * k), filter: `blur(${(1 - k) * 14}px)`, transformOrigin: `${cx}px ${cy}px`}}>
      <div style={{position: 'absolute', left: cx - EYE.r + 30, top: cy - EYE.r + 50, width: EYE.r * 2, height: EYE.r * 2, borderRadius: EYE.r, background: 'rgba(0,0,0,0.26)', filter: 'blur(40px)'}} />
      <Scene3D tone="neutral" cameraZ={6}>
        <Eyeball3D yaw={yaw} pitch={pitch} scale={EYE.r / unit} position={[(cx - 540) / unit, -(cy - 960) / unit, 0]} />
      </Scene3D>
      <div style={{position: 'absolute', left: cx - EYE.r, top: cy - EYE.r, width: EYE.r * 2, height: EYE.r * 2, borderRadius: EYE.r, overflow: 'hidden', opacity: 0.2, mixBlendMode: 'multiply'}}>
        <Halftone color="rgba(0,0,0,0.9)" opacity={1} size={5} />
      </div>
    </AbsoluteFill>
  );
};

export const HipsAndEye: React.FC = () => {
  const {t, p} = useT();
  const {yaw, pitch} = useGaze(GAZE);
  const box: [number, number, number, number] = [230, 620, 620, 920];
  const open = W.head - 0.1;
  const k = p(open, 0.75, paperEase.glide);
  const hips = p(W.hips - 0.25, 0.5, paperEase.glide);
  const inner = (
    <>
      <CardFill />
      <Walker id="hp" ink="#D9D9DD" dot="#B5B5BA" shadow={false} amp={1 - hips} hips={hips} style={{translate: '0 -20px'}} />
    </>
  );
  const gx = Math.sin(yaw), gy = -Math.sin(pitch);
  const gl = Math.hypot(gx, gy) || 1;
  const look = GAZE.findIndex((g, i) => i > 0 && i <= 4 && t >= g[0] - 0.08 && t < (GAZE[i + 1]?.[0] ?? 99) - 0.08);
  const lineO = p(W.left - 0.25, 0.2) * (1 - p(16.15, 0.2));
  const D = 390;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: k * (1 - p(W.left, 0.5))}}>
        {[-1, 1].map((s) => [box[1] + 60, box[1] + box[3] - 60].map((cy) => (
          <line key={`${s}${cy}`} x1={EYE.x} y1={EYE.y} x2={540 + s * k * 660} y2={cy} stroke="rgba(0,0,0,0.42)" strokeWidth={2} />
        )))}
      </svg>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: lineO}}>
        <line x1={EYE.x} y1={EYE.y} x2={EYE.x + (gx / gl) * 900} y2={EYE.y + (gy / gl) * 900} stroke="rgba(0,0,0,0.5)" strokeWidth={2.5} />
        <circle cx={EYE.x + (gx / gl) * D} cy={EYE.y + (gy / gl) * D} r={7} fill={INK} />
      </svg>
      {look > 0 && <Label text={LABELS[look - 1]} at={GAZE[look][0] - 0.08} x={EYE.x + (gx / gl) * D} y={EYE.y + (gy / gl) * D + 22} exitAt={(GAZE[look + 1]?.[0] ?? 99) - 0.16} />}
      <Eye at={open + 0.05} yaw={yaw} pitch={pitch} />
      {t < open ? <Card box={box}>{inner}</Card> : t < open + 0.9 ? <><Card box={box} half={-1} openAt={open}>{inner}</Card><Card box={box} half={1} openAt={open}>{inner}</Card></> : null}
      <Title small={[['Hands', W.hands], ['on', 11.0]]} big="hips." bigAt={W.hips} exitAt={11.8} top={250} />
      <Title small={[['Watch', W.watch], ['his', 12.19]]} big="head." bigAt={W.head} top={250} />
    </AbsoluteFill>
  );
};

/* S7 · Everyone sprinting, he's mapping the pitch */
const RUN = Array.from({length: 8}, (_, i) => ({
  x0: 180 + random(`rx${i}`) * 720, y0: 480 + random(`ry${i}`) * 1000,
  ax: 120 + random(`ax${i}`) * 160, ay: 140 + random(`ay${i}`) * 200, ph: random(`ph${i}`) * 6.28, sp: 0.9 + random(`sp${i}`) * 0.5,
}));
const runPos = (r: (typeof RUN)[number], t: number) => ({x: r.x0 + Math.sin(t * r.sp * 1.3 + r.ph) * r.ax, y: r.y0 + Math.cos(t * r.sp + r.ph * 0.7) * r.ay});

export const Mapping: React.FC = () => {
  const {t, p} = useT();
  const me = {x: 540, y: 990};
  const slow = interpolate(t, [W.mapping - 0.2, W.mapping + 0.6], [1, 0.25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tt = W.while + (t - W.while) * slow; // runners ease off once he maps them
  return (
    <AbsoluteFill>
      <PaperPitch k={p(W.while - 0.1, 1.0, paperEase.glide)} y0={420} y1={1560} goalTop={false} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {RUN.map((r, i) => {
          const trail = Array.from({length: 7}, (_, j) => runPos(r, tt - j * 0.07));
          const cur = trail[0];
          const m = p(W.mapping + i * 0.07, 0.45, paperEase.glide);
          return (
            <g key={i} opacity={p(W.while + i * 0.04, 0.3)}>
              <polyline points={trail.map((q) => `${q.x},${q.y}`).join(' ')} fill="none" stroke="rgba(29,29,31,0.18)" strokeWidth={8} strokeLinecap="round" opacity={slow} />
              <line x1={me.x} y1={me.y} x2={me.x + (cur.x - me.x) * m} y2={me.y + (cur.y - me.y) * m} stroke="rgba(29,29,31,0.45)" strokeWidth={2} />
              <circle cx={cur.x} cy={cur.y} r={30} fill="none" stroke="rgba(29,29,31,0.4)" strokeWidth={2} opacity={m} />
              <Dot x={cur.x} y={cur.y} />
            </g>
          );
        })}
        <circle cx={me.x} cy={me.y} r={46} fill="none" stroke={INK} strokeWidth={2} opacity={p(W.mapping, 0.4)} />
        <Dot x={me.x} y={me.y} r={22} fill={INK} o={p(W.while, 0.3)} />
      </svg>
      <Title small={[['Everyone', 16.61], ['else', 17.05], ['is', 17.25]]} big="sprinting." bigAt={W.sprinting} exitAt={17.95} top={150} size={200} />
      <Title small={[["He's", 18.01]]} big="mapping." bigAt={W.mapping} top={150} size={200} />
    </AbsoluteFill>
  );
};

/* S8 · POV: what he reads — TIRED / SPACE / DRIFTS (2.5D perspective on white) */
const F = 1500, HOR = 800, CAM_H = 1.7;
const FIG = [
  {X: -2.2, Z: 5.5, tired: true}, {X: 0.9, Z: 9}, {X: 2.2, Z: 7, drift: true}, {X: -0.8, Z: 13}, {X: 4.2, Z: 11}, {X: -4.4, Z: 10},
];
const Figure: React.FC<{x: number; y: number; h: number; o?: number; lean?: number}> = ({x, y, h, o = 1, lean = 0}) => {
  const w = h * 0.26;
  return (
    <g opacity={o} transform={`rotate(${lean} ${x} ${y})`}>
      <ellipse cx={x + h * 0.08} cy={y} rx={w * 0.9} ry={h * 0.035} fill="rgba(0,0,0,0.12)" />
      <rect x={x - w * 0.36} y={y - h * 0.48} width={w * 0.3} height={h * 0.48} rx={w * 0.15} fill="#8E8E93" />
      <rect x={x + w * 0.06} y={y - h * 0.48} width={w * 0.3} height={h * 0.48} rx={w * 0.15} fill="#8E8E93" />
      <rect x={x - w / 2} y={y - h * 0.86} width={w} height={h * 0.44} rx={w * 0.4} fill="#9C9CA1" />
      <circle cx={x} cy={y - h * 0.93} r={h * 0.075} fill="#9C9CA1" />
    </g>
  );
};

export const POV: React.FC = () => {
  const {t, p} = useT();
  const camX = interpolate(t, [19.6, 20.0, 20.85, 21.25, 22.0, 22.4], [0, -230, -230, 230, 230, 300], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: paperEase.glide});
  const push = 1 + (t - 19.7) * 0.012;
  const sx = (X: number, Z: number) => 540 + (F * X) / Z - camX;
  const sy = (Z: number) => HOR + (F * CAM_H) / Z;
  const drift = p(W.switches + 0.15, 0.8, paperEase.glide);
  const ballK = p(23.3, 0.9, paperEase.glide);
  const ball = {X: -5 + 10 * ballK, Z: 11};
  const space = [[0.6, 4.4], [2.0, 4.4], [2.2, 5.6], [0.5, 5.6]].map(([X, Z]) => `${sx(X, Z)},${sy(Z)}`).join(' ');
  const tired = FIG[0], dr = FIG[2];
  const drX = dr.X + 1.3 * drift;
  return (
    <AbsoluteFill style={{background: '#F4F4F6'}}>
      <AbsoluteFill style={{scale: String(push), transformOrigin: `540px ${HOR}px`}}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <defs><linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9E9EC" /><stop offset="1" stopColor="#DCDCE0" /></linearGradient></defs>
          <rect x={-200} y={HOR} width={1480} height={1300} fill="url(#gnd)" />
          <g stroke="rgba(29,29,31,0.10)" strokeWidth={2.5}>
            {[-12, -8, -4, 0, 4, 8, 12].map((X) => <line key={X} x1={sx(X, 60)} y1={sy(60)} x2={sx(X, 2)} y2={sy(2)} />)}
            {[4, 7, 11, 16, 24, 40].map((Z) => <line key={Z} x1={-200} y1={sy(Z)} x2={1280} y2={sy(Z)} />)}
          </g>
          <polygon points={space} fill="rgba(29,29,31,0.07)" stroke="rgba(29,29,31,0.4)" strokeWidth={2} strokeDasharray="10 8" opacity={p(W.space - 0.1, 0.4)} />
          {[...FIG].sort((a, b) => b.Z - a.Z).map((f, i) => {
            const X = f.drift ? drX : f.X;
            return <Figure key={i} x={sx(X, f.Z)} y={sy(f.Z)} h={(F * 1.8) / f.Z} o={0.55 + 4 / f.Z} lean={f.tired ? -6 : 0} />;
          })}
          <circle cx={sx(ball.X, ball.Z)} cy={sy(ball.Z) - 6} r={9} fill={INK} opacity={p(23.2, 0.2) * (1 - p(24.5, 0.3))} />
          {/* focus rings */}
          <ellipse cx={sx(tired.X, tired.Z)} cy={sy(tired.Z)} rx={150} ry={34} fill="none" stroke={INK} strokeWidth={3} opacity={p(W.tired - 0.1, 0.3)} />
          <ellipse cx={sx(drX, dr.Z)} cy={sy(dr.Z)} rx={120} ry={28} fill="none" stroke={INK} strokeWidth={3} opacity={p(W.drifts - 0.1, 0.3)} />
          <line x1={sx(dr.X, dr.Z)} y1={sy(dr.Z) + 30} x2={sx(drX, dr.Z)} y2={sy(dr.Z) + 30} stroke={INK} strokeWidth={3} opacity={drift} />
        </svg>
        <Label text="Tired" at={W.tired - 0.05} x={sx(tired.X, tired.Z)} y={sy(tired.Z) - (F * 1.8) / tired.Z - 70} />
        <Label text="Space" at={W.space - 0.05} x={sx(1.3, 5)} y={sy(5) + 50} />
        <Label text="Drifts" at={W.drifts - 0.05} x={sx(drX, dr.Z)} y={sy(dr.Z) - (F * 1.8) / dr.Z - 70} />
      </AbsoluteFill>
      <Label text="What he reads" at={19.75} x={540} y={250} size={30} color={paper.text2} />
      <Title big="tired?" bigAt={W.tired} exitAt={W.space - 0.2} top={300} size={190} />
      <Title big="space." bigAt={W.space} exitAt={W.drifts - 0.25} top={300} size={190} />
      <Title big="drifts." bigAt={W.drifts} top={300} size={190} />
    </AbsoluteFill>
  );
};
