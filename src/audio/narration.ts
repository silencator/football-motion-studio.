import {staticFile} from 'remotion';
import {z} from 'zod';

/** Shape of public/data/<name>.timing.json produced by `npm run analyze`. */
export const narrationTimingSchema = z.object({
  source: z.string(),
  durationInSeconds: z.number(),
  segments: z.array(z.object({start: z.number(), end: z.number()})),
  pauses: z.array(z.object({start: z.number(), end: z.number()})),
  envelopeHz: z.number(),
  envelope: z.array(z.number()),
});
export type NarrationTiming = z.infer<typeof narrationTimingSchema>;

/** Load + validate timing JSON (use inside calculateMetadata). */
export const loadNarrationTiming = async (url: string): Promise<NarrationTiming> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Timing file not found: ${url} — run \`npm run analyze -- <audio>\` first`);
  return narrationTimingSchema.parse(await res.json());
};

export type ScenePlan = {index: number; from: number; durationInFrames: number; startSec: number; endSec: number};

/**
 * Turn narration into scene slots.
 * - `cuts`: explicit scene start times in seconds (from the script) — preferred.
 * - otherwise: one scene per speech segment, merging segments shorter than `minSceneSec`.
 * Each scene starts `leadSec` before its line so visuals land just ahead of the voice.
 */
export const planScenes = (
  timing: NarrationTiming,
  fps: number,
  {cuts, minSceneSec = 2.5, leadSec = 0.15, tailSec = 0.6}: {cuts?: number[]; minSceneSec?: number; leadSec?: number; tailSec?: number} = {},
): ScenePlan[] => {
  const total = timing.durationInSeconds + tailSec;
  let starts: number[];
  if (cuts?.length) {
    starts = [0, ...cuts.filter((c) => c > 0 && c < total)];
  } else {
    starts = [0];
    for (const seg of timing.segments.slice(1)) {
      if (seg.start - starts[starts.length - 1] >= minSceneSec) starts.push(Math.max(0, seg.start - leadSec));
    }
  }
  return starts.map((st, i) => {
    const end = i < starts.length - 1 ? starts[i + 1] : total;
    const from = Math.round(st * fps);
    return {index: i, from, durationInFrames: Math.max(1, Math.round(end * fps) - from), startSec: st, endSec: end};
  });
};

/** Loudness (0–1) at a frame, linearly interpolated from the envelope. */
export const envelopeAt = (timing: Pick<NarrationTiming, 'envelope' | 'envelopeHz'>, frame: number, fps: number) => {
  const x = (frame / fps) * timing.envelopeHz;
  const i = Math.floor(x);
  const a = timing.envelope[i] ?? 0;
  const b = timing.envelope[i + 1] ?? a;
  return a + (b - a) * (x - i);
};

/** Smoothed loudness (moving average over `windowSec`) — better for scaling/glow. */
export const smoothEnvelopeAt = (timing: Pick<NarrationTiming, 'envelope' | 'envelopeHz'>, frame: number, fps: number, windowSec = 0.15) => {
  const c = Math.round((frame / fps) * timing.envelopeHz);
  const w = Math.max(1, Math.round(windowSec * timing.envelopeHz));
  let sum = 0;
  let n = 0;
  for (let i = c - w; i <= c + w; i++) {
    if (i >= 0 && i < timing.envelope.length) {
      sum += timing.envelope[i];
      n++;
    }
  }
  return n ? sum / n : 0;
};

/**
 * calculateMetadata factory: loads `public/data/<audio>.timing.json`, injects it as `timing`,
 * and sets the composition duration to the narration (+ tail). Remotion does not pass fps to
 * calculateMetadata, so pass the composition's fps explicitly.
 *   calculateMetadata={narrationMetadata(60)}
 */
export const narrationMetadata =
  (fps: number, tailSec = 0.6) =>
  async <P extends {narration: string; timing?: NarrationTiming}>({props}: {props: P}) => {
    const timing = await loadNarrationTiming(timingFileFor(props.narration));
    return {durationInFrames: Math.ceil((timing.durationInSeconds + tailSec) * fps), props: {...props, timing}};
  };

/** public/audio/foo.mp3 → public/data/foo.timing.json (as a staticFile URL). */
export const timingFileFor = (audioFile: string) => staticFile(`data/${audioFile.replace(/^.*\//, '').replace(/\.[^.]+$/, '')}.timing.json`);
