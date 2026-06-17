import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { theme } from "./theme";

// Shared motion + visual toolkit for all "Attention Please" videos.
// Top-tier motion design (Fireship / Coderized / PolyMatter feel): snappy
// overshoot entrances, kinetic typography, a living camera, parallax depth.

// Premium "ease-out-expo"-ish curve — fast start, soft settle.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** Snappy overshoot spring (0→1 with a little bounce). The channel's signature pop. */
export const pop = (
  frame: number,
  fps: number,
  delay = 0,
  config: { damping?: number; stiffness?: number; mass?: number } = {}
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.7, ...config },
  });

/**
 * CameraRig — wraps a scene's CONTENT (not the background) and gives it life:
 * a quick punch-in settle, a slow continuous push, and a gentle drift. This is
 * what makes scenes feel "filmed" instead of static. If the scene centers its
 * content with flex, pass those props via `style`.
 */
export const CameraRig: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  push?: number;
  style?: React.CSSProperties;
}> = ({ children, intensity = 1, push = 0.035, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = spring({ frame, fps, config: { damping: 16, stiffness: 90, mass: 1 } }); // 0→1
  const intro = interpolate(settle, [0, 1], [1.07, 1.0]); // punch-in
  const slow = interpolate(frame, [0, fps * 22], [0, push], { extrapolateRight: "clamp" }); // slow push
  const dx = Math.sin(frame / 130) * 5 * intensity;
  const dy = Math.cos(frame / 165) * 4 * intensity;
  return (
    <AbsoluteFill
      style={{ ...style, transform: `scale(${intro + slow}) translate(${dx}px, ${dy}px)`, transformOrigin: "50% 50%" }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** A drifting glow particle (parallax depth). Deterministic per index — no RNG. */
const Particle: React.FC<{ i: number; glow: string; frame: number }> = ({ i, glow, frame }) => {
  const seedX = (i * 137) % 100;
  const speed = 0.18 + (i % 5) * 0.05;
  const size = 3 + (i % 4) * 2;
  const span = 130;
  const yRaw = (frame * speed + i * 23) % span;
  const y = 110 - yRaw;
  const opacity = interpolate(yRaw, [0, 12, span - 18, span], [0, 0.5, 0.5, 0]) * (0.5 + (i % 3) * 0.2);
  return (
    <div
      style={{
        position: "absolute",
        left: `${seedX}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: glow,
        opacity,
        boxShadow: `0 0 ${size * 3}px ${glow}`,
      }}
    />
  );
};

/**
 * Living scene background: an orbiting radial glow, a slowly drifting dot grid
 * (parallax), floating glow particles, and a vignette. Replaces flat black.
 */
export const SceneBackground: React.FC<{ glow?: string }> = ({ glow = theme.accent }) => {
  const frame = useCurrentFrame();
  const breathe = 0.85 + 0.15 * Math.sin(frame / 40);
  const gx = 50 + Math.sin(frame / 95) * 7;
  const gy = 42 + Math.cos(frame / 120) * 5;
  const drift = (frame * 0.25) % 44;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 70% at ${gx}% ${gy}%, ${glow}22 0%, ${glow}09 35%, ${theme.bg} 68%)`,
          opacity: breathe,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${theme.border} 1.2px, transparent 1.2px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: `${drift}px ${drift}px`,
          opacity: 0.4,
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at center, black 25%, transparent 78%)",
          maskImage: "radial-gradient(ellipse 70% 70% at center, black 25%, transparent 78%)",
        }}
      />
      <AbsoluteFill>
        {Array.from({ length: 12 }).map((_, i) => (
          <Particle key={i} i={i} glow={glow} frame={frame} />
        ))}
      </AbsoluteFill>
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
 * Kinetic scene heading: kicker letters spread-settle in, the title pops with
 * overshoot + de-blur, and an accent underline swipes in beneath it.
 */
export const SceneHeading: React.FC<{
  kicker?: string;
  accent?: string;
  children: React.ReactNode;
  delay?: number;
  size?: number;
}> = ({ kicker, accent = theme.accent, children, delay = 0, size = 62 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = interpolate(frame - delay, [0, fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const popS = pop(frame, fps, delay, { damping: 13, stiffness: 150, mass: 0.9 });
  const scale = interpolate(popS, [0, 1], [0.86, 1]);
  const blur = interpolate(t, [0, 1], [12, 0]);
  const kickerLS = interpolate(t, [0, 1], [18, 7]);
  const ul = pop(frame, fps, delay + fps * 0.45, { damping: 14, stiffness: 130 });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        width: "100%",
        textAlign: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * 24}px)`,
      }}
    >
      {kicker && (
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 25,
            letterSpacing: kickerLS,
            textTransform: "uppercase",
            color: accent,
            marginBottom: 16,
            opacity: t * 0.9,
          }}
        >
          {kicker}
        </div>
      )}
      <div
        style={{
          fontFamily: theme.fontSans,
          fontSize: size,
          fontWeight: 800,
          color: theme.text,
          letterSpacing: -0.5,
          filter: `blur(${blur}px)`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
      <div
        style={{
          width: 200,
          height: 5,
          margin: "20px auto 0",
          borderRadius: 3,
          background: `linear-gradient(90deg, ${accent}, ${accent}55)`,
          boxShadow: `0 0 18px ${accent}aa`,
          transform: `scaleX(${ul})`,
          transformOrigin: "center",
          opacity: ul,
        }}
      />
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
