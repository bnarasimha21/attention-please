import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";

// Scene 11 - Hooks: your code, not the AI's.
// A horizontal timeline with hook points firing in sequence. Hooks are solid,
// deterministic boxes (distinct from the glowing LLM) that snap in with a check.
// Caption: "Boring, reliable scaffolding wrapped around the smart model."

const GREEN = theme.accentGreen;

const HookBox: React.FC<{
  tag: string;
  action: string;
  appear: number;
}> = ({ tag, action, appear }) => {
  const scale = interpolate(appear, [0, 1], [0.55, 1]);
  const checkS = interpolate(appear, [0.45, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity: Math.min(1, appear * 1.5),
        transform: `scale(${scale})`,
        width: 300,
        // solid, deterministic - flat surface, square-ish, no glow halo
        background: "#0e1512",
        border: `2px solid ${GREEN}`,
        borderRadius: 12,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: `0 8px 24px rgba(0,0,0,0.45)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: theme.fontMono,
            fontSize: 26,
            fontWeight: 800,
            color: GREEN,
            letterSpacing: 0.5,
          }}
        >
          {tag}
        </span>
        {/* deterministic check snaps in */}
        <span
          style={{
            opacity: checkS,
            transform: `scale(${interpolate(checkS, [0, 1], [0.3, 1])})`,
            width: 34,
            height: 34,
            borderRadius: 8,
            background: GREEN,
            color: "#06281d",
            fontSize: 24,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.fontSans,
          }}
        >
          ✓
        </span>
      </div>
      <div style={{ height: 1, background: theme.border }} />
      <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>{action}</div>
    </div>
  );
};

export const Scene11Hooks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The loop timeline / rail draws in.
  const rail = interpolate(frame, [fps * 1.0, fps * 2.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  // Hook boxes fire in sequence.
  const h1 = pop(frame, fps, fps * 3.0, { damping: 12 });
  const h2 = pop(frame, fps, fps * 4.4, { damping: 12 });
  const h3 = pop(frame, fps, fps * 5.8, { damping: 12 });

  // Mono tag row PreToolUse / PostToolUse.
  const tagsOpacity = interpolate(frame, [fps * 7.5, fps * 8.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // A "pulse" that travels the rail to show the loop running.
  const dotT = (frame / (fps * 4)) % 1;
  const dotX = interpolate(dotT, [0, 1], [0, 100]);

  // Caption.
  const capS = pop(frame, fps, fps * 18.5, { damping: 13 });
  const capOpacity = interpolate(frame, [fps * 18.5, fps * 19.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={GREEN} />

      <CameraRig>
        <SceneHeading kicker="guardrails" accent={GREEN}>
          Hooks: <span style={gradientText("#a7f3d0", GREEN)}>your code</span>, not the AI's
        </SceneHeading>

        {/* Timeline stage */}
        <div style={{ position: "absolute", top: 210, left: 0, right: 0, bottom: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56 }}>
          {/* Rail with traveling pulse */}
          <div style={{ position: "relative", width: 1180, height: 10, display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "100%",
                height: 6,
                borderRadius: 3,
                transformOrigin: "left center",
                transform: `scaleX(${rail})`,
                background: `linear-gradient(90deg, ${GREEN}aa, ${GREEN}33)`,
                boxShadow: `0 0 14px ${GREEN}66`,
              }}
            />
            {/* arrowheads / loop hint */}
            <div style={{ position: "absolute", right: -4, opacity: rail, color: GREEN, fontSize: 28, fontFamily: theme.fontMono }}>↺</div>
            {/* traveling pulse dot */}
            <div
              style={{
                position: "absolute",
                left: `${dotX}%`,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: GREEN,
                boxShadow: `0 0 16px ${GREEN}`,
                opacity: rail,
                transform: "translateX(-50%)",
              }}
            />
          </div>

          {/* Hook boxes */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", justifyContent: "center", gap: 40 }}>
            <HookBox tag="PreToolUse" action="→ run linter" appear={h1} />
            <div style={{ display: "flex", alignItems: "center", color: theme.textDim, fontSize: 40, fontFamily: theme.fontMono, opacity: Math.min(h1, h2) }}>→</div>
            <HookBox tag="PostEdit" action="→ run tests" appear={h2} />
            <div style={{ display: "flex", alignItems: "center", color: theme.textDim, fontSize: 40, fontFamily: theme.fontMono, opacity: Math.min(h2, h3) }}>→</div>
            <HookBox tag="commit" action="→ block main" appear={h3} />
          </div>

          {/* mono tag legend */}
          <div style={{ display: "flex", flexDirection: "row", gap: 18, opacity: tagsOpacity }}>
            {["PreToolUse", "PostToolUse"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 22,
                  color: GREEN,
                  border: `1px solid ${GREEN}55`,
                  borderRadius: 8,
                  padding: "5px 14px",
                  background: "#0e1512",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: 175,
            width: "100%",
            textAlign: "center",
            opacity: capOpacity,
            transform: `translateY(${(1 - capS) * 20}px)`,
            fontFamily: theme.fontSans,
            fontSize: 38,
            color: theme.text,
          }}
        >
          <span style={{ color: GREEN }}>Boring, reliable</span> scaffolding wrapped around the smart model.
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
