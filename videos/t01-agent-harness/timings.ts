// Scene timings — t01 DEEP v2 (15 scenes), AUDIO-SYNCED to the TRIMMED narration.
// duration = trimmed-audio frames + ~1s tail (audio never butts the crossfade;
// short hold before the transition). Per-scene audio: public/audio/t01-agent-harness/sNN.m4a
// wired in T01.tsx. Explicit FRAMES @ 30fps.
//
// trimmed audio (s): s01 32.47 s02 19.71 s03 30.48 s04 42.22 s05 37.66 s06 34.77
//   s07 43.29 s08 40.59 s09 32.73 s10 38.73 s11 25.94 s12 36.19 s13 35.51 s14 23.12 s15 6.37

export const FPS = 30;
export const XFADE = 18;

export const TIMINGS = {
  scene1:  { start: 0, duration: 1004 }, // 32.47s + tail
  scene2:  { start: 0, duration: 621 },  // 19.71s audio + ~1s tail
  scene3:  { start: 0, duration: 944 },  // 30.48s
  scene4:  { start: 0, duration: 1297 }, // 42.22s
  scene5:  { start: 0, duration: 1160 }, // 37.66s
  scene6:  { start: 0, duration: 1073 }, // 34.77s
  scene7:  { start: 0, duration: 1329 }, // 43.29s
  scene8:  { start: 0, duration: 1248 }, // 40.59s
  scene9:  { start: 0, duration: 1012 }, // 32.73s
  scene10: { start: 0, duration: 1192 }, // 38.73s
  scene11: { start: 0, duration: 808 },  // 25.94s
  scene12: { start: 0, duration: 1116 }, // 36.19s
  scene13: { start: 0, duration: 1095 }, // 35.51s
  scene14: { start: 0, duration: 724 },  // 23.12s
  scene15: { start: 0, duration: 210 },  // 6.37s voice; CTA cursor compressed to ~6.4s
};

// Total = sum(durations) - 14 crossfades.
export const TOTAL_FRAMES =
  Object.values(TIMINGS).reduce((s, t) => s + t.duration, 0) - 14 * XFADE;
