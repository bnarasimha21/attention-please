import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 5 — Long context vs RAG [1:03-1:20]
// Two-panel decision. LEFT: long context — pour the WHOLE doc into a big prompt
// window (small / stable knowledge). RIGHT: retrieval — pluck chunks from a
// giant DB (huge / fresh knowledge). A decision rule lands at the bottom.

export const Scene5LongContext: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftOpacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // LEFT: window fills with the whole doc (5s -> 8s)
  const fillT = interpolate(frame, [fps * 5, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // RIGHT: chunks get plucked out one by one (5.5s+)
  const pluck = (i: number) => interpolate(frame, [fps * (5.5 + i * 0.8), fps * (6.3 + i * 0.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // verdict chips
  const leftV = interpolate(frame, [fps * 9.5, fps * 10.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightV = interpolate(frame, [fps * 10.3, fps * 11.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ruleOpacity = interpolate(frame, [fps * 13, fps * 14.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ruleY = spring({ frame: frame - fps * 13, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <SceneHeading kicker="the tradeoff" accent={theme.accentWarm}>
        Long context <span style={gradientText("#fbbf24", theme.accentWarm)}>vs</span> retrieval
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 130, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
        {/* LEFT — Long context */}
        <div style={{ opacity: leftOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: 540 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 32, fontWeight: 700, color: theme.tokenColors[5] }}>Long context</div>

          {/* big prompt window filling up with the whole doc */}
          <div
            style={{
              width: 432,
              height: 300,
              borderRadius: 22,
              padding: 17,
              background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
              border: `2px solid ${theme.tokenColors[5]}55`,
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.6), 0 16px 50px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 9,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ fontFamily: theme.fontMono, fontSize: 19, color: theme.textMuted, marginBottom: 3 }}>prompt window</div>
            {Array.from({ length: 9 }).map((_, i) => {
              const lineFill = interpolate(fillT, [i / 9, (i + 1) / 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div
                  key={i}
                  style={{
                    height: 19,
                    borderRadius: 6,
                    width: `${30 + (i % 3) * 25}%`,
                    background: theme.border,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ height: "100%", width: `${lineFill * 100}%`, background: `linear-gradient(90deg, ${theme.tokenColors[5]}, ${theme.accent})` }} />
                </div>
              );
            })}
            <div style={{ position: "absolute", bottom: 14, right: 18, fontFamily: theme.fontMono, fontSize: 17, color: theme.tokenColors[5] }}>
              whole doc pasted in
            </div>
          </div>

          <div
            style={{
              opacity: leftV,
              padding: "15px 26px",
              borderRadius: 12,
              background: `${theme.accentGreen}14`,
              border: `1px solid ${theme.accentGreen}`,
              fontFamily: theme.fontSans,
              fontSize: 27,
              color: theme.accentGreen,
              textAlign: "center",
            }}
          >
            best for <b>small · stable</b> knowledge
          </div>
        </div>

        {/* divider */}
        <div style={{ width: 1, height: 456, background: theme.border }} />

        {/* RIGHT — Retrieval */}
        <div style={{ opacity: rightOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: 540 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 32, fontWeight: 700, color: theme.accentGreen }}>Retrieval</div>

          {/* giant DB with a few chunks plucked out */}
          <div style={{ position: "relative", width: 432, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* giant DB grid */}
            <div
              style={{
                width: 288,
                height: 300,
                borderRadius: 22,
                padding: 14,
                background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
                border: `2px solid ${theme.border}`,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridAutoRows: "24px",
                gap: 7,
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.6), 0 16px 50px rgba(0,0,0,0.4)",
                alignContent: "start",
              }}
            >
              {Array.from({ length: 28 }).map((_, i) => {
                const isPicked = i === 5 || i === 14 || i === 22;
                const pIdx = i === 5 ? 0 : i === 14 ? 1 : 2;
                const gone = isPicked ? pluck(pIdx) : 0;
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: 4,
                      background: isPicked ? theme.accentGreen : theme.textDim,
                      opacity: isPicked ? 0.35 + (1 - gone) * 0.65 : 0.4,
                    }}
                  />
                );
              })}
            </div>
            <div style={{ position: "absolute", bottom: -4, left: 36, fontFamily: theme.fontMono, fontSize: 17, color: theme.textMuted }}>
              giant DB
            </div>

            {/* plucked chunks fly to the right */}
            {[0, 1, 2].map((i) => {
              const p = pluck(i);
              if (p <= 0) return null;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 180,
                    top: 72 + i * 72,
                    transform: `translateX(${p * 130}px)`,
                    opacity: p,
                    width: 132,
                    height: 44,
                    borderRadius: 10,
                    background: `${theme.accentGreen}22`,
                    border: `1.5px solid ${theme.accentGreen}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme.fontMono,
                    fontSize: 19,
                    color: theme.accentGreen,
                    boxShadow: `0 0 22px ${theme.accentGreen}66`,
                  }}
                >
                  chunk
                </div>
              );
            })}
          </div>

          <div
            style={{
              opacity: rightV,
              padding: "15px 26px",
              borderRadius: 12,
              background: `${theme.accentGreen}14`,
              border: `1px solid ${theme.accentGreen}`,
              fontFamily: theme.fontSans,
              fontSize: 27,
              color: theme.accentGreen,
              textAlign: "center",
            }}
          >
            best for <b>huge · fresh</b> knowledge
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          textAlign: "center",
          opacity: ruleOpacity,
          transform: `translateY(${(1 - ruleY) * 18}px)`,
          fontFamily: theme.fontSans,
          fontSize: 41,
          color: theme.text,
        }}
      >
        Long context is a <span style={{ ...gradientText("#fbbf24", theme.accentWarm), fontWeight: 700 }}>tool</span> — not a replacement.
      </div>
    </AbsoluteFill>
  );
};
