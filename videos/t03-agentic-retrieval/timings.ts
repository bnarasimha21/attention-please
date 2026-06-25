// Scene timings — t03 Agentic Retrieval (9 scenes).
// All values in FRAMES at 30fps.
//
// NOTE: these are SILENT-PREVIEW estimates (~150 wpm from the script word counts).
// When the per-scene VO is recorded (public/audio/t03-agentic-retrieval/sNN.m4a),
// set each `duration` = trimmed clip length + ~0.7s tail and wire <Audio> in T03.tsx
// (skill Step 7), then re-time the scene beats to the Whisper transcripts (Step 9).

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames are reference-only; layout is driven by `duration` via
// <TransitionSeries> in T03.tsx.
export const TIMINGS = {
  scene1: { start: 0, duration: 1320 }, // Hook — needle vs haystack
  scene2: { start: 0, duration: 1260 }, // The core problem — retrieve on demand
  scene3: { start: 0, duration: 2220 }, // Index it right — chunking + contextual retrieval
  scene4: { start: 0, duration: 2280 }, // Hybrid + rerank — the modern stack (-67%)
  scene5: { start: 0, duration: 2100 }, // Agentic retrieval — the search loop
  scene6: { start: 0, duration: 1620 }, // Just-in-time + memory retrieval
  scene7: { start: 0, duration: 1440 }, // RAG vs long context — use both
  scene8: { start: 0, duration: 1200 }, // Why it matters — retrieval = senses
  scene9: { start: 0, duration: 420 },  // Like & Subscribe CTA (~14s choreography)
};

// Sum of scene durations minus the overlapping crossfades (one per gap between scenes).
export const TOTAL_FRAMES =
  Object.values(TIMINGS).reduce((s, t) => s + t.duration, 0) -
  (Object.keys(TIMINGS).length - 1) * XFADE;
