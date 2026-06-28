import { AbsoluteFill } from "remotion";
import { theme } from "../../remotion-src/theme";

// t03 YouTube thumbnail (1280x720). Render as a still:
//   npx remotion still T03-Thumb assets/thumbnails/t03-agentic-retrieval.png --frame=0
// DIFFERENT layout from t01/t02 (both text-left + graphic-right): centered,
// title-on-top over a FULL-FRAME document haystack, with a magnifier finding the
// one glowing doc. Warm gold-on-dark palette (vs t01 teal, t02 red).

const GOLD = "#fbbf24";

export const T03Thumb: React.FC = () => {
  // full-frame haystack: dense field of dim document cards edge to edge
  const cols = 13;
  const rows = 6;
  const fStartX = 28;
  const fStartY = 30;
  const fcW = 64;
  const fcH = 72;
  const fgX = 32;
  const fgY = 40;
  const field: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      field.push({ x: fStartX + c * (fcW + fgX), y: fStartY + r * (fcH + fgY) });
    }
  }

  // magnifier
  const cx = 640;
  const cy = 474;
  const lensR = 168;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(125% 120% at 50% 60%, #1d1733 0%, #0e0b1c 52%, #060509 100%)",
        fontFamily: theme.fontSans,
      }}
    >
      {/* full-frame haystack field (dim) */}
      {field.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: fcW,
            height: fcH,
            borderRadius: 8,
            background: "#231d37",
            border: "1px solid #ffffff12",
            opacity: 0.4,
            display: "flex",
            flexDirection: "column",
            gap: 7,
            padding: "12px 10px",
          }}
        >
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ height: 6, borderRadius: 3, width: k === 2 ? "55%" : "100%", background: "#6a6390" }} />
          ))}
        </div>
      ))}

      {/* top scrim so the title stays readable over the field */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 320,
          background: "linear-gradient(180deg, #07060ce6 0%, #07060cb0 46%, transparent 100%)",
        }}
      />

      {/* vignette to lift the magnifier off the busy field */}
      <div
        style={{
          position: "absolute",
          left: cx - 290,
          top: cy - 290,
          width: 580,
          height: 580,
          borderRadius: "50%",
          background: "radial-gradient(circle, #07060ce6 0%, #07060c88 44%, transparent 70%)",
        }}
      />

      {/* magnifier handle (behind the lens) */}
      <div
        style={{
          position: "absolute",
          left: cx + lensR * 0.62,
          top: cy + lensR * 0.62,
          width: 168,
          height: 44,
          borderRadius: 22,
          background: "linear-gradient(180deg, #e2e8f0, #8a94a6)",
          transform: "rotate(45deg)",
          transformOrigin: "left center",
          boxShadow: "0 6px 18px #00000077",
        }}
      />

      {/* magnifier lens */}
      <div
        style={{
          position: "absolute",
          left: cx - lensR,
          top: cy - lensR,
          width: lensR * 2,
          height: lensR * 2,
          borderRadius: "50%",
          border: "14px solid #eef2f7",
          background: "rgba(255,255,255,0.04)",
          boxShadow: `0 0 0 7px #00000055, 0 0 70px ${GOLD}66, inset 0 0 46px ${GOLD}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* the ONE right document, magnified + glowing gold */}
        <div
          style={{
            width: 168,
            height: 210,
            borderRadius: 14,
            background: "#3a2c06",
            border: `5px solid ${GOLD}`,
            boxShadow: `0 0 50px ${GOLD}`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: "26px 22px",
          }}
        >
          {[0, 1, 2, 3].map((k) => (
            <div key={k} style={{ height: 12, borderRadius: 6, width: k === 3 ? "58%" : "100%", background: GOLD }} />
          ))}
        </div>
      </div>

      {/* TITLE (big) + subtitle (small), CENTERED, top */}
      <div style={{ position: "absolute", top: 44, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 92, fontWeight: 900, color: theme.text, lineHeight: 1.0 }}>
          AGENTIC
        </div>
        <div style={{ fontSize: 92, fontWeight: 900, color: GOLD, lineHeight: 1.0 }}>
          RETRIEVAL
        </div>
        <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: 1, color: "#cbc6da", marginTop: 16 }}>
          Find the right document
        </div>
      </div>
    </AbsoluteFill>
  );
};
