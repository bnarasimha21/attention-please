// Scene timings — t03 Agentic Retrieval (9 scenes).
// All values in FRAMES at 30fps.
//
// Durations are LOCKED to the recorded VO (trimmed clip length + ~0.7s tail).
// Built at NATURAL pace (trimmed total ~503s ≈ 8.4 min); the global speed-up
// (~1.2x, skill Step 11) lands it near ~7:00 at render time.

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two
// scenes, so it's subtracted from the grand total below.
export const XFADE = 18;

// Scene start frames are reference-only; layout is driven by `duration` via
// <TransitionSeries> in T03.tsx.
export const TIMINGS = {
  scene1: { start: 0, duration: 1421 }, // Hook — needle vs haystack (s01 46.66s)
  scene2: { start: 0, duration: 1479 }, // The core problem — retrieve on demand (s02 48.58s)
  scene3: { start: 0, duration: 2439 }, // Index it right — chunking + contextual retrieval (s03 80.57s)
  scene4: { start: 0, duration: 2551 }, // Hybrid + rerank — the modern stack (-67%) (s04 84.31s)
  scene5: { start: 0, duration: 2116 }, // Agentic retrieval — the search loop (s05 69.83s)
  scene6: { start: 0, duration: 1365 }, // Just-in-time + memory retrieval (s06 44.78s)
  scene7: { start: 0, duration: 1440 }, // RAG vs long context — use both (s07 47.27s)
  scene8: { start: 0, duration: 1171 }, // Why it matters — retrieval = senses (s08 38.31s)
  scene9: { start: 0, duration: 1303 }, // Recap + Like & Subscribe CTA (s09 42.71s)
};

// Sum of scene durations minus the overlapping crossfades (one per gap between scenes).
export const TOTAL_FRAMES =
  Object.values(TIMINGS).reduce((s, t) => s + t.duration, 0) -
  (Object.keys(TIMINGS).length - 1) * XFADE;
