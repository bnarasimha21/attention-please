// Scene timings — adjust these after audio is recorded
// All values in FRAMES at 30fps
// To convert seconds to frames: seconds * 30
//
// NOTE: these are tightened for SILENT preview — each scene ends ~2s after its
// last animation beat (no narration dead-air). When you record voiceover,
// lengthen each `duration` to match the spoken script in
// scripts/t17-reasoning-models.md.

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames (cumulative) — readable cut: larger fonts + longer holds
// so every reasoning line stays on screen ≥3s before the scene changes.
// NOTE: `start` is reference-only; scene layout is driven by `duration`
// via <TransitionSeries> in T17.tsx.
export const TIMINGS = {
  scene1: { start: 0,         duration: 16 * FPS }, // Hook — "Thinking…"
  scene2: { start: 16 * FPS,  duration: 22 * FPS }, // It talks to itself
  scene3: { start: 38 * FPS,  duration: 26 * FPS }, // Chain of thought (longest)
  scene4: { start: 64 * FPS,  duration: 20 * FPS }, // Self-correction
  scene5: { start: 84 * FPS,  duration: 18 * FPS }, // The trace collapses
  scene6: { start: 102 * FPS, duration: 18 * FPS }, // Why it's hidden
  scene7: { start: 120 * FPS, duration: 18 * FPS }, // Why it matters
  scene8: { start: 138 * FPS, duration: 17 * FPS }, // Recap + CTA
  scene9: { start: 155 * FPS, duration: 14 * FPS }, // Like & Subscribe CTA
};

// Sum of scene durations (155s) minus the 7 overlapping crossfades.
export const TOTAL_FRAMES = 169 * FPS - 8 * XFADE; // ~2:44 (+ CTA)
