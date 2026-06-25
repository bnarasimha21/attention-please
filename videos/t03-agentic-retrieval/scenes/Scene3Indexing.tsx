import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, SceneHeading, ModelCore, gradientText, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 3 — Index it right: chunking + contextual retrieval (t03)
// BREAK: a chunk drifts off its heading → retrieved with no context → confused ✕.
// FIX: a cheap model prepends a context blurb → chunk retrieves correctly ✓.
// PAYOFF: failed retrievals −35% (contextual embeddings); −49%/−67% queued next scene.

export const Scene3Indexing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const F = (s: number) => fps * s;
  const seg = (a: number, b: number, c: number, d: number) =>
    interpolate(frame, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase envelopes (cross-faded so phases never collide)
  const pBreak = seg(F(1), F(1.8), F(28.5), F(30));
  const pFix = seg(F(30.5), F(31.3), F(48.5), F(50));
  const pBar = interpolate(frame, [F(50.5), F(51.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Break internals
  const sliceIn = pop(frame, fps, F(2), { damping: 13 });
  const drift = interpolate(frame, [F(7), F(12)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headingFade = interpolate(frame, [F(8), F(12)], [1, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const retrieveT = interpolate(frame, [F(16), F(20)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const confusedT = interpolate(frame, [F(20), F(22)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fix internals
  const blurbType = interpolate(frame, [F(34), F(39)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const prependT = interpolate(frame, [F(40), F(43)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fixGood = interpolate(frame, [F(44), F(47)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bar internals
  const bar1 = interpolate(frame, [F(52), F(55)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar2 = interpolate(frame, [F(57), F(59)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar3 = interpolate(frame, [F(60), F(62)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const blink = Math.sin(frame / 5) > 0;

  const blurb = "[Refund policy] ";
  const shownBlurb = blurb.slice(0, Math.max(0, Math.round(blurb.length * blurbType)));

  const rows = [
    { label: "contextual embeddings", pct: "−35%", t: bar1, active: true, w: 0.35 },
    { label: "+ hybrid search", pct: "−49%", t: bar2, active: false, w: 0.49 },
    { label: "+ reranking", pct: "−67%", t: bar3, active: false, w: 0.67 },
  ];

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />
      <Sfx name="whoosh" at={F(7)} volume={0.3} />
      <Sfx name="error" at={F(20.5)} volume={0.4} />
      <Sfx name="pop" at={F(40)} volume={0.35} />
      <Sfx name="success" at={F(45)} volume={0.4} />
      <Sfx name="tick" at={F(53)} volume={0.35} />
      <Sfx name="tick" at={F(58)} volume={0.3} />
      <Sfx name="tick" at={F(61)} volume={0.3} />

      <SceneHeading kicker="INDEX IT RIGHT" accent={theme.accentGreen} size={54}>
        It's won or lost <span style={gradientText("#6ee7b7", theme.accentGreen)}>before</span> you search
      </SceneHeading>

      <CameraRig style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* ---- BREAK: chunk loses its context ---- */}
        <div style={{ position: "absolute", top: 280, left: 0, right: 0, opacity: pBreak, display: "flex", justifyContent: "center", gap: 56, alignItems: "center" }}>
          {/* document */}
          <div style={{ width: 440, background: theme.surface, border: `2px solid ${theme.border}`, borderRadius: 18, padding: 28, transform: `scale(${interpolate(sliceIn, [0, 1], [0.9, 1])})` }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textDim, marginBottom: 16 }}>policy.md</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.accentGreen, opacity: headingFade, marginBottom: 14 }}>## Section 4 · Refunds</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 25, color: theme.textMuted, lineHeight: 1.8 }}>
              <div>Refunds within 30 days.</div>
              <div style={{ opacity: 1 - drift * 0.8, color: drift > 0.3 ? theme.accentRed : theme.textMuted }}>The fee is $50.</div>
              <div>Contact support to start.</div>
            </div>
          </div>

          {/* drifting naked chunk */}
          <div style={{
            transform: `translateX(${drift * 30}px)`,
            width: 340, background: "#15151b", border: `2px solid ${theme.accentRed}`, borderRadius: 16, padding: "24px 26px",
            opacity: drift, boxShadow: `0 0 ${drift * 28}px ${theme.accentRed}44`,
          }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, marginBottom: 10 }}>chunk · no context</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 30, color: theme.text }}>"The fee is $50."</div>
          </div>

          {/* retrieve → confused */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: retrieveT }}>
            <ModelCore size={120} label="MODEL" fontSize={22} pulse={0.3 + pulse * 0.2} />
            <div style={{ opacity: confusedT, fontFamily: theme.fontSans, fontSize: 28, color: theme.accentRed, fontWeight: 700 }}>✕ "$50 fee for what?"</div>
          </div>
        </div>

        {/* ---- FIX: prepend context ---- */}
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, opacity: pFix, display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 220 }}>
              <div style={{ fontSize: 54 }}>⚡</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 26, color: theme.accentGreen, fontWeight: 700 }}>cheap model</div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim }}>writes context ✎{blink ? "|" : " "}</div>
            </div>
            <div style={{ fontSize: 46, color: theme.accentGreen, opacity: prependT }}>→</div>
            <div style={{
              width: 600, background: "#101613", border: `2px solid ${theme.accentGreen}`, borderRadius: 16, padding: "26px 30px",
              boxShadow: `0 0 ${fixGood * 32}px ${theme.accentGreen}55`,
            }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, marginBottom: 10 }}>chunk · contextualized</div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 31, color: theme.text }}>
                "<span style={{ color: theme.accentGreen, fontWeight: 700 }}>{shownBlurb}</span>The fee is $50."
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: fixGood }}>
            <ModelCore size={104} label="MODEL" fontSize={20} pulse={pulse * 0.4} />
            <div style={{ fontFamily: theme.fontSans, fontSize: 30, color: theme.accentGreen, fontWeight: 700 }}>✓ retrieved with its context</div>
          </div>
        </div>

        {/* ---- BAR: failed retrievals dropping ---- */}
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, opacity: pBar, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ fontFamily: theme.fontSans, fontSize: 40, fontWeight: 800, color: theme.text }}>Failed retrievals, dropping</div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted, marginBottom: 10 }}>in Anthropic's own testing</div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, width: 1180, opacity: r.t * (r.active ? 1 : 0.6) }}>
              <div style={{ width: 380, textAlign: "right", fontFamily: theme.fontSans, fontSize: 30, color: r.active ? theme.text : theme.textDim, fontWeight: r.active ? 700 : 500 }}>{r.label}</div>
              <div style={{ flex: 1, height: 36, borderRadius: 18, background: theme.border, overflow: "hidden" }}>
                <div style={{
                  width: `${r.t * r.w * 100}%`, height: "100%", borderRadius: 18,
                  background: r.active ? `linear-gradient(90deg, ${theme.accentGreen}, #6ee7b7)` : "#3a3a44",
                  boxShadow: r.active ? `0 0 ${18 + pulse * 14}px ${theme.accentGreen}88` : "none",
                }} />
              </div>
              <div style={{ width: 120, fontFamily: theme.fontMono, fontSize: 36, fontWeight: 800, color: r.active ? theme.accentGreen : theme.textDim, transform: r.active ? `scale(${1 + pulse * 0.03})` : "none" }}>{r.pct}</div>
              <div style={{ width: 160, fontFamily: theme.fontMono, fontSize: 22, color: theme.accent }}>{r.active ? "" : "next scene →"}</div>
            </div>
          ))}
        </div>

      </CameraRig>
    </AbsoluteFill>
  );
};
