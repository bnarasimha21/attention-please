import { Audio, Sequence, staticFile } from "remotion";

// License-free SFX palette (generated with ffmpeg, lives in public/audio/sfx/).
// Drop a one-shot cue at a specific scene-local frame:
//   <Sfx name="alarm" at={fps * 2} />
// `at` is relative to the scene's own frame 0 (TransitionSeries resets frame
// per scene), so cues line up with that scene's animation beats. Keep volume
// low (0.3–0.6) so cues sit UNDER the eventual narration.

export type SfxName =
  | "tick"     // soft counter / iteration tick
  | "pop"      // element / card pop-in
  | "whoosh"   // transition / reveal sweep
  | "success"  // major-triad chime — a fix lands
  | "error"    // descending low tone — failure
  | "block"    // hard denied thunk — sandbox wall / hard block
  | "alarm"    // rising chirp — runaway cost climbing
  | "stinger"; // 3-note brand motif — scene punchline

// `rate` pitch-shifts/speeds the cue (playbackRate) so a reused sound doesn't feel
// identical every time — vary it ~0.9–1.12 across repeats and per scene-end stinger
// to break the monotony of the same file firing over and over.
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number; rate?: number }> = ({
  name,
  at,
  volume = 0.5,
  rate = 1,
}) => (
  <Sequence from={Math.max(0, Math.round(at))} name={`sfx:${name}`}>
    <Audio src={staticFile(`audio/sfx/${name}.mp3`)} volume={volume} playbackRate={rate} />
  </Sequence>
);
