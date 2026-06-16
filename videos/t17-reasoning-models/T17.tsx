import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2TalksToItself } from "./scenes/Scene2TalksToItself";
import { Scene3ChainOfThought } from "./scenes/Scene3ChainOfThought";
import { Scene4SelfCorrection } from "./scenes/Scene4SelfCorrection";
import { Scene5TraceCollapses } from "./scenes/Scene5TraceCollapses";
import { Scene6WhyHidden } from "./scenes/Scene6WhyHidden";
import { Scene7WhyMatters } from "./scenes/Scene7WhyMatters";
import { Scene8CTA } from "./scenes/Scene8CTA";
import { Scene9CTA } from "./scenes/Scene9CTA";

// Trending 17 — Inside a Reasoning Model
// Scenes are crossfaded with @remotion/transitions. Each transition overlaps
// the trailing hold of one scene with the intro of the next, so no content is
// lost. Timings (incl. XFADE) live in timings.ts.

export const T17: React.FC = () => {
  // IMPORTANT: the SCENES list and the children array are built INSIDE the
  // component body — putting JSX in a module-level const breaks the esbuild
  // bundler ("React is not defined").
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration },
    { C: Scene2TalksToItself, duration: TIMINGS.scene2.duration },
    { C: Scene3ChainOfThought, duration: TIMINGS.scene3.duration },
    { C: Scene4SelfCorrection, duration: TIMINGS.scene4.duration },
    { C: Scene5TraceCollapses, duration: TIMINGS.scene5.duration },
    { C: Scene6WhyHidden, duration: TIMINGS.scene6.duration },
    { C: Scene7WhyMatters, duration: TIMINGS.scene7.duration },
    { C: Scene8CTA, duration: TIMINGS.scene8.duration },
    { C: Scene9CTA, duration: TIMINGS.scene9.duration },
  ];

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
