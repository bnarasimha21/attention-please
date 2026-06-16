// Scene timings — adjust these after audio is recorded
// All values in FRAMES at 30fps
// To convert seconds to frames: seconds * 30
//
// NOTE: these are tightened for SILENT preview — each scene ends ~2s after its
// last animation beat (no narration dead-air). When you record voiceover,
// lengthen each `duration` to match the spoken script in
// scripts/t15-rag-dead.md.

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames (cumulative) — tightened preview cut.
// NOTE: `start` is reference-only now; scene layout is driven by `duration`
// via <TransitionSeries> in T15.tsx.
export const TIMINGS = {
  scene1: { start: 0,         duration: 18 * FPS }, // Hook — RAG IS DEAD?
  scene2: { start: 18 * FPS,  duration: 22 * FPS }, // What RAG is (pipeline)
  scene3: { start: 40 * FPS,  duration: 22 * FPS }, // Why people say it's dead
  scene4: { start: 62 * FPS,  duration: 22 * FPS }, // What actually changed
  scene5: { start: 84 * FPS,  duration: 22 * FPS }, // Long context vs RAG
  scene6: { start: 106 * FPS, duration: 18 * FPS }, // The verdict
  scene7: { start: 124 * FPS, duration: 19 * FPS }, // Why it matters
  scene8: { start: 143 * FPS, duration: 19 * FPS }, // Recap + CTA
  scene9: { start: 162 * FPS, duration: 14 * FPS }, // Like & Subscribe CTA
};

// Sum of scene durations (162s) minus the 7 overlapping crossfades.
export const TOTAL_FRAMES = 176 * FPS - 8 * XFADE; // ~2:51 (+ CTA)
