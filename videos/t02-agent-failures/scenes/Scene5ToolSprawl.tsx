import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";
import { Sfx } from "../../../remotion-src/sfx";

// Scene 5 - Failure 3: Tool Sprawl  (break -> fix DEMONSTRATION, re-paced to ~124.9s / 3747f)
// NAIVE: 50 vague tools crowd the frame; an animated cursor HESITATES, bouncing
//   between two look-alikes while a "deciding" timer climbs, then makes a wrong
//   over-pick (red flash). Sprawl shown as INDECISION.
// FIX: a tool_search step narrows the catalogue to 3-5 relevant tools; the cursor
//   now picks INSTANTLY (green). Hero counters 55K->3K tokens, 49%->74% accuracy;
//   then code mode wraps the calls (-37% tokens). Punchline.

const VAGUE = [
  "read_file", "get_file_contents", "fetch_file", "load_file", "open_file",
  "search_codebase", "grep_files", "find_in_code", "locate_symbol", "query_repo",
  "list_dir", "scan_folder", "enumerate_files", "walk_tree", "get_files",
  "edit_file", "modify_file", "patch_file", "update_code", "write_changes",
  "run_command", "exec_shell", "run_script", "invoke_tool", "call_process",
  "http_get", "fetch_url", "web_request", "download", "curl_exec",
  "parse_json", "read_config", "get_settings", "load_env", "fetch_meta",
  "create_file", "make_file", "touch_file", "new_document", "init_file",
  "delete_file", "remove_file", "unlink_path", "trash_file", "purge_file",
  "ask_user", "prompt_human", "request_input", "get_confirm", "notify_user",
];

const SHARP = [
  { name: "read_file", desc: "Read a file at path" },
  { name: "search", desc: "Regex search across files" },
  { name: "edit_file", desc: "Find-replace edit a file" },
  { name: "run_command", desc: "Run a shell command" },
];

const COLS = 10;
const CELL_W = 150;
const CELL_H = 60;
const GAP_X = 8;
const GAP_Y = 12;
const GRID_W = COLS * CELL_W + (COLS - 1) * GAP_X;
const cellPos = (i: number) => ({
  x: (i % COLS) * (CELL_W + GAP_X),
  y: Math.floor(i / COLS) * (CELL_H + GAP_Y),
});

