import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, ModelCore } from "../../../remotion-src/visuals";

// Scene 9 — Spin off a <subagent>
// MAIN ModelCore (left) buds off a SUB ModelCore (right) with its OWN fresh
// window. The SUB window fills with MESSY work chips while MAIN stays clean;
// only one clean "→ 3 findings" summary chip crosses back. Then 3 SUB orbs
// run in parallel. ~28s @ 30fps = 840 frames. Glow: violet (tokenColors[5]).

const VIOLET = theme.tokenColors[5]; // #a78bfa

const MESSY = [
  { label: "read · 2,148 lines", color: theme.tokenColors[4] },
  { label: "search · 38 hits", color: theme.tokenColors[3] },
  { label: "grep · 126 matches", color: theme.tokenColors[1] },
  { label: "read · 904 lines", color: theme.tokenColors[2] },
];

export const Scene9Subagents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // MAIN appears first, then buds off SUB ~3s
  const mainPop = pop(frame, fps, fps * 1, { damping: 12 });
  const mainScale = interpolate(mainPop, [0, 1], [0.6, 1]);

  const budT = interpolate(frame, [fps * 3, fps * 4.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subPop = pop(frame, fps, fps * 3.2, { damping: 11 });
  const subScale = interpolate(subPop, [0, 1], [0.3, 1]);

  // SUB window fills with messy chips 5.5s..13s
  const subFilled = Math.floor(
    interpolate(frame, [fps * 5.5, fps * 13], [0, MESSY.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  // summary chip crosses back to MAIN 13.5s..16s
  const crossT = interpolate(frame, [fps * 13.5, fps * 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crossPop = pop(frame, fps, fps * 13.5, { damping: 12 });

  // single clean findings chip landed in MAIN
  const landed = crossT > 0.95;

  // parallel-orbs phase 18s..24s
  const parT = interpolate(frame, [fps * 18, fps * 19.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showParallel = frame > fps * 17.5;

  const lineOpacity = interpolate(frame, [fps * 24.5, fps * 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // The summary chip travels from SUB window (right) toward MAIN window (left).
  const crossX = interpolate(crossPop, [0, 1], [0, -560]);

  const Window: React.FC<{ title: string; clean: boolean; chips: { label: string; color: string }[]; emptyN: number; titleColor: string }> = ({ title, clean, chips, emptyN, titleColor }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: titleColor }}>{title}</div>
      <div style={{
        width: 540, height: 300, borderRadius: 20, padding: 16,
        background: "linear-gradient(180deg, #131318 0%, #0c0c10 100%)",
        border: `2px solid ${clean ? theme.border : VIOLET + "66"}`,
        boxShadow: clean
          ? "inset 0 0 26px rgba(0,0,0,0.6), 0 14px 40px rgba(0,0,0,0.4)"
          : `inset 0 0 26px rgba(0,0,0,0.6), 0 0 30px ${VIOLET}33`,
        display: "flex", flexDirection: "column", gap: 10, overflow: "hidden",
      }}>
        {chips.map((c, i) => {
          const cp = pop(frame, fps, fps * 5.5 + i * ((fps * 7.5) / MESSY.length), { damping: 10 });
          return (
            <div key={i} style={{
              borderRadius: 11, padding: "12px 18px",
              background: `linear-gradient(160deg, ${c.color}, ${c.color}cc)`,
              boxShadow: `0 0 14px ${c.color}55, inset 0 1px 0 rgba(255,255,255,0.22)`,
              fontFamily: theme.fontMono, fontSize: 26, fontWeight: 700, color: theme.bg,
              transform: `scale(${interpolate(cp, [0, 1], [0.6, 1])})`, opacity: cp,
            }}>{c.label}</div>
          );
        })}
        {Array.from({ length: Math.max(0, emptyN) }).map((_, i) => (
          <div key={`e${i}`} style={{ flex: 1, minHeight: 40, borderRadius: 9, border: `1px dashed ${theme.border}` }} />
        ))}
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <SceneBackground glow={VIOLET} />

      <CameraRig style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <SceneHeading kicker="scaling" accent={VIOLET}>
          Spin off a <span style={gradientText("#c4b5fd", VIOLET)}>&lt;subagent&gt;</span>
        </SceneHeading>

        {!showParallel ? (
          // MAIN | SUB side-by-side
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 90, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70 }}>
            {/* MAIN side: core + clean window */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, transform: `scale(${mainScale})` }}>
              <ModelCore size={140} label="MAIN" fontSize={28} pulse={0.3} />
              <Window
                title="main context — clean"
                clean
                titleColor={theme.textMuted}
                chips={landed ? [{ label: "→ 3 findings", color: theme.accentGreen }] : []}
                emptyN={landed ? 3 : 4}
              />
            </div>

            {/* bud connector */}
            <div style={{
              width: interpolate(budT, [0, 1], [0, 70]), height: 4, borderRadius: 2,
              background: `linear-gradient(90deg, ${theme.accent}, ${VIOLET})`,
              boxShadow: `0 0 14px ${VIOLET}`, opacity: budT,
            }} />

            {/* SUB side: core + messy window */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: budT, transform: `scale(${subScale})` }}>
              <ModelCore size={140} label="SUB" fontSize={30} pulse={0.5} />
              <Window
                title="sub context — its own"
                clean={false}
                titleColor={VIOLET}
                chips={MESSY.slice(0, subFilled)}
                emptyN={MESSY.length - subFilled}
              />
            </div>

            {/* the single clean summary chip crossing back to MAIN */}
            {crossT > 0 && crossT < 1 && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: `translate(${crossX}px, 70px) scale(${interpolate(crossPop, [0, 1], [0.4, 1])})`,
                borderRadius: 11, padding: "12px 20px",
                background: `linear-gradient(160deg, ${theme.accentGreen}, ${theme.accentGreen}cc)`,
                boxShadow: `0 0 22px ${theme.accentGreen}88, inset 0 1px 0 rgba(255,255,255,0.25)`,
                fontFamily: theme.fontMono, fontSize: 26, fontWeight: 800, color: theme.bg,
              }}>→ 3 findings</div>
            )}
          </div>
        ) : (
          // 3 SUB orbs in parallel feeding one MAIN
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50, opacity: parT }}>
            <ModelCore size={150} label="MAIN" fontSize={30} pulse={0.3} />
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 90 }}>
              {[0, 1, 2].map((i) => {
                const op = pop(frame, fps, fps * 18.5 + i * (fps * 0.4), { damping: 11 });
                const bob = Math.sin(frame / 22 + i * 2) * 8;
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, transform: `translateY(${bob}px) scale(${interpolate(op, [0, 1], [0.3, 1])})`, opacity: op }}>
                    <ModelCore size={130} label={`SUB ${i + 1}`} fontSize={24} pulse={0.5} />
                    <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.accentGreen }}>→ findings</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted }}>
              three explorations, one clean main thread
            </div>
          </div>
        )}

        <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 38, color: theme.text }}>
          Noise <span style={{ color: VIOLET }}>quarantined.</span> The main thread stays <span style={{ color: theme.accentGreen }}>sharp.</span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
