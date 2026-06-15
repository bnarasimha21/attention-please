import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 8 — Recap + CTA
// Final diagram: MODEL core wrapped in layers, "The model thinks. The harness
// acts." → teaser → channel brand.

const RECAP_LAYERS = ["Loop", "Tools", "Permissions", "Memory", "MCP"];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const coreSpring = spring({ frame: frame - fps * 0.5, fps, config: { damping: 16 } });

  // rings appear one by one
  const ringStart = (i: number) => fps * 1.2 + i * fps * 0.55;

  const taglineOpacity = interpolate(frame, [fps * 4.5, fps * 5.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const teaserOpacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [fps * 9, fps * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accent} />

      {/* Recap diagram */}
      <div style={{ position: "relative", width: 560, height: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[...RECAP_LAYERS].reverse().map((label) => {
          const i = RECAP_LAYERS.indexOf(label);
          const start = ringStart(i);
          const s = spring({ frame: frame - start, fps, config: { damping: 15 } });
          const opacity = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const size = 220 + (i + 1) * 64;
          const color = theme.tokenColors[i % theme.tokenColors.length];
          return (
            <div key={label} style={{
              position: "absolute", width: size, height: size, borderRadius: "50%",
              transform: `scale(${0.8 + s * 0.2})`,
              border: `2px solid ${color}`, background: `${color}0a`, opacity,
            }}>
              <div style={{
                position: "absolute", top: -19, left: "50%", transform: "translateX(-50%)",
                background: "rgba(10,10,13,0.92)", padding: "3px 17px", borderRadius: 9,
                border: `1px solid ${color}44`, boxShadow: `0 0 12px ${color}22`,
                fontFamily: theme.fontMono, fontSize: 24, fontWeight: 700, color,
              }}>{label}</div>
            </div>
          );
        })}
        <div style={{ transform: `scale(${0.6 + coreSpring * 0.4})` }}>
          <ModelCore size={192} pulse={pulse} fontSize={35} />
        </div>
      </div>

      {/* Tagline */}
      <div style={{ marginTop: 36, opacity: taglineOpacity, fontFamily: theme.fontSans, fontSize: 51, fontWeight: 700, color: theme.text }}>
        The model <span style={{ color: theme.textMuted }}>thinks.</span> The harness{" "}
        <span style={gradientText("#c7d2fe", theme.accent)}>acts.</span>
      </div>

      {/* Teaser */}
      <div style={{ marginTop: 22, opacity: teaserOpacity, fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted, textAlign: "center" }}>
        Next: <span style={{ color: theme.accent }}>Context engineering — the skill replacing prompts</span>
      </div>

      {/* Brand */}
      <div style={{ opacity: brandOpacity, position: "absolute", bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: theme.fontSans, fontSize: 56, fontWeight: 800, color: theme.text, letterSpacing: 2 }}>
          Attention<span style={{ color: theme.accent }}> Please</span>
        </div>
        <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>
          AI concepts, animated clearly
        </div>
      </div>
    </AbsoluteFill>
  );
};
