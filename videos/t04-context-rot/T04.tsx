import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Definition } from "./scenes/Scene2Definition";
import { Scene3LostInMiddle } from "./scenes/Scene3LostInMiddle";
import { Scene4WhyItHappens } from "./scenes/Scene4WhyItHappens";
import { Scene5Demo } from "./scenes/Scene5Demo";
import { Scene6Fixes } from "./scenes/Scene6Fixes";
import { Scene7WhyMatters } from "./scenes/Scene7WhyMatters";
import { Scene8CTA } from "./scenes/Scene8CTA";
import { Scene9CTA } from "./scenes/Scene9CTA";

// Trending 03 — Context Rot: why long conversations get dumber
// Scenes are crossfaded with @remotion/transitions. Each transition overlaps
// the trailing hold of one scene with the intro of the next, so no content is
// lost. Timings (incl. XFADE) live in timings.ts.

export const T04: React.FC = () => {
  // Build the children array INSIDE the component body so esbuild keeps React
  // in scope (module-level JSX consts break the bundler).
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration },
    { C: Scene2Definition, duration: TIMINGS.scene2.duration },
    { C: Scene3LostInMiddle, duration: TIMINGS.scene3.duration },
    { C: Scene4WhyItHappens, duration: TIMINGS.scene4.duration },
    { C: Scene5Demo, duration: TIMINGS.scene5.duration },
    { C: Scene6Fixes, duration: TIMINGS.scene6.duration },
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
