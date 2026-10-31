---
title: "Video Style Transfer on Zynq"
date: 2026-09-01
weight: 3
description: "An in-progress Zynq-7020 video system with camera capture, display output, and a planned convolutional style-transfer accelerator."
summary: "Built an OV5640 camera-to-display pipeline with a lookup-table style filter. Working on a small convolutional accelerator, DDR frame storage, and line-buffered processing within the Zynq-7020's resource limits."
tags: ["Zynq", "FPGA", "CNN Accelerator", "Video Pipeline", "Verilog"]
---

**In progress · 2026 · Zynq-7020, Verilog, Vivado**

The goal is to capture live video from an OV5640 camera, apply a visual style in
FPGA programmable logic, and send the result to a display without a host computer.

Camera capture and display output are working. The current style stage uses a
lookup-table filter; replacing it with a small convolutional network is ongoing work.
Real-time neural style transfer has not yet been demonstrated in this project.

## Current Implementation

The video path consists of camera capture, a clock-domain-crossing FIFO, frame
storage, a style filter, and display output.

Bringing up the path required debugging RGB565 pixel packing, line-buffer addressing,
and camera configuration over its serial control interface. In particular, buffer
addresses had to follow the actual line width rather than wrap at a power of two.

The current filter uses three 256-entry tables for luminance and tone processing,
together with a Laplacian-based edge term. It provides a lightweight baseline for
testing the video path, but does not offer the learned transformations of a neural
style-transfer model.

## Convolutional Accelerator in Progress

I am working on a small convolutional network in programmable logic. The Zynq-7020
provides **220 DSP48 blocks** and about **5 Mb of BRAM**, so the network and its
storage layout must fit a limited resource budget.

The main design decisions are:

- **Compute and weight storage.** Choose a network size and layer mapping that fit
  the available DSP and memory resources.
- **Frame storage.** A 640×480 RGB565 frame contains 4,915,200 bits, and double
  buffering requires 9,830,400 bits. A single frame would consume nearly all the
  device's BRAM before accounting for weights, FIFOs, and line buffers. I therefore
  plan to use DDR for frame storage.
- **Intermediate data.** Use line buffers to retain the rows needed by a convolution
  rather than storing every intermediate frame on chip. Whether a fully streamed
  pipeline is practical depends on the selected network, channel counts, and
  buffering requirements.

## Focus of the Project

This project is an opportunity to study accelerator design through a complete video
system. The next step is to evaluate the network and buffering scheme, then measure
resource use, DDR traffic, and frame rate after integration.
