import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 2 — What RAG is [0:13-0:30]
// Clean L-to-R pipeline so a beginner gets it:
// Question → Knowledge base → Retrieve chunks → stuff into LLM context → Answer.
// A token-dot flows down the pipe; each stage labels in.

const STAGES = [
  { key: "q", label: "Question", sub: "what you ask", emoji: "❓", color: theme.tokenColors[4] },
  { key: "kb", label: "Knowledge base", sub: "docs · vector DB", emoji: "🗄️", color: theme.tokenColors[5] },
  { key: "ret", label: "Retrieve", sub: "top relevant chunks", emoji: "🔎", color: theme.accentGreen },
  { key: "llm", label: "Context → LLM", sub: "chunks stuffed in", emoji: "", color: theme.accent },
  { key: "ans", label: "Answer", sub: "with sources", emoji: "✅", color: theme.tokenColors[1] },
];

export const Scene2WhatRAG: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const N = STAGES.length;
  const W = 1640; // total pipeline width
  const gap = W / (N - 1);
  const startX = -W / 2;

  // each stage springs in, staggered
  const stageStart = (i: number) => fps * (1.2 + i * 1.3);

  // flowing dot travels the whole pipe after stages are mostly in
  const flowStart = fps * 7.5;
  const flowT = interpolate(frame, [flowStart, flowStart + fps * 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotX = startX + flowT * W;

  const lineOpacity = interpolate(frame, [fps * 13, fps * 14.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 13, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <SceneHeading kicker="quick refresher" accent={theme.accent}>
        What <span style={gradientText("#c7d2fe", theme.accent)}>RAG</span> actually does
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: W, height: 420 }}>
          {/* connecting pipe */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 5,
              transform: "translateY(-50%)",
              background: `linear-gradient(90deg, ${theme.tokenColors[4]}55, ${theme.accent}55, ${theme.tokenColors[1]}55)`,
              borderRadius: 2,
              opacity: interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          />

          {/* arrows between stages */}
          {STAGES.slice(0, -1).map((_, i) => {
            const ax = startX + gap * i + gap / 2;
            const op = interpolate(frame, [stageStart(i) + fps * 0.4, stageStart(i) + fps * 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div
                key={`arr${i}`}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${ax}px), -50%)`,
                  fontSize: 35,
                  color: theme.textDim,
                  opacity: op,
                }}
              >
                →
              </div>
            );
          })}

          {/* stages */}
          {STAGES.map((st, i) => {
            const cx = startX + gap * i;
            const start = stageStart(i);
            const s = spring({ frame: frame - start, fps, config: { damping: 14 } });
            const opacity = interpolate(frame, [start, start + fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // highlight when the flow dot is near this stage
            const dist = Math.abs(dotX - cx);
            const lit = flowT > 0 ? Math.max(0, 1 - dist / 140) : 0;

            return (
              <div
                key={st.key}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${cx}px), -50%) translateY(${(1 - s) * 16}px) scale(${1 + lit * 0.08})`,
                  opacity,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  width: 270,
                }}
              >
                {/* node */}
                {st.key === "llm" ? (
                  <div style={{ transform: "scale(0.74)" }}>
                    <ModelCore size={150} label="LLM" pulse={pulse} fontSize={35} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 132,
                      height: 132,
                      borderRadius: 26,
                      background: "linear-gradient(160deg, #17171f 0%, #0e0e13 100%)",
                      border: `1px solid ${lit > 0.3 ? st.color : theme.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 62,
                      boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 ${lit * 48}px ${st.color}, inset 0 1px 0 rgba(255,255,255,0.04)`,
                    }}
                  >
                    {st.emoji}
                  </div>
                )}
                {/* label */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: theme.fontMono, fontSize: 28, fontWeight: 700, color: st.color }}>{st.label}</div>
                  <div style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.textMuted, marginTop: 3 }}>{st.sub}</div>
                </div>
              </div>
            );
          })}

          {/* flowing token dot */}
          {flowT > 0 && flowT < 1 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${dotX}px), -50%)`,
                width: 26,
                height: 26,
                borderRadius: 13,
                background: theme.text,
                boxShadow: `0 0 30px ${theme.accent}, 0 0 12px ${theme.text}`,
              }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          textAlign: "center",
          opacity: lineOpacity,
          transform: `translateY(${(1 - lineY) * 18}px)`,
          fontFamily: theme.fontSans,
          fontSize: 43,
          color: theme.text,
        }}
      >
        <span style={{ color: theme.accentGreen, fontWeight: 700 }}>Retrieve</span>, then{" "}
        <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 700 }}>generate.</span>
      </div>
    </AbsoluteFill>
  );
};
