<<<<<<< HEAD
# Velusamy Construction Pvt Ltd — Dynamic Site

A dark, glassmorphism, single-page site for Velusamy Construction Pvt Ltd
(anti-gravity / cantilever / modern structural architecture), served
dynamically by an Express + EJS backend so content (phone, email, stats,
copyright year) is rendered server-side from one data object, and the
contact form posts to a real API route instead of a static `mailto:`.

## Folder structure

```
velusamy-construction/
├── server.js                 # Express app entry point — starts the server, mounts routes
├── package.json               # Dependencies + npm scripts (start, dev)
├── .env.example                # Copy to .env and fill in SMTP creds for the contact form
├── routes/
│   └── contact.js             # POST /api/contact — validates + emails enquiries (nodemailer)
├── views/
│   └── index.ejs              # The single page, rendered server-side with site data
└── public/                    # Static assets served directly by Express
    ├── css/
    │   └── style.css          # All styling — custom properties, dark theme, glass, motion
    ├── js/
    │   └── main.js            # Nav toggle, scroll reveals, counters, lightbox, video, form fetch
    ├── images/
    │   ├── hero-poster.jpg               # Hero <video> poster frame
    │   ├── portfolio-01-villa-twilight.jpg
    │   ├── portfolio-02-living-room.jpg
    │   └── portfolio-03-kitchen.jpg
    └── videos/
        ├── hero-ambient-blueprint.mp4        # Full-bleed ambient hero background loop
        ├── showcase-structural-timelapse.mp4 # "Video Showcase 1" — structural/project timelapse
        └── showcase-process-testimonial.mp4  # "Video Showcase 2" — placeholder, see below
```

## Run it locally

```bash
npm install
cp .env.example .env      # optional — only needed to actually send contact-form emails
npm start                 # http://localhost:3000
```

For auto-reload during development: `npm run dev` (uses nodemon).

## Where site content lives

Company name, founder, phone, email, Instagram handle, and the four hero
stats are all defined once in the `siteData` object at the top of
`server.js` and passed into `views/index.ejs`. Edit that object to update
them everywhere on the site (nav, hero CTA, footer, contact cards) at once.

## Placeholder media to replace before launch

A few assets are marked inline with `<!-- PLACEHOLDER -->` comments and
reuse the supplied villa/interior photography and blueprint clip as
stand-ins:

- **4th portfolio image** (`views/index.ejs`, Portfolio Gallery) — currently
  a dashed "Add project image" tile. Replace with a real photo + real
  `data-full` path.
- **Founder portrait** (`views/index.ejs`, Founder Section) — currently a
  glowing "V" monogram. Drop a real portrait at
  `public/images/founder-portrait.jpg` and swap the markup for an `<img>`.
- **Video Showcase 2** (`public/videos/showcase-process-testimonial.mp4`) —
  currently reuses the blueprint ambient clip. Replace with a real client
  testimonial or process walkthrough video of the same filename (or update
  the `<source>` path in `views/index.ejs`).

## Contact form → email

`routes/contact.js` validates the submission and, if `SMTP_HOST` /
`SMTP_USER` / `SMTP_PASS` are set in `.env`, emails it to
`CONTACT_TO_EMAIL` (defaults to velusamyconstructionpvt@gmail.com) via
nodemailer. Without SMTP configured it still works locally — it logs the
enquiry to the server console instead of sending mail, so the front-end
flow can be tested without real credentials.

## Accessibility & motion

- All interactive elements are keyboard-reachable with visible focus rings.
- `prefers-reduced-motion: reduce` disables scroll reveals, levitation
  keyframes, and the scroll-indicator animation, showing final states
  immediately.
- Images use descriptive `alt` text; the lightbox traps focus on its close
  button when opened and restores focus to the trigger on close.
=======
# Velusamy_construction
To build your dream into reality. Makes with quality and comfort
>>>>>>> 54b26729a6eb302fc06dfa3ed83719ee0cfd6ce8
# Velusamy_construction
