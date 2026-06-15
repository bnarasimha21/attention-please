import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, EASE_OUT } from "../../../remotion-src/visuals";

// Scene 6 — When to use [1:14-1:30]
// Two-column decision guide: green "use a subagent" vs amber "keep in main".

const USE = [
  "Isolated research",
  "Code review",
  "Debugging a tangent",
  "Exploring options in parallel",
];
const KEEP = [
  "Tightly-coupled reasoning",
  "Each step needs the last",
  "Short, cheap tasks",
  "Shared running state",
];

const Column: React.FC<{
  title: string; sub: string; items: string[]; color: string; icon: string; baseDelay: number; frame: number; fps: number;
}> = ({ title, sub, items, color, icon, baseDelay, frame, fps }) => {
  const headSpring = spring({ frame: frame - baseDelay, fps, config: { damping: 16 } });
  const headOpacity = interpolate(frame, [baseDelay, baseDelay + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      width: 696, opacity: headOpacity, transform: `translateY(${(1 - headSpring) * 24}px)`,
      borderRadius: 26, padding: 34,
      background: `linear-gradient(180deg, ${color}10 0%, #0c0c11 100%)`,
      border: `1px solid ${color}55`, boxShadow: `0 24px 70px rgba(0,0,0,0.5), 0 0 30px ${color}14`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 17, marginBottom: 8 }}>
        <div style={{ fontSize: 46 }}>{icon}</div>
        <div style={{ fontFamily: theme.fontSans, fontSize: 40, fontWeight: 800, color }}>{title}</div>
      </div>
      <div style={{ fontFamily: theme.fontMono, fontSize: 23, color: theme.textMuted, marginBottom: 26, letterSpacing: 1 }}>{sub}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 17 }}>
        {items.map((it, i) => {
          const start = baseDelay + fps * 0.6 + i * fps * 1.2;
          const s = spring({ frame: frame - start, fps, config: { damping: 15 } });
          const op = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
          return (
            <div key={it} style={{
              opacity: op, transform: `translateX(${(1 - s) * -22}px)`,
              display: "flex", alignItems: "center", gap: 17,
              padding: "17px 22px", borderRadius: 14,
              background: `${color}0e`, border: `1px solid ${color}33`,
              fontFamily: theme.fontSans, fontSize: 31, color: theme.text,
            }}>
              <span style={{ color, fontSize: 30, fontWeight: 800 }}>{icon === "✓" ? "✓" : "•"}</span>
              {it}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Scene6WhenToUse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineOpacity = interpolate(frame, [fps * 17, fps * 18.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 17, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <SceneHeading kicker="when to use" accent={theme.accentGreen}>
        Hand off the mess — or <span style={gradientText("#fbbf24", theme.accentWarm)}>keep it close</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 60, display: "flex", alignItems: "center", justifyContent: "center", gap: 72 }}>
        <Column title="Use a subagent" sub="ISOLATED · PARALLEL" items={USE} color={theme.accentGreen} icon="✓" baseDelay={fps * 1.2} frame={frame} fps={fps} />
        <Column title="Keep in main" sub="COUPLED · SEQUENTIAL" items={KEEP} color={theme.accentWarm} icon="⚠" baseDelay={fps * 2.0} frame={frame} fps={fps} />
      </div>

      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        Offload what's <span style={{ color: theme.accentGreen, fontWeight: 700 }}>independent</span> — keep what's{" "}
        <span style={{ color: theme.accentWarm, fontWeight: 700 }}>connected.</span>
      </div>
    </AbsoluteFill>
  );
};
