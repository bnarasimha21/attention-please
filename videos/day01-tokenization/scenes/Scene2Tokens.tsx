import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";

// Scene 2 — What is a token [0:30-1:30]
// "Hello" → splits into ["Hel"]["lo"] colored boxes
// Show more examples: "the", "Unbelievable"

const TokenBox: React.FC<{ text: string; color: string; opacity: number; scale?: number }> = ({
  text, color, opacity, scale = 1,
}) => (
  <div style={{
    opacity,
    transform: `scale(${scale})`,
    background: color,
    color: theme.bg,
    fontFamily: theme.fontMono,
    fontSize: 52,
    fontWeight: 800,
    padding: "12px 28px",
    borderRadius: 12,
    letterSpacing: 2,
    transition: "transform 0.3s",
  }}>
    {text}
  </div>
);

export const Scene2Tokens: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Hello" appears whole (0-1s)
  const helloOpacity = interpolate(frame, [0, fps * 1], [0, 1], { extrapolateRight: "clamp" });

  // Splits into tokens (1.5s-3s)
  const splitProgress = interpolate(frame, [fps * 1.5, fps * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gapSize = interpolate(splitProgress, [0, 1], [0, 24]);

  // Labels appear (3s-4s)
  const labelOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Examples appear (5s-9s)
  const example1Opacity = interpolate(frame, [fps * 5, fps * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const example2Opacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 80 }}>

      {/* Title */}
      <div style={{ fontFamily: theme.fontSans, fontSize: 36, color: theme.textMuted, position: "absolute", top: 80 }}>
        What is a <span style={{ color: theme.accent }}>token</span>?
      </div>

      {/* Main: "Hello" splitting */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", gap: gapSize, opacity: helloOpacity }}>
          <TokenBox text="Hel" color={theme.tokenColors[0]} opacity={1} />
          <TokenBox text="lo" color={theme.tokenColors[1]} opacity={1} />
        </div>
        <div style={{ opacity: labelOpacity, fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>
          "Hello" → <span style={{ color: theme.accent }}>2 tokens</span>
        </div>
      </div>

      {/* Examples row */}
      <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
        {/* "the" = 1 token */}
        <div style={{ opacity: example1Opacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <TokenBox text="the" color={theme.tokenColors[2]} opacity={1} />
          <div style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.textMuted }}>1 token</div>
        </div>

        {/* "Unbelievable" = 4 tokens */}
        <div style={{ opacity: example2Opacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["Un", "believ", "able"].map((t, i) => (
              <TokenBox key={i} text={t} color={theme.tokenColors[i + 3]} opacity={1} />
            ))}
          </div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.textMuted }}>"Unbelievable" → 3 tokens</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
