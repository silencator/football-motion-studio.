import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Star} from 'lucide-react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {Capsule, PhotoCutout, PickerNumber, useT} from '../../components/ios';
import {BigWord, Headline, Lead} from '../../components/analytics/Headline';
import {Abs, Kicker} from '../messi91/kit';
import {red} from './scenesA';
import {W, END_CARD_AT} from './words';

const img = (n: string) => `images/fouls/graded/${n}.png`;
const gold = 'linear-gradient(180deg, #F6DC86 0%, #D4AF37 50%, #8C6A12 100%)';
const night = '#F5F5F7';

/* S9 · 29.00 "In the Champions League semi-final, it was a Bayern defender who ended up on the floor." */
export const S9: React.FC = () => {
  const {p} = useT();
  const fall = p(W.floor + 0.1, 0.4, (x) => x * x);
  return (
    <AbsoluteFill>
      <Abs top={300}>
        <Capsule at={W.champions} label="Champions League · Semi-final" variant="island" size={36} icon={<Star size={40} color="#fff" strokeWidth={2.4} />} />
      </Abs>
      <Abs top={560}>
        <Lead words={[{text: 'it', at: W.itWas}, {text: 'was', at: W.itWas + 0.1}, {text: 'a', at: W.bayern - 0.1}, {text: 'Bayern', at: W.bayern}, {text: 'defender', at: W.defender}]} size={72} />
      </Abs>
      <Abs top={690}>
        <Lead words={[{text: 'who', at: W.who}, {text: 'ended', at: W.ended}, {text: 'up', at: W.up}, {text: 'on', at: W.on}, {text: 'the', at: W.on + 0.1}]} size={72} />
      </Abs>
      {/* the word stands upright, then topples flat onto the floor line */}
      <div style={{position: 'absolute', left: 330, top: 1380 - 230 * 0.95, transformOrigin: '0% 100%', rotate: `${-90 * (1 - fall)}deg`}}>
        <BigWord text="floor." at={W.floor} size={230} />
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 1380, height: 5, borderRadius: 4, background: paper.text, opacity: p(W.floor - 0.2, 0.4), scale: `${p(W.floor - 0.2, 0.6)} 1`}} />
    </AbsoluteFill>
  );
};

