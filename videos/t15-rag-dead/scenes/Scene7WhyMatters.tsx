import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 7 — Why it matters [1:33-1:46]
// Wrong question "Is RAG dead?" gets crossed out → replaced by the right one,
// "What does MY data need?" Two guidance chips. Tagline: "it grew up."

const CHIPS = [
  { data: "small · stable data", arrow: "→", pick: "long context", color: theme.tokenColors[5], emoji: "📄" },
  { data: "huge · fresh data", arrow: "→", pick: "retrieval", color: theme.accentGreen, emoji: "🗄️" },
];

export const Scene7WhyMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // wrong question appears, held readable, then gets crossed out (4.5s -> 5.4s)
  const wrongOpacity = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strikeT = interpolate(frame, [fps * 4.5, fps * 5.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wrongDim = interpolate(frame, [fps * 5.4, fps * 6.2], [1, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // right question rises in (6s)
  const rightSpring = pop(frame, fps, fps * 6, { damping: 11 });
  const rightOpacity = interpolate(frame, [fps * 6, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // guidance chips stagger in (8s+)
  const chipStart = (i: number) => fps * (8.2 + i * 1.3);

  const lineOpacity = interpolate(frame, [fps * 12, fps * 13.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = pop(frame, fps, fps * 12, { damping: 13 });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig>
      <SceneHeading kicker="why it matters" accent={theme.accent}>
        Ask the <span style={gradientText("#c7d2fe", theme.accent)}>right</span> question
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {/* wrong question, crossed out */}
        <div style={{ position: "relative", opacity: wrongOpacity * wrongDim }}>
          <div style={{ fontFamily: theme.fontSans, fontSize: 51, fontWeight: 700, color: theme.textMuted }}>"Is RAG dead?"</div>
          <div
            style={{
              position: "absolute",
              left: -12,
              right: -12,
              top: "52%",
              height: 5,
              background: theme.accentRed,
              borderRadius: 2,
              transform: `scaleX(${strikeT})`,
              transformOrigin: "left",
              boxShadow: `0 0 12px ${theme.accentRed}`,
            }}
          />
        </div>

        {/* right question */}
        <div
          style={{
            opacity: rightOpacity,
            transform: `translateY(${(1 - rightSpring) * 22}px) scale(${interpolate(rightSpring, [0, 1], [0.9, 1])})`,
            fontFamily: theme.fontSans,
            fontSize: 68,
            fontWeight: 800,
            color: theme.text,
            textAlign: "center",
          }}
        >
          "What does <span style={gradientText("#c7d2fe", theme.accent)}>my data</span> need?"
        </div>

        {/* guidance chips */}
        <div style={{ display: "flex", gap: 48, marginTop: 22 }}>
          {CHIPS.map((c, i) => {
            const start = chipStart(i);
            const s = pop(frame, fps, start, { damping: 11 });
            const opacity = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `translateY(${(1 - s) * 18}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "22px 32px",
                  borderRadius: 17,
                  background: "linear-gradient(160deg, #15151b, #0d0d11)",
                  border: `1px solid ${c.color}55`,
                  boxShadow: `0 14px 40px rgba(0,0,0,0.5), 0 0 22px ${c.color}22`,
                }}
              >
                <span style={{ fontSize: 46 }}>{c.emoji}</span>
                <div style={{ fontFamily: theme.fontMono, fontSize: 27, color: theme.textMuted }}>{c.data}</div>
                <div style={{ fontSize: 32, color: theme.textDim }}>{c.arrow}</div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 30, fontWeight: 700, color: c.color }}>{c.pick}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          textAlign: "center",
          opacity: lineOpacity,
          transform: `translateY(${(1 - lineY) * 18}px)`,
          fontFamily: theme.fontSans,
          fontSize: 43,
          color: theme.text,
        }}
      >
        Retrieval didn't disappear — it <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 700 }}>grew up.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
