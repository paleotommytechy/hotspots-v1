# AGENT.md

# Hotspots — Agent Instructions

## 1. Mission

Build a mobile-first, interest-based matchmaking platform that helps users discover and connect with people who share their passions, skills, hobbies, and professional interests.

The MVP must validate one core loop:

`Sign Up → Complete Profile → Select Interests → Discover People → Understand Match → Connect → Message`

Do not build features outside this core loop unless explicitly requested.

The first target is a campus/community environment. Optimize for a dense, meaningful network rather than global scale during MVP development.

---

## 2. Non-Negotiable Engineering Rules

### Rule 1 — 500 LOC Maximum

Every source code file must remain below 500 lines of code.

This applies to:

* `.tsx`
* `.ts`
* `.js`
* `.jsx`
* `.css`
* `.sql`
* Configuration files where practical

If a file approaches 400 LOC, proactively refactor it.

Split by:

* Feature
* Domain responsibility
* Component responsibility
* Data access
* Business logic
* Validation

Never solve a large-file problem by compressing or minifying code.

---

### Rule 2 — Mobile First

The application must be designed and implemented mobile-first.

The primary experience is a phone-sized viewport.

Desktop is an enhancement, not the starting point.

Prioritize:

* Thumb-friendly controls
* Bottom navigation
* Bottom sheets
* Large touch targets
* Simple navigation
* Short content blocks
* Fast interactions
* Responsive layouts

The mobile experience should feel inspired by modern iOS applications:

* Clean hierarchy
* Rounded cards
* Native-feeling spacing
* Soft surfaces
* Clear typography
* Subtle shadows
* Smooth transitions
* Minimal visual noise

Do not create a desktop dashboard and simply shrink it for mobile.

---

### Rule 3 — Design System Compliance

All UI must follow `DESIGN.md`.

Do not introduce random colors.

Do not create one-off button styles when an existing component can be reused.

Use:

* Tailwind CSS
* shadcn/ui
* Lucide icons

Use design tokens rather than hardcoding colors throughout components.

---

### Rule 4 — TypeScript First

Use strict TypeScript.

Avoid:

```ts
any
```

unless there is a documented technical reason.

Prefer:

```ts
unknown
```

with explicit narrowing.

All API responses and user inputs must have defined types.

Shared types belong in:

```text
packages/types
```

---

### Rule 5 — Validate at Boundaries

Use Zod for:

* Forms
* API input
* Query parameters
* Environment variables
* Server actions
* External service responses where appropriate

Never trust client-side validation alone.

Validation flow:

`User Input → Zod → Application Logic → Database`

---

### Rule 6 — Business Logic Must Be Testable

Do not bury core business logic inside React components.

The following must be isolated:

* Match scoring
* Profile completion
* Connection rules
* Permission checks
* Recommendation filtering

For example:

```text
packages/matching
  calculateMatchScore()
  explainMatch()
  rankCandidates()
```

These functions should be deterministic and independently testable.

---

### Rule 7 — Supabase Is the Primary Backend Platform

Use Supabase for:

* PostgreSQL database
* Authentication
* Row Level Security
* Realtime where appropriate
* Database migrations
* Server-side database access

The database is the source of truth.

Do not create a second database for MVP.

Do not duplicate user records in another database.

---

### Rule 8 — Cloudinary Handles User Media

Use Cloudinary for:

* Profile photos
* Image uploads
* Image transformations
* Image optimization

Never store large image binaries directly in PostgreSQL.

Store Cloudinary identifiers and URLs in Supabase.

Use secure upload patterns and validate:

* File type
* File size
* Upload ownership

---

### Rule 9 — API and Domain Logic Must Be Platform Independent

The system will eventually support:

* Web
* iOS
* Android

The mobile application must consume the same backend.

Do not implement business rules exclusively inside Next.js UI components.

Shared:

* Types
* Validation
* API contracts
* Matching logic
* Domain rules
* Design tokens

Web-specific:

* Web UI
* Desktop navigation
* Browser APIs

Mobile-specific:

* Native navigation
* Native interactions
* Push notifications
* Device APIs

---

### Rule 10 — Prefer a Modular Monolith

Do not create microservices for MVP.

Use clear modules:

