import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 4 — The window is finite [0:42-0:56]
// A fixed-size container. A few green "relevant facts" sit inside. Then gray
// "noise" floods in and crowds them out — same window, worse answer.

const SLOTS = 12;

export const Scene4FiniteWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // window appears (1s)
  const winOpacity = interpolate(frame, [fps * 1, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase A (2.5s-4.8s): 4 green relevant facts fill in, plenty of room.
  const signalIn = interpolate(frame, [fps * 2.5, fps * 4.8], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase B (6s-11s): noise floods in, filling the rest AND the limit gets hit.
  const noiseIn = interpolate(frame, [fps * 6, fps * 11], [0, SLOTS - 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // The 4 signal blocks shrink / get squeezed as noise dominates (8s+)
  const squeeze = interpolate(frame, [fps * 8, fps * 11.5], [1, 0.34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const totalUsed = Math.floor(signalIn) + Math.floor(noiseIn);
  const isFull = totalUsed >= SLOTS;
  const warnFlash = frame > fps * 10.5 && frame < fps * 14.5 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;

  const lineOpacity = interpolate(frame, [fps * 13, fps * 14.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // build cells: signal first, then noise, then empty
  const cells: ("signal" | "noise" | "empty")[] = [];
  for (let i = 0; i < Math.floor(signalIn); i++) cells.push("signal");
  for (let i = 0; i < Math.floor(noiseIn); i++) cells.push("noise");
  while (cells.length < SLOTS) cells.push("empty");

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentRed} />

      <SceneHeading kicker="the catch" accent={theme.accentRed}>
        The window is{" "}
        <span style={gradientText("#fca5a5", theme.accentRed)}>finite</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34 }}>
        <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: isFull ? theme.accentRed : theme.textMuted }}>
          context window {isFull ? "— FULL" : `${totalUsed} / ${SLOTS}`}
        </div>

        {/* fixed-size window */}
        <div style={{
          width: 1296, height: 384, borderRadius: 26, padding: 22,
          background: "linear-gradient(180deg, #131318 0%, #0b0b0f 100%)",
          border: `2px solid ${isFull ? theme.accentRed : theme.border}`,
          boxShadow: warnFlash
            ? `0 0 ${warnFlash * 72}px ${theme.accentRed}, inset 0 0 30px rgba(0,0,0,0.6)`
            : "inset 0 0 30px rgba(0,0,0,0.6), 0 18px 55px rgba(0,0,0,0.45)",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 17,
        }}>
          {cells.map((kind, i) => {
            if (kind === "empty") {
              return <div key={i} style={{ borderRadius: 14, border: `1px dashed ${theme.border}` }} />;
            }
            const isSignal = kind === "signal";
            const c = isSignal ? theme.accentGreen : "#4b4b52";
            const scale = isSignal ? squeeze : 1;
            return (
              <div key={i} style={{
                borderRadius: 14, position: "relative",
                background: `linear-gradient(160deg, ${c}, ${c}cc)`,
                boxShadow: isSignal ? `0 0 ${18 * scale}px ${c}66, inset 0 1px 0 rgba(255,255,255,0.25)` : "inset 0 1px 0 rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: theme.fontMono, fontSize: 22 * (isSignal ? scale : 1), fontWeight: 800, color: theme.bg,
                opacity: isSignal ? 1 : 0.92,
                transform: `scale(${isSignal ? 0.6 + scale * 0.4 : 1})`,
              }}>
                {isSignal ? "FACT" : "noise"}
              </div>
            );
          })}
        </div>

        <div style={{ height: 41, fontFamily: theme.fontSans, fontSize: 32 }}>
          {warnFlash > 0 && <span style={{ color: theme.accentRed }}>⚠ junk is crowding out the facts that matter</span>}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 65, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 38, color: theme.text,
      }}>
        Signal drowns in <span style={{ color: theme.textMuted }}>noise.</span> Same window —{" "}
        <span style={{ color: theme.accentRed, fontWeight: 700 }}>worse answer.</span>
      </div>
    </AbsoluteFill>
  );
};
