import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 5 — The tradeoff
// A speed-vs-accuracy DIAL turns from low → high. As it turns, three meters
// move in tandem: accuracy ↑ (good), but latency ↑ and cost ↑ (the price).

const Meter: React.FC<{ label: string; value: number; color: string; good?: boolean; enter?: number }> = ({ label, value, color, good, enter = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 11, width: 432, opacity: enter, transform: `translateX(${(1 - enter) * 36}px) scale(${0.85 + enter * 0.15})`, transformOrigin: "left center" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.text, letterSpacing: 1 }}>{label}</span>
      <span style={{ fontFamily: theme.fontMono, fontSize: 27, color, fontWeight: 700 }}>
        {good ? "↑" : "↑"} {Math.round(value)}%
      </span>
    </div>
    <div style={{ height: 24, borderRadius: 12, background: theme.surface, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 18px ${color}` }} />
    </div>
  </div>
);

export const Scene5Tradeoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stageOpacity = interpolate(frame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // snappy staggered entrances for the dial + the three meters
  const dialPop = pop(frame, fps, fps * 1.0, { damping: 11 });
  const meterPop = (i: number) => pop(frame, fps, fps * (1.4 + i * 0.18), { damping: 11 });

  // dial value 0..1 — sweep up (2.5s..9s), hold, the whole "turning the knob" feel
  const dial = interpolate(frame, [fps * 2.5, fps * 9], [0.08, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // needle rotation: -120deg (low) to +120deg (high)
  const needleDeg = interpolate(dial, [0, 1], [-120, 120]);

  // meters driven by the dial
  const accuracy = 42 + dial * 52;     // 42 → 94
  const latency = 10 + dial * 80;      // 10 → 90
  const cost = 8 + dial * 78;          // 8 → 86

  const dialColor = interpolateColors(dial, [0, 0.5, 1], [theme.accentGreen, theme.accentWarm, theme.accentRed]);
  const modeLabel = dial < 0.4 ? "FAST & CHEAP" : dial < 0.7 ? "BALANCED" : "SLOW BUT SMART";

  // closing line — holds fully visible to scene end (18s)
  const lineOpacity = interpolate(frame, [fps * 11, fps * 12.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <CameraRig>
      <SceneHeading kicker="the tradeoff" accent={theme.accentWarm}>
        A dial you <span style={gradientText("#fbbf24", theme.accentWarm)}>turn</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 220, left: 0, right: 0, bottom: 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 144, opacity: stageOpacity }}>

        {/* The dial */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, transform: `scale(${0.85 + dialPop * 0.15})` }}>
          <div style={{ position: "relative", width: 336, height: 336 }}>
            {/* arc track */}
            <svg width={336} height={336} viewBox="0 0 280 280" style={{ position: "absolute", inset: 0 }}>
              <path d="M 56 224 A 110 110 0 1 1 224 224" fill="none" stroke={theme.border} strokeWidth={14} strokeLinecap="round" />
              {/* lit portion proportional to dial */}
              <path d="M 56 224 A 110 110 0 1 1 224 224" fill="none" stroke={dialColor} strokeWidth={14} strokeLinecap="round"
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dial}
                style={{ filter: `drop-shadow(0 0 12px ${dialColor})` }} />
            </svg>
            {/* hub + needle */}
            <div style={{
              position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) rotate(${needleDeg}deg)`,
              width: 10, height: 132, transformOrigin: "50% 100%", marginTop: -66,
            }}>
              <div style={{ width: 10, height: 132, borderRadius: 5, background: dialColor, boxShadow: `0 0 16px ${dialColor}` }} />
            </div>
            <div style={{
              position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
              width: 36, height: 36, borderRadius: 18, background: theme.text, boxShadow: `0 0 14px ${dialColor}`,
            }} />
            {/* low / high labels */}
            <div style={{ position: "absolute", left: 10, bottom: 31, fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted }}>low</div>
            <div style={{ position: "absolute", right: 10, bottom: 31, fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted }}>high</div>
          </div>
          <div style={{
            padding: "13px 29px", borderRadius: 999, background: `${dialColor}1a`, border: `1px solid ${dialColor}`,
            fontFamily: theme.fontMono, fontSize: 30, color: dialColor, fontWeight: 700, letterSpacing: 2,
          }}>{modeLabel}</div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted }}>how hard should it think?</div>
        </div>

        {/* The meters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <Meter label="accuracy" value={accuracy} color={theme.accentGreen} good enter={meterPop(0)} />
          <Meter label="latency" value={latency} color={theme.accentWarm} enter={meterPop(1)} />
          <Meter label="cost" value={cost} color={theme.accentRed} enter={meterPop(2)} />
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 80, width: "100%", textAlign: "center", opacity: lineOpacity,
        fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        Smarter answers cost <span style={{ color: theme.accentWarm, fontWeight: 700 }}>time</span> and{" "}
        <span style={{ color: theme.accentRed, fontWeight: 700 }}>money.</span> You choose the trade.
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
