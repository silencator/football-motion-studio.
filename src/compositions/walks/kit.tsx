import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {fonts, paper, paperEase} from '../../design/tokens';
import {FlyWords, useT} from '../../components/ios';
import {Big, Halftone} from '../dribbles10/Dribbles10';

/** Shared pieces for "Messi walks" — white/grey analytics look, authored at 1080×1920. */
export const INK = '#1D1D1F';
export const GREY = '#9A9AA0';
export const LIGHT = '#D4D4D8';
export {Halftone, Big};

type Word = [string, number];
/** Small grey phrase built word by word + one huge word (reference type pairing). */
export const Title: React.FC<{small?: Word[]; big?: React.ReactNode; bigAt?: number; exitAt?: number; top?: number; size?: number; smallSize?: number; strikeAt?: number}> = ({
  small = [], big, bigAt = 0, exitAt, top = 260, size = 230, smallSize = 60, strikeAt,
}) => {
  const {p} = useT();
  const strike = strikeAt === undefined ? 0 : p(strikeAt, 0.45, paperEase.glide);
  return (
    <div style={{position: 'absolute', top, left: 40, right: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
      {small.length > 0 && <FlyWords words={small.map(([text, at]) => ({text, at}))} size={smallSize} weight={750} color="rgba(29,29,31,0.78)" exitAt={exitAt} maxWidth={980} style={{letterSpacing: '-0.02em'}} />}
      {big !== undefined && (
        <div style={{position: 'relative'}}>
          <Big at={bigAt} size={size} color={paper.text} exitAt={exitAt}>{big}</Big>
          {strikeAt !== undefined && (
            <div style={{position: 'absolute', left: '-4%', top: '52%', height: 14, width: `${108 * strike}%`, background: INK, borderRadius: 7, opacity: exitAt ? 1 - p(exitAt, 0.3) : 1}} />
          )}
        </div>
      )}
    </div>
  );
};

/** Uppercase tracked label (hairline callouts). */
export const Label: React.FC<{text: string; at: number; x: number; y: number; exitAt?: number; size?: number; color?: string; align?: 'center' | 'left'}> = ({text, at, x, y, exitAt, size = 34, color = INK, align = 'center'}) => {
  const {p} = useT();
  const k = p(at, 0.4);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.25, paperEase.exit);
  return (
    <div style={{position: 'absolute', left: align === 'center' ? x - 250 : x, top: y, width: 500, textAlign: align, fontFamily: fonts.text, fontSize: size, fontWeight: 700,
      letterSpacing: `${0.14 + (1 - k) * 0.1}em`, textTransform: 'uppercase', color, opacity: k * (1 - out), filter: `blur(${(1 - k) * 6}px)`}}>
      {text}
    </div>
  );
};

/** The owner's graded Messi cut-out with soft halftone print texture. */
export const MessiPhoto: React.FC<{at: number; x: number; y: number; w: number; exitAt?: number; z?: number; file?: string; aspect?: number; halftone?: number; fade?: number; push?: number}> = ({
  at, x, y, w, exitAt, z, file = 'messi.png', aspect = 873 / 1296, halftone = 0.3, fade, push = 0.004,
}) => {
  const {p, t} = useT();
  const k = p(at, 0.8);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.35, paperEase.exit);
  const src = staticFile(`images/walks/${file}`);
  const h = w * aspect;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, zIndex: z, opacity: Math.min(1, k * 1.5) * (1 - out),
      translate: `0 ${(1 - k) * 60 - out * 30}px`, ...(fade ? {WebkitMaskImage: `linear-gradient(to bottom, #000 ${fade * 100}%, transparent 100%)`, maskImage: `linear-gradient(to bottom, #000 ${fade * 100}%, transparent 100%)`} : {}), scale: String(1.04 - 0.04 * k + Math.max(0, t - at) * push), filter: `blur(${(1 - k) * 16 + out * 12}px)`}}>
      <Img src={src} style={{width: '100%', height: '100%'}} />
      <div style={{position: 'absolute', inset: 0, WebkitMaskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskImage: `url(${src})`, maskSize: '100% 100%', mixBlendMode: 'multiply', opacity: halftone}}>
        <Halftone color="rgba(0,0,0,0.9)" opacity={1} size={6} />
      </div>
    </div>
  );
};

export const chamferPts = (x: number, y: number, w: number, h: number, c: number) =>
  `${x + c},${y} ${x + w - c},${y} ${x + w},${y + c} ${x + w},${y + h - c} ${x + w - c},${y + h} ${x + c},${y + h} ${x},${y + h - c} ${x},${y + c}`;

export const chamferClip = (x: number, y: number, w: number, h: number, c: number) =>
  `polygon(${chamferPts(x, y, w, h, c).split(' ').map((q) => q.replace(',', 'px ') + 'px').join(',')})`;

