import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 4 - Failure 2: Context Rot (break → fix demonstration)
// HERO: a persistent MODEL ACCURACY meter.
//  - NAIVE (~4–50s): context fills with junk turn by turn (tokens → ~146K) and
//    the accuracy meter SINKS 95% → ~50%. "junk in → IQ down."
//  - FIX (~56–101s): four fixes apply one by one, each visibly RECOVERING the
//    meter - compaction, sub-agent isolation (30K→2K), memory file, reorder to
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
  const fixIn = interpolate(frame, [fps * 48.2, fps * 49.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  // fix layer fades OUT as the punchline hero enters (~105.5–107s), so nothing
  // sits behind the centered punchline.
  const fixOut = interpolate(frame, [fps * 105.5, fps * 107], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fixOp = fixIn * fixOut;

  // rows land turn by turn (naive) - synced to the junk piling up (~4–37s)
  const rowStart = (i: number) => fps * 4 + i * fps * 5.5;

  // fix landing frames - synced to each fix's narration:
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

  // ===== LIVE "curating…" inset (~49–58.5s): bridges the static gap between the
  // sub-heading and the first fix card. Raw tool output (long red lines) is
  // visibly CURATED into short green summaries / truncated reads, tied to
  // "you curate it / summaries instead of raw tool output / truncated file reads".
  // Fades fully OUT before Compaction (F[0]=59s) lands, so it never overlaps the card.
  const curIn = interpolate(frame, [fps * 48.6, fps * 49.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const curOut = interpolate(frame, [fps * 57.8, fps * 58.8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const curOp = curIn * curOut;
  // continuous local time inside the inset window - NaN-guarded, never < 0.
  const curT = Math.max(0, (frame - fps * 49.6) / fps);
  // five raw rows curate one-by-one across the window (each row: long red → short green).
  const CUR_ROWS = Array.from({ length: 5 }, (_, k) => {
    // staggered: row k starts curating at ~49.8 + k*1.5s, over ~1.2s.
    const t = interpolate(frame, [fps * (49.8 + k * 1.5), fps * (51.0 + k * 1.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
    // raw width shrinks 560→150 as it collapses into a summary; hue red→green.
    const w = 560 - t * 410;
    const col = interpolateColors(t, [0, 1], [red, green]);
    // a soft live shimmer travels along not-yet-curated rows so nothing sits dead.
    const shimmer = 0.5 + 0.5 * Math.sin(curT * 3.2 - k * 0.8);
    return { t, w: Math.max(0, w), col, shimmer };
  });
  // a running "curated" counter ticks up as rows collapse (live number motion).
  const curatedCount = Math.min(5, Math.floor(CUR_ROWS.reduce((n, r) => n + (r.t > 0.85 ? 1 : 0), 0)));

  // subtle "trying to recover" shimmer on the 50% meter during the static window
  // (~48–59s), so the bottomed bar pulses instead of looking frozen. It formally
  // recovers when the cards land (accuracy stays 50 here). NaN-guarded.
  const recoverT = Math.max(0, (frame - fps * 48) / fps);
  const recoverWin = interpolate(frame, [fps * 48, fps * 48.6, fps * 58, fps * 58.8], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const accShimmer = recoverWin * (0.5 + 0.5 * Math.sin(recoverT * 4.4));

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

  // ===== LIVE FINALE MOTION (106–120s): keep the hold frame breathing =====
  // continuous time since the hero settled - NaN-guarded, never < 0.
  const breatheT = Math.max(0, (frame - fps * 107.5) / fps);
  // gentle out-of-phase breathing for the RAM (green) / hard drive (red) words.
  const ramBreath = 1 + 0.018 * Math.sin(breatheT * 1.7);
  const ramGlow = 14 + 10 * (0.5 + 0.5 * Math.sin(breatheT * 1.7));
  const hddBreath = 1 + 0.018 * Math.sin(breatheT * 1.7 + Math.PI);
  const hddGlow = 14 + 10 * (0.5 + 0.5 * Math.sin(breatheT * 1.7 + Math.PI));

  // IQ / noise beat (~114–120s): "everything else is noise · noise costs IQ".
  const iqIn = interpolate(frame, [fps * 113.6, fps * 114.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // IQ ticks DOWN 100 → 88 as noise accumulates (116.4–119.0s), then settles.
  const iqValue = interpolate(frame, [fps * 116.4, fps * 119.0], [100, 88], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // faint drifting noise specks accumulate over the same window, then hold.
  const noiseT = Math.max(0, (frame - fps * 114.6) / fps);
  const noiseFill = interpolate(frame, [fps * 114.6, fps * 119.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const SPECKS = Array.from({ length: 14 }, (_, k) => {
    const seed = k * 12.9898;
    const bx = 14 + ((Math.sin(seed) * 43758.5453) % 1 + 1) % 1 * 100; // 14..114 %-ish, deterministic
    const phase = (Math.cos(seed) * 0.5 + 0.5) * Math.PI * 2;
    const visible = noiseFill > (k / 14) ? 1 : 0;
    const drift = Math.sin(noiseT * 1.3 + phase) * 4;
    return { bx, drift, visible };
  });

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

        {/* ===== HERO meter (persists across naive + fix; clears for punchline) ===== */}
        <div style={{ position: "absolute", top: 226, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: fixOut }}>
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
              <div style={{ width: `${accuracy}%`, height: "100%", background: `linear-gradient(90deg, ${accColor}, ${accColor}aa)`, boxShadow: `0 0 ${22 + accShimmer * 26}px ${accColor}`, opacity: 1 - accShimmer * 0.12, transition: "none" }} />
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
        <div style={{ position: "absolute", top: 378, width: "100%", textAlign: "center", opacity: fixOp, fontFamily: theme.fontSans, fontSize: 34, fontWeight: 700, color: theme.text }}>
          Get the junk <span style={{ color: green, fontWeight: 800 }}>out of the window</span> - watch the IQ come back.
        </div>

        {/* ===== LIVE "curating…" inset (~49–58.5s) — bridges the static gap ===== */}
        {/* Sits in the empty band below the sub-heading and above the (later) cards. */}
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            opacity: curOp,
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.fontMono, fontSize: 24, letterSpacing: 1, color: theme.textMuted, textTransform: "uppercase" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: green, boxShadow: `0 0 ${8 + 8 * (0.5 + 0.5 * Math.sin(curT * 4))}px ${green}` }} />
            curating context
            <span style={{ color: green, fontWeight: 800 }}>{curatedCount}/5</span>
          </div>

          {CUR_ROWS.map((r, k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 20, width: 920 }}>
              {/* raw tool output → curated summary, collapsing left-to-right */}
              <div style={{ width: 600, height: 26, display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: r.w,
                    height: 16,
                    borderRadius: 5,
                    background: `linear-gradient(90deg, ${r.col}, ${r.col}55)`,
                    boxShadow: `0 0 ${8 + r.shimmer * (1 - r.t) * 14}px ${r.col}55`,
                    opacity: 0.85 + r.shimmer * (1 - r.t) * 0.15,
                  }}
                />
                {/* truncation marker that stays after collapse */}
                <span style={{ marginLeft: 12, fontFamily: theme.fontMono, fontSize: 18, color: green, opacity: r.t }}>summary</span>
              </div>
              <span style={{ fontSize: 26, color: green, opacity: r.t }}>✓</span>
              <span style={{ fontFamily: theme.fontMono, fontSize: 20, color: theme.textDim, opacity: r.t }}>
                {k % 2 === 0 ? "raw tool output → summary" : "truncated read · relevant section"}
              </span>
            </div>
          ))}
        </div>

        {/* ===== FIX cards row ===== */}
        <div
          style={{
            position: "absolute",
            top: 449,
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

        {/* punchline - big centered hero, alone */}
        <div
          style={{
            position: "absolute",
            top: 380,
            height: 240,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            textAlign: "center",
            opacity: punchT,
            transform: `translateY(${(1 - punchPop) * 20}px)`,
            padding: "0 120px",
          }}
        >
          <div style={{ fontFamily: theme.fontSans, fontSize: 80, fontWeight: 800, color: theme.text, lineHeight: 1.1 }}>
            Treat context like{" "}
            <span style={{ color: green, fontWeight: 800, display: "inline-block", transform: `scale(${ramBreath})`, textShadow: `0 0 ${ramGlow}px ${green}aa` }}>RAM</span>,<br />
            not a{" "}
            <span style={{ color: red, fontWeight: 800, display: "inline-block", transform: `scale(${hddBreath})`, textShadow: `0 0 ${hddGlow}px ${red}aa` }}>hard drive</span>.
          </div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 40, fontWeight: 600, color: theme.textMuted }}>
            Keep only what's needed now.
          </div>
        </div>

        {/* ===== LIVE sub-element: noise costs IQ points per turn (~114–120s) ===== */}
        <div
          style={{
            position: "absolute",
            top: 742,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 26,
            opacity: iqIn,
          }}
        >
          {/* drifting noise specks accumulating */}
          <div style={{ position: "relative", width: 230, height: 86 }}>
            {SPECKS.map((sp, k) => (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: `${sp.bx}%`,
                  top: `${18 + (k % 5) * 13}px`,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: red,
                  opacity: sp.visible * 0.55,
                  transform: `translateY(${sp.drift}px)`,
                  boxShadow: `0 0 8px ${red}88`,
                }}
              />
            ))}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontMono, fontSize: 20, letterSpacing: 1, color: theme.textDim, textTransform: "uppercase" }}>
              noise
            </div>
          </div>

          <div style={{ fontSize: 30, color: theme.textMuted }}>→</div>

          {/* IQ meter ticking down */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: theme.fontMono, fontSize: 24, letterSpacing: 2, color: theme.textMuted, textTransform: "uppercase" }}>IQ</span>
            <span style={{ fontFamily: theme.fontMono, fontSize: 64, fontWeight: 800, color: interpolateColors(iqValue, [88, 100], [red, green]), textShadow: `0 0 16px ${interpolateColors(iqValue, [88, 100], [red, green])}66` }}>
              {Math.round(iqValue)}
            </span>
            <span style={{ fontFamily: theme.fontMono, fontSize: 26, fontWeight: 800, color: red, opacity: noiseFill }}>▼</span>
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
