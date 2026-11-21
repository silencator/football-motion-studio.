import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Trophy, Star, Shield, Globe} from 'lucide-react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {Capsule, Card, FlyWords, PhotoCutout, PickerNumber, SearchBar, useT} from '../../components/ios';
import {Abs, HeroNumber, Kicker} from './kit';
import {ink} from './scenesA';
import {W} from './words';

const gold = 'linear-gradient(180deg, #F6DC86 0%, #D4AF37 50%, #8C6A12 100%)';
const blaugrana = `linear-gradient(180deg, ${paper.barca.blue} 0%, ${paper.barca.garnet} 100%)`;

/* S9 · 29.00 "He was scoring everywhere. La Liga, the Champions League, domestic cups, and international football." */
export const S9: React.FC = () => {
  const {p} = useT();
  const rows = [
    {label: 'La Liga', v: 59, at: W.laLiga, icon: <Trophy size={40} color={paper.barca.garnet} strokeWidth={2.4} />},
    {label: 'Champions League', v: 13, at: W.championsLeague, icon: <Star size={40} color={paper.blue} strokeWidth={2.4} />},
    {label: 'Domestic cups', v: 7, at: W.domestic, icon: <Shield size={40} color={paper.gold} strokeWidth={2.4} />},
    {label: 'Argentina', v: 12, at: W.international, icon: <Globe size={40} color={paper.argentina.celeste} strokeWidth={2.4} />},
  ];
  return (
    <AbsoluteFill>
      <Abs top={280} center={false} left={90}>
        <FlyWords words={[{text: 'Scoring', at: W.scoring}, {text: 'everywhere.', at: W.everywhere}]} size={110} align="left" />
      </Abs>
      <PhotoCutout src="images/messi/away_point.png" at={W.he} until={35.4} height={1280} bottom={-120} x={-250} from="left" drift={30} />
      <div style={{position: 'absolute', right: 130, top: 600, display: 'flex', flexDirection: 'column', gap: 26, zIndex: 2}}>
        {rows.map((r) => {
          const k = p(r.at - 0.08, 0.55, paperEase.lock);
          return (
            <div key={r.label} style={{width: 600, height: 140, borderRadius: 44, background: 'rgba(255,255,255,0.94)', boxShadow: paper.shadow, display: 'flex', alignItems: 'center', padding: '0 36px', gap: 24,
              opacity: Math.min(1, k * 2), translate: `${(1 - k) * 120}px 0`, scale: String(0.9 + 0.1 * k), filter: `blur(${(1 - Math.min(1, k)) * 10}px)`}}>
              <div style={{width: 76, height: 76, borderRadius: 24, background: '#F2F2F7', display: 'grid', placeItems: 'center'}}>{r.icon}</div>
              <div style={{flex: 1, fontFamily: fonts.text, fontSize: 36, fontWeight: 600, color: paper.text, letterSpacing: '-0.02em'}}>{r.label}</div>
              <div style={{fontFamily: fonts.display, fontSize: 64, fontWeight: 800, color: paper.text, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums'}}>{r.v}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* S10 · 35.15 "Barcelona contributed 79 goals. Argentina added another 12." */
export const S10: React.FC = () => {
  const {p} = useT();
  const swap = W.argentina2 - 0.25;
  const outA = p(swap, 0.4, paperEase.exit);
  return (
    <AbsoluteFill>
      {/* Barça */}
      <PhotoCutout src="images/messi/striped_portrait.png" at={W.barcelona2 - 0.1} until={38.2} height={1380} bottom={-100} x={230} from="right" exitAt={swap} />
      <div style={{position: 'absolute', left: 90, top: 330, opacity: 1 - outA, translate: `${-outA * 120}px 0`, filter: `blur(${outA * 12}px)`}}>
        <Capsule at={W.barcelona2} label="FC Barcelona" background={paper.barca.gradient} color="#fff" size={40} />
        <div style={{marginTop: 30, marginLeft: -20}}>
          <PickerNumber from={0} to={79} start={W.contributed} lockAt={W.nine2} size={330} band={false} color={paper.barca.blue} />
        </div>
        <div style={{marginTop: -10}}>
          <Kicker at={W.goals3} text="goals for Barça" size={32} />
        </div>
      </div>
      {/* Argentina */}
      <PhotoCutout src="images/messi/arg_back.png" at={W.argentina2 - 0.05} until={40.4} height={1360} bottom={-90} x={-240} from="left" />
      <div style={{position: 'absolute', right: 90, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
        <Capsule at={W.argentina2 + 0.05} label="Argentina" background={paper.argentina.gradient} color="#fff" size={40} />
        <div style={{marginTop: 30, marginRight: -20}}>
          {p(W.argentina2 - 0.1, 0.01) > 0 && <PickerNumber from={0} to={12} start={W.added} lockAt={W.twelve} size={330} band={false} color="#3D87C9" />}
        </div>
        <div style={{marginTop: -10}}>
          <Kicker at={W.twelve} text="for Argentina" size={32} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* S11 · 40.20 "And with every goal, the record moved further out of reach." */
export const S11: React.FC = () => {
  const {p} = useT();
  const merge = p(W.every - 0.1, 0.5, paperEase.glide);
  const run = p(W.record, W.reach - W.record + 0.3, paperEase.glide);
  return (
    <AbsoluteFill>
      <Abs top={560}>
        <div style={{position: 'relative', width: 1080, height: 420}}>
          <div style={{position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40, alignItems: 'center', opacity: 1 - merge, filter: `blur(${merge * 14}px)`, scale: String(1 - merge * 0.25)}}>
            <span style={{fontFamily: fonts.display, fontSize: 220, fontWeight: 800, color: paper.barca.blue, letterSpacing: '-0.05em', translate: `${merge * 200}px 0`}}>79</span>
            <span style={{fontFamily: fonts.display, fontSize: 120, fontWeight: 600, color: paper.text3}}>+</span>
            <span style={{fontFamily: fonts.display, fontSize: 220, fontWeight: 800, color: '#3D87C9', letterSpacing: '-0.05em', translate: `${-merge * 200}px 0`}}>12</span>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <HeroNumber text="91" at={W.every} lockAt={W.goal2} size={440} gradient={`linear-gradient(90deg, ${paper.barca.blue} 0%, ${paper.barca.garnet} 50%, #3D87C9 100%)`} />
          </div>
        </div>
      </Abs>
      {/* the record line running away */}
      <div style={{position: 'absolute', top: 1110, left: 90, right: 0, height: 120, opacity: p(W.record - 0.1, 0.4)}}>
        <div style={{position: 'absolute', top: 54, left: 0, height: 6, borderRadius: 6, width: 300 + run * 1400, background: `linear-gradient(90deg, ${paper.text} 0%, ${paper.blue} 100%)`}} />
        <div style={{position: 'absolute', top: 0, left: 220 + run * 1400}}>
          <Capsule at={W.record} label="Record" variant="island" size={34} />
        </div>
      </div>
      <Abs top={1300}>
        <FlyWords words={[{text: 'Further', at: W.further}, {text: 'out', at: W.out}, {text: 'of', at: W.out + 0.15}, {text: 'reach.', at: W.reach}]} size={64} weight={600} color={paper.text2} />
      </Abs>
    </AbsoluteFill>
  );
};

/* S12 · 43.80 "The previous benchmark belonged to Gerd Müller, who scored 85 goals in 1972." */
export const S12: React.FC = () => (
  <AbsoluteFill>
    <Abs top={320}>
      <FlyWords words={[{text: 'The', at: W.previous - 0.05}, {text: 'previous', at: W.previous}, {text: 'benchmark', at: W.benchmark}]} size={70} weight={600} color={paper.text2} />
    </Abs>
    <Abs top={560}>
      <Card at={W.gerd - 0.2} radius={72} padding={64} style={{width: 880, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <FlyWords words={[{text: 'Gerd', at: W.gerd}, {text: 'Müller', at: W.muller}]} size={100} />
        <div style={{marginTop: 8}}>
          <Kicker at={W.muller + 0.2} text="Bayern Munich · West Germany" size={26} />
        </div>
        <div style={{marginTop: 16}}>
          <PickerNumber from={0} to={85} start={W.scored3} lockAt={W.five2} size={260} color={paper.muller.tone} suffix="goals" />
        </div>
        <div style={{marginTop: 18}}>
          <Capsule at={W.nineteen} label="1972" background="#F2F2F7" size={40} />
        </div>
      </Card>
    </Abs>
  </AbsoluteFill>
);

/* S13 · 49.30 "Forty years later? Messi went beyond it." */
export const S13: React.FC = () => {
  const {p} = useT();
  const bars = p(W.messi3 - 0.1, 0.5);
  const grow = p(W.messi3, W.beyond - W.messi3 + 0.15, paperEase.glide);
  const L = 620; // px for 91 (clear of TikTok's right rail)
  const mullerW = (L * 85) / 91;
  const beyond = p(W.beyond, 0.4, paperEase.lock);
  return (
    <AbsoluteFill>
      <Abs top={300}>
        <Kicker at={W.forty} text="40 years later" />
      </Abs>
      <Abs top={360}>
        <PickerNumber from={1972} to={2012} start={W.forty} lockAt={W.later + 0.1} size={210} />
      </Abs>
      <div style={{position: 'absolute', left: 120, top: 980, width: 860, opacity: bars}}>
        {[
          {name: 'Gerd Müller · 1972', v: 85, w: mullerW, bg: '#B5B5BB', k: 1},
          {name: 'Lionel Messi · 2012', v: 91, w: L * grow, bg: paper.barca.gradient, k: grow},
        ].map((b, i) => (
          <div key={i} style={{marginBottom: 54}}>
            <div style={{fontFamily: fonts.text, fontSize: 32, fontWeight: 600, color: i ? paper.text : paper.text2, marginBottom: 14}}>{b.name}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <div style={{height: 64, width: Math.max(64, b.w), borderRadius: 64, background: b.bg, boxShadow: i ? '0 16px 40px rgba(165,0,68,0.3)' : undefined}} />
              <div style={{fontFamily: fonts.display, fontSize: 64, fontWeight: 800, color: i ? paper.text : paper.text2, fontVariantNumeric: 'tabular-nums', scale: String(i ? 1 + 0.12 * Math.sin(beyond * Math.PI) : 1)}}>
                {i ? Math.round(b.v * grow) : b.v}
              </div>
            </div>
          </div>
        ))}
        {/* Müller's line */}
        <div style={{position: 'absolute', left: mullerW, top: 40, width: 4, height: 240, borderRadius: 4, background: paper.text, opacity: 0.6}} />
      </div>
      <Abs top={1430}>
        <FlyWords words={[{text: 'Messi', at: W.messi3}, {text: 'went', at: W.went}, {text: 'beyond', at: W.beyond, color: paper.barca.garnet}, {text: 'it.', at: W.beyond + 0.3}]} size={76} />
      </Abs>
    </AbsoluteFill>
  );
};

/* S14 · 52.30 "91 goals. 69 appearances. One calendar year." */
export const S14: React.FC = () => {
  const {p} = useT();
  const rows = [
    {n: '91', l: 'goals', at: W.ninety2},
    {n: '69', l: 'appearances', at: W.sixty2},
    {n: '1', l: 'calendar year', at: W.one2},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 100, top: 380, right: 100}}>
        {rows.map((r, i) => {
          const k = p(r.at - 0.1, 0.6);
          const next = i < rows.length - 1 ? p(rows[i + 1].at - 0.1, 0.5) : 0;
          return (
            <div key={r.n} style={{display: 'flex', alignItems: 'baseline', gap: 34, padding: '34px 0', borderBottom: i < 2 ? `2px solid ${paper.hairline}` : undefined, opacity: Math.min(1, k * 1.5) * (1 - next * 0.45),
              translate: `${(1 - k) * -80}px 0`, filter: `blur(${(1 - k) * 12}px)`}}>
              <span style={{fontFamily: fonts.display, fontSize: 290, fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.9, color: paper.text, width: 380}}>{r.n}</span>
              <span style={{fontFamily: fonts.display, fontSize: 72, fontWeight: 600, letterSpacing: '-0.03em', color: i === 2 ? paper.blue : paper.text2}}>{r.l}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* S15 · 57.30 "So how do you even explain a year like that?" */
export const S15: React.FC = () => (
  <AbsoluteFill>
    <PhotoCutout src="images/messi/goal_lookup.png" at={W.so - 0.05} until={60.4} height={1420} bottom={-110} x={60} drift={50} />
    <Abs top={360} z={2}>
      <SearchBar at={W.so} width={900} size={50}
        words={[{text: 'How', at: W.how}, {text: 'to', at: W.do}, {text: 'explain', at: W.explain}, {text: '2012?', at: W.year3}]} />
    </Abs>
  </AbsoluteFill>
);

/* S16 · 60.20 "Movement, precision, consistency, and a finishing ability that seemed to have no limit." */
export const S16: React.FC = () => {
  const {p} = useT();
  const words = [
    {t: 'Movement.', at: W.movement},
    {t: 'Precision.', at: W.precision},
    {t: 'Consistency.', at: W.consistency},
    {t: 'Finishing.', at: W.finishing},
  ];
  const limit = p(W.no - 0.05, 0.9, paperEase.glide);
  return (
    <AbsoluteFill>
      <PhotoCutout src="images/messi/arg_portrait.png" at={W.movement - 0.1} until={66} height={1350} bottom={-120} x={250} from="right" drift={40} />
      <div style={{position: 'absolute', left: 90, top: 300, zIndex: 2}}>
        {words.map((w, i) => {
          const k = p(w.at - 0.1, 0.5);
          const nxt = i < words.length - 1 ? p(words[i + 1].at - 0.1, 0.4) : 0;
          const gone = p(W.no - 0.25, 0.35, paperEase.exit);
          return (
            <div key={w.t} style={{fontFamily: fonts.display, fontSize: 104, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.08, color: paper.text,
              opacity: Math.min(1, k * 1.6) * (1 - nxt * 0.72) * (1 - gone), translate: `${(1 - k) * -90}px ${(1 - k) * 40 - gone * 40}px`, filter: `blur(${(1 - k) * 14 + gone * 12}px)`}}>
              {w.t}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 90, top: 360, zIndex: 2}}>
        <FlyWords words={[{text: 'No', at: W.no}, {text: 'limit.', at: W.limit, color: paper.blue}]} size={170} align="left" />
        <div style={{marginTop: 18, height: 8, borderRadius: 8, width: limit * 1200, background: `linear-gradient(90deg, ${paper.blue} 0%, rgba(10,124,255,0) 100%)`}} />
      </div>
    </AbsoluteFill>
  );
};

/* S17 · 65.85 "Messi didn't just break a record. He created a number that still feels impossible." */
export const S17: React.FC = () => {
  const {p} = useT();
  const swap = W.created - 0.3;
  return (
    <AbsoluteFill>
      <Abs top={270}>
        <FlyWords words={[{text: 'Messi', at: W.messi4}, {text: "didn't", at: W.didnt}, {text: 'just', at: W.just}, {text: 'break', at: W.break}, {text: 'a', at: W.break + 0.2}, {text: 'record.', at: W.record2}]} size={62} weight={700} maxWidth={900} exitAt={swap} />
      </Abs>
      <Abs top={270}>
        <FlyWords words={[{text: 'He', at: W.created - 0.12}, {text: 'created', at: W.created}, {text: 'a', at: W.number - 0.15}, {text: 'number', at: W.number}]} size={62} weight={700} maxWidth={900} />
      </Abs>
      <Abs top={430}>
        <HeroNumber text="91" at={W.number - 0.15} lockAt={W.number + 0.35} size={600} gradient={gold} />
      </Abs>
      <PhotoCutout src="images/messi/ballon_dor.png" at={W.messi4} until={71.4} height={1280} bottom={-80} x={0} drift={30} />
      <Abs top={1250} z={3}>
        <Capsule at={W.still - 0.2} label="2012" variant="island" size={46} />
      </Abs>
      <Abs top={1400} z={3}>
        <div style={{opacity: p(W.still, 0.4), padding: '14px 30px', borderRadius: 999, background: 'rgba(242,242,244,0.85)'}}>
          <FlyWords words={[{text: 'that', at: W.still - 0.25}, {text: 'still', at: W.still}, {text: 'feels', at: W.feels}, {text: 'impossible.', at: W.impossible}]} size={50} weight={600} color={paper.text} />
        </div>
      </Abs>
    </AbsoluteFill>
  );
};
