---
title: "Sophomore Spring — Course Notes"
date: 2025-07-15
description: "Analog circuits, electromagnetics, solid state physics, and computer organisation — plus what went wrong with how I was studying."
weight: 2
---

I feel like my state was even a bit worse this semester than last one. It's strange — I always can't keep up with the pace, and I don't know why. This semester I took four major-specific courses: Computer Organization, Engineering Electromagnetics, Solid State Physics, and Analog Circuits. Overall, it should have been a bit easier than last semester. Why did I still feel like I couldn't keep up? I thought about it a bit. First, probably at the very start of the semester, for certain reasons, I spent over a month studying analog integrated circuits, plus digital circuits (this one was mainly to prepare for Computer Organization). That made me fall behind in some of my major courses. Second, because I thought I'd already studied everything once before, I assumed I could get by without listening in class — but honestly, I hadn't really learned it well. There's a big gap between studying without doing problems and studying with practice. I thought I'd understood things, but I actually hadn't. A lot of material only clicks when you actually do the problems — that's when you realize how a given topic gets tested, what the key points are, and what you're supposed to master. The second reason is that I couldn't follow the lectures — I don't know what the issue was exactly, I couldn't understand what the professor was saying in class, and meanwhile I like playing on my phone, so the result was a huge amount of time wasted in class. If I'd actually made good use of class time, the efficiency would have been much higher, and I wouldn't have had such a painful semester.

To sum up:

1. First, I should quit the phone. I don't know why, but once I'm holding my phone I just want to sneak a look — even when there's no message at all, I just want to look. I don't know why either. This really kills my efficiency.

2. Make good use of class time, try to keep up, don't get left behind — that just makes everything less efficient.

3. Try to sit in the front rows. Really. Don't think you can learn just as well from the back — from my own experience, sitting in front gets you slightly better grades. It's kind of magical.

Next, my impressions of each course.

Edit 2: Added the grade traps to avoid, and how to score high.

### 1. Analog Circuits

