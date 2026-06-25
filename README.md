# Attention Please — YouTube Channel

Animated AI-concept explainer videos. Built with Remotion.

Focused on the **trending track**: short, punchy explainers on what's the talk of the town in AI right now (agent harnesses, context engineering, RAG, reasoning models, …). See [topics/trending-30-day-plan.md](topics/trending-30-day-plan.md).

## Structure
- `topics/` — the content plan
- `videos/` — one folder per video (`tNN-slug/`), each with `TNN.tsx`, `timings.ts`, and `scenes/`
- `scripts/` — narration scripts + scene-by-scene animation guides (`tNN-slug.md`)
- `remotion-src/` — shared design system + motion toolkit (`theme.ts`, `visuals.tsx`) and `Root.tsx`
- `assets/` — source/design files not used at render time: `logo/` (brand marks) and `thumbnails/` (YouTube thumbnails, one per video)
- `public/` — Remotion `staticFile()` runtime root: `icon.png` and per-video narration under `audio/<tNN-slug>/` (recorded `*.m4a` is gitignored — kept local)

## Format
- Length: ~2–3 min per video (tightened preview cut; lengthen `timings.ts` after recording voiceover)
- Tool: Remotion (React-based programmatic animation), 1920×1080 @ 30fps
- Motion: snappy overshoot entrances, kinetic headings, camera rig, parallax backgrounds, scene crossfades
- Voice: Narsi (narrated)

## Develop
```
npm start                   # Remotion Studio at localhost:3000
npx remotion compositions   # list all video compositions
```
