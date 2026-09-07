/* ==========================================================================
   animations.js — loading sequence, counters, gauges, scroll reveals,
   HUD telemetry, speed lines, hero car parallax
   ========================================================================== */

(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     LOADING SCREEN — "ENGINE STARTING..."
  ------------------------------------------------------------------ */
  function initLoadingScreen() {
    const screen = document.getElementById("loading-screen");
    const barFill = document.getElementById("loading-bar-fill");
    const pctLabel = document.getElementById("loading-pct");
    const statusLabel = document.getElementById("loading-status");
    const car = document.getElementById("loading-car");
    if (!screen) return;

    // Build RPM bars
    const rpmBars = document.getElementById("rpm-bars");
    if (rpmBars) {
      for (let i = 0; i < 8; i++) {
        const span = document.createElement("span");
        rpmBars.appendChild(span);
      }
    }

    let pct = 0;
    const duration = reducedMotion ? 300 : 1900;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      pct = Math.min(100, Math.round((elapsed / duration) * 100));
      barFill.style.width = pct + "%";
      pctLabel.textContent = pct + "%";
      if (car) car.style.left = pct + "%";

      if (pct < 40) statusLabel.innerHTML = "STATUS: <b>WARMING UP</b>";
      else if (pct < 80) statusLabel.innerHTML = "STATUS: <b>SYSTEMS CHECK</b>";
      else statusLabel.innerHTML = "STATUS: <b>READY</b>";

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          screen.classList.add("is-hidden");
          document.body.style.overflow = "";
        }, 250);
      }
    }
    document.body.style.overflow = "hidden";
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------
     HERO HUD — animated RPM / SPEED readouts
  ------------------------------------------------------------------ */
  function initHeroHud() {
    const rpmEl = document.getElementById("hud-rpm");
    const speedEl = document.getElementById("hud-speed");
    if (!rpmEl || !speedEl) return;

    if (reducedMotion) {
      rpmEl.textContent = "12,000";
      speedEl.innerHTML = "320<small>KM/H</small>";
      return;
    }

    let targetRpm = 12000;
    let targetSpeed = 320;
    let currentRpm = 0;
    let currentSpeed = 0;

    function animateUp() {
      currentRpm += (targetRpm - currentRpm) * 0.06;
      currentSpeed += (targetSpeed - currentSpeed) * 0.06;
      rpmEl.textContent = Math.round(currentRpm).toLocaleString();
      speedEl.innerHTML = Math.round(currentSpeed) + "<small>KM/H</small>";
      if (Math.abs(targetRpm - currentRpm) > 5) {
        requestAnimationFrame(animateUp);
      } else {
        // gentle idle fluctuation
        setInterval(() => {
          const jitterRpm = targetRpm + (Math.random() * 400 - 200);
          const jitterSpeed = targetSpeed + (Math.random() * 6 - 3);
          rpmEl.textContent = Math.round(jitterRpm).toLocaleString();
          speedEl.innerHTML = Math.round(jitterSpeed) + "<small>KM/H</small>";
        }, 1400);
      }
    }
    requestAnimationFrame(animateUp);
  }

  /* ------------------------------------------------------------------
     SPEED LINES — decorative moving lines in hero background
  ------------------------------------------------------------------ */
  function initSpeedLines() {
    const container = document.getElementById("speed-lines");
    if (!container || reducedMotion) return;
    const count = window.innerWidth < 700 ? 6 : 12;
    for (let i = 0; i < count; i++) {
      const line = document.createElement("div");
      line.className = "speed-line";
      line.style.top = Math.random() * 100 + "%";
      line.style.width = 60 + Math.random() * 160 + "px";
      line.style.animationDuration = 2.5 + Math.random() * 3 + "s";
      line.style.animationDelay = Math.random() * 4 + "s";
      container.appendChild(line);
    }
  }

  /* ------------------------------------------------------------------
     HERO CAR — mouse parallax
  ------------------------------------------------------------------ */
  function initCarParallax() {
    const car = document.getElementById("hero-car");
    const hero = document.getElementById("hero");
    if (!car || !hero || reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      car.style.transform = `translateY(calc(-50% + ${y * -14}px)) translateX(${x * -14}px) rotate(${x * 1.2}deg)`;
    });
    hero.addEventListener("mouseleave", () => {
      car.style.transform = "translateY(-50%)";
    });
  }

  /* ------------------------------------------------------------------
     SCROLL REVEAL — IntersectionObserver
  ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal, .about-stats");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((t) => io.observe(t));
  }

  /* ------------------------------------------------------------------
     ANIMATED COUNTERS — about stats
  ------------------------------------------------------------------ */
  function initCounters() {
    const stats = document.querySelectorAll(".about-stat");
    if (stats.length === 0) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute("data-count"), 10) || 0;
      const counterEl = el.querySelector(".counter");
      if (!counterEl) return;
      if (reducedMotion) {
        counterEl.textContent = target.toLocaleString();
        return;
      }
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        counterEl.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      stats.forEach(animateCounter);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    stats.forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------------
     TELEMETRY GAUGES — circular skill gauges
  ------------------------------------------------------------------ */
  function initGauges() {
    const gauges = document.querySelectorAll(".gauge");
    if (gauges.length === 0) return;
    const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

    const activate = (gauge) => {
      const value = parseInt(gauge.getAttribute("data-value"), 10) || 0;
      const fill = gauge.querySelector(".gauge-fill");
      if (!fill) return;
      const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;
      fill.style.strokeDasharray = CIRCUMFERENCE;
      fill.style.strokeDashoffset = CIRCUMFERENCE;
      requestAnimationFrame(() => {
        fill.style.strokeDashoffset = offset;
      });
    };

    if (!("IntersectionObserver" in window)) {
      gauges.forEach(activate);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    gauges.forEach((g) => io.observe(g));
  }

  /* ------------------------------------------------------------------
     RACE TIMELINE FILL — progress line tied to scroll position
  ------------------------------------------------------------------ */
  function initRaceTimeline() {
    const fill = document.getElementById("race-timeline-fill");
    const timeline = document.querySelector(".race-timeline");
    if (!fill || !timeline) return;

    function update() {
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(Math.max(viewportH * 0.75 - rect.top, 0), total);
      const pct = total > 0 ? (visible / total) * 100 : 0;
      fill.style.height = pct + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------
     INIT
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initLoadingScreen();
    initHeroHud();
    initSpeedLines();
    initCarParallax();
    initScrollReveal();
    initCounters();
    initGauges();
    initRaceTimeline();
  });
})();