---
title: Why Don't Cats Get Hurt When They Fall? — Building Go-saeng-i
date: 2026-07-16
summary: A landing robot that began with one paper. Turning a falling cat into a machine.
tags: robots, devlog
---

Why don't cats get hurt when they fall? Go-saeng-i grew out of that old curiosity. A falling cat twists its tail and body in opposite directions mid-air to set up its landing. With angular momentum conserved, rotating one part of the body sends the rest turning the other way.

It began with a single IEEE paper. Reading "Research on Trajectory Planning of a Robot Inspired by Free-Falling Cat," I thought the same principle might give a delivery robot a stable landing. If a delivery robot dropping between floors is going to protect its cargo, the landing pose is what matters in the end.

Version 1 was a simple build just to check the wheels' effect. But it was so heavy that the fall itself barely worked — dropping a heavy object and making it change its own pose turned out to be a far more delicate problem than I expected. For version 2 I lightened it, fixed the data-transmission issue, and — to catch the moment of the fall — cycled through IR, gyro, and distance sensors before settling on an IMU. It detects the brief instant both wheels leave the ground and drives the pose I want. A fall is over in a blink; if the sensing lags even slightly, there's no time left to right itself. For version 3 I added a tail section to confirm its effect, and even glued on fur to make it look a little more like a real cat.

The research notebook holds all of that trial and error. I'd write down why something failed, write what to change next, and when it failed again I'd write the new note beside it.

![Go-saeng-i research notebook](/works/gosaengi/note-01.webp)

It was too much time to leave as just a number. Go-saeng-i was selected for the YSC 2023 showcase.

![Go-saeng-i](/works/gosaengi/hero.webp)
