# Trending 15 — Is RAG dead?
**Title:** Is RAG dead? Let's actually settle it.
**Duration target:** ~1:50 (tightened preview cut)
**Word count:** ~270 words (~140 wpm at preview pacing)
**Topic:** RAG (Retrieval-Augmented Generation) — is it obsolete, or did it just grow up?
**Track:** Trending

---

## NARRATION SCRIPT
*(Read this aloud to record your audio. Tone cues in [brackets].)*

---

### SCENE 1 — Hook [0:00–0:13]

[Punchy, a little clickbait-y — then promise clarity]

"RAG is dead." You've seen the headline a hundred times.

Every other post is calling it.

So is it? Let's actually settle it.

---

### SCENE 2 — What RAG is [0:13–0:30]

[Explanatory, friendly — quick refresher]

Quick refresher. RAG means the AI looks things up *before* it answers.

Your question goes to a knowledge base — your documents, a vector database. It finds the most relevant chunks, stuffs them into the model's context, and the model answers — with sources.

That's it. Retrieve, then generate.

---

### SCENE 3 — Why people say it's dead [0:30–0:46]

[Slightly critical — show the failure]

Here's the problem people point to.

Naive RAG takes *one* blind shot. One search, grab the top chunk, done.

But the top chunk might be the wrong one — or missing the key detail. Feed that to the model, and you get a confident, wrong answer. A hallucination.

One bad lookup poisons everything.

---

### SCENE 4 — What actually changed [0:46–1:03]

[Building — this is the turn]

But that's not how good systems work anymore.

Modern retrieval is *agentic*. The agent reads your question, breaks it into sub-queries, and searches *multiple* times. It checks the results — not good enough? It reformulates and tries again.

It loops until it has the right context. Retrieval got a brain.

---

### SCENE 5 — Long context vs RAG [1:03–1:20]

[Balanced — the tradeoff]

"But what about million-token context windows? Can't we just paste the whole document in?"

Sometimes — yes. Small, stable knowledge? Drop it straight in the prompt and skip retrieval.

But a huge, constantly-changing knowledge base? You can't fit it, and you shouldn't pay to re-read it every time. That's where retrieval wins.

---

### SCENE 6 — The verdict [1:20–1:33]

[Crisp — land it]

So here's the verdict.

Naive, single-shot RAG? *That* is dead.

Agentic retrieval — search, check, retry? That's the new baseline.

---

### SCENE 7 — Why it matters [1:33–1:46]

[Practical — the takeaway]

Why this matters for you.

Don't ask "is RAG dead?" Ask "what does *my* data need?"

Pick the retrieval strategy that fits. Retrieval didn't disappear — it grew up.

---

### SCENE 8 — Recap + CTA [1:46–2:00]

[Warm, direct — close strong]

So, to recap. Retrieve, then generate. Single-shot is out. Agentic retrieval is in. And long context is a tool, not a replacement.

Next: test-time compute — why models now think before they answer.

If this made it click, hit like. See you in the next one.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(For Remotion build — maps to each scene above)*

| Scene | Timestamp | Animation to build | Remotion notes |
|-------|-----------|-------------------|----------------|
| 1 — Hook | 0:00–0:13 | "RAG IS DEAD" headlines stamp onto screen one by one (scale-punch + shake), then dissolve into a giant glowing question mark; subtitle "Let's actually settle it." | Spring stamp, slight rotate jitter, fade-to-? , bespoke title |
| 2 — What RAG is | 0:13–0:30 | Clean L-to-R pipeline: Question → Knowledge base (docs/vector DB) → Retrieve top chunks → stuff into ModelCore context → Answer (with sources). Each stage labels in, a token-dot flows down the pipe | Staggered stage reveal, flowing dot, ModelCore at the end |
| 3 — Why dead | 0:30–0:46 | Single query fires ONE arrow into a doc pile, grabs the WRONG (red) chunk, drops it into the model → red ✕ "hallucinated" answer | One-shot arrow, wrong-chunk highlight red, red X verdict |
| 4 — What changed | 0:46–1:03 | Agent core in middle; emits 3 sub-queries fanning to the knowledge base, pulls candidate chunks, an "evaluate ✓/✗" gate rejects bad ones and a retry loop arrow curves back, finally locks in the RIGHT (green) chunks | Fan-out queries, eval checkmarks, curved retry loop arrow, green lock-in |
| 5 — Long context vs RAG | 1:03–1:20 | Two-panel decision: LEFT "Long context" — whole doc poured into a big prompt window (good for small/stable); RIGHT "Retrieval" — pluck chunks from a giant DB (good for huge/fresh). A balance/decision rule line | Split panels, fill animation left, pluck animation right, decision rule |
| 6 — Verdict | 1:20–1:33 | Two stacked cards: "Naive single-shot RAG" gets a red strike-through + DEAD stamp; "Agentic retrieval" glows green with APPROVED ✓ | Strike-through draw, stamp drop, green approve glow |
| 7 — Why matters | 1:33–1:46 | Question "Is RAG dead?" crossed out → replaced by "What does MY data need?"; small data→long context chip, big/fresh data→retrieval chip; tagline "it grew up" | Cross-out swap, two guidance chips, tagline rise |
| 8 — Recap + CTA | 1:46–2:00 | Crisp recap row of 3 pills (Retrieve→Generate / Single-shot ✕ / Agentic ✓) + long-context note; teaser "Next: Test-time compute"; brand block "Attention Please / AI concepts, animated clearly" | Pill stagger, teaser fade, exact brand block from t01 |
