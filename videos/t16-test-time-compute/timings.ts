// Scene timings — adjust these after audio is recorded
// All values in FRAMES at 30fps
// To convert seconds to frames: seconds * 30
//
// NOTE: these are currently tightened for SILENT preview — each scene ends
// ~2s after its last animation beat (no narration dead-air). When you record
// voiceover, lengthen each `duration` to match the spoken script in
// scripts/t16-test-time-compute.md (the full read is ~1:55).

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames (cumulative).
// NOTE: `start` is reference-only now; scene layout is driven by `duration`
// via <TransitionSeries> in T16.tsx. Durations lengthened so every readable
// line holds fully visible for ≥3s and reveals stagger ~1.2–1.5s apart.
export const TIMINGS = {
  scene1: { start: 0,         duration: 20 * FPS }, // Hook — two models
  scene2: { start: 20 * FPS,  duration: 17 * FPS }, // The old way — one pass
  scene3: { start: 37 * FPS,  duration: 22 * FPS }, // The new way — think first
  scene4: { start: 59 * FPS,  duration: 18 * FPS }, // More thinking = better
  scene5: { start: 77 * FPS,  duration: 18 * FPS }, // The tradeoff — the dial
  scene6: { start: 95 * FPS,  duration: 20 * FPS }, // Why it's huge — two axes
  scene7: { start: 115 * FPS, duration: 20 * FPS }, // When to use it
  scene8: { start: 135 * FPS, duration: 18 * FPS }, // Recap + CTA
  scene9: { start: 153 * FPS, duration: 14 * FPS }, // Like & Subscribe CTA
};

// Sum of scene durations (153s) minus the 7 overlapping crossfades.
export const TOTAL_FRAMES = 167 * FPS - 8 * XFADE; // ~2:42 (+ CTA)
