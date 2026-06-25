---
name: distilled-ai-scenes
description: Agentic scene-building phase for a Distilled AI video. Fan out one lean Agent per scene in parallel (NOT Workflow/forks — Agent tool only, lean prompts), each returning TSX code. Write files and wire the composition. Triggers after audio is recorded and trimmed. Hand off to /distilled-video Steps 7–11 for audio attach, subtitles, and sync.
---

# Distilled AI — agentic scene builder

This skill handles **Step 6** of the `distilled-video` pipeline using **parallel Agent
tool calls** (NOT the Workflow tool). Each scene gets one lean Agent call with a focused
prompt — no inherited context, no tool access overhead. ~7x cheaper than Workflow forks.

**When to use Agent vs Workflow:**
- Scene building → **Agent tool** (pure code generation, agent has everything it needs in the prompt)
- Research phase → **Workflow** (agents need web search tool access mid-task)

**Invoke this** when Narsi says "audio's in, build scenes" or "build the scenes for tNN".

**Prerequisites:**
- Script approved (`scripts/tNN-<slug>.md` locked)
- Audio recorded and silence-trimmed (`public/audio/tNN-<slug>/sNN.m4a` present)
- `raw/` originals backed up

---

## Shared toolkit reference (pass verbatim to every scene agent)

```
remotion-src/visuals.tsx exports:
  - pop(frame, fps, delay?, config?) → spring 0→1 with snappy overshoot (channel signature)
  - CameraRig: wraps scene content — punch-in settle + slow push + gentle drift
  - SceneBackground: living dark bg with parallax grid, orbiting glow, particles
  - SceneHeading: kinetic scene title with pop entrance
  - EASE_OUT: Easing.bezier(0.16, 1, 0.3, 1) — fast start, soft settle

remotion-src/theme.ts exports:
  - theme.bg, theme.primary (#6C63FF), theme.accent (#FF6584), theme.success (#43D9AD)
  - theme.text (#FFFFFF), theme.textMuted (#b4b4b4), theme.textDim (#8c8c8c)
  - theme.fontMono, theme.fontSans

remotion-src/sfx.tsx exports:
  - <Sfx name="pop" startFrom={frame} /> — use for element entrances

Scene file location: videos/tNN-<slug>/scenes/SceneN<Name>.tsx
Main composition: videos/tNN-<slug>/TNN*.tsx
Timings: videos/tNN-<slug>/timings.ts
Resolution: 1920×1080 @ 30fps
```

---

## Step 0 — Parse the script

Read `scripts/tNN-<slug>.md`. Extract for each scene:
- Scene number and name
- Time estimate [m:ss–m:ss]
- Full narration text
- Tone cues [in brackets]

This gives you the scene list and narration before launching the Workflow.

Also read ONE existing scene for reference (e.g. `videos/t02-agent-failures/scenes/Scene3RunawayLoop.tsx`) to show agents the code patterns.

---

## Step 1 — Build scenes with parallel Agent tool calls

Send **one message with N Agent tool calls** (one per scene), all in parallel. Each Agent
call gets a lean, self-contained prompt — narration + toolkit reference + animation brief.
The agent returns ONLY the TSX source code as its reply text.

**Do NOT use the Workflow tool here.** Agent tool = ~60-80k tokens total. Workflow = ~500k+.

**Lean prompt structure for each Agent call:**
```
You are a Remotion animation engineer. Return ONLY the TypeScript source code for this scene.

FILE: videos/tNN-<slug>/scenes/SceneN<Name>.tsx
EXPORT: SceneN<Name>

NARRATION: [scene narration text]
TONE: [tone cue]
ANIMATION BRIEF: [what to show, break→fix structure]

TOOLKIT: [shared toolkit reference — imports, colors, primitives]
RULES: [standing animation rules]

First line must be: import { AbsoluteFill, ...
```

**Standing animation rules every scene agent must follow:**
- NEVER let the screen go static while VO is talking — continuous motion at all times
- NO overlaps at any frame, including phase handoffs — fade prior phase OUT before new one enters (0.4s cross)
- Punchlines stand alone, BIG (~60–84px), vertically centred, prior phase faded out
- Bigger fonts: body ≥30–34px, labels ≥24px, card titles ≥36px, hero numbers 80px+
- Fill the frame — no dead space, no bunching at the top
- Subtitle-safe bottom band: keep essential content above y=915 (reserve bottom 165px)
- Guard against NaN: clamp all interpolate inputs and array indices (Math.max(0, …))
- Use `pop()` for all element entrances; `CameraRig` wraps all content
- Break→fix demonstrations preferred: show the problem happen, then the guard stop it
- Add `<Sfx>` cues at key beats (entrances, reveals, punchlines)
- Build the children array INSIDE the component body (module-level JSX breaks esbuild)
- Keep animations deterministic (index/frame-based, no Math.random/Date.now)

Once all Agent calls complete, **write the TSX files yourself** (Write tool) — no assembly agent needed. Then write TNN.tsx + timings.ts + update Root.tsx directly.

---

## Step 2 — Report to Narsi

After Workflow completes, send a Telegram summary:
- Which scenes built clean vs which had issues
- Any verify failures with specific frame numbers
- "Ready to review in Remotion Studio — open with `npx remotion studio` in the distilled-ai dir"
- "Say 'fix scene N' to address any issues, or 'audio attach' to move to Step 7"

---

## Step 3 — Iterate

For individual scene fix requests: edit that scene's TSX directly (no need to re-run the full Workflow).

Once Narsi confirms scenes look good in Remotion Studio, hand off to **`/distilled-video` Steps 7–11** (audio attach, Whisper subtitles, sync, subtitle-safe pass, render).

---

## Gotchas

- Each scene TSX must import only from `remotion`, `../../remotion-src/visuals`, `../../remotion-src/theme`, `../../remotion-src/sfx` — no external dependencies.
- The main TNN*.tsx imports scenes with `../scenes/SceneN<Name>` relative paths.
- Verify stills go to a temp dir, NOT the repo. Delete after inspection.
- Do NOT commit until Narsi confirms scenes pass visual review.
