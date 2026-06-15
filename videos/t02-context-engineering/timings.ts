// Scene timings — adjust these after audio is recorded
// All values in FRAMES at 30fps
// To convert seconds to frames: seconds * 30
//
// NOTE: these are currently tightened for SILENT preview — each scene ends
// ~2s after its last animation beat (no narration dead-air). When you record
// voiceover, lengthen each `duration` to match the spoken script in
// scripts/t02-context-engineering.md.

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames (cumulative).
// NOTE: `start` is reference-only now; scene layout is driven by `duration`
// via <TransitionSeries> in T02.tsx.
// Durations enlarged so every readable line holds >= 3s before the scene ends.
export const TIMINGS = {
  scene1: { start: 0,          duration: 17 * FPS }, // Hook
  scene2: { start: 17 * FPS,   duration: 17 * FPS }, // Prompt vs context
  scene3: { start: 34 * FPS,   duration: 22 * FPS }, // What goes into context
  scene4: { start: 56 * FPS,   duration: 18 * FPS }, // The window is finite
  scene5: { start: 74 * FPS,   duration: 19 * FPS }, // Curation is the skill
  scene6: { start: 93 * FPS,   duration: 18 * FPS }, // Right info, right place, right time
  scene7: { start: 111 * FPS,  duration: 16 * FPS }, // Why it matters
  scene8: { start: 127 * FPS,  duration: 17 * FPS }, // Recap + CTA
};

// Sum of scene durations (144s) minus the 7 overlapping crossfades.
export const TOTAL_FRAMES = 144 * FPS - 7 * XFADE; // ~2:21
