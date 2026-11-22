import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Globe, Phone, PhoneOff, Trophy} from 'lucide-react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {Capsule, Card, FlyWords, PhotoCutout, PickerNumber, useT} from '../../components/ios';
import {Kicker} from '../messi91/kit';
import {W} from './words';

/**
 * Layout at 1440×1080 (4:3). Rule for this film: text and player never share space.
 * Text lives in a column (LEFT_COL or RIGHT_COL); the cut-out sits on the opposite side
 * with ≥ 110 px of clear paper between them.
 */
export const LEFT = 96;
export const COL_W = 500;
export const RIGHT_X = 1440 - 96 - COL_W;

export const Col: React.FC<{x?: number; top: number; w?: number; z?: number; children: React.ReactNode; align?: 'left' | 'center'}> = ({x = LEFT, top, w = COL_W, z = 2, children, align = 'left'}) => (
  <div style={{position: 'absolute', left: x, top, width: w, zIndex: z, display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : 'center'}}>{children}</div>
);

export const goldText = 'linear-gradient(180deg, #F6DC86 0%, #D4AF37 50%, #8C6A12 100%)';

/* S1 · 0.00 "What if one decision had changed the course of Neymar's entire career?" */
export const S1: React.FC = () => (
  <AbsoluteFill>
    <PhotoCutout src="images/neymar/brazil_young.png" at={W.had - 0.2} until={5.2} height={840} bottom={-40} x={400} from="right" drift={40} />
    <Col top={200}>
      <FlyWords words={[{text: 'What', at: W.what + 0.1}, {text: 'if', at: W.if + 0.1}]} size={132} weight={800} align="left" maxWidth={COL_W + 60} />
      <FlyWords words={[{text: 'one', at: W.one}, {text: 'decision', at: W.decision, color: paper.blue}]} size={96} weight={800} align="left" maxWidth={COL_W + 60} />
      <div style={{height: 40}} />
      <FlyWords
        words={[
          {text: 'changed', at: W.changed}, {text: 'the', at: W.changed + 0.3}, {text: 'course', at: W.course},
          {text: 'of', at: W.neymars - 0.15}, {text: 'his', at: W.neymars}, {text: 'entire', at: W.entire}, {text: 'career?', at: W.career},
        ]}
        size={48} weight={600} color={paper.text2} align="left" maxWidth={460}
      />
    </Col>
  </AbsoluteFill>
);

/* S2 · 4.90 "In 2012, at just 20, Neymar was already Brazil's brightest hope." */
export const S2: React.FC = () => (
  <AbsoluteFill>
    <PhotoCutout src="images/neymar/santos_look.png" at={W.in1} until={10.3} height={1000} bottom={-60} x={440} from="right" drift={50} />
    <Col top={180}>
      <Capsule at={W.y2012} label="2012" variant="island" size={34} />
      <div style={{height: 50}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 28, height: 240}}>
        <PickerNumber from={14} to={20} start={W.at1} lockAt={W.twenty + 0.25} size={230} band={false} />
        <div style={{marginTop: 40}}>
          <Kicker at={W.twenty} text="years old" size={30} />
        </div>
      </div>
      <div style={{height: 70}} />
      <FlyWords words={[{text: 'Already', at: W.already}]} size={44} weight={600} color={paper.text2} align="left" />
      <div style={{height: 10}} />
      <FlyWords words={[{text: "Brazil's", at: W.brazils}, {text: 'brightest', at: W.brightest}, {text: 'hope.', at: W.hope, color: paper.blue}]} size={78} weight={800} align="left" maxWidth={COL_W} />
    </Col>
  </AbsoluteFill>
);

