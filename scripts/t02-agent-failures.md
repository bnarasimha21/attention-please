# Trending 02, 4 Ways Your AI Agent Fails (And How to Fix Each One)
**Title:** 4 Ways Your AI Agent Fails (And How to Fix Each One)
**Duration target:** ~7:45 narration (+ ~14s Like/Subscribe CTA scene)
**Word count:** ~1,150 words (~145 wpm)
**Topic:** The four classic harness failure modes — runaway loops, context rot, tool sprawl, over-permission — with the concrete architectural fix for each.
**Audience:** Developers who watched t01 or already understand the agentic loop. Assume they know what a harness is; give them real failure patterns, real numbers, and real fixes.
**Track:** Trending

---

## NARRATION SCRIPT
*(Read aloud to record. Tone cues in [brackets]. On-screen code/snippets noted in the animation guide.)*

---

### SCENE 1 — Hook [0:00–0:30]
[Calm setup, then the gut-punch]

You give your agent a task. It starts running. You check back twenty minutes later. It's still running. Your bill just hit forty dollars. And it hasn't made a single useful change.

That's not a model problem. The model is doing exactly what you told it. The problem is the harness around it — specifically, what the harness *failed to prevent*.

There are four ways a harness goes wrong. Once you see them, you'll recognise them everywhere.

---

### SCENE 2 — These aren't bugs [0:30–0:55]
[Framing, crisp]

These four failure modes aren't random bugs. They're **architectural gaps** — things a naive harness leaves open by default.

A harness that does nothing special will loop forever, bury itself in junk, hand the model a hundred tools it can't choose between, and let it delete your database on the first bad suggestion.

Here's each one, and the exact fix.

---

### SCENE 3 — Failure 1: Runaway Loop [0:55–2:00]
[Build urgency, land the numbers]

The agentic loop has no natural stopping condition. By design.

Each iteration costs tokens — input tokens for the full context you're resending every turn, plus output tokens for the reply. On a two-hundred-thousand-token context, one loop iteration can cost thirty cents. Fifty iterations? Fifteen dollars. And a model that's stuck — chasing a bug it can't reproduce, or oscillating between two tool calls — will happily loop until you stop it, or your credit card does.

The fix has two parts.

**Hard iteration limits.** Set a `max_iterations` budget before the agent starts. Not a suggestion — a kill switch. Claude Code's default is around two hundred; production systems are often tighter, ten to twenty for focused tasks.

**Stall detection.** If the last three tool calls are identical, you're in a loop. Surface it, stop the agent, ask the human what to do next. Don't let the model retry its way to bankruptcy.

But iterations are just one meter. Runaway cost runs on three — steps, tokens, and wall-clock time — so budget all three: a token cap, a hard timeout, not only a loop limit. Every serious framework ships these now. LangGraph halts at twenty-five steps by default. AutoGen has separate token and timeout cut-offs. The OpenAI Agents SDK caps turns and throws the moment you blow past it.

And the smartest stop isn't a counter at all — it's *progress*. If the tests are still red and the file's unchanged, the agent isn't working, it's flailing. Stop on no-progress, even at iteration three.

One number to hold onto: cost scales with context length *times* iterations. A bloated context makes runaway loops catastrophically expensive.

---

### SCENE 4 — Failure 2: Context Rot [2:00–3:10]
[The counterintuitive one — let it land]

Here's the one that surprises people. A longer conversation makes the model *dumber*.

The model re-reads the entire context every single turn. Early in a task, that context is tight — system prompt, tools, the goal. But tool results pile up fast. A grep that returned eight hundred lines. A file read that was only partially relevant. A failed attempt that's now just noise. By turn thirty, the model is wading through thousands of tokens of junk to find the three lines that actually matter.

This is **context rot**. And it causes real regressions — the model starts losing the thread, contradicting its earlier decisions, forgetting things it knew ten turns ago.

