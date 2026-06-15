import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 2 — Prompt vs context [0:13-0:26]
// A tiny "PROMPT" box (being tweaked) next to a large glassy "CONTEXT WINDOW"
// stage that fills/arranges. Prompt eng tweaks the box; context eng fills the
// whole stage.

export const Scene2PromptVsContext: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Small prompt box appears (2s)
  const promptS = spring({ frame: frame - fps * 2, fps, config: { damping: 16 } });
  const promptOpacity = interpolate(frame, [fps * 2, fps * 2.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // wrench tweaks the box — tiny jitter to show "optimizing"
  const tweak = frame > fps * 3.1 && frame < fps * 5.5 ? Math.sin(frame / 2.2) * 2.5 : 0;
  const tweakBadge = interpolate(frame, [fps * 3.3, fps * 4.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Large context stage appears (5.8s)
  const stageS = spring({ frame: frame - fps * 5.8, fps, config: { damping: 18 } });
  const stageOpacity = interpolate(frame, [fps * 5.8, fps * 6.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // stage fills with arranged chips (7s+)
  const CHIPS = 6;
  const filled = interpolate(frame, [fps * 7, fps * 10.5], [0, CHIPS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 11.5, fps * 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <SceneHeading kicker="the shift" accent={theme.accentWarm}>
        Optimize the question, or the{" "}
        <span style={gradientText("#fbbf24", theme.accentWarm)}>whole room</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 108 }}>
        {/* Small prompt box */}
        <div style={{ opacity: promptOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{
            position: "relative",
            transform: `scale(${0.8 + promptS * 0.2}) translateX(${tweak}px)`,
            width: 288, padding: "31px 26px", borderRadius: 19,
            background: "linear-gradient(160deg, #1a1a22, #101015)",
            border: `1px solid ${theme.accent}`,
            boxShadow: `0 14px 40px ${theme.accent}2e, inset 0 1px 0 rgba(255,255,255,0.05)`,
            fontFamily: theme.fontMono, fontSize: 27, color: theme.text, textAlign: "center",
          }}>
            "the prompt"
            <div style={{
              position: "absolute", top: -19, right: -17, opacity: tweakBadge,
              fontSize: 40, filter: `drop-shadow(0 0 8px ${theme.accent})`,
            }}>🔧</div>
          </div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accent, letterSpacing: 1 }}>PROMPT ENGINEERING</div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>tweaks one tiny box</div>
        </div>

        {/* divider */}
        <div style={{ width: 1, height: 432, background: theme.border, opacity: stageOpacity }} />

        {/* Large context stage */}
        <div style={{ opacity: stageOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{
            transform: `scale(${0.85 + stageS * 0.15})`,
            width: 768, height: 360, borderRadius: 24, padding: 22,
            background: `linear-gradient(180deg, ${theme.accentWarm}0c, rgba(0,0,0,0.2))`,
            border: `2px solid ${theme.accentWarm}`,
            boxShadow: `0 18px 60px ${theme.accentWarm}22, inset 0 0 40px rgba(0,0,0,0.4)`,
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 14,
          }}>
            {Array.from({ length: CHIPS }).map((_, i) => {
              const on = filled > i;
              const fillT = interpolate(filled - i, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const c = theme.tokenColors[i % theme.tokenColors.length];
              return (
                <div key={i} style={{
                  borderRadius: 14,
                  background: on ? `linear-gradient(160deg, ${c}, ${c}bb)` : "transparent",
                  border: on ? "none" : `1px dashed ${theme.border}`,
                  opacity: on ? fillT : 0.5,
                  transform: `scale(${on ? 0.9 + fillT * 0.1 : 1})`,
                  boxShadow: on ? `0 0 16px ${c}55, inset 0 1px 0 rgba(255,255,255,0.25)` : "none",
                }} />
              );
            })}
          </div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accentWarm, letterSpacing: 1 }}>CONTEXT ENGINEERING</div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>fills + arranges the whole stage</div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 77, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        One is a <span style={{ color: theme.textMuted }}>sentence.</span> The other is the{" "}
        <span style={{ ...gradientText("#fbbf24", theme.accentWarm), fontWeight: 800 }}>whole room</span> the model thinks in.
      </div>
    </AbsoluteFill>
  );
};
