import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {interFamily} from '../../design/fonts';
import {fonts, paper, paperEase} from '../../design/tokens';
import {Capsule, FlyWords, PaperBackground, Scene, useT} from '../../components/ios';
import {Pitch} from '../../components/pitch';
import {Sfx} from '../../sfx/Sfx';
import {W} from './words';

/**
 * 5-second style test, 4:3 (1440×1080): "One touch, and the midfield is gone."
 * Rebuilt from the replay of Messi's no-look pass to Molina (Argentina v Netherlands, 2022 QF).
 * Everything is keyed to absolute narration seconds (W).
 */
export const PASS_TEST_FROM = 36.6; // narration second where the clip starts (silence before "One")
const VOICE_OUT = 41.42; // silence after "forward", before "Suddenly"
export const PASS_TEST_SEC = 5;

type P = {x: number; y: number};
const lerp = (a: P, b: P, k: number): P => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k});

// Pitch metres, attacking towards x = 105. Approximated from the high-camera replay.
const MESSI_A = {x: 70.5, y: 30.5};
const MESSI_B = {x: 75, y: 33};
const MOLINA_A = {x: 81, y: 55};
const TARGET = {x: 94, y: 42}; // where Molina WILL be
const MIDFIELD: P[] = [{x: 79, y: 15}, {x: 80, y: 25.5}, {x: 79.5, y: 41}, {x: 78.5, y: 51}];
const BACKLINE: P[] = [{x: 90, y: 21}, {x: 90.5, y: 32.5}, {x: 90, y: 47.5}, {x: 89, y: 57}];
const STEPPER = 1; // backline index that steps out
const STEP_TO = {x: 86.5, y: 35.5};
const GK = {x: 103, y: 34};

const T_PASS = W.one - 0.04; // ball leaves Messi's foot
const PASS_DUR = 1.35;

const Label: React.FC<{p: P; text: string; o: number; dy?: number; color?: string}> = ({p, text, o, dy = -2.4, color = paper.text}) => (
  <text x={p.x} y={p.y + dy} textAnchor="middle" fontFamily={fonts.text} fontWeight={700} fontSize={1.35} letterSpacing={0.22} fill={color} opacity={o}>
    {text}
  </text>
);

const Dot: React.FC<{p: P; fill: string; r?: number; o?: number; ring?: string}> = ({p, fill, r = 1.15, o = 1, ring = '#FFFFFF'}) => (
  <g opacity={o}>
    <circle cx={p.x + 0.25} cy={p.y + 0.45} r={r} fill="rgba(0,0,0,0.12)" />
    <circle cx={p.x} cy={p.y} r={r} fill={fill} stroke={ring} strokeWidth={0.32} />
  </g>
);

const Play: React.FC = () => {
  const {t, p} = useT();
  const start = PASS_TEST_FROM;

  // Players appear one after another (0.06 s stagger), then the move plays out.
  const appear = (i: number) => p(start + 0.15 + i * 0.06, 0.6);
  const carry = p(start + 0.2, T_PASS - start - 0.2, paperEase.glide);
  const messi = lerp(MESSI_A, MESSI_B, carry);
  const run = p(T_PASS - 0.7, 1.55, paperEase.glide);
  const molina = lerp(MOLINA_A, TARGET, run);
  const ballK = p(T_PASS, PASS_DUR, paperEase.arrive);
  const ball = t < T_PASS ? {x: messi.x + 0.9, y: messi.y + 0.6} : lerp({x: MESSI_B.x + 0.9, y: MESSI_B.y + 0.6}, {x: TARGET.x - 0.6, y: TARGET.y + 0.3}, ballK);
  const lane = p(T_PASS - 0.02, PASS_DUR * 0.8, paperEase.arrive);
  const ghost = p(T_PASS - 0.75, 0.5) * (1 - p(T_PASS + PASS_DUR - 0.1, 0.4));
  // "the midfield is gone": the four midfielders are left behind and fade out of the play.
  const gone = p(W.midfield - 0.05, 0.9, paperEase.glide);
  const lineSnap = p(T_PASS + 0.18, 0.35, paperEase.exit);
  // "Another defender steps forward" — too late.
  const step = p(W.steps - 0.25, 0.8, paperEase.glide);
  const late = p(W.forward + 0.1, 0.6, paperEase.glide);

  const mid = MIDFIELD.map((m) => ({x: m.x - gone * 2.2, y: m.y}));
  const back = BACKLINE.map((b, i) => (i === STEPPER ? lerp(b, STEP_TO, step) : b));
  const linePath = (pts: P[]) => pts.map((q, i) => `${i ? 'L' : 'M'}${q.x} ${q.y}`).join(' ');

  return (
    <>
      {/* Unit lines (hairline), the midfield one snaps when the ball cuts through */}
      <path d={linePath(back)} stroke={paper.text3} strokeWidth={0.18} fill="none" strokeDasharray="0.6 0.6" opacity={appear(6)} />
      <path d={linePath(mid)} stroke={paper.text3} strokeWidth={0.18} fill="none" strokeDasharray="0.6 0.6" opacity={appear(2) * (1 - lineSnap)} />

      {/* Ghost: where Molina will be */}
      <circle cx={TARGET.x} cy={TARGET.y} r={2.2 + (1 - ghost) * 1.2} fill="none" stroke={paper.blue} strokeWidth={0.22} strokeDasharray="0.7 0.5" opacity={ghost * 0.9} />

      {/* Run + pass lane */}
      <path d={`M${MOLINA_A.x} ${MOLINA_A.y} L${molina.x} ${molina.y}`} stroke={paper.blue} strokeOpacity={0.35} strokeWidth={0.22} strokeDasharray="0.5 0.5" fill="none" />
      <path
        d={`M${MESSI_B.x + 0.9} ${MESSI_B.y + 0.6} L${TARGET.x - 0.6} ${TARGET.y + 0.3}`}
        stroke={paper.blue}
        strokeWidth={0.42}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - lane}
      />

      {/* Netherlands */}
      {mid.map((m, i) => (
        <Dot key={`m${i}`} p={m} fill={paper.text} o={appear(i) * (1 - gone * 0.82)} />
      ))}
      {back.map((b, i) => (
        <Dot key={`b${i}`} p={b} fill={paper.text} o={appear(4 + i) * (i === STEPPER ? 1 - late * 0.6 : 1)} />
      ))}
      <Dot p={GK} fill={paper.text2} o={appear(8)} />

      {/* Argentina */}
      <Dot p={molina} fill={paper.blue} r={1.3} o={appear(9)} />
      <Label p={molina} text="MOLINA" o={appear(9)} color={paper.blue} />
      <Dot p={messi} fill={paper.blue} r={1.45} o={appear(10)} />
      <Label p={messi} text="MESSI" o={appear(10)} color={paper.blue} dy={-2.6} />

      {/* Ball */}
      <circle cx={ball.x} cy={ball.y} r={0.62} fill="#FFFFFF" stroke={paper.text} strokeWidth={0.2} opacity={appear(10)} />
    </>
  );
};