/* S3 · 10.00 "At Santos, he wasn't just a footballer. He was a phenomenon." — the line morphs */
export const S3: React.FC = () => {
  const {p} = useT();
  const morph = p(W.he2 + 0.05, 0.6, paperEase.glide);
  return (
    <AbsoluteFill>
      <PhotoCutout src="images/neymar/santos_smile.png" at={W.at2 - 0.05} until={14.4} height={960} bottom={-50} x={-420} from="left" drift={40} />
      <Col x={RIGHT_X} top={250}>
        <Capsule at={W.santos} label="Santos FC" variant="island" size={34} />
      </Col>
      <Col x={RIGHT_X} top={400}>
        <div style={{position: 'relative', width: COL_W, height: 360}}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - morph, filter: `blur(${morph * 18}px)`, scale: String(1 - morph * 0.06), transformOrigin: '0 30%'}}>
            <FlyWords words={[{text: 'Not', at: W.wasnt}, {text: 'just', at: W.wasnt + 0.4}, {text: 'a', at: W.footballer - 0.15}, {text: 'footballer.', at: W.footballer}]} size={84} weight={800} align="left" maxWidth={COL_W} />
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: morph, filter: `blur(${(1 - morph) * 18}px)`, scale: String(1.06 - morph * 0.06), transformOrigin: '0 30%'}}>
            <div style={{fontFamily: fonts.display, fontSize: 44, fontWeight: 600, color: paper.text2, letterSpacing: '-0.02em', marginBottom: 6}}>He was</div>
            <FlyWords words={[{text: 'a', at: W.phenomenon - 0.2}, {text: 'phenomenon.', at: W.phenomenon, color: paper.blue}]} size={76} weight={800} align="left" maxWidth={COL_W} />
          </div>
        </div>
      </Col>
    </AbsoluteFill>
  );
};

