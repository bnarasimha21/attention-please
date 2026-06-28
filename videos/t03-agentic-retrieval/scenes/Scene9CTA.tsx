import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 9 — Recap + Like/Subscribe CTA (Distilled AI)
// First ~32s: a 5-row recap of the whole spine (Index → Retrieve → Agentic →
// JIT/Memory → Long-context) reveals one row per spoken beat with a green ✓ chip
// and an overshoot pop. After all rows are up, subtle staggered life keeps it
// breathing until ~f965, where the recap cross-fades OUT and the original CTA
// choreography cross-fades IN: wordmark + handle spring in, a cursor taps LIKE
// (fills + sparks) and SUBSCRIBE (→ "Subscribed" + bell), then a closing teaser.

const ci = (f: number, inp: number[], out: number[]) =>
  interpolate(f, inp, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const pressDip = (frame: number, t: number) =>
  ci(frame, [t - 4, t, t + 6], [0, 1, 0]);

// When the CTA choreography starts (recap runs before this).
const CTA_START = 955;

export const Scene9CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Cross-fade between recap and CTA (both ≤0.4 opacity mid-cross) ----
  // ~0.4s (12f) overlap centered around the handoff: recap out, CTA in.
  const recapOp = ci(frame, [CTA_START - 2, CTA_START + 12], [1, 0]);
  const ctaOp = ci(frame, [CTA_START - 2, CTA_START + 10], [0, 1]);

  // ================= RECAP SECTION (frames 0 → ~965) =================
  const titleT = ci(frame, [0, 18], [0, 1]);
  const titlePop = pop(frame, fps, 0, { damping: 13, stiffness: 150, mass: 0.9 });

  // Spoken beats (frames from scene start) for each row reveal.
  const rowBeats = [111, 287, 457, 653, 810];
  const rows = [
    { tag: "Index", text: "Contextual chunks carry their meaning", accent: theme.accent },
    { tag: "Retrieve", text: "Hybrid search + reranker, pull & sort the best", accent: theme.accent },
    { tag: "Agentic", text: "A real multi-step search loop", accent: theme.accentWarm },
    { tag: "Just-in-time", text: "Mid-task, plus memory the same way", accent: theme.accentWarm },
    { tag: "Long context", text: "Doesn't replace it, they team up", accent: theme.accentGreen },
  ];

  // Even vertical rhythm: 5 rows, equal gaps, all above y≈915.
  const rowTop0 = 318;
  const rowGap = 118;

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      {/* SFX */}
      {/* a pop per row reveal */}
      {rowBeats.map((b, i) => (
        <Sfx key={`rs${i}`} name="pop" at={b} volume={0.34} rate={1 + i * 0.05} />
      ))}
      {/* CTA cues, shifted to start at CTA_START */}
      <Sfx name="pop" at={CTA_START + fps * 3.7} volume={0.4} />
      <Sfx name="success" at={CTA_START + fps * 5.1} volume={0.4} />
      <Sfx name="stinger" at={CTA_START + fps * 6.3} volume={0.4} />

      {/* ===================== RECAP ===================== */}
      {recapOp > 0.001 && (
        <CameraRig style={{ opacity: recapOp }}>
          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: 150,
              width: "100%",
              textAlign: "center",
              opacity: titleT,
              transform: `translateY(${(1 - titleT) * 22}px) scale(${interpolate(titlePop, [0, 1], [0.86, 1])})`,
            }}
          >
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: theme.accentWarm, marginBottom: 16 }}>
              The whole picture
            </div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 64, fontWeight: 800, color: theme.text, letterSpacing: -0.5 }}>
              Quick <span style={gradientText("#fbbf24", theme.accentWarm)}>recap</span>
            </div>
          </div>

          {/* 5 rows */}
          {rows.map((row, i) => {
            const beat = rowBeats[i];
            // Overshoot entrance on the beat.
            const rp = pop(frame, fps, beat, { damping: 12, stiffness: 160, mass: 0.8 });
            const rIn = ci(frame, [beat, beat + 14], [0, 1]);
            const enterX = (1 - rp) * -46;
            const enterScale = interpolate(rp, [0, 1], [0.92, 1]);

            // After it's up: gentle continuous life — staggered pulse/drift until handoff.
            const settled = Math.max(0, frame - (beat + 16));
            const life = settled > 0 && frame < CTA_START ? 1 : 0;
            const driftY = life * Math.sin((frame + i * 40) / 36) * 3;
            const pulse = 1 + life * 0.012 * Math.sin((frame + i * 55) / 24);
            const chipGlow = 0.3 + life * 0.25 * (0.5 + 0.5 * Math.sin((frame + i * 50) / 20));

            const top = rowTop0 + i * rowGap;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 300,
                  right: 300,
                  top,
                  opacity: rIn,
                  transform: `translate(${enterX}px, ${driftY}px) scale(${enterScale * pulse})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                }}
              >
                {/* green ✓ chip */}
                <div
                  style={{
                    flex: "0 0 auto",
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    color: theme.bg,
                    fontWeight: 900,
                    background: `linear-gradient(150deg, #6ee7b7, ${theme.accentGreen})`,
                    boxShadow: `0 0 ${14 + chipGlow * 26}px ${theme.accentGreen}aa`,
                  }}
                >
                  ✓
                </div>
                {/* accent tag chip */}
                <div
                  style={{
                    flex: "0 0 auto",
                    fontFamily: theme.fontMono,
                    fontSize: 32,
                    fontWeight: 800,
                    color: row.accent,
                    background: `${row.accent}1a`,
                    border: `2px solid ${row.accent}66`,
                    borderRadius: 999,
                    padding: "8px 24px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.tag}
                </div>
                <span style={{ fontFamily: theme.fontSans, fontSize: 25, color: theme.textDim, fontWeight: 700 }}>→</span>
                {/* row text */}
                <div
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 36,
                    fontWeight: 600,
                    color: theme.text,
                    lineHeight: 1.2,
                  }}
                >
                  {row.text}
                </div>
              </div>
            );
          })}
        </CameraRig>
      )}

      {/* ===================== CTA ===================== */}
      {ctaOp > 0.001 && <CtaChoreography frame={frame} fps={fps} ctaOp={ctaOp} />}
    </AbsoluteFill>
  );
};

