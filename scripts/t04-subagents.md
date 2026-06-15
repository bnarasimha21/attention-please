# Trending 04 — Subagents: giving each task its own brain
**Title:** Subagents — how one agent spins off a clone to stay sane
**Duration target:** 1:50
**Word count:** ~280 words (~140 wpm, tightened preview cut)
**Topic:** Subagents — isolated helper agents that keep the main thread clean
**Track:** Trending (pairs with the harness series — the "Subagents" layer, zoomed in)

---

## NARRATION SCRIPT
*(Read this aloud to record your audio. Tone cues in [brackets].)*

---

### SCENE 1 — Hook [0:00–0:13]

[Calm, a little wry — pull them in]

Here's your agent, working a task. One brain, one window of attention.

But every file it reads, every search it runs — the raw output piles up right next to its thinking.

One brain. Way too much noise.

---

### SCENE 2 — The problem [0:13–0:26]

[Explanatory, a little tense]

The context window is fixed. There's only so much it can hold at once.

Dump a huge file read, a web search, a wall of tool logs into it — and the actual goal gets buried under junk.

The agent loses the thread. Literally.

---

### SCENE 3 — The idea [0:26–0:39]

[Lift — here's the move]

So here's the move: spin off a *subagent*.

A second agent, with its own fresh, empty context window. A clean mind, just for this one messy job.

The main agent stays exactly where it is.

---

### SCENE 4 — How it works [0:39–0:57]

[Clear, deliberate — this is the key beat]

This is the whole trick.

The main agent hands the messy task to the subagent. The subagent does *all* the noisy work — the long reads, the searches, the logs — inside its *own* window.

When it's done, it returns just one thing: the clean answer.

The junk stays trapped on the subagent's side. The main thread? Never even saw it. Still pristine.

---

### SCENE 5 — Parallel subagents [0:57–1:14]

[Building energy — scale]

And you're not limited to one.

Spin up several at once. One researches. One reviews the code. One runs the tests.

Each works in its own isolated window, in parallel — then reports back a tight result to the agent running the show.

Three messy jobs, done at the same time. One clean desk.

---

### SCENE 6 — When to use [1:14–1:30]

[Practical — a quick rule]

So when do you reach for one?

Isolated research, code review, debugging, exploring a few options at once — perfect for a subagent. Hand off the mess.

But tightly-coupled reasoning — where every step depends on the last — keep that in the main thread.

---

### SCENE 7 — Why it matters [1:30–1:43]

[Warm — the payoff]

Here's why it matters.

The main agent's attention stays sharp and focused on the goal — instead of drowning in raw output.

And you scale work sideways, in parallel.

A clean mind makes better decisions.

---

### SCENE 8 — Recap + CTA [1:43–1:55]

[Warm, direct — close strong]

So: a subagent is a fresh brain for a messy job. It isolates the noise and returns only the answer — keeping the main thread clean.

Next up: *Is RAG dead?*

If this made something click, hit like — it really helps the channel. See you in the next one.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(For Remotion build — maps to each scene above)*

| Scene | Timestamp | Animation to build | Remotion notes |
|-------|-----------|-------------------|----------------|
| 1 — Hook | 0:00–0:13 | Main MODEL core beside its context window; tool-output chips ("file read", "search dump", "tool log") rain in and clutter the window until it flashes "overloaded" | Core + window panel, staggered chip drops, shake/redden at the end |
| 2 — Problem | 0:13–0:26 | The window fills with junk blocks; a clear "GOAL" line sinks and gets buried under the noise stack | Goal pill sliding down, junk blocks stacking over it, capacity bar maxing out |
| 3 — Idea | 0:26–0:39 | Main core "clones" — a second core buds off and slides aside, popping its OWN empty, clean context window | Spring bud-off, second core + empty window reveal, "fresh context" tag |
| 4 — How it works | 0:39–0:57 | Main delegates a messy task → arrow to subagent → subagent's window fills with noise (contained) → a single clean "answer" pill crosses BACK; main window stays empty/clean | Two-panel isolation, task arrow over, noise contained on right, clean pill returns left |
| 5 — Parallel | 0:57–1:14 | Orchestrator core in center; 3 subagents (research / review / tests) fan out, each with its own little noisy window, all returning concise result chips at once | Fan-out layout, simultaneous noise fills, 3 result chips converge to center |
| 6 — When to use | 1:14–1:30 | Two-column decision guide: green "use a subagent" (research, review, debug, parallel) vs amber "keep in main thread" (tightly-coupled reasoning) | Staggered row reveals, check vs caution icons, color-coded columns |
| 7 — Why it matters | 1:30–1:43 | Single sharp focused core, attention beam locked on a "GOAL" target; side note shows parallel lanes | Focused core glow, beam to target, two payoff chips, tagline |
| 8 — Recap + CTA | 1:43–1:55 | Clean final diagram: orchestrator core in center ringed by 3 isolated subagent satellites returning answers; tagline → teaser "Is RAG dead?" → brand block | Satellite layout reveal, tagline, teaser, "Attention Please" brand |
