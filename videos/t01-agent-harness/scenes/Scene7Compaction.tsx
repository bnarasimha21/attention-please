import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 7 — Editing its own <memory>
// A context window fills with message blocks toward a ~200K limit. A prompt-cache
// badge locks the stable prefix (System + Tools). As it nears the limit, the
// OLDEST turns collapse into one "summary" block — space freed — and it refills.
// ~38s @ 30fps = 1140 frames. Glow: theme.accent.

// The window holds 12 slots. First 2 are the cached prefix (System, Tools).
const SLOTS = 12;

export const Scene7Compaction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // window frame pops in just before blocks fill
  const windowPop = pop(frame, fps, fps * 1, { damping: 12 });
  const windowScale = interpolate(windowPop, [0, 1], [0.85, 1]);

  // Phase 1 — fill from prefix outward (2..11) over 2s..14s.
  const filled = Math.floor(
    interpolate(frame, [fps * 2, fps * 14], [2, SLOTS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  // cache badge locks the prefix around 4s
  const cacheT = interpolate(frame, [fps * 4, fps * 5.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cachePop = pop(frame, fps, fps * 4, { damping: 10 });

  // Overflow warning 14s..17s
  const overflow = frame > fps * 14 && frame < fps * 17.5;
  const warnFlash = overflow ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;

  // Compaction at 17.5s: oldest 5 turns (slots 2..6) collapse into 1 summary
  const compactT = interpolate(frame, [fps * 17.5, fps * 19.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const compacted = compactT > 0.5;
  const summaryPunch = interpolate(pop(frame, fps, fps * 19, { damping: 9 }), [0, 0.5, 1], [0.6, 1.18, 1]);

  // After compaction, keep filling again 21s..30s
  const refill = Math.floor(
    interpolate(frame, [fps * 21, fps * 30], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  const lineOpacity = interpolate(frame, [fps * 31, fps * 33], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // per-slot fill timing for phase-1 turns (slots 2..)
  const slotStart = (i: number) => fps * 2 + (i - 2) * ((fps * 12) / (SLOTS - 2));

  // Build blocks. Each: color, label, weight(w), popAt, cached?
  type Blk = { color: string; label: string; w: number; popAt: number; cached?: boolean };
  const blocks: Blk[] = [];

  // The cached prefix is always first (System + Tools).
  blocks.push({ color: theme.tokenColors[0], label: "System", w: 1, popAt: slotStart(2), cached: true });
  blocks.push({ color: theme.tokenColors[4], label: "Tools", w: 1, popAt: slotStart(3), cached: true });

  if (!compacted) {
    for (let i = 4; i < Math.min(filled, SLOTS); i++) {
      blocks.push({ color: theme.tokenColors[i % theme.tokenColors.length], label: "", w: 1, popAt: slotStart(i) });
    }
  } else {
    // oldest 5 turns → 1 summary block, then keep the most recent 3 + refill
    blocks.push({ color: theme.accent, label: "summary", w: 2, popAt: fps * 19 });
    for (let i = 0; i < 3; i++) {
      blocks.push({ color: theme.tokenColors[(i + 5) % theme.tokenColors.length], label: "", w: 1, popAt: fps * 19 });
    }
    for (let i = 0; i < refill; i++) {
      blocks.push({
        color: theme.tokenColors[i % theme.tokenColors.length], label: "", w: 1,
        popAt: fps * 21 + i * ((fps * 9) / 4),
      });
    }
  }

  const usedSlots = blocks.reduce((a, b) => a + b.w, 0);
  const isFull = !compacted && filled >= SLOTS;
  const tokenCount = Math.round(interpolate(Math.min(usedSlots, SLOTS), [2, SLOTS], [18, 200]));

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <SceneHeading kicker="memory" accent={theme.accent}>
          Editing its own <span style={gradientText("#c7d2fe", theme.accent)}>&lt;memory&gt;</span>
        </SceneHeading>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 70, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
          {/* token counter + limit marker */}
          <div style={{ width: 1440, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontFamily: theme.fontMono }}>
            <div style={{ fontSize: 30, color: isFull ? theme.accentRed : theme.textMuted }}>
              context window — <span style={{ color: theme.text }}>~{tokenCount}K</span> tokens
            </div>
            <div style={{ fontSize: 26, color: isFull ? theme.accentRed : theme.textMuted, opacity: 0.9 }}>
              limit <span style={{ color: isFull ? theme.accentRed : theme.text }}>~200K</span>
            </div>
          </div>

          {/* The window */}
          <div style={{
            width: 1440, height: 178, borderRadius: 24, padding: 18,
            background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
            border: `2px solid ${isFull ? theme.accentRed : theme.border}`,
            boxShadow: warnFlash
              ? `0 0 ${warnFlash * 70}px ${theme.accentRed}, inset 0 0 30px rgba(0,0,0,0.6)`
              : "inset 0 0 30px rgba(0,0,0,0.6), 0 16px 50px rgba(0,0,0,0.4)",
            display: "flex", gap: 12, alignItems: "stretch", overflow: "hidden",
            transform: `scale(${windowScale})`, position: "relative",
          }}>
            {blocks.map((b, i) => {
              const bp = pop(frame, fps, b.popAt, { damping: 10 });
              const bScale = b.label === "summary" ? summaryPunch : interpolate(bp, [0, 1], [0.4, 1]);
              const lockGlow = b.cached ? cacheT : 0;
              return (
                <div key={i} style={{
                  flex: b.w, borderRadius: 12, position: "relative",
                  background: `linear-gradient(160deg, ${b.color}, ${b.color}cc)`,
                  boxShadow: b.cached
                    ? `0 0 ${10 + lockGlow * 22}px ${b.color}88, inset 0 0 0 ${lockGlow * 2.5}px ${theme.text}cc, inset 0 1px 0 rgba(255,255,255,0.25)`
                    : `0 0 18px ${b.color}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: theme.fontMono, fontSize: 22, fontWeight: 700, color: theme.bg,
                  transform: `scale(${bScale})`, opacity: b.label === "summary" ? 1 : bp,
                }}>
                  {b.cached && lockGlow > 0.2 && (
                    <span style={{ position: "absolute", top: 6, right: 8, fontSize: 18, opacity: lockGlow }}>🔒</span>
                  )}
                  {b.label}
                </div>
              );
            })}
            {Array.from({ length: Math.max(0, SLOTS - usedSlots) }).map((_, i) => (
              <div key={`e${i}`} style={{ flex: 1, borderRadius: 10, border: `1px dashed ${theme.border}` }} />
            ))}
          </div>

          {/* prompt-cache badge sitting under the prefix */}
          <div style={{
            width: 1440, display: "flex", justifyContent: "flex-start", paddingLeft: 18,
            opacity: cacheT, transform: `translateY(${(1 - interpolate(cachePop, [0, 1], [0, 1])) * -10}px)`,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 14, padding: "12px 22px", borderRadius: 14,
              background: "linear-gradient(160deg, #14141b 0%, #0d0d12 100%)",
              border: `1px solid ${theme.accent}66`,
              boxShadow: `0 0 ${cacheT * 26}px ${theme.accent}44`,
              fontFamily: theme.fontMono,
            }}>
              <span style={{ fontSize: 24, color: theme.accent, fontWeight: 800 }}>🔒 prompt cache</span>
              <span style={{ fontSize: 22, color: theme.textMuted }}>stable prefix locked</span>
              <span style={{ fontSize: 24, color: theme.accentGreen, fontWeight: 800 }}>cached −90%</span>
            </div>
          </div>

          {/* status label */}
          <div style={{ height: 48, fontFamily: theme.fontSans, fontSize: 35, color: theme.text }}>
            {overflow && <span style={{ color: theme.accentRed }}>⚠ approaching ~200K…</span>}
            {compactT > 0 && compactT < 1 && <span style={{ color: theme.accent }}>collapsing oldest turns → summary</span>}
            {compacted && refill > 0 && <span style={{ color: theme.accentGreen }}>✓ space freed — keeps going</span>}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 88, width: "100%", textAlign: "center", opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 38, color: theme.text }}>
          It rewrites its own <span style={{ color: theme.accent }}>memory</span> as it goes — and you never see it.
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
