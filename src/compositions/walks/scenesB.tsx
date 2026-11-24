import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useT} from '../../components/ios';
import {Walker} from '../walks5/Walks5';
import {W} from './words';
import {Dot, GREY, INK, Label, MessiPhoto, PaperPitch, Title} from './kit';
import {Eye} from './scenesA';

const whiteCard: React.CSSProperties = {position: 'absolute', background: '#fff', borderRadius: 48, boxShadow: paper.shadow};

/* S9a · Pep saw it — first minutes, barely moves (timer-ring card) */
export const Pep: React.FC = () => {
  const {t, p} = useT();
  const card = p(26.4, 0.7);
  const ring = p(W.first, 2.3, paperEase.glide);
  const R = 190, C = 2 * Math.PI * R;
  const minute = Math.max(1, Math.round(1 + ring * 9));
  return (
    <AbsoluteFill>
      <Title small={[['Pep', W.pep], ['saw', 25.13], ['it', 25.45], ['at', 25.5]]} big="Barcelona." bigAt={W.barcelona} exitAt={26.35} top={600} size={190} />
      <div style={{...whiteCard, left: 240, top: 860, width: 600, height: 600, opacity: card, scale: String(0.9 + 0.1 * card), filter: `blur(${(1 - card) * 10}px)`}}>
        <svg width={600} height={600} style={{position: 'absolute', inset: 0}}>
          <circle cx={300} cy={300} r={R} fill="none" stroke="#EDEDF0" strokeWidth={22} />
          <circle cx={300} cy={300} r={R} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform="rotate(-90 300 300)" />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: fonts.display, fontSize: 150, fontWeight: 800, letterSpacing: '-0.05em', color: INK, fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{minute}’</div>
          <div style={{fontFamily: fonts.text, fontSize: 26, fontWeight: 700, letterSpacing: '0.16em', color: paper.text2, marginTop: 8}}>FIRST MINUTES</div>
        </div>
      </div>
      {/* footprints: barely any */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2].map((i) => <ellipse key={i} cx={470 + i * 70} cy={1560 + (i % 2) * 22} rx={16} ry={9} fill={INK} opacity={0.5 * p(W.barely + i * 0.3, 0.3)} />)}
      </svg>
      <Title small={[['In', 26.46], ['the', 26.58], ['first', W.first], ['minutes,', 26.98]]} exitAt={27.4} top={300} smallSize={72} />
      <Title small={[['Messi', 27.5]]} big="barely moves." bigAt={W.barely} top={300} size={160} />
      {t < 0 && null}
    </AbsoluteFill>
  );
};

/* S9b · Inside his head: ghost rings, then everyone slides into place */
const MAP = [{x: -230, y: -150, sx: -320, sy: 40}, {x: 120, y: -260, sx: 260, sy: -120}, {x: 260, y: 60, sx: 120, sy: 230}, {x: -90, y: 210, sx: -300, sy: 260}, {x: -270, y: 120, sx: -120, sy: -40}];
export const MindMap: React.FC = () => {
  const {p} = useT();
  const C = {x: 540, y: 1100};
  const disc = p(29.0, 0.8);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="mmShadow"><feGaussianBlur stdDeviation={24} /></filter></defs>
        <circle cx={C.x + 24} cy={C.y + 40} r={410 * disc} fill="rgba(0,0,0,0.16)" filter="url(#mmShadow)" />
        <circle cx={C.x} cy={C.y} r={410 * disc} fill="#E6E6EA" />
        <g fill="none" stroke="rgba(29,29,31,0.12)" strokeWidth={2.5} opacity={disc}>
          <line x1={C.x - 410} y1={C.y} x2={C.x + 410} y2={C.y} />
          <circle cx={C.x} cy={C.y} r={110} />
        </g>
        {MAP.map((m, i) => {
          const ghost = p(W.already + i * 0.16, 0.35);
          const slide = p(W.willBe - 0.15 + i * 0.05, 0.45, paperEase.glide);
          const x = C.x + m.sx + (m.x - m.sx) * slide, y = C.y + m.sy + (m.y - m.sy) * slide;
          return (
            <g key={i}>
              <circle cx={C.x + m.x} cy={C.y + m.y} r={30} fill="none" stroke={INK} strokeWidth={2.5} strokeDasharray="6 6" opacity={ghost} />
              <Dot x={x} y={y} o={p(29.3 + i * 0.08, 0.3)} />
            </g>
          );
        })}
        <Dot x={C.x} y={C.y} r={22} fill={INK} o={disc} />
      </svg>
      <Label text="Inside his head" at={29.3} x={540} y={620} size={30} color={paper.text2} />
      <Title small={[['By', W.by], ['the', 29.26], ['time', 29.42], ['the', 29.62], ['real', 29.82]]} big="chance." bigAt={W.chance} exitAt={30.75} top={250} size={200} />
      <Title small={[['he', 30.86], ['already', W.already], ['knows', W.knows], ['where', 31.94]]} big="everyone will be." bigAt={W.everyone} top={250} size={128} />
    </AbsoluteFill>
  );
};

