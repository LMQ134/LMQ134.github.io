---
title: "Real-Time Video Style Transfer on Zynq"
date: 2026-09-01
weight: 3
description: "An in-progress system that captures video from an OV5640 camera and styles it on a Zynq-7020, in the PL, at video rate."
summary: "In progress. A camera-to-display video pipeline on Zynq-7020, with the style-transfer accelerator being moved from a lookup-table filter to a small convolutional network implemented in the programmable logic."
tags: ["Zynq", "FPGA", "CNN Accelerator", "Video Pipeline", "Verilog"]
---

**In progress · 2026 · Zynq-7020, Verilog, Vivado**

> This one is still being built. What follows is where it actually stands rather
> than where it is going, because the gap between those two is the interesting part.

The target is a system that takes live video from an OV5640 camera and renders it in
a chosen style on an FPGA, at frame rate, with no host in the loop.

## The pipeline as it stands

```
OV5640 (DVP)  →  capture  →  cross-clock FIFO  →  frame buffer  →  display
                                      │
                                      └──  style filter  →──┘
```

The capture and display halves work end to end. Getting there meant working through
the parts of video that are easy to underestimate: the RGB565 packing between the
sensor, the framebuffer and the panel; the line-buffer addressing that wraps at a
power of two rather than at the actual line width; and the fact that a camera
configured over an I²C-like serial bus will happily report success while producing
nothing.

## The part being replaced

The current style stage is a **lookup-table filter** — luminance, a tone curve, and a
Laplacian-based edge term, all in three 256-entry tables. It is cheap and it works,
and it also plateaus: a table can only remap the pixel in front of it, so the result
is a filter rather than a rendering.

The work in progress replaces it with a **small convolutional network** implemented in
the programmable logic. That opens the real architectural questions, which are the
reason the project is worth doing:

- **Where the weights live.** 220 DSP48s and about 5 Mb of BRAM on a 7020 set a hard
  ceiling on how large a network can be, and the first design decision is which layer
  gets the budget.
- **Whether to go back to DDR.** A 640×480 RGB565 frame is 4.9 Mb — a single frame does
  not fit in the entire on-chip BRAM. Double buffering is 9.8 Mb. So the frame buffer
  must move to DDR, and the interesting question becomes how to keep the feature maps
  on chip so the bandwidth does not.
- **Line-based rather than frame-based.** Feeding a whole frame through a layer at a
  time means megabytes of traffic per layer. Streaming rows through the layers and
  keeping only the rows a convolution needs is what makes the bandwidth work.

## Why I want to do this one

The processor project taught me to make a design meet timing. The security sensor
taught me to make one survive the environment it runs in. This one is about a
different constraint entirely — a **fixed resource budget**, where 220 multipliers and
5 Mb of memory are not negotiable, and the design is whatever fits inside them.

That constraint is what makes accelerator architecture interesting to me: the answer
is not "use more hardware", it is "decide what the hardware is for".
