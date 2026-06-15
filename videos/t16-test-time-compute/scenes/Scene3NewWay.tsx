import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 3 — The new way
// Question in → the model fills a "thinking" scratchpad with reasoning steps,
// one by one → THEN emits the final answer. Thinking first, answer second.

const STEPS = [
  "Let the ball cost x.",
  "Then the bat costs x + $1.00.",
  "Together: x + (x + 1) = 1.10",
  "2x = 0.10  →  x = 0.05",
];

export const Scene3NewWay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // model + scratchpad frame appear (1.2s)
  const stageOpacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // reasoning steps type in one by one, starting 2.5s, ~1.6s apart
  const stepStart = (i: number) => fps * (2.5 + i * 1.6);

  // thinking shimmer active while steps are filling
  const lastStepDone = stepStart(STEPS.length - 1) + fps * 1.2;
  const thinking = frame > fps * 2.3 && frame < lastStepDone;

  // final answer emits after all steps (≈9s), holds
  const ansStart = lastStepDone + fps * 0.4;
  const ansReveal = interpolate(frame, [ansStart, ansStart + fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ansSpring = spring({ frame: frame - ansStart, fps, config: { damping: 12 } });

  // closing line — holds fully visible to scene end (22s)
  const lineOpacity = interpolate(frame, [ansStart + fps * 1.3, ansStart + fps * 2.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <SceneHeading kicker="the new way" accent={theme.accent}>
        First it <span style={gradientText("#c7d2fe", theme.accent)}>thinks out loud</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 210, left: 0, right: 0, bottom: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 84, opacity: stageOpacity }}>

        {/* Model with thinking shimmer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 17, position: "relative" }}>
          {thinking && (
            <div style={{
              position: "absolute", top: -26, left: "50%", transform: `translateX(-50%) rotate(${frame * 1.6}deg)`,
              width: 240, height: 240, borderRadius: "50%",
              border: `2px dashed ${theme.accent}`, opacity: 0.35 + 0.35 * Math.sin(frame / 5),
            }} />
          )}
          <ModelCore size={187} label="MODEL" pulse={thinking ? pulse : pulse * 0.4} fontSize={32} />
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: thinking ? theme.accent : theme.textDim, letterSpacing: 2 }}>
            {thinking ? "thinking…" : "MODEL"}
          </div>
        </div>

        {/* Scratchpad */}
        <div style={{
          width: 912, minHeight: 432, borderRadius: 22, padding: "29px 34px",
          background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
          border: `1px solid ${theme.accent}44`,
          boxShadow: `0 22px 60px rgba(0,0,0,0.5), inset 0 0 40px ${theme.accent}0c`,
          display: "flex", flexDirection: "column", gap: 17,
        }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 3, color: theme.accent, marginBottom: 8 }}>
            ⟢ REASONING SCRATCHPAD
          </div>

          {STEPS.map((s, i) => {
            const start = stepStart(i);
            const o = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const x = interpolate(frame, [start, start + fps * 0.5], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ opacity: o, transform: `translateX(${x}px)`, display: "flex", alignItems: "baseline", gap: 14 }}>
                <span style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.tokenColors[i % theme.tokenColors.length], fontWeight: 700 }}>
                  {i + 1}.
                </span>
                <span style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.text }}>{s}</span>
              </div>
            );
          })}

          {/* final answer */}
          <div style={{
            marginTop: "auto", opacity: ansReveal, transform: `scale(${0.85 + ansSpring * 0.15})`,
            display: "flex", alignItems: "center", gap: 17, alignSelf: "flex-start",
            padding: "15px 27px", borderRadius: 14,
            background: `${theme.accentGreen}1a`, border: `1px solid ${theme.accentGreen}`,
            boxShadow: `0 0 ${ansReveal * 43}px ${theme.accentGreen}55`,
          }}>
            <span style={{ fontSize: 32, color: theme.accentGreen, fontWeight: 800 }}>✓</span>
            <span style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.textMuted }}>final answer:</span>
            <span style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.accentGreen, fontWeight: 700 }}>5 cents</span>
          </div>
        </div>
      </div>

      {/* closing line */}
      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center", opacity: lineOpacity,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        Thinking happens <span style={{ color: theme.accent, fontWeight: 700 }}>first.</span> The answer comes{" "}
        <span style={{ color: theme.accentGreen, fontWeight: 700 }}>second.</span>
      </div>
    </AbsoluteFill>
  );
};
