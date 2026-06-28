import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, XFADE } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2CoreProblem } from "./scenes/Scene2CoreProblem";
import { Scene3Indexing } from "./scenes/Scene3Indexing";
import { Scene4HybridRerank } from "./scenes/Scene4HybridRerank";
import { Scene5AgenticRetrieval } from "./scenes/Scene5AgenticRetrieval";
import { Scene6JustInTimeMemory } from "./scenes/Scene6JustInTimeMemory";
import { Scene7VsLongContext } from "./scenes/Scene7VsLongContext";
import { Scene8WhyItMatters } from "./scenes/Scene8WhyItMatters";
import { Scene9CTA } from "./scenes/Scene9CTA";

// Trending 03 — How AI Agents Find the RIGHT Information (Agentic Retrieval).
// Script: scripts/t03-agentic-retrieval.md. Spine: Index -> Retrieve -> Reason.
// Per-scene narration clips (public/audio/t03-agentic-retrieval/sNN.m4a) wired below;
// scene durations in timings.ts = trimmed clip length + ~0.7s tail.

const AUDIO_DIR = "audio/t03-agentic-retrieval";

export const T03: React.FC = () => {
  // IMPORTANT: build the children array INSIDE the component body. Putting JSX
  // in a module-level const breaks the esbuild bundler ("React is not defined").
  const SCENES = [
    { C: Scene1Hook, duration: TIMINGS.scene1.duration, audio: "s01.m4a" },
    { C: Scene2CoreProblem, duration: TIMINGS.scene2.duration, audio: "s02.m4a" },
    { C: Scene3Indexing, duration: TIMINGS.scene3.duration, audio: "s03.m4a" },
    { C: Scene4HybridRerank, duration: TIMINGS.scene4.duration, audio: "s04.m4a" },
    { C: Scene5AgenticRetrieval, duration: TIMINGS.scene5.duration, audio: "s05.m4a" },
    { C: Scene6JustInTimeMemory, duration: TIMINGS.scene6.duration, audio: "s06.m4a" },
    { C: Scene7VsLongContext, duration: TIMINGS.scene7.duration, audio: "s07.m4a" },
    { C: Scene8WhyItMatters, duration: TIMINGS.scene8.duration, audio: "s08.m4a" },
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
