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

  // Beat map (spoken frames): f0 problem/window · f182 cloud/enormous ·
  // f349 cram (doesn't fit) · f530 rots (mountain) · f701 grab · f865 punchline ·
  // f1037 tease(RAG) · f1181 gap-large · f1318 rest-of-video. End at 1479.
  const base = ci(frame, [0, 36, 1010, 1056], [0, 1, 1, 0]);
  const cramOp = ci(frame, [300, 349, 660, 712], [0, 1, 1, 0]);
  const grabOp = ci(frame, [660, 712, 1010, 1056], [0, 1, 1, 0]);
  const teaseOp = ci(frame, [1024, 1080], [0, 1]);
  const teasePulse = 1 + 0.015 * Math.sin(frame / 13);

  // Window box (left). winTop set so its center (winTop + winH/2 = 468) matches the
  // knowledge grid's center (cloudTop 300 + gridH 336/2 = 468) — align the pair by
  // vertical center so they read level and the connector runs horizontal.
  const winLeft = 200;
  const winTop = 308;
  const winW = 360;
  const winH = 320;
  // Cram fills as VO says "doesn't fit / mountain of irrelevant text" (349→650).
  const cramFill = Math.max(0, Math.floor(ci(frame, [349, 650], [0, 33])));
  const cramRed = ci(frame, [349, 620], [0, 1]);

  // Knowledge cloud (right). Appears with "enormous" at f182.
  const cloudIn = ci(frame, [182, 260], [0, 1]);
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

  // Grab: arm reaches (712→780) then chip travels to window (790→960),
  // landing right as VO says "the moment it needs it" (~f850).
  const armReach = ci(frame, [712, 790], [0, 1]);
  const travelT = ci(frame, [790, 960], [0, 1]);
  const winCx = winLeft + winW / 2;
  const winCy = winTop + winH / 2;
  const chipX = targetX + (winCx - targetX) * travelT;
  const chipY = targetY + (winCy - targetY) * travelT;
  // Landed chip glow keeps breathing through the punchline so it never freezes.
  const landGlow = ci(frame, [955, 990], [0, 1]);
  const landPulse = 0.7 + 0.3 * Math.sin(frame / 11);

  const cramFillBlocks = Array.from({ length: cramFill });
  const cramRedCol = `rgba(${Math.round(34 + cramRed * 214)},${Math.round(211 - cramRed * 98)},${Math.round(153 - cramRed * 40)},1)`;

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />
      <Sfx name="whoosh" at={fps * 0.4} volume={0.3} />
      <Sfx name="whoosh" at={196} volume={0.28} rate={1.12} />
      <Sfx name="block" at={355} volume={0.45} />
      <Sfx name="success" at={958} volume={0.4} />
      <Sfx name="stinger" at={1170} volume={0.45} rate={0.93} />

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
            {/* grab content: single landed chip — keeps breathing so it never freezes */}
            <div style={{ position: "absolute", inset: 0, opacity: grabOp * landGlow }}>
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
                  boxShadow: `0 0 ${18 + landPulse * 22}px ${theme.accentGreen}`,
                  transform: `scale(${0.97 + landGlow * 0.03 * landPulse})`,
                }}
              />
            </div>
          </div>
          <div style={{ position: "absolute", left: winLeft - 20, top: winTop + winH + 16, width: winW + 40, textAlign: "center", fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>
            context window
          </div>

          {/* cloud label — fades in with "enormous" */}
          <div style={{ position: "absolute", left: cloudLeft - 20, top: 250, width: cCols * (cw + cgx), textAlign: "center", fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted, opacity: cloudIn }}>
            everything it might need
          </div>
          {/* cloud blocks — stagger in across the "enormous" beat, keep shimmering */}
          {cloudBlocks.map((_, i) => {
            const c = i % cCols;
            const r = Math.floor(i / cCols);
            const isTarget = i === targetIdx;
            // per-block entrance staggered by index so the cloud "builds up"
            const bIn = ci(frame, [182 + (i % 16) * 4, 230 + (i % 16) * 4], [0, 1]);
            // target lights up as the arm reaches it (712→790), dims as chip leaves
            const tg = isTarget ? grabOp * armReach * (1 - travelT) : 0;
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
                  opacity: cloudIn * bIn,
                  transform: `scale(${0.85 + bIn * 0.15})`,
                  background: isTarget ? `rgba(52,211,153,${0.2 + tg * 0.6})` : `rgba(129,140,248,${0.12 + 0.05 * Math.sin((frame + i * 11) / 24)})`,
                  border: isTarget && tg > 0.1 ? `2px solid ${theme.accentGreen}` : "1px solid #ffffff12",
                  boxShadow: isTarget && tg > 0.2 ? `0 0 18px ${theme.accentGreen}` : "none",
                }}
              />
            );
          })}
        </div>

        {/* CRAM phase: big arrow + badges (badges land on their own VO beats) */}
        <div style={{ opacity: cramOp }}>
          {/* cramming arrow — pulses toward the window so motion never stalls */}
          <div
            style={{
              position: "absolute",
              left: 600 + Math.sin(frame / 9) * 14,
              top: 510,
              fontSize: 90,
              color: theme.accentRed,
              fontWeight: 800,
            }}
          >
            ⟸
          </div>
          <div style={{ position: "absolute", left: winLeft - 20, top: winTop - 70, width: winW + 40, textAlign: "center", display: "flex", justifyContent: "center", gap: 18 }}>
            {[
              { label: "✕ doesn't fit", at: 349 }, // VO "because it doesn't fit"
              { label: "✕ rots", at: 540 },        // VO "in a mountain ... makes the model worse"
            ].map((b, i) => {
              const bIn = ci(frame, [b.at, b.at + 60], [0, 1]);
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 26,
                    fontWeight: 700,
                    color: theme.accentRed,
                    background: "#2a0e0e",
                    border: `2px solid ${theme.accentRed}66`,
                    borderRadius: 999,
                    padding: "8px 20px",
                    opacity: bIn,
                    transform: `translateY(${(1 - bIn) * -14}px)`,
                  }}
                >
                  {b.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* GRAB phase: arm connector + traveling chip. Connector fades out once
            the chip has landed so the punchline can stand alone. */}
        <div style={{ opacity: grabOp }}>
          {/* connector line from window to target — animated dash flow keeps it alive */}
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            <line
              x1={winCx}
              y1={winCy}
              x2={winCx + (targetX - winCx) * armReach}
              y2={winCy + (targetY - winCy) * armReach}
              stroke={theme.accentGreen}
              strokeWidth={3}
              strokeDasharray="6 8"
              strokeDashoffset={-(frame % 28)}
              opacity={0.6 * ci(frame, [712, 760, 960, 1010], [0, 1, 1, 0])}
            />
          </svg>
          {/* traveling chip */}
          {travelT > 0.02 && travelT < 0.98 && (
            <div style={{ position: "absolute", left: chipX - 32, top: chipY - 16, width: 64, height: 32, borderRadius: 6, background: `${theme.accentGreen}55`, border: `2px solid ${theme.accentGreen}`, boxShadow: `0 0 20px ${theme.accentGreen}` }} />
          )}
          {/* "reach out and grab the exact piece" label during travel (f701) */}
          <div
            style={{
              position: "absolute",
              top: 200,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: ci(frame, [712, 770, 940, 1000], [0, 1, 1, 0]),
              fontFamily: theme.fontMono,
              fontSize: 28,
              fontWeight: 700,
              color: theme.accentGreen,
            }}
          >
            grab the exact piece →
          </div>
        </div>

        {/* PUNCHLINE — stands alone, centered, big. VO f865:
            "the right context, on demand." Prior travel labels faded out by now. */}
        {(() => {
          const punchOp = ci(frame, [900, 970, 1010, 1056], [0, 1, 1, 0]);
          const punchPulse = 1 + 0.018 * Math.sin(frame / 12);
          return (
            <div
              style={{
                position: "absolute",
                top: 760,
                left: 0,
                right: 0,
                textAlign: "center",
                opacity: punchOp,
                transform: `scale(${0.94 + punchOp * 0.06 * punchPulse})`,
                fontFamily: theme.fontSans,
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.1,
                color: theme.text,
              }}
            >
              the <span style={gradientText("#6ee7b7", theme.accentGreen)}>right context</span>, on demand
            </div>
          );
        })()}

        {/* TEASE — two staged lines on their own beats, motion runs to f1479.
            f1037 "you already know it — that's RAG" · f1181 "gap to production is large"
            · f1318 "the rest of this video / most people overlook". */}
        {(() => {
          const line1 = ci(frame, [1024, 1100], [0, 1]); // "You know RAG."
          const line2 = ci(frame, [1181, 1255], [0, 1]); // "The gap to production? Huge."
          const tail = ci(frame, [1318, 1392], [0, 1]);   // "It starts where most people overlook."
          return (
            <div
              style={{
                position: "absolute",
                top: 360,
                width: "100%",
                textAlign: "center",
                opacity: teaseOp,
                transform: `scale(${0.93 + teaseOp * 0.07 * teasePulse})`,
              }}
            >
              <div style={{ fontFamily: theme.fontSans, fontSize: 72, fontWeight: 800, color: theme.text, lineHeight: 1.25 }}>
                <div style={{ opacity: line1, transform: `translateY(${(1 - line1) * 18}px)` }}>
                  You know <span style={gradientText("#a5b4fc", theme.accent)}>RAG</span>.
                </div>
                <div style={{ opacity: line2, transform: `translateY(${(1 - line2) * 18}px)` }}>
                  The gap to production? <span style={gradientText("#fbbf24", theme.accentWarm)}>Huge.</span>
                </div>
              </div>
              <div
                style={{
                  marginTop: 40,
                  fontFamily: theme.fontMono,
                  fontSize: 34,
                  fontWeight: 700,
                  color: theme.textMuted,
                  opacity: tail,
                  transform: `translateY(${(1 - tail) * 16}px)`,
                }}
              >
                It starts where <span style={{ color: theme.accentWarm }}>most people overlook.</span>
              </div>
            </div>
          );
        })()}
      </CameraRig>
    </AbsoluteFill>
  );
};
