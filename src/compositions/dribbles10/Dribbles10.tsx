import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {interFamily} from '../../design/fonts';
import {fonts, paper, paperEase} from '../../design/tokens';
import {FlyWords, PaperBackground, useT} from '../../components/ios';
import {Grain} from '../../components/backgrounds/GradientBackground';
import {Sfx} from '../../sfx/Sfx';

/**
 * "1,077 failed dribbles" — 10 s data teaser in the Nov 2026 "mind" reference look:
 * halftone paper → card splits like doors → dark pitch, spotlight disc, sweeping light beam.
 * No narration: on-screen words carry the story. Layout authored at 1080×1920. Absolute seconds.
 */
export const DRIBBLES10_DURATION_SEC = 12; // 10 s edit + end card

const N = 2586; // Opta take-ons, top-5 leagues, Aug 2012 – Jun 2023
const WON = 1509;
const CX = 540;
const CY = 1110;
const R = 350;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const T = {crack: 2.0, doors: 2.2, dots: 2.55, dotsEnd: 3.7, beam: 4.9, beamEnd: 7.2, pct: 7.35, final: 7.75, ring: 8.0, close: 9.7, end: 10.25};

/** Sunflower field: every dot one take-on. Exactly 1,509 successes, picked by a seeded shuffle → natural scatter. */
const WON_SET = new Set(
  Array.from({length: N}, (_, i) => i).sort((a, b) => random(`take-on-${a}`) - random(`take-on-${b}`)).slice(0, WON),
);
const DOTS = Array.from({length: N}, (_, i) => {
  const r = R * 0.94 * Math.sqrt((i + 0.5) / N);
  const th = i * GOLDEN;
  const ang = (((th + Math.PI / 2) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); // 0 = straight up, clockwise
  const won = WON_SET.has(i);
  return {x: CX + r * Math.sin(th), y: CY - r * Math.cos(th), ang, won, rn: Math.sqrt((i + 0.5) / N)};
});

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/** Fine print-style halftone dots, as in the reference's paper texture. */
export const Halftone: React.FC<{color: string; opacity: number; size?: number}> = ({color, opacity, size = 7}) => (
  <AbsoluteFill style={{opacity, backgroundImage: `radial-gradient(${color} 22%, transparent 26%)`, backgroundSize: `${size}px ${size}px`, pointerEvents: 'none'}} />
);

/** Big number with the reference's slam-in (scale down + de-blur) and a soft lock. */
export const Big: React.FC<{children: React.ReactNode; at: number; size: number; color: string; exitAt?: number; style?: React.CSSProperties}> = ({children, at, size, color, exitAt, style}) => {
  const {p} = useT();
  const k = p(at, 0.45, paperEase.arrive);
  const lock = p(at + 0.3, 0.5, paperEase.lock);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.3, paperEase.exit);
  return (
    <div style={{fontFamily: fonts.display, fontSize: size, fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.9, color, fontVariantNumeric: 'tabular-nums',
      opacity: Math.min(1, k * 2) * (1 - out), scale: String(1.5 - 0.5 * k + 0.025 * Math.sin(lock * Math.PI) - out * 0.1), filter: `blur(${(1 - k) * 20 + out * 14}px)`, translate: `0 ${-out * 40}px`, ...style}}>
      {children}
    </div>
  );
};

export const Stack: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>{children}</div>
);

