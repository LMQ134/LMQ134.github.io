I am an undergraduate studying **Microelectronics Science and Engineering** in the
School of Physics at [Lanzhou University](https://www.lzu.edu.cn/). My interests are
**computer architecture, AI accelerators, and digital IC design**.

My experience is mainly in RTL design and FPGA implementation. I built a five-stage
MIPS processor and improved its clock frequency from 75 MHz to 117 MHz through
changes to the pipeline, memory interface, and critical paths. I later extended it
with register renaming and two-wide in-order issue. I also worked on an FPGA-based
security sensor that detects clock glitches and environmental changes and triggers
a hardware response.

These projects made me interested in how architectural choices affect timing,
memory access, and resource use after implementation. I would like to study these
tradeoffs further, including how design automation can help evaluate them earlier.

## Research Interests

- **Computer Architecture** — processor pipelines, memory systems, and mechanisms
  for overlapping memory access with computation.
- **AI and Hardware Accelerators** — dataflow, on-chip storage, and efficient use
  of compute and memory resources.
- **Digital IC Design** — RTL design, timing closure, clock-domain crossing, and
  low-power design.
- **AI for Design Automation** — learning circuit representations and predicting
  implementation quality before synthesis and place-and-route.

## Education

<div class="cv-entry"><span class="when">2023 – present</span><span>
<strong>Lanzhou University</strong> — B.Eng. in Microelectronics Science and Engineering<br>
School of Physics · Project 985 university<br>
<strong>GPA 85/100</strong> · ranked in the top 30% of the major
</span></div>

## Honors & Awards

- **2026** — Lanzhou University Outstanding Student Scholarship, Second Class
- **Aug 2026** — National College Student Computer System Capability Competition,
  CPU Design Competition: Excellence Award
- **Aug 2026** — "FMSH Cup" National College Students Electronic Design Invitational
  Contest: National Third Prize

## Selected Projects

- **Mar – Oct 2026 — 32-bit MIPS Processor**  
  Designed a five-stage processor supporting 47 MIPS instructions, precise exceptions,
  and interrupts, with an I-Cache, CP0, and UART in a minimal SoC. Improved the clock
  frequency from **75 to 117 MHz (+56%)** and redesigned the load-store unit to let
  independent instructions execute while loads were pending. A later extension added
  register renaming and two-wide in-order issue. In cycle-level comparisons with the
  same RTL in single-issue mode, the extended core used **33.9% fewer cycles per word
  for streaming copy** and **24.3% fewer cycles per MAC for 16×16 matrix multiplication**.
  [Details]({{< relref "/projects/mips-processor" >}})

- **2026 — FPGA-Based Digital Security Sensor**  
  Developed a hardware subsystem that monitors clock glitches and temperature- or
  voltage-related frequency changes across four clock domains. It combines a ring
  oscillator, delay-line and pulse-width detectors, self-calibration, and a watchdog.
  The hardware response path raises an NMI or triggers key erasure without waiting
  for software. Reported implementation figures: **1,382 LUTs, 2,006 FFs, 0.223 W,
  and a 200 MHz clock**.
  [Details]({{< relref "/projects/security-sensor" >}}) ·
  [Code](https://github.com/LMQ134/fuweibei)

- **2026 – present — Video Style Transfer on Zynq** *(in progress)*  
  Built a camera-to-display pipeline on a Zynq-7020. The current style stage uses a
  lookup-table filter; I am working on replacing it with a small convolutional network
  in programmable logic. The next design steps are to move frame storage to DDR and
  use line buffers to limit on-chip feature-map storage.
  [Details]({{< relref "/projects/zynq-style-transfer" >}})

## Skills

<div class="cv-entry"><span class="when">Languages</span><span>
Verilog · C · Python · Tcl
</span></div>

<div class="cv-entry"><span class="when">Hardware</span><span>
FPGA development · Xilinx Vivado (synthesis, implementation, timing closure, ILA debug) ·
clock-domain-crossing design · APB
</span></div>

<div class="cv-entry"><span class="when">Automation</span><span>
Tcl and Python scripts for project setup, implementation, bitstream generation,
timing-report analysis, and HDL linting · Git · Make
</span></div>

---

I am applying to **Fall 2027 Ph.D. programs** in computer architecture, AI accelerators,
and digital IC design. Please feel free to contact me by email.
