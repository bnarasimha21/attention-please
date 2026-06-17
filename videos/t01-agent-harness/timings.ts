// Scene timings — t01 DEEP v2 (15 scenes). All values in FRAMES at 30fps.
// Durations track the narration script (scripts/t01-agent-harness.md).
// Scene layout is driven by `duration` via <TransitionSeries> in T01.tsx.

export const FPS = 30;

// Crossfade length between scenes (frames). Each transition overlaps two scenes.
export const XFADE = 18;

export const TIMINGS = {
  scene1:  { start: 0,   duration: 32 * FPS }, // Hook — model is helpless without the harness
  scene2:  { start: 0,   duration: 23 * FPS }, // Definition — brain in a jar / harness is the body
  scene3:  { start: 0,   duration: 30 * FPS }, // Stateless function — amnesia
  scene4:  { start: 0,   duration: 43 * FPS }, // The agentic loop (ReAct) + pseudocode
  scene5:  { start: 0,   duration: 34 * FPS }, // Tool calling for real (tool_use JSON)
  scene6:  { start: 0,   duration: 30 * FPS }, // Context assembly (rebuilt every turn)
  scene7:  { start: 0,   duration: 38 * FPS }, // Window + prompt caching + compaction
  scene8:  { start: 0,   duration: 30 * FPS }, // Permissions gate + classifier
  scene9:  { start: 0,   duration: 28 * FPS }, // Subagents — isolated context
  scene10: { start: 0,   duration: 28 * FPS }, // MCP — USB for AI
  scene11: { start: 0,   duration: 24 * FPS }, // Hooks — deterministic guardrails
  scene12: { start: 0,   duration: 34 * FPS }, // Why harness > model
  scene13: { start: 0,   duration: 30 * FPS }, // How harnesses go wrong (failure modes)
  scene14: { start: 0,   duration: 20 * FPS }, // Recap — assemble the full diagram
  scene15: { start: 0,   duration: 14 * FPS }, // Like & Subscribe CTA
};

// `start` is reference-only (layout is driven by durations in TransitionSeries).
// Total = sum(durations) - 14 overlapping crossfades.
// sum = 438s → 438*30 - 14*18 = 13140 - 252 = 12888 frames ≈ 7:10.
export const TOTAL_FRAMES = 438 * FPS - 14 * XFADE;
