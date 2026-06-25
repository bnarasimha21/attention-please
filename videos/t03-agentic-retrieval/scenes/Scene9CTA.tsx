import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 9 - Like & Subscribe CTA (Distilled AI)
// Channel wordmark + handle spring in, then an animated cursor taps LIKE
// (fills + sparks) and SUBSCRIBE (turns to "Subscribed" + bell). Timeline is
// compressed to ~6.4s of action; the scene then holds. Closing line teases the
// next videos (generic - no specific topic promised).

const pressDip = (frame: number, t: number) =>
  interpolate(frame, [t - 4, t, t + 6], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Scene9CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // brand
  const brandT = interpolate(frame, [fps * 0.9, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headlineT = interpolate(frame, [fps * 1.8, fps * 2.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // buttons appear
  const likeIn = pop(frame, fps, fps * 2.4, { damping: 11 });
  const subIn = pop(frame, fps, fps * 2.8, { damping: 11 });

  // click moments (compressed)
  const likeClick = fps * 3.7;
  const subClick = fps * 5.1;
  const likePressed = frame > likeClick;
  const subPressed = frame > subClick;
  const likeFill = interpolate(frame, [likeClick - 2, likeClick + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subFill = interpolate(frame, [subClick - 2, subClick + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // animated cursor: enters, taps like, taps subscribe
  const cx = interpolate(frame, [fps * 2.6, fps * 3.6, fps * 4.4, fps * 5.0], [1340, 720, 720, 1135], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(frame, [fps * 2.6, fps * 3.6, fps * 4.4, fps * 5.0], [980, 712, 712, 712], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorClickDip = Math.max(pressDip(frame, likeClick), pressDip(frame, subClick));

  const bellWiggle = subPressed ? Math.sin((frame - subClick) / 1.6) * interpolate(frame, [subClick, subClick + fps * 1.4], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  const sparks = Array.from({ length: 8 });
  const sparkT = interpolate(frame, [likeClick, likeClick + fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const closeT = interpolate(frame, [fps * 5.8, fps * 6.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const likeDip = pressDip(frame, likeClick);
  const subDip = pressDip(frame, subClick);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />
      {/* SFX: pop on the Like tap, success when Subscribed, stinger to close */}
      <Sfx name="pop" at={likeClick} volume={0.4} />
      <Sfx name="success" at={subClick} volume={0.4} />
      <Sfx name="stinger" at={fps * 6.3} volume={0.4} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      {/* Wordmark + handle */}
      <div style={{ position: "absolute", top: 300, textAlign: "center", opacity: brandT, transform: `translateY(${(1 - brandT) * 18}px)` }}>
        <div style={{ fontFamily: theme.fontSans, fontSize: 76, fontWeight: 800, color: theme.text, letterSpacing: 1 }}>
          Distilled<span style={gradientText("#fbbf24", theme.accentWarm)}> AI</span>
        </div>
        <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.accentWarm, marginTop: 12, letterSpacing: 1 }}>
          @Distilled_AI_Studio
        </div>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: 470, textAlign: "center", opacity: headlineT, transform: `translateY(${(1 - headlineT) * 16}px)`, fontFamily: theme.fontSans, fontSize: 42, fontWeight: 700, color: theme.text }}>
        Found this useful?
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
        {cursorClickDip > 0.2 && (
          <div style={{
            position: "absolute", left: -10, top: -10, width: 40, height: 40, borderRadius: 20,
            border: `2px solid ${theme.accentWarm}`, opacity: cursorClickDip,
            transform: `scale(${1 + (1 - cursorClickDip) * 1.5})`,
          }} />
        )}
      </div>

      {/* Closing line - generic teaser */}
      <div style={{
        position: "absolute", bottom: 200, width: "100%", textAlign: "center",
        opacity: closeT, transform: `translateY(${(1 - closeT) * 14}px)`,
        fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted,
        padding: "0 200px", lineHeight: 1.4,
      }}>
        More deep dives on <span style={{ color: theme.accentWarm, fontWeight: 700 }}>building agents that actually work</span> - dropping soon.
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
