import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 7 — Why it matters [1:37-1:48]
// Side-by-side: a huge bloated thread (rotting, red) vs a short curated one
// (crisp, green). Curated wins. "Short, curated beats long, bloated."

export const Scene7WhyMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftIn = pop(frame, fps, fps * 1, { damping: 12 });
  const rightIn = pop(frame, fps, fps * 1.4, { damping: 12 });

  // bloated side keeps stacking (rot creeping up)
  const bloatRows = Math.round(interpolate(frame, [fps * 2, fps * 8], [4, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // verdicts
  const badVerdict = interpolate(frame, [fps * 9, fps * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goodVerdict = interpolate(frame, [fps * 10.4, fps * 11.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 12.5, fps * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Panel: React.FC<{
    side: "bad" | "good"; springV: number;
  }> = ({ side, springV }) => {
    const bad = side === "bad";
    const c = bad ? theme.accentRed : theme.accentGreen;
    const rows = bad ? bloatRows : 4;
    return (
      <div style={{
        width: 672, height: 648,
        transform: `translateX(${(1 - springV) * (bad ? -40 : 40)}px) scale(${0.88 + springV * 0.12})`,
        borderRadius: 28, padding: 32,
        background: "linear-gradient(180deg, rgba(20,20,26,0.92), rgba(11,11,15,0.94))",
        border: `1px solid ${c}66`, boxShadow: `0 24px 70px rgba(0,0,0,0.5), 0 0 30px ${c}22`,
        display: "flex", flexDirection: "column", gap: 17, position: "relative", overflow: "hidden",
      }}>
        <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: c, letterSpacing: 2, textTransform: "uppercase" }}>
          {bad ? "one giant thread" : "short, curated"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "flex-start", overflow: "hidden" }}>
          {Array.from({ length: rows }).map((_, i) => {
            const dim = bad ? interpolate(i, [0, rows - 1], [0.85, 0.18]) : 0.95;
            const blur = bad ? interpolate(i, [0, rows - 1], [0, 3]) : 0;
            return (
              <div key={i} style={{
                height: bad ? 26 : 48, borderRadius: 9,
                width: `${65 + ((i * 37) % 30)}%`,
                background: bad ? theme.textDim : `linear-gradient(90deg, ${c}55, ${c}22)`,
                opacity: dim, filter: `blur(${blur}px)`,
                border: bad ? "none" : `1px solid ${c}44`,
              }} />
            );
          })}
        </div>
        {/* verdict */}
        <div style={{
          opacity: bad ? badVerdict : goodVerdict,
          alignSelf: "center", marginTop: 10,
          padding: "16px 34px", borderRadius: 18,
          background: `linear-gradient(160deg, ${c}26, ${c}0c)`, border: `1px solid ${c}88`,
          fontFamily: theme.fontSans, fontSize: 35, fontWeight: 800, color: theme.text,
          boxShadow: `0 0 24px ${c}33`,
        }}>
          {bad ? "✗ rots & forgets" : "✓ sharp & reliable"}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <SceneHeading kicker="the mindset shift" accent={theme.accentGreen}>
        Bigger window <span style={gradientText("#6ee7b7", theme.accentGreen)}>≠ bigger brain</span>
      </SceneHeading>

      <CameraRig style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 44 }}>
        <Panel side="bad" springV={leftIn} />
        <div style={{ fontFamily: theme.fontSans, fontSize: 54, fontWeight: 800, color: theme.textMuted }}>vs</div>
        <Panel side="good" springV={rightIn} />
      </CameraRig>

      <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 41, color: theme.text }}>
        Short, curated context{" "}
        <span style={{ ...gradientText("#6ee7b7", theme.accentGreen), fontWeight: 800 }}>beats a bloated one.</span>{" "}
        Design for rot.
      </div>
    </AbsoluteFill>
  );
};
