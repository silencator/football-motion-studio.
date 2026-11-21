#!/usr/bin/env node
/**
 * Fast preview: bundle once, render many frames as stills, tile into contact sheets.
 *   node scripts/stills.mjs <CompositionId> <outDir> <scale> <sec1,sec2,...>
 */
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const [id, outDir, scaleArg, secsArg] = process.argv.slice(2);
const scale = Number(scaleArg ?? 0.3);
mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const puppeteerInstance = await openBrowser('chrome', {browserExecutable, chromiumOptions: {gl: 'angle'}});
const composition = await selectComposition({serveUrl, id, puppeteerInstance});
const secs = secsArg.split(',').map(Number);
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
  const output = path.join(outDir, `f${String(Math.round(s * 100)).padStart(5, '0')}.jpg`);
  await renderStill({composition, serveUrl, output, frame, scale, imageFormat: 'jpeg', puppeteerInstance});
  process.stdout.write(`${s} `);
}
await puppeteerInstance.close({silent: true});
console.log('\ndone');
