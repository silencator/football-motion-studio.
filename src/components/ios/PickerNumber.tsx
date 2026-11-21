import React from 'react';
import {Sequence, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useSceneOffset, useT} from './scene';

/**
 * iOS picker-wheel number (reference timer picker): values roll on a 3D cylinder from `from` to `to`
 * and lock on the selection band at `lockAt`. Optional tick SFX on each integer crossing.
 */
export const PickerNumber: React.FC<{
  from: number;
  to: number;
  start: number; // abs seconds roll begins
  lockAt: number; // abs seconds value lands
  size?: number;
  color?: string;
  band?: boolean;
  dark?: boolean;
  ticks?: boolean;
  suffix?: string;
  pad?: number;
}> = ({from, to, start, lockAt, size = 220, color, band = true, dark = false, ticks = true, suffix, pad = 0}) => {
  const {t} = useT();
  const {fps: vfps} = useVideoConfig();
  const offFrames = Math.round(useSceneOffset() * vfps);
  const dur = Math.max(0.1, lockAt - start);
  const lin = Math.min(1, Math.max(0, (t - start) / dur));
  const e = paperEase.arrive(lin);
  const v = from + (to - from) * e;
  const rowH = size * 1.02;
  const c = color ?? (dark ? paper.islandText : paper.text);
  const base = Math.round(v);
  // After the value locks, neighbours fade away so only the result remains.
  const settled = Math.min(1, Math.max(0, (t - lockAt - 0.1) / 0.5));
  const rows = [];
  for (let n = base - 3; n <= base + 3; n++) {
    if (n < Math.min(from, to) || n > Math.max(from, to) + 1) continue; // never show values below the start (e.g. −1)
    const d = n - v;
    const ad = Math.abs(d);
    rows.push(
      <div key={n} style={{position: 'absolute', left: 0, right: 0, top: '50%', height: rowH, marginTop: -rowH / 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
        translate: `0 ${Math.sin(Math.max(-1.4, Math.min(1.4, d * 0.42))) * rowH * 2.1}px`, rotate: `x ${-d * 24}deg`, scale: String(1 - Math.min(0.5, ad * 0.16)), opacity: Math.max(0, 1 - ad * 0.38) * (ad > 0.5 ? 1 - settled : 1),
        filter: ad > 0.05 ? `blur(${Math.min(6, ad * 1.6)}px)` : undefined}}>
        {String(n).padStart(pad, '0')}
      </div>,
    );
  }
  // Integer crossings → tick sounds (deterministic, computed from the easing).
  const tickFrames: number[] = [];
  if (ticks && to !== from) {
    const steps = Math.abs(to - from);
    const stride = Math.max(1, Math.ceil(steps / 24)); // cap ~24 ticks
    for (let k = stride; k <= steps; k += stride) {
      const target = k / steps; // fraction of eased progress
      let lo = 0, hi = 1;
      for (let it = 0; it < 30; it++) { const mid = (lo + hi) / 2; if (paperEase.arrive(mid) < target) lo = mid; else hi = mid; }
      tickFrames.push(Math.round((start + hi * dur) * vfps));
    }
  }
  return (
    <div style={{position: 'relative', display: 'inline-flex', alignItems: 'center'}}>
      <div style={{position: 'relative', width: size * 0.62 * String(Math.max(Math.abs(to), Math.abs(from))).length + size * 0.1, height: rowH * 2.2, perspective: size * 6, fontFamily: fonts.display, fontSize: size, fontWeight: 700, letterSpacing: '-0.05em', color: c, fontVariantNumeric: 'tabular-nums',
        maskImage: 'linear-gradient(180deg, transparent 0%, #000 28%, #000 72%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 28%, #000 72%, transparent 100%)'}}>
        {band && <div style={{position: 'absolute', left: -size * 0.12, right: -size * 0.12, top: '50%', height: rowH * 0.92, marginTop: -rowH * 0.46, borderRadius: size * 0.28, background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(29,29,31,0.06)', opacity: 1 - settled, scale: String(1 + 0.04 * Math.sin(Math.min(1, Math.max(0, (t - lockAt) / 0.35)) * Math.PI))}} />}
        {rows}
      </div>
      {suffix && <span style={{fontFamily: fonts.display, fontSize: size * 0.32, fontWeight: 600, color: dark ? 'rgba(245,245,247,0.6)' : paper.text2, marginLeft: size * 0.12, alignSelf: 'center'}}>{suffix}</span>}
      {tickFrames.map((f, i) => (
        <Sequence key={i} from={f - offFrames} durationInFrames={6} layout="none">
          <Audio src={staticFile('sfx/tick.wav')} volume={0.22} />
        </Sequence>
      ))}
    </div>
  );
};

