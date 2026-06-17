import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, ModelCore, gradientText, CameraRig, pop } from "../../../remotion-src/visuals";

// Scene 5 — Tool calling
// Left→right flow: TOOLS menu card → MODEL emits a tool_use JSON card →
// arrow to HARNESS (executes) → tool_result JSON card returns. Staggered.
// Punchline: the model only ASKS; the harness has the keys.

const TOOLS = [
  { name: "read_file", hint: "(path)" },
  { name: "edit_file", hint: "(path, find, replace)" },
  { name: "run_shell", hint: "(cmd)" },
  { name: "web_search", hint: "(query)" },
];

type Tok = { t: string; c: string };

// tool_use JSON, line by line, syntax-colored
const USE_LINES: Tok[][] = [
  [{ t: "// model emits →", c: theme.textMuted }],
  [
    { t: "{ ", c: theme.text },
    { t: '"type"', c: theme.accent },
    { t: ": ", c: theme.text },
    { t: '"tool_use"', c: theme.accentGreen },
    { t: ", ", c: theme.text },
    { t: '"name"', c: theme.accent },
    { t: ": ", c: theme.text },
    { t: '"edit_file"', c: theme.accentGreen },
    { t: ",", c: theme.text },
  ],
  [
    { t: "  ", c: theme.text },
    { t: '"input"', c: theme.accent },
    { t: ": { ", c: theme.text },
    { t: '"path"', c: theme.accent },
    { t: ": ", c: theme.text },
    { t: '"app.py"', c: theme.accentGreen },
    { t: ", ", c: theme.text },
    { t: '"find"', c: theme.accent },
    { t: ": ", c: theme.text },
    { t: '"..."', c: theme.accentGreen },
    { t: ",", c: theme.text },
  ],
  [
    { t: "    ", c: theme.text },
    { t: '"replace"', c: theme.accent },
    { t: ": ", c: theme.text },
    { t: '"..."', c: theme.accentGreen },
    { t: " } }", c: theme.text },
  ],
];

const RESULT_LINES: Tok[][] = [
  [{ t: "// harness runs it, returns →", c: theme.textMuted }],
  [
    { t: "{ ", c: theme.text },
    { t: '"type"', c: theme.accent },
    { t: ": ", c: theme.text },
    { t: '"tool_result"', c: theme.accentGreen },
    { t: ",", c: theme.text },
  ],
  [
    { t: "  ", c: theme.text },
    { t: '"content"', c: theme.accent },
    { t: ": ", c: theme.text },
    { t: '"✓ 1 change applied"', c: theme.accentGreen },
    { t: " }", c: theme.text },
  ],
];

const CodeCard: React.FC<{
  lines: Tok[][];
  enter: number; // 0..1
  title: string;
  titleColor: string;
  width: number;
}> = ({ lines, enter, title, titleColor, width }) => (
  <div
    style={{
      opacity: enter,
      transform: `translateY(${(1 - enter) * 26}px) scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
      width,
      padding: "22px 26px",
      borderRadius: 18,
      background: `linear-gradient(160deg, #14150f, ${theme.surface})`,
      border: `1px solid ${theme.border}`,
      boxShadow: `0 24px 64px rgba(0,0,0,0.5), inset 0 0 50px ${titleColor}0d`,
      fontFamily: theme.fontMono,
    }}
  >
    <div style={{ fontSize: 21, color: titleColor, fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
      {title}
    </div>
    {lines.map((line, li) => (
      <div key={li} style={{ whiteSpace: "pre", fontSize: 26, lineHeight: 1.5 }}>
        {line.map((tok, ti) => (
          <span key={ti} style={{ color: tok.c }}>
            {tok.t}
          </span>
        ))}
      </div>
    ))}
  </div>
);

const Arrow: React.FC<{ enter: number; label: string }> = ({ enter, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: enter, transform: `scaleX(${enter})` }}>
    <div style={{ fontFamily: theme.fontMono, fontSize: 20, color: theme.accentGreen }}>{label}</div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: 70, height: 3, background: theme.accentGreen, boxShadow: `0 0 12px ${theme.accentGreen}` }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "9px solid transparent",
          borderBottom: "9px solid transparent",
          borderLeft: `14px solid ${theme.accentGreen}`,
          filter: `drop-shadow(0 0 8px ${theme.accentGreen})`,
        }}
      />
    </div>
  </div>
);