I'd suggest watching this up-loader's (Bilibili content creator's) videos:

【0 Course Overview (2024)】

https://www.bilibili.com/video/BV1rsHmemE3K

The explanations are genuinely good. One lecturer's style doesn't really suit me, I feel — I prefer slightly more detailed explanations, the kind that go through a few problems along the way. About the exams: both the midterm and the final pull their questions from his slides, so make sure you work through every one of them yourself! That includes the homework problems, the end-of-term review, and the regular lecture slides. He adds some extra-curricular problems to the homework that you can't find answers to, but he goes through them in class with slides — I suggest taking photos of those, because he won't necessarily post them. For the midterm I didn't look at the slides; I just worked through all the problems in the textbook myself, and ended up studying the wrong stuff and bombed the exam (考寄了 — internet slang, literally "the exam got mailed off"). But by the final I knew his tricks, so I did okay. I actually have to thank myself for nagging him into posting the solution slides for the later chapters' problems at the time.

About grades:

The participation-grade setup for this course is absolutely insane: participation 30, midterm 35, final 35. He calls roll basically every single class. If you miss one class and he catches you, your participation grade drops below 90. And if even one homework assignment doesn't get an A+, your participation grade drops below 81. His homework standards are extremely strict, so don't get careless! So for anyone who wants a high grade: do NOT skip class, do NOT skip class, do NOT skip class. Do your homework seriously, seriously, seriously!!!!! For every circuit diagram in your homework, use a ruler — neat formatting, with written explanations!!!!!!

The even crazier part: he only explains the detailed grade distribution on the very last class of the semester...........

### 2. Engineering Electromagnetics

This one was taught by our department vice-chair. He really teaches well, and he's a nice guy too — at least he really fits my taste. The front rows of his class are basically always full, which says something about how well he teaches. Anyway, this course is just: do problems, do problems, and do more problems. The textbook we used is a Chinese translation (Xi'an Jiaotong University's translation) of a foreign textbook. The first 8 chapters are electrostatics/magnetics content, which we'd basically all studied before — though the problem types are different. Only the last 4 chapters are new material: how electromagnetic waves propagate in conductors/dielectrics. That book is written to be easy to understand. The exam is entirely drawn from the end-of-chapter problems, so if you want a high grade, just do lots of problems.

About grades:

When you do the end-of-chapter problems, you'll find the numbers are genuinely painful to compute. But you must work through them with a calculator yourself — don't just copy the answers once and call it done. The exam will reuse the exact original problems. If you didn't actually compute it, it's not a 2-point deduction — it's a huge deduction. Real case from people around me at the final! Attendance ("sign-in"): occasionally there's a random paper sign-in during class, worth 10 points.

### 3. Solid State Physics

For this course, I suggest watching more of Fan Xiaolong's lectures. He has a companion "class recording" set and also a problem-walkthrough set. I'd suggest the problem walkthroughs — that part includes summaries of the key concepts, and the videos are shorter too. The key part is the energy bands. Just watch all of his problem walkthroughs and you'll definitely be fine on the exam.

Edit again: This course is built on quantum mechanics. If you didn't really understand quantum mechanics, you'll find Solid State Physics extremely painful. I'd suggest: if you didn't understand the band theory part, first read Chapter 1 of Semiconductor Physics and watch some videos — you'll understand it much better.

### 4. Computer Organization

Sigh, this is the one course where I genuinely feel I let my teammates down. The main theme of the course is building a CPU, and it's really hard — I felt I had no direction at all, and on top of that I'd never studied embedded systems before, so my contribution to the team was really small. That's why I plan to systematically learn FPGA over the summer, to make up for it. The labs are the bulk of this course, and they're pretty interesting — you could consider taking it. But before you do, go through digital circuits first. For this course, I recommend Wangdao's Computer Organization videos on Bilibili — watching his is enough.

About grades: basically nobody fails this course; the School of Information (信息院, "info school") courses all give out generous grades.

Update 2026.4.25

Recently I casually applied for Huawei's ("华子" — jokingly, a nickname for Huawei) summer internship, for an ASIC chip design position. I went into it just for fun, but it turned out I actually passed the written test, and the interview is right after May 1st, so I have to take it seriously now. An interview should logically involve a project you can show off — unfortunately I basically have none, crying — which is also because our major has almost no big course projects, sigh. Then it occurred to me: this course in the School of Information has a big project where you write a CPU in Verilog. If you do it well, it carries serious weight — even the Huawei recruiter recommended we try it. Unfortunately, back then I hadn't learned digital circuits and had no ability to write it at all. Now, if I want to put this project on my resume, I'll have to write it from scratch myself. After a week of hard grinding, I finally cranked out a decent CPU: a MIPS instruction set 5-stage pipelined CPU, implementing about 10 instructions, with data hazards and control hazards solved. Going forward I'll see if I can add exceptions and interrupts and a cache, and try running an OS. Let me share my study route with you all.

I watched this up-loader's videos the whole way through — they're really good. I suggest pausing and writing the code along with him. He does make some errors in the process, but the key is to absorb the way of thinking. Be patient, and lean on AI for help too. Following him, you can basically get a simple 5-stage pipeline written.

【Teach You to Write a Simple CPU (教你写一个简单的CPU)】

"Oops!" (error page) - bilibili.com — www.bilibili.com/video/BV1pK4y1C7es

The reference book is *Computer Organization and Design: The Hardware/Software Interface* (计算机组成与设计——软硬件接口).

If your foundations in Computer Organization aren't great, you can watch this video — it's very short but explains things well. The reference book is also *Computer Organization and Design: The Hardware/Software Interface*.

【[Strongly Recommended] Computer Organization in Simple Terms — from Taiwan — Well Worth Watching (【强烈推荐】深入浅出计算机组成原理 - 源自台湾 - 非常值得一看)】

https://www.bilibili.com/video/BV1554y1s7LS

The next one is also from Taiwan, and explains things in a bit more detail than the one above.

【[Computer Architecture] — Taiwan Tsing Hua University — Professor Huang Tingting (【计算机结构 Computer Architecture】-台湾清华大学-黄婷婷教授)】

"Oops!" (error page) - bilibili.com — www.bilibili.com/video/BV1r4411s7Hj?p=36

One very strong piece of advice here: at least before the second semester of junior year (大三下), you should have at least one project you can show off.