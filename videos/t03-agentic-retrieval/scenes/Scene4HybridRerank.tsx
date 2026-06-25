import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, SceneHeading, gradientText, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 4 — Semantic isn't enough: hybrid + rerank (t03)
// LANES: semantic catches the paraphrase but misses the exact code; keyword the reverse.
// MERGE: hybrid captures both. RERANK: wide net of ~50 → reranker → best 3 rise.
// KICKER: contextual embeddings + hybrid + reranking → failed retrievals −67% (Anthropic's own testing).

export const Scene4HybridRerank: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const F = (s: number) => fps * s;
  const seg = (a: number, b: number, c: number, d: number) =>
    interpolate(frame, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase envelopes
  const pLanes = seg(F(1), F(1.8), F(25), F(26.5));
  const pMerge = seg(F(27), F(28), F(41), F(42.5));
  const pRerank = seg(F(43), F(44), F(59), F(60.5));
  const pKicker = interpolate(frame, [F(61), F(62)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Lanes internals
  const queryIn = pop(frame, fps, F(2), { damping: 12 });
  const semHit = interpolate(frame, [F(6), F(9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const semMiss = interpolate(frame, [F(10), F(12)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyHit = interpolate(frame, [F(14), F(17)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyMiss = interpolate(frame, [F(18), F(20)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Merge internals
  const mergeBox = pop(frame, fps, F(30), { damping: 12 });
  const bothT = interpolate(frame, [F(33), F(37)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Rerank internals
  const pour = interpolate(frame, [F(44), F(50)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rerankT = interpolate(frame, [F(51), F(53)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const best3 = interpolate(frame, [F(53), F(58)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Kicker internals
  const chip1 = pop(frame, fps, F(62), { damping: 12 });
  const chip2 = pop(frame, fps, F(62.6), { damping: 12 });
  const chip3 = pop(frame, fps, F(63.2), { damping: 12 });
  const heroPop = pop(frame, fps, F(64.5), { damping: 10 });
  const heroPulse = 0.5 + 0.5 * Math.sin(frame / 9);
  const capT = interpolate(frame, [F(65.5), F(66.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const cards = Array.from({ length: 50 });

  const Lane: React.FC<{ title: string; accent: string; hit: number; hitText: string; miss: number; missText: string }> = ({ title, accent, hit, hitText, miss, missText }) => (
    <div style={{ width: 480, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: theme.fontMono, fontSize: 28, fontWeight: 700, color: accent, letterSpacing: 1 }}>{title}</div>
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, opacity: hit, transform: `translateX(${(1 - hit) * -20}px)`, background: "#101613", border: `2px solid ${theme.accentGreen}`, borderRadius: 14, padding: "18px 22px" }}>
        <span style={{ fontSize: 32, color: theme.accentGreen }}>✓</span>
        <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.text }}>{hitText}</span>
      </div>
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, opacity: miss * 0.9, background: "#1a1113", border: `2px solid ${theme.accentRed}`, borderRadius: 14, padding: "18px 22px" }}>
        <span style={{ fontSize: 32, color: theme.accentRed }}>✕</span>
        <span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>{missText}</span>
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accent} />
      <Sfx name="pop" at={F(7)} volume={0.3} />
      <Sfx name="pop" at={F(15)} volume={0.3} />
      <Sfx name="success" at={F(34)} volume={0.4} />
      <Sfx name="whoosh" at={F(44)} volume={0.35} />
      <Sfx name="success" at={F(54)} volume={0.35} />
      <Sfx name="stinger" at={F(64.5)} volume={0.45} />

      <SceneHeading kicker="RETRIEVE WELL" accent={theme.accent} size={54}>
        One search isn't enough
      </SceneHeading>

      <CameraRig style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* ---- LANES ---- */}
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, opacity: pLanes, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ opacity: queryIn, transform: `scale(${interpolate(queryIn, [0, 1], [0.9, 1])})`, background: theme.surface, border: `2px solid ${theme.accent}`, borderRadius: 999, padding: "16px 34px", fontFamily: theme.fontMono, fontSize: 28, color: theme.text }}>
            query: "reset my password" + <span style={{ color: theme.accentWarm }}>ERR_4032</span>
          </div>
          <div style={{ display: "flex", gap: 80, marginTop: 6 }}>
            <Lane title="SEMANTIC" accent={theme.accent} hit={semHit} hitText={'✓ "account recovery"'} miss={semMiss} missText={"misses ERR_4032"} />
            <Lane title="KEYWORD" accent={theme.accentWarm} hit={keyHit} hitText={'✓ ERR_4032 (exact)'} miss={keyMiss} missText={"misses the paraphrase"} />
          </div>
        </div>

        {/* ---- MERGE / HYBRID ---- */}
        <div style={{ position: "absolute", top: 270, left: 0, right: 0, opacity: pMerge, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.accent }}>semantic</div>
            <div style={{ fontSize: 44, color: theme.text }}>＋</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.accentWarm }}>keyword</div>
          </div>
          <div style={{ fontSize: 40, color: theme.textMuted }}>↓</div>
          <div style={{ transform: `scale(${interpolate(mergeBox, [0, 1], [0.85, 1])})`, background: `linear-gradient(160deg, ${theme.accent}33, ${theme.surface})`, border: `2px solid ${theme.accent}`, borderRadius: 18, padding: "22px 50px", fontFamily: theme.fontSans, fontSize: 44, fontWeight: 800, color: theme.text, boxShadow: `0 0 ${30 + pulse * 18}px ${theme.accent}66` }}>
            HYBRID SEARCH
          </div>
          <div style={{ display: "flex", gap: 26, opacity: bothT }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#101613", border: `2px solid ${theme.accentGreen}`, borderRadius: 14, padding: "16px 24px" }}>
              <span style={{ fontSize: 30, color: theme.accentGreen }}>✓</span><span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.text }}>account recovery</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#101613", border: `2px solid ${theme.accentGreen}`, borderRadius: 14, padding: "16px 24px" }}>
              <span style={{ fontSize: 30, color: theme.accentGreen }}>✓</span><span style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.text }}>ERR_4032</span>
            </div>
          </div>
          <div style={{ opacity: bothT, fontFamily: theme.fontSans, fontSize: 30, color: theme.accentGreen, fontWeight: 700 }}>both captured — meaning AND exact terms</div>
        </div>

        {/* ---- RERANK ---- */}
        <div style={{ position: "absolute", top: 280, left: 0, right: 0, opacity: pRerank, display: "flex", justifyContent: "center", alignItems: "center", gap: 50 }}>
          {/* wide net */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>~50 candidates</div>
            <div style={{ width: 420, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 }}>
              {cards.map((_, i) => {
                const appear = interpolate(pour * 50, [i - 4, i], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const dim = 1 - rerankT * 0.7;
                return <div key={i} style={{ height: 30, borderRadius: 6, background: theme.accent, opacity: appear * 0.6 * dim }} />;
              })}
            </div>
          </div>
          {/* reranker */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: rerankT }}>
            <div style={{ width: 130, height: 130, borderRadius: 24, background: `radial-gradient(circle at 38% 32%, #a5b4fc, ${theme.accent} 55%, #4338ca)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontMono, fontSize: 22, fontWeight: 800, color: theme.text, boxShadow: `0 0 ${24 + pulse * 16}px ${theme.accent}88`, textAlign: "center", lineHeight: 1.1 }}>RE<br />RANK</div>
            <div style={{ fontSize: 40, color: theme.text }}>→</div>
          </div>
          {/* best 3 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: best3 }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accentGreen, marginBottom: 2 }}>best 3</div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ transform: `translateY(${(1 - best3) * 24}px)`, width: 300, background: "#101613", border: `2px solid ${theme.accentGreen}`, borderRadius: 12, padding: "16px 20px", fontFamily: theme.fontMono, fontSize: 26, color: theme.text, boxShadow: `0 0 ${10 + pulse * 10}px ${theme.accentGreen}55`, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: theme.accentGreen, fontWeight: 800 }}>#{i + 1}</span> top match
              </div>
            ))}
          </div>
        </div>

        {/* ---- KICKER ---- */}
        <div style={{ position: "absolute", top: 280, left: 0, right: 0, opacity: pKicker, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { t: chip1, label: "contextual embeddings" },
              { t: chip2, label: "hybrid search" },
              { t: chip3, label: "reranking" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {i > 0 && <span style={{ fontSize: 38, color: theme.textMuted }}>+</span>}
                <div style={{ transform: `scale(${interpolate(c.t, [0, 1], [0.8, 1])})`, opacity: c.t, background: theme.surface, border: `2px solid ${theme.accent}`, borderRadius: 14, padding: "16px 26px", fontFamily: theme.fontMono, fontSize: 28, color: theme.text }}>{c.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 44, color: theme.textMuted, opacity: heroPop }}>↓</div>
          <div style={{ transform: `scale(${interpolate(heroPop, [0, 1], [0.6, 1])})`, opacity: heroPop, textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontSans, fontSize: 130, fontWeight: 900, lineHeight: 1, ...gradientText("#6ee7b7", theme.accentGreen), filter: `drop-shadow(0 0 ${20 + heroPulse * 20}px ${theme.accentGreen}66)` }}>−67%</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 38, fontWeight: 700, color: theme.text, marginTop: 8 }}>failed retrievals</div>
          </div>
          <div style={{ opacity: capT, fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>in Anthropic's own testing · the modern retrieval stack</div>
        </div>

      </CameraRig>
    </AbsoluteFill>
  );
};
