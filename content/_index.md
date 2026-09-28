I am an undergraduate in **Microelectronics Science and Engineering** at
[Lanzhou University](https://www.lzu.edu.cn/) — one of China's leading universities —
in the School of Physics. I work on
**computer architecture and digital integrated circuit design** — processors, hardware
accelerators, and the FPGA implementations of both.

I came to this through building things end to end rather than purely from theory. A
32-bit pipelined MIPS processor I designed and brought from RTL to a 117 MHz
implementation taught me that timing closure is fundamentally an **architectural**
design problem, not a tool optimisation task. A fully digital fault-injection sensor
spanning four clock domains taught me the practical divide between a circuit that
merely simulates correctly and one that stays reliable when the physical environment
stops cooperating. Both projects raised more research questions than they answered,
which is the reason I want to keep going.

## Research Interests

- **Computer Architecture** — pipelining, caches, and the memory hierarchy; the
  quantitative trade-off between instruction issue and retirement
- **Hardware Accelerators** — domain-specific accelerators (CNN, graph) under a fixed
  resource budget, where 220 DSP48s and about 5 Mb of BRAM decide what the design is
  allowed to be
- **Digital IC Design** — RTL to timing-closed implementation, clock-domain crossing
  reliability, and low-power design

## Education

<div class="cv-entry"><span class="when">2023 – present</span><span>
<strong>Lanzhou University</strong> — B.Eng. in Microelectronics Science and Engineering<br>
School of Physics · Project 985, one of China's leading universities · ranked in the
top 30% of the major
</span></div>

## Honors & Awards

- **Aug 2026** — National College Student Computer System Capability Competition, CPU
  Design Competition: Excellence Award (national level)
- **Aug 2026** — "FMSH Cup" National College Students Electronic Design Invitational
  Contest: National Third Prize

## Selected Projects

- **Mar – Aug 2026 — A 32-bit five-stage pipelined MIPS processor.**
  47 MIPS instructions with precise exception and interrupt handling; a minimal SoC
  with hazard handling, a CP0 exception module, I-Cache and UART peripherals. The
  project became a measured optimisation campaign against two objectives that fight
  each other — cycles per benchmark and nanoseconds per clock period — ending at
  **117.65 MHz (+17.6%) and IPC 0.67**, with the streaming benchmark at 9.1 cycles per
  word. Includes three optimisations that were tried, measured, and abandoned.
  [Details]({{< relref "/projects/mips-processor" >}})

- **2026 — An intelligent digital security sensor.** *(2026 FMSH Cup finalist entry)*
  A CPU-independent hardware defence against fault-injection attacks across four clock
  domains, in three layers (sense / decide / configure): a 51-stage ring-oscillator
  probe with self-calibrating, frozen baselines; a 16-stage LUT delay line and pulse
  width monitor for nanosecond glitches; and a watchdog, an arbiter, and an APB
  register interface. Response bypasses the CPU entirely — NMI for thermal, voltage, or
  frequency excursion, hardware key erasure for a confirmed glitch.
  **1382 LUT / 2006 FF / 0.223 W / 200 MHz.**
  [Details]({{< relref "/projects/security-sensor" >}}) ·
  [Code](https://github.com/LMQ134/fuweibei)

- **2026 – present — Real-time video style transfer on Zynq.** *(in progress)*
  A camera-to-display pipeline on a Zynq-7020, with the style stage being moved from a
  lookup-table filter to a small convolutional network in the programmable logic. The
  binding constraint is the resource budget: a 640×480 frame does not fit in the
  on-chip BRAM at all, so the frame buffer has to move to DDR and the feature maps
  have to stay on chip.
  [Details]({{< relref "/projects/zynq-style-transfer" >}})

## Skills

<div class="cv-entry"><span class="when">Languages</span><span>
Verilog · C · Python · Tcl
</span></div>

<div class="cv-entry"><span class="when">Hardware</span><span>
FPGA development · Xilinx Vivado (synthesis, implementation, timing closure, ILA debug) ·
clock-domain-crossing design · APB
</span></div>

<div class="cv-entry"><span class="when">Flow</span><span>
Scripted EDA flows in Tcl and Python — project setup, implementation and bitstream
generation, timing-report parsing, HDL linting · Git · Make
</span></div>

---

I am applying to Ph.D. programs for **Fall 2027** in computer architecture and digital
IC design. The best way to reach me is by email.
