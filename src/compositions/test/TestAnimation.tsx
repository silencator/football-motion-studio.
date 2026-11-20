import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {z} from 'zod';
import {colors, gradients} from '../../design/tokens';
import {interFamily} from '../../design/fonts';
import {useLayout} from '../../design/useLayout';
import {planScenes, smoothEnvelopeAt, narrationTimingSchema, type NarrationTiming} from '../../audio/narration';
import {Pulse} from '../../audio/AudioReactive';
import {
  AnimatedText, CinematicTitle, Football3D, GradientBackground, Kicker, PassArrow, Pitch, PlayerDot, Scene3D, StatCounter, T,
} from '../../components';

export const testSchema = z.object({
  title: z.string(),
  narration: z.string(),
  timing: narrationTimingSchema.optional(),
});
type Props = z.infer<typeof testSchema>;

const SceneLevel: React.FC<{timing: NarrationTiming; offset: number; children: React.ReactNode}> = ({timing, offset, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Pulse level={smoothEnvelopeAt(timing, frame + offset, fps)} amount={0.035} glow={colors.accent}>{children}</Pulse>;
};

export const TestAnimation: React.FC<Props> = ({title, narration, timing}) => {
  const {fps} = useVideoConfig();
  const {s, vertical, width} = useLayout();
  if (!timing) return null;
  const plan = planScenes(timing, fps, {minSceneSec: 1.5});
  const tDur = T.blur.timing(fps).getDurationInFrames({fps});
  // Each scene is lengthened by the transition overlap so scene N+1 starts exactly on its narration cue.
  const dur = (i: number) => plan[i].durationInFrames + (i < plan.length - 1 ? tDur : 0);

  return (
    <AbsoluteFill style={{fontFamily: interFamily, background: colors.ink}}>
      <GradientBackground />
      <Audio src={staticFile(`audio/${narration}`)} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={dur(0)}>
          <CinematicTitle kicker="System Check" title={title} subtitle="Remotion · Three.js · GSAP · FFmpeg" durationInFrames={dur(0) + tDur} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={T.blur.presentation} timing={T.blur.timing(fps)} />
        <TransitionSeries.Sequence durationInFrames={dur(1)}>
          <AbsoluteFill style={{flexDirection: vertical ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: s(120)}}>
            <SceneLevel timing={timing} offset={plan[1].from}>
              <StatCounter value={91} label="Goals in a calendar year" gradient={gradients.goldText} align={vertical ? 'center' : 'left'} delay={0.2 * fps} />
            </SceneLevel>
            <Pitch width={vertical ? width * 0.78 : s(860)} portrait={vertical} delay={0.1 * fps} tilt={vertical ? 0 : 18}>
              <PlayerDot x={30} y={40} label="8" delay={0.6 * fps} />
              <PlayerDot x={62} y={22} label="10" delay={0.75 * fps} />
              <PlayerDot x={88} y={36} label="9" delay={0.9 * fps} />
              <PassArrow from={[30, 40]} to={[62, 22]} curve={0.15} delay={1.0 * fps} />
              <PassArrow from={[62, 22]} to={[88, 36]} curve={-0.2} delay={1.5 * fps} color={colors.gold} />
            </Pitch>
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={T.blur.presentation} timing={T.blur.timing(fps)} />
        <TransitionSeries.Sequence durationInFrames={dur(2)}>
          <Final />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s, vertical} = useLayout();
  const t = frame / fps;
  return (
    <AbsoluteFill>
      <Scene3D cameraZ={vertical ? 7.5 : 6}>
        <Football3D rotation={[0.4 + t * 0.3, t * 1.1, 0.1]} position={[0, vertical ? 0.8 : 0.35, 0]} scale={(vertical ? 0.62 : 1) * (1 + Math.min(1, t / 1.2) * 0.15)} />
      </Scene3D>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: s(vertical ? 420 : 150), gap: s(18)}}>
        <Kicker text="Environment" delay={0.2 * fps} />
        <AnimatedText text="Ready to render." variant="h1" align="center" delay={0.35 * fps} gradient={gradients.accentText} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
