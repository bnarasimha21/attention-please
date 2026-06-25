import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 2 — Termination Stack [900 frames / 30s]
// BREAK→FIX: first show a loop with 0 guards (cost climbing, no stop),
// then show 4 layers light up one-by-one as the loop runs safely.
// Final beat: $47k vs $2.40 cost comparison.

// Phase timings (frames @ 30fps)
// 0–90:    Scene heading intro
// 90–330:  BREAK phase — runaway loop, cost climbing, alarm
// 330–420: Crossfade break→fix
// 420–660: FIX phase — 4 layers activate one-by-one
// 660–840: Cost comparison punchline
// 840–900: Hold / subtle drift

const LAYERS = [
  {
    id: "goal",
    label: "Layer 1 — Goal Signal",
    detail: "structured done() function, not text parsing",
    color: theme.accentGreen,
    activateAt: 450,
  },
  {
    id: "cap",
    label: "Layer 2 — Hard Iteration Cap",
    detail: "circuit breaker · 50 steps enforced",
    color: theme.accent,
    activateAt: 510,
  },
  {
    id: "token",
    label: "Layer 3 — Token Budget",
    detail: "synchronous enforcement · intercepts before the call",
    color: theme.accentWarm,
    activateAt: 570,
  },
  {
    id: "hash",
    label: "Layer 4 — No-Progress Detection",
    detail: "hash(tool + result) per iteration · kill on repeat",
    color: "#a78bfa",
    activateAt: 630,
  },
];

// Counter that ticks up continuously
function useCounter(frame: number, startFrame: number, endFrame: number, from: number, to: number) {
  const t = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  return Math.round(from + t * (to - from));
}

