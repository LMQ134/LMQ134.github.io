---
title: "32-bit MIPS Processor: Design and Optimisation"
date: 2026-10-31
weight: 1
description: "Design and FPGA implementation of a five-stage MIPS processor, including memory-system optimisation, timing closure, and a later two-wide issue extension."
summary: "A five-stage MIPS SoC supporting 47 instructions. Improved clock frequency from 75 to 117 MHz, redesigned the load-store unit, and later added register renaming and two-wide in-order issue. The later extension reduced cycles by 33.9% on streaming copy and 24.3% on 16×16 matrix multiplication compared with the same RTL in single-issue mode."
tags: ["MIPS", "Verilog", "Computer Architecture", "Superscalar", "FPGA", "Timing"]
---

**Sole developer · Mar – Oct 2026 · Verilog, Vivado**  
**National College Student Computer System Capability Competition — CPU Design
Competition, Excellence Award (national level)**

I designed a 32-bit five-stage pipelined processor supporting 47 MIPS instructions,
precise exceptions, and interrupts. The minimal SoC includes hazard handling, CP0,
a two-way set-associative I-Cache, and UART peripherals.

After the initial implementation, I focused on reducing benchmark cycles and
improving clock frequency. These objectives sometimes conflicted: a change that
saved cycles could also lengthen a critical path. I evaluated both effects and
tested the design on FPGA.

## Datapath and Memory Improvements

**Single-cycle multiplication.** The original multiplier used a three-state FSM
and stalled the pipeline for two to three cycles. I replaced it with a DSP-mapped
32×32 multiplier using `(* use_dsp = "yes" *)`. This removed the multiplier's
multi-cycle stall and saved about two cycles per multiply in the matrix and crypto
benchmarks.

**Load-to-store forwarding.** When a store immediately follows a word load and uses
its result, the store takes the data directly from the M-stage memory output.
This removes a two-cycle load-use stall. Byte and halfword loads still require
their normal extension logic.

**Write buffering.** A one-entry write buffer allows an accepted store to leave
the pipeline while the buffer completes the memory transaction. New requests wait
while it drains, preserving read-after-write ordering. The later load-store-unit
redesign replaces this buffer with a store queue.

**Hardware division.** I added a 32-cycle restoring divider for division and
remainder instructions. It delivered about **5× performance on modulo-heavy
benchmarks**, but reduced achievable clock frequency by **5.6%**. Its benefit
therefore depends on how often a workload uses division.

**Instruction cache.** The I-Cache has 32 sets, two ways, 128-bit lines, LRU
replacement, a single-line bypass buffer, prefetching, and a stalled-instruction
buffer. Reading tags with a stable index keeps the lookup path from depending
directly on `next_pc`.

## Overlapping Loads with Independent Instructions

The off-chip asynchronous SRAM takes three cycles to read. In the original design,
a load in the M stage stalled the pipeline, including instructions that did not
depend on its result.

I redesigned the load-store unit so that a load could submit its request and leave
the pipeline before the response returned. Independent instructions could then
continue until decode reached a dependency or another blocking condition.

The implementation uses four mechanisms:

- A **32-bit register-busy scoreboard** marks a load destination when the request
  issues and clears it when the result is written back.
- The **hazard unit** checks whether an instruction in D needs a busy register.
  A dependent instruction waits in decode; younger instructions cannot pass it
  because issue remains in order.
- A **two-entry request queue** supplies the SRAM controller with back-to-back
  requests, avoiding an extra handshake bubble between transactions.
- A **response FIFO** carries `{valid, rd, rdata}` directly to a register-file write
  port. A store queue also checks incoming load addresses and forwards matching
  pending store data.

Allowing loads to complete later introduced correctness requirements. To handle
write-after-write hazards, a younger instruction targeting a busy register must wait
before writeback; otherwise, an older load could overwrite its result. Exception
and syscall redirects also wait for pending loads to complete.

The measured results for this stage were:

| Benchmark | Before | After |
|---|---|---|
| MATRIX — two reads and a MAC per inner iteration | 15.4 cycles/MAC | **9–10 cycles/MAC** |
| STREAM — streaming load-store loop | 9.1 cycles/word | **~6–7 cycles/word** |
| CryptoNight kernel | ~26 cycles/round | **Unchanged** |

The tested CryptoNight loop had too little independent work after each load to
hide the memory latency. This explains why the same mechanism helped MATRIX and
STREAM but did not improve this kernel.

## Timing Closure

At a 100 MHz constraint, the worst reported path was 9.65 ns. Reaching a 125 MHz
target required reducing the path delay to fit an 8 ns period.

| Change | Reported effect |
|---|---|
| Flip-flop I-Cache tag/valid arrays and parallel comparators | Fetch path reduced from 12–13 logic levels to about 8 |
| Replication of a signal driving 7,714 loads using `max_fanout` | 0.718 ns improvement in the first round |
| Stall-signal simplification | Removed 1–2 logic levels |
| Shared, mux-selected equality comparator | WNS improved from −1.035 to −0.558 ns in that iteration |
| Two-stage PC enable | Removed one logic level |
| PC split into four 8-bit instances with replicated inverting LUTs | Targeted routing delay |

