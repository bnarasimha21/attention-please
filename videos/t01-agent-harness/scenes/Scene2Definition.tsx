import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 2 — The one-line definition
// Model emits a text bubble → it hits a harness GATE → routes to the real
// world. "The model generates text. The harness decides what it can touch."

const WorldIcon: React.FC<{ label: string; emoji: string; opacity: number; delay: number; frame: number; fps: number }> = ({
  label, emoji, opacity, delay, frame, fps,
}) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  return (
    <div style={{
      opacity, transform: `translateX(${(1 - s) * -30}px)`,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 142, height: 142, borderRadius: 26,
        background: "linear-gradient(160deg, #17171f 0%, #0e0e13 100%)",
        border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60,
        boxShadow: "0 14px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}>{emoji}</div>
      <div style={{ fontFamily: theme.fontMono, fontSize: 27, color: theme.textMuted, letterSpacing: 1 }}>{label}</div>
    </div>
  );
};

export const Scene2Definition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const modelOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bubble emits from the model, travels toward the gate, and dissolves INTO
  // it (the harness intercepting the text) — so it never overlaps the gate/cards.
  const travel = interpolate(frame, [fps * 3, fps * 4.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubbleX = interpolate(travel, [0, 1], [-180, 84]);
  const bubbleScale = interpolate(travel, [0.7, 1], [1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubbleOpacity = interpolate(frame, [fps * 3, fps * 3.7, fps * 4.3, fps * 4.9], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gateOpacity = interpolate(frame, [fps * 2.5, fps * 3.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gatePulse = travel > 0.85 ? 0.5 + 0.5 * Math.sin(frame / 5) : 0;

  const worldOpacity = interpolate(frame, [fps * 5.5, fps * 6.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Closing line reveals after the icons land, then holds through scene end.
  const lineOpacity = interpolate(frame, [fps * 9, fps * 10.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 9, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <SceneHeading kicker="the core idea" accent={theme.accentWarm}>
        What a harness actually <span style={gradientText("#fbbf24", theme.accentWarm)}>does</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 96 }}>

        {/* Model */}
        <div style={{ opacity: modelOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative" }}>
          <ModelCore size={180} pulse={pulse} fontSize={32} />
          <div style={{ fontFamily: theme.fontSans, fontSize: 27, color: theme.textMuted }}>generates text</div>

          {/* travelling bubble — dissolves into the gate */}
          <div style={{
            position: "absolute", left: 156, top: 58, opacity: bubbleOpacity,
            transform: `translateX(${bubbleX}px) scale(${bubbleScale})`,
            background: "linear-gradient(160deg, #1a1a22, #101015)",
            border: `1px solid ${theme.accent}`, borderRadius: 17,
            padding: "14px 26px", fontFamily: theme.fontMono, fontSize: 27, color: theme.text, whiteSpace: "nowrap",
            boxShadow: `0 8px 30px ${theme.accent}55`,
          }}>
            "edit this file"
          </div>
        </div>

        {/* Gate */}
        <div style={{
          opacity: gateOpacity,
          width: 38, height: 384, borderRadius: 19,
          background: `linear-gradient(180deg, ${theme.accentWarm}, #b45309)`,
          boxShadow: `0 0 ${26 + gatePulse * 66}px ${theme.accentWarm}`,
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: -56, left: "50%", transform: "translateX(-50%)", fontFamily: theme.fontMono, fontSize: 30, color: theme.accentWarm, whiteSpace: "nowrap", letterSpacing: 3 }}>
            HARNESS
          </div>
        </div>

        {/* World */}
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <WorldIcon label="files" emoji="📄" opacity={worldOpacity} delay={fps * 5.5} frame={frame} fps={fps} />
          <WorldIcon label="shell" emoji="⌨️" opacity={worldOpacity} delay={fps * 6} frame={frame} fps={fps} />
          <WorldIcon label="web" emoji="🌐" opacity={worldOpacity} delay={fps * 6.5} frame={frame} fps={fps} />
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 100, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 46, color: theme.text, lineHeight: 1.5,
      }}>
        The model generates text. The harness decides{" "}
        <span style={{ ...gradientText("#fbbf24", theme.accentWarm), fontWeight: 800 }}>what it can touch.</span>
      </div>
    </AbsoluteFill>
  );
};
