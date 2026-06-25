import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, ModelCore } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 5 — Loop Topologies
// Three distinct beats:
//   [0–260]   Sequential (ReAct): A→B→C linear chain, latency cost shown
//   [300–580] Fan-out (LLMCompiler): DAG parallel branches, 3.6x speedup stat
//   [620–820] Event-driven: loop sleeping, webhook fires, wakes, processes, sleeps
//   [840–900] Punchline / heuristic flowchart

const clamp = (frame: number, s: number, e: number) =>
  interpolate(frame, [s, e], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ─── Node component used in multiple diagrams ─────────────────────────────────
const Node: React.FC<{
  label: string;
  x: number;
  y: number;
  color?: string;
  active?: boolean;
  scale?: number;
  opacity?: number;
  size?: number;
}> = ({ label, x, y, color = theme.accent, active = false, scale = 1, opacity = 1, size = 100 }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      background: active ? `radial-gradient(circle, ${color}44 0%, ${color}22 100%)` : `${color}15`,
      border: `2px solid ${active ? color : color + "66"}`,
      boxShadow: active ? `0 0 30px ${color}88` : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.fontMono,
      fontSize: 28,
      fontWeight: 800,
      color: active ? color : color + "aa",
      transform: `scale(${scale})`,
      opacity,
      transition: "none",
    }}
  >
    {label}
  </div>
);

