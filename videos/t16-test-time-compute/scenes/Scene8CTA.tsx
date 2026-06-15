import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 8 — Recap + CTA
// Recap diagram: MODEL core with a "think → answer" flow. Tagline
// "Not bigger. Deeper." → teaser → channel brand block.

const FLOW = [
  { label: "think", color: theme.accent },
  { label: "then answer", color: theme.accentGreen },
];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const coreSpring = spring({ frame: frame - fps * 0.5, fps, config: { damping: 16 } });

  // orbiting "think" / "answer" chips appear, staggered ~1.5s apart
  const chipStart = (i: number) => fps * 1.4 + i * fps * 1.5;

  // thinking shimmer ring around the core
  const ringOpacity = interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // each text beat holds fully visible to scene end (18s)
  const taglineOpacity = interpolate(frame, [fps * 5, fps * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const teaserOpacity = interpolate(frame, [fps * 7.5, fps * 8.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [fps * 10, fps * 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accent} />

      {/* Recap diagram */}
      <div style={{ position: "relative", width: 624, height: 504, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* shimmer ring */}
        <div style={{
          position: "absolute", width: 384, height: 384, borderRadius: "50%",
          border: `2px dashed ${theme.accent}`, opacity: ringOpacity * (0.4 + 0.3 * Math.sin(frame / 6)),
          transform: `rotate(${frame * 1.2}deg)`,
        }} />

        {/* think → answer chips */}
        {FLOW.map((f, i) => {
          const start = chipStart(i);
          const s = spring({ frame: frame - start, fps, config: { damping: 14 } });
          const o = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const side = i === 0 ? -1 : 1;
          return (
            <div key={f.label} style={{
              position: "absolute", top: i === 0 ? 36 : undefined, bottom: i === 1 ? 36 : undefined,
              left: i === 0 ? "12%" : undefined, right: i === 1 ? "12%" : undefined,
              opacity: o, transform: `translateX(${(1 - s) * side * 30}px)`,
              padding: "13px 27px", borderRadius: 999,
              background: `${f.color}1a`, border: `1px solid ${f.color}`,
              fontFamily: theme.fontMono, fontSize: 30, color: f.color, fontWeight: 700,
              boxShadow: `0 0 22px ${f.color}44`,
            }}>{f.label}</div>
          );
        })}

        <div style={{ transform: `scale(${0.6 + coreSpring * 0.4})` }}>
          <ModelCore size={204} pulse={pulse} fontSize={35} />
        </div>
      </div>

      {/* Tagline */}
      <div style={{ marginTop: 29, opacity: taglineOpacity, fontFamily: theme.fontSans, fontSize: 51, fontWeight: 700, color: theme.text }}>
        Not <span style={{ color: theme.textMuted }}>bigger.</span>{" "}
        <span style={gradientText("#c7d2fe", theme.accent)}>Deeper.</span>
      </div>

      {/* Teaser */}
      <div style={{ marginTop: 22, opacity: teaserOpacity, fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted, textAlign: "center" }}>
        Next: <span style={{ color: theme.accent }}>Inside a reasoning model — what "thinking" actually is</span>
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
