import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 7 — When to use it
// Two guidance cards: LET IT THINK (hard math/code/logic — green) vs
// DON'T BOTHER (simple lookups/chit-chat — muted). Match effort to the problem.

const CARDS = [
  {
    title: "LET IT THINK",
    icon: "🧠",
    color: theme.accentGreen,
    verdict: "compute pays off",
    items: ["hard math", "writing code", "multi-step logic", "tricky planning"],
  },
  {
    title: "DON'T BOTHER",
    icon: "💬",
    color: theme.textMuted,
    verdict: "just burns time & money",
    items: ["simple lookups", "quick chit-chat", "“capital of France?”", "yes/no facts"],
  },
];

export const Scene7WhenToUse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // closing line — holds fully visible to scene end (20s)
  const lineOpacity = interpolate(frame, [fps * 11, fps * 12.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <SceneHeading kicker="when to use it" accent={theme.accentGreen}>
        Match the effort to the <span style={gradientText("#6ee7b7", theme.accentGreen)}>problem</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 210, left: 0, right: 0, bottom: 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 96 }}>
        {CARDS.map((card, ci) => {
          const cardStart = fps * (1.5 + ci * 2.5);
          const cardSpring = spring({ frame: frame - cardStart, fps, config: { damping: 16 } });
          const cardOpacity = interpolate(frame, [cardStart, cardStart + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const isGood = ci === 0;
          return (
            <div key={card.title} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardSpring) * 34}px)`,
              width: 648, padding: 41, borderRadius: 26,
              background: isGood
                ? `linear-gradient(180deg, ${card.color}12, #0c0c10)`
                : "linear-gradient(180deg, #121216, #0b0b0e)",
              border: `${isGood ? 2 : 1}px solid ${isGood ? card.color : theme.border}`,
              boxShadow: isGood ? `0 22px 60px rgba(0,0,0,0.5), 0 0 40px ${card.color}33` : "0 22px 60px rgba(0,0,0,0.5)",
              display: "flex", flexDirection: "column", gap: 26,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 19 }}>
                <div style={{
                  width: 77, height: 77, borderRadius: 19, fontSize: 43,
                  background: "linear-gradient(160deg, #17171f, #0e0e13)", border: `1px solid ${theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{card.icon}</div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 43, fontWeight: 800, color: isGood ? card.color : theme.text, letterSpacing: 1 }}>
                  {card.title}
                </div>
              </div>

              {/* example chips, staggered ~1.2s apart */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                {card.items.map((it, ii) => {
                  const chipStart = cardStart + fps * (0.7 + ii * 1.2);
                  const o = interpolate(frame, [chipStart, chipStart + fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const x = interpolate(frame, [chipStart, chipStart + fps * 0.4], [-16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <span key={it} style={{
                      opacity: o, transform: `translateX(${x}px)`,
                      padding: "12px 22px", borderRadius: 999,
                      background: isGood ? `${card.color}16` : theme.surface,
                      border: `1px solid ${isGood ? card.color + "55" : theme.border}`,
                      fontFamily: theme.fontMono, fontSize: 27, color: isGood ? card.color : theme.textMuted,
                    }}>{it}</span>
                  );
                })}
              </div>

              {/* verdict footer */}
              <div style={{
                marginTop: "auto", paddingTop: 19, borderTop: `1px solid ${theme.border}`,
                fontFamily: theme.fontSans, fontSize: 30, color: isGood ? card.color : theme.textDim,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontWeight: 800 }}>{isGood ? "✓" : "✕"}</span>
                {card.verdict}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center", opacity: lineOpacity,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        Don't make it <span style={{ color: theme.accentGreen, fontWeight: 700 }}>overthink</span> the easy stuff.
      </div>
    </AbsoluteFill>
  );
};
