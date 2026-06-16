# Trending 16 — Test-Time Compute  ★ DEEP REFERENCE SCRIPT ★
**Title:** Why the best AI models now "think" before they answer
**Duration target:** ~2:33 narration (video 2:42 incl. CTA)
**Word count:** ~375 words (~145 wpm) — depth-first rewrite
**Topic:** Test-time compute — buying intelligence at answer-time instead of training-time
**Audience:** Technically-curious devs. Assume they know what an LLM is; give them mechanism, numbers, and named systems.
**Track:** Trending (pairs with t17 "Inside a reasoning model")

> NOTE: This is the "deep" reference standard for the channel. Compared to the
> first cut, it adds: real benchmark numbers, named models, the *why* (reasoning
> tokens = extra compute; RLVR training), both flavours of test-time compute
> (sequential vs parallel+verifier), and an honest caveat (log returns +
> overthinking). The animation guide below flags the scene changes needed to
> support the new on-screen facts.

---

## NARRATION SCRIPT
*(Read this aloud to record your audio. Tone cues in [brackets].)*

---

### SCENE 1 — Hook [0:00–0:20]

[Calm, then a hook of disbelief — open the loop]

Here's something that sounds impossible.

In late 2024, OpenAI took *one* model and — without making it any bigger — watched its score on a brutal math exam jump from around thirteen percent to over eighty.

The only thing they changed? They let it *think* longer.

And stay till the end — because more thinking can sometimes make a model *worse*.

---

### SCENE 2 — The old way [0:20–0:37]

[Explanatory, clear]

For years, a model answered in a single forward pass — the same fixed amount of computation whether you asked for the weather or a proof.

It couldn't *work anything out.* It pattern-matched a first guess and committed.

On a genuinely hard problem, that's a coin flip.

---

### SCENE 3 — The new way (and why it works) [0:37–0:59]

[Building — this is the mechanism. Slow down a touch.]

Reasoning models — OpenAI's o1, DeepSeek's R1, Claude and Gemini's thinking modes — work differently.

Before answering, they write a private chain of reasoning. And here's the key insight: *every token they write is extra computation.* The scratchpad isn't decoration — it's working memory. More tokens means more steps to actually think.

And they learn this through reinforcement learning — rewarded only for reaching the *correct* answer, they discover which reasoning actually pays off.

---

### SCENE 4 — More thinking = better (the new scaling law) [0:59–1:17]

[The core insight — make it land]

And it *scales.*

Plot accuracy against thinking time and it climbs — a brand-new scaling law. That leap to over eighty percent on the math exam? Pure test-time compute. Same weights.

But look closely at the curve: it's *logarithmic.* Each doubling of thinking buys a smaller and smaller gain.

---

### SCENE 5 — The tradeoff (and the catch) [1:17–1:35]

[Matter-of-fact — then pay off the hook]

Because thinking isn't free.

You pay for every hidden reasoning token — a single answer can cost five to ten times more, and take seconds instead of milliseconds.

And here's the catch I promised: past a point, more thinking *stops* helping. On easy questions it can even *hurt* — the model second-guesses its way out of the right answer. Overthinking is real.

---

### SCENE 6 — Why it's huge (two axes, two flavours) [1:35–1:55]

[Bigger — the significance, grounded]

Step back — this is the real shift.

For years, "smarter" meant one thing: train a *bigger* model. And that's slamming into data and cost walls.

Test-time compute opened a *second* axis — spend more when you *answer*, not just when you train. And it comes in two flavours: think *longer* — one deep chain — or think *wider* — many attempts in parallel, with a verifier picking the best.

---

### SCENE 7 — When to use it [1:55–2:15]

[Practical — the takeaway]

So match the effort to the job.

Hard math, code, multi-step logic, planning — let it think; the compute pays for itself.

But lookups, casual chat, anything latency-critical — don't. Making a model deliberate for ten seconds over the capital of France just burns time and money.

The real skill is knowing when to spend.

---

### SCENE 8 — Recap + CTA [2:15–2:33]

