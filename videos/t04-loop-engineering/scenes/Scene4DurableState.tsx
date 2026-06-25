import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT, ModelCore } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";
import React from "react";

export const Scene4DurableState: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing (frames)
  // Phase 1: RAM volatile (0-180)
  // Phase 2: Filesystem persistent (180-420)
  // Phase 3: Checkpoint/Resume (420-660)
  // Phase 4: Idempotent keys (660-900)

  const PHASE1_START = 0;
  const PHASE1_END = 180;
  const PHASE2_START = 180;
  const PHASE2_END = 420;
  const PHASE3_START = 420;
  const PHASE3_END = 660;
  const PHASE4_START = 660;
  const PHASE4_END = 900;

  // Cross-fade helpers
  const phase1Opacity = interpolate(frame, [PHASE1_END - 12, PHASE1_END + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase2Opacity = interpolate(frame, [PHASE2_START - 12, PHASE2_START + 12, PHASE2_END - 12, PHASE2_END + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase3Opacity = interpolate(frame, [PHASE3_START - 12, PHASE3_START + 12, PHASE3_END - 12, PHASE3_END + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase4Opacity = interpolate(frame, [PHASE4_START - 12, PHASE4_START + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 1: RAM volatile animation
  const ramPop = pop(frame, fps, 5);
  const crashDelay = 90;
  const crashFrame = Math.max(0, frame - crashDelay);
  const crashPop = pop(crashFrame, fps, 0);
  const crashShake = interpolate(
    Math.max(0, frame - crashDelay - 10),
    [0, 4, 8, 12, 16, 20],
    [0, -10, 10, -6, 6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ramFade = interpolate(Math.max(0, frame - crashDelay - 8), [0, 20], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stateLostOpacity = interpolate(Math.max(0, frame - crashDelay - 18), [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stateItemsOpacity = interpolate(Math.max(0, frame - 20), [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // RAM memory counters ticking up then zeroing out
  const memUsage = interpolate(Math.max(0, frame - 10), [0, 70], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const memAfterCrash = interpolate(Math.max(0, frame - crashDelay - 5), [0, 10], [memUsage, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayMem = frame > crashDelay + 5 ? memAfterCrash : memUsage;

  // Phase 2: Filesystem files appearing
  const specPop = pop(Math.max(0, frame - PHASE2_START - 10), fps, 0);
  const progressPop = pop(Math.max(0, frame - PHASE2_START - 25), fps, 0);
  const constraintsPop = pop(Math.max(0, frame - PHASE2_START - 40), fps, 0);
  const p2WritePulse = interpolate(
    (frame - PHASE2_START) % 45,
    [0, 10, 20, 45],
    [1, 1.04, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const p2ArrowOpacity = interpolate(Math.max(0, frame - PHASE2_START - 60), [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: Checkpoint / Resume
  const stepsTotal = 50;
  const crashStep = 23;
  const p3f = Math.max(0, frame - PHASE3_START);
  // Steps tick up to 23 then crash
  const runningSteps = interpolate(p3f, [10, 90], [0, crashStep], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p3CrashDelay = 100;
  const p3CrashFrame = Math.max(0, p3f - p3CrashDelay);
  const p3CrashShake = interpolate(p3CrashFrame, [0, 4, 8, 12, 16], [0, -8, 8, -4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p3CrashFade = interpolate(p3CrashFrame, [0, 15], [1, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resumeDelay = 140;
  const p3ResumeFrame = Math.max(0, p3f - resumeDelay);
  const resumeOpacity = interpolate(p3ResumeFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resumingSteps = interpolate(p3ResumeFrame, [15, 80], [crashStep, stepsTotal], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displaySteps = p3f > resumeDelay ? Math.floor(resumingSteps) : Math.floor(runningSteps);
  const stepBarWidth = (displaySteps / stepsTotal) * 100;
  const p3CheckpointPop = pop(Math.max(0, p3f - 5), fps, 0);
  const successBadgeOpacity = interpolate(Math.max(0, p3f - resumeDelay + 70), [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4: Idempotent keys
  const p4f = Math.max(0, frame - PHASE4_START);
  const idemKeyPop = pop(p4f, fps, 5);
  const upsertPop = pop(Math.max(0, p4f - 20), fps, 0);
  const keyPulsate = interpolate((p4f % 40), [0, 20, 40], [1, 1.03, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const writeAttempt1 = interpolate(Math.max(0, p4f - 30), [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const writeAttempt2 = interpolate(Math.max(0, p4f - 70), [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dedupeOpacity = interpolate(Math.max(0, p4f - 100), [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.fontSans, overflow: "hidden" }}>
      <SceneBackground />
      <Sfx name="pop" at={5} volume={0.4} />
      <Sfx name="error" at={crashDelay + 10} volume={0.6} />
      <Sfx name="whoosh" at={PHASE2_START + 5} volume={0.3} />
      <Sfx name="tick" at={PHASE3_START + 10} volume={0.35} />
      <Sfx name="error" at={PHASE3_START + p3CrashDelay + 5} volume={0.5} />
      <Sfx name="success" at={PHASE3_START + resumeDelay + 80} volume={0.5} />
      <Sfx name="whoosh" at={PHASE4_START + 5} volume={0.3} />
      <Sfx name="pop" at={PHASE4_START + 100} volume={0.4} />

      <CameraRig>
        <AbsoluteFill>
          {/* Scene Heading */}
          <div style={{ position: "absolute", top: 48, left: 0, right: 0, textAlign: "center" }}>
            <SceneHeading kicker="Agent Loops" accent="Durable State" delay={0} size="md">
              {""}
            </SceneHeading>
          </div>

          {/* ─── PHASE 1: RAM is Volatile ─── */}
          <AbsoluteFill style={{ opacity: phase1Opacity }}>
            <div style={{
              position: "absolute",
              top: 160,
              left: 0, right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}>
              {/* Label */}
              <div style={{
                fontSize: 36,
                color: theme.textMuted,
                fontWeight: 600,
                opacity: pop(frame, fps, 3),
              }}>
                Process memory lives <span style={gradientText(theme.accentRed, "#ff5500")}>in RAM</span>
              </div>

              {/* RAM Box */}
              <div style={{
                transform: `scale(${ramPop}) translateX(${crashShake}px)`,
                opacity: ramFade,
                background: theme.surface,
                border: `2px solid ${frame > crashDelay ? theme.accentRed : theme.accent}`,
                borderRadius: 18,
                padding: "28px 48px",
                minWidth: 520,
                boxShadow: frame > crashDelay ? `0 0 32px ${theme.accentRed}55` : `0 0 24px ${theme.accent}33`,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>💾</span>
                  <span>RAM</span>
                  <span style={{
                    marginLeft: "auto",
                    fontFamily: theme.fontMono,
                    fontSize: 22,
                    color: displayMem > 90 ? theme.accentRed : theme.accentGreen,
                  }}>
                    {Math.round(displayMem)}%
                  </span>
                </div>
                {/* Memory bar */}
                <div style={{ background: "#1e1e1e", borderRadius: 6, height: 12, marginBottom: 18, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${displayMem}%`,
                    background: displayMem > 90 ? theme.accentRed : theme.accent,
                    borderRadius: 6,
                    transition: "width 0.1s",
                  }} />
                </div>
                {/* State items */}
                <div style={{ opacity: stateItemsOpacity, display: "flex", flexDirection: "column", gap: 8 }}>
                  {["iteration_state = {...}", "tool_results = [...]", "context_window = 13M tokens", "progress_tracker = {...}"].map((item, i) => (
                    <div key={i} style={{
                      fontFamily: theme.fontMono,
                      fontSize: 22,
                      color: theme.textMuted,
                      background: "#0d0d0d",
                      borderRadius: 6,
                      padding: "6px 14px",
                      opacity: interpolate(Math.max(0, frame - 20 - i * 8), [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Crash label */}
              {frame > crashDelay && (
                <div style={{
                  transform: `scale(${crashPop})`,
                  opacity: stateLostOpacity,
                  background: `${theme.accentRed}22`,
                  border: `2px solid ${theme.accentRed}`,
                  borderRadius: 12,
                  padding: "14px 36px",
                  fontSize: 34,
                  fontWeight: 700,
                  color: theme.accentRed,
                  letterSpacing: "0.04em",
                }}>
                  ✕ Process crashed — state gone
                </div>
              )}

              {/* Codex callout */}
              <div style={{
                opacity: interpolate(Math.max(0, frame - 50), [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                fontSize: 26,
                color: theme.textDim,
                fontStyle: "italic",
                marginTop: 8,
              }}>
                OpenAI Codex: 25 hours · 13M tokens — one crash = everything lost
              </div>
            </div>
          </AbsoluteFill>

          {/* ─── PHASE 2: Filesystem as Persistent Store ─── */}
          <AbsoluteFill style={{ opacity: phase2Opacity }}>
            <div style={{
              position: "absolute",
              top: 155,
              left: 0, right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}>
              <div style={{ fontSize: 36, fontWeight: 600, color: theme.textMuted }}>
                Filesystem as <span style={gradientText(theme.accentGreen, "#00f0a0")}>persistent state</span>
              </div>

              <div style={{ display: "flex", gap: 36, alignItems: "flex-start", marginTop: 8 }}>
                {/* Agent box */}
                <div style={{
                  background: theme.surface,
                  border: `2px solid ${theme.accent}`,
                  borderRadius: 16,
                  padding: "22px 32px",
                  minWidth: 200,
                  transform: `scale(${pop(Math.max(0, frame - PHASE2_START), fps, 0)})`,
                  boxShadow: `0 0 20px ${theme.accent}33`,
                }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, textAlign: "center" }}>
                    🤖 Agent
                  </div>
                  <div style={{ fontSize: 22, color: theme.textDim, textAlign: "center", marginTop: 6 }}>
                    fresh context<br />per iteration
                  </div>
                </div>

                {/* Arrows + Labels */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 16 }}>
                  <div style={{
                    opacity: p2ArrowOpacity,
                    fontSize: 26,
                    color: theme.accentGreen,
                    fontFamily: theme.fontMono,
                  }}>reads →</div>
                  <div style={{
                    opacity: p2ArrowOpacity,
                    fontSize: 26,
                    color: theme.accent,
                    fontFamily: theme.fontMono,
                  }}>writes →</div>
                </div>

                {/* Files column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* spec.md — read-only */}
                  <div style={{
                    transform: `scale(${specPop})`,
                    background: theme.surface,
                    border: `2px solid ${theme.accentGreen}`,
                    borderRadius: 14,
                    padding: "16px 28px",
                    minWidth: 320,
                    boxShadow: `0 0 16px ${theme.accentGreen}33`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accentGreen, fontWeight: 700 }}>spec.md</span>
                      <span style={{
                        background: `${theme.accentGreen}22`,
                        color: theme.accentGreen,
                        fontSize: 18,
                        padding: "2px 10px",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}>READ-ONLY</span>
                    </div>
                    <div style={{ fontSize: 22, color: theme.textDim, marginTop: 6 }}>objective · constraints</div>
                  </div>

                  {/* progress.json — checkpointed */}
                  <div style={{
                    transform: `scale(${progressPop}) scale(${p2WritePulse})`,
                    background: theme.surface,
                    border: `2px solid ${theme.accent}`,
                    borderRadius: 14,
                    padding: "16px 28px",
                    minWidth: 320,
                    boxShadow: `0 0 16px ${theme.accent}44`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accent, fontWeight: 700 }}>progress.json</span>
                      <span style={{
                        background: `${theme.accent}22`,
                        color: theme.accent,
                        fontSize: 18,
                        padding: "2px 10px",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}>CHECKPOINTED</span>
                    </div>
                    <div style={{ fontSize: 22, color: theme.textDim, marginTop: 6 }}>step · status · partial results</div>
                  </div>

                  {/* plan.md */}
                  <div style={{
                    transform: `scale(${constraintsPop})`,
                    background: theme.surface,
                    border: `2px solid ${theme.accentWarm}`,
                    borderRadius: 14,
                    padding: "16px 28px",
                    minWidth: 320,
                    boxShadow: `0 0 16px ${theme.accentWarm}22`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accentWarm, fontWeight: 700 }}>plan.md</span>
                      <span style={{
                        background: `${theme.accentWarm}22`,
                        color: theme.accentWarm,
                        fontSize: 18,
                        padding: "2px 10px",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}>REVISITED</span>
                    </div>
                    <div style={{ fontSize: 22, color: theme.textDim, marginTop: 6 }}>plan · decisions · status</div>
                  </div>
                </div>
              </div>

              <div style={{
                opacity: interpolate(Math.max(0, frame - PHASE2_START - 80), [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                fontSize: 28,
                color: theme.textMuted,
                fontStyle: "italic",
                textAlign: "center",
                marginTop: 4,
              }}>
                Fresh context each iteration — filesystem holds the thread
              </div>
            </div>
          </AbsoluteFill>

          {/* ─── PHASE 3: Checkpoint / Resume (BREAK→FIX) ─── */}
          <AbsoluteFill style={{ opacity: phase3Opacity }}>
            <div style={{
              position: "absolute",
              top: 160,
              left: 0, right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}>
              <div style={{ fontSize: 36, fontWeight: 600, color: theme.textMuted }}>
                <span style={gradientText(theme.accent, theme.accentGreen)}>LangGraph Pregel</span>
                {" "}— SQLite / Postgres checkpoint
              </div>

              {/* Step counter + bar */}
              <div style={{
                transform: `scale(${p3CheckpointPop}) translateX(${p3f < resumeDelay && p3f > p3CrashDelay ? p3CrashShake : 0}px)`,
                opacity: p3f > p3CrashDelay ? p3CrashFade : 1,
                background: theme.surface,
                border: `2px solid ${p3f > p3CrashDelay && p3f < resumeDelay ? theme.accentRed : theme.accent}`,
                borderRadius: 18,
                padding: "28px 52px",
                minWidth: 600,
                boxShadow: p3f > p3CrashDelay && p3f < resumeDelay
                  ? `0 0 32px ${theme.accentRed}55`
                  : `0 0 24px ${theme.accent}33`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: theme.text }}>
                    🤖 Agent Process
                  </span>
                  <span style={{
                    fontFamily: theme.fontMono,
                    fontSize: 30,
                    fontWeight: 700,
                    color: displaySteps >= stepsTotal ? theme.accentGreen : theme.accent,
                  }}>
                    Step {displaySteps} / {stepsTotal}
                  </span>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 8, height: 18, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${stepBarWidth}%`,
                    background: displaySteps >= stepsTotal
                      ? theme.accentGreen
                      : (p3f > p3CrashDelay && p3f < resumeDelay ? theme.accentRed : theme.accent),
                    borderRadius: 8,
                    transition: "width 0.08s",
                  }} />
                </div>
                <div style={{ marginTop: 14, fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim }}>
                  checkpoint written at every meaningful step
                </div>
              </div>

              {/* Crash indicator */}
              {p3f > p3CrashDelay && p3f < resumeDelay + 10 && (
                <div style={{
                  opacity: interpolate(Math.max(0, p3f - p3CrashDelay), [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  background: `${theme.accentRed}22`,
                  border: `2px solid ${theme.accentRed}`,
                  borderRadius: 12,
                  padding: "14px 40px",
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.accentRed,
                }}>
                  ✕ Process killed at step {crashStep}
                </div>
              )}

              {/* Resume indicator */}
              {p3f > resumeDelay && (
                <div style={{
                  opacity: resumeOpacity,
                  background: `${theme.accentGreen}22`,
                  border: `2px solid ${theme.accentGreen}`,
                  borderRadius: 12,
                  padding: "14px 40px",
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.accentGreen,
                  transform: `scale(${interpolate(resumeOpacity, [0, 1], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                }}>
                  ↺ Resumed from step {crashStep} — no work lost
                </div>
              )}

              {/* Success */}
              {p3f > resumeDelay + 70 && (
                <div style={{
                  opacity: successBadgeOpacity,
                  fontSize: 30,
                  fontWeight: 600,
                  color: theme.accentGreen,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <span>✓</span>
                  <span>All 50 steps complete</span>
                </div>
              )}

              <div style={{
                opacity: interpolate(Math.max(0, p3f - 30), [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                fontSize: 26,
                color: theme.textDim,
                fontStyle: "italic",
              }}>
                SQLite local · Postgres production
              </div>
            </div>
          </AbsoluteFill>

          {/* ─── PHASE 4: Idempotent Keys ─── */}
          <AbsoluteFill style={{ opacity: phase4Opacity }}>
            <div style={{
              position: "absolute",
              top: 158,
              left: 0, right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
            }}>
              <div style={{ fontSize: 36, fontWeight: 600, color: theme.textMuted }}>
                <span style={gradientText(theme.accent, "#c4b5fd")}>Idempotent tool calls</span>
                {" "}— safe to retry
              </div>

              {/* Idempotency key card */}
              <div style={{
                transform: `scale(${idemKeyPop}) scale(${keyPulsate})`,
                background: theme.surface,
                border: `2px solid ${theme.accent}`,
                borderRadius: 18,
                padding: "24px 48px",
                minWidth: 580,
                boxShadow: `0 0 28px ${theme.accent}44`,
              }}>
                <div style={{ fontSize: 26, color: theme.textMuted, marginBottom: 14, fontWeight: 600 }}>
                  Every write operation carries:
                </div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accent, fontWeight: 700 }}>
                  {`{ idempotency_key: "step-23-create-file" }`}
                </div>
              </div>

              {/* Write attempts */}
              <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                {/* Attempt 1 */}
                <div style={{
                  opacity: writeAttempt1,
                  transform: `scale(${upsertPop})`,
                  background: `${theme.accentGreen}15`,
                  border: `2px solid ${theme.accentGreen}`,
                  borderRadius: 14,
                  padding: "18px 32px",
                  minWidth: 220,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: theme.accentGreen }}>Write #1</div>
                  <div style={{ fontFamily: theme.fontMono, fontSize: 20, color: theme.textMuted, marginTop: 8 }}>UPSERT → ✓ stored</div>
                </div>

                <div style={{
                  opacity: writeAttempt2,
                  fontSize: 32,
                  color: theme.textDim,
                }}>→</div>

                {/* Attempt 2 (retry) */}
                <div style={{
                  opacity: writeAttempt2,
                  background: `${theme.accentWarm}15`,
                  border: `2px solid ${theme.accentWarm}`,
                  borderRadius: 14,
                  padding: "18px 32px",
                  minWidth: 220,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: theme.accentWarm }}>Write #2 (retry)</div>
                  <div style={{ fontFamily: theme.fontMono, fontSize: 20, color: theme.textMuted, marginTop: 8 }}>same key → skip</div>
                </div>

                <div style={{
                  opacity: dedupeOpacity,
                  fontSize: 32,
                  color: theme.textDim,
                }}>→</div>

                {/* Dedupe result */}
                <div style={{
                  opacity: dedupeOpacity,
                  background: `${theme.accentGreen}15`,
                  border: `2px solid ${theme.accentGreen}`,
                  borderRadius: 14,
                  padding: "18px 32px",
                  minWidth: 220,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: theme.accentGreen }}>✓ Safe</div>
                  <div style={{ fontFamily: theme.fontMono, fontSize: 20, color: theme.textMuted, marginTop: 8 }}>no duplicate side-effects</div>
                </div>
              </div>

              {/* Punchline */}
              <div style={{
                opacity: interpolate(Math.max(0, p4f - 110), [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                fontSize: 72,
                fontWeight: 800,
                textAlign: "center",
                lineHeight: 1.1,
                transform: `scale(${interpolate(Math.max(0, p4f - 110), [0, 20], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                ...gradientText(theme.accent, theme.accentGreen),
                marginTop: 8,
              }}>
                Retry freely.
                <br />
                <span style={{ fontSize: 36, color: theme.textMuted, fontWeight: 400 }}>
                  upsert semantics · idempotency keys on every write
                </span>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};
