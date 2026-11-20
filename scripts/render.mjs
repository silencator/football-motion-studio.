#!/usr/bin/env node
/**
 * Render a composition to out/<id>.mp4 and verify it with ffprobe.
 *   npm run render -- <CompositionId> [extra remotion CLI flags]
 */
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, statSync} from 'node:fs';

const [id, ...rest] = process.argv.slice(2);
if (!id) {
  console.error('Usage: npm run render -- <CompositionId>');
  process.exit(1);
}
mkdirSync('out', {recursive: true});
const file = `out/${id}.mp4`;
const r = spawnSync('npx', ['remotion', 'render', 'src/index.ts', id, file, ...rest], {stdio: 'inherit'});
if (r.status !== 0 || !existsSync(file)) process.exit(r.status ?? 1);

const info = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt', '-of', 'json', file]).toString());
const v = info.streams.find((s) => s.codec_type === 'video');
const a = info.streams.find((s) => s.codec_type === 'audio');
// Full decode pass: fails if any frame is corrupt.
const dec = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'null', '-'], {encoding: 'utf8'});
console.log(`\n✔ ${file}  ${(statSync(file).size / 1e6).toFixed(2)} MB · ${Number(info.format.duration).toFixed(2)}s · ${v.codec_name} ${v.width}×${v.height} @ ${v.r_frame_rate} ${v.pix_fmt}${a ? ` · audio ${a.codec_name}` : ' · no audio'} · decode ${dec.stderr.trim() ? 'ERRORS:\n' + dec.stderr : 'clean'}`);
