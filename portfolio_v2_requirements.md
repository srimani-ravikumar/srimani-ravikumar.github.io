# Portfolio v2 - Self Requirements Gathering

## Core idea

> ***Reverse engineered from end user experience to technology***

Two experiences, one set of content. The interactive layer is a lens over the real portfolio, not a rewrite of it.

## Entry Gate

Every reload asks the same question, no exceptions, no persisted state:

> "Before you start judging that this content has been written by AI…"

- **No, I believe this content was not written by AI** → static portfolio, immediately.
- **Yes, I have doubts. Clarify this.** → guided journey.

## The Journey (10 steps, fixed order)

1. **About** the person, before the résumé.
2. **Personal Projects** what was actually built.
3. **Engineering Thinking** the reasoning model (System Design, Concurrency, API Design, Observability, Testing, Distributed Systems), not a skills list.
4. **Experience** professional context and outcomes, unchanged from the static section.
5. **Technical Skills** depth behind the thinking.
6. **LeetCode** problem-solving checkpoint, opens externally, journey stays intact.
7. **Certifications & Awards** list of certifications and awards received.
8. **Education** where the foundation laid.
9. **Passion** the cricketer, the flip side.
10. **Final** "You've seen the context. Make your own judgment."

Each step: eyebrow (why this step exists) → heading → context line → content → actions. No competing focal points.

## Controls

| Action | Available | Effect |
|---|---|---|
| Continue → | every step | advance; from step 10, exits to static |
| One sec, let me go back ← | step 2+ | step back one |
| No, I want to revalidate again | step 10 only | restart from step 1 |
| Skip ahead / View full portfolio | every step | fail-safe exit to static |

No visitor gets stuck. No visitor is forced through all ten steps to reach the real content.

## Implementation Principle

Content lives once, in `#site-content`. The journey **borrows** the real section nodes (`.about-content`, `.projects-grid`, `.experience-timeline`, `.skills-grid`, `.certifications-grid`, `.education-timeline`, `.passion-content`) by re-parenting them into the journey view, and returns them on exit. Only three pieces of content (`How I Think`, `LeetCode` prompt, `Final` screen) exist solely for the journey, via `<template>`.

State is one attribute: `body[data-mode] = gate | interactive | static`. CSS does the showing/hiding; JS does the moving.

## What Was Deliberately Left Out

- No animation library, no SPA framework, no routing.
- No localStorage meaning the authenticity question is asked every reload, by design.
- No fabricated content anywhere in the journey meaning every step either reuses real portfolio content or states a genuine engineering opinion.

## Definition of Done (met)

- Reload always returns to the gate.
- No content duplicated, no content lost across back/revalidate/skip.
- Static path bypasses the journey entirely.
- Journey is fully keyboard and screen-reader-navigable (focus moves to each new heading).
