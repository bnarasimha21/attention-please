import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../motion";

// Scene 5 — Permissions: the safety gate
// An action arrives at a 3-way gate → routed to Auto-approve (green) /
// Ask (amber) / Block (red). The line the model can't cross on its own.

const ROUTES = [
  { action: "read file", verdict: "AUTO-APPROVE", color: theme.accentGreen, icon: "✓", note: "harmless" },
  { action: "edit file", verdict: "ASK YOU FIRST", color: theme.accentWarm, icon: "?", note: "changes state" },
  { action: "rm -rf /",  verdict: "BLOCK",         color: theme.accentRed,   icon: "✕", note: "destructive" },
];

export const Scene5Permissions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <CameraRig>

      <SceneHeading kicker="the safety gate" accent={theme.accentWarm}>
        Every action hits a <span style={gradientText("#fbbf24", theme.accentWarm)}>gate</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
        {ROUTES.map((r, i) => {
          const start = fps * (1.5 + i * 2.2);
          const s = pop(frame, fps, start, { damping: 11 });
          const rowOpacity = interpolate(frame, [start, start + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // verdict reveals slightly after the action slides in
          const vStart = start + fps * 0.9;
          const vOpacity = interpolate(frame, [vStart, vStart + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const glow = interpolate(frame, [vStart, vStart + fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // gate verdict icon punches in with overshoot
          const iconPop = pop(frame, fps, vStart, { damping: 9 });
          const iconScale = interpolate(iconPop, [0, 1], [0.3, 1]);

          return (
            <div key={r.action} style={{ opacity: rowOpacity, display: "flex", alignItems: "center", gap: 36 }}>
              {/* action chip */}
              <div style={{
                transform: `translateX(${(1 - s) * -40}px)`,
                width: 320, padding: "22px 30px", borderRadius: 18,
                background: "linear-gradient(160deg, #17171f 0%, #0e0e13 100%)",
                border: `1px solid ${theme.border}`,
                boxShadow: "0 12px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
                fontFamily: theme.fontMono, fontSize: 35, color: theme.text, textAlign: "center",
              }}>{r.action}</div>

              {/* arrow */}
              <div style={{ fontSize: 40, color: theme.textDim }}>→</div>

              {/* gate icon */}
              <div style={{
                width: 84, height: 84, borderRadius: 18, opacity: vOpacity,
                transform: `scale(${iconScale})`,
                background: `linear-gradient(160deg, ${r.color}, ${r.color}bb)`, color: theme.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 46, fontWeight: 800,
                boxShadow: `0 0 ${glow * 55}px ${r.color}, inset 0 1px 0 rgba(255,255,255,0.3)`,
              }}>{r.icon}</div>

              {/* verdict */}
              <div style={{ opacity: vOpacity, display: "flex", flexDirection: "column", gap: 3, width: 400 }}>
                <div style={{ fontFamily: theme.fontMono, fontSize: 38, fontWeight: 800, color: r.color }}>{r.verdict}</div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>{r.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", bottom: 80, width: "100%", textAlign: "center", opacity: interpolate(frame, [fps * 9, fps * 10.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: theme.fontSans, fontSize: 38, color: theme.text }}>
        The model <span style={{ color: theme.textMuted }}>proposes.</span> The harness <span style={{ color: theme.accent }}>disposes.</span>
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
