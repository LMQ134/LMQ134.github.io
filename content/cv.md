---
title: "CV"
layout: "cv"
description: "Mingquan Li's education, research interests, projects, awards, and technical skills."
---

## Research Interests

Computer architecture · AI and hardware accelerators · Digital IC design ·
AI for design automation

## Education

<div class="cv-entry"><span class="when">2023 – present</span><span>
<strong>Lanzhou University</strong> — B.Eng. in Microelectronics Science and Engineering<br>
School of Physics · Project 985 university<br>
<strong>GPA 85/100</strong> · ranked in the top 30% of the major
</span></div>

## Awards

<div class="cv-entry"><span class="when">2026</span><span>
<strong>Lanzhou University Outstanding Student Scholarship</strong><br>
Second Class, university level
</span></div>

<div class="cv-entry"><span class="when">Aug 2026</span><span>
<strong>National College Student Computer System Capability Competition</strong><br>
CPU Design Competition — Excellence Award, national level
</span></div>

<div class="cv-entry"><span class="when">Aug 2026</span><span>
<strong>"FMSH Cup" National College Students Electronic Design Invitational Contest</strong><br>
National Third Prize
</span></div>

## Projects

### 32-bit MIPS Processor
*Sole developer · Mar – Oct 2026 · Verilog, Vivado*

Designed a five-stage processor supporting 47 MIPS instructions, precise exceptions,
and interrupts. Integrated hazard handling, CP0, a two-way set-associative I-Cache,
and UART peripherals in a minimal SoC.

- **Memory access:** redesigned the load-store unit to overlap pending SRAM reads
  with independent instructions. Added a register-busy scoreboard, a two-entry request
  queue, a response FIFO, and store-to-load forwarding. Streaming copy improved from
  about 9.1 to 6–7 cycles/word, and matrix computation from 15.4 to 9–10 cycles/MAC.
  The tested memory-hard kernel showed no improvement.
- **Datapath:** implemented single-cycle DSP-mapped multiplication and load-to-store
  forwarding. Added a 32-cycle hardware divider that delivered about 5× performance
  on modulo-heavy code, with a 5.6% reduction in clock frequency.
- **Timing closure:** simplified I-Cache lookup and control paths, shared comparison
  logic, and reduced high-fanout signal loads. Increased frequency from **75 to
  117 MHz (+56%)**, with **+0.16 ns WNS** at 117 MHz. Reported CPI: **1.16**.
  Used a 100 MHz competition build with at least 1 ns timing margin after observing
  intermittent board failures in a build with +0.107 ns WNS.
- **Design evaluation:** tested and rejected a D-Cache and sequential-read SRAM
  prefetch because of timing costs. Memory traces showed little opportunity for
  cache reuse in the tested crypto kernel.

*Superscalar extension · Oct 2026*

- Added a rename table, a free list, and a **48-entry physical register file** to
  support in-order issue with out-of-order completion.
- Implemented **two-wide in-order issue** with a four-entry fetch queue and dynamic
  pairing. Slot 0 supports the full instruction set; slot 1 accepts independent
  ALU operations. Added a load fast path and an eight-entry direct-mapped branch
  target buffer after profiling load stalls and fetch bubbles.
- Compared with the same RTL in single-issue mode, reduced streaming-copy cycles
  from **8.54 to 5.64 per word (−33.9%)** and 16×16 matrix-multiplication cycles
  from **17.22 to 13.03 per MAC (−24.3%)**. These results use a later testbench
  and are separate from the earlier load-store-unit measurements.
- Built a Python reference model, a random program generator, and a differential
  checker. Passed 10 random seeds in two-wide mode and 6 in single-issue mode,
  along with directed benchmarks and SoC boot tests. Found and fixed **21 RTL bugs
  and 5 testbench bugs**.

[Project details]({{< relref "/projects/mips-processor" >}})

### FPGA-Based Digital Security Sensor
*Core developer · Jun – Aug 2026 · FPGA, Verilog, APB, clock-domain crossing*  
*2026 FMSH Cup — Digital & FPGA track, national finalist · Advisor: Prof. Guipeng Liu ·
[Code](https://github.com/LMQ134/fuweibei)*

Developed a hardware subsystem for detecting fault-injection conditions across four
clock domains. The response path raises an NMI or triggers hardware key erasure
without waiting for CPU software.

- Implemented a 51-stage LUT ring oscillator for monitoring environmental drift,
  a 16-stage LUT delay line for clock-glitch detection, and a pulse-width monitor.
- Designed startup self-calibration with a frozen baseline, a 100 ms watchdog,
  and NMI/WIPE flags that remain asserted until reset.
- Integrated sensing, decision logic, and an APB configuration interface.
  Reported implementation figures: **1,382 LUTs / 2,006 FFs / 0.223 W / 200 MHz**.
- Verified startup blanking, clock faults, and narrow glitches using testbenches
  with false-positive and miss counters, and an on-board injection setup.

[Project details]({{< relref "/projects/security-sensor" >}})

### Video Style Transfer on Zynq
*In progress · 2026 · Zynq-7020, Verilog, Vivado*

Built an OV5640 camera-to-display pipeline with a lookup-table style filter.
Working on a small convolutional accelerator in programmable logic, with DDR frame
storage and line buffers to fit the Zynq-7020's compute and memory resources.

[Project details]({{< relref "/projects/zynq-style-transfer" >}})

## Skills

<div class="cv-entry"><span class="when">Languages</span><span>
Verilog · C · Python · Tcl
</span></div>

<div class="cv-entry"><span class="when">Hardware & Tools</span><span>
FPGA development · Xilinx Vivado (synthesis, implementation, timing closure, ILA debug) ·
clock-domain crossing · APB
</span></div>

<div class="cv-entry"><span class="when">Automation</span><span>
Tcl and Python scripts for EDA workflows and timing-report analysis · Git · Make
</span></div>

## Test Scores

<div class="cv-entry"><span class="when">IELTS</span><span>6.0</span></div>

---

<small>Last updated: October 2026</small>
