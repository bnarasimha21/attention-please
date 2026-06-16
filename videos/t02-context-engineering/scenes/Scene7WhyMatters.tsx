import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 7 — Why it matters [1:26-1:38]
// A balance scale. Left pan: STRONG model + BAD context. Right pan: WEAK model
// + GREAT context. The scale tips toward the right — weak+great wins.
// "The model is the engine. Context is the fuel — and the map."

const Pan: React.FC<{
  title: string; titleColor: string; model: string; modelGood: boolean;
  ctx: string; ctxGood: boolean; offsetY: number; opacity: number; popS?: number;
}> = ({ title, titleColor, model, modelGood, ctx, ctxGood, offsetY, opacity, popS = 1 }) => (
  <div style={{
    opacity, transform: `translateY(${offsetY}px) scale(${0.8 + popS * 0.2})`,
    display: "flex", flexDirection: "column", alignItems: "center", gap: 17,
    width: 432,
  }}>
    <div style={{ fontFamily: theme.fontMono, fontSize: 27, letterSpacing: 1, color: titleColor }}>{title}</div>
    <div style={{
      width: 384, borderRadius: 19, padding: "22px 24px",
      background: "linear-gradient(180deg, #131318, #0b0b0f)",
      border: `1px solid ${theme.border}`, boxShadow: "0 16px 50px rgba(0,0,0,0.4)",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{
        padding: "14px 19px", borderRadius: 12,
        background: `${modelGood ? theme.accent : "#4b4b52"}22`,
        border: `1px solid ${modelGood ? theme.accent : "#4b4b52"}`,
        fontFamily: theme.fontMono, fontSize: 26, color: modelGood ? theme.accent : theme.textMuted,
      }}>🧠 model: {model}</div>
      <div style={{
        padding: "14px 19px", borderRadius: 12,
        background: `${ctxGood ? theme.accentGreen : theme.accentRed}1c`,
        border: `1px solid ${ctxGood ? theme.accentGreen : theme.accentRed}`,
        fontFamily: theme.fontMono, fontSize: 26, color: ctxGood ? theme.accentGreen : theme.accentRed,
      }}>📦 context: {ctx}</div>
    </div>
  </div>
);

export const Scene7WhyMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftPop = pop(frame, fps, fps * 1.5, { damping: 12 });
  const rightPop = pop(frame, fps, fps * 3, { damping: 12 });

  // scale tips toward the right (down) at 5.5s
  const tip = interpolate(frame, [fps * 5.5, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: undefined });
  const tipAngle = tip * 7; // degrees
  const leftY = -tip * 34;
  const rightY = tip * 34;

  const winS = pop(frame, fps, fps * 7.2, { damping: 11 });
  const winOpacity = interpolate(frame, [fps * 7.2, fps * 8.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 10.5, fps * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 10.5, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <CameraRig>
      <SceneHeading kicker="the takeaway" accent={theme.accentWarm}>
        Why context{" "}
        <span style={gradientText("#fbbf24", theme.accentWarm)}>wins</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1080, height: 456, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          {/* beam */}
          <div style={{
            position: "absolute", left: "50%", top: 43, width: 912, height: 7, borderRadius: 4,
            background: `linear-gradient(90deg, ${theme.textDim}, ${theme.textMuted}, ${theme.textDim})`,
            transform: `translateX(-50%) rotate(${tipAngle}deg)`, transformOrigin: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }} />
          {/* fulcrum */}
          <div style={{
            position: "absolute", left: "50%", top: 36, transform: "translateX(-50%)",
            width: 0, height: 0, borderLeft: "19px solid transparent", borderRight: "19px solid transparent",
            borderBottom: `48px solid ${theme.textDim}`,
          }} />

          <Pan title="STRONG MODEL" titleColor={theme.accent} model="best in class" modelGood={true}
            ctx="bad" ctxGood={false} offsetY={leftY + 84} opacity={leftOpacity} popS={leftPop} />

          {/* winner highlight on right */}
          <div style={{ position: "relative" }}>
            <Pan title="WEAK MODEL" titleColor={theme.textMuted} model="weaker" modelGood={false}
              ctx="great" ctxGood={true} offsetY={rightY + 84} opacity={rightOpacity} popS={rightPop} />
            <div style={{
              position: "absolute", top: rightY + 22, left: "50%",
              transform: `translateX(-50%) scale(${0.8 + winS * 0.2})`, opacity: winOpacity,
              background: theme.accentGreen, color: theme.bg,
              fontFamily: theme.fontMono, fontSize: 24, fontWeight: 800, letterSpacing: 1,
              padding: "8px 19px", borderRadius: 24, boxShadow: `0 0 22px ${theme.accentGreen}aa`,
            }}>
              ✓ WINS
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 84, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        The model is the <span style={{ color: theme.textMuted }}>engine.</span> Context is the{" "}
        <span style={{ ...gradientText("#fbbf24", theme.accentWarm), fontWeight: 800 }}>fuel — and the map.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
