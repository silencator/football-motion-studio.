import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p'); // plays everywhere, incl. iPhone Photos/Files
Config.setColorSpace('bt709'); // correct, tagged colour on Apple devices
Config.setChromiumOpenGlRenderer('angle'); // WebGL for Three.js in headless Chromium
Config.setConcurrency(4);

// The cloud container blocks Remotion's browser download host, but ships a headless Chromium.
// Use REMOTION_BROWSER to override; otherwise use the pre-installed one if present.
const browser =
  process.env.REMOTION_BROWSER ??
  ['/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'].find((p) => existsSync(p));
if (browser) Config.setBrowserExecutable(browser);
