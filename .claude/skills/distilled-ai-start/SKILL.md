---
name: distilled-ai-start
description: Agentic research + script phase for a new Distilled AI video. Fan out parallel web-search agents, cross-check prior scripts for overlap, write the full script in Berman voice, run an independent critic — all before Narsi reviews. Use to kick off a new tNN video; hand off to /distilled-video for production (audio onwards).
---

# Distilled AI — agentic research + script pipeline

This skill handles **Steps 1–3** of the `distilled-video` pipeline using a multi-agent
Workflow so all the heavy lifting (research, drafting, critique) happens in parallel
before Narsi needs to look at anything.

**Invoke this** when Narsi says "start a new video on [topic]" or "kick off tNN".

---

## What you receive from Narsi

- **Topic** — the subject of the video (e.g. "agentic retrieval", "test-time compute")
- **Slot** — the tNN number (e.g. t04). If not given, read the scripts/ folder and use the next available number.

---

## Step 0 — Determine slot

Read `scripts/` to find the highest existing tNN and claim the next one.
Do this BEFORE launching the Workflow.

---

## Step 1 — Launch the Workflow

**Why Workflow here (not Agent tool):** Research agents need live web search tool access
mid-task. Agent tool calls are lean but tool-less. Workflow forks are heavier (~500k tokens)
but necessary when agents must search/fetch during execution. Scene building uses Agent tool
instead (see distilled-ai-scenes skill) — pure generation needs no tools.

Call the **Workflow tool** with a script that runs three phases:

### Phase 1 — Research (all agents in parallel)

Fan out **four agents simultaneously**:

1. **Trend agent** — web search for recent developments, papers, benchmarks, and practitioner takes on the topic. Focus on what has changed in the last 6 months. Return: 8–12 key facts/insights with sources.

2. **Counter-angle agent** — web search for criticisms, failure modes, misconceptions, and "what people get wrong" about the topic. Return: 5–8 contrarian/nuanced points.

3. **Overlap agent** — read ALL existing scripts in `scripts/tNN-*.md`. Return: a bullet list of claims, techniques, stats, and analogies already used in prior videos — so the new script avoids repeating them.

4. **Positioning agent** — read `scripts/trending-30-day-plan.md` and existing scripts to determine where this topic sits in the series arc. Return: 2–3 sentences on how this video should differentiate from prior ones and what the unique angle is.

### Phase 2 — Draft + Critique (parallel, using Phase 1 output)

Run **two agents simultaneously** once Phase 1 completes:

1. **Script writer agent** — write the full narration script for `tNN-<slug>` using:
   - All Phase 1 research (trend + counter-angle + positioning)
   - Overlap list to AVOID repeating prior content
   - `distilled-video` SKILL.md style rules (Berman voice, intermediate-to-advanced audience, 8 content scenes + CTA, ~1,100–1,300 words, scene headers with time estimates)
   - Output: complete `scripts/tNN-<slug>.md` in the canonical format (see existing scripts for structure)

2. **Critic agent** (independent, adversarial) — given the Phase 1 research and the overlap list, write a red-team critique of what the script SHOULD contain. Score on:
   - Does it go deep enough for intermediate-to-advanced devs?
   - Does it avoid re-teaching prior video content?
   - Is the hook strong?
   - Are all claims checkable / numbers sourced?
   - Is the Berman voice consistent throughout?
   - Any missing techniques or tradeoffs a practitioner would expect?
   Return: a structured critique (not yet seeing the draft — this is a blind adversarial pass).

### Phase 3 — Synthesis (sequential)

One agent reads the draft (Phase 2 script) + the blind critique + the research and produces the **improved final script**. It must:
- Fold in every valid critique point
- Keep the word count in range (~1,100–1,300 words)
- Not introduce new claims that weren't in the research
- Output the full improved `scripts/tNN-<slug>.md`

---

## Step 2 — Save and notify

After the Workflow completes:

1. Write the final script to `scripts/tNN-<slug>.md`
2. Send Narsi a Telegram summary:
   - What the video is about (2 sentences)
   - Scene list (just the scene titles)
   - Top 3 critique points that were incorporated
   - "Ready for your review — say 'looks good' to move to recording, or tell me what to change"

---

## Step 3 — Iterate until approved

If Narsi requests changes: make them directly (no need to re-run the full Workflow for small tweaks). Re-run Phase 2+3 only if the topic or angle changes substantially.

Once Narsi approves the script, hand off to **`/distilled-video`** for Steps 4 onwards (audio recording, scene building, sync, render).

---

## Guardrails

- Do NOT start building Remotion scenes until the script is approved.
- Do NOT commit to the repo until Narsi confirms the script milestone.
- Always narrate progress to Narsi via Telegram as phases complete ("Research done, drafting now…", "Draft + critique ready, synthesising…").
- The critic agent must be genuinely adversarial — not just a checklist. It should find real weaknesses.
