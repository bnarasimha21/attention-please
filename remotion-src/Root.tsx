import { Composition } from "remotion";
import { T01 } from "../videos/t01-agent-harness/T01";
import { TOTAL_FRAMES as T01_FRAMES } from "../videos/t01-agent-harness/timings";
import { T02F } from "../videos/t02-agent-failures/T02F";
import { TOTAL_FRAMES as T02F_FRAMES } from "../videos/t02-agent-failures/timings";
import { T03 } from "../videos/t03-agentic-retrieval/T03";
import { TOTAL_FRAMES as T03_FRAMES } from "../videos/t03-agentic-retrieval/timings";
import { T04 } from "../videos/t04-loop-engineering/T04";
import { TOTAL_FRAMES as T04_FRAMES } from "../videos/t04-loop-engineering/timings";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="T01-AgentHarness"
        component={T01}
        durationInFrames={T01_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T02F-AgentFailures"
        component={T02F}
        durationInFrames={T02F_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T03-AgenticRetrieval"
        component={T03}
        durationInFrames={T03_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T04-LoopEngineering"
        component={T04}
        durationInFrames={T04_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
