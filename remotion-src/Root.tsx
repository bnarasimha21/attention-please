import { Composition } from "remotion";
import { T01 } from "../videos/t01-agent-harness/T01";
import { TOTAL_FRAMES as T01_FRAMES } from "../videos/t01-agent-harness/timings";
import { T02 } from "../videos/t02-context-engineering/T02";
import { TOTAL_FRAMES as T02_FRAMES } from "../videos/t02-context-engineering/timings";
import { T03 } from "../videos/t03-context-rot/T03";
import { TOTAL_FRAMES as T03_FRAMES } from "../videos/t03-context-rot/timings";
import { T04 } from "../videos/t04-subagents/T04";
import { TOTAL_FRAMES as T04_FRAMES } from "../videos/t04-subagents/timings";
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
        id="T02-ContextEngineering"
        component={T02}
        durationInFrames={T02_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T03-ContextRot"
        component={T03}
        durationInFrames={T03_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="T04-Subagents"
        component={T04}
        durationInFrames={T04_FRAMES}
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
