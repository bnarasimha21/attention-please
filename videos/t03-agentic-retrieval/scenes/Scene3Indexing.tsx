import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, CameraRig, SceneHeading, ModelCore, gradientText, pop } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 3 — Index it right: chunking + contextual retrieval (t03)
// Re-timed to recorded VO — 2439 frames @30fps. Continuous motion, beats land on words.
// BREAK: a chunk drifts off its heading → retrieved with no context → confused ✕.
// FIX: a cheap model prepends a context blurb → chunk retrieves correctly ✓.
// PAYOFF: failed retrievals cut by ~a third (Anthropic's own testing).

export const Scene3Indexing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seg = (a: number, b: number, c: number, d: number) =>
    interpolate(frame, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ramp = (a: number, b: number, lo = 0, hi = 1) =>
    interpolate(frame, [Math.max(0, a), Math.max(0, b)], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ===== Beat frames (from scene start) =====
  // f0    basic loop          f216  skip — happens at indexing
  // f505  start with chunking f550  split loses context
  // f703  naked blob "$50"    f850  no record of Section 4
  // f969  model has no idea   f1089 too big/too small
  // f1229 sets a ceiling      f1361 contextual retrieval
  // f1516 cheap model prepends f1741 "in refund policy, the fee..."
  // f1900 carries its context f1999 cut failed retrievals ~a third
  // f2302 fix the index, downstream easier

  // ===== Phase envelopes (cross-faded ~0.4s so phases never collide) =====
  const pLoop  = seg(8, 30, 200, 224);          // f0   basic loop intro
  const pBreak = seg(230, 260, 1058, 1082);     // f216 chunking break (drift → confused)
  const pCeil  = seg(1078, 1108, 1326, 1350);   // f1089 too big/small → ceiling
  const pFix   = seg(1346, 1378, 1956, 1980);   // f1361 contextual retrieval fix
  const pStat  = seg(1976, 2004, 2276, 2294);   // f1999 the stat
  const pClose = ramp(2288, 2312);              // f2302 closing line

  // ===== BASIC LOOP internals (f0–f216) =====
  const loopEmbedDoc = pop(frame, fps, 20, { damping: 13 });
  const loopEmbedQ   = pop(frame, fps, 70, { damping: 13 });
  const loopNearest  = ramp(110, 160);
  const loopArrow    = ramp(150, 200);

  // ===== BREAK internals (f216–f1089) =====
  const sliceIn     = pop(frame, fps, 250, { damping: 13 });        // doc appears (chunking)
  const splitT      = ramp(560, 660);                              // f550 split happens
  const drift       = ramp(700, 840);                              // f703 chunk drifts off as naked blob
  const headingFade = ramp(840, 940, 1, 0.18);                     // f850 heading record lost
  const retrieveT   = ramp(960, 1000);                            // f969 retrieve
  const confusedT   = ramp(995, 1040);                            // f969 model has no idea

  // ===== CEILING internals (f1089–f1361) =====
  const bigT   = ramp(1100, 1160);   // f1089 too big → noise
  const smallT = ramp(1160, 1220);   // too small → lose meaning
  const ceilT  = ramp(1235, 1300);   // f1229 ceiling bar

  // ===== FIX internals (f1361–f1999) =====
  const fixDoc    = pop(frame, fps, 1380, { damping: 13 });          // f1361 contextual retrieval reveal
  const blurbType = ramp(1530, 1720);                              // f1516 cheap model writes note
  const prependT  = ramp(1716, 1760);                             // f1741 prepend lands
  const morphT    = ramp(1745, 1880);                             // "the fee is $50" → "in refund policy..."
  const fixGood   = ramp(1900, 1960);                             // f1900 carries its context ✓

  // ===== STAT internals (f1999–f2302) =====
  const heroPop  = pop(frame, fps, 2010, { damping: 11 });          // f1999 hero number reveals
  const heroPulse = 0.5 + 0.5 * Math.sin(frame / 9);
  const subT     = ramp(2110, 2170);                             // "in Anthropic's own testing"
  const barFill  = ramp(2030, 2150);                             // bar drops behind hero

  // ===== CLOSE internals (f2302–end) =====
  const closePop = pop(frame, fps, 2312, { damping: 12 });

  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const blink = Math.sin(frame / 5) > 0;
  // Scan line that sweeps the doc during the f216→f505 quiet window, then parks.
  const scanY = interpolate(frame, [300, 540], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Naked → contextualized morph text
  const blurb = "in the refund policy, ";
  const shownBlurb = blurb.slice(0, Math.max(0, Math.round(blurb.length * blurbType)));

  return (
    <AbsoluteFill>
      <SceneBackground glow={theme.accentGreen} />
      <Sfx name="pop" at={20} volume={0.3} />
      <Sfx name="pop" at={70} volume={0.3} rate={1.1} />
      <Sfx name="whoosh" at={700} volume={0.3} />
      <Sfx name="error" at={1000} volume={0.4} />
      <Sfx name="tick" at={1100} volume={0.3} />
      <Sfx name="tick" at={1160} volume={0.3} rate={1.08} />
      <Sfx name="pop" at={1716} volume={0.35} rate={0.92} />
      <Sfx name="success" at={1905} volume={0.4} />
      <Sfx name="stinger" at={2010} volume={0.45} rate={1.07} />
      <Sfx name="success" at={2312} volume={0.35} rate={0.95} />

      <SceneHeading kicker="INDEX IT RIGHT" accent={theme.accentGreen} size={54}>
        It's won or lost <span style={gradientText("#6ee7b7", theme.accentGreen)}>before</span> you search
      </SceneHeading>

      <CameraRig style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* ---- BASIC LOOP: embed docs, embed query, grab nearest ---- */}
        <div style={{ position: "absolute", top: 320, left: 0, right: 0, opacity: pLoop, display: "flex", justifyContent: "center", alignItems: "center", gap: 44 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${interpolate(loopEmbedDoc, [0, 1], [0.85, 1])})` }}>
            <div style={{ fontSize: 50 }}>📄</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.text }}>embed docs</div>
          </div>
          <div style={{ fontSize: 46, color: theme.accentGreen, opacity: loopEmbedQ }}>→</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: loopEmbedQ, transform: `scale(${interpolate(loopEmbedQ, [0, 1], [0.85, 1])})` }}>
            <div style={{ fontSize: 50 }}>🔎</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.text }}>embed query</div>
          </div>
          <div style={{ fontSize: 46, color: theme.accentGreen, opacity: loopArrow }}>→</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: loopNearest, transform: `translateY(${(1 - loopNearest) * 20}px)` }}>
            <div style={{ fontSize: 50 }}>🧩</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.textMuted }}>grab nearest chunks</div>
          </div>
        </div>

        {/* ---- BREAK: chunk loses its context ---- */}
        <div style={{ position: "absolute", top: 280, left: 0, right: 0, opacity: pBreak, display: "flex", justifyContent: "center", gap: 56, alignItems: "center" }}>
          {/* document */}
          <div style={{ position: "relative", overflow: "hidden", width: 440, background: theme.surface, border: `2px solid ${theme.border}`, borderRadius: 18, padding: 28, transform: `scale(${interpolate(sliceIn, [0, 1], [0.9, 1])})` }}>
            {/* sweeping scan highlight — keeps motion alive while VO sets up chunking */}
            <div style={{ position: "absolute", left: 0, right: 0, top: `${interpolate(scanY, [0, 1], [6, 88])}%`, height: 44, background: `linear-gradient(180deg, transparent, ${theme.accentGreen}22, transparent)`, opacity: (1 - drift) * 0.9, pointerEvents: "none" }} />
            <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textDim, marginBottom: 16 }}>policy.md</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.accentGreen, opacity: headingFade, marginBottom: 14 }}>## Section 4 · Refunds</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 25, color: theme.textMuted, lineHeight: 1.8 }}>
              <div>Refunds within 30 days.</div>
              <div style={{ opacity: 1 - drift * 0.8, color: drift > 0.3 ? theme.accentRed : theme.textMuted, transform: `translateY(${splitT * -3}px)` }}>The fee is $50.</div>
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

        {/* ---- CEILING: too big / too small ---- */}
        <div style={{ position: "absolute", top: 320, left: 0, right: 0, opacity: pCeil, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", gap: 70, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: bigT, transform: `translateY(${(1 - bigT) * 18}px)` }}>
              <div style={{ width: 360, background: "#1a1113", border: `2px solid ${theme.accentRed}`, borderRadius: 14, padding: "26px 24px", fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted, lineHeight: 1.6 }}>
                large chunk · lots of unrelated text…
              </div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.accentRed }}>too big → noise</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: smallT, transform: `translateY(${(1 - smallT) * 18}px)` }}>
              <div style={{ width: 200, background: "#1a1113", border: `2px solid ${theme.accentRed}`, borderRadius: 14, padding: "26px 24px", fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>"$50."</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 30, fontWeight: 700, color: theme.accentRed }}>too small → lose meaning</div>
            </div>
          </div>
          <div style={{ opacity: ceilT, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `scale(${interpolate(ceilT, [0, 1], [0.9, 1])})` }}>
            <div style={{ fontFamily: theme.fontSans, fontSize: 34, fontWeight: 800, color: theme.text }}>this sets a <span style={gradientText("#fca5a5", theme.accentWarm)}>ceiling</span> on quality</div>
            <div style={{ width: 720, height: 10, borderRadius: 6, background: theme.border, overflow: "hidden" }}>
              <div style={{ width: `${ceilT * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.accentWarm}, ${theme.accentRed})`, boxShadow: `0 0 ${14 + pulse * 10}px ${theme.accentWarm}88` }} />
            </div>
          </div>
        </div>

        {/* ---- FIX: prepend context (contextual retrieval) ---- */}
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, opacity: pFix, display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.accentGreen, letterSpacing: 1, opacity: fixDoc, transform: `translateY(${(1 - fixDoc) * 14}px)` }}>contextual retrieval · Anthropic</div>
          <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `scale(${interpolate(fixDoc, [0, 1], [0.92, 1])})` }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 240 }}>
              <div style={{ fontSize: 54, transform: `scale(${1 + pulse * 0.06})` }}>⚡</div>
              <div style={{ fontFamily: theme.fontSans, fontSize: 26, color: theme.accentGreen, fontWeight: 700 }}>cheap model</div>
              {/* caret is ALWAYS rendered (constant width) and just toggles opacity —
                  toggling the character itself reflows/wraps the line and makes it jump. */}
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, whiteSpace: "nowrap" }}>writes context ✎<span style={{ opacity: blink ? 1 : 0 }}>|</span></div>
            </div>
            <div style={{ fontSize: 46, color: theme.accentGreen, opacity: prependT }}>→</div>
            <div style={{
              width: 640, background: "#101613", border: `2px solid ${theme.accentGreen}`, borderRadius: 16, padding: "26px 30px",
              boxShadow: `0 0 ${fixGood * 32}px ${theme.accentGreen}55`,
            }}>
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim, marginBottom: 10 }}>chunk · contextualized</div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 31, color: theme.text }}>
                "<span style={{ color: theme.accentGreen, fontWeight: 700, opacity: morphT }}>{shownBlurb}</span>the fee is $50."
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: fixGood, transform: `translateY(${(1 - fixGood) * 16}px)` }}>
            <ModelCore size={104} label="MODEL" fontSize={20} pulse={pulse * 0.4} />
            <div style={{ fontFamily: theme.fontSans, fontSize: 30, color: theme.accentGreen, fontWeight: 700 }}>✓ same chunk, now carries its context</div>
          </div>
        </div>

        {/* ---- STAT: failed retrievals cut by ~a third ---- */}
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, opacity: pStat, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={{ fontFamily: theme.fontSans, fontSize: 40, fontWeight: 800, color: theme.text, opacity: heroPop }}>failed retrievals, dropping</div>
          <div style={{ transform: `scale(${interpolate(heroPop, [0, 1], [0.5, 1])})`, opacity: heroPop, textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontSans, fontSize: 150, fontWeight: 900, lineHeight: 1, ...gradientText("#6ee7b7", theme.accentGreen), filter: `drop-shadow(0 0 ${22 + heroPulse * 22}px ${theme.accentGreen}66)` }}>−⅓</div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 36, fontWeight: 700, color: theme.text, marginTop: 6 }}>about a third fewer failures</div>
          </div>
          <div style={{ width: 760, height: 18, borderRadius: 10, background: theme.border, overflow: "hidden" }}>
            <div style={{ width: `${(1 - barFill * 0.33) * 100}%`, height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${theme.accentGreen}, #6ee7b7)`, boxShadow: `0 0 ${16 + pulse * 12}px ${theme.accentGreen}88` }} />
          </div>
          <div style={{ opacity: subT, fontFamily: theme.fontMono, fontSize: 26, color: theme.textMuted }}>in Anthropic's own testing</div>
        </div>

        {/* ---- CLOSE: fix the index ---- */}
        <div style={{ position: "absolute", top: 0, bottom: 165, left: 0, right: 0, opacity: pClose, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `scale(${interpolate(closePop, [0, 1], [0.72, 1])})`, textAlign: "center", maxWidth: 1400, filter: `drop-shadow(0 0 ${26 + pulse * 14}px ${theme.accentGreen}44)` }}>
            <div style={{ fontFamily: theme.fontSans, fontSize: 72, fontWeight: 900, color: theme.text, lineHeight: 1.15 }}>
              Fix the <span style={gradientText("#6ee7b7", theme.accentGreen)}>index</span>,
            </div>
            <div style={{ fontFamily: theme.fontSans, fontSize: 72, fontWeight: 900, color: theme.text, lineHeight: 1.15 }}>
              everything downstream gets easier.
            </div>
          </div>
        </div>

      </CameraRig>
    </AbsoluteFill>
  );
};
