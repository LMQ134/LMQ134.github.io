---
title: "FPGA-Based Digital Security Sensor"
date: 2026-08-15
weight: 2
description: "An FPGA security subsystem for monitoring clock glitches and environmental drift, with self-calibration and a hardware response path."
summary: "2026 FMSH Cup finalist entry. Combines ring-oscillator, delay-line, and pulse-width sensors with self-calibration, a watchdog, and hardware NMI/key-erasure outputs. Reported implementation: 1,382 LUTs, 2,006 FFs, 0.223 W, and a 200 MHz clock."
tags: ["Hardware Security", "FPGA", "Verilog", "CDC", "APB", "Timing"]
---

**Core developer · June – August 2026 · Zynq-class FPGA, Verilog, Vivado 2024.2**  
**2026 FMSH Cup — National College Students Electronic Design Invitational Contest,
Digital & FPGA track, national finalist**  
**Advisor: Prof. Guipeng Liu · [Code](https://github.com/LMQ134/fuweibei)**

Clock glitches and abnormal supply or temperature conditions can cause a circuit
to operate incorrectly. Software checks may respond too late or may themselves
be affected by the fault.

This project monitors these conditions in hardware and generates a response without
waiting for CPU software. The subsystem spans four clock domains and combines
sensors, calibration and decision logic, an APB interface, and NMI/key-erasure outputs.

## Architecture

| Block | Function |
|---|---|
| APB configuration interface | Sets thresholds, enables, and debounce parameters; provides status registers |
| Sensor array | Uses a ring oscillator to monitor environmental drift and delay-line and pulse-width detectors to monitor clock glitches |
| Decision logic | Performs startup calibration, debounce, watchdog checks, and combined sensor decisions |
| Response logic | Raises an NMI or asserts WIPE for hardware key erasure; keeps the flags asserted until reset |

The CPU configures the subsystem through APB and reads its status. Detection and
response use a separate hardware path.

## Monitoring Slow Drift and Short Glitches

Temperature- and voltage-related changes can be observed through shifts in oscillator
frequency. The design counts a **51-stage LUT ring oscillator** over a **20 ms
window** and compares the count with a calibrated baseline. The oscillator consists
of a LUT2 NAND and 50 LUT1 inverters. The reported count quantisation error is below
0.5 ppm, compared with a ±0.5% decision tolerance; this does not represent the total
sensor error.

Short clock glitches require a different measurement. A **16-stage LUT delay line**
produces a pattern of tap states sampled at **200 MHz**. The detector counts
transitions in that pattern and treats two or more transitions as a glitch indication.

A second detector measures the pulse width of the monitored **15 MHz clock** at
**5 ns resolution** and raises an alarm outside a **15–45 ns window**. The two
detector outputs are ORed so that either can report an anomaly. Their combined
coverage depends on the pulse timing and the implementation.

## Calibration and Self-Monitoring

The subsystem establishes a baseline from samples collected after power-up, accounting
for differences between devices and boards. It uses a coarse check at three times the
tolerance, followed by a fine check at the configured tolerance.

After calibration, the baseline is **frozen**. Continually updating it could allow a
gradual environmental change to be absorbed into the reference. A frozen baseline
avoids that adaptation, although legitimate long-term drift also needs to be considered.

A **100 ms watchdog** checks that sensor outputs continue to arrive. A timeout
triggers the erasure response rather than leaving a failed sensor undetected.

## Response Logic

A **1 ms startup blanking interval** masks PLL-lock transients. The design also uses
a saturation counter to require an anomaly to persist for three consecutive measurement
windows in its debounced decision path.

Response severity depends on the alarm. Temperature-, voltage-, or frequency-related
excursions raise an **NMI (non-maskable interrupt)**. A clock glitch, watchdog
timeout, or combined sensor decision asserts **WIPE** to trigger hardware key erasure.

Both flags remain asserted until reset. Software cannot clear them through the
configuration interface. This removes software response latency, but establishing
whether erasure completes before a particular attack succeeds requires measuring
the full detection and response delay.

## Implementation and Verification

| Item | Reported result or method |
|---|---|
| Logic resources | **1,382 LUTs / 2,006 FFs** |
| Power | **0.223 W** |
| Clock frequency | **200 MHz** |
| Functional checks | Testbench with false-positive and miss counters |
| Corner cases | Startup blanking, slow clock, and extreme glitches |
| Delay-line detector | Dedicated narrow-glitch testbench |
| Board testing | Signal-generator clock with XOR-injected glitches; VIO for control and status; LEDs for NMI and WIPE |

The power figure is retained from the project report; this page does not identify it
as a board measurement. Likewise, the presence of false-positive and miss counters
does not by itself establish a measured detection rate across operating conditions.

## What I Learned

This project extended my timing work beyond meeting a clock constraint. I had to
consider how signals move between four clock domains, how short events are sampled,
and how calibration and debounce affect detection.

It also showed why sensor evaluation needs both missed-event and false-alarm tests.
Increasing sensitivity can improve detection while making the system more likely to
respond to normal variation.
