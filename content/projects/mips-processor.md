---
title: "A 32-bit MIPS Processor, and the Optimisation Campaign Behind It"
date: 2026-10-31
weight: 1
description: "A five-stage pipelined MIPS SoC taken from RTL to a timing-closed 117 MHz implementation — and then to two-wide superscalar issue with register renaming. Every step measured."
summary: "Sole developer. 47 MIPS instructions, precise exceptions, CP0, I-Cache and UART in a minimal SoC. A campaign of measured performance and timing work: 75 → 117 MHz, a load-store unit rebuilt around a busy scoreboard so loads no longer stop the pipeline (streaming to ~6–7 cycles per word, matrix to 9–10 per MAC, and no gain at all on the memory-hard kernel), and a hardware divider that cost 5.6% of the clock and returned 5x on modulo-heavy code. The final stage went two-wide: rename, a 48-entry physical register file, dynamic pairing and a branch target buffer, for another 34% on streaming and 24% on matrix multiply against the identical RTL issuing one instruction per cycle."
tags: ["MIPS", "Verilog", "Computer Architecture", "Superscalar", "FPGA", "Timing"]
---

**Sole developer · Mar – Oct 2026 · Verilog, Vivado**
**National College Student Computer System Capability Competition — CPU Design
Competition, Excellence Award (national level)**

A 32-bit five-stage pipelined MIPS processor: 47 MIPS instructions, precise exception
and interrupt handling, and a minimal SoC around it — hazard handling, a CP0 exception
module, an I-Cache, and UART peripherals.

The instruction set was the easy half. What the project actually became was a long
campaign of measured optimisation against two objectives that fight each other:
**cycles per benchmark** and **nanoseconds per clock period**. Almost everything
interesting is in that fight.

## Performance: each change, and what it bought

**Single-cycle multiply.** The multiplier was a three-state FSM — idle, load inputs,
done — costing a two-to-three cycle stall on every multiply. Marking the 32×32
multiplier `(* use_dsp = "yes" *)` maps it directly onto a DSP48 as combinational
logic with `busy` tied low. Multiply became zero-stall, and the matrix and crypto
benchmarks each saved about two cycles per operation.

**Load-store forwarding.** When a `sw`'s data depends on the immediately preceding
`lw`, the store can take the raw word straight from the M-stage memory read data
instead of waiting for it to land in the register file — removing a two-cycle load-use
stall. Only word loads qualify; `lb` and `lh` need sign extension and cannot be taken
raw. This one change is most of the pure-CPU performance on the memory benchmark,
which at this point in the campaign stood at **~9.1 cycles per word** — before the
load-store unit was decoupled, below.

**A non-blocking write buffer.** Store requests are accepted and released in one cycle,
with the drain happening in the background. Draining blocks new requests, which gives
read-after-write ordering without any address comparison. The buffer later became the
handshake foundation for other subsystems to drain against.

**Hardware division — the change that cost more than it gave.** Software long division
is either a library call or about 160 hand-written instructions. A 32-round restoring
remainder state machine, one round per cycle, with the pipeline frozen during the
operation, turned `/` and `%` into single instructions and gave roughly **5× on
modulo-heavy benchmarks**. It also cost **5.6% of the clock** — see below. That trade
is the whole design in miniature.

**An I-Cache from the first version.** Two-way set associative, 32 sets, 128-bit lines,
LRU, a single-line bypass buffer, unconditional prefetch, and a stalled-instruction
buffer. The Tag array is read asynchronously on a stable index so the fetch path is not
chained behind `next_pc`.

## Decoupling memory from compute

Everything above optimises a pipeline that stops. The largest change in the project
removed that assumption.

**The problem.** The off-chip asynchronous SRAM has a three-cycle read latency, and a
fully in-order pipeline has nowhere to put that latency. A `lw` in the M stage froze
everything behind it. Three perfectly independent `addiu` instructions would sit and
wait for a read they had nothing to do with.

**The change.** The load-store unit was rewritten so that a load's *issue* and its
*completion* are separate events. A `lw` computes its address in E, deposits the
request in M, and leaves. The pipeline does not wait for the data; only the instruction
that consumes it waits. The design is not register renaming and it is not out-of-order
issue — it is a much narrower move: **memory runs ahead of the pipeline, and the
scoreboard is what keeps that honest.**

Four pieces:

- **A 32-bit `busy` scoreboard**, one bit per architectural register. Set when a load
  issues in M, cleared when its data reaches the register file.
- **The hazard unit changed what it asks.** It used to ask *is a load in E*. It now asks
  *is a source register of the instruction in D marked busy* — and stalls that one
  instruction rather than the machine.
- **A two-entry request queue** between M and the SRAM controller, so that back-to-back
  loads present the next transaction in the same cycle the current one completes, with
  no handshake bubble on the bus.
