---
title: "Sophomore Fall — Course Notes"
date: 2025-01-15
description: "What I took, how each course went, and which lectures were worth watching."
weight: 1
---

This piece mainly records how I studied in the Microelectronics major, starting from my sophomore year, at a Project 985 university in China (Project 985 is a Chinese government designation for the country's leading universities). It's for my own future reference, and other students are welcome to learn from it too. Suggestions for improvement are also welcome.

I've left the grades out. My grades were only average anyway 😂. And some of the advice might be wrong, so read it critically.

An update on the note about grades.

### Sophomore Fall (大二上)

In my sophomore fall I took 5 major courses: 3 were offered by my own college, and 2 were ones I enrolled in early from other colleges.

### Circuit Analysis (电路分析)

This course is fairly easy. At the start it covers a few circuit-analysis methods — nodal analysis and mesh analysis (loop analysis), which are the fairly important ones — and then Thevenin's and Norton's theorems, which are the most important of all. Next comes sinusoidal steady state: the source stops being DC and becomes AC; you just need to remember the two formulas for inductors and capacitors. It's still solving circuits — first-order and second-order circuits, which correspond to first-order and second-order differential equations. For the exams you'll have to memorize the formulas for these two, because deriving them on the spot wastes too much time — you'd be solving second-order non-homogeneous differential equations. Finally there's three-phase power and transfer functions; the calculations are all pretty simple. But you might not really get what a transfer function is for while you're studying circuits — once you take Analog Electronics (模电), it'll gradually become clear.

**About the grade:** No midterm. Every class we do an attendance check-in on Xuexitong (学习通, a class-management app used by Chinese universities), and this participation score is almost entirely determined by those check-ins — so don't skip class! Homework is graded quite loosely, everyone gets 90+, but it counts for a very small part of the participation score.

### Mathematical Methods in Physics (数学物理方法)

The final exam for this course was fairly easy, so it's easy to get a high score. I feel like I didn't learn much during the semester; in the end I figured things out by watching online lectures before the final. It's mainly two parts: complex functions and the equations of mathematical physics. For the complex functions part I recommend this uploader's video, "Complex Functions (Crash-Course Edition) — Complex Numbers and Their Operations" (【复变函数(速成版)---复数及其运算】):

https://www.bilibili.com/video/BV19M4y1L7hd

Watch all of his videos plus read the textbook, and you should be fine.

For the mathematical physics equations part, you can watch Shangda Laojiang's (上大老姜) — I don't think there's anyone more concise than him. To be honest, I still haven't understood some of the mathematical physics equations part, because I crammed right before the final and memorized the big problems. First there's separation of variables, which I do understand; then the solutions of the Laplace equation in cylindrical and spherical coordinates — I never figured out how some of those are solved, and I really had no time to look anyway.

Here I'd suggest reading Liang Kunmiao's textbook; I don't really like the one from Lanzhou University.

**Edit:** Some of the things in this course are quite useful — they directly matter for later physics courses. For example, the associated Legendre equation shows up in quantum mechanics, and the Fourier transform is very important in Signals and Systems (信号与系统). I'd suggest learning this course well on the first pass, so you don't have to relearn it from scratch when you need it later.

**About the grade:** I heard the instructor for this course has changed, so the rules may be different now too.

### Quantum Mechanics (量子力学)

I really did not understand this course. We used Qian Bochu's textbook, and I simply could not understand that book — I couldn't figure out how he derived anything, and I didn't understand what the formulas meant. First I read Griffiths, then Landau's, and I barely understood a little. And then, because I was taking way too many courses that semester, I had no time to watch other online lectures, so I guess my quantum mechanics came out half-baked.

I don't know if it's a matter of a shift in mindset. The teacher said that in quantum mechanics you first have to accept its formulas and concepts, and only then think about proving anything. After hearing that, I felt studying got a bit easier.

**Edit:** I'd suggest watching Lanlan de Buziliangli (兰兰的不自量力) + Griffiths; I wouldn't particularly recommend justchan. Pay more attention to understanding — don't memorize by rote.

"[Lanlan de Buziliangli] Quantum Mechanics Postgraduate-Entrance-Exam Teaching Video 01: Study Experience Sharing, Wave Functions and the Schrödinger Equation, Normalization" (【【兰兰的不自量力】量子力学考研教学视频01：学习经验分享、波函数与薛定谔方程、归一化】)

https://www.bilibili.com/video/BV1uV41167vv

In the courses that follow — solid state physics, semiconductor physics — quantum mechanics runs through all of it; it's the key to whether you can do well. The hydrogen atom, spin, and angular momentum in quantum mechanics are all extremely important. If you don't learn this well, you'll have a very painful time later with solid state physics and semiconductor physics. I personally had a terribly painful time with solid state physics!!! Lay a solid foundation, and if you didn't get it, hurry up and catch up over the break — this is straight from the bottom of my heart.

**About the grade:** Same as before — don't skip class, don't skip class, don't skip class!!! The participation points you lose for skipping class really hurt. Hand in your homework on time.

### Signals and Systems (信号与系统)

The grade for this course isn't out yet. The exam wasn't too hard. One exam question was about the principles of multiplexing in 5G — I hadn't read that section, so I probably lost those 5 points. I took this course along with the School of Information (信息院). Honestly, this course feels to me like it's just Fourier transforms, Laplace transforms, and Z-transforms. I can only do the calculations and the problems, but I'm not clear on what these transforms are actually doing, or why a time-domain signal should be transformed into a frequency-domain signal — I never got it. Basically, I don't understand what this has to do with circuits, or how to apply it.