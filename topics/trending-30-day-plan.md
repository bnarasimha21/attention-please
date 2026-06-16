# Attention Please — Trending Track

**Channel:** Attention Please
**Audience:** Working developers who use AI daily and want to keep up with what's *actually* moving right now
**Format:** short (~2–3 min) animated explainers, Remotion
**Arc:** The "trending now" track — topics that are the talk of the town as of mid-2026: agent harnesses, context engineering, the death-of-RAG debate, reasoning models. These are peaking in attention, so they bring the views.

*Snapshot date: June 2026. Re-check the model-landscape days before recording — that space moves weekly.*

---

## Phase 1 — The Agent Harness & Context Engineering (Days 1–7)
*The single hottest topic in AI engineering right now. "The model generates text. The harness decides what that text can touch."*

| Day | Title | Hook | Core animation |
|-----|-------|------|----------------|
| 01 | What is an agent harness? | "Claude Code isn't a CLI that calls Claude. It's a harness — and that's the real product." | LLM in the center → harness layers wrapping it (tools, permissions, memory, loop) |
| 02 | Context engineering — the skill that's replacing prompt engineering | "Prompt engineering optimizes the question. Context engineering optimizes everything around it." | Prompt (small) vs context window (the whole stage) being assembled |
| 03 | Context rot — why long conversations get dumber | "It's not your imagination. The longer the chat, the worse it gets." | Signal degrading across a long context, key facts buried/lost |
| 04 | Subagents — giving each task its own brain | "Verbose work pollutes the main thread. So you spin off a clone." | Main agent → spawns subagent with isolated context → returns just the answer |
| 05 | Skills vs prompts vs tools — when to use what | "Three ways to give an agent a new ability. Only one is right per job." | Decision tree: domain logic → skill, action → tool, instruction → prompt |
| 06 | The agent loop — observe, plan, act, repeat | "Every agent is just a while-loop with a budget. Here's the budget part." | Loop animated with a token/step budget draining each cycle |
| 07 | Context windows & compaction — how agents don't run out of room | "Your conversation is too big to fit. So the agent quietly rewrites it." | Context filling up → compaction summarizes old turns → room freed |

---

## Phase 2 — Memory, MCP & Orchestration (Days 8–14)
*The plumbing that turns a chatbot into a teammate.*

| Day | Title | Hook | Core animation |
|-----|-------|------|----------------|
| 08 | AI agent memory in 2026 — working, episodic, semantic | "Context is short-term. Memory is what survives the session." | Three memory stores, what flows into each, retrieval paths |
| 09 | MCP deep dive — the protocol that won | "USB for AI agents — and in 2026 basically everything speaks it." | Host → client → server, tools/resources flowing across the wire |
| 10 | Tool calling reliability — why agents fail (and how harnesses fix it) | "The model wants to call a tool. A hundred things can go wrong first." | Tool call → validation → permission → execute → error-handling branches |
| 11 | Permissions & guardrails — the part that keeps agents safe | "Auto-approve, ask, or block? This decision happens on every action." | Three-tier permission gate: read = green, write = ask, danger = block |
| 12 | Hooks & lifecycle — automating the agent's behavior | "Run my linter every time the agent edits a file — without asking it to." | Lifecycle timeline with hooks firing at pre/post events |
| 13 | Multi-agent pipelines — orchestrator and workers | "One agent thinks. A fleet ships." | Orchestrator fans out → parallel workers → results synthesized |
| 14 | Dynamic workflows — when the agent writes its own harness | "The newest trick: the agent builds a custom workflow for the task in front of it." | Agent authoring a mini-pipeline on the fly, then running it |

---

## Phase 3 — The Retrieval & Reasoning Shift (Days 15–21)
*"RAG is dead" is the clickbait. Here's the nuanced truth — plus the reasoning revolution.*

| Day | Title | Hook | Core animation |
|-----|-------|------|----------------|
| 15 | Is RAG dead? | "Every other post says so. Let's actually settle it." | Classic RAG pipeline → crossed out → "it's complicated" reveal |
| 16 | Test-time compute — why the best models now "think" before answering | "The biggest shift since transformers: pay more at answer-time, get more intelligence." | Fast guess vs deliberate reasoning chain, accuracy climbing with thinking |
| 17 | Inside a reasoning model — what "thinking" actually is | "It's not magic. It's the model talking to itself first." | Hidden reasoning trace generating, then collapsing into the final answer |
| 18 | Agentic retrieval — RAG that thinks before it searches | "The fix wasn't killing RAG. It was letting the agent drive it." | Query → agent reformulates into subqueries → multi-step retrieval |
| 19 | Long context vs RAG vs memory — which one when | "Million-token windows changed the math. Here's the decision rule." | Three approaches side by side with the use-case that fits each |
| 20 | Context architecture — what's replacing naive RAG | "Stop bolting retrieval on. Start designing the whole context." | Semantic layer + memory + retrieval composed into one context system |
| 21 | Always-on reasoning & the speed/accuracy dial | "2026's models let you trade seconds for smarts. Here's the dial." | Slider: speed ↔ accuracy, latency and quality moving together |