/* ───────────── Beat 1 — paper hook ───────────── */
const PaperHook: React.FC = () => {
  const {t, p} = useT();
  const drift = t * 6; // slow push-in, never still
  return (
    <AbsoluteFill style={{scale: String(1 + drift * 0.004)}}>
      <PaperBackground grain={0.07} />
      <Halftone color="rgba(0,0,0,0.5)" opacity={0.07} />
      <Stack top={560}>
        <FlyWords words={[{text: 'Messi', at: 0.08}, {text: 'failed', at: 0.16}]} size={64} weight={600} color={paper.text2} lead={0.08} dur={0.45} />
        <Big at={0.1} size={330} color={paper.text}>1,077</Big>
        <FlyWords words={[{text: 'dribbles.', at: 0.7}]} size={64} weight={600} color={paper.text2} />
      </Stack>
      <Stack top={1330}>
        <FlyWords words={[{text: 'Or', at: 1.35}, {text: 'did', at: 1.42}, {text: 'he?', at: 1.5}]} size={56} weight={700} color={paper.text2} />
      </Stack>
      {/* The crack the card splits along */}
      <div style={{position: 'absolute', left: 539, width: 2, top: 0, height: 1920 * p(T.crack, 0.25, paperEase.glide), background: 'rgba(0,0,0,0.25)'}} />
    </AbsoluteFill>
  );
};

