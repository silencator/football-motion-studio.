import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {interFamily} from '../../design/fonts';
import {PaperBackground, Scene} from '../../components/ios';
import {Sfx} from '../../sfx/Sfx';
import {S1, S2, S3, S4, S5, S6, S7, S8} from './scenesA';
import {S9, S10, S11, S12, S13, S14, S15, S16, S17, EndCard} from './scenesB';
import {W} from './words';

/** "Messi's 91 goals in 2012" — vertical 1080×1920 @ 60 fps. The narration is the master clock. */
export const NARRATION_END_SEC = 71.4;
export const MESSI91_DURATION_SEC = 74.4; // narration + Apple-style end card

export const Messi91: React.FC = () => (
  <AbsoluteFill style={{fontFamily: interFamily}}>
    <PaperBackground />
    <Scene from={0} to={4.35} enter="none" exit="slide" name="S1 91 goals"><S1 /></Scene>
    <Scene from={4.35} to={7.75} exit="rise" name="S2 calendar year"><S2 /></Scene>
    <Scene from={7.75} to={11.85} enter="rise" exit="zoom" name="S3 69 matches"><S3 /></Scene>
    <Scene from={11.85} to={13.95} enter="zoom" name="S4 per game"><S4 /></Scene>
    <Scene from={13.95} to={15.95} exit="blur" name="S5 relentless"><S5 /></Scene>
    <Scene from={15.95} to={21.1} enter="blur" exit="zoom" name="S6 months"><S6 /></Scene>
    <Scene from={21.1} to={23.7} enter="zoom" exit="rise" name="S7 March"><S7 /></Scene>
    <Scene from={23.7} to={29.0} enter="rise" name="S8 Leverkusen"><S8 /></Scene>
    <Scene from={29.0} to={35.15} name="S9 everywhere"><S9 /></Scene>
    <Scene from={35.15} to={40.2} exit="zoom" name="S10 79 + 12"><S10 /></Scene>
    <Scene from={40.2} to={43.8} enter="zoom" exit="blur" name="S11 out of reach"><S11 /></Scene>
    <Scene from={43.8} to={49.3} enter="blur" exit="rise" name="S12 Müller 85"><S12 /></Scene>
    <Scene from={49.3} to={52.3} enter="rise" exit="zoom" name="S13 beyond"><S13 /></Scene>
    <Scene from={52.3} to={57.3} enter="zoom" exit="blur" name="S14 summary"><S14 /></Scene>
    <Scene from={57.3} to={60.2} enter="blur" name="S15 explain"><S15 /></Scene>
    <Scene from={60.2} to={65.85} exit="blur" name="S16 no limit"><S16 /></Scene>
    <Scene from={65.85} to={71.45} enter="blur" exit="blur" name="S17 finale"><S17 /></Scene>
    <Scene from={71.8} to={MESSI91_DURATION_SEC + 1} enter="none" exit="none" name="End card"><EndCard /></Scene>

    {/* Narration: untouched master track */}
    <Audio src={staticFile('audio/messi-91.mp3')} />

    {/* Sound design — no music. Each cue sits on the motion it accompanies. */}
    <Sfx at={0.05} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.lionel - 0.15} name="whoosh-low" volume={0.3} />
    <Sfx at={W.ninety + 0.05} name="impact" volume={0.5} />
    <Sfx at={W.official - 0.05} name="pop" volume={0.28} />
    <Sfx at={4.3} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.season + 0.35} name="click" volume={0.3} />
    <Sfx at={W.inA - 0.05} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.calendar} name="whoosh-fast" volume={0.16} />
    <Sfx at={W.year} name="pop" volume={0.25} />
    <Sfx at={7.7} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.barcelona - 0.05} name="pop" volume={0.32} />
    <Sfx at={W.argentina - 0.05} name="pop" volume={0.32} />
    <Sfx at={W.played - 0.05} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.nine} name="impact-soft" volume={0.38} />
    <Sfx at={11.8} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.thats} name="pop" volume={0.22} />
    <Sfx at={W.per} name="impact-soft" volume={0.28} />
    <Sfx at={W.and - 0.15} name="whoosh-low" volume={0.28} />
    <Sfx at={W.relentless - 0.12} name="whoosh-fast" volume={0.3} />
    <Sfx at={15.9} name="whoosh-soft" volume={0.18} />
    <Sfx at={W.seven + 0.5} name="impact-soft" volume={0.26} />
    <Sfx at={W.ten + 0.45} name="impact-soft" volume={0.28} />
    <Sfx at={W.thirteen + 0.6} name="impact-soft" volume={0.36} />
    <Sfx at={21.05} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.march2 - 0.05} name="pop" volume={0.3} />
    <Sfx at={W.brought - 0.05} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.extraordinary - 0.08} name="whoosh-fast" volume={0.22} />
    <Sfx at={23.65} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.bayer} name="click" volume={0.3} />
    <Sfx at={W.messi2 - 0.15} name="whoosh-low" volume={0.28} />
    {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} at={W.five + i * 0.2} name="kick" volume={0.32} />)}
    <Sfx at={W.five + 0.95} name="net" volume={0.3} />
    <Sfx at={W.single2 - 0.05} name="pop" volume={0.24} />
    <Sfx at={28.95} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.he - 0.1} name="whoosh-low" volume={0.26} />
    <Sfx at={W.laLiga - 0.05} name="pop" volume={0.28} />
    <Sfx at={W.championsLeague - 0.05} name="pop" volume={0.28} />
    <Sfx at={W.domestic - 0.05} name="pop" volume={0.28} />
    <Sfx at={W.international - 0.05} name="pop" volume={0.28} />
    <Sfx at={35.1} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.barcelona2 - 0.2} name="whoosh-low" volume={0.26} />
    <Sfx at={W.nine2} name="impact" volume={0.42} />
    <Sfx at={W.argentina2 - 0.3} name="whoosh-fast" volume={0.26} />
    <Sfx at={W.twelve} name="impact-soft" volume={0.42} />
    <Sfx at={W.every - 0.1} name="whoosh-soft" volume={0.26} />
    <Sfx at={W.goal2} name="impact" volume={0.55} />
    <Sfx at={W.record - 0.05} name="whoosh-fast" volume={0.2} />
    <Sfx at={43.75} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.gerd - 0.25} name="pop" volume={0.24} />
    <Sfx at={W.five2} name="impact-soft" volume={0.34} />
    <Sfx at={W.nineteen - 0.05} name="pop" volume={0.24} />
    <Sfx at={49.25} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.later + 0.1} name="click" volume={0.3} />
    <Sfx at={W.messi3 - 0.1} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.beyond} name="impact" volume={0.5} />
    <Sfx at={W.ninety2 - 0.05} name="impact-soft" volume={0.32} />
    <Sfx at={W.sixty2 - 0.05} name="impact-soft" volume={0.32} />
    <Sfx at={W.one2 - 0.05} name="impact-soft" volume={0.32} />
    <Sfx at={57.25} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.so} name="pop" volume={0.22} />
    <Sfx at={W.movement - 0.1} name="whoosh-fast" volume={0.22} />
    <Sfx at={W.precision - 0.1} name="whoosh-fast" volume={0.22} />
    <Sfx at={W.consistency - 0.1} name="whoosh-fast" volume={0.22} />
    <Sfx at={W.finishing - 0.1} name="kick" volume={0.26} />
    <Sfx at={W.no - 0.1} name="whoosh-low" volume={0.3} />
    <Sfx at={W.messi4 - 0.15} name="whoosh-low" volume={0.26} />
    <Sfx at={W.number} name="impact" volume={0.6} />
    <Sfx at={W.still - 0.25} name="pop" volume={0.26} />
  </AbsoluteFill>
);
