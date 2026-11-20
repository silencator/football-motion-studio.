import {useEffect, useMemo, useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import gsap from 'gsap';

/**
 * Frame-accurate GSAP: builds a PAUSED timeline once and seeks it to the current frame.
 * Never let GSAP play on its own clock — Remotion renders frames out of order in parallel.
 *
 * const ref = useRef<HTMLDivElement>(null);
 * useGsapTimeline((tl) => { tl.from(ref.current, {y: 40, opacity: 0, duration: 0.8, ease: 'expo.out'}); });
 */
export const useGsapTimeline = (build: (tl: gsap.core.Timeline) => void, deps: unknown[] = []) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const tl = useMemo(() => gsap.timeline({paused: true}), deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    build(tl);
    tlRef.current = tl;
    tl.seek(frame / fps, false);
    return () => {
      tl.kill();
    };
  }, [tl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    tlRef.current?.seek(frame / fps, false);
  }, [frame, fps]);

  return tl;
};
