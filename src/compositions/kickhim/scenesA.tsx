import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {fonts, paper, paperEase} from '../../design/tokens';
import {Capsule, Card, PhotoCutout, PickerNumber, useT} from '../../components/ios';
import {BigWord, Callout, Headline, Lead} from '../../components/analytics/Headline';
import {Abs, Kicker} from '../messi91/kit';
import {W} from './words';

export const red = '#FF3B30';
const img = (n: string) => `images/fouls/graded/${n}.png`;

/* S1 · 0.00 "Defenders had one plan for Lionel Messi. Follow him. And when that fails… kick him." */
export const S1: React.FC = () => {
  const {p} = useT();
  const strike = p(W.fails, 0.45, paperEase.glide);
  const row = (n: string, text: string, at: number, k2 = 0, accent = false) => {
    const k = p(at - 0.08, 0.5, paperEase.lock);
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 28, height: 112, opacity: Math.min(1, k * 2), translate: `${(1 - k) * 60}px 0`, filter: `blur(${(1 - Math.min(1, k)) * 8}px)`}}>
        <div style={{width: 64, height: 64, borderRadius: 64, border: `4px solid ${accent ? red : paper.text3}`, display: 'grid', placeItems: 'center', fontFamily: fonts.display, fontWeight: 800, fontSize: 30, color: accent ? red : paper.text2}}>{n}</div>
        <div style={{position: 'relative', fontFamily: fonts.display, fontSize: 64, fontWeight: 750, letterSpacing: '-0.035em', color: k2 > 0 ? paper.text3 : accent ? red : paper.text}}>
          {text}
          <div style={{position: 'absolute', left: -6, top: '54%', height: 7, borderRadius: 4, background: paper.text, width: `${k2 * 104}%`}} />
        </div>
      </div>
    );
  };
  const kickHit = p(W.kick - 0.05, 0.4, paperEase.lock);
  return (
    <AbsoluteFill>
      <Headline lead={[{text: 'Defenders', at: W.defenders}, {text: 'had', at: W.had}, {text: 'one', at: W.one}]} word={{text: 'plan.', at: W.plan}} exitAt={W.kick - 0.2} />
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5}}>
        <BigWord text="kick him." at={W.kick} size={210} color={red} />
      </div>
      <Abs top={640}>
        <Card at={W.for} radius={56} padding={0} style={{width: 860, overflow: 'hidden', scale: String(1 + kickHit * 0.02 - (kickHit > 0 ? 0.02 : 0))}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '36px 48px', borderBottom: `2px solid ${paper.hairline}`}}>
            <div style={{width: 92, height: 92, borderRadius: 92, overflow: 'hidden', background: '#E5E5EA', flexShrink: 0}}>
              <Img src={staticFile(img('eibar'))} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '39% 19%', scale: '3.6', transformOrigin: '39% 19%'}} />
            </div>
            <div>
              <div style={{fontFamily: fonts.text, fontSize: 26, fontWeight: 600, letterSpacing: '0.16em', color: paper.text2}}>GAME PLAN</div>
              <div style={{fontFamily: fonts.display, fontSize: 48, fontWeight: 750, letterSpacing: '-0.03em', color: paper.text, opacity: p(W.lionel - 0.1, 0.4)}}>Stop Lionel Messi</div>
            </div>
          </div>
          <div style={{padding: '24px 48px 36px'}}>
            {row('1', 'Follow him.', W.follow, strike)}
            {row('2', 'Kick him.', W.kick, 0, true)}
          </div>
        </Card>
      </Abs>
      <Abs top={1150}>
        <div style={{opacity: p(W.fails - 0.05, 0.4) * (1 - p(W.kick - 0.1, 0.3, paperEase.exit))}}>
          <Kicker at={W.fails - 0.05} text="when that fails…" size={30} />
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* S2 · 5.90 "2014–15. One season." */
export const S2: React.FC = () => {
  const {p} = useT();
  const bar = p(W.season, 1.1, paperEase.glide);
  const months = ['AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY'];
  return (
    <AbsoluteFill>
      <Abs top={560}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <PickerNumber from={2004} to={2014} start={W.twenty - 0.15} lockAt={W.fourteen + 0.15} size={250} band={false} />
          <div style={{fontFamily: fonts.display, fontSize: 250, fontWeight: 700, letterSpacing: '-0.05em', color: paper.text, opacity: p(W.fifteen - 0.1, 0.4), translate: `${(1 - p(W.fifteen - 0.1, 0.5)) * 80}px 0`, filter: `blur(${(1 - p(W.fifteen - 0.1, 0.5)) * 14}px)`, marginLeft: -20}}>–15</div>
        </div>
      </Abs>
      <Abs top={300}>
        <Lead words={[{text: 'One', at: W.oneS}, {text: 'season.', at: W.season}]} size={72} />
      </Abs>
      <Abs top={1040}>
        <div style={{width: 860, opacity: p(W.oneS, 0.4)}}>
          <div style={{height: 22, borderRadius: 22, background: '#E3E3E8', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${bar * 100}%`, borderRadius: 22, background: paper.text}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22}}>
            {months.map((m, i) => (
              <div key={m} style={{fontFamily: fonts.text, fontSize: 22, fontWeight: 600, letterSpacing: '0.08em', color: bar * 9.5 >= i ? paper.text : paper.text3}}>{m}</div>
            ))}
          </div>
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* S3 · 9.20 "Every time he turned, someone was already there." */
export const S3: React.FC = () => {
  const {p} = useT();
  // photo: 1108×856 shown at width 1060 → scale ≈ 0.957; positioned from top 760
  const sc = 1060 / 1108, ox = 10, oy = 700;
  const ring = (x: number, y: number, at: number, n: string) => {
    const k = p(at - 0.05, 0.5, paperEase.lock);
    return (
      <div key={n} style={{position: 'absolute', left: ox + x * sc - 80, top: oy + y * sc - 80, width: 160, height: 160, borderRadius: 160, border: `5px solid ${red}`, scale: String(0.4 + 0.6 * k), opacity: Math.min(1, k * 2), zIndex: 3}}>
        <div style={{position: 'absolute', right: -14, top: -14, width: 54, height: 54, borderRadius: 54, background: red, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: fonts.display, fontSize: 30, fontWeight: 800}}>{n}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Headline lead={[{text: 'Every', at: W.every}, {text: 'time', at: W.time}, {text: 'he', at: W.he}, {text: 'turned,', at: W.turned}]} word={{text: 'already there.', at: W.already}} size={160} />
      <div style={{position: 'absolute', left: ox, top: oy, width: 1060, opacity: p(W.every, 0.6), translate: `0 ${(1 - p(W.every, 0.9)) * 120}px`, filter: `blur(${(1 - p(W.every, 0.7)) * 12}px)`, scale: String(1 + p(W.every, 3, paperEase.glide) * 0.04)}}>
        <Img src={staticFile(img('madrid'))} style={{width: 1060}} />
      </div>
      {ring(282, 216, W.someone, '1')}
      {ring(543, 82, W.was, '2')}
      {ring(878, 288, W.there, '3')}
    </AbsoluteFill>
  );
};

/* S4 · 12.10 "Shirts pulled, ankles clipped, shoulders in the back." — foul map on a body */
export const S4: React.FC = () => {
  const {p, t} = useT();
  const words: [string, number][] = [['pulled.', W.pulled], ['clipped.', W.clipped], ['in the back.', W.back]];
  const cur = words.filter(([, a]) => t >= a - 0.15).length - 1;
  const spots = [
    {x: 520, y: 930, at: W.shirts, label: 'SHIRT', dx: -250, dy: -60},
    {x: 470, y: 1440, at: W.ankles, label: 'ANKLE', dx: -230, dy: -70},
    {x: 625, y: 830, at: W.shoulders, label: 'SHOULDER', dx: 200, dy: -90},
  ];
  return (
    <AbsoluteFill>
      <Abs top={190}><Kicker at={W.shirts - 0.1} text="Foul map" size={30} /></Abs>
      {words.map(([w, a], i) => (
        <Abs key={w} top={250}>
          {i === cur && <BigWord text={w} at={a} size={190} />}
        </Abs>
      ))}
      <div style={{position: 'absolute', left: 0, top: 0, opacity: p(W.shirts - 0.2, 0.6), translate: `0 ${(1 - p(W.shirts - 0.2, 0.8)) * 80}px`}}>
        <svg width={1080} height={1920}>
          <ellipse cx={540} cy={1505} rx={260} ry={20} fill="rgba(0,0,0,0.08)" />
          <g fill="#A1A1A6" stroke="#A1A1A6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx={540} cy={700} r={78} stroke="none" />
            <rect x={445} y={800} width={190} height={330} rx={70} stroke="none" />
            <path d="M462 840 L380 1010 L352 1150" fill="none" strokeWidth={56} />
            <path d="M618 840 L700 1010 L728 1150" fill="none" strokeWidth={56} />
            <path d="M500 1110 L482 1300 L470 1478" fill="none" strokeWidth={66} />
            <path d="M580 1110 L598 1300 L610 1478" fill="none" strokeWidth={66} />
          </g>
        </svg>
      </div>
      {spots.map((s, i) => {
        const k = p(s.at - 0.05, 0.5, paperEase.lock);
        const pulse = Math.max(0, Math.sin((t - s.at) * 5)) * 0.15;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: s.x - 46, top: s.y - 46, width: 92, height: 92, borderRadius: 92, background: `rgba(255,59,48,${0.18 * k})`, border: `5px solid ${red}`, scale: String((0.3 + 0.7 * k) * (1 + pulse)), opacity: Math.min(1, k * 2)}} />
            <Callout text={s.label} at={s.at + 0.1} x={s.x} y={s.y} dx={s.dx} dy={s.dy} size={28} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* S5 · 15.60 "Ninety fouls in La Liga. More than two every game." */
export const S5: React.FC = () => {
  const {p, t} = useT();
  const swap = W.more - 0.1;
  const outA = p(swap, 0.4, paperEase.exit);
  const groups = 18;
  const tallyStart = W.ninety, tallyEnd = W.inLa + 0.3;
  const shown = Math.floor(Math.min(1, Math.max(0, (t - tallyStart) / (tallyEnd - tallyStart))) * 90);
  const icons = [{at: W.two, fill: 1}, {at: W.two + 0.18, fill: 1}, {at: W.everyG, fill: 0.4}];
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - outA, filter: `blur(${outA * 12}px)`, translate: `0 ${-outA * 60}px`}}>
        <Abs top={230}>
          <PickerNumber from={0} to={90} start={W.ninety - 0.3} lockAt={W.ninety + 0.45} size={300} band={false} ticks={false} />
        </Abs>
        <Abs top={850}><Lead words={[{text: 'fouls', at: W.fouls}, {text: 'in', at: W.inLa}, {text: 'La', at: W.laLiga}, {text: 'Liga.', at: W.laLiga + 0.1}]} size={64} /></Abs>
        <div style={{position: 'absolute', top: 990, left: 110, width: 860, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', rowGap: 56, columnGap: 20}}>
          {Array.from({length: groups}, (_, g) => (
            <svg key={g} width={120} height={110} viewBox="0 0 120 110">
              {[0, 1, 2, 3].map((i) => g * 5 + i < shown && <line key={i} x1={14 + i * 26} y1={8} x2={14 + i * 26} y2={102} stroke={paper.text} strokeWidth={9} strokeLinecap="round" />)}
              {g * 5 + 4 < shown && <line x1={0} y1={86} x2={104} y2={22} stroke={red} strokeWidth={9} strokeLinecap="round" />}
            </svg>
          ))}
        </div>
      </div>
      {t > swap - 0.05 && (
        <>
          <Abs top={300}><Lead words={[{text: 'More', at: W.more}, {text: 'than', at: W.than}]} size={64} /></Abs>
          <Abs top={380}><BigWord text="2 every game." at={W.two} size={170} /></Abs>
          <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 50}}>
            {icons.map((m, i) => {
              const k = p(m.at - 0.05, 0.45, paperEase.lock);
              return (
                <div key={i} style={{position: 'relative', width: 210, height: 210, borderRadius: 210, background: '#E3E3E8', overflow: 'hidden', opacity: Math.min(1, k * 2), scale: String(0.5 + 0.5 * k)}}>
                  <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${m.fill * 100}%`, background: red}} />
                  <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: fonts.display, fontSize: 72, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em'}}>{m.fill === 1 ? '1' : '.4'}</div>
                </div>
              );
            })}
          </div>
          <Abs top={1080}><Lead words={[{text: 'fouls', at: W.everyG}, {text: 'per', at: W.everyG + 0.1}, {text: 'game', at: W.game}]} size={56} caps /></Abs>
          <Abs top={1200}><Capsule at={W.game + 0.15} label="2.4 per game · La Liga 2014–15" variant="island" size={32} /></Abs>
        </>
      )}
    </AbsoluteFill>
  );
};

