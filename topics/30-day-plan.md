# Attention Please — 30-Day Video Plan

**Channel:** Attention Please
**Audience:** Working developers who use AI daily but want to understand what's underneath
**Format:** 6-8 min animated explainers, Remotion
**Arc:** Start with what they *want* to understand → explain foundations as needed → arrive at cutting-edge

---

## Phase 1 — "Wait, how does this actually work?" (Days 1–7)
*The questions every developer has but is afraid to ask. Hook: relatable confusion → satisfying clarity.*

| Day | Title | Hook | Core animation |
|-----|-------|------|----------------|
| 01 | How ChatGPT reads your message | "Before it thinks, it doesn't see words — it sees numbers" | Tokenization animated: text → tokens → IDs |
| 02 | Why AI can't count the letter 'r' in strawberry | "This one breaks every LLM. Here's why." | Byte-pair encoding, token boundaries |
| 03 | What is a vector? The secret behind everything AI does | "A word becomes a point in space — and that changes everything" | Word → 3D space, similar words cluster |
| 04 | How embeddings work | "How does AI know 'dog' and 'puppy' mean similar things?" | Text → numbers → distance in space |
| 05 | Cosine similarity — how AI finds "similar" things | "Not all distances are equal" | Two vectors, angle between them animated |
| 06 | The Attention Mechanism — the idea that changed AI forever | "One paper. 2017. Everything changed." | Query/Key/Value animated step by step |
| 07 | How Transformers work | "The architecture behind every AI you use today" | Full transformer block, layer by layer |

---

## Phase 2 — Building blocks (Days 8–14)
*Neural networks, learning, and why AI behaves the way it does.*

| Day | Title | Hook | Core animation |
|-----|-------|------|----------------|
| 08 | What is a neural network — really? | "Not a brain. Not magic. Here's what it actually is." | Perceptron → layers → weights animated |
| 09 | Backpropagation visualized | "How AI learns from its mistakes" | Error flowing backwards through network |
| 10 | Gradient descent — the hill-climbing trick | "Every AI model learns this one way" | Loss landscape, rolling downhill |
| 11 | Why AI hallucinates | "It's not lying. It's guessing. Here's why." | Probability distribution over next token |
| 12 | Context windows — why they matter more than you think | "This is the real constraint behind every LLM" | Context as a sliding window, what falls off |
| 13 | KV Cache — how LLMs remember within a conversation | "Without this, every reply would take forever" | Keys/values cached across turns |
| 14 | Fine-tuning vs prompting — what's actually different | "Both change how AI responds. Only one changes the weights." | Prompt layer vs weight update animated |

---

## Phase 3 — RAG, Agents, Modern Stack (Days 15–21)
*The stuff developers are building with right now.*

| Day | Title | Hook | Core animation |
|-----|-------|------|----------------|
| 15 | What is RAG? | "LLMs don't know what happened yesterday. RAG fixes that." | Retrieval + generation loop animated |
| 16 | Vector databases explained | "A database that searches by meaning, not keywords" | Insert → embed → index → query |
| 17 | How embeddings + vector search power RAG | "The full pipeline, animated" | End-to-end: document → chunk → embed → retrieve → generate |
| 18 | What is an AI agent? | "It's not a chatbot. It has a loop." | Observe → plan → act → observe loop |
| 19 | Tool calling — how AI uses the internet | "The moment AI stopped being just a text box" | LLM decides → calls tool → gets result → responds |
| 20 | MCP — the protocol that connects AI to everything | "Like USB, but for AI" | MCP host → client → server animated |
| 21 | Multi-agent systems — when AIs work together | "One agent is smart. Many agents are powerful." | Orchestrator → worker agents → synthesis |

---

## Phase 4 — Cutting edge (Days 22–30)
*The stuff that's shaping where AI goes next.*

| Day | Title | Hook | Core animation |
|-----|-------|------|----------------|
| 22 | How RLHF works | "How AI is trained to be helpful — and why that's hard" | Reward model scoring, policy update loop |
| 23 | Prompt engineering — what actually works | "Not magic words. Actual techniques." | Few-shot, chain-of-thought, structured prompts animated |
| 24 | How diffusion models generate images | "It starts with noise and works backwards" | Pure noise → gradual denoising → image |
| 25 | Knowledge graphs — structured memory for AI | "When embeddings aren't enough" | Entities, relations, traversal animated |
| 26 | AI memory systems — how agents remember across sessions | "Session memory, semantic memory, episodic — all animated" | Memory types and retrieval paths |
| 27 | How streaming works — tokens in real-time | "Why does ChatGPT type letter by letter?" | SSE, token generation, stream flush animated |
| 28 | LLM benchmarks — and why they're misleading | "Every lab claims the best model. Here's how to read the numbers." | Benchmark leaderboard, Goodhart's Law |
| 29 | The inference stack — GPU, VRAM, batching | "What actually happens when you hit Send" | Request → GPU → tensor ops → response |
| 30 | Scaling laws — the bet that built modern AI | "More data + more compute = smarter AI. But why?" | Loss curve, emergent capabilities animated |

---

## Notes
- Each day = one video. Script goes in `scripts/dayNN-slug.md`. Remotion code in `videos/dayNN-slug/`.
- Start with Day 01. Build script first, then animation.
- Shorts: pull 45-60s clip from each video after editing.
