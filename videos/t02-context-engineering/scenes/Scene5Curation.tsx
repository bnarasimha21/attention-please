import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 5 — Curation is the skill [0:56-1:12]
// Side by side: BAD context (everything dumped, messy, overflowing → bad
// answer ✕) vs GOOD context (curated, ordered, compressed → great answer ✓).
// Same model, same question — only the context differs.

const Window: React.FC<{
  good: boolean; opacity: number; frame: number; fps: number; appearAt: number;
}> = ({ good, opacity, frame, fps, appearAt }) => {
  // BAD: 9 messy mixed blocks (mostly noise). GOOD: 4 clean ordered blocks.
  const badColors = ["#4b4b52", theme.accentGreen, "#4b4b52", "#4b4b52", "#3f3f46", theme.accentGreen, "#4b4b52", "#3f3f46", "#4b4b52"];
  const goodColors = [theme.tokenColors[4], theme.tokenColors[2], theme.tokenColors[5], theme.accentGreen];

  const fillStart = appearAt + fps * 0.6;
  return (
    <div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 19, width: 672 }}>
      <div style={{
        fontFamily: theme.fontMono, fontSize: 30, letterSpacing: 2,
        color: good ? theme.accentGreen : theme.accentRed,
      }}>
        {good ? "GOOD CONTEXT" : "BAD CONTEXT"}
      </div>
      <div style={{ fontFamily: theme.fontSans, fontSize: 23, color: theme.textMuted, height: 28 }}>
        {good ? "curated · ordered · compressed" : "everything dumped in, messy"}
      </div>

      {/* window */}
      <div style={{
        width: 552, minHeight: 360, borderRadius: 22, padding: 17,
        background: "linear-gradient(180deg, #121218, #0b0b0f)",
        border: `2px solid ${good ? theme.accentGreen + "66" : theme.accentRed + "66"}`,
        boxShadow: good ? `0 16px 50px ${theme.accentGreen}1f` : `0 16px 50px ${theme.accentRed}1f`,
        display: "flex", flexDirection: "column", gap: good ? 14 : 8,
      }}>
        {(good ? goodColors : badColors).map((c, i) => {
          const start = fillStart + i * fps * 0.18;
          const s = spring({ frame: frame - start, fps, config: { damping: 18 } });
          const o = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // good blocks are tidy uniform; bad ones are jagged widths
          const w = good ? 100 : [92, 70, 100, 55, 84, 100, 63, 96, 48][i];
          return (
            <div key={i} style={{
              opacity: o, transform: good ? `scale(${0.9 + s * 0.1})` : `translateX(${(1 - s) * (i % 2 ? 18 : -18)}px)`,
              width: `${w}%`, height: good ? 60 : 29, borderRadius: 10,
              background: `linear-gradient(160deg, ${c}, ${c}cc)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18)`,
              alignSelf: good ? "stretch" : (i % 3 === 0 ? "flex-start" : i % 3 === 1 ? "center" : "flex-end"),
            }} />
          );
        })}
      </div>
    </div>
  );
};

export const Scene5Curation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badAppear = fps * 2;
  const goodAppear = fps * 5.5;
  const badOpacity = interpolate(frame, [badAppear, badAppear + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goodOpacity = interpolate(frame, [goodAppear, goodAppear + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // verdict chips
  const badVerdict = interpolate(frame, [fps * 9.5, fps * 10.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goodVerdict = interpolate(frame, [fps * 11, fps * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 13.5, fps * 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 13.5, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <SceneHeading kicker="the real skill" accent={theme.accent}>
        Not <span style={{ color: theme.textMuted }}>more</span> context — the{" "}
        <span style={gradientText("#c7d2fe", theme.accent)}>right</span> context
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 72 }}>
        {/* BAD */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Window good={false} opacity={badOpacity} frame={frame} fps={fps} appearAt={badAppear} />
          <div style={{
            opacity: badVerdict, padding: "12px 26px", borderRadius: 12,
            background: `${theme.accentRed}1a`, border: `1px solid ${theme.accentRed}`,
            fontFamily: theme.fontSans, fontSize: 30, color: theme.accentRed,
          }}>✕ model guesses → bad answer</div>
        </div>

        <div style={{ width: 1, height: 504, background: theme.border }} />

        {/* GOOD */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Window good={true} opacity={goodOpacity} frame={frame} fps={fps} appearAt={goodAppear} />
          <div style={{
            opacity: goodVerdict, padding: "12px 26px", borderRadius: 12,
            background: `${theme.accentGreen}1a`, border: `1px solid ${theme.accentGreen}`,
            fontFamily: theme.fontSans, fontSize: 30, color: theme.accentGreen,
          }}>✓ model nails it → great answer</div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 84, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        Same model. Same question. The only difference is what you put{" "}
        <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 800 }}>around it.</span>
      </div>
    </AbsoluteFill>
  );
};