The fix is **context engineering**. You don't dump everything into the prompt. You curate it. Summaries instead of raw tool output. Truncated file reads with the relevant section highlighted. Compaction that preserves decisions, not transcripts.

Curation has a deeper move than trimming: get the junk out of the window entirely. **Offload to a sub-agent** — let a helper burn thirty thousand tokens reading and hand back a two-thousand-token summary. The noise never touches the main thread. **Write to a memory file** — notes on disk the agent re-reads, so state outlives the window. And **mind the middle**: models reliably lose what's buried in the *middle* of a long context. It's a U-shaped curve — sharp at the start and end, weak in between — and a bigger window doesn't fix it. Put what matters at the edges.

Think of the harness as the model's working memory. Treat it like RAM, not a hard drive. Keep only what the model needs *right now*. Everything else is noise, and noise costs you IQ points per turn.

---

### SCENE 5 — Failure 3: Tool Sprawl [3:10–4:00]
[Quick and punchy]

More tools feels like more power. It's not.

When you hand a model fifty tools, you've given it a decision problem on every turn. Which tool fits here? `read_file` or `get_file_contents`? `search_codebase` or `grep_files`? The names blur, the descriptions overlap, and the model makes bad picks — or hedges, calling two tools where one would do.

Tool sprawl also inflates the context directly. Every tool definition — name, description, typed parameters — costs tokens before the model writes a single character. Fifty tools can burn eight thousand tokens on tool schemas alone.

The fix: **fewer, sharper tools.** Each tool should do one thing with an unmistakable name. If two tools have overlapping descriptions, merge them or delete one. Claude Code ships around fifteen core tools — not as a limitation, but as a deliberate design choice. The model picks faster and picks better when the menu is short.

A good rule of thumb: if you can't describe what a tool does in five words, it's too vague to be useful.

But there's a sharper move than trimming the list by hand: load tools on demand. Keep the big catalogue — just expose the three to five relevant tools each turn. In Anthropic's own testing, that took fifty-eight tools — fifty-five thousand tokens before you type a word — down to about three thousand, and lifted tool-selection accuracy from forty-nine to seventy-four percent. Same model. Shorter menu.

Go one level further with *code mode*: let the model write code that calls the tools and filters the results before they ever hit the context. Anthropic measured a thirty-seven percent token cut on complex tasks. That fixes tool sprawl and context rot in one stroke.

---

### SCENE 6 — Failure 4: Over-permission [4:00–5:00]
[Slightly serious, the trust layer]

The most dangerous failure is the quiet one.

An agent that auto-approves everything will, eventually, do something catastrophic. Not because it's malicious — because it's *confident*. Models are fluent and decisive. They propose force-pushes, schema drops, curl-to-shell scripts, with the same calm tone they use to suggest a variable rename.

Over-permission is trusting that tone.

The fix is a **three-tier permission model**.

Read-only actions — file reads, searches, directory listings — auto-approved, no interruption.

State-changing actions — edits, API calls, package installs — pause and surface to the human before executing.

Destructive or irreversible actions — deletes, force-pushes, anything touching production — blocked by default, require explicit opt-in every single time.

The key word is *irreversible*. Ask this about every tool: if the model calls this on bad data, can I undo it in thirty seconds? If the answer is no, that tool needs a gate. If the answer is "I can't undo it at all," it needs a hard block.

But tiers only decide what's *allowed*. Two more layers decide what happens when something slips through.

**Sandbox it.** Run the agent in a box that can only touch its working directory and only reach the domains you approve — everything else is walled off. Anthropic says this alone cut their permission prompts by around eighty-four percent. Contain the blast radius, and you don't need to vet every single move.

**Know the real threat.** The nightmare isn't a clumsy agent — it's a *hijacked* one. Simon Willison calls it the lethal trifecta: the moment an agent can read private data, ingest untrusted content, *and* send data out, one poisoned web page or email can turn its own permissions against you. The fix is to break one leg — cut its ability to phone home, or gate the send-email and external-write actions specifically.

