import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";

// smallest angular distance between two angles (deg)
const angDist = (a: number, b: number) => {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(d, 360 - d);
};

// Scene 4 — The agentic loop (hero mechanism)
// Phase A: type in the 5-line loop, hold readable.
// Phase B: code slides to the upper-left, a circular loop diagram animates on
// the right — a token rotates the ring lighting THINK / ACT / OBSERVE; a budget
// bar drains a little each lap.

type Tok = { t: string; c: string };
// Each code line as colored tokens for syntax highlighting.
const CODE_LINES: Tok[][] = [
  [{ t: "while", c: theme.accent }, { t: " not done:", c: theme.text }],
  [
    { t: "    reply = ", c: theme.text },
    { t: "model", c: theme.accentGreen },
    { t: "(context)", c: theme.text },
    { t: "          # stateless call", c: theme.textMuted },
  ],
  [
    { t: "    if", c: theme.accent },
    { t: " reply.tool_call:", c: theme.text },
  ],
  [
    { t: "        result = ", c: theme.text },
    { t: "run", c: theme.accentGreen },
    { t: "(reply.tool_call)", c: theme.text },
    { t: "   # harness executes", c: theme.textMuted },
  ],
  [
    { t: "        context += result", c: theme.text },
    { t: "               # observe", c: theme.textMuted },
  ],
  [{ t: "    else", c: theme.accent }, { t: ":", c: theme.text }],
  [
    { t: "        done = ", c: theme.text },
    { t: "True", c: theme.accent },
    { t: "                    # final answer", c: theme.textMuted },
  ],
];

const flatLen = (line: Tok[]) => line.reduce((s, t) => s + t.t.length, 0);

const NODES = [
  { label: "THINK", angle: -90, color: theme.tokenColors[5] },
  { label: "ACT", angle: 30, color: theme.tokenColors[3] },
  { label: "OBSERVE", angle: 150, color: theme.tokenColors[2] },
];