/* S6 · 19.60 "So did it work?" — iOS switch that tries to turn on */
export const S6: React.FC = () => {
  const {p, t} = useT();
  const try1 = p(W.work - 0.1, 0.35, paperEase.arrive);
  const back = p(W.work + 0.5, 0.45, paperEase.glide);
  const on = try1 * 0.55 * (1 - back);
  return (
    <AbsoluteFill>
      <Headline lead={[{text: 'So', at: W.so}, {text: 'did', at: W.did}, {text: 'it', at: W.it}]} word={{text: 'work?', at: W.work}} top={420} size={240} />
      <Abs top={980}>
        <Card at={W.so} radius={48} padding={0} style={{width: 820}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 48px'}}>
            <div style={{fontFamily: fonts.display, fontSize: 46, fontWeight: 700, letterSpacing: '-0.02em', color: paper.text}}>Messi stopped</div>
            <div style={{width: 150, height: 90, borderRadius: 90, background: `rgb(${233 + (52 - 233) * on}, ${233 + (199 - 233) * on}, ${235 + (89 - 235) * on})`, boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.06)', position: 'relative'}}>
              <div style={{position: 'absolute', top: 5, left: 5 + on * 60, width: 80, height: 80, borderRadius: 80, background: '#fff', boxShadow: '0 3px 8px rgba(0,0,0,0.18)', scale: String(1 + 0.08 * Math.sin(Math.min(1, Math.max(0, t - W.work)) * Math.PI))}} />
            </div>
          </div>
        </Card>
      </Abs>
    </AbsoluteFill>
  );
};

/* S7 · 21.20 "Here's the strange part. He ran straight back at them." */
export const S7: React.FC = () => {
  const {p} = useT();
  const swap = W.he2 - 0.15;
  const outA = p(swap, 0.35, paperEase.exit);
  return (
    <AbsoluteFill>
      <div style={{opacity: 1 - outA, filter: `blur(${outA * 12}px)`}}>
        <Headline lead={[{text: "Here's", at: W.heres}, {text: 'the', at: W.the}, {text: 'strange', at: W.strange}]} word={{text: 'part.', at: W.part}} top={680} size={260} />
      </div>
      {outA > 0 && (
        <>
          <Headline lead={[{text: 'He', at: W.he2}, {text: 'ran', at: W.ran}, {text: 'straight', at: W.straight}]} word={{text: 'back at them.', at: W.back2}} size={160} />
          <PhotoCutout src={img('eibar')} at={W.he2} until={24.6} height={1250} bottom={60} x={-40} from="left" drift={60} />
          <Callout text="MESSI" at={W.at} x={300} y={1030} dx={-90} dy={-70} size={28} />
          <Callout text="THE CHASER" at={W.them} x={790} y={800} dx={-70} dy={-90} size={28} />
        </>
      )}
    </AbsoluteFill>
  );
};

/* S8 · 24.40 "4.6 completed dribbles a game. More than anyone in La Liga." */
export const S8: React.FC = () => {
  const {p, t} = useT();
  const v = Math.min(4.6, Math.max(0, ((t - W.four) / (W.six + 0.2 - W.four)) * 4.6));
  const vk = p(W.four - 0.1, 0.4);
  const rows = [1, 0.78, 0.7, 0.64, 0.57];
  return (
    <AbsoluteFill>
      <Abs top={250}>
        <div style={{fontFamily: fonts.display, fontSize: 330, fontWeight: 800, letterSpacing: '-0.06em', color: paper.text, fontVariantNumeric: 'tabular-nums', lineHeight: 0.9, opacity: vk, filter: `blur(${(1 - vk) * 18}px)`, scale: String(1.15 - 0.15 * vk)}}>{v.toFixed(1)}</div>
      </Abs>
      <Abs top={590}><Lead words={[{text: 'completed', at: W.completed}, {text: 'dribbles', at: W.dribbles}, {text: 'a', at: W.a}, {text: 'game.', at: W.game2}]} size={60} /></Abs>
      <div style={{position: 'absolute', top: 820, left: 110, width: 860, display: 'flex', flexDirection: 'column', gap: 30}}>
        {rows.map((w, i) => {
          const k = p(W.more2 + i * 0.1 - 0.1, 0.8, paperEase.arrive);
          const me = i === 0;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{width: 40, fontFamily: fonts.display, fontSize: 34, fontWeight: 800, color: me ? paper.text : paper.text3}}>{i + 1}</div>
              <div style={{flex: 1, height: 64}}>
                <div style={{height: '100%', width: `${w * k * 100}%`, borderRadius: 64, background: me ? paper.text : '#D8D8DD', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 24}}>
                  {me && <span style={{fontFamily: fonts.display, fontSize: 32, fontWeight: 700, color: '#fff', opacity: p(W.anyone, 0.4)}}>Messi · 4.6</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Abs top={1300}><Capsule at={W.laLiga2} label="#1 in La Liga · 2014–15" variant="island" size={34} /></Abs>
    </AbsoluteFill>
  );
};
