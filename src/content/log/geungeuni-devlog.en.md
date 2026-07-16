---
title: When to Fold, When to Extend — Building Geun-geun-i
date: 2026-07-16
summary: A robot that pumps a swing on its own. From version 1 to 8, a hunt for a faster sensor.
tags: robots, devlog
---

How does a swing climb higher on its own? Geun-geun-i, a swing-riding robot, started from that question. Just as a person grows the amplitude by bending and straightening their knees at the swing's ends, the robot had to fold and extend at the right moment. The hard part was always *when*.

Version 1 was a rushed build from a science kit, and the friction was terrible. For version 2 I scavenged whatever was around — the science kit, drink bottles — rebuilt it, and timed the folding and extending by measuring the period through trial and error. Version 3 was too small to reach much amplitude, so I scaled the body up with aluminum profiles and acrylic.

That's where I hit a wall. Within one swing cycle, the timing came down to milliseconds, and matching that by hand was impossible. So I switched direction and moved to sensing position. A distance sensor (version 4) lacked resolution, and controlling attitude with an IMU (version 5) was finicky. Reading a color change with an IR sensor (version 6) helped a little, but the distance kept shifting and measurements failed constantly.

For version 7 I marked reference points with stickers and analyzed the center-of-mass shift in Tracker to dig into the cause — that's also when I confirmed the swinging strategy changes with where the center of mass sits. In the final version 8, linking a gate sensor to a rod locked onto a fixed position reliably, even when the plate wobbled. The whole journey from version 1 to 8, chasing a faster sensor, came together right there.

Looking back, Geun-geun-i was the process of reaching for a better sensor, and nothing else. It won the Prime Minister's Award at the 67th National Science Exhibition.

![Geun-geun-i](/works/geungeuni/hero.webp)
