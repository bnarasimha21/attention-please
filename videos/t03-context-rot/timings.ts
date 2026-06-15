// Scene timings — adjust these after audio is recorded
// All values in FRAMES at 30fps
// To convert seconds to frames: seconds * 30
//
// NOTE: these are currently tightened for SILENT preview — each scene ends
// ~2s after its last animation beat (no narration dead-air). When you record
// voiceover, lengthen each `duration` to match the spoken script in
// scripts/t03-context-rot.md.

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames (cumulative) — tightened preview cut.
// NOTE: `start` is reference-only now; scene layout is driven by `duration`
// via <TransitionSeries> in T03.tsx.
export const TIMINGS = {
  scene1: { start: 0,         duration: 18 * FPS }, // Hook — chat degrades
  scene2: { start: 18 * FPS,  duration: 20 * FPS }, // What is context rot
  scene3: { start: 38 * FPS,  duration: 22 * FPS }, // Lost in the middle
  scene4: { start: 60 * FPS,  duration: 20 * FPS }, // Why it happens (spotlight)
  scene5: { start: 80 * FPS,  duration: 22 * FPS }, // The demo (French rule)
  scene6: { start: 102 * FPS, duration: 22 * FPS }, // The fixes
  scene7: { start: 124 * FPS, duration: 18 * FPS }, // Why it matters
  scene8: { start: 142 * FPS, duration: 16 * FPS }, // Recap + CTA
};

// Sum of scene durations (158s) minus the 7 overlapping crossfades.
export const TOTAL_FRAMES = 158 * FPS - 7 * XFADE; // ~2:34
