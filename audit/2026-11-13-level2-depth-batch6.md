# Law Academy — Level 2 instructional depth, Batch 6
Date: 2026-11-13
Development branch: `integration/level4-audit-level5-20261112`; draft PR #6. Curriculum-only; no merge, deployment, Firebase or student-record changes.

## Authored advanced instruction
Added `level2-instructional-depth-batch6-2026.js` with **15 distinct applied seminars and approximately 1,908 words**, appended to their existing readings (not replacing prior lessons, quiz keys, written work or stable progress IDs).

**Property (8 lessons):** `L2-6-10` habitability and lawful eviction; `L2-6-11` nuisance; `L2-6-12` servitude enforceability; `L2-6-13` zoning/takings; `L2-6-14` deed delivery; `L2-6-15` risk of loss before closing; `L2-6-16` concurrent owner accounting and partition; `L2-6-17` easement scope.

**Legal Research & Writing (7 lessons):** `L2-7-10` standards of review; `L2-7-11` quote/citation verification; `L2-7-12` negotiation and candor; `L2-7-13` objective legal prediction; `L2-7-14` analogies/distinguishing precedent; `L2-7-15` correcting reversed authority; `L2-7-16` timed multi-issue exam.

All supplements are based on the existing named fictional scenario, distinguish opposing legal arguments, vary material facts, call for source/jurisdiction checks and give individual work products. No claim that cited statutes or court decisions have undergone a contemporary certified citator review.

## Verification scope
- `scripts/verify-level2-depth-batch6.cjs` enforces exactly 15 targeted IDs; all **128** prior Level 2 identifiers, multiple-choice options, keyed answers, answer explanations and original problem texts preserved.
- Idempotent loading prevents duplicate append if the supplement runs twice.
- New source is loaded from `index.html` after other Level 2 teaching materials and before `app.js`.
- Five-level CI remains the enforcement point; its academic inventory accounts for the loaded supplements and retains the full **523 lesson** review queue.

## Outstanding academic work
- Re-audit the Level 2 under-220-word primary reading queue with all supplements loaded; short excerpts are indicators to investigate, not evidence of shallow total casework.
- Examine the **24 Level 4** short-primary-reading flags in context with separate case labs and worked guides rather than artificially padding text.
- Build a cross-level exam blueprint identifying explicit subject coverage, analytical depth, and written/capstone outcomes; independently assess source currentness and human grading.
- External professional/legal academic review remains pending. No accredited qualification or bar eligibility is implied.

**Deliberately deferred:** Firebase, cloud saving, redesign, physical device acceptance, and release.
