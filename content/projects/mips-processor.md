---
title: "A 32-bit MIPS Processor, and the Optimisation Campaign Behind It"
date: 2026-08-01
weight: 1
description: "A five-stage pipelined MIPS SoC taken from RTL to a timing-closed 117 MHz implementation — and the eighteen months of measured optimisation that got it there."
summary: "Sole developer. 47 MIPS instructions, precise exceptions, CP0, I-Cache and UART in a minimal SoC. A campaign of measured performance and timing work: +17.6% frequency, load-store forwarding that took the streaming benchmark to 9.1 cycles per word, and a hardware divider that cost 5.6% of the clock and returned 5x on modulo-heavy code."
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
which settled at **~9.1 cycles per word**.

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

So instead of cutting, **I changed the clock**. Dropping to 117.65 MHz turned the
design positive at +0.16 ns with a single parameter change, for a **net +17.6%
frequency** over where the project started — and every benchmark improved
proportionally, because they all scale with clock.

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
| Frequency | **117.65 MHz** at final verification, from 100 MHz (+17.6%); 100 MHz with ≥1 ns margin for the competition build |
| IPC | **0.67** |
| Benchmark profile | 9.1 cycles/word streaming copy · 15.4 cycles per MAC · ~26 cycles/round on the crypto kernel |
