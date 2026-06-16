import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 6 — The verdict [1:20-1:33]
// Old approach (naive single-shot RAG) gets a red strike-through + DEAD stamp.
// New approach (agentic retrieval) glows green with an APPROVED ✓.

export const Scene6Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // OLD card
  const oldOpacity = interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const oldPop = pop(frame, fps, fps * 1, { damping: 11 });
  // strike-through draws across (4s -> 5s)
  const strikeT = interpolate(frame, [fps * 4, fps * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // DEAD stamp drops in (5s)
  const stampSpring = pop(frame, fps, fps * 5, { damping: 8, mass: 0.8 });
  const stampOpacity = interpolate(frame, [fps * 5, fps * 5.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // NEW card
  const newOpacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const newPop = pop(frame, fps, fps * 7, { damping: 11 });
  const approveSpring = pop(frame, fps, fps * 9, { damping: 9 });
  const approveOpacity = interpolate(frame, [fps * 9, fps * 9.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const newGlow = interpolate(frame, [fps * 9, fps * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);

  const lineOpacity = interpolate(frame, [fps * 11.5, fps * 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <CameraRig>
      <SceneHeading kicker="the verdict" accent={theme.accentGreen}>
        So — is it <span style={gradientText("#6ee7b7", theme.accentGreen)}>dead?</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48 }}>
        {/* OLD — dead */}
        <div
          style={{
            position: "relative",
            opacity: oldOpacity,
            transform: `scale(${interpolate(oldPop, [0, 1], [0.85, 1])})`,
            width: 984,
            padding: "32px 44px",
            borderRadius: 22,
            background: "linear-gradient(160deg, #161013, #0f0b0d)",
            border: `1.5px solid ${theme.accentRed}66`,
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div style={{ fontSize: 54 }}>🪦</div>
          <div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 43, fontWeight: 800, color: theme.text }}>Naive, single-shot RAG</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 26, color: theme.textMuted, marginTop: 5 }}>one blind search · grab top chunk · hope</div>
          </div>

          {/* strike-through */}
          <div
            style={{
              position: "absolute",
              left: 44,
              right: 44,
              top: "52%",
              height: 5,
              background: theme.accentRed,
              borderRadius: 2,
              transform: `scaleX(${strikeT})`,
              transformOrigin: "left",
              boxShadow: `0 0 14px ${theme.accentRed}`,
            }}
          />

          {/* DEAD stamp */}
          <div
            style={{
              position: "absolute",
              right: 36,
              top: "50%",
              opacity: stampOpacity,
              transform: `translateY(-50%) rotate(-12deg) scale(${interpolate(stampSpring, [0, 1], [0.6, 1.2])})`,
              padding: "10px 28px",
              border: `5px solid ${theme.accentRed}`,
              borderRadius: 12,
              fontFamily: theme.fontSans,
              fontSize: 54,
              fontWeight: 900,
              letterSpacing: 4,
              color: theme.accentRed,
              background: "rgba(20,10,12,0.6)",
              textShadow: `0 0 16px ${theme.accentRed}88`,
            }}
          >
            DEAD
          </div>
        </div>

        {/* NEW — approved */}
        <div
          style={{
            position: "relative",
            opacity: newOpacity,
            transform: `scale(${interpolate(newPop, [0, 1], [0.85, 1])})`,
            width: 984,
            padding: "32px 44px",
            borderRadius: 22,
            background: "linear-gradient(160deg, #0e1714, #0b110e)",
            border: `2px solid ${theme.accentGreen}`,
            display: "flex",
            alignItems: "center",
            gap: 28,
            boxShadow: `0 0 ${newGlow * (48 + pulse * 36)}px ${theme.accentGreen}66`,
          }}
        >
          <div style={{ fontSize: 54 }}>🧠</div>
          <div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 43, fontWeight: 800, color: theme.text }}>
              Agentic <span style={gradientText("#6ee7b7", theme.accentGreen)}>retrieval</span>
            </div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 26, color: theme.textMuted, marginTop: 5 }}>search · check · retry — the new baseline</div>
          </div>

          {/* APPROVED badge */}
          <div
            style={{
              position: "absolute",
              right: 36,
              top: "50%",
              opacity: approveOpacity,
              transform: `translateY(-50%) rotate(-8deg) scale(${interpolate(approveSpring, [0, 1], [0.6, 1.1])})`,
              padding: "10px 24px",
              border: `3px solid ${theme.accentGreen}`,
              borderRadius: 12,
              fontFamily: theme.fontSans,
              fontSize: 35,
              fontWeight: 900,
              letterSpacing: 2,
              color: theme.accentGreen,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textShadow: `0 0 14px ${theme.accentGreen}88`,
            }}
          >
            ✓ APPROVED
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          textAlign: "center",
          opacity: lineOpacity,
          fontFamily: theme.fontSans,
          fontSize: 41,
          color: theme.text,
        }}
      >
        Single-shot RAG is dead. <span style={{ color: theme.accentGreen }}>Agentic retrieval is the baseline.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
