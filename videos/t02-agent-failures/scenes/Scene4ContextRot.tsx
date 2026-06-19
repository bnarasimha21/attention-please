import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 4 — Failure 2: Context Rot (break → fix demonstration)
// HERO: a persistent MODEL ACCURACY meter.
//  - NAIVE (~4–50s): context fills with junk turn by turn (tokens → ~146K) and
//    the accuracy meter SINKS 95% → ~50%. "junk in → IQ down."
//  - FIX (~56–101s): four fixes apply one by one, each visibly RECOVERING the
//    meter — compaction, sub-agent isolation (30K→2K), memory file, reorder to
//    the edges (lost-in-the-middle). Meter climbs back to ~91%.
//  - Punchline (~110s): treat context like RAM, not a hard drive.
// Re-paced to the s04 narration clip (~121.5s / 3645 frames).

type Row = { label: string; tokens: number; kind: "ok" | "noise" | "buried" };

const ROWS: Row[] = [
  { label: "[System prompt]", tokens: 2000, kind: "ok" },
  { label: "[Tool definitions]", tokens: 2000, kind: "ok" },
  { label: "[Turn 1] user goal", tokens: 100, kind: "ok" },
  { label: "[Turn 2] grep dump", tokens: 800, kind: "noise" },
  { label: "[Turn 3] file read · 90% junk", tokens: 1200, kind: "noise" },
  { label: "[Turn 4–29] accumulated noise", tokens: 140000, kind: "noise" },
  { label: "[Turn 30] actual goal · buried", tokens: 100, kind: "buried" },
];

