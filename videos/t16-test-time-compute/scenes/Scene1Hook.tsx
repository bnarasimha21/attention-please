import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 1 — Hook
// Same hard question to two model cores. Model A blurts an INSTANT wrong answer
// (red ✕). Model B pauses, shows a thinking shimmer, then a RIGHT answer (green ✓).
// "What changed? It took the time to think."

const QUESTION = "If a bat and ball cost $1.10, and the bat costs $1 more than the ball… how much is the ball?";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // Question card drops in (0.4s-1.4s), holds to end
  const qSpring = spring({ frame: frame - fps * 0.4, fps, config: { damping: 18 } });
  const qOpacity = interpolate(frame, [fps * 0.4, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Both cores appear (1.8s-2.8s)
  const coreOpacity = interpolate(frame, [fps * 1.8, fps * 2.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Model A blurts INSTANTLY (3.2s) — wrong answer in red, holds
  const aReveal = interpolate(frame, [fps * 3.2, fps * 3.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aSpring = spring({ frame: frame - fps * 3.2, fps, config: { damping: 12 } });

  // Model B THINKS — reasoning dots from 3.4s..9.5s (long, readable), then resolves green at 9.5s
  const thinking = frame > fps * 3.4 && frame < fps * 9.5;
  const dotCount = 3;
  const bReveal = interpolate(frame, [fps * 9.5, fps * 10.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bSpring = spring({ frame: frame - fps * 9.5, fps, config: { damping: 12 } });

  // closing line (12s+) — holds fully visible to scene end (20s)
  const lineOpacity = interpolate(frame, [fps * 12, fps * 13.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 12, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      {/* Question card */}
      <div style={{
        position: "absolute", top: 96, left: "50%",
        transform: `translateX(-50%) translateY(${(1 - qSpring) * -29}px)`,
        opacity: qOpacity, width: 1200, padding: "26px 41px", borderRadius: 19,
        background: "linear-gradient(160deg, #17171f 0%, #0e0e13 100%)",
        border: `1px solid ${theme.border}`, textAlign: "center",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}>
        <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 4, color: theme.accent, marginBottom: 12 }}>
          SAME HARD QUESTION
        </div>
        <div style={{ fontFamily: theme.fontSans, fontSize: 35, color: theme.text, lineHeight: 1.4 }}>
          {QUESTION}
        </div>
      </div>

      {/* Two models */}
      <div style={{ position: "absolute", top: 360, left: 0, right: 0, bottom: 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 240 }}>

        {/* Model A — blurts instantly, WRONG */}
        <div style={{ opacity: coreOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, position: "relative" }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.textMuted, letterSpacing: 2 }}>MODEL A</div>
          <ModelCore size={204} label="MODEL" pulse={pulse * 0.5} fontSize={35} />
          <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textDim }}>answers instantly</div>
          {/* wrong answer chip */}
          <div style={{
            opacity: aReveal, transform: `scale(${0.7 + aSpring * 0.3})`,
            padding: "17px 31px", borderRadius: 14,
            background: `${theme.accentRed}1a`, border: `1px solid ${theme.accentRed}`,
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: `0 0 ${aReveal * 43}px ${theme.accentRed}55`,
          }}>
            <span style={{ fontSize: 35, color: theme.accentRed, fontWeight: 800 }}>✕</span>
            <span style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.accentRed }}>"10 cents"</span>
          </div>
        </div>

        {/* Model B — thinks, then RIGHT */}
        <div style={{ opacity: coreOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, position: "relative" }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.accent, letterSpacing: 2 }}>MODEL B</div>
          <div style={{ position: "relative" }}>
            {/* thinking shimmer ring */}
            {thinking && (
              <div style={{
                position: "absolute", inset: -26, borderRadius: "50%",
                border: `2px dashed ${theme.accent}`,
                opacity: 0.4 + 0.4 * Math.sin(frame / 5),
                transform: `rotate(${(frame - fps * 3.4) * 2}deg)`,
              }} />
            )}
            <ModelCore size={204} label="MODEL" pulse={thinking ? pulse : pulse * 0.5} fontSize={35} />
          </div>
          {/* thinking dots OR answer */}
          {thinking ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.accent }}>thinking…</div>
              <div style={{ display: "flex", gap: 10 }}>
                {Array.from({ length: dotCount }).map((_, i) => {
                  const o = 0.3 + 0.7 * Math.max(0, Math.sin(frame / 6 - i * 0.8));
                  return <div key={i} style={{ width: 15, height: 15, borderRadius: 8, background: theme.accent, opacity: o, boxShadow: `0 0 12px ${theme.accent}` }} />;
                })}
              </div>
            </div>
          ) : (
            <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textDim, opacity: bReveal }}>thinks first</div>
          )}
          {/* right answer chip */}
          <div style={{
            opacity: bReveal, transform: `scale(${0.7 + bSpring * 0.3})`,
            padding: "17px 31px", borderRadius: 14,
            background: `${theme.accentGreen}1a`, border: `1px solid ${theme.accentGreen}`,
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: `0 0 ${bReveal * 48}px ${theme.accentGreen}66`,
            position: thinking ? "absolute" : "relative",
          }}>
            <span style={{ fontSize: 35, color: theme.accentGreen, fontWeight: 800 }}>✓</span>
            <span style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.accentGreen }}>"5 cents"</span>
          </div>
        </div>
      </div>

      {/* Closing line */}
      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 24}px)`,
        fontFamily: theme.fontSans, fontSize: 46, color: theme.text,
      }}>
        Same model. The difference? Time to{" "}
        <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 800 }}>think.</span>
      </div>
    </AbsoluteFill>
  );
};
