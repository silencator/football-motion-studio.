import React from 'react';
import {AbsoluteFill} from 'remotion';
import {fonts, paper, paperEase} from '../../design/tokens';
import {Capsule, Card, ChatBubble, FlyWords, PhotoCutout, PickerNumber, useT, FootballIcon} from '../../components/ios';
import {Abs, Avatar, CountUp, HeroNumber, Kicker} from './kit';
import {W} from './words';

const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const gold = 'linear-gradient(180deg, #F4D774 0%, #C9A227 55%, #8C6A12 100%)';
export const ink = `linear-gradient(180deg, #2B2B30 0%, ${paper.text} 100%)`;

/* S1 · 0.00 "In 2012, Lionel Messi scored 91 official goals." */
export const S1: React.FC = () => {
  const {p} = useT();
  const up = p(W.lionel - 0.15, 0.7, paperEase.glide);
  return (
    <AbsoluteFill>
      <Abs top={0} style={{translate: `0 ${760 - up * 560}px`, scale: String(1 - up * 0.42)}}>
        <FlyWords words={[{text: 'In', at: W.in + 0.12}, {text: '2012,', at: W.twentyTwelve + 0.1}]} size={150} />
      </Abs>
      <Abs top={430}>
        <FlyWords words={[{text: 'Lionel', at: W.lionel}, {text: 'Messi', at: W.messi}]} size={64} weight={600} color={paper.text2} />
      </Abs>
      <Abs top={560}>
        <HeroNumber text="91" at={W.ninety - 0.1} lockAt={W.one} size={560} gradient={ink} />
      </Abs>
      <PhotoCutout src="images/messi/back10.png" at={W.lionel} until={4.4} height={1240} bottom={-90} x={10} />
      <Abs top={1430}>
        <Capsule at={W.official} label="Official goals" variant="island" size={42} />
      </Abs>
    </AbsoluteFill>
  );
};