And keep an undo. Plan-then-apply — approve the diff before it lands, like Terraform. Checkpoints and Git commits, so any bad write is one command from gone.

---

### SCENE 7 — The unifying principle [5:00–5:35]
[Zoom out, the thesis]

Notice what all four fixes have in common.

They're defaults. A harness that does nothing will loop forever, rot its own context, drown the model in tools, and let it run free with no guardrails. Every single fix is something you have to deliberately add.

That's the mindset shift. Building an agent isn't just picking the right model and plugging in tools. It's designing the *constraints* — the budgets, the curated context, the short menus, the permission tiers — that keep a capable but directionless system actually useful.

The model thinks. The harness makes sure it doesn't think itself into a corner.

---

### SCENE 8 — Recap [5:35–5:50]
[Warm, punchy close]

Four failure modes, four fixes:

**Runaway loop** — hard iteration budgets and stall detection.
**Context rot** — curate the prompt, don't just append.
**Tool sprawl** — fewer, sharper tools with unmistakable names.
**Over-permission** — read auto, write gate, destroy block.

If your agent is behaving strangely, odds are it's one of these four. Now you know exactly where to look.

---

### SCENE 9 — Like & Subscribe CTA [5:50–6:04]
[handled by the existing animated CTA scene]

If this clicked, hit like and subscribe — there's more where this came from, plenty more deep dives on building agents that actually work. See you in the next one.

---

## SCENE-BY-SCENE ANIMATION GUIDE
*(Reuse the motion toolkit from t01: SceneBackground, kinetic SceneHeading, CameraRig, pop, ModelCore, crossfades.)*

| # | Scene | Animation | Selective code / on-screen detail |
|---|-------|-----------|-----------------------------------|
| 1 | Hook | Agent loop runs; iteration counter ticks up; cost meter climbs; no output produced. Freeze on "$40.00 / 0 changes." | `iterations: 312 · cost: $40.17 · changes: 0` |
| 2 | Four failures | Four red warning cards slide in, labelled: Runaway Loop · Context Rot · Tool Sprawl · Over-permission. Each dims slightly — "coming up." | Four red cards |
| 3 | Runaway loop | Budget bar drains each iteration; cost counter ticks up per loop; stall detector triggers when 3 identical tool calls appear in a row — agent halts, amber "ASK HUMAN" banner. **New beat:** a "three meters" panel lights up — steps · tokens · time — each its own cap; then a progress check (tests red / file unchanged → STOP). Framework chips: LangGraph 25 · AutoGen token+timeout · OpenAI SDK max_turns. | `max_iterations = 20` ; `if last_3_calls == same: stop()` ; steps · tokens · time |
| 4 | Context rot | Token bar fills turn by turn; helpful signal (3 lines) vs noise (800 lines of grep) shown side by side; model accuracy graph drops as context grows; compaction collapses junk into a summary. **New beat:** sub-agent bubble swells to 30K then returns a 2K summary chip to the main thread; a memory-file icon writes to disk; a U-curve overlay highlights start+end, dims the middle ("put it at the edges"). | Before: 190K tokens · After compaction: 12K · sub-agent 30K→2K · U-curve |
| 5 | Tool sprawl | 50 tool icons crowd the frame; model oscillates between two overlapping ones; then tools collapse to 15 clean icons, model picks instantly. **New beat:** instead of hand-trimming, a "tool search" pulls just 3–5 relevant tools per turn — counters animate 55K→3K tokens and 49%→74% accuracy; then a "code mode" chip filters tool output in code (37% fewer tokens). | 50 tools ≈ 55K tokens; load 3–5 ≈ 3K; 49%→74%; code-mode −37% |
| 6 | Over-permission | Three-tier traffic light gate: read (green auto), write (amber pause + human check), destroy (red hard block). `rm -rf` hits the wall. `force-push` escalates to human. **New beat:** the whole gate drops inside a **sandbox** box (filesystem + egress walls; "−84% prompts"); a **lethal-trifecta** Venn (private data ∩ untrusted content ∩ exfiltration) flashes red where all three overlap, then one leg is cut; a plan-then-apply diff + `/rewind`/git undo chip. | Read=auto · Write=gate · Destroy=block · Sandbox+egress · break the trifecta |
| 7 | Unifying principle | All four failure cards flip green — each now showing its fix. Zoom out: the full harness diagram from t01 but annotated with all four guard layers. | "defaults you must override" |
| 8 | Recap | 2×2 grid: each failure + fix as a tight two-liner. Animate each pair in sequence. | Runaway→budget · Rot→curate · Sprawl→fewer · Permission→tiers |
| 9 | CTA | Existing Like/Subscribe animated scene (channel icon + animated cursor taps). | |

