import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 3 — Exit Conditions [900 frames / 30s]
// BREAK→FIX: show "make CI green" as the goal, agent deletes 3 test files,
// CI turns green — the horror beat. Then FIX: filesystem lock + verifier checklist.
// Final beat: punchline about the 5-second rule.
//
// Phase timings (frames @ 30fps)
// 0–120:    Phase 0 — heading + bad goal "make CI green"
// 120–360:  Phase 1 — BREAK: 3 test files deleted, CI badge flips green ✓
// 360–420:  Phase 2 — cross-fade transition (alarm SFX)
// 420–660:  Phase 3 — FIX: lock icon + verifier checklist
// 660–900:  Phase 4 — punchline (5-second rule, hero-sized, subtle pulse)

// ── Test file deletion data ──────────────────────────────────────────────────
const TEST_FILES = [
  { name: "test_login.py",   deleteAt: 150 },
  { name: "test_auth.py",    deleteAt: 210 },
  { name: "test_payment.py", deleteAt: 270 },
];

// ── Verifier constraints ─────────────────────────────────────────────────────
const CONSTRAINTS = [
  { label: "Constraint A: no files deleted?", checkAt: 480  },
  { label: "Constraint B: tests pass?",       checkAt: 555  },
  { label: "Constraint C: output reviewed?",  checkAt: 630  },
];

