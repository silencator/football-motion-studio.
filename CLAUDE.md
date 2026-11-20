# Football Motion Studio

Premium, Apple-inspired motion design for football storytelling, built on Remotion (React + TypeScript).
The owner works **only from an iPhone**: every edit, preview and render happens in the cloud container.

## Permanent creative direction (applies to EVERY video)

- **Apple-inspired**: the restraint, light and pacing of an Apple keynote or product film. Do not imitate their branding.
- **Minimal, elegant compositions**: one idea per frame. Decide what the viewer sees first and build the frame around it.
- **Cinematic typography**: Inter (our licensed stand-in for SF Pro), tight negative tracking on display sizes, generous leading on body text, uppercase tracked kickers. Large type, few words.
- **Fluid text animation**: rise + de-blur + fade, staggered by word or character (`AnimatedText`). Expo-out easing (`ease.out`). Never bounce, never typewriter, never spin.
- **Gradients, light and depth**: near-black canvas, soft radial light, slow drifting glows, vignette, subtle film grain, glass panels with hairline borders, glows on data marks.
- **2D and 3D motion graphics**: SVG/CSS for data; Three.js (`Scene3D`) for hero objects and camera depth.
- **Data storytelling**: animated statistics, timelines, maps, pitch diagrams and comparisons are first-class. Numbers count up, lines draw on, bars grow.
- **Controlled pacing**: allow holds. Each scene gets ≥ 2.5 s; entrances ≈ 0.9 s; stagger ≈ 0.06 s; transitions 0.6–0.9 s. Motion settles before narration moves on.
- **Hierarchy and spacing**: 8-pt grid (`space`), safe areas from `useLayout().safe`, max 3 text levels on screen, left-aligned unless it is a centred hero moment.

**Avoid**: generic football edit templates, cluttered layouts, lens flares, shakes, glitch, fast zoom punches, neon overload, stock "sports" fonts, more than one accent colour per scene (gold is reserved for records/trophies), drop-shadowed text, emoji.

**Reference video**: the owner will supply one. When they do, study its type, colour, easing, pacing, transitions and layout, then update the **design tokens** (`src/design/tokens.ts`) and this section — never patch individual scenes to match it.

## Workflow rules

- Do **not** start a new football video unless the owner asks for one.
- Reuse components in `src/components`; extend the system rather than writing one-off styling. Change the look via tokens.
- Every production registers four deliverables: `<Project>-Landscape-30`, `-Landscape-60`, `-Vertical-30`, `-Vertical-60` (1920×1080 / 1080×1920). Vertical must be re-laid out (stacked, larger relative type via `useLayout`), not just cropped.
- Narration first: put the voice-over in `public/audio/`, run `npm run analyze -- public/audio/<file>`, then drive scene timing from the generated `public/data/<file>.timing.json` (`narrationMetadata`, `planScenes`). Scene cuts land on speech-segment boundaries.
- Preview with stills before full renders: `npx remotion still src/index.ts <Id> /path/out.png --frame=<n> --scale=0.5`. Check them visually.
- Render with `npm run render -- <Id>` → `out/<Id>.mp4` (verified with ffprobe + full decode). `out/` and `*.mp4` are git-ignored: deliver MP4s to the owner with SendUserFile, not via git.
- Be economical: no needless packages, files or re-installs. Keep explanations short and iPhone-friendly.

## Remotion rules (from the official Agent Skills in `.agents/skills`, linked in `.claude/skills`)

- Animate only with `useCurrentFrame()` + `interpolate`/`spring`. CSS transitions/animations and R3F `useFrame()` are forbidden (frames render out of order, in parallel).
- GSAP only through `useGsapTimeline` (paused timeline seeked to the frame).
- 3D inside `Scene3D`/`ThreeCanvas`; any `<Sequence>` inside it needs `layout="none"`.
- Deterministic only: no `Math.random()` (use `random(seed)` from remotion), no `Date.now()`.
- Audio via `<Audio>` from `@remotion/media`. Fonts are self-hosted in `public/fonts` (the headless browser cannot reach Google Fonts).
- Use `fps` from `useVideoConfig()` for all seconds→frames maths.

## Project map

```
src/
  Root.tsx                 composition registry (System-Test folder = environment check)
  design/                  tokens (colour, gradients, type scale, spacing, easing, timing), formats, useLayout, fonts
  lib/                     anim helpers (progress, envelope), useGsapTimeline
  audio/                   narration timing schema, planScenes, envelopeAt, narrationMetadata, SpectrumBars, Pulse
  components/
    typography/            AnimatedText, Kicker
    titles/                CinematicTitle
    backgrounds/           GradientBackground (+Grain), GlassPanel
    stats/                 StatCounter, StatBars, RingStat, RadarChart
    players/               PlayerProfile, PlayerComparison
    pitch/                 Pitch (metric 105×68 coords, portrait, tilt), PlayerDot, PassArrow, HeatZone
    timeline/              Timeline (auto vertical in portrait)
    transitions/           T presets (blur, fade, push, wipe) for TransitionSeries, blurDissolve
    three/                 Scene3D (studio lighting), Football3D (procedural ball)
  compositions/test/       TestAnimation — environment check only, not a production
scripts/
  analyze-audio.mjs        ffprobe/ffmpeg narration analysis → timing JSON
  render.mjs               render + ffprobe verification
public/ audio/ data/ fonts/ images/
```

## Environment notes

- Node 22, FFmpeg/FFprobe 6.1 are pre-installed in the container.
- Remotion's Chrome download host is blocked here; `remotion.config.ts` uses the pre-installed headless Chromium (override with `REMOTION_BROWSER`). WebGL works via the `angle` renderer.
- Render speed on this 4-core container: roughly 15× real time at 30 fps and 28× at 60 fps for scenes with 3D and blur. Long 60 fps videos take hours; render 30 fps drafts first.
