#!/usr/bin/env node
/**
 * Narration analyser (FFmpeg/FFprobe, runs in the cloud container).
 *
 *   npm run analyze -- public/audio/narration.mp3 [--noise -35] [--min-silence 0.35]
 *
 * Writes public/data/<name>.timing.json:
 *   durationInSeconds, speech segments (phrase boundaries from silence detection),
 *   pauses, and a loudness envelope sampled at 60 Hz (0–1) for audio-reactive visuals.
 * Scenes are then cut on segment boundaries; see src/audio/narration.ts.
 */
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {basename, extname, join} from 'node:path';

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--'));
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? Number(args[i + 1]) : d;
};
if (!input) {
  console.error('Usage: npm run analyze -- <audio file> [--noise -35] [--min-silence 0.35]');
  process.exit(1);
}
const noise = opt('noise', -35);
const minSilence = opt('min-silence', 0.35);
const ENV_HZ = 60;

const probe = JSON.parse(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,sample_rate,channels', '-of', 'json', input]).toString(),
);
const duration = Number(probe.format.duration);

// Silence detection → pauses (silencedetect logs to stderr)
const log = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', input, '-af', `silencedetect=noise=${noise}dB:d=${minSilence}`, '-f', 'null', '-'], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
}).stderr;
const pauses = [];
let cur = null;
for (const line of log.split('\n')) {
  const s = line.match(/silence_start: ([\d.]+)/);
  const e = line.match(/silence_end: ([\d.]+)/);
  if (s) cur = Number(s[1]);
  if (e && cur !== null) {
    pauses.push({start: +cur.toFixed(3), end: +Number(e[1]).toFixed(3)});
    cur = null;
  }
}
if (cur !== null) pauses.push({start: +cur.toFixed(3), end: +duration.toFixed(3)});

const segments = [];
let t = 0;
for (const p of pauses) {
  if (p.start - t > 0.05) segments.push({start: +t.toFixed(3), end: p.start});
  t = p.end;
}
if (duration - t > 0.05) segments.push({start: +t.toFixed(3), end: +duration.toFixed(3)});

// Loudness envelope: decode mono 16-bit PCM @ 48 kHz, RMS per 1/60 s window
const SR = 48000;
const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', input, '-ac', '1', '-ar', String(SR), '-f', 's16le', '-'], {maxBuffer: 1024 * 1024 * 1024});
const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.byteLength / 2));
const win = SR / ENV_HZ;
const env = [];
for (let i = 0; i < samples.length; i += win) {
  let sum = 0;
  const end = Math.min(samples.length, i + win);
  for (let j = i; j < end; j++) sum += (samples[j] / 32768) ** 2;
  env.push(Math.sqrt(sum / Math.max(1, end - i)));
}
const peak = Math.max(...env, 1e-6);
const envelope = env.map((v) => +(v / peak).toFixed(3));

const out = {
  source: basename(input),
  durationInSeconds: +duration.toFixed(3),
  audio: probe.streams?.[0] ?? null,
  settings: {noiseDb: noise, minSilence},
  segments,
  pauses,
  envelopeHz: ENV_HZ,
  envelope,
};
mkdirSync('public/data', {recursive: true});
const file = join('public/data', `${basename(input, extname(input))}.timing.json`);
writeFileSync(file, JSON.stringify(out));
console.log(`✔ ${file}\n  duration ${duration.toFixed(2)}s · ${segments.length} speech segments · ${pauses.length} pauses · envelope ${envelope.length} samples`);
segments.forEach((s, i) => console.log(`  [${String(i).padStart(2, '0')}] ${s.start.toFixed(2)}s → ${s.end.toFixed(2)}s`));