export const Scene3ExitConditions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase opacity envelopes ──────────────────────────────────────────────
  // Phase 0+1 (break): visible 0–360, fade out 330–390
  const breakOpacity = interpolate(
    frame,
    [0, 30, 330, 390],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 3 (fix): fade in 390–450, hold, fade out 630–660
  const fixOpacity = interpolate(
    frame,
    [390, 450, 630, 660],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 4 (punchline): fade in 660–720, hold through 900
  const punchlineOpacity = interpolate(
    frame,
    [660, 720],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Heading persists through phases 0-3, fades before punchline
  const headingOpacity = interpolate(
    frame,
    [0, 30, 620, 660],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Phase 0: bad goal animation ──────────────────────────────────────────
  const badGoalPop = pop(frame, fps, 30, { damping: 12, stiffness: 160 });
  const badGoalScale = interpolate(badGoalPop, [0, 1], [0.75, 1]);
  const badGoalOpacity = interpolate(Math.max(0, frame - 30), [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "NOT goal" examples appear staggered below
  const notGoal1Opacity = interpolate(Math.max(0, frame - 55), [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const notGoal2Opacity = interpolate(Math.max(0, frame - 80), [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phase 1 BREAK: test file deletion + CI badge ─────────────────────────
  // Each file row fades out (deleted) at its deleteAt frame
  // CI badge flips green after all 3 are deleted (~frame 300)
  const ciBadgeGreenOpacity = interpolate(frame, [300, 340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ciGoalMetOpacity = interpolate(frame, [320, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Horror pulse on the CI green badge (feels wrong)
  const horrorPulse = 0.85 + 0.15 * Math.sin(frame * 0.18);

  // ── Phase 3 FIX: lock badge + verifier checklist ─────────────────────────
  const lockPop = pop(frame, fps, 450, { damping: 11, stiffness: 150 });
  const lockScale = interpolate(lockPop, [0, 1], [0.7, 1]);
  const lockOpacity = interpolate(Math.max(0, frame - 450), [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Read-only badge slides in
  const readOnlyOpacity = interpolate(Math.max(0, frame - 490), [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lock glow pulses to show it's active
  const lockGlow = 0.7 + 0.3 * Math.sin(frame * 0.09);

  // ── Phase 4 punchline pulse ───────────────────────────────────────────────
  const punchPulse = 1 + 0.018 * Math.sin(frame * 0.12);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentRed} />

      {/* SFX cues */}
      {/* Error SFX at each file deletion */}
      <Sfx name="error" at={150} volume={0.4} />
      <Sfx name="error" at={210} volume={0.4} />
      <Sfx name="error" at={270} volume={0.4} />
      {/* Alarm at phase 2 transition */}
      <Sfx name="alarm" at={360} volume={0.45} />
      {/* Pop when lock appears */}
      <Sfx name="block" at={450} volume={0.45} />
      {/* Success for each verifier check */}
      <Sfx name="success" at={480} volume={0.4} />
      <Sfx name="success" at={555} volume={0.4} />
      <Sfx name="success" at={630} volume={0.4} />
      {/* Stinger on punchline */}
      <Sfx name="stinger" at={680} volume={0.5} />

      <CameraRig>
        {/* Scene heading — persistent through phases 0-3 */}
        <div style={{ opacity: headingOpacity }}>
          <SceneHeading kicker="design failure" accent={theme.accentRed} delay={0} size={54}>
            Exit{" "}
            <span style={gradientText(theme.accentRed, "#fb923c")}>Conditions</span>
          </SceneHeading>
        </div>

        {/* ── BREAK PHASE (0–390) ─────────────────────────────────────────── */}
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
            gap: 64,
          }}
        >
          {/* Left: bad goal + context */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 28,
              width: 620,
            }}
          >
            {/* "NOT a goal" examples — appear first */}
            <div
              style={{
                opacity: notGoal1Opacity,
                transform: `translateX(${(1 - notGoal1Opacity) * -20}px)`,
                padding: "16px 24px",
                borderRadius: 12,
                background: `${theme.accentRed}10`,
                border: `1px solid ${theme.accentRed}33`,
                fontFamily: theme.fontMono,
                fontSize: 26,
                color: theme.textMuted,
              }}
            >
              <span style={{ color: theme.accentRed, fontWeight: 700 }}>✗</span>
              {"  "}"improve the UX"
              <span
                style={{
                  display: "block",
                  fontSize: 20,
                  color: theme.textDim,
                  marginTop: 6,
                  fontFamily: theme.fontSans,
                }}
              >
                direction, not a condition
              </span>
            </div>

            {/* The main bad goal */}
            <div
              style={{
                opacity: badGoalOpacity,
                transform: `scale(${badGoalScale})`,
                padding: "24px 32px",
                borderRadius: 16,
                background: "#160808",
                border: `2px solid ${theme.accentRed}`,
                boxShadow: `0 0 40px ${theme.accentRed}55`,
                fontFamily: theme.fontMono,
                fontSize: 38,
                fontWeight: 800,
                color: theme.accentRed,
                letterSpacing: -0.5,
              }}
            >
              <span style={{ fontSize: 22, color: theme.textDim, fontWeight: 400, display: "block", marginBottom: 10 }}>
                GOAL
              </span>
              "make CI green"
            </div>

            <div
              style={{
                opacity: notGoal2Opacity,
                transform: `translateX(${(1 - notGoal2Opacity) * -20}px)`,
                padding: "16px 24px",
                borderRadius: 12,
                background: `${theme.accentWarm}0d`,
                border: `1px solid ${theme.accentWarm}33`,
                fontFamily: theme.fontSans,
                fontSize: 26,
                color: theme.accentWarm,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              Vague goals have loopholes.
              <br />
              <span style={{ color: theme.textMuted, fontWeight: 400, fontSize: 22 }}>
                The agent finds them.
              </span>
            </div>
          </div>

          {/* Right: agent deleting test files + CI badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: 580,
            }}
          >
            {/* Header: Agent output */}
            <div
              style={{
                fontFamily: theme.fontMono,
                fontSize: 22,
                color: theme.textDim,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Agent output
            </div>

            {/* Test file rows — each fades/strikes when deleted */}
            {TEST_FILES.map((file, i) => {
              const deleted = frame >= file.deleteAt;
              const deleteProgress = interpolate(
                Math.max(0, frame - file.deleteAt),
                [0, fps * 0.5],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const rowOpacity = deleted
                ? interpolate(Math.max(0, frame - file.deleteAt), [0, fps * 0.6], [1, 0.22], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 1;

              // Rows appear staggered before deletion
              const rowEntryOpacity = interpolate(Math.max(0, frame - (120 + i * 8)), [0, fps * 0.3], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={file.name}
                  style={{
                    opacity: rowEntryOpacity * rowOpacity,
                    padding: "18px 24px",
                    borderRadius: 12,
                    background: deleted ? `${theme.accentRed}08` : `${theme.surface}`,
                    border: `1.5px solid ${deleted ? theme.accentRed + "55" : theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  {/* Diff indicator */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: deleted ? `${theme.accentRed}33` : `${theme.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: theme.fontMono,
                      fontSize: 18,
                      fontWeight: 900,
                      color: deleted ? theme.accentRed : theme.textDim,
                      flexShrink: 0,
                    }}
                  >
                    {deleted ? "−" : " "}
                  </div>

                  {/* filename */}
                  <div
                    style={{
                      fontFamily: theme.fontMono,
                      fontSize: 28,
                      fontWeight: 600,
                      color: deleted ? theme.accentRed : theme.textMuted,
                      flex: 1,
                      textDecoration: deleted ? "line-through" : "none",
                      textDecorationColor: theme.accentRed,
                    }}
                  >
                    {file.name}
                  </div>

                  {/* status badge */}
                  <div
                    style={{
                      fontFamily: theme.fontMono,
                      fontSize: 20,
                      fontWeight: 700,
                      color: deleted ? theme.accentRed : theme.textDim,
                      background: deleted ? `${theme.accentRed}18` : "transparent",
                      padding: deleted ? "4px 12px" : "0",
                      borderRadius: 8,
                      border: deleted ? `1px solid ${theme.accentRed}44` : "none",
                    }}
                  >
                    {deleted ? "✗ deleted" : ""}
                  </div>
                </div>
              );
            })}

            {/* CI badge — flips to green after all files deleted */}
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* CI FAILED badge (visible before frame 300) */}
              <div
                style={{
                  opacity: interpolate(frame, [120, 150, 295, 310], [0, 1, 1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: `${theme.accentRed}18`,
                  border: `2px solid ${theme.accentRed}`,
                  fontFamily: theme.fontMono,
                  fontSize: 28,
                  fontWeight: 800,
                  color: theme.accentRed,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>✗</span> CI: FAILING
              </div>

              {/* CI PASSING badge (the horror) */}
              <div
                style={{
                  opacity: ciBadgeGreenOpacity,
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: `${theme.accentGreen}18`,
                  border: `2px solid ${theme.accentGreen}`,
                  boxShadow: `0 0 ${24 + horrorPulse * 28}px ${theme.accentGreen}66`,
                  fontFamily: theme.fontMono,
                  fontSize: 28,
                  fontWeight: 800,
                  color: theme.accentGreen,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>✓</span> CI: PASSING
              </div>

              {/* "Goal met — loop exits" label */}
              <div
                style={{
                  opacity: ciGoalMetOpacity,
                  fontFamily: theme.fontSans,
                  fontSize: 22,
                  color: theme.textDim,
                  fontStyle: "italic",
                }}
              >
                Goal met — loop exits
              </div>
            </div>
          </div>
        </div>

        {/* ── FIX PHASE (390–660) ─────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 80,
            right: 80,
            bottom: 100,
            opacity: fixOpacity,
            display: "flex",
            alignItems: "center",
            gap: 72,
          }}
        >
          {/* Left: filesystem lock + read-only */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              width: 400,
              flexShrink: 0,
            }}
          >
            {/* Lock icon */}
            <div
              style={{
                opacity: lockOpacity,
                transform: `scale(${lockScale})`,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: `radial-gradient(circle at 38% 35%, ${theme.accentGreen}33 0%, #061410 100%)`,
                border: `3px solid ${theme.accentGreen}`,
                boxShadow: `0 0 ${36 + lockGlow * 44}px ${theme.accentGreen}77`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
              }}
            >
              🔒
            </div>

            {/* read-only badge */}
            <div
              style={{
                opacity: readOnlyOpacity,
                transform: `translateY(${(1 - readOnlyOpacity) * 12}px)`,
                padding: "12px 28px",
                borderRadius: 40,
                background: `${theme.accentGreen}18`,
                border: `2px solid ${theme.accentGreen}`,
                boxShadow: `0 0 20px ${theme.accentGreen}44`,
                fontFamily: theme.fontMono,
                fontSize: 26,
                fontWeight: 700,
                color: theme.accentGreen,
                letterSpacing: 1,
              }}
            >
              read-only
            </div>

            {/* label */}
            <div
              style={{
                opacity: readOnlyOpacity,
                textAlign: "center",
                fontFamily: theme.fontSans,
                fontSize: 24,
                color: theme.textMuted,
                lineHeight: 1.5,
                maxWidth: 320,
              }}
            >
              Test suite is{" "}
              <span style={{ color: theme.accentGreen, fontWeight: 700 }}>read-only</span>
              <br />
              <span style={{ fontSize: 20, color: theme.textDim }}>
                Not a prompt instruction —<br />a filesystem permission.
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 2,
              height: 340,
              background: `linear-gradient(180deg, transparent, ${theme.border} 20%, ${theme.border} 80%, transparent)`,
              flexShrink: 0,
              opacity: lockOpacity,
            }}
          />

          {/* Right: verifier checklist */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Header */}
            <div
              style={{
                opacity: lockOpacity,
                fontFamily: theme.fontMono,
                fontSize: 22,
                color: theme.textDim,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Verifier — all must pass before exit
            </div>

            {CONSTRAINTS.map((constraint, i) => {
              const checked = frame >= constraint.checkAt;
              const checkProgress = interpolate(
                Math.max(0, frame - constraint.checkAt),
                [0, fps * 0.5],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const entryOpacity = interpolate(
                Math.max(0, frame - (lockOpacity > 0.3 ? constraint.checkAt - 30 : 9999)),
                [0, fps * 0.4],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const checkPop = pop(frame, fps, constraint.checkAt, { damping: 10, stiffness: 180 });
              const checkScale = interpolate(checkPop, [0, 1], [0.6, 1]);
              const glowPulse = checked ? 0.7 + 0.3 * Math.sin(frame * 0.09 + i * 1.4) : 0;

              return (
                <div
                  key={constraint.label}
                  style={{
                    opacity: entryOpacity,
                    padding: "22px 28px",
                    borderRadius: 16,
                    background: checked ? `${theme.accentGreen}12` : `${theme.surface}`,
                    border: `2px solid ${checked ? theme.accentGreen : theme.border}`,
                    boxShadow: checked ? `0 0 ${16 + glowPulse * 20}px ${theme.accentGreen}44` : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  {/* Constraint text */}
                  <div
                    style={{
                      fontFamily: theme.fontMono,
                      fontSize: 28,
                      fontWeight: checked ? 700 : 400,
                      color: checked ? theme.text : theme.textMuted,
                      flex: 1,
                    }}
                  >
                    {constraint.label}
                  </div>

                  {/* Checkmark pops in */}
                  <div
                    style={{
                      opacity: checked ? checkProgress : 0,
                      transform: `scale(${checked ? checkScale : 0.5})`,
                      fontFamily: theme.fontMono,
                      fontSize: 40,
                      fontWeight: 900,
                      color: theme.accentGreen,
                      textShadow: `0 0 20px ${theme.accentGreen}`,
                      minWidth: 48,
                      textAlign: "center",
                    }}
                  >
                    ✓
                  </div>
                </div>
              );
            })}

            {/* "Exit only when all pass" */}
            {(() => {
              const allPassOpacity = interpolate(frame, [650, 680], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  style={{
                    opacity: allPassOpacity,
                    marginTop: 8,
                    padding: "18px 28px",
                    borderRadius: 14,
                    background: `${theme.accent}12`,
                    border: `1.5px solid ${theme.accent}55`,
                    fontFamily: theme.fontSans,
                    fontSize: 26,
                    fontWeight: 600,
                    color: theme.accent,
                    textAlign: "center",
                  }}
                >
                  You exit{" "}
                  <span style={{ color: theme.text, fontWeight: 800 }}>only</span>{" "}
                  when all constraints pass.
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── PUNCHLINE PHASE (660–900) ────────────────────────────────────── */}
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
            gap: 40,
          }}
        >
          {/* Hero punchline */}
          <div
            style={{
              fontFamily: theme.fontSans,
              fontSize: 72,
              fontWeight: 900,
              color: theme.text,
              textAlign: "center",
              maxWidth: 1400,
              lineHeight: 1.2,
              letterSpacing: -1.5,
              transform: `scale(${punchPulse})`,
              textShadow: `0 0 80px ${theme.accentRed}44`,
            }}
          >
            If you can't evaluate it in{" "}
            <span
              style={{
                ...gradientText(theme.accentWarm, theme.accentRed),
                display: "inline",
              }}
            >
              5 seconds
            </span>
            {" —"}
            <br />
            it's too vague to automate.
          </div>

          {/* Subtle accent line */}
          <div
            style={{
              width: interpolate(frame, [720, 820], [0, 700], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE_OUT,
              }),
              height: 4,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${theme.accentRed}, ${theme.accentWarm})`,
              boxShadow: `0 0 20px ${theme.accentRed}88`,
              opacity: 0.8,
            }}
          />

          {/* Sub-label */}
          <div
            style={{
              opacity: interpolate(Math.max(0, frame - 780), [0, fps * 0.7], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              fontFamily: theme.fontMono,
              fontSize: 30,
              color: theme.textMuted,
              letterSpacing: 1,
              textAlign: "center",
            }}
          >
            binary · deterministic · mechanically enforceable
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
