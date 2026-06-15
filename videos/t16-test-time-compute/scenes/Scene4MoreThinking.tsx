import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 4 — More thinking = better answers
// Animated accuracy curve: x = thinking effort, y = accuracy. The curve draws
// upward, a marker climbs it, and the accuracy % counts up alongside.

// chart geometry (within an SVG viewBox of 0..W, 0..H)
const W = 1200;
const H = 576;
const PAD_L = 108;
const PAD_B = 96;
const PAD_T = 36;
const PAD_R = 72;

// accuracy as a function of normalized thinking effort t in [0,1]
// rising, concave (diminishing returns) curve from ~38% to ~94%
const accAt = (t: number) => 0.38 + 0.56 * (1 - Math.pow(1 - t, 1.7));

// map normalized (tx, value 0..1) to SVG coords
const px = (tx: number) => PAD_L + tx * (W - PAD_L - PAD_R);
const py = (v: number) => PAD_T + (1 - v) * (H - PAD_T - PAD_B);

export const Scene4MoreThinking: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // axes fade in (1s)
  const axisOpacity = interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // curve draws from 2.5s..9s (longer, easier to follow)
  const draw = interpolate(frame, [fps * 2.5, fps * 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // build polyline up to `draw`
  const N = 60;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * draw;
    pts.push(`${px(t).toFixed(1)},${py(accAt(t)).toFixed(1)}`);
  }
  const headT = draw;
  const headX = px(headT);
  const headY = py(accAt(headT));

  // counting accuracy readout
  const accPct = Math.round(accAt(draw) * 100);

  // area under curve points (for fill)
  const areaPts = [`${px(0)},${py(0)}`, ...pts, `${px(headT)},${py(0)}`].join(" ");

  // closing line — holds fully visible to scene end (18s)
  const lineOpacity = interpolate(frame, [fps * 11, fps * 12.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <SceneHeading kicker="the core insight" accent={theme.accentGreen}>
        More thinking, <span style={gradientText("#6ee7b7", theme.accentGreen)}>better answers</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 196, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: W, height: H }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
            {/* gridlines */}
            {[0.25, 0.5, 0.75, 1].map((g) => (
              <line key={g} x1={PAD_L} y1={py(g)} x2={W - PAD_R} y2={py(g)}
                stroke={theme.border} strokeWidth={1} opacity={axisOpacity * 0.6} />
            ))}
            {/* axes */}
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke={theme.textDim} strokeWidth={2} opacity={axisOpacity} />
            <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke={theme.textDim} strokeWidth={2} opacity={axisOpacity} />

            {/* area fill */}
            {draw > 0.01 && (
              <polygon points={areaPts} fill={theme.accentGreen} opacity={0.1} />
            )}
            {/* the curve */}
            {draw > 0.01 && (
              <polyline points={pts.join(" ")} fill="none" stroke={theme.accentGreen} strokeWidth={6}
                strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 12px ${theme.accentGreen})` }} />
            )}
            {/* climbing marker */}
            {draw > 0.01 && (
              <circle cx={headX} cy={headY} r={13} fill={theme.text}
                style={{ filter: `drop-shadow(0 0 17px ${theme.accentGreen})` }} />
            )}
          </svg>

          {/* y-axis label */}
          <div style={{
            position: "absolute", left: -22, top: H / 2 - 108, transform: "rotate(-90deg)",
            transformOrigin: "left center", fontFamily: theme.fontMono, fontSize: 30, color: theme.accentGreen, letterSpacing: 2,
            opacity: axisOpacity,
          }}>ACCURACY →</div>

          {/* x-axis label */}
          <div style={{
            position: "absolute", left: PAD_L, top: H - PAD_B + 30, width: W - PAD_L - PAD_R, textAlign: "center",
            fontFamily: theme.fontMono, fontSize: 30, color: theme.accent, letterSpacing: 2, opacity: axisOpacity,
          }}>THINKING EFFORT (compute at answer-time) →</div>

          {/* live accuracy readout pinned to the marker */}
          <div style={{
            position: "absolute", left: headX + 28, top: headY - 32,
            fontFamily: theme.fontMono, fontSize: 51, fontWeight: 800, color: theme.accentGreen,
            textShadow: `0 0 18px ${theme.accentGreen}88`, opacity: draw > 0.02 ? 1 : 0,
          }}>{accPct}%</div>
        </div>
      </div>

      {/* closing line */}
      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center", opacity: lineOpacity,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        Same weights. Just <span style={{ ...gradientText("#6ee7b7", theme.accentGreen), fontWeight: 800 }}>more thought.</span>
      </div>
    </AbsoluteFill>
  );
};
