import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2WhatRAG } from "./scenes/Scene2WhatRAG";
import { Scene3WhyDead } from "./scenes/Scene3WhyDead";
import { Scene4WhatChanged } from "./scenes/Scene4WhatChanged";
import { Scene5LongContext } from "./scenes/Scene5LongContext";
import { Scene6Verdict } from "./scenes/Scene6Verdict";
import { Scene7WhyMatters } from "./scenes/Scene7WhyMatters";
import { Scene8CTA } from "./scenes/Scene8CTA";

// Trending 15 — Is RAG dead?
// Scenes are crossfaded with @remotion/transitions. Each transition overlaps
// the trailing hold of one scene with the intro of the next, so no content is
// lost. Timings (incl. XFADE) live in timings.ts.

export const T15: React.FC = () => {
  // CRITICAL: build the children array INSIDE the component body. Putting JSX
  // in a module-level const breaks the esbuild bundler ("React is not defined").
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration },
    { C: Scene2WhatRAG, duration: TIMINGS.scene2.duration },
    { C: Scene3WhyDead, duration: TIMINGS.scene3.duration },
    { C: Scene4WhatChanged, duration: TIMINGS.scene4.duration },
    { C: Scene5LongContext, duration: TIMINGS.scene5.duration },
    { C: Scene6Verdict, duration: TIMINGS.scene6.duration },
    { C: Scene7WhyMatters, duration: TIMINGS.scene7.duration },
    { C: Scene8CTA, duration: TIMINGS.scene8.duration },
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
