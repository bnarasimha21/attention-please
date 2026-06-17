import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 8 - Every action hits a <gate>
// Three action rows: action chip → CLASSIFIER node → verdict.
//   read_file  → AUTO-APPROVE (green ✓ harmless)
//   edit_file  → ASK YOU FIRST (amber ? changes state)
//   rm -rf /   → BLOCK         (red   ✕ destructive)
// ~30s @ 30fps = 900 frames. Glow: theme.accentWarm.

const ROUTES = [
  { action: "read_file", verdict: "AUTO-APPROVE", color: theme.accentGreen, icon: "✓", note: "harmless" },
  { action: "edit_file", verdict: "ASK YOU FIRST", color: theme.accentWarm, icon: "?", note: "changes state" },
  { action: "rm -rf /",  verdict: "BLOCK",         color: theme.accentRed,   icon: "✕", note: "destructive" },
];

export const Scene8Permissions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <SceneHeading kicker="the safety gate" accent={theme.accentWarm}>
          Every action hits a <span style={gradientText("#fbbf24", theme.accentWarm)}>&lt;gate&gt;</span>
        </SceneHeading>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
          {ROUTES.map((r, i) => {
            const start = fps * (2 + i * 4);
            const s = pop(frame, fps, start, { damping: 11 });
            const rowOpacity = interpolate(frame, [start, start + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            // classifier node lights up as the chip arrives
            const clStart = start + fps * 0.7;
            const clPop = pop(frame, fps, clStart, { damping: 10 });
            const clScale = interpolate(clPop, [0, 1], [0.5, 1]);
            const clProcess = 0.4 + 0.6 * Math.abs(Math.sin((frame - clStart) / 6));
            const clGlow = interpolate(frame, [clStart, clStart + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            // verdict reveals after the classifier decides
            const vStart = start + fps * 1.7;
            const vOpacity = interpolate(frame, [vStart, vStart + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const vGlow = interpolate(frame, [vStart, vStart + fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const iconPop = pop(frame, fps, vStart, { damping: 9 });
            const iconScale = interpolate(iconPop, [0, 1], [0.3, 1]);

            return (
              <div key={r.action} style={{ opacity: rowOpacity, display: "flex", flexDirection: "row", alignItems: "center", gap: 28 }}>
                {/* action chip */}
                <div style={{
                  transform: `translateX(${(1 - s) * -40}px)`,
                  width: 290, padding: "20px 26px", borderRadius: 18,
                  background: "linear-gradient(160deg, #17171f 0%, #0e0e13 100%)",
                  border: `1px solid ${theme.border}`,
                  boxShadow: "0 12px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
                  fontFamily: theme.fontMono, fontSize: 32, color: theme.text, textAlign: "center",
                }}>{r.action}</div>

                <div style={{ fontSize: 38, color: theme.textDim }}>→</div>

                {/* CLASSIFIER node */}
                <div style={{
                  width: 200, padding: "16px 0", borderRadius: 16, textAlign: "center",
                  transform: `scale(${clScale})`,
                  background: "linear-gradient(160deg, #1b1726 0%, #0f0d15 100%)",
                  border: `1.5px solid ${theme.accentWarm}${clProcess > 0.7 ? "cc" : "55"}`,
                  boxShadow: `0 0 ${clGlow * clProcess * 30}px ${theme.accentWarm}66, inset 0 1px 0 rgba(255,255,255,0.05)`,
                  fontFamily: theme.fontMono,
                }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: theme.accentWarm, letterSpacing: 1 }}>CLASSIFIER</div>
                  <div style={{ fontSize: 18, color: theme.textMuted, marginTop: 2 }}>evaluating…</div>
                </div>

                <div style={{ fontSize: 38, color: theme.textDim, opacity: vOpacity }}>→</div>

                {/* verdict icon */}
                <div style={{
                  width: 76, height: 76, borderRadius: 18, opacity: vOpacity,
                  transform: `scale(${iconScale})`,
                  background: `linear-gradient(160deg, ${r.color}, ${r.color}bb)`, color: theme.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 42, fontWeight: 800,
                  boxShadow: `0 0 ${vGlow * 55}px ${r.color}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                }}>{r.icon}</div>

                {/* verdict label */}
                <div style={{ opacity: vOpacity, display: "flex", flexDirection: "column", gap: 3, width: 320 }}>
                  <div style={{ fontFamily: theme.fontMono, fontSize: 32, fontWeight: 800, color: r.color }}>{r.verdict}</div>
                  <div style={{ fontFamily: theme.fontSans, fontSize: 23, color: theme.textMuted }}>{r.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ position: "absolute", bottom: 100, width: "100%", textAlign: "center", fontFamily: theme.fontSans }}>
          <div style={{
            fontSize: 38, color: theme.text,
            opacity: interpolate(frame, [fps * 14, fps * 15.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            The model <span style={{ color: theme.textMuted }}>proposes;</span> the harness <span style={{ color: theme.accentWarm }}>disposes.</span>
          </div>
          <div style={{
            fontSize: 25, color: theme.textMuted, marginTop: 10, fontFamily: theme.fontMono,
            opacity: interpolate(frame, [fps * 16, fps * 17.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            autonomous agent vs. unsupervised intern with sudo.
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
