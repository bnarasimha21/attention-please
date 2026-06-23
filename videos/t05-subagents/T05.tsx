import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Idea } from "./scenes/Scene3Idea";
import { Scene4HowItWorks } from "./scenes/Scene4HowItWorks";
import { Scene5Parallel } from "./scenes/Scene5Parallel";
import { Scene6WhenToUse } from "./scenes/Scene6WhenToUse";
import { Scene7WhyMatters } from "./scenes/Scene7WhyMatters";
import { Scene8CTA } from "./scenes/Scene8CTA";
import { Scene9CTA } from "./scenes/Scene9CTA";

// Trending 04 — Subagents: giving each task its own brain
// Scenes are crossfaded with @remotion/transitions. Each transition overlaps
// the trailing hold of one scene with the intro of the next, so no content is
// lost. Timings (incl. XFADE) live in timings.ts.

export const T05: React.FC = () => {
  // NOTE: build the scene list + children array INSIDE the component body.
  // Putting JSX in a module-level const breaks the bundler ("React is not
  // defined"), so everything that produces elements lives here.
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration },
    { C: Scene2Problem, duration: TIMINGS.scene2.duration },
    { C: Scene3Idea, duration: TIMINGS.scene3.duration },
    { C: Scene4HowItWorks, duration: TIMINGS.scene4.duration },
    { C: Scene5Parallel, duration: TIMINGS.scene5.duration },
    { C: Scene6WhenToUse, duration: TIMINGS.scene6.duration },
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
