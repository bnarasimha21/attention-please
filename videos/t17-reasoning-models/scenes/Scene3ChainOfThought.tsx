import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 3 — Chain of thought [0:27–0:44]
// THE HEART. Zoom into the scratchpad: a word problem reasoned one step at a
// time. Each step springs in; a connector draws down to the next.

const STEPS = [
  { tag: "Step 1", body: "Start time is 9:40, trip is 95 minutes." },
  { tag: "Step 2", body: "95 minutes = 1 hour 35 minutes." },
  { tag: "Step 3", body: "9:40 + 1 hour = 10:40." },
  { tag: "Step 4", body: "10:40 + 35 minutes = 11:15." },
  { tag: "therefore", body: "It arrives at 11:15.", final: true },
];

export const Scene3ChainOfThought: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardOpacity = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardSpring = pop(frame, fps, fps * 0.8, { damping: 12 });

  // each step reveals starting at 2.4s, ~1.7s apart so each line is read before
  // the next appears. Final step lands ~9.4s; holds ~16s before scene end (26s).
  const stepStart = (i: number) => fps * 2.4 + i * fps * 1.7;

  const lineOpacity = interpolate(frame, [fps * 22, fps * 23.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      <CameraRig>
      <SceneHeading kicker="the heart of it" accent={theme.accent}>
        Reasoning, <span style={gradientText("#c7d2fe", theme.accent)}>one step at a time</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 190, left: 0, right: 0, bottom: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* scratchpad card */}
        <div style={{
          opacity: cardOpacity, transform: `scale(${0.9 + cardSpring * 0.1})`,
          width: 1180, padding: "38px 50px", borderRadius: 24,
          background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
          border: `1px solid ${theme.border}`,
          boxShadow: "0 30px 90px rgba(0,0,0,0.55), inset 0 0 40px rgba(0,0,0,0.4)",
        }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: theme.accent, marginBottom: 28 }}>
            chain of thought · the scratchpad
          </div>

          {STEPS.map((s, i) => {
            const start = stepStart(i);
            const o = interpolate(frame, [start, start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sp = pop(frame, fps, start, { damping: s.final ? 9 : 12 });
            const x = (1 - sp) * -22;
            const sc = (s.final ? 0.78 : 0.85) + sp * (s.final ? 0.22 : 0.15);
            // connector to NEXT step draws after this step lands
            const connT = i < STEPS.length - 1
              ? interpolate(frame, [start + fps * 0.6, start + fps * 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
              : 0;
            return (
              <div key={i} style={{ position: "relative" }}>
                <div style={{
                  opacity: o, transform: `translateX(${x}px) scale(${sc})`, transformOrigin: "left center",
                  display: "flex", alignItems: "baseline", gap: 24, padding: "15px 0",
                }}>
                  <div style={{
                    minWidth: 150, fontFamily: theme.fontMono, fontSize: 30, fontWeight: 800,
                    color: s.final ? theme.accentGreen : theme.accent, letterSpacing: 1,
                  }}>
                    {s.tag}
                  </div>
                  <div style={{
                    fontFamily: theme.fontSans, fontSize: s.final ? 43 : 38,
                    fontWeight: s.final ? 800 : 500,
                    color: s.final ? theme.text : theme.textMuted,
                  }}>
                    {s.body}
                  </div>
                </div>
                {/* connector line down to next step */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute", left: 24, top: 66, width: 2,
                    height: connT * 32,
                    background: theme.accent, opacity: 0.5,
                    boxShadow: `0 0 8px ${theme.accent}`,
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 56, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        Each line <span style={{ color: theme.accent, fontWeight: 700 }}>builds on the last</span> — exactly like working it out on paper.
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