/* S4 · 14.20 "His dribbling was unpredictable, his confidence limitless, and the impossible seemed effortless." */
export const S4: React.FC = () => {
  const {p} = useT();
  const rows = [
    {k: 'Dribbling', v: 'Unpredictable', at: W.dribbling, vat: W.unpredictable},
    {k: 'Confidence', v: 'Limitless', at: W.confidence, vat: W.limitless},
    {k: 'The impossible', v: 'Effortless', at: W.impossible, vat: W.effortless},
  ];
  return (
    <AbsoluteFill>
      <PhotoCutout src="images/neymar/santos_dribble.png" at={W.dribbling - 0.25} until={20.6} height={1030} bottom={-30} x={420} from="right" drift={60} />
      <div style={{position: 'absolute', left: LEFT, top: 210, display: 'flex', flexDirection: 'column', gap: 30, zIndex: 2}}>
        {rows.map((r, i) => {
          const k = p(r.at - 0.15, 0.65, paperEase.arrive);
          const v = p(r.vat - 0.1, 0.55, paperEase.arrive);
          const last = i === rows.length - 1;
          return (
            <div key={r.k} style={{width: 560, height: 190, borderRadius: 48, background: paper.card, boxShadow: paper.shadow, padding: '0 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
              opacity: Math.min(1, k * 1.6), translate: `0 ${(1 - k) * 90}px`, filter: `blur(${(1 - k) * 12}px)`}}>
              <div style={{fontFamily: fonts.text, fontSize: 28, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: paper.text2}}>{r.k}</div>
              <div style={{fontFamily: fonts.display, fontSize: 68, fontWeight: 800, letterSpacing: '-0.04em', color: last ? paper.blue : paper.text, marginTop: 6,
                opacity: v, filter: `blur(${(1 - v) * 12}px)`, translate: `${(1 - v) * 40}px 0`}}>
                {r.v}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* S5 · 20.45 "He had conquered South America, winning the Copa Libertadores." */
export const S5: React.FC = () => {
  const {p} = useT();
  const shine = p(W.libertadores + 0.2, 1.2, paperEase.glide);
  return (
    <AbsoluteFill>
      <PhotoCutout src="images/neymar/santos_run.png" at={W.conquered - 0.4} until={24.3} height={1040} bottom={-40} x={-430} from="left" drift={40} />
      <Col x={RIGHT_X - 20} top={190} w={COL_W + 20}>
        <FlyWords words={[{text: 'Conquered', at: W.conquered}]} size={44} weight={600} color={paper.text2} align="left" />
        <div style={{height: 14}} />
        <Capsule at={W.south} label="South America" icon={<Globe size={40} color={paper.text} strokeWidth={2.2} />} size={40} />
      </Col>
      <Col x={RIGHT_X - 20} top={470} w={COL_W + 20}>
        <Card at={W.winning} radius={56} padding={48} style={{width: COL_W + 20}}>
          <div style={{width: 104, height: 104, borderRadius: 32, background: '#FBF5E3', display: 'grid', placeItems: 'center'}}>
            <Trophy size={58} color={paper.gold} strokeWidth={2.2} />
          </div>
          <div style={{marginTop: 26}}>
            <FlyWords words={[{text: 'Copa', at: W.copa}, {text: 'Libertadores', at: W.libertadores}]} size={60} weight={800} align="left" maxWidth={COL_W} />
          </div>
          <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{fontFamily: fonts.text, fontSize: 30, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: p(W.libertadores + 0.3, 0.5),
              backgroundImage: `linear-gradient(100deg, #8C6A12 ${shine * 140 - 40}%, #F6DC86 ${shine * 140 - 20}%, #8C6A12 ${shine * 140}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>
              Champions · 2011
            </div>
          </div>
        </Card>
      </Col>
    </AbsoluteFill>
  );
};

/* S6 · 24.15 "But Neymar dreamed bigger: the World Cup, the Ballon d'Or, and a place among the greatest ever." */
export const DreamList: React.FC<{at: number; items: {t: string; at: number}[]; dim?: number; highlight?: number; exitAt?: number}> = ({at, items, dim = 0, highlight = -1, exitAt}) => {
  const {p} = useT();
  return (
    <Card at={at} radius={52} padding={0} exitAt={exitAt} style={{width: 720, overflow: 'hidden'}}>
      <div style={{padding: '34px 48px 18px', fontFamily: fonts.display, fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', color: paper.blue}}>Dreams</div>
      {items.map((it, i) => {
        const k = p(it.at - 0.12, 0.55, paperEase.arrive);
        const hl = i === highlight;
        return (
          <div key={it.t} style={{display: 'flex', alignItems: 'center', gap: 30, padding: '26px 48px', borderTop: `2px solid ${paper.hairline}`,
            opacity: Math.min(1, k * 1.6) * (hl ? 1 : 1 - dim * 0.7), translate: `${(1 - k) * 60}px 0`, filter: `blur(${(1 - k) * 10}px)`}}>
            <div style={{width: 50, height: 50, borderRadius: 50, border: `3.5px solid ${hl ? paper.text : 'rgba(29,29,31,0.3)'}`, flexShrink: 0}} />
            <div style={{fontFamily: fonts.display, fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', color: paper.text}}>{it.t}</div>
          </div>
        );
      })}
    </Card>
  );
};

export const dreams = [
  {t: 'World Cup', at: W.world},
  {t: "Ballon d'Or", at: W.ballon},
  {t: 'Among the greatest ever', at: W.greatest},
];

export const S6: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center'}}>
    <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <FlyWords words={[{text: 'He', at: W.neymar2}, {text: 'dreamed', at: W.dreamed}, {text: 'bigger.', at: W.bigger, color: paper.blue}]} size={96} weight={800} maxWidth={1200} />
    </div>
    <div style={{position: 'absolute', top: 340, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <DreamList at={W.bigger + 0.2} items={dreams} />
    </div>
  </AbsoluteFill>
);

/* S7 · 30.70 "Then Barcelona came calling." — an incoming call, tapped to accept */
export const S7: React.FC = () => {
  const {p, t} = useT();
  const tap = W.calling + 0.35;
  const cur = p(W.came - 0.1, 0.55, paperEase.glide);
  const press = p(tap, 0.12) * (1 - p(tap + 0.14, 0.25));
  const accepted = p(tap + 0.05, 0.4);
  const ring = (n: number) => ((t - W.barcelona + n * 0.5) % 1.5) / 1.5;
  const CX = 1000;
  return (
    <AbsoluteFill>
      <Col top={330}>
        <FlyWords words={[{text: 'Then', at: W.then}]} size={50} weight={600} color={paper.text2} align="left" />
        <div style={{height: 8}} />
        <FlyWords words={[{text: 'Barcelona', at: W.barcelona, color: paper.barca.garnet}]} size={92} weight={800} align="left" />
        <FlyWords words={[{text: 'came', at: W.came}, {text: 'calling.', at: W.calling}]} size={92} weight={800} align="left" />
      </Col>
      <div style={{position: 'absolute', left: CX - 220, top: 120}}>
        <Card at={W.then + 0.1} dark radius={64} padding={0} from="scale" style={{width: 440, height: 840, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{marginTop: 70, fontFamily: fonts.text, fontSize: 26, fontWeight: 500, color: 'rgba(245,245,247,0.55)'}}>{accepted > 0.5 ? '00:01' : 'incoming call…'}</div>
          <div style={{position: 'relative', marginTop: 70, width: 190, height: 190}}>
            {[0, 1, 2].map((n) => {
              const r = ring(n);
              return t > W.barcelona && accepted < 0.5 ? (
                <div key={n} style={{position: 'absolute', inset: 0, borderRadius: 999, border: '3px solid rgba(255,255,255,0.5)', scale: String(1 + r * 0.8), opacity: (1 - r) * 0.6}} />
              ) : null;
            })}
            <div style={{position: 'absolute', inset: 0, borderRadius: 999, background: paper.barca.gradient, display: 'grid', placeItems: 'center', fontFamily: fonts.display, fontSize: 62, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em'}}>FCB</div>
          </div>
          <div style={{marginTop: 50, fontFamily: fonts.display, fontSize: 54, fontWeight: 700, letterSpacing: '-0.03em'}}>FC Barcelona</div>
          <div style={{marginTop: 8, fontFamily: fonts.text, fontSize: 26, color: 'rgba(245,245,247,0.55)'}}>Spain · mobile</div>
          <div style={{marginTop: 'auto', marginBottom: 80, display: 'flex', gap: 120}}>
            <div style={{width: 110, height: 110, borderRadius: 110, background: '#FF3B30', display: 'grid', placeItems: 'center', opacity: 1 - accepted * 0.8}}>
              <PhoneOff size={46} color="#fff" strokeWidth={2.4} />
            </div>
            <div style={{width: 110, height: 110, borderRadius: 110, background: paper.green, display: 'grid', placeItems: 'center', scale: String(1 - press * 0.12 + accepted * 0.05)}}>
              <Phone size={46} color="#fff" strokeWidth={2.4} />
            </div>
          </div>
        </Card>
      </div>
      {/* cursor glides to Accept and taps */}
      <div style={{position: 'absolute', left: CX + 115 + (1 - cur) * 200, top: 880 + (1 - cur) * 160, width: 54, height: 54, borderRadius: 54, background: 'rgba(255,255,255,0.75)', border: '2px solid rgba(0,0,0,0.25)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)', opacity: Math.min(1, cur * 2) * (1 - p(tap + 0.4, 0.3)), scale: String(1 - press * 0.3), zIndex: 3}} />
    </AbsoluteFill>
  );
};

/* S8 · 33.00 "In 2013, he left Santos." */
export const S8: React.FC = () => {
  const {p} = useT();
  const arrow = p(W.left + 0.1, 0.6, paperEase.glide);
  return (
    <AbsoluteFill>
      <PhotoCutout src="images/neymar/wave.png" at={W.in2} until={35.5} height={1010} bottom={-50} x={420} from="right" drift={40} />
      <Col top={200}>
        <div style={{height: 220, display: 'flex', alignItems: 'center'}}>
          <PickerNumber from={2012} to={2013} start={W.in2} lockAt={W.y2013 + 0.3} size={200} band={false} />
        </div>
        <div style={{height: 70}} />
        <FlyWords words={[{text: 'He', at: W.left - 0.2}, {text: 'left', at: W.left}, {text: 'Santos.', at: W.santos2}]} size={88} weight={800} align="left" maxWidth={COL_W} />
        <div style={{height: 50}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Capsule at={W.left} label="Santos" size={34} />
          <div style={{width: 70, height: 4, borderRadius: 4, background: paper.text, scale: `${arrow} 1`, transformOrigin: '0 50%', opacity: arrow}} />
          <Capsule at={W.santos2 + 0.1} label="Barcelona" background={paper.barca.gradient} color="#fff" size={34} />
        </div>
      </Col>
    </AbsoluteFill>
  );
};
