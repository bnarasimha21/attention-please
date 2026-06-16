import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, EASE_OUT, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 3 — Lost in the middle [0:30-0:47]
// A long document; a key fact tested at START (✓), END (✓), MIDDLE (✗).
// The famous U-shaped attention curve draws over the document.

// Geometry for the document strip + curve overlay
const W = 1480;
const H = 360;
const PAD = 60;

// U-shaped attention: high at edges, low in the middle. y in [0..1] = attention.
const uShape = (x: number) => {
  // x in 0..1 → parabola minimum at 0.5
  const v = 4 * (x - 0.5) * (x - 0.5); // 0 at center, 1 at edges
  return 0.18 + 0.82 * v;
};

type Probe = { x: number; label: string; found: boolean; delay: number };
const PROBES: Probe[] = [
  { x: 0.06, label: "START", found: true, delay: 11 },
  { x: 0.5, label: "MIDDLE", found: false, delay: 12.4 },
  { x: 0.94, label: "END", found: true, delay: 13.8 },
];

export const Scene3LostInMiddle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // document fades in
  const docOpacity = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // curve draws left→right (3s..7s)
  const draw = interpolate(frame, [fps * 3, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });

  // Build the curve path. y inverted (screen). Higher attention = higher on chart.
  const N = 80;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const att = uShape(t);
    const px = PAD + t * (W - 2 * PAD);
    const py = PAD + (1 - att) * (H - 2 * PAD); // att 1 → top
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const fullPath = "M " + pts.join(" L ");
  // approximate draw by dasharray
  const pathLen = 2000;

  const captionOpacity = interpolate(frame, [fps * 16, fps * 17.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentRed} />

      <SceneHeading kicker="the killer demo" accent={theme.accentRed}>
        Lost in the <span style={gradientText("#fca5a5", theme.accentRed)}>middle</span>
      </SceneHeading>

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>

        {/* Chart + document */}
        <div style={{ position: "relative", width: W, height: H + 84, opacity: docOpacity }}>
          {/* document strip (lines) along the bottom */}
          <div style={{
            position: "absolute", left: PAD, right: PAD, bottom: 0, height: 64,
            borderRadius: 14, background: "linear-gradient(180deg,#131318,#0c0c10)",
            border: `1px solid ${theme.border}`, overflow: "hidden",
            display: "flex", alignItems: "center", gap: 7, padding: "0 12px",
          }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: theme.textDim, opacity: 0.6 }} />
            ))}
            <div style={{ position: "absolute", left: 14, bottom: 5, fontFamily: theme.fontMono, fontSize: 18, color: theme.textDim, letterSpacing: 1 }}>
              long document / conversation →
            </div>
          </div>

          {/* SVG curve */}
          <svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0 }}>
            <defs>
              <linearGradient id="ucurve" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={theme.accentGreen} />
                <stop offset="50%" stopColor={theme.accentRed} />
                <stop offset="100%" stopColor={theme.accentGreen} />
              </linearGradient>
            </defs>
            {/* baseline grid */}
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={theme.border} strokeWidth={1} />
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={theme.border} strokeWidth={1} />
            <path
              d={fullPath}
              fill="none"
              stroke="url(#ucurve)"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={pathLen}
              strokeDashoffset={pathLen * (1 - draw)}
              style={{ filter: "drop-shadow(0 0 8px rgba(248,113,113,0.5))" }}
            />
            <text x={PAD + 16} y={PAD + 6} fill={theme.textMuted} fontSize={22} fontFamily={theme.fontMono}>attention</text>
          </svg>
        </div>

        {/* Probe verdicts row */}
        <div style={{ display: "flex", gap: 84 }}>
          {PROBES.map((p) => {
            const start = fps * p.delay - fps * 6; // shift into 5s..8s window
            const s = pop(frame, fps, start, { damping: 11 });
            const opacity = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const c = p.found ? theme.accentGreen : theme.accentRed;
            return (
              <div key={p.label} style={{
                opacity, transform: `translateY(${(1 - s) * 18}px) scale(${0.8 + s * 0.2})`,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                padding: "20px 34px", borderRadius: 20,
                background: `linear-gradient(160deg, ${c}1c, ${c}0a)`,
                border: `1px solid ${c}66`, boxShadow: `0 0 26px ${c}33`, minWidth: 252,
              }}>
                <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: c, letterSpacing: 2 }}>{p.label}</div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 41, fontWeight: 800, color: theme.text }}>
                  {p.found ? "✓ found" : "✗ missed"}
                </div>
              </div>
            );
          })}
        </div>
      </CameraRig>

      <div style={{ position: "absolute", bottom: 56, width: "100%", textAlign: "center", opacity: captionOpacity, fontFamily: theme.fontSans, fontSize: 41, color: theme.text }}>
        High at the edges, sags in the center — a{" "}
        <span style={{ ...gradientText("#fca5a5", theme.accentRed), fontWeight: 800 }}>U-shaped curve.</span>
      </div>
    </AbsoluteFill>
  );
};
