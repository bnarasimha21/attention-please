# t02-agent-failures — narration audio

Drop one clip per scene here, named `sNN.m4a` (mp3 / wav also fine — any format
ffprobe can read). Nine scenes:

| file   | scene component        | script section            |
|--------|------------------------|---------------------------|
| s01    | Scene1Hook             | Scene 1 — Hook            |
| s02    | Scene2FourFailures     | Scene 2 — These aren't bugs |
| s03    | Scene3RunawayLoop      | Scene 3 — Runaway Loop    |
| s04    | Scene4ContextRot       | Scene 4 — Context Rot     |
| s05    | Scene5ToolSprawl       | Scene 5 — Tool Sprawl     |
| s06    | Scene6OverPermission   | Scene 6 — Over-permission |
| s07    | Scene7Unifying         | Scene 7 — Unifying principle |
| s08    | Scene8Recap            | Scene 8 — Recap           |
| s09    | Scene9CTA              | Scene 9 — Like & Subscribe CTA |

Trim leading/trailing silence if you can; otherwise I'll trim on import.

Once these land I will:
1. Measure each clip with ffprobe.
2. Set each scene's `duration` in `timings.ts` to clip length + ~1s tail.
3. Re-pace the animation beats per scene so the demo fills the narration
   (stretch the beat timings rather than finishing early and holding a static
   frame) — this matters most for the longer break→fix scenes 3–6.
4. Wire per-scene `<Audio>` into `T02F.tsx` (the t01-agent-harness pattern).