// ---- The original Like/Subscribe choreography, driven by a LOCAL frame so it
// starts at CTA_START. Closing line teases the next video (generic).
const CtaChoreography: React.FC<{ frame: number; fps: number; ctaOp: number }> = ({ frame, fps, ctaOp }) => {
  // Local frame clamped to ≥0 so all interpolate inputs stay finite & monotonic.
  const lf = Math.max(0, frame - CTA_START);

  // brand — appears immediately at CTA_START so it covers the recap's fade-out
  // (no blank frame at the handoff).
  const brandT = ci(lf, [0, fps * 0.4], [0, 1]);
  const headlineT = ci(lf, [fps * 1.4, fps * 2.0], [0, 1]);

  // buttons appear
  const likeIn = pop(lf, fps, fps * 2.0, { damping: 11 });
  const subIn = pop(lf, fps, fps * 2.4, { damping: 11 });

  // click moments (compressed to finish by ~f1303 → local ~348f / 11.6s budget)
  const likeClick = fps * 3.7;
  const subClick = fps * 5.1;
  const likePressed = lf > likeClick;
  const subPressed = lf > subClick;
  const likeFill = ci(lf, [likeClick - 2, likeClick + 4], [0, 1]);
  const subFill = ci(lf, [subClick - 2, subClick + 4], [0, 1]);

  // animated cursor: enters, taps like, taps subscribe
  const cx = ci(lf, [fps * 2.2, fps * 3.6, fps * 4.4, fps * 5.0], [1340, 720, 720, 1135]);
  const cy = ci(lf, [fps * 2.2, fps * 3.6, fps * 4.4, fps * 5.0], [980, 712, 712, 712]);
  const cursorClickDip = Math.max(pressDip(lf, likeClick), pressDip(lf, subClick));

  const bellWiggle = subPressed
    ? Math.sin(Math.max(0, lf - subClick) / 1.6) * ci(lf, [subClick, subClick + fps * 1.4], [18, 0])
    : 0;

  const sparks = Array.from({ length: 8 });
  const sparkT = ci(lf, [likeClick, likeClick + fps * 0.7], [0, 1]);

  const closeT = ci(lf, [fps * 6.0, fps * 6.7], [0, 1]);

  const likeDip = pressDip(lf, likeClick);
  const subDip = pressDip(lf, subClick);

  return (
    <CameraRig
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: ctaOp }}
    >
      {/* Wordmark + handle */}
      <div style={{ position: "absolute", top: 280, width: "100%", textAlign: "center", opacity: brandT, transform: `translateY(${(1 - brandT) * 18}px)` }}>
        <div style={{ fontFamily: theme.fontSans, fontSize: 76, fontWeight: 800, color: theme.text, letterSpacing: 1 }}>
          Distilled<span style={gradientText("#fbbf24", theme.accentWarm)}> AI</span>
        </div>
        <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.accentWarm, marginTop: 12, letterSpacing: 1 }}>
          @Distilled_AI_Studio
        </div>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: 450, width: "100%", textAlign: "center", opacity: headlineT, transform: `translateY(${(1 - headlineT) * 16}px)`, fontFamily: theme.fontSans, fontSize: 42, fontWeight: 700, color: theme.text }}>
        If this made things clearer…
      </div>

      {/* Buttons */}
      <div style={{ position: "absolute", top: 630, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
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
          boxShadow: subPressed ? "0 12px 34px rgba(0,0,0,0.5)" : `0 0 ${30 + (0.5 + 0.5 * Math.sin(lf / 7)) * 35}px #ef4444aa`,
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

      {/* Closing line — "See you in the next one." */}
      <div style={{
        position: "absolute", top: 850, width: "100%", textAlign: "center",
        opacity: closeT, transform: `translateY(${(1 - closeT) * 14}px)`,
        fontFamily: theme.fontSans, fontSize: 36, color: theme.textMuted,
        padding: "0 200px", lineHeight: 1.4,
      }}>
        <span style={{ color: theme.accentWarm, fontWeight: 700 }}>See you in the next one.</span>
      </div>
    </CameraRig>
  );
};
