import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, SceneHeading, ModelCore, gradientText, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 6 — Just-in-time + memory retrieval. Beat A: a coding agent mid-edit hits
// an unknown function and fires a search tool INSIDE the loop, pulling just that
// definition while the context window stays small. Beat B: the same machinery on
// MEMORY — search thousands of past notes, pull back the one that matters.

const clampFade = (frame: number, s: number, e: number) =>
  interpolate(frame, [s, e], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Scene6JustInTimeMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const aOp = Math.min(clampFade(frame, 0, 15), 1 - clampFade(frame, 820, 842));
  const bOp = Math.min(clampFade(frame, 846, 870), 1 - clampFade(frame, 1360, 1382));
  const punchOp = clampFade(frame, 1386, 1414);

  // ---- Beat A: just-in-time ----
  const lineIn = (i: number) => clampFade(frame, 20 + i * 22, 40 + i * 22);
  const unknownQ = pop(frame, fps, 180);
  const toolFire = clampFade(frame, 250, 280);
  const toolTravel = clampFade(frame, 280, 370);
  const defReturn = clampFade(frame, 390, 480);
  const resolved = clampFade(frame, 520, 560);
  const caret = Math.sin(frame / 7) > 0 ? 1 : 0.15;
  const winBreathe = 0.5 + 0.5 * Math.sin(frame / 12);
  const capA = clampFade(frame, 600, 650);
  const codeLines = [
    "function refresh(token) {",
    "  const ok = verifySignature(token)",
    "  if (!ok) throw Error('bad sig')",
    "  return rotate(token)",
    "}",
  ];

  // ---- Beat B: memory ----
  const bLocal = frame - 846;
  const gridIn = clampFade(frame, 866, 940);
  const ripple = (bLocal - 120) / 8; // expanding search ring
  const rippleOn = bLocal > 110 && bLocal < 320;
  const hitLight = clampFade(frame, 846 + 230, 846 + 270);
  const hitFly = clampFade(frame, 846 + 270, 846 + 370);
  const labelIn = clampFade(frame, 846 + 80, 846 + 150);
  const capB = clampFade(frame, 846 + 410, 846 + 460);
  const cols = 12, rows = 5;
  const hitIdx = 27; // the one relevant memory
  const corePulseB = 0.4 + 0.4 * Math.sin(frame / 7);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />
      <Sfx name="pop" at={180} volume={0.35} />
      <Sfx name="whoosh" at={280} volume={0.3} />
      <Sfx name="success" at={540} volume={0.38} />
      <Sfx name="whoosh" at={846 + 120} volume={0.3} />
      <Sfx name="success" at={846 + 250} volume={0.4} />
      <Sfx name="stinger" at={1394} volume={0.4} />

      <CameraRig>
        <SceneHeading kicker="JUST-IN-TIME + MEMORY" accent={theme.accentGreen} size={56}>
          Retrieve the moment you <span style={gradientText("#6ee7b7", theme.accentGreen)}>hit a gap</span>
        </SceneHeading>

        {/* ============ BEAT A: just-in-time ============ */}
        {aOp > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: aOp }}>
            {/* code editor */}
            <div style={{
              position: "absolute", top: 290, left: 150, width: 780, padding: "22px 26px",
              borderRadius: 16, background: "#0d0d12", border: `2px solid ${theme.border}`,
            }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, marginBottom: 14, letterSpacing: 1 }}>
                refresh.ts — coding agent at work
              </div>
              {codeLines.map((l, i) => {
                const isUnknown = i === 1;
                return (
                  <div key={i} style={{
                    opacity: lineIn(i), fontFamily: theme.fontMono, fontSize: 28, lineHeight: 1.6,
                    color: isUnknown ? theme.text : theme.textMuted,
                    background: isUnknown && unknownQ > 0.2 && resolved < 0.5 ? `${theme.accentWarm}1c` : "transparent",
                    borderRadius: 6, padding: "0 6px",
                  }}>
                    {l}
                    {isUnknown && unknownQ > 0.2 && (
                      <span style={{
                        marginLeft: 10, color: resolved > 0.5 ? theme.accentGreen : theme.accentWarm,
                        fontWeight: 800, transform: `scale(${unknownQ})`, display: "inline-block",
                      }}>{resolved > 0.5 ? "✓" : "← ?"}</span>
                    )}
                  </div>
                );
              })}
              <span style={{ opacity: caret, color: theme.accentGreen, fontFamily: theme.fontMono, fontSize: 28 }}>▌</span>
            </div>

            {/* agent core */}
            <div style={{ position: "absolute", top: 320, left: 1010 }}>
              <ModelCore size={120} label="AGENT" pulse={0.4 + 0.4 * Math.sin(frame / 8)} fontSize={24} />
            </div>

            {/* tool-call pill travelling to the docs store */}
            <div style={{
              position: "absolute", top: 360,
              left: interpolate(toolTravel, [0, 1], [1150, 1440]),
              opacity: toolFire * (1 - clampFade(frame, 470, 500)),
              padding: "10px 18px", borderRadius: 999, background: `${theme.accent}22`,
              border: `2px solid ${theme.accent}`, fontFamily: theme.fontMono, fontSize: 22, color: theme.accent,
            }}>
              search_docs("verifySignature")
            </div>

            {/* docs store */}
            <div style={{
              position: "absolute", top: 300, left: 1640, width: 130, height: 170, borderRadius: 14,
              background: theme.surface, border: `2px solid ${theme.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
              fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted,
            }}>docs</div>

            {/* definition returning — JUST that one def */}
            <div style={{
              position: "absolute", top: 500,
              left: interpolate(defReturn, [0, 1], [1640, 1030]),
              opacity: defReturn * (1 - resolved * 0.0), width: 360, padding: "14px 18px", borderRadius: 12,
              background: "#0f1a14", border: `2px solid ${theme.accentGreen}`,
              boxShadow: `0 0 ${defReturn * 22}px ${theme.accentGreen}55`,
            }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.text }}>verifySignature(t)</div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.accentGreen, marginTop: 4 }}>→ HMAC-SHA256 check · bool</div>
            </div>

            {/* context window stays small */}
            <div style={{ position: "absolute", top: 690, left: 150, width: 780 }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted, marginBottom: 8 }}>
                context window
              </div>
              <div style={{ width: "100%", height: 26, borderRadius: 13, background: theme.surface, border: `2px solid ${theme.border}`, overflow: "hidden" }}>
                <div style={{
                  width: `${18 + winBreathe * 4}%`, height: "100%",
                  background: `linear-gradient(90deg, ${theme.accentGreen}, ${theme.accentGreen}66)`,
                }} />
              </div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.accentGreen, marginTop: 8, fontWeight: 600 }}>
                stays small — only what's needed, right now
              </div>
            </div>

            {/* caption */}
            <div style={{
              position: "absolute", top: 838, width: "100%", textAlign: "center", opacity: capA,
              fontFamily: theme.fontSans, fontSize: 34, fontWeight: 700, color: theme.text,
            }}>
              Just in time, <span style={{ color: theme.accentGreen }}>not just in case.</span>
            </div>
          </div>
        )}

        {/* ============ BEAT B: memory ============ */}
        {bOp > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: bOp }}>
            {/* agent core */}
            <div style={{ position: "absolute", top: 430, left: 170 }}>
              <ModelCore size={140} label="AGENT" pulse={corePulseB} fontSize={26} />
            </div>

            {/* labels */}
            <div style={{ position: "absolute", top: 300, left: 560, display: "flex", gap: 16, opacity: labelIn }}>
              {["past conversations", "decisions", "user notes"].map((l, i) => (
                <div key={i} style={{
                  padding: "8px 18px", borderRadius: 999, background: `${theme.accentGreen}16`,
                  border: `1.5px solid ${theme.accentGreen}66`, fontFamily: theme.fontMono, fontSize: 23, color: theme.accentGreen,
                }}>{l}</div>
              ))}
            </div>

            {/* MEMORY grid */}
            <div style={{ position: "absolute", top: 370, left: 560, width: 1180 }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted, marginBottom: 14, letterSpacing: 1 }}>
                MEMORY · thousands of past notes
              </div>
              <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
                {Array.from({ length: cols * rows }).map((_, i) => {
                  const isHit = i === hitIdx;
                  const appear = clampFade(frame, 866 + (i % cols) * 4, 900 + (i % cols) * 4);
                  const lit = isHit ? hitLight : 0;
                  return (
                    <div key={i} style={{
                      height: 46, borderRadius: 8, opacity: appear,
                      background: isHit ? `${theme.accentGreen}${lit > 0.5 ? "33" : "14"}` : theme.surface,
                      border: `2px solid ${isHit && lit > 0.3 ? theme.accentGreen : theme.border}`,
                      boxShadow: isHit && lit > 0.3 ? `0 0 ${18 + 10 * Math.sin(frame / 5)}px ${theme.accentGreen}88` : "none",
                      transform: `scale(${isHit && lit > 0.3 ? 1.08 : 1})`,
                    }} />
                  );
                })}

                {/* search ripple */}
                {rippleOn && (
                  <div style={{
                    position: "absolute", left: "30%", top: "50%",
                    width: 40 + Math.max(0, ripple) * 40, height: 40 + Math.max(0, ripple) * 40,
                    borderRadius: "50%", border: `2px solid ${theme.accentGreen}`,
                    opacity: Math.max(0, 1 - ripple / 18), transform: "translate(-50%, -50%)",
                  }} />
                )}
              </div>
            </div>

            {/* the one that matters, flying back */}
            <div style={{
              position: "absolute",
              top: interpolate(hitFly, [0, 1], [470, 520]),
              left: interpolate(hitFly, [0, 1], [760, 330]),
              opacity: hitFly, width: 360, padding: "14px 18px", borderRadius: 12,
              background: "#0f1a14", border: `2px solid ${theme.accentGreen}`,
              boxShadow: `0 0 ${hitFly * 24}px ${theme.accentGreen}66`,
            }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 23, color: theme.text }}>"user prefers tabs over spaces"</div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 21, color: theme.accentGreen, marginTop: 4 }}>↳ the one that matters</div>
            </div>

            {/* caption */}
            <div style={{
              position: "absolute", top: 838, width: "100%", textAlign: "center", opacity: capB,
              fontFamily: theme.fontSans, fontSize: 34, fontWeight: 700, color: theme.text,
            }}>
              Same machinery — now over <span style={{ color: theme.accentGreen }}>memory</span>.
            </div>
          </div>
        )}

        {/* ============ PUNCHLINE ============ */}
        {punchOp > 0.01 && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: punchOp,
          }}>
            <div style={{
              textAlign: "center", transform: `scale(${interpolate(punchOp, [0, 1], [0.9, 1]) + 0.01 * Math.sin(frame / 18)})`,
              fontFamily: theme.fontSans, fontWeight: 800, fontSize: 80, color: theme.text, padding: "0 140px", lineHeight: 1.2,
            }}>
              Find the <span style={gradientText("#6ee7b7", theme.accentGreen)}>needle</span>.<br />Leave the haystack.
            </div>
          </div>
        )}
      </CameraRig>
    </AbsoluteFill>
  );
};
