import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText } from "../../../remotion-src/visuals";

// Scene 1 — Hook [0:00-0:13]
// "RAG IS DEAD" headlines stamp onto screen one by one (scale-punch + jitter),
// then dissolve into a giant glowing question mark. "Let's actually settle it."

// Faux clickbait headlines that stamp in, scattered like a feed of hot takes.
const HEADLINES = [
  { text: "RAG IS DEAD", x: -310, y: -240, rot: -7, size: 78, start: 0.3 },
  { text: "RAG IS OVER", x: 360, y: -145, rot: 6, size: 59, start: 1.5 },
  { text: "JUST USE LONG CONTEXT", x: -240, y: 50, rot: 4, size: 51, start: 2.7 },
  { text: "RAG IS DEAD", x: 310, y: 180, rot: -5, size: 68, start: 3.9 },
  { text: "STOP USING RAG", x: -350, y: 240, rot: 8, size: 49, start: 5.1 },
];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 2: headlines (last one in at ~5.6s, held readable ~3s) fade out ~8.7s, the big "?" takes over
  const headlinesFade = interpolate(frame, [fps * 8.7, fps * 9.7], [1, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const qSpring = spring({ frame: frame - fps * 9.2, fps, config: { damping: 12 } });
  const qOpacity = interpolate(frame, [fps * 9.2, fps * 10.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qPulse = 0.5 + 0.5 * Math.sin(frame / 9);

  const titleOpacity = interpolate(frame, [fps * 11.8, fps * 12.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = spring({ frame: frame - fps * 11.8, fps, config: { damping: 18 } });

  const subOpacity = interpolate(frame, [fps * 13.4, fps * 14.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accentRed} />

      {/* Stamped headlines */}
      <div style={{ position: "absolute", inset: 0, opacity: headlinesFade }}>
        {HEADLINES.map((h, i) => {
          const start = fps * h.start;
          const s = spring({ frame: frame - start, fps, config: { damping: 9, mass: 0.7 } });
          const opacity = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // brief jitter right as it stamps
          const settle = Math.max(0, 1 - s);
          const jitter = settle * Math.sin(frame * 1.7 + i) * 4;
          const scale = 0.4 + s * 0.6 + settle * 0.25; // overshoot then settle
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                opacity,
                transform: `translate(calc(-50% + ${h.x}px), calc(-50% + ${h.y + jitter}px)) rotate(${h.rot}deg) scale(${scale})`,
                fontFamily: theme.fontSans,
                fontSize: h.size,
                fontWeight: 900,
                letterSpacing: -1,
                color: theme.accentRed,
                textShadow: `0 7px 36px ${theme.accentRed}66, 0 2px 0 rgba(0,0,0,0.5)`,
                padding: "10px 26px",
                border: `4px solid ${theme.accentRed}`,
                borderRadius: 12,
                background: "rgba(20,10,12,0.55)",
                whiteSpace: "nowrap",
              }}
            >
              {h.text}
            </div>
          );
        })}
      </div>

      {/* Giant glowing question mark */}
      <div
        style={{
          position: "absolute",
          opacity: qOpacity,
          transform: `scale(${0.5 + qSpring * 0.5})`,
          fontFamily: theme.fontSans,
          fontSize: 432,
          fontWeight: 900,
          lineHeight: 1,
          ...gradientText("#fca5a5", theme.accentRed),
          filter: `drop-shadow(0 0 ${48 + qPulse * 60}px ${theme.accentRed})`,
          marginTop: -48,
        }}
      >
        ?
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          bottom: 276,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${(1 - titleY) * 22}px)`,
          fontFamily: theme.fontSans,
          fontSize: 76,
          fontWeight: 800,
          color: theme.text,
          letterSpacing: -0.5,
        }}
      >
        Is RAG <span style={gradientText("#fca5a5", theme.accentRed)}>actually</span> dead?
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          width: "100%",
          textAlign: "center",
          opacity: subOpacity,
          fontFamily: theme.fontSans,
          fontSize: 40,
          color: theme.textMuted,
        }}
      >
        Let's actually settle it.
      </div>
    </AbsoluteFill>
  );
};
