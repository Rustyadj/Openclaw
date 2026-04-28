# OpenClaw — Claude Instructions

## Design & Frontend Work

For ALL UI, design, frontend, component, page, dashboard, landing page, branding, or visual work in this repo, always follow the **Elite Design & Build Pipeline** (`/elite-design-pipeline`):

1. **Stitch** — UI/UX mockup and layout generation (glassmorphism, modern SaaS aesthetics)
2. **v0.dev** — Frontend refinement (Next.js, TailwindCSS, shadcn/ui)
3. **Claude Code** — Logic, architecture, API wiring, state management
4. **Nano Banana / Google Antigravity** — Creative enhancements and visual polish

### Design Standards
- Premium SaaS / glassmorphism aesthetic
- Dark/light mode capable
- Mobile responsive
- No duplicate components, no inconsistent spacing, no generic AI templates
- "Built by a top Silicon Valley product team" quality bar

### Default Stack
- React / Next.js + TypeScript
- TailwindCSS + shadcn/ui
- Framer Motion for animations
- Firebase for auth/backend (already scaffolded)
- API gateway: port 18789 on the VPS host, proxied via nginx at `/api/`

## Project Context
- **App:** Neural Hub — dark glassmorphism SaaS command center
- **VPS:** Hostinger at `187.124.66.30`, Docker deployed on port 80
- **App URL:** `http://187.124.66.30/cc/`
- **Deploy:** `bash deploy.sh` from the VPS (pulls `main`, then `docker compose up -d --build`)

## VPS / Docker Architecture
- `docker-compose.yml` builds the image and passes `VITE_*` vars as **build args** (not runtime env)
- Vite bakes those vars into the JS bundle at build time — runtime env vars have no effect
- `VITE_API_BASE_URL=/api` — nginx proxies `/api/` → `localhost:18789` on the host
- `network_mode: host` — container shares VPS network; use `localhost`, not `host.docker.internal`
- App is served at `/cc/` to match `vite.config.ts` `base: '/cc/'`
