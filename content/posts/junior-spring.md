---
title: "Junior Spring — Course Notes"
date: 2026-07-15
description: "Integrated circuit analysis and design, semiconductor devices — and an internship hunt that changed what I thought mattered."
weight: 4
---

Happy news — I've now finished all the courses my four-year degree requires. Senior year is theoretically free of classes, apart from the graduation project, which is also great.

Now let me talk about how the courses went in junior spring (大三下). Overall, junior spring felt really messy — the biggest reason being that I tried to find an internship and spent a lot of energy on projects, so I got a bit lazy with classwork.

### The Overall Situation of Junior Spring

First of all, I spent about 45 days of the winter break studying for IELTS, and the moment the score came out — 6.0. gg. So I'll have to keep studying IELTS through the summer and next semester, aiming for a 7.0; the minimum requirement is 6.5, otherwise I have no school to go to. This also meant that over the winter break I studied almost nothing for my major besides English. Then, from the start of the semester until the end of March, I submitted my application for the German APS exam (APS = Akademische Prüfstelle, the academic qualification review for studying in Germany). Even though looking back after the exam it seems like nothing hard, you still have to prepare seriously — if you fail it, it's not worth it — so I roughly reviewed all my major courses from freshman through junior year. In April, Huawei came to our school to give an internship info session (宣讲), and only then did I learn that summer internships have to be applied for back in March–April. Sigh — Huawei is the only company that comes to our school for internship sessions. The information gap between us and other schools really is huge, especially for someone like me who'd never considered a summer internship before — I didn't even know when applications open. I saw that at my high school classmates' schools, companies like Hisense, Xiaomi, and ByteDance all come to campus to recruit interns. Sigh — enough said, I missed a lot of opportunities. And I feel like the students around here aren't very tuned in to employment... it seems like nobody's even thinking about it?

