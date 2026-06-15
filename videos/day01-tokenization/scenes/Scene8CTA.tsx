import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";

// Scene 8 — Recap + CTA [5:45-6:15]
// Clean pipeline summary, channel name

const PIPELINE_STEPS = [
  { label: '"Hello world"', sub: "your message", color: theme.text },
  { label: "Tokenize", sub: "BPE splits into chunks", color: theme.tokenColors[0] },
  { label: "[15496, 11, 995]", sub: "token IDs", color: theme.tokenColors[1] },
  { label: "LLM", sub: "model processes numbers", color: theme.accent },
];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pipeline steps fade in one by one
  const visibleSteps = interpolate(frame, [fps * 0.5, fps * 4], [0, PIPELINE_STEPS.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Next video" teaser
  const teaserOpacity = interpolate(frame, [fps * 5, fps * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Channel name
  const brandOpacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>

      {/* Pipeline */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {PIPELINE_STEPS.map((step, i) => {
          const opacity = interpolate(visibleSteps - i, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const arrowOpacity = i < PIPELINE_STEPS.length - 1
            ? interpolate(visibleSteps - i - 0.5, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 0;

          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{
                  fontFamily: theme.fontMono,
                  fontSize: i === 0 || i === 2 ? 22 : 28,
                  fontWeight: 700,
                  color: step.color,
                  background: `${step.color}18`,
                  border: `2px solid ${step.color}44`,
                  padding: "14px 24px", borderRadius: 14,
                  textAlign: "center",
                }}>
                  {step.label}
                </div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 17, color: theme.textMuted }}>{step.sub}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div style={{ opacity: arrowOpacity, fontSize: 28, color: theme.textDim }}>→</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Teaser */}
      <div style={{ opacity: teaserOpacity, fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted, textAlign: "center" }}>
        Next: <span style={{ color: theme.accent }}>What happens once those numbers go in?</span>
      </div>

      {/* Channel brand */}
      <div style={{ opacity: brandOpacity, position: "absolute", bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: theme.fontSans, fontSize: 42, fontWeight: 800, color: theme.text, letterSpacing: 2 }}>
          Attention<span style={{ color: theme.accent }}> Please</span>
        </div>
        <div style={{ fontFamily: theme.fontSans, fontSize: 18, color: theme.textMuted }}>
          AI concepts, animated clearly
        </div>
      </div>
    </AbsoluteFill>
  );
};
