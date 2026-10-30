<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# DAN SERVICES website (dan-web)

Marketing site for an influencer marketing agency. Next.js 16 (App Router, Turbopack, `cacheComponents: true`) + React 19 + TypeScript strict + Tailwind CSS v4. Deployed on Vercel at https://www.danservices.in.

## Commands

- `npm run dev` — dev server (Turbopack). Port 3000; auto-increments if busy.
- `npm run lint` — ESLint (flat config, `eslint-config-next`).
- `npm run build` / `npm start` — production build/serve.
- `npm run test:e2e` — 32-check Playwright (Firefox) regression suite in `tests/e2e/`. Requires dev server running, or pass `BASE_URL=https://...` (safe against prod: form posts are route-mocked). Playwright browsers live in `~/.cache/ms-playwright`.

## Layout

- `src/app/` — routes. Every page wraps its content in `<PageShell>` (navbar, footer, smooth scroll, custom cursor, lead-modal context). `opengraph-image.tsx`, `icon.tsx`/`apple-icon.tsx` (generated favicons), `not-found.tsx` (branded 404), `sitemap.ts`, `robots.ts` live at the app root.
- `src/components/` — UI. Lead forms are `BrandIntakeModal` / `CreatorApplicationModal`, opened only through the `useLeadModals()` context from `LeadModalProvider` (supports prefill: budget, creatorName, platforms). `ROICalculator` and `TalentRoster` use this context — do not reintroduce prop-drilled `onOpenBrandModal` callbacks.
- `src/lib/` — `scrollControl.ts` (module-level Lenis handle; smooth-scroll anchors via `scrollToSection`), `platforms.ts` (canonical platform label↔value mapping), `rateLimit.ts` (per-IP fixed window), `supabaseClient.ts`.
- `src/app/api/leads/{brand,creator}/route.ts` — rate limit (6 per 15 min per IP, **separate bucket per form**) → honeypot check (bots get fake 201, nothing stored) → Zod validate → Supabase insert → Resend email → Slack notify. Email/Slack are optional (env-guarded, non-fatal), but a **configured Supabase insert that fails must return 500** — never fake success. Supabase inserts must NOT use `.select()`: RLS is insert-only for anon and PostgREST rejects `return=representation` without SELECT permission (this silently dropped every lead until caught).
- **Rate limiter production lessons (`src/lib/rateLimit.ts`) — do not regress these.** (1) On Vercel, read `x-vercel-forwarded-for` first, then the LAST hop of `x-forwarded-for`; plain first-hop parsing returned a constant proxy IP for every visitor. (2) If no usable IP header exists, **fail open** (allow) — a limiter that collapses all visitors into one "unknown" bucket locked the entire site out of its own forms (fixed in `772211f`/`ad5ffd8` after users hit "Submission Failed" sitewide). (3) Buckets are keyed `leads:{form}:{ip}` so testing one form never blocks the other. A temporary `GET` diagnostic on the brand route reports (masked) which IP headers arrive — remove it once IP detection is trusted.
- `supabase/migrations/` — SQL schema (applied to the live project). Adding fields to lead payloads requires a matching migration (RLS: anon may insert leads only; authenticated may read).

## Conventions & gotchas

- **Tailwind v4**: no `tailwind.config` file; theme tokens (cyan `primary-*`, violet `secondary-*`, grays) are defined via `@theme` in `src/app/globals.css`. Dark theme only — `background` `#050505`.
- **Modals** must use Headless UI `Dialog` (focus trap, Escape, scroll lock). While a modal is open, `LeadModalProvider` pauses Lenis via `stopScroll()`.
- **Scrolling**: Lenis owns smooth scroll (`anchors: { offset: -64 }`); do NOT add `scroll-behavior: smooth` CSS — it conflicts. Section links point to `/#hash` and smooth-scroll only when already on `/`.
- **Images**: `next/image` everywhere (remote Unsplash avatars/thumbnails are the norm, `sizes` required). Plain `<img>` should not be reintroduced.
- **Client-heavy pages**: hero 3D is device-gated. `Hero` renders `ClientHero` (dynamic, `ssr: false`) on capable devices (≥4 CPU cores via `useSyncExternalStore`); **phones load it too, but the chunk isn't requested until the page goes idle** (`idle3D` store — `requestIdleCallback` with timeout) so it never competes with LCP. `ClientHero` additionally mounts its canvas only while the hero intersects the viewport and the tab is visible, and runs a mobile quality mode (reduced geometry detail, `dpr` ≤1.25, no antialias, `frameloop="demand"` paced at ~30fps by `RenderPacer`). `CustomCursor` drives DOM refs in rAF instead of per-mousemove `setState`. Preserve these patterns — they are deliberate perf guards (enabling 3D on phones costs ~30 lab Lighthouse points to TBT; the idle defer keeps LCP/field metrics intact).
- **three.js is pinned `^0.182.0`** — do not bump casually: r183+ deprecates `THREE.Clock`, and react-three-fiber still uses it, logging a warning per page load. Re-test the console after any three/R3F upgrade.
- **layout.tsx hydration scrubber**: the inline `extensionAttrScrubber` script strips browser-extension attributes (`bis_*`, `__processed_*`) before hydration. Removing it reintroduces false hydration-mismatch errors in dev (Bitwarden etc.).
- **Accessibility**: axe-clean WCAG 2.1 AA — keep it. Buttons on solid cyan `bg-primary-500` use `text-gray-950` (white on cyan is 2.25:1 — fails); `text-gray-500` on dark backgrounds is usually too low (4.2:1), use `gray-400`. Form controls need real label associations (see the ROI slider's `htmlFor`/`aria-live` pattern).
- **Marquee**: the animated track must contain exactly 2 copies of the items (`w-max`, translate −50%) for a seamless loop; the second half carries `aria-hidden`.
- **next.config.ts**: `images.remotePatterns` must include `images.unsplash.com` (avatars/case images) — omitting it 500s every page that renders them.
- **Env vars** (Supabase configured in `.env.local`, not committed; the rest optional): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (new `sb_publishable_…` key format, supported by supabase-js ≥2.5x), `RESEND_API_KEY`, `SLACK_BOT_TOKEN`, `SLACK_LEADS_CHANNEL`, `SLACK_APPLICATIONS_CHANNEL`.
- **Canonical production URL is `https://www.danservices.in`** (used by `metadataBase`, sitemap, robots, JSON-LD). The `.com` domain is not owned and points nowhere — never reintroduce it; e2e check `T2c` enforces this.
- **Budget prefill mapping** (`budgetToBucket` in `BrandIntakeModal`): boundaries are inclusive at the top of each bucket ($150,000 → `$50k-$150k`, not `$150k+`) — matching the option labels.
