import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 8 — Recap + CTA [1:43-1:55]
// Final diagram: orchestrator core ringed by 3 isolated subagent satellites,
// each returning a clean answer → tagline → teaser "Is RAG dead?" → brand.

const SATS = [
  { angle: -90, color: theme.tokenColors[4], label: "research" },
  { angle: 30,  color: theme.tokenColors[5], label: "review" },
  { angle: 150, color: theme.tokenColors[2], label: "tests" },
];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const coreSpring = pop(frame, fps, fps * 0.4, { damping: 11 });

  const satStart = (i: number) => fps * 1.2 + i * fps * 0.7;
  const R = 240;

  const taglineOpacity = interpolate(frame, [fps * 4.2, fps * 5.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const teaserOpacity = interpolate(frame, [fps * 6.6, fps * 7.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [fps * 9, fps * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Recap diagram */}
      <div style={{ position: "relative", width: 672, height: 552, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {SATS.map((s, i) => {
          const start = satStart(i);
          const sp = pop(frame, fps, start, { damping: 12 });
          const op = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const rad = (s.angle * Math.PI) / 180;
          const x = Math.cos(rad) * R * sp;
          const y = Math.sin(rad) * R * sp;
          const lineLen = Math.sqrt(x * x + y * y);
          const lineAng = (Math.atan2(y, x) * 180) / Math.PI;
          return (
            <div key={s.label}>
              {/* connector */}
              <div style={{
                position: "absolute", left: "50%", top: "50%", width: lineLen, height: 2,
                transformOrigin: "left center", transform: `rotate(${lineAng}deg)`,
                background: `linear-gradient(90deg, ${s.color}aa, ${s.color}22)`, opacity: op * 0.7,
              }} />
              {/* satellite */}
              <div style={{
                position: "absolute", left: "50%", top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${0.5 + sp * 0.5})`,
                opacity: op, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <div style={{ filter: "hue-rotate(80deg) saturate(1.2)" }}>
                  <ModelCore size={89} pulse={pulse} fontSize={0} label="" />
                </div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 20, color: s.color, letterSpacing: 1 }}>{s.label}</div>
              </div>
            </div>
          );
        })}

        {/* orchestrator core */}
        <div style={{ transform: `scale(${0.6 + coreSpring * 0.4})`, zIndex: 10 }}>
          <ModelCore size={180} pulse={pulse} fontSize={30} label="ORCH" />
        </div>
      </div>

      {/* Tagline */}
      <div style={{ marginTop: 29, opacity: taglineOpacity, fontFamily: theme.fontSans, fontSize: 51, fontWeight: 700, color: theme.text, textAlign: "center" }}>
        Isolate the <span style={{ color: theme.textMuted }}>noise.</span> Return the{" "}
        <span style={gradientText("#6ee7b7", theme.accentGreen)}>answer.</span>
      </div>

      {/* Teaser */}
      <div style={{ marginTop: 19, opacity: teaserOpacity, fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted, textAlign: "center" }}>
        Next: <span style={{ color: theme.accent }}>Is RAG dead?</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
