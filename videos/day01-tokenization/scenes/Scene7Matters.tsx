import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";

// Scene 7 — Why it matters [5:00-5:45]
// Context window bar filling with tokens, cost counter

export const Scene7Matters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: "clamp" });

  // Context window fills (1s-5s)
  const windowFill = interpolate(frame, [fps, fps * 5], [0, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const windowOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label: 128k tokens ≠ 128k words
  const labelOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // API cost section
  const costOpacity = interpolate(frame, [fps * 5.5, fps * 6.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70 }}>

      <div style={{ opacity: titleOpacity, fontFamily: theme.fontSans, fontSize: 36, color: theme.textMuted, marginBottom: 60 }}>
        Why this matters to <span style={{ color: theme.accent }}>you</span>
      </div>

      {/* Context window */}
      <div style={{ opacity: windowOpacity, width: "80%", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fontSans, fontSize: 22, color: theme.textMuted }}>
          <span>Context window (128k)</span>
          <span style={{ color: theme.accent }}>{Math.round(windowFill * 100)}% full</span>
        </div>

        {/* Bar */}
        <div style={{ height: 48, background: theme.surface, borderRadius: 12, overflow: "hidden", border: `1px solid ${theme.border}` }}>
          <div style={{
            height: "100%",
            width: `${windowFill * 100}%`,
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.tokenColors[1]})`,
            borderRadius: 12,
            transition: "width 0.1s",
          }} />
        </div>

        <div style={{ opacity: labelOpacity, display: "flex", gap: 40, marginTop: 8 }}>
          <div style={{ fontFamily: theme.fontSans, fontSize: 20, color: theme.accentWarm }}>
            128,000 tokens ≠ 128,000 words
          </div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 20, color: theme.accentGreen }}>
            ≈ 96,000 words (tokens are shorter)
          </div>
        </div>
      </div>

      {/* API cost section */}
      <div style={{ opacity: costOpacity, marginTop: 60, width: "80%", background: theme.surface, borderRadius: 20, padding: "32px 40px", border: `1px solid ${theme.border}` }}>
        <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.text, marginBottom: 24, fontWeight: 600 }}>
          API calls — you pay per token
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Short prompt", tokens: "~50 tokens", cost: "cheap", color: theme.accentGreen },
            { label: "Long system prompt (repeated every call)", tokens: "~2,000 tokens × every request", cost: "adds up fast", color: theme.accentWarm },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ fontFamily: theme.fontSans, fontSize: 20, color: theme.textMuted, flex: 1 }}>{row.label}</div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 18, color: row.color }}>{row.tokens}</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 18, color: row.color, fontWeight: 600 }}>→ {row.cost}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
