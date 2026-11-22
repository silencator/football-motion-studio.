import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {interFamily} from '../../design/fonts';
import {PaperBackground, Scene} from '../../components/ios';
import {Sfx} from '../../sfx/Sfx';
import {S1, S2, S3, S4, S5, S6, S7, S8} from './scenesA';
import {S9, S10, S11, S12, S13, EndCard, END_AT} from './scenesB';
import {W} from './words';

/** "What if Neymar had stayed at Santos?" — 4:3 (1440×1080). The narration is the master clock. */
export const NEYMAR_DURATION_SEC = 68.3; // 64.84 s narration + Apple-style end card

export const Neymar: React.FC = () => (
  <AbsoluteFill style={{fontFamily: interFamily}}>
    <PaperBackground />
    <Scene from={0} to={4.9} enter="none" exit="blur" name="S1 one decision"><S1 /></Scene>
    <Scene from={4.9} to={10.0} enter="blur" exit="slide" name="S2 2012 · 20"><S2 /></Scene>
    <Scene from={10.0} to={14.2} exit="rise" name="S3 phenomenon"><S3 /></Scene>
    <Scene from={14.2} to={20.45} enter="rise" exit="slide" name="S4 dribbling"><S4 /></Scene>
    <Scene from={20.45} to={24.15} exit="zoom" name="S5 Libertadores"><S5 /></Scene>
    <Scene from={24.15} to={30.7} enter="zoom" exit="blur" name="S6 dreams"><S6 /></Scene>
    <Scene from={30.7} to={32.95} enter="blur" exit="zoom" name="S7 Barcelona calling"><S7 /></Scene>
    <Scene from={32.95} to={35.35} enter="zoom" exit="slide" name="S8 left Santos"><S8 /></Scene>
    <Scene from={35.35} to={42.5} exit="blur" name="S9 UCL + MSN"><S9 /></Scene>
    <Scene from={42.5} to={44.95} enter="blur" exit="blur" name="S10 Ballon d'Or"><S10 /></Scene>
    <Scene from={44.95} to={50.4} enter="blur" exit="rise" name="S11 what if"><S11 /></Scene>
    <Scene from={50.4} to={57.75} enter="rise" exit="blur" name="S12 the fork"><S12 /></Scene>
    <Scene from={57.75} to={65.2} enter="blur" exit="blur" name="S13 could have become"><S13 /></Scene>
    <Scene from={END_AT} to={NEYMAR_DURATION_SEC + 1} enter="none" exit="none" name="End card"><EndCard /></Scene>

    {/* Narration: untouched master track */}
    <Audio src={staticFile('audio/neymar-santos.mp3')} />

    {/* Sound design — no music. Each cue sits on the motion it accompanies. */}
    <Sfx at={0.05} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.decision - 0.05} name="impact-soft" volume={0.34} />
    <Sfx at={W.had - 0.25} name="whoosh-low" volume={0.24} />
    <Sfx at={4.85} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.y2012 - 0.05} name="pop" volume={0.26} />
    <Sfx at={W.twenty + 0.2} name="impact-soft" volume={0.3} />
    <Sfx at={W.hope - 0.05} name="whoosh-soft" volume={0.2} />
    <Sfx at={9.95} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.santos - 0.05} name="pop" volume={0.26} />
    <Sfx at={W.he2 + 0.05} name="whoosh-soft" volume={0.24} />
    <Sfx at={W.phenomenon} name="impact-soft" volume={0.32} />
    <Sfx at={14.15} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.dribbling - 0.1} name="click" volume={0.28} />
    <Sfx at={W.confidence - 0.1} name="click" volume={0.28} />
    <Sfx at={W.impossible - 0.1} name="click" volume={0.28} />
    <Sfx at={W.effortless - 0.05} name="kick" volume={0.26} />
    <Sfx at={20.4} name="whoosh-low" volume={0.24} />
    <Sfx at={W.south - 0.1} name="pop" volume={0.26} />
    <Sfx at={W.winning - 0.05} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.libertadores} name="impact" volume={0.42} />
    <Sfx at={24.1} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.bigger + 0.15} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.world - 0.1} name="tick" volume={0.32} />
    <Sfx at={W.ballon - 0.1} name="tick" volume={0.32} />
    <Sfx at={W.greatest - 0.1} name="tick" volume={0.32} />
    <Sfx at={30.65} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.barcelona - 0.05} name="pop" volume={0.3} />
    <Sfx at={W.calling + 0.35} name="click" volume={0.4} />
    <Sfx at={32.9} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.left - 0.05} name="pop" volume={0.24} />
    <Sfx at={W.santos2 + 0.05} name="whoosh-soft" volume={0.22} />
    <Sfx at={35.3} name="whoosh-low" volume={0.26} />
    <Sfx at={W.league} name="impact" volume={0.45} />
    <Sfx at={W.formed - 0.2} name="whoosh-fast" volume={0.22} />
    <Sfx at={W.trios + 0.1} name="impact-soft" volume={0.36} />
    <Sfx at={W.global - 0.05} name="pop" volume={0.28} />
    <Sfx at={42.45} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.never} name="impact-soft" volume={0.26} />
    <Sfx at={W.came2 + 0.1} name="pop" volume={0.2} />
    <Sfx at={44.9} name="whoosh-low" volume={0.24} />
    <Sfx at={W.stayed} name="impact-soft" volume={0.32} />
    <Sfx at={W.could - 0.2} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.generation} name="pop" volume={0.24} />
    <Sfx at={50.35} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.santos3 + 0.6} name="pop" volume={0.24} />
    <Sfx at={W.or - 0.25} name="whoosh-soft" volume={0.2} />
    <Sfx at={W.brazil} name="pop" volume={0.26} />
    <Sfx at={W.decision2 - 0.1} name="impact-soft" volume={0.36} />
    <Sfx at={W.changed2} name="whoosh-low" volume={0.22} />
    <Sfx at={57.7} name="whoosh-soft" volume={0.22} />
    <Sfx at={W.know} name="impact-soft" volume={0.3} />
    <Sfx at={W.maybe - 0.15} name="whoosh-low" volume={0.24} />
    <Sfx at={W.but2 - 0.05} name="whoosh-fast" volume={0.2} />
    <Sfx at={W.become} name="impact" volume={0.5} />
    <Sfx at={END_AT} name="whoosh-soft" volume={0.16} />
  </AbsoluteFill>
);
