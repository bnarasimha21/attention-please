import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText } from "../../../remotion-src/visuals";

// Scene 6 — Right info, right place, right time [1:12-1:26]
// A doc shelf on the left. A retrieval "arm" reaches out, grabs the EXACT
// needed doc, and pulls it into the context window on the right — just in time,
// instead of preloading everything.

const VIOLET = theme.tokenColors[5]; // #a78bfa

const SHELF = [
  { label: "invoices.csv", need: false },
  { label: "api_spec.md", need: true },
  { label: "old_chat.log", need: false },
  { label: "readme.txt", need: false },
  { label: "changelog", need: false },
];

export const Scene6JustInTime: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shelfOpacity = interpolate(frame, [fps * 1, fps * 1.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const winOpacity = interpolate(frame, [fps * 1.5, fps * 2.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // the needed doc highlights (3.5s), then travels into the window (5s-7.5s)
  const highlightT = interpolate(frame, [fps * 3.5, fps * 4.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const travel = interpolate(frame, [fps * 5, fps * 7.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const grabbed = frame > fps * 5;
  const landed = travel >= 1;

  // travelling doc path: from shelf (~ -560, +offset) to window center (~ +456)
  const docX = interpolate(travel, [0, 1], [-564, 456]);
  const docY = interpolate(travel, [0, 1], [-8, 0]);
  const docScale = interpolate(travel, [0, 0.5, 1], [1, 1.12, 0.95]);

  // "just-in-time" stamp lands when doc lands
  const stampS = spring({ frame: frame - fps * 7.5, fps, config: { damping: 12 } });
  const stampOpacity = interpolate(frame, [fps * 7.5, fps * 8.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 10.5, fps * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={VIOLET} />

      <SceneHeading kicker="just-in-time" accent={VIOLET}>
        Right info, right place,{" "}
        <span style={gradientText("#c4b5fd", VIOLET)}>right time</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
        <div style={{ position: "relative", width: 1560, height: 552, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Doc shelf */}
          <div style={{
            opacity: shelfOpacity, width: 432, borderRadius: 22, padding: 22,
            background: "linear-gradient(180deg, #121218, #0b0b0f)",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 16px 50px rgba(0,0,0,0.4)",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 2, color: theme.textDim, marginBottom: 2 }}>
              KNOWLEDGE BASE
            </div>
            {SHELF.map((d) => {
              const isPicked = d.need;
              const lit = isPicked ? highlightT : 0;
              const removed = isPicked && grabbed; // it has left the shelf
              return (
                <div key={d.label} style={{
                  opacity: removed ? interpolate(travel, [0, 0.25], [1, 0.18], { extrapolateRight: "clamp" }) : 1,
                  padding: "14px 19px", borderRadius: 12,
                  background: isPicked
                    ? `linear-gradient(160deg, ${VIOLET}${Math.round(lit * 40).toString(16).padStart(2, "0")}, rgba(0,0,0,0.2))`
                    : "linear-gradient(160deg, #17171f, #0e0e13)",
                  border: `1px solid ${isPicked ? VIOLET : theme.border}`,
                  boxShadow: isPicked ? `0 0 ${lit * 34}px ${VIOLET}66` : "none",
                  fontFamily: theme.fontMono, fontSize: 27,
                  color: isPicked ? "#ddd6fe" : theme.textMuted,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span>📄</span>{d.label}
                  {isPicked && lit > 0.5 && <span style={{ marginLeft: "auto", color: VIOLET, fontSize: 22 }}>needed →</span>}
                </div>
              );
            })}
          </div>

          {/* retrieval arm / path line */}
          {grabbed && !landed && (
            <div style={{
              position: "absolute", left: 432, top: "50%",
              width: interpolate(travel, [0, 1], [0, 672]), height: 2,
              background: `linear-gradient(90deg, ${VIOLET}, ${VIOLET}00)`,
              boxShadow: `0 0 12px ${VIOLET}`, transform: "translateY(-1px)",
            }} />
          )}

          {/* travelling doc */}
          {grabbed && (
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(calc(-50% + ${docX}px), calc(-50% + ${docY}px)) scale(${docScale})`,
              padding: "17px 26px", borderRadius: 14,
              background: `linear-gradient(160deg, ${VIOLET}, #7c3aed)`,
              border: `1px solid ${VIOLET}`,
              boxShadow: `0 0 30px ${VIOLET}, inset 0 1px 0 rgba(255,255,255,0.3)`,
              fontFamily: theme.fontMono, fontSize: 27, fontWeight: 700, color: theme.bg, whiteSpace: "nowrap",
            }}>
              📄 api_spec.md
            </div>
          )}

          {/* Context window */}
          <div style={{
            opacity: winOpacity, width: 504, height: 384, borderRadius: 24, padding: 22,
            background: `linear-gradient(180deg, ${VIOLET}0a, rgba(0,0,0,0.25))`,
            border: `2px solid ${landed ? VIOLET : theme.border}`,
            boxShadow: landed ? `0 0 40px ${VIOLET}33, inset 0 0 30px rgba(0,0,0,0.4)` : "inset 0 0 30px rgba(0,0,0,0.4)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 19,
          }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 2, color: theme.textDim }}>
              CONTEXT WINDOW
            </div>
            {landed ? (
              <>
                <div style={{
                  transform: `scale(${0.8 + stampS * 0.2})`, opacity: stampOpacity,
                  padding: "19px 29px", borderRadius: 14,
                  background: `linear-gradient(160deg, ${VIOLET}, #7c3aed)`,
                  boxShadow: `0 0 26px ${VIOLET}88`,
                  fontFamily: theme.fontMono, fontSize: 30, fontWeight: 800, color: theme.bg,
                }}>
                  📄 api_spec.md
                </div>
                <div style={{ opacity: stampOpacity, fontFamily: theme.fontSans, fontSize: 24, color: theme.accentGreen }}>
                  ✓ exactly what's needed — nothing else
                </div>
              </>
            ) : (
              <div style={{ fontFamily: theme.fontSans, fontSize: 27, color: theme.textDim }}>waiting…</div>
            )}
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 77, width: "100%", textAlign: "center",
        opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 41, color: theme.text,
      }}>
        A <span style={{ ...gradientText("#c4b5fd", VIOLET), fontWeight: 800 }}>clean</span> window beats a{" "}
        <span style={{ color: theme.textMuted }}>full</span> one.
      </div>
    </AbsoluteFill>
  );
};
