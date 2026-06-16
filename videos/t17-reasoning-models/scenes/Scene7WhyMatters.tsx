import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 7 — Why it matters [1:27–1:40]
// Capability chips (math/code/logic/planning) light up; a "room to think" meter
// fills and an accuracy reading climbs alongside it. Practical takeaway.

const CHIPS = [
  { label: "math", emoji: "➗", color: theme.tokenColors[0] },
  { label: "code", emoji: "💻", color: theme.tokenColors[2] },
  { label: "logic", emoji: "🧩", color: theme.tokenColors[4] },
  { label: "planning", emoji: "🗺️", color: theme.tokenColors[3] },
];

export const Scene7WhyMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chipStart = (i: number) => fps * 1.4 + i * fps * 0.6;

  // "room to think" meter fills (4s–8s); accuracy climbs with it. Final reading
  // holds ~8s–18s before the scene ends.
  const meterOpacity = interpolate(frame, [fps * 4, fps * 4.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const room = interpolate(frame, [fps * 4.2, fps * 8], [8, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const accuracy = interpolate(frame, [fps * 4.2, fps * 8], [54, 96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const accColor = interpolateColors(room, [8, 100], [theme.accentWarm, theme.accentGreen]);

  const lineOpacity = interpolate(frame, [fps * 13, fps * 14.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <CameraRig>
      <SceneHeading kicker="the takeaway" accent={theme.accentGreen}>
        Give them <span style={gradientText("#6ee7b7", theme.accentGreen)}>room to think</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 180, left: 0, right: 0, bottom: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 64 }}>

        {/* capability chips */}
        <div style={{ display: "flex", gap: 30 }}>
          {CHIPS.map((c, i) => {
            const start = chipStart(i);
            const o = interpolate(frame, [start, start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sp = pop(frame, fps, start, { damping: 11 });
            return (
              <div key={c.label} style={{
                opacity: o, transform: `scale(${0.8 + sp * 0.2})`,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
                width: 205, padding: "30px 0", borderRadius: 20,
                background: `${c.color}14`, border: `1px solid ${c.color}`,
                boxShadow: `0 0 26px ${c.color}33`,
              }}>
                <span style={{ fontSize: 59 }}>{c.emoji}</span>
                <span style={{ fontFamily: theme.fontMono, fontSize: 30, fontWeight: 700, color: c.color, letterSpacing: 1 }}>{c.label}</span>
              </div>
            );
          })}
        </div>

        {/* room-to-think meter + accuracy */}
        <div style={{ opacity: meterOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.textMuted }}>room to think</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 40, fontWeight: 800, color: accColor }}>
              accuracy {Math.round(accuracy)}%
            </div>
          </div>
          <div style={{ width: 935, height: 30, borderRadius: 15, background: theme.surface, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
            <div style={{ width: `${room}%`, height: "100%", background: accColor, boxShadow: `0 0 22px ${accColor}` }} />
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 56, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        The more space to reason, the <span style={{ ...gradientText("#6ee7b7", theme.accentGreen), fontWeight: 800 }}>better they answer.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
