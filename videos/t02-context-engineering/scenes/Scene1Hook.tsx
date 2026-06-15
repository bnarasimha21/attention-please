import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText } from "../../../remotion-src/visuals";

// Scene 1 — Hook [0:00-0:13]
// A "perfect prompt" is typed into a chat box → the AI replies with garbage (✕)
// → reveal: the prompt was fine, the CONTEXT around it was empty.
// Tagline: "The magic was never the question."

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: prompt types in (0.5s-3s)
  const fullPrompt = "Summarize my project's current status.";
  const promptChars = Math.floor(
    interpolate(frame, [fps * 0.5, fps * 3], [0, fullPrompt.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typed = fullPrompt.slice(0, promptChars);
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  const doneTyping = frame > fps * 3;

  // "perfect prompt" badge appears once typed
  const badgeS = spring({ frame: frame - fps * 3.4, fps, config: { damping: 16 } });
  const badgeOpacity = interpolate(frame, [fps * 3.4, fps * 4.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // AI reply bubble returns garbage (5.4s)
  const replyS = spring({ frame: frame - fps * 5.4, fps, config: { damping: 15 } });
  const replyOpacity = interpolate(frame, [fps * 5.4, fps * 6.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const replyShake = frame > fps * 6.1 && frame < fps * 7.1 ? Math.sin(frame / 1.4) * 5 : 0;

  // The empty context "stage" behind dims into view (8s)
  const stageOpacity = interpolate(frame, [fps * 8, fps * 9.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emptyLabelOpacity = interpolate(frame, [fps * 9.2, fps * 10.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tagline (11.6s) — holds ~5s+ until scene end (17s)
  const tagOpacity = interpolate(frame, [fps * 11.6, fps * 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY = spring({ frame: frame - fps * 11.6, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SceneBackground glow={theme.accent} />

      {/* Empty context stage behind the chat */}
      <div style={{
        position: "absolute", width: 1416, height: 672, borderRadius: 34,
        border: `2px dashed ${theme.border}`,
        background: "linear-gradient(180deg, rgba(129,140,248,0.04), rgba(0,0,0,0))",
        opacity: stageOpacity,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}>
        <div style={{
          marginBottom: 26, opacity: emptyLabelOpacity,
          fontFamily: theme.fontMono, fontSize: 30, letterSpacing: 3, color: theme.textDim,
        }}>
          CONTEXT — <span style={{ color: theme.accentRed }}>empty</span>
        </div>
      </div>

      {/* Chat exchange */}
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", gap: 31, width: 912 }}>
        {/* user prompt box */}
        <div style={{ alignSelf: "flex-end", maxWidth: 768, position: "relative" }}>
          <div style={{
            background: "linear-gradient(160deg, #1a1a22, #101015)",
            border: `1px solid ${theme.accent}`,
            borderRadius: "19px 19px 5px 19px",
            padding: "24px 31px",
            fontFamily: theme.fontMono, fontSize: 35, color: theme.text,
            boxShadow: `0 14px 40px ${theme.accent}33`,
          }}>
            {typed}
            {!doneTyping && <span style={{ opacity: cursorOn ? 1 : 0, color: theme.accent }}>▌</span>}
          </div>
          {/* perfect-prompt badge */}
          <div style={{
            position: "absolute", top: -19, right: 17, opacity: badgeOpacity,
            transform: `scale(${0.7 + badgeS * 0.3})`,
            background: theme.accentGreen, color: theme.bg,
            fontFamily: theme.fontMono, fontSize: 20, fontWeight: 800, letterSpacing: 1,
            padding: "5px 14px", borderRadius: 24, boxShadow: `0 0 18px ${theme.accentGreen}88`,
          }}>
            ✓ perfect prompt
          </div>
        </div>

        {/* AI reply — garbage */}
        <div style={{
          alignSelf: "flex-start", maxWidth: 760, opacity: replyOpacity,
          transform: `scale(${0.85 + replyS * 0.15}) translateX(${replyShake}px)`,
          background: `linear-gradient(160deg, ${theme.accentRed}1c, #101015)`,
          border: `1px solid ${theme.accentRed}`,
          borderRadius: "19px 19px 19px 5px",
          padding: "24px 31px",
          fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted,
          boxShadow: `0 14px 40px ${theme.accentRed}22`,
          display: "flex", alignItems: "center", gap: 17,
        }}>
          <span style={{ fontSize: 38 }}>🤖</span>
          <span>"I don't have any information about your project."</span>
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute", bottom: 108, width: "100%", textAlign: "center",
        opacity: tagOpacity, transform: `translateY(${(1 - tagY) * 20}px)`,
        fontFamily: theme.fontSans, fontSize: 49, fontWeight: 700, color: theme.text,
      }}>
        The magic was never the{" "}
        <span style={{ ...gradientText("#c7d2fe", theme.accent), fontWeight: 800 }}>question.</span>
      </div>
    </AbsoluteFill>
  );
};
