import { Composition } from "remotion";
import { Day01 } from "../videos/day01-tokenization/Day01";
import { TOTAL_FRAMES } from "../videos/day01-tokenization/timings";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Day01-Tokenization"
        component={Day01}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
