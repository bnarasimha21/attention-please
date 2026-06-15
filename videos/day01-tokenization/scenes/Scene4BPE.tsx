import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";

// Scene 4 — Byte Pair Encoding [2:30-3:30]
// Show BPE merging step by step

const STEPS = [
  { from: ["t", "h"], to: "th",    label: "Most common pair → merge" },
  { from: ["th", "e"], to: "the",  label: "Next most common → merge" },
  { from: ["i", "ng"], to: "ing",  label: "And again..." },
  { from: ["pre", "fix"], to: "prefix", label: "Keeps going until vocabulary is full" },
];

export const Scene4BPE: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: "clamp" });

  // Each step reveals at fps*2 intervals
  const visibleSteps = Math.floor(interpolate(frame, [fps, fps * 9], [0, STEPS.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80 }}>

      <div style={{ opacity: titleOpacity, fontFamily: theme.fontSans, fontSize: 36, color: theme.textMuted, marginBottom: 60 }}>
        <span style={{ color: theme.accent }}>Byte Pair Encoding</span> — how tokens are built
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%", maxWidth: 900 }}>
        {STEPS.map((step, i) => {
          const opacity = interpolate(frame, [fps + i * fps * 2, fps + i * fps * 2 + fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const mergeProgress = interpolate(frame, [fps + i * fps * 2 + fps * 0.5, fps + i * fps * 2 + fps * 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ opacity, display: "flex", alignItems: "center", gap: 32, paddingLeft: 60 }}>
              {/* Input pieces */}
              <div style={{ display: "flex", gap: 8 }}>
                {step.from.map((piece, j) => (
                  <div key={j} style={{
                    fontFamily: theme.fontMono, fontSize: 40, fontWeight: 700,
                    background: theme.surface, color: theme.text,
                    padding: "10px 20px", borderRadius: 10,
                    border: `2px solid ${theme.tokenColors[j]}`,
                  }}>
                    "{piece}"
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div style={{ fontSize: 32, color: theme.accent, opacity: mergeProgress }}>→</div>

              {/* Output merged token */}
              <div style={{
                opacity: mergeProgress,
                fontFamily: theme.fontMono, fontSize: 40, fontWeight: 800,
                background: `${theme.accent}22`, color: theme.accent,
                padding: "10px 24px", borderRadius: 10,
                border: `2px solid ${theme.accent}`,
              }}>
                "{step.to}"
              </div>

              {/* Label */}
              <div style={{ opacity: mergeProgress, fontFamily: theme.fontSans, fontSize: 20, color: theme.textMuted }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
