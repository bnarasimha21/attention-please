import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, ModelCore, gradientText, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 8 — Why it matters.
// P1 contrast: a BEST MODEL on the WRONG 3 paragraphs → confident ✕ vs a normal
// model on the RIGHT 3 → ✓ (right-context wins). P2 "retrieval = the agent's
// senses" (scan/eye motif). P3 punchline alone: "only as smart as what it can find."

export const Scene8WhyItMatters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg = (a: number, b: number, fa = 0.4, fb = 0.4) =>
    interpolate(frame, [a * fps, (a + fa) * fps, (b - fb) * fps, b * fps], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const p1 = seg(0, 16);
  const p2 = seg(15.7, 30);
  const p3 = seg(29.7, 80);

  // P1 sub-beats
  const leftBuild = interpolate(frame, [fps * 0.8, fps * 3.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftAns = pop(frame, fps, fps * 4.6, { damping: 12 });
  const rightBuild = interpolate(frame, [fps * 6.5, fps * 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightAns = pop(frame, fps, fps * 10, { damping: 12 });
  const verdict = interpolate(frame, [fps * 12, fps * 13.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftDim = interpolate(frame, [fps * 12, fps * 14], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseL = 0.4 + 0.6 * Math.abs(Math.sin(frame / 14));
  const pulseR = 0.4 + 0.6 * Math.abs(Math.sin(frame / 11));

  // P2
  const sensesPop = pop(frame, fps, fps * 16.6, { damping: 12 });
  const sweep = (frame * 4) % 360;
  const ring = (frame % 60) / 60;
  const chipIn = interpolate(frame, [fps * 20, fps * 23], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // P3
  const punch = pop(frame, fps, fps * 30, { damping: 12 });
  const punchPulse = 1 + 0.025 * Math.sin(frame / 10);

  const Para: React.FC<{ color: string; w: number; on: number; bad?: boolean }> = ({ color, w, on, bad }) => (
    <div style={{ height: 34, width: w, borderRadius: 7, background: bad ? "#1a1011" : "#0e1a14", border: `1.5px solid ${color}`, opacity: on, display: "flex", alignItems: "center", paddingLeft: 12 }}>
      <div style={{ height: 8, width: w - 60, borderRadius: 4, background: color, opacity: 0.7 }} />
    </div>
  );

  const col = (side: "L" | "R") => {
    const isL = side === "L";
    const build = isL ? leftBuild : rightBuild;
    const ans = isL ? leftAns : rightAns;
    const color = isL ? theme.accentRed : theme.accentGreen;
    const x = isL ? 250 : 1110;
    const dim = isL ? leftDim : 1;
    return (
      <div style={{ position: "absolute", top: 250, left: x, width: 560, opacity: dim }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `scale(${0.9 + (isL ? pulseL : pulseR) * 0.06})` }}>
            <ModelCore size={150} label={isL ? "BEST MODEL" : "OK MODEL"} pulse={isL ? pulseL : pulseR} fontSize={22} />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontFamily: theme.fontMono, fontSize: 26, color }}>{isL ? "WRONG 3 paragraphs" : "RIGHT 3 paragraphs"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 16 }}>
          <Para color={color} w={420} on={build} bad={isL} />
          <Para color={color} w={420} on={build} bad={isL} />
          <Para color={color} w={420} on={build} bad={isL} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18, fontSize: 40, color, opacity: build }}>↓</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <div style={{ transform: `scale(${ans})`, padding: "18px 28px", borderRadius: 16, background: isL ? "#1a1011" : "#0e1a14", border: `2px solid ${color}`, fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.text, maxWidth: 480, textAlign: "center" }}>
            {isL ? "“…definitely the answer.”  ✕" : "Correct  ✓"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />
      <Sfx name="error" at={fps * 4.6} volume={0.35} />
      <Sfx name="success" at={fps * 10} volume={0.4} />
      <Sfx name="whoosh" at={fps * 16.6} volume={0.3} />
      <Sfx name="stinger" at={fps * 30} volume={0.4} rate={1.04} />

      <CameraRig>
        {/* ---------- P1: contrast ---------- */}
        <div style={{ position: "absolute", inset: 0, opacity: p1 }}>
          <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: theme.fontSans, fontSize: 56, fontWeight: 800, color: theme.text }}>
            It was never just the <span style={gradientText(theme.accent, "#a78bfa")}>model</span>
          </div>
          {col("L")}
          {col("R")}
          <div style={{ position: "absolute", top: 360, left: 0, right: 0, textAlign: "center", fontFamily: theme.fontMono, fontSize: 40, color: theme.textDim }}>vs</div>
          {/* verdict */}
          <div style={{ position: "absolute", top: 836, width: "100%", textAlign: "center", opacity: verdict, transform: `translateY(${(1 - verdict) * 12}px)` }}>
            <span style={{ fontFamily: theme.fontSans, fontSize: 38, fontWeight: 800, color: theme.accentGreen }}>The right context wins, even with the weaker model.</span>
          </div>
        </div>

        {/* ---------- P2: retrieval = senses ---------- */}
        <div style={{ position: "absolute", inset: 0, opacity: p2 }}>
          <div style={{ position: "absolute", top: 130, width: "100%", textAlign: "center", fontFamily: theme.fontSans, fontSize: 58, fontWeight: 800, color: theme.text }}>
            Retrieval is how the agent <span style={gradientText(theme.accent, theme.accentGreen)}>sees</span>
          </div>
          <div style={{ position: "absolute", top: 300, left: 0, right: 0, height: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 460, height: 460, transform: `scale(${0.85 + sensesPop * 0.15})` }}>
              {/* scan rings */}
              {[0, 1, 2].map((i) => {
                const r = ring + i * 0.33;
                return <div key={i} style={{ position: "absolute", left: 230 - (110 + r * 120), top: 230 - (110 + r * 120), width: (110 + r * 120) * 2, height: (110 + r * 120) * 2, borderRadius: "50%", border: `2px solid ${theme.accent}`, opacity: (1 - r) * 0.5 }} />;
              })}
              {/* radar sweep */}
              <div style={{ position: "absolute", left: 230, top: 230, width: 200, height: 4, background: `linear-gradient(90deg, ${theme.accentGreen}, transparent)`, transformOrigin: "left center", transform: `rotate(${sweep}deg)`, opacity: 0.8 }} />
              {/* core */}
              <div style={{ position: "absolute", left: 130, top: 130 }}>
                <ModelCore size={200} label="AGENT" pulse={0.5 + 0.5 * Math.sin(frame / 9)} fontSize={30} />
              </div>
              {/* incoming right-context chip */}
              <div style={{ position: "absolute", left: interpolate(chipIn, [0, 1], [470, 250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), top: 200, opacity: chipIn, padding: "12px 18px", borderRadius: 10, background: "#0e1a14", border: `2px solid ${theme.accentGreen}`, fontFamily: theme.fontMono, fontSize: 24, color: theme.accentGreen }}>the right doc ✓</div>
            </div>
          </div>
          <div style={{ position: "absolute", top: 800, width: "100%", textAlign: "center", fontFamily: theme.fontSans, fontSize: 32, color: theme.textMuted }}>
            Get this right, and a normal model feels brilliant.
          </div>
        </div>

        {/* ---------- P3: punchline ---------- */}
        <div style={{ position: "absolute", inset: 0, opacity: p3, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 160px" }}>
          <div style={{ textAlign: "center", transform: `scale(${(0.85 + punch * 0.15) * punchPulse})`, fontFamily: theme.fontSans, fontSize: 76, fontWeight: 900, lineHeight: 1.15, color: theme.text }}>
            An agent is only as smart as <span style={gradientText(theme.accent, theme.accentGreen)}>what it can find.</span>
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