- **A response FIFO** whose entries carry `{valid, rd, rdata}`, with its head wired
  straight to a register-file write port. The data does not have to re-enter the
  pipeline to be written back. The one-entry write buffer was widened into a store
  queue at the same time, which brings an address comparison with it: an incoming load
  checks its address against every in-flight store and forwards from the queue on a
  match.

**Two hazards this created, and how they were closed.**

*Write-after-write.* `lw $t0` followed immediately by `ori $t0, $0, 5`: the `ori`
computes in one cycle and writes back, and two cycles later the older load returns and
overwrites the good value with stale data. The fix is that an instruction whose
destination is already marked busy is not allowed into W.

*Precise exceptions.* With loads still in flight, an exception or a `syscall` cannot be
taken — the architectural state is not yet the state the exception should be reported
against. The redirect waits for the busy bitmap to clear.

**What it bought, and where it bought nothing.** The three benchmarks separate cleanly:

| Benchmark | Before | After |
|---|---|---|
| MATRIX — two reads and a MAC per inner iteration | 15.4 cycles per MAC | **9–10** |
| STREAM — load-store chain over a streaming array | 9.1 cycles per word | **~6–7** |
| CryptoNight — memory-hard | ~26 cycles per round | **unchanged** |

CryptoNight not moving is the interesting result, and it is the same result as the
abandoned D-Cache. The load is followed immediately by instructions that all depend on
it — there is nothing independent left to run while the read is in flight. Decoupling
the load from the pipeline buys nothing when there is nothing to overlap it with, and a
memory-hard kernel is defined by having nothing. The unit is worth its area on MATRIX and
STREAM and worth none of it on CryptoNight, and I would rather know which than assume
it helps everywhere.

## Timing: three rounds at 125 MHz, then a decision

At 100 MHz the worst path was 9.65 ns; a 125 MHz period is 8 ns, so **1.7 ns had to
come out of the logic**. Three rounds of work went in — and the numbers are worth
listing because most of them are small:

| Change | Effect |
|---|---|
| I-Cache Tag/Valid to flip-flop arrays with parallel comparators | fetch path 12–13 logic levels → ~8 |
| `max_fanout` replication on a signal driving 7714 loads | first round's best: −0.718 ns |
| Stall signal expansion, folding the eject OR | 1–2 levels |
| Seven equality comparators replaced by one shared mux-driven compare | −1.035 → **−0.558 ns** — the single best fix of the whole run |
| Two-stage PC enable | one level |
| PC split into four 8-bit instances with manually replicated inverting LUTs | routing |

It converged to **−0.342 ns and stopped**. The reason is the finding I would keep from
this project: at that point every failing path family was 69–83% *routing* delay, not
logic. The logic was already thin. Continuing would have been whack-a-mole against
place-and-route, trading hours for a tenth of a nanosecond.

So instead of cutting, **I changed the clock**. Dropping to 117 MHz turned the
design positive at +0.16 ns with a single parameter change — and every benchmark
improved proportionally, because they all scale with clock. End to end, the
achievable maximum frequency went from **75 MHz to 117 MHz (+56%)**.

**Three optimisations were tried and abandoned**, which is the other half of the work:

| Attempt | Why it was dropped |
|---|---|
| D-Cache | Combinational-read RAM path gave WNS −1.086 ns (another layout, −3.8); the crypto benchmark's access pattern is nearly random, so the hit rate would not have paid for it |
| Sequential-read SRAM prefetch (1-cycle return) | WNS −1.134 ns |
| Algorithm-level work on the crypto benchmark | A trace-based reconstruction showed the kernel was 21 instructions per round at 26.4 cycles, of which two random word loads were ~20% — and the addresses were fully random. There was nothing left to win |

The third one matters as much as the ones that shipped: **it is a measurement that says
"stop"**, and it was made by reconstructing what the benchmark actually does rather
than by guessing at it.

## What the hardware taught that the simulator could not

Two failures only ever appeared on the board, never in simulation:

- **The asynchronous SRAM read window.** Going from a two-cycle to a three-cycle read
  (a 20 ns to 30 ns window) plus holding engine addresses for 40 ns fixed
  corruption that showed up as bad loads and boot garbage. The two-cycle read is a
  physical floor that a simulation does not model.
- **A synthesizer-introduced error** in a read multiplexer spanning blocks.

And the one I would put on a slide: **WNS near zero means the hardware fails
randomly.** A build with +0.107 ns passed simulation and CI and then hung on the board
at random. There is a cliff, not a slope, and the final competition build deliberately
gave up 10% of the clock to keep **≥ 1 ns of margin**.

## Going wider: renaming, then two instructions per cycle

