# App Review TODO

> Multi-agent review of the Singapore Trip Planner (UX, UI, Code Quality, Security, Product), reconciled and verified against build artifacts. Findings are de-duplicated.
>
> **Format note:** P1 items use the full template (acceptance criteria + implementation steps). P2/P3 use a condensed-but-structured format. Effort scale: XS (<1h) · S (½ day) · M (1–2 days) · L (3–5 days) · XL (1+ week).
>
> **Progress:** On branch `fix/p0-security-and-quick-wins`, **all 5 P0s and the initial Quick Wins** were implemented and verified (`tsc --noEmit` and `next build` both green; the proxy now registers as `ƒ Proxy (Middleware)` with the correct matcher compiled in). See **Completed this pass** below.

---

## Completed this pass — branch `fix/p0-security-and-quick-wins`
- [x] **P0 · proxy not registered** — moved `proxy.ts` → `src/proxy.ts` (required because the app is `src/app`). Build now lists `ƒ Proxy (Middleware)` and the compiled chunk contains the matcher + public-path regex. Edge auth is active again.
- [x] **P0 · JWT empty-secret** — new `src/lib/jwt.ts` `getSecret()` fails closed (throws if unset, no `?? ''`), prefers `AUTH_JWT_SECRET` (falls back to `SITE_PASSWORD`), warns under 32 chars. `jwtVerify` now pins `{ algorithms: ['HS256'] }` in both `auth.ts` and `proxy.ts`.
- [x] **P0 · itinerary IDOR** — `GET /api/holidays/[id]/itinerary` now requires owner **or** `holiday.isPublic`.
- [x] **P0 · mass-assignment PATCH** — `PATCH /api/holidays/[id]` allowlists fields with type checks (`name/destination/startDate/endDate/coverEmoji/crew/isPublic`); raw JSON is no longer spread.
- [x] **P0 · broken calendar links** — `holidayId` threaded through `ScheduleView` → `Mobile/DesktopScheduleView` → `ActivityModal`, and `TripCalendar` → `CalendarDayCell`; all four `Link`s now use `/holidays/[id]/itinerary/[day]`.
- [x] **P1 · opt-in sharing** (replaces "public-by-default") — added `Holiday.isPublic` (private by default), server gates in `layout.tsx`, `explore/page.tsx`, and the itinerary API; share toggle + copy-link on the edit page; `isPublic` in the PATCH allowlist.
- [x] **P1 · Arial font** — `--font-sans`/`--font-heading` now map to Geist; removed the `body { font-family: Arial }` override.
- [x] **P1 · `pb-safe` undefined** — added `@utility pb-safe` (safe-area inset) and `viewport-fit=cover` in the layout viewport.
- [x] **P1 · Explore inconsistent access** — Explore index now uses owner-or-public (consistent with the layout gate; sub-pages are covered by that gate too).
- [x] **P1 (partial) · destructive-action confirmations** — Reset Day and document delete now use a shared `ConfirmDialog` + success/error toasts. *Residual: activity-delete undo (moved to P2).*
- [x] **P2 · Redis/`getSecret` dedupe** — `users.ts`/`holidays.ts` import the single `redis` from `kv.ts`; `getSecret` lives once in `jwt.ts`.
- [x] **P2 · auth-form labels** — login/register inputs now have `sr-only` `<label>` + `id`.
- [x] **P2 · register `?from=`** — register now honors the redirect param like login.

**⚠ Follow-up before deploy:** set a strong **`AUTH_JWT_SECRET`** (≥32 random chars, e.g. `openssl rand -base64 48`) in the Vercel environment — it currently falls back to `SITE_PASSWORD`. Then **visually confirm** the Geist font rendering and the iOS safe-area mobile nav (both were verified only by code/build, not on-device).

## Decisions recorded
- **Sharing:** opt-in (private by default + per-holiday public link). ✅ implemented.
- **Multi-destination:** go **destination-agnostic** for Explore — see the P1 item below (large; deferred, not done this pass).
- **Proxy refactor:** intended; `proxy.ts` is the Next 16 `middleware` successor and must live at `src/proxy.ts`. ✅ resolved.
- **Git:** working on branch `fix/p0-security-and-quick-wins`; one commit for this pass; no push without approval.

---

## Executive Summary

A feature-rich, nicely-themed group holiday planner on a modern stack (Next.js 16, React 19, Upstash Redis, Vercel Blob, JWT). As of this pass it **builds and typechecks clean**, and the **five P0 launch-blockers are fixed** (edge auth restored, JWT secret hardened, itinerary IDOR closed, PATCH mass-assignment closed, calendar navigation unbroken), plus opt-in sharing and a batch of quick wins.

**Biggest remaining risks:** uploaded **documents are still world-readable** (public Blob ACL — passport-grade PII fetchable by URL); **Redis read-modify-write races** can silently drop concurrent edits; **errors are swallowed** with no observability; and **Explore content is Singapore-hardcoded** for every destination (decision: make it destination-agnostic). **Highest-impact next steps:** private document storage, the destination-agnostic Explore rework, rate limiting, observability, and finishing server-side owner gating on public-holiday sub-pages.

**Overall health:** the critical security/breakage items are resolved on the branch; the app is in materially better shape. Remaining work is important hardening, data-integrity, and product depth — not launch-blocking once documents are made private.

---

## Review Coverage

**Tech stack:** Next.js **16.2.7** (App Router, Turbopack), React **19.2.4**, TypeScript 5 (strict). Tailwind v4, shadcn-style `@base-ui/react` primitives, `lucide-react`, `framer-motion`, `sonner`, `next-themes` (unused). Persistence: Upstash Redis (`src/lib/{kv,users,holidays}.ts`). Files: Vercel Blob + local-fs fallback (`src/lib/file-storage.ts`). Auth: `bcryptjs` + `jose` HS256 JWT cookie (`src/lib/auth.ts`, `src/lib/jwt.ts`). Deploy: Vercel (`sin1`).

