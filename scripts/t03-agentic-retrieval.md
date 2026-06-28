# Trending 03, Agentic Retrieval: how AI agents find the RIGHT context

**Title:** How AI Agents Find the RIGHT Information (Agentic Retrieval Explained)
**Duration target:** ~7:00 final. Trimmed draft is ~1,270 narration words ≈ ~7:30–8:00 at 160–165 wpm; the final global speed-up (skill Step 11) pulls it toward ~7:00.
**Word count:** ~1,270 words (trimmed from ~1,530)
**NOTE on timestamps:** the `[m:ss–m:ss]` ranges in each scene header are PRE-RECORD ESTIMATES only. Actual durations get re-derived from the recorded audio (skill Step 7) — do not size animations off these literal numbers.
**Topic:** How agents pull the *right* context into a tiny window on demand — classic RAG, why semantic search alone isn't enough (hybrid), the upgrade to agentic / multi-step retrieval, just-in-time retrieval as a tool, memory retrieval, and the RAG-vs-long-context verdict.
**Audience:** **Intermediate-to-advanced** developers who've seen t01 (the harness) and t02 (the four failure modes). Assume they already know basic RAG (embed → retrieve → generate) and what a context window is — do NOT teach RAG 101. Go straight to the advanced techniques that separate a toy retriever from a production one. This video is the *opposite* skill to t02's "context rot": getting the RIGHT stuff IN. Net-new vs t01/t02 — t02 only covered *tool* selection; this is document/knowledge/memory retrieval.
**Track:** Trending
**Voice:** Conversational explainer, moderate energy (toned down from the Berman style — Narsi's call, 2026-06-27). Talk straight to the viewer ("you"), define every term the second it appears, use analogies, be upfront about tradeoffs. Keep it spoken with contractions and flowing cadence — but measured, not hyped. Avoid catchphrase signposts ("okay so…", "here's where it gets really cool", "real talk", "and here's the kicker", "let me break this down") and don't oversell with words like "massive," "huge," "face-plants." NOT terse literary one-liners either — calm and clear is the target.

> Reframed from the over-broad "context engineering" angle (which overlapped t01/t02
> heavily). This narrows to the one genuinely-uncovered vein: how agents *find and pull
> in* the right context. Deliberately avoids re-using t02's tool-search 49→74 stat,
> sub-agent 30K→2K, memory-file, and RAM-metaphor lines. 8 content scenes + CTA.

---

## NARRATION SCRIPT
*(Read aloud to record. Tone cues in [brackets]. On-screen detail noted in the animation guide. Keep it spoken and conversational, but measured — contractions are good.)*

---

### SCENE 1 — Hook [0:00–0:33]
[Friendly, clear — set the problem up]

Here's a problem that sounds simple but turns out to be one of the harder things in AI right now.

You point an agent at your whole codebase, or your company's entire knowledge base. That's millions of tokens, far more than fits in its context window. Then you ask one question, and the answer lives in maybe three sentences, buried somewhere in all of that.

So how does the agent *find* those three sentences? If it dumps everything in, it slows down, it costs more, and it actually gets less accurate — which we covered last time. The real skill is the opposite: pulling in *only* the right context, exactly when it's needed. That's retrieval, and it's changed a lot recently. Let's walk through it.

---

### SCENE 2 — The core problem [0:33–1:15]
[Set it up clearly]

Let's frame the problem, because it's the whole game.

Your context window is small. The information the agent might need is enormous. And you can't preload all of it — first because it doesn't fit, and second because even if it did, burying the answer in a mountain of irrelevant text makes the model *worse*, not better.

So instead, you let the model reach out and grab the exact piece it needs, the moment it needs it, and nothing else. That's all retrieval is: the right context, on demand.

You already know the basic version — that's RAG. But the gap between a toy RAG demo and retrieval that holds up in production is large, and closing that gap is the rest of this video. It starts somewhere most people overlook.

---

### SCENE 3 — Index it right: chunking + contextual retrieval [1:15–2:20]
[Assume they know RAG; go deep on the layer tutorials skip]

You already know the basic loop: embed your docs, embed the query, grab the nearest chunks. We'll skip that, because what actually decides whether retrieval works happens earlier, at indexing time — and most setups get it wrong.

Start with chunking. The moment you split a document up, each chunk loses the context around it. A line like "the fee is fifty dollars" gets stored as a naked blob, with no record that it lived under "Section 4, Refunds." Retrieve it later, and the model has no idea what it's looking at. Chunk too big and you drag in noise; too small and you lose the meaning. This one decision sets a ceiling on how good your system can get.

There's a useful upgrade here. Anthropic calls it contextual retrieval. Before you embed a chunk, a cheap model writes a short note on where it sits in the document and prepends it — so "the fee is fifty dollars" becomes "in the refund policy, the fee is fifty dollars." Same chunk, but now it carries its context. In Anthropic's own testing, that single change to the embeddings cut failed retrievals by about a third, before you've even touched the search. Fix the index, and everything downstream gets easier.

---

### SCENE 4 — Semantic search isn't enough: hybrid + rerank [2:20–3:35]
[A worth-knowing result]

With a solid index, the next question is the search itself — and there's a result here worth knowing.

Semantic search is good at understanding what you *mean*. Ask "how do I reset my password" and it finds a doc titled "account recovery steps," with no matching words at all. That's powerful. But it has a blind spot: exact terms. Error codes, product IDs, a function name. The meaning-matching blurs those out, and on some 2026 benchmarks, plain keyword search actually *beat* vector search outright.

So the better systems use *both*. That's hybrid search: run keyword and semantic together and merge the rankings. One catches the exact terms, the other catches the meaning.

Then there's one more layer — reranking. Hybrid pulls a wide set, say fifty candidates. A second, smarter model re-reads those fifty and re-sorts them, so the *best* three rise to the top. Cast a wide net quickly, then let a specialist pick the winners.

Stack all of it — contextual embeddings, hybrid search, and a reranker — and in Anthropic's own testing, failed retrievals drop by about *two-thirds*. Same documents, same model; it just finds the right context far more often. That's the modern retrieval stack.

---

### SCENE 5 — The upgrade: Agentic Retrieval [3:35–4:45]
[The main shift — state it plainly]

Now to the part that's genuinely changing right now.

In classic RAG, retrieval happens *once*, before the model even starts thinking. Agentic retrieval asks a different question: what if the model drove the search itself? It's essentially the agent loop, pointed at search.

Here's what changes. The agent takes your question and *reformulates* it into a better query. If it's complex, it breaks it into sub-questions and searches each one. Then — the key part — it looks at what came back and judges it. "Do I have enough? No, the answer references something I haven't looked up yet." So it searches *again*, and it keeps going until it has what it needs.

Instead of one blind grab, you get a small research loop. Ask something that takes three hops to answer, and classic RAG tends to fall apart, while an agentic retriever chains the hops and gets there.

This isn't free, though. It costs roughly three to ten times the tokens of classic RAG, so you use it where the question is genuinely hard — not to look up one simple fact.

---

### SCENE 6 — Just-in-time + memory retrieval [4:45–5:35]
[Level, matter-of-fact]

It also doesn't have to happen up front. The agent can retrieve *mid-task*, the moment it hits something it doesn't know.

Take a coding agent. It's editing a file, hits a function it doesn't recognize, and right there in the loop it runs a search, grabs *just* that definition, and moves on. Retrieval becomes a tool the agent calls whenever it has a gap — just in time, rather than just in case.

And it's not only documents. The same machinery works on *memory*: past conversations, decisions, notes about the user. When something's relevant, the agent searches its own memory and pulls back the one item that matters out of thousands. Find the needle, leave the haystack.

---

### SCENE 7 — But didn't big context windows kill RAG? [5:35–6:20]
[Address the obvious objection head-on]

At this point you might be thinking: we have million-token windows now — can't I just put everything in and skip all this?

Mostly, no. Those large windows are slow and expensive. One analysis clocked a long-context query at tens of seconds and pennies-to-dollars each, versus retrieval at about a second for a small fraction of the cost. And even with a giant window, models still miss facts buried in the middle — it's a real effect, though how strong it is depends on the model.

So the better teams don't choose one or the other. They use retrieval to *narrow* a million documents down to the handful that matter, then let the large window reason over that focused set. Retrieval and long context, working together.

---

### SCENE 8 — Why this matters [6:20–6:50]
[Land the big idea]

Step back, because this changes how you build agents.

We tend to focus on which model is smartest. But the more useful framing is this: an agent is only as good as what it can *find* and bring into focus at the right moment. The smartest model available, looking at the wrong three paragraphs, just gives you a confident, wrong answer.

So retrieval is how the agent *sees* — it's the senses. Get it right, and an ordinary model starts to feel sharp, because every time it answers, it's looking at exactly what it needs. That's the skill worth focusing on right now.

---

### SCENE 9 — Recap + Like & Subscribe CTA [6:50–7:15 + CTA]
[Warm, quick, classic recap]

Quick recap of how agents find the right context.

It starts at indexing — contextual retrieval, so your chunks carry their meaning. Then hybrid search plus a reranker pulls and sorts the best results. Agentic retrieval lets the model run a real search loop, going multi-step until it has the answer. It retrieves just in time, mid-task, and works on memory the same way. And large context windows don't replace any of this — they work alongside it.

If this made things clearer, hit like and subscribe — it genuinely helps the channel, and there's a whole series on building agents that actually work. See you in the next one.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(Reuse the t01/t02 motion toolkit: SceneBackground, kinetic SceneHeading, CameraRig, pop, ModelCore, counters/meters, crossfades, Sfx. Break→fix demos where there's a problem to show.)*

