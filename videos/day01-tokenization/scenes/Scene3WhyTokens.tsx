import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";

// Scene 3 — Why tokens, not words [1:30-2:30]
// Infinite word list (chaos) vs fixed 100k token grid (controlled)

export const Scene3WhyTokens: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: "clamp" });

  // Left side: messy word list scrolling
  const scrollY = interpolate(frame, [0, fps * 8], [0, -300]);

  // Right side: clean token grid
  const gridOpacity = interpolate(frame, [fps * 3, fps * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vsOpacity = interpolate(frame, [fps * 2, fps * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const words = [
    "TikTok", "blockchain", "GPT-4o", "slay", "rizz", "yeet",
    "vibe", "COVID", "metaverse", "Wordle", "ChatGPT", "deepfake",
    "onboarding", "synergy", "disruption", "gaslight", "NFT", "Web3",
    "boujee", "lowkey", "mid", "bussin", "slay", "delulu",
  ];

  const tokens = ["the", "ing", "un", "re", "tion", "al", "er", "ly", "ed", "pre", "dis", "over", "out", "en", "ful", "less", "ness", "ment", "ist", "ize"];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, display: "flex", flexDirection: "column", alignItems: "center" }}>

      <div style={{ opacity: titleOpacity, fontFamily: theme.fontSans, fontSize: 36, color: theme.textMuted, marginTop: 60, marginBottom: 40 }}>
        Why not just use <span style={{ color: theme.accentWarm }}>words</span>?
      </div>

      <div style={{ display: "flex", gap: 80, width: "100%", flex: 1, padding: "0 100px", alignItems: "center" }}>

        {/* Left: chaotic word list */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.accentWarm, marginBottom: 16 }}>
            Words — endless, unpredictable
          </div>
          <div style={{ overflow: "hidden", height: 380, width: "100%", position: "relative" }}>
            <div style={{ transform: `translateY(${scrollY}px)`, display: "flex", flexWrap: "wrap", gap: 12, padding: 12 }}>
              {[...words, ...words].map((w, i) => (
                <div key={i} style={{
                  fontFamily: theme.fontMono, fontSize: 18,
                  color: theme.textMuted,
                  background: theme.surface, padding: "6px 14px", borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                }}>
                  {w}
                </div>
              ))}
              <div style={{ width: "100%", textAlign: "center", color: theme.textDim, fontFamily: theme.fontSans, fontSize: 20, marginTop: 8 }}>
                + hundreds of thousands more...
              </div>
            </div>
            {/* Fade bottom */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(transparent, ${theme.bg})` }} />
          </div>
        </div>

        {/* VS */}
        <div style={{ opacity: vsOpacity, fontFamily: theme.fontSans, fontSize: 40, fontWeight: 800, color: theme.textDim }}>vs</div>

        {/* Right: clean token grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: gridOpacity }}>
          <div style={{ fontFamily: theme.fontSans, fontSize: 22, color: theme.accentGreen, marginBottom: 16 }}>
            Tokens — ~100k, fixed vocabulary
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {tokens.map((t, i) => (
              <div key={i} style={{
                fontFamily: theme.fontMono, fontSize: 18,
                color: theme.text,
                background: `${theme.tokenColors[i % theme.tokenColors.length]}22`,
                border: `1px solid ${theme.tokenColors[i % theme.tokenColors.length]}55`,
                padding: "6px 14px", borderRadius: 8,
              }}>
                {t}
              </div>
            ))}
            <div style={{ fontFamily: theme.fontSans, fontSize: 18, color: theme.accent, width: "100%", textAlign: "center", marginTop: 8 }}>
              Covers any text in any language ✓
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
