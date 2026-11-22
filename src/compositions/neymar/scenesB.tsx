import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Trophy} from 'lucide-react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {Capsule, FlyWords, PhotoCutout, useT} from '../../components/ios';
import {HeroNumber, Kicker} from '../messi91/kit';
import {COL_W, Col} from './scenesA';
import {W} from './words';

const blaugrana = `linear-gradient(180deg, ${paper.barca.blue} 0%, ${paper.barca.garnet} 100%)`;

/* S9 · 35.35 "He won the Champions League, formed one of football's most feared attacking trios, and became a global superstar." */
export const S9: React.FC = () => {
  const swap = W.formed - 0.15;
  return (
    <AbsoluteFill>
      {/* Phase A — the trophy */}
      <PhotoCutout src="images/neymar/ucl_kiss.png" at={35.4} until={swap} height={1030} bottom={-50} x={430} from="right" drift={30} exitAt={swap} />
      <Col top={300}>
        <FlyWords words={[{text: 'He', at: W.won - 0.2}, {text: 'won', at: W.won}, {text: 'the', at: W.won + 0.25}]} size={46} weight={600} color={paper.text2} align="left" exitAt={swap} />
        <div style={{height: 10}} />
        <FlyWords words={[{text: 'Champions', at: W.champions}, {text: 'League.', at: W.league}]} size={96} weight={800} align="left" maxWidth={COL_W} exitAt={swap} />
        <div style={{height: 34}} />
        <Capsule at={W.league + 0.1} label="Berlin · 2015" icon={<Trophy size={34} color={paper.gold} strokeWidth={2.4} />} size={32} exitAt={swap} />
      </Col>
      {/* Phase B — MSN */}
      <PhotoCutout src="images/neymar/trio.png" at={W.formed} until={42.7} height={820} bottom={-40} x={370} from="right" drift={50} />
      <Col top={190} w={430}>
        <FlyWords words={[{text: 'The', at: W.most - 0.2}, {text: 'most', at: W.most}, {text: 'feared', at: W.feared}, {text: 'trio.', at: W.trios}]} size={66} weight={800} align="left" maxWidth={430} />
      </Col>
      <Col top={420} w={430}>
        <HeroNumber text="122" at={W.attacking} lockAt={W.trios + 0.15} size={230} gradient={blaugrana} />
        <div style={{marginTop: 18}}>
          <Kicker at={W.trios + 0.1} text="goals together · 2014–15" size={24} />
        </div>
      </Col>
      <Col top={800} w={430}>
        <Capsule at={W.global} label="Global superstar" variant="island" size={36} />
      </Col>
    </AbsoluteFill>
  );
};

/* S10 · 42.55 "Yet the Ballon d'Or never came." — the empty place */
export const S10: React.FC = () => {
  const {p, t} = useT();
  const draw = p(W.ballon2 - 0.1, 1.1, paperEase.glide);
  const breathe = 1 + 0.015 * Math.sin((t - 42.6) * 2.2);
  const C = 2 * Math.PI * 128;
  return (
    <AbsoluteFill>
      <PhotoCutout src="images/neymar/brazil_drink.png" at={W.yet - 0.1} until={45.2} height={1060} bottom={-60} x={470} from="right" drift={30} />
      <Col top={150}>
        <div style={{position: 'relative', width: 280, height: 280, scale: String(breathe)}}>
          <svg width={280} height={280} style={{position: 'absolute', inset: 0}}>
            <circle cx={140} cy={140} r={128} fill="none" stroke="rgba(29,29,31,0.28)" strokeWidth={4} strokeDasharray="14 14" strokeDashoffset={C * (1 - draw)} style={{strokeDasharray: `${C * draw} ${C}`}} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: p(W.ballon2, 0.8) * 0.35}}>
            <Trophy size={120} color={paper.text} strokeWidth={1.2} />
          </div>
        </div>
      </Col>
      <Col top={500}>
        <FlyWords words={[{text: 'Yet', at: W.yet}, {text: 'the', at: W.yet + 0.3}, {text: 'Ballon', at: W.ballon2}, {text: "d'Or", at: W.ballon2 + 0.35}]} size={78} weight={800} align="left" maxWidth={COL_W + 40} />
        <FlyWords words={[{text: 'never', at: W.never}, {text: 'came.', at: W.came2}]} size={78} weight={800} color={paper.text3} align="left" maxWidth={COL_W} />
      </Col>
      <Col top={790}>
        <Capsule at={W.never + 0.2} label="Best finish · 3rd (2015, 2017)" size={30} />
      </Col>
    </AbsoluteFill>
  );
};