---

## Phase 4 — Models, Evals & Production (Days 22–30)
*Where the frontier is, and what it takes to ship on it.*

| Day | Title | Hook | Core animation |
|-----|-------|------|----------------|
| 22 | The 2026 model landscape — who's actually winning | "GPT-5.x, Claude, Grok 4.3, Gemini 3.1 — decoded without the hype." | Leaderboard with axes: reasoning, context size, speed, price |
| 23 | Open models you can run locally | "An 80B coder model on your own machine, near closed-model quality. In 2026 that's real." | Cloud model vs local model on a laptop, weights downloading |
| 24 | Evals — the real bottleneck nobody talks about | "Everyone ships agents. Almost nobody can prove they work." | Test suite scoring agent outputs, pass/fail flowing into a dashboard |
| 25 | AI observability — debugging agents in production | "When an agent fails at step 7 of 12, where do you even look?" | Trace timeline of an agent run, the failing span lighting up red |
| 26 | AI coding agents — from autocomplete to cloud teammates | "The journey from tab-complete to 'open a PR while I sleep.'" | Evolution timeline: autocomplete → chat → agent → autonomous teammate |
| 27 | The economics of agents — tokens, caching, and cost | "Why your clever agent's bill exploded — and prompt caching to the rescue." | Token meter ticking, cache hit slashing the cost bar |
| 28 | Multimodal agents — perceive, then act | "Models that don't just read — they see, click, and do." | Agent reading a screen, locating a button, taking an action |
| 29 | Agent safety — when autonomy meets the real world | "More capable = more dangerous. The guardrails behind autonomous agents." | Permission boundaries, sandbox walls, human-in-the-loop checkpoint |
| 30 | Where agents go next — the autonomous engineering pipeline | "Today: an agent edits a file. Tomorrow: an agent runs the whole repo." | Full loop: issue → plan → code → test → review → ship, agent-driven |

---

## Notes
- Each video: script → `scripts/tNN-slug.md`, Remotion code → `videos/tNN-slug/` (prefix `tNN`).
- **Trending topics go stale fast.** Re-verify Days 19–23 (reasoning models, model landscape, local models) right before you record — names and numbers change monthly.
- Shorts: the harness, context engineering, "is RAG dead?", and test-time compute days are the most viral-friendly — cut those first.

---

### Sources (June 2026 trend scan)
- [What Is an Agent Harness? — MindStudio](https://www.mindstudio.ai/blog/what-is-agent-harness-architecture-explained)
- [Claude Code Architecture: Six Harness Layers — Mervin Praison](https://mer.vin/2026/05/claude-code-architecture-explained-six-harness-layers-beyond-the-llm/)
- [Context Engineering & MCP — indigo.ai](https://indigo.ai/en/blog/context-engineering/)
- [State of AI Agent Memory 2026 — mem0](https://mem0.ai/blog/state-of-ai-agent-memory-2026)
- [Context architecture is replacing RAG — VentureBeat](https://venturebeat.com/data/context-architecture-is-replacing-rag-as-agentic-ai-pushes-enterprise-retrieval-to-its-limits)
- [GAM vs "context rot" — VentureBeat](https://venturebeat.com/ai/gam-takes-aim-at-context-rot-a-dual-agent-memory-architecture-that)
- [Test-Time Compute Explained — AI Magicx](https://www.aimagicx.com/blog/test-time-compute-explained-ai-thinking-models-2026)
- [AI Updates / LLM landscape — llm-stats.com](https://llm-stats.com/llm-updates)
- [AI Trends That Actually Matter [May 2026] — The Runtime](https://medium.com/the-runtime/ai-trends-that-actually-matter-right-now-may-2026-85b861f58f56)
- [Claude Code Guide 2026: 25 Features — MarkTechPost](https://www.marktechpost.com/2026/06/14/claude-code-guide-2026-25-features-with-examples-demo/)
