import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, interpolateColors } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText, EASE_OUT, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 1 — Hook [0:00-0:14]
// A chat thread grows longer and longer. An early AI reply is sharp + green;
// a late reply is blurred + red. "It's not your imagination."

type Msg = { role: "user" | "ai"; text: string; rot: number; delay: number };

const THREAD: Msg[] = [
  { role: "user", text: "Help me plan my launch.", rot: 0, delay: 0.8 },
  { role: "ai", text: "On it — here's a crisp 3-step plan.", rot: 0, delay: 2.0 },
  { role: "user", text: "Add a budget section.", rot: 0, delay: 3.4 },
  { role: "ai", text: "Done. Clean numbers, clear owners.", rot: 0.2, delay: 4.8 },
  { role: "user", text: "…and 40 more messages later…", rot: 0.5, delay: 6.4 },
  { role: "ai", text: "uh, what were we… the thing?", rot: 1, delay: 7.8 },
];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each message slides up + in, staggered. Later messages scroll the stack up
  // a touch so the thread feels like it keeps growing.
  const scroll = interpolate(frame, [fps * 6, fps * 9], [0, -72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  const punchOpacity = interpolate(frame, [fps * 10, fps * 11.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchY = spring({ frame: frame - fps * 10, fps, config: { damping: 18 } });

  // hero punch on the thread frame
  const framePop = pop(frame, fps, fps * 0.4, { damping: 12 });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentRed} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* phone-ish thread frame */}
        <div style={{
          width: 1060, height: 760, borderRadius: 34, padding: "32px 36px",
          background: "linear-gradient(180deg, #131318 0%, #0b0b0f 100%)",
          border: `1px solid ${theme.border}`,
          boxShadow: "0 50px 140px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          overflow: "hidden", display: "flex", flexDirection: "column", gap: 19,
          opacity: framePop,
          transform: `translateY(${scroll}px) scale(${0.84 + framePop * 0.16})`,
        }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            chat · 1 long thread
          </div>

          {THREAD.map((m, i) => {
            const start = fps * m.delay;
            const s = pop(frame, fps, start, { damping: 11 });
            const opacity = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const isAI = m.role === "ai";
            // rot only applies to AI answers: blur up, color green→red
            const blur = isAI ? m.rot * 4 : 0;
            const aiColor = interpolateColors(m.rot, [0, 0.5, 1], [theme.accentGreen, theme.accentWarm, theme.accentRed]);
            return (
              <div key={i} style={{
                display: "flex", justifyContent: isAI ? "flex-start" : "flex-end",
                opacity, transform: `translateY(${(1 - s) * 16}px) scale(${0.8 + s * 0.2})`,
                transformOrigin: isAI ? "left center" : "right center",
              }}>
                <div style={{
                  maxWidth: 700, padding: "18px 26px", borderRadius: 22,
                  borderTopLeftRadius: isAI ? 8 : 22, borderTopRightRadius: isAI ? 22 : 8,
                  background: isAI
                    ? `linear-gradient(160deg, ${aiColor}26, ${aiColor}12)`
                    : "linear-gradient(160deg, #232331, #1a1a24)",
                  border: `1px solid ${isAI ? aiColor + "66" : theme.border}`,
                  fontFamily: theme.fontSans, fontSize: 31, lineHeight: 1.35,
                  color: isAI ? theme.text : theme.textMuted,
                  filter: `blur(${blur}px)`,
                  boxShadow: isAI ? `0 0 ${24 * (1 - m.rot) + 6}px ${aiColor}33` : "none",
                }}>
                  {isAI && (
                    <span style={{ fontFamily: theme.fontMono, fontSize: 18, color: aiColor, letterSpacing: 1, marginRight: 8 }}>AI</span>
                  )}
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
      </CameraRig>

      {/* Punchline */}
      <div style={{
        position: "absolute", bottom: 70, width: "100%", textAlign: "center",
        opacity: punchOpacity, transform: `translateY(${(1 - punchY) * 20}px)`,
        fontFamily: theme.fontSans, fontSize: 54, fontWeight: 800, color: theme.text,
      }}>
        It's not your imagination — the longer the chat,{" "}
        <span style={{ ...gradientText("#fca5a5", theme.accentRed), fontWeight: 800 }}>the worse it gets.</span>
      </div>
    </AbsoluteFill>
  );
};
