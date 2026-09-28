---
title: "An Intelligent Digital Security Sensor"
date: 2026-08-15
weight: 2
description: "A CPU-independent hardware security subsystem that senses physical-layer attacks and responds before they take effect — 2026 FMSH Cup finalist entry, FPGA and digital track."
summary: "2026 FMSH Cup finalist entry. A ring-oscillator and delay-line sensor array, a central arbiter with boot self-calibration, and a hardware response path that bypasses the CPU entirely: 1382 LUT, 2006 FF, 0.223 W, 200 MHz."
tags: ["Hardware Security", "FPGA", "Verilog", "CDC", "APB", "Timing"]
---

**Core developer · June – August 2026 · Zynq-class FPGA, Verilog, Vivado 2024.2**
**2026 FMSH Cup — National College Students Electronic Design Invitational Contest, Digital & FPGA track, national finalist**
**Advisor: Prof. Guipeng Liu · [Code](https://github.com/LMQ134/fuweibei)**

A chip deployed in the field sits inside a threat model that software security cannot
see. Clock glitches and supply or temperature excursions do not break the encryption —
they push the silicon until a comparison takes the wrong branch. A CPU cannot detect
any of this, because by the time software runs, the attack has already succeeded.

This design is the **autonomous nervous system** underneath that software: a hardware
loop of *sense → decide → respond → self-check*, in which **the response path neither
traverses nor depends on the CPU or the bus**.

## Architecture

```
CPU  ──(APB: threshold configuration / live status)──┐
                                                     ▼
        ┌────────────────────────────────────────────────────┐
        │            hardware security subsystem             │
        │                                                    │
        │  ①  APB configuration & control bridge             │
        │      zero-wait CSR · thresholds, enables,          │
        │      debounce period · read-only status            │
        │                                                    │
        │  ②  physical sensor array                          │
        │      ring oscillator (temp/voltage)                │
        │      delay line + high-rate sampling (clock glitch)│
        │                                                    │
        │  ③  central arbiter                                │
        │      boot self-calibration · multi-window debounce │
        │      watchdog self-check · composite-attack logic  │
        │                                                    │
        │  ④  hardware response                              │
        │      primary: NMI (non-maskable interrupt)         │
        │      fatal:   WIPE — hardware key erasure, latched │
        └────────────────────────────────────────────────────┘
```

## Three problems worth naming

**Sensing a slow drift and a fast glitch with the same budget.** These are opposite
problems. A temperature or voltage attack moves over milliseconds and shows up as a
*frequency* shift; a clock glitch lasts nanoseconds and shows up as a *timing*
violation. They need different sensors, and both have to fit in one design.

For the slow one, a **51-stage LUT ring oscillator** (a LUT2 NAND plus 50 LUT1
inverters) is counted over a fixed 20 ms window — a quantisation error under 0.5 ppm
against a ±0.5 % decision tolerance, so the measurement is not the limiting factor.
For the fast one, a **16-stage LUT delay line** turns a nanosecond event into a
*spatial* pattern of flip-flop states, sampled at 200 MHz: the glitch is identified by
a tap transitions count of two or more, which distinguishes it from a normal clock
edge. A second, independent probe counts the half-periods of the monitored 15 MHz
clock at 5 ns resolution and alarms if the pulse width leaves its 15–45 ns window.
The two paths are OR'd so their blind spots do not overlap.

**Calibration, not thresholds.** A fixed threshold cannot survive part-to-part and
board-to-board variation, and calibration is where the security actually lives. The
sensor **builds its own baseline from the first samples after power-up**, then runs a
coarse pass at three times the tolerance before a fine pass at one times — detecting
*relative* drift rather than an absolute value. The baseline is then frozen, because
the obvious attack on a self-calibrating sensor is the slow one: drift the environment
gently enough that the sensor recalibrates to the attacker's conditions. That is the
threat the freeze exists to stop.

**The watcher has to be watched.** Any sensor whose output stops arriving for 100 ms is
declared dead and triggers erasure. A security system whose failure mode is "the
sensor quietly stopped working" is worse than no sensor at all, because it is trusted.

## Response

An anomaly must persist across three consecutive measurement windows (a saturation
counter) before it is believed — environmental noise is continuous, and a sensor that
cries wolf gets disabled by its own users.

Response is graded. Thermal, voltage or frequency excursion raises an **NMI**. A clock
glitch, a watchdog timeout, or a composite judgement across both probes triggers
**WIPE** — hardware erasure of the key material, taken *before* the attack can
succeed rather than reported after it. Both flags are **latched so that only a reset
clears them**: the evidence of an attack cannot be erased by the software running on a
possibly-compromised CPU.

A 1 ms blanking period after power-up masks PLL-lock transients, so the system cannot
lock itself out on a false positive before it has started.

## Verification

Verified in two directions, which matters more here than in most designs — a security
sensor fails by being quiet in either direction.

| | |
|---|---|
| Logic | **1382 LUT / 2006 FF** |
| Power | **0.223 W** |
| Maximum clock frequency | **200 MHz** |
| Main testbench | functional, plus **false-positive and miss-rate counters** |
| Corner cases | boot blanking, clock under-run, extreme glitches |
| TDL verification | dedicated narrow-glitch testbench |
| On-board | `fpga_attack_top` — a signal generator injects the monitored clock, glitches mixed in through an XOR network; a VIO console drives injection and displays state, yellow LED = NMI, red LED = WIPE |

The honest metric for this class of design is not "did it detect the attack" but
**the false-positive rate at a given detection threshold** — a sensor that fires on
noise will be switched off in the field, and then it detects nothing at all.

## What I took from it

Before this, "timing" meant meeting a clock constraint. Here it became the subject:
four clock domains, a 5 ns sampling window, and a design whose entire value depends on
distinguishing a real event from a marginal one. Deciding *what counts as an attack*
turned out to be a harder and more interesting problem than detecting it.
