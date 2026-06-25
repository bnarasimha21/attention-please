import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 6 — What It Is About (900 frames / 30s)
// Phases:
//  0–180   Workflow vs Loop comparison (two-column)
//  180–390 Decision matrix (use a loop when...)
//  390–630 Conservative drift — BREAK→FIX: metric looks healthy, output is timid
//  630–900 Punchline hero: "prompts → programs that write prompts"

// ─── Phase 1: Workflow vs Loop ────────────────────────────────────────────────

const WORKFLOW_STEPS = ["Fetch data", "Transform", "LLM decide", "Write output"];
const LOOP_STEPS = ["Plan", "Act", "Observe", "?"];

const PipelineNode: React.FC<{
  label: string;
  color: string;
  frame: number;
  fps: number;
  delay: number;
  isUnknown?: boolean;
}> = ({ label, color, frame, fps, delay, isUnknown }) => {
  const s = pop(frame, fps, delay, { damping: 12, stiffness: 160 });
  const op = interpolate(Math.max(0, frame - delay), [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const sc = interpolate(s, [0, 1], [0.6, 1]);
  return (
    <div
      style={{
        opacity: op,
        transform: `scale(${sc})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 210,
        height: 72,
        borderRadius: 14,
        border: `2px solid ${color}`,
        background: `${color}18`,
        fontFamily: isUnknown ? theme.fontMono : theme.fontSans,
        fontSize: isUnknown ? 44 : 28,
        fontWeight: 700,
        color: isUnknown ? color : theme.text,
        boxShadow: `0 0 18px ${color}30`,
        letterSpacing: isUnknown ? 2 : 0,
      }}
    >
      {label}
    </div>
  );
};

const Arrow: React.FC<{ color: string; frame: number; fps: number; delay: number }> = ({
  color,
  frame,
  fps,
  delay,
}) => {
  const op = interpolate(Math.max(0, frame - delay), [0, fps * 0.3], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: op,
        width: 44,
        height: 3,
        background: `linear-gradient(90deg, ${color}aa, ${color})`,
        borderRadius: 2,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -1,
          top: -5,
          width: 0,
          height: 0,
          borderTop: "7px solid transparent",
          borderBottom: "7px solid transparent",
          borderLeft: `10px solid ${color}`,
        }}
      />
    </div>
  );
};

// ─── Phase 2: Decision Matrix ─────────────────────────────────────────────────

const DECISION_ROWS: { condition: string; verdict: "LOOP" | "WORKFLOW"; verdictColor: string }[] = [
  { condition: "Path is unknown until runtime", verdict: "LOOP", verdictColor: theme.accentWarm },
  { condition: "Steps are deterministic", verdict: "WORKFLOW", verdictColor: theme.accent },
  { condition: "Wrong step is recoverable", verdict: "LOOP", verdictColor: theme.accentWarm },
  { condition: "Failure cost is catastrophic", verdict: "WORKFLOW", verdictColor: theme.accent },
  { condition: "Output requires self-correction", verdict: "LOOP", verdictColor: theme.accentWarm },
];

const DecisionRow: React.FC<{
  condition: string;
  verdict: string;
  verdictColor: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({ condition, verdict, verdictColor, frame, fps, delay }) => {
  const s = pop(frame, fps, delay, { damping: 13, stiffness: 140 });
  const op = interpolate(Math.max(0, frame - delay), [0, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const tx = interpolate(s, [0, 1], [-30, 0]);
  const sc = interpolate(s, [0, 1], [0.92, 1]);
  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${tx}px) scale(${sc})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 28px",
        borderRadius: 14,
        background: `${verdictColor}0c`,
        border: `1px solid ${verdictColor}33`,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontSans,
          fontSize: 30,
          color: theme.text,
          flex: 1,
        }}
      >
        {condition}
      </div>
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 24,
          fontWeight: 800,
          color: verdictColor,
          padding: "8px 20px",
          borderRadius: 8,
          background: `${verdictColor}1a`,
          border: `1px solid ${verdictColor}55`,
          letterSpacing: 2,
          marginLeft: 28,
          whiteSpace: "nowrap",
        }}
      >
        {verdict}
      </div>
    </div>
  );
};

// ─── Phase 3: Conservative Drift (BREAK→FIX) ─────────────────────────────────

const MetricBar: React.FC<{
  label: string;
  value: number;
  color: string;
  subtext: string;
}> = ({ label, value, color, subtext }) => (
  <div style={{ marginBottom: 20 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8,
        fontFamily: theme.fontMono,
        fontSize: 24,
        color: theme.textMuted,
      }}
    >
      <span>{label}</span>
      <span style={{ color }}>{Math.round(value)}%</span>
    </div>
    <div
      style={{
        width: "100%",
        height: 20,
        borderRadius: 10,
        background: theme.border,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          borderRadius: 10,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 12px ${color}55`,
          transition: "none",
        }}
      />
    </div>
    <div
      style={{
        fontFamily: theme.fontSans,
        fontSize: 22,
        color: theme.textDim,
        marginTop: 6,
      }}
    >
      {subtext}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const Scene6WhatItIsAbout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase boundaries (frames)
  const P1_START = 0;
  const P1_END = 180;
  const P2_START = 210;
  const P2_END = 390;
  const P3_START = 420;
  const P3_END = 630;
  const P4_START = 660;

  // ── Phase opacities (with cross-fade overlap) ──────────────────────────────
  const phase1Op = interpolate(
    frame,
    [P1_START, P1_START + 20, P1_END - 20, P1_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const phase2Op = interpolate(
    frame,
    [P2_START - 10, P2_START + 20, P2_END - 20, P2_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const phase3Op = interpolate(
    frame,
    [P3_START - 10, P3_START + 20, P3_END - 20, P3_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const phase4Op = interpolate(
    frame,
    [P4_START - 10, P4_START + 25, 860, 900],
    [0, 1, 1, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Phase 1: Workflow vs Loop ─────────────────────────────────────────────
  // Workflow column starts at frame 10, loop column starts at frame 40
  const wfLabelOp = interpolate(Math.max(0, frame - 10), [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const loopLabelOp = interpolate(Math.max(0, frame - 40), [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Workflow nodes: frames 15, 40, 65, 90 with arrows between
  const wfNodeDelays = [15, 40, 65, 90];
  const wfArrowDelays = [28, 53, 78];

  // Loop nodes: frames 45, 70, 95, 120 with arrows and a curved "loop back"
  const loopNodeDelays = [45, 70, 95, 120];
  const loopArrowDelays = [58, 83, 108];

  // Loop-back curve opacity
  const loopBackOp = interpolate(Math.max(0, frame - 130), [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phase 3: Conservative drift animation ────────────────────────────────
  // Metric bar fills up looking healthy (0→78%), then the "output" label reveals timid
  const metricProgress = interpolate(Math.max(0, frame - P3_START), [0, fps * 3], [0, 78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const iterCount = Math.floor(
    interpolate(Math.max(0, frame - P3_START), [0, fps * 4], [0, 47], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const timidLabelOp = interpolate(Math.max(0, frame - (P3_START + fps * 4.5)), [0, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const driftTitleOp = interpolate(Math.max(0, frame - (P3_START + fps * 2)), [0, fps * 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fixRevealOp = interpolate(Math.max(0, frame - (P3_END - fps * 3)), [0, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phase 4: Punchline pulse ──────────────────────────────────────────────
  const punchPop = pop(frame, fps, P4_START, { damping: 13, stiffness: 120, mass: 1.1 });
  const punchScale = interpolate(punchPop, [0, 1], [0.78, 1]);
  const line2Pop = pop(frame, fps, P4_START + 18, { damping: 13, stiffness: 120, mass: 1.1 });
  const line2Scale = interpolate(line2Pop, [0, 1], [0.78, 1]);
  const pulse4 = 1 + 0.022 * Math.sin(frame / 9);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      {/* ── SFX cues ── */}
      <Sfx name="whoosh" at={P2_START - 5} volume={0.35} />
      <Sfx name="alarm" at={P3_START + fps * 4} volume={0.38} />
      <Sfx name="stinger" at={P4_START + 5} volume={0.48} />
      <Sfx name="pop" at={P2_START + 8} volume={0.30} />
      <Sfx name="tick" at={P3_START + 10} volume={0.28} />

      <CameraRig intensity={0.7}>
        {/* ════════════════════════════════════════════════════════════════════
            SCENE HEADING — always visible up top
        ════════════════════════════════════════════════════════════════════ */}
        <SceneHeading kicker="loop engineering" accent={theme.accentWarm} delay={0} size={52}>
          What it&#39;s really{" "}
          <span style={gradientText(theme.accentWarm, "#fde68a")}>about</span>
        </SceneHeading>

        {/* ════════════════════════════════════════════════════════════════════
            PHASE 1 — Workflow vs Loop
        ════════════════════════════════════════════════════════════════════ */}
        <AbsoluteFill
          style={{
            opacity: phase1Op,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 188,
              left: 0,
              right: 0,
              bottom: 165,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 100,
            }}
          >
            {/* Workflow column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
              <div
                style={{
                  opacity: wfLabelOp,
                  fontFamily: theme.fontMono,
                  fontSize: 28,
                  color: theme.accent,
                  letterSpacing: 3,
                  textTransform: "uppercase" as const,
                  marginBottom: 12,
                }}
              >
                Workflow
              </div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textDim, marginBottom: 16, opacity: wfLabelOp }}>
                deterministic pipeline
              </div>
              {/* Workflow nodes in a row */}
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                {WORKFLOW_STEPS.map((step, i) => {
                  const elements: React.ReactNode[] = [];
                  if (i > 0) {
                    elements.push(
                      <Arrow
                        key={`arrow-${i}`}
                        color={theme.accent}
                        frame={frame}
                        fps={fps}
                        delay={wfArrowDelays[i - 1]}
                      />
                    );
                  }
                  elements.push(
                    <PipelineNode
                      key={step}
                      label={step}
                      color={theme.accent}
                      frame={frame}
                      fps={fps}
                      delay={wfNodeDelays[i]}
                    />
                  );
                  return elements;
                })}
              </div>
              {/* Fixed path tag */}
              <div
                style={{
                  opacity: interpolate(Math.max(0, frame - 100), [0, fps * 0.5], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  marginTop: 18,
                  padding: "10px 24px",
                  borderRadius: 10,
                  background: `${theme.accent}18`,
                  border: `1px solid ${theme.accent}44`,
                  fontFamily: theme.fontSans,
                  fontSize: 26,
                  color: theme.accent,
                }}
              >
                path known at design time
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: 2,
                height: 440,
                background: `linear-gradient(to bottom, transparent, ${theme.border}, transparent)`,
                opacity: interpolate(Math.max(0, frame - 30), [0, fps * 0.4], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />

            {/* Loop column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
              <div
                style={{
                  opacity: loopLabelOp,
                  fontFamily: theme.fontMono,
                  fontSize: 28,
                  color: theme.accentWarm,
                  letterSpacing: 3,
                  textTransform: "uppercase" as const,
                  marginBottom: 12,
                }}
              >
                Loop
              </div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textDim, marginBottom: 16, opacity: loopLabelOp }}>
                path discovered at runtime
              </div>
              {/* Loop nodes in a row */}
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                {LOOP_STEPS.map((step, i) => {
                  const elements: React.ReactNode[] = [];
                  if (i > 0) {
                    elements.push(
                      <Arrow
                        key={`larrow-${i}`}
                        color={theme.accentWarm}
                        frame={frame}
                        fps={fps}
                        delay={loopArrowDelays[i - 1]}
                      />
                    );
                  }
                  elements.push(
                    <PipelineNode
                      key={step + i}
                      label={step}
                      color={theme.accentWarm}
                      frame={frame}
                      fps={fps}
                      delay={loopNodeDelays[i]}
                      isUnknown={step === "?"}
                    />
                  );
                  return elements;
                })}
              </div>
              {/* Loop-back arc indicator */}
              <div
                style={{
                  opacity: loopBackOp,
                  marginTop: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 340,
                    height: 36,
                    border: `2px dashed ${theme.accentWarm}55`,
                    borderTop: "none",
                    borderRadius: "0 0 18px 18px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -8,
                      bottom: -8,
                      width: 0,
                      height: 0,
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderRight: `12px solid ${theme.accentWarm}88`,
                    }}
                  />
                </div>
              </div>
              {/* Unknown path tag */}
              <div
                style={{
                  opacity: loopBackOp,
                  padding: "10px 24px",
                  borderRadius: 10,
                  background: `${theme.accentWarm}18`,
                  border: `1px solid ${theme.accentWarm}44`,
                  fontFamily: theme.fontSans,
                  fontSize: 26,
                  color: theme.accentWarm,
                }}
              >
                path unknown until runtime
              </div>
            </div>
          </div>
        </AbsoluteFill>

        {/* ════════════════════════════════════════════════════════════════════
            PHASE 2 — Decision Matrix
        ════════════════════════════════════════════════════════════════════ */}
        <AbsoluteFill
          style={{
            opacity: phase2Op,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 190,
              left: 180,
              right: 180,
              bottom: 165,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: theme.fontMono,
                fontSize: 26,
                color: theme.textDim,
                letterSpacing: 4,
                textTransform: "uppercase" as const,
                marginBottom: 28,
                opacity: interpolate(Math.max(0, frame - P2_START), [0, fps * 0.5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Decision rule
            </div>
            {DECISION_ROWS.map((row, i) => (
              <DecisionRow
                key={row.condition}
                condition={row.condition}
                verdict={row.verdict}
                verdictColor={row.verdictColor}
                frame={frame}
                fps={fps}
                delay={P2_START + 10 + i * fps * 0.9}
              />
            ))}
          </div>
        </AbsoluteFill>

        {/* ════════════════════════════════════════════════════════════════════
            PHASE 3 — Conservative Drift (BREAK→FIX)
        ════════════════════════════════════════════════════════════════════ */}
        <AbsoluteFill
          style={{
            opacity: phase3Op,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 190,
              left: 160,
              right: 160,
              bottom: 165,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* "Conservative Drift" heading */}
            <div
              style={{
                opacity: driftTitleOp,
                transform: `translateY(${(1 - driftTitleOp) * 16}px)`,
                marginBottom: 36,
              }}
            >
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 26,
                  color: theme.accentRed,
                  letterSpacing: 4,
                  textTransform: "uppercase" as const,
                  marginBottom: 10,
                }}
              >
                Karpathy&#39;s AutoResearch — failure mode
              </div>
              <div
                style={{
                  fontFamily: theme.fontSans,
                  fontSize: 34,
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                Metrics looked{" "}
                <span style={{ color: theme.accentGreen }}>healthy</span>.
                Output was{" "}
                <span style={{ color: theme.accentRed }}>timid</span>.
              </div>
            </div>

            {/* Two-column: metrics (healthy-looking) vs actual output */}
            <div style={{ display: "flex", gap: 60 }}>
              {/* Left: healthy metrics */}
              <div
                style={{
                  flex: 1,
                  padding: "28px 32px",
                  borderRadius: 18,
                  background: `${theme.accentGreen}0c`,
                  border: `1px solid ${theme.accentGreen}33`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 24,
                    color: theme.accentGreen,
                    letterSpacing: 2,
                    marginBottom: 22,
                  }}
                >
                  METRICS — looks fine
                </div>
                <MetricBar
                  label="Loop iterations"
                  value={Math.min(iterCount * 1.7, 94)}
                  color={theme.accentGreen}
                  subtext={`${iterCount} iters — terminated cleanly`}
                />
                <MetricBar
                  label="Completion score"
                  value={metricProgress}
                  color={theme.accentGreen}
                  subtext="within expected range"
                />
                <div
                  style={{
                    marginTop: 18,
                    padding: "12px 18px",
                    borderRadius: 10,
                    background: `${theme.accentGreen}14`,
                    border: `1px solid ${theme.accentGreen}44`,
                    fontFamily: theme.fontSans,
                    fontSize: 26,
                    color: theme.accentGreen,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 22 }}>✓</span> Loop ran. Terminated cleanly.
                </div>
              </div>

              {/* Right: actual output — timid */}
              <div
                style={{
                  flex: 1,
                  padding: "28px 32px",
                  borderRadius: 18,
                  background: `${theme.accentRed}0c`,
                  border: `1px solid ${theme.accentRed}33`,
                  opacity: timidLabelOp,
                  transform: `translateY(${(1 - timidLabelOp) * 14}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 24,
                    color: theme.accentRed,
                    letterSpacing: 2,
                    marginBottom: 22,
                  }}
                >
                  ACTUAL OUTPUT
                </div>
                {[
                  "Marginal param tweak: lr 0.001→0.0009",
                  "Safe adjustment: batch size -2",
                  "Micro change: dropout 0.1→0.09",
                ].map((line, i) => (
                  <div
                    key={line}
                    style={{
                      opacity: interpolate(
                        Math.max(0, frame - (P3_START + fps * 4.5 + i * fps * 0.5)),
                        [0, fps * 0.5],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                      ),
                      padding: "12px 16px",
                      marginBottom: 12,
                      borderRadius: 10,
                      background: `${theme.accentRed}0e`,
                      border: `1px solid ${theme.accentRed}22`,
                      fontFamily: theme.fontMono,
                      fontSize: 22,
                      color: theme.textMuted,
                    }}
                  >
                    {line}
                  </div>
                ))}
                {/* The actual insight */}
                <div
                  style={{
                    marginTop: 14,
                    opacity: fixRevealOp,
                    transform: `translateY(${(1 - fixRevealOp) * 10}px)`,
                    padding: "14px 18px",
                    borderRadius: 10,
                    background: `${theme.accentRed}1e`,
                    border: `1px solid ${theme.accentRed}77`,
                    fontFamily: theme.fontSans,
                    fontSize: 26,
                    fontWeight: 700,
                    color: theme.accentRed,
                    lineHeight: 1.4,
                  }}
                >
                  Optimizing for looking done,
                  <br />
                  not being done.
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>

        {/* ════════════════════════════════════════════════════════════════════
            PHASE 4 — Punchline hero
        ════════════════════════════════════════════════════════════════════ */}
        <AbsoluteFill
          style={{
            opacity: phase4Op,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 165,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
            }}
          >
            {/* Kicker */}
            <div
              style={{
                opacity: interpolate(Math.max(0, frame - P4_START), [0, fps * 0.6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                fontFamily: theme.fontMono,
                fontSize: 26,
                color: theme.textDim,
                letterSpacing: 5,
                textTransform: "uppercase" as const,
                marginBottom: 48,
              }}
            >
              The deeper shift
            </div>

            {/* Line 1: "You're no longer writing prompts." */}
            <div
              style={{
                opacity: phase4Op,
                transform: `scale(${punchScale * pulse4})`,
                fontFamily: theme.fontSans,
                fontSize: 72,
                fontWeight: 900,
                color: theme.textMuted,
                textAlign: "center",
                letterSpacing: -1,
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              You&#39;re no longer writing{" "}
              <span
                style={{
                  ...gradientText(theme.textDim, theme.text),
                  textDecoration: "line-through",
                  textDecorationColor: `${theme.accentRed}cc`,
                  textDecorationThickness: 4,
                }}
              >
                prompts
              </span>
              .
            </div>

            {/* Arrow between lines */}
            <div
              style={{
                opacity: interpolate(Math.max(0, frame - (P4_START + 12)), [0, fps * 0.4], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                fontSize: 48,
                color: theme.accentWarm,
                marginBottom: 20,
                transform: `scale(${pulse4})`,
              }}
            >
              ↓
            </div>

            {/* Line 2: "programs that write prompts." */}
            <div
              style={{
                opacity: phase4Op,
                transform: `scale(${line2Scale * pulse4})`,
                fontFamily: theme.fontSans,
                fontSize: 72,
                fontWeight: 900,
                textAlign: "center",
                letterSpacing: -1,
                lineHeight: 1.1,
              }}
            >
              You&#39;re writing{" "}
              <span style={gradientText(theme.accentWarm, "#fde68a")}>
                programs
              </span>{" "}
              that write{" "}
              <span style={gradientText(theme.accent, "#c7d2fe")}>
                prompts
              </span>
              .
            </div>

            {/* Underline accent */}
            <div
              style={{
                marginTop: 38,
                width: interpolate(Math.max(0, frame - (P4_START + 20)), [0, fps * 1], [0, 560], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: EASE_OUT,
                }),
                height: 5,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${theme.accentWarm}, ${theme.accent})`,
                boxShadow: `0 0 22px ${theme.accentWarm}99`,
              }}
            />
          </div>
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};