Every optimisation so far keeps one assumption intact — the machine issues one
instruction per cycle, and stalls when it cannot. Decoupling memory relaxed what a load
*completes* relative to the pipeline; it did not change how quickly instructions *start*.
That is the ceiling the numbers above keep hitting: with several loads in flight the core
still launches one per cycle, and any dependency between neighbouring instructions is
still a bubble. The last stage of the work attacked that ceiling in three steps — rename,
then width, then a round of measuring and repairing what the width exposed.

**Register renaming.** Thirty-two architectural registers give one write port, and no way
to tell a new version of `$t0` from an old one still in flight. They were replaced by a
rename table, a free list, and a **48-entry physical register file**: issue stays in
order, completion does not, so a late load or multiply no longer holds up the
instructions behind it. On its own this changed nothing measurable, and that is the
correct result — renaming is not a speed-up, it is the structure without which two-wide
writeback and a second issue slot cannot exist at all.

**Two-wide in-order issue.** With one issue slot, a dependent instruction costs a whole
cycle before anything else can start. Now two instructions leave decode together. The
I-Cache already delivers a 16-byte line, so both slots come out of a single fetch; a
**4-entry fetch queue** handles the pairing, which is dynamic — a pair forms only if the
two instructions are adjacent, independent, and the second fits slot 1. Slot 0 keeps
every function; slot 1 is deliberately narrow — plain ALU operations only, no memory, no
branch, no multiply or divide, no destination collision with slot 0. Branch resolution
stays where it was, in D, with the three delay-slot cases (paired, still in the fetch
queue, pending) each handled separately. That breadth of change is where the bugs live:
eleven across this stage, from a delay-slot check that looked at the wrong queue entry
to a ring allocator that silently desynchronises as soon as two registers are allocated
per cycle and three released — replaced with a 48-bit bitmap after it overflowed and
corrupted data.

**Round two, after measuring.** The first two-wide version ate only half the available
width — an IPC of 0.81 out of 2.0 — so counters were added that classify every cycle.
The answer: matrix was spending **40%** of its cycles stalled on in-flight loads, streaming
**19%** on fetch bubbles. Two changes followed. A **load fast path** puts the request on
the bus in the issue cycle instead of the next one, and an **8-entry direct-mapped
branch target buffer** predicts recorded branches at fetch, with D-stage resolution kept
as the check. Between them, another 12.6% on matrix and 14.9% on streaming.

### What two-wide issue actually bought

Compared against the **same RTL with dual issue switched off**, so the numbers are the
superscalar contribution and nothing else. These come from a later testbench than the
tables above, so they are only comparable within this table:

| Benchmark | Single issue | **Two-wide** | Change |
|---|---|---|---|
| STREAM — copy 256 words | 8.54 cycles/word | **5.64** | **−33.9%** |
| MATRIX — 256 element products | 17.59 cycles/element | **14.69** | **−16.5%** |
| 16×16 matrix multiply, 4096 MACs | 17.22 cycles/MAC | **13.03** | **−24.3%** |
| Pointer chase, 8 dependent loads | 7030 cycles | **6576** | −6.5% |
| Pure-ALU counted loop | 1147 cycles | **919** | −19.9% |

The pattern repeats what the load-store unit already showed: the more independent work a
benchmark has, the more width it can use. A chain of eight dependent loads gains 6.5%;
a loop with nothing but arithmetic gains 20%.

None of that is worth anything if the core computes the wrong numbers, so the superscalar
version got a verification stack of its own: a **Python golden model** of the ISA, a
**random program generator** emitting 150-instruction sequences with random branches and
counted loops, and a **differ** that runs both and compares all 48 physical registers, the
rename map, and the first 1024 words of memory. Ten of ten random seeds pass on the
two-wide core, six of six on the single-issue one, plus every directed benchmark and a
full SoC boot. Twenty-one RTL bugs and five testbench bugs were caught this way —
including a golden model that was itself wrong about delay slots, which is worth knowing
before trusting one.

**What is left.** 36% of the matrix benchmark's cycles still wait on load data. That is
not a tuning problem — it is what in-order issue costs, and the next step is
out-of-order issue, not another parameter.

## Result

| | |
|---|---|
| Instructions | 47 MIPS instructions |
| Frequency | **117 MHz** at final verification, up from 75 MHz (+56%); competition build shipped at 100 MHz with ≥1 ns margin |
| CPI | **1.16** |
| Benchmark profile | streaming copy **~6–7 cycles/word** · matrix **9–10 cycles per MAC** · crypto kernel **~26 cycles/round** (unchanged — memory-hard) |
| Two-wide issue | rename, dynamic pairing, a load fast path and an 8-entry BTB: streaming **5.64 cycles/word** and 16×16 matmul **13.03 cycles/MAC**, 34% and 24% below the same RTL issuing one instruction per cycle |
