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
- **Controlled pacing, never boring**: a new visual event (word lock, number roll, photo move, card, diagram beat) every 1.5–2 s, keyed to the narration — never a static hold longer than 2 s. Scenes may run longer but must keep evolving inside; entrances ≈ 0.9 s; stagger ≈ 0.06 s; transitions 0.6–0.9 s. Motion settles before narration moves on.
- **Hierarchy and spacing**: 8-pt grid (`space`), safe areas from `useLayout().safe`, max 3 text levels on screen, left-aligned unless it is a centred hero moment.

**Reference look (owner-supplied, Nov 2026) — now the default for productions:**
- *Motion reference*: iOS-style UI motion on an off-white "paper" canvas (`paper` tokens, `PaperBackground`). Words fly in from different heights/scales with motion blur and lock into one line on the spoken word (`FlyWords`). Pills grow out of their icon (`Capsule`), iMessage bubbles spring from their tail (`ChatBubble`), numbers roll on an iOS picker wheel and lock (`PickerNumber`), black "island" and white cards with soft shadows (`Card`), Spotlight search bar (`SearchBar`). Fast arrival, long silky settle (`paperEase`).
- *Photo reference*: player cut-outs with skin/hair in black & white, kit kept in colour, fine grain, soft grey offset shadow on white with a light vignette (`scripts/grade-photos.py` → `PhotoCutout`). Place cut-outs so cropped edges sit off-frame; put hero numbers *behind* the cut-out for depth.
- The dark cinematic components (GradientBackground, GlassPanel, 3D) remain available for contrast moments.
- *Analytics look (MessiWalks-v3 + Dribbles10 on the `renders` branch — the owner's favourite; their source code was not committed, rebuild from the renders)*: light grey paper with a soft centre glow; a small grey lead-in line ("Watch his") over ONE huge black bold word that locks on the spoken word ("head.", "walks.", "subbed."), short words fly/blur into place. Each idea is a single centred illustrative object: a 3D eyeball that turns LEFT / RIGHT / BEHIND / LEFT AGAIN with hairline callout labels on the beat, grey stick-figure walkers, a dark rounded card with a figure (hands on hips), white substitution card "OUT ▼7", a top-down pitch square with a black dot and grey players drifting then linking with lines ("mapping"), a low-poly grey 3D crowd scene with ellipse markers and tiny uppercase labels (TIRED, DRIFTS, SPACE), a timer-ring card counting minutes (1′→10′), a radar circle "INSIDE HIS HEAD". Dribbles10 adds dark contrast scenes: huge white numbers rolling (440 → 2,586), a disc of thousands of dots filling/sorting, spotlight beams, gold only for the record (1,000). Monochrome, one accent at most. Check these renders before designing a new film — they set the STYLE (palette, type, pacing, object-per-idea), not the props: invent new visual ideas per story; do not reuse the eyeball/walkers/crowd unless the text calls for them.

**Avoid**: generic football edit templates, cluttered layouts, lens flares, shakes, glitch, fast zoom punches, neon overload, stock "sports" fonts, more than one accent colour per scene (gold is reserved for records/trophies), drop-shadowed text, emoji.

**Reference video**: the owner will supply one. When they do, study its type, colour, easing, pacing, transitions and layout, then update the **design tokens** (`src/design/tokens.ts`) and this section — never patch individual scenes to match it.

## Workflow rules

- **"Same reference" / "same style"** = the Nov 2026 reference look above; the Messi 91 film (`src/compositions/messi91/`) is the template to reuse.
- **Sign-off**: end every production with the Apple-style end card "Produced by Shaljr" (small, bold, centred on paper, ~2.5 s after the narration; see `EndCard` in messi91/scenesB.tsx) unless told otherwise.
- **TikTok**: videos must be ≥ 1:01 (Creator Program). Default master: 1080×1920, 60 fps, 20 Mbps.
- **Delivery to the iPhone**: SendUserFile cards play but may not save. Also push the final MP4 to the `renders` branch with Git LFS (environment `football-motion-studio` allows lfs.github.com) and give the Safari link `https://github.com/silencator/football-motion-studio./raw/renders/<file>.mp4` (Share → Save Video).
- **Standing defaults (owner need not repeat them)**: reference look + motion language, synthesised SFX (whooshes, clicks, ticks, pops, impacts, kick/net) synced to motion, no music, narration untouched, 9:16 60 fps, end card, GitHub delivery link, something happens every 1.5–2 s.
- **The owner's script + audio are final**: animate whatever narration they send, exactly as recorded — no rewrites, no trims.
- **Vary, don't copy**: keep the reference's language but design each film for its story — new layouts, new scene ideas, unused reference moves (morphing words, sideways camera pan along a sentence, timer-ring card, card with cursor tap) where they serve the text. Never a carbon copy of Messi 91.
- **New-video intake**: when the owner sends audio + script, first reply briefly with exactly what is still needed (named photo list per story moment, optional crests, any open decisions) and the audio length check — then build once inputs arrive.
- **Owner-prepared inputs** (when supplied, skip those steps): transparent PNG cut-outs (iOS "Lift Subject") → just run `grade-photos.py`; a script with stats → no fact-finding; a scene/photo plan → follow it.

- Do **not** start a new football video unless the owner asks for one.
- Reuse components in `src/components`; extend the system rather than writing one-off styling. Change the look via tokens.
- Every production registers four deliverables: `<Project>-Landscape-30`, `-Landscape-60`, `-Vertical-30`, `-Vertical-60` (1920×1080 / 1080×1920). Vertical must be re-laid out (stacked, larger relative type via `useLayout`), not just cropped.
- Narration first: put the voice-over in `public/audio/`, run `npm run analyze -- public/audio/<file>`, then drive scene timing from the generated `public/data/<file>.timing.json` (`narrationMetadata`, `planScenes`). Scene cuts land on speech-segment boundaries.
- Preview with stills before full renders: `npx remotion still src/index.ts <Id> /path/out.png --frame=<n> --scale=0.5`. Check them visually.
- Render with `npm run render -- <Id>` → `out/<Id>.mp4` (verified with ffprobe + full decode). `out/` and `*.mp4` are git-ignored on the main branch; deliver as described under Delivery.
- Be economical: no needless packages, files or re-installs. Keep explanations short and iPhone-friendly.

## Production pipeline (all in the cloud)

0. Python tools: `python3 -m venv /tmp/claude-0/venv && /tmp/claude-0/venv/bin/pip install -r requirements.txt` (ephemeral; recreate per container).
1. Narration → `public/audio/`, then `python scripts/transcribe.py public/audio/<name>.mp3` → `public/data/<name>.transcript.json` (Whisper small.en text + Zipformer word times; models auto-download from k2-fsa GitHub releases — Hugging Face is blocked). Put timestamps in a `words.ts` and key every cue to them via `Scene`/`useT()` (absolute seconds).
2. Photos → `python scripts/cutout.py *.jpg` (rembg `birefnet-portrait`, one process per photo, ~20 s each, ~5 GB RAM; skip if the owner sends iOS cut-outs), then `python scripts/grade-photos.py *.png --out public/images/<project>`.
3. SFX → `python scripts/make-sfx.py` (synthesised whooshes, clicks, ticks, pops, impacts, kick, net) and `<Sfx at={sec} name=… volume=…/>`. No music unless asked. Narration untouched and dominant.
4. Preview → `node scripts/stills.mjs <Id> <dir> 0.25 "s1,s2,…"` then tile with ffmpeg and inspect.
5. Render TikTok master → `npm run render -- <Id> --video-bitrate=20M --x264-preset=slow --audio-bitrate=320k`.
6. TikTok safe zone (1080×1920): keep key content within y 220–1500, and clear of the right rail (x > 960, y 900–1650).

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
