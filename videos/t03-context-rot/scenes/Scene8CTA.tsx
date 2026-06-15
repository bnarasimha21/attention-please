import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText } from "../../../remotion-src/visuals";

// Scene 8 — Recap + CTA [1:48-1:55]
// Three recap chips (spread thin · lost in middle · fades) → fix line →
// teaser → channel brand block.

const CHIPS = [
  { label: "attention spreads thin", color: theme.accentWarm },
  { label: "facts lost in the middle", color: theme.accentRed },
  { label: "instructions fade", color: theme.tokenColors[1] },
];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chipStart = (i: number) => fps * 0.8 + i * fps * 1.3;

  const fixOpacity = interpolate(frame, [fps * 5.5, fps * 6.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fixY = spring({ frame: frame - fps * 5.5, fps, config: { damping: 18 } });

  const teaserOpacity = interpolate(frame, [fps * 8, fps * 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [fps * 10.5, fps * 11.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accentRed} />

      {/* Recap header */}
      <div style={{ fontFamily: theme.fontMono, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: theme.accentRed, marginBottom: 34 }}>
        context rot, in three
      </div>

      {/* Recap chips */}
      <div style={{ display: "flex", gap: 28, marginBottom: 54 }}>
        {CHIPS.map((c, i) => {
          const start = chipStart(i);
          const s = spring({ frame: frame - start, fps, config: { damping: 15 } });
          const opacity = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={c.label} style={{
              opacity, transform: `translateY(${(1 - s) * 20}px) scale(${0.9 + s * 0.1})`,
              padding: "20px 34px", borderRadius: 20,
              background: `linear-gradient(160deg, ${c.color}1f, ${c.color}0a)`,
              border: `1px solid ${c.color}66`, boxShadow: `0 0 26px ${c.color}26`,
              fontFamily: theme.fontSans, fontSize: 32, fontWeight: 700, color: theme.text,
            }}>{c.label}</div>
          );
        })}
      </div>

      {/* The fix line */}
      <div style={{
        opacity: fixOpacity, transform: `translateY(${(1 - fixY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 51, fontWeight: 800, color: theme.text, textAlign: "center",
      }}>
        Keep it <span style={gradientText("#6ee7b7", theme.accentGreen)}>short</span>, keep it{" "}
        <span style={gradientText("#6ee7b7", theme.accentGreen)}>relevant</span>, refresh often.
      </div>

      {/* Teaser */}
      <div style={{ marginTop: 28, opacity: teaserOpacity, fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted, textAlign: "center" }}>
        Next: <span style={{ color: theme.accent }}>Subagents — giving each task its own brain</span>
      </div>

      {/* Brand */}
      <div style={{ opacity: brandOpacity, position: "absolute", bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: theme.fontSans, fontSize: 57, fontWeight: 800, color: theme.text, letterSpacing: 2 }}>
          Attention<span style={{ color: theme.accent }}> Please</span>
        </div>
        <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>
          AI concepts, animated clearly
        </div>
      </div>
    </AbsoluteFill>
  );
};