export const Scene2TerminationStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase opacities ─────────────────────────────────────────────────────────
  const breakOpacity = interpolate(
    frame,
    [60, 120, 300, 360],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fixOpacity = interpolate(
    frame,
    [360, 430, 820, 870],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const punchlineOpacity = interpolate(
    frame,
    [860, 900],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── BREAK phase — runaway cost counter ──────────────────────────────────────
  const costRaw = useCounter(frame, 90, 320, 0, 47000);
  const iterCount = useCounter(frame, 90, 320, 0, 2847);
  const iterFlash = Math.sin(frame * 0.5) > 0.5 && frame > 90 && frame < 330 && frame % 4 < 2;

  const zeroGuardPop = pop(frame, fps, fps * 2, { damping: 10, stiffness: 140 });
  const zeroGuardScale = interpolate(zeroGuardPop, [0, 1], [0.7, 1]);

  // alarm pulse for BREAK phase
  const alarmPulse = Math.abs(Math.sin(frame * 0.12));

  // ── FIX phase — layer activations ───────────────────────────────────────────
  const safeIter = useCounter(frame, 430, 800, 0, 47);
  const safeToken = useCounter(frame, 430, 800, 0, 38200);

  // ── Cost comparison ─────────────────────────────────────────────────────────
  const badCostPop = pop(frame, fps, 870, { damping: 12 });
  const goodCostPop = pop(frame, fps, 900, { damping: 12 });

  // ── Heading cross-phase opacity ──────────────────────────────────────────────
  const headingOpacity = interpolate(
    frame,
    [0, 30, 840, 870],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      {/* SFX cues */}
      <Sfx name="alarm" at={90} volume={0.35} />
      <Sfx name="error" at={300} volume={0.4} />
      <Sfx name="pop" at={430} volume={0.4} />
      <Sfx name="tick" at={510} volume={0.3} />
      <Sfx name="tick" at={570} volume={0.3} />
      <Sfx name="tick" at={630} volume={0.3} />
      <Sfx name="success" at={690} volume={0.45} />
      <Sfx name="stinger" at={870} volume={0.5} />

      <CameraRig>
        {/* Scene heading — persistent */}
        <div style={{ opacity: headingOpacity }}>
          <SceneHeading kicker="loop engineering" accent={theme.accentWarm} delay={0} size={54}>
            The{" "}
            <span style={gradientText(theme.accentWarm, "#fbbf24")}>Termination</span>{" "}
            Stack
          </SceneHeading>
        </div>

        {/* ── BREAK PHASE ──────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: breakOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 80,
          }}
        >
          {/* Runaway loop card */}
          <div
            style={{
              width: 640,
              borderRadius: 24,
              background: "#14080a",
              border: `2px solid ${theme.accentRed}${Math.round(60 + alarmPulse * 160).toString(16).padStart(2, "0")}`,
              boxShadow: `0 0 ${30 + alarmPulse * 60}px ${theme.accentRed}55`,
              padding: 40,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* header */}
            <div
              style={{
                fontFamily: theme.fontMono,
                fontSize: 26,
                color: theme.accentRed,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              ⚠ Runaway Agent Loop
            </div>

            {/* iteration ticker */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderRadius: 14,
                background: `${theme.accentRed}14`,
                border: `1px solid ${theme.accentRed}44`,
              }}
            >
              <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.textMuted }}>
                iterations
              </div>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 44,
                  fontWeight: 800,
                  color: iterFlash ? "#fff" : theme.accentRed,
                  letterSpacing: -1,
                }}
              >
                {iterCount.toLocaleString()}
              </div>
            </div>

            {/* cost meter */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderRadius: 14,
                background: `${theme.accentWarm}14`,
                border: `1px solid ${theme.accentWarm}44`,
              }}
            >
              <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.textMuted }}>
                cost
              </div>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 48,
                  fontWeight: 800,
                  color: theme.accentWarm,
                  letterSpacing: -1,
                }}
              >
                ${costRaw.toLocaleString()}
              </div>
            </div>

            {/* guards: 0 of 4 */}
            <div
              style={{
                padding: "16px 24px",
                borderRadius: 14,
                background: `${theme.accentRed}0a`,
                border: `1px solid ${theme.accentRed}33`,
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 26,
                  color: theme.textDim,
                  marginBottom: 12,
                  letterSpacing: 1,
                }}
              >
                exit guards
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 10,
                      borderRadius: 6,
                      background: theme.border,
                      boxShadow: "none",
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 28,
                  color: theme.accentRed,
                  fontWeight: 800,
                  marginTop: 12,
                  opacity: 0.5 + alarmPulse * 0.5,
                }}
              >
                0 / 4
              </div>
            </div>
          </div>

          {/* "Zero guards" badge */}
          <div
            style={{
              opacity: interpolate(frame, [fps * 3, fps * 4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${zeroGuardScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: `radial-gradient(circle at 38% 35%, ${theme.accentRed}33 0%, #1a0606 100%)`,
                border: `3px solid ${theme.accentRed}`,
                boxShadow: `0 0 ${40 + alarmPulse * 50}px ${theme.accentRed}88`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fontMono,
                fontSize: 72,
                fontWeight: 900,
                color: theme.accentRed,
              }}
            >
              0
            </div>
            <div
              style={{
                fontFamily: theme.fontSans,
                fontSize: 32,
                fontWeight: 700,
                color: theme.accentRed,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              exit guards
              <br />
              <span style={{ fontSize: 24, color: theme.textMuted, fontWeight: 400 }}>
                out of 4
              </span>
            </div>
            <div
              style={{
                fontFamily: theme.fontSans,
                fontSize: 28,
                color: theme.textMuted,
                textAlign: "center",
                maxWidth: 260,
                lineHeight: 1.4,
              }}
            >
              The $47,000 incident had{" "}
              <span style={{ color: theme.accentRed, fontWeight: 700 }}>zero</span> of four.
            </div>
          </div>
        </div>

        {/* ── FIX PHASE ────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 100,
            right: 100,
            bottom: 120,
            opacity: fixOpacity,
            display: "flex",
            gap: 48,
            alignItems: "flex-start",
          }}
        >
          {/* Layer chips column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              flex: 1,
            }}
          >
            {LAYERS.map((layer, i) => {
              const activated = frame >= layer.activateAt;
              const chipPop = pop(frame, fps, layer.activateAt, { damping: 11, stiffness: 160 });
              const chipScale = interpolate(Math.max(0, frame - layer.activateAt), [0, fps * 0.5], [0.88, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const chipOpacity = interpolate(Math.max(0, frame - layer.activateAt), [0, fps * 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const glowPulse = activated ? 0.7 + 0.3 * Math.sin(frame * 0.08 + i * 1.2) : 0;

              return (
                <div
                  key={layer.id}
                  style={{
                    opacity: activated ? chipOpacity : 0.18,
                    transform: `scale(${activated ? chipScale : 1})`,
                    padding: "22px 30px",
                    borderRadius: 18,
                    background: activated ? `${layer.color}14` : `${theme.surface}`,
                    border: `2px solid ${activated ? layer.color : theme.border}`,
                    boxShadow: activated ? `0 0 ${18 + glowPulse * 22}px ${layer.color}44` : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    transition: "none",
                  }}
                >
                  {/* indicator dot */}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: activated ? layer.color : theme.border,
                      boxShadow: activated ? `0 0 ${12 + glowPulse * 14}px ${layer.color}` : "none",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: theme.fontMono,
                        fontSize: 28,
                        fontWeight: 700,
                        color: activated ? layer.color : theme.textDim,
                        marginBottom: 6,
                      }}
                    >
                      {layer.label}
                    </div>
                    <div
                      style={{
                        fontFamily: theme.fontSans,
                        fontSize: 22,
                        color: activated ? theme.textMuted : theme.textDim,
                        lineHeight: 1.4,
                      }}
                    >
                      {layer.detail}
                    </div>
                  </div>
                  {/* ✓ check */}
                  {activated && (
                    <div
                      style={{
                        fontFamily: theme.fontMono,
                        fontSize: 36,
                        color: layer.color,
                        fontWeight: 900,
                        opacity: chipOpacity,
                        transform: `scale(${chipPop})`,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              );
            })}

            {/* "2 of 4 is not enough" note */}
            {(() => {
              const noteOpacity = interpolate(frame, [650, 690], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  style={{
                    opacity: noteOpacity,
                    padding: "18px 30px",
                    borderRadius: 14,
                    background: `${theme.accentWarm}0d`,
                    border: `1px solid ${theme.accentWarm}44`,
                    fontFamily: theme.fontSans,
                    fontSize: 26,
                    color: theme.accentWarm,
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  Two out of four is{" "}
                  <span style={{ color: theme.accentRed, fontWeight: 800 }}>not enough.</span>
                </div>
              );
            })()}
          </div>

          {/* Live safe-loop status panel */}
          <div
            style={{
              width: 380,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              flexShrink: 0,
            }}
          >
            {/* heading */}
            <div
              style={{
                fontFamily: theme.fontMono,
                fontSize: 24,
                color: theme.textDim,
                letterSpacing: 2,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Agent Loop — Safe Run
            </div>

            {/* iteration counter */}
            <div
              style={{
                padding: "20px 24px",
                borderRadius: 16,
                background: `${theme.accentGreen}12`,
                border: `1px solid ${theme.accentGreen}44`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>
                iteration
              </div>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 44,
                  fontWeight: 800,
                  color: safeIter < 50 ? theme.accentGreen : theme.accentWarm,
                }}
              >
                {safeIter} / 50
              </div>
            </div>

            {/* token counter */}
            <div
              style={{
                padding: "20px 24px",
                borderRadius: 16,
                background: `${theme.accentWarm}10`,
                border: `1px solid ${theme.accentWarm}33`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>
                tokens
              </div>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 36,
                  fontWeight: 800,
                  color: theme.accentWarm,
                }}
              >
                {safeToken.toLocaleString()}
              </div>
            </div>

            {/* cost */}
            <div
              style={{
                padding: "20px 24px",
                borderRadius: 16,
                background: `${theme.accentGreen}10`,
                border: `1px solid ${theme.accentGreen}33`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>
                cost
              </div>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 44,
                  fontWeight: 800,
                  color: theme.accentGreen,
                }}
              >
                $
                {interpolate(frame, [430, 800], [0, 2.4], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }).toFixed(2)}
              </div>
            </div>

            {/* progress bar for iteration cap */}
            <div style={{ padding: "16px 24px", borderRadius: 14, background: theme.surface, border: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim }}>
                  cap usage
                </div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.accent }}>
                  {Math.min(safeIter, 50)}/50
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 12,
                  borderRadius: 6,
                  background: theme.border,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min((safeIter / 50) * 100, 100)}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentGreen})`,
                    boxShadow: `0 0 12px ${theme.accent}`,
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── PUNCHLINE — cost comparison ──────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: punchlineOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
          }}
        >
          <div
            style={{
              fontFamily: theme.fontSans,
              fontSize: 46,
              fontWeight: 700,
              color: theme.textMuted,
              letterSpacing: -0.5,
            }}
          >
            The difference a stack makes
          </div>

          <div
            style={{
              display: "flex",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Bad cost */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                transform: `scale(${interpolate(badCostPop, [0, 1], [0.7, 1])})`,
                opacity: interpolate(Math.max(0, frame - 870), [0, fps * 0.5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 100,
                  fontWeight: 900,
                  color: theme.accentRed,
                  letterSpacing: -4,
                  lineHeight: 1,
                  textShadow: `0 0 60px ${theme.accentRed}88`,
                }}
              >
                $47k
              </div>
              <div
                style={{
                  fontFamily: theme.fontSans,
                  fontSize: 30,
                  color: theme.accentRed,
                  fontWeight: 600,
                }}
              >
                0 guards
              </div>
            </div>

            {/* VS divider */}
            <div
              style={{
                fontFamily: theme.fontMono,
                fontSize: 48,
                fontWeight: 800,
                color: theme.textDim,
              }}
            >
              vs
            </div>

            {/* Good cost */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                transform: `scale(${interpolate(goodCostPop, [0, 1], [0.7, 1])})`,
                opacity: interpolate(Math.max(0, frame - 900), [0, fps * 0.5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 100,
                  fontWeight: 900,
                  color: theme.accentGreen,
                  letterSpacing: -4,
                  lineHeight: 1,
                  textShadow: `0 0 60px ${theme.accentGreen}88`,
                }}
              >
                $2.40
              </div>
              <div
                style={{
                  fontFamily: theme.fontSans,
                  fontSize: 30,
                  color: theme.accentGreen,
                  fontWeight: 600,
                }}
              >
                4 layers enforced
              </div>
            </div>
          </div>

          {/* subtle gradient underline accent */}
          <div
            style={{
              width: 600,
              height: 5,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${theme.accentRed}, ${theme.textDim}, ${theme.accentGreen})`,
              opacity: 0.6,
            }}
          />
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
