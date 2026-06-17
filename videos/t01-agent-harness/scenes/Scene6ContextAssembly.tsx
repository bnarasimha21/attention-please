import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 6 — Context assembly
// A CONTEXT WINDOW container; labeled blocks slide+pop in, stacking up:
// System prompt · Tools · Files · History · Latest result. A recurring
// "↻ rebuilt from scratch (stateless)" indicator. Tag pointing to the full
// context-engineering episode. Window lives in a SAFE BAND (top 210 / bottom 130).

const BLOCKS = [
  { label: "System prompt", color: theme.tokenColors[5] },
  { label: "Tools", color: theme.tokenColors[2] },
  { label: "Files", color: theme.tokenColors[4] },
  { label: "History", color: theme.tokenColors[1] },
  { label: "Latest result", color: theme.accentWarm },
];

export const Scene6ContextAssembly: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // container appears first
  const boxPop = pop(frame, fps, fps * 1.0, { damping: 13 });
  const boxIn = interpolate(boxPop, [0, 1], [0, 1]);
  const boxScale = interpolate(boxPop, [0, 1], [0.9, 1]);

  // recurring "rebuilt" indicator — gentle pulse, plus a spin on the ↻ glyph
  const rebuiltIn = interpolate(frame, [fps * 9, fps * 10.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rebuiltPulse = 0.7 + 0.3 * Math.sin(frame / 18);
  const spin = (frame * 2.2) % 360;

  const tagIn = interpolate(pop(frame, fps, fps * 24, { damping: 14 }), [0, 1], [0, 1]);

  const captionOpacity = interpolate(frame, [fps * 13, fps * 14.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />

      <CameraRig>
        <SceneHeading kicker="every single turn" accent={theme.accentWarm}>
          Context, <span style={gradientText("#fde68a", theme.accentWarm)}>&lt;rebuilt&gt;</span> every turn
        </SceneHeading>

        {/* CONTEXT WINDOW container — pinned in the safe band */}
        <div
          style={{
            position: "absolute",
            top: 210,
            bottom: 130,
            left: "50%",
            transform: `translateX(-50%) scale(${boxScale})`,
            width: 760,
            opacity: boxIn,
            borderRadius: 22,
            background: `linear-gradient(160deg, #181410, ${theme.surface})`,
            border: `1.5px solid ${theme.accentWarm}55`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.55), inset 0 0 70px ${theme.accentWarm}0f`,
            padding: "20px 30px 26px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 24, fontWeight: 800, color: theme.accentWarm, letterSpacing: 2, textTransform: "uppercase" }}>
              Context Window
            </div>
            {/* rebuilt indicator */}
            <div
              style={{
                opacity: rebuiltIn * rebuiltPulse,
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 16px",
                borderRadius: 999,
                background: `${theme.accentWarm}1c`,
                border: `1px solid ${theme.accentWarm}55`,
                fontFamily: theme.fontMono,
                fontSize: 20,
                color: theme.accentWarm,
              }}
            >
              <span style={{ display: "inline-block", transform: `rotate(${spin}deg)` }}>↻</span>
              rebuilt from scratch (stateless)
            </div>
          </div>

          {/* stacked blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, justifyContent: "center", flex: 1 }}>
            {BLOCKS.map((b, i) => {
              const delay = fps * (2.0 + i * 1.3);
              const p = pop(frame, fps, delay, { damping: 13, stiffness: 150 });
              const enter = interpolate(p, [0, 1], [0, 1]);
              // slide up into the stack
              const ty = (1 - enter) * 40;
              return (
                <div
                  key={b.label}
                  style={{
                    opacity: enter,
                    transform: `translateY(${ty}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "18px 24px",
                    borderRadius: 14,
                    background: `${b.color}14`,
                    border: `1px solid ${b.color}66`,
                    boxShadow: `0 0 26px ${b.color}22`,
                  }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: b.color, boxShadow: `0 0 14px ${b.color}` }} />
                  <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.text, fontWeight: 600 }}>{b.label}</div>
                </div>
              );
            })}
          </div>

          {/* full-episode tag */}
          <div
            style={{
              alignSelf: "flex-end",
              marginTop: 16,
              opacity: tagIn,
              transform: `translateX(${(1 - tagIn) * 18}px)`,
              fontFamily: theme.fontMono,
              fontSize: 21,
              color: theme.accent,
            }}
          >
            → full episode: context engineering
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            width: "100%",
            textAlign: "center",
            opacity: captionOpacity,
            fontFamily: theme.fontSans,
            fontSize: 36,
            color: theme.text,
          }}
        >
          The harness is the model's <span style={{ color: theme.accentWarm }}>working memory</span> — assembled by hand.
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
