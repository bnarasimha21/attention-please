// Scene timings — adjust these after audio is recorded
// All values in FRAMES at 30fps
// To convert seconds to frames: seconds * 30
//
// NOTE: these are currently tightened for SILENT preview — each scene ends
// ~2s after its last animation beat (no narration dead-air). When you record
// voiceover, lengthen each `duration` to match the spoken script in
// scripts/t01-agent-harness.md (the full read is ~6:45).

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames (cumulative).
// NOTE: `start` is reference-only now; scene layout is driven by `duration`
// via <TransitionSeries> in T01.tsx.
// Durations lengthened so every readable line holds ≥3s after animating in.
export const TIMINGS = {
  scene1: { start: 0,         duration: 19 * FPS }, // Hook
  scene2: { start: 19 * FPS,  duration: 20 * FPS }, // One-line definition
  scene3: { start: 39 * FPS,  duration: 20 * FPS }, // The agent loop
  scene4: { start: 59 * FPS,  duration: 22 * FPS }, // The harness layers
  scene5: { start: 81 * FPS,  duration: 21 * FPS }, // Permissions gate
  scene6: { start: 102 * FPS, duration: 21 * FPS }, // Context & compaction
  scene7: { start: 123 * FPS, duration: 19 * FPS }, // Why it matters
  scene8: { start: 142 * FPS, duration: 18 * FPS }, // Recap + teaser
  scene9: { start: 160 * FPS, duration: 14 * FPS }, // Like & Subscribe CTA
};

// Sum of scene durations (174s) minus the 8 overlapping crossfades.
// 174*30 - 8*18 = 5220 - 144 = 5076 frames ≈ 2:49.
export const TOTAL_FRAMES = 174 * FPS - 8 * XFADE;
