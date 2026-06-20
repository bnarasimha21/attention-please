import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 2 - These aren't bugs, they're architectural gaps
// Four red glassy cards pop in one by one (same language as t01 FailureModes),
// each dimming slightly after landing ("coming up"). Bottom caption frames them
// as defaults a naive harness leaves open.

const red = theme.accentRed;

const CARDS = [
  { icon: "🔁", name: "Runaway Loop" },
  { icon: "🧠", name: "Context Rot" },
  { icon: "🧰", name: "Tool Sprawl" },
  { icon: "☠️", name: "Over-permission" },
];

export const Scene2FourFailures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // cards land exactly as the VO names each failure: "loop forever" 9.5, "bury
  // itself in junk" 12, "hundred tools it can't choose" 14.5, "delete your db" 18.
  const CARD_AT = [9.5, 12, 14.5, 18];
  const cardStart = (i: number) => fps * CARD_AT[i];

  const capT = interpolate(frame, [fps * 22, fps * 23.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const capPop = pop(frame, fps, fps * 22, { damping: 13 });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={red} />
      {/* SFX: soft sting under the heading, a pop on each of the 4 cards, sting on caption */}
      <Sfx name="error" at={fps * 1.0} volume={0.3} />
      <Sfx name="pop" at={fps * 9.5} volume={0.4} />
      <Sfx name="pop" at={fps * 12} volume={0.4} />
      <Sfx name="pop" at={fps * 14.5} volume={0.4} />
      <Sfx name="pop" at={fps * 18} volume={0.4} />
      <Sfx name="stinger" at={fps * 22} volume={0.35} />
      <CameraRig>
        <div style={{ zIndex: 20 }}>
          <SceneHeading kicker="not random bugs" accent={red}>
            Four <span style={gradientText("#fca5a5", red)}>architectural gaps</span>
          </SceneHeading>
        </div>

        {/* Row of 4 cards */}
        <div
          style={{
            position: "absolute",
            top: 255,
            left: 0,
            right: 0,
            bottom: 225,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 44,
          }}
        >
          {CARDS.map((card, i) => {
            const start = cardStart(i);
            const s = pop(frame, fps, start, { damping: 12, stiffness: 150 });
            const opacity = interpolate(frame, [start, start + fps * 0.6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            // dim slightly after landing - "coming up"
            const dim = interpolate(frame, [start + fps * 0.9, start + fps * 1.8], [1, 0.62], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const glow = 0.5 + 0.5 * Math.sin((frame - start) / 18 + i);
            return (
              <div
                key={card.name}
                style={{
                  width: 396,
                  height: 420,
                  opacity: opacity * dim,
                  transform: `translateY(${(1 - s) * 44}px) scale(${0.86 + s * 0.14})`,
                  borderRadius: 30,
                  padding: "52px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  background: `linear-gradient(160deg, ${red}1c 0%, rgba(16,12,12,0.92) 60%)`,
                  border: `2px solid ${red}66`,
                  boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 ${20 + glow * 22}px ${red}33`,
                  backdropFilter: "blur(6px)",
                }}
              >
                {/* number badge */}
                <div
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: 28,
                    color: red,
                    opacity: 0.8,
                    marginBottom: 18,
                    letterSpacing: 2,
                  }}
                >
                  0{i + 1}
                </div>
                <div style={{ fontSize: 124, marginBottom: 34, lineHeight: 1 }}>{card.icon}</div>
                <div
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 42,
                    fontWeight: 800,
                    color: theme.text,
                    letterSpacing: -0.3,
                  }}
                >
                  {card.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* caption */}
        <div
          style={{
            position: "absolute",
            bottom: 210,
            width: "100%",
            textAlign: "center",
            opacity: capT,
            transform: `translateY(${(1 - capPop) * 16}px)`,
            fontFamily: theme.fontSans,
            fontSize: 42,
            fontWeight: 600,
            color: theme.text,
            zIndex: 20,
          }}
        >
          Defaults a naive harness{" "}
          <span style={{ color: red, fontWeight: 800 }}>leaves open.</span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
