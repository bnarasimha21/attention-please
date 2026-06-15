import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 2 — What is context rot [0:14-0:30]
// A context box fills with grey "noise" lines; one gold "signal" line gets
// buried. A signal-to-noise meter drops as more words pour in.

export const Scene2Definition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ROWS = 11;
  const SIGNAL_ROW = 5; // the buried fact sits mid-stack

  // noise lines stream in over time
  const filled = interpolate(frame, [fps * 1.5, fps * 9.5], [0, ROWS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // signal-to-noise drops as the box fills
  const snr = interpolate(frame, [fps * 1.5, fps * 10], [100, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const snrColor = snr > 55 ? theme.accentGreen : snr > 28 ? theme.accentWarm : theme.accentRed;
  const meterOpacity = interpolate(frame, [fps * 1.8, fps * 2.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const boxOpacity = interpolate(frame, [fps * 0.6, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 12.5, fps * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 12.5, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <SceneHeading kicker="the core idea" accent={theme.accentWarm}>
        Attention spreads <span style={gradientText("#fbbf24", theme.accentWarm)}>thin</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 84 }}>

        {/* The context box */}
        <div style={{
          width: 910, padding: 28, borderRadius: 24, opacity: boxOpacity,
          background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
          border: `1px solid ${theme.border}`,
          boxShadow: "inset 0 0 36px rgba(0,0,0,0.6), 0 24px 60px rgba(0,0,0,0.45)",
          display: "flex", flexDirection: "column", gap: 15,
        }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, letterSpacing: 2, textTransform: "uppercase" }}>
            the model's context
          </div>
          {Array.from({ length: ROWS }).map((_, i) => {
            const rowStart = fps * 1.5 + i * fps * 0.7;
            const appear = interpolate(frame, [rowStart, rowStart + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const isSignal = i === SIGNAL_ROW;
            // signal starts bright then dims as noise piles on after it
            const buryT = interpolate(frame, [fps * 7, fps * 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sigDim = isSignal ? interpolate(buryT, [0, 1], [1, 0.4]) : 1;
            const widths = [78, 92, 64, 88, 70, 100, 60, 84, 74, 96, 68];
            if (i >= Math.ceil(filled) && appear < 0.02) return <div key={i} style={{ height: 22 }} />;
            return (
              <div key={i} style={{ height: 22, display: "flex", alignItems: "center", opacity: appear }}>
                {isSignal ? (
                  <div style={{
                    width: `${widths[i]}%`, height: 22, borderRadius: 7,
                    background: `linear-gradient(90deg, ${theme.accentWarm}, #fbbf24)`,
                    opacity: sigDim,
                    boxShadow: `0 0 ${16 * sigDim}px ${theme.accentWarm}aa`,
                    display: "flex", alignItems: "center", paddingLeft: 12,
                    fontFamily: theme.fontMono, fontSize: 16, fontWeight: 800, color: theme.bg, letterSpacing: 1,
                  }}>
                    SIGNAL · the fact that matters
                  </div>
                ) : (
                  <div style={{
                    width: `${widths[i]}%`, height: 17, borderRadius: 6,
                    background: theme.textDim, opacity: 0.7,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Signal-to-noise meter */}
        <div style={{ opacity: meterOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 19 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted, letterSpacing: 1 }}>signal / noise</div>
          <div style={{
            width: 68, height: 384, borderRadius: 34, padding: 10,
            background: theme.surface, border: `1px solid ${theme.border}`,
            display: "flex", flexDirection: "column-reverse", overflow: "hidden",
          }}>
            <div style={{
              height: `${snr}%`, borderRadius: 26,
              background: `linear-gradient(180deg, ${snrColor}, ${snrColor}99)`,
              boxShadow: `0 0 24px ${snrColor}`,
            }} />
          </div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 41, fontWeight: 800, color: snrColor }}>
            {Math.round(snr)}%
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 84, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 43, color: theme.text, lineHeight: 1.5,
      }}>
        More words in{" "}
        <span style={{ ...gradientText("#fbbf24", theme.accentWarm), fontWeight: 800 }}>≠ more understanding out.</span>
      </div>
    </AbsoluteFill>
  );
};
