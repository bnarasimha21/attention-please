import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 6 — Why it's hidden [1:13–1:27]
// Contrast: the messy PRIVATE scratchpad (left, dim) vs the clean PUBLIC answer
// (right, bright). An arrow labels it: a tool to reach the answer, not the answer.

const MESSY = [
  "hmm, let me try…", "wait, recheck that…", "convert the units…",
  "no — carry the hour…", "double-check… ✓", "okay, confident now…",
];

export const Scene6WhyHidden: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftOpacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowOpacity = interpolate(frame, [fps * 3.5, fps * 4.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightSpring = pop(frame, fps, fps * 4.5, { damping: 10 });
  const rightOpacity = interpolate(frame, [fps * 4.5, fps * 5.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightGlow = interpolate(frame, [fps * 5, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // bottom caption lands ~13s; both cards hold well past 3s (scene 18s)
  const lineOpacity = interpolate(frame, [fps * 13, fps * 14.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig>
      <SceneHeading kicker="why it stays backstage" accent={theme.accent}>
        The scratchpad is a <span style={gradientText("#c7d2fe", theme.accent)}>tool</span>, not the answer
      </SceneHeading>

      <div style={{ position: "absolute", top: 180, left: 0, right: 0, bottom: 130, display: "flex", alignItems: "center", justifyContent: "center", gap: 72 }}>

        {/* LEFT — messy private scratchpad, dim */}
        <div style={{ opacity: leftOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 27, color: theme.textMuted, letterSpacing: 1 }}>private · messy</div>
          <div style={{
            width: 624, height: 440, borderRadius: 22, padding: "28px 32px",
            background: "linear-gradient(180deg, #111114 0%, #0b0b0e 100%)",
            border: `1px dashed ${theme.border}`, opacity: 0.7,
            filter: "saturate(0.6)", overflow: "hidden",
          }}>
            {MESSY.map((m, i) => (
              <div key={i} style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.textMuted, lineHeight: 1.95 }}>
                <span style={{ color: theme.textMuted }}>›</span> {m}
              </div>
            ))}
          </div>
        </div>

        {/* arrow */}
        <div style={{ opacity: arrowOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 48, color: theme.accent }}>⟶</div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted, letterSpacing: 1 }}>tool → result</div>
        </div>

        {/* RIGHT — clean public answer, bright */}
        <div style={{ opacity: rightOpacity, transform: `translateX(${(1 - rightSpring) * 26}px) scale(${0.85 + rightSpring * 0.15})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 27, color: theme.accentGreen, letterSpacing: 1 }}>public · clean</div>
          <div style={{
            width: 624, height: 440, borderRadius: 22, padding: "32px",
            background: `linear-gradient(160deg, ${theme.accentGreen}16, #0c100e)`,
            border: `2px solid ${theme.accentGreen}`,
            boxShadow: `0 0 ${30 + rightGlow * 45}px ${theme.accentGreen}44`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20,
          }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: theme.accentGreen }}>
              what you get
            </div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 65, fontWeight: 800, color: theme.text, textAlign: "center" }}>
              It arrives at 11:15.
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 56, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        You get the clean result. The <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 800 }}>thinking stays backstage.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
