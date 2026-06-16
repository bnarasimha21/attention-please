import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, ModelCore, gradientText, EASE_OUT, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 1 — Hook [0:00-0:13]
// Main MODEL core beside its context window. Tool-output chips rain in and
// clutter the window until it flashes "overloaded". "One brain. Too much noise."

const NOISE = [
  { label: "read main.py  · 2,140 lines", color: theme.tokenColors[4] },
  { label: "web search → 38 results", color: theme.tokenColors[3] },
  { label: "$ npm test  · 412 lines log", color: theme.tokenColors[1] },
  { label: "read utils.ts · 980 lines", color: theme.tokenColors[5] },
  { label: "grep TODO → 126 matches", color: theme.tokenColors[2] },
];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const coreOpacity = interpolate(frame, [fps * 0.4, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coreSpring = pop(frame, fps, fps * 0.4, { damping: 11 });

  const panelOpacity = interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelSpring = pop(frame, fps, fps * 1, { damping: 12 });

  // chips drop in one by one starting 2.6s, 1.3s apart
  const chipStart = (i: number) => fps * 2.6 + i * fps * 1.3;

  // overload state once window is full
  const overload = interpolate(frame, [fps * 11.2, fps * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = overload * Math.sin(frame / 1.6) * 5;

  const fillPct = interpolate(frame, [fps * 2.6, fps * 11.2], [8, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barColor = fillPct < 60 ? theme.accentGreen : fillPct < 88 ? theme.accentWarm : theme.accentRed;

  const subtitleOpacity = interpolate(frame, [fps * 12.4, fps * 13.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 100, transform: `translateX(${shake}px)` }}>
        {/* Main agent core */}
        <div style={{ opacity: coreOpacity, transform: `scale(${interpolate(coreSpring, [0, 1], [0.8, 1])})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <ModelCore size={252} pulse={pulse} fontSize={40} />
          <div style={{ fontFamily: theme.fontSans, fontSize: 30, color: theme.textMuted }}>your agent</div>
        </div>

        {/* Context window panel */}
        <div style={{
          opacity: panelOpacity, transform: `scale(${interpolate(panelSpring, [0, 1], [0.8, 1])})`,
          width: 672, height: 576, borderRadius: 26,
          background: "linear-gradient(180deg, #14141b 0%, #0c0c11 100%)",
          border: `1px solid ${overload > 0.3 ? theme.accentRed : theme.border}`,
          boxShadow: overload > 0.3 ? `0 0 ${30 + overload * 50}px ${theme.accentRed}55` : "0 30px 90px rgba(0,0,0,0.6)",
          padding: 28, display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted, letterSpacing: 1 }}>
            <span>CONTEXT WINDOW</span>
            <span style={{ color: barColor }}>{Math.round(fillPct)}%</span>
          </div>
          <div style={{ width: "100%", height: 10, borderRadius: 5, background: theme.surface, overflow: "hidden" }}>
            <div style={{ width: `${fillPct}%`, height: "100%", background: barColor, boxShadow: `0 0 14px ${barColor}` }} />
          </div>

          {/* noise chips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            {NOISE.map((n, i) => {
              const start = chipStart(i);
              const s = pop(frame, fps, start, { damping: 11 });
              const op = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
              return (
                <div key={n.label} style={{
                  opacity: op, transform: `translateY(${(1 - s) * -18}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                  padding: "16px 22px", borderRadius: 14,
                  background: `${n.color}14`, border: `1px solid ${n.color}55`,
                  fontFamily: theme.fontMono, fontSize: 26, color: n.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{n.label}</div>
              );
            })}
          </div>

          {/* overloaded flash */}
          <div style={{
            position: "absolute", bottom: 24, left: 0, width: "100%", textAlign: "center",
            opacity: overload, fontFamily: theme.fontMono, fontSize: 32, fontWeight: 800, color: theme.accentRed, letterSpacing: 3,
          }}>
            ⚠ OVERLOADED
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 120, width: "100%", textAlign: "center", opacity: subtitleOpacity,
        fontFamily: theme.fontSans, fontSize: 49, color: theme.text,
      }}>
        One brain. <span style={{ ...gradientText("#fca5a5", theme.accentRed), fontWeight: 800 }}>Too much noise.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
