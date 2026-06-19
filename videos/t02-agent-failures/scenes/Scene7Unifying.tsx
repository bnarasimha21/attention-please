import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 7 - The unifying principle
// The four failure cards flip from red (the problem) to green (the fix), one by
// one, each revealing its guard layer. Then the thesis: every fix is a default
// you must deliberately add — a naive harness does none of them.

const CARDS = [
  { icon: "💸", name: "Runaway loop",    fix: "iteration budget + stall detection",   more: "+ cap tokens · time · stop on no-progress" },
  { icon: "🧠", name: "Context rot",     fix: "curate context, don't just append",    more: "+ sub-agent isolation · memory files" },
  { icon: "🧰", name: "Tool sprawl",     fix: "fewer, sharper tools",                 more: "+ or load them on demand" },
  { icon: "☠️", name: "Over-permission", fix: "read auto · write gate · destroy block", more: "+ sandbox it · break the trifecta" },
];

export const Scene7Unifying: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const red = theme.accentRed;
  const green = theme.accentGreen;

  // each card flips red->green as the VO names the four ("loop forever, rot its
  // context, drown the model in tools, run free") — anchored to the transcript.
  const flipStart = (i: number) => fps * 5 + i * fps * 3; // 5 / 8 / 11 / 14s

  const thesisT = interpolate(frame, [fps * 20, fps * 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const thesisPop = pop(frame, fps, fps * 20, { damping: 13 });
  const closeT = interpolate(frame, [fps * 38, fps * 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={green} />
      {/* SFX: a success chime as each card flips green, stinger on the thesis */}
      <Sfx name="success" at={fps * 5.3} volume={0.32} />
      <Sfx name="success" at={fps * 8.3} volume={0.32} />
      <Sfx name="success" at={fps * 11.3} volume={0.32} />
      <Sfx name="success" at={fps * 14.3} volume={0.32} />
      <Sfx name="stinger" at={fps * 20} volume={0.4} />
      <CameraRig>
        <div style={{ zIndex: 20 }}>
          <SceneHeading kicker="the unifying principle" accent={green}>
            Every fix is a <span style={gradientText("#86efac", green)}>default you add</span>
          </SceneHeading>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
          }}
        >
          {CARDS.map((card, i) => {
            const start = flipStart(i);
            // flip progress 0 (red) -> 1 (green)
            const flip = interpolate(frame, [start, start + fps * 0.6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const appear = pop(frame, fps, fps * 0.6 + i * fps * 0.12, { damping: 12 });
            // a quick vertical flip at the moment of change
            const flipRot = interpolate(frame, [start, start + fps * 0.3, start + fps * 0.6], [0, 90, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const c = interpolateColors(flip, [0, 1], [red, green]);
            const glow = 0.5 + 0.5 * Math.sin((frame - start) / 16 + i);
            // the deeper layer fades in just after the card flips green
            const moreT = interpolate(frame, [start + fps * 0.6, start + fps * 1.0], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={card.name}
                style={{
                  width: 404,
                  height: 568,
                  opacity: appear,
                  transform: `perspective(1200px) rotateX(${flipRot}deg) scale(${0.88 + appear * 0.12})`,
                  borderRadius: 28,
                  padding: "48px 36px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  background: `linear-gradient(160deg, ${c}1f 0%, rgba(12,16,13,0.92) 60%)`,
                  border: `2px solid ${c}88`,
                  boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 ${24 + glow * 26}px ${c}44`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <div style={{ fontSize: 104, marginBottom: 30, lineHeight: 1, filter: flip > 0.5 ? "none" : "grayscale(0.2)" }}>
                  {flip > 0.5 ? "✅" : card.icon}
                </div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 42, fontWeight: 800, color: c, marginBottom: 24 }}>
                  {card.name}
                </div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 30, fontWeight: 500, color: flip > 0.5 ? theme.text : theme.textMuted, lineHeight: 1.45 }}>
                  {card.fix}
                </div>
                <div style={{ marginTop: 22, fontFamily: theme.fontMono, fontSize: 24, fontWeight: 600, color: green, opacity: moreT * 0.9, lineHeight: 1.4 }}>
                  {card.more}
                </div>
              </div>
            );
          })}
        </div>

        {/* Thesis */}
        <div
          style={{
            position: "absolute",
            bottom: 235,
            width: "100%",
            textAlign: "center",
            opacity: thesisT,
            transform: `translateY(${(1 - thesisPop) * 16}px)`,
            fontFamily: theme.fontSans,
            fontSize: 40,
            fontWeight: 600,
            color: theme.text,
            zIndex: 20,
            padding: "0 60px",
          }}
        >
          A naive harness does <span style={{ color: red, fontWeight: 800 }}>none</span> of these.
          Every guard is something you <span style={{ color: green, fontWeight: 800 }}>deliberately add.</span>
        </div>

        {/* Closing line */}
        <div
          style={{
            position: "absolute",
            bottom: 185,
            width: "100%",
            textAlign: "center",
            opacity: closeT,
            fontFamily: theme.fontSans,
            fontSize: 31,
            color: theme.textMuted,
            zIndex: 20,
          }}
        >
          The model thinks. The harness keeps it from thinking itself into a corner.
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
