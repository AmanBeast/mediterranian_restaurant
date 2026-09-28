# Task: Mediterranean Restaurant Website (production-ready, mobile-first)

## Role
You are a senior full-stack engineer working autonomously in this repository. Build a production-ready website for a single-location Mediterranean restaurant, including public site, reservations, and admin panel.

## Inputs (locate these first; ask if any are missing)
- Design source of truth: Stitch designs at [PATH/URL/EXPORT]. Match layout, typography, spacing, colors, and mobile navigation. If a design conflicts with accessibility or technical limits, keep the visual intent and fix the implementation.
- Restaurant content (name, copy, address, hours, menu, photos): [PATH or "use clearly labeled placeholder seed data"]. Never invent real-sounding business facts (addresses, phone numbers, awards, reviews). Use obvious placeholders.
- Existing codebase: assume it exists. Reuse it (see Phase 0).

## Hard constraints
1. **Out of scope, do not build or scaffold:** loyalty/rewards/referral pages, nav items, or tables; customer accounts (customers never need to log in to browse or reserve); separate backend server; microservices; Redis; native app. Online ordering: only integrate with it if it already exists in the repo; otherwise do not build it.
2. **Mobile-first:** design and build from 360–430px upward, then 768 / 1024 / 1280 / 1440. Large touch targets, sticky primary CTA, horizontally scrollable category chips, minimal nav.
3. **Do not rebuild what exists:** auth, DB connection, Prisma client, reservation logic, menu logic, admin features. Refactor only when needed.
4. **Simplicity over cleverness.** No features "because they might be useful." Keep the architecture extensible but build only what is listed here.
5. **Security is server-side:** every admin action and API mutation checks session and role on the server. Hiding UI is never authorization. Middleware may redirect, but it is not the only check.

## Stack
Next.js (App Router, latest stable), TypeScript strict, React, Tailwind, shadcn/ui, Lucide, Framer Motion (selective, respects `prefers-reduced-motion`), PostgreSQL + Prisma, Auth.js (Credentials for staff/admin; Google only if already configured), React Hook Form + Zod, Cloudinary (images), Resend (email), Vercel + Neon deployment, Vitest + Playwright.
Use Server Components, Server Actions, and Route Handlers. Put business logic in a service layer (`ReservationService`, `MenuService`, `NotificationService`) rather than in handlers. Prefer URL search params for menu filters; use Zustand only if a genuine cross-component client need appears.

## Data model (verify/extend the existing Prisma schema; don't duplicate)
User (role: ADMIN | STAFF), MenuCategory, MenuItem (name, description, ingredients, price, image, category, dietaryTags, allergens, isAvailable, isFeatured), Reservation (status: PENDING | CONFIRMED | CANCELLED | COMPLETED | NO_SHOW), Chef, Testimonial, GalleryImage (category: FOOD | RESTAURANT | PEOPLE | ATMOSPHERE), BlogPost (status: DRAFT | PUBLISHED), RestaurantSettings (name, address, phone, email, opening hours, social links, map location, reservation rules), ContactMessage, AuditLog.
- Store image URLs/public IDs only, never binaries.
- Add indexes only for real query patterns: MenuItem(categoryId, isAvailable, isFeatured), Reservation(date, status, customerEmail), BlogPost(slug unique, status).
- Use `select`, pagination, and transactions. Avoid N+1 queries.

## Reservation rules (implement in `ReservationService`, enforced server-side)
- Flow: date → time → guests → contact details → confirmation. Required fields: name, email, phone, date, time, party size; optional: special request.
- Validate: date/time in the future, within opening hours, within settings-defined rules (slot length, max party size, max days ahead, capacity per slot). Use the restaurant's timezone from settings for all date logic.
- Availability = capacity per time slot minus overlapping non-cancelled reservations. State the capacity model you chose in the assumptions log.
- Create atomically in a Postgres transaction with a concurrency-safe check (e.g. serializable isolation or row lock). Add a test that fires concurrent requests at the last available slot.
- Confirmation screen: date, time, guests, restaurant, Add to Calendar (.ics), Get Directions. Send an email via Resend if configured; otherwise skip gracefully.
- UI states: loading, available, no availability, validation error, server error, success.

