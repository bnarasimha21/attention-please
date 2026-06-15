import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { theme } from "./theme";

// Premium "ease-out-expo"-ish curve — fast start, soft settle. Used for
// entrances so text/elements glide in instead of snapping or fading linearly.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Shared visual building blocks — gives every scene depth and a consistent,
// premium look. Reused across all "Attention Please" videos.

/**
 * Layered scene background: a soft radial glow tinted toward `glow`, a faint
 * dot grid that fades at the edges, and a vignette. Replaces flat black.
 */
export const SceneBackground: React.FC<{ glow?: string }> = ({ glow = theme.accent }) => {
  const frame = useCurrentFrame();
  // very slow breathing on the glow so static holds still feel alive
  const breathe = 0.85 + 0.15 * Math.sin(frame / 40);
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 42%, ${glow}1f 0%, ${glow}08 35%, ${theme.bg} 68%)`,
          opacity: breathe,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${theme.border} 1.2px, transparent 1.2px)`,
          backgroundSize: "44px 44px",
          opacity: 0.4,
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at center, black 25%, transparent 78%)",
          maskImage: "radial-gradient(ellipse 70% 70% at center, black 25%, transparent 78%)",
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 360px 40px rgba(0,0,0,0.85)" }} />
    </AbsoluteFill>
  );
};

/** Gradient-fill text style (use on a keyword span). */
export const gradientText = (from: string, to: string) => ({
  backgroundImage: `linear-gradient(95deg, ${from}, ${to})`,
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  WebkitTextFillColor: "transparent",
  color: "transparent",
});

/**
 * Polished scene heading with an uppercase accent "eyebrow" kicker above the
 * title. Animates up + in. Pass the title as children (style keywords with
 * <span style={gradientText(...)}> for pop).
 */
export const SceneHeading: React.FC<{
  kicker?: string;
  accent?: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ kicker, accent = theme.accent, children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame - delay, [0, fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const blur = interpolate(t, [0, 1], [10, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        width: "100%",
        textAlign: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * 22}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      {kicker && (
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 25,
            letterSpacing: 7,
            textTransform: "uppercase",
            color: accent,
            marginBottom: 16,
            opacity: 0.9,
          }}
        >
          {kicker}
        </div>
      )}
      <div style={{ fontFamily: theme.fontSans, fontSize: 62, fontWeight: 800, color: theme.text, letterSpacing: -0.5 }}>
        {children}
      </div>
    </div>
  );
};

/** A glowing model core, used as the recurring "the model" motif. */
export const ModelCore: React.FC<{ size?: number; label?: string; pulse?: number; fontSize?: number }> = ({
  size = 200,
  label = "MODEL",
  pulse = 0,
  fontSize = 34,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 38% 32%, #a5b4fc 0%, ${theme.accent} 42%, #4338ca 100%)`,
      boxShadow: `0 0 ${40 + pulse * 50}px ${theme.accent}, inset 0 0 40px rgba(255,255,255,0.25)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.fontMono,
      fontSize,
      fontWeight: 800,
      color: theme.text,
      letterSpacing: 1,
      textShadow: "0 2px 12px rgba(0,0,0,0.4)",
    }}
  >
    {label}
  </div>
);