After three rounds, WNS at 125 MHz was **−0.342 ns**. Routing accounted for
**69–83%** of delay in the remaining failing paths, so further logic simplification
offered limited benefit. I changed the target to **117 MHz**, where the design
achieved **+0.16 ns WNS**. The final frequency was **56% higher** than the original
75 MHz implementation.

I also evaluated changes that I did not keep:

| Attempt | Reason for stopping |
|---|---|
| D-Cache | Added a combinational-read path with WNS of −1.086 ns; the tested crypto kernel's near-random access pattern offered little expected reuse |
| Sequential-read SRAM prefetch | WNS of −1.134 ns |
| Further optimisation of the crypto kernel | Trace analysis found 21 instructions per round at 26.4 cycles, with two random word loads accounting for about 20% of cycles; I did not identify a useful further change in this iteration |

## FPGA Debugging and Timing Margin

Board testing exposed problems that simulation had not reproduced. Extending the
SRAM read window from 20 ns to 30 ns and holding engine addresses for 40 ns resolved
load corruption and boot failures. I also investigated an implementation issue in
a read multiplexer spanning blocks.

One build with **+0.107 ns WNS** passed simulation and CI but hung intermittently
on the board. Positive WNS alone did not establish reliable operation in that setup.
The competition build therefore ran at **100 MHz with at least 1 ns of timing
margin**. The timing-closed 117 MHz build and the 100 MHz competition build are
separate configurations.

## Register Renaming and Two-Wide Issue

The next extension increased issue width while retaining in-order issue.

**Register renaming.** I added a rename table, a free list, and a **48-entry
physical register file**. Different writes to an architectural register could use
different physical destinations, allowing pending results to be tracked separately.
Renaming alone produced no measurable speedup in these tests; it provided the
register-management structure used by this extension.

**Two-wide issue.** A **four-entry fetch queue** pairs adjacent instructions when
they are independent and the second instruction is supported by slot 1. Slot 0
handles the full instruction set. Slot 1 supports plain ALU operations, excluding
loads, stores, branches, multiplication, and division. The physical register file
has four read ports and three write ports.

Branch resolution remains in D. Delay-slot handling covers cases where the delay-slot
instruction is paired, remains in the queue, or has not yet arrived. During debugging,
I replaced a ring-based free-list allocator with a 48-bit bitmap after finding
allocation and release bookkeeping errors.

**Profiling and follow-up changes.** The first two-wide version achieved an IPC of
0.81. Counters showed that MATRIX spent **40%** of cycles waiting for pending loads,
while STREAM spent **19%** on fetch bubbles. I then added a **load fast path**, which
submits a request in the issue cycle, and an **eight-entry direct-mapped branch
target buffer**, checked by D-stage branch resolution. In that optimisation round,
cycle counts fell by a further **12.6% for MATRIX** and **14.9% for STREAM**.

### Cycle-Level Results

The following comparison uses the **same RTL with dual issue enabled or disabled**.
It comes from a later testbench and should be compared within this table, separately
from the earlier load-store-unit results.

| Benchmark | Single issue | Two-wide issue | Cycle reduction |
|---|---|---|---|
| STREAM — copy 256 words | 8.54 cycles/word | **5.64 cycles/word** | **33.9%** |
| MATRIX — 256 element products | 17.59 cycles/element | **14.69 cycles/element** | **16.5%** |
| 16×16 matrix multiplication, 4,096 MACs | 17.22 cycles/MAC | **13.03 cycles/MAC** | **24.3%** |
| Pointer chase, 8 dependent loads | 7,030 cycles | **6,576 cycles** | **6.5%** |
| Pure-ALU counted loop | 1,147 cycles | **919 cycles** | **19.9%** |

The benefit varies with the available independent work. A dependent load chain
offers fewer pairing opportunities than an arithmetic loop. These are reductions
in cycle count; they do not by themselves establish a corresponding improvement
in clock frequency or wall-clock runtime.

### Verification and Remaining Limits

I built a Python ISA reference model, a random generator producing 150-instruction
programs with branches and counted loops, and a differential checker. The checker
compares the 48 physical registers, rename map, and first 1,024 words of memory.

The two-wide core passed **10 random seeds**, and the single-issue configuration
passed **6**, along with directed benchmarks and SoC boot tests. This process found
**21 RTL bugs and 5 testbench bugs**, including a delay-slot error in the reference
model itself. These tests cover the exercised cases rather than establishing
exhaustive correctness.

After the follow-up changes, MATRIX still spent **36%** of cycles waiting for load
data. In-order issue prevents younger instructions from passing a blocked instruction.
Out-of-order issue is one possible next step, but would require additional scheduling
and recovery logic and further evaluation.

## Implementation Summary

| Item | Result |
|---|---|
| ISA | 47 MIPS instructions |
| Single-issue implementation | 75 → **117 MHz (+56%)**, with +0.16 ns WNS at 117 MHz |
| Competition configuration | **100 MHz**, with at least 1 ns timing margin |
| Reported CPI | **1.16** |
| Earlier LSU benchmarks | STREAM ~6–7 cycles/word; MATRIX 9–10 cycles/MAC; crypto kernel ~26 cycles/round |
| Later two-wide benchmarks | STREAM **5.64 cycles/word**; 16×16 matrix multiplication **13.03 cycles/MAC**, using a separate testbench |
