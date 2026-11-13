# Law Academy — primary-law accuracy Batch 1, five-level review register
**Date:** 2026-11-13
**Branch:** `integration/level4-audit-level5-20261112`; Draft PR #6.
**Scope:** education-only primary-law notes and reproducible research queues. No live Firebase, saved records, website design, deployment or merge.

## Bounded actual legal-source checks
This batch selected specific legal propositions and checked published source texts, then appended careful, non-destructive practice notes to eight lessons. A checked proposition is **not** certification of the rest of its lesson, all facts, governing forum or later citation history.

| Source | Verified narrow proposition | Original lessons supplemented |
|---|---|---|
| *Loper Bright Enterprises v. Raimondo*, 603 U.S. 369 (2024), June 28, 2024 | Under APA § 706 courts use independent judgment as to the best statutory reading. Chevron's automatic ambiguity-based judicial deference was overruled. Valid congressional delegations and persuasive agency interpretations remain distinct questions. | L3-3-1, L3-3-2, L4-5-1, L5-6-2 |
| *United States v. Rahimi*, 602 U.S. 680 (2024), June 21, 2024 | The Court rejected a facial challenge to 18 U.S.C. § 922(g)(8), emphasizing its constitutionality for a court-found credible threat. It did not decide every possible application or demand historical twins. | L5-1-2 |
| Federal Rule of Evidence 702, amendment effective December 1, 2023 | The proponent must demonstrate expert-admissibility prerequisites by a more-likely-than-not standard; factual basis, reliability of methods and reliable application must be examined by the court. | L3-1-9, L4-1-4, L5-4-1 |

**Research sources:** https://www.supremecourt.gov/opinions/23pdf/22-451_7m58.pdf ; https://www.supremecourt.gov/opinions/23pdf/22-915_8o6b.pdf ; https://www.law.cornell.edu/rules/fre/rule_702 .

### What changed
- Added `law-crosslevel-primary-source-crosschecks-20261113.js` with eight targeted original source notes: procedural posture, limits on the holding, contrasting arguments, changed-fact questions and a source reference. Existing original teaching text, lesson IDs, problem scenarios, quizzes, answer keys and exam structures remain intact.
- Added `scripts/verify-crosslevel-source-crosschecks-20261113.cjs` to enforce exactly eight unique lessons, all 310 Level 3–5 stable lesson IDs, unchanged original exam/assessment objects and idempotent load behavior.
- Added `scripts/audit-five-level-primary-law-review.cjs` to produce `audit/five-level-primary-law-523-lesson-review-register.csv` across the 34-course, 523-lesson program.
- The source register records the three bounded legal areas for the eight affected lessons, while marking **all** broader source-law jurisdictional validity, effective-date checks, subsequent treatment and written exam review PENDING. It does **not** invent an independent reviewer, mark any lesson certified or use source URL presence as proof of current legal validity.
- GitHub Actions academic integration now runs both checks and uploads the full source-review queue for future independent legal accuracy review.

### Scope and limitation
The five levels have drafted curricular material, but independent doctrinal completeness, bar-topic coverage, fidelity to all primary sources, effective-date applicability and representative examiner-graded student work remain **unverified**. The automated pass is only proof that source notes were attached to the intended lessons without breaking existing saved progress, and that the review queue is complete.

### Next curriculum-only substantive review
1. Select high-impact authority issues from each course and check exact cited holding, operative rule text, historical effective date and governing jurisdiction. Record legal corrections where a concrete error is established.
2. Inspect cross-references and previously authored current-law overlays for contradictions, especially administrative review, evidence, criminal procedure and constitutional remedies.
3. Give a qualified attorney/academic the 523-row register and representative written final scripts for real substantive review and grading; do not report sign-off until it actually occurs.

**Production constraints:** Do not merge or deploy Draft PR #6 without explicit owner authorization; keep Firebase and redesign separate.
