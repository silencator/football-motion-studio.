export type Format = {id: string; width: number; height: number; fps: 30 | 60};

export const FORMATS = {
  landscape30: {id: 'Landscape-30', width: 1920, height: 1080, fps: 30},
  landscape60: {id: 'Landscape-60', width: 1920, height: 1080, fps: 60},
  vertical30: {id: 'Vertical-30', width: 1080, height: 1920, fps: 30},
  vertical60: {id: 'Vertical-60', width: 1080, height: 1920, fps: 60},
} as const satisfies Record<string, Format>;
