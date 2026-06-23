import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, gradientText, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 7 — But didn't big context windows kill RAG?
// P1 objection (1M window) → P2 reality (relative SPEED/COST meters + "misses the
// middle" warning) → P3 resolve (retrieve-to-narrow, then reason) → P4 "Use both."
// NO literal numbers on screen — the latency/cost figures are single-source, so
// everything here is RELATIVE bars + qualitative labels only.

const docDots = Array.from({ length: 40 });

export const Scene7VsLongContext: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // phase visibility (0.4s fade edges; slight overlap = soft cross, no blank)
  const seg = (a: number, b: number, fa = 0.4, fb = 0.4) =>
    interpolate(frame, [a * fps, (a + fa) * fps, (b - fb) * fps, b * fps], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const p1 = seg(0, 9);
  const p2 = seg(8.7, 24);
  const p3 = seg(23.7, 40);
  const p4 = seg(39.7, 80, 0.4, 0.4);

  // P1
  const balloonFill = interpolate(frame, [10, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe = 1 + 0.02 * Math.sin(frame / 12);

  // P2 — relative bar fractions
  const latLong = interpolate(frame, [fps * 9.6, fps * 12.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const latShort = interpolate(frame, [fps * 12.9, fps * 14.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const costLong = interpolate(frame, [fps * 15.4, fps * 18.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const costShort = interpolate(frame, [fps * 18.7, fps * 20.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warnBlink = 0.5 + 0.5 * Math.sin(frame / 6);

  // P3
  const narrow = interpolate(frame, [fps * 25, fps * 31], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reason = interpolate(frame, [fps * 32.5, fps * 36.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cloudDrift = Math.sin(frame / 20) * 4;

  // P4
  const punch = pop(frame, fps, fps * 40, { damping: 12 });
  const punchPulse = 1 + 0.025 * Math.sin(frame / 10);

  const Bar: React.FC<{ frac: number; max: number; color: string; tag: string; tone: string }> = ({ frac, max, color, tag, tone }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 18 }}>
      <div style={{ width: Math.max(0, max * frac), height: 50, borderRadius: 10, background: `linear-gradient(90deg, ${color}, ${color}aa)`, boxShadow: `0 0 22px ${color}66`, transition: "none" }} />
      <div style={{ fontFamily: theme.fontMono, fontSize: 26, color, opacity: frac > 0.04 ? 1 : 0, whiteSpace: "nowrap" }}>{tag} · <span style={{ color: theme.textMuted }}>{tone}</span></div>
    </div>
  );

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentWarm} />
      <Sfx name="whoosh" at={fps * 0.3} volume={0.35} />
      <Sfx name="tick" at={fps * 12.6} volume={0.3} />
      <Sfx name="tick" at={fps * 18.4} volume={0.3} />
      <Sfx name="success" at={fps * 36.3} volume={0.4} />
      <Sfx name="stinger" at={fps * 40} volume={0.4} />

      <CameraRig>
        {/* ---------- P1: the objection ---------- */}
        <div style={{ position: "absolute", inset: 0, opacity: p1 }}>
          <div style={{ position: "absolute", top: 130, width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, letterSpacing: 7, textTransform: "uppercase", color: theme.accentWarm, marginBottom: 16 }}>The objection</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 62, fontWeight: 800, color: theme.text }}>“Just shove it all in?”</div>
          </div>
          <div style={{ position: "absolute", top: 410, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <div style={{ width: 880, height: 300, borderRadius: 28, transform: `scale(${breathe})`, background: "linear-gradient(160deg, #1a1410, #0e0c0a)", border: `2px solid ${theme.accentWarm}66`, boxShadow: `0 0 60px ${theme.accentWarm}33`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 44, fontWeight: 800, color: theme.text }}>1,000,000 tokens</div>
              <div style={{ width: 720, height: 26, borderRadius: 13, background: "#000", border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                <div style={{ width: `${balloonFill * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.accentWarm}, #fbbf24)` }} />
              </div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 30, color: theme.textMuted }}>Million-token context windows are here.</div>
            </div>
          </div>
        </div>

        {/* ---------- P2: the reality ---------- */}
        <div style={{ position: "absolute", inset: 0, opacity: p2 }}>
          <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: theme.fontSans, fontSize: 60, fontWeight: 800, color: theme.text }}>
            Mostly, <span style={gradientText("#fbbf24", theme.accentRed)}>no.</span>
          </div>
          {/* warning banner */}
          <div style={{ position: "absolute", top: 232, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <div style={{ opacity: 0.55 + 0.45 * warnBlink, padding: "12px 28px", borderRadius: 999, border: `2px solid ${theme.accentRed}88`, background: "#1a0e0e", fontFamily: theme.fontMono, fontSize: 26, color: theme.accentRed }}>
              ⚠ even a giant window misses facts in the middle — model-dependent
            </div>
          </div>
          {/* meters */}
          <div style={{ position: "absolute", top: 360, left: 360, width: 1200 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.textMuted, letterSpacing: 2 }}>SPEED</div>
            <Bar frac={latLong} max={760} color={theme.accentRed} tag="long context" tone="slow" />
            <Bar frac={latShort} max={760} color={theme.accentGreen} tag="retrieval" tone="fast" />
          </div>
          <div style={{ position: "absolute", top: 600, left: 360, width: 1200 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.textMuted, letterSpacing: 2 }}>COST</div>
            <Bar frac={costLong} max={760} color={theme.accentRed} tag="long context" tone="pricey" />
            <Bar frac={costShort} max={760} color={theme.accentGreen} tag="retrieval" tone="cheap" />
          </div>
        </div>

        {/* ---------- P3: retrieve-to-narrow, then reason ---------- */}
        <div style={{ position: "absolute", inset: 0, opacity: p3 }}>
          <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: theme.fontSans, fontSize: 56, fontWeight: 800, color: theme.text }}>
            Don’t choose — <span style={gradientText(theme.accentWarm, theme.accentGreen)}>narrow, then reason</span>
          </div>
          {/* knowledge cloud */}
          <div style={{ position: "absolute", top: 360, left: 230, width: 360, height: 360, transform: `translateY(${cloudDrift}px)` }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted, textAlign: "center", marginBottom: 14 }}>1,000,000 docs</div>
            <div style={{ position: "relative", width: 360, height: 300 }}>
              {docDots.map((_, i) => {
                const ang = (i / docDots.length) * Math.PI * 2;
                const r = 60 + (i % 5) * 22;
                const fade = interpolate(narrow, [0.3, 1], [1, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return <div key={i} style={{ position: "absolute", left: 180 + Math.cos(ang) * r, top: 150 + Math.sin(ang) * r * 0.8, width: 12, height: 12, borderRadius: 3, background: theme.accentWarm, opacity: fade }} />;
              })}
            </div>
          </div>
          {/* arrow */}
          <div style={{ position: "absolute", top: 500, left: 620, fontSize: 60, color: theme.accentGreen, opacity: 0.6 + 0.4 * Math.sin(frame / 7), transform: `translateX(${narrow * 10}px)` }}>→</div>
          {/* focused set */}
          <div style={{ position: "absolute", top: 430, left: 760, width: 300, display: "flex", flexDirection: "column", gap: 16, opacity: narrow }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.accentGreen, textAlign: "center", marginBottom: 4 }}>the handful that matter</div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 56, borderRadius: 10, background: "#0e1a14", border: `2px solid ${theme.accentGreen}88`, display: "flex", alignItems: "center", paddingLeft: 20, fontFamily: theme.fontMono, fontSize: 24, color: theme.text, transform: `translateX(${(1 - narrow) * -30}px)` }}>doc #{i + 1} ✓</div>
            ))}
          </div>
          {/* arrow 2 */}
          <div style={{ position: "absolute", top: 500, left: 1100, fontSize: 60, color: theme.accent, opacity: reason }}>→</div>
          {/* big window reasons */}
          <div style={{ position: "absolute", top: 410, left: 1200, width: 440, height: 300, borderRadius: 24, background: "linear-gradient(160deg, #14121f, #0c0b12)", border: `2px solid ${theme.accent}88`, boxShadow: `0 0 ${reason * 50}px ${theme.accent}44`, opacity: 0.5 + 0.5 * reason, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.textMuted }}>context window</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 40, fontWeight: 800, color: theme.text }}>reason over it</div>
            <div style={{ fontSize: 48, color: theme.accentGreen, opacity: reason }}>✓</div>
          </div>
        </div>

        {/* ---------- P4: punchline ---------- */}
        <div style={{ position: "absolute", inset: 0, opacity: p4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: theme.fontSans, fontSize: 120, fontWeight: 900, transform: `scale(${0.85 + punch * 0.15})`, ...gradientText(theme.accentWarm, theme.accentGreen) }}>
            Use both.
          </div>
          <div style={{ marginTop: 28, fontFamily: theme.fontSans, fontSize: 34, color: theme.textMuted, transform: `scale(${punchPulse})` }}>
            Retrieval and long context, working together.
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
