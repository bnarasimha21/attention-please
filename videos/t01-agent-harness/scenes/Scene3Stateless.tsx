import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 3 - Stateless [~30s / 900 frames]
// The model has amnesia. A pure-function box: tokens → [ MODEL ] → tokens.
// Same input sent twice → same output (two identical mini-runs). Then an amnesia
// beat: a chat thread where each reply re-reads the WHOLE thread from scratch
// (a scan sweep). Chips: stateless · no memory · no hands.

export const Scene3Stateless: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pure-function box
  const boxS = pop(frame, fps, fps * 1.2, { damping: 13 });
  const boxOpacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fnOpacity = interpolate(frame, [fps * 2.6, fps * 3.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Two identical mini-runs (~6s, ~8s)
  const runStart = [6, 8];
  // Highlight that both produce the same output
  const sameOpacity = interpolate(frame, [fps * 11, fps * 12.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Amnesia chat beat (~14s). Thread of messages, sweep re-reads them.
  const thread = [
    { who: "you", text: "my name is Narsi", side: "right" },
    { who: "ai", text: "hi Narsi!", side: "left" },
    { who: "you", text: "what's my name?", side: "right" },
  ];
  const threadStart = 14;
  // sweep scan over all prior messages just before the reply
  const sweep = interpolate(frame, [fps * 19, fps * 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const replyS = pop(frame, fps, fps * 22.5, { damping: 12 });
  const replyOpacity = interpolate(frame, [fps * 22.5, fps * 23.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Chips
  const chips = ["stateless", "no memory", "no hands"];
  const chipStart = 24.5;

  // Caption
  const capOpacity = interpolate(frame, [fps * 26.5, fps * 27.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const RunBox: React.FC<{ delay: number }> = ({ delay }) => {
    const s = pop(frame, fps, fps * delay, { damping: 12, mass: 0.8 });
    const op = interpolate(frame, [fps * delay, fps * (delay + 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div
        style={{
          opacity: op,
          transform: `translateY(${(1 - s) * 18}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
          width: 300,
          padding: "22px 24px",
          borderRadius: 16,
          background: "linear-gradient(160deg, rgba(28,32,52,0.9), rgba(16,18,28,0.85))",
          border: `1px solid ${theme.border}`,
          fontFamily: theme.fontMono,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 26, color: theme.accentGreen }}>"2 + 2"</div>
        <div style={{ fontSize: 22, color: theme.textMuted, margin: "10px 0" }}>↓ MODEL</div>
        <div style={{ fontSize: 30, color: theme.text, fontWeight: 700 }}>"4"</div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig>
        <SceneHeading kicker="the foundation" accent={theme.accent}>
          The model has <span style={gradientText("#c7d2fe", theme.accent)}>amnesia</span>
        </SceneHeading>

        {/* Pure-function box */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 280,
            transform: `translate(-50%, 0) scale(${interpolate(boxS, [0, 1], [0.9, 1])})`,
            opacity: boxOpacity,
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.accentGreen }}>tokens</div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 34, color: theme.textMuted }}>→</div>
          <div
            style={{
              padding: "18px 34px",
              borderRadius: 16,
              background: `radial-gradient(circle at 40% 30%, ${theme.accent}cc, #4338ca)`,
              border: `1px solid ${theme.accent}`,
              boxShadow: `0 0 40px ${theme.accent}66`,
              fontFamily: theme.fontMono,
              fontSize: 34,
              fontWeight: 800,
              color: theme.text,
              letterSpacing: 1,
            }}
          >
            MODEL
          </div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 34, color: theme.textMuted }}>→</div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.accentGreen }}>tokens</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 372,
            transform: "translateX(-50%)",
            opacity: fnOpacity,
            fontFamily: theme.fontMono,
            fontSize: 28,
            color: theme.textMuted,
          }}
        >
          <span style={{ color: theme.accent }}>f</span>(prompt) → text{"  "}
          <span style={{ color: theme.textDim }}>// pure function</span>
        </div>

        {/* Two identical mini-runs */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            top: 500,
            transform: "translateX(-50%)",
            display: "flex",
            gap: 40,
            alignItems: "flex-start",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted, marginBottom: 10, letterSpacing: 2 }}>RUN #1</div>
            <RunBox delay={runStart[0]} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted, marginBottom: 10, letterSpacing: 2 }}>RUN #2</div>
            <RunBox delay={runStart[1]} />
          </div>
        </div>
        {/* same output / no memory note */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            top: 720,
            transform: "translateX(-50%)",
            opacity: sameOpacity,
            fontFamily: theme.fontMono,
            fontSize: 28,
            color: theme.text,
            textAlign: "center",
          }}
        >
          same input → same output ·{" "}
          <span style={{ color: theme.accentRed }}>no memory of run #1</span>
        </div>

        {/* Amnesia chat beat - appears on the right, overlapping timeline-wise */}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 500,
            width: 480,
            opacity: interpolate(frame, [fps * threadStart, fps * (threadStart + 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {/* sweep highlight bar */}
          <div
            style={{
              position: "absolute",
              left: -14,
              right: -14,
              top: `${interpolate(sweep, [0, 1], [0, 62])}%`,
              height: 56,
              borderRadius: 12,
              background: `linear-gradient(90deg, ${theme.accent}00, ${theme.accent}44, ${theme.accent}00)`,
              boxShadow: `0 0 24px ${theme.accent}55`,
              opacity: sweep > 0 && sweep < 1 ? 1 : 0,
            }}
          />
          {thread.map((m, i) => {
            const ms = pop(frame, fps, fps * (threadStart + 1 + i * 1.4), { damping: 12, mass: 0.8 });
            const mop = interpolate(frame, [fps * (threadStart + 1 + i * 1.4), fps * (threadStart + 2 + i * 1.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const isRight = m.side === "right";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isRight ? "flex-end" : "flex-start",
                  marginBottom: 16,
                  opacity: mop,
                  transform: `translateY(${(1 - ms) * 14}px)`,
                }}
              >
                <div
                  style={{
                    maxWidth: 320,
                    padding: "14px 20px",
                    borderRadius: 16,
                    background: isRight
                      ? `linear-gradient(160deg, ${theme.accent}cc, #4338ca)`
                      : "linear-gradient(160deg, rgba(30,34,54,0.95), rgba(18,20,30,0.9))",
                    border: isRight ? "none" : `1px solid ${theme.border}`,
                    fontFamily: theme.fontSans,
                    fontSize: 26,
                    color: theme.text,
                    fontWeight: 600,
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          {/* the reply that had to re-read everything */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              opacity: replyOpacity,
              transform: `translateY(${(1 - replyS) * 14}px)`,
            }}
          >
            <div
              style={{
                maxWidth: 360,
                padding: "14px 20px",
                borderRadius: 16,
                background: "linear-gradient(160deg, rgba(30,34,54,0.95), rgba(18,20,30,0.9))",
                border: `1px solid ${theme.accent}66`,
                fontFamily: theme.fontSans,
                fontSize: 26,
                color: theme.text,
                fontWeight: 600,
              }}
            >
              re-read the whole thread → "Narsi"
            </div>
          </div>
          {/* sweep label */}
          <div
            style={{
              marginTop: 18,
              opacity: sweep > 0.1 ? 1 : 0,
              fontFamily: theme.fontMono,
              fontSize: 22,
              color: theme.accent,
              letterSpacing: 1,
              textAlign: "right",
            }}
          >
            ↑ re-reads everything, every turn
          </div>
        </div>

        {/* Chips */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 432,
            transform: "translateX(-50%)",
            display: "flex",
            gap: 16,
          }}
        >
          {chips.map((c, i) => {
            const s = pop(frame, fps, fps * (chipStart + i * 0.4), { damping: 11, mass: 0.7 });
            const op = interpolate(frame, [fps * (chipStart + i * 0.4), fps * (chipStart + i * 0.4 + 0.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div
                key={i}
                style={{
                  opacity: op,
                  transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: `${theme.accent}1a`,
                  border: `1px solid ${theme.accent}66`,
                  fontFamily: theme.fontMono,
                  fontSize: 26,
                  color: theme.accent,
                  letterSpacing: 1,
                }}
              >
                {c}
              </div>
            );
          })}
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: 175,
            width: "100%",
            textAlign: "center",
            opacity: capOpacity,
            fontFamily: theme.fontSans,
            fontSize: 36,
            fontWeight: 600,
            color: theme.textMuted,
          }}
        >
          No memory, no hands. That's the whole reason the{" "}
          <span style={{ color: theme.accent }}>harness</span> exists.
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
