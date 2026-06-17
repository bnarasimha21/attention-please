import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 13 - Failure modes
// A row of 4 red glassy cards pops in one by one, each a way harnesses break.
// Then a late green summary line reframes a great harness as the absence of
// these problems.

const CARDS = [
  { icon: "💸", name: "Runaway loop",    desc: "no budget, burns money in circles" },
  { icon: "🧠", name: "Context rot",     desc: "window fills with junk, model gets dumber" },
  { icon: "🧰", name: "Tool sprawl",     desc: "50 vague tools it can't choose between" },
  { icon: "☠️", name: "Over-permission", desc: "auto-approve everything → one bad call" },
];

export const Scene13FailureModes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cards stagger in starting at 1.6s, +1.3s apart (last lands ~5.5s).
  const cardStart = (i: number) => fps * 1.6 + i * fps * 1.3;

  // Green summary line reveals after all cards land, holds to scene end.
  const sumT = interpolate(frame, [fps * 8.5, fps * 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sumPop = pop(frame, fps, fps * 8.5, { damping: 13, stiffness: 130 });

  const red = theme.accentRed;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={red} />
      <CameraRig>
        <div style={{ zIndex: 20 }}>
          <SceneHeading kicker="what goes wrong" accent={red}>
            How harnesses <span style={gradientText("#fca5a5", red)}>break</span>
          </SceneHeading>
        </div>

        {/* Row of 4 cards */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {CARDS.map((card, i) => {
            const start = cardStart(i);
            const s = pop(frame, fps, start, { damping: 12, stiffness: 150 });
            const opacity = interpolate(frame, [start, start + fps * 0.6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const glow = 0.5 + 0.5 * Math.sin((frame - start) / 16 + i);
            return (
              <div
                key={card.name}
                style={{
                  width: 360,
                  height: 408,
                  opacity,
                  transform: `translateY(${(1 - s) * 40}px) scale(${0.86 + s * 0.14})`,
                  borderRadius: 28,
                  padding: "36px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  background: `linear-gradient(160deg, ${red}1c 0%, rgba(16,12,12,0.92) 60%)`,
                  border: `2px solid ${red}66`,
                  boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 ${24 + glow * 26}px ${red}33`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <div style={{ fontSize: 88, marginBottom: 24, lineHeight: 1 }}>{card.icon}</div>
                <div
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 38,
                    fontWeight: 800,
                    color: red,
                    marginBottom: 22,
                    letterSpacing: -0.3,
                  }}
                >
                  {card.name}
                </div>
                <div
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 28,
                    fontWeight: 500,
                    color: theme.textMuted,
                    lineHeight: 1.4,
                  }}
                >
                  {card.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Green summary line */}
        <div
          style={{
            position: "absolute",
            bottom: 175,
            width: "100%",
            textAlign: "center",
            opacity: sumT,
            transform: `translateY(${(1 - sumPop) * 18}px)`,
            fontFamily: theme.fontSans,
            fontSize: 34,
            fontWeight: 600,
            color: theme.text,
            zIndex: 20,
            padding: "0 120px",
          }}
        >
          A great harness is the{" "}
          <span style={{ color: theme.accentGreen, fontWeight: 800 }}>absence</span> of these:{" "}
          <span style={{ color: theme.accentGreen }}>
            tight loop · clean context · sharp tools · safe defaults.
          </span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
