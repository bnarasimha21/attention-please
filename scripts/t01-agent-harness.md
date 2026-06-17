# Trending 01, What is an agent harness?  ★ DEEP REWRITE v2 ★
**Title:** The Agent Harness: why the model is only 20% of Claude Code
**Duration target:** ~6:55 narration (+ ~14s Like/Subscribe CTA scene)
**Word count:** ~1,000 words (~145 wpm)
**Topic:** The agent harness, the architecture that turns a stateless LLM into an autonomous agent (Claude Code / Codex / Cursor)
**Audience:** Developers. Assume they know what an LLM is; give them the real mechanism, named systems, numbers, and selective code.
**Track:** Trending

> v2 (critiqued + improved): sharper accurate hook, a planted open loop paid off
> at compaction, a vivid reframe per scene, 5-line loop pseudocode, real numbers,
> context depth deferred to t02/t03, and Scene 13 reframed from a checklist to
> failure modes. 14 content scenes + CTA. ★ = new scene vs the current 8-scene build.

---

## NARRATION SCRIPT
*(Read aloud to record. Tone cues in [brackets]. On-screen code/snippets noted in the animation guide.)*

---

### SCENE 1, Hook [0:00–0:32]
[Calm, then a hook of disbelief, open the loop]

Give a top AI model a real bug to fix, but hand it *only* the issue. No access to the code. No way to run anything.

It's helpless. Not because it's dumb, because by itself, a language model can't open a file, run a test, or take a single action. It can only produce text.

Everything that turns it into something that *actually fixes the bug* is a wrapper called the **harness**, and the model is maybe twenty percent of it. One layer in here even rewrites the AI's own memory behind your back. Let's open the whole thing up.

---

### SCENE 2, The one-line definition [0:32–0:55]
[Explanatory, crisp]

Cleanest one-liner: the model generates text; the **harness** decides what that text can *touch*.

Picture the model as a brilliant brain in a jar. It can think, it can plan, it can write you flawless instructions. But it has no hands, no eyes, no memory. The harness is the body.

---

### SCENE 3, The raw model is a stateless function [0:55–1:25]
[The surprising foundation]

And here's what surprises people: that brain has *amnesia*.

The model is a **stateless function**, tokens in, tokens out, nothing remembered between calls. The AI you've been chatting with? Every single reply, it silently re-reads the entire conversation from scratch, like it's seeing it for the first time.

No memory, and no hands. Those two gaps are the *entire* reason the harness exists. Everything else is the harness covering for them.

---

### SCENE 4, The agentic loop [1:25–2:08]
[The beating heart, let the pseudocode breathe]

So how do you get an *agent* out of a stateless brain? You put it in a loop. Here's the whole engine, in about five lines.

The harness sends the model the situation. The model replies with one of two things: a final answer, or a **tool call**, a structured request that says "run *this* for me."

The harness runs it, adds the result to the conversation, and sends everything back. Look, act, observe, again and again, until the job's done. Researchers call this **ReAct**: reasoning and acting, interleaved. A chatbot answers once. An agent runs this loop ten, twenty, fifty times to finish real work.

---

### SCENE 5, Tool calling, for real [2:08–2:42]
[A bit more technical, let the code breathe]

Let's zoom into that "tool call," because it's subtler than it sounds.

The harness hands the model a menu of tools, each just a name, a description, and typed parameters. A schema. The model never runs anything itself. It emits a structured block, "call `edit_file` with these arguments", and the harness does the actual work, then hands back the result, or the error.

So the model is basically an intern with brilliant ideas and zero keys. It can only *ask*. That one choice, propose, never execute, is the foundation of everything safe about agents.

---

### SCENE 6, Context assembly [2:42–3:12]
[Land it, then defer the deep-dive]

Remember, the model's stateless. So before *every* turn, the harness rebuilds the entire prompt from nothing.

It stacks together the system prompt, who the agent is, the tool menu, the relevant files, the history so far, and the latest result, and ships all of it, every loop.

Deciding *what* earns a spot in that stack is its own craft, **context engineering**, deep enough that it's got its own episode. Here, just hold this: the harness is the model's working memory, assembled by hand, every single step.

---

### SCENE 7, The context window & compaction [3:12–3:50]
[Matter-of-fact, pay off the open loop]

But that memory has a ceiling, a fixed **token window**, often around two hundred thousand tokens. Long tasks blow right through it, and resending everything each loop gets *expensive*.

So the harness pulls two tricks. **Prompt caching**: the stable front, system prompt, tools, gets cached, cutting the cost of resending it by up to ninety percent.