export const Scene4Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Phase A: typewriter (chars revealed across all lines) ----
  const totalChars = CODE_LINES.reduce((s, l) => s + flatLen(l), 0);
  const typeStart = fps * 1.2;
  const typeEnd = fps * 6.2; // ~5s to type, then holds
  const revealed = interpolate(frame, [typeStart, typeEnd], [0, totalChars], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor blink while typing
  const typing = frame >= typeStart && frame < typeEnd;
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  // ---- transition: code slides from center to upper-left at ~9s ----
  const move = interpolate(frame, [fps * 9, fps * 10.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  // center-ish during phase A -> upper-left during phase B
  const codeLeft = interpolate(move, [0, 1], [560, 150]);
  const codeTop = interpolate(move, [0, 1], [300, 270]);
  const codeScale = interpolate(move, [0, 1], [1, 0.82]);

  // ---- Phase B: ring + rotating token (after the slide settles) ----
  const ringStart = fps * 10.6;
  const ringOpacity = interpolate(frame, [ringStart, ringStart + fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringPop = pop(frame, fps, ringStart, { damping: 12 });
  const ringScale = interpolate(ringPop, [0, 1], [0.78, 1]);

  const rotateStart = ringStart + fps * 1.2;
  const lapFrames = fps * 3; // 3s per lap
  const active = frame > rotateStart;
  const sweep = active ? ((frame - rotateStart) / lapFrames) * 360 : 0;
  const tokenAngle = -90 + sweep;
  const R = 215;
  const tx = Math.cos((tokenAngle * Math.PI) / 180) * R;
  const ty = Math.sin((tokenAngle * Math.PI) / 180) * R;

  // budget drains a little each lap
  const budget = interpolate(frame, [rotateStart, fps * 40], [100, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const budgetColor = budget > 55 ? theme.accentGreen : budget > 30 ? theme.accentWarm : theme.accentRed;

  // ReAct tag + caption
  const reactTag = pop(frame, fps, ringStart + fps * 1.5, { damping: 13 });
  const captionOpacity = interpolate(frame, [fps * 16, fps * 17.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // diagram lives on the right/center during phase B
  const diagX = interpolate(move, [0, 1], [0, 360]);

  let charCursor = 0;

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig>
        <SceneHeading kicker="the engine" accent={theme.accent}>
          The agentic <span style={gradientText("#c7d2fe", theme.accent)}>&lt;loop&gt;</span>
        </SceneHeading>

        {/* Code card */}
        <div
          style={{
            position: "absolute",
            top: codeTop,
            left: codeLeft,
            transform: `scale(${codeScale})`,
            transformOrigin: "top left",
            width: 820,
            padding: "30px 36px",
            borderRadius: 20,
            background: `linear-gradient(160deg, #15151c, ${theme.surface})`,
            border: `1px solid ${theme.border}`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.55), inset 0 0 60px ${theme.accent}0d`,
            fontFamily: theme.fontMono,
            fontSize: 28,
            lineHeight: 1.55,
          }}
        >
          {/* window dots */}
          <div style={{ display: "flex", gap: 9, marginBottom: 18 }}>
            {[theme.accentRed, theme.accentWarm, theme.accentGreen].map((c) => (
              <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85 }} />
            ))}
          </div>

          {CODE_LINES.map((line, li) => (
            <div key={li} style={{ whiteSpace: "pre", minHeight: 43 }}>
              {line.map((tok, ti) => {
                const start = charCursor;
                charCursor += tok.t.length;
                const shown = Math.max(0, Math.min(tok.t.length, Math.round(revealed) - start));
                const isLastVisible = typing && revealed > start && revealed <= charCursor;
                return (
                  <span key={ti} style={{ color: tok.c }}>
                    {tok.t.slice(0, shown)}
                    {isLastVisible && cursorOn && (
                      <span style={{ color: theme.accent, opacity: 0.9 }}>▍</span>
                    )}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Loop diagram (phase B) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: ringOpacity,
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "relative", width: 560, height: 560, transform: `translateX(${diagX}px)` }}>
            {/* ring */}
            <div
              style={{
                position: "absolute",
                inset: 65,
                borderRadius: "50%",
                border: `2px solid ${theme.border}`,
                transform: `scale(${ringScale})`,
                boxShadow: `inset 0 0 80px ${theme.accent}14`,
              }}
            />

            {/* nodes */}
            {NODES.map((n, ni) => {
              const x = Math.cos((n.angle * Math.PI) / 180) * R;
              const y = Math.sin((n.angle * Math.PI) / 180) * R;
              const lit = active ? Math.max(0, 1 - angDist(tokenAngle, n.angle) / 55) : 0;
              const nodePop = pop(frame, fps, ringStart + fps * 0.4 + ni * fps * 0.2, { damping: 10 });
              const nodeIn = interpolate(nodePop, [0, 1], [0.4, 1]);
              return (
                <div
                  key={n.label}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${nodeIn * (1 + lit * 0.16)})`,
                    opacity: nodePop,
                    padding: "16px 28px",
                    borderRadius: 16,
                    background: interpolateColors(lit, [0, 1], [theme.surface, n.color]),
                    color: interpolateColors(lit, [0, 1], [theme.text, theme.bg]),
                    border: `1px solid ${interpolateColors(lit, [0, 1], [theme.border, n.color])}`,
                    boxShadow: `0 0 ${lit * 45}px ${n.color}`,
                    fontFamily: theme.fontMono,
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                  }}
                >
                  {n.label}
                </div>
              );
            })}

            {/* harness label at center (the "?" decision + executor) */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                textAlign: "center",
                width: 230,
                fontFamily: theme.fontMono,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: theme.accent, letterSpacing: 2 }}>HARNESS</div>
              <div style={{ fontSize: 21, color: theme.textMuted, marginTop: 6 }}>tool_call?</div>
            </div>

            {/* rotating token */}
            {active && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: theme.text,
                  boxShadow: `0 0 24px ${theme.text}`,
                }}
              />
            )}

            {/* ReAct tag */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: -6,
                transform: `translateX(-50%) scale(${reactTag})`,
                opacity: reactTag,
                padding: "8px 20px",
                borderRadius: 999,
                background: `${theme.accent}1f`,
                border: `1px solid ${theme.accent}66`,
                color: theme.accent,
                fontFamily: theme.fontMono,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              ReAct
            </div>
          </div>
        </div>

        {/* Budget bar */}
        <div
          style={{
            position: "absolute",
            bottom: 188,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            opacity: ringOpacity,
          }}
        >
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>step / token budget</div>
          <div style={{ width: 560, height: 22, borderRadius: 11, background: theme.surface, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
            <div style={{ width: `${budget}%`, height: "100%", background: budgetColor, boxShadow: `0 0 20px ${budgetColor}` }} />
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            width: "100%",
            textAlign: "center",
            opacity: captionOpacity,
            fontFamily: theme.fontSans,
            fontSize: 38,
            color: theme.text,
          }}
        >
          Think, act, observe — <span style={{ color: theme.accent }}>until the job's done.</span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