| # | Scene | Animation | Selective on-screen detail |
|---|-------|-----------|-----------------------------|
| 1 | Hook | A MODEL core next to a HUGE wall of documents/code (millions of tokens) vs its tiny window outline. A question drops; a "stuff it all in" attempt floods the window red (slow/cost/✕). Then a single spotlight finds 3 glowing lines in the wall. Punchline alone, big: "Find the needle. Not the haystack." | `1,000,000 tokens` wall vs `~200K` window · spotlight on 3 lines |
| 2 | The core problem | Split: LEFT tiny window, RIGHT giant knowledge cloud. An arrow tries to cram the cloud into the window → overflow. Reframe: a single "reach + grab" arm pulls ONE chip out of the cloud into the clean window. Caption: "the right context, on demand." | window ≪ knowledge · "can't preload: doesn't fit + rots" |
| 3 | Index: chunking + contextual retrieval | A document gets sliced; one chunk ("The fee is $50.") drifts away from its "Section 4 · Refunds" heading and dims → confused ✕ when retrieved. Fix replay: a small model writes a context blurb and PREPENDS it ("[Refund policy] The fee is $50.") → the chunk re-lights, retrieved correctly. A "failed retrievals" bar then drops in steps: −35% bright, then −49% and −67% greyed/queued as "next scene". | naked chunk ✗ → contextualized chunk ✓ · failed retrievals −35% (Anthropic's own testing) |
| 4 | Hybrid + rerank | Two lanes race a query: SEMANTIC lane catches a paraphrase ("reset password"→"account recovery") but MISSES an error code; KEYWORD lane catches the exact `ERR_4032` but misses the paraphrase. Lanes MERGE → both hits captured. Then a "rerank" beat: a wide net of ~50 candidates pours in → a reranker model re-sorts → the best 3 float to the top. (No undefined acronyms on screen — no "RRF"/"NDCG".) | semantic ✓meaning ✗exact · keyword ✓exact ✗meaning · hybrid = both ✓ · rerank: 50 → best 3 |
| 5 | Agentic retrieval | Break: classic RAG one-shot on a 3-hop question → grabs wrong chunks → ✕. Fix replay: agent core runs a mini-loop — reformulate query → split into sub-queries → search → READ → "enough? no" → search again → ✓. A small "~3–10× tokens" honesty chip glows. NOTE: draw a *search* loop, visually distinct from t01's ReAct/harness ring — don't recreate t01's signature loop. | loop: reformulate · decompose · search · judge · repeat · "multi-hop ✓ · costs ~3–10× tokens" |
| 6 | Just-in-time + memory | Coding agent mid-edit hits an unknown function → fires a search tool inline → pulls just that definition → continues (the window stays small the whole time). Then swap the doc-store for a "MEMORY" store: agent searches past notes, pulls ONE relevant chip from a thousand. | "retrieve mid-loop, just-in-time" · same machinery over docs AND memory |
| 7 | RAG vs long context | A "1M token" window balloon vs a retrieval arm. Two meters race as RELATIVE bars (no literal numbers): LATENCY (long ▮▮▮▮ vs retrieval ▮) and COST (big vs sliver); a "misses facts in the middle — model-dependent" warning blinks on the big window. Resolve: retrieval NARROWS the cloud → a small focused set → big window reasons over it. "Use both." | long-ctx: slower · pricier · misses the middle → retrieve-to-narrow, then reason · "they team up" |
| 8 | Why it matters | A balance: a genius MODEL core staring at the WRONG 3 paragraphs → confident ✕ answer; vs a normal core handed the RIGHT 3 → ✓. Then "RETRIEVAL = the agent's senses" with eyes/sensor motif lighting up. Punchline alone, big: "An agent is only as smart as what it can find." | wrong-context genius loses to right-context normal · "retrieval = senses" |
| 9 | Recap + CTA | 5-row recap animating in sequence (Index/Contextual → Hybrid+Rerank → Agentic → Just-in-time/Memory → + Long context), then the existing Like/Subscribe animated scene (channel icon + cursor taps). | Index=contextual · Retrieve=hybrid+rerank · Agentic=loop · JIT+memory · long-ctx teams up |

---

## ON-SCREEN DIAGRAMS / SNIPPETS
*(Animate in line by line during the relevant scene, same treatment as t01/t02. Lighter on code than t02 — this topic is more diagram-driven.)*

---

### Scene 3 — Contextual retrieval (index-time fix)
```
NAIVE chunk:       "The fee is $50."                    → embed → ambiguous
CONTEXTUAL chunk:  "[Refund policy] The fee is $50."    → embed → grounded
       ▲ a cheap model prepends each chunk's context BEFORE embedding

Failed retrievals, top-20 (Anthropic's own testing):
  contextual embeddings ............ −35%
  + contextual BM25 (hybrid) ....... −49%   ← Scene 4
  + reranking ...................... −67%   ← Scene 4
```

### Scene 4 — Hybrid search (why both)
```
query ─┬─ semantic (dense vectors) → great at MEANING, weak on exact terms
       └─ keyword  (BM25 sparse)   → great at EXACT terms, weak on meaning
              │
        merge ranks → catches both  → beats either alone
              │
        rerank → a 2nd model re-reads top ~50, re-sorts → best 3 to the top
        # hybrid + reranker = the modern retrieval stack
        # (mechanism names for notes only, NOT on screen: merge = RRF; reranker = cross-encoder; metric = NDCG)
```

### Scene 5 — Agentic retrieval loop
```python
def agentic_retrieve(question):
    queries = reformulate_and_decompose(question)   # 1 question -> N good sub-queries
    notes = []
    for _ in range(MAX_HOPS):
        hits = [search(q) for q in queries]         # hybrid search each
        notes += read(hits)
        if model.has_enough(notes, question):       # the key step: self-check
            break
        queries = model.next_queries(notes)         # follow the thread, search again
    return answer(question, notes)
# multi-hop, self-correcting — but 3-10x the tokens of one-shot RAG
```

### Scene 6 — Retrieval as a tool (just-in-time)
```python
# the agent calls retrieval mid-task, only when it hits a gap:
tools = [search_docs, grep_code, fetch_url, search_memory]
# ...inside the agent loop, on an unknown symbol:
#   model emits: search_docs("auth_token signature spec")
#   -> pulls JUST that section -> uses it -> window stays small
```

---

### Fact-check notes (keep claims defensible)
- **Audience = intermediate/advanced**: RAG-101 (embed→retrieve→generate) is assumed, NOT taught. Scene 3 is now the advanced indexing layer (chunking + contextual retrieval) instead of a RAG tutorial. The old "naive RAG misses ~40%" soft figure was DROPPED with the tutorial scene — don't reintroduce it.
- **Chunking caps retrieval quality**: accurate, well-established — chunk boundaries lose surrounding context; too-big drags noise, too-small loses meaning. ✅
- **Contextual Retrieval (Anthropic, Sept 2024)**: prepend an LLM-written context blurb to each chunk BEFORE embedding. Anthropic's own testing, top-20 failed-retrieval reduction: **contextual embeddings −35% (5.7%→3.7%); + contextual BM25 (hybrid) −49% (→2.9%); + reranking −67% (→1.9%)**. ✅ verified against Anthropic's post. ⚠️ vendor-internal — on screen + VO MUST say "in Anthropic's own testing." Scene 3 lands the −35%; Scene 4 lands the combined −67% as the full-stack payoff.
- **Semantic vs keyword; hybrid (BM25 + dense) beats either**: well-established. WANDS ~+7.4% NDCG for tuned hybrid; BM25 beat dense on financial docs (2026) — kept as supporting evidence; the on-screen number is now the Anthropic −67% stack, not WANDS. ✅
- **Reranking (cross-encoder over top-N candidates)**: standard modern retrieval stage — retrieve wide (hybrid, ~50), then a reranker re-scores each candidate against the query and re-sorts so the best few rise. ✅ established (Cohere Rerank, BGE/cross-encoders); it's the final layer of Anthropic's −67% stack.
- **Agentic RAG = query reformulation + decomposition + multi-hop + self-check loop**: canonical 2025–2026 framing (LangGraph, Kore.ai, multiple guides). ✅
- **"3–10× the tokens of classic RAG"**: reported cost range for agentic/reflection loops. ⚠️ practitioner figure — say "roughly."
- **Retrieval as a tool / just-in-time (retrieve mid-loop)**: standard agentic pattern. ✅ Do NOT re-use t02's Tool Search 49→74% stat (already spent in t02-agent-failures).
- **Memory retrieval = same semantic-search machinery over past context**: accurate; standard episodic-memory pattern.
- **RAG vs long context — latency, cost, multi-fact recall**: underlying figures (≈45s, ≈1,250× cheaper, ≈60% recall) come from a SINGLE 2026 comparison blog (open-techstack). So the script states them DIRECTIONALLY only — narration says "tens of seconds," "pennies-to-dollars," "tiny fraction," "recall can sag below the headline number," and the on-screen layer uses RELATIVE bars with NO literal numbers. Do not print ~45s / ~60% / 1,250× on screen. Lost-in-the-middle is corroborated by Liu et al. (TACL 2024) ✅ but severity is MODEL-DEPENDENT (frontier 2025–26 models reduce it) — always frame as "real, depends on the model," consistent with the t02 caveat.
- **No overlap check**: this script intentionally avoids t02's spent material (tool-search 49→74, sub-agent 30K→2K, memory-file line, RAM-not-hard-drive metaphor) and t01's subagent/compaction explanations. Chunking/contextual retrieval, hybrid search + reranking, agentic/multi-hop retrieval, memory retrieval, and RAG-vs-long-context are all net-new to the channel. Spine = **Index → Retrieve → Reason**.

### Sources (2026 retrieval scan)
- [Contextual Retrieval — Anthropic (−35% / −49% / −67% failed retrievals)](https://www.anthropic.com/news/contextual-retrieval)
- [Agentic RAG Patterns 2026 — Digital Applied](https://www.digitalapplied.com/blog/agentic-rag-patterns-multi-step-reasoning-guide)
- [RAG Architecture Patterns: Naive vs Advanced vs Agentic — BuildMVPFast](https://www.buildmvpfast.com/blog/rag-architecture-patterns-naive-advanced-agentic-2026)
- [Agentic RAG: comprehensive guide — Kore.ai](https://www.kore.ai/blog/what-is-agentic-rag)
- [Hybrid Search for RAG: BM25 + Vector — Denser.ai](https://denser.ai/blog/hybrid-search-for-rag/)
- [Hybrid Search in Production: Why BM25 Still Wins — TianPan](https://tianpan.co/blog/2026-04-12-hybrid-search-production-bm25-dense-embeddings)
- [RAG vs Long Context in 2026: A Decision Framework — open-techstack](https://open-techstack.com/blog/rag-vs-long-context-2026/)
