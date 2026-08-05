# ARCHITECTURE.md

# Hotspots — MVP Architecture

## 1. Architectural Objective

Build a zero-dollar MVP capable of validating an interest-based matchmaking platform while maintaining a clear path toward:

```text
Single Campus
↓
Multiple Campuses
↓
National Network
↓
Millions of Users
```

The MVP must prioritize:

* Low infrastructure cost
* Fast development
* Strong security
* Maintainability
* Mobile-first UX
* API portability
* Incremental scalability

Do not prematurely implement distributed microservices.

The recommended initial architecture is a **modular monolith**.

---

## 2. High-Level Architecture

```text
Web Client
Next.js
   │
   ▼
Application / API Layer
   │
   ├── Auth
   ├── Profiles
   ├── Interests
   ├── Matching
   ├── Discovery
   ├── Connections
   ├── Messaging
   ├── Notifications
   └── Moderation
   │
   ▼
Supabase
   ├── PostgreSQL
   ├── Auth
   ├── RLS
   └── Realtime
   │
   ▼
Cloudinary
   └── User Media
```

The backend must remain independent enough to support:

```text
Next.js Web
Expo Mobile
React Native Mobile
Admin Portal
Future Third-Party Clients
```

---

## 3. Technology Stack

### Web

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

### Backend

* Next.js server-side application layer initially
* Supabase PostgreSQL
* Supabase Auth
* Supabase RLS
* Supabase Realtime

### Database Access

* Drizzle ORM where useful
* Supabase migrations

Use one source of truth.

---

### Validation

* Zod
* React Hook Form

---

### State

* TanStack Query
* Zustand only for appropriate client-global state

---

### Media

* Cloudinary

---

### Monorepo

* pnpm
* Turborepo

---

### Deployment

* Vercel
* GitHub Actions
* Cloudflare where required

---

### Monitoring

* Sentry

---

### Analytics

* PostHog

---

### Future Mobile

* Expo
* React Native

---

## 4. Monorepo

Recommended:

```text
apps/
  web/
  mobile/
  admin/

packages/
  api-client/
  auth/
  database/
  domain/
  matching/
  validation/
  types/
  design-tokens/
  ui-web/
  ui-mobile/
  config/
```

The MVP may initially contain only:

```text
apps/web

packages/
  database
  types
  validation
  matching
  design-tokens
  ui-web
```

Add packages when they provide real value.

---

## 5. Domain Modules

Organize backend functionality around business domains.

```text
auth
profiles
interests
skills
goals
campuses
matching
discovery
connections
messaging
notifications
moderation
```

Each domain should separate:

```text
Routes / API
Application Logic
Domain Logic
Data Access
Validation
Types
```

Do not place all business logic in route handlers.

---

## 6. Database

Supabase PostgreSQL is the primary database.

Core tables:

```text
users
profiles
campuses
interests
skills
goals

user_interests
user_skills
user_goals

connections
connection_requests

conversations
conversation_members
messages

notifications

reports
blocks
```

Future tables:

```text
communities
community_members
events
```

Do not build future tables unless required by current functionality.

---

## 7. Database Rules

Use normalized relationships.

Prefer:

```text
user_interests
```

over storing:

```text
"React, TypeScript, AI"
```

as a single string.

Use foreign keys.

Add indexes to frequent query paths.

Initial indexes should cover:

```text
user_id
interest_id
skill_id
goal_id
campus_id
created_at
```

Use composite indexes only when query patterns justify them.

---

## 8. Row Level Security

RLS is mandatory for user-owned data.

Users should be able to:

* Read public profiles.
* Edit their own profile.
* Manage their own interests.
* Manage their own connection requests.
* Access conversations they belong to.
* Read messages in their conversations.

Users must not:

* Modify another user's profile.
* Read another user's private messages.
* Access administrative data.
* Bypass connection permissions.

Admin actions require explicit authorization.

---

## 9. Authentication

Use Supabase Auth.

MVP:

```text
Email + Password
Email Verification
Password Reset
```

Optional:

```text
Google OAuth
```

Do not implement custom authentication.

Do not store passwords manually.

Do not expose service-role credentials in client code.

---

## 10. Profile Model

A profile should contain:

```text
display_name
username
avatar_url
bio
campus_id
department
level
interests
skills
goals
social_links
```

Do not make every field mandatory.

The MVP should optimize for profile completion without creating onboarding friction.

---

## 11. Matching Algorithm

Start deterministic.

Candidate pipeline:

```text
User
↓
Filter blocked users
↓
Filter existing connections
↓
Filter incompatible visibility
↓
Filter by campus/community where appropriate
↓
Generate candidates
↓
Calculate score
↓
Rank candidates
↓
Return top results
```

Initial scoring:

```text
Shared Interests       40%
Complementary Skills   25%
Shared Goals           20%
Same Campus            10%
Recent Activity         5%
```

The algorithm must be deterministic.

Create:

```text
calculateMatchScore()
```

and:

```text
explainMatch()
```

The explanation should be generated from actual matching factors.

Never invent match reasons.

---

## 12. Discovery

Do not compare every user against every other user.

MVP candidate generation:

```text
Campus
↓
Interest overlap
↓
Skill compatibility
↓
Goals
↓
Activity
```

At larger scale:

```text
Candidate Generation
↓
Search / Vector Retrieval
↓
Ranking
↓
Top Recommendations
```

Potential future technologies:

* pgvector
* Typesense
* OpenSearch
* Elasticsearch

Do not add these to MVP unless PostgreSQL search becomes insufficient.

---

## 13. Connections

Connection states:

```text
none
pending
accepted
rejected
blocked
```

Actions:

```text
Send
Accept
Reject
Cancel
Remove
Block
Report
```

Connection requests must be rate limited.

Prevent duplicate pending requests.

Prevent requests between blocked users.

---

## 14. Messaging

MVP supports one-to-one messaging.

Use Supabase Realtime where appropriate.

Message lifecycle:

```text
Client
↓
Validate
↓
Authorize
↓
Persist
↓
Realtime Event
↓
Recipient
```

Do not implement:

* Group chat
* Voice
* Video
* File sharing

during initial MVP.

---

## 15. Cloudinary

Cloudinary is responsible for user-uploaded media.

Upload flow:

```text
Client
↓
Validate file
↓
Secure upload
↓
Cloudinary
↓
Return asset metadata
↓
Save URL/public ID in Supabase
```

Validate:

* MIME type
* File size
* Ownership

Optimize images for device size.

Use responsive transformations.

---

## 16. API Design

API contracts must be typed.

Example:

```text
GET    /api/discovery
GET    /api/profiles/:id
POST   /api/connections
PATCH  /api/connections/:id
GET    /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
```

The exact API implementation may use Next.js route handlers or server actions where appropriate.

However, business logic should not depend on a specific frontend.

---

## 17. Scaling Strategy

### 0–10,000 Users

Use:

```text
Next.js
Supabase
PostgreSQL
Cloudinary
Vercel
```

Architecture:

```text
Modular Monolith
```

---

### 10,000–100,000 Users

Consider:

```text
Redis
Background Jobs
Dedicated Search
CDN
Rate Limiting
```

Architecture:

```text
Modular Monolith
+
Asynchronous Workers
```

---

### 100,000–1,000,000 Users

Consider:

```text
Read Replicas
Dedicated Messaging
Search Infrastructure
Recommendation Service
Notification Workers
```

Extract only proven bottlenecks.

---

### 1,000,000+ Users

Potential services:

```text
Identity
Profiles
Matching
Search
Messaging
Notifications
Moderation
Analytics
```

Do not split these services until operational requirements justify them.

---

## 18. Asynchronous Processing

The following operations may eventually become background jobs:

```text
Search indexing
Recommendation recalculation
Notifications
Analytics processing
Image processing
```

MVP can use simple server-side/background mechanisms.

Later:

```text
Queue
↓
Worker
↓
Process
```

Potential future stack:

```text
Redis
+
BullMQ
```

For very large workloads, evaluate event streaming technologies.

---

## 19. Security Threat Model

Protect against:

```text
Account takeover
Spam
Bots
Fake profiles
Unauthorized profile access
Message abuse
Malicious uploads
Data leakage
Rate-limit abuse
```

Required controls:

```text
Authentication
Authorization
RLS
Input validation
Rate limiting
Secure headers
Upload restrictions
Block
Report
Moderation
```

Never trust client input.

---

## 20. Observability

Track technical metrics:

```text
API latency
Error rate
Database performance
Realtime failures
Authentication failures
```

Track product metrics:

```text
Signup completion
Profile completion
Discovery views
Profile views
Connection requests
Accepted connections
First messages
7-day retention
30-day retention
```

Primary product health metric:

```text
Meaningful Connections per Active User
```

---

## 21. MVP Roadmap

### Phase 1 — Foundation

Build:

```text
Monorepo
Authentication
Database
RLS
Design System
Cloudinary
CI
```

---

### Phase 2 — Profiles

Build:

```text
Onboarding
Profile
Interests
Skills
Goals
Campus
```

---

### Phase 3 — Discovery

Build:

```text
Matching
Match Explanation
Discovery
Profile Viewing
```

---

### Phase 4 — Connections

Build:

```text
Requests
Accept
Reject
Block
Report
```

---

### Phase 5 — Messaging

Build:

```text
Conversations
Messages
Realtime
Unread State
```

---

### Phase 6 — Quality

Add:

```text
Loading States
Empty States
Error States
Accessibility
Analytics
Error Monitoring
```

---

### Phase 7 — Campus Launch

Launch to:

```text
100–500 users
```

Measure:

```text
Profile completion
Match interaction
Connection acceptance
First conversation
Retention
```

Do not scale infrastructure before validating the product loop.

---

## 22. Web-to-Mobile Strategy

The mobile application will be added as:

```text
apps/mobile
```

using Expo and React Native.

Share:

```text
Types
Validation
API Client
Domain Rules
Matching
Design Tokens
```

Do not force identical UI components.

Web:

```text
Next.js
Web UI
Desktop Navigation
```

Mobile:

```text
Expo
React Native
Bottom Navigation
Native Interactions
Push Notifications
```

Both consume the same backend.

---

## 23. Scaling Principles

Always follow:

```text
Measure
↓
Identify Bottleneck
↓
Optimize
↓
Measure Again
↓
Extract Service Only If Necessary
```

Do not introduce infrastructure because it is fashionable.

Do not introduce:

```text
Microservices
Kafka
Redis
Kubernetes
Dedicated Search
Vector Database
```

until a real requirement exists.

The MVP should remain operationally simple.

---

## 24. Architectural End State

The intended long-term evolution is:

```text
                   Web
                Next.js
                   │
                   │
                Mobile
            Expo / React Native
                   │
                   ▼
              API Layer
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     Profile    Matching    Messaging
        │          │          │
        └──────────┼──────────┘
                   ▼
             PostgreSQL
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
     Redis       Search      Storage
                  │          Cloudinary
                  │
                  ▼
            Recommendation
               Engine
```

The architecture must evolve incrementally.

The first objective is not to build the architecture for millions of users.

The first objective is to build a system that can create **real, meaningful connections between the first 100 users**.

Once that behavior is proven, the architecture can scale around the validated product.