// Cursor pointer (matches the channel CTA cursor)
const Cursor: React.FC<{ x: number; y: number; dip?: number; tint?: string }> = ({ x, y, dip = 0, tint }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${1 - dip * 0.25})`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))", zIndex: 40 }}>
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path d="M4 2 L4 19 L9 14.5 L12.5 22 L15.5 20.5 L12 13.5 L18.5 13 Z" fill={tint ?? "#ffffff"} stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  </div>
);

export const Scene5ToolSprawl: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const green = theme.accentGreen;
  const warm = theme.accentWarm;
  const red = theme.accentRed;

  // ---- phase clock (seconds) - re-paced to the 124.9s narration clip ----
  // NAIVE (crowd + long hesitation) ~1->57s, FIX (search->pick->counters->code) ~60->108s,
  // punchline holds 116->end. Entrances stay snappy; the extra time goes to dwell.
  // Re-timed to the narration transcript (captions/s05): hesitation+overhead to
  // ~43s, "fewer/sharper" + load-on-demand 44->101, code mode 107->123.
  const crowdStart = fps * 1.0;
  const cursorStart = fps * 4.5;
  const timerStart = fps * 5.0;
  const wrongPick = fps * 24.0;     // "bad picks or hedges, two tools where one would do"
  const collapseStart = fps * 43.0; // "The fix? Fewer, sharper tools"
  const fixStart = fps * 44.0;
  const instantPick = fps * 63.0;   // "picks faster + better when the menu is short"
  const counterStart = fps * 88.0;  // "58 tools, 55,000 tokens -> ~3,000 ... 49 to 74%"
  const counterEnd = fps * 101.0;
  const codeStart = fps * 107.0;    // "one level further with code mode"
  const punchStart = fps * 122.5;

  // NAIVE crowd present until the collapse
  const crowdExit = interpolate(frame, [collapseStart, collapseStart + fps * 1.3], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT,
  });

  // cursor HESITATES across several look-alike tools (the indecision: "which of
  // all these do I pick?"). It wanders among 5 crowded read/get-file cells, then
  // commits to the wrong look-alike (idx 4, "open_file") at the wrong-pick beat.
  const HESITATE = [0, 2, 1, 3, 4]; // cells the "?" visits, in order; ends on the over-pick
  const WRONG_IDX = 4;              // the wrong look-alike it finally lands on
  const cursorOn = frame > cursorStart && frame < collapseStart;
  // step through the list ~every 1.6s; ease between targets so motion stays smooth
  const HOP = fps * 1.6;
  const hopRaw = (frame - cursorStart) / HOP;          // fractional hop progress
  const settleHop = (wrongPick - cursorStart) / HOP;   // hop index where it locks on the wrong pick
  const hop = Math.max(0, Math.min(hopRaw, settleHop)); // clamp >=0 (avoid negative index before cursorStart); freeze on wrong cell from wrongPick on
  const segIdx = Math.floor(hop);
  const fromCell = frame >= wrongPick ? WRONG_IDX : HESITATE[segIdx % HESITATE.length];
  const toCell = frame >= wrongPick ? WRONG_IDX : HESITATE[(segIdx + 1) % HESITATE.length];
  // ease-in-out the fractional part for a "wandering, can't-commit" feel
  const tRaw = hop - segIdx;
  const segT = tRaw < 0.5 ? 2 * tRaw * tRaw : 1 - Math.pow(-2 * tRaw + 2, 2) / 2;
  const pa = cellPos(fromCell);
  const pb = cellPos(toCell);
  const p0 = cellPos(0); // (kept for downstream layout refs)
  const naiveCx = interpolate(segT, [0, 1], [pa.x + CELL_W * 0.5, pb.x + CELL_W * 0.5]);
  const naiveCyRaw = interpolate(segT, [0, 1], [pa.y + CELL_H * 0.5, pb.y + CELL_H * 0.5]);
  const naiveCy = naiveCyRaw;
  // current top-of-cell for the ring/"?" (follows whichever row the "?" is over)
  const ringTop = interpolate(segT, [0, 1], [pa.y, pb.y]);
  const wrongFlash = interpolate(frame, [wrongPick, wrongPick + 6, wrongPick + fps * 0.9], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // deciding timer climbs, freezes at the wrong pick (scaled so the long
  // hesitation reads as a believable "~14s of indecision", not 45s)
  const timerSecs = Math.max(0, (Math.min(frame, wrongPick) - timerStart) / fps) * 0.3;

  // FIX
  const fixIn = interpolate(frame, [fixStart - fps * 0.3, fixStart + fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const searchPop = pop(frame, fps, fixStart + fps * 0.5, { damping: 12 });
  const litReveal = interpolate(frame, [fixStart + fps * 0.9, fixStart + fps * 2.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pickDip = interpolate(frame, [instantPick - 4, instantPick, instantPick + 8], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pickRing = interpolate(frame, [instantPick, instantPick + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tokenVal = interpolate(frame, [counterStart, counterEnd], [55, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const accVal = interpolate(frame, [counterStart, counterEnd], [49, 74], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const codePop = pop(frame, fps, codeStart, { damping: 11 });
  const capT = interpolate(frame, [fps * 114, fps * 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // "...fixes tool sprawl and context rot"
  const capOut = interpolate(frame, [punchStart - fps * 0.5, punchStart], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchT = interpolate(frame, [punchStart, punchStart + fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchPop = pop(frame, fps, punchStart, { damping: 13 });

  const subheadT = interpolate(frame, [fps * 0.6, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneBackground glow={theme.accent} />

      {/* SFX cues (scene-local frames) */}
      <Sfx name="tick" at={fps * 6} volume={0.3} />
      <Sfx name="tick" at={fps * 11} volume={0.3} />
      <Sfx name="tick" at={fps * 16} volume={0.3} />
      <Sfx name="tick" at={fps * 21} volume={0.3} />
      <Sfx name="error" at={wrongPick} volume={0.5} />
      <Sfx name="whoosh" at={fps * 43} volume={0.4} />
      <Sfx name="success" at={instantPick} volume={0.5} />
      <Sfx name="pop" at={counterEnd} volume={0.45} />
      <Sfx name="pop" at={codeStart} volume={0.4} />
      <Sfx name="stinger" at={fps * 119} volume={0.45} />

      <CameraRig>
        <div style={{ zIndex: 20 }}>
          <SceneHeading kicker="failure 3" accent={theme.accent}>
            Tool <span style={gradientText("#c7d2fe", theme.accent)}>Sprawl</span>
          </SceneHeading>
        </div>

        {/* Subhead */}
        <div style={{ position: "absolute", top: 232, width: "100%", textAlign: "center", fontFamily: theme.fontSans, fontSize: 30, fontWeight: 600, color: theme.textMuted, opacity: subheadT * crowdExit }}>
          More tools feels like more power. <span style={{ color: red, fontWeight: 800 }}>It's not.</span>
        </div>

        {/* ================= NAIVE - crowded vague tools + hesitating cursor ================= */}
        <div style={{ position: "absolute", top: 312, left: "50%", transform: `translateX(-50%) scale(${interpolate(crowdExit, [0, 1], [0.72, 1])})`, transformOrigin: "top center", width: GRID_W, opacity: crowdExit }}>
          <div style={{ position: "relative", width: GRID_W, height: 5 * (CELL_H + GAP_Y) }}>
            {VAGUE.map((name, i) => {
              const { x, y } = cellPos(i);
              const s = pop(frame, fps, crowdStart + i * 0.9, { damping: 13, stiffness: 160 });
              const isPair = HESITATE.includes(i);
              // glow the cell the "?" is currently over / heading toward
              const isActive = cursorOn && (i === fromCell || i === toCell);
              const pairGlow = isActive ? 0.5 + 0.5 * Math.sin((frame - cursorStart) / 5) : 0;
              const flashThis = i === WRONG_IDX ? wrongFlash : 0;
              return (
                <div key={name} style={{
                  position: "absolute", left: x, top: y, width: CELL_W, height: CELL_H,
                  transform: `scale(${0.6 + s * 0.4})`, opacity: s,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 10,
                  background: `linear-gradient(160deg, ${theme.accent}14, rgba(17,17,22,0.92))`,
                  border: `1px solid ${flashThis > 0.1 ? red : isPair ? `${warm}aa` : theme.border}`,
                  boxShadow: flashThis > 0.1 ? `0 0 ${flashThis * 30}px ${red}aa` : isPair ? `0 0 ${10 + pairGlow * 24}px ${warm}66` : "0 6px 16px rgba(0,0,0,0.4)",
                  fontFamily: theme.fontMono, fontSize: 17, color: theme.textMuted,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 8px",
                }}>
                  {name}
                </div>
              );
            })}

            {/* "which one?" ring wandering across several look-alike tools */}
            {cursorOn && (
              <>
                <div style={{ position: "absolute", left: naiveCx - CELL_W / 2 - 4, top: ringTop - 4, width: CELL_W + 8, height: CELL_H + 8, borderRadius: 12, border: `2px solid ${warm}`, boxShadow: `0 0 24px ${warm}aa` }} />
                <div style={{ position: "absolute", left: naiveCx - 11, top: ringTop - 54, fontFamily: theme.fontMono, fontSize: 40, fontWeight: 800, color: warm }}>?</div>
                <Cursor x={naiveCx + 8} y={naiveCy + 6} tint={wrongFlash > 0.1 ? red : "#ffffff"} />
              </>
            )}
          </div>
        </div>

        {/* deciding timer */}
        <div style={{ position: "absolute", top: 250, right: 150, textAlign: "right", opacity: interpolate(frame, [timerStart, timerStart + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * crowdExit }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textDim, letterSpacing: 2 }}>DECIDING…</div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 58, fontWeight: 800, color: frame >= wrongPick ? red : warm }}>{timerSecs.toFixed(1)}s</div>
        </div>

        {/* sprawl overhead + wrong-pick verdict */}
        <div style={{ position: "absolute", bottom: 210, width: "100%", textAlign: "center", opacity: interpolate(frame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * crowdExit }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: red, fontWeight: 700 }}>
            50 tools ≈ 55K tokens of schema - before the model writes a char
          </div>
          <div style={{ fontFamily: theme.fontSans, fontSize: 28, fontWeight: 700, color: red, marginTop: 12, opacity: wrongFlash > 0 || frame > wrongPick ? 1 : 0 }}>
            ✗ picked the wrong look-alike.
          </div>
        </div>

        {/* ================= FIX - load on demand, instant pick ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: fixIn, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 216, width: "100%", textAlign: "center", fontFamily: theme.fontSans, fontSize: 32, fontWeight: 700, color: theme.text }}>
            Fewer & sharper - <span style={gradientText("#c7d2fe", theme.accent)}>better still, loaded on demand</span>
          </div>

          {/* catalogue -> tool_search -> 3-5 lit tools */}
          <div style={{ position: "absolute", top: 268, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 34 }}>
            <div style={{ position: "relative", width: 360, height: 224, display: "flex", flexWrap: "wrap", gap: 6, alignContent: "flex-start", padding: 14, borderRadius: 16, background: "rgba(17,17,22,0.6)", border: `1px solid ${theme.border}` }}>
              {VAGUE.slice(0, 18).map((n) => (
                <div key={n} style={{ width: 100, height: 26, borderRadius: 5, background: "#1a1a22", border: `1px solid ${theme.border}`, fontFamily: theme.fontMono, fontSize: 12, color: theme.textDim, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", whiteSpace: "nowrap" }}>{n}</div>
              ))}
              <div style={{ position: "absolute", bottom: -36, width: "100%", left: 0, textAlign: "center", fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>full catalogue (deferred)</div>
            </div>

            <div style={{ transform: `scale(${0.6 + searchPop * 0.4})`, padding: "16px 26px", borderRadius: 999, background: `${theme.accent}1f`, border: `1px solid ${theme.accent}88`, fontFamily: theme.fontMono, fontSize: 26, fontWeight: 700, color: theme.accent, boxShadow: `0 0 26px ${theme.accent}55`, whiteSpace: "nowrap" }}>
              🔎 tool_search →
            </div>

            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
              {SHARP.map((t, i) => {
                const r = interpolate(litReveal, [i / SHARP.length, (i + 1) / SHARP.length], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const chosen = i === 0;
                return (
                  <div key={t.name} style={{ width: 300, height: 52, opacity: r, transform: `translateX(${(1 - r) * 24}px)`, borderRadius: 12, display: "flex", alignItems: "center", paddingLeft: 18, gap: 12, background: `linear-gradient(160deg, ${green}1f, rgba(12,16,14,0.92))`, border: `${chosen && pickRing > 0.1 ? 2 : 1}px solid ${green}${chosen && pickRing > 0.1 ? "" : "88"}`, boxShadow: `0 0 ${chosen ? 18 + pickRing * 26 : 18}px ${green}${chosen ? "aa" : "44"}`, fontFamily: theme.fontMono, fontSize: 25, fontWeight: 700, color: green }}>
                    <span style={{ fontSize: 22 }}>🔧</span>{t.name}
                    {chosen && pickRing > 0.4 && <span style={{ marginLeft: "auto", marginRight: 14, fontSize: 24, color: green }}>✓</span>}
                  </div>
                );
              })}
              <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted, marginTop: 6 }}>only 3–5 relevant / turn</div>
              {/* instant-pick cursor lands on the first tool */}
              {frame > instantPick - fps * 0.6 && (
                <Cursor x={186} y={10} dip={pickDip} tint="#ffffff" />
              )}
              {pickRing > 0.2 && (
                <div style={{ position: "absolute", left: 320, top: 12, fontFamily: theme.fontMono, fontSize: 26, fontWeight: 800, color: green, opacity: pickRing, whiteSpace: "nowrap" }}>← instant ✓</div>
              )}
            </div>
          </div>

          {/* hero counters - compact so number + label + was-line fit snugly inside */}
          <div style={{ position: "absolute", top: 522, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 64 }}>
            {[
              { val: `${Math.round(tokenVal)}K`, label: "schema tokens up-front", was: "was 55K" },
              { val: `${Math.round(accVal)}%`, label: "tool-selection accuracy", was: "was 49%" },
            ].map((c) => (
              <div key={c.label} style={{ width: 420, padding: "16px 28px 18px", borderRadius: 20, textAlign: "center", background: `linear-gradient(160deg, ${green}14, rgba(12,16,14,0.92))`, border: `1px solid ${green}55`, boxShadow: "0 16px 44px rgba(0,0,0,0.5)" }}>
                <div style={{ fontFamily: theme.fontMono, fontSize: 70, fontWeight: 800, color: green, lineHeight: 1 }}>{c.val}</div>
                <div style={{ fontFamily: theme.fontSans, fontSize: 25, color: theme.text, marginTop: 8 }}>{c.label}</div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 21, color: theme.textDim, marginTop: 4 }}>{c.was}</div>
              </div>
            ))}
          </div>
          {/* boxes span ~y522 -> ~677; footnote sits clearly below with a gap */}
          <div style={{ position: "absolute", top: 700, width: "100%", textAlign: "center", fontFamily: theme.fontMono, fontSize: 22, color: theme.textDim }}>
            * Anthropic internal eval (Tool Search Tool)
          </div>

          {/* code mode chip - own row, gaps above and below */}
          <div style={{ position: "absolute", top: 748, width: "100%", display: "flex", justifyContent: "center", opacity: codePop }}>
            <div style={{ transform: `scale(${0.7 + codePop * 0.3})`, display: "flex", alignItems: "center", gap: 18, padding: "16px 28px", borderRadius: 16, background: `linear-gradient(160deg, ${theme.accent}1f, rgba(17,17,22,0.95))`, border: `1px solid ${theme.accent}88`, boxShadow: `0 0 28px ${theme.accent}44`, fontFamily: theme.fontMono, fontSize: 26, fontWeight: 700, color: theme.text }}>
              <span>{"</>"} code mode - call tools in code, filter before context</span>
              <span style={{ padding: "8px 16px", borderRadius: 999, background: green, color: theme.bg, fontWeight: 800, fontSize: 24 }}>−37% tokens</span>
            </div>
          </div>
          <div style={{ position: "absolute", top: 838, width: "100%", textAlign: "center", opacity: capT * capOut, fontFamily: theme.fontSans, fontSize: 28, fontWeight: 700, color: theme.text }}>
            Fixes tool sprawl <span style={{ color: green }}>and</span> context rot.
          </div>
        </div>

        {/* Punchline */}
        <div style={{ position: "absolute", bottom: 205, width: "100%", textAlign: "center", opacity: punchT, transform: `translateY(${(1 - punchPop) * 16}px)`, zIndex: 25, padding: "0 120px" }}>
          <div style={{ fontFamily: theme.fontSans, fontSize: 36, fontWeight: 800, color: theme.text }}>
            Short menu → <span style={{ color: green }}>better picks</span>, fewer tokens.
          </div>
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
