import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 14 — Recap: the whole machine
// Central MODEL core, then concentric rings appear one by one with labels fanned
// around the clock (reuses Scene4Layers' technique). All eight harness layers
// assemble into the full diagram.

// size = ring diameter (largest = 880, within the 1080 frame); angle = clock
// position (deg) where the label tag sits on the ring, fanned out evenly.
const LAYERS = [
  { label: "Loop",        color: theme.tokenColors[0], size: 300, angle: -90 },
  { label: "Context",     color: theme.tokenColors[4], size: 380, angle: -45 },
  { label: "Tools",       color: theme.tokenColors[2], size: 460, angle: 0 },
  { label: "Permissions", color: theme.accentWarm,     size: 540, angle: 45 },
  { label: "Memory",      color: theme.tokenColors[1], size: 620, angle: 90 },
  { label: "MCP",         color: theme.tokenColors[5], size: 700, angle: 135 },
  { label: "Subagents",   color: theme.tokenColors[3], size: 790, angle: 180 },
  { label: "Hooks",       color: theme.tokenColors[6], size: 880, angle: 225 },
];

export const Scene14Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Core appears first.
  const coreSpring = pop(frame, fps, fps * 0.8, { damping: 11 });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // Each layer staggered, starting at 1.8s, +1.5s apart (last lands ~12.3s),
  // then holds ~3s to scene end (600 frames = 20s).
  const layerStart = (i: number) => fps * 1.8 + i * fps * 1.5;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={theme.accent} />
      <CameraRig>
        <div style={{ zIndex: 20 }}>
          <SceneHeading kicker="the whole machine" accent={theme.accent}>
            The model thinks. The harness{" "}
            <span style={gradientText("#c7d2fe", theme.accent)}>acts</span>.
          </SceneHeading>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Rings (render largest first so inner ones sit on top) */}
            {[...LAYERS].reverse().map((layer) => {
              const i = LAYERS.indexOf(layer);
              const start = layerStart(i);
              const s = pop(frame, fps, start, { damping: 11 });
              const opacity = interpolate(frame, [start, start + fps * 0.8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const rad = (layer.angle * Math.PI) / 180;
              const lx = Math.cos(rad) * (layer.size / 2);
              const ly = Math.sin(rad) * (layer.size / 2);
              return (
                <div
                  key={layer.label}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: layer.size,
                    height: layer.size,
                    borderRadius: "50%",
                    transform: `translate(-50%, -50%) scale(${0.7 + s * 0.3})`,
                    border: `2px solid ${layer.color}`,
                    background: `${layer.color}0c`,
                    opacity,
                  }}
                >
                  {/* label tag pinned to a clock position on the ring */}
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: `translate(calc(-50% + ${lx}px), calc(-50% + ${ly}px))`,
                      background: "rgba(10,10,13,0.92)",
                      padding: "6px 20px",
                      borderRadius: 12,
                      border: `1px solid ${layer.color}44`,
                      boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 14px ${layer.color}22`,
                      fontFamily: theme.fontMono,
                      fontSize: 28,
                      fontWeight: 700,
                      color: layer.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {layer.label}
                  </div>
                </div>
              );
            })}

            {/* Core */}
            <div style={{ transform: `scale(${0.6 + coreSpring * 0.4})`, zIndex: 10 }}>
              <ModelCore size={240} pulse={pulse} fontSize={40} />
            </div>
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
