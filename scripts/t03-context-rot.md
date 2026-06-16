# Trending 03 — Context Rot

**Title:** Context Rot: why long conversations make AI dumber
**Duration target:** 1:55
**Word count:** ~270 words (~140 wpm)
**Topic:** Context rot — how a model's answers degrade as a conversation grows
**Track:** Trending

---

## NARRATION SCRIPT
*(Read this aloud to record your audio. Tone cues in [brackets].)*

---

### SCENE 1 — Hook [0:00–0:14]

[Calm, knowing — like you're letting them in on a secret]

It's not your imagination.

The longer your chat with an AI gets, the worse its answers seem to get.

Sharp and crisp at the start. Vague and sloppy by the end.

There's a name for this. It's called *context rot*.

---

### SCENE 2 — What is context rot [0:14–0:30]

[Explanatory, clear]

Here's the idea.

A model reads everything in the conversation at once. That's its *context*.

But its attention is finite. As the conversation grows, that same attention has to stretch across more and more text.

The important stuff — the signal — gets buried under everything else — the noise.

More words in… does not mean more understanding out.

---

### SCENE 3 — Lost in the middle [0:30–0:47]

[Building — this is the surprising part]

And it gets stranger. *Where* a fact sits in the conversation changes whether the model even sees it.

Put a key fact at the very start, the model finds it. Put it at the very end, it finds it.

But put that exact same fact in the *middle*… and it often gets missed.

Researchers call it "lost in the middle" — attention is high at the edges, and sags in the center. A U-shaped curve.

---

### SCENE 4 — Why it happens [0:47–1:03]

[A bit more technical — let the animation breathe]

Why does this happen? Think of attention as a spotlight on a stage.

With a short conversation, the stage is small. The light is bright. Every actor is lit.

But every new message makes the stage bigger. The same spotlight now has to cover more ground — so it dims everywhere.

The budget didn't grow. It just got spread thinner.

---

### SCENE 5 — The demo [1:03–1:20]

[Matter-of-fact, then a beat of "oops"]

Watch it happen. Message one: you tell the AI — "always reply in French."

Fifty messages later, that instruction is buried way back at the top, faded, forgotten.

You ask a simple question… and it answers in English.

It didn't disobey you. It just couldn't *see* the rule anymore.

---

### SCENE 6 — The fixes [1:20–1:37]

[Practical, upbeat — here's what to do]

So how do you fight rot? Four moves.

*Compact* — summarize the old turns into a tight recap.

*Re-inject* — repeat the key facts near the end, where attention is strong.

*Start fresh* — when a thread gets bloated, open a clean one.

*Keep only what matters* — curate the context instead of dumping everything in.

---

### SCENE 7 — Why it matters [1:37–1:48]

[The big takeaway]

Here's the mindset shift.

A bigger context window is not a bigger brain. Stuffing everything into one giant thread doesn't help — it *hurts*.

Short, curated context beats a long, bloated one. Design for rot.

---

### SCENE 8 — Recap + CTA [1:48–1:55]

[Warm, direct — close strong]

So — context rot. Long chats spread attention thin, facts get lost in the middle, instructions fade.

The fix? Keep it short, keep it relevant, refresh often.

Next: *Subagents — giving each task its own brain.*

If this made something click, hit like — it really helps the channel.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(For Remotion build — maps to each scene above)*

| Scene | Timestamp | Animation to build | Remotion notes |
|-------|-----------|-------------------|----------------|
| 1 — Hook | 0:00–0:14 | A chat thread stacks message after message; an early AI reply is sharp + green, a late reply is blurred + red. "It's not your imagination." | Staggered message stack, blur interpolation, green→red color shift |
| 2 — What is context rot | 0:14–0:30 | A context box fills with grey "noise" text; one gold "signal" line gets buried. Signal-to-noise bar drops as words pour in. | Block fill, single highlighted line dimming, draining S/N meter |
| 3 — Lost in the middle | 0:30–0:47 | A long document column; a key fact tested at START (found ✓), END (found ✓), MIDDLE (missed ✗). U-shaped attention curve draws over it. | Animated U-curve path, position markers, ✓/✗ verdicts |
| 4 — Why it happens | 0:47–1:03 | A spotlight covers a small stage (bright) → stage widens with each message → light dims everywhere. "Finite budget, spread thin." | Expanding spotlight radius, falling brightness, token count rising |
| 5 — The demo | 1:03–1:20 | Instruction card "always reply in French" pinned at top; 50 messages pile on top; it fades/buries; final reply comes back in English ✗. | Pinned card fade, message pile-up, broken-rule reveal |
| 6 — The fixes | 1:20–1:37 | Four clean glassy cards reveal in sequence: Compact, Re-inject, Start fresh, Keep only what matters. | Staggered spring card reveal, icon + label + one-liner |
| 7 — Why it matters | 1:37–1:48 | Side-by-side: a huge bloated thread (rotting, red) vs a short curated one (crisp, green). Curated wins. | Split compare, decay vs clean, verdict checkmark |
| 8 — Recap | 1:48–1:55 | Three-point recap chips (spread thin · lost in middle · fades) → fix line → teaser → channel brand block. | Chip reveal, tagline fade, CTA + brand |
</content>
</invoke>
