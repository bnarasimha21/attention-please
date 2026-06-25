import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 1 — Scene1QuietFailure [0:00–0:30]
// Hook: minimal loop pseudocode 6 lines → CI green flash → horror reveal (tests deleted)
// Punchline: "deploying or demoing" stands alone, big, centred.

// ─── PHASE TIMESTAMPS (frames @ 30fps) ────────────────────────────────────────
// Phase 0  [0  – 180]  Heading + pseudocode lines reveal one-by-one
// Phase 1  [180– 330]  CI green badge sweeps in — "loop ran. terminated cleanly."
// Phase 2  [330– 510]  Horror: deleted-tests diff flies in, red glow, alarm
// Phase 3  [510– 660]  Cross-fade to punchline phase
// Phase 4  [660– 900]  Punchline stands alone — "deploying or demoing" — pulses

const CODE_LINES = [
  { text: "while goal_not_met:", color: theme.accent },
  { text: "    model_output = call_model(state)", color: theme.textMuted },
  { text: "    result       = run_tool(model_output)", color: theme.textMuted },
  { text: "    observation  = observe(result)", color: theme.textMuted },
  { text: "    state        = update_state(observation)", color: theme.textMuted },
  { text: "    # repeat", color: theme.textDim },
];

const HORROR_LINES = [
  { prefix: "- ", text: "test_login_fails.py", color: theme.accentRed },
  { prefix: "- ", text: "test_auth_edge_cases.py", color: theme.accentRed },
  { prefix: "- ", text: "test_payment_flow.py", color: theme.accentRed },
];

