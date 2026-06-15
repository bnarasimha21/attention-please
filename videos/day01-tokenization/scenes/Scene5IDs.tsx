import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";

// Scene 5 — Tokens to IDs [3:30-4:15]
// Show lookup table: token → number

const TOKEN_MAP = [
  { token: "Hello",  id: 15496, color: theme.tokenColors[0] },
  { token: "world",  id: 995,   color: theme.tokenColors[1] },
  { token: " the",   id: 262,   color: theme.tokenColors[2] },
  { token: "GPT",    id: 38,    color: theme.tokenColors[3] },
  { token: "AI",     id: 20,    color: theme.tokenColors[4] },
];

// Example sentence → token IDs
const SENTENCE = "Hello world";
const SENTENCE_IDS = [15496, 11, 995];

export const Scene5IDs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: "clamp" });

  // Table rows reveal one by one
  const visibleRows = Math.floor(interpolate(frame, [fps, fps * 5], [0, TOKEN_MAP.length + 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Bottom sentence reveal
  const sentenceOpacity = interpolate(frame, [fps * 6, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowOpacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const idsOpacity = interpolate(frame, [fps * 7.5, fps * 8.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>

      <div style={{ opacity: titleOpacity, fontFamily: theme.fontSans, fontSize: 36, color: theme.textMuted, marginBottom: 50 }}>
        Every token gets an <span style={{ color: theme.accent }}>ID number</span>
      </div>

      {/* Lookup table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, width: 600, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", background: theme.surface, padding: "14px 28px", fontFamily: theme.fontMono, fontSize: 18, color: theme.textMuted }}>
          <div style={{ flex: 1 }}>Token</div>
          <div>ID</div>
        </div>
        {TOKEN_MAP.slice(0, visibleRows).map((row, i) => (
          <div key={i} style={{
            display: "flex", padding: "14px 28px", alignItems: "center",
            borderTop: `1px solid ${theme.border}`,
            background: i % 2 === 0 ? theme.bg : `${theme.surface}88`,
          }}>
            <div style={{ flex: 1 }}>
              <span style={{
                fontFamily: theme.fontMono, fontSize: 24, fontWeight: 700,
                color: row.color, background: `${row.color}18`, padding: "4px 12px", borderRadius: 6,
              }}>
                {row.token}
              </span>
            </div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.text }}>{row.id}</div>
          </div>
        ))}
      </div>

      {/* Sentence → IDs demo */}
      <div style={{ opacity: sentenceOpacity, marginTop: 60, display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.text, background: theme.surface, padding: "12px 24px", borderRadius: 12 }}>
          "Hello world"
        </div>
        <div style={{ opacity: arrowOpacity, fontSize: 28, color: theme.accent }}>→</div>
        <div style={{ opacity: idsOpacity, display: "flex", gap: 12 }}>
          {SENTENCE_IDS.map((id, i) => (
            <div key={i} style={{
              fontFamily: theme.fontMono, fontSize: 28, fontWeight: 700,
              color: theme.tokenColors[i], background: `${theme.tokenColors[i]}18`,
              padding: "10px 20px", borderRadius: 10,
              border: `1px solid ${theme.tokenColors[i]}44`,
            }}>
              {id}
            </div>
          ))}
        </div>
      </div>

      <div style={{ opacity: idsOpacity, marginTop: 24, fontFamily: theme.fontSans, fontSize: 22, color: theme.textMuted }}>
        Just a list of integers. That's all that enters the model.
      </div>
    </AbsoluteFill>
  );
};
