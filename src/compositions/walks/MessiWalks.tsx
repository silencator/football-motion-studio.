import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {interFamily} from '../../design/fonts';
import {PaperBackground, Scene} from '../../components/ios';
import {Sfx} from '../../sfx/Sfx';
import {Halftone} from './kit';
import {Hook, WorksForHim, HipsAndEye, Mapping, POV} from './scenesA';
import {Pep, MindMap, PartTheyHate, Invisible, HalfSecond, Goal, FiveSeconds, FindsHim, Ghost, EndCard} from './scenesB';
import {W} from './words';

/** "Messi walks on purpose" — analytics series, white/grey paper look. Narration is the master clock. */
export const MESSIWALKS_DURATION_SEC = 68.2;

export const MessiWalks: React.FC = () => (
  <AbsoluteFill style={{fontFamily: interFamily}}>
    <PaperBackground grain={0.07} />
    <Halftone color="rgba(0,0,0,0.5)" opacity={0.06} />
    <Scene from={0} to={7.28} enter="none" exit="blur" name="S1 hook · walks · subbed"><Hook /></Scene>
    <Scene from={7.28} to={10.68} enter="blur" exit="rise" name="S2 works for him"><WorksForHim /></Scene>
    <Scene from={10.68} to={16.4} enter="rise" exit="zoom" name="S3 hips · eye scan"><HipsAndEye /></Scene>
    <Scene from={16.4} to={19.7} enter="zoom" exit="blur" name="S4 mapping"><Mapping /></Scene>
    <Scene from={19.7} to={24.8} enter="blur" exit="rise" name="S5 POV reads"><POV /></Scene>
    <Scene from={24.8} to={29.0} enter="rise" exit="blur" name="S6 Pep · first minutes"><Pep /></Scene>
    <Scene from={29.0} to={33.3} enter="blur" exit="slide" name="S7 inside his head"><MindMap /></Scene>
    <Scene from={33.3} to={35.55} enter="slide" exit="blur" name="S8 part they hate"><PartTheyHate /></Scene>
    <Scene from={35.55} to={39.95} enter="blur" exit="blur" name="S9 invisible"><Invisible /></Scene>
    <Scene from={39.95} to={42.95} enter="blur" exit="zoom" name="S10 half a second"><HalfSecond /></Scene>
    <Scene from={42.95} to={48.25} enter="zoom" exit="blur" name="S11 goal"><Goal /></Scene>
    <Scene from={48.25} to={53.85} enter="blur" exit="rise" name="S12 five seconds"><FiveSeconds /></Scene>
    <Scene from={53.85} to={58.9} enter="rise" exit="blur" name="S13 finds him"><FindsHim /></Scene>
    <Scene from={58.9} to={65.35} enter="blur" exit="blur" name="S14 ghost"><Ghost /></Scene>
    <Scene from={65.6} to={MESSIWALKS_DURATION_SEC + 1} enter="none" exit="none" name="End card"><EndCard /></Scene>

    <Audio src={staticFile('audio/messi-walks.mp3')} />

    {/* Sound design — no music. Cues sit on the motion. */}
    <Sfx at={0.0} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.ball} name="impact-soft" volume={0.4} />
    <Sfx at={2.75} name="whoosh-fast" volume={0.18} />
    <Sfx at={W.he - 0.15} name="click" volume={0.28} />
    <Sfx at={W.he - 0.1} name="whoosh-low" volume={0.35} />
    {[3.75, 4.25, 4.75, 5.25, 5.75].map((at) => <Sfx key={at} at={at} name="tick" volume={0.1} />)}
    <Sfx at={W.subbed - 0.35} name="pop" volume={0.26} />
    <Sfx at={W.subbed} name="whoosh-fast" volume={0.24} />
    <Sfx at={7.25} name="whoosh-soft" volume={0.2} />
    <Sfx at={8.5} name="whoosh-low" volume={0.22} />
    <Sfx at={9.75} name="impact-soft" volume={0.32} />
    <Sfx at={10.65} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.hips} name="pop" volume={0.22} />
    <Sfx at={W.head - 0.15} name="click" volume={0.28} />
    <Sfx at={W.head - 0.1} name="whoosh-low" volume={0.35} />
    {[W.left, W.right, W.behind, W.leftAgain].map((at) => <Sfx key={at} at={at - 0.12} name="whoosh-fast" volume={0.13} />)}
    {[W.left, W.right, W.behind, W.leftAgain].map((at) => <Sfx key={`c${at}`} at={at} name="click" volume={0.24} />)}
    <Sfx at={16.38} name="whoosh-soft" volume={0.2} />
    {[16.7, 17.0, 17.3, 17.6].map((at) => <Sfx key={at} at={at} name="whoosh-fast" volume={0.08} />)}
    {Array.from({length: 8}, (_, i) => <Sfx key={`m${i}`} at={W.mapping + i * 0.07} name="tick" volume={0.12} />)}
    <Sfx at={19.68} name="whoosh-low" volume={0.25} />
    <Sfx at={W.tired} name="pop" volume={0.22} />
    <Sfx at={W.space} name="pop" volume={0.22} />
    <Sfx at={23.3} name="kick" volume={0.2} />
    <Sfx at={W.drifts} name="pop" volume={0.22} />
    <Sfx at={24.78} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.barcelona} name="impact-soft" volume={0.28} />
    <Sfx at={26.4} name="pop" volume={0.2} />
    {Array.from({length: 9}, (_, i) => <Sfx key={`r${i}`} at={W.first + i * 0.25} name="tick" volume={0.09} />)}
    <Sfx at={28.98} name="whoosh-soft" volume={0.2} />
    {Array.from({length: 5}, (_, i) => <Sfx key={`g${i}`} at={W.already + i * 0.16} name="tick" volume={0.12} />)}
    <Sfx at={W.willBe} name="click" volume={0.3} />
    <Sfx at={33.25} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.hate} name="impact" volume={0.42} />
    <Sfx at={35.5} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.invisible} name="whoosh-low" volume={0.25} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`s${i}`} at={38.2 + i * 0.32} name="click" volume={0.2} />)}
    <Sfx at={39.9} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.look} name="whoosh-fast" volume={0.18} />
    {[0, 1, 2, 3, 4].map((i) => <Sfx key={`h${i}`} at={W.half + i * 0.12} name="tick" volume={0.16} />)}
    <Sfx at={42.92} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.touch} name="kick" volume={0.34} />
    <Sfx at={W.escape - 0.1} name="whoosh-fast" volume={0.26} />
    <Sfx at={W.shoot} name="kick" volume={0.42} />
    <Sfx at={W.shoot + 0.02} name="whoosh-fast" volume={0.22} />
    <Sfx at={W.net - 0.03} name="net" volume={0.42} />
    <Sfx at={W.net} name="impact" volume={0.5} />
    <Sfx at={48.22} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.energy + 0.8} name="pop" volume={0.22} />
    <Sfx at={50.7} name="whoosh-low" volume={0.22} />
    <Sfx at={W.five} name="impact-soft" volume={0.38} />
    <Sfx at={53.82} name="whoosh-soft" volume={0.2} />
    {[54.3, 54.8, 55.3].map((at) => <Sfx key={at} at={at} name="whoosh-fast" volume={0.1} />)}
    <Sfx at={56.05} name="whoosh-low" volume={0.3} />
    <Sfx at={W.finds} name="impact" volume={0.48} />
    <Sfx at={58.85} name="whoosh-soft" volume={0.2} />
    <Sfx at={60.5} name="whoosh-low" volume={0.3} />
    <Sfx at={W.dont} name="impact-soft" volume={0.32} />
    <Sfx at={61.85} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.ghost} name="whoosh-soft" volume={0.3} />
  </AbsoluteFill>
);
