// Scene timings — adjust these after audio is recorded
// All values in FRAMES at 30fps
// To convert seconds to frames: seconds * 30

export const FPS = 30;

// Scene start frames (cumulative)
export const TIMINGS = {
  scene1: { start: 0,    duration: 30  * FPS }, // 0:00-0:30  Hook
  scene2: { start: 30  * FPS, duration: 60 * FPS }, // 0:30-1:30  What is a token
  scene3: { start: 90  * FPS, duration: 60 * FPS }, // 1:30-2:30  Why tokens
  scene4: { start: 150 * FPS, duration: 60 * FPS }, // 2:30-3:30  BPE
  scene5: { start: 210 * FPS, duration: 45 * FPS }, // 3:30-4:15  Tokens to IDs
  scene6: { start: 255 * FPS, duration: 45 * FPS }, // 4:15-5:00  Strawberry
  scene7: { start: 300 * FPS, duration: 45 * FPS }, // 5:00-5:45  Why it matters
  scene8: { start: 345 * FPS, duration: 30 * FPS }, // 5:45-6:15  Recap + CTA
};

export const TOTAL_FRAMES = 375 * FPS; // 6:15 total