```text
auth
profiles
interests
matching
discovery
connections
messaging
notifications
moderation
```

Each module should have clear responsibilities.

Extract services only when real scaling or operational requirements justify it.

---

## 3. Recommended Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

### Data

* Supabase PostgreSQL
* Drizzle ORM where application-level database abstraction is required
* Supabase migrations

### Authentication

* Supabase Auth

### Validation

* Zod
* React Hook Form

### Client Data

* TanStack Query where server-state management is beneficial
* Zustand only for lightweight client-side state that genuinely requires global access

### Media

* Cloudinary

### Monorepo

* pnpm
* Turborepo

### Mobile Roadmap

* Expo
* React Native

### Infrastructure

* Vercel for web deployment
* GitHub Actions for CI/CD
* Cloudflare where CDN/DNS capabilities are required

### Monitoring

* Sentry

### Product Analytics

* PostHog

Do not introduce Redis, Kafka, OpenSearch, or microservices during the initial MVP unless explicitly required by measured performance problems.

---

## 4. Monorepo Structure

Use:

```text
apps/
  web/
  mobile/
  admin/

packages/
  api-client/
  database/
  auth/
  domain/
  matching/
  validation/
  types/
  design-tokens/
  ui-web/
  ui-mobile/
  config/

tooling/
  eslint/
  prettier/
  typescript/
```

Do not create empty packages just for architectural appearance.

Start with only what the MVP needs.

---

## 5. MVP Feature Scope

### Required

* Authentication
* Onboarding
* Profile creation
* Profile editing
* Interests
* Skills
* Goals / looking for
* Campus/community
* People discovery
* Match scoring
* Match explanation
* Connection requests
* Connections
* One-to-one messaging
* Notifications
* Block user
* Report user
* Basic admin moderation
* Analytics events

### Excluded from MVP

Do not implement:

* Video calls
* Voice calls
* Complex group chat
* AI chatbot
* AI-generated profiles
* Advanced recommendation ML
* Microservices
* Cryptocurrency
* Payments
* Marketplace
* Complex event management
* Multi-region infrastructure

---

## 6. Matching Rules

Start with deterministic scoring.

Recommended initial model:

```text
Shared Interests        40%
Complementary Skills    25%
Shared Goals            20%
Same Campus             10%
Recent Activity          5%
```

The result must explain itself.

Example:

```text
You both like:
React
Technology
UI/UX

You may complement each other:
Frontend Development
Product Design
```

Do not claim an arbitrary percentage is scientifically accurate.

Use match percentages as a product UX representation of the internal score.

---

## 7. Security

Every protected operation must verify authorization server-side.

Implement:

* Supabase Auth
* Row Level Security
* Input validation
* Rate limiting where appropriate
* Secure headers
* File upload restrictions
* Block/report functionality
* No sensitive data exposure

Never return:

* Password hashes
* Private authentication metadata
* Internal secrets
* Service-role keys

Never expose Supabase service-role credentials to the browser.

---

## 8. Development Workflow

For every feature:

1. Explore the repository.
2. Identify existing patterns.
3. Create a short implementation plan.
4. Implement the smallest complete vertical slice.
5. Reuse existing components.
6. Validate inputs.
7. Add tests for business logic.
8. Run lint.
9. Run type-check.
10. Run tests.
11. Run build.
12. Review the diff.
13. Check the 500 LOC rule.
14. Document significant architectural decisions.

Do not rewrite working code unnecessarily.

---

## 9. Definition of Done

A feature is complete only when:

* It works on mobile.
* It follows `DESIGN.md`.
* It has no obvious accessibility violations.
* It has loading states.
* It has empty states.
* It has error states.
* It validates user input.
* It handles authorization.
* It has appropriate tests.
* It passes type-checking.
* It passes linting.
* It builds successfully.
* No source file exceeds 500 LOC.

---

## 10. Agent Decision Priority

When requirements conflict, prioritize:

1. Security
2. Data integrity
3. User experience
4. Accessibility
5. Maintainability
6. Performance
7. Scalability
8. Developer convenience

Prefer simple, reversible decisions during MVP.

Do not prematurely optimize for millions of users.

Build the architecture so it can evolve toward scale without implementing unnecessary infrastructure today.