/* S10 · Re-hook: sideways camera pan along one huge sentence */
const SENT: [string, number][] = [['And', 33.38], ["here's", 33.46], ['the', 33.82], ['part', 33.94], ['defenders', 34.18], ['hate.', 34.86]];
export const PartTheyHate: React.FC = () => {
  const {t, p} = useT();
  const size = 230;
  const widths = SENT.map(([w]) => w.length * size * 0.56 + size * 0.28);
  const xs = widths.reduce<number[]>((a, w, i) => [...a, i === 0 ? 0 : a[i - 1] + widths[i - 1]], []);
  const centres = xs.map((x, i) => x + widths[i] / 2);
  const times = SENT.map(([, at]) => at);
  const cam = interpolate(t, times, centres, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: paperEase.glide});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 840, left: 540 - cam, display: 'flex', whiteSpace: 'nowrap'}}>
        {SENT.map(([w, at], i) => {
          const k = p(at - 0.05, 0.35);
          return (
            <span key={i} style={{width: widths[i], fontFamily: fonts.display, fontSize: size, fontWeight: 800, letterSpacing: '-0.05em', color: k > 0.5 ? INK : '#C7C7CC',
              opacity: 0.35 + 0.65 * k, filter: `blur(${(1 - k) * 6}px)`}}>
              {w}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1140, left: 0, right: 0, height: 4, display: 'flex', justifyContent: 'center'}}>
        <div style={{width: 520 * p(W.defenders, 0.8, paperEase.glide), height: 4, background: INK, borderRadius: 2}} />
      </div>
    </AbsoluteFill>
  );
};

/* S11 · Walking makes you invisible — nobody tracks him (lines snap off) */
const TRK = [{x: 170, y: 760}, {x: 930, y: 820}, {x: 200, y: 1390}, {x: 900, y: 1420}];
export const Invisible: React.FC = () => {
  const {p} = useT();
  const ghost = p(W.invisible - 0.1, 0.7, paperEase.glide);
  const chest = {x: 540, y: 990};
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: 1 - ghost * 0.82}}><Walker id="iv" style={{translate: '0 -10px'}} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: ghost * 0.9}}><Walker id="iv2" ink="#E4E4E8" dot="#C9C9CE" shadow={false} style={{translate: '0 -10px'}} /></AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {TRK.map((d, i) => {
          const on = p(W.nobody - 0.1 + i * 0.05, 0.35);
          const off = p(38.2 + i * 0.32, 0.3, paperEase.exit);
          const k = on * (1 - off);
          return (
            <g key={i}>
              <line x1={d.x} y1={d.y} x2={d.x + (chest.x - d.x) * k} y2={d.y + (chest.y - d.y) * k} stroke="rgba(29,29,31,0.5)" strokeWidth={2.5} />
              <Dot x={d.x} y={d.y} o={on} />
            </g>
          );
        })}
      </svg>
      <Title small={[['Walking', W.walking], ['makes', 36.09], ['you', 36.41]]} big="invisible." bigAt={W.invisible} exitAt={37.5} top={250} size={200} />
      <Title small={[['Nobody', W.nobody], ['tracks', W.tracks], ['a', 38.44], ['player', 38.56], ['who', 38.88], ["isn't", 39.0]]} big="running." bigAt={W.running} top={250} size={200} />
    </AbsoluteFill>
  );
};