## Pages
**Public:** `/` (navbar, hero, "Our Guests' Favorite" dish, category chips, featured menu, story, chefs, testimonials, gallery preview, reservation CTA, location, footer), `/menu` (search, categories, dietary filters, availability and popular badges, item detail view), `/reservation`, `/about`, `/chefs` and `/chefs/[slug]`, `/gallery` (lazy loading, lightbox), `/contact` (details, hours, map, validated + rate-limited form), `/blog` and `/blog/[slug]`.
**Featured dish:** from order analytics only if they exist; otherwise the admin-flagged `isFeatured` item.
**Categories, dietary tags, and all content are database-driven, not hardcoded.** Dietary info uses text labels, not color/icon alone.
**Admin (`/admin`):** dashboard cards (today's and upcoming reservations, menu items, available items, recent messages, published posts); `/admin/menu` (CRUD, availability toggle, image upload, tags, featured); `/admin/reservations` (list + date view, filters, search, status changes, special requests, tablet/desktop optimized); CRUD for chefs, testimonials, gallery, blog, and settings.
**Roles:** ADMIN can do everything, including managing staff accounts. STAFF can manage reservations, toggle menu availability, and edit non-critical content.

## Quality requirements
- **Security:** Zod validation on every input; rate-limit public forms with a store that works on serverless (do not use per-instance in-memory limiting; use a DB-backed approach or note the limitation); secure headers; HTTP-only cookies; validate upload type/size and use signed Cloudinary uploads; log sensitive admin actions to `AuditLog`; never expose raw DB errors or secrets to clients.
- **Performance:** `next/image` with correct `sizes`, `next/font`, no layout shift, minimal client JS, dynamic imports for lightbox/heavy admin widgets, cache static content with revalidation on admin edits. Animations must never delay interaction.
- **SEO:** unique title, description, canonical, OG/Twitter metadata per page; `sitemap.xml`, `robots.txt`; JSON-LD (Restaurant/LocalBusiness, Article) using only accurate data.
- **Accessibility (WCAG AA):** semantic HTML, keyboard navigation, visible focus, labeled inputs with associated errors, accessible dialogs, contrast, alt text.
- **Code:** strict TS, no unnecessary `any`, small focused components, clear server/client boundaries, no duplicated business logic. Components organized by domain (`layout/`, `home/`, `menu/`, `reservation/`, `admin/`, `ui/`).

## Execution protocol
Work in phases. Complete each phase's verification before moving on, and commit after each phase.

**Phase 0 – Inspect (no code changes).** Report: architecture, routes, Prisma schema, auth, existing reservation/menu/order/admin code, available Stitch assets, and gaps versus this spec. Then present a phased plan, a list of assumptions, and blocking questions. **Stop and wait for approval.**
**Phase 1 – Schema & seed.** Migrations, indexes, seed data. Verify: `prisma migrate` and seed run cleanly.
**Phase 2 – Shared UI & layout.** Design tokens from Stitch, navbar/mobile menu/footer, base components. Verify: typecheck + lint.
**Phase 3 – Public pages.** Verify: pages render at 375px and 1280px with no console errors.
**Phase 4 – Reservations.** Service, form, confirmation, email, concurrency test. Verify: unit + integration tests pass.
**Phase 5 – Admin & RBAC.** Auth, roles, all admin modules, audit log. Verify: authorization tests (STAFF denied ADMIN actions, anonymous denied everything).
**Phase 6 – SEO, performance, accessibility pass.** Verify: Lighthouse mobile run on home, menu, and reservation; report scores.
**Phase 7 – Tests & production.** Playwright E2E (home, menu browsing, reservation flow, admin login, admin reservation management); `.env.example` (only variables actually used); deployment docs for Vercel/Neon/Cloudinary/Resend; `npm run build` passes with no production-affecting warnings.

## Rules for working
- Never claim something works without running it. Report the exact commands you ran and their results.
- If something is ambiguous and non-blocking, choose the simplest option and log it in an assumptions list. Ask only for true blockers.
- If a requirement can't be met (e.g. missing design asset), say so and use a clearly marked placeholder.

## Definition of done
All Stitch screens implemented; reservations work end-to-end without double booking; admin modules work with server-enforced roles; queries are efficient; loading/empty/error states exist; SEO, accessibility, and image optimization are done; tests pass; production build succeeds; env vars and deployment are documented.

## Final report format
1. What was built (by phase)
2. Commands run + results (tests, build, Lighthouse)
3. Assumptions made
4. Deviations from spec or Stitch, with reasons
5. Known limitations / follow-ups