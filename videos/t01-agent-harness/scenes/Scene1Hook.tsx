import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 1 — Hook
// Terminal `$ claude` prompt → dissolves → glowing MODEL core appears,
// the word "harness" materializes wrapping it.

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: terminal types in (0-3s)
  const promptChars = Math.floor(interpolate(frame, [fps * 0.5, fps * 2], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const fullPrompt = "$ claude";
  const typed = fullPrompt.slice(0, promptChars);
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  const naiveOpacity = interpolate(frame, [fps * 2.2, fps * 3.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: terminal fades, core appears (5s-7s)
  const termFade = interpolate(frame, [fps * 5, fps * 6.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const termScale = interpolate(frame, [fps * 5, fps * 6.5], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coreSpring = spring({ frame: frame - fps * 6, fps, config: { damping: 16 } });
  const coreOpacity = interpolate(frame, [fps * 6, fps * 7.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // "harness" ring + label (8s+)
  const ringScale = spring({ frame: frame - fps * 8, fps, config: { damping: 14 } });
  const ringOpacity = interpolate(frame, [fps * 8, fps * 9.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringSpin = interpolate(frame, [fps * 8, fps * 40], [0, 80], { extrapolateLeft: "clamp" });
  const subtitleOpacity = interpolate(frame, [fps * 10, fps * 11.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = spring({ frame: frame - fps * 10, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accent} />

      {/* Terminal */}
      <div style={{
        position: "absolute",
        opacity: termFade,
        transform: `scale(${termScale})`,
        width: 860,
        background: "linear-gradient(180deg, #15151b 0%, #0d0d11 100%)",
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        overflow: "hidden",
        fontFamily: theme.fontMono,
        boxShadow: "0 50px 140px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
      }}>
        <div style={{ display: "flex", gap: 11, padding: "19px 24px", borderBottom: `1px solid ${theme.border}`, alignItems: "center" }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
            <div key={c} style={{ width: 17, height: 17, borderRadius: 9, background: c, boxShadow: `0 0 8px ${c}66` }} />
          ))}
          <div style={{ marginLeft: 14, fontSize: 19, color: theme.textDim, letterSpacing: 1 }}>claude — zsh</div>
        </div>
        <div style={{ padding: "48px 44px", fontSize: 57, color: theme.text }}>
          <span style={{ color: theme.accentGreen }}>{typed.slice(0, 1)}</span>
          <span>{typed.slice(1)}</span>
          <span style={{ opacity: cursorOn ? 1 : 0, color: theme.accentGreen }}>▌</span>
          <div style={{ opacity: naiveOpacity, fontSize: 30, color: theme.textMuted, marginTop: 31, fontFamily: theme.fontSans }}>
            "just a CLI that calls Claude"…?
          </div>
        </div>
      </div>

      {/* MODEL core */}
      <div style={{ position: "absolute", opacity: coreOpacity, transform: `scale(${0.6 + coreSpring * 0.4})` }}>
        {/* spinning harness ring */}
        <div style={{
          position: "absolute",
          inset: -156,
          border: `2px dashed ${theme.accent}`,
          borderRadius: "50%",
          opacity: ringOpacity * 0.7,
          transform: `scale(${0.7 + ringScale * 0.3}) rotate(${ringSpin}deg)`,
        }} />
        <div style={{
          position: "absolute",
          inset: -84,
          border: `1px solid ${theme.accent}55`,
          borderRadius: "50%",
          opacity: ringOpacity * 0.6,
        }} />
        <ModelCore size={290} pulse={pulse} fontSize={49} />
        {/* harness label */}
        <div style={{
          position: "absolute", top: -210, left: "50%", transform: "translateX(-50%)",
          opacity: ringOpacity, fontFamily: theme.fontMono, fontSize: 38, letterSpacing: 6, whiteSpace: "nowrap",
          ...gradientText("#c7d2fe", theme.accent),
        }}>
          the harness
        </div>
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute", bottom: 130, opacity: subtitleOpacity,
        transform: `translateY(${(1 - subtitleY) * 20}px)`,
        fontFamily: theme.fontSans, fontSize: 43, color: theme.textMuted, textAlign: "center", maxWidth: 1200, lineHeight: 1.5,
      }}>
        The model is <span style={{ color: theme.text, fontWeight: 700 }}>~20%</span> of it.{" "}
        The <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 700 }}>harness</span> is the rest.
      </div>
    </AbsoluteFill>
  );
};