---

---

## ON-SCREEN CODE / PSEUDOCODE BLOCKS
*(These animate in line by line during the relevant scene — same treatment as the ReAct pseudocode in t01.)*

---

### Scene 3 — Runaway Loop: the naive harness vs the fix

**Naive (no guard):**
```python
while not done:
    reply = model(context)
    if reply.tool_call:
        result = run(reply.tool_call)
        context += result
    else:
        done = True          # never reached if model is stuck
```

**Fixed — iteration budget + stall detection:**
```python
MAX_ITER = 20
last_calls = []

for i in range(MAX_ITER):
    reply = model(context)

    if reply.tool_call:
        # stall detection: 3 identical calls in a row → stop
        last_calls.append(reply.tool_call.name)
        if last_calls[-3:] == [last_calls[-1]] * 3:
            raise StallError("agent is looping — ask human")

        result = run(reply.tool_call)
        context += result
    else:
        return reply.text           # clean exit

raise BudgetError(f"hit {MAX_ITER} iterations — stopping")
```
*Animate: budget bar depletes each iteration; stall detector fires on iteration 8 when 3 identical `grep_files` calls appear.*

**New beat — budget all three axes (steps · tokens · time) + progress stop:**
```python
# Iterations are one meter. Runaway cost has three.
limits = Budget(max_steps=20, max_tokens=50_000, max_seconds=120)

# What the frameworks actually ship:
#   LangGraph:  graph.invoke(state, {"recursion_limit": 25})  # default 25
#   AutoGen:    TokenUsageTermination(max_total_token=50_000)
#             | TimeoutTermination(timeout_seconds=120)
#   OpenAI SDK: Runner.run(agent, input, max_turns=20)  # -> MaxTurnsExceeded

# The smartest stop isn't a counter — it's progress:
if not made_progress(before, after):   # tests still red, file unchanged
    stop("no progress - escalate to human")
```
*Animate: three meters (steps / tokens / time) fill independently; then a progress check flashes red and halts the agent at iteration 3 despite budget remaining.*

---

### Scene 4 — Context Rot: what the prompt looks like after 30 turns

**What a rotting context looks like (schematic):**
```
[System prompt]         ~2,000 tokens  ✓
[Tool definitions]      ~2,000 tokens  ✓
[Turn 1] user goal      ~100 tokens    ✓
[Turn 2] tool result    ~800 tokens    ← grep dump, mostly noise
[Turn 3] tool result    ~1,200 tokens  ← full file read, 90% irrelevant
[Turn 4-29] ...         ~140,000 tokens ← accumulated noise
[Turn 30] actual goal   ~100 tokens    ← buried at the bottom
                        ──────────────
                        ~146,200 tokens  → model accuracy tanks
```