export const Scene5ToolCalling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const e = (delay: number) =>
    interpolate(pop(frame, fps, delay, { damping: 14, stiffness: 130 }), [0, 1], [0, 1]);

  const toolsIn = e(fps * 1.0);
  const modelIn = e(fps * 3.5);
  const useIn = e(fps * 5.5);
  const arrowIn = e(fps * 8.0);
  const harnessIn = e(fps * 9.5);
  const resultIn = e(fps * 12.0);

  const captionOpacity = interpolate(frame, [fps * 15, fps * 16.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const modelPulse = 0.4 + 0.4 * Math.sin(frame / 14);

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />

      <CameraRig>
        <SceneHeading kicker="how it acts" accent={theme.accentGreen}>
          The model only <span style={gradientText("#a7f3d0", theme.accentGreen)}>&lt;asks&gt;</span>
        </SceneHeading>

        {/* Top band: TOOLS menu → MODEL → tool_use card */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 44,
          }}
        >
          {/* TOOLS menu card */}
          <div
            style={{
              opacity: toolsIn,
              transform: `translateY(${(1 - toolsIn) * 24}px) scale(${interpolate(toolsIn, [0, 1], [0.92, 1])})`,
              width: 360,
              padding: "22px 26px",
              borderRadius: 18,
              background: `linear-gradient(160deg, #14150f, ${theme.surface})`,
              border: `1px solid ${theme.border}`,
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              fontFamily: theme.fontMono,
            }}
          >
            <div style={{ fontSize: 21, color: theme.accentGreen, fontWeight: 700, letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>
              Tools
            </div>
            {TOOLS.map((tool, i) => {
              const ti = interpolate(pop(frame, fps, fps * 1.3 + i * fps * 0.25, { damping: 13 }), [0, 1], [0, 1]);
              return (
                <div key={tool.name} style={{ opacity: ti, transform: `translateX(${(1 - ti) * 14}px)`, marginBottom: 12, fontSize: 26 }}>
                  <span style={{ color: theme.text }}>{tool.name}</span>
                  <span style={{ color: theme.textMuted, fontSize: 21 }}> {tool.hint}</span>
                </div>
              );
            })}
          </div>

          {/* MODEL core */}
          <div style={{ opacity: modelIn, transform: `scale(${interpolate(modelIn, [0, 1], [0.6, 1])})` }}>
            <ModelCore size={170} pulse={modelPulse} fontSize={30} />
          </div>

          {/* tool_use JSON card */}
          <CodeCard lines={USE_LINES} enter={useIn} title="tool_use" titleColor={theme.accent} width={620} />
        </div>

        {/* Bottom band: arrow → HARNESS → tool_result card */}
        <div
          style={{
            position: "absolute",
            top: 580,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 44,
          }}
        >
          <Arrow enter={arrowIn} label="to harness" />

          {/* HARNESS executor */}
          <div
            style={{
              opacity: harnessIn,
              transform: `scale(${interpolate(harnessIn, [0, 1], [0.7, 1])})`,
              padding: "26px 40px",
              borderRadius: 18,
              background: `${theme.accentGreen}14`,
              border: `1.5px solid ${theme.accentGreen}77`,
              boxShadow: `0 0 40px ${theme.accentGreen}33`,
              fontFamily: theme.fontMono,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, color: theme.accentGreen, letterSpacing: 2 }}>HARNESS</div>
            <div style={{ fontSize: 22, color: theme.textMuted, marginTop: 6 }}>executes ⚙</div>
          </div>

          {/* tool_result card */}
          <CodeCard lines={RESULT_LINES} enter={resultIn} title="tool_result" titleColor={theme.accentGreen} width={620} />
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            width: "100%",
            textAlign: "center",
            opacity: captionOpacity,
            fontFamily: theme.fontSans,
            fontSize: 36,
            color: theme.text,
          }}
        >
          An intern with brilliant ideas and <span style={{ color: theme.accentWarm }}>zero keys</span> — it can only{" "}
          <span style={{ color: theme.accentGreen }}>ask.</span>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
