import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 8 — Recap + CTA [1:46-2:00]
// Crisp recap row of pills → tagline → teaser → channel brand block (copied
// exactly from t01 Scene8CTA).

const PILLS = [
  { label: "Retrieve → Generate", note: "what RAG is", color: theme.accent, icon: "🔁" },
  { label: "Single-shot RAG", note: "is dead", color: theme.accentRed, icon: "✕" },
  { label: "Agentic retrieval", note: "the new baseline", color: theme.accentGreen, icon: "✓" },
  { label: "Long context", note: "a tool, not a replacement", color: theme.accentWarm, icon: "📄" },
];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // pills stagger in
  const pillStart = (i: number) => fps * (1.6 + i * 1.2);

  const taglineOpacity = interpolate(frame, [fps * 7.5, fps * 8.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const teaserOpacity = interpolate(frame, [fps * 9.5, fps * 10.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [fps * 11.5, fps * 12.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Recap title */}
      <div style={{ position: "absolute", top: 90, opacity: titleOpacity, fontFamily: theme.fontSans, fontSize: 54, fontWeight: 800, color: theme.text }}>
        The whole story, <span style={gradientText("#c7d2fe", theme.accent)}>in four lines</span>
      </div>

      {/* Recap pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: -20 }}>
        {PILLS.map((p, i) => {
          const start = pillStart(i);
          const s = pop(frame, fps, start, { damping: 11 });
          const opacity = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${(1 - s) * -30}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                display: "flex",
                alignItems: "center",
                gap: 22,
                width: 768,
                padding: "20px 32px",
                borderRadius: 17,
                background: "linear-gradient(160deg, #15151b, #0d0d11)",
                border: `1px solid ${p.color}55`,
                boxShadow: `0 14px 40px rgba(0,0,0,0.5), 0 0 20px ${p.color}22`,
              }}
            >
              <div
                style={{
                  width: 53,
                  height: 53,
                  borderRadius: 13,
                  background: `${p.color}22`,
                  border: `1.5px solid ${p.color}`,
                  color: p.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                {p.icon}
              </div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 35, fontWeight: 700, color: theme.text }}>{p.label}</div>
              <div style={{ marginLeft: "auto", fontFamily: theme.fontSans, fontSize: 26, color: theme.textMuted }}>{p.note}</div>
            </div>
          );
        })}
      </div>

      {/* Tagline */}
      <div style={{ marginTop: 38, opacity: taglineOpacity, fontFamily: theme.fontSans, fontSize: 46, fontWeight: 700, color: theme.text }}>
        RAG isn't dead. It <span style={gradientText("#6ee7b7", theme.accentGreen)}>grew up.</span>
      </div>

      {/* Teaser */}
      <div style={{ marginTop: 18, opacity: teaserOpacity, fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted, textAlign: "center" }}>
        Next: <span style={{ color: theme.accent }}>Test-time compute — why models now think before answering</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
