import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// smallest angular distance between two angles (deg)
const angDist = (a: number, b: number) => {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(d, 360 - d);
};

// Scene 3 — The agent loop
// Circular loop: Observe → Plan → Act → repeat. A token rotates around the
// ring; a budget bar drains each lap. Chatbot (one shot) vs agent (loops).

const NODES = [
  { label: "OBSERVE", angle: -90, color: theme.tokenColors[4] },
  { label: "PLAN", angle: 30, color: theme.tokenColors[5] },
  { label: "ACT", angle: 150, color: theme.tokenColors[3] },
];

export const Scene3Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ring appears (1s)
  const ringOpacity = interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Rotating token starts at 2.5s; ~2s per lap
  const rotateStart = fps * 2.5;
  const active = frame > rotateStart;
  const sweep = active ? ((frame - rotateStart) / (fps * 2)) * 360 : 0;
  const tokenAngle = -90 + sweep;
  const R = 240;
  const tx = Math.cos((tokenAngle * Math.PI) / 180) * R;
  const ty = Math.sin((tokenAngle * Math.PI) / 180) * R;

  // Budget bar drains over the scene (starts at 3s)
  const budget = interpolate(frame, [fps * 3, fps * 16], [100, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const budgetOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const budgetColor = budget > 50 ? theme.accentGreen : budget > 25 ? theme.accentWarm : theme.accentRed;

  // Caption reveals after a couple laps, then holds to scene end.
  const captionOpacity = interpolate(frame, [fps * 10, fps * 11.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <SceneHeading kicker="the beating heart" accent={theme.accent}>
        At the center: <span style={gradientText("#c7d2fe", theme.accent)}>a loop</span>
      </SceneHeading>

      {/* Loop diagram */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 600, height: 600 }}>
          {/* ring */}
          <div style={{
            position: "absolute", inset: 60, borderRadius: "50%",
            border: `2px solid ${theme.border}`, opacity: ringOpacity,
            boxShadow: `inset 0 0 80px ${theme.accent}14`,
          }} />

          {/* nodes */}
          {NODES.map((n) => {
            const x = Math.cos((n.angle * Math.PI) / 180) * R;
            const y = Math.sin((n.angle * Math.PI) / 180) * R;
            // smooth 0..1 "litness" as the token sweeps past this node
            const lit = active ? Math.max(0, 1 - angDist(tokenAngle, n.angle) / 55) : 0;
            return (
              <div key={n.label} style={{
                position: "absolute", left: "50%", top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${1 + lit * 0.16})`,
                opacity: ringOpacity,
                padding: "20px 36px", borderRadius: 18,
                background: interpolateColors(lit, [0, 1], [theme.surface, n.color]),
                color: interpolateColors(lit, [0, 1], [theme.text, theme.bg]),
                border: `1px solid ${interpolateColors(lit, [0, 1], [theme.border, n.color])}`,
                boxShadow: `0 0 ${lit * 45}px ${n.color}`,
                fontFamily: theme.fontMono, fontSize: 35, fontWeight: 800, letterSpacing: 2,
              }}>{n.label}</div>
            );
          })}

          {/* rotating token */}
          {active && (
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
              width: 32, height: 32, borderRadius: 16, background: theme.text,
              boxShadow: `0 0 24px ${theme.text}`,
            }} />
          )}

          {/* center label */}
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            opacity: ringOpacity, fontFamily: theme.fontSans, fontSize: 30, color: theme.textDim, textAlign: "center", width: 240,
          }}>
            until the job<br />is done
          </div>
        </div>
      </div>

      {/* Budget bar */}
      <div style={{ position: "absolute", bottom: 200, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: budgetOpacity }}>
        <div style={{ fontFamily: theme.fontMono, fontSize: 27, color: theme.textMuted }}>step / token budget</div>
        <div style={{ width: 624, height: 24, borderRadius: 12, background: theme.surface, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
          <div style={{ width: `${budget}%`, height: "100%", background: budgetColor, boxShadow: `0 0 20px ${budgetColor}` }} />
        </div>
      </div>

      {/* Caption */}
      <div style={{ position: "absolute", bottom: 100, width: "100%", textAlign: "center", opacity: captionOpacity, fontFamily: theme.fontSans, fontSize: 38, color: theme.text }}>
        A chatbot answers <span style={{ color: theme.textMuted }}>once</span>. An agent runs the loop — <span style={{ color: theme.accent }}>on a budget.</span>
      </div>
    </AbsoluteFill>
  );
};
