// Scene timings — t02 Agent Failures (9 scenes), AUDIO-SYNCED.
// All values in FRAMES at 30fps. duration = narration clip length + ~1s tail.
// Per-scene clips: public/audio/t02-agent-failures/sNN.m4a, wired in T02F.tsx.
//
// Trimmed clip lengths (s, silence-trimmed): s01 28.54 s02 25.51 s03 123.41
//   s04 119.97 s05 123.45 s06 147.59 s07 43.89 s09 11.16 (~10:27 narration; s08 recap removed).
// Raw originals in public/audio/t02-agent-failures/raw/. Global speed-up applied
// to the FINAL render (VO recorded ~137wpm, deliberately slow).
// Scene animations are timed to the Whisper transcripts (videos/.../captions/)
// so each beat fires when its phrase is spoken — see each Scene*.tsx.

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames are reference-only; layout is driven by `duration` via
// <TransitionSeries> in T02F.tsx. TAIL = ~1s after the clip before the crossfade.
export const TIMINGS = {
  scene1: { start: 0, duration: 877 },  // 28.54s clip + ~0.7s tail
  scene2: { start: 0, duration: 786 },  // 25.51s
  scene3: { start: 0, duration: 3723 }, // 123.41s — Runaway loop break→fix demo
  scene4: { start: 0, duration: 3620 }, // 119.97s — Context rot accuracy sink/recover
  scene5: { start: 0, duration: 3725 }, // 123.45s — Tool sprawl hesitation→instant
  scene6: { start: 0, duration: 4449 }, // 147.59s — Over-permission catastrophe-prevented
  scene7: { start: 0, duration: 1338 }, // 43.89s — Unifying principle
  // scene8 (Recap 2x2) removed — trimmed for length; CTA follows the unifying principle.
  scene9: { start: 0, duration: 420 },  // 11.16s clip; CTA cursor choreography runs ~14s
};

// Sum of scene durations minus the overlapping crossfades (one per gap between scenes).
export const TOTAL_FRAMES =
  Object.values(TIMINGS).reduce((s, t) => s + t.duration, 0) -
  (Object.keys(TIMINGS).length - 1) * XFADE;
