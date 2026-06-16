import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, EASE_OUT, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 2 — The problem [0:13-0:26]
// The fixed window fills with junk; the GOAL line sinks and gets buried under
// the noise stack. "The actual goal gets buried under junk."

const JUNK = [
  { label: "tool log · 412 lines", color: theme.tokenColors[1] },
  { label: "file read · 2,140 lines", color: theme.tokenColors[4] },
  { label: "web search · 38 results", color: theme.tokenColors[3] },
  { label: "grep · 126 matches", color: theme.tokenColors[5] },
  { label: "diff · 980 lines", color: theme.tokenColors[2] },
];

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelOpacity = interpolate(frame, [fps * 0.6, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelPop = pop(frame, fps, fps * 0.6, { damping: 12 });

  // GOAL pill enters at top, then sinks down as junk stacks above it
  const goalIn = pop(frame, fps, fps * 1.4, { damping: 11 });
  const sink = interpolate(frame, [fps * 3, fps * 11.5], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const goalDim = interpolate(frame, [fps * 4.5, fps * 11], [1, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // junk blocks drop from the top, stacking over the goal
  const junkStart = (i: number) => fps * 3 + i * fps * 1.3;

  const capFill = interpolate(frame, [fps * 3, fps * 11.5], [12, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const capColor = capFill < 60 ? theme.accentGreen : capFill < 90 ? theme.accentWarm : theme.accentRed;

  const lineOpacity = interpolate(frame, [fps * 12, fps * 13.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 12, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentRed} />

      <SceneHeading kicker="the problem" accent={theme.accentRed}>
        The goal gets <span style={gradientText("#fca5a5", theme.accentRed)}>buried</span>
      </SceneHeading>

      <CameraRig>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 72 }}>
        {/* fixed window panel */}
        <div style={{
          opacity: panelOpacity, transform: `scale(${interpolate(panelPop, [0, 1], [0.85, 1])})`, width: 744, height: 648, borderRadius: 26,
          background: "linear-gradient(180deg, #14141b 0%, #0c0c11 100%)",
          border: `1px solid ${theme.border}`, boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
          padding: 28, position: "relative", overflow: "hidden",
        }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted, letterSpacing: 1, marginBottom: 18 }}>
            FIXED CONTEXT WINDOW — can't grow
          </div>

          {/* junk stack (top) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {JUNK.map((j, i) => {
              const start = junkStart(i);
              const s = pop(frame, fps, start, { damping: 11 });
              const op = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={j.label} style={{
                  opacity: op, transform: `translateY(${(1 - s) * -29}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                  padding: "18px 24px", borderRadius: 14,
                  background: `${j.color}14`, border: `1px solid ${j.color}44`,
                  fontFamily: theme.fontMono, fontSize: 26, color: j.color,
                }}>{j.label}</div>
              );
            })}
          </div>

          {/* GOAL pill — sinks under the junk */}
          <div style={{
            position: "absolute", left: 26, right: 26, top: 78 + sink,
            opacity: goalIn * goalDim, transform: `scale(${0.9 + goalIn * 0.1})`,
            padding: "22px 27px", borderRadius: 16,
            background: `${theme.accentGreen}1f`, border: `2px solid ${theme.accentGreen}`,
            boxShadow: `0 0 24px ${theme.accentGreen}55`,
            fontFamily: theme.fontMono, fontSize: 30, fontWeight: 800, color: theme.accentGreen, letterSpacing: 1,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            🎯 GOAL: ship the fix
          </div>
        </div>

        {/* capacity gauge */}
        <div style={{ opacity: panelOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>capacity</div>
          <div style={{ width: 32, height: 432, borderRadius: 16, background: theme.surface, border: `1px solid ${theme.border}`, overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
            <div style={{ width: "100%", height: `${capFill}%`, background: capColor, boxShadow: `0 0 20px ${capColor}` }} />
          </div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 30, fontWeight: 800, color: capColor }}>{Math.round(capFill)}%</div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 90, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 43, color: theme.text,
      }}>
        Noise floods the window — and the agent <span style={{ color: theme.accentRed, fontWeight: 700 }}>loses the thread.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
