import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 4 — Self-correction [0:44–0:59]
// Mid-reasoning the model writes a wrong step, catches it ("wait, that's
// wrong"), strikes it through (red), and a corrected branch glows in (green).

export const Scene4SelfCorrection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardOpacity = interpolate(frame, [fps * 0.8, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // wrong step appears (1.5s)
  const wrongOpacity = interpolate(frame, [fps * 1.5, fps * 2.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "wait, that's wrong" catch (4s) + flash
  const catchOpacity = interpolate(frame, [fps * 4, fps * 4.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const catchPulse = frame > fps * 4 && frame < fps * 6 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;

  // strike-through draws across (5s–6s)
  const strike = interpolate(frame, [fps * 5, fps * 6], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // wrong step dims as it's struck
  const wrongDim = interpolate(frame, [fps * 5, fps * 6.5], [1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // corrected branch glows in (6.5s)
  const fixSpring = spring({ frame: frame - fps * 6.5, fps, config: { damping: 16 } });
  const fixOpacity = interpolate(frame, [fps * 6.5, fps * 7.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fixGlow = interpolate(frame, [fps * 6.5, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // bottom caption lands ~16s, well after the green fix holds ≥3s (scene 20s)
  const lineOpacity = interpolate(frame, [fps * 16, fps * 17.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <SceneHeading kicker="the magic part" accent={theme.accentWarm}>
        It catches its <span style={gradientText("#fbbf24", theme.accentWarm)}>own mistakes</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 190, left: 0, right: 0, bottom: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          opacity: cardOpacity, width: 1200, padding: "41px 53px", borderRadius: 24,
          background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
          border: `1px solid ${theme.border}`, boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
        }}>
          {/* a couple of correct prior lines for context */}
          <div style={{ fontFamily: theme.fontSans, fontSize: 35, color: theme.textDim, marginBottom: 12 }}>
            <span style={{ fontFamily: theme.fontMono, color: theme.textMuted }}>Step 2 </span>
            9:40 + 1 hour = 10:40.
          </div>

          {/* WRONG step + strike-through */}
          <div style={{ position: "relative", opacity: wrongOpacity, marginBottom: 10 }}>
            <div style={{ fontFamily: theme.fontSans, fontSize: 40, color: theme.accentRed, opacity: wrongDim, padding: "10px 0" }}>
              <span style={{ fontFamily: theme.fontMono }}>Step 3 </span>
              10:40 + 35 = 10:75.
            </div>
            <div style={{
              position: "absolute", left: 0, top: "50%", height: 4,
              width: `${strike}%`, maxWidth: 680,
              background: theme.accentRed, boxShadow: `0 0 10px ${theme.accentRed}`, borderRadius: 2,
            }} />
          </div>

          {/* the catch */}
          <div style={{
            opacity: catchOpacity, display: "inline-flex", alignItems: "center", gap: 12,
            padding: "11px 24px", borderRadius: 12, margin: "8px 0 24px",
            background: `${theme.accentRed}1a`, border: `1px solid ${theme.accentRed}`,
            boxShadow: `0 0 ${catchPulse * 30}px ${theme.accentRed}66`,
            fontFamily: theme.fontMono, fontSize: 32, color: theme.accentRed,
          }}>
            ✗ wait — that's wrong, minutes can't exceed 59
          </div>

          {/* corrected branch */}
          <div style={{
            opacity: fixOpacity, transform: `translateX(${(1 - fixSpring) * 26}px)`,
            display: "flex", alignItems: "center", gap: 20, padding: "18px 26px", borderRadius: 14,
            background: `${theme.accentGreen}12`, border: `1px solid ${theme.accentGreen}66`,
            boxShadow: `0 0 ${fixGlow * 40}px ${theme.accentGreen}44`,
          }}>
            <span style={{ fontFamily: theme.fontMono, fontSize: 35, color: theme.accentGreen, fontWeight: 800 }}>✓ Step 3</span>
            <span style={{ fontFamily: theme.fontSans, fontSize: 40, color: theme.text, fontWeight: 600 }}>
              carry the hour: 10:40 + 35 = 11:15.
            </span>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 56, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        It <span style={{ ...gradientText("#fbbf24", theme.accentWarm), fontWeight: 800 }}>checks its own work</span> as it goes — and backtracks.
      </div>
    </AbsoluteFill>
  );
};
