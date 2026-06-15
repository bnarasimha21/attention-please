import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText } from "../../../remotion-src/visuals";

// Scene 8 — Recap + CTA [1:38-1:50]
// Clean ratio diagram: prompt = 10% sliver, context = the big system around it.
// Tagline → "context rot" teaser → channel brand block (copied from T01).

const RECAP_STEPS = ["Curate it", "Order it", "Deliver it just-in-time"];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ratio bar fills (0.6s) — 10% prompt, 90% context
  const barOpacity = interpolate(frame, [fps * 0.6, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const promptW = interpolate(frame, [fps * 1.2, fps * 2.4], [0, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctxW = interpolate(frame, [fps * 2, fps * 3.4], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // recap steps appear, staggered ~1.3s apart
  const stepStart = (i: number) => fps * 4.4 + i * fps * 1.3;

  const taglineOpacity = interpolate(frame, [fps * 8.5, fps * 9.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const teaserOpacity = interpolate(frame, [fps * 10.6, fps * 11.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [fps * 12.6, fps * 13.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accent} />

      {/* Ratio diagram */}
      <div style={{ opacity: barOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 19, marginTop: -48 }}>
        <div style={{ fontFamily: theme.fontMono, fontSize: 24, letterSpacing: 3, color: theme.textDim }}>
          WHAT DRIVES THE ANSWER
        </div>
        <div style={{
          width: 1176, height: 108, borderRadius: 19, overflow: "hidden",
          border: `1px solid ${theme.border}`, display: "flex",
          boxShadow: "0 18px 55px rgba(0,0,0,0.45)",
        }}>
          {/* prompt sliver */}
          <div style={{
            width: `${promptW}%`,
            background: "linear-gradient(160deg, #2a2a33, #16161b)",
            borderRight: `1px solid ${theme.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted, whiteSpace: "nowrap",
          }}>
            {promptW > 6 && "prompt"}
          </div>
          {/* context */}
          <div style={{
            width: `${ctxW}%`,
            background: `linear-gradient(120deg, ${theme.accent}, #4338ca)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `inset 0 0 40px ${theme.accent}66`,
            fontFamily: theme.fontMono, fontSize: 32, fontWeight: 800, color: theme.text, letterSpacing: 1,
          }}>
            {ctxW > 20 && "CONTEXT — the system around it"}
          </div>
        </div>
        <div style={{ display: "flex", width: 1176, justifyContent: "space-between", fontFamily: theme.fontSans, fontSize: 23, color: theme.textMuted }}>
          <span>~10% the prompt</span>
          <span style={{ color: theme.accent }}>~90% the context →</span>
        </div>
      </div>

      {/* Recap steps */}
      <div style={{ display: "flex", gap: 19, marginTop: 41 }}>
        {RECAP_STEPS.map((s, i) => {
          const start = stepStart(i);
          const sp = spring({ frame: frame - start, fps, config: { damping: 16 } });
          const o = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={s} style={{
              opacity: o, transform: `translateY(${(1 - sp) * 16}px)`,
              padding: "12px 24px", borderRadius: 999,
              background: `${theme.accent}14`, border: `1px solid ${theme.accent}55`,
              fontFamily: theme.fontMono, fontSize: 26, color: theme.text,
            }}>{s}</div>
          );
        })}
      </div>

      {/* Tagline */}
      <div style={{ marginTop: 36, opacity: taglineOpacity, fontFamily: theme.fontSans, fontSize: 49, fontWeight: 700, color: theme.text }}>
        Your prompt is the <span style={{ color: theme.textMuted }}>tip.</span> Context is the{" "}
        <span style={gradientText("#c7d2fe", theme.accent)}>iceberg.</span>
      </div>

      {/* Teaser */}
      <div style={{ marginTop: 19, opacity: teaserOpacity, fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted, textAlign: "center" }}>
        Next: <span style={{ color: theme.accent }}>Context rot — why long chats get dumber</span>
      </div>

      {/* Brand — copied exactly from T01 Scene8CTA */}
      <div style={{ opacity: brandOpacity, position: "absolute", bottom: 72, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
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