/** Full-frame layer clipped to a chamfered card, with hairline frame; `half` splits it into a door. */
export const Card: React.FC<{box: [number, number, number, number]; c?: number; half?: -1 | 1; openAt?: number; children: React.ReactNode; frame?: boolean}> = ({box, c = 60, half, openAt = 0, children, frame = true}) => {
  const {p} = useT();
  const [x, y, w, h] = box;
  const k = half ? p(openAt, 0.75, paperEase.glide) : 0;
  const cut = half === undefined ? undefined : half < 0 ? `inset(0 ${1080 - (x + w / 2)}px 0 0)` : `inset(0 0 0 ${x + w / 2}px)`;
  return (
    <AbsoluteFill style={{clipPath: cut, translate: half ? `${half * k * (w + 40)}px 0` : undefined}}>
      <AbsoluteFill style={{clipPath: chamferClip(x, y, w, h, c)}}>{children}</AbsoluteFill>
      {frame && (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <polygon points={chamferPts(x - 10, y - 10, w + 20, h + 20, c + 4)} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth={2.5} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

/** Grey photo-like card fill (B&W print). */
export const CardFill: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'radial-gradient(80% 60% at 50% 35%, #5A5A5F 0%, #2C2C30 70%, #1C1C1F 100%)'}} />
    <Halftone color="rgba(255,255,255,0.5)" opacity={0.08} size={6} />
  </>
);

/** Light-grey top-down pitch hairlines on paper, drawn on with `k`. */
export const PaperPitch: React.FC<{k: number; y0?: number; y1?: number; goalTop?: boolean; opacity?: number}> = ({k, y0 = 360, y1 = 1560, goalTop = true, opacity = 1}) => {
  const L = 2 * (860 + (y1 - y0));
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity}}>
      <g fill="none" stroke="rgba(29,29,31,0.2)" strokeWidth={3} strokeDasharray={L} strokeDashoffset={L * (1 - k)}>
        <rect x={110} y={y0} width={860} height={y1 - y0} />
      </g>
      <g fill="none" stroke="rgba(29,29,31,0.2)" strokeWidth={3} opacity={k}>
        {goalTop ? (
          <>
            <rect x={285} y={y0} width={510} height={209} />
            <rect x={424} y={y0} width={232} height={70} />
            <path d={`M ${430} ${y0 + 209} A 116 116 0 0 0 ${650} ${y0 + 209}`} />
            <rect x={493} y={y0 - 26} width={94} height={26} />
          </>
        ) : (
          <>
            <line x1={110} y1={(y0 + y1) / 2} x2={970} y2={(y0 + y1) / 2} />
            <circle cx={540} cy={(y0 + y1) / 2} r={116} />
          </>
        )}
      </g>
    </svg>
  );
};

export const Dot: React.FC<{x: number; y: number; r?: number; fill?: string; o?: number}> = ({x, y, r = 18, fill = GREY, o = 1}) => <circle cx={x} cy={y} r={r} fill={fill} opacity={o} />;

/** Ground under a walking figure: hairline + footprints scrolling past, so the walk always travels. */
export const Ground: React.FC<{y: number; from: number; speed?: number; o?: number}> = ({y, from, speed = 230, o = 1}) => {
  const {t, p} = useT();
  const off = ((t - from) * speed) % 240;
  const k = p(from, 0.5) * o;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: k, WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 22%, #000 78%, transparent 100%)'}}>
      <line x1={0} y1={y} x2={1080} y2={y} stroke="rgba(29,29,31,0.22)" strokeWidth={3} />
      {Array.from({length: 7}, (_, i) => {
        const x = 1200 - ((i * 240 + off) % 1440);
        return (
          <g key={i}>
            <line x1={x} y1={y + 18} x2={x} y2={y + 34} stroke="rgba(29,29,31,0.25)" strokeWidth={3} />
            <ellipse cx={x + 60} cy={y - 8} rx={16} ry={7} fill="rgba(29,29,31,0.22)" />
            <ellipse cx={x + 180} cy={y + 6} rx={16} ry={7} fill="rgba(29,29,31,0.16)" />
          </g>
        );
      })}
    </svg>
  );
};

/** Grey "other player" sprinting past behind the walker (left → right, motion blur). */
export const Sprinter: React.FC<{at: number; dy?: number; dur?: number; o?: number; scale?: number; id: string; render: (id: string, style: React.CSSProperties) => React.ReactNode}> = ({at, dy = 0, dur = 0.8, o = 0.35, scale = 0.85, id, render}) => {
  const {t} = useT();
  const k = (t - at) / dur;
  if (k < 0 || k > 1) return null;
  return <AbsoluteFill style={{opacity: o, filter: 'blur(3px)'}}>{render(id, {translate: `${-900 + k * 1800}px ${dy}px`, scale: String(scale)})}</AbsoluteFill>;
};

/** Slow, constant camera drift so no frame is ever static. */
export const Drift: React.FC<{from: number; to: number; amount?: number; children: React.ReactNode}> = ({from, to, amount = 0.035, children}) => {
  const {t} = useT();
  const k = Math.min(1, Math.max(0, (t - from) / (to - from)));
  return <AbsoluteFill style={{scale: String(1 + amount * k)}}>{children}</AbsoluteFill>;
};
