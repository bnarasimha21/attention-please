import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 6 - Failure 4: Over-permission (the quiet, dangerous one).
// A "break -> fix" DEMONSTRATION:
//   1) NAIVE: the agent auto-approves everything; a destructive + exfil action
//      runs and SUCCEEDS -> on-screen catastrophe.
//   2) REPLAY WITH GUARDS: four staggered demos show the disaster NOT happening:
//      three-tier gate (destroy hits a wall), sandbox (contained), the lethal
//      trifecta (one leg severed -> exfil fails), and undo (plan->apply + rewind).
//   3) Punchline: contain the blast radius, break the trifecta, keep an undo.

const red = theme.accentRed;
const green = theme.accentGreen;
const amber = theme.accentWarm;

// Auto-approved action stream for the naive phase. The last three are lethal,
// but the naive harness rubber-stamps them just the same.
const ACTIONS = [
  { cmd: "read_file('config.yaml')", danger: false },
  { cmd: "edit_file('app.py')", danger: false },
  { cmd: "run_command('npm install')", danger: false },
  { cmd: "DROP TABLE users;", danger: true },
  { cmd: "rm -rf /", danger: true },
  { cmd: "POST /secrets → attacker.com", danger: true },
];

// Three permission tiers, used in the gate demo.
const LANES = [
  { tier: "READ-ONLY", req: "read_file()", color: green, outcome: "pass", verdict: "AUTO", icon: "✓" },
  { tier: "WRITE", req: "force_push", color: amber, outcome: "gate", verdict: "ASK HUMAN", icon: "👤" },
  { tier: "DESTRUCTIVE", req: "rm -rf /", color: red, outcome: "block", verdict: "BLOCKED", icon: "⛔" },
] as const;

// Lethal-trifecta circles: private data, untrusted content, exfiltration (cut).
const VENN = [
  { label: "private\ndata", c: theme.accent, left: 40, top: 20, sev: false },
  { label: "untrusted\ncontent", c: amber, left: 280, top: 20, sev: false },
  { label: "exfiltration", c: red, left: 160, top: 230, sev: true },
];