const PassScene: React.FC = () => {
  const {p} = useT();
  const s = PASS_TEST_FROM;
  // Slow cinematic push-in and drift with the ball.
  const push = p(s, PASS_TEST_SEC, paperEase.glide);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: -40, right: -40, top: 280, bottom: 0, overflow: 'hidden', perspective: 1500, maskImage: 'linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)'}}>
        <div style={{position: 'absolute', left: '50%', top: 0, translate: `${-600 - push * 36}px ${-560 - push * 16}px`, rotate: `x ${56 - push * 4}deg`, scale: String(1 + push * 0.06), transformOrigin: '50% 50%'}}>
          <Pitch width={1200} view={[62, 7, 43, 54]} drawDuration={1.0} lineColor="rgba(29,29,31,0.20)" surface="none" lineWidth={0.16}>
            <Play />
          </Pitch>
        </div>
      </div>

      {/* Type: kicker + the spoken line, top-left */}
      <div style={{position: 'absolute', left: 96, top: 88, right: 96}}>
        <div style={{fontFamily: fonts.text, fontSize: 22, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: paper.text2, opacity: p(s + 0.1, 0.7), filter: `blur(${(1 - p(s + 0.1, 0.7)) * 6}px)`, marginBottom: 18}}>
          Argentina v Netherlands · 2022
        </div>
        <FlyWords align="left" size={84} maxWidth={1250} words={[{text: 'One', at: W.one}, {text: 'touch,', at: W.touch}]} />
        <FlyWords
          align="left"
          size={84}
          maxWidth={1250}
          words={[
            {text: 'and', at: W.and},
            {text: 'the', at: W.the},
            {text: 'midfield', at: W.midfield},
            {text: 'is', at: W.is},
            {text: 'gone.', at: W.gone, color: paper.text3},
          ]}
        />
      </div>

      <div style={{position: 'absolute', right: 96, top: 92}}>
        <Capsule at={W.another - 0.05} size={26} variant="island" label={<span>4 opponents <span style={{color: '#8E8E93'}}>out of the game</span></span>} />
      </div>
    </AbsoluteFill>
  );
};

export const PassTest: React.FC = () => {
  const {fps} = useVideoConfig();
  const s = PASS_TEST_FROM;
  return (
    <AbsoluteFill style={{fontFamily: interFamily}}>
      <PaperBackground />
      <Audio src={staticFile('audio/messi-pass.mp3')} trimBefore={Math.round(s * fps)} trimAfter={Math.round(VOICE_OUT * fps)} />
      {/* Shift the timeline so narration second `s` lands on frame 0. */}
      <Sequence from={-Math.round(s * fps)} layout="none">
        <Scene from={s} to={s + PASS_TEST_SEC + 1} enter="blur" exit="none" name="Pass">
          <PassScene />
        </Scene>
        <Sfx at={s + 0.05} name="whoosh-soft" volume={0.2} />
        <Sfx at={T_PASS} name="kick" volume={0.45} />
        <Sfx at={T_PASS + 0.05} name="whoosh-fast" volume={0.22} />
        <Sfx at={W.midfield - 0.05} name="whoosh-low" volume={0.26} />
        <Sfx at={W.gone} name="impact-soft" volume={0.34} />
        <Sfx at={W.another - 0.08} name="pop" volume={0.26} />
      </Sequence>
    </AbsoluteFill>
  );
};
