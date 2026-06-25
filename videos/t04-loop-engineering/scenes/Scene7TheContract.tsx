import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";
import React from "react";

const TOTAL_FRAMES = 900;

// Timeline (frames at 30fps)
const HEADING_IN = 0;
const CLAUSE1_IN = 60;
const CLAUSE2_IN = 210;
const CLAUSE3_IN = 360;
const PANELS_FADE_OUT = 520;
const PUNCHLINE_IN = 570;

const clauseData = [
  {
    icon: "⊕",
    title: "Clause 1: Exit Criteria",
    color: theme.accentGreen,
    bullets: [
      "Binary, deterministic, ungameable goal signal",
      "Hard iteration cap + synchronous token budget",
      "No-progress detection as safety net",
    ],
  },
  {
    icon: "⊙",
    title: "Clause 2: State Durability",
    color: theme.accent,
    bullets: [
      "Objective written to durable storage before run",
      "Progress checkpointed at every meaningful step",
      "Tool calls idempotent",
    ],
  },
  {
    icon: "⊞",
    title: "Clause 3: Topology",
    color: theme.accentWarm,
    bullets: [
      "Sequential for dependent steps",
      "Fan-out for parallelizable sub-tasks",
      "Event-driven for reactive workloads",
    ],
  },
];

function ClausePanel({
  clause,
  frame,
  fps,
  enterFrame,
  fadeOutFrame,
}: {
  clause: (typeof clauseData)[number];
  frame: number;
  fps: number;
  enterFrame: number;
  fadeOutFrame: number;
}) {
  const localFrame = Math.max(0, frame - enterFrame);
  const panelSpring = pop(localFrame, fps, 0, { damping: 14, stiffness: 120 });

  const opacity = interpolate(
    frame,
    [enterFrame - 5, enterFrame + 10, fadeOutFrame, fadeOutFrame + 18],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `scale(${0.85 + panelSpring * 0.15}) translateY(${(1 - panelSpring) * 30}px)`,
        background: "linear-gradient(135deg, #111111 0%, #0f1a14 100%)",
        border: `1.5px solid ${clause.color}44`,
        borderRadius: 20,
        padding: "28px 32px",
        boxShadow: `0 0 40px ${clause.color}22, 0 8px 32px #00000066`,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        minWidth: 0,
      }}
    >
      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            fontSize: 36,
            color: clause.color,
            width: 52,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${clause.color}18`,
            borderRadius: 12,
            border: `1px solid ${clause.color}33`,
            flexShrink: 0,
          }}
        >
          {clause.icon}
        </div>
        <div
          style={{
            fontSize: 26,
            fontFamily: theme.fontSans,
            fontWeight: 700,
            color: clause.color,
            lineHeight: 1.2,
          }}
        >
          {clause.title}
        </div>
      </div>

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {clause.bullets.map((bullet, i) => {
          const bulletDelay = 8 + i * 10;
          const bulletFrame = Math.max(0, localFrame - bulletDelay);
          const bulletOpacity = interpolate(bulletFrame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const bulletX = interpolate(bulletFrame, [0, 12], [-16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                opacity: bulletOpacity,
                transform: `translateX(${bulletX}px)`,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: clause.color,
                  flexShrink: 0,
                  marginTop: 9,
                  boxShadow: `0 0 8px ${clause.color}`,
                }}
              />
              <div
                style={{
                  fontSize: 22,
                  fontFamily: theme.fontSans,
                  color: theme.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {bullet}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Scene7TheContract: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heading entrance
  const headingOpacity = interpolate(frame, [HEADING_IN, HEADING_IN + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headingFade = interpolate(
    frame,
    [PANELS_FADE_OUT - 20, PANELS_FADE_OUT],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const headingFinal = headingOpacity * headingFade;

  // Panels area opacity (for sequential panel show)
  const panelsOpacity = interpolate(
    frame,
    [PANELS_FADE_OUT, PANELS_FADE_OUT + 25],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Punchline
  const punchlineLocal = Math.max(0, frame - PUNCHLINE_IN);
  const punchlineSpring = pop(punchlineLocal, fps, 0, { damping: 18, stiffness: 100 });
  const punchlineOpacity = interpolate(frame, [PUNCHLINE_IN, PUNCHLINE_IN + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Punchline subtle pulse after it appears
  const pulseFrame = Math.max(0, frame - (PUNCHLINE_IN + 40));
  const pulse = interpolate(
    (Math.sin((pulseFrame / fps) * Math.PI * 0.5) + 1) / 2,
    [0, 1],
    [0.97, 1.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Second line of punchline
  const punchline2Local = Math.max(0, frame - (PUNCHLINE_IN + 30));
  const punchline2Spring = pop(punchline2Local, fps, 0, { damping: 18, stiffness: 100 });
  const punchline2Opacity = interpolate(
    frame,
    [PUNCHLINE_IN + 30, PUNCHLINE_IN + 50],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ambient glow drift for punchline
  const glowDrift = Math.sin((frame / fps) * 0.4 * Math.PI) * 12;

  // Contract label reveal
  const contractLabelOpacity = interpolate(frame, [HEADING_IN + 10, HEADING_IN + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contractLabelFade = interpolate(
    frame,
    [PANELS_FADE_OUT - 20, PANELS_FADE_OUT],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const children: React.ReactNode[] = [];

  children.push(<SceneBackground key="bg" />);

  // Sfx cues
  children.push(<Sfx key="sfx-clause1" name="pop" at={CLAUSE1_IN} volume={0.45} />);
  children.push(<Sfx key="sfx-clause2" name="pop" at={CLAUSE2_IN} volume={0.45} />);
  children.push(<Sfx key="sfx-clause3" name="pop" at={CLAUSE3_IN} volume={0.45} />);
  children.push(<Sfx key="sfx-punchline" name="stinger" at={PUNCHLINE_IN} volume={0.55} />);

  // ---- Heading area ----
  children.push(
    <div
      key="heading-area"
      style={{
        position: "absolute",
        top: 36,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: headingFinal,
      }}
    >
      <SceneHeading
        kicker="Loop Engineering"
        accent={theme.accentGreen}
        delay={0}
        size="md"
      >
        The Contract
      </SceneHeading>
      <div
        style={{
          opacity: contractLabelOpacity * contractLabelFade,
          fontSize: 22,
          fontFamily: theme.fontMono,
          color: theme.textDim,
          letterSpacing: "0.12em",
          marginTop: 2,
        }}
      >
        {"// Three clauses. Non-negotiable."}
      </div>
    </div>
  );

  // ---- Three Clause Panels ----
  children.push(
    <div
      key="panels"
      style={{
        position: "absolute",
        top: 180,
        left: 64,
        right: 64,
        display: "flex",
        flexDirection: "row",
        gap: 28,
        opacity: panelsOpacity,
        alignItems: "stretch",
        bottom: 180,
      }}
    >
      {clauseData.map((clause, i) => {
        const enterFrames = [CLAUSE1_IN, CLAUSE2_IN, CLAUSE3_IN];
        return (
          <ClausePanel
            key={i}
            clause={clause}
            frame={frame}
            fps={fps}
            enterFrame={enterFrames[i]}
            fadeOutFrame={PANELS_FADE_OUT}
          />
        );
      })}
    </div>
  );

  // ---- Punchline ----
  children.push(
    <div
      key="punchline"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: punchlineOpacity,
        paddingBottom: 180,
      }}
    >
      {/* Glow behind punchline */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${theme.accentGreen}22 0%, transparent 70%)`,
          transform: `translateY(${glowDrift}px)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          transform: `scale(${0.7 + punchlineSpring * 0.3 * pulse})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          textAlign: "center",
          maxWidth: 1200,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontFamily: theme.fontSans,
            fontWeight: 800,
            color: theme.text,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          The code is{" "}
          <span style={gradientText(theme.accentGreen, theme.accent)}>
            six lines.
          </span>
        </div>

        <div
          style={{
            transform: `scale(${0.7 + punchline2Spring * 0.3})`,
            opacity: punchline2Opacity,
            fontSize: 72,
            fontFamily: theme.fontSans,
            fontWeight: 800,
            color: theme.text,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          The engineering is{" "}
          <span style={gradientText(theme.accentGreen, theme.accentWarm)}>
            the contract.
          </span>
        </div>

        {/* Subtitle line */}
        <div
          style={{
            opacity: interpolate(
              frame,
              [PUNCHLINE_IN + 60, PUNCHLINE_IN + 80],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            fontSize: 26,
            fontFamily: theme.fontMono,
            color: theme.accentGreen,
            letterSpacing: "0.1em",
            marginTop: 16,
            borderTop: `1px solid ${theme.accentGreen}44`,
            paddingTop: 18,
            width: "100%",
            textAlign: "center",
          }}
        >
          Exit Criteria · State Durability · Topology
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <CameraRig>
        <AbsoluteFill>{children}</AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};
