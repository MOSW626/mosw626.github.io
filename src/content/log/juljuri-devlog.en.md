---
title: Does Leaning Back Really Win a Tug-of-War? — Building Jul-jul-i
date: 2026-07-16
summary: One question, ten robots. The story of Jul-jul-i, the tug-of-war robot that won the Presidential Prize.
tags: robots, devlog
---

"In a tug-of-war, does leaning back really help you win?" That single question, which I asked in my second year, ended up costing me ten robots.

Winning a tug-of-war comes down to using the rope to drag your opponent toward you. Being heavier obviously helps — but if both sides weigh the same, what decides it? To find out, I started by drawing a free-body diagram of a person pulling the rope. Once I laid out tension, weight, normal force, and friction and set up both the force balance and the torque balance, the picture came into focus: the more you lean, the smaller the normal force on the ground, and the smaller the torque. Solving the two balance equations together even gave me an optimal angle — at θ = arctan(l/μL), friction and tension reach their maximum.

The theory alone felt incomplete. Watching training footage of national tug-of-war athletes, I caught a caption: "the step where you drop your hips and put your weight down." A static optimal angle would leave two matched teams deadlocked, but that was the hint — a recoil that lifts and lowers the center of mass briefly produces a larger normal force.

Getting that into a robot was the real work. Holding the rope while leaning, it had to move forward when its body tipped up and back when it tipped down to keep the angle — and simple on/off control was nowhere near enough. In the end I built a tug-of-war robot that could hold any angle with PID control, and reproduced the vertical recoil with code that varied the angle over time.

From version 0 to version 10, a prototype that couldn't even stay upright became a final build that ran experiments on a battery, no power cord. Along the way, the Segye Ilbo covered our work under the headline "The tug-of-war tactic from Squid Game has a scientific basis." That "lie back" line from the show turned out to be physics — proven with a single robot.

![Jul-jul-i](/works/juljuri/hero.webp)