**Checks run (this pass):** `tsc --noEmit` → pass; `next build` → pass, route table shows `ƒ Proxy (Middleware)` and the proxy logic is present in the compiled server chunk (proxy registration verified post-move). `npm audit` → 2 moderate (postcss via Next). Secret scan → none committed; `.env*` and `/public/uploads` gitignored.

**Areas not reviewed / assumptions (flagged):**
- **No live runtime/visual QA.** Contrast ratios, responsive breakpoints, the Geist font fix, and the iOS safe-area nav still need visual confirmation at the stated viewports/devices.
- **Production env not verifiable** — set `AUTH_JWT_SECRET` before deploy (see Follow-up above).
- **Concurrency/data-loss findings are reasoned, not load-tested.**
- Dependency audit limited to `npm audit`.
- **Refuted earlier assumption:** there *is* a holidays dashboard (root `src/app/page.tsx`); the gap is reaching it from mobile (P1 below).

---

## P0 — Critical

_All P0 items resolved on branch `fix/p0-security-and-quick-wins`. ✓ (See **Completed this pass**.)_

---

## P1 — High Priority

### [Security] Uploaded documents are world-readable (public Blob ACL)
- **Type:** Security
- **Priority:** P1 *(treat as P0 if users store passports/IDs — see Open Questions)*
- **Area:** File storage / documents
- **Files:** `src/lib/file-storage.ts:14-28`; consumed at `src/app/api/holidays/[holidayId]/documents/route.ts:40`, rendered at `documents/page.tsx`
- **Current behavior / problem:** Blobs are stored with `access: 'public'`, so the returned URL is permanently fetchable by anyone, bypassing the (correctly) ownership-gated documents list API. The local-fs fallback writes into `public/uploads/...`, served as static assets — same exposure. The "documents" feature is explicitly for travel docs (passports, bookings, insurance = identity-grade PII). URLs leak via history, the documents JSON, referrers, and `target=_blank` links.
- **Recommendation:** Store blobs privately; serve via an authenticated, ownership-checked streaming/signed-URL route (`GET /api/holidays/[id]/documents/[docId]/download`). For local-fs, write outside `public/` and stream through the same gated route.
- **Why it matters:** Permanent unauthenticated access to sensitive PII once any URL leaks.
- **Suggested implementation:** Use `@vercel/blob` private access + short-lived signed URLs or a proxy-download route that calls `getUserFromRequest` + `ownedByUser` then streams the file.
- **Acceptance criteria:**
  - [ ] Document URLs return 401/403 when fetched without an owner session.
  - [ ] Owners can still view/download their files.
  - [ ] Local-fs dev path is not publicly served.
- **Estimated effort:** M
- **Dependencies / risks:** Pairs with deleteHoliday cleanup (below) and upload validation (P2). Changing storage breaks existing stored URLs — migrate or accept. Now that `isPublic` exists, a shared holiday could expose its documents only if you choose to surface them publicly — keep documents owner-only regardless.

### [Security] `deleteHoliday` orphans documents (and their public PII)
- **Type:** Bug fix / Security
- **Priority:** P1
- **Area:** Data lifecycle
- **Files:** `src/lib/holidays.ts:38-44`
- **Current behavior / problem:** Delete removes `holiday:`, `itinerary:`, `todos:` keys, but **not** `documents:${id}` nor the underlying blob/files. After deletion, uploaded passports/bookings remain in storage with their still-public URLs indefinitely — a "right to delete"/retention problem and unbounded storage cost.
- **Recommendation:** In `deleteHoliday`, load documents, `removeFile()` each, then delete the `documents:` key — before/with the holiday delete so cleanup can't be lost. Log failures.
- **Why it matters:** PII survives "deletion"; storage leak.
- **Suggested implementation:** `const docs = await getDocuments(id); await Promise.allSettled(docs.map(d => removeFile(d.url))); await redis.del('documents:'+id);` then proceed.
- **Acceptance criteria:**
  - [ ] Deleting a holiday removes its documents key and all stored files.
  - [ ] Partial failures are logged, not swallowed.
  - [ ] No orphaned blobs remain in a manual check.
- **Estimated effort:** S
- **Dependencies / risks:** Make delete fallible/transactional-ish; handle errors.

