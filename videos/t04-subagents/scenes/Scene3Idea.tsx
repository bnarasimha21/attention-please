import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 3 — The idea [0:26-0:39]
// Main core "clones": a second core buds off and slides aside, popping its
// OWN fresh, empty context window. "Spin off a subagent."

const EmptyWindow: React.FC<{ opacity: number; scale: number; tag: string }> = ({ opacity, scale, tag }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    width: 384, height: 360, borderRadius: 22,
    background: "linear-gradient(180deg, #12121a 0%, #0b0b10 100%)",
    border: `1px dashed ${theme.accentGreen}88`, boxShadow: `0 0 30px ${theme.accentGreen}22`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 17, position: "relative",
  }}>
    <div style={{ position: "absolute", top: 18, left: 20, fontFamily: theme.fontMono, fontSize: 20, color: theme.textMuted, letterSpacing: 1 }}>CONTEXT</div>
    <div style={{ fontSize: 54, opacity: 0.5 }}>✦</div>
    <div style={{ fontFamily: theme.fontSans, fontSize: 27, color: theme.accentGreen, fontWeight: 700 }}>{tag}</div>
  </div>
);

export const Scene3Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const mainOpacity = interpolate(frame, [fps * 0.6, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // bud-off: a clone pops out of the main core with bounce, then slides right
  const budPop = pop(frame, fps, fps * 3, { damping: 11 });
  const slide = interpolate(frame, [fps * 4, fps * 5.8], [0, 432], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: undefined });
  const slideSpring = spring({ frame: frame - fps * 4, fps, config: { damping: 18 } });
  const cloneX = slide * slideSpring;

  // main core nudges left a touch to make room
  const mainShift = interpolate(frame, [fps * 4, fps * 5.8], [0, -180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // subagent label + empty window appear after it settles
  const subLabelOpacity = interpolate(frame, [fps * 6, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const winSpring = pop(frame, fps, fps * 6.8, { damping: 11 });
  const winOpacity = interpolate(frame, [fps * 6.8, fps * 7.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacity = interpolate(frame, [fps * 11.5, fps * 12.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineY = spring({ frame: frame - fps * 11.5, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <SceneHeading kicker="the idea" accent={theme.accentGreen}>
        Spin off a <span style={gradientText("#6ee7b7", theme.accentGreen)}>subagent</span>
      </SceneHeading>

      <CameraRig>
      <div style={{ position: "absolute", top: 40, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1080, height: 456, display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Main agent */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(calc(-50% + ${mainShift}px), -50%)`, opacity: mainOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 17 }}>
            <ModelCore size={204} pulse={pulse} fontSize={35} />
            <div style={{ fontFamily: theme.fontSans, fontSize: 27, color: theme.textMuted }}>main agent</div>
          </div>

          {/* Cloned subagent core (buds off, slides right) */}
          {frame > fps * 3 && (
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(calc(-50% + ${cloneX - 72}px), -50%) scale(${0.4 + budPop * 0.6})`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 17,
            }}>
              <div style={{ filter: "hue-rotate(80deg) saturate(1.2)" }}>
                <ModelCore size={180} pulse={pulse} fontSize={27} label="SUB" />
              </div>
              <div style={{ opacity: subLabelOpacity, fontFamily: theme.fontSans, fontSize: 27, color: theme.accentGreen, fontWeight: 700 }}>subagent</div>
            </div>
          )}

          {/* Fresh empty window beside the subagent */}
          <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}>
            <EmptyWindow opacity={winOpacity} scale={0.85 + winSpring * 0.15} tag="fresh · empty" />
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 90, width: "100%", textAlign: "center",
        opacity: lineOpacity, transform: `translateY(${(1 - lineY) * 18}px)`,
        fontFamily: theme.fontSans, fontSize: 43, color: theme.text,
      }}>
        A second agent — with its own <span style={{ color: theme.accentGreen, fontWeight: 700 }}>fresh, empty</span> context window.
      </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
