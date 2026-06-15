import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 1 — Hook [0:00–0:13]
// A hard question types into a chat card → MODEL core appears with a pulsing
// "Thinking…" indicator → freeze, ask "what's happening in there?"

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: the question types in (0.5s–2.6s)
  const fullQ = "If a train leaves at 9:40 and the trip takes 95 minutes…";
  const qChars = Math.floor(
    interpolate(frame, [fps * 0.5, fps * 2.6], [0, fullQ.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const typed = fullQ.slice(0, qChars);
  const cursorOn = Math.floor(frame / 14) % 2 === 0;
  const qOpacity = interpolate(frame, [fps * 0.3, fps * 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: model core springs in (3s)
  const coreSpring = spring({ frame: frame - fps * 3, fps, config: { damping: 16 } });
  const coreOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // Phase 3: "Thinking…" pill (4s+)
  const thinkOpacity = interpolate(frame, [fps * 4, fps * 4.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dots = (Math.floor(frame / 12) % 3) + 1; // 1..3 animated dots

  // Phase 4: the freeze question (8s+) — holds ~8s before scene end (16s)
  const askOpacity = interpolate(frame, [fps * 8, fps * 9.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const askY = spring({ frame: frame - fps * 8, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accent} />

      {/* Question chat card */}
      <div style={{
        position: "absolute", top: 150, opacity: qOpacity,
        width: 1140, background: "linear-gradient(180deg, #15151b 0%, #0d0d11 100%)",
        border: `1px solid ${theme.border}`, borderRadius: 22, padding: "28px 38px",
        boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
      }}>
        <div style={{ fontFamily: theme.fontMono, fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: theme.accent, marginBottom: 16 }}>
          you ask
        </div>
        <div style={{ fontFamily: theme.fontSans, fontSize: 38, color: theme.text, lineHeight: 1.45 }}>
          {typed}
          <span style={{ opacity: cursorOn ? 1 : 0, color: theme.accent }}>▌</span>
        </div>
      </div>

      {/* Model core + Thinking pill */}
      <div style={{ position: "absolute", top: 490, display: "flex", flexDirection: "column", alignItems: "center", gap: 32, opacity: coreOpacity, transform: `scale(${0.7 + coreSpring * 0.3})` }}>
        <ModelCore size={240} pulse={pulse} fontSize={40} />
        <div style={{
          opacity: thinkOpacity, display: "flex", alignItems: "center", gap: 14,
          padding: "16px 34px", borderRadius: 999,
          background: `${theme.accent}14`, border: `1px solid ${theme.accent}66`,
          boxShadow: `0 0 ${20 + pulse * 30}px ${theme.accent}55`,
          fontFamily: theme.fontMono, fontSize: 32, color: theme.accent,
        }}>
          Thinking{".".repeat(dots)}
          <span style={{ opacity: 0 }}>{".".repeat(3 - dots)}</span>
        </div>
      </div>

      {/* The hook question */}
      <div style={{
        position: "absolute", bottom: 110, width: "100%", textAlign: "center",
        opacity: askOpacity, transform: `translateY(${(1 - askY) * 20}px)`,
        fontFamily: theme.fontSans, fontSize: 49, color: theme.text,
      }}>
        What's actually happening{" "}
        <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 800 }}>in there?</span>
      </div>
    </AbsoluteFill>
  );
};
