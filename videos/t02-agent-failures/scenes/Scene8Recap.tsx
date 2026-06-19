import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 8 - Recap
// A 2x2 grid: each cell pairs a failure (red) with its fix (green), animating in
// sequence. Closes on "if your agent is behaving strangely, it's one of these."

const PAIRS = [
  { n: "01", icon: "💸", fail: "Runaway loop",    fix: "hard iteration budgets + stall detection", more: "also: token & time caps · stop on no-progress" },
  { n: "02", icon: "🧠", fail: "Context rot",     fix: "curate the prompt, don't just append",      more: "also: sub-agent isolation · memory files" },
  { n: "03", icon: "🧰", fail: "Tool sprawl",     fix: "fewer, sharper tools, unmistakable names",  more: "also: load 3–5 tools on demand" },
  { n: "04", icon: "☠️", fail: "Over-permission", fix: "read auto · write gate · destroy block",     more: "also: sandbox · break the lethal trifecta" },
];

export const Scene8Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // cells reveal as each pair is recited — anchored to the transcript timing.
  const cellStart = (i: number) => fps * [1.5, 7.5, 12, 17][i]; // Runaway / Context / Tool / Over-perm

  const closeT = interpolate(frame, [fps * 22, fps * 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closePop = pop(frame, fps, fps * 22, { damping: 13 });

  const red = theme.accentRed;
  const green = theme.accentGreen;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={theme.accent} />
      {/* SFX: a pop on each of the 4 grid cells, stinger on the closing line */}
      <Sfx name="pop" at={fps * 1.5} volume={0.4} />
      <Sfx name="pop" at={fps * 7.5} volume={0.4} />
      <Sfx name="pop" at={fps * 12} volume={0.4} />
      <Sfx name="pop" at={fps * 17} volume={0.4} />
      <Sfx name="stinger" at={fps * 22} volume={0.4} />
      <CameraRig>
        <div style={{ zIndex: 20 }}>
          <SceneHeading kicker="recap" accent={theme.accent}>
            4 failures, <span style={gradientText("#c7d2fe", theme.accent)}>4 fixes</span>
          </SceneHeading>
        </div>

        {/* 2x2 grid */}
        <div
          style={{
            position: "absolute",
            top: 228,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "684px 684px",
              gridTemplateRows: "auto auto",
              gap: 36,
            }}
          >
            {PAIRS.map((p, i) => {
              const start = cellStart(i);
              const s = pop(frame, fps, start, { damping: 12, stiffness: 150 });
              const opacity = interpolate(frame, [start, start + fps * 0.5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={p.fail}
                  style={{
                    width: 684,
                    height: 238,
                    opacity,
                    transform: `translateY(${(1 - s) * 36}px) scale(${0.9 + s * 0.1})`,
                    borderRadius: 22,
                    padding: "30px 38px",
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                    background: `linear-gradient(160deg, #16161d, ${theme.surface})`,
                    border: `1px solid ${theme.border}`,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                  }}
                >
                  <div style={{ fontSize: 78, lineHeight: 1 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
                      <span style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textDim, letterSpacing: 2 }}>{p.n}</span>
                      <span style={{ fontFamily: theme.fontSans, fontSize: 37, fontWeight: 800, color: red }}>{p.fail}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ color: green, fontSize: 30, fontWeight: 800 }}>→</span>
                      <span style={{ fontFamily: theme.fontSans, fontSize: 29, fontWeight: 600, color: theme.text, lineHeight: 1.3 }}>{p.fix}</span>
                    </div>
                    <div style={{ marginTop: 12, marginLeft: 44, fontFamily: theme.fontMono, fontSize: 24, fontWeight: 600, color: green, opacity: 0.85, lineHeight: 1.3 }}>
                      {p.more}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing line */}
        <div
          style={{
            position: "absolute",
            bottom: 210,
            width: "100%",
            textAlign: "center",
            opacity: closeT,
            transform: `translateY(${(1 - closePop) * 16}px)`,
            fontFamily: theme.fontSans,
            fontSize: 39,
            fontWeight: 600,
            color: theme.text,
            zIndex: 20,
            padding: "0 120px",
          }}
        >
          Behaving strangely? It's almost always{" "}
          <span style={{ color: theme.accent, fontWeight: 800 }}>one of these four.</span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