export const Scene6OverPermission: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // fade-in/hold/fade-out window helper (seconds in, frames out)
  const seg = (a: number, b: number, fade = 0.5) =>
    interpolate(frame, [fps * a, fps * (a + fade), fps * (b - fade), fps * b], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const introT = seg(0.6, 6.5);

  // ---- phase windows (seconds), timed to the s06 transcript ----
  const naive = seg(4.0, 31.5, 0.6); // auto-approve stream + catastrophe + replay (VO 0-28; "the fix is a three-tier model" @28-31)
  const g1 = seg(30.8, 78.2, 0.35);  // three-tier gate (VO: read 31-38, write 38-47, destroy 47-59, irreversible test 59-77)
  const bridge = seg(78.05, 86.0, 0.35); // "two more layers" beat (VO "tiers only decide… two more layers" 77.6-85.7)
  // Offset crosses: the incoming phase starts fading IN ~0.15s before the outgoing
  // finishes fading OUT, with 0.35s fades — so the overlap happens only at LOW
  // opacity (both ≤~0.4), no frame is empty, and the co-located captions never both
  // sit at full opacity (which is what read as a jumble).
  const g2 = seg(85.85, 106.4, 0.35); // sandbox ("sandbox it" @86; 84% @96-102)
  const g3 = seg(106.25, 135.4, 0.35); // trifecta ("lethal trifecta" @112; "break one leg" @126-135)
  const g4 = seg(135.25, 146.6, 0.35); // undo ("keep an undo, plan then apply" @135.6-147)
  const punchT = interpolate(frame, [fps * 146.45, fps * 147.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchPop = pop(frame, fps, fps * 146.45, { damping: 13, stiffness: 130 });

  // catastrophe overlay inside the naive phase (after the 3 lethal actions stream in)
  const boom = interpolate(frame, [fps * 24.5, fps * 25.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = boom > 0 && frame < fps * 31 ? Math.sin(frame / 1.3) * (1 - boom) * 10 : 0;
  const replayT = interpolate(frame, [fps * 28.0, fps * 29.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={red} />

      {/* ---- SFX cues (re-paced to the narration) ---- */}
      {ACTIONS.map((_, i) => (
        <Sfx key={`t${i}`} name="tick" at={fps * (5.2 + i * 3.2)} volume={0.3} />
      ))}
      <Sfx name="error" at={fps * 25.2} volume={0.55} />
      <Sfx name="whoosh" at={fps * 28.0} volume={0.4} />
      <Sfx name="block" at={fps * 50.5} volume={0.55} />
      <Sfx name="whoosh" at={fps * 85.5} volume={0.35} />
      <Sfx name="pop" at={fps * 96.0} volume={0.4} />
      <Sfx name="whoosh" at={fps * 106.0} volume={0.35} />
      <Sfx name="block" at={fps * 127.0} volume={0.55} />
      <Sfx name="whoosh" at={fps * 135.0} volume={0.35} />
      <Sfx name="success" at={fps * 140.0} volume={0.45} />
      <Sfx name="stinger" at={fps * 146.7} volume={0.45} />

      <CameraRig>
        {/* persistent heading */}
        <div style={{ zIndex: 40 }}>
          <SceneHeading kicker="failure 4" accent={red}>
            <span style={gradientText("#fca5a5", red)}>Over-permission</span>
          </SceneHeading>
        </div>

        {/* intro line */}
        <div
          style={{
            position: "absolute",
            top: 226,
            width: "100%",
            textAlign: "center",
            opacity: introT,
            fontFamily: theme.fontSans,
            fontSize: 33,
            color: theme.textMuted,
            zIndex: 30,
          }}
        >
          The most dangerous failure is the <span style={{ color: red, fontWeight: 700 }}>quiet</span> one.
        </div>

        {/* ============================ PHASE 1 — NAIVE CATASTROPHE ============================ */}
        <div style={{ position: "absolute", inset: 0, opacity: naive, transform: `translateX(${shake}px)` }}>
          {/* auto-approve banner */}
          <div
            style={{
              position: "absolute",
              top: 300,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: 1 - boom,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 34px",
                borderRadius: 999,
                background: `${green}14`,
                border: `1.5px solid ${green}66`,
                fontFamily: theme.fontMono,
                fontSize: 27,
                fontWeight: 700,
                color: green,
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: 7, background: green, boxShadow: `0 0 12px ${green}` }} />
              auto-approve: ON
            </div>
          </div>

          {/* action stream */}
          <div
            style={{
              position: "absolute",
              top: 372,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              opacity: 1 - boom,
            }}
          >
            {ACTIONS.map((a, i) => {
              const t0 = fps * (5.0 + i * 3.2);
              const op = interpolate(frame, [t0, t0 + fps * 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const stamp = interpolate(frame, [t0 + fps * 0.3, t0 + fps * 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div
                  key={i}
                  style={{
                    width: 1000,
                    opacity: op,
                    transform: `translateX(${(1 - op) * 20}px)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 30px",
                    borderRadius: 14,
                    background: a.danger ? `${red}12` : "rgba(20,20,26,0.7)",
                    border: `1px solid ${a.danger ? `${red}55` : theme.border}`,
                    fontFamily: theme.fontMono,
                    fontSize: 28,
                  }}
                >
                  <span style={{ color: a.danger ? red : theme.text }}>{a.cmd}</span>
                  <span style={{ opacity: stamp, color: green, fontSize: 23, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {"✓"} auto-approved
                  </span>
                </div>
              );
            })}
          </div>

          {/* catastrophe overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: boom,
              background: `radial-gradient(ellipse 85% 75% at 50% 50%, ${red}33 0%, rgba(7,3,3,0.97) 52%)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 25,
            }}
          >
            <div style={{ fontSize: 120, lineHeight: 1, transform: `scale(${0.8 + boom * 0.2})` }}>{"💥"}</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 58, fontWeight: 900, color: red, marginTop: 10, letterSpacing: -0.5, textShadow: `0 0 40px ${red}aa` }}>
              DATABASE DROPPED {"·"} DATA EXFILTRATED
            </div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.textMuted, marginTop: 18 }}>
              0 prompts {"·"} 0 guardrails {"·"} 1 disaster
            </div>
            {/* replay hint */}
            <div style={{ opacity: replayT, marginTop: 38, fontFamily: theme.fontMono, fontSize: 26, fontWeight: 700, color: theme.text }}>
              {"↺"} replay <span style={{ color: green }}>WITH guards</span>
            </div>
          </div>
        </div>

        {/* ============================ GUARD 1 — THREE-TIER GATE ============================ */}
        <GuardFrame opacity={g1} title="1 · The three-tier gate" titleColor={red}>
          <div style={{ display: "flex", flexDirection: "column", gap: 38, marginTop: 8 }}>
            {LANES.map((lane, i) => {
              const t0 = fps * (32.5 + i * 8.0);
              const p = interpolate(frame, [t0, t0 + fps * 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const TX0 = 320, TX1 = 800;
              let chipX = TX0, chipOp = 1, recoil = 0;
              if (lane.outcome === "pass") {
                chipX = interpolate(p, [0, 1], [TX0, TX1 + 120]);
                chipOp = interpolate(p, [0, 0.08, 0.85, 1], [0, 1, 1, 0]);
              } else if (lane.outcome === "gate") {
                chipX = interpolate(p, [0, 1], [TX0, TX0 + (TX1 - TX0) * 0.55]);
                chipOp = interpolate(p, [0, 0.08], [0, 1], { extrapolateRight: "clamp" });
              } else {
                chipX = interpolate(p, [0, 0.8, 0.9, 1], [TX0, TX1 - 14, TX1 - 40, TX1 - 28]);
                chipOp = interpolate(p, [0, 0.08], [0, 1], { extrapolateRight: "clamp" });
                recoil = p > 0.78 ? Math.sin((frame - t0) / 1.4) * (1 - p) * 22 : 0;
              }
              const arrived = p > 0.82;
              const wallFlash = lane.outcome === "block" && arrived ? 0.4 + 0.6 * Math.abs(Math.sin(frame / 7)) : 0.25;
              return (
                <div key={lane.tier} style={{ position: "relative", width: 1060, height: 70 }}>
                  <div style={{ position: "absolute", left: 0, top: 4, width: 270, padding: "13px 20px", borderRadius: 12, background: `${lane.color}1c`, border: `2px solid ${lane.color}66`, fontFamily: theme.fontSans, fontSize: 28, fontWeight: 800, color: lane.color }}>
                    {lane.tier}
                  </div>
                  <div style={{ position: "absolute", left: TX0, top: 34, width: TX1 - TX0, height: 5, borderRadius: 2, background: `linear-gradient(90deg, ${lane.color}22, ${lane.color}55)` }} />
                  {/* gate / wall */}
                  {lane.outcome === "block" ? (
                    <div style={{ position: "absolute", left: TX1, top: 6, width: 11, height: 60, borderRadius: 4, background: red, boxShadow: `0 0 ${16 + wallFlash * 38}px ${red}`, opacity: 0.9 }} />
                  ) : (
                    <div style={{ position: "absolute", left: TX1, top: 15, width: 5, height: 42, borderRadius: 2, background: `${lane.color}66` }} />
                  )}
                  {/* request chip */}
                  <div style={{ position: "absolute", left: chipX + recoil, top: 13, transform: "translateX(-50%)", opacity: chipOp, padding: "9px 18px", borderRadius: 999, background: "#15151c", border: `2px solid ${lane.color}`, boxShadow: `0 0 16px ${lane.color}88`, fontFamily: theme.fontMono, fontSize: 23, fontWeight: 700, color: theme.text, whiteSpace: "nowrap" }}>
                    {lane.req}
                  </div>
                  {/* verdict */}
                  <div style={{ position: "absolute", left: TX1 + 30, top: 11, opacity: arrived ? 1 : 0, display: "flex", alignItems: "center", gap: 9, padding: "9px 18px", borderRadius: 999, background: `${lane.color}1f`, border: `1.5px solid ${lane.color}`, fontFamily: theme.fontMono, fontSize: 23, fontWeight: 800, color: lane.color, whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 25 }}>{lane.icon}</span>{lane.verdict}
                  </div>
                </div>
              );
            })}
          </div>
          <Caption>Destructive calls hit a <span style={{ color: red, fontWeight: 800 }}>wall</span> — not your database.</Caption>
        </GuardFrame>

        {/* ============================ BRIDGE — "two more layers" (VO 77.6-85.7) ============================ */}
        <div
          style={{
            position: "absolute",
            top: 268,
            left: 0,
            right: 0,
            bottom: 182,
            opacity: bridge,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div style={{ fontFamily: theme.fontSans, fontSize: 34, fontWeight: 600, color: theme.textMuted, marginBottom: 24 }}>
            Tiers decide what's <span style={{ color: amber, fontWeight: 800 }}>allowed</span>.
          </div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 52, fontWeight: 800, color: theme.text, textAlign: "center", lineHeight: 1.25, padding: "0 100px", maxWidth: 1400 }}>
            Two more layers decide what happens when it{" "}
            <span style={gradientText("#fca5a5", red)}>slips through</span>.
          </div>
          <div style={{ display: "flex", gap: 30, marginTop: 48 }}>
            {[{ n: "①", t: "Sandbox" }, { n: "②", t: "Undo" }].map((c) => (
              <span
                key={c.t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 36px",
                  borderRadius: 999,
                  fontFamily: theme.fontMono,
                  fontSize: 30,
                  fontWeight: 700,
                  color: theme.textMuted,
                  background: "rgba(20,20,26,0.6)",
                  border: `1.5px solid ${theme.border}`,
                }}
              >
                <span style={{ color: green, fontSize: 32 }}>{c.n}</span>
                {c.t}
              </span>
            ))}
          </div>
        </div>

        {/* ============================ GUARD 2 — SANDBOX ============================ */}
        <GuardFrame opacity={g2} title="2 · Sandbox the agent" titleColor={red}>
          <div style={{ position: "relative", width: 820, height: 440, margin: "0 auto", borderRadius: 24, border: `2px dashed ${red}88`, background: "rgba(0,0,0,0.35)", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 20, left: 28, fontFamily: theme.fontMono, fontSize: 22, color: theme.textMuted, letterSpacing: 2 }}>SANDBOX</div>
            {/* walls */}
            <div style={{ position: "absolute", top: 84, left: 40, fontFamily: theme.fontMono, fontSize: 30, color: theme.text }}>{"🗂️"} ./workdir only</div>
            <div style={{ position: "absolute", top: 142, left: 40, fontFamily: theme.fontMono, fontSize: 30, color: theme.text }}>{"🌐"} approved domains only</div>
            {/* bouncing rogue command, contained */}
            {(() => {
              const k = frame - fps * 86.0;
              const bx = 420 + Math.sin(k / 9) * 250;
              const by = 280 + Math.cos(k / 7) * 110;
              const hitWall = Math.abs(Math.sin(k / 9)) > 0.95;
              return (
                <div style={{ position: "absolute", left: bx, top: by, transform: "translate(-50%,-50%)", padding: "12px 22px", borderRadius: 12, background: `${red}22`, border: `2px solid ${red}`, boxShadow: hitWall ? `0 0 30px ${red}` : `0 0 12px ${red}88`, fontFamily: theme.fontMono, fontSize: 26, fontWeight: 700, color: red }}>
                  rm -rf /
                </div>
              );
            })()}
          </div>
          <div style={{ marginTop: 26, textAlign: "center" }}>
            <span style={{ fontFamily: theme.fontSans, fontSize: 36, fontWeight: 800, color: green }}>{"≈"} 84% fewer prompts</span>
            <span style={{ fontFamily: theme.fontMono, fontSize: 23, color: theme.textDim, marginLeft: 16, fontStyle: "italic" }}>Anthropic internal</span>
          </div>
          <Caption>Even an allowed action <span style={{ color: green, fontWeight: 800 }}>can't escape the box.</span></Caption>
        </GuardFrame>

        {/* ============================ GUARD 3 — LETHAL TRIFECTA ============================ */}
        <GuardFrame opacity={g3} title="3 · The lethal trifecta" titleColor={red} subtitle="— Simon Willison">
          {(() => {
            const flash = interpolate(frame, [fps * 115.5, fps * 117.0, fps * 118.0], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sever = interpolate(frame, [fps * 127.0, fps * 130.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <>
                <div style={{ position: "relative", width: 560, height: 500, margin: "0 auto" }}>
                  {/* center game-over glow */}
                  <div style={{ position: "absolute", left: 290, top: 220, width: 116, height: 116, borderRadius: "50%", transform: "translate(-50%,-50%)", background: red, opacity: flash * (1 - sever) * 0.9, boxShadow: `0 0 ${44 + flash * 60}px ${red}` }} />
                  {VENN.map((v, i) => {
                    const cut = v.sev ? sever : 0;
                    return (
                      <div key={i} style={{ position: "absolute", left: v.left, top: v.top, width: 260, height: 260, borderRadius: "50%", border: `3px solid ${v.c}`, background: `${v.c}22`, mixBlendMode: "screen", transform: `translate(${cut * 260}px, ${cut * -70}px)`, opacity: 1 - cut * 0.85 }} />
                    );
                  })}
                  {VENN.map((v, i) => {
                    const cut = v.sev ? sever : 0;
                    return (
                      <div key={`l${i}`} style={{ position: "absolute", left: v.left + 130, top: v.top + 130, width: 200, transform: `translate(calc(-50% + ${cut * 260}px), calc(-50% + ${cut * -70}px))`, textAlign: "center", whiteSpace: "pre-line", fontFamily: theme.fontMono, fontSize: 26, fontWeight: 700, color: v.c, opacity: 1 - cut * 0.85, lineHeight: 1.2 }}>{v.label}</div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 18, textAlign: "center", fontFamily: theme.fontSans, fontSize: 32, fontWeight: 700, color: theme.text }}>
                  All three <span style={{ color: red }}>{"→"} game over.</span>{" "}
                  <span style={{ color: green, opacity: sever }}>Exfil cut {"→"} safe.</span>
                </div>
              </>
            );
          })()}
          <Caption>Break <span style={{ color: green, fontWeight: 800 }}>one leg</span> and the hijack falls apart.</Caption>
        </GuardFrame>

        {/* ============================ GUARD 4 — KEEP AN UNDO ============================ */}
        <GuardFrame opacity={g4} title="4 · Keep an undo" titleColor={green}>
          <div style={{ width: 780, margin: "0 auto", padding: "30px 36px", borderRadius: 18, border: `1px solid ${theme.border}`, background: "rgba(0,0,0,0.4)", fontFamily: theme.fontMono, fontSize: 30, textAlign: "left", lineHeight: 1.7 }}>
            <div style={{ color: green }}>+ apply reviewed change</div>
            <div style={{ color: red }}>- blocked: bad write</div>
            <div style={{ color: theme.textMuted, fontSize: 23, marginTop: 10 }}># plan {"→"} apply (like Terraform)</div>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 30, justifyContent: "center" }}>
            {["/rewind", "git commit"].map((c) => (
              <span key={c} style={{ padding: "12px 26px", borderRadius: 999, fontFamily: theme.fontMono, fontSize: 26, fontWeight: 700, color: green, background: `${green}1c`, border: `1.5px solid ${green}66` }}>{c}</span>
            ))}
          </div>
          <Caption>A bad write is <span style={{ color: green, fontWeight: 800 }}>one command from gone.</span></Caption>
        </GuardFrame>

        {/* ============================ PUNCHLINE ============================ */}
        <div
          style={{
            position: "absolute",
            bottom: 205,
            width: "100%",
            textAlign: "center",
            opacity: punchT,
            transform: `translateY(${(1 - punchPop) * 18}px)`,
            fontFamily: theme.fontSans,
            fontSize: 38,
            fontWeight: 800,
            color: theme.text,
            zIndex: 40,
            padding: "0 120px",
          }}
        >
          <span style={{ color: red }}>Contain the blast radius.</span>{" "}
          <span style={{ color: amber }}>Break the trifecta.</span>{" "}
          <span style={{ color: green }}>Keep an undo.</span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};

// A centered frame for each guard demo: title + content + caption.
const GuardFrame: React.FC<{
  opacity: number;
  title: string;
  titleColor: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ opacity, title, titleColor, subtitle, children }) => (
  <div
    style={{
      position: "absolute",
      top: 268,
      left: 0,
      right: 0,
      bottom: 182,
      opacity,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20,
    }}
  >
    <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 26 }}>
      <span style={{ fontFamily: theme.fontSans, fontSize: 46, fontWeight: 800, color: titleColor, letterSpacing: -0.3 }}>{title}</span>
      {subtitle && <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>{subtitle}</span>}
    </div>
    {children}
  </div>
);

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginTop: 40, textAlign: "center", fontFamily: theme.fontSans, fontSize: 33, fontWeight: 600, color: theme.textMuted, padding: "0 80px" }}>
    {children}
  </div>
);
