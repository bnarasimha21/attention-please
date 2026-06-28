---
name: distilled-video
description: Produce a Distilled AI YouTube explainer video end-to-end with Remotion. Use when creating, editing, or finishing a tNN video in the distilled-ai repo — covers script→critique→improve, per-scene audio (record/trim), scene build, audio attach, Whisper subtitles, syncing animations to the narration, reserving subtitle-safe space, and rendering only on explicit confirmation.
---

# Distilled AI — video production pipeline

Canonical, ordered pipeline for every video (Narsi's spec). Several steps are
**human-in-the-loop** — do NOT skip the confirmation gates.

Repo conventions: one video per `videos/tNN-*/` with a `TNN*` component +
`scenes/Scene*.tsx` + `timings.ts`; shared toolkit in `remotion-src/`
(`SceneBackground / SceneHeading / CameraRig / pop`, theme, `Sfx`). 1920×1080 @30fps.
Register each composition in `remotion-src/Root.tsx`. Script in `scripts/tNN-*.md`.

## The steps

1. **Create the video script** — `scripts/tNN-<slug>.md`: title, duration target,
   scene-by-scene narration + an animation guide + on-screen code blocks.
   - **Pitch every script at INTERMEDIATE-TO-ADVANCED viewers** (Narsi's standing ask).
     Assume the audience already knows the fundamentals of the topic — do NOT spend a scene
     on "101" basics (e.g. don't teach "what is RAG / embed→retrieve→generate", "what is an
     LLM", basic prompt structure). Acknowledge the basics in a line, then go straight to the
     advanced, production-grade techniques, failure modes, tradeoffs, and real numbers that a
     working practitioner doesn't already know. Depth over breadth.
2. **Critique it** — adversarial pass for accuracy, clarity, pacing, hooks.
   - **ALWAYS run an INDEPENDENT critique before asking Narsi to review** (his standing
     ask). Spawn a SEPARATE critic subagent (not just your own self-check) to red-team the
     script across accuracy/overlap/clarity/pacing/voice/hook/missing-content. This is
     mandatory and happens up front — never hand Narsi a draft and offer the independent
     critique as an optional next step.
   - **Verify the claims** — every factual/number claim must be checked (deep-research
     workflow for depth); cite vendor numbers as vendor numbers ("in Anthropic's own testing").
     Don't cross-justify one soft figure with an unrelated one. Keep on-screen numbers as
     humble as the narration — if VO softens a figure, the animation/diagram must too
     (no hard "~45s"/"~60%"/acronyms the narration never defines).
   - **Cross-check the messaging** — does each scene say what it intends, in the right order, no contradictions? Check it does NOT re-teach material already shipped in earlier videos (read the prior `scripts/tNN-*.md`).
   - **Write in Matthew Berman's explainer voice** — conversational, high-energy, accessible;
     constant signposting ("Okay so…", "here's where it gets really cool", "let me break this
     down", "so just to recap"), direct "you" address, define every term immediately, honest
     about tradeoffs ("real talk, this isn't free…"), contractions, flowing spoken cadence —
     NOT terse/literary one-liners. (This OVERRIDES the old "match Narsi's article voice" rule —
     Narsi explicitly switched to Berman's style. See memory `distilled-ai-script-voice`.)
3. **Make it better** — fold the independent critique + research back into the script, THEN
   tell Narsi it's ready to review (critique + fixes always precede the "please review" message).
4. **Record audio per scene** — Narsi records (deliberately a little slow,
   ~135–140 wpm). Files land in `public/audio/tNN-<slug>/sNN.m4a` (one per scene).
   Always copy originals to `public/audio/tNN-<slug>/raw/` before processing.
5. **Trim silence** on each clip — `ffmpeg silenceremove` (~ -45dB, keep ~0.08s pad)
   at head and tail so it's tight/engaging. (See snippet below.)
6. **Create the scenes** — build `Scene*.tsx` as **"break → fix" DEMONSTRATIONS**
   (show the problem happen, then the guard visibly stop it — not static labels).
   - **Check memory first for the animation types Narsi likes** (`distilled-ai-video-style`
     and per-video notes) and use those — kinetic typography, overshoot `pop` entrances,
     CameraRig motion, counters/meters, break→fix demos, SFX cues. Default to his proven motifs.
   - Apply the standing layout rules (below). Add SFX cues via the `Sfx` helper.
7. **Attach audio to scenes** — wire per-scene `<Audio>` in `TNN*.tsx`; set each
   scene `duration` in `timings.ts` = trimmed clip length + ~0.7s tail.
8. **Create subtitles** — transcribe locally with Whisper (see snippet); produce
   per-scene `captions/sNN.{srt,vtt,json}` and a combined `tNN-<slug>.srt`/`.vtt`
   offset by each scene's global start frame; fix obvious ASR homophones.
9. **Re-adjust animations to the narration** — using the per-segment/token ms
   timestamps, move each scene's beat + SFX so it fires exactly when its phrase is
   spoken (not proportional guesses). Timing/SFX only — never alter the polished
   layout in this step.
10. **Give room for subtitles** — reserve a subtitle-safe zone at the bottom so
    on-screen content never overlaps the subtitles. Keep essential content above
    ~y=915 (reserve the bottom ~165px band); move any bottom captions/closing
    lines up out of that band.
11. **Render only on confirmation** — iterate in Remotion Studio until Narsi
    confirms it's working *to his satisfaction*. Do NOT render the mp4 until he
    explicitly says go. Then apply the **global speed-up LAST**: speed the final
    render uniformly (`ffmpeg setpts` video + `atempo` audio, pitch preserved) to
    land ~150–165 wpm; tunable by ear, A/V sync auto-preserved.

## Version control — commit changes to the repo
- **Commit at milestones**, not just at the end: after the script is approved, after
  scenes build clean, after audio is synced, after the subtitle-safe pass, etc. Each
  commit should leave the composition compiling.
- Commit (and push) **only when Narsi asks or confirms a milestone**. If on the default
  branch (`main`), branch first.
- Keep commits scoped and well-described (e.g. `feat(tNN): sync animations to narration`).
  End commit messages with the `Co-Authored-By:` trailer.
- Commit the generated artifacts that belong in the repo: `scripts/`, `videos/tNN-*/`,
  `captions/`, `public/audio/tNN-*/` (incl. `raw/`), and `remotion-src/` registration.

## Standing layout & style rules (apply in steps 6, 9, 10)
- **Bigger fonts** (Narsi asks repeatedly): captions/body ≥30–34px, labels ≥24px,
  sub-labels/footnotes ≥22px, card titles ≥36px, hero numbers 80px+. Size up when unsure.
- **Fill the frame** — no empty lower-third/dead space; scale/distribute to fill 1920×1080.
- **Align** everything (vertical + horizontal): shared baselines/centers, nothing off-axis. **Align a row of differently-sized objects by their VERTICAL CENTERS, not their top edges** — a taller box (e.g. a 300px context-window next to a 200px core) aligned by `top:` hangs visibly low. Compute each element's center (`top + height/2`) and set tops so the centers match. (Caught in t03 Scene 1: window box hung 60px below the agent core.)
- **Breathing room** — fill, but don't cram; deliberate padding between elements. Aim for an EVEN vertical rhythm (roughly equal gaps heading → hero → caption); never bunch at the top with an empty bottom. Narsi flags "cramped vertically."
- **Subtitle-safe bottom band** (step 10) — keep the bottom ~165px clear.
- **Readable text** — muted/secondary text must be legible on the dark bg: `theme.textMuted` ≈ #b4b4b4, `theme.textDim` ≈ #8c8c8c (never #888/#444). No near-invisible grey.
- **NO em dashes (—) in on-screen scene text** (Narsi's repeated correction). Em dashes look wrong on screen — use a comma, colon, period, parentheses, or the `·` middle-dot separator (for label · source pairs) instead. Applies to every rendered string in `Scene*.tsx`; code comments don't matter. (e.g. "same chunk — now carries context" → "same chunk, now carries context"; "contextual retrieval — Anthropic" → "contextual retrieval · Anthropic".)
- **SFX variety — don't let the sound feel monotonous** (Narsi's ask). Use the full 8-sound palette BY CONTEXT, not the same 2–3 cues on repeat: `tick`=counter/steps, `pop`=element/card reveal, `whoosh`=sweep/travel/transition, `success`=positive result (✓/fix lands), `error`=failure (✕/wrong), `block`=hard stop / can't-fit / overflow / wall, `alarm`=escalating danger / runaway cost, `stinger`=scene punchline. Don't leave any sound unused if a fitting beat exists (e.g. `block` for an overflow). Vary reused cues with the `Sfx` `rate` prop (pitch ~0.9–1.12) so the same file never fires identically twice, and **pitch-shift each scene's end-stinger differently** so the scene-ends don't all sound the same. Ascending `rate` across a sequence of reveals (e.g. recap rows: `rate={1 + i * 0.05}`) is a nice rising touch.
- **SFX must be LOUD ENOUGH to hear under the narration.** The ffmpeg-synthesized cues in `public/audio/sfx/` can default far too quiet (~−25 dB peak) and vanish under the ~−15 dB VO — the `volume` prop only ATTENUATES, it can't rescue a quiet file. Peak-normalize every sfx file to ~−3 dBFS (`ffmpeg -i f.mp3 -af "volume=${-3 - maxdB}dB"`), then keep `volume` props ~0.35–0.5. After any SFX work, sanity-check levels with `ffmpeg -i f.mp3 -af volumedetect -f null /dev/null`. (Caught on t03: every cue was inaudible until the files were boosted ~+22 dB.)
- **Punchlines stand alone, BIG** — a scene's closing line lands as the ONLY thing on screen (fade the prior phase OUT first), vertically centered, hero-sized (~60–84px). Not a small caption at the bottom of an empty frame.
- Clean vector + emoji + CSS-motion aesthetic; avoid stock photos (logos on chips OK).

## Get scene animations right the FIRST time (these caused many back-and-forth iterations — bake them in up front)
- **ENGAGEMENT — never let the screen go static while the VO is talking.** The single biggest watch-time killer. Every phase must have continuous motion or a live beat for its whole narration span. Do NOT let an animation "finish" early and then hold a frozen frame for many seconds: keep counters ticking, meters drifting/pulsing, elements revealing one-at-a-time, or add a live sub-beat. If the VO describes something ("can I undo it in 30 seconds?", "the smartest stop is progress"), animate THAT thing live (a 30s timer, tests flipping red) rather than holding a static diagram. Even punchline holds get subtle motion (gentle pulse/drift). Rule of thumb: if a frame and the frame ~1.5s later look identical while the VO is still talking, it's a dead spot — fix it.
- **NO OVERLAPS at ANY frame — including phase handoffs.** Verify mid-phase AND at the boundaries. When a new phase/punchline enters, FADE THE PRIOR PHASE OUT so they don't collide. Use a tight ~0.4s offset cross at boundaries (outgoing fades out as incoming fades in, overlapping only at ≤~40% opacity) — this avoids BOTH a jumble (two things at full opacity) AND an empty gap (a near-blank frame mid-transition).
- **Don't oversize boxes.** Size cards/boxes to their content + padding; an over-tall box collides with the caption/footnote below it. Reduce box height rather than letting things overlap.
- **Guard against NaN.** Keep `interpolate` inputs and any array indices finite — clamp time-derived indices to ≥ 0 (e.g. `Math.max(0, …)`) so frames before a phase starts don't produce a negative index → undefined → NaN → render crash.
- **Don't toggle a CHARACTER that changes line width** (blinking carets, spinners, counters that gain digits). Swapping `"|"`/`" "` reflows the line — HTML collapses the trailing space so the caret-on state is wider, and at a tight container width it wraps to a 2nd line and back, making the element jump every blink. Keep the element ALWAYS in the layout and toggle its `opacity` instead (`<span style={{opacity: blink ? 1 : 0}}>|</span>`), and add `whiteSpace: "nowrap"` so a one-line label can never wrap. (Caught on t03 Scene 3: the "writes context ✎|" caret made the cheap-model column bounce.)
- **Full-width centered absolute text MUST set `left: 0`** (not just `width: "100%"` + `textAlign: center`). With no `left`, an absolutely-positioned element uses `left: auto` = its static position; nested inside a non-positioned/zero-width wrapper (e.g. a `<div style={{opacity}}>` that's a flex child) that static-left resolves to screen-center, so width:100% overflows off the right edge and the text clips. Always set `left: 0` (or `left:0; right:0`) on full-width centered absolute text. (Caught in t03 Scene 1: "the answer" line rendered bottom-right and clipped.)
- **Verify THOROUGHLY with stills** before declaring done: sample every phase AND every phase boundary of each scene (not just one mid-phase frame), and actually open/inspect the images. A subagent that only checks safe frames will miss the early/boundary breakage.
- **DELETE the verification stills/screenshots when done** (Narsi's standing ask). Render them to the session scratchpad (never the repo), inspect, fix, then remove them — leave no screenshots or temp render scripts behind in the repo or scratchpad. Don't commit stills.

## Snippets

Trim silence (step 5), per clip — preserve raw first:
```
ffmpeg -y -i raw/sNN.m4a -af "silenceremove=start_periods=1:start_silence=0.08:start_threshold=-45dB:detection=peak,areverse,silenceremove=start_periods=1:start_silence=0.08:start_threshold=-45dB:detection=peak,areverse" -c:a aac -b:a 192k sNN.m4a
```

Whisper transcription (step 8) — whisper.cpp (`brew install whisper-cpp`), model
`~/whisper-models/ggml-small.en.bin`:
```
ffmpeg -y -i sNN.m4a -ar 16000 -ac 1 sNN.wav
whisper-cli -m ~/whisper-models/ggml-small.en.bin -dtw small.en -l en -ojf -osrt -ovtt -np -of captions/sNN -f sNN.wav
```
The `sNN.json` has per-segment and per-token `offsets` (ms) → use for step 9.

Global speed-up of the FINAL render (step 11), factor F (e.g. 1.15):
```
ffmpeg -i out/tNN.mp4 -filter_complex "[0:v]setpts=PTS/F[v];[0:a]atempo=F[a]" -map "[v]" -map "[a]" out/tNN-final.mp4
```

## Gotchas
- Build the children array INSIDE the Remotion component body (module-level JSX breaks esbuild).
- `Date.now()`/`Math.random()` unavailable in some contexts — keep animations deterministic (index/frame based).
- Verify with `remotion still` frames per scene/phase before declaring done; never claim a render that didn't run.
- Related memory: see `distilled-ai-video-style` and the per-video project notes.
