/* ==========================================================================
   main.js — navigation, mobile menu, custom cursor,
   scroll progress bar, contact form validation
   (multi-page site: each page marks its own active nav link in HTML)
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initStickyNav();
    initMobileMenu();
    initSmoothScroll();
    initNavIndicator();
    initScrollProgress();
    initCustomCursor();
    initContactForm();
  });

  /* ------------------------------------------------------------------
     Sticky navbar background on scroll
  ------------------------------------------------------------------ */
  function initStickyNav() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    function update() {
      navbar.classList.toggle("is-scrolled", window.scrollY > 30);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     Mobile hamburger menu
  ------------------------------------------------------------------ */
  function initMobileMenu() {
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    function closeMenu() {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-active");
    }

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.classList.toggle("is-active", isOpen);
    });

    links.querySelectorAll(".nav-link").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     Smooth scroll for in-page anchors (works with data-scroll & nav-links)
  ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const navH = document.getElementById("navbar")?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH + 1;
        window.scrollTo({ top, behavior: "smooth" });
        history.pushState(null, "", id);
      });
    });
  }

  /* ------------------------------------------------------------------
     Nav indicator — each page marks its own nav-link as "active" in
     HTML directly (multi-page site, no scroll-spy needed). This just
     positions the little underline beneath whichever link that is.
  ------------------------------------------------------------------ */
  function initNavIndicator() {
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const indicator = document.getElementById("nav-indicator");
    if (navLinks.length === 0 || !indicator) return;

    function moveIndicator() {
      const current = navLinks.find((l) => l.classList.contains("active")) || navLinks[0];
      indicator.style.width = current.offsetWidth + "px";
      indicator.style.left = current.offsetLeft + "px";
    }

    moveIndicator();
    window.addEventListener("resize", moveIndicator);
    window.addEventListener("load", moveIndicator);
  }

  /* ------------------------------------------------------------------
     Scroll progress bar
  ------------------------------------------------------------------ */
  function initScrollProgress() {
    const fill = document.getElementById("scroll-progress-fill");
    const car = document.getElementById("scroll-progress-car");
    if (!fill) return;
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      fill.style.width = pct + "%";
      if (car) car.style.left = pct + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------
     Custom cursor (desktop, fine pointer only)
  ------------------------------------------------------------------ */
  function initCustomCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      ringX = e.clientX;
      ringY = e.clientY;
    });

    function animateRing() {
      const currentLeft = parseFloat(ring.style.left) || ringX;
      const currentTop = parseFloat(ring.style.top) || ringY;
      const nextLeft = currentLeft + (ringX - currentLeft) * 0.18;
      const nextTop = currentTop + (ringY - currentTop) * 0.18;
      ring.style.left = nextLeft + "px";
      ring.style.top = nextTop + "px";
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    const interactiveSelectors = "a, button, .garage-card, input, textarea";
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  /* ------------------------------------------------------------------
     Contact form — validated, then submitted to Formspree
     (https://formspree.io). This is a static site with no backend of
     its own, so Formspree's hosted endpoint receives the POST and
     forwards it straight to the inbox below — no server to run or
     maintain.

     SETUP (one-time, ~2 minutes):
       1. Go to https://formspree.io and sign up free (no card needed).
       2. Create a new form, set its notification email to
          arpit21.work@gmail.com, and copy the form ID it gives you
          (looks like "xnnqzpke").
       3. Paste that ID into FORMSPREE_FORM_ID below.
     Free tier covers 50 submissions/month, which is plenty for a
     portfolio contact form.
  ------------------------------------------------------------------ */
  const FORMSPREE_FORM_ID = "xljrqvqz"; // ← your real Formspree form ID

  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const statusEl = document.getElementById("form-status");

    const fields = {
      name: { input: document.getElementById("cf-name"), error: document.getElementById("err-name") },
      email: { input: document.getElementById("cf-email"), error: document.getElementById("err-email") },
      message: { input: document.getElementById("cf-message"), error: document.getElementById("err-message") },
    };

    function validateField(key) {
      const { input, error } = fields[key];
      const wrapper = input.closest(".form-field");
      let message = "";

      if (input.value.trim() === "") {
        message = "This field is required.";
      } else if (key === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value.trim())) message = "Enter a valid email address.";
      } else if (key === "name" && input.value.trim().length < 2) {
        message = "Enter your full name.";
      } else if (key === "message" && input.value.trim().length < 10) {
        message = "Message should be at least 10 characters.";
      }

      error.textContent = message;
      wrapper.classList.toggle("has-error", Boolean(message));
      return message === "";
    }

    Object.keys(fields).forEach((key) => {
      fields[key].input.addEventListener("blur", () => validateField(key));
      fields[key].input.addEventListener("input", () => {
        if (fields[key].input.closest(".form-field").classList.contains("has-error")) {
          validateField(key);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map(validateField);
      const allValid = results.every(Boolean);

      if (!allValid) {
        statusEl.textContent = "";
        return;
      }

      if (!FORMSPREE_FORM_ID || FORMSPREE_FORM_ID === "YOUR_FORM_ID") {
        statusEl.style.color = "var(--c-red-text)";
        statusEl.textContent = "Form isn't wired up yet — set FORMSPREE_FORM_ID in js/main.js.";
        return;
      }

      const submitBtn = form.querySelector(".form-submit");
      submitBtn.disabled = true;
      statusEl.style.color = "";
      statusEl.textContent = "TRANSMITTING…";

      try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        if (response.ok) {
          statusEl.style.color = "";
          statusEl.textContent = "Message received. I'll be in touch soon.";
          form.reset();
        } else {
          const data = await response.json().catch(() => null);
          const detail = data?.errors?.[0]?.message;
          statusEl.style.color = "var(--c-red-text)";
          statusEl.textContent = detail
            ? `Couldn't send: ${detail}`
            : "Something went wrong sending that. Please try again or email me directly.";
        }
      } catch (err) {
        console.error("Contact form submit failed:", err);
        statusEl.style.color = "var(--c-red-text)";
        statusEl.textContent =
          "Couldn't reach Formspree (" + err.message + "). If you have an ad blocker or privacy extension, " +
          "try disabling it for this site, then try again — or email me directly.";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();