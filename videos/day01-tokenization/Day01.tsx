import { AbsoluteFill, Sequence } from "remotion";
import { TIMINGS, TOTAL_FRAMES } from "./timings";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Tokens } from "./scenes/Scene2Tokens";
import { Scene3WhyTokens } from "./scenes/Scene3WhyTokens";
import { Scene4BPE } from "./scenes/Scene4BPE";
import { Scene5IDs } from "./scenes/Scene5IDs";
import { Scene6Strawberry } from "./scenes/Scene6Strawberry";
import { Scene7Matters } from "./scenes/Scene7Matters";
import { Scene8CTA } from "./scenes/Scene8CTA";

// Day 01 — How ChatGPT reads your message (Tokenization)
// Total: 6:15 = 11,250 frames at 30fps
// Timings are in timings.ts — update those after recording audio

export const Day01: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={TIMINGS.scene1.start} durationInFrames={TIMINGS.scene1.duration}>
        <Scene1Hook />
      </Sequence>
      <Sequence from={TIMINGS.scene2.start} durationInFrames={TIMINGS.scene2.duration}>
        <Scene2Tokens />
      </Sequence>
      <Sequence from={TIMINGS.scene3.start} durationInFrames={TIMINGS.scene3.duration}>
        <Scene3WhyTokens />
      </Sequence>
      <Sequence from={TIMINGS.scene4.start} durationInFrames={TIMINGS.scene4.duration}>
        <Scene4BPE />
      </Sequence>
      <Sequence from={TIMINGS.scene5.start} durationInFrames={TIMINGS.scene5.duration}>
        <Scene5IDs />
      </Sequence>
      <Sequence from={TIMINGS.scene6.start} durationInFrames={TIMINGS.scene6.duration}>
        <Scene6Strawberry />
      </Sequence>
      <Sequence from={TIMINGS.scene7.start} durationInFrames={TIMINGS.scene7.duration}>
        <Scene7Matters />
      </Sequence>
      <Sequence from={TIMINGS.scene8.start} durationInFrames={TIMINGS.scene8.duration}>
        <Scene8CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
