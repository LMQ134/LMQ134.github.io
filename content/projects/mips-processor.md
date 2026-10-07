---
title: "A 32-bit MIPS Processor, and the Optimisation Campaign Behind It"
date: 2026-08-01
weight: 1
description: "A five-stage pipelined MIPS SoC taken from RTL to a timing-closed 117 MHz implementation — and the eighteen months of measured optimisation that got it there."
summary: "Sole developer. 47 MIPS instructions, precise exceptions, CP0, I-Cache and UART in a minimal SoC. A campaign of measured performance and timing work: 75 → 117 MHz, a load-store unit rebuilt around a busy scoreboard so loads no longer stop the pipeline (streaming to ~6–7 cycles per word, matrix to 9–10 per MAC, and no gain at all on the memory-hard kernel), and a hardware divider that cost 5.6% of the clock and returned 5x on modulo-heavy code."
tags: ["MIPS", "Verilog", "Computer Architecture", "FPGA", "Timing"]
---

**Sole developer · Mar – Aug 2026 · Verilog, Vivado**
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

## Result

| | |
|---|---|
| Instructions | 47 MIPS instructions |
| Frequency | **117 MHz** at final verification, up from 75 MHz (+56%); competition build shipped at 100 MHz with ≥1 ns margin |
| CPI | **1.16** |
| Benchmark profile | streaming copy **~6–7 cycles/word** · matrix **9–10 cycles per MAC** · crypto kernel **~26 cycles/round** (unchanged — memory-hard) |