export const Scene1QuietFailure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase visibility helpers ──────────────────────────────────────────────
  const phaseCode   = interpolate(frame, [0, 18],   [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phaseCi     = interpolate(frame, [180, 204], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phaseHorror = interpolate(frame, [330, 354], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phaseOut    = interpolate(frame, [510, 570], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phasePunch  = interpolate(frame, [570, 630], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Heading ───────────────────────────────────────────────────────────────
  const headingOpacity = interpolate(frame, [0, 20, 480, 510], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Code block ───────────────────────────────────────────────────────────
  const codeBlockPop = pop(frame, fps, 0, { damping: 12, stiffness: 150 });
  const codeBlockScale = interpolate(codeBlockPop, [0, 1], [0.88, 1]);

  // Each code line reveals staggered
  const lineDelay = (i: number) => i * 14 + 20;

  // Code block fades out as CI enters (at 150 it starts fading)
  const codeToCI = interpolate(frame, [150, 200], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── CI Badge ─────────────────────────────────────────────────────────────
  const ciBadgePop = pop(frame, fps, 180, { damping: 10, stiffness: 180 });
  const ciBadgeScale = interpolate(ciBadgePop, [0, 1], [0.6, 1]);

  // CI caption lines appear in sequence
  const ciLine1Op = interpolate(frame, [220, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ciLine2Op = interpolate(frame, [258, 290], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ciLine3Op = interpolate(frame, [296, 330], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CI badge dims as horror arrives
  const ciToHorror = interpolate(frame, [310, 350], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CI green pulse
  const ciPulse = 0.7 + 0.3 * Math.sin(frame / 6);

  // ── Horror diff panel ────────────────────────────────────────────────────
  const horrorPop = pop(frame, fps, 330, { damping: 9, stiffness: 200, mass: 0.8 });
  const horrorScale = interpolate(horrorPop, [0, 1], [0.7, 1]);
  const horrorShake = phaseHorror * Math.sin(frame / 1.4) * (phaseOut > 0.1 ? 0 : 4);

  // Horror diff lines stagger
  const horrorLineDelay = (i: number) => 360 + i * 22;

  // red glow breathing
  const redGlow = 0.6 + 0.4 * Math.sin(frame / 9);

  // Commit hash / status tickers in horror phase
  const tickerProgress = interpolate(frame, [350, 490], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });

  // ── Punchline ─────────────────────────────────────────────────────────────
  const punchPop = pop(frame, fps, 570, { damping: 12, stiffness: 160, mass: 0.9 });
  const punchScale = interpolate(punchPop, [0, 1], [0.75, 1]);
  const punchPulse = 1 + 0.018 * Math.sin(frame / 14);
  const punchDrift = Math.sin(frame / 55) * 4;

  // ── Background glow switch ────────────────────────────────────────────────
  // Blend from accent (indigo) to red as horror arrives
  const bgGlow = frame < 300 ? theme.accent : theme.accentRed;

  return (
    <AbsoluteFill>
      <SceneBackground glow={bgGlow} />

      {/* SFX cues */}
      <Sfx name="whoosh" at={20}   volume={0.3} />
      <Sfx name="success" at={190} volume={0.35} />
      <Sfx name="alarm"   at={338} volume={0.55} />
      <Sfx name="error"   at={360} volume={0.4}  />
      <Sfx name="stinger" at={580} volume={0.45} />

      {/* ── PHASE 0 + 1: Heading ─────────────────────────────────────────── */}
      <div style={{ opacity: headingOpacity }}>
        <SceneHeading kicker="loop engineering" accent={theme.accentRed} delay={0} size={54}>
          The failure nobody{" "}
          <span style={gradientText(theme.accentWarm, theme.accentRed)}>warns you about</span>
        </SceneHeading>
      </div>

      <CameraRig>
        {/* ── PHASE 0: Pseudocode block ──────────────────────────────────── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: Math.min(phaseCode, codeToCI) * phaseOut,
        }}>
          <div style={{
            transform: `scale(${codeBlockScale})`,
            background: "linear-gradient(180deg, #12121e 0%, #0c0c15 100%)",
            border: `1.5px solid ${theme.border}`,
            borderRadius: 24,
            padding: "44px 56px",
            minWidth: 760,
            boxShadow: `0 0 60px ${theme.accent}22, 0 32px 80px rgba(0,0,0,0.55)`,
          }}>
            {/* file tag */}
            <div style={{
              fontFamily: theme.fontMono,
              fontSize: 24,
              color: theme.accent,
              letterSpacing: 2,
              marginBottom: 28,
              opacity: 0.7,
            }}>
              agent_loop.py
            </div>

            {CODE_LINES.map((line, i) => {
              const delay = lineDelay(i);
              const lineOp = interpolate(
                Math.max(0, frame - delay),
                [0, 16],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const lineSlide = interpolate(
                Math.max(0, frame - delay),
                [0, 20],
                [-18, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
              );
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 30,
                    color: line.color,
                    lineHeight: 1.72,
                    opacity: lineOp,
                    transform: `translateY(${lineSlide}px)`,
                    whiteSpace: "pre",
                  }}
                >
                  {line.text}
                </div>
              );
            })}

            {/* "six lines" label */}
            <div style={{
              marginTop: 28,
              fontFamily: theme.fontSans,
              fontSize: 24,
              color: theme.textDim,
              letterSpacing: 1,
              opacity: interpolate(Math.max(0, frame - 110), [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              six lines — that's the whole loop
            </div>
          </div>
        </div>

        {/* ── PHASE 1: CI Green badge ────────────────────────────────────── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          opacity: phaseCi * ciToHorror,
        }}>
          {/* Big green CI badge */}
          <div style={{
            transform: `scale(${ciBadgeScale})`,
            background: `${theme.accentGreen}18`,
            border: `2.5px solid ${theme.accentGreen}`,
            borderRadius: 28,
            padding: "32px 72px",
            boxShadow: `0 0 ${40 + ciPulse * 30}px ${theme.accentGreen}55`,
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}>
            <div style={{
              fontSize: 64,
              lineHeight: 1,
            }}>✓</div>
            <div style={{
              fontFamily: theme.fontMono,
              fontSize: 52,
              fontWeight: 800,
              color: theme.accentGreen,
              letterSpacing: 2,
            }}>
              CI PASSED
            </div>
          </div>

          {/* Caption lines */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}>
            {[
              { text: "Loop ran.", op: ciLine1Op },
              { text: "Terminated cleanly.", op: ciLine2Op },
              { text: "Green across the board.", op: ciLine3Op },
            ].map(({ text, op }) => (
              <div key={text} style={{
                opacity: op,
                fontFamily: theme.fontSans,
                fontSize: 36,
                color: theme.textMuted,
                transform: `translateY(${(1 - op) * 14}px)`,
              }}>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── PHASE 2: Horror — deleted tests diff ──────────────────────── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
          opacity: phaseHorror * phaseOut,
          transform: `translateX(${horrorShake}px)`,
        }}>
          {/* Horror header */}
          <div style={{
            fontFamily: theme.fontMono,
            fontSize: 28,
            color: theme.accentRed,
            letterSpacing: 3,
            opacity: interpolate(Math.max(0, frame - 332), [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            git diff — last commit
          </div>

          {/* Diff panel */}
          <div style={{
            transform: `scale(${horrorScale})`,
            background: "linear-gradient(180deg, #1a0a0a 0%, #110505 100%)",
            border: `1.5px solid ${theme.accentRed}88`,
            borderRadius: 24,
            padding: "36px 52px",
            minWidth: 760,
            boxShadow: `0 0 ${50 * redGlow}px ${theme.accentRed}44, 0 32px 80px rgba(0,0,0,0.6)`,
          }}>
            {/* Commit info ticker */}
            <div style={{
              fontFamily: theme.fontMono,
              fontSize: 24,
              color: theme.textDim,
              marginBottom: 28,
              display: "flex",
              justifyContent: "space-between",
            }}>
              <span>commit a3f91d7</span>
              <span style={{ color: theme.accentRed }}>
                −{Math.round(tickerProgress * 3)} files deleted
              </span>
            </div>

            {/* Deleted files */}
            {HORROR_LINES.map((line, i) => {
              const delay = horrorLineDelay(i);
              const lineOp = interpolate(
                Math.max(0, frame - delay),
                [0, 18],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const lineSlide = interpolate(
                Math.max(0, frame - delay),
                [0, 20],
                [22, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
              );
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 32,
                    color: line.color,
                    lineHeight: 1.8,
                    opacity: lineOp,
                    transform: `translateX(${lineSlide}px)`,
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <span style={{
                    background: `${theme.accentRed}33`,
                    border: `1px solid ${theme.accentRed}55`,
                    borderRadius: 6,
                    padding: "2px 10px",
                    fontSize: 26,
                    fontWeight: 700,
                  }}>
                    DELETE
                  </span>
                  <span style={{ color: theme.accentRed }}>
                    {line.prefix}{line.text}
                  </span>
                </div>
              );
            })}

            {/* Bottom annotation */}
            <div style={{
              marginTop: 32,
              padding: "18px 22px",
              borderRadius: 14,
              background: `${theme.accentRed}15`,
              border: `1px solid ${theme.accentRed}44`,
              fontFamily: theme.fontSans,
              fontSize: 28,
              color: theme.accentRed,
              opacity: interpolate(Math.max(0, frame - 430), [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              Not a crash. Not a hung process. The agent deleted the failing tests.
            </div>
          </div>

          {/* "No exception. No alert." label */}
          <div style={{
            fontFamily: theme.fontSans,
            fontSize: 34,
            color: theme.textMuted,
            opacity: interpolate(Math.max(0, frame - 460), [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            No exception. No alert. Just{" "}
            <span style={{ color: theme.accentRed, fontWeight: 700 }}>wrong.</span>
          </div>
        </div>

        {/* ── PHASE 3+4: Punchline ──────────────────────────────────────── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 165,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          opacity: phasePunch,
          transform: `translateY(${punchDrift}px) scale(${punchScale * punchPulse})`,
        }}>
          {/* Three design decisions callout */}
          <div style={{
            fontFamily: theme.fontMono,
            fontSize: 26,
            color: theme.accent,
            letterSpacing: 3,
            opacity: interpolate(Math.max(0, frame - 640), [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            exit criteria · durable state · topology
          </div>

          {/* Big punchline */}
          <div style={{
            textAlign: "center",
            fontFamily: theme.fontSans,
            fontWeight: 900,
            fontSize: 78,
            letterSpacing: -1.5,
            lineHeight: 1.1,
            color: theme.text,
          }}>
            <span style={gradientText(theme.accentGreen, theme.accent)}>deploying</span>
            <br />
            <span style={{ fontSize: 54, color: theme.textMuted, fontWeight: 600 }}>or</span>
            <br />
            <span style={gradientText(theme.accentWarm, theme.accentRed)}>demoing</span>
          </div>

          {/* Sub-caption */}
          <div style={{
            fontFamily: theme.fontSans,
            fontSize: 30,
            color: theme.textDim,
            textAlign: "center",
            maxWidth: 820,
            lineHeight: 1.5,
            opacity: interpolate(Math.max(0, frame - 680), [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            Three design decisions — made before your agent ever runs.
          </div>

          {/* Accent underline */}
          <div style={{
            width: interpolate(Math.max(0, frame - 600), [0, 60], [0, 480], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }),
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${theme.accentRed}, ${theme.accentWarm}, ${theme.accentGreen})`,
            boxShadow: `0 0 18px ${theme.accentRed}88`,
          }} />
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
