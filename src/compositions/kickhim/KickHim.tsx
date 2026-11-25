import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {interFamily} from '../../design/fonts';
import {PaperBackground, Scene, useT} from '../../components/ios';
import {paperEase} from '../../design/tokens';
import {Sfx} from '../../sfx/Sfx';
import {S1, S2, S3, S4, S5, S6, S7, S8} from './scenesA';
import {S9, S10, S11, S12, S13, S14, S15, S16, S17, EndCard} from './scenesB';
import {W, END_CARD_AT, KICKHIM_DURATION} from './words';

/** "The night" — the paper canvas fades to near-black for the Atlético title night, then back to dawn. */
const Night: React.FC = () => {
  const {p} = useT();
  const k = p(W.night - 0.25, 0.7, paperEase.glide) * (1 - p(W.and2 - 0.3, 0.8, paperEase.glide));
  return <AbsoluteFill style={{background: 'radial-gradient(80% 60% at 50% 42%, #1C1C1F 0%, #0B0B0D 70%)', opacity: k}} />;
};

/** "Kick Him" — Messi, 2014–15: followed and kicked, never stopped. Vertical 1080×1920. Narration is the master clock. */
export const KickHim: React.FC = () => (
  <AbsoluteFill style={{fontFamily: interFamily}}>
    <PaperBackground />
    <Night />
    <Scene from={0} to={5.95} enter="none" exit="blur" name="S1 the plan"><S1 /></Scene>
    <Scene from={5.95} to={9.2} enter="blur" exit="rise" name="S2 2014-15"><S2 /></Scene>
    <Scene from={9.2} to={12.1} enter="rise" exit="zoom" name="S3 already there"><S3 /></Scene>
    <Scene from={12.1} to={15.6} enter="zoom" exit="blur" name="S4 foul map"><S4 /></Scene>
    <Scene from={15.6} to={19.55} enter="blur" exit="zoom" name="S5 ninety"><S5 /></Scene>
    <Scene from={19.55} to={21.2} enter="zoom" exit="blur" name="S6 did it work"><S6 /></Scene>
    <Scene from={21.2} to={24.4} enter="blur" exit="slide" name="S7 back at them"><S7 /></Scene>
    <Scene from={24.4} to={28.95} enter="slide" exit="rise" name="S8 4.6 dribbles"><S8 /></Scene>
    <Scene from={28.95} to={33.3} enter="rise" exit="blur" name="S9 floor"><S9 /></Scene>
    <Scene from={33.3} to={34.75} enter="blur" exit="zoom" name="S10 break"><S10 /></Scene>
    <Scene from={34.75} to={39.5} enter="zoom" exit="blur" name="S11 38 of 38"><S11 /></Scene>
    <Scene from={39.5} to={44.55} enter="blur" exit="zoom" name="S12 the night"><S12 /></Scene>
    <Scene from={44.55} to={47.2} enter="zoom" exit="blur" name="S13 23 / 8"><S13 /></Scene>
    <Scene from={47.2} to={49.4} enter="blur" exit="rise" name="S14 league"><S14 /></Scene>
    <Scene from={49.4} to={53.2} enter="rise" exit="blur" name="S15 90 38 0"><S15 /></Scene>
    <Scene from={53.2} to={57.25} enter="blur" exit="slide" name="S16 confession"><S16 /></Scene>
    <Scene from={57.25} to={60.95} enter="slide" exit="blur" name="S17 never stopped"><S17 /></Scene>
    <Scene from={END_CARD_AT} to={KICKHIM_DURATION + 1} enter="none" exit="none" name="End card"><EndCard /></Scene>

    {/* Narration: untouched master track */}
    <Audio src={staticFile('audio/fouls.mp3')} />

    {/* Sound design — no music; every cue sits on the motion it accompanies. */}
    <Sfx at={0.02} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.plan - 0.05} name="impact-soft" volume={0.32} />
    <Sfx at={W.for - 0.05} name="whoosh-low" volume={0.24} />
    <Sfx at={W.follow - 0.05} name="pop" volume={0.28} />
    <Sfx at={W.fails} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.kick - 0.12} name="whistle" volume={0.32} />
    <Sfx at={W.kick} name="kick" volume={0.5} />
    <Sfx at={W.kick + 0.02} name="impact" volume={0.42} />
    <Sfx at={5.9} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.fifteen - 0.05} name="click" volume={0.3} />
    <Sfx at={W.season} name="whoosh-low" volume={0.24} />
    <Sfx at={9.15} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.turned - 0.1} name="whoosh-low" volume={0.24} />
    <Sfx at={W.someone - 0.05} name="pop" volume={0.3} />
    <Sfx at={W.was - 0.05} name="pop" volume={0.3} />
    <Sfx at={W.there - 0.05} name="pop" volume={0.34} />
    <Sfx at={12.05} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.shirts} name="rip" volume={0.42} />
    <Sfx at={W.ankles} name="kick" volume={0.4} />
    <Sfx at={W.ankles + 0.04} name="thud" volume={0.34} />
    <Sfx at={W.shoulders} name="thud" volume={0.5} />
    <Sfx at={15.55} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.ninety + 0.45} name="impact" volume={0.5} />
    <Sfx at={W.more - 0.1} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.two - 0.05} name="whistle" volume={0.18} />
    <Sfx at={W.two + 0.13} name="whistle" volume={0.16} />
    <Sfx at={W.everyG - 0.05} name="pop" volume={0.26} />
    <Sfx at={W.game + 0.15} name="pop" volume={0.24} />
    <Sfx at={19.5} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.work - 0.1} name="click" volume={0.34} />
    <Sfx at={W.work + 0.5} name="click" volume={0.24} />
    <Sfx at={21.15} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.part - 0.05} name="impact-soft" volume={0.3} />
    <Sfx at={W.he2 - 0.1} name="whoosh-low" volume={0.3} />
    <Sfx at={W.back2} name="whoosh-fast" volume={0.3} />
    <Sfx at={24.35} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.six + 0.2} name="impact-soft" volume={0.36} />
    <Sfx at={W.more2 - 0.05} name="whoosh-soft" volume={0.24} />
    <Sfx at={W.laLiga2} name="pop" volume={0.3} />
    <Sfx at={28.9} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.champions - 0.05} name="pop" volume={0.28} />
    <Sfx at={W.bayern - 0.05} name="click" volume={0.24} />
    <Sfx at={W.floor + 0.48} name="thud" volume={0.55} />
    <Sfx at={33.25} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.break + 0.33} name="impact" volume={0.5} />
    <Sfx at={34.7} name="whoosh-fast" volume={0.2} />
    {Array.from({length: 13}, (_, i) => <Sfx key={i} at={W.played + (i * 3 / 38) * (W.games + 0.2 - W.played)} name="tick" volume={0.2} />)}
    <Sfx at={W.games + 0.2} name="impact-soft" volume={0.34} />
    <Sfx at={W.only - 0.05} name="pop" volume={0.3} />
    <Sfx at={39.45} name="whoosh-low" volume={0.3} />
    <Sfx at={W.night - 0.05} name="impact" volume={0.4} />
    <Sfx at={W.atletico - 0.2} name="whoosh-fast" volume={0.24} />
    <Sfx at={W.line} name="whoosh-soft" volume={0.26} />
    <Sfx at={44.5} name="whoosh-fast" volume={0.2} />
    {Array.from({length: 23}, (_, i) => (i % 2 === 0 ? <Sfx key={`d${i}`} at={W.twentyThree - 0.05 + i * 0.045} name="tick" volume={0.2} /> : null))}
    <Sfx at={W.eight2 - 0.05} name="whistle" volume={0.3} />
    <Sfx at={W.eight2} name="impact-soft" volume={0.4} />
    <Sfx at={W.and2 - 0.25} name="whoosh-low" volume={0.26} />
    <Sfx at={W.goal - 0.05} name="kick" volume={0.45} />
    <Sfx at={W.goal + 0.12} name="net" volume={0.34} />
    <Sfx at={W.league2} name="impact" volume={0.55} />
    <Sfx at={49.35} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.zero + 0.1} name="impact" volume={0.5} />
    <Sfx at={53.15} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.confession - 0.05} name="impact-soft" volume={0.36} />
    <Sfx at={W.theD - 0.15} name="whoosh-fast" volume={0.22} />
    <Sfx at={W.lost - 0.05} name="impact" volume={0.48} />
    <Sfx at={57.2} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.they1 - 0.05} name="pop" volume={0.26} />
    <Sfx at={W.they2 - 0.05} name="kick" volume={0.34} />
    <Sfx at={W.stopped - 0.05} name="impact" volume={0.55} />
    <Sfx at={END_CARD_AT} name="whoosh-soft" volume={0.18} />
  </AbsoluteFill>
);
