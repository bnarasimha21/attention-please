import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1QuietFailure } from "./scenes/Scene1QuietFailure";
import { Scene2TerminationStack } from "./scenes/Scene2TerminationStack";
import { Scene3ExitConditions } from "./scenes/Scene3ExitConditions";
import { Scene4DurableState } from "./scenes/Scene4DurableState";
import { Scene5Topologies } from "./scenes/Scene5Topologies";
import { Scene6WhatItIsAbout } from "./scenes/Scene6WhatItIsAbout";
import { Scene7TheContract } from "./scenes/Scene7TheContract";
import { Scene8CTA } from "./scenes/Scene8CTA";

// Trending 04 — Loop Engineering.
// Scenes are crossfaded with @remotion/transitions; durations in timings.ts.
// Each scene plays its own narration clip (public/audio/t04-loop-engineering/sNN.m4a);
// scene durations = clip length + ~1s tail. Scene animations are re-paced to fill.

const AUDIO_DIR = "audio/t04-loop-engineering";

export const T04: React.FC = () => {
  // IMPORTANT: build the children array INSIDE the component body. Putting JSX
  // in a module-level const breaks the esbuild bundler ("React is not defined").
  const SCENES = [
    { C: Scene1QuietFailure, duration: TIMINGS.scene1.duration, audio: "s01.m4a" },
    { C: Scene2TerminationStack, duration: TIMINGS.scene2.duration, audio: "s02.m4a" },
    { C: Scene3ExitConditions, duration: TIMINGS.scene3.duration, audio: "s03.m4a" },
    { C: Scene4DurableState, duration: TIMINGS.scene4.duration, audio: "s04.m4a" },
    { C: Scene5Topologies, duration: TIMINGS.scene5.duration, audio: "s05.m4a" },
    { C: Scene6WhatItIsAbout, duration: TIMINGS.scene6.duration, audio: "s06.m4a" },
    { C: Scene7TheContract, duration: TIMINGS.scene7.duration, audio: "s07.m4a" },
    { C: Scene8CTA, duration: TIMINGS.scene8.duration, audio: "s08.m4a" },
  ];

  const children: React.ReactNode[] = [];
  SCENES.forEach(({ C, duration, audio }, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={duration}>
        <AbsoluteFill>
          <C />
          <Audio src={staticFile(`${AUDIO_DIR}/${audio}`)} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
    );
    if (i < SCENES.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: XFADE })}
        />
      );
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