/* S12 · They relax, look away — half a second (timer ring) */
export const HalfSecond: React.FC = () => {
  const {p} = useT();
  const me = {x: 540, y: 1180};
  const relax = p(W.relax, 0.6, paperEase.glide);
  const away = p(W.look - 0.05, 0.4, paperEase.arrive);
  const tk = p(W.half, 0.6, paperEase.glide);
  const R = 150, C = 2 * Math.PI * R;
  const ringIn = p(W.half - 0.15, 0.3);
  return (
    <AbsoluteFill>
      <PaperPitch k={p(39.95, 0.8)} y0={760} y1={1640} goalTop={false} opacity={0.8} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs><linearGradient id="vc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#8E8E93" stopOpacity={0.45} /><stop offset="1" stopColor="#8E8E93" stopOpacity={0} /></linearGradient></defs>
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          const r = 240 + 70 * relax;
          const x = me.x + Math.cos(a) * r, y = me.y + Math.sin(a) * r * 0.85;
          const face = (Math.atan2(me.y - y, me.x - x) * 180) / Math.PI + 90 + away * 150 * (i % 2 ? 1 : -1);
          return (
            <g key={i} opacity={p(40.0 + i * 0.05, 0.3)}>
              <g transform={`rotate(${face} ${x} ${y})`}><polygon points={`${x - 8},${y} ${x + 8},${y} ${x + 70},${y - 230} ${x - 70},${y - 230}`} fill="url(#vc)" /></g>
              <Dot x={x} y={y} />
            </g>
          );
        })}
        <Dot x={me.x} y={me.y} r={22} fill={INK} />
        {/* timer ring */}
        <g opacity={ringIn}>
          <circle cx={540} cy={560} r={R} fill="#fff" />
          <circle cx={540} cy={560} r={R} fill="none" stroke="#EDEDF0" strokeWidth={16} />
          <circle cx={540} cy={560} r={R} fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - tk)} transform="rotate(-90 540 560)" />
        </g>
      </svg>
      <div style={{position: 'absolute', top: 500, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.display, fontSize: 110, fontWeight: 800, letterSpacing: '-0.05em', color: INK, fontVariantNumeric: 'tabular-nums', opacity: ringIn, lineHeight: 1}}>
        {(0.5 * tk).toFixed(1)}s
      </div>
      <Title small={[['They', 40.01]]} big="relax." bigAt={W.relax} exitAt={40.7} top={300} size={200} />
      <Title small={[['They', 40.77], ['look', W.look]]} big="away." bigAt={W.away} exitAt={41.85} top={300} size={200} />
      <Label text="Half a second" at={W.half} x={540} y={760} size={34} />
    </AbsoluteFill>
  );
};

/* S13 · That's all he needs — touch, escape, shoot, net */
export const Goal: React.FC = () => {
  const {t, p} = useT();
  const y0 = 640;
  const start = {x: 540, y: 1380}, esc = {x: 680, y: 1000}, goal = {x: 520, y: y0 - 30};
  const run = p(W.touch - 0.05, 0.6, paperEase.arrive);
  const me = {x: start.x + (esc.x - start.x) * run, y: start.y + (esc.y - start.y) * run};
  const shot = p(W.shoot - 0.03, 0.25, paperEase.glide);
  const ballPos = t < W.shoot ? {x: me.x + 26, y: me.y - 30} : {x: esc.x + 26 + (goal.x - esc.x - 26) * shot, y: esc.y - 30 + (goal.y - esc.y + 30) * shot};
  const net = p(W.net - 0.05, 0.9, paperEase.arrive);
  const bulge = Math.sin(net * Math.PI) * 26;
  const defs = [{x: 380, y: 1250}, {x: 720, y: 1290}, {x: 600, y: 1130}, {x: 420, y: 980}];
  return (
    <AbsoluteFill>
      <PaperPitch k={p(42.95, 0.9, paperEase.glide)} y0={y0} y1={1800} goalTop />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* net */}
        <g stroke="rgba(29,29,31,0.35)" strokeWidth={2} fill="none">
          {Array.from({length: 7}, (_, i) => <path key={`v${i}`} d={`M ${470 + i * 23} ${y0} Q ${470 + i * 23} ${y0 - 40 - bulge} ${470 + i * 23} ${y0 - 70}`} />)}
          {[0, 1, 2].map((j) => <path key={`h${j}`} d={`M 470 ${y0 - 20 - j * 22} Q 540 ${y0 - 20 - j * 22 - bulge} 610 ${y0 - 20 - j * 22}`} />)}
          <rect x={466} y={y0 - 74} width={148} height={74} stroke={INK} strokeWidth={4} />
        </g>
        {[0, 1].map((i) => <circle key={i} cx={goal.x} cy={goal.y} r={40 + p(W.net + i * 0.12, 0.9) * 260} fill="none" stroke={INK} strokeWidth={2} opacity={(1 - p(W.net + i * 0.12, 0.9)) * (t > W.net ? 1 : 0)} />)}
        {defs.map((d, i) => <Dot key={i} x={d.x} y={d.y} />)}
        <line x1={start.x} y1={start.y} x2={me.x} y2={me.y} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={run > 0 ? 1 : 0} />
        <line x1={esc.x + 26} y1={esc.y - 30} x2={ballPos.x} y2={ballPos.y} stroke={INK} strokeWidth={3} strokeDasharray="10 10" opacity={t > W.shoot ? 1 : 0} />
        <Dot x={me.x} y={me.y} r={22} fill={INK} />
        <circle cx={ballPos.x} cy={ballPos.y} r={11} fill="#fff" stroke={INK} strokeWidth={4} />
      </svg>
      <Title small={[["That's", W.thats], ['all', 43.25], ['he', 43.49]]} big="needs." bigAt={W.needs} exitAt={44.3} top={180} size={190} />
      <Title small={[['One', 44.38], ['touch', W.touch], ['to', 44.9]]} big="escape." bigAt={W.escape} exitAt={45.7} top={180} size={190} />
      <Title small={[['One', 45.79], ['to', 46.03]]} big="shoot." bigAt={W.shoot} exitAt={46.92} top={180} size={190} />
      <Title small={[['Ball', W.ballNet], ['in', 47.32], ['the', 47.48]]} big="net." bigAt={W.net} top={180} size={190} />
    </AbsoluteFill>
  );
};

