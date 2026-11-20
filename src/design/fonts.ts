import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Inter (variable, 100–900) is the licensed stand-in for SF Pro, which may not be embedded in rendered media.
 * Self-hosted in public/fonts (SIL OFL) so renders work offline and identically everywhere.
 */
export const interFamily = 'Inter';

const faces = [
  {file: 'fonts/Inter-latin.woff2', unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'},
  {file: 'fonts/Inter-latin-ext.woff2', unicodeRange: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'},
];

export const fontsReady = Promise.all(
  faces.map((f) => loadFont({family: interFamily, url: staticFile(f.file), weight: '100 900', unicodeRange: f.unicodeRange, format: 'woff2'})),
);
