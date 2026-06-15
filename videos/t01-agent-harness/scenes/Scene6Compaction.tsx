import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 6 — Context & compaction
// Context window bar fills with message blocks → hits the limit → old blocks
// collapse into a tight summary → space freed → keeps going.

export const Scene6Compaction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The window holds 10 slots. Fill up over 1.5s..6s.
  const SLOTS = 10;
  const filled = Math.floor(interpolate(frame, [fps * 1.5, fps * 6], [0, SLOTS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Overflow warning flashes around 6s..8s
  const overflow = frame > fps * 6 && frame < fps * 8;
  const warnFlash = overflow ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;

  // Compaction at 8s: first 6 blocks collapse into 1 summary block
  const compactT = interpolate(frame, [fps * 8, fps * 9.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const compacted = compactT > 0.5;

  // After compaction, keep filling again (10.5s+)
  const refill = Math.floor(interpolate(frame, [fps * 10.5, fps * 13], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const lineOpacity = interpolate(frame, [fps * 12, fps * 13.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Build the blocks to render
  const blocks: { color: string; label: string; w: number }[] = [];
  if (!compacted) {
    for (let i = 0; i < Math.min(filled, SLOTS); i++) {
      blocks.push({ color: theme.tokenColors[i % theme.tokenColors.length], label: "", w: 1 });
    }
  } else {
    // one summary block (replaces the old 6) + the most recent 4 + refill
    blocks.push({ color: theme.accent, label: "summary", w: 2 });
    for (let i = 0; i < 4; i++) blocks.push({ color: theme.tokenColors[(i + 6) % theme.tokenColors.length], label: "", w: 1 });
    for (let i = 0; i < refill; i++) blocks.push({ color: theme.tokenColors[i % theme.tokenColors.length], label: "", w: 1 });
  }

  const usedSlots = blocks.reduce((a, b) => a + b.w, 0);
  const isFull = !compacted && filled >= SLOTS;

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <SceneHeading kicker="memory management" accent={theme.accent}>
        Keeping memory from <span style={gradientText("#c7d2fe", theme.accent)}>overflowing</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 38 }}>
        <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: (isFull ? theme.accentRed : theme.textMuted) }}>
          context window {isFull ? "— FULL" : `${usedSlots} / ${SLOTS}`}
        </div>

        {/* The window */}
        <div style={{
          width: 1320, height: 168, borderRadius: 22, padding: 18,
          background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
          border: `2px solid ${isFull ? theme.accentRed : theme.border}`,
          boxShadow: warnFlash
            ? `0 0 ${warnFlash * 66}px ${theme.accentRed}, inset 0 0 30px rgba(0,0,0,0.6)`
            : "inset 0 0 30px rgba(0,0,0,0.6), 0 16px 50px rgba(0,0,0,0.4)",
          display: "flex", gap: 12, alignItems: "stretch", overflow: "hidden",
        }}>
          {blocks.map((b, i) => (
            <div key={i} style={{
              flex: b.w, borderRadius: 12,
              background: `linear-gradient(160deg, ${b.color}, ${b.color}cc)`,
              boxShadow: `0 0 18px ${b.color}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: theme.fontMono, fontSize: 24, fontWeight: 700, color: theme.bg,
            }}>{b.label}</div>
          ))}
          {/* empty remaining slots */}
          {Array.from({ length: Math.max(0, SLOTS - usedSlots) }).map((_, i) => (
            <div key={`e${i}`} style={{ flex: 1, borderRadius: 10, border: `1px dashed ${theme.border}` }} />
          ))}
        </div>

        {/* status label */}
        <div style={{ height: 50, fontFamily: theme.fontSans, fontSize: 35, color: theme.text }}>
          {overflow && <span style={{ color: theme.accentRed }}>⚠ approaching the limit…</span>}
          {compactT > 0 && compactT < 1 && <span style={{ color: theme.accent }}>compacting older turns →</span>}
          {compacted && refill > 0 && <span style={{ color: theme.accentGreen }}>✓ space freed — keeps going</span>}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 38, color: theme.text }}>
        The harness quietly <span style={{ color: theme.accent }}>rewrites its own memory</span> — so the agent never "forgets."
      </div>
    </AbsoluteFill>
  );
};
