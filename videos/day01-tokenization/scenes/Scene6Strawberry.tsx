import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";

// Scene 6 — The Strawberry problem [4:15-5:00]
// "strawberry" → tokens ["str"]["aw"]["berry"] — show 'r' in each

const TOKENS = [
  { text: "str",   color: theme.tokenColors[0], rs: 1 },
  { text: "aw",    color: theme.tokenColors[1], rs: 0 },
  { text: "berry", color: theme.tokenColors[2], rs: 2 },
];

export const Scene6Strawberry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Word appears
  const wordOpacity = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: "clamp" });

  // Splits into tokens
  const splitGap = interpolate(frame, [fps * 1.5, fps * 3], [0, 28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // r highlights appear
  const rHighlight = interpolate(frame, [fps * 3.5, fps * 4.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Count labels
  const countOpacity = interpolate(frame, [fps * 5, fps * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // The insight text
  const insightOpacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48 }}>

      {/* Title */}
      <div style={{ fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted, position: "absolute", top: 80 }}>
        Why can't AI count the <span style={{ color: theme.accentRed }}>r</span>'s in "strawberry"?
      </div>

      {/* The word */}
      <div style={{ opacity: wordOpacity, fontFamily: theme.fontMono, fontSize: 56, color: theme.text, letterSpacing: 4 }}>
        strawberry
      </div>

      {/* Token boxes */}
      <div style={{ display: "flex", gap: splitGap, opacity: wordOpacity }}>
        {TOKENS.map((tok, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            {/* Token box with r's highlighted */}
            <div style={{
              background: tok.color,
              color: theme.bg,
              fontFamily: theme.fontMono,
              fontSize: 52, fontWeight: 800,
              padding: "12px 24px", borderRadius: 12,
              display: "flex",
            }}>
              {tok.text.split("").map((char, ci) => (
                <span key={ci} style={{
                  color: char === "r" ? theme.bg : theme.bg,
                  textDecoration: char === "r" ? "underline" : "none",
                  fontWeight: char === "r" ? 900 : 800,
                  opacity: char === "r" ? (0.4 + rHighlight * 0.6) : 1,
                  background: char === "r" ? `rgba(255,255,255,${rHighlight * 0.35})` : "transparent",
                  borderRadius: 4,
                  padding: char === "r" ? "0 2px" : "0",
                }}>
                  {char}
                </span>
              ))}
            </div>

            {/* r count bubble */}
            {tok.rs > 0 && (
              <div style={{
                opacity: rHighlight,
                fontFamily: theme.fontSans, fontSize: 20, fontWeight: 700,
                color: theme.accentRed,
                background: `${theme.accentRed}18`,
                border: `1px solid ${theme.accentRed}44`,
                padding: "4px 14px", borderRadius: 20,
              }}>
                {tok.rs} r{tok.rs > 1 ? "'s" : ""}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Count */}
      <div style={{ opacity: countOpacity, fontFamily: theme.fontSans, fontSize: 28, color: theme.text }}>
        Total: <span style={{ color: theme.accentRed, fontWeight: 800 }}>3 r's</span>
        <span style={{ color: theme.textMuted }}> — but the model sees 3 opaque chunks, not individual letters</span>
      </div>

      {/* Insight */}
      <div style={{
        opacity: insightOpacity,
        fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted,
        textAlign: "center", maxWidth: 800,
        background: theme.surface, padding: "20px 40px", borderRadius: 16,
        border: `1px solid ${theme.border}`,
      }}>
        It's not stupid — it's just looking at <span style={{ color: theme.accent }}>completely different units</span> than you are.
      </div>
    </AbsoluteFill>
  );
};
