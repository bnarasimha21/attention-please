import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Definition } from "./scenes/Scene2Definition";
import { Scene3Loop } from "./scenes/Scene3Loop";
import { Scene4Layers } from "./scenes/Scene4Layers";
import { Scene5Permissions } from "./scenes/Scene5Permissions";
import { Scene6Compaction } from "./scenes/Scene6Compaction";
import { Scene7WhyMatters } from "./scenes/Scene7WhyMatters";
import { Scene8CTA } from "./scenes/Scene8CTA";
import { Scene9CTA } from "./scenes/Scene9CTA";

// Trending 01 — What is an agent harness?
// Scenes are crossfaded with @remotion/transitions. Each transition overlaps
// the trailing hold of one scene with the intro of the next, so no content is
// lost. Timings (incl. XFADE) live in timings.ts.

const SCENES = [
  { C: Scene1Hook, duration: TIMINGS.scene1.duration },
  { C: Scene2Definition, duration: TIMINGS.scene2.duration },
  { C: Scene3Loop, duration: TIMINGS.scene3.duration },
  { C: Scene4Layers, duration: TIMINGS.scene4.duration },
  { C: Scene5Permissions, duration: TIMINGS.scene5.duration },
  { C: Scene6Compaction, duration: TIMINGS.scene6.duration },
  { C: Scene7WhyMatters, duration: TIMINGS.scene7.duration },
  { C: Scene8CTA, duration: TIMINGS.scene8.duration },
  { C: Scene9CTA, duration: TIMINGS.scene9.duration },
];

export const T01: React.FC = () => {
  const children: React.ReactNode[] = [];
  SCENES.forEach(({ C, duration }, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={duration}>
        <C />
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
