import { Composition } from "remotion";
import { T01 } from "../videos/t01-agent-harness/T01";
import { TOTAL_FRAMES as T01_FRAMES } from "../videos/t01-agent-harness/timings";
import { T02F } from "../videos/t02-agent-failures/T02F";
import { TOTAL_FRAMES as T02F_FRAMES } from "../videos/t02-agent-failures/timings";
import { T03 } from "../videos/t03-agentic-retrieval/T03";
import { TOTAL_FRAMES as T03_FRAMES } from "../videos/t03-agentic-retrieval/timings";
import { T04 } from "../videos/t04-context-rot/T04";
import { TOTAL_FRAMES as T04_FRAMES } from "../videos/t04-context-rot/timings";
import { T05 } from "../videos/t05-subagents/T05";
import { TOTAL_FRAMES as T05_FRAMES } from "../videos/t05-subagents/timings";
import { T15 } from "../videos/t15-rag-dead/T15";
import { TOTAL_FRAMES as T15_FRAMES } from "../videos/t15-rag-dead/timings";
import { T16 } from "../videos/t16-test-time-compute/T16";
import { TOTAL_FRAMES as T16_FRAMES } from "../videos/t16-test-time-compute/timings";
import { T17 } from "../videos/t17-reasoning-models/T17";
import { TOTAL_FRAMES as T17_FRAMES } from "../videos/t17-reasoning-models/timings";
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
        id="T04-ContextRot"
        component={T04}
        durationInFrames={T04_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T05-Subagents"
        component={T05}
        durationInFrames={T05_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T15-RagDead"
        component={T15}
        durationInFrames={T15_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T16-TestTimeCompute"
        component={T16}
        durationInFrames={T16_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T17-ReasoningModels"
        component={T17}
        durationInFrames={T17_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