And **compaction**, remember the memory-rewrite I promised? When the window fills, the harness quietly summarizes the old turns into a tight recap, keeps the key facts, and discards the rest. That's why an agent can grind for an hour and never lose the thread. It's editing its own memory as it goes, and you never see it happen.

---

### SCENE 8, Permissions: the safety gate [3:50–4:20]
[Slightly serious, the trust layer]

Now, you're about to let this thing run commands on your machine. So every tool call hits a **gate** first.

Reading a file, searching, harmless. Auto-approved. Editing a file, changing state, pause, ask the human. Something destructive, delete, force-push, curl a script into your shell, blocked, or escalated. Modern harnesses even run a fast **classifier** to sort actions into those buckets automatically.

The model proposes; the harness disposes. That gate is the whole difference between "autonomous coding agent" and "unsupervised intern with sudo."

---

### SCENE 9, Subagents: isolated context [4:20–4:48]
[Building, the scaling move]

Some jobs are just *messy*, grepping the whole codebase, reading forty files to answer one question. Do that in the main conversation and you bury the actual goal under noise.

So the harness spins off a **subagent**: a second model instance with its own clean, empty context. It does the messy digging in isolation and hands back only the answer. The noise stays quarantined; the main thread stays sharp. And because they're independent, you can fire off several at once.

---

### SCENE 10, MCP: plugging into the world [4:48–5:16]
[Explanatory, the ecosystem layer]

So far the tools are local. But real agents need GitHub, databases, browsers, your internal systems, and you do *not* want to hand-build an integration for each one.

That's what **MCP**, the Model Context Protocol, fixed when it landed in late 2024. Think USB for AI. Your harness is the **host**; it speaks one standard protocol to **MCP servers**, and each server exposes its tools the same way. Write a server once, and *any* MCP-aware agent can plug in. That's how the toolbox grows without ever touching the harness.

---

### SCENE 11, Hooks: deterministic guardrails [5:16–5:40]
[Quick, practical]

One layer people forget: not every decision should be the AI's.

**Hooks** are *your* code, plain, deterministic, fired at fixed moments in the loop. Auto-format after every edit. Run the tests after a change. Hard-block a commit to main. This is the boring, reliable scaffolding wrapped around the smart, unpredictable model, and you want both.

---

### SCENE 12, Why the harness beats the model [5:40–6:14]
[Bigger, the thesis]

Step back, because this flips how you should think about AI.

Everyone argues about which *model* is smartest. But take one model and drop it into a weak harness versus a strong one, no memory, clumsy tools, bloated context, versus a tight loop, clean context, sharp tools, and the *same brain* goes from barely functional to shipping real software.

Models are converging and getting cheaper, they're commoditizing. The harness is where the lasting product lives. Which is exactly why **harness engineering** is the hottest skill in AI right now.

---

### SCENE 13, How harnesses go wrong [6:14–6:44]
[Practical payoff, failure modes, not a checklist]

So how does a harness go *wrong*? Four classic ways.

The **loop runs away**, no budget, and it burns through your money chasing its own tail. **Context rot**, the window fills with junk and the model gets *dumber* the longer it works. **Tool sprawl**, fifty vague tools it can't choose between. And **over-permission**, you auto-approve everything, and one bad call wipes your repo.

A great harness is really just the absence of these: tight loop, clean context, few sharp tools, safe defaults.

---

### SCENE 14, Recap [6:44–6:58]
[Warm, direct, close strong]

So there's the whole machine: a stateless, hands-free model, wrapped in a loop, fed a hand-built context, reaching the world only through gated tools, MCP, and hooks; remembering through compaction, scaling through subagents.

The model thinks. The harness *acts.* Run Claude Code now, and you'll see every layer of it working.

---

### SCENE 15, Like & Subscribe CTA [6:58–7:12]
[handled by the existing animated CTA scene]

If this made the whole thing click, hit like, and subscribe for the rest of the series. See you in the next one.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(Reuse the motion toolkit: SceneBackground, kinetic SceneHeading, CameraRig, pop, ModelCore, crossfades. ★ = new scene to build.)*

