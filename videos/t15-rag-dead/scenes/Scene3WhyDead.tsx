import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 3 — Why people say it's dead [0:30-0:46]
// Naive RAG: ONE blind shot. A single query fires one arrow at a doc pile,
// grabs the WRONG (red) chunk, drops it into the model → red ✕ hallucination.

// The doc pile — one chunk is the right answer (green), but the blind shot
// lands on a wrong one (red).
const CHUNKS = [
  { right: false },
  { right: false },
  { right: true }, // the actually-relevant chunk (missed)
  { right: false },
  { right: false },
];

export const Scene3WhyDead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // query chip appears
  const queryOpacity = interpolate(frame, [fps * 1.5, fps * 2.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // single shot fires (5s -> 6.3s), one blind arrow
  const shotT = interpolate(frame, [fps * 5, fps * 6.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // grabbed chunk = index 0 (a WRONG one), the right one (index 2) stays missed
  const grabbedIdx = 0;

  // chunk lifts out and travels to the model (6.6s -> 8.3s)
  const carryT = interpolate(frame, [fps * 6.6, fps * 8.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // model reacts, bad answer (9s+)
  const badT = interpolate(frame, [fps * 9, fps * 10.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xSpring = pop(frame, fps, fps * 9, { damping: 9 });

  const lineOpacity = interpolate(frame, [fps * 11.5, fps * 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // layout anchors (relative to a centered stage; nudged inward for CameraRig zoom)
  const queryX = -570;
  const pileX = -40;
  const modelX = 555;

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentRed} />

      <CameraRig intensity={0.6} push={0.025}>
      <SceneHeading kicker="the case against" accent={theme.accentRed}>
        Naive RAG takes <span style={gradientText("#fca5a5", theme.accentRed)}>one blind shot</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1620, height: 470 }}>
          {/* Query chip */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${queryX}px), -50%)`,
              opacity: queryOpacity,
              padding: "20px 28px",
              borderRadius: 17,
              background: "linear-gradient(160deg, #1a1216, #100b0d)",
              border: `1px solid ${theme.accentRed}66`,
              fontFamily: theme.fontMono,
              fontSize: 30,
              color: theme.text,
              width: 276,
              textAlign: "center",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >
            "your question"
            <div style={{ fontFamily: theme.fontSans, fontSize: 20, color: theme.accentRed, marginTop: 8 }}>1 search · top-1 chunk</div>
          </div>

          {/* single blind shot arrow */}
          {shotT > 0 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${queryX + 160 + shotT * 380}px), -50%)`,
                color: theme.accentRed,
                fontSize: 40,
                opacity: shotT < 1 ? 1 : 0.4,
                filter: `drop-shadow(0 0 8px ${theme.accentRed})`,
              }}
            >
              ➜
            </div>
          )}

          {/* Doc pile */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${pileX}px), -50%)`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontFamily: theme.fontMono, fontSize: 23, color: theme.textMuted, textAlign: "center", marginBottom: 6 }}>
              knowledge base
            </div>
            {CHUNKS.map((c, i) => {
              const grabbed = i === grabbedIdx;
              const start = fps * (2 + i * 0.4);
              const s = pop(frame, fps, start, { damping: 11 });
              const opacity = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              // grabbed chunk fades from its slot as it's carried away
              const slotFade = grabbed ? 1 - carryT : 1;
              const hit = grabbed && shotT > 0.85;
              const color = hit ? theme.accentRed : theme.border;
              return (
                <div
                  key={i}
                  style={{
                    width: 360,
                    height: 60,
                    borderRadius: 12,
                    opacity: opacity * slotFade,
                    transform: `translateX(${(1 - s) * 24}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                    background: hit ? `${theme.accentRed}22` : "linear-gradient(160deg, #15151b, #0d0d11)",
                    border: `1.5px solid ${color}`,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 22,
                    gap: 14,
                    boxShadow: hit ? `0 0 30px ${theme.accentRed}88` : "none",
                  }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: hit ? theme.accentRed : theme.textDim }} />
                  <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: hit ? theme.accentRed : theme.textMuted }}>
                    {hit ? "WRONG chunk grabbed" : "chunk " + (i + 1)}
                  </div>
                  {c.right && (
                    <div style={{ marginLeft: "auto", marginRight: 16, fontFamily: theme.fontSans, fontSize: 18, color: theme.accentGreen, opacity: badT }}>
                      ← the right one, missed
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* carried wrong chunk traveling to model */}
          {carryT > 0 && carryT < 1 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${interpolate(carryT, [0, 1], [pileX + 60, modelX - 160])}px), calc(-50% + ${interpolate(carryT, [0, 1], [-110, 0])}px))`,
                width: 240,
                height: 53,
                borderRadius: 12,
                background: `${theme.accentRed}33`,
                border: `1.5px solid ${theme.accentRed}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fontMono,
                fontSize: 20,
                color: theme.accentRed,
                boxShadow: `0 0 26px ${theme.accentRed}88`,
              }}
            >
              wrong context
            </div>
          )}

          {/* Model + bad answer */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${modelX}px), -50%)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ transform: "scale(0.9)" }}>
              <ModelCore size={150} label="LLM" pulse={pulse} fontSize={32} />
            </div>
            <div
              style={{
                opacity: badT,
                transform: `scale(${interpolate(xSpring, [0, 1], [0.7, 1])})`,
                padding: "15px 26px",
                borderRadius: 14,
                background: `${theme.accentRed}1a`,
                border: `1.5px solid ${theme.accentRed}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: theme.fontSans,
                fontSize: 30,
                fontWeight: 700,
                color: theme.accentRed,
              }}
            >
              <span style={{ fontSize: 35 }}>✕</span> hallucinated answer
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          width: "100%",
          textAlign: "center",
          opacity: lineOpacity,
          fontFamily: theme.fontSans,
          fontSize: 41,
          color: theme.text,
        }}
      >
        One bad lookup <span style={{ color: theme.accentRed }}>poisons everything.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
