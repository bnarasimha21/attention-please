import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 4 — What actually changed [0:46-1:03]
// Agentic retrieval: the agent reformulates into sub-queries, searches multiple
// times, EVALUATES results (✓/✗), retries via a loop, and locks in the RIGHT
// (green) chunks. "Retrieval got a brain."

const SUBQ = [
  { text: "sub-query A", y: -175, verdict: "✕", good: false },
  { text: "sub-query B", y: 0, verdict: "✓", good: true },
  { text: "sub-query C", y: 175, verdict: "✓", good: true },
];

export const Scene4WhatChanged: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const agentOpacity = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // sub-queries fan out, staggered (2s+)
  const subStart = (i: number) => fps * (2 + i * 1.2);

  // evaluation verdicts appear (6.5s+)
  const evalStart = (i: number) => fps * (6.4 + i * 0.7);

  // retry loop arc draws + flashes for the rejected one (9s)
  const retryT = interpolate(frame, [fps * 9, fps * 10.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // final lock-in of good chunks (11.5s+)
  const lockT = interpolate(frame, [fps * 11.4, fps * 12.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lockSpring = spring({ frame: frame - fps * 11.4, fps, config: { damping: 13 } });

  const lineOpacity = interpolate(frame, [fps * 14, fps * 15.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const agentX = -520;
  const kbX = 460;

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <SceneHeading kicker="what actually changed" accent={theme.accentGreen}>
        Retrieval became <span style={gradientText("#6ee7b7", theme.accentGreen)}>agentic</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1440, height: 500 }}>
          {/* retry loop arc (curves back from KB to agent) */}
          {retryT > 0 && (
            <svg
              style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", overflow: "visible" }}
              width={1000}
              height={440}
            >
              <path
                d={`M ${500 + kbX - 120} ${90} C ${200} ${-110}, ${-150} ${-110}, ${500 + agentX} ${-30}`}
                fill="none"
                stroke={theme.accentWarm}
                strokeWidth={3}
                strokeDasharray="8 8"
                strokeDashoffset={(1 - retryT) * 600}
                opacity={0.85}
              />
            </svg>
          )}
          {retryT > 0.2 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + 0px), calc(-50% - 235px))`,
                fontFamily: theme.fontMono,
                fontSize: 24,
                color: theme.accentWarm,
                opacity: Math.min(1, retryT * 1.5),
                background: "rgba(10,10,13,0.85)",
                padding: "6px 18px",
                borderRadius: 10,
                border: `1px solid ${theme.accentWarm}55`,
              }}
            >
              ↻ not good enough → reformulate & retry
            </div>
          )}

          {/* Agent core */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${agentX}px), -50%)`,
              opacity: agentOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ transform: "scale(0.96)" }}>
              <ModelCore size={150} label="AGENT" pulse={pulse} fontSize={30} />
            </div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 23, color: theme.textMuted }}>reformulates · evaluates</div>
          </div>

          {/* Knowledge base block */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${kbX}px), -50%)`,
              width: 156,
              height: 300,
              borderRadius: 22,
              background: "linear-gradient(180deg, #13181a 0%, #0c0e10 100%)",
              border: `1px solid ${theme.border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: agentOpacity,
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ fontSize: 54 }}>🗄️</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 20, color: theme.textMuted, textAlign: "center" }}>
              knowledge
              <br />
              base
            </div>
          </div>

          {/* sub-queries fanning out + verdicts */}
          {SUBQ.map((q, i) => {
            const start = subStart(i);
            const s = spring({ frame: frame - start, fps, config: { damping: 15 } });
            const opacity = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const es = evalStart(i);
            const vOpacity = interpolate(frame, [es, es + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // the rejected one fades a touch after retry resolves
            const rejectFade = !q.good ? 1 - retryT * 0.55 : 1;
            const vColor = q.good ? theme.accentGreen : theme.accentRed;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${(agentX + kbX) / 2 - 40}px), calc(-50% + ${q.y * s}px)) scale(${0.85 + s * 0.15})`,
                  opacity: opacity * rejectFade,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    padding: "12px 22px",
                    borderRadius: 12,
                    background: "linear-gradient(160deg, #15151b, #0d0d11)",
                    border: `1px solid ${theme.border}`,
                    fontFamily: theme.fontMono,
                    fontSize: 24,
                    color: theme.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  {q.text}
                </div>
                <div
                  style={{
                    opacity: vOpacity,
                    width: 46,
                    height: 46,
                    borderRadius: 11,
                    background: `${vColor}22`,
                    border: `1.5px solid ${vColor}`,
                    color: vColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    fontWeight: 800,
                  }}
                >
                  {q.verdict}
                </div>
              </div>
            );
          })}

          {/* locked-in right chunks badge below agent */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${agentX}px), calc(-50% + ${170 - (1 - lockSpring) * 14}px))`,
              opacity: lockT,
              padding: "13px 24px",
              borderRadius: 14,
              background: `${theme.accentGreen}1a`,
              border: `1.5px solid ${theme.accentGreen}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: theme.fontSans,
              fontSize: 27,
              fontWeight: 700,
              color: theme.accentGreen,
              boxShadow: `0 0 32px ${theme.accentGreen}55`,
            }}
          >
            <span style={{ fontSize: 30 }}>🔒</span> right chunks locked in
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          width: "100%",
          textAlign: "center",
          opacity: lineOpacity,
          fontFamily: theme.fontSans,
          fontSize: 41,
          color: theme.text,
        }}
      >
        Search, check, retry — <span style={{ color: theme.accentGreen }}>retrieval got a brain.</span>
      </div>
    </AbsoluteFill>
  );
};
