import { AbsoluteFill } from "remotion";
import { theme } from "../../remotion-src/theme";

// t03 YouTube thumbnail (1280x720). Render as a still:
//   npx remotion still T03-Thumb assets/thumbnails/t03-agentic-retrieval.png --frame=0
// Deliberately DIFFERENT from the channel's usual left-text/right-bot layout:
// blue+gold palette, a full document "wall" (haystack) with ONE spotlighted hit,
// and a boxed-highlight word instead of a gradient. Message matches the video
// (find the RIGHT context among many — agentic retrieval).

const GOLD = "#fbbf24";

export const T03Thumb: React.FC = () => {
  // Document wall (the haystack), right ~half. 5 cols x 4 rows; one tile is the hit.
  const startX = 648;
  const startY = 96;
  const tileW = 96;
  const tileH = 116;
  const gapX = 20;
  const gapY = 16;
  const cols = 5;
  const rows = 4;
  const hitC = 2; // highlighted column
  const hitR = 1; // highlighted row
  const hitX = startX + hitC * (tileW + gapX);
  const hitY = startY + hitR * (tileH + gapY);
  const tiles: { x: number; y: number; hot: boolean }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push({
        x: startX + c * (tileW + gapX),
        y: startY + r * (tileH + gapY),
        hot: r === hitR && c === hitC,
      });
    }
  }

  const Lines: React.FC<{ color: string; w: number }> = ({ color, w }) => (
    <>
      {[0, 1, 2, 3].map((k) => (
        <div
          key={k}
          style={{
            height: 8,
            borderRadius: 4,
            width: k === 3 ? `${w * 0.55}%` : `${w}%`,
            background: color,
          }}
        />
      ))}
    </>
  );

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(130% 130% at 78% 38%, #103a52 0%, #0a1f30 52%, #040d16 100%)",
        fontFamily: theme.fontSans,
      }}
    >
      {/* spotlight halo over the hit tile (lights the surrounding wall) */}
      <div
        style={{
          position: "absolute",
          left: hitX + tileW / 2 - 320,
          top: hitY + tileH / 2 - 320,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}33 0%, ${GOLD}14 38%, transparent 66%)`,
        }}
      />

      {/* document wall */}
      {tiles.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            width: tileW,
            height: tileH,
            borderRadius: 10,
            background: t.hot ? "#3a2c06" : "#1b2c3a",
            border: t.hot ? `4px solid ${GOLD}` : "1px solid #ffffff14",
            boxShadow: t.hot ? `0 0 46px ${GOLD}` : "none",
            opacity: t.hot ? 1 : 0.5,
            transform: t.hot ? "scale(1.12)" : "scale(1)",
            display: "flex",
            flexDirection: "column",
            gap: 11,
            padding: "18px 14px",
          }}
        >
          <Lines color={t.hot ? GOLD : "#5b7186"} w={100} />
        </div>
      ))}

      {/* headline (left) — eyebrow + boxed highlight, NOT a gradient */}
      <div style={{ position: "absolute", left: 58, top: 226 }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 6, color: GOLD }}>
          AGENTIC RETRIEVAL
        </div>
        <div style={{ fontSize: 96, fontWeight: 900, color: theme.text, lineHeight: 1.04, marginTop: 16 }}>
          FIND THE
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 10,
            background: GOLD,
            color: "#08263a",
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1.04,
            padding: "2px 20px",
            borderRadius: 14,
          }}
        >
          RIGHT ONE
        </div>
      </div>
    </AbsoluteFill>
  );
};