### [Code Quality] Redis writes are read-modify-write → data loss under concurrent use
- **Type:** Bug fix
- **Priority:** P1
- **Area:** Data layer
- **Files:** `src/lib/kv.ts` (`setDay`, `addTodo`, `updateTodo`, `deleteTodo`, `addDocument`, `deleteDocument`); `src/lib/holidays.ts` (user-holidays list)
- **Current behavior / problem:** Every mutation is `get → mutate-in-JS → set` of the whole array/object. Two concurrent writers (the app's core *group* scenario) last-write-wins and silently drop each other's changes (e.g. two `addTodo` → one lost; `setDay` rewrites the entire itinerary).
- **Recommendation:** Use atomic structures (Redis lists/hashes per entity) or `WATCH`/`MULTI` optimistic transactions, or a version field + compare-and-set. Upstash supports pipelines/transactions.
- **Why it matters:** Silent data loss in exactly the multi-device/multi-user case the product targets.
- **Suggested implementation:** Start with the highest-churn keys (todos, itinerary day). Model todos as a hash keyed by id; for itinerary, write per-day keys rather than the whole array.
- **Acceptance criteria:**
  - [ ] Two concurrent todo additions both persist.
  - [ ] Editing one day does not require rewriting all days.
  - [ ] A documented concurrency strategy exists.
- **Estimated effort:** L
- **Dependencies / risks:** Data-shape migration; coordinate with collaboration feature (P3). Reasoned, not load-tested — **verify** with two concurrent POSTs.

### [Product] "Explore" content is hardcoded to Singapore for every destination → make destination-agnostic
- **Type:** Bug fix / Feature gap
- **Priority:** P1
- **Area:** Explore / data
- **Decision:** **destination-agnostic** (chosen). Build a generic content model rather than Singapore-only messaging.
- **Files:** `src/data/{attractions,food,practical-info,trip-config}.ts`; `src/app/holidays/[holidayId]/explore/**`; `src/lib/date-utils.ts`; `src/components/home/QuickNavGrid.tsx`
- **Current behavior / problem:** All Explore content is static Singapore data, and `date-utils.ts` derives "trip days" from a hardcoded Sept 25–Oct 4 2026 array in `trip-config.ts`. A "Paris" holiday shows Singapore hawker stalls, the MRT guide, and a month calendar highlighting the wrong dates.
- **Recommendation:** Move Explore content into a destination-keyed (or owner-authored) store so each holiday shows its own attractions/food/practical info; optionally seed via an LLM. Migrate the existing Singapore arrays into the Singapore entry. Separately, **decouple the calendar from `trip-config`** and derive trip days from the holiday's `startDate/endDate` (also covers the residual P3 item).
- **Why it matters:** The single biggest gap between the generic "Trip Planner" promise and reality; every non-Singapore user hits it.
- **Suggested implementation:** Phase 1 — decouple calendar dates from `trip-config` (XS) and gate/relabel Explore by destination so nothing wrong is shown. Phase 2 — destination-keyed content store + owner editing/seeding (L).
- **Acceptance criteria:**
  - [ ] A non-Singapore holiday shows its own (or no) Explore content, never Singapore's as if it applied.
  - [ ] Calendar highlights the holiday's actual dates.
  - [ ] Singapore trips retain today's curated content.
- **Estimated effort:** L (XS for the calendar-date decoupling sub-task)
- **Dependencies / risks:** Content sourcing for arbitrary destinations (LLM-assisted seeding is a good fit; pick a provider).

### [Security] No rate limiting; open registration; no email verification
- **Type:** Security
- **Priority:** P1
- **Area:** Auth API
- **Files:** `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts`
- **Current behavior / problem:** Unlimited login attempts (bcrypt cost 10 is the only friction) enable brute force / credential stuffing; open registration with no verification enables unlimited account creation.
- **Recommendation:** Add per-IP + per-account rate limiting (Upstash is already present — `@upstash/ratelimit`), consider email verification, and use constant-ish error timing.
- **Why it matters:** Standard internet-facing abuse surface.
- **Suggested implementation:** Wrap login/register with a sliding-window limiter; lock an account after N failures for a cooldown.
- **Acceptance criteria:**
  - [ ] Rapid repeated logins are throttled with 429.
  - [ ] Registration is rate-limited per IP.
  - [ ] (If chosen) accounts require email verification before write access.
- **Estimated effort:** M
- **Dependencies / risks:** Email verification needs an email provider (shared with password reset).

### [Security] Owner-only sub-pages still rely on client-side guards (on public holidays)
- **Type:** Security
- **Priority:** P1
- **Area:** Holiday pages
- **Files:** `src/app/holidays/[holidayId]/edit/page.tsx`, `documents/page.tsx`, `prep/page.tsx`
- **Current behavior / problem:** *Partially mitigated this pass:* the holiday `layout.tsx` now server-gates **private** holidays (owner-or-public), so non-owners can't reach any sub-page of a private trip. **Residual:** on a **public** holiday, `edit`/`documents`/`prep` still render for non-owners and rely on a client `useEffect` redirect (`if (!isOwner) …`). The backing APIs are ownership-gated so no data leaks today, but it's a fragile pattern.
- **Recommendation:** Add a server-side owner check to these three pages (Server Component wrapper) so owner-only routes are gated regardless of `isPublic`. Treat `useIsOwner()` as a UI hint only.
- **Why it matters:** Defense-in-depth; prevents a future regression from becoming a real hole on shared holidays.
- **Suggested implementation:** `getUserFromRequest()` + ownership check at the top of each owner-only server page; render children only for owners.
- **Acceptance criteria:**
  - [ ] Non-owner server-side requests to edit/documents/prep are rejected before render, even when the holiday is public.
  - [ ] Consistent guard pattern across all owner-only pages.
- **Estimated effort:** M
- **Dependencies / risks:** These pages are currently client components; may need a small server wrapper.

### [UX] No way back to the dashboard / switch holidays on mobile
- **Type:** UX
- **Priority:** P1
- **Area:** Navigation
- **Files:** `src/components/layout/MobileNav.tsx:20`, `src/components/layout/NavBar.tsx`
- **Current behavior / problem:** `MobileNav` returns `null` off-holiday and has no "home/all trips" tab on-holiday; the desktop `NavBar` is `hidden md:flex`. So on mobile there is no visible path to the dashboard (which *does* exist at `/`) — a user with multiple trips cannot switch between them without editing the URL.
- **Recommendation:** Add a "My Trips" tab/affordance to `MobileNav` when inside a holiday (and make the holiday title tappable → `/`).
- **Why it matters:** Mobile is the primary surface for a travel app; this blocks the core multi-trip return/switch loop.
- **Suggested implementation:** Add a home/grid tab linking to `/`; optionally a header back-chevron.
- **Acceptance criteria:**
  - [ ] From any holiday page on mobile, one tap reaches the dashboard.
  - [ ] Switching between two holidays on mobile needs no manual URL entry.
  - [ ] Affordance is discoverable (labeled).
- **Estimated effort:** S

### [Code Quality] Owner status round-trips through a client effect → flicker + extra renders
- **Type:** Bug fix / Code Quality
- **Priority:** P1
- **Area:** State management / nav
- **Files:** `src/context/HolidayContext.tsx:19-24`, `src/context/ActiveHolidayContext.tsx`, `src/components/layout/NavBar.tsx`
- **Current behavior / problem:** `NavBar` derives the breadcrumb **and owner-only links** from `ActiveHolidayContext`, populated by a `useEffect` in `HolidayProvider` (rendered *below* NavBar). On first paint and every holiday navigation, `active` is `null` → owner links absent and a "Log in" button flashes for owners, then snaps in. The `setActive(null)` cleanup compounds churn; the context value object is unmemoized. `isOwner` is already known server-side in the layout.
- **Recommendation:** Drive `isOwner`/active-holiday from the server (pass through context the NavBar can read without an effect, or render the holiday-scoped NavBar inside the holiday layout). Memoize the provider value; drop the cleanup churn.
- **Why it matters:** Visible flicker of privileged controls + unnecessary app-wide re-renders on every navigation.
- **Acceptance criteria:**
  - [ ] No "Log in" flash for owners; owner links render on first paint.
  - [ ] No transient missing breadcrumb.
  - [ ] Reduced re-renders (verify with React Profiler).
- **Estimated effort:** M
- **Dependencies / risks:** **Verify** flicker at runtime (reasoned from code).

### [Code Quality] Errors are swallowed everywhere; zero observability
- **Type:** Code Quality / Operational
- **Priority:** P1
- **Area:** Repo-wide
- **Files:** all route `catch { … 500 }` blocks; `src/lib/auth.ts`; `src/lib/file-storage.ts`; `migrateLegacyData`
- **Current behavior / problem:** No `console.error`/logger in any catch. A Redis outage, blob failure, or parse error returns an opaque 500 with no server trace — undiagnosable in production. Only `@vercel/analytics` exists; no error tracking.
- **Recommendation:** Log errors server-side in every catch (with context) before returning the sanitized response; add an error tracker (e.g. Sentry) for client + server.
- **Why it matters:** Silent failures in the persistence layer could lose user data with no alert.
- **Suggested implementation:** A small `logError(err, ctx)` helper used by the route wrapper (P2); add Sentry SDK.
- **Acceptance criteria:**
  - [ ] Every caught error is logged with route/context.
  - [ ] A forced Redis failure surfaces in logs/alerts.
  - [ ] Client errors are captured.
- **Estimated effort:** S–M
- **Dependencies / risks:** Don't leak internals to clients.

### [Product] No password reset / account recovery
- **Type:** Feature
- **Priority:** P1
- **Area:** Auth
- **Files:** `src/app/api/auth/*`, `src/app/login/*`, `src/lib/users.ts`
- **Current behavior / problem:** No forgot/reset flow, no email sending anywhere. A user who forgets their password is permanently locked out.
- **Recommendation:** Standard email-based reset: `POST /forgot-password` stores a time-limited token in Redis and emails a link; `GET/POST /reset-password/[token]` verifies and sets a new password.
- **Why it matters:** Table stakes; lockouts cause churn and support burden.
- **Suggested implementation:** Add an email provider (Resend integrates cleanly with Vercel); reuse it for email verification and trip reminders.
- **Acceptance criteria:**
  - [ ] A user can request a reset and receive a link.
  - [ ] Tokens are single-use and expire.
  - [ ] New password is hashed and old sessions handled sensibly.
- **Estimated effort:** M
- **Dependencies / risks:** Email provider dependency.

### [Code Quality] Document upload route has no error handling
- **Type:** Bug fix
- **Priority:** P1
- **Area:** API
- **Files:** `src/app/api/holidays/[holidayId]/documents/route.ts` (POST)
- **Current behavior / problem:** Unlike every sibling handler, the upload `POST` has no try/catch. A `storeFile` failure throws an unhandled 500 (leaking a stack), and a partial failure (file stored but `addDocument` fails, or vice-versa) leaves Redis and storage inconsistent (orphaned blob).
- **Recommendation:** Wrap in try/catch with logging; on `addDocument` failure after a successful `storeFile`, roll back via `removeFile`.
- **Why it matters:** Reliability + consistency on the upload path; orphaned blobs.
- **Acceptance criteria:**
  - [ ] Upload failures return a clean error, logged server-side.
  - [ ] No orphaned blob remains after a failed metadata write.
  - [ ] Consistent with sibling handlers.
- **Estimated effort:** S
- **Dependencies / risks:** Pairs with upload validation (P2).

### [UX] "Add to day" affordances shown to non-owners on shared holidays
- **Type:** UX / Bug fix
- **Priority:** P1
- **Area:** Explore sub-pages
- **Files:** `src/app/holidays/[holidayId]/explore/attractions/page.tsx`, `explore/food/page.tsx`
- **Current behavior / problem:** Both pass `onAddToDay` unconditionally (no `isOwner` check). On a public holiday a non-owner sees "Add to day"; clicking it optimistically mutates the local cache and then fails/de-syncs at the API with no feedback. (Now reachable specifically on shared/public holidays.)
- **Recommendation:** Only pass `onAddToDay` when `useIsOwner()` is true.
- **Why it matters:** Misleading controls + silent local/server divergence.
- **Suggested implementation:** `onAddToDay={isOwner ? handleAddToDay : undefined}`.
- **Acceptance criteria:**
  - [ ] Non-owners don't see add controls.
  - [ ] No optimistic mutation occurs for non-owners.
  - [ ] Owners unaffected.
- **Estimated effort:** XS

---

## P2 — Medium Priority

### [Code Quality] Duplicated auth+ownership preamble across ~10 handlers
- **Type:** Code Quality · **Area:** API · **Files:** `src/app/api/holidays/[holidayId]/**`
- **Problem:** The `getUser → 401 → getHoliday → ownedByUser → 404` block is copy-pasted ~10×. **Recommendation:** Extract a `withHolidayOwner(handler)` wrapper that resolves user+holiday and centralizes the 401/404 contract + logging. **Why:** Authorization bugs hide in duplicated preambles. **Effort:** M. **Acceptance:** all owner-scoped routes use the wrapper; behavior unchanged.

### [Security] No request-body schema validation (beyond the PATCH allowlist)
- **Type:** Security · **Area:** API · **Files:** every `await req.json()` / `formData()`
- **Problem:** Bodies are untyped `any`. The holiday `PATCH` and `POST` now allowlist fields, but todos/itinerary-day/documents still persist client-shaped objects with no validation. **Recommendation:** Add `zod` schemas per route; parse-and-allowlist before persisting. **Why:** Data integrity + oversized-payload protection. **Effort:** M. **Acceptance:** all mutating routes validate input; invalid bodies → 400.

### [Security] Missing Content-Security-Policy header
- **Type:** Security · **Area:** config · **Files:** `next.config.ts:3-12`
- **Problem:** Good headers present (HSTS, X-Frame-Options, nosniff, Referrer/Permissions-Policy) but no CSP. **Recommendation:** Add a CSP (start report-only; account for Next inline styles, possibly nonce-based). **Why:** Limits blast radius of any future XSS / the postcss issue. **Effort:** M. **Acceptance:** CSP present; no console violations in normal use.

### [Security] Session trusts JWT only; no user re-check or revocation
- **Type:** Security · **Area:** Auth · **Files:** `src/lib/auth.ts`, `api/auth/logout/route.ts`
- **Problem:** `getUserFromRequest` never confirms the user still exists; logout only clears the cookie, so a captured 7-day token stays valid. **Recommendation:** Re-check user existence for sensitive ops; consider a `jti`/token-version denylist for real revocation, or shorter expiry + refresh. **Why:** Stale/compromised sessions linger. **Effort:** S–M. **Acceptance:** deleted users' tokens stop working; logout can be server-enforced.

### [Code Quality] Three date conventions + duplicated `emptyItinerary` math
- **Type:** Bug fix (latent) · **Area:** dates · **Files:** `src/lib/kv.ts`, `src/hooks/useItinerary.ts`, `src/lib/date-utils.ts`, `src/components/calendar/ScheduleView.tsx`
- **Problem:** UTC-midnight, local-time, and local-noon parsing coexist; trip-length/`addDays` math is duplicated client/server. **Recommendation:** Centralize one set of date helpers; delete the duplicate; pick one convention (local-noon avoids DST day-shift). **Why:** Off-by-one day bugs recur. **Effort:** M. **Acceptance:** one date module; server+client import it.

### [Code Quality] No linting configured
- **Type:** Code Quality · **Area:** repo · **Files:** `package.json` (no `lint`), no eslint config
- **Problem:** No ESLint, so dead imports / `exhaustive-deps` / a11y issues go uncaught. **Recommendation:** Add `eslint` + `eslint-config-next` + a `lint` script; wire to CI. **Why:** Catches a class of bugs automatically. **Effort:** S. **Acceptance:** `npm run lint` runs clean (or triaged baseline).

### [Code Quality] No tests, no CI
- **Type:** Code Quality · **Area:** repo · **Files:** `package.json`, no `.github/`
- **Problem:** Zero automated tests; the riskiest units (proxy matcher, date math, `ownedByUser`, the PATCH allowlist, the new `isPublic` gates) are uncovered. **Recommendation:** Add Vitest + minimal CI (typecheck + lint + unit); start with the proxy regex, the owner-or-public gates, and date utils. **Why:** No safety net for refactor-heavy code. **Effort:** M. **Acceptance:** CI runs on PRs; core units covered.

### [Code Quality] README is create-next-app boilerplate
- **Type:** Code Quality · **Area:** docs · **Files:** `README.md`
- **Problem:** Doesn't describe the app, env vars, or setup. **Recommendation:** Document the app, required env (now incl. `AUTH_JWT_SECRET`; link `.env.example`), Upstash/Blob setup, and the proxy auth model. **Why:** Onboarding. **Effort:** S. **Acceptance:** a new dev can run it from the README alone.

### [Code Quality] `next-themes` is dead/contradictory
- **Type:** Code Quality · **Area:** theming · **Files:** `src/app/layout.tsx`, `src/components/ui/sonner.tsx`
- **Problem:** No `ThemeProvider`, but `sonner.tsx` calls `useTheme()`, while the layout hardcodes `dark` + `Toaster theme="dark"`. **Recommendation:** Commit to dark (drop `next-themes` + the `useTheme` call) or add a real provider. **Why:** Misleading dead machinery. **Effort:** XS. **Acceptance:** one coherent theming approach; no unused dep.

### [Security] npm audit: 2 moderate (postcss XSS via Next)
- **Type:** Security · **Area:** deps · **Files:** `package.json`/lockfile
- **Problem:** postcss "XSS via unescaped `</style>`" reached transitively through Next. **Recommendation:** `npm audit fix` / bump Next patch / add a postcss `overrides` pin; re-audit. **Why:** Build/CSS-pipeline exposure. **Effort:** XS–S. **Acceptance:** `npm audit` clean (or risk-accepted).

### [Security] File uploads: no type/extension allowlist; content-type trusted
- **Type:** Security · **Area:** uploads · **Files:** `documents/route.ts`, `src/lib/file-storage.ts`
- **Problem:** Only a 20MB check; `contentType` comes from client `file.type` (spoofable) and is stored as the blob's Content-Type. (Path traversal is *not* exploitable — name is `nanoid+ext`.) **Recommendation:** Allowlist content types/extensions, sniff magic bytes, set `Content-Disposition: attachment`, serve via the private gated route (P1). **Why:** Prevents hosting spoofed HTML/malware from your origin. **Effort:** S–M. **Acceptance:** disallowed types rejected; served files force download.

### [UX] Activity delete has no confirmation or undo
- **Type:** UX · **Area:** itinerary · **Files:** `src/components/itinerary/ActivityItem.tsx`
- **Problem:** *(Residual from the P1 destructive-action work — Reset Day & document delete are now confirmed.)* The activity trash icon deletes immediately with no confirm/undo; always-visible on mobile (`opacity-100`). **Recommendation:** Prefer a sonner toast with an "Undo" action (least friction), or reuse `ConfirmDialog`. **Why:** Accidental loss of a planned activity. **Effort:** S. **Acceptance:** activity delete is undoable or confirmed.

### [UI] ~179 hardcoded hex colors bypass defined design tokens
- **Type:** UI · **Area:** design system · **Files:** repo-wide (densest in `ScheduleView`, `ActivityItem`, `QuickNavGrid`, `NavBar`, `SectionHeading`)
- **Problem:** Tokens exist (`--neon-teal`, `--muted-foreground`, …) but components use raw `text-[#…]`/`bg-[#…]` (e.g. `#8888aa` used 108× vs the token 9×; undefined dim shades `#555577/#333355/#44445a`). **Recommendation:** Adopt tokens; add tokens for the dim shades; reserve raw hex for data-driven category palettes. **Why:** Any palette change currently means 200+ edits. **Effort:** L (mechanical). **Acceptance:** feature components use tokens.

### [UI] Three button systems + three card-surface patterns
- **Type:** UI · **Area:** design system · **Files:** `shared/GlowButton.tsx`, `ui/button.tsx`, inline `<button>`s; `ui/card.tsx`, `.glass`, `bg-[#12121a]`
- **Problem:** `GlowButton` (no focus ring/active state), `ui/button` (full a11y), and ~15 inline buttons coexist; cards use `ui/Card` (unused in features), `.glass`, and hardcoded surfaces interchangeably. **Recommendation:** Add a `glow` variant to `ui/button` and retire/alias `GlowButton`; standardize `.glass` for translucent and `bg-card` for opaque surfaces. **Why:** Consistency + closes focus-ring a11y gaps on primary CTAs. **Effort:** M.

### [UI] `imageUrl` data exists but images never render (emoji placeholders)
- **Type:** UI · **Area:** Explore cards · **Files:** `explore/AttractionCard.tsx`, `FoodCard.tsx`, `shared/ImageCard.tsx`, `src/data/*.ts`
- **Problem:** Cards ignore `imageUrl` and show a 40%-opacity emoji; the proper `ImageCard` (next/image) wrapper is unused; placeholder heights differ (`h-40` vs `h-36`). **Recommendation:** Wire `ImageCard` into both cards with a consistent aspect ratio and the emoji as fallback; confirm assets exist in `/public/images`. **Why:** Suppressed content richness; visual jank. **Effort:** S.

### [UI] Low-contrast text fails WCAG on the dark background
- **Type:** UI / Accessibility · **Area:** repo-wide · **Files:** `ScheduleView.tsx`, `NavBar.tsx`, `CrewSection.tsx`, `page.tsx`, etc.
- **Problem:** `#555577` (~3.1:1), `#333355` (~1.8:1), `#44445a` (<2:1) on `#0a0a0f` are used for labels, the sign-out button, completed todos, breadcrumb chevrons. **Recommendation:** Use `text-muted-foreground` (#8888aa ≈ 4.6:1) or ≥40% white for meaningful text; drop the dimmest shades. **Why:** Legibility/WCAG AA. **Effort:** S. **Acceptance:** actionable text ≥4.5:1; **verify with a contrast tool against the rendered gradient bg.**

### [UI] Calendar uses fixed pixel column widths → unusable at tablet
- **Type:** UI · **Area:** Calendar · **Files:** `ScheduleView.tsx` (`TIME_W`, `DAY_W`)
- **Problem:** `TIME_W=56`, `DAY_W=158`; a 10-day trip needs ~1636px, and the desktop view kicks in at 768px, so 768–1023px requires huge horizontal scroll. **Recommendation:** Use the single-day mobile layout up to 1023px, or make `DAY_W` fluid with a clamp for short trips. **Why:** Tablets are a primary planning surface. **Effort:** S–M. **Acceptance:** **verify** 768–1023px renders without massive horizontal scroll.

### [UI] `SectionHeading` reimplemented inline; no `action`/`level` slot
- **Type:** UI / Accessibility · **Area:** headings · **Files:** `shared/SectionHeading.tsx`, calendar page, holiday home
- **Problem:** Calendar rebuilds the heading inline (hardcoded gold glow); the home page hacks `mb-0` to fit an Edit link; `SectionHeading` always renders `<h2>` so several pages have no `<h1>` (merges the prior "no h1" item). **Recommendation:** Add `action`/`suffix` + `level` props; use it everywhere and ensure one `<h1>` per page. **Why:** Heading consistency + document outline (WCAG 1.3.1/2.4.6). **Effort:** S.

### [Accessibility] Animations ignore `prefers-reduced-motion`
- **Type:** Accessibility · **Area:** motion · **Files:** `layout/PageWrapper.tsx`, holiday home (`animate-bounce`, `glow-pulse`), `globals.css`
- **Problem:** Framer-motion page transitions and infinite CSS animations run regardless of OS reduced-motion. Fails WCAG 2.3.3. **Recommendation:** Use `useReducedMotion()`; add a global reduced-motion CSS override. **Why:** Vestibular comfort. **Effort:** S.

### [Product] No delete-holiday UI (API exists)
- **Type:** Feature · **Area:** edit page · **Files:** `edit/page.tsx`, `api/holidays/[holidayId]/route.ts`
- **Problem:** `DELETE` works but there's no button. **Recommendation:** Add a "danger zone" delete with confirmation (reuse `ConfirmDialog`). **Why:** Users can't remove test/mistake trips. **Effort:** XS. **Acceptance:** owner can delete a holiday with confirmation; redirected to dashboard. *(Note: `deleteHoliday` should also clean up documents — see P1.)*

### [Product] No account/profile page; no mobile logout
- **Type:** Feature · **Area:** account · **Files:** none (route missing)
- **Problem:** Logout only on the desktop dashboard; no way to change name/email; no logout from inside a holiday on mobile. **Recommendation:** Add `/account` (name/email, logout, change password) linked from dashboard and mobile. **Why:** Basic account management + mobile logout. **Effort:** S.

### [Product] No itinerary print / PDF export (share link now exists)
- **Type:** Feature · **Area:** itinerary/calendar · **Files:** itinerary & calendar pages
- **Problem:** *(The copy-share-link is now on the edit page via opt-in sharing.)* Still no print view or PDF for offline/airport use. **Recommendation:** Quick: print CSS + a print button; later: server-side PDF. **Why:** Families want a printable plan. **Effort:** XS (print) / M (PDF).

### [Product] No budget / cost tracking
- **Type:** Feature · **Area:** itinerary · **Files:** `src/types/index.ts` (`Activity`), itinerary views
- **Problem:** `Activity` has no cost; attractions' `entryFee` is unused; no trip total. **Recommendation:** Add optional `cost`/`currency`; show per-day and per-trip totals; optional budget target on `Holiday`. **Why:** A top-3 group-travel use case. **Effort:** M.

### [Product] Prep checklist starts empty (no starter templates)
- **Type:** Feature (onboarding) · **Area:** prep · **Files:** `prep/page.tsx`, `useTodos.ts`
- **Problem:** Empty list with no guidance, despite well-defined todo categories. **Recommendation:** "Load starter checklist" seeding ~15 common tasks. **Why:** Demonstrates value immediately. **Effort:** XS.

### [Security] `migrateLegacyData` runs on every registration with hardcoded PII
- **Type:** Security / Code Quality · **Area:** register · **Files:** `api/auth/register/route.ts`
- **Problem:** Every registration probes `itinerary:main`/`todos:main`; the first registrant silently claims that legacy trip (with hardcoded real crew names). **Recommendation:** Move to a one-off admin script/flag; remove hardcoded personal data from source. **Why:** Unauthenticated one-time data claim + PII in repo. **Effort:** S. **Acceptance:** no migration in the register path; **verify** legacy keys are already gone.

---

## P3 — Low Priority / Nice to Have

### [Security] Open redirect via `?from=`
- **Type:** Security · **Files:** `LoginForm.tsx`, `RegisterForm.tsx` · **Problem:** `window.location.href = params.get('from')` accepts `//evil.com` (now in both login and register). **Recommendation:** Only honor same-origin paths (starts with `/`, not `//`). **Why:** Post-login phishing aid. **Effort:** XS.

### [Security] API requests get an HTML login redirect instead of 401
- **Type:** Security/observability · **Files:** `src/proxy.ts` · **Problem:** Now that the proxy runs, API requests it rejects get a 302→`/login` (HTML) rather than 401 JSON. **Recommendation:** Return 401 JSON for `/api/*` in the proxy. **Why:** Clients can't distinguish auth failures. **Effort:** S.

### [UI] No focus-visible rings on `GlowButton` / bespoke buttons/links
- **Type:** UI/Accessibility · **Files:** `GlowButton.tsx`, `CategoryFilter.tsx`, nav links, calendar chevrons · **Recommendation:** Add a shared `focus-visible` ring. **Why:** Keyboard users have no visible focus. **Effort:** S.

### [UI] Inconsistent spinner sizes/colors
- **Type:** UI · **Files:** documents/calendar/prep/itinerary pages · **Recommendation:** Extract a `<Spinner size color>`; standardize sizes. **Why:** Reads as unfinished. **Effort:** XS.

### [UI] Mobile nav labels at `text-[9px]`
- **Type:** UI/Typography · **Files:** `MobileNav.tsx` · **Recommendation:** Use 10–12px; shorten labels if needed. **Why:** Below legible/HIG minimums. **Effort:** XS. **Verify** at 375px with 6 tabs.

### [UI] `QuickNavGrid` hover always turns titles teal
- **Type:** UI · **Files:** `QuickNavGrid.tsx` · **Recommendation:** Hover to each card's own `color`. **Why:** Breaks per-card color identity. **Effort:** XS.

### [UI] Primary CTA gradients are raw inline styles in ~7 files
- **Type:** UI · **Files:** login/register/new/dashboard/nav/prep/edit · **Recommendation:** Encapsulate as a `GlowButton`/`ui/button` variant; add `#00b8a6` to the theme. **Why:** Most prominent CTAs lack focus/active states and duplicate styles. **Effort:** S.

### [Code Quality] `ScheduleView.tsx` oversized (~540 lines) + duplicated category palette
- **Type:** Code Quality · **Files:** `ScheduleView.tsx`, `ActivityItem.tsx` · **Recommendation:** Extract `CAT_COLOR`/`CAT_EMOJI` to `src/lib/categories.ts`; split mobile/desktop. **Why:** Maintainability; palette drift. **Effort:** M.

### [Code Quality] Unvalidated API JSON cast to types in hooks
- **Type:** Code Quality · **Files:** `useItinerary.ts`, `useTodos.ts` · **Recommendation:** Validate at fetch/localStorage boundaries (zod or guards). **Why:** Type guarantees are fictional at the network/cache edge. **Effort:** S–M.

### [Code Quality] `trip-config.ts`/`date-utils.ts` residual Singapore coupling
- **Type:** Tech debt · **Files:** `date-utils.ts`, `trip-config.ts`, `CalendarDayCell.tsx` · **Note:** folded into the destination-agnostic P1 (calendar-date decoupling sub-task). **Recommendation:** Delete the hardcoded date config; derive trip days from holiday `startDate/endDate`. **Effort:** XS.

### [Code Quality] Minor: variable shadowing + `getUserFromRequest` naming
- **Type:** Code Quality · **Files:** `NavBar.tsx` (`active` shadow), `auth.ts` (no `request` arg) · **Recommendation:** Rename inner `active`→`isActive`; consider `getCurrentUser`. **Why:** Readability. **Effort:** XS.

### [UX] `useItinerary`/`useTodos` show empty state on fetch error (no error UI)
- **Type:** UX · **Files:** `useItinerary.ts`, `useTodos.ts` · **Recommendation:** Add an `error` state + retry UI when no cache exists. **Why:** On flaky travel connectivity, users think data is gone. **Effort:** S.

### [Accessibility] `AttractionCard` emoji placeholder not `aria-hidden`
- **Type:** Accessibility · **Files:** `AttractionCard.tsx` · **Recommendation:** `aria-hidden="true"` (and real `alt` when images land). **Why:** SR noise. **Effort:** XS.

### [UX] `MobileNav` has no login affordance for non-owners
- **Type:** UX · **Files:** `MobileNav.tsx` · **Recommendation:** Show a "Sign in to edit" chip when `holidayId && !isOwner`. **Why:** Mobile viewers of shared links can't find sign-in. **Effort:** XS.

### [Product] Drag-to-reorder activities (backend already exists)
- **Type:** Feature (quick win) · **Files:** `useItinerary.ts` (`reorderActivities` unused), `DayTimeline.tsx` · **Recommendation:** Wire drag-and-drop to the existing `reorderActivities`. **Why:** Frequent action; backend ready. **Effort:** S.

### [Product] PWA / install prompt / trip reminders
- **Type:** Enhancement · **Files:** `layout.tsx`, `public/` (no manifest), `useCountdown.ts` · **Recommendation:** Add a manifest/basic PWA; later, "T-7 days" reminders. **Why:** Retention + installability. **Effort:** S (PWA) / L (push).

### [Product] Real crew collaboration (strategic)
- **Type:** Feature (strategic) · **Files:** `src/types/index.ts` (`CrewMember` has no `userId`/email), holiday ownership model · **Problem:** Crew are decorative; no invite/co-edit despite "group planner" branding. The new opt-in public link gives read-only sharing; true co-editing is the next step. **Recommendation:** Link crew to real accounts with a `collaborators: userId[]` field and ACL checks for read/write. **Why:** Closes the gap between the "group" promise and reality. **Effort:** L. **Dependencies:** conflict resolution (see P1 race conditions).

---

## Quick Wins
_All initial quick wins were completed this pass (see **Completed this pass**)._ Next cheap, high-confidence wins from the remaining backlog:
1. **Delete-holiday UI** in the edit page danger zone (P2, XS).
2. **Starter prep checklist** seeding (P2, XS).
3. **`trip-config` → holiday-date decoupling** for the calendar (P1 sub-task / P3, XS).
4. **Gate "Add to day" on `isOwner`** in explore attractions/food (P1, XS).
5. **Open-redirect guard** on `?from=` (P3, XS).
6. **API 401 JSON** instead of HTML redirect in the proxy (P3, S).
7. **`aria-hidden` on decorative emoji**, **single `<h1>` per page** (P2/P3, XS).
8. **`next-themes` cleanup** — commit to dark (P2, XS).

## Suggested Execution Order
1. ~~Lock the doors (P0 security)~~ ✅ done.
2. ~~Fix the obviously-broken (calendar links, font, `pb-safe`)~~ ✅ done.
3. **Protect the data/PII (P1):** private document blobs + gated download, `deleteHoliday` cleanup, and finish server-side owner gating on edit/documents/prep (covers public holidays).
4. **Hardening + reliability (P1):** rate limiting, error logging + Sentry, upload validation, document-upload try/catch. Then the Redis read-modify-write races.
5. **Destination-agnostic Explore (P1):** start with the calendar-date decoupling (XS), then the content model (L).
6. **UX/product fills (P1→P2):** mobile "My Trips" nav, password reset, delete-holiday UI, account page, starter todos, activity-delete undo.
7. **Code-quality foundations (P2):** route wrapper, zod schemas, ESLint + CI + Vitest (cover the new `isPublic` gates + proxy matcher), README, date-helper consolidation, drop `next-themes`.
8. **UI consistency + polish (P2→P3):** design tokens, unify buttons/cards, wire `imageUrl`/`ImageCard`, contrast fixes, tablet calendar, focus rings, reduced-motion, headings.
9. **Strategic bets (P3):** real crew collaboration, budget tracking, print/PDF, PWA + reminders, drag-to-reorder.

## Open Questions
1. ~~Is public-by-link sharing intentional?~~ **Answered:** opt-in sharing (implemented).
2. ~~Multi-destination or Singapore-first?~~ **Answered:** destination-agnostic (P1, deferred).
3. **Should crew be real collaborators (co-edit), or is the read-only public link enough?** Drives the collaboration P3 and the race-condition P1.
4. ~~Was the proxy refactor intended?~~ **Answered:** yes; fixed at `src/proxy.ts`.
5. **What do users actually store in "documents"?** If passports/IDs/booking PII, treat the public-blob exposure (P1) as P0.
6. **Is registration meant to be open to the public, or invite-only?** Drives rate-limiting, email verification, and the legacy-data-migration behavior.
7. **Confirm `AUTH_JWT_SECRET` is set (≥32 chars) in production** before the next deploy (currently falls back to `SITE_PASSWORD`).
8. **Primary target platform?** If mobile-first, prioritize mobile-nav, tablet-calendar, and safe-area items.
