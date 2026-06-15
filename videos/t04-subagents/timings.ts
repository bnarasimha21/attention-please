// Scene timings — adjust these after audio is recorded
// All values in FRAMES at 30fps
// To convert seconds to frames: seconds * 30
//
// NOTE: these are currently tightened for SILENT preview — each scene ends
// ~2s after its last animation beat (no narration dead-air). When you record
// voiceover, lengthen each `duration` to match the spoken script in
// scripts/t04-subagents.md.

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames (cumulative) — readable cut (longer holds, larger text).
// NOTE: `start` is reference-only now; scene layout is driven by `duration`
// via <TransitionSeries> in T04.tsx.
export const TIMINGS = {
  scene1: { start: 0,         duration: 20 * FPS }, // Hook — one brain, too much noise
  scene2: { start: 20 * FPS,  duration: 20 * FPS }, // The problem — goal buried under junk
  scene3: { start: 40 * FPS,  duration: 19 * FPS }, // The idea — spin off a subagent
  scene4: { start: 59 * FPS,  duration: 24 * FPS }, // How it works — isolation (key scene)
  scene5: { start: 83 * FPS,  duration: 22 * FPS }, // Parallel subagents
  scene6: { start: 105 * FPS, duration: 22 * FPS }, // When to use
  scene7: { start: 127 * FPS, duration: 19 * FPS }, // Why it matters
  scene8: { start: 146 * FPS, duration: 18 * FPS }, // Recap + CTA
};

// Sum of scene durations (164s) minus the 7 overlapping crossfades.
export const TOTAL_FRAMES = 164 * FPS - 7 * XFADE; // ~2:39 readable cut
