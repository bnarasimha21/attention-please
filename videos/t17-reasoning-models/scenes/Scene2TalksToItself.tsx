import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 2 — It talks to itself [0:13–0:27]
// Left: what the user sees ("Thinking…"). Right: the HIDDEN stream of reasoning
// tokens scrolling inside the model — an internal monologue, marked private.

const HIDDEN_LINES = [
  "let me parse the question first…",
  "two quantities given, find the third…",
  "I should convert minutes carefully…",
  "wait, is that AM or PM? assume AM…",
  "set up: start + duration = arrival…",
  "double-check the carry on the minutes…",
  "okay, that lines up — continue…",
];

export const Scene2TalksToItself: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const userOpacity = interpolate(frame, [fps * 1.2, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const panelSpring = pop(frame, fps, fps * 3, { damping: 12 });

  // hidden lines stream in one by one starting at 4s, ~1.5s apart so each is
  // readable before the next appears. Last line lands ~13.5s (holds ~8.5s).
  const lineStart = (i: number) => fps * 4 + i * fps * 1.5;

  const dots = (Math.floor(frame / 12) % 3) + 1;

  const lineOpacity = interpolate(frame, [fps * 16, fps * 17.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = pop(frame, fps, fps * 16, { damping: 12 });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.tokenColors[5]} />

      <CameraRig>
      <SceneHeading kicker="the reveal" accent={theme.tokenColors[5]}>
        It's secretly <span style={gradientText("#c4b5fd", theme.tokenColors[5])}>talking to itself</span>
      </SceneHeading>

      <div style={{ position: "absolute", top: 180, left: 0, right: 0, bottom: 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 84 }}>

        {/* LEFT — what the user sees */}
        <div style={{ opacity: userOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 27, color: theme.textMuted, letterSpacing: 1 }}>what you see</div>
          <ModelCore size={205} pulse={pulse} fontSize={34} />
          <div style={{
            padding: "14px 32px", borderRadius: 999,
            background: `${theme.accent}14`, border: `1px solid ${theme.accent}66`,
            fontFamily: theme.fontMono, fontSize: 30, color: theme.accent,
          }}>
            Thinking{".".repeat(dots)}<span style={{ opacity: 0 }}>{".".repeat(3 - dots)}</span>
          </div>
        </div>

        {/* arrow / curtain */}
        <div style={{ opacity: panelOpacity, fontFamily: theme.fontMono, fontSize: 40, color: theme.tokenColors[5] }}>⟶</div>

        {/* RIGHT — the hidden monologue */}
        <div style={{
          opacity: panelOpacity, transform: `translateX(${(1 - panelSpring) * 30}px)`,
          width: 880, height: 560, borderRadius: 22, padding: "26px 34px",
          background: "linear-gradient(180deg, #14101d 0%, #0c0a12 100%)",
          border: `1px solid ${theme.tokenColors[5]}55`,
          boxShadow: `0 0 60px ${theme.tokenColors[5]}22, inset 0 0 40px rgba(0,0,0,0.5)`,
          position: "relative", overflow: "hidden",
        }}>
          {/* private marker */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 27 }}>🙈</span>
            <span style={{ fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: theme.tokenColors[5] }}>
              hidden reasoning — never shown to you
            </span>
          </div>
          {HIDDEN_LINES.map((ln, i) => {
            const o = interpolate(frame, [lineStart(i), lineStart(i) + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sp = pop(frame, fps, lineStart(i), { damping: 12 });
            const x = (1 - sp) * -14;
            const sc = 0.8 + sp * 0.2;
            return (
              <div key={i} style={{
                opacity: o, transform: `translateX(${x}px) scale(${sc})`, transformOrigin: "left center",
                fontFamily: theme.fontMono, fontSize: 28, color: theme.text, lineHeight: 1.75,
              }}>
                <span style={{ color: theme.tokenColors[5] }}>›</span> {ln}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 70, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 40, color: theme.text,
      }}>
        A private <span style={{ ...gradientText("#c4b5fd", theme.tokenColors[5]), fontWeight: 800 }}>scratchpad of tokens</span>, written just for itself.
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
