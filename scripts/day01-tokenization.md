# Day 01 — How ChatGPT reads your message
**Title:** How ChatGPT reads your message (it's not what you think)
**Duration target:** 6:15
**Word count:** ~870 words (~140 wpm)
**Topic:** Tokenization + BPE

---

## NARRATION SCRIPT
*(Read this aloud to record your audio. Tone cues in [brackets].)*

---

### SCENE 1 — Hook [0:00–0:30]

[Calm, slightly mysterious — pull them in]

When you type something to ChatGPT — let's say just the word "Hello" — you think you're sending a word.

But the model never sees that word.

It sees this: 15496, 11.

Two numbers. That's it.

And understanding *why* — unlocks how every AI language model actually works.

---

### SCENE 2 — What is a token [0:30–1:30]

[Explanatory, clear — like you're explaining to a smart friend]

Language models don't read letter by letter. They don't read word by word either.

They read in chunks called *tokens*.

A token is roughly a piece of a word. Sometimes it's a full word. Sometimes it's half a word. Sometimes it's just punctuation.

The word "Hello" becomes two tokens: "Hel" and "lo".

The word "the" is just one token.

"Unbelievable" might be three or four.

Every piece of text you've ever sent to an AI gets sliced up this way before the model sees a single thing.

---

### SCENE 3 — Why tokens, not words [1:30–2:30]

[Logical, building understanding]

Why break it up like this? Because words are a mess.

English has hundreds of thousands of them. New words appear all the time — TikTok, GPT, blockchain. Names, slang, code, typos.

A model can't have a lookup table for every word that ever existed — in every language.

But with tokens? You can cover almost any text in any language with around 100,000 carefully chosen pieces.

Much more manageable.

And rare words — words the model has never seen before? They just get split into more common pieces. The model still handles them.

---

### SCENE 4 — Byte Pair Encoding [2:30–3:30]

[A bit more technical — slow down slightly, let the animation breathe]

The algorithm that figures out these chunks is called Byte Pair Encoding. BPE.

It starts with millions of text examples and asks: which pairs of characters appear together most often?

"t" followed by "h" — very common. Merge them into "th".

"th" followed by "e" — very common. Merge into "the".

"i" followed by "ng" — very common. Merge into "ing".

It keeps doing this — merging the most frequent pairs — until the vocabulary reaches the right size.

The result is a set of tokens that covers the language efficiently. Common words are single tokens. Rare words are built from pieces.

---

### SCENE 5 — Tokens to numbers [3:30–4:15]

[Matter-of-fact, landing the core concept]

Once the vocabulary is set, each token gets an ID number.

"Hello" → 15496. "world" → 995. A space before a word? That's a *different* token. A capital letter? Different token.

Your entire message — no matter how long — becomes a flat list of integers.

That list of numbers is the only thing that enters the model.

Not sentences. Not meaning. Not intent. Just numbers.

---

### SCENE 6 — The strawberry problem [4:15–5:00]

[A bit playful — this is the fun part]

This is exactly why AI famously struggles with counting letters.

Ask any LLM: "How many r's are in strawberry?"

Most get it wrong.

Why? Because the model doesn't see s-t-r-a-w-b-e-r-r-y.

It sees tokens: "str", "aw", "berry".

Each token is one unit. The model has to figure out what letters are *inside* a token — which it was never directly trained to do.

It's not stupid. It's just looking at something completely different from what you are.

---

### SCENE 7 — Why this matters to you [5:00–5:45]

[Practical, useful — give them something to take away]

Knowing this changes how you use these tools.

That context window limit you've heard about? It's measured in tokens, not words.

A 128k context window isn't 128,000 words — it's roughly 96,000 words, because tokens are slightly shorter than words on average.

And if you're calling the API? You pay per token. Not per word, not per character. Per token.

So if you're sending a long system prompt in every API call, you're spending tokens on every single request. Knowing that helps you optimize.

---

### SCENE 8 — Recap + CTA [5:45–6:15]

[Warm, direct — close strong]

So to recap.

Before your LLM does any thinking — your message gets broken into tokens using an algorithm called Byte Pair Encoding.

Each token becomes a number.

The model works entirely in those numbers.

Next time you hit Send, you now know exactly what the model actually receives.

Next video: we go one layer deeper — what happens once those numbers go *in*.

If this made something click, hit like — it helps the channel grow.

See you next one.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(For Remotion build — maps to each scene above)*

| Scene | Timestamp | Animation to build | Remotion notes |
|-------|-----------|-------------------|----------------|
| 1 — Hook | 0:00–0:30 | "Hello" typed on screen → slowly replaced by [15496, 11] | Typewriter effect, number reveal with stagger |
| 2 — Tokens | 0:30–1:30 | "Hello" splits into colored boxes: ["Hel"] ["lo"]. Show "the" as 1 box, "Unbelievable" as 4 | Box split animation, color coding by token |
| 3 — Why tokens | 1:30–2:30 | Word list growing infinitely vs token vocabulary capped at 100k | Counter animation, infinite scroll vs fixed grid |
| 4 — BPE | 2:30–3:30 | Character pairs merging step by step: t+h → th → the | Merge animation, highlight most frequent pairs |
| 5 — IDs | 3:30–4:15 | Token → lookup table → number. Full sentence → list of numbers | Table lookup animation, number sequence build |
| 6 — Strawberry | 4:15–5:00 | "strawberry" split into token boxes, show 'r' count per box | Token boxes with letter highlights, count bubbles |
| 7 — Why it matters | 5:00–5:45 | Context window bar filling with tokens, API cost counter ticking | Progress bar, animated cost ticker |
| 8 — Recap | 5:45–6:15 | Full pipeline: "Hello world" → tokenize → IDs → model (black box) | Clean summary diagram, fade in each step |
