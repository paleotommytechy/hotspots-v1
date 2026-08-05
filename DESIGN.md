# DESIGN.md

# Hotspots — Design System

## 1. Design Philosophy

The product is a social discovery platform centered around shared passions, skills, hobbies, and professional interests.

The interface must feel:

* Warm
* Human
* Trustworthy
* Modern
* Social
* Approachable
* Premium without being luxurious
* Simple without feeling empty

The design must be **mobile-first**.

The primary visual inspiration is a modern iOS application.

Do not imitate Apple's interface literally.

Instead, adopt the principles:

* Clear hierarchy
* Strong typography
* Generous spacing
* Rounded surfaces
* Simple navigation
* Bottom sheets
* Native-feeling interactions
* Subtle motion
* Minimal visual clutter

---

## 2. Core UX Principle

The application should always answer:

> "Why should I care about this person?"

Every discovery card should communicate:

1. Who they are.
2. What they care about.
3. Why they match.
4. What they are looking for.

Example:

```text
Alex Johnson
Frontend Developer

React · TypeScript · UI/UX

87% Match

You both enjoy:
React
Technology
Design

Looking for:
People to build projects with

[Connect]
```

Avoid generic social media feeds during MVP.

The primary experience is **discovery and connection**.

---

## 3. Color System

The supplied palettes should be treated as a unified visual vocabulary.

Do not use every color equally.

Use the darker palette for primary brand identity and the lighter palettes for supporting UI.

### Primary Brand Colors

```text
Primary Red:       #C62828
Primary Orange:    #F57C00
Primary Green:     #2E7D32
Dark Gray:         #2B2B2B
```

### Warm Palette

```text
Beige:             #F3E5AB
Light Yellow:      #FFF3C4
Yellow-Orange:     #FFC857
```

### Natural Palette

```text
Light Green:       #A1C181
Teal:              #619B8A
Dark Blue:         #233D4D
```

### Deep Palette

```text
Dark Green:        #203C3B
Slate Blue/Green:  #447270
Light Slate:       #6B9493
Yellow:            #F6E271
Golden Yellow:     #F6B915
Orange:            #F69312
```

### Muted Palette

```text
Muted Red:         #C94B4B
Cream:             #EAE3C3
Sage Green:        #9BB6A1
Teal:              #3B7B7A
Charcoal:          #414643
```

---

## 4. Semantic Tokens

Map colors to semantic roles.

```text
Primary:
#C62828

Primary Hover:
#A91F1F

Secondary:
#F57C00

Success:
#2E7D32

Info:
#619B8A

Accent:
#FFC857

Background:
#FFF3C4

Surface:
#FFFFFF

Warm Surface:
#F3E5AB

Text:
#2B2B2B

Muted Text:
#414643

Border:
#EAE3C3

Dark Surface:
#203C3B

Dark Text:
#233D4D
```

Do not hardcode these values repeatedly.

Create design tokens and reference them through Tailwind/theme configuration.

---

## 5. Color Usage Rules

The application must not become visually dominated by red, orange, or yellow.

Recommended visual balance:

```text
Neutral / Cream / White
        60–70%

Dark Text / Deep Colors
        20–25%

Brand Colors
        5–10%

Accent Colors
        <5%
```

Use:

### Red

For:

* Primary brand moments
* Important CTAs
* Destructive actions
* Important emphasis

Do not use red for every button.

### Orange

For:

* Secondary CTAs
* Discovery highlights
* Active states
* Energy and engagement

### Green

For:

* Success
* Verified states
* Positive connection status
* Confirmation

### Teal

For:

* Community
* Interests
* Discovery
* Informational UI

### Yellow

For:

* Match highlights
* Interest badges
* Friendly attention states

### Dark Blue / Dark Green

For:

* Headers
* Navigation
* High-contrast sections
* Premium visual anchors

---

## 6. Typography

Prioritize readability.

Use a modern sans-serif typeface.

Recommended hierarchy:

```text
Display
32–40px

Page Title
28–32px

Section Heading
20–24px

Card Title
17–20px

Body
15–17px

Secondary
13–15px

Caption
11–13px
```

Use font weight intentionally.

Avoid excessive bold text.

Use line height generously for body content.

---

## 7. Spacing

Use a consistent spacing system.

Preferred base unit:

```text
4px
```

Common values:

```text
4
8
12
16
20
24
32
40
48
64
```

Mobile screens should generally use:

```text
16px
```

horizontal page padding.

Do not overcrowd screens.

---

## 8. Border Radius

Use rounded surfaces.

Recommended:

```text
Small:
8px

Controls:
10–12px

Cards:
16–20px

Large Containers:
24px

Bottom Sheets:
24px top corners
```

Avoid excessive pill-shaped UI.

