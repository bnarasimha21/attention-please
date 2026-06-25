import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, gradientText } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 2 — The core problem. Tiny window vs enormous knowledge cloud. Cramming
// it all in overflows (doesn't fit + rots). Reframe: reach in and grab the ONE
// chip you need. Tease: you know RAG — the gap to production is huge.

const ci = (f: number, inp: number[], out: number[]) =>
  interpolate(f, inp, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Scene2CoreProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const base = ci(frame, [0, 40, 1000, 1060], [0, 1, 1, 0]);
  const cramOp = ci(frame, [120, 180, 480, 540], [0, 1, 1, 0]);
  const grabOp = ci(frame, [560, 620, 1000, 1060], [0, 1, 1, 0]);
  const teaseOp = ci(frame, [1055, 1135], [0, 1]);
  const teasePulse = 1 + 0.015 * Math.sin(frame / 13);

  // Window box (left)
  const winLeft = 200;
  const winTop = 380;
  const winW = 360;
  const winH = 320;
  const cramFill = Math.max(0, Math.floor(ci(frame, [170, 430], [0, 33])));
  const cramRed = ci(frame, [200, 430], [0, 1]);

  // Knowledge cloud (right)
  const cloudLeft = 1120;
  const cloudTop = 300;
  const cCols = 8;
  const cRows = 6;
  const cw = 70;
  const ch = 46;
  const cgx = 10;
  const cgy = 12;
  const cloudBlocks = Array.from({ length: cCols * cRows });
  const targetIdx = 27;
  const targetCol = targetIdx % cCols;
  const targetRow = Math.floor(targetIdx / cCols);
  const targetX = cloudLeft + targetCol * (cw + cgx) + cw / 2;
  const targetY = cloudTop + targetRow * (ch + cgy) + ch / 2;

  // Grab: chip travels from cloud target to window center
  const travelT = ci(frame, [700, 880], [0, 1]);
  const winCx = winLeft + winW / 2;
  const winCy = winTop + winH / 2;
  const chipX = targetX + (winCx - targetX) * travelT;
  const chipY = targetY + (winCy - targetY) * travelT;
  const armReach = ci(frame, [620, 700], [0, 1]);

  const cramFillBlocks = Array.from({ length: cramFill });
  const cramRedCol = `rgba(${Math.round(34 + cramRed * 214)},${Math.round(211 - cramRed * 98)},${Math.round(153 - cramRed * 40)},1)`;

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />
      <Sfx name="whoosh" at={fps * 0.4} volume={0.3} />
      <Sfx name="error" at={fps * 13} volume={0.4} />
      <Sfx name="pop" at={fps * 29} volume={0.4} />
      <Sfx name="stinger" at={1060} volume={0.45} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: 70,
            width: "100%",
            textAlign: "center",
            opacity: base,
          }}
        >
          <div style={{ fontFamily: theme.fontMono, fontSize: 25, letterSpacing: 7, color: theme.accent, marginBottom: 12 }}>
            THE WHOLE GAME
          </div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 44, fontWeight: 800, color: theme.text }}>
            Tiny window. <span style={gradientText("#a5b4fc", theme.accent)}>Enormous</span> knowledge.
          </div>
        </div>

        {/* Base: window + cloud */}
        <div style={{ opacity: base }}>
          {/* window box */}
          <div
            style={{
              position: "absolute",
              left: winLeft,
              top: winTop,
              width: winW,
              height: winH,
              borderRadius: 16,
              border: `3px solid ${cramOp > 0.1 ? cramRedCol : "#34d39988"}`,
              background: "rgba(255,255,255,0.02)",
              boxShadow: `0 0 26px ${cramOp > 0.1 ? cramRedCol : "#34d399"}33`,
              overflow: "hidden",
            }}
          >
            {/* cram content */}
            <div style={{ position: "absolute", inset: 14, display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: 7, opacity: cramOp }}>
              {cramFillBlocks.map((_, i) => (
                <div key={i} style={{ width: 38, height: 16, borderRadius: 3, background: theme.tokenColors[i % theme.tokenColors.length], opacity: 0.5 }} />
              ))}
            </div>
            {/* grab content: single landed chip */}
            <div style={{ position: "absolute", inset: 0, opacity: grabOp }}>
              {travelT > 0.97 && (
                <div
                  style={{
                    position: "absolute",
                    left: winW / 2 - 70,
                    top: winH / 2 - 22,
                    width: 140,
                    height: 44,
                    borderRadius: 8,
                    background: `${theme.accentGreen}33`,
                    border: `2px solid ${theme.accentGreen}`,
                    boxShadow: `0 0 26px ${theme.accentGreen}`,
                  }}
                />
              )}
            </div>
          </div>
          <div style={{ position: "absolute", left: winLeft - 20, top: winTop + winH + 16, width: winW + 40, textAlign: "center", fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>
            context window
          </div>

          {/* cloud label */}
          <div style={{ position: "absolute", left: cloudLeft - 20, top: 250, width: cCols * (cw + cgx), textAlign: "center", fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>
            everything it might need
          </div>
          {/* cloud blocks */}
          {cloudBlocks.map((_, i) => {
            const c = i % cCols;
            const r = Math.floor(i / cCols);
            const isTarget = i === targetIdx;
            const tg = isTarget ? grabOp * ci(frame, [620, 700], [0, 1]) * (1 - travelT) : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: cloudLeft + c * (cw + cgx),
                  top: cloudTop + r * (ch + cgy),
                  width: cw,
                  height: ch,
                  borderRadius: 6,
                  background: isTarget ? `rgba(52,211,153,${0.2 + tg * 0.6})` : `rgba(129,140,248,${0.12 + 0.05 * Math.sin((frame + i * 11) / 24)})`,
                  border: isTarget && tg > 0.1 ? `2px solid ${theme.accentGreen}` : "1px solid #ffffff12",
                  boxShadow: isTarget && tg > 0.2 ? `0 0 18px ${theme.accentGreen}` : "none",
                }}
              />
            );
          })}
        </div>

        {/* CRAM phase: big arrow + badges */}
        <div style={{ opacity: cramOp }}>
          <div style={{ position: "absolute", left: 600, top: 510, fontSize: 90, color: theme.accentRed, fontWeight: 800 }}>⟸</div>
          <div style={{ position: "absolute", left: winLeft - 20, top: winTop - 70, width: winW + 40, textAlign: "center", display: "flex", justifyContent: "center", gap: 18 }}>
            {["✕ doesn't fit", "✕ rots"].map((b, i) => (
              <div key={i} style={{ fontFamily: theme.fontMono, fontSize: 26, fontWeight: 700, color: theme.accentRed, background: "#2a0e0e", border: `2px solid ${theme.accentRed}66`, borderRadius: 999, padding: "8px 20px" }}>
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* GRAB phase: arm connector + traveling chip + caption */}
        <div style={{ opacity: grabOp }}>
          {/* connector line from window to target */}
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <line
              x1={winCx}
              y1={winCy}
              x2={winCx + (targetX - winCx) * armReach}
              y2={winCy + (targetY - winCy) * armReach}
              stroke={theme.accentGreen}
              strokeWidth={3}
              strokeDasharray="6 8"
              opacity={0.6}
            />
          </svg>
          {/* traveling chip */}
          {travelT > 0.02 && travelT < 0.98 && (
            <div style={{ position: "absolute", left: chipX - 32, top: chipY - 16, width: 64, height: 32, borderRadius: 6, background: `${theme.accentGreen}55`, border: `2px solid ${theme.accentGreen}`, boxShadow: `0 0 20px ${theme.accentGreen}` }} />
          )}
        </div>

        {/* GRAB caption — direct CameraRig child (mirrors header) so it centers on the full frame */}
        <div style={{ position: "absolute", top: 790, left: 0, right: 0, textAlign: "center", opacity: grabOp, fontFamily: theme.fontSans, fontSize: 36, fontWeight: 700, color: theme.accentGreen }}>
          the right context, on demand
        </div>

        {/* TEASE */}
        <div
          style={{
            position: "absolute",
            top: 430,
            width: "100%",
            textAlign: "center",
            opacity: teaseOp,
            transform: `scale(${0.92 + teaseOp * 0.08 * teasePulse})`,
          }}
        >
          <div style={{ fontFamily: theme.fontSans, fontSize: 72, fontWeight: 800, color: theme.text, lineHeight: 1.2 }}>
            You know RAG.
            <br />
            The gap to production? <span style={gradientText("#fbbf24", theme.accentWarm)}>Huge.</span>
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
