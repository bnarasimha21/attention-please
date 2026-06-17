import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 1 - Hook [~32s / 960 frames]
// A lone glowing MODEL core appears. A bug "issue" card pops near it. The model
// reaches for three tools, but they sit behind a translucent glass barrier,
// struck through - "no hands". A dim dashed "harness" ring tease forms around the
// core. Big closing line: "Everything that actually fixes it is the harness."

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Core enters
  const coreS = pop(frame, fps, fps * 0.4, { damping: 12 });
  const coreScale = interpolate(coreS, [0, 1], [0.5, 1]);
  const coreOpacity = interpolate(frame, [fps * 0.4, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const corePulse = 0.5 + 0.5 * Math.sin(frame / 22);

  // Issue card pops in (~3s)
  const issueS = pop(frame, fps, fps * 3, { damping: 11, mass: 0.8 });
  const issueOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tools appear behind glass (~6s)
  const tools = [
    { icon: "📄", label: "open file" },
    { icon: "▶", label: "run test" },
    { icon: "⌘", label: "take action" },
  ];
  const glassOpacity = interpolate(frame, [fps * 6.8, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // "reach" - the core nudges toward the tools then is rebuffed
  const reach = interpolate(frame, [fps * 8.5, fps * 9.5, fps * 10.5], [0, 14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strikeS = pop(frame, fps, fps * 10.5, { damping: 13 });
  const noHandsOpacity = interpolate(frame, [fps * 11, fps * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Harness ring tease (~15s)
  const ringS = interpolate(frame, [fps * 15, fps * 19], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringSpin = frame * 0.4;

  // Closing line (~22s) and teaser (~26s)
  const closeS = pop(frame, fps, fps * 22, { damping: 12 });
  const closeOpacity = interpolate(frame, [fps * 22, fps * 23.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const teaseOpacity = interpolate(frame, [fps * 26, fps * 27.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Center cluster: core + harness ring */}
        <div style={{ position: "absolute", left: "50%", top: 380, transform: "translate(-50%, -50%)" }}>
          {/* Harness ring tease (dim dashed, forming) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 360,
              height: 360,
              marginLeft: -180,
              marginTop: -180,
              borderRadius: "50%",
              border: `3px dashed ${theme.accent}`,
              opacity: ringS * 0.45,
              transform: `rotate(${ringSpin}deg) scale(${interpolate(ringS, [0, 1], [0.7, 1])})`,
              boxShadow: `0 0 ${30 * ringS}px ${theme.accent}55, inset 0 0 ${30 * ringS}px ${theme.accent}33`,
            }}
          />
          {/* dim "harness" ring label */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: -200,
              transform: "translateX(-50%)",
              opacity: ringS * 0.55,
              fontFamily: theme.fontMono,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: theme.accent,
              whiteSpace: "nowrap",
            }}
          >
            harness?
          </div>
          {/* Core */}
          <div style={{ opacity: coreOpacity, transform: `scale(${coreScale})` }}>
            <ModelCore size={200} label="MODEL" pulse={corePulse} />
          </div>
        </div>

        {/* Issue card - upper left of core */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 380,
            transform: `translate(calc(-50% - 430px), calc(-50% + ${(1 - issueS) * 18}px)) scale(${interpolate(issueS, [0, 1], [0.85, 1])})`,
            opacity: issueOpacity,
            width: 420,
            padding: "22px 26px",
            borderRadius: 16,
            background: "linear-gradient(160deg, rgba(40,20,22,0.9), rgba(20,12,14,0.85))",
            border: `1px solid ${theme.accentRed}55`,
            boxShadow: `0 14px 44px rgba(0,0,0,0.5), 0 0 30px ${theme.accentRed}22`,
            fontFamily: theme.fontMono,
          }}
        >
          <div style={{ fontSize: 22, color: theme.accentRed, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
            🐛 issue
          </div>
          <div style={{ fontSize: 30, color: theme.text, fontWeight: 700, lineHeight: 1.3 }}>
            Fix: login crashes on empty email
          </div>
        </div>

        {/* Tools behind glass - right of core */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 380,
            transform: `translate(calc(-50% + 440px), -50%) translateX(${reach}px)`,
            opacity: glassOpacity,
          }}
        >
          {/* glass barrier */}
          <div
            style={{
              position: "absolute",
              left: -34,
              top: -28,
              right: -34,
              bottom: -28,
              borderRadius: 22,
              background: "linear-gradient(135deg, rgba(160,170,255,0.10), rgba(120,130,220,0.04))",
              border: "1.5px solid rgba(180,190,255,0.28)",
              boxShadow: "inset 0 0 60px rgba(180,190,255,0.10), 0 10px 40px rgba(0,0,0,0.4)",
            }}
          />
          {/* big strike-through X over glass */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) scale(${interpolate(strikeS, [0, 1], [0.5, 1])})`,
              opacity: interpolate(strikeS, [0, 1], [0, 0.9]),
              fontSize: 200,
              fontWeight: 900,
              color: theme.accentRed,
              textShadow: `0 0 40px ${theme.accentRed}aa`,
              lineHeight: 1,
              pointerEvents: "none",
            }}
          >
            ✕
          </div>
          {tools.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: i < tools.length - 1 ? 18 : 0,
                width: 300,
                padding: "16px 22px",
                borderRadius: 14,
                background: "linear-gradient(160deg, rgba(30,32,48,0.85), rgba(18,20,30,0.8))",
                border: `1px solid ${theme.border}`,
                opacity: 0.55,
                fontFamily: theme.fontSans,
              }}
            >
              <span style={{ fontSize: 38 }}>{t.icon}</span>
              <span style={{ fontSize: 30, color: theme.textMuted, fontWeight: 600 }}>{t.label}</span>
            </div>
          ))}
          {/* "no hands" label */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: -64,
              transform: "translateX(-50%)",
              opacity: noHandsOpacity,
              fontFamily: theme.fontMono,
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: theme.accentRed,
              whiteSpace: "nowrap",
            }}
          >
            no hands
          </div>
        </div>

        {/* Closing line */}
        <div
          style={{
            position: "absolute",
            bottom: 235,
            width: "100%",
            textAlign: "center",
            opacity: closeOpacity,
            transform: `translateY(${(1 - closeS) * 22}px) scale(${interpolate(closeS, [0, 1], [0.92, 1])})`,
            fontFamily: theme.fontSans,
            fontSize: 50,
            fontWeight: 800,
            color: theme.text,
            letterSpacing: -0.5,
            padding: "0 120px",
            lineHeight: 1.25,
          }}
        >
          Everything that actually fixes it is the{" "}
          <span style={gradientText("#c7d2fe", theme.accent)}>harness</span>.
        </div>

        {/* Dim teaser */}
        <div
          style={{
            position: "absolute",
            bottom: 175,
            width: "100%",
            textAlign: "center",
            opacity: teaseOpacity * 0.7,
            fontFamily: theme.fontMono,
            fontSize: 26,
            color: theme.textMuted,
          }}
        >
          …one layer even rewrites its memory.
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
