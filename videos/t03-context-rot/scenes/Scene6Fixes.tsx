import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 6 — The fixes [1:20-1:37]
// Four clean glassy cards reveal in sequence: Compact, Re-inject, Start fresh,
// Keep only what matters.

const FIXES = [
  { icon: "🗜️", title: "Compact", desc: "summarize old turns into a tight recap", color: theme.accent },
  { icon: "📌", title: "Re-inject", desc: "repeat key facts near the end", color: theme.accentGreen },
  { icon: "🔄", title: "Start fresh", desc: "open a clean thread when it bloats", color: theme.tokenColors[1] },
  { icon: "✂️", title: "Keep what matters", desc: "curate context, don't dump it", color: theme.accentWarm },
];

export const Scene6Fixes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardStart = (i: number) => fps * 1.6 + i * fps * 1.5;

  const lineOpacity = interpolate(frame, [fps * 14, fps * 15.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 14, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <SceneHeading kicker="how to fight rot" accent={theme.accentGreen}>
        Four <span style={gradientText("#6ee7b7", theme.accentGreen)}>moves</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 44 }}>
        {FIXES.map((f, i) => {
          const start = cardStart(i);
          const s = spring({ frame: frame - start, fps, config: { damping: 15 } });
          const opacity = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const glowPulse = 0.5 + 0.5 * Math.sin((frame - start) / 10);
          return (
            <div key={f.title} style={{
              width: 384, height: 456,
              opacity, transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + s * 0.1})`,
              borderRadius: 28, padding: "40px 32px",
              background: "linear-gradient(165deg, rgba(28,28,38,0.9) 0%, rgba(14,14,19,0.92) 100%)",
              border: `1px solid ${f.color}55`,
              boxShadow: `0 24px 70px rgba(0,0,0,0.55), 0 0 ${24 + glowPulse * 22}px ${f.color}26, inset 0 1px 0 rgba(255,255,255,0.05)`,
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 22,
            }}>
              <div style={{
                width: 110, height: 110, borderRadius: 26,
                background: `linear-gradient(160deg, ${f.color}33, ${f.color}11)`,
                border: `1px solid ${f.color}66`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 62, boxShadow: `0 0 26px ${f.color}33`,
              }}>{f.icon}</div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: f.color, letterSpacing: 2 }}>0{i + 1}</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 38, fontWeight: 800, color: theme.text }}>{f.title}</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 26, color: theme.textMuted, lineHeight: 1.45 }}>{f.desc}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: "absolute", bottom: 60, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        Don't grow the thread —{" "}
        <span style={{ ...gradientText("#6ee7b7", theme.accentGreen), fontWeight: 800 }}>groom it.</span>
      </div>
    </AbsoluteFill>
  );
};
