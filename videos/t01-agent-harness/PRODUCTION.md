# t01 Agent Harness — production workflow

The audio-driven finishing pass for this video.

## Folders
| Purpose | Path | In git? |
|---|---|---|
| Remotion source (scenes, timings, composition) | `videos/t01-agent-harness/` | yes |
| **Recorded narration (input)** | `public/audio/t01-agent-harness/` | no (audio git-ignored) |
| **Rendered video (output)** | `out/t01-agent-harness/` | no (git-ignored) |
| Script | `scripts/t01-agent-harness.md` | yes |

## Workflow
1. **Record** narration from `scripts/t01-agent-harness.md`.
2. **Drop** the file(s) in `public/audio/t01-agent-harness/` (see its README for naming).
3. **Sync** — I wire `<Audio>` into the composition and re-time `timings.ts` so every scene/beat lands on the words; tweak animation pacing as needed.
4. **Render** to `out/`:
   ```
   npx remotion render T01-AgentHarness out/t01-agent-harness/agent-harness.mp4
   ```
5. **Review** the MP4, iterate on steps 3–4 until it's tight.

## Notes
- Audio and rendered MP4s stay on disk only (git-ignored) — the repo keeps the source + script.
- Current cut is the *silent* timing (~7:10). Real timings get set from your recording in step 3.
