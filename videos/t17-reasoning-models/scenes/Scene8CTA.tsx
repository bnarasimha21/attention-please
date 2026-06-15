import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText } from "../../../remotion-src/visuals";

// Scene 8 — Recap + CTA [1:40–1:53]
// Clean pipeline: QUESTION → (hidden reasoning) → ANSWER. Tagline "It was never
// magic." then the channel brand block.

const NODES = [
  { label: "QUESTION", sub: "you ask", color: theme.accent, glow: theme.accent },
  { label: "HIDDEN REASONING", sub: "talks to itself", color: theme.tokenColors[5], glow: theme.tokenColors[5] },
  { label: "ANSWER", sub: "short & confident", color: theme.accentGreen, glow: theme.accentGreen },
];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodeStart = (i: number) => fps * 0.6 + i * fps * 1.0;

  // staggered so each block holds ≥3s before scene end (17s)
  const taglineOpacity = interpolate(frame, [fps * 5, fps * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOpacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [fps * 9, fps * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accent} />

      {/* pipeline */}
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: -56 }}>
        {NODES.map((n, i) => {
          const start = nodeStart(i);
          const sp = spring({ frame: frame - start, fps, config: { damping: 16 } });
          const o = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // connector arrow after each node (except last)
          const arrowO = i < NODES.length - 1
            ? interpolate(frame, [start + fps * 0.4, start + fps * 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 0;
          return (
            <div key={n.label} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{
                opacity: o, transform: `scale(${0.85 + sp * 0.15})`,
                width: 336, padding: "32px 22px", borderRadius: 20, textAlign: "center",
                background: `${n.color}12`, border: `2px solid ${n.color}`,
                boxShadow: `0 0 30px ${n.glow}33`,
              }}>
                <div style={{ fontFamily: theme.fontMono, fontSize: 30, fontWeight: 800, color: n.color, letterSpacing: 1 }}>{n.label}</div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted, marginTop: 10 }}>{n.sub}</div>
              </div>
              {i < NODES.length - 1 && (
                <div style={{ opacity: arrowO, fontFamily: theme.fontMono, fontSize: 46, color: theme.textMuted }}>⟶</div>
              )}
            </div>
          );
        })}
      </div>

      {/* tagline */}
      <div style={{ marginTop: 60, opacity: taglineOpacity, fontFamily: theme.fontSans, fontSize: 54, fontWeight: 800, color: theme.text, textAlign: "center" }}>
        It was never magic — <span style={gradientText("#c7d2fe", theme.accent)}>it just talks to itself first.</span>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 24, opacity: ctaOpacity, fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted, textAlign: "center" }}>
        If this made something click, <span style={{ color: theme.accent }}>hit like</span> — it really helps the channel.
      </div>

      {/* Brand — copied exactly from t01 Scene8CTA */}
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
