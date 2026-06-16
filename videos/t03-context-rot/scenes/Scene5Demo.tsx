import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 5 — The demo [1:03-1:20]
// An instruction given early ("always reply in French") gets buried under 50
// messages, fades, and the model breaks it 50 messages later (answers English).

export const Scene5Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The pinned instruction appears first (0.6s), bright + glowing.
  // It stays fully readable for ~4s before the pile starts burying it.
  const ruleOpacity = interpolate(frame, [fps * 0.6, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ruleSpring = spring({ frame: frame - fps * 0.6, fps, config: { damping: 15 } });

  // messages pile ON TOP of it (5s..10s), burying it → it fades
  const pileT = interpolate(frame, [fps * 5, fps * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const buryFade = interpolate(pileT, [0.3, 1], [1, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ruleBlur = interpolate(pileT, [0.3, 1], [0, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const NMSG = 7;
  const msgVisible = Math.floor(pileT * NMSG);

  // The user question + broken reply (13s+)
  const qOpacity = interpolate(frame, [fps * 12, fps * 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const replyOpacity = interpolate(frame, [fps * 14.5, fps * 15.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const replySpring = pop(frame, fps, fps * 14.5, { damping: 11 });

  const lineOpacity = interpolate(frame, [fps * 17, fps * 18.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentRed} />

      <SceneHeading kicker="watch it break" accent={theme.accentRed}>
        The rule it <span style={gradientText("#fca5a5", theme.accentRed)}>forgot</span>
      </SceneHeading>

      <CameraRig style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 72 }}>

        {/* Left: the thread with buried instruction */}
        <div style={{ width: 760, position: "relative", height: 620 }}>
          {/* pinned instruction at top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            opacity: ruleOpacity * buryFade, filter: `blur(${ruleBlur}px)`,
            transform: `translateY(${(1 - ruleSpring) * -12}px)`,
            padding: "22px 30px", borderRadius: 20,
            background: `linear-gradient(160deg, ${theme.accentWarm}28, ${theme.accentWarm}10)`,
            border: `1px solid ${theme.accentWarm}88`,
            boxShadow: `0 0 ${30 * buryFade}px ${theme.accentWarm}55`,
            zIndex: 1,
          }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 19, color: theme.accentWarm, letterSpacing: 2, marginBottom: 8 }}>
              📌 MESSAGE #1 · INSTRUCTION
            </div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 35, fontWeight: 700, color: theme.text }}>
              "Always reply in French."
            </div>
          </div>

          {/* pile of messages burying it */}
          {Array.from({ length: NMSG }).map((_, i) => {
            if (i >= msgVisible) return null;
            const isAI = i % 2 === 1;
            const top = 116 + i * 66;
            const mp = pop(frame, fps, fps * 5 + (i / NMSG) * fps * 5, { damping: 11 });
            return (
              <div key={i} style={{
                position: "absolute", top, left: isAI ? 0 : 140, right: isAI ? 140 : 0,
                height: 52, borderRadius: 14,
                background: isAI ? "linear-gradient(160deg,#1b1b26,#13131b)" : "linear-gradient(160deg,#222230,#191923)",
                border: `1px solid ${theme.border}`, zIndex: 2 + i,
                display: "flex", alignItems: "center", paddingLeft: 20,
                fontFamily: theme.fontSans, fontSize: 22, color: theme.textDim,
                boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
                opacity: mp, transform: `translateY(${(1 - mp) * 14}px) scale(${0.85 + mp * 0.15})`,
                transformOrigin: isAI ? "left center" : "right center",
              }}>
                {isAI ? "…sure, here's that…" : "…and another thing…"}
              </div>
            );
          })}

          {/* counter chip */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            opacity: pileT, fontFamily: theme.fontMono, fontSize: 24, color: theme.accentRed, letterSpacing: 1,
          }}>
            …50 messages later, the rule is buried ↑
          </div>
        </div>

        {/* Right: the failing exchange */}
        <div style={{ width: 680, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{
            opacity: qOpacity, alignSelf: "flex-end", maxWidth: 560,
            padding: "20px 28px", borderRadius: 22, borderTopRightRadius: 8,
            background: "linear-gradient(160deg,#232331,#1a1a24)", border: `1px solid ${theme.border}`,
            fontFamily: theme.fontSans, fontSize: 31, color: theme.textMuted,
          }}>
            What time is the meeting?
          </div>
          <div style={{
            opacity: replyOpacity, alignSelf: "flex-start", maxWidth: 580,
            transform: `translateY(${(1 - replySpring) * 16}px) scale(${0.85 + replySpring * 0.15})`,
            transformOrigin: "left center",
            padding: "24px 30px", borderRadius: 22, borderTopLeftRadius: 8,
            background: `linear-gradient(160deg, ${theme.accentRed}22, ${theme.accentRed}0d)`,
            border: `1px solid ${theme.accentRed}88`, boxShadow: `0 0 30px ${theme.accentRed}33`,
            fontFamily: theme.fontSans, fontSize: 32, color: theme.text,
          }}>
            <span style={{ fontFamily: theme.fontMono, fontSize: 18, color: theme.accentRed, letterSpacing: 1, marginRight: 8 }}>AI</span>
            "The meeting is at 3 PM."
            <div style={{ marginTop: 14, fontFamily: theme.fontMono, fontSize: 22, color: theme.accentRed }}>
              ✗ English — not French
            </div>
          </div>
        </div>
      </CameraRig>

      <div style={{ position: "absolute", bottom: 56, width: "100%", textAlign: "center", opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 41, color: theme.text }}>
        It didn't disobey — it just couldn't{" "}
        <span style={{ ...gradientText("#fca5a5", theme.accentRed), fontWeight: 800 }}>see the rule anymore.</span>
      </div>
    </AbsoluteFill>
  );
};
