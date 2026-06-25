// timings.ts — T04 Loop Engineering
// Placeholder durations (900 frames = 30s each); update after audio is recorded.

export const FPS = 30;

// Cross-fade overlap between scenes, in frames.
export const XFADE = 18;

export const TIMINGS = {
  scene1: { start: 0, duration: 900 },
  scene2: { start: 0, duration: 900 },
  scene3: { start: 0, duration: 900 },
  scene4: { start: 0, duration: 900 },
  scene5: { start: 0, duration: 900 },
  scene6: { start: 0, duration: 900 },
  scene7: { start: 0, duration: 900 },
  scene8: { start: 0, duration: 900 },
};

// 8 scenes * 900 frames − 18 frames * 7 transitions = 7074
export const TOTAL_FRAMES = 8 * 900 - XFADE * 7;
