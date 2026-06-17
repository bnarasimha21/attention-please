import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Definition } from "./scenes/Scene2Definition";
import { Scene3Stateless } from "./scenes/Scene3Stateless";
import { Scene4Loop } from "./scenes/Scene4Loop";
import { Scene5ToolCalling } from "./scenes/Scene5ToolCalling";
import { Scene6ContextAssembly } from "./scenes/Scene6ContextAssembly";
import { Scene7Compaction } from "./scenes/Scene7Compaction";
import { Scene8Permissions } from "./scenes/Scene8Permissions";
import { Scene9Subagents } from "./scenes/Scene9Subagents";
import { Scene10MCP } from "./scenes/Scene10MCP";
import { Scene11Hooks } from "./scenes/Scene11Hooks";
import { Scene12WhyMatters } from "./scenes/Scene12WhyMatters";
import { Scene13FailureModes } from "./scenes/Scene13FailureModes";
import { Scene14Recap } from "./scenes/Scene14Recap";
import { Scene15CTA } from "./scenes/Scene15CTA";

// Trending 01 — What is an agent harness? (DEEP v2, 15 scenes)
// Crossfaded via TransitionSeries. Timings in timings.ts.

export const T01: React.FC = () => {
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration },
    { C: Scene2Definition, duration: TIMINGS.scene2.duration },
    { C: Scene3Stateless, duration: TIMINGS.scene3.duration },
    { C: Scene4Loop, duration: TIMINGS.scene4.duration },
    { C: Scene5ToolCalling, duration: TIMINGS.scene5.duration },
    { C: Scene6ContextAssembly, duration: TIMINGS.scene6.duration },
    { C: Scene7Compaction, duration: TIMINGS.scene7.duration },
    { C: Scene8Permissions, duration: TIMINGS.scene8.duration },
    { C: Scene9Subagents, duration: TIMINGS.scene9.duration },
    { C: Scene10MCP, duration: TIMINGS.scene10.duration },
    { C: Scene11Hooks, duration: TIMINGS.scene11.duration },
    { C: Scene12WhyMatters, duration: TIMINGS.scene12.duration },
    { C: Scene13FailureModes, duration: TIMINGS.scene13.duration },
    { C: Scene14Recap, duration: TIMINGS.scene14.duration },
    { C: Scene15CTA, duration: TIMINGS.scene15.duration },
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