/** Two halves of the paper slide apart like doors (reference photo-card move). */
const Doors: React.FC = () => {
  const {p} = useT();
  const {t} = useT();
  const k = p(T.doors, 0.6, paperEase.glide);
  if (t > T.doors + 0.7) return null;
  const half = (side: -1 | 1) => (
    <AbsoluteFill style={{clipPath: side < 0 ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)', translate: `${side * k * 600}px 0`, boxShadow: '0 0 80px rgba(0,0,0,0.5)'}}>
      <PaperHook />
    </AbsoluteFill>
  );
  return <>{half(-1)}{half(1)}</>;
};

/* ───────────── Beats 2–4 — dark pitch, dot field, beam ───────────── */
const PitchLines: React.FC<{o: number}> = ({o}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>
    <g fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={3}>
      <line x1={0} y1={CY} x2={1080} y2={CY} />
      <circle cx={CX} cy={CY} r={R + 90} />
      <rect x={250} y={-10} width={580} height={250} />
      <rect x={400} y={-10} width={280} height={95} />
      <rect x={250} y={1680} width={580} height={250} />
      <rect x={400} y={1835} width={280} height={95} />
    </g>
  </svg>
);

const Dark: React.FC = () => {
  const {t, p} = useT();
  const intro = p(T.doors + 0.1, 1.2, paperEase.arrive);
  const pull = p(T.final, 1.6, paperEase.glide);
  const cam = 1.22 - 0.22 * intro - 0.1 * pull + (t - T.doors) * 0.006;

  // Beam: one clockwise revolution from straight up; afterwards it rests narrow, pointing up.
  const bk = p(T.beam, T.beamEnd - T.beam, paperEase.glide);
  const sweep = bk * 2 * Math.PI;
  const beamOn = p(T.beam - 0.25, 0.4) * (1 - p(T.beamEnd + 0.4, 0.8));
  const beamDeg = (sweep * 180) / Math.PI;
  const width = 16 - 10 * p(T.beamEnd, 0.6);

  let lit = 0;
  const dots = DOTS.map((d, i) => {
    const appear = Math.min(1, Math.max(0, (t - (T.dots + 1.05 * d.rn)) / 0.25));
    const passed = t >= T.beam && (bk >= 0.999 || d.ang <= sweep);
    const on = d.won && passed;
    if (on) lit++;
    const failDim = passed && !d.won ? 0.13 : 0.34;
    return (
      <circle key={i} cx={d.x} cy={d.y} r={on ? 4.6 : 4.1 * appear} fill={on ? '#FFFFFF' : `rgba(255,255,255,${failDim * appear})`} />
    );
  });
  const lights = DOTS.filter((d) => d.won && t >= T.beam && (bk >= 0.999 || d.ang <= sweep));
  const shown = DOTS.reduce((n, d) => n + (t >= T.dots + 1.05 * d.rn ? 1 : 0), 0);

  const ring = p(T.ring, 1.1, paperEase.glide);
  const circ = 2 * Math.PI * (R + 26);

  return (
    <AbsoluteFill style={{background: '#0A0A0B'}}>
      <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 50% 58%, #1C1C1F 0%, #0A0A0B 70%)'}} />
      <Halftone color="rgba(255,255,255,0.6)" opacity={0.035} size={6} />
      <AbsoluteFill style={{scale: String(cam), transformOrigin: `${CX}px ${CY}px`}}>
        <PitchLines o={intro} />
        {/* Beam (reference light cone) */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: beamOn}}>
          <defs>
            <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity={0.5} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <g transform={`rotate(${beamDeg} ${CX} ${CY})`}>
            <polygon points={`${CX - 18},${CY} ${CX + 18},${CY} ${CX + Math.tan((width * Math.PI) / 360) * 1500},${CY - 1500} ${CX - Math.tan((width * Math.PI) / 360) * 1500},${CY - 1500}`} fill="url(#beam)" />
          </g>
        </svg>
        {/* Disc */}
        <div style={{position: 'absolute', left: CX - R, top: CY - R, width: 2 * R, height: 2 * R, borderRadius: R, background: 'radial-gradient(circle at 50% 40%, #222226 0%, #151517 100%)',
          boxShadow: '0 0 0 1.5px rgba(255,255,255,0.08), 0 40px 120px rgba(0,0,0,0.7)', scale: String(0.6 + 0.4 * intro), opacity: intro}} />
        {/* Gold record ring */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <circle cx={CX} cy={CY} r={R + 26} fill="none" stroke="#D9B44A" strokeWidth={5} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)}
            transform={`rotate(-90 ${CX} ${CY})`} style={{filter: 'drop-shadow(0 0 14px rgba(217,180,74,0.6))'}} />
        </svg>
        {/* Glow under lit dots, then crisp dots */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(7px)', opacity: 0.8}}>
          {lights.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={6} fill="#fff" />)}
        </svg>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>{dots}</svg>
      </AbsoluteFill>
      <Grain opacity={0.07} />

      {/* Beat 2: he tried 2,586 times */}
      <Stack top={300}>
        <FlyWords words={[{text: 'He', at: 2.6}, {text: 'tried', at: 2.68}]} size={58} weight={600} color="rgba(245,245,247,0.55)" exitAt={T.beam - 0.25} />
        <Big at={2.65} size={250} color="#F5F5F7" exitAt={T.beam - 0.25}>{fmt(shown)}</Big>
        <FlyWords words={[{text: 'times.', at: 3.2}]} size={58} weight={600} color="rgba(245,245,247,0.55)" exitAt={T.beam - 0.25} />
      </Stack>
      {/* Beat 3: and beat his man 1,509 times */}
      <Stack top={300}>
        <FlyWords words={[{text: 'He', at: T.beam}, {text: 'beat', at: T.beam + 0.07}, {text: 'his', at: T.beam + 0.14}, {text: 'man', at: T.beam + 0.21}]} size={58} weight={600} color="rgba(245,245,247,0.55)" exitAt={T.final - 0.25} />
        <Big at={T.beam + 0.05} size={250} color="#F5F5F7" exitAt={T.final - 0.25}>{fmt(lit)}</Big>
        <FlyWords words={[{text: 'times.', at: T.beam + 0.5}]} size={58} weight={600} color="rgba(245,245,247,0.55)" exitAt={T.final - 0.25} />
      </Stack>
      <Pct />
      {/* Beat 4: the record */}
      <Stack top={290}>
        <FlyWords words={[{text: 'The', at: T.final}, {text: 'only', at: T.final + 0.07}, {text: 'player', at: T.final + 0.14}, {text: 'ever', at: T.final + 0.21}, {text: 'over', at: T.final + 0.28}]} size={58} weight={600} color="rgba(245,245,247,0.55)" />
        <Big at={T.ring - 0.05} size={270} color="#E8C46A" style={{backgroundImage: 'linear-gradient(180deg, #FFF1C9 0%, #E8C46A 55%, #A9812F 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>1,000</Big>
        <FlyWords words={[{text: 'completed', at: T.ring + 0.4}, {text: 'take-ons.', at: T.ring + 0.48}]} size={58} weight={600} color="rgba(245,245,247,0.55)" />
      </Stack>
      <Source />
    </AbsoluteFill>
  );
};

const Pct: React.FC = () => {
  const {p} = useT();
  const k = p(T.pct, 0.6);
  const out = p(T.final - 0.25, 0.3, paperEase.exit);
  return (
    <div style={{position: 'absolute', top: CY + R + 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: k * (1 - out), filter: `blur(${(1 - k) * 10}px)`}}>
      <div style={{padding: '14px 30px', borderRadius: 60, background: 'rgba(255,255,255,0.08)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.12)', fontFamily: fonts.text, fontSize: 40, fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.01em', scale: String(0.8 + 0.2 * k)}}>
        58.4% success
      </div>
    </div>
  );
};

const Source: React.FC = () => {
  const {p} = useT();
  const k = p(T.ring + 0.7, 0.8);
  return (
    <div style={{position: 'absolute', top: CY + R + 80, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.text, fontSize: 26, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.4)', opacity: k}}>
      Opta · Europe’s top 5 leagues · 2012–2023
    </div>
  );
};

/** Paper disc grows from the centre and becomes the end card (reference disc move). */
const Close: React.FC = () => {
  const {p} = useT();
  const {t} = useT();
  const k = p(T.close, 0.7, paperEase.glide);
  if (t < T.close) return null;
  const txt = p(T.end, 0.9, paperEase.arrive);
  return (
    <AbsoluteFill style={{clipPath: `circle(${k * 1300}px at ${CX}px ${CY}px)`}}>
      <PaperBackground />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: fonts.display, fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em', color: paper.text, opacity: txt, filter: `blur(${(1 - txt) * 8}px)`, translate: `0 ${(1 - txt) * 14}px`}}>
          Produced by Shaljr
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Dribbles10: React.FC = () => {
  const ticks = Array.from({length: 14}, (_, i) => T.dots + 1.05 * Math.sqrt(i / 14));
  return (
    <AbsoluteFill style={{fontFamily: interFamily, background: '#0A0A0B'}}>
      <Dark />
      <Doors />
      <Close />

      <Sfx at={0.0} name="whoosh-soft" volume={0.25} />
      <Sfx at={0.12} name="impact" volume={0.55} />
      <Sfx at={0.68} name="pop" volume={0.22} />
      <Sfx at={1.35} name="click" volume={0.22} />
      <Sfx at={T.crack} name="tick" volume={0.35} />
      <Sfx at={T.doors} name="whoosh-low" volume={0.45} />
      {ticks.map((at, i) => <Sfx key={i} at={at} name="tick" volume={0.1 + i * 0.006} />)}
      <Sfx at={T.dotsEnd} name="impact-soft" volume={0.4} />
      <Sfx at={T.beam - 0.3} name="whoosh-fast" volume={0.25} />
      <Sfx at={T.beam - 0.05} name="whoosh-low" volume={0.32} />
      {Array.from({length: 11}, (_, i) => <Sfx key={`b${i}`} at={T.beam + 0.2 + i * 0.2} name="click" volume={0.07} />)}
      <Sfx at={T.beamEnd} name="impact-soft" volume={0.42} />
      <Sfx at={T.pct} name="pop" volume={0.25} />
      <Sfx at={T.final - 0.2} name="whoosh-fast" volume={0.25} />
      <Sfx at={T.ring - 0.05} name="impact" volume={0.6} />
      <Sfx at={T.ring + 0.1} name="whoosh-soft" volume={0.3} />
      <Sfx at={T.close - 0.05} name="whoosh-low" volume={0.35} />
    </AbsoluteFill>
  );
};