**Fixed — curated context assembly:**
```python
def build_context(history, goal, latest_result):
    return [
        system_prompt,                          # stable, cached
        tool_definitions,                       # stable, cached
        f"GOAL: {goal}",                        # always present
        summarise(history, keep="decisions"),   # compact decisions only
        truncate(latest_result, lines=30),      # last result, trimmed
    ]
    # total: ~8,000 tokens regardless of task length
```
*Animate: bloated 146K bar vs curated 8K bar. Model accuracy line stays flat after curation.*

---

### Scene 5 — Tool Sprawl: vague tools vs sharp tools

**Tool sprawl — overlapping, ambiguous:**
```json
{ "name": "read_file",         "description": "Read a file" },
{ "name": "get_file_contents", "description": "Get contents of a file" },
{ "name": "fetch_file",        "description": "Fetch file data" },
{ "name": "search_codebase",   "description": "Search in codebase" },
{ "name": "grep_files",        "description": "Grep across files" },
{ "name": "find_in_code",      "description": "Find something in code" },
// ... 44 more
```

**Fixed — 5 sharp tools (sample):**
```json
{ "name": "read_file",
  "description": "Read exact file at path. Returns content." },

{ "name": "search",
  "description": "Regex search across all files. Returns matching lines + paths." },

{ "name": "edit_file",
  "description": "Apply find-replace edit to a file. Fails if find not unique." },

{ "name": "run_command",
  "description": "Run a shell command. Read-only by default." },

{ "name": "ask_human",
  "description": "Pause and ask the user a question. Use when stuck." }
```
*Animate: 50 icons crowd the frame → model oscillates between read_file / get_file_contents → collapse to 5 icons → model picks instantly.*

**New beat — load tools on demand instead of hand-trimming:**
```python
# Keep the big catalogue — expose only 3-5 relevant tools per turn.
# Anthropic Tool Search Tool:
tools = [{"type": "tool_search_tool_20251119", "name": "tool_search"}]
for t in all_tools:              # 58 tools ~ 55K tokens up front...
    t["defer_loading"] = True    # ...load only what a search returns (~3K)
# tool-selection accuracy: 49% -> 74% (Opus 4)   [Anthropic internal eval]

# Code mode: model calls tools in code, filters output before it hits context
# avg tokens 43,588 -> 27,297   (-37% on complex tasks)
```
*Animate: counters tick 55K→3K tokens and 49%→74% accuracy as the catalogue greys out and only the searched 3–5 tools light up; then a "code mode" chip wraps tool calls and trims the result stream.*

---

### Scene 6 — Over-permission: the three-tier gate in code

**Naive — approve everything:**
```python
def should_run(tool_call):
    return True    # 🚨 nothing is blocked
```

**Fixed — three-tier permission gate:**
```python
READ_ONLY  = {"read_file", "search", "list_dir"}
WRITE      = {"edit_file", "run_command", "install_package"}
DESTRUCTIVE = {"delete_file", "force_push", "drop_table", "curl_exec"}

def should_run(tool_call):
    name = tool_call.name

    if name in READ_ONLY:
        return APPROVED             # auto, no interruption

    if name in WRITE:
        return ask_human(tool_call) # pause, show diff, wait for OK

    if name in DESTRUCTIVE:
        raise PermissionError(      # hard block — never auto-run
            f"{name} is irreversible. Explicitly opt in to enable it."
        )
```
*Animate: three traffic-light lanes — green (auto), amber (ask), red (block). `delete_file` hits the wall. `force_push` escalates. `read_file` flows straight through.*

**New beat — contain the blast radius + break the trifecta + keep an undo:**
```python
# Layer 2 — sandbox: even an allowed action can't escape the box
sandbox = Sandbox(
    fs="./workdir",                     # can't touch anything else
    allow_domains=["api.github.com"],   # egress allow-list; deny by default
)   # Anthropic: ~84% fewer permission prompts   [vendor-internal]

# Layer 3 — the real threat: the lethal trifecta (Simon Willison)
#   private_data  +  untrusted_content  +  exfiltration  = game over
gate("send_email", "http_post", external_writes)   # cut ONE leg

# Keep an undo:
review_diff(plan)   # plan-then-apply — approve the change before it lands
checkpoint()        # /rewind + git commit -> a bad write is one command gone
```
*Animate: the whole 3-tier gate drops inside a sandbox box (fs + egress walls glow); a 3-circle Venn turns red where all overlap, then one circle is severed; a diff slides up for approval and a `/rewind` chip undoes a bad write.*

