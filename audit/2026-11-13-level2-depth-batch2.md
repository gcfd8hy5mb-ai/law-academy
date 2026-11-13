# Law Academy — targeted Level 2 instructional-depth expansion, Batch 2
**Date:** 2026-11-13
**Branch:** `integration/level4-audit-level5-20261112` (draft PR #6).
**Scope:** substantive academic coursework only. Firebase, UI, student-record namespaces, exams and production untouched.

## Actual authored change
Added `level2-instructional-depth-batch2-2026.js`, loaded after `level2.js` and before `app.js`. This is an **additive lesson-reading overlay**, not a reindex or rewrite. It adds approximately **2,168 new words** across **14 lessons**, without modifying any lesson IDs, existing multiple-choice questions, keyed answers, explanations, problem text or local draft keys.

| Course | Foundational seminar | Second legal-analysis file |
|---|---|---|
| Contracts | `L2-1-1` goods/common-law offer and counteroffer analysis; UCC 2-207 issues | `L2-1-3` subcontractor bid reliance and estoppel remedies |
| Torts | `L2-2-1` duty, breach, causal links and alternative factual records | `L2-2-3` product design, manufacturing and warning theories |
| Civil Procedure | `L2-3-1` jurisdiction, pleading, venue and removal distinctions | `L2-3-3` claim/issue preclusion and nonparty limits |
| Criminal Law | `L2-4-1` offense-element mental states and mistake | `L2-4-3` attempt versus preparation, abandonment and impossibility |
| Constitutional Law | `L2-5-1` Article III, enumerated authority and remedy scope | `L2-5-3` equal protection purpose/impact and source distinction |
| Property | `L2-6-1` estate/future interest diagrams and deed interpretation | `L2-6-3` deed priority, possession and recording regimes |
| Research & Writing | `L2-7-1` binding precedent, historical posture and adverse law | `L2-7-3` objective case synthesis and source verification |

Each addition requires a more detailed fact-pattern analysis, alternative outcomes, jurisdiction/source distinction, an adverse or defensive theory and a concrete written product. Draft educational examples require jurisdiction-specific and later-treatment verification. They are not an independent attorney legal accuracy sign-off.

## Regression and continuation
- `scripts/verify-level2-depth-batch2.cjs` checks all 14 target lesson IDs, supplementary content and existence of writing/adversarial components, confirms **all 128 Level 2 lesson IDs and quiz items remain unchanged**, verifies correct browser script order and requires double-running the overlay to be idempotent.
- The five-level academic GitHub workflow runs that test and regenerates the full **523-lesson** reviewer inventory.
- Current lesson IDs remain stable; no existing scores, learner records, cloud data, unrelated curricula or website styling were altered.
- Curriculum work remaining: inspect the additional short `reading` fields in Level 2 beyond this 14-lesson batch; individually examine 23 short Level 5 assignment prompts together with their associated workshops, written finals and course exit expectations; continue the 24 short Level 4 readings and legal-authority review queues.

**Approval status:** Authored additions reviewed structurally by automated tests. Governing legal authority, academic comparability and human examination scoring remain PENDING.