// ─── Arrow component ──────────────────────────────────────────────────────────
const Arrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  progress?: number;
  color?: string;
  dashed?: boolean;
}> = ({ x1, y1, x2, y2, progress = 1, color = theme.accent, dashed = false }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const dashArray = dashed ? "10 6" : "none";
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
      width={1}
      height={1}
    >
      <line
        x1={x1} y1={y1}
        x2={x1 + dx * progress}
        y2={y1 + dy * progress}
        stroke={color}
        strokeWidth={3}
        strokeDasharray={dashArray}
        opacity={0.85}
      />
      {progress > 0.9 && (
        <polygon
          points={`${x2},${y2} ${x2 - 10 * (dx / len) + 6 * (dy / len)},${y2 - 10 * (dy / len) - 6 * (dx / len)} ${x2 - 10 * (dx / len) - 6 * (dy / len)},${y2 - 10 * (dy / len) + 6 * (dx / len)}`}
          fill={color}
          opacity={0.85}
        />
      )}
    </svg>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const Scene5Topologies: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing
  // Phase 1: Sequential  0 → 300
  // Phase 2: Fan-out    300 → 600
  // Phase 3: Event      600 → 840
  // Phase 4: Heuristic  840 → 900

  const ph1Op = Math.min(
    clamp(frame, 0, 20),
    1 - clamp(frame, 265, 300)
  );
  const ph2Op = Math.min(
    clamp(frame, 300, 320),
    1 - clamp(frame, 555, 590)
  );
  const ph3Op = Math.min(
    clamp(frame, 590, 615),
    1 - clamp(frame, 820, 848)
  );
  const ph4Op = clamp(frame, 848, 878);

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  // ─── Phase 1: Sequential (ReAct A→B→C) ────────────────────────────────────
  // Nodes appear one by one, active node pulses, arrow draws in
  const seqLocal = frame; // starts at 0
  const nodePop = (delay: number) => pop(Math.max(0, frame - delay), fps);

  // Node reveal delays
  const nodeA_pop = nodePop(20);
  const nodeB_pop = nodePop(75);
  const nodeC_pop = nodePop(130);

  // Arrow draw progress
  const arrowAB = clamp(seqLocal, 70, 110);
  const arrowBC = clamp(seqLocal, 125, 165);

  // Active highlighting — animate through A→B→C repeatedly
  const seqCycle = (seqLocal - 30) % 150; // 0–149 cycle
  const seqActive = seqCycle < 50 ? 0 : seqCycle < 100 ? 1 : 2; // 0=A, 1=B, 2=C

  // Latency stack bars
  const barReveal = clamp(seqLocal, 175, 215);
  const barLabels = ["Reason", "Act", "Observe"];
  const barW = [200, 160, 180];

  // "Cost is latency" label
  const costLabelOp = clamp(seqLocal, 215, 250);

  // ─── Phase 2: Fan-out (LLMCompiler DAG) ───────────────────────────────────
  const ph2Local = Math.max(0, frame - 300);

  // DAG: root → [B1, B2, B3] → merge
  const dagRootPop = pop(Math.max(0, frame - 320), fps);
  const dagBranchPop = (i: number) => pop(Math.max(0, frame - (350 + i * 25)), fps);
  const dagMergePop = pop(Math.max(0, frame - 460), fps);

  const rootArrow = (i: number) => clamp(frame, 335 + i * 20, 360 + i * 20);
  const mergeArrow = (i: number) => clamp(frame, 450 + i * 15, 480 + i * 15);

  // Active branch animation
  const branchActive = Math.floor(ph2Local / 45) % 3;
  const allDone = ph2Local > 200;

  // Stat reveal
  const stat36Op = clamp(frame, 470, 510);
  const stat67Op = clamp(frame, 510, 550);
  const constraintOp = clamp(frame, 520, 555);

  // ─── Phase 3: Event-driven ────────────────────────────────────────────────
  const ph3Local = Math.max(0, frame - 590);

  // Sleep → webhook fires → wakes → processes → sleeps
  // 0-60: sleeping
  // 60-100: webhook fires
  // 100-170: wakes + processes
  // 170-230: sleeps again
  // repeat

  const webhookCycle = ph3Local % 240;
  const isSleeping = webhookCycle < 60 || webhookCycle > 190;
  const webhookFiring = webhookCycle >= 55 && webhookCycle < 100;
  const isProcessing = webhookCycle >= 95 && webhookCycle < 175;

  const webhookPulse = webhookFiring ? 0.5 + 0.5 * Math.sin(ph3Local / 4) : 0;
  const processPulse = isProcessing ? 0.5 + 0.5 * Math.sin(ph3Local / 6) : 0;

  // Sleep zzz float
  const zzzOp = isSleeping ? 0.6 + 0.4 * Math.sin(ph3Local / 15) : 0;
  const sleepNodeScale = isSleeping ? 0.9 + 0.05 * Math.sin(ph3Local / 20) : 1;

  // Webhook badge pop in
  const webhookOp = clamp(frame, 590, 615);

  // "Token cost near-zero at idle"
  const costZeroOp = clamp(frame, 700, 740);

  // ─── Phase 4: Heuristic flowchart ─────────────────────────────────────────
  const hStep1 = clamp(frame, 848, 862);
  const hStep2 = clamp(frame, 862, 876);
  const hPunchPulse = 0.01 * Math.sin(frame / 18);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      {/* SFX cues */}
      <Sfx name="whoosh" at={20} volume={0.3} />
      <Sfx name="tick" at={75} volume={0.3} />
      <Sfx name="tick" at={130} volume={0.3} />
      <Sfx name="whoosh" at={300} volume={0.35} />
      <Sfx name="pop" at={350} volume={0.3} />
      <Sfx name="success" at={470} volume={0.4} />
      <Sfx name="whoosh" at={590} volume={0.35} />
      <Sfx name="alarm" at={660} volume={0.3} />
      <Sfx name="tick" at={710} volume={0.3} />
      <Sfx name="stinger" at={855} volume={0.4} />

      <CameraRig intensity={0.5} push={0.025}>
        <SceneHeading kicker="LOOP TOPOLOGY" accent={theme.accent} size={56}>
          Not all loops are{" "}
          <span style={gradientText(theme.accent, "#c7d2fe")}>linear</span>
        </SceneHeading>

        {/* ═══════════════════════════════════════════════════
            PHASE 1 — Sequential / ReAct
        ═══════════════════════════════════════════════════ */}
        {ph1Op > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: ph1Op }}>
            {/* Topology label */}
            <div
              style={{
                position: "absolute",
                top: 195,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: theme.fontMono,
                fontSize: 24,
                color: theme.textDim,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Sequential · ReAct
            </div>

            {/* Node positions: centered row */}
            {/* A at 480, B at 760, C at 1040 — all at y=480 */}
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
              {/* Arrow A→B */}
              {arrowAB > 0 && (
                <Arrow x1={540} y1={480} x2={700} y2={480} progress={arrowAB} color={theme.accent} />
              )}
              {/* Arrow B→C */}
              {arrowBC > 0 && (
                <Arrow x1={820} y1={480} x2={980} y2={480} progress={arrowBC} color={theme.accent} />
              )}

              {/* "loop back" dashed arrow under C→A */}
              {arrowBC > 0.8 && (
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                  <path
                    d="M 1040 540 C 1040 620, 480 620, 480 540"
                    fill="none"
                    stroke={theme.accent + "55"}
                    strokeWidth={2}
                    strokeDasharray="8 6"
                    opacity={arrowBC}
                  />
                  <text x={745} y={670} fill={theme.textDim} fontFamily={theme.fontMono} fontSize={22} textAnchor="middle">
                    repeat
                  </text>
                </svg>
              )}

              {/* Nodes */}
              <Node
                label="A"
                x={480}
                y={480}
                color={theme.accent}
                active={seqActive === 0 && seqLocal > 30}
                scale={interpolate(nodeA_pop, [0, 1], [0.6, 1])}
                opacity={nodeA_pop}
                size={110}
              />
              <Node
                label="B"
                x={760}
                y={480}
                color={theme.accent}
                active={seqActive === 1 && seqLocal > 75}
                scale={interpolate(nodeB_pop, [0, 1], [0.6, 1])}
                opacity={nodeB_pop}
                size={110}
              />
              <Node
                label="C"
                x={1040}
                y={480}
                color={theme.accent}
                active={seqActive === 2 && seqLocal > 130}
                scale={interpolate(nodeC_pop, [0, 1], [0.6, 1])}
                opacity={nodeC_pop}
                size={110}
              />

              {/* Node labels below */}
              {nodeA_pop > 0.3 && (
                <div style={{ position: "absolute", left: 420, top: 545, fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted, textAlign: "center", width: 120 }}>
                  Reason
                </div>
              )}
              {nodeB_pop > 0.3 && (
                <div style={{ position: "absolute", left: 700, top: 545, fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted, textAlign: "center", width: 120 }}>
                  Act
                </div>
              )}
              {nodeC_pop > 0.3 && (
                <div style={{ position: "absolute", left: 980, top: 545, fontFamily: theme.fontSans, fontSize: 24, color: theme.textMuted, textAlign: "center", width: 120 }}>
                  Observe
                </div>
              )}
            </div>

            {/* Latency bar chart */}
            {barReveal > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 120,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 28,
                  opacity: barReveal,
                }}
              >
                {barLabels.map((label, i) => {
                  const h = barW[i] * barReveal;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 64,
                          height: h,
                          borderRadius: "6px 6px 0 0",
                          background: `linear-gradient(180deg, ${theme.accent} 0%, ${theme.accent}66 100%)`,
                          boxShadow: `0 0 18px ${theme.accent}55`,
                        }}
                      />
                      <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>
                        {label}
                      </div>
                    </div>
                  );
                })}
                {/* Total bar */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 64,
                      height: 220 * barReveal,
                      borderRadius: "6px 6px 0 0",
                      background: `linear-gradient(180deg, ${theme.accentWarm} 0%, ${theme.accentWarm}66 100%)`,
                      boxShadow: `0 0 18px ${theme.accentWarm}55`,
                    }}
                  />
                  <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.accentWarm }}>
                    Total
                  </div>
                </div>
              </div>
            )}

            {/* "Cost is latency" punchline */}
            {costLabelOp > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 60,
                  width: "100%",
                  textAlign: "center",
                  opacity: costLabelOp,
                  fontFamily: theme.fontSans,
                  fontSize: 36,
                  color: theme.accentWarm,
                  fontWeight: 700,
                }}
              >
                Simple, debuggable —{" "}
                <span style={{ color: theme.accentRed }}>cost is latency.</span>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            PHASE 2 — Fan-out / LLMCompiler DAG
        ═══════════════════════════════════════════════════ */}
        {ph2Op > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: ph2Op }}>
            <div
              style={{
                position: "absolute",
                top: 195,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: theme.fontMono,
                fontSize: 24,
                color: theme.textDim,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Fan-out · LLMCompiler
            </div>

            {/* DAG positions:
                Root: 760, 370
                B1: 480, 570   B2: 760, 570   B3: 1040, 570
                Merge: 760, 760
            */}
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
              {/* Root → branch arrows */}
              {[{ x: 480, y: 570 }, { x: 760, y: 570 }, { x: 1040, y: 570 }].map((b, i) => (
                rootArrow(i) > 0 && (
                  <Arrow key={i} x1={760} y1={425} x2={b.x} y2={515} progress={rootArrow(i)} color={theme.accent} />
                )
              ))}

              {/* Branch → merge arrows */}
              {[{ x: 480, y: 570 }, { x: 760, y: 570 }, { x: 1040, y: 570 }].map((b, i) => (
                mergeArrow(i) > 0 && (
                  <Arrow key={i} x1={b.x} y1={625} x2={760} y2={705} progress={mergeArrow(i)} color={theme.accentGreen} />
                )
              ))}

              {/* Root node */}
              <Node
                label="ROOT"
                x={760}
                y={370}
                color={theme.accent}
                active={ph2Local < 50}
                scale={interpolate(dagRootPop, [0, 1], [0.6, 1])}
                opacity={dagRootPop}
                size={120}
              />

              {/* Branch nodes */}
              {[
                { label: "T1", x: 480, color: theme.accent },
                { label: "T2", x: 760, color: theme.accent },
                { label: "T3", x: 1040, color: theme.accent },
              ].map((b, i) => {
                const bp = dagBranchPop(i);
                return (
                  <Node
                    key={i}
                    label={b.label}
                    x={b.x}
                    y={570}
                    color={b.color}
                    active={allDone ? false : branchActive === i && ph2Local > 50}
                    scale={interpolate(bp, [0, 1], [0.6, 1])}
                    opacity={bp}
                    size={100}
                  />
                );
              })}

              {/* "parallel" label */}
              {dagBranchPop(2) > 0.5 && (
                <div
                  style={{
                    position: "absolute",
                    left: 440,
                    top: 500,
                    width: 640,
                    textAlign: "center",
                    fontFamily: theme.fontMono,
                    fontSize: 22,
                    color: theme.textDim,
                    letterSpacing: 2,
                  }}
                >
                  ◁ dispatched in parallel ▷
                </div>
              )}

              {/* Merge node */}
              <Node
                label="MERGE"
                x={760}
                y={760}
                color={theme.accentGreen}
                active={allDone}
                scale={interpolate(dagMergePop, [0, 1], [0.6, 1])}
                opacity={dagMergePop}
                size={120}
              />
            </div>

            {/* Stats */}
            {stat36Op > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 360,
                  right: 140,
                  opacity: stat36Op,
                  transform: `scale(${interpolate(stat36Op, [0, 1], [0.7, 1])})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "20px 32px",
                  borderRadius: 18,
                  background: `${theme.accentGreen}12`,
                  border: `2px solid ${theme.accentGreen}`,
                  boxShadow: `0 0 32px ${theme.accentGreen}44`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 80,
                    fontWeight: 900,
                    color: theme.accentGreen,
                    lineHeight: 1,
                  }}
                >
                  3.6×
                </div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>
                  latency reduction
                </div>
              </div>
            )}

            {stat67Op > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 560,
                  right: 140,
                  opacity: stat67Op,
                  transform: `scale(${interpolate(stat67Op, [0, 1], [0.7, 1])})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "20px 32px",
                  borderRadius: 18,
                  background: `${theme.accentGreen}12`,
                  border: `2px solid ${theme.accentGreen}`,
                  boxShadow: `0 0 32px ${theme.accentGreen}44`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontSans,
                    fontSize: 80,
                    fontWeight: 900,
                    color: theme.accentGreen,
                    lineHeight: 1,
                  }}
                >
                  6.7×
                </div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>
                  cost reduction
                </div>
              </div>
            )}

            {/* Constraint */}
            {constraintOp > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 60,
                  width: "100%",
                  textAlign: "center",
                  opacity: constraintOp,
                  fontFamily: theme.fontSans,
                  fontSize: 34,
                  color: theme.textMuted,
                }}
              >
                Constraint:{" "}
                <span style={{ color: theme.accentRed }}>no shared state mutations</span>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            PHASE 3 — Event-driven
        ═══════════════════════════════════════════════════ */}
        {ph3Op > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: ph3Op }}>
            <div
              style={{
                position: "absolute",
                top: 195,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: theme.fontMono,
                fontSize: 24,
                color: theme.textDim,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Event-Driven
            </div>

            {/* Central loop node */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, calc(-50% - 20px)) scale(${sleepNodeScale})`,
              }}
            >
              <ModelCore
                size={170}
                label={isSleeping ? "SLEEP" : isProcessing ? "PROC" : "WAKE"}
                pulse={isProcessing ? processPulse : isSleeping ? 0 : webhookPulse}
                fontSize={26}
              />
            </div>

            {/* ZZZ floating */}
            {zzzOp > 0.1 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "calc(50% - 155px)",
                  transform: `translateX(-50%) translateY(${-8 * Math.sin(ph3Local / 20)}px)`,
                  fontFamily: theme.fontMono,
                  fontSize: 44,
                  color: theme.textDim,
                  opacity: zzzOp,
                  letterSpacing: 8,
                }}
              >
                z z z
              </div>
            )}

            {/* Webhook badge pops in */}
            {webhookFiring && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "calc(50% + 140px)",
                  transform: `translateX(-50%) scale(${1 + 0.04 * Math.sin(ph3Local / 4)})`,
                  padding: "14px 32px",
                  borderRadius: 14,
                  background: `${theme.accentWarm}22`,
                  border: `2px solid ${theme.accentWarm}`,
                  boxShadow: `0 0 ${30 + 20 * webhookPulse}px ${theme.accentWarm}88`,
                  fontFamily: theme.fontMono,
                  fontSize: 30,
                  fontWeight: 800,
                  color: theme.accentWarm,
                  opacity: 0.85 + 0.15 * Math.sin(ph3Local / 4),
                }}
              >
                ⚡ WEBHOOK FIRED
              </div>
            )}

            {/* Signal types floating at sides */}
            <div
              style={{
                position: "absolute",
                left: 140,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: 18,
                opacity: webhookOp,
              }}
            >
              {["webhook", "file change", "queue msg"].map((sig, i) => {
                const sigOp = clamp(frame, 605 + i * 15, 630 + i * 15);
                return (
                  <div
                    key={i}
                    style={{
                      opacity: sigOp,
                      transform: `translateX(${(1 - sigOp) * -20}px)`,
                      padding: "10px 22px",
                      borderRadius: 10,
                      background: `${theme.accentWarm}15`,
                      border: `1.5px solid ${theme.accentWarm}55`,
                      fontFamily: theme.fontMono,
                      fontSize: 26,
                      color: theme.accentWarm,
                    }}
                  >
                    {sig}
                  </div>
                );
              })}
            </div>

            {/* Process state shown on right */}
            {isProcessing && (
              <div
                style={{
                  position: "absolute",
                  right: 140,
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "18px 28px",
                  borderRadius: 14,
                  background: `${theme.accentGreen}15`,
                  border: `2px solid ${theme.accentGreen}`,
                  boxShadow: `0 0 28px ${theme.accentGreen}66`,
                  fontFamily: theme.fontSans,
                  fontSize: 28,
                  fontWeight: 700,
                  color: theme.accentGreen,
                  opacity: 0.8 + 0.2 * processPulse,
                }}
              >
                Processing…
              </div>
            )}

            {/* Token cost label */}
            {costZeroOp > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 60,
                  width: "100%",
                  textAlign: "center",
                  opacity: costZeroOp,
                  fontFamily: theme.fontSans,
                  fontSize: 36,
                  color: theme.text,
                }}
              >
                Token cost:{" "}
                <span style={gradientText(theme.accentGreen, "#6ee7b7")}>
                  near-zero at idle
                </span>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            PHASE 4 — Heuristic punchline
        ═══════════════════════════════════════════════════ */}
        {ph4Op > 0.01 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: ph4Op,
              gap: 0,
            }}
          >
            {/* Flowchart heuristic */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                transform: `scale(${1 + hPunchPulse})`,
              }}
            >
              {/* Step 1 */}
              <div
                style={{
                  opacity: hStep1,
                  transform: `translateY(${(1 - hStep1) * 20}px)`,
                  padding: "22px 56px",
                  borderRadius: 16,
                  background: theme.surface,
                  border: `2px solid ${theme.border}`,
                  fontFamily: theme.fontSans,
                  fontSize: 38,
                  fontWeight: 700,
                  color: theme.text,
                  textAlign: "center",
                  marginBottom: 0,
                }}
              >
                Do you have a{" "}
                <span style={{ color: theme.accentWarm }}>measured latency problem</span>?
              </div>

              {/* Connector */}
              {hStep1 > 0.5 && (
                <div
                  style={{
                    width: 3,
                    height: 48,
                    background: `${theme.border}`,
                    opacity: hStep1,
                  }}
                />
              )}

              {/* Step 2 */}
              <div
                style={{
                  opacity: hStep2,
                  transform: `translateY(${(1 - hStep2) * 20}px)`,
                  display: "flex",
                  gap: 36,
                  marginTop: 0,
                }}
              >
                {/* NO branch */}
                <div
                  style={{
                    padding: "22px 44px",
                    borderRadius: 16,
                    background: `${theme.accentGreen}18`,
                    border: `2px solid ${theme.accentGreen}`,
                    boxShadow: `0 0 28px ${theme.accentGreen}44`,
                    fontFamily: theme.fontSans,
                    fontSize: 34,
                    fontWeight: 800,
                    color: theme.accentGreen,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 28, color: theme.textDim, marginBottom: 6 }}>NO</div>
                  Sequential
                  <div style={{ fontSize: 26, fontWeight: 400, color: theme.textMuted, marginTop: 6 }}>
                    (default)
                  </div>
                </div>
                {/* YES branch */}
                <div
                  style={{
                    padding: "22px 44px",
                    borderRadius: 16,
                    background: `${theme.accent}18`,
                    border: `2px solid ${theme.accent}`,
                    boxShadow: `0 0 28px ${theme.accent}44`,
                    fontFamily: theme.fontSans,
                    fontSize: 34,
                    fontWeight: 800,
                    color: theme.accent,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 28, color: theme.textDim, marginBottom: 6 }}>YES</div>
                  Fan-out
                  <div style={{ fontSize: 26, fontWeight: 400, color: theme.textMuted, marginTop: 6 }}>
                    if DAG-safe
                  </div>
                </div>
              </div>

              {/* Bottom tagline */}
              {hStep2 > 0.8 && (
                <div
                  style={{
                    marginTop: 52,
                    fontFamily: theme.fontSans,
                    fontSize: 42,
                    fontWeight: 800,
                    color: theme.text,
                    textAlign: "center",
                    opacity: clamp(frame, 880, 900),
                  }}
                >
                  Default to{" "}
                  <span style={gradientText(theme.accent, "#c7d2fe")}>sequential</span>
                  {" "}until you measure.
                </div>
              )}
            </div>
          </div>
        )}
      </CameraRig>
    </AbsoluteFill>
  );
};