/* S10 · 33.20 "Most players would break." */
export const S10: React.FC = () => {
  const {p} = useT();
  const crack = p(W.break + 0.35, 0.6, paperEase.arrive);
  const half = (top: boolean): React.CSSProperties => ({
    position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
    clipPath: top ? 'polygon(0 0, 100% 0, 100% 38%, 62% 52%, 44% 44%, 0 60%)' : 'polygon(0 60%, 44% 44%, 62% 52%, 100% 38%, 100% 100%, 0 100%)',
    translate: `${(top ? -1 : 1) * crack * 6}px ${(top ? -1 : 1) * crack * 9}px`, rotate: `${(top ? -1 : 1) * crack * 1.2}deg`,
  });
  return (
    <AbsoluteFill>
      <Abs top={560}><Lead words={[{text: 'Most', at: W.most}, {text: 'players', at: W.players}, {text: 'would', at: W.would}]} size={72} /></Abs>
      <div style={{position: 'absolute', left: 0, right: 0, top: 680, height: 360}}>
        <div style={half(true)}><BigWord text="break." at={W.break} size={290} /></div>
        <div style={half(false)}><BigWord text="break." at={W.break} size={290} /></div>
        <svg style={{position: 'absolute', inset: 0}} width={1080} height={360}>
          <polyline points="0,216 475,158 670,187 1080,137" fill="none" stroke="#F2F2F4" strokeWidth={10 * crack} strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* S11 · 34.85 "Messi played all thirty-eight league games. The only outfield player who did." */
export const S11: React.FC = () => {
  const {p, t} = useT();
  const fillStart = W.played, fillEnd = W.games + 0.2;
  const n = Math.floor(Math.min(1, Math.max(0, (t - fillStart) / (fillEnd - fillStart))) * 38);
  const swap = W.theOnly - 0.1;
  const shrink = p(swap, 0.6, paperEase.arrive);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - p(swap, 0.3, paperEase.exit)}}>
        <Headline lead={[{text: 'Messi', at: W.messi2}, {text: 'played', at: W.played}, {text: 'all', at: W.all}]} />
      </div>
      <Abs top={300 + 0}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, opacity: p(W.thirty - 0.1, 0.3), translate: `0 ${-shrink * 20}px`}}>
          <span style={{fontFamily: fonts.display, fontSize: 200, fontWeight: 800, letterSpacing: '-0.06em', color: paper.text, fontVariantNumeric: 'tabular-nums'}}>{n}</span>
          <span style={{fontFamily: fonts.display, fontSize: 90, fontWeight: 700, letterSpacing: '-0.04em', color: paper.text3}}>/38</span>
        </div>
      </Abs>
      <div style={{position: 'absolute', top: 640, left: 120, width: 840, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 18}}>
        {Array.from({length: 42}, (_, i) => {
          const on = i < n;
          const valid = i < 38;
          const k = on ? Math.min(1, (t - (fillStart + (i / 38) * (fillEnd - fillStart))) / 0.25) : 0;
          return (
            <div key={i} style={{height: 104, borderRadius: 26, background: !valid ? 'transparent' : on ? paper.text : '#E3E3E8', display: 'grid', placeItems: 'center', scale: String(on ? 0.85 + 0.15 * Math.min(1, k) : 1), opacity: valid ? p(W.messi2 + i * 0.008, 0.4) : 0}}>
              {on && <svg width={40} height={40} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
          );
        })}
      </div>
      <Abs top={1360}>
        <Capsule at={W.only} label="The only outfield player" variant="island" size={36} />
      </Abs>
      <Abs top={1490}><Lead words={[{text: 'who', at: W.who2}, {text: 'did.', at: W.did2}]} size={60} /></Abs>
    </AbsoluteFill>
  );
};

/* S12 · 39.55 (night) "Then came the night that mattered most. Atlético Madrid. The title on the line." */
export const S12: React.FC = () => {
  const {p} = useT();
  const swap = W.atletico - 0.25;
  const outA = p(swap, 0.35, paperEase.exit);
  const line = p(W.line - 0.05, 0.8, paperEase.arrive);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - outA, filter: `blur(${outA * 12}px)`}}>
        <Abs top={640}><Lead words={[{text: 'Then', at: W.then}, {text: 'came', at: W.came}, {text: 'the', at: W.theN}]} size={72} color="#AEAEB2" /></Abs>
        <Abs top={740}><BigWord text="night." at={W.night} size={300} color={night} /></Abs>
        <Abs top={1100}><Lead words={[{text: 'that', at: W.thatM}, {text: 'mattered', at: W.mattered}, {text: 'most.', at: W.mostN}]} size={72} color="#AEAEB2" /></Abs>
      </div>
      {outA > 0 && (
        <>
          <Abs top={230}><Kicker at={W.atletico} text="17 May 2015 · Vicente Calderón" color="rgba(245,245,247,0.55)" size={26} /></Abs>
          <Abs top={290}><BigWord text="Atlético Madrid" at={W.atletico + 0.1} size={130} color={night} /></Abs>
          <PhotoCutout src={img('siqueira')} at={W.atletico} until={44.8} height={1300} bottom={-80} x={0} from="scale" drift={40} style={{filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))'}} />
          {/* the title line drawn across the frame */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 4, background: 'linear-gradient(90deg, transparent, #D4AF37 20%, #D4AF37 80%, transparent)', scale: `${line} 1`, opacity: line}} />
          <Abs top={590}><Lead words={[{text: 'the', at: W.theT}, {text: 'title', at: W.title}, {text: 'on', at: W.onThe}, {text: 'the', at: W.onThe + 0.12}, {text: 'line.', at: W.line}]} size={56} color="#D1D1D6" /></Abs>
        </>
      )}
    </AbsoluteFill>
  );
};

