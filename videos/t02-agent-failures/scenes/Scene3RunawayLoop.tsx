import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 3 - Failure 1: Runaway Loop  (BREAK -> FIX demonstration)
// Timed to the s03 narration transcript (whisper). Phases (seconds):
// Phase 0 (0-6):     title + "no natural stop" ("agentic loop has no stopping condition").
// Phase 1 (6-35):    NAIVE run - iterations/meters climb; cost math; blowup/panic ~30-35
//                    ("happily loop until your credit card does").
// Phase 2 (35-37):   "replay WITH guards" wipe ("the fix has two parts").
// Phase 3 (37-69):   GUARDED run - iterations settle to 3 (iteration-limit narration
//                    37-54); stall chip @56, no-progress @60, HALT @63 (stall narration).
// Phase 4 (69-124):  punchline - three meters fill (69-84), framework chips (~85-99),
//                    "smartest stop is progress" caption (~99), holds through close.

const METERS = [
  { label: "STEPS",      cap: "25",   naive: 1.7, guard: 0.12, color: theme.tokenColors[4] },
  { label: "TOKENS / $", cap: "50K",  naive: 1.9, guard: 0.20, color: theme.accentWarm },
  { label: "TIME",       cap: "120s", naive: 1.5, guard: 0.10, color: theme.accentGreen },
];

const GUARDS = [
  { label: "token cap",     fires: false, fireAt: 0 },
  { label: "wall-clock",    fires: false, fireAt: 0 },
  { label: "stall detect",  fires: true,  fireAt: 56 }, // seconds
  { label: "no-progress",   fires: true,  fireAt: 60 },
];

