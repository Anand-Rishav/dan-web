<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# DAN SERVICES website (dan-web)

Marketing site for an influencer marketing agency. Next.js 16 (App Router, Turbopack, `cacheComponents: true`) + React 19 + TypeScript strict + Tailwind CSS v4. No tests exist; verify with `npm run lint` and `npm run build`.

## Commands

- `npm run dev` — dev server (Turbopack). Port 3000; auto-increments if busy.
- `npm run lint` — ESLint (flat config, `eslint-config-next`).
- `npm run build` / `npm start` — production build/serve.

## Layout

- `src/app/` — routes. Every page wraps its content in `<PageShell>` (navbar, footer, smooth scroll, custom cursor, lead-modal context). `opengraph-image.tsx`, `sitemap.ts`, `robots.ts` live at the app root.
- `src/components/` — UI. Lead forms are `BrandIntakeModal` / `CreatorApplicationModal`, opened only through the `useLeadModals()` context from `LeadModalProvider` (supports prefill: budget, creatorName, platforms). `ROICalculator` and `TalentRoster` use this context — do not reintroduce prop-drilled `onOpenBrandModal` callbacks.
- `src/lib/` — `scrollControl.ts` (module-level Lenis handle; smooth-scroll anchors via `scrollToSection`), `platforms.ts` (canonical platform label↔value mapping), `supabaseClient.ts`.
- `src/app/api/leads/{brand,creator}/route.ts` — Zod validate → Supabase insert → Resend email → Slack notify. Each integration is optional (env-guarded) and individually non-fatal, but API failures must surface as error responses to the client — never fake success.
- `supabase/migrations/` — SQL schema. Adding fields to lead payloads requires a matching migration (RLS: anon may insert leads only; authenticated may read).

## Conventions & gotchas

- **Tailwind v4**: no `tailwind.config` file; theme tokens (cyan `primary-*`, violet `secondary-*`, grays) are defined via `@theme` in `src/app/globals.css`. Dark theme only — `background` `#050505`.
- **Modals** must use Headless UI `Dialog` (focus trap, Escape, scroll lock). While a modal is open, `LeadModalProvider` pauses Lenis via `stopScroll()`.
- **Scrolling**: Lenis owns smooth scroll (`anchors: { offset: -64 }`); do NOT add `scroll-behavior: smooth` CSS — it conflicts. Section links point to `/#hash` and smooth-scroll only when already on `/`.
- **Images**: `next/image` everywhere (remote Unsplash avatars/thumbnails are the norm, `sizes` required). Plain `<img>` should not be reintroduced.
- **Client-heavy pages**: hero 3D (`ClientHero`) mounts its canvas only while the hero intersects the viewport and the tab is visible; `CustomCursor` drives DOM refs in rAF instead of per-mousemove `setState`. Preserve both patterns — they are deliberate perf guards.
- **Marquee**: the animated track must contain exactly 2 copies of the items (`w-max`, translate −50%) for a seamless loop.
- **Env vars** (all optional; app degrades gracefully): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `SLACK_BOT_TOKEN`, `SLACK_LEADS_CHANNEL`, `SLACK_APPLICATIONS_CHANNEL`. No `.env` file is committed.
- Canonical production URL is `https://danservices.com` (used by `metadataBase`, sitemap, robots, JSON-LD).
