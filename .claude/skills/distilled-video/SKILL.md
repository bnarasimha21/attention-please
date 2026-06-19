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
2. **Critique it** — adversarial pass for accuracy, clarity, pacing, hooks.
   - **Verify the claims** — every factual/number claim must be checked (deep-research
     workflow for depth); cite vendor numbers as vendor numbers ("in Anthropic's own testing").
   - **Cross-check the messaging** — does each scene say what it intends, in the right order, no contradictions?
   - **Match Narsi's writing style** — read his articles repo **`bnarasimha21/my-articles`**
     (LinkedIn articles; `bnarasimha21/technical-deep-dives` secondary) and write the
     narration in that voice/tone. Clone or `gh`-fetch a few pieces and mirror their cadence.
3. **Make it better** — fold the critique/research back into the script.
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
- **Align** everything (vertical + horizontal): shared baselines/centers, nothing off-axis.
- **Breathing room** — fill, but don't cram; deliberate padding between elements.
- **Subtitle-safe bottom band** (step 10) — keep the bottom ~165px clear.
- Clean vector + emoji + CSS-motion aesthetic; avoid stock photos (logos on chips OK).

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
