import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";

// Scene 1 — Hook [0:00-0:30]
// "Hello" appears → transforms into token IDs [15496, 11]

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "Hello" types in (0-3s)
  const helloOpacity = interpolate(frame, [0, fps * 1], [0, 1], { extrapolateRight: "clamp" });

  // Phase 2: "Hello" fades, numbers appear (3s-6s)
  const helloFade = interpolate(frame, [fps * 3, fps * 4.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numsOpacity = interpolate(frame, [fps * 3.5, fps * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: "And understanding why..." subtitle (6s+)
  const subtitleOpacity = interpolate(frame, [fps * 6, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const numSpring = spring({ frame: frame - fps * 3.5, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      {/* "Hello" word */}
      <div style={{
        position: "absolute",
        opacity: helloOpacity * helloFade,
        fontFamily: theme.fontMono,
        fontSize: 120,
        fontWeight: 700,
        color: theme.text,
        letterSpacing: 8,
      }}>
        "Hello"
      </div>

      {/* Token ID numbers */}
      <div style={{
        position: "absolute",
        opacity: numsOpacity,
        display: "flex",
        gap: 32,
        alignItems: "center",
        transform: `translateY(${(1 - numSpring) * 40}px)`,
      }}>
        {[15496, 11].map((num, i) => (
          <div key={i} style={{
            background: i === 0 ? theme.tokenColors[0] : theme.tokenColors[1],
            color: theme.bg,
            fontFamily: theme.fontMono,
            fontSize: 72,
            fontWeight: 800,
            padding: "16px 40px",
            borderRadius: 16,
          }}>
            {num}
          </div>
        ))}
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute",
        bottom: 180,
        opacity: subtitleOpacity,
        fontFamily: theme.fontSans,
        fontSize: 28,
        color: theme.textMuted,
        textAlign: "center",
        maxWidth: 800,
        lineHeight: 1.6,
      }}>
        Two numbers. That's all the model sees.
      </div>
    </AbsoluteFill>
  );
};