/* S2 · 4.35 "Not in a season. In a single calendar year." */
export const S2: React.FC = () => {
  const {p} = useT();
  const strike = p(W.season + 0.35, 0.45, paperEase.glide);
  const seasonOn = p(W.season, 0.5);
  const seasonOff = p(W.inA, 0.5);
  const cal = (i: number) => p(W.calendar + i * 0.045, 0.35);
  const cell = 70;
  const Row: React.FC<{label: string; row: 0 | 1}> = ({label, row}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
      <div style={{width: 100, fontFamily: fonts.text, fontSize: 32, fontWeight: 700, color: row === 1 ? paper.text : paper.text3}}>{label}</div>
      <div style={{position: 'relative', display: 'flex'}}>
        {/* season pill: Aug 2011 → May 2012 */}
        <div style={{position: 'absolute', top: 6, height: cell - 12, borderRadius: cell, background: paper.grey, left: row === 0 ? 7 * cell : 0, width: (row === 0 ? 5 : 5) * cell, opacity: seasonOn * (1 - seasonOff * 0.85), clipPath: `inset(0 ${(1 - seasonOn) * 100}% 0 0 round ${cell}px)`}} />
        {/* calendar pill: Jan → Dec 2012 */}
        {row === 1 && <div style={{position: 'absolute', top: 6, height: cell - 12, borderRadius: cell, background: paper.blue, left: 0, width: 12 * cell, clipPath: `inset(0 ${(1 - p(W.calendar, 0.8, paperEase.glide)) * 100}% 0 0 round ${cell}px)`}} />}
        {months.map((m, i) => (
          <div key={i} style={{width: cell, height: cell, display: 'grid', placeItems: 'center', position: 'relative', fontFamily: fonts.text, fontSize: 32, fontWeight: 700,
            color: row === 1 && cal(i) > 0.5 ? '#fff' : (row === 0 && i >= 7) || (row === 1 && i <= 4) ? paper.text : paper.text3}}>
            {m}
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Abs top={330}>
        <div style={{position: 'relative'}}>
          <FlyWords words={[{text: 'Not', at: W.not}, {text: 'in', at: W.not + 0.2}, {text: 'a', at: W.not + 0.36}, {text: 'season.', at: W.season}]} size={92} color={paper.text2} exitAt={W.inA - 0.1} />
          <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 8, borderRadius: 8, background: paper.text, scale: `${strike} 1`, transformOrigin: '0 50%', opacity: 1 - p(W.inA - 0.1, 0.3)}} />
        </div>
      </Abs>
      <Abs top={330}>
        <FlyWords words={[{text: 'A', at: W.inA + 0.1}, {text: 'single', at: W.single}, {text: 'calendar', at: W.calendar, color: paper.blue}, {text: 'year.', at: W.year, color: paper.blue}]} size={92} maxWidth={980} />
      </Abs>
      <Abs top={760}>
        <Card at={W.not} padding={34} radius={56}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
            <Row label="2011" row={0} />
            <Row label="2012" row={1} />
          </div>
        </Card>
      </Abs>
      <Abs top={1110}>
        <div style={{display: 'flex', gap: 20}}>
          <Capsule at={W.season + 0.15} label="Season · Aug → May" size={34} exitAt={W.inA} />
        </div>
      </Abs>
      <Abs top={1110}>
        <Capsule at={W.year} label="1 January → 31 December" variant="blue" size={34} />
      </Abs>
    </AbsoluteFill>
  );
};

/* S3 · 7.75 "Across Barcelona and Argentina, he played 69 matches." */
export const S3: React.FC = () => (
  <AbsoluteFill>
    <Abs top={300} center={false} left={90}>
      <ChatBubble at={W.barcelona} background={paper.barca.gradient} tail={paper.barca.blue} size={54}>
        <Avatar src="images/messi/striped_portrait.png" size={90} position="62% 4%" />
        FC Barcelona
      </ChatBubble>
    </Abs>
    <Abs top={500} center={false} right={90} style={{justifyContent: 'flex-end', left: 0}}>
      <ChatBubble at={W.argentina} background={paper.argentina.gradient} tail={paper.argentina.celeste} side="right" size={54}>
        Argentina
        <Avatar src="images/messi/arg_portrait.png" size={90} position="45% 4%" />
      </ChatBubble>
    </Abs>
    <Abs top={760}>
      <Card at={W.played} dark radius={72} padding={60} from="scale" style={{width: 760, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
        <Kicker at={W.played} text="Matches played · 2012" color="rgba(245,245,247,0.55)" />
        <PickerNumber from={0} to={69} start={W.played + 0.05} lockAt={W.nine} size={260} dark />
        <Kicker at={W.matches} text="Barça + Argentina" color="rgba(245,245,247,0.55)" size={26} />
      </Card>
    </Abs>
  </AbsoluteFill>
);

/* S4 · 11.85 "That's more than a goal per game." */
export const S4: React.FC = () => {
  const {p} = useT();
  const fill = p(W.more, 1.0, paperEase.glide);
  const max = 1.5;
  const track = 860;
  return (
    <AbsoluteFill>
      <Abs top={380}>
        <Capsule at={W.thats} label="91 goals ÷ 69 matches" size={36} />
      </Abs>
      <Abs top={560}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
          <CountUp to={1.32} start={W.more} end={W.per} decimals={2} size={300} />
        </div>
      </Abs>
      <Abs top={880}>
        <FlyWords words={[{text: 'goals', at: W.goal}, {text: 'per', at: W.per}, {text: 'game', at: W.game}]} size={72} color={paper.text2} weight={600} />
      </Abs>
      <Abs top={1120}>
        <div style={{position: 'relative', width: track, height: 120, opacity: p(W.thats, 0.5)}}>
          <div style={{position: 'absolute', top: 40, height: 24, width: track, borderRadius: 24, background: paper.grey}} />
          <div style={{position: 'absolute', top: 40, height: 24, width: (track * 1.32 * fill) / max, borderRadius: 24, background: paper.blue, boxShadow: '0 8px 24px rgba(10,124,255,0.35)'}} />
          <div style={{position: 'absolute', left: track / max - 2, top: 16, width: 4, height: 72, borderRadius: 4, background: paper.text}} />
          <div style={{position: 'absolute', left: track / max - 120, width: 240, top: 96, textAlign: 'center', fontFamily: fonts.text, fontSize: 26, fontWeight: 600, color: paper.text2}}>1 per game</div>
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* S5 · 13.95 "And the year was relentless." */
export const S5: React.FC = () => (
  <AbsoluteFill>
    <PhotoCutout src="images/messi/closeup.png" at={W.and - 0.05} until={16.2} height={1560} bottom={-40} x={150} from="right" drift={60} />
    <Abs top={300} center={false} left={90}>
      <FlyWords words={[{text: 'And', at: W.and}, {text: 'the', at: W.theYear}, {text: 'year', at: W.theYear + 0.2}, {text: 'was', at: W.was}]} size={64} weight={600} color={paper.text2} align="left" />
    </Abs>
    <Abs top={400} center={false} left={80} z={2}>
      <FlyWords words={[{text: 'Relentless.', at: W.relentless}]} size={168} weight={800} align="left" style={{textShadow: '0 2px 30px rgba(242,242,244,0.9)'}} />
    </Abs>
  </AbsoluteFill>
);

/* S6 · 15.95 "Seven goals in January. Ten in February. Then 13 in March." */
export const S6: React.FC = () => {
  const {p} = useT();
  const cols = [
    {m: 'January', v: 7, at: W.seven, lock: W.seven + 0.5},
    {m: 'February', v: 10, at: W.ten, lock: W.ten + 0.45},
    {m: 'March', v: 13, at: W.thirteen, lock: W.thirteen + 0.6},
  ];
  const H = 720;
  return (
    <AbsoluteFill>
      <Abs top={300}>
        <Kicker at={W.seven - 0.05} text="2012 · goals by month" />
      </Abs>
      <Abs top={420}>
        <div style={{display: 'flex', gap: 44, alignItems: 'flex-end', height: H + 330}}>
          {cols.map((c, i) => {
            const g = p(c.at - 0.05, 0.8, paperEase.arrive);
            const hi = i === 2;
            return (
              <div key={c.m} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 260, opacity: Math.min(1, g * 2)}}>
                <PickerNumber from={0} to={c.v} start={c.at} lockAt={c.lock} size={150} band={false} color={hi ? paper.blue : paper.text} />
                <div style={{width: 200, height: (H * c.v) / 13 * g, borderRadius: 48, background: hi ? `linear-gradient(180deg, #4DA3FF 0%, ${paper.blue} 100%)` : paper.island, boxShadow: hi ? '0 24px 60px rgba(10,124,255,0.35)' : '0 24px 60px rgba(0,0,0,0.18)'}} />
                <div style={{marginTop: 24, fontFamily: fonts.text, fontSize: 36, fontWeight: 600, color: hi ? paper.blue : paper.text2, opacity: p(c.at + 0.3, 0.5)}}>{c.m}</div>
              </div>
            );
          })}
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* S7 · 21.10 "But March brought something extraordinary." */
export const S7: React.FC = () => (
  <AbsoluteFill>
    <Abs top={360}>
      <Capsule at={W.march2} label="March 2012" variant="blue" size={44} />
    </Abs>
    <Abs top={580}>
      <Card at={W.brought} dark radius={72} padding={64} from="scale" style={{width: 860}}>
        <Kicker at={W.brought + 0.1} text="7 March 2012 · Camp Nou" color="rgba(245,245,247,0.55)" size={28} />
        <div style={{fontFamily: fonts.display, fontSize: 76, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 18, lineHeight: 1.05}}>Champions League</div>
        <div style={{fontFamily: fonts.text, fontSize: 38, fontWeight: 500, color: 'rgba(245,245,247,0.6)', marginTop: 10}}>Round of 16 · second leg</div>
      </Card>
    </Abs>
    <Abs top={1040}>
      <FlyWords words={[{text: 'Something', at: W.something}, {text: 'extraordinary.', at: W.extraordinary, color: paper.blue}]} size={96} maxWidth={1000} />
    </Abs>
  </AbsoluteFill>
);

/* S8 · 23.70 "Against Bayer Leverkusen, Messi scored five goals in a single Champions League match." */
export const S8: React.FC = () => {
  const {p} = useT();
  const balls = [0, 1, 2, 3, 4].map((i) => W.five + i * 0.2);
  const count = balls.filter((b) => p(b, 0.01) > 0.5).length;
  return (
    <AbsoluteFill>
      <Abs top={250}>
        <Card at={W.against} dark radius={60} padding={40} from="scale" style={{width: 900}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: fonts.display}}>
            <div style={{fontSize: 44, fontWeight: 600, width: 300}}>Barcelona</div>
            <div style={{fontSize: 96, fontWeight: 800, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', opacity: p(W.bayer, 0.5)}}>7 – 1</div>
            <div style={{fontSize: 44, fontWeight: 600, width: 300, textAlign: 'right', opacity: p(W.leverkusen - 0.1, 0.5)}}>Leverkusen</div>
          </div>
        </Card>
      </Abs>
      <PhotoCutout src="images/messi/ucl_celebrate.png" at={W.messi2 - 0.1} until={29.2} height={1260} bottom={-110} x={0} />
      <Abs top={500}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: p(W.five - 0.15, 0.3)}}>
          <div style={{fontFamily: fonts.display, fontSize: 200, fontWeight: 800, letterSpacing: '-0.05em', color: paper.text, width: 130, textAlign: 'center', lineHeight: 1}}>
            <span key={count} style={{display: 'inline-block', translate: `0 ${(1 - p(balls[Math.max(0, count - 1)], 0.25)) * 40}px`}}>{count}</span>
          </div>
          <div style={{display: 'flex', gap: 14, padding: '22px 30px', borderRadius: 999, background: paper.card, boxShadow: paper.shadow}}>
            {balls.map((b, i) => {
              const k = p(b, 0.4, paperEase.lock);
              return (
                <div key={i} style={{width: 92, height: 92, opacity: Math.min(1, k * 3), translate: `0 ${(1 - k) * 160}px`, scale: String(0.5 + 0.5 * k)}}>
                  <div style={{rotate: `${(1 - k) * -540}deg`}}>
                    <FootballIcon size={92} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Abs>
      <Abs top={1420} z={3}>
        <Capsule at={W.single2} label="in a single Champions League match" variant="island" size={36} />
      </Abs>
    </AbsoluteFill>
  );
};