const fmt = (n: number) => n.toLocaleString("en-US");
const barW = (tokens: number) =>
  interpolate(Math.log10(tokens), [2, Math.log10(140000)], [90, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Lost-in-the-middle U-curve geometry (recall high at edges, low in middle).
const U_RECALL = [1.0, 0.72, 0.42, 0.28, 0.42, 0.72, 1.0];
const U_W = 340;
const U_H = 150;
const U_POINTS = U_RECALL.map((r, i) => ({
  x: 14 + (i / (U_RECALL.length - 1)) * (U_W - 28),
  y: 14 + (1 - r) * (U_H - 38),
  r,
}));
const U_POLY = U_POINTS.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

// The four fixes, each bumps the accuracy meter when it lands.
const FIXES = [
  { title: "Compaction", sub: "collapse junk → summary", delta: "+12%", note: "" },
  { title: "Sub-agent isolation", sub: "30K read → 2K summary", delta: "+12%", note: "~90% better · Anthropic internal" },
  { title: "Memory file", sub: "offload to NOTES.md on disk", delta: "+9%", note: "" },
  { title: "Reorder to edges", sub: "beat lost-in-the-middle", delta: "+8%", note: "" },
];

export const Scene4ContextRot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const warm = theme.accentWarm;
  const green = theme.accentGreen;
  const red = theme.accentRed;

  // hook caption
  const hookT = interpolate(frame, [fps * 1.5, fps * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // naive → fix handoff: the naive stack fully fades OUT before the fix layer
  // fades IN (no ghosting/overlap), around "the fix is context engineering" (~47.9s).
  const naiveOp = interpolate(frame, [fps * 46.5, fps * 47.8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const fixOp = interpolate(frame, [fps * 48.2, fps * 49.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });

  // rows land turn by turn (naive) — synced to the junk piling up (~4–37s)
  const rowStart = (i: number) => fps * 4 + i * fps * 5.5;

  // fix landing frames — synced to each fix's narration:
  // compaction ~59s, sub-agent ~74s, memory file ~84s, lost-in-the-middle ~92s
  const F = [fps * 59, fps * 74, fps * 84, fps * 92];

  // ===== HERO: model accuracy meter =====
  // sinks 95→50 during naive, then steps back up as each fix lands.
  const accuracy = interpolate(
    frame,
    [0, fps * 8, fps * 47, F[0], F[0] + fps * 1.2, F[1], F[1] + fps * 1.2, F[2], F[2] + fps * 1.2, F[3], F[3] + fps * 1.2],
    [95, 95, 50, 50, 62, 62, 74, 74, 83, 83, 91],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const accColor = interpolateColors(accuracy, [50, 70, 91], [red, warm, green]);

  // context token count: climbs in naive, drops as fixes curate it away
  const tokens = interpolate(
    frame,
    [fps * 5, fps * 47, F[0], F[3] + fps * 1.2],
    [2000, 146200, 146200, 8000],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // sub-agent bubble (inside fix card 2)
  const p2 = F[1];
  const subRead = interpolate(frame, [p2 + fps * 0.2, p2 + fps * 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subReturn = interpolate(frame, [p2 + fps * 1.0, p2 + fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subTokens = Math.round(subRead * 30000 * (1 - subReturn) + 2000 * subReturn);

  // U-curve draw (inside fix card 4)
  const p4 = F[3];
  const uDraw = interpolate(frame, [p4 + fps * 0.2, p4 + fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // punchline
  const punchT = interpolate(frame, [fps * 106, fps * 107.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchPop = pop(frame, fps, fps * 106, { damping: 13 });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={warm} />

      {/* ===== SFX cues ===== */}
      {ROWS.map((_, i) => (
        <Sfx key={`t${i}`} name="tick" at={rowStart(i)} volume={0.3} />
      ))}
      <Sfx name="error" at={fps * 42} volume={0.5} />
      <Sfx name="whoosh" at={fps * 48} volume={0.4} />
      <Sfx name="success" at={F[0] + fps * 1} volume={0.45} />
      <Sfx name="success" at={F[1] + fps * 1} volume={0.45} />
      <Sfx name="success" at={F[2] + fps * 1} volume={0.45} />
      <Sfx name="success" at={F[3] + fps * 1} volume={0.5} />
      <Sfx name="stinger" at={fps * 106} volume={0.4} />

      <CameraRig>
        <SceneHeading kicker="failure 2" accent={warm}>
          Context <span style={gradientText("#fcd34d", warm)}>Rot</span>
        </SceneHeading>

        {/* ===== HERO meter (persists across naive + fix) ===== */}
        <div style={{ position: "absolute", top: 226, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <span style={{ fontFamily: theme.fontMono, fontSize: 28, letterSpacing: 2, color: theme.textMuted, textTransform: "uppercase" }}>
              Model accuracy
            </span>
            <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.textDim }}>
              context: <span style={{ color: tokens > 60000 ? red : green, fontWeight: 700 }}>{fmt(Math.round(tokens))} tok</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 880, height: 40, borderRadius: 20, background: theme.surface, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              <div style={{ width: `${accuracy}%`, height: "100%", background: `linear-gradient(90deg, ${accColor}, ${accColor}aa)`, boxShadow: `0 0 22px ${accColor}`, transition: "none" }} />
            </div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 76, fontWeight: 800, color: accColor, width: 180 }}>
              {Math.round(accuracy)}%
            </div>
          </div>
        </div>

        {/* ===== NAIVE: rotting context stack ===== */}
        <div
          style={{
            position: "absolute",
            top: 350,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            opacity: naiveOp,
            pointerEvents: "none",
          }}
        >
          {ROWS.map((r, i) => {
            const s = pop(frame, fps, rowStart(i), { damping: 13, stiffness: 150 });
            const op = interpolate(frame, [rowStart(i), rowStart(i) + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const color = r.kind === "ok" ? green : r.kind === "buried" ? warm : red;
            const isBig = r.tokens >= 100000;
            return (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 22, width: 1040, opacity: op, transform: `translateX(${(1 - s) * -30}px)` }}>
                <div style={{ width: 380, textAlign: "right", fontFamily: theme.fontMono, fontSize: 24, color: r.kind === "ok" ? theme.text : theme.textMuted }}>
                  {r.label}
                </div>
                <div style={{ width: barW(r.tokens) * op, height: isBig ? 40 : 30, borderRadius: 7, background: `linear-gradient(90deg, ${color}, ${color}66)`, boxShadow: `0 0 ${isBig ? 26 : 11}px ${color}55` }} />
                <div style={{ fontFamily: theme.fontMono, fontSize: 24, color, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {fmt(r.tokens)}
                  {r.kind === "noise" && <span style={{ color: red, marginLeft: 8 }}>noise</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* hook caption (naive) */}
        <div style={{ position: "absolute", bottom: 200, width: "100%", textAlign: "center", opacity: hookT * naiveOp, fontFamily: theme.fontSans, fontSize: 42, fontWeight: 600, color: theme.text }}>
          A longer conversation makes the model <span style={{ color: warm, fontWeight: 800 }}>dumber.</span>
        </div>

        {/* fix sub-heading */}
        <div style={{ position: "absolute", top: 356, width: "100%", textAlign: "center", opacity: fixOp, fontFamily: theme.fontSans, fontSize: 34, fontWeight: 700, color: theme.text }}>
          Get the junk <span style={{ color: green, fontWeight: 800 }}>out of the window</span> — watch the IQ come back.
        </div>

        {/* ===== FIX cards row ===== */}
        <div
          style={{
            position: "absolute",
            top: 424,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: 30,
            opacity: fixOp,
            pointerEvents: "none",
          }}
        >
          {FIXES.map((fx, i) => {
            const start = F[i];
            const cardPop = pop(frame, fps, start, { damping: 13, stiffness: 150 });
            const cardOp = interpolate(frame, [start, start + fps * 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const deltaOp = interpolate(frame, [start + fps * 0.9, start + fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const live = frame > start + fps * 0.3;
            return (
              <div
                key={fx.title}
                style={{
                  width: 392,
                  height: 476,
                  opacity: cardOp,
                  transform: `translateY(${(1 - cardPop) * 36}px) scale(${0.9 + cardPop * 0.1})`,
                  borderRadius: 24,
                  padding: "30px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: `linear-gradient(160deg, #15151c, ${theme.surface})`,
                  border: `1px solid ${live ? green + "66" : theme.border}`,
                  boxShadow: `0 22px 56px rgba(0,0,0,0.5), 0 0 ${live ? 26 : 0}px ${green}33`,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, alignSelf: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontFamily: theme.fontMono, fontSize: 20, color: theme.textDim }}>{`0${i + 1}`}</span>
                  <span style={{ fontFamily: theme.fontSans, fontSize: 31, fontWeight: 800, color: theme.text }}>{fx.title}</span>
                </div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.textMuted, alignSelf: "flex-start", marginBottom: 16 }}>{fx.sub}</div>

                {/* per-card mini visualization */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                  {i === 0 && (
                    // compaction: many junk blocks collapse into one green block
                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7, opacity: 1 - deltaOp }}>
                        {[0, 1, 2, 3, 4].map((k) => (
                          <div key={k} style={{ width: 112, height: 16, borderRadius: 4, background: `${red}99` }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 38, color: green, opacity: deltaOp }}>→</div>
                      <div style={{ width: 92, height: 42, borderRadius: 8, background: green, boxShadow: `0 0 16px ${green}`, opacity: deltaOp }} />
                    </div>
                  )}
                  {i === 1 && (
                    // sub-agent: shrinking bubble, returns 2K chip
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 154,
                          height: 154,
                          borderRadius: "50%",
                          transform: `scale(${0.6 + subRead * 0.5 - subReturn * 0.45})`,
                          background: `radial-gradient(circle at 38% 32%, #a7f3d0 0%, ${green} 45%, #047857 100%)`,
                          boxShadow: `0 0 ${18 + subRead * 36}px ${green}aa`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 1 - subReturn * 0.5,
                        }}
                      >
                        <div style={{ fontFamily: theme.fontMono, fontSize: 32, fontWeight: 800, color: theme.bg }}>{fmt(subTokens)}</div>
                        <div style={{ fontFamily: theme.fontMono, fontSize: 18, color: "#064e3b" }}>tokens</div>
                      </div>
                      <div style={{ fontFamily: theme.fontMono, fontSize: 20, fontWeight: 700, color: theme.bg, background: green, borderRadius: 8, padding: "5px 14px", opacity: subReturn, boxShadow: `0 0 14px ${green}` }}>
                        ↑ 2K summary to main thread
                      </div>
                    </div>
                  )}
                  {i === 2 && (
                    // memory file: NOTES.md → disk
                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                      <div style={{ width: 124, height: 152, borderRadius: 12, background: theme.surface, border: `1px solid ${theme.border}`, padding: "14px 12px" }}>
                        <div style={{ fontSize: 34, lineHeight: 1 }}>📝</div>
                        <div style={{ fontFamily: theme.fontMono, fontSize: 18, color: theme.accent, margin: "8px 0 10px" }}>NOTES.md</div>
                        {[0.9, 0.7, 0.95, 0.55].map((w, k) => (
                          <div key={k} style={{ width: `${w * 100}%`, height: 6, borderRadius: 3, background: theme.border, marginBottom: 8 }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 34, color: green, opacity: deltaOp }}>→</div>
                      <div style={{ fontSize: 68, opacity: deltaOp, filter: `drop-shadow(0 0 12px ${theme.accent}88)` }}>💾</div>
                    </div>
                  )}
                  {i === 3 && (
                    // reorder: mini lost-in-the-middle U-curve
                    <svg width={340} height={186} viewBox={`0 0 ${U_W} ${U_H + 26}`}>
                      <rect x={0} y={0} width={U_W * 0.22} height={U_H} fill={green} opacity={0.1} />
                      <rect x={U_W * 0.78} y={0} width={U_W * 0.22} height={U_H} fill={green} opacity={0.1} />
                      <rect x={U_W * 0.34} y={0} width={U_W * 0.32} height={U_H} fill={red} opacity={0.12} />
                      <polyline points={U_POLY} fill="none" stroke={theme.textMuted} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={900} strokeDashoffset={(1 - uDraw) * 900} />
                      {U_POINTS.map((p, k) => {
                        const isEdge = k === 0 || k === U_POINTS.length - 1;
                        const isMid = k === 3;
                        if (!isEdge && !isMid) return null;
                        const col = isEdge ? green : red;
                        return <circle key={k} cx={p.x} cy={p.y} r={7} fill={col} opacity={uDraw} style={{ filter: `drop-shadow(0 0 8px ${col})` }} />;
                      })}
                      <text x={10} y={U_H + 20} fontFamily={theme.fontMono} fontSize={20} fill={green}>start</text>
                      <text x={U_W / 2 - 22} y={U_H + 20} fontFamily={theme.fontMono} fontSize={20} fill={red}>middle</text>
                      <text x={U_W - 40} y={U_H + 20} fontFamily={theme.fontMono} fontSize={20} fill={green}>end</text>
                    </svg>
                  )}
                </div>

                {/* delta chip + note */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, opacity: deltaOp }}>
                  <span style={{ fontFamily: theme.fontMono, fontSize: 30, fontWeight: 800, color: green }}>▲ accuracy {fx.delta}</span>
                </div>
                <div style={{ minHeight: 30, fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, marginTop: 6, opacity: deltaOp, textAlign: "center", lineHeight: 1.25 }}>{fx.note}</div>
              </div>
            );
          })}
        </div>

        {/* punchline */}
        <div
          style={{
            position: "absolute",
            bottom: 200,
            width: "100%",
            textAlign: "center",
            opacity: punchT,
            transform: `translateY(${(1 - punchPop) * 16}px)`,
            fontFamily: theme.fontSans,
            fontSize: 34,
            fontWeight: 600,
            color: theme.text,
            padding: "0 120px",
          }}
        >
          Treat context like <span style={{ color: green, fontWeight: 800 }}>RAM</span>, not a{" "}
          <span style={{ color: red, fontWeight: 800 }}>hard drive</span> — keep only what's needed now.
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