---

### Fact-check notes
- **Iteration cost math**: At ~$15/MTok input (Claude Sonnet 4.x), 200K-token context × 50 turns = 10M tokens = $15. Numbers are illustrative but defensible.
- **Stall detection**: Claude Code detects identical tool calls and surfaces them. True.
- **Context rot causing regressions**: Well-documented practitioner observation; aligns with "lost-in-the-middle" research (Liu et al., 2023).
- **Tool schema token cost**: Each Anthropic tool definition typically runs 100–300 tokens; 50 tools = 5K–15K tokens overhead. "~8K" is a reasonable middle estimate.
- **Three-tier permission model**: Claude Code's allow/ask/deny permission tiers. Documented.
- **max_iterations ~200 default in Claude Code**: Claude Code ships with an iteration limit that can be configured. Verify exact default before recording.

### Fact-check notes — added solutions (deep-research pass)
- **Three-axis budgets + framework limits**: LangGraph default `recursion_limit` = 25 steps (raises `GRAPH_RECURSION_LIMIT`); AutoGen `TokenUsageTermination` (token/$ cap) + `TimeoutTermination` (wall-clock); OpenAI Agents SDK `max_turns` → `MaxTurnsExceeded`. All from primary framework docs. ✅ verified.
- **Progress-based stopping**: Anthropic (*Building Effective Agents*) — agents need "ground truth from the environment at each step" to assess progress; stopping conditions like max iterations "maintain control." ✅ verified.
- **Sub-agent context isolation**: subagent returns a ~1,000–2,000-token summary; Anthropic multi-agent research system reported **~90% improvement** over single-agent Opus 4. ⚠️ Anthropic internal eval — cite as such.
- **Lost-in-the-middle**: Liu et al. (TACL 2024) — U-shaped curve, best at start/end, worst in middle; persists in long-context models. ✅ verified (peer-reviewed). Note: some 2025 frontier models reduce the effect → frame as "real, severity model-dependent."
- **Tool Search Tool**: 58 tools ≈ 55K tokens up-front → load 3–5 (~3K); selection accuracy **49%→74% (Opus 4)**, **79.5%→88.1% (Opus 4.5)**. ⚠️ Anthropic internal MCP eval, NOT a neutral public benchmark.
- **Code mode / Programmatic Tool Calling**: avg **43,588→27,297 tokens (−37%)** on complex tasks. ⚠️ Anthropic internal.
- **Sandboxing**: Claude Code sandbox (filesystem + network egress; bubblewrap / macOS Seatbelt) → **~84% fewer permission prompts**. ⚠️ Anthropic internal usage figure. Vercel Sandbox / e2b = Firecracker microVMs (stronger than containers).
- **Lethal trifecta** (Simon Willison, Jun 2025): private data + untrusted content + exfiltration; mitigate by breaking one leg (egress control / gate the exfil-capable actions). Real exploits cited: M365 Copilot, GitHub MCP, GitLab Duo.
- **⚠️ BLANKET CAVEAT**: every percentage/token figure from Anthropic above (84%, 49→74, 37%, 55K→3K, ~90%) and all Vercel/e2b spec numbers are **vendor-reported internal results** — say "in Anthropic's own testing," never imply an independent benchmark.
- **Do NOT claim**: that filesystem memory beats purpose-built memory systems, or that sub-agent isolation is universally harmful — both were refuted (0-3) in verification.
