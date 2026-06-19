import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 1 - Hook (agent failures)
// A terminal status readout: iterations tick up fast, cost climbs to $40.17,
// "changes" flatlines at 0 (red). Freezes on the gut-punch line, then a kicker
// reframes it as a harness problem and teases the four failure modes.

const red = theme.accentRed;

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- live counters: climb from ~0 to the frozen readout, then hold ----
  const climbStart = fps * 1.0;
  const climbEnd = fps * 13.3; // counters freeze as VO finishes "...zero useful change" (~13.3s)
  const t = interpolate(frame, [climbStart, climbEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // ease-out so it sprints early then crawls to the final value
  const eased = 1 - Math.pow(1 - t, 2.2);

  const iterations = Math.round(eased * 312);
  const cost = eased * 40.17;
  const changes = 0;

  // card entrance
  const cardPop = pop(frame, fps, fps * 0.3, { damping: 13 });
  const cardScale = interpolate(cardPop, [0, 1], [0.9, 1]);

  // blinking "running" cursor while counters climb
  const running = frame < climbEnd;
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  // pulsing red urgency once it freezes
  const frozen = frame >= climbEnd;
  const freezePulse = frozen ? 0.5 + 0.5 * Math.sin((frame - climbEnd) / 7) : 0;

  // gut-punch line reveals as it freezes
  const punchT = interpolate(frame, [climbEnd, climbEnd + fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punchPop = pop(frame, fps, climbEnd, { damping: 14 });

  // kicker thesis line — VO "not a model problem ... the harness failed to prevent" (~15.5s)
  const kickT = interpolate(frame, [fps * 15.5, fps * 16.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // tease line — VO "four ways a harness can go wrong" (~23.3s)
  const teaseT = interpolate(frame, [fps * 23.3, fps * 24.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const teasePop = pop(frame, fps, fps * 23.3, { damping: 13 });

  const stat = (
    label: string,
    value: string,
    color: string,
    glow = false
  ) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.textMuted, letterSpacing: 1 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 108,
          fontWeight: 800,
          color,
          textShadow: glow ? `0 0 ${18 + freezePulse * 32}px ${color}` : "none",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <SceneBackground glow={red} />
      {/* SFX: ticking counters, cost alarm, the freeze, then the tease */}
      <Sfx name="tick" at={fps * 2} volume={0.3} />
      <Sfx name="tick" at={fps * 4.2} volume={0.3} />
      <Sfx name="tick" at={fps * 6.4} volume={0.3} />
      <Sfx name="tick" at={fps * 8.6} volume={0.3} />
      <Sfx name="tick" at={fps * 10.5} volume={0.3} />
      <Sfx name="tick" at={fps * 12} volume={0.3} />
      <Sfx name="alarm" at={fps * 11.5} volume={0.4} />
      <Sfx name="error" at={fps * 13.3} volume={0.45} />
      <Sfx name="stinger" at={fps * 23.5} volume={0.4} />
      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* status readout card */}
        <div
          style={{
            position: "absolute",
            top: 165,
            left: "50%",
            transform: `translateX(-50%) scale(${cardScale})`,
            opacity: cardPop,
            width: 1460,
            padding: "54px 70px 60px",
            borderRadius: 24,
            background: `linear-gradient(160deg, #1a1212, ${theme.surface})`,
            border: `1px solid ${frozen ? red + "88" : theme.border}`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), inset 0 0 80px ${red}${frozen ? "1a" : "0d"}`,
          }}
        >
          {/* window dots + status */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 30 }}>
            {[theme.accentRed, theme.accentWarm, theme.accentGreen].map((c) => (
              <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85 }} />
            ))}
            <div
              style={{
                marginLeft: 18,
                fontFamily: theme.fontMono,
                fontSize: 28,
                color: running ? theme.accentWarm : red,
                letterSpacing: 1,
              }}
            >
              {running ? "agent · running" : "agent · STILL running"}
              {running && cursorOn ? " ▍" : ""}
            </div>
          </div>

          {/* the three stats */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            {stat("iterations", String(iterations), theme.accentWarm)}
            <div style={{ fontSize: 60, color: theme.textDim, fontFamily: theme.fontMono }}>·</div>
            {stat("cost", `$${cost.toFixed(2)}`, red, frozen)}
            <div style={{ fontSize: 60, color: theme.textDim, fontFamily: theme.fontMono }}>·</div>
            {stat("changes", String(changes), red, frozen)}
          </div>
        </div>

        {/* gut-punch line */}
        <div
          style={{
            position: "absolute",
            top: 650,
            width: "100%",
            textAlign: "center",
            opacity: punchT,
            transform: `translateY(${(1 - punchPop) * 16}px)`,
            fontFamily: theme.fontSans,
            fontSize: 56,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Twenty minutes. Forty dollars.{" "}
          <span style={gradientText("#fca5a5", red)}>Zero useful changes.</span>
        </div>

        {/* kicker thesis */}
        <div
          style={{
            position: "absolute",
            top: 770,
            width: "100%",
            textAlign: "center",
            opacity: kickT,
            fontFamily: theme.fontSans,
            fontSize: 40,
            fontWeight: 500,
            color: theme.textMuted,
            padding: "0 200px",
          }}
        >
          Not a model problem. A harness that{" "}
          <span style={{ color: theme.text, fontWeight: 700 }}>failed to prevent it.</span>
        </div>

        {/* tease */}
        <div
          style={{
            position: "absolute",
            bottom: 205,
            width: "100%",
            textAlign: "center",
            opacity: teaseT,
            transform: `translateY(${(1 - teasePop) * 14}px)`,
            fontFamily: theme.fontMono,
            fontSize: 36,
            color: red,
            letterSpacing: 1,
          }}
        >
          Four ways a harness goes wrong →
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
