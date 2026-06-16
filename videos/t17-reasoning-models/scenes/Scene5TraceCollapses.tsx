import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 5 — The trace collapses [0:59–1:13]
// A tall stack of reasoning lines (many) compresses, scales down and fades,
// collapsing into a single clean FINAL ANSWER card that springs in.

const TRACE = [
  "parse the question…", "convert 95 min → 1h 35m…", "9:40 + 1h = 10:40…",
  "10:40 + 35 = 10:75? no…", "carry: minutes over 59…", "10:40 + 35 = 11:15…",
  "sanity check the total…", "95 min from 9:40 ✓…", "confident in 11:15…",
];

export const Scene5TraceCollapses: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stackOpacity = interpolate(frame, [fps * 0.6, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // stack stays fully readable ~1.6s–5s (>3s) before it collapses 5s → 7s
  const collapse = interpolate(frame, [fps * 5, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stackScaleY = interpolate(collapse, [0, 1], [1, 0.04]);
  const stackFade = interpolate(collapse, [0, 0.85], [1, 0], { extrapolateRight: "clamp" });

  // answer card pops in HARD at 6.6s; holds until scene end (18s)
  const ansSpring = pop(frame, fps, fps * 6.6, { damping: 9 });
  const ansOpacity = interpolate(frame, [fps * 6.6, fps * 7.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ansGlow = interpolate(frame, [fps * 7, fps * 8.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 13, fps * 14.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <CameraRig>
      <SceneHeading kicker="the payoff" accent={theme.accentGreen}>
        Pages of thinking → <span style={gradientText("#6ee7b7", theme.accentGreen)}>one clean answer</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 180, left: 0, right: 0, bottom: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>

        {/* The long trace, collapsing */}
        <div style={{
          opacity: stackOpacity * stackFade,
          transform: `scaleY(${stackScaleY})`, transformOrigin: "center top",
          width: 985, padding: "24px 34px", borderRadius: 20,
          background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
          border: `1px solid ${theme.border}`,
        }}>
          {TRACE.map((t, i) => (
            <div key={i} style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.text, lineHeight: 1.6 }}>
              <span style={{ color: theme.accent }}>›</span> {t}
            </div>
          ))}
        </div>

        {/* funnel hint */}
        {collapse > 0.1 && collapse < 0.95 && (
          <div style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.accentGreen, opacity: interpolate(collapse, [0.1, 0.5, 0.95], [0, 1, 0]) }}>
            ↓ collapsing ↓
          </div>
        )}

        {/* FINAL ANSWER card */}
        <div style={{
          opacity: ansOpacity, transform: `scale(${0.8 + ansSpring * 0.2})`,
          padding: "34px 68px", borderRadius: 22,
          background: `linear-gradient(160deg, ${theme.accentGreen}1f, #0c100e)`,
          border: `2px solid ${theme.accentGreen}`,
          boxShadow: `0 0 ${30 + ansGlow * 50}px ${theme.accentGreen}55, inset 0 1px 0 rgba(255,255,255,0.06)`,
          textAlign: "center",
        }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: theme.accentGreen, marginBottom: 16 }}>
            final answer
          </div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 76, fontWeight: 800, color: theme.text }}>
            It arrives at 11:15.
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 56, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        All that working — <span style={{ ...gradientText("#6ee7b7", theme.accentGreen), fontWeight: 800 }}>distilled into one line.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
