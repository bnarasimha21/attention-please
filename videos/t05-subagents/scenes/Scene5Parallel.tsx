import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 5 — Parallel subagents [0:57-1:14]
// Orchestrator core in center; 3 subagents (research / review / tests) fan out,
// each with its own little noisy window, all returning concise result chips at
// once. "Three messy jobs, done at the same time. One clean desk."

const SUBS = [
  { job: "RESEARCH", x: -672, y: -36, color: theme.tokenColors[4], result: "→ 3 key findings", noise: ["38 search hits", "12 docs read"] },
  { job: "REVIEW",   x: 0,    y: -258, color: theme.tokenColors[5], result: "→ 2 issues found", noise: ["980-line diff", "lint · 44 warns"] },
  { job: "TESTS",    x: 672,  y: -36, color: theme.tokenColors[2], result: "→ all green", noise: ["412-line log", "128 cases"] },
];

export const Scene5Parallel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const orchSpring = pop(frame, fps, fps * 0.6, { damping: 11 });

  // subs fan out together at 2s
  const subStart = fps * 2;

  // noise fills in all 3, staggered per row (3.5s onward)
  const noiseStart = (j: number) => fps * 3.5 + j * fps * 1.2;

  // result chips travel back to orchestrator at 9.5s (all at once)
  const resultTravel = interpolate(frame, [fps * 9.5, fps * 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resultOpacity = interpolate(frame, [fps * 9.5, fps * 10.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 14, fps * 15.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 14, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={theme.accent} />

      <div style={{ zIndex: 20 }}>
        <SceneHeading kicker="at scale" accent={theme.accent}>
          Run them <span style={gradientText("#c7d2fe", theme.accent)}>in parallel</span>
        </SceneHeading>
      </div>

      <CameraRig>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1, height: 1 }}>

          {/* connector lines + subagents */}
          {SUBS.map((s, j) => {
            const sp = pop(frame, fps, subStart + j * fps * 0.12, { damping: 12 });
            const sx = s.x * sp;
            const sy = s.y * sp;
            const op = interpolate(frame, [subStart, subStart + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const lineLen = Math.sqrt(sx * sx + sy * sy);
            const angle = (Math.atan2(sy, sx) * 180) / Math.PI;
            return (
              <div key={s.job}>
                {/* connector */}
                <div style={{
                  position: "absolute", left: 0, top: 0, width: lineLen, height: 2,
                  transformOrigin: "left center", transform: `rotate(${angle}deg)`,
                  background: `linear-gradient(90deg, ${s.color}aa, ${s.color}22)`, opacity: op * 0.7,
                }} />

                {/* subagent cluster */}
                <div style={{ position: "absolute", left: sx, top: sy, transform: "translate(-50%,-50%)", opacity: op, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ filter: "hue-rotate(80deg) saturate(1.2)" }}>
                    <ModelCore size={103} pulse={pulse} fontSize={0} label="" />
                  </div>
                  <div style={{ fontFamily: theme.fontMono, fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: 1 }}>{s.job}</div>
                  {/* tiny noisy window */}
                  <div style={{
                    width: 240, borderRadius: 14, padding: "12px 14px",
                    background: "linear-gradient(180deg, #13131a, #0b0b10)", border: `1px solid ${s.color}44`,
                    display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    {s.noise.map((n, k) => {
                      const ns = noiseStart(k);
                      const nop = interpolate(frame, [ns, ns + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                      return (
                        <div key={n} style={{
                          opacity: nop, padding: "6px 11px", borderRadius: 8,
                          background: `${s.color}12`, fontFamily: theme.fontMono, fontSize: 19, color: s.color,
                        }}>{n}</div>
                      );
                    })}
                  </div>
                </div>

                {/* result chip flying back to center */}
                <div style={{
                  position: "absolute", left: sx * (1 - resultTravel), top: sy * (1 - resultTravel),
                  transform: "translate(-50%,-50%)", opacity: resultOpacity * (1 - resultTravel * 0.3),
                  padding: "8px 17px", borderRadius: 11,
                  background: `${theme.accentGreen}22`, border: `1px solid ${theme.accentGreen}`,
                  fontFamily: theme.fontMono, fontSize: 22, color: theme.accentGreen, whiteSpace: "nowrap", zIndex: 25,
                }}>{s.result}</div>
              </div>
            );
          })}

          {/* orchestrator */}
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%,-50%) scale(${0.6 + orchSpring * 0.4})`, zIndex: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <ModelCore size={204} pulse={pulse} fontSize={30} label="ORCH" />
            <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted, whiteSpace: "nowrap" }}>orchestrator</div>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center", zIndex: 20,
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        Three messy jobs at once — <span style={{ color: theme.accentGreen, fontWeight: 700 }}>one clean desk.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