/* S11 · 44.95 "So what if he had stayed? Could he have become the greatest Brazilian player of his generation?" */
export const S11: React.FC = () => {
  const swap = W.could - 0.2;
  return (
    <AbsoluteFill>
      <PhotoCutout src="images/neymar/santos_portrait.png" at={W.so - 0.1} until={50.6} height={990} bottom={-40} x={450} from="right" drift={50} />
      <Col top={240}>
        <FlyWords words={[{text: 'So', at: W.so}]} size={46} weight={600} color={paper.text2} align="left" exitAt={swap} />
        <div style={{height: 10}} />
        <FlyWords words={[{text: 'What', at: W.whatIf}, {text: 'if', at: W.whatIf + 0.3}, {text: 'he', at: W.stayed - 0.4}, {text: 'had', at: W.stayed - 0.22}]} size={100} weight={800} align="left" maxWidth={COL_W} exitAt={swap} />
        <FlyWords words={[{text: 'stayed?', at: W.stayed, color: paper.blue}]} size={130} weight={800} align="left" exitAt={swap} />
      </Col>
      <Col top={250}>
        <FlyWords words={[{text: 'Could', at: W.could}, {text: 'he', at: W.could + 0.2}, {text: 'have', at: W.could + 0.36}, {text: 'become', at: W.become1}]} size={46} weight={600} color={paper.text2} align="left" maxWidth={COL_W} />
        <div style={{height: 14}} />
        <FlyWords words={[{text: 'The', at: W.greatest2 - 0.2}, {text: 'greatest', at: W.greatest2}, {text: 'Brazilian', at: W.brazilian}, {text: 'of', at: W.generation - 0.3}, {text: 'his', at: W.generation - 0.15}, {text: 'generation?', at: W.generation, color: paper.blue}]}
          size={80} weight={800} align="left" maxWidth={COL_W} />
      </Col>
    </AbsoluteFill>
  );
};

/* S12 · 50.40 "Could Santos have been the place where he fulfilled his biggest dream? Or was leaving Brazil the decision that changed everything?"
 * The fork in the road: a dashed "stayed" path that never happened, and the solid path he took. */
