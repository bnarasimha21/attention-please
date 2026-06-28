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
  const seg = (a: number, b: number, c: number, d: number) =>
    interpolate(frame, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat frames (spoken, from scene start @30fps), expressed via helper.
  // f0 intro · f144 "result worth knowing" · f225 semantic · f330 paraphrase find ·
  // f586 blind spot exact terms · f770 keyword beat vector · f1060 hybrid ·
  // f1305 both captured · f1421 reranking · f1510 wide net 50 · f1619 re-reads ·
  // f1756 best three · f1970 stack all · f2165 −67% (Anthropic) · f2300 same docs ·
  // f2454 modern retrieval stack · end 2551.
  const ff = (n: number) => n; // frame literal (kept readable)

  // Phase envelopes (cross-faded ~0.4s so phases never collide)
  // Boundaries overlap by ~0.4s (12f) so one phase is fading in as the prior fades out.
  const pLanes = seg(ff(20), ff(44), ff(1024), ff(1048));
  const pMerge = seg(ff(1036), ff(1072), ff(1397), ff(1421));
  const pRerank = seg(ff(1409), ff(1445), ff(1922), ff(1946));
  const pKicker = interpolate(frame, [ff(1934), ff(1990)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Lanes internals — paced across the long lanes window (f20→f1000)
  const queryIn = pop(frame, fps, ff(40), { damping: 12 });
  // semantic understands MEANING (f225) → finds paraphrase doc (f330)
  const semHit = interpolate(frame, [ff(330), ff(440)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // blind spot: exact terms (f586) — semantic misses the code
  const semMiss = interpolate(frame, [ff(586), ff(680)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // keyword nails the exact code (f586→), and on benchmarks even beats vectors (f770)
  const keyHit = interpolate(frame, [ff(640), ff(760)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyMiss = interpolate(frame, [ff(770), ff(880)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // benchmark callout — keyword BEAT vector on some 2026 benchmarks (f770), held to phase end
  const benchT = interpolate(frame, [ff(820), ff(920)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Merge internals — "use BOTH" f1060 → "both captured" f1305
  const mergeBox = pop(frame, fps, ff(1120), { damping: 12 });
  const bothT = interpolate(frame, [ff(1255), ff(1350)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Rerank internals — wide net f1510, reranker re-reads f1619, best 3 rise f1756
  const pour = interpolate(frame, [ff(1465), ff(1600)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rerankT = interpolate(frame, [ff(1619), ff(1700)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const best3 = interpolate(frame, [ff(1756), ff(1880)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Kicker internals — chips f1970, hero −67% lands on "Anthropic's own testing" f2165
  const chip1 = pop(frame, fps, ff(1990), { damping: 12 });
  const chip2 = pop(frame, fps, ff(2040), { damping: 12 });
  const chip3 = pop(frame, fps, ff(2090), { damping: 12 });
  const heroPop = pop(frame, fps, ff(2165), { damping: 10 });
  const heroPulse = 0.5 + 0.5 * Math.sin(frame / 9);
  // "in Anthropic's own testing" reads with the stat; "modern retrieval stack" f2454
  const capT = interpolate(frame, [ff(2300), ff(2370)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Kicker (stat) fades fully OUT before the punchline rises — they share the
  // vertical center, so a simultaneous cross collides. Sequential, tiny overlap.
  const kickOut = interpolate(frame, [ff(2436), ff(2468)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stackT = interpolate(frame, [ff(2466), ff(2506)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const cards = Array.from({ length: 50 });
  const kickerChips = [
    { t: chip1, label: "contextual embeddings" },
    { t: chip2, label: "hybrid search" },
    { t: chip3, label: "reranking" },
  ];

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
      <Sfx name="pop" at={ff(330)} volume={0.3} />
      <Sfx name="pop" at={ff(640)} volume={0.3} rate={1.1} />
      <Sfx name="success" at={ff(1260)} volume={0.4} />
      <Sfx name="whoosh" at={ff(1465)} volume={0.35} />
      <Sfx name="success" at={ff(1756)} volume={0.35} rate={0.95} />
      <Sfx name="stinger" at={ff(2165)} volume={0.45} />

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
          <div style={{ opacity: benchT, transform: `translateY(${(1 - benchT) * 18}px) scale(${1 + benchT * pulse * 0.02})`, marginTop: 8, background: `${theme.accentWarm}1a`, border: `2px solid ${theme.accentWarm}`, borderRadius: 14, padding: "14px 28px", fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.accentWarm, boxShadow: `0 0 ${benchT * (16 + pulse * 12)}px ${theme.accentWarm}55` }}>
            on some 2026 benchmarks, plain keyword <span style={{ color: theme.text }}>beat</span> vector search outright
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
          <div style={{ opacity: bothT, fontFamily: theme.fontSans, fontSize: 30, color: theme.accentGreen, fontWeight: 700 }}>both captured: meaning AND exact terms</div>
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

        {/* ---- KICKER (stack chips + hero stat) — fades out as the punchline rises ---- */}
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, opacity: pKicker * (1 - kickOut), display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
            {kickerChips.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {i > 0 && <span style={{ fontSize: 38, color: theme.textMuted }}>+</span>}
                <div style={{ transform: `scale(${interpolate(c.t, [0, 1], [0.8, 1])})`, opacity: c.t, background: theme.surface, border: `2px solid ${theme.accent}`, borderRadius: 14, padding: "16px 26px", fontFamily: theme.fontMono, fontSize: 28, color: theme.text }}>{c.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 44, color: theme.textMuted, opacity: heroPop }}>↓</div>
          <div style={{ transform: `scale(${interpolate(heroPop, [0, 1], [0.6, 1])})`, opacity: heroPop, textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontSans, fontSize: 150, fontWeight: 900, lineHeight: 1, ...gradientText("#6ee7b7", theme.accentGreen), filter: `drop-shadow(0 0 ${20 + heroPulse * 20}px ${theme.accentGreen}66)` }}>−67%</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 40, fontWeight: 700, color: theme.text, marginTop: 8 }}>failed retrievals</div>
            <div style={{ opacity: heroPop, fontFamily: theme.fontMono, fontSize: 28, color: theme.textMuted, marginTop: 12 }}>in Anthropic's own testing</div>
          </div>
          <div style={{ opacity: capT, fontFamily: theme.fontSans, fontSize: 32, color: theme.text, fontWeight: 600 }}>same documents · same model · the right context, far more often</div>
        </div>

        {/* ---- PUNCHLINE (stands alone, big) ---- */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, opacity: stackT, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 30, letterSpacing: 4, color: theme.accentGreen, textTransform: "uppercase", opacity: stackT }}>That's it</div>
          <div style={{ transform: `scale(${interpolate(stackT, [0, 1], [0.8, 1])})`, fontFamily: theme.fontSans, fontSize: 78, fontWeight: 900, textAlign: "center", lineHeight: 1.05, ...gradientText("#a5b4fc", theme.accent), filter: `drop-shadow(0 0 ${18 + heroPulse * 18}px ${theme.accent}66)` }}>
            the modern<br />retrieval stack
          </div>
        </div>

      </CameraRig>
    </AbsoluteFill>
  );
};
