import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 6 — Why it's huge
// Two scaling AXES to make AI smarter:
//   1. train a BIGGER model (expensive, one-time)  — the old axis
//   2. let it THINK LONGER (per-query, on demand)  — the NEW axis (highlighted)
// "The biggest shift since transformers."

export const Scene6WhyHuge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // axis 1 (old) appears 1.2s
  const a1Opacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a1Spring = pop(frame, fps, fps * 1.2, { damping: 11 });
  // bigger-model nodes grow up axis 1
  const a1Grow = interpolate(frame, [fps * 2.5, fps * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // axis 2 (new) appears 5.5s and LIGHTS up
  const a2Opacity = interpolate(frame, [fps * 5.5, fps * 6.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a2Spring = pop(frame, fps, fps * 5.5, { damping: 11 });
  const a2Grow = interpolate(frame, [fps * 6.8, fps * 9.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a2Glow = 0.5 + 0.5 * Math.sin(frame / 7);

  // "biggest shift" tag — holds
  const tagOpacity = interpolate(frame, [fps * 11, fps * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagSpring = pop(frame, fps, fps * 11, { damping: 11 });

  // closing line — holds fully visible to scene end (20s)
  const lineOpacity = interpolate(frame, [fps * 13, fps * 14.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Bar: React.FC<{ grow: number; color: string; count: number }> = ({ grow, color, count }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 264 }}>
      {Array.from({ length: count }).map((_, i) => {
        const localGrow = Math.max(0, Math.min(1, grow * count - i));
        const h = (72 + i * 50) * localGrow;
        return (
          <div key={i} style={{
            width: 50, height: h, borderRadius: 10,
            background: `linear-gradient(180deg, ${color}, ${color}99)`,
            boxShadow: `0 0 16px ${color}55`,
          }} />
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig>
      <SceneHeading kicker="why it's huge" accent={theme.accent}>
        Two ways to make AI <span style={gradientText("#c7d2fe", theme.accent)}>smarter</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 210, left: 0, right: 0, bottom: 200, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>

        {/* Axis 1 — train bigger (old) */}
        <div style={{
          opacity: a1Opacity, transform: `translateY(${(1 - a1Spring) * 29}px) scale(${0.9 + a1Spring * 0.1})`,
          width: 552, padding: 34, borderRadius: 22,
          background: "linear-gradient(180deg, #131318, #0c0c10)", border: `1px solid ${theme.border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
        }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 3, color: theme.textMuted }}>AXIS 1 · TRAIN-TIME</div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 41, fontWeight: 800, color: theme.text }}>Bigger model</div>
          <Bar grow={a1Grow} color={theme.textMuted} count={4} />
          <div style={{ display: "flex", gap: 12 }}>
            {["expensive", "one-time"].map((t) => (
              <span key={t} style={{
                padding: "8px 19px", borderRadius: 999, background: `${theme.accentWarm}14`,
                border: `1px solid ${theme.accentWarm}44`, fontFamily: theme.fontMono, fontSize: 22, color: theme.accentWarm,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* plus */}
        <div style={{ fontFamily: theme.fontSans, fontSize: 81, fontWeight: 300, color: theme.textDim, opacity: a2Opacity }}>+</div>

        {/* Axis 2 — think longer (NEW, highlighted) */}
        <div style={{
          opacity: a2Opacity, transform: `translateY(${(1 - a2Spring) * 29}px) scale(${0.9 + a2Spring * 0.1})`,
          width: 552, padding: 34, borderRadius: 22,
          background: `linear-gradient(180deg, ${theme.accent}14, #0c0c10)`,
          border: `2px solid ${theme.accent}`,
          boxShadow: `0 0 ${22 + a2Glow * 40}px ${theme.accent}55`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 22, position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -19, right: 22, padding: "5px 17px", borderRadius: 999,
            background: theme.accent, color: theme.bg, fontFamily: theme.fontMono, fontSize: 20, fontWeight: 800, letterSpacing: 1,
          }}>NEW</div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 3, color: theme.accent }}>AXIS 2 · ANSWER-TIME</div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 41, fontWeight: 800, color: theme.text }}>Think longer</div>
          <Bar grow={a2Grow} color={theme.accent} count={4} />
          <div style={{ display: "flex", gap: 12 }}>
            {["per-query", "on demand"].map((t) => (
              <span key={t} style={{
                padding: "8px 19px", borderRadius: 999, background: `${theme.accentGreen}14`,
                border: `1px solid ${theme.accentGreen}44`, fontFamily: theme.fontMono, fontSize: 22, color: theme.accentGreen,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* biggest-shift tag */}
      <div style={{
        position: "absolute", bottom: 158, width: "100%", textAlign: "center",
        opacity: tagOpacity, transform: `scale(${0.9 + tagSpring * 0.1})`,
      }}>
        <span style={{
          padding: "13px 34px", borderRadius: 999, background: `${theme.accent}1a`, border: `1px solid ${theme.accent}`,
          fontFamily: theme.fontMono, fontSize: 30, color: theme.accent, fontWeight: 700, letterSpacing: 1,
        }}>★ the biggest shift since transformers</span>
      </div>

      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center", opacity: lineOpacity,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        Buy intelligence <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 800 }}>at answer-time.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
