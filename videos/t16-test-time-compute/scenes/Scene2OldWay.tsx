import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 2 — The old way
// Question token → ONE single quick pulse straight through the MODEL core →
// answer pops out instantly. "One forward pass. Fast, but a first guess."

export const Scene2OldWay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // pieces fade in
  const stageOpacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // single pulse travels left → through core → right, in ONE quick beat (2.6s..4.5s)
  const travel = interpolate(frame, [fps * 2.6, fps * 4.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseX = interpolate(travel, [0, 1], [-516, 516]);
  const pulseOpacity = interpolate(travel, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  // core flashes as the pulse passes through
  const coreFlash = Math.max(0, 1 - Math.abs(travel - 0.5) / 0.18);

  // answer pops the instant the pulse exits (4.5s), holds — snappy punch
  const ansReveal = interpolate(frame, [fps * 4.5, fps * 5.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ansSpring = pop(frame, fps, fps * 4.5, { damping: 11 });

  // "fast but shallow" tag (6.5s), holds
  const tagOpacity = interpolate(frame, [fps * 6.5, fps * 7.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // closing line (9s), holds fully visible to scene end (17s)
  const lineOpacity = interpolate(frame, [fps * 9, fps * 10.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 9, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentRed} />

      <CameraRig>
      <SceneHeading kicker="the old way" accent={theme.accentRed}>
        Answer in <span style={gradientText("#fca5a5", theme.accentRed)}>one pass</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 220, left: 0, right: 0, bottom: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1320, height: 360, display: "flex", alignItems: "center", justifyContent: "center", opacity: stageOpacity }}>

          {/* question (left) */}
          <div style={{
            position: "absolute", left: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          }}>
            <div style={{
              padding: "19px 31px", borderRadius: 17,
              background: "linear-gradient(160deg, #17171f, #0e0e13)", border: `1px solid ${theme.border}`,
              fontFamily: theme.fontMono, fontSize: 32, color: theme.text,
              boxShadow: "0 12px 34px rgba(0,0,0,0.5)",
            }}>question</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.textDim }}>in</div>
          </div>

          {/* connecting track */}
          <div style={{ position: "absolute", left: 276, right: 276, height: 4, background: theme.border, borderRadius: 2 }} />

          {/* core (center) */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 17 }}>
            <div style={{ filter: `brightness(${1 + coreFlash * 0.8})` }}>
              <ModelCore size={192} label="MODEL" pulse={pulse * 0.4 + coreFlash} fontSize={32} />
            </div>
            <div style={{
              fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 3,
              color: theme.accentRed, opacity: 0.9,
            }}>ONE FORWARD PASS</div>
          </div>

          {/* answer (right) */}
          <div style={{
            position: "absolute", right: 36, opacity: ansReveal,
            transform: `scale(${0.7 + ansSpring * 0.3})`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          }}>
            <div style={{
              padding: "19px 31px", borderRadius: 17,
              background: `${theme.accentRed}1a`, border: `1px solid ${theme.accentRed}`,
              fontFamily: theme.fontMono, fontSize: 32, color: theme.accentRed,
              boxShadow: `0 0 ${ansReveal * 38}px ${theme.accentRed}55`,
            }}>answer</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.textDim }}>out — instantly</div>
          </div>

          {/* the single travelling pulse */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(calc(-50% + ${pulseX}px), -50%)`,
            opacity: pulseOpacity,
            width: 31, height: 31, borderRadius: 16, background: theme.text,
            boxShadow: `0 0 31px ${theme.accentRed}, 0 0 14px ${theme.text}`,
          }} />
        </div>
      </div>

      {/* fast-but-shallow tag */}
      <div style={{
        position: "absolute", bottom: 160, width: "100%", textAlign: "center", opacity: tagOpacity,
      }}>
        <span style={{
          padding: "11px 27px", borderRadius: 999, background: `${theme.accentWarm}14`,
          border: `1px solid ${theme.accentWarm}55`, fontFamily: theme.fontMono, fontSize: 27, color: theme.accentWarm,
        }}>⚡ fast — but it's a first guess</span>
      </div>

      {/* closing line */}
      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        No working it out. On a hard problem — a{" "}
        <span style={{ color: theme.accentRed, fontWeight: 700 }}>coin flip.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
