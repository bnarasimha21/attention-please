import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, SceneHeading, ModelCore, gradientText, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 5 — Agentic Retrieval. Break→fix: classic RAG takes ONE blind shot at a
// 3-hop question and grabs the wrong chunks; the agentic retriever runs a real
// SEARCH loop (reformulate → decompose → search → read → judge → repeat) and
// chains the hops to the right answer. Honest "~3–10× tokens" cost chip.

const clampFade = (frame: number, s: number, e: number) =>
  interpolate(frame, [s, e], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Scene5AgenticRetrieval: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- phase envelopes (no overlap; ~0.4s offset crosses) ----
  const breakOp = Math.min(clampFade(frame, 0, 15), 1 - clampFade(frame, 540, 560));
  const fixOp = Math.min(clampFade(frame, 560, 585), 1 - clampFade(frame, 1760, 1782));
  const punchOp = clampFade(frame, 1784, 1812);

  // ============ BREAK: classic RAG, one shot ============
  const qIn = pop(frame, fps, 8);
  const queryTravel = clampFade(frame, 70, 130); // single query into the DB
  const chunkPop = (i: number) => pop(frame, fps, 150 + i * 14);
  const verdictIn = clampFade(frame, 360, 410);
  const breakPulse = 0.5 + 0.5 * Math.sin(frame / 11);
  const chunks = [
    { label: "auth config", ok: true },
    { label: "billing FAQ", ok: false },
    { label: "old changelog", ok: false },
  ];

  // ============ FIX: the research loop ============
  // path through pills [0 reformulate,1 decompose,2 search,3 read,4 judge]
  const seq = [0, 1, 2, 3, 4, /*hop1 NO*/ 2, 3, 4, /*hop2 NO*/ 2, 3, 4 /*hop3 YES*/];
  const pills = ["Reformulate", "Decompose", "Search", "Read", "Enough?"];
  const fixLocal = frame - 585;
  const stepDur = 90;
  const activeIdx = Math.max(0, Math.min(seq.length - 1, Math.floor(fixLocal / stepDur)));
  const activeNode = seq[activeIdx];
  const hop = activeIdx <= 4 ? 1 : activeIdx <= 7 ? 2 : 3;
  const onLastJudge = activeIdx === seq.length - 1;
  const judgeNo = activeNode === 4 && !onLastJudge;
  const answerReveal = clampFade(frame, 585 + 10 * stepDur + 20, 585 + 10 * stepDur + 80);
  // reads happen at activeIdx 3, 6, 9 → accumulate notes
  const notesShown = [fixLocal > 3 * stepDur, fixLocal > 6 * stepDur, fixLocal > 9 * stepDur];
  const noteLines = [
    "auth service → calls OAuth provider",
    "endpoint: POST /oauth/token",
    "rate limit: 100 req / min",
  ];
  const subQs = ["which provider?", "which endpoint?", "what limit?"];
  const decompShown = fixLocal > 1.4 * stepDur;
  const tokensGlow = clampFade(frame, 585 + 7 * stepDur, 585 + 8 * stepDur);
  const corePulse = 0.4 + 0.4 * Math.sin(frame / 7);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />
      <Sfx name="error" at={380} volume={0.4} />
      <Sfx name="whoosh" at={565} volume={0.35} />
      <Sfx name="tick" at={585 + 3 * stepDur} volume={0.3} />
      <Sfx name="tick" at={585 + 6 * stepDur} volume={0.3} />
      <Sfx name="success" at={585 + 10 * stepDur + 30} volume={0.45} />
      <Sfx name="stinger" at={1792} volume={0.4} />

      <CameraRig>
        <SceneHeading kicker="AGENTIC RETRIEVAL" accent={theme.accentWarm} size={58}>
          From one blind grab to a <span style={gradientText("#fbbf24", theme.accentWarm)}>research loop</span>
        </SceneHeading>

        {/* ============ BREAK ============ */}
        {breakOp > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: breakOp }}>
            {/* the hard question */}
            <div style={{
              position: "absolute", top: 250, left: "50%", transform: `translateX(-50%) scale(${interpolate(qIn, [0, 1], [0.9, 1])})`,
              width: 1180, padding: "20px 30px", borderRadius: 16,
              background: theme.surface, border: `2px solid ${theme.border}`,
              textAlign: "center",
            }}>
              <span style={{ fontFamily: theme.fontSans, fontSize: 32, color: theme.text, fontWeight: 600 }}>
                "Which service does auth call to refresh tokens, and what's its rate limit?"
              </span>
              <span style={{ marginLeft: 16, fontFamily: theme.fontMono, fontSize: 24, color: theme.accentWarm, fontWeight: 700 }}>
                needs 3 hops
              </span>
            </div>

            {/* classic one-shot */}
            <div style={{ position: "absolute", top: 400, left: 220, fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted, letterSpacing: 1 }}>
              CLASSIC RAG · one shot
            </div>

            {/* single query arrow → DB */}
            <div style={{
              position: "absolute", top: 470, left: 220, width: 300, height: 6, borderRadius: 3,
              background: `linear-gradient(90deg, ${theme.accentWarm}, ${theme.accentWarm}22)`,
              opacity: queryTravel, transformOrigin: "left", transform: `scaleX(${queryTravel})`,
            }} />
            <div style={{
              position: "absolute", top: 440, left: 540, width: 120, height: 150, borderRadius: 14,
              background: theme.surface, border: `2px solid ${theme.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted, opacity: queryTravel,
            }}>
              vector<br />DB
            </div>

            {/* grabbed chunks (mostly wrong) */}
            <div style={{ position: "absolute", top: 450, left: 720, display: "flex", flexDirection: "column", gap: 16 }}>
              {chunks.map((c, i) => (
                <div key={i} style={{
                  opacity: chunkPop(i),
                  transform: `translateX(${(1 - chunkPop(i)) * 30}px)`,
                  display: "flex", alignItems: "center", gap: 14,
                  width: 360, padding: "12px 18px", borderRadius: 12,
                  background: theme.surface,
                  border: `2px solid ${c.ok ? theme.accentGreen : theme.accentRed}${verdictIn > 0.5 ? "" : "44"}`,
                }}>
                  <span style={{ fontSize: 28 }}>{verdictIn > 0.5 ? (c.ok ? "✓" : "✗") : "•"}</span>
                  <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.text }}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* wrong answer */}
            <div style={{
              position: "absolute", top: 520, left: 1180, opacity: verdictIn,
              transform: `scale(${interpolate(verdictIn, [0, 1], [0.85, 1])})`,
              width: 460, padding: "26px 22px", borderRadius: 16,
              background: "#1a1012", border: `2px solid ${theme.accentRed}`,
              boxShadow: `0 0 ${verdictIn * breakPulse * 36}px ${theme.accentRed}88`,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 46 }}>✕</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 30, color: theme.accentRed, fontWeight: 700, marginTop: 6 }}>
                wrong chunks → wrong answer
              </div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 25, color: theme.textMuted, marginTop: 8 }}>
                one query can't span 3 hops
              </div>
            </div>
          </div>
        )}

        {/* ============ FIX: research loop ============ */}
        {fixOp > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: fixOp }}>
            {/* agent core */}
            <div style={{ position: "absolute", top: 240, left: 150 }}>
              <ModelCore size={150} label="AGENT" pulse={corePulse} fontSize={28} />
            </div>
            {/* hop badge */}
            <div style={{
              position: "absolute", top: 250, left: 330,
              fontFamily: theme.fontMono, fontSize: 30, color: theme.accentWarm, fontWeight: 800,
            }}>
              hop {hop} / 3
            </div>

            {/* pills row */}
            <div style={{ position: "absolute", top: 360, left: 330, right: 120, display: "flex", gap: 14, alignItems: "center" }}>
              {pills.map((p, i) => {
                const isActive = i === activeNode;
                const isJudge = i === 4;
                const accentC = isJudge ? theme.accentWarm : theme.accent;
                return (
                  <div key={i} style={{
                    flex: 1, padding: "16px 8px", borderRadius: 12, textAlign: "center",
                    background: isActive ? `${accentC}26` : theme.surface,
                    border: `2px solid ${isActive ? accentC : theme.border}`,
                    boxShadow: isActive ? `0 0 26px ${accentC}66` : "none",
                    transform: `scale(${isActive ? 1.06 : 1})`,
                    transition: "none",
                  }}>
                    <span style={{ fontFamily: theme.fontSans, fontSize: 26, fontWeight: 700, color: isActive ? theme.text : theme.textMuted }}>{p}</span>
                  </div>
                );
              })}
            </div>

            {/* loop-back NO arrow */}
            <div style={{
              position: "absolute", top: 432, right: 120, width: 1130, height: 40,
              opacity: judgeNo ? 0.5 + 0.5 * Math.sin(frame / 5) : 0.18,
            }}>
              <div style={{
                position: "absolute", right: 0, top: 18, left: "44%", height: 3,
                background: judgeNo ? theme.accentRed : theme.border, borderRadius: 2,
              }} />
              <span style={{ position: "absolute", left: "62%", top: 0, fontFamily: theme.fontMono, fontSize: 24, color: theme.accentRed, fontWeight: 700 }}>
                ↺ NO — search again
              </span>
            </div>

            {/* sub-queries from decompose */}
            {decompShown && (
              <div style={{ position: "absolute", top: 520, left: 330, display: "flex", gap: 14 }}>
                {subQs.map((q, i) => (
                  <div key={i} style={{
                    opacity: clampFade(frame, 585 + 1.4 * stepDur + i * 8, 585 + 1.4 * stepDur + i * 8 + 18),
                    padding: "8px 16px", borderRadius: 999,
                    background: `${theme.accent}1c`, border: `1.5px solid ${theme.accent}77`,
                    fontFamily: theme.fontMono, fontSize: 23, color: theme.accent,
                  }}>{q}</div>
                ))}
              </div>
            )}

            {/* notes accumulator */}
            <div style={{
              position: "absolute", top: 590, left: 330, width: 1140, padding: "18px 24px",
              borderRadius: 16, background: theme.surface, border: `2px solid ${theme.border}`,
              minHeight: 150,
            }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, letterSpacing: 1, marginBottom: 12 }}>
                NOTES GATHERED
              </div>
              {noteLines.map((n, i) => (
                notesShown[i] && (
                  <div key={i} style={{
                    opacity: clampFade(frame, 585 + (3 + i * 3) * stepDur, 585 + (3 + i * 3) * stepDur + 20),
                    display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 24, color: theme.accentGreen }}>✓</span>
                    <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.text }}>{n}</span>
                  </div>
                )
              ))}
            </div>

            {/* final answer */}
            <div style={{
              position: "absolute", top: 600, left: "50%", transform: `translateX(-50%) scale(${interpolate(answerReveal, [0, 1], [0.85, 1])})`,
              opacity: answerReveal, width: 760, padding: "24px", borderRadius: 18,
              background: "#0f1a14", border: `2px solid ${theme.accentGreen}`,
              boxShadow: `0 0 ${answerReveal * 40}px ${theme.accentGreen}77`, textAlign: "center",
            }}>
              <div style={{ fontSize: 44, color: theme.accentGreen }}>✓</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 32, fontWeight: 700, color: theme.text, marginTop: 6 }}>
                3 hops chained → complete answer
              </div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accentGreen, marginTop: 10 }}>
                OAuth · POST /oauth/token · 100 req/min
              </div>
            </div>

            {/* honest cost chip */}
            <div style={{
              position: "absolute", top: 250, right: 120, opacity: tokensGlow,
              padding: "10px 20px", borderRadius: 999,
              background: `${theme.accentWarm}1c`, border: `2px solid ${theme.accentWarm}`,
              boxShadow: `0 0 ${tokensGlow * (16 + 14 * Math.sin(frame / 6))}px ${theme.accentWarm}66`,
              fontFamily: theme.fontMono, fontSize: 26, color: theme.accentWarm, fontWeight: 700,
            }}>
              ~3–10× tokens
            </div>
          </div>
        )}

        {/* ============ PUNCHLINE ============ */}
        {punchOp > 0.01 && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: punchOp,
          }}>
            <div style={{
              textAlign: "center", transform: `scale(${interpolate(punchOp, [0, 1], [0.9, 1]) + 0.01 * Math.sin(frame / 18)})`,
              fontFamily: theme.fontSans, fontWeight: 800, fontSize: 76, color: theme.text, padding: "0 160px", lineHeight: 1.2,
            }}>
              Don't just <span style={gradientText("#fbbf24", theme.accentWarm)}>grab</span>.<br />Investigate.
            </div>
          </div>
        )}
      </CameraRig>
    </AbsoluteFill>
  );
};