[Warm, direct — close strong]

Quick recap.

One forward pass became a *chain of reasoning.* Accuracy scales with thinking — logarithmically, at real cost, with diminishing returns.

It's a whole new way to buy intelligence: not bigger, *deeper.*

Next time, we go inside that chain — what the model's hidden reasoning actually looks like.

If this made it click, hit like.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(For Remotion build — ★ = change needed vs current built scene to support the deeper script)*

| Scene | Timestamp | Animation to build | Remotion notes |
|-------|-----------|-------------------|----------------|
| 1 — Hook | 0:00–0:20 | ★ Keep the two-model contrast, but add the killer number: a benchmark labeled **"AIME (hard math)"** with a score counter that **leaps 13% → 83%** while the model's *size stays identical*. End on the open-loop line. | Counting number (interpolate), "same size" emphasis; tease "…can make it worse" as a dim footnote |
| 2 — The old way | 0:20–0:37 | Question token → single quick pulse through one MODEL core → instant answer. Label **"ONE FORWARD PASS · fixed compute"** | Pulse travels in one beat; "first guess" caption |
| 3 — The new way | 0:37–0:59 | ★ Scratchpad fills with reasoning tokens; annotate **"each token = +compute"**. Add a row of model chips: **o1 · R1 · Claude · Gemini**. Add a small badge: **"trained with RL — reward = correct answer."** | Sequential token reveal; chips spring in; RL badge fades in late |
| 4 — More thinking = better | 0:59–1:17 | ★ Accuracy curve, x-axis labeled **"thinking (log compute)"**, y = accuracy. Curve climbs; annotate the **13%→83%** point; call out **"logarithmic — diminishing returns."** | Path draw; climbing marker; log-axis tick labels |
| 5 — The tradeoff | 1:17–1:35 | ★ Dial from low→high with meters: accuracy ↑, **cost ↑ (5–10× tokens)**, **latency ↑ (ms→s)**. Then a second mini-curve on an **EASY** problem that *dips* past a point = **"overthinking."** | Rotating dial; tandem meters; small inverted-U for the overthinking beat |
| 6 — Why it's huge | 1:35–1:55 | ★ Two-axis diagram: **"train bigger"** (one-time, walls) vs **"think at answer-time"** (new). Then split the new axis into two flavours: **THINK LONGER** (one deep chain) vs **THINK WIDER** (parallel samples → verifier picks best). | Two axes; second axis highlighted; fork into longer/wider with a verifier node |
| 7 — When to use it | 1:55–2:15 | Two guidance cards: **LET IT THINK** (math/code/logic/planning, green) vs **DON'T** (lookups/chat/latency, muted) with example chips | Staggered cards; verdict colors |
| 8 — Recap + CTA | 2:15–2:33 | Recap diagram: forward-pass → reasoning-chain; tagline **"Not bigger. Deeper."** → teaser "Inside a reasoning model" → hand off to the Like/Subscribe CTA scene | Flow rings; tagline; teaser (brand now lives in Scene 9 CTA) |

---

### Fact-check notes (so claims hold up to a technical audience)
- **13% → 83%:** GPT-4o ≈ 13% vs o1 ≈ 83% (consensus) on **AIME 2024**. Phrase as "around 13% to over 80%" to stay safe.
- **Reasoning tokens are billed** as output tokens; a hard query can run many thousands → the 5–10× cost framing is conservative.
- **Logarithmic scaling:** OpenAI's o1 post showed accuracy scaling roughly log-linearly with test-time compute.
- **RLVR** (RL with verifiable rewards) is the training method behind o1/R1 — reward the final correct answer, let the chain emerge.
- **Two flavours:** sequential (longer CoT) vs parallel (best-of-N / self-consistency + a verifier or PRM). Both are "test-time compute."
- **Overthinking:** documented — forcing long reasoning on easy items can lower accuracy and waste tokens.
- Models named are current as of mid-2026; this is a *trending* video, so dating it is acceptable.
