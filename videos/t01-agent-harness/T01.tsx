import { AbsoluteFill, Audio, staticFile } from "remotion";
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

// Trending 01 — What is an agent harness? (DEEP v2, 15 scenes, audio-synced)
// Each scene plays its own trimmed narration clip; durations in timings.ts.

const AUDIO_DIR = "audio/t01-agent-harness";

export const T01: React.FC = () => {
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration, audio: "s01.m4a" },
    { C: Scene2Definition, duration: TIMINGS.scene2.duration, audio: "s02.m4a" },
    { C: Scene3Stateless, duration: TIMINGS.scene3.duration, audio: "s03.m4a" },
    { C: Scene4Loop, duration: TIMINGS.scene4.duration, audio: "s04.m4a" },
    { C: Scene5ToolCalling, duration: TIMINGS.scene5.duration, audio: "s05.m4a" },
    { C: Scene6ContextAssembly, duration: TIMINGS.scene6.duration, audio: "s06.m4a" },
    { C: Scene7Compaction, duration: TIMINGS.scene7.duration, audio: "s07.m4a" },
    { C: Scene8Permissions, duration: TIMINGS.scene8.duration, audio: "s08.m4a" },
    { C: Scene9Subagents, duration: TIMINGS.scene9.duration, audio: "s09.m4a" },
    { C: Scene10MCP, duration: TIMINGS.scene10.duration, audio: "s10.m4a" },
    { C: Scene11Hooks, duration: TIMINGS.scene11.duration, audio: "s11.m4a" },
    { C: Scene12WhyMatters, duration: TIMINGS.scene12.duration, audio: "s12.m4a" },
    { C: Scene13FailureModes, duration: TIMINGS.scene13.duration, audio: "s13.m4a" },
    { C: Scene14Recap, duration: TIMINGS.scene14.duration, audio: "s14.m4a" },
    { C: Scene15CTA, duration: TIMINGS.scene15.duration, audio: "s15.m4a" },
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
