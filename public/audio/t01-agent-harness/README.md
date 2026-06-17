# t01 Agent Harness — audio

Drop your recorded narration in **this folder**. It lives under `public/` so
Remotion can load it via `staticFile()` and play it in the Studio for syncing.

## How to name the file(s)

**Option A — one track (simplest):**
- `narration.wav` (or `.mp3`) — the full read, scene 1 → 15, in order.

**Option B — per scene (tighter control over timing):**
- `s01.wav`, `s02.wav`, … `s15.wav` — one file per scene.

WAV or MP3 both fine. (Audio files are git-ignored — they stay on disk, not in the repo.)

## After you add it
Tell me, and I'll:
1. Wire the audio into the composition (`<Audio src={staticFile(...)} />`).
2. Re-time every scene in `timings.ts` to match your delivery (so each beat lands on the word).
3. Adjust any animation pacing that needs it.
4. Render the final video to `out/t01-agent-harness/` (see ../../videos/t01-agent-harness/PRODUCTION.md).