| # | Scene | Animation | Selective code / on-screen detail |
|---|-------|-----------|-----------------------------------|
| 1 | Hook | A lone MODEL core gets an issue card; it reaches for file/run/test icons but they're behind glass, "no hands." Tease the harness wrap forming, dim. | "can't: open file · run · act" struck through |
| 2 | Definition | Brain-in-a-jar MODEL core (thinks) → grows a "body" (the harness) that reaches file/shell/web. | "model = brain · harness = body" |
| 3 ★ | Raw model = stateless fn | Pure-function box `tokens →[ model ]→ tokens`; same input twice → identical output; an "amnesia" pass re-reads the whole chat each reply. | `f(prompt) → text` ; "stateless · no memory · no hands" |
| 4 | The agentic loop (ReAct) | The pseudocode types in; then a circular loop animates it, model → tool_call? → run → result → back; **budget bar** drains each lap; beats THINK · ACT · OBSERVE. | 5-line loop pseudocode (below) + `ReAct` tag |
| 5 ★ | Tool calling | Tool-schema "menu" → model emits a `tool_use` JSON block → harness runs it → `tool_result` returns. Caption: "the model only *asks*." | real `tool_use` + `tool_result` JSON |
| 6 ★ | Context assembly | Each loop a prompt is *rebuilt* by stacking labeled blocks: System · Tools · Files · History · Latest result. Small "→ full episode" tag to t02. | "rebuilt every turn (stateless)" |
| 7 | Window + compaction | Token bar fills toward **~200K**; **prompt-cache** badge locks the stable prefix (−90% cost); near limit, old turns **collapse into a summary**. | token meter; "cached −90%" |
| 8 | Permissions gate | Action → classifier → routes: read = auto (green), edit = ask (amber), `rm -rf` = block (red). | 3-tier; `rm -rf /` blocked |
| 9 | Subagents | Main core spins off a subagent with its own fresh window; messy work contained on its side; clean summary crosses back; then 3 in parallel. | "isolated context" |
| 10 ★ | MCP | Host ⇄ standard protocol ⇄ MCP servers (GitHub / DB / browser), each exposing tools identically. "USB for AI." | host · protocol · servers · "late 2024" |
| 11 ★ | Hooks | Loop timeline with hook points firing: PreToolUse → (lint), PostEdit → (tests), commit → (block main). Deterministic, not LLM. | `PreToolUse` / `PostToolUse` |
| 12 | Harness > model | Same core in weak vs strong harness → divergent outcomes; "barely works" vs "ships real software"; "model = commodity · harness = product." |, |
| 13 ★ | How harnesses go wrong | Four failure cards pop in red→resolve green: Runaway loop · Context rot · Tool sprawl · Over-permission → tight loop · clean context · sharp tools · safe defaults. |, |
| 14 | Recap | Assemble the full diagram: MODEL core + loop ring + layer rings (Context/Tools/Permissions/Memory/MCP/Subagents/Hooks); tagline "The model thinks. The harness acts." |, |
| 15 | CTA | Existing Scene9 Like/Subscribe (channel icon + animated cursor taps buttons). |, |

**Scene 4 pseudocode (on screen):**
```python
while not done:
    reply = model(context)          # stateless call
    if reply.tool_call:
        result = run(reply.tool_call)   # harness executes
        context += result               # observe
    else:
        done = True                     # final answer
```

**Scene 5 tool-call (on screen):**
```json
// model emits →
{ "type": "tool_use", "name": "edit_file",
  "input": { "path": "app.py", "find": "...", "replace": "..." } }
// harness runs it, returns →
{ "type": "tool_result", "content": "✓ 1 change applied" }
```

---

### Fact-check notes (keep claims defensible)
- **"helpless without the harness"**: given only the issue and no repo access / no tools, a model can't resolve a real GitHub issue, it can't see the code or act. Accurate and visceral (avoids the shaky "same model 33→70" figure).
- **Stateless / re-sent context**: LLM API calls are stateless; the harness resends the full prompt each turn. True.
- **ReAct**: Reason+Act interleaving (Yao et al., 2022).
- **tool_use / tool_result**: Anthropic's structured tool-calling block names (OpenAI = "function/tool calls"). Model emits a request; harness executes.
- **~200K window**: Claude's context window is ~200K tokens (some tiers larger), "often around 200K" is safe.
- **Prompt caching −90%**: cached prompt-prefix reads are ~90% cheaper than uncached input on Anthropic; phrase "up to ninety percent."
- **Compaction**: Claude Code auto-summarizes near the context limit. True.
- **MCP**: Model Context Protocol, open client/server standard, announced late 2024 (Nov 2024).
- **Hooks**: lifecycle hooks (PreToolUse/PostToolUse) run deterministic commands. True.
- **Failure modes** (runaway loop / context rot / tool sprawl / over-permission) are well-documented practitioner pitfalls; context rot has its own episode (t03).
