import {useVideoConfig} from 'remotion';

/**
 * Responsive layout helper. Tokens are authored at 1920 landscape.
 * Vertical (1080 wide) uses a slightly larger relative scale so text stays legible on phones.
 */
export const useLayout = () => {
  const {width, height, fps} = useVideoConfig();
  const vertical = height > width;
  const scale = vertical ? (width / 1920) * 1.45 : width / 1920;
  const s = (px: number) => Math.round(px * scale);
  const safe = vertical ? {x: s(80) + 24, y: s(100) + 140} : {x: s(120), y: s(100)};
  return {width, height, fps, vertical, scale, s, safe};
};
