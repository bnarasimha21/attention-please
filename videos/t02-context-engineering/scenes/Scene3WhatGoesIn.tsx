import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 3 — What goes into context [0:26-0:42]
// A context-window stack fills with labeled layers sliding in one by one:
// system instructions, retrieved docs, memory, tools, examples, the question
// (highlighted last). "The prompt is the last brick. Context is the building."

const LAYERS = [
  { label: "System instructions", note: "who the model is",     emoji: "⚙️", color: theme.tokenColors[4] },
  { label: "Retrieved documents", note: "the facts it needs",   emoji: "📄", color: theme.tokenColors[2] },
  { label: "Memory",              note: "what happened before",  emoji: "🧠", color: theme.tokenColors[5] },
  { label: "Tools",               note: "what it can do",        emoji: "🛠️", color: theme.tokenColors[3] },
  { label: "Few-shot examples",   note: "what good looks like",  emoji: "✨", color: theme.tokenColors[1] },
  { label: "The user's question", note: "asked last",            emoji: "💬", color: theme.accentGreen, highlight: true },
];

export const Scene3WhatGoesIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // window frame appears (1s)
  const frameOpacity = interpolate(frame, [fps * 1, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // each layer slides in, staggered from 2.5s, +1.4s apart
  const layerStart = (i: number) => fps * 2.5 + i * fps * 1.4;

  const lineOpacity = interpolate(frame, [fps * 17.5, fps * 19], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <SceneHeading kicker="layer by layer" accent={theme.accentGreen}>
        What actually goes{" "}
        <span style={gradientText("#6ee7b7", theme.accentGreen)}>into context</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 200, left: 0, right: 0, bottom: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* context window container */}
        <div style={{
          width: 1056, borderRadius: 26, padding: "22px 26px 26px",
          background: "linear-gradient(180deg, #121218 0%, #0b0b0f 100%)",
          border: `2px solid ${theme.border}`,
          boxShadow: "0 24px 70px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.4)",
          opacity: frameOpacity,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 23, letterSpacing: 3, color: theme.textDim, marginBottom: 5 }}>
            CONTEXT WINDOW
          </div>
          {LAYERS.map((l, i) => {
            const start = layerStart(i);
            const s = spring({ frame: frame - start, fps, config: { damping: 16 } });
            const opacity = interpolate(frame, [start, start + fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const glow = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={l.label} style={{
                opacity, transform: `translateX(${(1 - s) * -50}px)`,
                display: "flex", alignItems: "center", gap: 22,
                padding: "17px 24px", borderRadius: 16,
                background: l.highlight
                  ? `linear-gradient(160deg, ${l.color}26, ${l.color}10)`
                  : `linear-gradient(160deg, ${l.color}16, rgba(0,0,0,0.15))`,
                border: `1px solid ${l.color}${l.highlight ? "" : "44"}`,
                boxShadow: l.highlight ? `0 0 ${glow * 43}px ${l.color}55` : "none",
              }}>
                <div style={{ fontSize: 38, width: 41, textAlign: "center" }}>{l.emoji}</div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 32, fontWeight: 700, color: l.highlight ? l.color : theme.text }}>
                  {l.label}
                </div>
                <div style={{ marginLeft: "auto", fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>
                  {l.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 65, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 38, color: theme.text,
      }}>
        The prompt is the <span style={{ color: theme.textMuted }}>last brick.</span> Context is the{" "}
        <span style={{ color: theme.accentGreen, fontWeight: 700 }}>whole building.</span>
      </div>
    </AbsoluteFill>
  );
};
