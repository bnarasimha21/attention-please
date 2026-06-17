import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 12 — Why this matters (the thesis).
// Same MODEL core in a weak harness vs a strong harness → different outcomes.
// Reuses the structure/animation from Scene7WhyMatters.
// Closing line: "Model = commodity. Harness = the product."

const Core: React.FC<{ pulse: number; ringCount: number; ringGlow: boolean }> = ({ pulse, ringCount, ringGlow }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 380, height: 380 }}>
    {Array.from({ length: ringCount }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: 180 + (i + 1) * 50,
          height: 180 + (i + 1) * 50,
          borderRadius: "50%",
          border: `2px solid ${theme.accent}`,
          opacity: (ringGlow ? 0.6 : 0.32) - i * 0.05,
          boxShadow: ringGlow ? `0 0 22px ${theme.accent}55` : "none",
        }}
      />
    ))}
    <ModelCore size={156} pulse={pulse} fontSize={30} />
  </div>
);

export const Scene12WhyMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const leftOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftScale = interpolate(pop(frame, fps, fps * 1.5, { damping: 11 }), [0, 1], [0.8, 1]);
  const rightScale = interpolate(pop(frame, fps, fps * 3, { damping: 11 }), [0, 1], [0.8, 1]);

  // verdict chips pop in with overshoot
  const weakV = pop(frame, fps, fps * 5.5, { damping: 10 });
  const strongV = pop(frame, fps, fps * 6.2, { damping: 10 });
  const weakVScale = interpolate(weakV, [0, 1], [0.5, 1]);
  const strongVScale = interpolate(strongV, [0, 1], [0.5, 1]);

  // closing line pops near the end with a long readable hold
  const lineSpring = pop(frame, fps, fps * 27, { damping: 13 });
  const lineOpacity = interpolate(frame, [fps * 27, fps * 28.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig>
        <SceneHeading kicker="the thesis" accent={theme.accent}>
          Same model. <span style={gradientText("#c7d2fe", theme.accent)}>Different harness.</span>
        </SceneHeading>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 120, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 150 }}>
          {/* Weak harness */}
          <div style={{ opacity: leftOpacity, transform: `scale(${leftScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.textMuted }}>weak harness</div>
            <Core pulse={pulse} ringCount={1} ringGlow={false} />
            <div
              style={{
                opacity: weakV,
                transform: `scale(${weakVScale})`,
                padding: "16px 34px",
                borderRadius: 14,
                background: `${theme.accentRed}1a`,
                border: `1px solid ${theme.accentRed}`,
                fontFamily: theme.fontSans,
                fontSize: 34,
                color: theme.accentRed,
              }}
            >
              barely works
            </div>
          </div>

          {/* divider */}
          <div style={{ width: 1, height: 460, background: theme.border }} />

          {/* Strong harness */}
          <div style={{ opacity: rightOpacity, transform: `scale(${rightScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.accent }}>strong harness</div>
            <Core pulse={pulse} ringCount={4} ringGlow={true} />
            <div
              style={{
                opacity: strongV,
                transform: `scale(${strongVScale})`,
                padding: "16px 34px",
                borderRadius: 14,
                background: `${theme.accentGreen}1a`,
                border: `1px solid ${theme.accentGreen}`,
                fontFamily: theme.fontSans,
                fontSize: 34,
                color: theme.accentGreen,
              }}
            >
              ships real software
            </div>
          </div>
        </div>

        {/* Closing thesis line */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            width: "100%",
            textAlign: "center",
            opacity: lineOpacity,
            transform: `translateY(${(1 - lineSpring) * 20}px)`,
            fontFamily: theme.fontSans,
            fontSize: 46,
            fontWeight: 700,
            color: theme.text,
          }}
        >
          Model = <span style={{ color: theme.textMuted }}>commodity.</span>{" "}
          Harness = <span style={{ color: theme.accent }}>the product.</span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
