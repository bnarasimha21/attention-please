import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2OldWay } from "./scenes/Scene2OldWay";
import { Scene3NewWay } from "./scenes/Scene3NewWay";
import { Scene4MoreThinking } from "./scenes/Scene4MoreThinking";
import { Scene5Tradeoff } from "./scenes/Scene5Tradeoff";
import { Scene6WhyHuge } from "./scenes/Scene6WhyHuge";
import { Scene7WhenToUse } from "./scenes/Scene7WhenToUse";
import { Scene8CTA } from "./scenes/Scene8CTA";

// Trending 16 — Test-Time Compute (why the best models now "think" first)
// Scenes are crossfaded with @remotion/transitions. Each transition overlaps
// the trailing hold of one scene with the intro of the next, so no content is
// lost. Timings (incl. XFADE) live in timings.ts.

export const T16: React.FC = () => {
  // IMPORTANT: build the children array INSIDE the component body. Putting JSX
  // in a module-level const breaks the esbuild bundler ("React is not defined").
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration },
    { C: Scene2OldWay, duration: TIMINGS.scene2.duration },
    { C: Scene3NewWay, duration: TIMINGS.scene3.duration },
    { C: Scene4MoreThinking, duration: TIMINGS.scene4.duration },
    { C: Scene5Tradeoff, duration: TIMINGS.scene5.duration },
    { C: Scene6WhyHuge, duration: TIMINGS.scene6.duration },
    { C: Scene7WhenToUse, duration: TIMINGS.scene7.duration },
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
