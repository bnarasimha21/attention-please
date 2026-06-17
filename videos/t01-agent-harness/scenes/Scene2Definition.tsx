import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 2 - Definition [~23s / 690 frames]
// The one-liner. Left: the model as a "brain in a jar" (glass dome over the core,
// label "thinks"). An arrow → the harness "body" / exoskeleton grows on the right,
// reaching three world icons: files, shell, web.

export const Scene2Definition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Brain in a jar
  const jarS = pop(frame, fps, fps * 1.2, { damping: 13 });
  const jarOpacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const corePulse = 0.5 + 0.5 * Math.sin(frame / 24);

  // Arrow draw
  const arrow = interpolate(frame, [fps * 3.5, fps * 4.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Harness exoskeleton frame grows
  const exoS = interpolate(frame, [fps * 5, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // World icons reach in, staggered
  const worldIcons = [
    { icon: "📄", label: "files" },
    { icon: "⌘", label: "shell" },
    { icon: "🌐", label: "web" },
  ];
  const iconStart = 8;

  // Bottom caption
  const capOpacity = interpolate(frame, [fps * 13, fps * 14.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <SceneHeading kicker="the one-liner" accent={theme.accent} size={46}>
          The model generates text. The harness decides what it can{" "}
          <span style={gradientText("#c7d2fe", theme.accent)}>touch</span>
        </SceneHeading>

        {/* LEFT - brain in a jar */}
        <div style={{ position: "absolute", left: "50%", top: 460, transform: "translate(calc(-50% - 520px), -50%)", opacity: jarOpacity }}>
          {/* glass dome */}
          <div
            style={{
              position: "relative",
              width: 300,
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${interpolate(jarS, [0, 1], [0.85, 1])})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "48% 48% 18% 18% / 60% 60% 12% 12%",
                background: "linear-gradient(160deg, rgba(160,170,255,0.12), rgba(120,130,220,0.03))",
                border: "2px solid rgba(180,190,255,0.30)",
                boxShadow: "inset 0 0 70px rgba(180,190,255,0.12), 0 14px 50px rgba(0,0,0,0.45)",
              }}
            />
            {/* jar base */}
            <div
              style={{
                position: "absolute",
                bottom: -18,
                left: "50%",
                transform: "translateX(-50%)",
                width: 240,
                height: 26,
                borderRadius: 10,
                background: "linear-gradient(180deg, rgba(120,130,200,0.35), rgba(40,44,70,0.5))",
                border: "1px solid rgba(180,190,255,0.25)",
              }}
            />
            <div style={{ transform: "scale(1)" }}>
              <ModelCore size={170} label="MODEL" pulse={corePulse} fontSize={28} />
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 24,
              fontFamily: theme.fontMono,
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: theme.accent,
            }}
          >
            thinks
          </div>
        </div>

        {/* ARROW */}
        <div style={{ position: "absolute", left: "50%", top: 460, transform: "translate(calc(-50% - 230px), -50%)" }}>
          <div style={{ display: "flex", alignItems: "center", width: 150 }}>
            <div
              style={{
                height: 5,
                width: `${arrow * 110}px`,
                background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}cc)`,
                borderRadius: 3,
                boxShadow: `0 0 16px ${theme.accent}88`,
              }}
            />
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "13px solid transparent",
                borderBottom: "13px solid transparent",
                borderLeft: `20px solid ${theme.accent}`,
                opacity: arrow > 0.85 ? 1 : 0,
                filter: `drop-shadow(0 0 10px ${theme.accent}88)`,
              }}
            />
          </div>
        </div>

        {/* RIGHT - harness body / exoskeleton reaching world icons */}
        <div style={{ position: "absolute", left: "50%", top: 460, transform: "translate(calc(-50% + 60px), -50%)", opacity: exoS }}>
          {/* exoskeleton frame */}
          <div
            style={{
              position: "relative",
              width: 640,
              padding: "30px 30px 30px 38px",
              borderRadius: 22,
              background: "linear-gradient(150deg, rgba(40,44,72,0.6), rgba(20,22,36,0.55))",
              border: `2px solid ${theme.accent}55`,
              boxShadow: `0 0 ${40 * exoS}px ${theme.accent}33, 0 18px 50px rgba(0,0,0,0.45)`,
              transform: `scaleX(${interpolate(exoS, [0, 1], [0.9, 1])})`,
              transformOrigin: "left center",
            }}
          >
            <div
              style={{
                fontFamily: theme.fontMono,
                fontSize: 24,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: theme.accent,
                marginBottom: 22,
              }}
            >
              harness · the body
            </div>
            <div style={{ display: "flex", gap: 20, justifyContent: "space-between" }}>
              {worldIcons.map((w, i) => {
                const s = pop(frame, fps, fps * (iconStart + i * 1.3), { damping: 12, mass: 0.8 });
                const op = interpolate(frame, [fps * (iconStart + i * 1.3), fps * (iconStart + i * 1.3 + 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      opacity: op,
                      transform: `translateY(${(1 - s) * 16}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                      padding: "22px 14px",
                      borderRadius: 16,
                      background: "linear-gradient(160deg, rgba(30,34,54,0.9), rgba(16,18,28,0.85))",
                      border: `1px solid ${theme.border}`,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 52, marginBottom: 10 }}>{w.icon}</div>
                    <div style={{ fontFamily: theme.fontSans, fontSize: 28, fontWeight: 700, color: theme.text }}>{w.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom caption */}
        <div
          style={{
            position: "absolute",
            bottom: 175,
            width: "100%",
            textAlign: "center",
            opacity: capOpacity,
            fontFamily: theme.fontMono,
            fontSize: 34,
            color: theme.textMuted,
            letterSpacing: 1,
          }}
        >
          model = <span style={{ color: theme.accent }}>brain</span> · harness ={" "}
          <span style={{ color: theme.accentGreen }}>body</span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