/* S14 · Not tired — saving it for the 5 seconds that decide the game */
export const FiveSeconds: React.FC = () => {
  const {p} = useT();
  const batt = p(48.3, 0.7) * (1 - p(50.45, 0.4, paperEase.exit));
  const fill = p(W.energy, 0.9, paperEase.glide);
  const bar = p(50.75, 0.9, paperEase.glide);
  const seg = p(W.five, 0.5);
  const segX = 100 + 880 * (63 / 90); // a moment in the 63rd minute
  return (
    <AbsoluteFill>
      {/* battery */}
      <div style={{position: 'absolute', left: 220, top: 900, width: 600, height: 240, opacity: batt, scale: String(0.9 + 0.1 * batt), filter: `blur(${(1 - batt) * 10}px)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 64, border: `8px solid ${INK}`}} />
        <div style={{position: 'absolute', right: -34, top: 80, width: 22, height: 80, borderRadius: 11, background: INK}} />
        <div style={{position: 'absolute', left: 22, top: 22, bottom: 22, width: (600 - 44) * fill, borderRadius: 44, background: INK}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 96, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', mixBlendMode: 'difference'}}>
          {Math.round(fill * 100)}%
        </div>
      </div>
      <Label text="Not tired" at={W.tired2 - 0.05} x={540} y={1200} exitAt={50.45} />
      {/* 90-minute bar with the 5-second slice */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: bar}}>
        <rect x={100} y={1000} width={880 * bar} height={28} rx={14} fill="#E3E3E7" />
        {[0, 45, 90].map((m) => <text key={m} x={100 + 880 * (m / 90)} y={1080} textAnchor="middle" fontFamily="Inter" fontSize={30} fontWeight={600} fill="rgba(29,29,31,0.5)">{m}’</text>)}
        <rect x={segX - 4} y={986} width={8} height={56} rx={4} fill={INK} opacity={seg} />
        <line x1={segX} y1={980} x2={segX} y2={980 - 150 * seg} stroke={INK} strokeWidth={2.5} />
        <circle cx={segX} cy={980 - 150 * seg} r={7} fill={INK} opacity={seg} />
      </svg>
      <Label text="5 s of 5,400 s · 0.09%" at={W.decide - 0.2} x={540} y={1150} size={32} color={paper.text2} />
      <Label text="That decide the game" at={W.decide} x={540} y={1210} size={34} />
      <Title small={[["He's", 48.29], ['not', 48.49], ['saving', W.saving]]} big="energy." bigAt={W.energy} exitAt={50.45} top={300} size={200} />
      <Title small={[["He's", 50.6], ['saving', 50.84], ['it', 51.2], ['for', 51.36], ['the', 51.48]]} big="5 seconds." bigAt={W.five} top={300} size={180} />
    </AbsoluteFill>
  );
};

/* S15 · Everyone runs to find the game — the game finds him (photo callback, word behind) */
export const FindsHim: React.FC = () => {
  const {t, p} = useT();
  const partA = 1 - p(56.0, 0.3, paperEase.exit);
  const ball = (tt: number) => ({x: 540 + Math.sin(tt * 2.3) * 330, y: 1150 + Math.sin(tt * 3.1 + 1) * 260});
  return (
    <AbsoluteFill>
      {t < 56.4 && (
        <AbsoluteFill style={{opacity: partA}}>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const q = ball(t - 0.18 - i * 0.09);
              const q2 = ball(t - 0.3 - i * 0.09);
              const off = {x: Math.cos(i * 1.7) * (40 + i * 8), y: Math.sin(i * 1.7) * (40 + i * 8)};
              return (
                <g key={i} opacity={p(53.9 + i * 0.05, 0.3)}>
                  <line x1={q2.x + off.x} y1={q2.y + off.y} x2={q.x + off.x} y2={q.y + off.y} stroke="rgba(29,29,31,0.2)" strokeWidth={8} strokeLinecap="round" />
                  <Dot x={q.x + off.x} y={q.y + off.y} />
                </g>
              );
            })}
            <circle cx={ball(t).x} cy={ball(t).y} r={12} fill="#fff" stroke={INK} strokeWidth={4} />
          </svg>
          <Title small={[['Everyone', W.everyone2], ['else', 54.24], ['runs', W.runs], ['to', 54.88]]} big="find the game." bigAt={W.find} top={250} size={150} />
        </AbsoluteFill>
      )}
      {t >= 56.0 && (
        <AbsoluteFill>
          <Title small={[['Messi', W.messi], ['walks', W.walks3], ['until', W.until], ['the', 57.34], ['game', 57.5]]} top={250} smallSize={64} />
          <Title big="finds him." bigAt={W.finds} top={760} size={175} />
          <MessiPhoto at={56.1} x={540} y={1500} w={1300} z={2} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* S16 · Don't look away — the ghost */
export const Ghost: React.FC = () => {
  const {t, p} = useT();
  const walkX = interpolate(t, [58.9, 60.7], [-160, 160]);
  const eyeOn = t >= 60.55 && t < 61.95;
  const path = (k: number) => ({x: 140 + k * 800, y: 1300 - Math.sin(k * Math.PI) * 420});
  const gk = interpolate(t, [62.0, 65.2], [0.35, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dk = interpolate(t, [62.0, 65.2], [0.0, 0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const g = path(gk), d = path(dk);
  const vanish = p(W.ghost - 0.1, 0.6, paperEase.glide);
  return (
    <AbsoluteFill>
      {t < 60.75 && (
        <AbsoluteFill style={{opacity: 1 - p(60.45, 0.3)}}>
          <Walker id="gs" style={{translate: `${walkX}px 0`, scale: '0.8'}} />
          <Title small={[['So', W.so], ['next', 59.05], ['time', 59.33], ['you', 59.49], ['see', 59.65], ['him', 59.85]]} big="strolling…" bigAt={W.strolling} top={250} size={190} />
        </AbsoluteFill>
      )}
      {eyeOn && (
        <AbsoluteFill style={{opacity: 1 - p(61.7, 0.25)}}>
          <Eye at={60.55} yaw={0} pitch={0} />
          <Title small={[["Don't", W.dont], ['look', W.lookAway]]} big="away." bigAt={61.25} top={300} size={230} />
        </AbsoluteFill>
      )}
      {t >= 61.85 && (
        <AbsoluteFill style={{opacity: p(61.85, 0.3)}}>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <path d={Array.from({length: 40}, (_, i) => { const q = path((i / 39) * dk); return `${i ? 'L' : 'M'} ${q.x} ${q.y}`; }).join(' ')} fill="none" stroke="rgba(29,29,31,0.25)" strokeWidth={6} strokeLinecap="round" />
            <circle cx={g.x} cy={g.y} r={44} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="6 8" opacity={1 - vanish} />
            <circle cx={g.x} cy={g.y} r={28} fill={INK} opacity={0.16 * (1 - vanish)} />
            <Dot x={d.x} y={d.y} r={26} />
          </svg>
          <Title small={[['The', 61.9], ['last', W.last], ['defender', W.defender], ['who', 62.78], ['did', 62.98], ['is', 63.26], ['still', 63.5], ['chasing', W.chasing]]} big="a ghost." bigAt={64.3} top={250} size={220} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const EndCard: React.FC = () => {
  const {p} = useT();
  const k = p(65.75, 1.0, paperEase.arrive);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: fonts.display, fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em', color: paper.text, opacity: k, filter: `blur(${(1 - k) * 8}px)`, translate: `0 ${(1 - k) * 14}px`}}>
        Produced by Shaljr
      </div>
    </AbsoluteFill>
  );
};