export const Scene3RunawayLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = fps;

  // ---- phase boundaries (frames) - re-paced to the ~124.7s narration (s03) ----
  const tIntro = 6 * S;
  const tBlow = 30 * S;       // late-naive blowup: panic pulse + "NO STOP" status
  const tNaiveEnd = 35 * S;
  const tWipeEnd = 37 * S;
  const haltFrame = 63 * S;   // guards halt the loop
  const punchStart = 69 * S;

  const guarded = frame >= tWipeEnd;

  // ---- run dynamics ----
  const naiveP = interpolate(frame, [tIntro, tNaiveEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const naiveAccel = Math.pow(naiveP, 1.4); // accelerate into the blowup
  const guardProg = guarded ? interpolate(frame, [tWipeEnd, haltFrame], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const halted = frame >= haltFrame;

  const iterShown = guarded ? Math.min(3, Math.round(guardProg * 3.4)) : Math.round(312 * naiveAccel);
  const costShown = guarded ? 2.4 * guardProg : 40.17 * naiveAccel;

  const fillFor = (m: (typeof METERS)[number]) => (guarded ? m.guard * guardProg : m.naive * naiveAccel);

  // naive panic pulse after the blowup
  const panic = !guarded && frame > tBlow ? 0.5 + 0.5 * Math.sin(frame / 4) : 0;

  // ---- intro subtitle ----
  const introT = interpolate(frame, [S * 1.0, S * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const introOut = interpolate(frame, [tIntro - S * 0.6, tIntro + S * 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---- replay wipe (13-15s) ----
  const wipeP = interpolate(frame, [tNaiveEnd, tWipeEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipeBell = Math.sin(wipeP * Math.PI); // 0->1->0
  const wipePop = pop(frame, fps, tNaiveEnd + S * 0.2, { damping: 11 });

  // ---- guarded halt banner ----
  const stallPop = pop(frame, fps, haltFrame, { damping: 11, stiffness: 160 });

  // ---- punchline overlay ----
  const punchScrim = interpolate(frame, [punchStart, punchStart + S * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchHeadT = interpolate(frame, [punchStart + S * 0.2, punchStart + S * 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chipsPop = pop(frame, fps, punchStart + S * 16, { damping: 12, stiffness: 140 });
  const punchCapT = interpolate(frame, [punchStart + S * 30, punchStart + S * 31.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchMeter = (delay: number, to: number) =>
    interpolate(frame, [punchStart + delay, punchStart + delay + S * 2.6], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const panelOpacity = 1 - punchScrim;
  const modeColor = guarded ? theme.accentGreen : theme.accentRed;

  // naive iteration ticks (spread across the long naive run, quickening to the blowup)
  const TICKS = [7, 10, 13, 16, 19, 22, 25, 27, 29, 31, 32.5, 34];

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      {/* ---- SFX cues (scene-local) ---- */}
      {TICKS.map((t, i) => (
        <Sfx key={`tk${i}`} name="tick" at={S * t} volume={0.28} />
      ))}
      <Sfx name="alarm" at={S * 30} volume={0.4} />
      <Sfx name="error" at={S * 35} volume={0.5} />
      <Sfx name="whoosh" at={S * 36} volume={0.45} />
      <Sfx name="pop" at={S * 37} volume={0.4} />
      <Sfx name="success" at={S * 56} volume={0.4} />
      <Sfx name="block" at={S * 63} volume={0.5} />
      <Sfx name="success" at={S * 70} volume={0.35} />
      <Sfx name="success" at={S * 74} volume={0.35} />
      <Sfx name="success" at={S * 78} volume={0.35} />
      <Sfx name="pop" at={S * 86} volume={0.35} />
      <Sfx name="pop" at={S * 90} volume={0.35} />
      <Sfx name="pop" at={S * 94} volume={0.35} />
      <Sfx name="success" at={S * 110} volume={0.35} />
      <Sfx name="stinger" at={S * 114} volume={0.4} />

      <CameraRig>
        <SceneHeading kicker="failure 1" accent={theme.accentWarm}>
          Runaway <span style={gradientText("#fcd34d", theme.accentWarm)}>Loop</span>
        </SceneHeading>

        {/* intro subtitle */}
        <div style={{
          position: "absolute", top: 250, width: "100%", textAlign: "center",
          opacity: introT * introOut, fontFamily: theme.fontSans, fontSize: 38, color: theme.textMuted,
        }}>
          The agentic loop has <span style={{ color: theme.accentWarm, fontWeight: 700 }}>no natural stop.</span>
        </div>

        {/* ===== RUN PANEL (naive + guarded) ===== */}
        {frame > tIntro - S * 0.3 && punchScrim < 1 && (
          <div style={{ opacity: panelOpacity }}>
            {/* mode badge + readouts row */}
            <div style={{
              position: "absolute", top: 236, left: 0, right: 0,
              display: "flex", justifyContent: "center", alignItems: "center", gap: 28,
            }}>
              <div style={{
                padding: "13px 30px", borderRadius: 999, fontFamily: theme.fontMono, fontSize: 28, fontWeight: 800,
                color: modeColor, border: `2px solid ${modeColor}`, background: `${modeColor}1a`,
                letterSpacing: 1, boxShadow: !guarded && panic > 0 ? `0 0 ${panic * 28}px ${theme.accentRed}` : "none",
              }}>
                {guarded ? "▶ GUARDED RUN" : "▶ NO GUARDS"}
              </div>
            </div>

            {/* big readouts: iterations · cost · changes */}
            <div style={{
              position: "absolute", top: 320, left: 0, right: 0,
              display: "flex", justifyContent: "center", gap: 100, fontFamily: theme.fontMono,
            }}>
              {[
                { k: "iterations", v: `${iterShown}`, c: guarded ? theme.text : theme.accentWarm },
                { k: "cost", v: `$${costShown.toFixed(2)}`, c: guarded ? theme.accentGreen : theme.accentRed },
                { k: "changes", v: "0", c: theme.accentRed },
              ].map((r) => (
                <div key={r.k} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 27, color: theme.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>{r.k}</div>
                  <div style={{ fontSize: 92, fontWeight: 800, color: r.c, lineHeight: 1.1 }}>{r.v}</div>
                </div>
              ))}
            </div>

            {/* three meters */}
            <div style={{ position: "absolute", top: 500, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 44 }}>
              {METERS.map((m) => {
                const fill = fillFor(m);
                const over = fill > 1;
                const barColor = over ? theme.accentRed : guarded ? theme.accentGreen : m.color;
                return (
                  <div key={m.label} style={{
                    width: 490, padding: "32px 38px", borderRadius: 20,
                    background: `linear-gradient(160deg, ${theme.surface}, #100e0a)`,
                    border: `1px solid ${over ? theme.accentRed + "88" : theme.border}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, fontFamily: theme.fontMono }}>
                      <span style={{ fontSize: 30, fontWeight: 800, color: barColor, letterSpacing: 1 }}>{m.label}</span>
                      <span style={{ fontSize: 24, color: over ? theme.accentRed : theme.textMuted }}>
                        {over ? "OVER ⚠" : `cap ${m.cap}`}
                      </span>
                    </div>
                    <div style={{ height: 44, borderRadius: 10, background: "#1c1813", overflow: "hidden", border: `1px solid ${theme.border}` }}>
                      <div style={{
                        width: `${Math.min(100, fill * 100)}%`, height: "100%", background: barColor,
                        boxShadow: `0 0 16px ${barColor}aa`,
                        opacity: over ? 0.7 + panic * 0.3 : 1,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* status line under meters */}
            <div style={{
              position: "absolute", top: 680, width: "100%", textAlign: "center", fontFamily: theme.fontMono,
            }}>
              {!guarded ? (
                <span style={{ fontSize: 38, fontWeight: 800, color: theme.accentRed, opacity: 0.6 + panic * 0.4 }}>
                  {frame > tBlow ? "✗ NO STOP - still running, still billing" : "burning tokens in circles…"}
                </span>
              ) : (
                <span style={{ fontSize: 34, color: theme.textMuted }}>
                  {halted ? "" : "running under guards…"}
                </span>
              )}
            </div>

            {/* guarded: guard chips + halt banner */}
            {guarded && (
              <>
                <div style={{ position: "absolute", top: 742, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
                  {GUARDS.map((g) => {
                    const lit = g.fires && frame >= g.fireAt * S;
                    const c = lit ? theme.accentGreen : theme.textDim;
                    return (
                      <div key={g.label} style={{
                        padding: "13px 28px", borderRadius: 999, fontFamily: theme.fontMono, fontSize: 24,
                        color: c, border: `1px solid ${c}`, background: lit ? `${theme.accentGreen}1a` : "transparent",
                        boxShadow: lit ? `0 0 18px ${theme.accentGreen}66` : "none",
                      }}>
                        {lit ? "✓ " : ""}{g.label}
                      </div>
                    );
                  })}
                </div>
                {halted && (
                  <div style={{
                    position: "absolute", top: 832, left: "50%",
                    transform: `translateX(-50%) scale(${0.9 + stallPop * 0.1})`, opacity: stallPop,
                    padding: "12px 44px", borderRadius: 16, textAlign: "center",
                    background: `linear-gradient(160deg, ${theme.accentGreen}1f, rgba(10,18,12,0.95))`,
                    border: `2px solid ${theme.accentGreen}`, boxShadow: `0 0 34px ${theme.accentGreen}55`,
                    fontFamily: theme.fontMono, fontSize: 33, fontWeight: 800, color: theme.accentGreen, letterSpacing: 1,
                  }}>
                    ⏸ HALTED at iter 3 - asked the human
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===== replay wipe (13-15s) ===== */}
        {wipeP > 0.001 && wipeP < 0.999 && (
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            <AbsoluteFill style={{ background: `radial-gradient(circle at center, ${theme.accentWarm}22, transparent 60%)`, opacity: wipeBell }} />
            <div style={{
              position: "absolute", top: "50%", left: 0, right: 0, textAlign: "center",
              transform: `translateY(-50%) scale(${0.9 + wipePop * 0.1})`, opacity: wipeBell,
              fontFamily: theme.fontSans, fontSize: 52, fontWeight: 800, color: theme.text,
            }}>
              ↺ Replay - now <span style={{ color: theme.accentGreen }}>WITH guards</span>
            </div>
          </AbsoluteFill>
        )}

        {/* ===== punchline (30s+) ===== */}
        {punchScrim > 0.001 && (
          <AbsoluteFill style={{ opacity: punchScrim, pointerEvents: "none" }}>
            <AbsoluteFill style={{ background: "rgba(10,10,10,0.92)" }} />
            <div style={{
              position: "absolute", top: 170, width: "100%", textAlign: "center",
              opacity: punchHeadT, transform: `translateY(${(1 - punchHeadT) * 16}px)`,
              fontFamily: theme.fontSans, fontSize: 64, fontWeight: 800, color: theme.text,
            }}>
              Budget all <span style={{ color: theme.accentWarm }}>three.</span> Stop on <span style={{ color: theme.accentGreen }}>progress.</span>
            </div>

            <div style={{ position: "absolute", top: 350, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 44 }}>
              {[
                { label: "STEPS", to: 0.55, color: theme.tokenColors[4], delay: S * 1.5 },
                { label: "TOKENS / $", to: 0.7, color: theme.accentWarm, delay: S * 5.0 },
                { label: "TIME", to: 0.42, color: theme.accentGreen, delay: S * 8.5 },
              ].map((m) => (
                <div key={m.label} style={{ width: 490, padding: "34px 40px", borderRadius: 20, background: `linear-gradient(160deg, ${theme.surface}, #100e0a)`, border: `1px solid ${theme.border}` }}>
                  <div style={{ fontFamily: theme.fontMono, fontSize: 30, fontWeight: 800, color: m.color, marginBottom: 20, letterSpacing: 1 }}>{m.label}</div>
                  <div style={{ height: 46, borderRadius: 10, background: "#1c1813", overflow: "hidden", border: `1px solid ${theme.border}` }}>
                    <div style={{ width: `${punchMeter(m.delay, m.to) * 100}%`, height: "100%", background: m.color, boxShadow: `0 0 14px ${m.color}aa` }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              position: "absolute", top: 610, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26,
              opacity: chipsPop, transform: `translateY(${(1 - chipsPop) * 16}px)`,
            }}>
              {["LangGraph · recursion_limit 25", "AutoGen · token + timeout", "OpenAI SDK · max_turns"].map((c) => (
                <div key={c} style={{ padding: "16px 30px", borderRadius: 999, background: `${theme.accentWarm}14`, border: `1px solid ${theme.accentWarm}55`, fontFamily: theme.fontMono, fontSize: 26, color: theme.accentWarm }}>{c}</div>
              ))}
            </div>

            <div style={{
              position: "absolute", top: 780, width: "100%", textAlign: "center",
              opacity: punchCapT, fontFamily: theme.fontSans, fontSize: 40, fontWeight: 700, color: theme.text, padding: "0 160px",
            }}>
              The smartest stop isn't a counter - <span style={{ color: theme.accentGreen }}>it's progress.</span>
            </div>
          </AbsoluteFill>
        )}
      </CameraRig>
    </AbsoluteFill>
  );
};
