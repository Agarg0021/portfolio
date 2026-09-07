# Arpit Garg — Portfolio

A premium, Formula 1 / motorsport-themed personal portfolio for an AI/ML engineer. Built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build step.

## 1. Overview

The site maps a career journey onto an F1 race weekend:

| Section | Race concept |
|---|---|
| Hero | Starting Grid |
| About | Driver Profile |
| Education | Driver Academy |
| Experience | Race History |
| Projects | Engineering Garage |
| Skills | Performance Telemetry |
| Achievements | Podium |
| Leadership | Team Radio / Pit Wall |
| Contact | Finish Line |

Signature elements: an "ENGINE STARTING…" loading sequence, an interactive SVG top-down F1 car with mouse parallax and glowing headlights, animated RPM/speed HUD readouts, a race-history timeline with a scroll-driven progress line, and circular "telemetry" skill gauges.

## 2. Technologies used

- **HTML5** — semantic markup, ARIA labels
- **CSS3** — custom properties (design tokens), grid/flex layout, keyframe animations, `prefers-reduced-motion` support
- **Vanilla JavaScript** — `IntersectionObserver` for scroll reveals/counters/gauges, `requestAnimationFrame` for smooth animation loops, no external libraries
- **Google Fonts** — Rajdhani (display), Inter (body), JetBrains Mono (telemetry/data)

## 3. Folder structure

```
portfolio/
│
├── index.html
├── css/
│   ├── style.css        # variables, reset, layout, components
│   └── animations.css   # keyframes and scroll-reveal states
├── js/
│   ├── main.js           # navigation, scroll spy, cursor, form validation
│   └── animations.js     # loading screen, counters, gauges, HUD, reveals
├── assets/
│   ├── images/
│   ├── icons/
│   └── resume/            # place your resume PDF here
└── README.md
```

## 4. How to run locally

No build tools or servers are required, but serving over HTTP avoids any
`file://` restrictions in some browsers:

```bash
# Option A — just open the file
open index.html          # macOS
start index.html         # Windows

# Option B — serve locally (recommended)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 5. How to update personal information

- **Name, role, tagline, stats, timelines, projects, skills, achievements** — edit the corresponding `<section>` in `index.html`. Every section is clearly commented with a numbered header (e.g. `<!-- 5. PROJECTS — ENGINEERING GARAGE -->`).
- **Colors** — edit the CSS custom properties at the top of `css/style.css` under `:root`.
- **Fonts** — swap the Google Fonts `<link>` in `index.html` and the `--f-display` / `--f-body` / `--f-mono` variables in `css/style.css`.

## 6. Where to add GitHub and LinkedIn links

In `index.html`, inside the **Contact — Finish Line** section:

```html
<a href="#" class="social-btn" aria-label="LinkedIn profile">LINKEDIN</a>
<a href="#" class="social-btn" aria-label="GitHub profile">GITHUB</a>
```

Replace the `#` placeholders with your real profile URLs. The same pattern (`href="#"`) is used for each project's **GITHUB** / **LIVE DEMO** buttons inside the **Projects — Engineering Garage** section — update those with your repository and deployment links as they become available.

## 7. Where to add the resume PDF

Place your resume file at:

```
assets/resume/Arpit_Garg_Resume.pdf
```

The **DOWNLOAD RESUME** button in the hero section already points to this path via `download` attribute — no code changes needed once the file is in place. If you use a different filename, update the `href` on that button in `index.html`.

## 8. Contact form — connecting it to your inbox

This is a static site (no server), so the contact form is wired to **[Formspree](https://formspree.io)** — a hosted form endpoint that receives the submission and forwards it straight to your email. No backend to build or host.

**Setup (about 2 minutes, free):**

1. Go to [formspree.io](https://formspree.io) and sign up (no credit card required).
2. Create a new form and set its notification email to your address.
3. Formspree gives you a form ID (a short string like `xnnqzpke`).
4. Open `js/main.js`, find this line near the top of `initContactForm()`:
   ```js
   const FORMSPREE_FORM_ID = "YOUR_FORM_ID";
   ```
   and replace `"YOUR_FORM_ID"` with your real ID.
5. Save, reload the page, and submit a test message — you should receive it by email within a few seconds.

The free tier covers 50 submissions/month, which is more than enough for a portfolio. Until you set the real ID, the form will validate normally but show a clear "not wired up yet" message on submit instead of failing silently.

If you'd rather use a different service (e.g. [EmailJS](https://www.emailjs.com)), swap the `fetch()` call inside the `submit` event listener in `js/main.js` for that service's send call — the validation logic above it doesn't need to change.

## 9. How to deploy using GitHub Pages

1. Push this `portfolio/` folder to a GitHub repository (the `index.html` should be at the repo root, or in a `docs/` folder).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch".
4. Choose the branch (e.g. `main`) and the root (`/` or `/docs`), then save.
5. GitHub will publish the site at `https://<username>.github.io/<repository-name>/` within a few minutes.

## Accessibility & performance notes

- Semantic landmarks (`header`, `main`, `nav`, `section`, `footer`) and ARIA labels throughout.
- Visible focus states on all interactive elements.
- `prefers-reduced-motion` disables non-essential animation.
- Scroll-triggered effects use `IntersectionObserver` (not scroll-bound layout thrashing).
- No external JS libraries; fonts are the only external network request.