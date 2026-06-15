import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, EASE_OUT } from "../../../remotion-src/visuals";

// Scene 4 — How it works [0:39-0:57] — THE KEY SCENE
// Main delegates a messy task → subagent does all the noisy work in its OWN
// isolated window → returns ONLY the clean answer. Noise stays contained on the
// subagent's side; the main thread stays pristine.

const SUB_NOISE = [
  { label: "read · 2,140 lines", color: theme.tokenColors[4] },
  { label: "search · 38 hits", color: theme.tokenColors[3] },
  { label: "test log · 412 lines", color: theme.tokenColors[1] },
  { label: "diff · 980 lines", color: theme.tokenColors[5] },
];

const Panel: React.FC<{
  title: string; titleColor: string; borderColor: string; children?: React.ReactNode;
}> = ({ title, titleColor, borderColor, children }) => (
  <div style={{
    width: 576, height: 552, borderRadius: 26,
    background: "linear-gradient(180deg, #14141b 0%, #0c0c11 100%)",
    border: `1px solid ${borderColor}`, boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
    padding: 26, position: "relative", overflow: "hidden",
  }}>
    <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: titleColor, letterSpacing: 1, marginBottom: 19 }}>{title}</div>
    {children}
  </div>
);

export const Scene4HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const stageOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 1) task crosses LEFT → RIGHT (2s-4s)
  const taskTravel = interpolate(frame, [fps * 2, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const taskOpacity = interpolate(frame, [fps * 2, fps * 2.6, fps * 3.6, fps * 4.1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taskX = interpolate(taskTravel, [0, 1], [-432, 432]);

  // 2) subagent noise fills its window (4.4s-12s), contained on the right
  const noiseStart = (i: number) => fps * 4.4 + i * fps * 1.3;

  // 3) clean answer pill crosses RIGHT → LEFT (13s-15s)
  const ansTravel = interpolate(frame, [fps * 13, fps * 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const ansOpacity = interpolate(frame, [fps * 13, fps * 13.6, fps * 14.8, fps * 15.5], [0, 1, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ansX = interpolate(ansTravel, [0, 1], [432, -432]);

  // 4) main window stamps "still clean" once answer lands
  const cleanStamp = interpolate(frame, [fps * 15.5, fps * 16.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 17, fps * 18.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 17, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <SceneHeading kicker="how it works" accent={theme.accent}>
        The noise stays <span style={gradientText("#c7d2fe", theme.accent)}>contained</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 30, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 84, opacity: stageOpacity }}>

        {/* LEFT — main agent, pristine window */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <ModelCore size={144} pulse={pulse} fontSize={27} label="MAIN" />
          <Panel title="MAIN THREAD" titleColor={theme.accent} borderColor={cleanStamp > 0.3 ? theme.accentGreen : theme.border}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 384, gap: 19, color: theme.textDim }}>
              <div style={{ fontSize: 49, opacity: 0.4 }}>✦</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>never saw the junk</div>
              {/* clean answer lands here */}
              <div style={{
                opacity: cleanStamp, transform: `scale(${0.8 + cleanStamp * 0.2})`, marginTop: 10,
                padding: "16px 24px", borderRadius: 14,
                background: `${theme.accentGreen}1f`, border: `1px solid ${theme.accentGreen}`,
                fontFamily: theme.fontMono, fontSize: 24, color: theme.accentGreen, fontWeight: 700,
              }}>✓ answer received · still clean</div>
            </div>
          </Panel>
        </div>

        {/* isolation divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 2, height: 456, background: `repeating-linear-gradient(${theme.border} 0 8px, transparent 8px 16px)` }} />
        </div>

        {/* RIGHT — subagent, noisy isolated window */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ filter: "hue-rotate(80deg) saturate(1.2)" }}>
            <ModelCore size={144} pulse={pulse} fontSize={27} label="SUB" />
          </div>
          <Panel title="SUBAGENT — ISOLATED" titleColor={theme.accentGreen} borderColor={`${theme.accentGreen}66`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SUB_NOISE.map((n, i) => {
                const start = noiseStart(i);
                const s = spring({ frame: frame - start, fps, config: { damping: 13 } });
                const op = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={n.label} style={{
                    opacity: op, transform: `translateY(${(1 - s) * -18}px)`,
                    padding: "17px 22px", borderRadius: 14,
                    background: `${n.color}14`, border: `1px solid ${n.color}44`,
                    fontFamily: theme.fontMono, fontSize: 24, color: n.color,
                  }}>{n.label}</div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      {/* task pill: main → sub */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: `translate(calc(-50% + ${taskX}px), -50%)`,
        opacity: taskOpacity, padding: "16px 29px", borderRadius: 16,
        background: "linear-gradient(160deg, #1a1a22, #101015)", border: `1px solid ${theme.accentWarm}`,
        fontFamily: theme.fontMono, fontSize: 27, color: theme.accentWarm, whiteSpace: "nowrap", zIndex: 30,
        boxShadow: `0 8px 30px ${theme.accentWarm}55`,
      }}>→ "go investigate the bug"</div>

      {/* answer pill: sub → main */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: `translate(calc(-50% + ${ansX}px), -50%)`,
        opacity: ansOpacity, padding: "16px 29px", borderRadius: 16,
        background: `${theme.accentGreen}22`, border: `1px solid ${theme.accentGreen}`,
        fontFamily: theme.fontMono, fontSize: 27, color: theme.accentGreen, whiteSpace: "nowrap", zIndex: 30,
        boxShadow: `0 8px 30px ${theme.accentGreen}66`,
      }}>✓ "the fix is in line 42" ←</div>

      <div style={{
        position: "absolute", bottom: 70, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        All the mess stays on the subagent's side — only the{" "}
        <span style={{ color: theme.accentGreen, fontWeight: 700 }}>clean answer</span> crosses back.
      </div>
    </AbsoluteFill>
  );
};
