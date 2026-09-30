---
title: "CV"
layout: "cv"
description: "Curriculum vitae of Mingquan Li — education, awards, projects, and skills."
---

## Education

<div class="cv-entry"><span class="when">2023 – present</span><span>
<strong>Lanzhou University</strong> — B.Eng. in Microelectronics Science and Engineering<br>
School of Physics · Project 985, one of China's leading universities · ranked in the
top 30% of the major
</span></div>

## Awards

<div class="cv-entry"><span class="when">Aug 2026</span><span>
<strong>National College Student Computer System Capability Competition</strong><br>
CPU Design Competition — Excellence Award, national level
</span></div>

<div class="cv-entry"><span class="when">Aug 2026</span><span>
<strong>"FMSH Cup" National College Students Electronic Design Invitational Contest</strong><br>
National Third Prize
</span></div>

## Projects

### A 32-bit Five-Stage Pipelined MIPS Processor
*Sole developer · Mar – Aug 2026 · Verilog, Vivado*

Designed and built a 32-bit five-stage pipelined processor implementing 47 MIPS
instructions with precise exception and interrupt handling, and a minimal SoC around
it: hazard handling, a CP0 exception module, I-Cache, and UART peripherals. The project
became a recorded optimisation campaign against two objectives
that fight each other: cycles per benchmark, and nanoseconds per clock period.

- **Performance:** single-cycle DSP-mapped multiply (removing a 2–3 cycle stall);
  load-store forwarding that lets a store take its data directly from the M-stage
  memory output, removing a two-cycle load-use stall and bringing the streaming
  benchmark to **9.1 cycles per word**; a non-blocking write buffer with ordered drain;
  a two-way set-associative I-Cache with a single-line bypass buffer and prefetch.
- **Hardware division**, the change that cost more than it gave: a 32-round restoring
  remainder state machine turned `/` and `%` into single instructions for roughly
  **5× on modulo-heavy code**, at a cost of **5.6% of the clock**.
- **Timing:** worked the critical paths with flip-flop Tag/Valid arrays and parallel
  comparators (fetch path 12–13 logic levels → ~8), a shared mux-driven equality
  comparator (the single best fix, −0.558 ns), `max_fanout` replication on a
  7714-load signal, stall-signal expansion, and two-stage PC enable. Three rounds at
  125 MHz converged to −0.342 ns with every failing path 69–83% **routing**-dominated —
  so instead of continuing, **the clock was changed**, landing at **117 MHz with
  WNS +0.16 ns** — **75 → 117 MHz end to end (+56%)**.
- **Tried, measured, and abandoned:** D-Cache (WNS −1.086 ns; the crypto benchmark's
  access pattern is near-random), sequential-read SRAM prefetch (WNS −1.134 ns), and
  algorithm-level work on the crypto kernel — dropped after a trace-based
  reconstruction showed the addresses were fully random.
- **IPC 0.67**; a competition build at 100 MHz deliberately leaving **≥ 1 ns margin**,
  after a build with +0.107 ns WNS passed simulation and CI and then failed at random
  on hardware.

### An Intelligent Digital Security Sensor
*Core developer · Jun – Aug 2026 · FPGA, Verilog, APB, clock-domain crossing*
*2026 FMSH Cup — Digital & FPGA track, national finalist · Advisor: Prof. Guipeng Liu ·
[Code](https://github.com/LMQ134/fuweibei)*

A CPU-independent hardware defence subsystem against fault-injection attacks, in three
layers — sensing, decision, and configuration — across four clock domains, detecting
threats from nanosecond transient glitches up to slow thermal and voltage drift. The
response path neither traverses nor depends on the CPU: thermal/voltage/frequency
excursions raise an NMI, while a clock glitch or watchdog timeout triggers hardware key
erasure before the attack can take effect.

- Built a 51-stage LUT ring-oscillator probe counted over a 20 ms window (quantisation
  error below 0.5 ppm against a ±0.5 % decision tolerance), and a 16-stage LUT delay
  line that turns a nanosecond event into a flip-flop state pattern sampled at 200 MHz
  — with a second pulse-width probe on the monitored clock, OR'd in so the two blind
  spots do not overlap.
- Designed boot self-calibration that builds its own baseline and then **freezes** it,
  detecting relative drift rather than an absolute threshold and closing the
  "boiling-frog" attack against a sensor that would otherwise recalibrate to it.
- Added a watchdog that declares a sensor dead after 100 ms of no output, and latched
  NMI/WIPE flags clearable only by reset, so attack evidence cannot be erased by
  compromised software.
- **1382 LUT / 2006 FF / 0.223 W / 200 MHz**; verified with false-positive and
  miss-rate counters plus a dedicated narrow-glitch testbench.

### Real-Time Video Style Transfer on Zynq
*In progress · 2026 · Zynq-7020, Verilog, Vivado*

A camera-to-display video pipeline on a Zynq-7020, with the style stage being moved
from a lookup-table filter to a small convolutional network implemented in the
programmable logic. The design problem is the fixed resource budget — 220 DSP48s and
about 5 Mb of BRAM — which forces the frame buffer into DDR and the feature maps to
stay on chip in a line-based pipeline.
[Project page]({{< relref "/projects/zynq-style-transfer" >}})

## Skills

<div class="cv-entry"><span class="when">Languages</span><span>
C · Python · Verilog
</span></div>

<div class="cv-entry"><span class="when">Tools</span><span>
Xilinx Vivado — synthesis, implementation, timing closure, ILA debug · FPGA development
</span></div>

## Test Scores

<div class="cv-entry"><span class="when">IELTS</span><span>6.0</span></div>

---

<small>Last updated: September 2026</small>
