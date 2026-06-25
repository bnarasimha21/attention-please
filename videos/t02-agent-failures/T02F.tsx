import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2FourFailures } from "./scenes/Scene2FourFailures";
import { Scene3RunawayLoop } from "./scenes/Scene3RunawayLoop";
import { Scene4ContextRot } from "./scenes/Scene4ContextRot";
import { Scene5ToolSprawl } from "./scenes/Scene5ToolSprawl";
import { Scene6OverPermission } from "./scenes/Scene6OverPermission";
import { Scene7Unifying } from "./scenes/Scene7Unifying";
import { Scene9CTA } from "./scenes/Scene9CTA";

// Trending 02 (agent series, part 2) — 4 Ways Your AI Agent Fails (And How to
// Fix Each One). Script: scripts/t02-agent-failures.md.
// Scenes are crossfaded with @remotion/transitions; durations in timings.ts.
// Each scene plays its own narration clip (public/audio/t02-agent-failures/sNN.m4a);
// scene durations = clip length + ~1s tail. Scene animations are re-paced to fill.

const AUDIO_DIR = "audio/t02-agent-failures";

export const T02F: React.FC = () => {
  // IMPORTANT: build the children array INSIDE the component body. Putting JSX
  // in a module-level const breaks the esbuild bundler ("React is not defined").
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration, audio: "s01.m4a" },
    { C: Scene2FourFailures, duration: TIMINGS.scene2.duration, audio: "s02.m4a" },
    { C: Scene3RunawayLoop, duration: TIMINGS.scene3.duration, audio: "s03.m4a" },
    { C: Scene4ContextRot, duration: TIMINGS.scene4.duration, audio: "s04.m4a" },
    { C: Scene5ToolSprawl, duration: TIMINGS.scene5.duration, audio: "s05.m4a" },
    { C: Scene6OverPermission, duration: TIMINGS.scene6.duration, audio: "s06.m4a" },
    { C: Scene7Unifying, duration: TIMINGS.scene7.duration, audio: "s07.m4a" },
    { C: Scene9CTA, duration: TIMINGS.scene9.duration, audio: "s09.m4a" },
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
