import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 7 — Why it matters [1:30-1:43]
// A single sharp, focused core with an attention beam locked on a GOAL target.
// Two payoff chips: focus + parallel scale. "A clean mind makes better decisions."

export const Scene7WhyMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const coreSpring = spring({ frame: frame - fps * 0.8, fps, config: { damping: 16 } });
  const coreOpacity = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // attention beam grows toward target (2.2s)
  const beam = interpolate(frame, [fps * 2.2, fps * 3.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const targetSpring = spring({ frame: frame - fps * 3.2, fps, config: { damping: 13 } });
  const targetOpacity = interpolate(frame, [fps * 3.2, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // payoff chips
  const chip1 = interpolate(frame, [fps * 4.8, fps * 5.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chip2 = interpolate(frame, [fps * 6.1, fps * 6.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineSpring = spring({ frame: frame - fps * 13, fps, config: { damping: 16 } });
  const lineOpacity = interpolate(frame, [fps * 13, fps * 14.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <SceneHeading kicker="why it matters" accent={theme.accent}>
        A clean mind, <span style={gradientText("#c7d2fe", theme.accent)}>locked on the goal</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 30, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 0 }}>

          {/* focused core */}
          <div style={{ opacity: coreOpacity, transform: `scale(${0.6 + coreSpring * 0.4})`, zIndex: 10 }}>
            <ModelCore size={228} pulse={pulse} fontSize={35} />
          </div>

          {/* attention beam */}
          <div style={{
            width: 432 * beam, height: 19, marginLeft: 12,
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentGreen})`,
            boxShadow: `0 0 26px ${theme.accent}`, borderRadius: 10, opacity: beam,
          }} />

          {/* GOAL target */}
          <div style={{
            opacity: targetOpacity, transform: `scale(${0.6 + targetSpring * 0.4})`, marginLeft: 12,
            width: 180, height: 180, borderRadius: "50%",
            border: `4px solid ${theme.accentGreen}`, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 40px ${theme.accentGreen}66`, position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 34, borderRadius: "50%", border: `3px solid ${theme.accentGreen}88` }} />
            <div style={{ fontSize: 59 }}>🎯</div>
          </div>
        </div>
      </div>

      {/* payoff chips */}
      <div style={{ position: "absolute", bottom: 200, width: "100%", display: "flex", justifyContent: "center", gap: 48 }}>
        <div style={{
          opacity: chip1, transform: `translateY(${(1 - chip1) * 16}px)`,
          padding: "17px 31px", borderRadius: 14,
          background: `${theme.accent}1a`, border: `1px solid ${theme.accent}`,
          fontFamily: theme.fontSans, fontSize: 32, color: theme.accent, fontWeight: 700,
        }}>Sharper reasoning</div>
        <div style={{
          opacity: chip2, transform: `translateY(${(1 - chip2) * 16}px)`,
          padding: "17px 31px", borderRadius: 14,
          background: `${theme.accentGreen}1a`, border: `1px solid ${theme.accentGreen}`,
          fontFamily: theme.fontSans, fontSize: 32, color: theme.accentGreen, fontWeight: 700,
        }}>Work scales in parallel</div>
      </div>

      <div style={{
        position: "absolute", bottom: 90, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineSpring) * 20}px)`,
        fontFamily: theme.fontSans, fontSize: 46, color: theme.text,
      }}>
        A clean mind makes <span style={{ ...gradientText("#6ee7b7", theme.accentGreen), fontWeight: 800 }}>better decisions.</span>
      </div>
    </AbsoluteFill>
  );
};
