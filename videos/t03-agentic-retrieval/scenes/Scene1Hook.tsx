import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, ModelCore, gradientText } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 1 — Hook. An agent + a million-token wall vs a tiny window; the
// "stuff it all in" attempt chokes the window red; then a spotlight finds the
// 3 lines that matter. Punchline: "Find the needle. Not the haystack."

const ci = (f: number, inp: number[], out: number[]) =>
  interpolate(f, inp, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase opacities
  const base = ci(frame, [0, 40, 1040, 1100], [0, 1, 1, 0]);
  const qIn = ci(frame, [80, 130, 1040, 1100], [0, 1, 1, 0]);
  const floodOp = ci(frame, [210, 270, 600, 660], [0, 1, 1, 0]);
  const badgesOp = ci(frame, [440, 500, 600, 660], [0, 1, 1, 0]);
  const spotOp = ci(frame, [665, 730, 1045, 1105], [0, 1, 1, 0]);
  const punchOp = ci(frame, [1095, 1165], [0, 1]);
  const punchPulse = 1 + 0.02 * Math.sin(frame / 12);

  // Flood dynamics
  const fillCount = Math.max(0, Math.floor(ci(frame, [230, 520], [0, 36])));
  const cost = Math.max(0, Math.round(ci(frame, [230, 540], [0, 42])));
  const windowRed = ci(frame, [270, 520], [0, 1]);

  // Spotlight sweep + answer glow
  const spotX = ci(frame, [690, 900], [1120, 1430]);
  const spotY = ci(frame, [690, 900], [300, 470]);
  const answerGlow = ci(frame, [880, 960], [0, 1]);

  // Wall grid
  const wallLeft = 1000;
  const wallTop = 250;
  const cols = 12;
  const rows = 7;
  const bw = 62;
  const bh = 50;
  const gx = 6;
  const gy = 8;
  const answerIdx = new Set([30, 43, 56]);
  const wallBlocks = Array.from({ length: cols * rows });

  // Window box
  const winLeft = 560;
  const winTop = 420;
  const winW = 320;
  const winH = 300;
  const winBorder = `rgba(${Math.round(34 + windowRed * 214)}, ${Math.round(
    211 - windowRed * 98
  )}, ${Math.round(153 - windowRed * 40)}, 1)`;
  const fillBlocks = Array.from({ length: fillCount });

  const modelPulse = 0.4 + 0.3 * Math.sin(frame / 14);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />
      <Sfx name="whoosh" at={fps * 0.3} volume={0.35} />
      <Sfx name="alarm" at={fps * 9} volume={0.4} />
      <Sfx name="error" at={fps * 17} volume={0.4} />
      <Sfx name="success" at={fps * 30} volume={0.4} />
      <Sfx name="stinger" at={1100} volume={0.45} />

      <CameraRig
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      >
        {/* Top question line */}
        <div
          style={{
            position: "absolute",
            top: 70,
            width: "100%",
            textAlign: "center",
            opacity: qIn,
            transform: `translateY(${(1 - qIn) * -18}px)`,
          }}
        >
          <div style={{ fontFamily: theme.fontMono, fontSize: 25, letterSpacing: 7, color: theme.accent, marginBottom: 14 }}>
            THE HARDEST SIMPLE PROBLEM
          </div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 46, fontWeight: 800, color: theme.text }}>
            One question. The answer's <span style={gradientText("#a5b4fc", theme.accent)}>3 sentences</span> deep.
          </div>
        </div>

        {/* Base visual group (model + window + wall) */}
        <div style={{ opacity: base }}>
          {/* Model */}
          <div style={{ position: "absolute", left: 230, top: 410 }}>
            <ModelCore size={200} label="AGENT" pulse={modelPulse} fontSize={32} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 200,
              top: 632,
              width: 260,
              textAlign: "center",
              fontFamily: theme.fontMono,
              fontSize: 26,
              color: theme.textMuted,
            }}
          >
            the agent
          </div>

          {/* Context window box */}
          <div
            style={{
              position: "absolute",
              left: winLeft,
              top: winTop,
              width: winW,
              height: winH,
              borderRadius: 16,
              border: `3px solid ${winBorder}`,
              background: `rgba(${Math.round(windowRed * 60)},0,0,0.18)`,
              boxShadow: `0 0 ${20 + windowRed * 40}px ${winBorder}55`,
              padding: 16,
              display: "flex",
              flexWrap: "wrap",
              alignContent: "flex-start",
              gap: 8,
              overflow: "hidden",
            }}
          >
            {fillBlocks.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 40,
                  height: 18,
                  borderRadius: 4,
                  background: theme.tokenColors[i % theme.tokenColors.length],
                  opacity: 0.55,
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: winLeft - 30,
              top: winTop + winH + 14,
              width: winW + 60,
              textAlign: "center",
              fontFamily: theme.fontMono,
              fontSize: 26,
              color: theme.textMuted,
            }}
          >
            ~200K window
          </div>

          {/* Wall of tokens */}
          <div
            style={{
              position: "absolute",
              left: wallLeft - 20,
              top: 198,
              width: cols * (bw + gx),
              textAlign: "center",
              fontFamily: theme.fontMono,
              fontSize: 28,
              fontWeight: 700,
              color: theme.accentWarm,
            }}
          >
            1,000,000 tokens
          </div>
          {wallBlocks.map((_, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const isAns = answerIdx.has(i);
            const glow = isAns ? answerGlow * spotOp : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: wallLeft + c * (bw + gx),
                  top: wallTop + r * (bh + gy),
                  width: bw,
                  height: bh,
                  borderRadius: 5,
                  background: isAns
                    ? `rgba(52,211,153,${0.25 + glow * 0.75})`
                    : `rgba(129,140,248,${0.12 + 0.05 * Math.sin((frame + i * 9) / 22)})`,
                  border: isAns ? `2px solid rgba(52,211,153,${0.4 + glow * 0.6})` : "1px solid #ffffff10",
                  boxShadow: isAns && glow > 0.1 ? `0 0 ${glow * 26}px ${theme.accentGreen}` : "none",
                }}
              />
            );
          })}
        </div>

        {/* Flood badges */}
        <div
          style={{
            position: "absolute",
            top: 770,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 28,
            opacity: badgesOp,
          }}
        >
          {[`slow`, `$${cost} burned`, `✕ wrong`].map((b, i) => (
            <div
              key={i}
              style={{
                fontFamily: theme.fontMono,
                fontSize: 30,
                fontWeight: 700,
                color: theme.accentRed,
                background: "#2a0e0e",
                border: `2px solid ${theme.accentRed}66`,
                borderRadius: 999,
                padding: "10px 26px",
              }}
            >
              {b}
            </div>
          ))}
        </div>

        {/* "dump it all in" label during flood */}
        <div
          style={{
            position: "absolute",
            left: winLeft,
            top: winTop - 56,
            width: winW,
            textAlign: "center",
            opacity: floodOp,
            fontFamily: theme.fontMono,
            fontSize: 30,
            fontWeight: 800,
            color: theme.accentRed,
          }}
        >
          dump it all in →
        </div>

        {/* Spotlight */}
        <div style={{ opacity: spotOp }}>
          <div
            style={{
              position: "absolute",
              left: spotX - 160,
              top: spotY - 160,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.accentGreen}33 0%, transparent 68%)`,
              border: `2px solid ${theme.accentGreen}55`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 770,
              width: "100%",
              textAlign: "center",
              fontFamily: theme.fontSans,
              fontSize: 34,
              fontWeight: 700,
              color: theme.accentGreen,
              opacity: answerGlow,
            }}
          >
            the answer — just 3 lines
          </div>
        </div>

        {/* Punchline */}
        <div
          style={{
            position: "absolute",
            top: 440,
            width: "100%",
            textAlign: "center",
            opacity: punchOp,
            transform: `scale(${0.9 + punchOp * 0.1 * punchPulse})`,
          }}
        >
          <div style={{ fontFamily: theme.fontSans, fontSize: 84, fontWeight: 800, color: theme.text, lineHeight: 1.15 }}>
            Find the <span style={gradientText("#6ee7b7", theme.accentGreen)}>needle</span>.
            <br />
            Not the haystack.
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