In early April I applied for the Huawei internship — I went for an ASIC chip design position, i.e., physical backend (物理后端). Why that one? I was applying with a "just give it a try" attitude: that position's computer-based written test (机考) covered semiconductor physics, and when I looked at the other positions, I hadn't studied any of what they required, so I just applied for this one at random. To my surprise, I passed the written test and got an interview. And that's when I realized my resume was completely empty — I had no project worth showing at all. My old mindset was: learn the course material well, learn your major courses well; projects and competitions aren't necessary. On top of that, the curriculum here doesn't include much hands-on work — unless you go out and do competitions yourself, there's little practical work in any course (here I mean IC-related projects like FPGA, using EDA tools like Cadence — microcontrollers don't count). If you want resources, it's either competitions or working with a professor; I'd recommend the former. Under that mindset, I just obediently studied the textbooks — the major courses alone were already more than enough to keep me busy, and I truly had neither the energy nor the awareness of how important hands-on ability is! I think this is something worth everyone realizing!

Back to the Huawei interview: because in sophomore year I took a Computer Organization course from the School of Information Science and Engineering, whose course project was to write a CPU, I decided to write one myself as my project experience. It took me about 20-something days, from mid-April all the way to early May, almost whole days immersed in writing that project, and I finally finished it before the interview. The result: I passed the first round, but failed the second-round manager interview (二面主管面). He asked me about digital integrated circuits, but I hadn't been studying my major courses during those days, so I couldn't answer — I guess that's why he rejected me. It was around May 10 then; the stone in my heart could finally land, and I could go seriously catch up on the major courses I'd fallen behind on. Although there were a few scattered internship interviews at other companies afterwards, not many of those went through either; in the end H3C (新华三) gave me a hardware internship offer, which I felt had little to do with ICs, so I turned it down.

The following are some of the major courses I took this semester:

### Analysis and Design of Integrated Circuits (集成电路分析与设计)

This course puts digital integrated circuits and analog integrated circuits into a single course — digital for the first big half of the semester, then analog for the last short stretch. Only a bit under a month and a half was spent on analog, and analog went all the way up to Chapter 8 (Feedback) — Chapter 7 (Noise) wasn't taught — so you can imagine how badly I learned it. So I strongly suggest — especially for those aiming for 外保 (going the 保研 route, i.e. getting recommended for grad school at another university without sitting the entrance exam) — that you start studying analog ICs over the winter break, and by the end of the semester ideally finish the first 10 chapters, to be ready for the summer camp (夏令营) interviews. (Summer camps = the summer programs Chinese universities run to screen prospective graduate students.)

For digital circuits we used Rabaey's Digital Integrated Circuits: A Circuits and Systems Perspective (数字集成电路——电路、系统与设计). The class goes up to Chapter 6, "Designing Combinational Logic Gates in CMOS," but I'd suggest — if you want to go into digital — learning up to Chapter 7, "Designing Sequential Logic Circuits." The teacher rushes and skips some chapters, but I'd suggest not skipping them. For an online course, follow this Xidian (西电) one.

【【西电】数字集成电路-哔哩哔哩】 ([Xidian University] Digital Integrated Circuits, on Bilibili) — this covers Chapters 1–5:

https://b23.tv/K0CUbVr

【【数字集成电路设计】西电，李娅妮，靳刚，【数集】-哔哩哔哩】 (Digital Integrated Circuit Design, Xidian — Li Yani, Jin Gang, on Bilibili) — this covers Chapters 6–7:

https://b23.tv/nXJxELK

For final-exam review you can take a look at this:

【【西电】数字集成电路设计复习-哔哩哔哩】 ([Xidian University] Digital Integrated Circuit Design Review, on Bilibili)

https://b23.tv/kPCcjxN

Note: this one shares the Xidian digital IC PPTs — the same slides are used across the two above.

And for digital ICs, same old thing: just reading the book is useless. I recommend doing some competitions and writing Verilog. The most important thing there is timing issues — if you truly understand timing, your Verilog will be fine.

After the digital part is done, there's a midterm exam; its weight isn't big, and it's not hard.

Then comes analog ICs. Our textbook is Razavi's. As I said, this book only got about a month and a half — honestly, nowhere near enough; it's basically gulping it down in one pass — so I still suggest studying it in advance. Class covers the first six chapters, i.e. up to frequency response, plus Chapter 8 (Feedback); feedback is barely tested, so if you're short on time, get the first 6 chapters solid. I recommend watching XJTU's Zhang Hong online course — watch it slowly, and ask AI when you don't get something.

【【西安交通大学】集成电路设计 模拟CMOS XJTU_张鸿教授（对应Razavi 1-10章）】 ([Xi'an Jiaotong University] Integrated Circuit Design: Analog CMOS, Prof. Zhang Hong — covering Razavi Chapters 1–10)

https://www.bilibili.com/video/BV1SK4y1N7wN

The final exam tests a small portion of digital content plus mostly analog content — moderate difficulty. I'd suggest finding past exam papers to practice; the grading is decent — they'll pull you up (会捞的).

### Semiconductor Devices (半导体器件)

This course's final isn't hard — no calculation problems, all conceptual questions — and the grading is pretty good. We used Streetman's Solid State Electronic Devices (固态电子器件); the book is actually quite well written, plain and easy to understand. Class goes up to Chapter 7, bipolar junction transistors (BJT); the first 5 chapters are basically semiconductor physics, so there are really only two chapters of genuinely new material. My suggestion is to learn this course well — MOS transistors and BJTs are both very important knowledge; whether you go into design or devices in the future, you'll need this material. I recommend this Xidian video.

This one you can watch up to MIS:

【半导体物理 西安电子科技大学 柴常春等主讲（全部补齐！）】 (Semiconductor Physics, Xidian University, taught by Chai Changchun et al. — all lectures completed!)

https://www.bilibili.com/video/BV1Ce4y1K7fv

This one corresponds to the BJT chapter:

【【公开课】半导体器件物理I - 西安电子科技大学（半导体物理与器件）】 (Open Course: Semiconductor Device Physics I — Xidian University, Semiconductor Physics and Devices)

https://www.bilibili.com/video/BV1WJ411x7Ru

This one corresponds to the MOS chapter:

【【公开课】半导体器件物理II - 西安电子科技大学微电子学院】 (Open Course: Semiconductor Device Physics II — Xidian University, School of Microelectronics)

https://www.bilibili.com/video/BV1Tc411h7JX

Turns out Xidian's courses really are good — in the IC field, a lot of what people watch is their courses.

### Principles of Automatic Control (自动控制原理)

This course is run by the School of Information Science and Engineering, aimed at electronic information students. If you want to work on analog in the future, I strongly suggest picking this course; it's mainly about feedback, and feedback is also extremely important in analog. I'd recommend the section taught by the School of Information — the teaching was good, and grading is reasonable. The one thing to note: this course's final exam time may clash with our physics school's major-course exams — that's what happened to me, and in the end I could only take a deferred exam (缓考).

### Some Filler Courses (水课)

There are also a few FPGA-oriented electives — FPGA Implementation of Digital SoC Systems (数字SoC系统的FPGA实现), Advanced FPGA-Based Application Development (基于FPGA的高级应用开发), and Complex Digital Integrated Circuit Design (复杂数字集成电路设计). The workload is light, and for those the learning really comes down to what you do yourself outside class.

### Power Electronics (电力电子技术)

Nothing much — there are occasional sign-ins; no final exam; the grading isn't high. At the end there's one PPT presentation.

### Professional Foreign Language (专业外语)

There's a sign-in every class; there's one English PPT presentation + quizzes + answering questions in class. The quizzes and the final are also very easy, and the grade is in the medium-to-upper range. I didn't answer many questions, so the grade wasn't that high.

### Computational Physics III (计算物理三)

The grading is very good, and there's almost nothing to do — some roll calls; just do the homework plus one PPT presentation. I'd recommend taking it.

### Some Thoughts (一些感受)

By junior spring, a lot of classmates have to face the choice of grad school entrance exam (考研) or employment. My personal suggestion is still to go the 考研 route: for the microelectronics major, an undergrad can do far too little. The starting point of a master's grad and an undergrad isn't even on the same level — for an undergrad who wants to do design and such, there's basically no hope; but even a Lanzhou University master's grad has a shot at going into design, pulling a 300k-yuan total package, and the career development is completely different. Going forward it'll only get more competitive — even fabs (chip fabrication plants) want master's grads now.

Also, the microelectronics track here leans theoretical — there aren't many hands-on opportunities built in, and you have to make up for that yourself. My suggestion: the earlier you learn digital circuits, the better; analog circuits can just follow the school's schedule, because now that I'm doing competitions, most of what I use is digital circuits — analog is used very little (not saying analog is unimportant). So finishing digital early gives you more opportunities to join competitions. On the school's schedule, digital circuits aren't finished until junior fall — think about it, that leaves you only junior spring for competitions. It's too late, you know.

Actually, doing competitions isn't mainly for bonus points — it's for learning to use EDA tools and Verilog and building up engineering ability. Digital IC front-end design mainly uses Verilog; we undergrads can build our Verilog skills through FPGA. I recommend checking out Wildfire's (野火) tutorials; you don't need to buy a development board, or just buy a cheap one — beginners don't need to run it on hardware, simulation is enough. For EDA I recommend Vivado — it's very beginner-friendly, the steps are simple; Quartus is more complicated.

【【野火】FPGA ZYNQ-7000系列FPGA Verilog开发实战指南，硬件基于野火皓月系列开发板】 (Wildfire — FPGA ZYNQ-7000 Series FPGA Verilog Development in Practice, hardware based on Wildfire's Haoyue-series development board)

https://www.bilibili.com/video/BV139tweXEzT

This is the one I watched back then — getting the UART (serial port, 串口) working is enough. The important thing in writing Verilog is timing; just get timing figured out. And you absolutely must write the code yourself — even though AI exists, relying only on AI won't build engineering ability, and you have to be fully on top of your debugging process.

Once you've mastered basic Verilog syntax, you can go do competitions. At that point I recommend using AI — let AI get you started and help you through the competition, and then you study what AI wrote and learn from it. Competitions include: the FPGA Competition (FPGA竞赛), the Integrated Circuit Innovation Competition (集创赛), the Fuwei Cup (复微杯), the Loongson Cup (龙芯杯), and so on.

From my personal view, to do digital front-end design, Computer Organization is very important — a lot of companies hiring digital front-end design require it. This course is also offered by the School of Information Science and Engineering in sophomore spring; you can read my earlier post for an introduction. If you have time, write a CPU in Verilog — it's very helpful for understanding how a computer runs overall and pipelined architecture. You can also join the Loongson Cup, which is also about writing a CPU; compared with other competitions, winning a national third prize isn't very hard — just making the finals gets you one. But starting this year, AI has gotten too strong — it can completely automate an entire project's development for you — so it's gotten very competitive, and the threshold has been completely lowered, so this will only get more competitive in the future. I recommend doing this competition in the summer between sophomore and junior year, because the competition is actually a bit hard, and the follow-up optimization is a real grind — you need at least a month to prepare.

The order I suggest: Digital Circuits ——》 Computer Organization ——》 Verilog / Competitions.

Digital you can absolutely self-learn and get into on your own. But analog is harder — a lot of it is passed on by word of mouth, so a mentor's guidance is very important. And I suggest that after finishing Razavi, build some circuits yourself and run some simulations. I'm still at the exploring stage in this area myself, so I can't give very good advice on analog either.