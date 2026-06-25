import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 8 — CTA (900 frames / 30s placeholder)
// Flow:
//   Phase 0  (0–90f)   : "Loop Engineering" branding title pops in
//   Phase 1  (60–270f) : t02 thumbnail card slides in — failure modes teaser
//   Phase 2  (260–480f): Multi-agent teaser line — kinetic text
//   Phase 3  (450–680f): Subscribe prompt + animated bell ring
//   Phase 4  (660–900f): "See you in the next one." closer, full-frame hold + drift

// ─── helpers ──────────────────────────────────────────────────────────────────

const pressDip = (frame: number, t: number) =>
  interpolate(frame, [t - 4, t, t + 8], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Fade a phase: in at [inStart, inEnd], out at [outStart, outEnd]
const fadeWindow = (
  frame: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) =>
  interpolate(
    frame,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

// ─── t02 failure-mode pill labels ─────────────────────────────────────────────
const FAILURE_MODES = [
  { label: "Context Blowup", color: theme.accentRed },
  { label: "Tool Sprawl", color: theme.accentWarm },
  { label: "Runaway Cost", color: "#f472b6" },
];

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── PHASE 0: heading ───────────────────────────────────────────────────────
  // Heading fades out at frame 240 so phase 1 card can breathe
  const headingOpacity = fadeWindow(frame, 0, fps * 0.6, fps * 7.5, fps * 8.5);

  // ── PHASE 1: t02 card ─────────────────────────────────────────────────────
  const cardDelay = fps * 2.0; // 60f
  const cardIn = pop(frame, fps, cardDelay, { damping: 12, stiffness: 150 });
  const cardOpacity = fadeWindow(frame, cardDelay, cardDelay + fps * 0.6, fps * 8.3, fps * 9.0);

  // Failure mode pills inside the card stagger in
  const pillDelays = FAILURE_MODES.map((_, i) => cardDelay + fps * 0.5 + i * fps * 0.3);

  // Pulse glow on the card
  const cardPulse = 0.5 + 0.5 * Math.sin(frame / 14);

  // ── PHASE 2: multi-agent teaser ────────────────────────────────────────────
  const teaserDelay = fps * 8.6; // ~8.6s
  const teaserOpacity = fadeWindow(frame, teaserDelay, teaserDelay + fps * 0.7, fps * 13.5, fps * 14.2);
  const teaserSlide = interpolate(
    Math.max(0, frame - teaserDelay),
    [0, fps * 0.7],
    [40, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
  );

  // The word "organizations" gets its own pop
  const orgPop = pop(frame, fps, teaserDelay + fps * 0.8, { damping: 10, stiffness: 180 });
  const orgScale = interpolate(orgPop, [0, 1], [0.7, 1]);

  // ── PHASE 3: subscribe prompt ──────────────────────────────────────────────
  const subPhaseDelay = fps * 13.8;
  const subPhaseOpacity = fadeWindow(frame, subPhaseDelay, subPhaseDelay + fps * 0.7, fps * 21.0, fps * 21.8);

  const subIn = pop(frame, fps, subPhaseDelay + fps * 0.3, { damping: 11 });

  // Bell ring after sub button appears
  const bellRingStart = subPhaseDelay + fps * 1.8;
  const bellPressed = frame > bellRingStart;
  const bellFill = interpolate(frame, [bellRingStart - 2, bellRingStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellWiggle = bellPressed
    ? Math.sin((frame - bellRingStart) / 1.4) *
      interpolate(frame, [bellRingStart, bellRingStart + fps * 1.6], [22, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Cursor sweeping to subscribe button
  const cursorVisible = frame > subPhaseDelay + fps * 0.6 && frame < subPhaseDelay + fps * 5.0;
  const cursorX = interpolate(
    frame,
    [subPhaseDelay + fps * 0.6, subPhaseDelay + fps * 1.6, subPhaseDelay + fps * 1.8],
    [1500, 960, 960],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
  );
  const cursorY = interpolate(
    frame,
    [subPhaseDelay + fps * 0.6, subPhaseDelay + fps * 1.6],
    [900, 710],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
  );
  const cursorDip = pressDip(frame, bellRingStart);

  // Sparks on bell click
  const sparkT = interpolate(frame, [bellRingStart, bellRingStart + fps * 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const SPARKS = Array.from({ length: 10 });

  // Subscribe button glow pulse (pre-click)
  const subGlowPulse = 0.5 + 0.5 * Math.sin(frame / 7);

  // ── PHASE 4: closer ────────────────────────────────────────────────────────
  const closerDelay = fps * 21.5;
  const closerOpacity = interpolate(frame, [closerDelay, closerDelay + fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const closerSlide = interpolate(
    Math.max(0, frame - closerDelay),
    [0, fps * 0.8],
    [30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
  );
  // Subtle "next one" pulse
  const closerPulse = 1 + 0.04 * Math.sin((frame - closerDelay) / 18);

  // Wordmark pop-in at phase 4
  const wordmarkIn = pop(frame, fps, closerDelay + fps * 0.5, { damping: 13 });
  const wordmarkOpacity = interpolate(frame, [closerDelay + fps * 0.3, closerDelay + fps * 1.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── build phase visibility guards ─────────────────────────────────────────
  // Phase 1 card is only visible while cardOpacity > 0
  // Phases don't overlap because each outFade starts before the next inFade

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />

      {/* ── SFX cues ─────────────────────────────────────────────────── */}
      {/* card whooshes in */}
      <Sfx name="whoosh" at={cardDelay} volume={0.35} />
      {/* bell tap / subscribe */}
      <Sfx name="success" at={bellRingStart} volume={0.45} />
      {/* brand stinger at closer */}
      <Sfx name="stinger" at={closerDelay + fps * 0.4} volume={0.4} />

      <CameraRig intensity={0.7} push={0.025}>

        {/* ══════════════════════════════════════════════════════════════
            PHASE 0 — Heading: "Loop Engineering"
            Fades out as card enters so they never collide
        ══════════════════════════════════════════════════════════════ */}
        <div style={{ opacity: headingOpacity }}>
          <SceneHeading
            kicker="T04"
            accent={theme.accent}
            delay={0}
            size={68}
          >
            <span style={gradientText(theme.accent, "#a5b4fc")}>Loop Engineering</span>
          </SceneHeading>
        </div>

        {/* Subtitle under heading — "that's a wrap" */}
        <div
          style={{
            position: "absolute",
            top: 230,
            width: "100%",
            textAlign: "center",
            opacity: headingOpacity * interpolate(frame, [fps * 0.5, fps * 1.2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontFamily: theme.fontSans,
            fontSize: 34,
            color: theme.textMuted,
            letterSpacing: 0.5,
          }}
        >
          That&apos;s loop engineering.
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PHASE 1 — t02 thumbnail card (failure modes)
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${0.6 + cardIn * 0.4}) translateY(${(1 - cardIn) * 60}px)`,
            opacity: cardOpacity,
            width: 900,
            borderRadius: 28,
            background: theme.surface,
            border: `2px solid ${theme.border}`,
            boxShadow: `0 0 ${50 + cardPulse * 40}px ${theme.accent}33, 0 30px 80px rgba(0,0,0,0.7)`,
            padding: "48px 64px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Card header — t02 label */}
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 22,
              color: theme.accent,
              letterSpacing: 3,
              textTransform: "uppercase" as const,
            }}
          >
            T02 — Agent Failures
          </div>

          {/* Card title */}
          <div
            style={{
              fontFamily: theme.fontSans,
              fontSize: 44,
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1.2,
            }}
          >
            The failure modes these
            <br />
            <span style={gradientText(theme.accentRed, theme.accentWarm)}>
              patterns protect against
            </span>
          </div>

          {/* Failure mode pills */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const, marginTop: 8 }}>
            {FAILURE_MODES.map((fm, i) => {
              const d = pillDelays[i];
              const pillIn = pop(frame, fps, d, { damping: 12 });
              const pillOp = interpolate(frame, [d, d + fps * 0.5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={fm.label}
                  style={{
                    opacity: pillOp,
                    transform: `scale(${0.7 + pillIn * 0.3}) translateY(${(1 - pillIn) * 20}px)`,
                    padding: "14px 28px",
                    borderRadius: 999,
                    background: `${fm.color}18`,
                    border: `2px solid ${fm.color}55`,
                    fontFamily: theme.fontMono,
                    fontSize: 26,
                    fontWeight: 700,
                    color: fm.color,
                    letterSpacing: 0.5,
                  }}
                >
                  {fm.label}
                </div>
              );
            })}
          </div>

          {/* CTA line inside card */}
          <div
            style={{
              fontFamily: theme.fontSans,
              fontSize: 28,
              color: theme.textMuted,
              opacity: interpolate(frame, [cardDelay + fps * 1.6, cardDelay + fps * 2.2], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              marginTop: 4,
            }}
          >
            Watch <span style={{ color: theme.accent, fontWeight: 700 }}>t02</span> — it covers all of that.
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PHASE 2 — Multi-agent teaser
            Slides in after card, fades before subscribe phase
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, calc(-50% + ${teaserSlide}px))`,
            opacity: teaserOpacity,
            width: 1400,
            textAlign: "center",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 26,
              color: theme.accent,
              letterSpacing: 4,
              textTransform: "uppercase" as const,
              marginBottom: 28,
              opacity: interpolate(frame, [teaserDelay, teaserDelay + fps * 0.5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Next Up
          </div>

          {/* Main teaser headline */}
          <div
            style={{
              fontFamily: theme.fontSans,
              fontSize: 72,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.15,
              letterSpacing: -1,
            }}
          >
            Multi-Agent{" "}
            <span style={gradientText(theme.accent, "#a5b4fc")}>Orchestration</span>
          </div>

          {/* Spoiler line — pops in slightly after */}
          <div
            style={{
              marginTop: 32,
              fontFamily: theme.fontSans,
              fontSize: 38,
              color: theme.textMuted,
              opacity: interpolate(frame, [teaserDelay + fps * 0.9, teaserDelay + fps * 1.5], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            They fail like{" "}
            <span
              style={{
                ...gradientText("#f472b6", theme.accentWarm),
                display: "inline-block",
                transform: `scale(${orgScale})`,
                transformOrigin: "center",
              }}
            >
              organizations
            </span>
            , not like programs.
          </div>

          {/* Spoiler badge */}
          <div
            style={{
              display: "inline-block",
              marginTop: 36,
              padding: "12px 32px",
              borderRadius: 999,
              background: `${theme.accentWarm}18`,
              border: `2px solid ${theme.accentWarm}44`,
              fontFamily: theme.fontMono,
              fontSize: 24,
              color: theme.accentWarm,
              letterSpacing: 2,
              opacity: interpolate(frame, [teaserDelay + fps * 1.2, teaserDelay + fps * 1.8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              // keep a subtle drift so it's never static
              transform: `translateY(${3 * Math.sin(frame / 22)}px)`,
            }}
          >
            SPOILER
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PHASE 3 — Subscribe prompt + animated bell
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: subPhaseOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
          }}
        >
          {/* Heading */}
          <div
            style={{
              fontFamily: theme.fontSans,
              fontSize: 56,
              fontWeight: 800,
              color: theme.text,
              textAlign: "center",
              opacity: interpolate(frame, [subPhaseDelay, subPhaseDelay + fps * 0.6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(
                Math.max(0, frame - subPhaseDelay),
                [0, fps * 0.6],
                [30, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }
              )}px)`,
            }}
          >
            Subscribe so you don&apos;t{" "}
            <span style={gradientText(theme.accentRed, theme.accentWarm)}>miss it.</span>
          </div>

          {/* Subscribe button */}
          <div
            style={{
              position: "relative",
              opacity: subIn,
              transform: `translateY(${(1 - subIn) * 40}px) scale(${1 - cursorDip * 0.07})`,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "28px 60px",
              borderRadius: 999,
              background: bellPressed
                ? "linear-gradient(160deg, #2a2a32, #1a1a20)"
                : "linear-gradient(160deg, #ef4444, #b91c1c)",
              border: `2px solid ${bellPressed ? theme.border : "#ef4444"}`,
              boxShadow: bellPressed
                ? "0 12px 40px rgba(0,0,0,0.6)"
                : `0 0 ${40 + subGlowPulse * 50}px #ef4444aa`,
            }}
          >
            {/* Bell emoji with wiggle */}
            <span
              style={{
                fontSize: 52,
                display: "inline-block",
                transform: `rotate(${bellWiggle}deg)`,
                transformOrigin: "top center",
              }}
            >
              🔔
            </span>
            <span
              style={{
                fontFamily: theme.fontSans,
                fontSize: 46,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              {bellPressed ? "Subscribed" : "Subscribe"}
            </span>
            {bellPressed && (
              <span
                style={{
                  fontSize: 40,
                  color: theme.accentGreen,
                  opacity: bellFill,
                }}
              >
                ✓
              </span>
            )}

            {/* Spark burst on bell click */}
            {sparkT > 0 && sparkT < 1 &&
              SPARKS.map((_, i) => {
                const ang = (i / SPARKS.length) * Math.PI * 2;
                const d = sparkT * 90;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 64,
                      top: 36,
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      background: theme.accent,
                      opacity: 1 - sparkT,
                      transform: `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d}px)`,
                    }}
                  />
                );
              })}
          </div>

          {/* "t07 drops soon" micro-tag — continuous drift */}
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 24,
              color: theme.textDim,
              letterSpacing: 2,
              opacity: interpolate(frame, [subPhaseDelay + fps * 1.0, subPhaseDelay + fps * 1.8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${2 * Math.sin(frame / 18)}px)`,
            }}
          >
            T07 — Multi-Agent Orchestration — coming soon
          </div>
        </div>

        {/* Cursor — visible only in subscribe phase */}
        {cursorVisible && (
          <div
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY,
              transform: `scale(${1 - cursorDip * 0.25})`,
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.7))",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 2 L4 19 L9 14.5 L12.5 22 L15.5 20.5 L12 13.5 L18.5 13 Z"
                fill="#ffffff"
                stroke="#0a0a0a"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            {cursorDip > 0.2 && (
              <div
                style={{
                  position: "absolute",
                  left: -12,
                  top: -12,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  border: `2px solid ${theme.accentWarm}`,
                  opacity: cursorDip,
                  transform: `scale(${1 + (1 - cursorDip) * 1.8})`,
                }}
              />
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PHASE 4 — Closer: "See you in the next one."
            Full-frame punchline — prior phase faded out first
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, calc(-50% + ${closerSlide}px))`,
            opacity: closerOpacity,
            width: 1500,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
          }}
        >
          {/* Main closer line — hero-sized, alone on screen */}
          <div
            style={{
              fontFamily: theme.fontSans,
              fontSize: 84,
              fontWeight: 900,
              color: theme.text,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              transform: `scale(${closerPulse})`,
            }}
          >
            See you in the{" "}
            <span style={gradientText(theme.accent, "#a5b4fc")}>next one.</span>
          </div>

          {/* Wordmark / channel ID */}
          <div
            style={{
              opacity: wordmarkOpacity,
              transform: `scale(${0.85 + wordmarkIn * 0.15}) translateY(${(1 - wordmarkIn) * 20}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: theme.fontSans,
                fontSize: 52,
                fontWeight: 800,
                color: theme.text,
                letterSpacing: 1,
              }}
            >
              Distilled<span style={gradientText("#fbbf24", theme.accentWarm)}> AI</span>
            </div>
            <div
              style={{
                fontFamily: theme.fontMono,
                fontSize: 28,
                color: theme.accentWarm,
                letterSpacing: 2,
              }}
            >
              @Distilled_AI_Studio
            </div>
          </div>

          {/* Pulsing accent bar */}
          <div
            style={{
              width: interpolate(frame, [closerDelay + fps * 1.0, closerDelay + fps * 2.0], [0, 500], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              height: 5,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${theme.accent}, #a5b4fc, ${theme.accentWarm})`,
              boxShadow: `0 0 24px ${theme.accent}aa`,
              opacity: wordmarkOpacity,
            }}
          />
        </div>

      </CameraRig>
    </AbsoluteFill>
  );
};