export const S12: React.FC = () => {
  const {p} = useT();
  const stem = p(W.could2 - 0.1, 0.6, paperEase.glide);
  const up = p(W.santos3, 1.2, paperEase.glide);
  const down = p(W.leaving - 0.1, 1.0, paperEase.glide);
  const hl = p(W.changed2, 0.7);
  const q1Out = p(W.or - 0.25, 0.4, paperEase.exit);
  const node = p(W.decision2 - 0.1, 0.5, paperEase.lock);
  const F = {x: 520, y: 600};
  const A = {x: 1060, y: 380};
  const B = {x: 1060, y: 820};
  const upPath = `M ${F.x} ${F.y} C ${F.x + 260} ${F.y}, ${A.x - 300} ${A.y}, ${A.x} ${A.y}`;
  const downPath = `M ${F.x} ${F.y} C ${F.x + 260} ${F.y}, ${B.x - 300} ${B.y}, ${B.x} ${B.y}`;
  return (
    <AbsoluteFill>
      {/* questions */}
      <div style={{position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - q1Out, filter: `blur(${q1Out * 12}px)`}}>
        <FlyWords words={[{text: 'Could', at: W.could2}, {text: 'Santos', at: W.santos3}, {text: 'have', at: W.santos3 + 0.4}, {text: 'been', at: W.place2 - 0.2}, {text: 'the', at: W.place2 - 0.1}, {text: 'place?', at: W.place2}]} size={70} weight={800} maxWidth={1250} />
      </div>
      <div style={{position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <FlyWords words={[{text: 'Or', at: W.or}, {text: 'was', at: W.or + 0.3}, {text: 'leaving', at: W.leaving}, {text: 'the', at: W.decision2 - 0.2}, {text: 'decision?', at: W.decision2, color: paper.blue}]} size={70} weight={800} maxWidth={1250} />
      </div>
      {/* diagram */}
      <svg width={1440} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={160} y1={F.y} x2={160 + (F.x - 160) * stem} y2={F.y} stroke={paper.text} strokeWidth={6} strokeLinecap="round" />
        <defs>
          <clipPath id="upReveal"><rect x={F.x - 10} y={0} width={(A.x - F.x + 20) * up} height={1080} /></clipPath>
        </defs>
        <path d={upPath} fill="none" stroke="rgba(29,29,31,0.4)" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 18" clipPath="url(#upReveal)" />
        <path d={downPath} fill="none" stroke={hl > 0 ? paper.blue : paper.text} strokeOpacity={1} strokeWidth={6 + hl * 2} strokeLinecap="round" pathLength={1} strokeDasharray={`${down} 1`}
          style={{filter: hl > 0 ? `drop-shadow(0 0 ${hl * 14}px rgba(10,124,255,0.55))` : undefined}} />
        <circle cx={160} cy={F.y} r={14 * stem} fill={paper.text} />
        <circle cx={F.x} cy={F.y} r={16 + node * 8} fill={node > 0 ? paper.blue : paper.text} opacity={stem} />
        <circle cx={F.x} cy={F.y} r={16 + node * 40} fill="none" stroke={paper.blue} strokeWidth={3} opacity={node * (1 - p(W.decision2 + 0.4, 0.8))} />
      </svg>
      {/* labels */}
      <div style={{position: 'absolute', left: 110, top: F.y + 34}}>
        <Kicker at={W.could2} text="2013" size={28} />
      </div>
      <div style={{position: 'absolute', left: A.x + 34, top: A.y - 50}}>
        <Capsule at={W.santos3 + 0.6} label="Stay · Santos" size={32} />
        <div style={{marginTop: 22, marginLeft: 8}}>
          <Kicker at={W.biggest} text="Biggest dream?" size={26} color={paper.text2} />
        </div>
      </div>
      <div style={{position: 'absolute', left: B.x + 34, top: B.y - 50}}>
        <Capsule at={W.brazil} label="Leave · Europe" background={paper.barca.gradient} color="#fff" size={32} />
        <div style={{marginTop: 22, marginLeft: 8}}>
          <Kicker at={W.everything} text="Changed everything" size={26} color={paper.blue} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* S13 · 57.75 "We'll never know. Maybe Neymar's greatest unanswered question isn't what he achieved, but what he could have become." */
export const S13: React.FC = () => {
  const {p} = useT();
  const swap = W.maybe - 0.15;
  const strike = p(W.but2 - 0.05, 0.5, paperEase.glide);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 440, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <FlyWords words={[{text: "We'll", at: W.well}, {text: 'never', at: W.never2}, {text: 'know.', at: W.know}]} size={120} weight={800} exitAt={swap} maxWidth={1300} />
      </div>
      <PhotoCutout src="images/neymar/brazil_young.png" at={W.maybe} until={65.4} height={860} bottom={-40} x={400} from="right" drift={50} />
      <Col top={200}>
        <FlyWords words={[{text: 'Maybe', at: W.maybe}, {text: 'his', at: W.neymars2}, {text: 'greatest', at: W.greatest3}, {text: 'unanswered', at: W.unanswered}, {text: 'question', at: W.question}]} size={44} weight={600} color={paper.text2} align="left" maxWidth={COL_W} />
      </Col>
      <Col top={380}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <FlyWords words={[{text: "isn't", at: W.isnt}, {text: 'what', at: W.isnt + 0.4}, {text: 'he', at: W.isnt + 0.55}, {text: 'achieved,', at: W.achieved}]} size={48} weight={700} color={strike > 0.5 ? paper.text3 : paper.text} style={{opacity: 1 - strike * 0.35}} align="left" maxWidth={600} />
        </div>
      </Col>
      <Col top={540}>
        <FlyWords words={[{text: 'but', at: W.but2}, {text: 'what', at: W.but2 + 0.24}, {text: 'he', at: W.could3 - 0.24}, {text: 'could', at: W.could3}, {text: 'have', at: W.could3 + 0.28}]} size={88} weight={800} align="left" maxWidth={COL_W} />
        <FlyWords words={[{text: 'become.', at: W.become, color: paper.blue}]} size={120} weight={800} align="left" />
      </Col>
    </AbsoluteFill>
  );
};

/* End card · Apple-style sign-off after the narration. */
export const END_AT = 65.55;
export const EndCard: React.FC = () => {
  const {p} = useT();
  const k = p(END_AT + 0.05, 1.0, paperEase.arrive);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: fonts.display, fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: paper.text, opacity: k, filter: `blur(${(1 - k) * 8}px)`, translate: `0 ${(1 - k) * 14}px`}}>
        Produced by Shaljr
      </div>
    </AbsoluteFill>
  );
};

