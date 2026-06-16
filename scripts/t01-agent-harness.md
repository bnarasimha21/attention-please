# Trending 01 — What is an agent harness?
**Title:** Claude Code isn't a CLI that calls Claude (it's a harness)
**Duration target:** 6:45
**Word count:** ~940 words (~140 wpm)
**Topic:** The agent harness — the architecture behind Claude Code, Codex, Cursor
**Track:** Trending

---

## NARRATION SCRIPT
*(Read this aloud to record your audio. Tone cues in [brackets].)*

---

### SCENE 1 — Hook [0:00–0:30]

[Calm, a little provocative — pull them in]

You probably think Claude Code is a command-line tool that calls Claude.

Type a prompt, the model answers, done.

It's not.

The model is maybe twenty percent of what's happening. The other eighty percent is something most people have never heard of.

It's called a *harness*. And in 2026, it's become the most important idea in AI engineering.

---

### SCENE 2 — The one-line definition [0:30–1:30]

[Explanatory, clear]

Here's the cleanest way to say it:

The model generates text. The *harness* decides what that text can touch.

That's it. That's the whole idea.

A raw language model can't do anything. It can't read a file. It can't run a command. It can't remember what you said five minutes ago. All it does is predict text.

The harness is everything *between* that text and the real world. When the model says "edit this file" — something has to actually open the file, apply the change, and hand the result back. That something is the harness.

So the model is the engine. The harness is the entire car around it — the wheels, the brakes, the steering, the dashboard.

---

### SCENE 3 — The agent loop [1:30–2:30]

[Building — this is the beating heart]

At the center of every harness is a loop.

The model looks at the situation — that's *observe*. It decides what to do next — *plan*. It calls a tool — *act*. Then it looks at the result, and the loop starts again.

Observe, plan, act. Over and over, until the job is done.

A chatbot answers once and stops. An agent runs this loop — sometimes dozens of times — chaining actions together to finish a real task.

And here's the catch: every trip around the loop costs tokens and time. So the harness runs the loop on a *budget*. It has to be smart about how it spends each step — because the loop can't run forever.

---

### SCENE 4 — The harness layers [2:30–3:45]

[A bit more technical — let the animation breathe]

So what's actually wrapped around the model? Layer by layer.

*Context* — the harness assembles everything the model needs to see this turn: your message, the files, the history.

*Tools* — file reads, edits, shell commands, web search. The model's hands.

*Permissions* — a gate on every single action, deciding what's allowed.

*Memory and compaction* — keeping the conversation from overflowing.

*MCP* — a standard plug for connecting outside systems: GitHub, databases, browsers.

*Subagents* — spinning off isolated helpers so messy work doesn't pollute the main thread.

*Hooks* — your own code firing at key moments, like running a linter after every edit.

Strip all of that away, and you're left with a model that can only talk. Add it back, and you get something that can actually *do the work*.

---

### SCENE 5 — Permissions: the safety gate [3:45–4:30]

[Slightly serious — this is the trust part]

Let's zoom in on one layer, because it's the one that keeps the whole thing safe: permissions.

The model wants to take an action. Before anything happens, the harness asks a question — is this safe?

Reading a file, searching text — that's harmless. Auto-approved. Green light.

Editing a file, changing state — that gets a pause. The harness asks *you* first.

And something destructive — deleting things, running risky commands — gets blocked or escalated.

This is the line the model can't cross on its own. The model proposes. The harness disposes. That gate is exactly why you can let an agent loose on your codebase without losing sleep.

---

### SCENE 6 — Context & compaction [4:30–5:15]

[Matter-of-fact, landing a key concept]

Now, one more layer worth understanding: how the harness manages memory.

The model has a fixed window — a maximum amount it can look at, at once. A long task overflows it fast.

So the harness watches the window fill up. When it gets close to the limit, it does something clever: it *compacts*. It summarizes the older parts of the conversation into a tight recap, frees up the space, and keeps going — without you ever noticing.

That's why a coding agent can work for an hour straight and not "forget" what it was doing. The harness is quietly rewriting its own memory the whole time.

---

### SCENE 7 — Why this matters [5:15–6:00]

[Practical — the big takeaway]

Here's why this changes how you should think about AI.

Everyone obsesses over which model is best. But take the *same* model, and put it in two different harnesses — a weak one and a strong one — and you get wildly different results. One barely works. The other ships real software.

The model is becoming a commodity. They're all converging, all getting cheaper. The *harness* is where the real product lives now.

That's why the hottest skill in AI engineering this year isn't prompting — it's *harness engineering*. Designing the loop, the tools, the permissions, the memory. The stuff around the model.

---

### SCENE 8 — Recap + CTA [6:00–6:45]

[Warm, direct — close strong]

So, to recap.

A harness is everything between the language model and the real world.

It runs a loop — observe, plan, act. It wraps the model in tools, permissions, memory, and connections. And it decides what the model's text is actually allowed to touch.

The model thinks. The harness *acts*.

Next time you use Claude Code or any coding agent, you'll see it for what it really is — not a chatbot in a terminal, but a harness with a model at its core.

If this made something click, hit like — it really helps the channel.

See you in the next one.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(For Remotion build — maps to each scene above)*

| Scene | Timestamp | Animation to build | Remotion notes |
|-------|-----------|-------------------|----------------|
| 1 — Hook | 0:00–0:30 | Terminal `$ claude` prompt → dissolves → glowing MODEL core appears, the word "harness" materializes around it | Typewriter prompt, fade-to-core, label reveal |
| 2 — Definition | 0:30–1:30 | Model emits a text bubble → it hits a harness gate → gate routes it to the real world (file/shell/web icons) | Bubble travels, gate intercept, fan-out to world icons |
| 3 — The loop | 1:30–2:30 | Circular loop: Observe → Plan → Act → repeat, a token rotating around; budget bar draining each lap | Rotating ring, animated node highlight, depleting budget bar |
| 4 — Layers | 2:30–3:45 | Central MODEL core; concentric rings appear one by one: Context, Tools, Permissions, Memory, MCP, Subagents, Hooks | Staggered ring reveal with labels, spring scale-in |
| 5 — Permissions | 3:45–4:30 | An action arrives at a 3-way gate → routes to Auto-approve (green) / Ask (amber) / Block (red) | Branching paths, color-coded outcomes, lock icon |
| 6 — Compaction | 4:30–5:15 | Context bar fills with message blocks → hits limit → old blocks collapse into a small summary → bar frees up | Bar fill, overflow flash, collapse-into-summary animation |
| 7 — Why it matters | 5:15–6:00 | Same MODEL core duplicated into a weak harness vs strong harness → different outputs | Split screen, identical core, divergent results |
| 8 — Recap | 6:00–6:45 | Clean final diagram: MODEL core wrapped in loop + layers, "The model thinks. The harness acts." | Assemble full diagram, fade in tagline, CTA |