/* S13 · 44.55 (night) "Twenty-three fouls. Eight on Messi." */
export const S13: React.FC = () => {
  const {p, t} = useT();
  const drop = (i: number) => W.twentyThree - 0.1 + i * 0.045;
  const onMessi = [1, 4, 6, 9, 13, 15, 18, 21];
  const lit = p(W.eight2 - 0.05, 0.4, paperEase.arrive);
  const count8 = Math.min(8, Math.floor(Math.max(0, (t - W.eight2 + 0.05) / 0.06)));
  return (
    <AbsoluteFill>
      <Abs top={250}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          <PickerNumber from={0} to={23} start={W.twentyThree - 0.25} lockAt={W.three + 0.2} size={250} band={false} dark ticks={false} />
          <span style={{fontFamily: fonts.display, fontSize: 80, fontWeight: 700, color: 'rgba(245,245,247,0.55)', letterSpacing: '-0.03em', opacity: p(W.fouls2, 0.4)}}>fouls</span>
        </div>
      </Abs>
      <div style={{position: 'absolute', top: 880, left: 130, width: 820, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 34, justifyItems: 'center'}}>
        {Array.from({length: 23}, (_, i) => {
          const k = p(drop(i), 0.45, paperEase.arrive);
          const mine = onMessi.includes(i);
          return (
            <div key={i} style={{width: 92, height: 92, borderRadius: 92, background: mine ? `rgba(255,59,48,${lit})` : 'rgba(245,245,247,0.16)', boxShadow: mine && lit > 0 ? `0 0 ${40 * lit}px rgba(255,59,48,${0.6 * lit})` : undefined,
              border: '3px solid rgba(245,245,247,0.25)', opacity: Math.min(1, k * 2) * (mine ? 1 : 1 - lit * 0.55), translate: `0 ${(1 - k) * -120}px`, scale: String(mine ? 1 + lit * 0.08 : 1 - lit * 0.1)}} />
          );
        })}
      </div>
      <Abs top={1370}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 22, opacity: lit, filter: `blur(${(1 - lit) * 10}px)`}}>
          <span style={{fontFamily: fonts.display, fontSize: 150, fontWeight: 800, color: red, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums'}}>{count8}</span>
          <span style={{fontFamily: fonts.display, fontSize: 80, fontWeight: 700, color: night, letterSpacing: '-0.03em'}}>on Messi.</span>
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* S14 · 47.25 (dawn) "And he scored the goal that won the league." */
export const S14: React.FC = () => {
  return (
    <AbsoluteFill>
      <Abs top={250}><Lead words={[{text: 'And', at: W.and2}, {text: 'he', at: W.and2 + 0.08}, {text: 'scored', at: W.scored}, {text: 'the', at: W.goal - 0.1}, {text: 'goal', at: W.goal}]} size={64} /></Abs>
      <Abs top={340}><Lead words={[{text: 'that', at: W.thatW}, {text: 'won', at: W.won}, {text: 'the', at: W.league2 - 0.12}]} size={64} /></Abs>
      <Abs top={470}><BigWord text="league." at={W.league2} size={300} gradient={gold} /></Abs>
      <PhotoCutout src={img('pointing')} at={W.and2} until={49.6} height={1220} bottom={-70} x={0} from="below" drift={40} />
    </AbsoluteFill>
  );
};

/* S15 · 49.45 "Ninety fouls. Thirty-eight games. Zero missed." */
export const S15: React.FC = () => {
  const {p} = useT();
  const rows = [
    {from: 0, to: 90, start: W.ninety2 - 0.3, lock: W.ninety2 + 0.25, label: 'fouls', at: W.fouls3, strong: false},
    {from: 0, to: 38, start: W.thirty2 - 0.3, lock: W.thirty2 + 0.3, label: 'games', at: W.games2, strong: false},
    {from: 9, to: 0, start: W.zero - 0.35, lock: W.zero + 0.1, label: 'missed.', at: W.missed, strong: true},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 330, left: 110, display: 'flex', flexDirection: 'column', gap: 40}}>
        {rows.map((r, i) => {
          const k = p(r.start, 0.3);
          const dim = i < 2 ? p(W.zero - 0.1, 0.4) : 0;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, opacity: Math.min(1, k * 2) * (1 - dim * 0.6)}}>
              <div style={{width: 380, display: 'flex', justifyContent: 'flex-end'}}>
                <PickerNumber from={r.from} to={r.to} start={r.start} lockAt={r.lock} size={230} band={false} ticks={i < 2} color={r.strong ? red : paper.text} />
              </div>
              <span style={{fontFamily: fonts.display, fontSize: 84, fontWeight: 700, letterSpacing: '-0.035em', color: r.strong ? paper.text : paper.text2, opacity: p(r.at - 0.05, 0.4), filter: `blur(${(1 - p(r.at - 0.05, 0.4)) * 8}px)`}}>{r.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* S16 · 53.25 "Every foul was a confession. The defender had already lost." */
export const S16: React.FC = () => {
  const {p, t} = useT();
  const swap = W.theD - 0.15;
  const outA = p(swap, 0.35, paperEase.exit);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - outA, filter: `blur(${outA * 12}px)`}}>
        <Headline lead={[{text: 'Every', at: W.every2}, {text: 'foul', at: W.foul}, {text: 'was', at: W.wasA}, {text: 'a', at: W.wasA + 0.1}]} word={{text: 'confession.', at: W.confession}} top={700} size={175} />
      </div>
      {t > swap && (
        <Headline lead={[{text: 'The', at: W.theD}, {text: 'defender', at: W.defender2}, {text: 'had', at: W.hadA}, {text: 'already', at: W.already2}]} word={{text: 'lost.', at: W.lost}} top={700} size={300} />
      )}
    </AbsoluteFill>
  );
};

/* S17 · 57.25 "They followed him. They kicked him. They never stopped him." */
export const S17: React.FC = () => {
  const {p} = useT();
  const lines = [
    {text: 'They followed him.', at: W.they1, k: W.followed},
    {text: 'They kicked him.', at: W.they2, k: W.kicked},
  ];
  const dim = p(W.they3 - 0.1, 0.5);
  return (
    <AbsoluteFill>
      <PhotoCutout src={img('trophy')} at={W.they1 - 0.1} until={61.2} height={1180} bottom={-230} x={260} from="right" drift={40} />
      <div style={{position: 'absolute', top: 300, left: 80, display: 'flex', flexDirection: 'column', gap: 18, zIndex: 3}}>
        {lines.map((l) => {
          const k = p(l.at - 0.08, 0.5);
          return (
            <div key={l.text} style={{fontFamily: fonts.display, fontSize: 72, fontWeight: 700, letterSpacing: '-0.035em', color: dim > 0 ? `rgba(29,29,31,${1 - dim * 0.55})` : paper.text,
              opacity: Math.min(1, k * 2), translate: `${(1 - k) * -60}px 0`, filter: `blur(${(1 - k) * 10}px)`}}>{l.text}</div>
          );
        })}
        <div style={{marginTop: 30}}>
          <Lead words={[{text: 'They', at: W.they3}, {text: 'never', at: W.never}]} size={80} color={paper.text} align="left" />
        </div>
        <div style={{marginLeft: -6}}>
          <BigWord text="stopped him." at={W.stopped} size={150} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC = () => {
  const {p} = useT();
  const k = p(END_CARD_AT + 0.05, 1.0, paperEase.arrive);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: fonts.display, fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em', color: paper.text, opacity: k, filter: `blur(${(1 - k) * 8}px)`, translate: `0 ${(1 - k) * 14}px`}}>
        Produced by Shaljr
      </div>
    </AbsoluteFill>
  );
};

