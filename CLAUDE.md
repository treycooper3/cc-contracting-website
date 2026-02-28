# C&C Contracting Website

## Overview
Professional website for **C&C Contracting LLC**, a licensed general contractor in Florida offering residential and commercial construction services.

## Tech Stack
- **HTML5** — Single-page application with vanilla JavaScript navigation
- **CSS3** — Custom properties (CSS variables) for dark/light mode theming
- **JavaScript** — Vanilla JS, no frameworks or dependencies
- **Fonts** — Montserrat (headers) + Inter (body) via Google Fonts
- **Form Integration** — n8n webhook (placeholder URL, needs configuration)

## File Structure
```
C&C Website/
├── index.html      # Main single-page site (Home, Services, Projects, Contact)
├── privacy.html    # Privacy policy
├── terms.html      # Terms & conditions
└── CLAUDE.md       # This file
```

## Brand Identity
- **Accent Color**: Steel Blue `#1976D2`
- **Dark Mode** (default): `#0D1117` body, `#161B22` cards
- **Light Mode**: `#F6F8FA` body, `#FFFFFF` cards
- **Typography**: Montserrat (headers, uppercase) + Inter (body)
- **Logo**: Text-based — "C&C" white + "Contracting" blue

## Pages (JS Navigation)
1. **Home** — Hero, stats bar, services preview, why choose us, testimonials, process timeline
2. **Services** — Residential, Commercial, Specialty (2-column layouts with images)
3. **Projects** — Gallery grid with hover overlays (Unsplash placeholder images)
4. **Contact** — Split layout: contact info + form with honeypot spam protection

## Form Integration
The contact form POSTs JSON to an n8n webhook. To configure:
1. Set up an n8n workflow with a webhook trigger
2. Replace `YOUR_N8N_INSTANCE` in the `WEBHOOK_URL` variable in `index.html`
3. The form sends: `name`, `company`, `email`, `phone`, `inquiry_type`, `details`

## Development
- No build tools required — open `index.html` directly in a browser
- Theme preference stored in `localStorage` under key `cc-theme`
- Responsive breakpoints: 1024px (tablet), 768px (mobile)

## Deployment
- Deploy to **Vercel** or **Netlify** (static site, drag-and-drop)
- No server-side dependencies
- Ensure n8n webhook URL is updated before going live

## Placeholder Content
- Contact info (phone, email, address) — update with real values
- Testimonials — replace with real client testimonials
- Project images — replace Unsplash photos with actual project photos
- n8n webhook URL — configure before deployment
