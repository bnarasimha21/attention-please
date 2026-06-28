import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, ModelCore, gradientText } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 1 — Hook. An agent + a million-token wall vs a tiny window; the
// "stuff it all in" attempt chokes the window red; then a spotlight finds the
// 3 lines that matter. Punchline: "Pull in only what matters." (the needle/haystack
// line is Scene 6's spoken payoff — don't pre-empt it here.)
//
// Re-timed to recorded narration (1421f @30fps). Beats:
//  f0    "Here's a problem that sounds simple but turns out to be one of the harder things in AI..."
//  f197  "You point an agent at your whole codebase / company's entire knowledge base."
//  f358  "millions of tokens, far more than fits in its context window."
//  f522  "ask one question and the answer lives in maybe three sentences buried somewhere"
//  f715  "So how does the agent FIND those three sentences?"
//  f822  "If it dumps everything in, it slows down, costs more, gets less accurate"
//  f1060 "The real skill is the opposite."
//  f1126 "Pulling in only the right context exactly when it's needed — that's retrieval."
//  f1290 "And it's changed a lot recently."
//  f1369 "Let's walk through it."

const ci = (f: number, inp: number[], out: number[]) =>
  interpolate(f, inp, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase opacities --------------------------------------------------------
  // Base = agent + window + token wall. Up through the whole "problem" stretch,
  // dips out so the punch stands alone (f1050→1145), then RETURNS so the wall is
  // present for the spotlight retrieval resolve (f1175→end).
  const base = ci(
    frame,
    [60, 110, 1000, 1050, 1175, 1235],
    [0, 1, 1, 0, 0, 1]
  );
  // Top question line — present from the very first beat, stays through f522,
  // then clears for the flood/punch and does not return.
  const qIn = ci(frame, [0, 60, 1000, 1050], [0, 1, 1, 0]);
  // FLOOD ("dump it all in") — enters on f822, fades before the punch.
  const floodOp = ci(frame, [800, 860, 1000, 1055], [0, 1, 1, 0]);
  // Cost/slow/wrong badges accompany the flood.
  const badgesOp = ci(frame, [840, 900, 1000, 1055], [0, 1, 1, 0]);
  // SPOTLIGHT / "find those 3 lines" — re-enters after the punch on the
  // retrieval beat (f1126) and rides to the end (f1290 "changed", f1369).
  const spotOp = ci(frame, [1175, 1235, 1421], [0, 1, 1]);
  // PUNCH ("pull in only what matters") — lands on f1060 "the real skill is the opposite",
  // holds through the retrieval beat then steps aside for the spotlight resolve.
  const punchOp = ci(frame, [1040, 1110, 1150, 1195], [0, 1, 1, 0]);
  const punchPulse = 1 + 0.02 * Math.sin(frame / 12);

  // Flood dynamics — fill climbs across the "dumps everything in" beat, then
  // drains back out before base returns so the window is clean for the resolve.
  const fillCount = Math.max(0, Math.floor(ci(frame, [810, 990, 1000, 1045], [0, 36, 36, 0])));
  const cost = Math.max(0, Math.round(ci(frame, [810, 995], [0, 42])));
  const windowRed = ci(frame, [820, 990, 1000, 1045], [0, 1, 1, 0]);

  // Spotlight sweep + answer glow (the retrieval resolve, f1126→end). The sweep
  // settles onto the answer bricks, then drifts gently so the long tail
  // (f1369 "let's walk through it") never freezes.
  const spotSettleX = ci(frame, [1180, 1360], [1120, 1430]);
  const spotSettleY = ci(frame, [1180, 1360], [300, 470]);
  const spotX = spotSettleX + 10 * Math.sin(frame / 22);
  const spotY = spotSettleY + 7 * Math.cos(frame / 26);
  // Glow ramps in, then keeps a soft heartbeat so the answer keeps breathing.
  const answerGlowBase = ci(frame, [1290, 1360], [0, 1]);
  const answerGlow = answerGlowBase * (0.85 + 0.15 * Math.sin(frame / 16));

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

  // Wall reveal — bricks stagger in as the agent is "pointed at" the codebase
  // (f197) and keep filling through the "millions of tokens" beat (f358).
  // Starts right as the base group settles so the wall area never sits blank.
  const wallReveal = ci(frame, [150, 540], [0, 1]);
  // Token counter ticks up across f197→f358 so the wall never freezes.
  const tokenCount = Math.max(0, Math.round(ci(frame, [180, 540], [0, 1000000])));
  // The 3 answer bricks get a faint "buried somewhere" shimmer on the f522 beat
  // (before the explicit spotlight) so the hold from f522→f715 keeps moving.
  const buriedHint = ci(frame, [510, 600, 700, 760], [0, 1, 1, 0]);

  // Window box. winTop set so the box's VERTICAL CENTER (winTop + winH/2 = 510)
  // matches the AGENT core's center (top 410 + size 200/2 = 510) — align the row
  // by centers, not by top edge, or the taller box hangs low.
  const winLeft = 560;
  const winTop = 360;
  const winW = 320;
  const winH = 300;
  const winBorder = `rgba(${Math.round(34 + windowRed * 214)}, ${Math.round(
    211 - windowRed * 98
  )}, ${Math.round(153 - windowRed * 40)}, 1)`;
  const fillBlocks = Array.from({ length: fillCount });

  // Window pulse so it breathes during the long pre-flood hold.
  const winPulse = 0.5 + 0.5 * Math.sin(frame / 20);

  const modelPulse = 0.4 + 0.3 * Math.sin(frame / 14);

  // "find the three sentences?" question prompt — appears on f715 over the wall
  // and fades into the flood, keeping the f715→f822 stretch alive.
  const findQOp = ci(frame, [705, 760, 800, 850], [0, 1, 1, 0]);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />
      <Sfx name="whoosh" at={fps * 0.3} volume={0.35} />
      <Sfx name="alarm" at={822} volume={0.4} />
      <Sfx name="block" at={920} volume={0.45} />
      <Sfx name="stinger" at={1060} volume={0.45} rate={1.05} />
      <Sfx name="success" at={1300} volume={0.4} />

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
              boxShadow: `0 0 ${20 + windowRed * 40 + (1 - windowRed) * 8 * winPulse}px ${winBorder}55`,
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

          {/* Wall of tokens — live ticking counter */}
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
            {tokenCount.toLocaleString("en-US")} tokens
          </div>
          {wallBlocks.map((_, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const isAns = answerIdx.has(i);
            // Staggered brick reveal as the agent is pointed at the codebase.
            const order = (r * cols + c) / Math.max(1, cols * rows - 1);
            const brickIn = ci(wallReveal, [Math.max(0, order - 0.18), order + 0.02], [0, 1]);
            // Explicit spotlight glow (retrieval resolve) OR the earlier faint
            // "buried" hint on the answer bricks.
            const glow = isAns ? answerGlow * spotOp : 0;
            const hint = isAns ? buriedHint * 0.4 : 0;
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
                  opacity: brickIn,
                  transform: `scale(${0.85 + brickIn * 0.15})`,
                  background: isAns
                    ? `rgba(52,211,153,${0.18 + hint * 0.3 + glow * 0.75})`
                    : `rgba(129,140,248,${0.12 + 0.05 * Math.sin((frame + i * 9) / 22)})`,
                  border: isAns
                    ? `2px solid rgba(52,211,153,${0.35 + hint * 0.4 + glow * 0.6})`
                    : "1px solid #ffffff10",
                  boxShadow:
                    isAns && (glow > 0.1 || hint > 0.1)
                      ? `0 0 ${Math.max(glow * 26, hint * 16)}px ${theme.accentGreen}`
                      : "none",
                }}
              />
            );
          })}
        </div>

        {/* "find those 3 sentences?" prompt over the wall (f715) */}
        <div
          style={{
            position: "absolute",
            left: wallLeft - 20,
            top: 152,
            width: cols * (bw + gx),
            textAlign: "center",
            opacity: findQOp,
            transform: `translateY(${(1 - findQOp) * -10}px)`,
            fontFamily: theme.fontSans,
            fontSize: 34,
            fontWeight: 800,
            color: theme.accent,
          }}
        >
          find the 3?
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
              left: 0,
              width: "100%",
              textAlign: "center",
              fontFamily: theme.fontSans,
              fontSize: 34,
              fontWeight: 700,
              color: theme.accentGreen,
              opacity: answerGlow,
            }}
          >
            the answer: just 3 lines
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
            Pull in only
            <br />
            <span style={gradientText("#6ee7b7", theme.accentGreen)}>what matters.</span>
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