Use pills primarily for:

* Interests
* Skills
* Tags
* Filters
* Status indicators

---

## 9. Shadows

Use subtle shadows only.

The visual language should feel like modern iOS surfaces.

Avoid:

* Heavy drop shadows
* Neumorphism
* Excessive glassmorphism
* Excessive gradients

Glass effects may be used sparingly for:

* Floating navigation
* Modal overlays
* Special hero elements

Never use glassmorphism if it reduces text readability.

---

## 10. Mobile Navigation

Primary mobile navigation should use a bottom navigation bar.

Recommended:

```text
Home
Discover
Connections
Messages
Profile
```

Use Lucide icons.

The active item should use the primary brand color.

Keep labels visible.

Do not rely on icons alone.

---

## 11. Desktop Navigation

Desktop may use:

* Sidebar
* Top navigation
* Hybrid navigation

The desktop experience should preserve the same information architecture as mobile.

Do not simply stretch mobile cards across a desktop screen.

Use responsive layouts.

---

## 12. Core Screens

### Landing

Purpose:

Explain the value proposition.

Primary CTA:

```text
Find Your People
```

Secondary:

```text
Explore Interests
```

---

### Onboarding

Flow:

```text
Welcome
↓
Basic Profile
↓
Campus
↓
Interests
↓
Skills
↓
Looking For
↓
Profile Photo
↓
Complete
```

Keep onboarding short.

Show progress.

Do not ask for unnecessary information.

---

### Discover

Primary screen of the MVP.

Sections:

```text
Recommended For You
People With Similar Interests
People You May Complement
```

Each card should explain the match.

---

### Profile

Show:

* Photo
* Name
* Bio
* Campus
* Interests
* Skills
* Goals
* Connection status

Keep the profile focused.

---

### Connections

Separate:

```text
Requests
Connections
```

Use clear status indicators.

---

### Messages

Keep MVP messaging simple.

One-to-one conversations only.

Show:

* Avatar
* Name
* Last message
* Timestamp
* Unread state

---

## 13. Components

Prioritize reusable components:

```text
Button
Input
Avatar
Badge
InterestChip
SkillChip
ProfileCard
MatchCard
ConnectionButton
BottomSheet
Modal
EmptyState
LoadingState
ErrorState
Toast
```

Use shadcn/ui primitives where suitable.

Use Lucide icons.

Do not create duplicate components with slightly different names.

---

## 14. Match Cards

Match cards are the most important component in the product.

They must include:

```text
Profile photo
Name
Role / headline
Top interests
Match explanation
Connection CTA
```

Avoid displaying too many statistics.

The user should understand the match in less than 5 seconds.

---

## 15. Interaction Design

Use subtle animation for:

* Screen transitions
* Card appearance
* Button feedback
* Connection actions
* Bottom sheets

Animation should be fast and purposeful.

Avoid decorative animations that slow down the experience.

Respect reduced-motion preferences.

---

## 16. Loading States

Use skeletons for:

* Profile cards
* Discovery lists
* Messages
* Profile pages

Do not show blank screens while loading.

---

## 17. Empty States

Every major screen needs an intentional empty state.

Example:

```text
No new connections yet.

Your next great connection could be one interest away.

[Discover People]
```

Empty states should guide users toward the next action.

---

## 18. Error States

Errors must be human-readable.

Avoid:

```text
Error 500
```

Prefer:

```text
Something went wrong.

We couldn't load your recommendations.

[Try Again]
```

---

## 19. Accessibility

All UI must support:

* Keyboard navigation on web
* Visible focus states
* Screen reader labels
* Sufficient contrast
* Large touch targets
* Reduced motion
* Semantic HTML

Do not rely on color alone to communicate status.

---

## 20. Responsive Strategy

Mobile:

```text
320–767px
```

Tablet:

```text
768–1023px
```

Desktop:

```text
1024px+
```

Design mobile first.

Use responsive layouts rather than separate duplicated pages.

---

## 21. Visual Anti-Patterns

Never introduce:

* Neon gradients
* Excessive glassmorphism
* Heavy skeuomorphism
* Excessive shadows
* Tiny touch targets
* Dense desktop tables on mobile
* Random colors
* Excessive rounded pills
* Unnecessary animations
* Generic dashboard layouts

The product should feel like a **warm, modern social discovery application**, not a corporate administration system.

---

## 22. Design Success Criteria

A new user should be able to:

1. Understand the product immediately.
2. Complete onboarding quickly.
3. See why another person is recommended.
4. Send a connection request without confusion.
5. Navigate the application with one hand.
6. Complete core tasks without reading instructions.

The interface should feel calm, friendly, and trustworthy.

The design system exists to make the social experience feel human—not to showcase visual effects.
