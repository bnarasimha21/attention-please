import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../motion";

// Scene 7 — Why this matters
// Same MODEL core in a weak harness vs a strong harness → different outcomes.
// "The model is a commodity. The harness is the product."

const Core: React.FC<{ pulse: number; ringCount: number }> = ({ pulse, ringCount }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 360, height: 360 }}>
    {Array.from({ length: ringCount }).map((_, i) => (
      <div key={i} style={{
        position: "absolute",
        width: 180 + (i + 1) * 48, height: 180 + (i + 1) * 48, borderRadius: "50%",
        border: `2px solid ${theme.accent}`, opacity: 0.4 - i * 0.06,
      }} />
    ))}
    <ModelCore size={156} pulse={pulse} fontSize={30} />
  </div>
);

export const Scene7WhyMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const leftOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftScale = interpolate(pop(frame, fps, fps * 1.5, { damping: 11 }), [0, 1], [0.8, 1]);
  const rightScale = interpolate(pop(frame, fps, fps * 3, { damping: 11 }), [0, 1], [0.8, 1]);

  // verdict chips pop in with overshoot
  const weakV = pop(frame, fps, fps * 5, { damping: 10 });
  const strongV = pop(frame, fps, fps * 5.5, { damping: 10 });
  const weakVerdict = weakV;
  const strongVerdict = strongV;
  const weakVScale = interpolate(weakV, [0, 1], [0.5, 1]);
  const strongVScale = interpolate(strongV, [0, 1], [0.5, 1]);

  const lineSpring = pop(frame, fps, fps * 8, { damping: 13 });
  const lineOpacity = interpolate(frame, [fps * 8, fps * 9.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig>

      <SceneHeading kicker="the takeaway" accent={theme.accent}>
        Same model. <span style={gradientText("#c7d2fe", theme.accent)}>Different harness.</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 100, display: "flex", alignItems: "center", justifyContent: "center", gap: 144 }}>
        {/* Weak harness */}
        <div style={{ opacity: leftOpacity, transform: `scale(${leftScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.textMuted }}>weak harness</div>
          <Core pulse={pulse} ringCount={1} />
          <div style={{
            opacity: weakVerdict, transform: `scale(${weakVScale})`, padding: "16px 32px", borderRadius: 14,
            background: `${theme.accentRed}1a`, border: `1px solid ${theme.accentRed}`,
            fontFamily: theme.fontSans, fontSize: 32, color: theme.accentRed,
          }}>barely works</div>
        </div>

        {/* divider */}
        <div style={{ width: 1, height: 432, background: theme.border }} />

        {/* Strong harness */}
        <div style={{ opacity: rightOpacity, transform: `scale(${rightScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.accent }}>strong harness</div>
          <Core pulse={pulse} ringCount={4} />
          <div style={{
            opacity: strongVerdict, transform: `scale(${strongVScale})`, padding: "16px 32px", borderRadius: 14,
            background: `${theme.accentGreen}1a`, border: `1px solid ${theme.accentGreen}`,
            fontFamily: theme.fontSans, fontSize: 32, color: theme.accentGreen,
          }}>ships real software</div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineSpring) * 20}px)`,
        fontFamily: theme.fontSans, fontSize: 44, color: theme.text,
      }}>
        The model is becoming a <span style={{ color: theme.textMuted }}>commodity.</span> The harness is the <span style={{ color: theme.accent }}>product.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
