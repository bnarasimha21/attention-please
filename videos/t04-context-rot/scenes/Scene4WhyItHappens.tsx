import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, EASE_OUT, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 4 — Why it happens [0:47-1:03]
// A spotlight covers a small stage (bright) → stage widens with each message →
// the same light has to cover more ground, so it dims everywhere.
// Metaphor: finite attention budget spread thinner.

export const Scene4WhyItHappens: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stage widens from narrow to wide over 2s..10s
  const widen = interpolate(frame, [fps * 2, fps * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const stageW = interpolate(widen, [0, 1], [500, 1500]);

  // tokens (actors) on the stage grow in count as it widens
  const tokenCount = Math.round(interpolate(widen, [0, 1], [3, 16]));

  // brightness falls as area grows (same budget / wider stage)
  const brightness = interpolate(widen, [0, 1], [1, 0.22]);

  // running token counter
  const tokens = Math.round(interpolate(frame, [fps * 2, fps * 10], [1200, 92000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const stagePop = pop(frame, fps, fps * 1, { damping: 12 });
  const stageOpacity = interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spotColor = brightness > 0.6 ? theme.accentGreen : brightness > 0.38 ? theme.accentWarm : theme.accentRed;

  const lineOpacity = interpolate(frame, [fps * 12.5, fps * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 12.5, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <SceneHeading kicker="why it happens" accent={theme.accentWarm}>
        One <span style={gradientText("#fbbf24", theme.accentWarm)}>spotlight</span>, an ever-bigger stage
      </SceneHeading>

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50 }}>

        {/* spotlight + stage */}
        <div style={{ position: "relative", width: 1600, height: 430, display: "flex", alignItems: "flex-end", justifyContent: "center", opacity: stageOpacity, transform: `scale(${0.9 + stagePop * 0.1})` }}>

          {/* spotlight cone from above */}
          <div style={{
            position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: `${stageW / 2}px solid transparent`,
            borderRight: `${stageW / 2}px solid transparent`,
            borderBottom: `420px solid ${spotColor}`,
            opacity: 0.10 + brightness * 0.16,
            filter: "blur(2px)",
          }} />
          {/* light source */}
          <div style={{
            position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
            width: 48, height: 48, borderRadius: 24,
            background: spotColor, boxShadow: `0 0 ${30 + brightness * 50}px ${spotColor}`,
          }} />

          {/* the stage floor */}
          <div style={{
            width: stageW, height: 180, borderRadius: 20,
            background: `linear-gradient(180deg, ${spotColor}${Math.round(brightness * 40).toString(16).padStart(2, "0")}, #0c0c10)`,
            border: `1px solid ${theme.border}`,
            boxShadow: `0 0 ${brightness * 60}px ${spotColor}55, inset 0 0 30px rgba(0,0,0,0.6)`,
            display: "flex", alignItems: "center", justifyContent: "space-evenly", padding: "0 22px",
            position: "relative",
          }}>
            {/* tokens / actors lit by the dimming light */}
            {Array.from({ length: tokenCount }).map((_, i) => (
              <div key={i} style={{
                width: 26, height: 53, borderRadius: 7,
                background: theme.tokenColors[i % theme.tokenColors.length],
                opacity: 0.25 + brightness * 0.7,
                boxShadow: `0 0 ${brightness * 16}px ${theme.tokenColors[i % theme.tokenColors.length]}`,
              }} />
            ))}
            <div style={{ position: "absolute", bottom: -38, left: 0, width: "100%", textAlign: "center", fontFamily: theme.fontMono, fontSize: 21, color: theme.textDim, letterSpacing: 1 }}>
              the conversation (every token must be lit)
            </div>
          </div>
        </div>

        {/* stats */}
        <div style={{ display: "flex", gap: 80, opacity: stageOpacity }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted, letterSpacing: 1 }}>TOKENS</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 46, fontWeight: 800, color: theme.text }}>{tokens.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted, letterSpacing: 1 }}>FOCUS / TOKEN</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 46, fontWeight: 800, color: spotColor }}>{Math.round(brightness * 100)}%</div>
          </div>
        </div>
      </CameraRig>

      <div style={{
        position: "absolute", bottom: 56, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        The budget didn't grow — it just got{" "}
        <span style={{ ...gradientText("#fbbf24", theme.accentWarm), fontWeight: 800 }}>spread thinner.</span>
      </div>
    </AbsoluteFill>
  );
};
