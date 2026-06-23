import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, staticFile, Img } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 9 — Like & Subscribe CTA
// Channel icon springs in → wordmark → an animated cursor taps the LIKE button
// (fills + sparks), then the SUBSCRIBE button (turns to "Subscribed ✓" + bell
// rings). Closes with "See you in the next one."

// short press "dip" around frame t
const pressDip = (frame: number, t: number) =>
  interpolate(frame, [t - 4, t, t + 6], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Scene9CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // icon + brand
  const iconSpring = pop(frame, fps, fps * 0.4, { damping: 10 });
  const iconGlow = 0.5 + 0.5 * Math.sin(frame / 9);
  const brandT = interpolate(frame, [fps * 1.3, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headlineT = interpolate(frame, [fps * 2.6, fps * 3.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // buttons appear
  const likeIn = pop(frame, fps, fps * 3.6, { damping: 11 });
  const subIn = pop(frame, fps, fps * 4.1, { damping: 11 });

  // click moments
  const likeClick = fps * 6.0;
  const subClick = fps * 8.6;
  const likePressed = frame > likeClick;
  const subPressed = frame > subClick;
  const likeFill = interpolate(frame, [likeClick - 2, likeClick + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subFill = interpolate(frame, [subClick - 2, subClick + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // animated cursor: enters → like → subscribe
  const cx = interpolate(frame, [fps * 4.4, fps * 5.9, fps * 7.2, fps * 8.5], [1340, 720, 720, 1135], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(frame, [fps * 4.4, fps * 5.9, fps * 7.2, fps * 8.5], [980, 712, 712, 712], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorClickDip = Math.max(pressDip(frame, likeClick), pressDip(frame, subClick));

  // bell ring wiggle after subscribe
  const bellWiggle = subPressed ? Math.sin((frame - subClick) / 1.6) * interpolate(frame, [subClick, subClick + fps * 1.4], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // sparks on like
  const sparks = Array.from({ length: 8 });
  const sparkT = interpolate(frame, [likeClick, likeClick + fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const closeT = interpolate(frame, [fps * 10.2, fps * 11.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const likeDip = pressDip(frame, likeClick);
  const subDip = pressDip(frame, subClick);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <CameraRig intensity={0.5} push={0.02} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Channel icon */}
      <div style={{
        position: "absolute", top: 150,
        transform: `scale(${0.6 + iconSpring * 0.4})`,
      }}>
        <div style={{
          width: 180, height: 180, borderRadius: 40, overflow: "hidden",
          boxShadow: `0 0 ${50 + iconGlow * 60}px ${theme.accentWarm}aa, 0 24px 70px rgba(0,0,0,0.6)`,
        }}>
          <Img src={staticFile("icon.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Wordmark */}
      <div style={{ position: "absolute", top: 360, textAlign: "center", opacity: brandT, transform: `translateY(${(1 - brandT) * 18}px)` }}>
        <div style={{ fontFamily: theme.fontSans, fontSize: 64, fontWeight: 800, color: theme.text, letterSpacing: 2 }}>
          Attention<span style={gradientText("#fbbf24", theme.accentWarm)}> Please</span>
        </div>
        <div style={{ fontFamily: theme.fontSans, fontSize: 26, color: theme.textMuted, marginTop: 8 }}>
          AI concepts, animated clearly
        </div>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: 510, textAlign: "center", opacity: headlineT, transform: `translateY(${(1 - headlineT) * 16}px)`, fontFamily: theme.fontSans, fontSize: 40, fontWeight: 700, color: theme.text }}>
        If this made something click —
      </div>

      {/* Buttons */}
      <div style={{ position: "absolute", top: 650, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        {/* LIKE */}
        <div style={{
          position: "relative",
          opacity: likeIn,
          transform: `translateY(${(1 - likeIn) * 30}px) scale(${1 - likeDip * 0.08})`,
          display: "flex", alignItems: "center", gap: 18,
          padding: "22px 40px", borderRadius: 999,
          background: likePressed
            ? `linear-gradient(160deg, ${theme.accent}, #4338ca)`
            : "linear-gradient(160deg, #17171f 0%, #0e0e13 100%)",
          border: `2px solid ${likePressed ? theme.accent : theme.border}`,
          boxShadow: likePressed ? `0 0 ${likeFill * 45}px ${theme.accent}aa` : "0 12px 34px rgba(0,0,0,0.5)",
        }}>
          <span style={{ fontSize: 46, transform: `rotate(${-likeFill * 8}deg)`, display: "inline-block" }}>👍</span>
          <span style={{ fontFamily: theme.fontSans, fontSize: 38, fontWeight: 800, color: theme.text }}>Like</span>
          {/* sparks */}
          {sparkT > 0 && sparkT < 1 && sparks.map((_, i) => {
            const ang = (i / sparks.length) * Math.PI * 2;
            const d = sparkT * 70;
            return (
              <div key={i} style={{
                position: "absolute", left: 52, top: 30,
                width: 10, height: 10, borderRadius: 5, background: theme.accent,
                opacity: 1 - sparkT,
                transform: `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d}px)`,
              }} />
            );
          })}
        </div>

        {/* SUBSCRIBE */}
        <div style={{
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 30}px) scale(${1 - subDip * 0.08})`,
          display: "flex", alignItems: "center", gap: 16,
          padding: "22px 44px", borderRadius: 999,
          background: subPressed ? "linear-gradient(160deg, #2a2a32, #1a1a20)" : "linear-gradient(160deg, #ef4444, #b91c1c)",
          border: `2px solid ${subPressed ? theme.border : "#ef4444"}`,
          boxShadow: subPressed ? "0 12px 34px rgba(0,0,0,0.5)" : `0 0 ${30 + (0.5 + 0.5 * Math.sin(frame / 7)) * 35}px #ef4444aa`,
        }}>
          <span style={{ fontSize: 40, display: "inline-block", transform: `rotate(${bellWiggle}deg)`, transformOrigin: "top center" }}>🔔</span>
          <span style={{ fontFamily: theme.fontSans, fontSize: 38, fontWeight: 800, color: theme.text }}>
            {subPressed ? "Subscribed" : "Subscribe"}
          </span>
          {subPressed && (
            <span style={{ fontSize: 34, color: theme.accentGreen, opacity: subFill }}>✓</span>
          )}
        </div>
      </div>

      {/* Cursor */}
      <div style={{
        position: "absolute", left: cx, top: cy,
        transform: `scale(${1 - cursorClickDip * 0.25})`,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
        zIndex: 30,
      }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path d="M4 2 L4 19 L9 14.5 L12.5 22 L15.5 20.5 L12 13.5 L18.5 13 Z" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
        {/* click ripple */}
        {cursorClickDip > 0.2 && (
          <div style={{
            position: "absolute", left: -10, top: -10, width: 40, height: 40, borderRadius: 20,
            border: `2px solid ${theme.accentWarm}`, opacity: cursorClickDip,
            transform: `scale(${1 + (1 - cursorClickDip) * 1.5})`,
          }} />
        )}
      </div>

      {/* Closing line */}
      <div style={{
        position: "absolute", bottom: 90, width: "100%", textAlign: "center",
        opacity: closeT, transform: `translateY(${(1 - closeT) * 14}px)`,
        fontFamily: theme.fontSans, fontSize: 34, color: theme.textMuted,
      }}>
        See you in the <span style={{ color: theme.accentWarm, fontWeight: 700 }}>next one.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
