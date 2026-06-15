import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText } from "../../../remotion-src/visuals";

// Scene 4 — The harness layers
// Central MODEL core; concentric rings appear one by one, each labeled:
// Context, Tools, Permissions, Memory, MCP, Subagents, Hooks.

// size = ring diameter; angle = clock position (deg) where the label sits on
// the ring, so labels fan out around the diagram instead of stacking.
// NOTE: ring diameters are kept near the 1080 frame limit (largest = 880) so
// the diagram fills the frame without overflowing. Label fonts are enlarged.
const LAYERS = [
  { label: "Context",     desc: "what the model sees",  color: theme.tokenColors[4], size: 320, angle: -90 },
  { label: "Tools",       desc: "its hands",            color: theme.tokenColors[2], size: 420, angle: -25 },
  { label: "Permissions", desc: "the safety gate",      color: theme.accentWarm,     size: 520, angle: 35 },
  { label: "Memory",      desc: "+ compaction",         color: theme.tokenColors[1], size: 620, angle: 95 },
  { label: "MCP",         desc: "outside systems",      color: theme.tokenColors[5], size: 720, angle: 150 },
  { label: "Subagents",   desc: "isolated helpers",     color: theme.tokenColors[3], size: 810, angle: 205 },
  { label: "Hooks",       desc: "your code, on events", color: theme.tokenColors[0], size: 880, angle: 255 },
];

export const Scene4Layers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Core appears first
  const coreSpring = spring({ frame: frame - fps * 1, fps, config: { damping: 16 } });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // Each layer staggered, starting at 2.5s, +1.4s apart (last lands ~11.9s)
  const layerStart = (i: number) => fps * 2.5 + i * fps * 1.4;

  // Closing line reveals after all rings land, then holds to scene end.
  const lineOpacity = interpolate(frame, [fps * 14, fps * 15.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={theme.accent} />
      <div style={{ zIndex: 20 }}>
        <SceneHeading kicker="layer by layer" accent={theme.accent}>
          What's <span style={gradientText("#c7d2fe", theme.accent)}>wrapped</span> around the model
        </SceneHeading>
      </div>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Rings (render largest first so inner ones sit on top) */}
          {[...LAYERS].reverse().map((layer) => {
            const i = LAYERS.indexOf(layer);
            const start = layerStart(i);
            const s = spring({ frame: frame - start, fps, config: { damping: 15 } });
            const opacity = interpolate(frame, [start, start + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // label position on this ring's circumference
            const rad = (layer.angle * Math.PI) / 180;
            const lx = Math.cos(rad) * (layer.size / 2);
            const ly = Math.sin(rad) * (layer.size / 2);
            return (
              <div key={layer.label} style={{
                position: "absolute", left: "50%", top: "50%",
                width: layer.size, height: layer.size, borderRadius: "50%",
                transform: `translate(-50%, -50%) scale(${0.7 + s * 0.3})`,
                border: `2px solid ${layer.color}`,
                background: `${layer.color}0c`,
                opacity,
              }}>
                {/* label tag pinned to a clock position on the ring */}
                <div style={{
                  position: "absolute", left: "50%", top: "50%",
                  transform: `translate(calc(-50% + ${lx}px), calc(-50% + ${ly}px))`,
                  background: "rgba(10,10,13,0.92)", padding: "6px 20px", borderRadius: 12,
                  border: `1px solid ${layer.color}44`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 14px ${layer.color}22`,
                  fontFamily: theme.fontMono, fontSize: 30, fontWeight: 700, color: layer.color, whiteSpace: "nowrap",
                }}>
                  {layer.label} <span style={{ color: theme.textDim, fontWeight: 400, fontSize: 22 }}>· {layer.desc}</span>
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

      <div style={{ position: "absolute", bottom: 46, width: "100%", textAlign: "center", opacity: lineOpacity, fontFamily: theme.fontSans, fontSize: 38, color: theme.text, zIndex: 20 }}>
        Strip it away → a model that can only <span style={{ color: theme.textMuted }}>talk</span>. Add it back → one that can <span style={{ color: theme.accentGreen }}>do the work.</span>
      </div>
    </AbsoluteFill>
  );
};
