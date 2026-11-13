# Law Academy — Primary-Law Accuracy Review Batch 2
**Date:** 2026-11-13
**Branch:** `integration/level4-audit-level5-20261112` / Draft PR #6
**Status:** 11 original lesson-specific Supreme Court holding/limitation notes authored; automated integration and independent-review boundaries tracked separately.

## Specific legal sources checked
1. *Smith v. Arizona*, 602 U.S. 779 (June 21, 2024). When an expert communicates an absent analyst's supporting statements whose value depends on their truth, those assertions are offered for their truth even if called expert basis evidence. The Supreme Court left the issue of whether the statements in that case were testimonial for lower-court consideration. Source: https://www.law.cornell.edu/supremecourt/text/22-899 . **Five** targeted lessons: L3-7-9, L3-1-5, L4-2-4, L5-4-2 and L5-4-7.
2. *SEC v. Jarkesy*, 603 U.S. 109 (June 27, 2024). SEC securities-fraud civil penalties require the Seventh Amendment jury right; the holding does not categorically abolish all agency proceedings or all possible administrative enforcement remedies. Source: https://www.law.cornell.edu/supremecourt/text/22-859 . **Three** lessons: L3-3-4, L3-3-5, L4-5-3.
3. *Trump v. CASA, Inc.* (June 27, 2025). In emergency applications, the Supreme Court concluded the universal preliminary injunctions at issue likely exceeded federal traditional equitable authority, while leaving the underlying citizenship merits unresolved. Party-specific relief, Rule 23 classes, and statutory remedies require separate analysis; geographical reach alone is not a complete test. Source: https://www.law.cornell.edu/supremecourt/text/24A884 . **Three** lessons: L5-1-3, L4-4-9, L4-4-10.

## Actual coursework changes
`law-crosslevel-primary-source-crosschecks-batch2-20261113.js` appends approximately **1,497 original educational words across eleven existing Level 3-5 lessons**. Every note distinguishes a binding holding from questions left unresolved, applies the rule to the lesson's original scenario, tests a plausible opposing theory and requests a specific written legal product. These are careful additions, not a wholesale review of all American law and not an attorney's certification.

`scripts/verify-crosslevel-primary-source-batch2-20261113.cjs` checks exactly 11 distinct additions, 310 existing Level 3–5 stable lesson identifiers, original student exam/quiz questions, options, keyed answers, scenarios and assignments unchanged, correct browser ordering, and duplicate-load safety.

`scripts/audit-five-level-primary-law-review.cjs` now tracks **19 bounded source propositions in the 523-lesson inventory** (8 in Batch 1 plus 11 in Batch 2). Every lesson retains PENDING for jurisdiction-specific validation, effective-date application, subsequent case treatment and qualified academic/legal grading. A source URL or bounded proposition note is not counted as comprehensive legal accuracy verification.

## Academic integrity and next work
- Verify negative treatment, later statutory changes and controlling forum distinctions for each cited rule, not merely initial Supreme Court holdings.
- Prioritize conflict checks between older instructional sections and later add-on notes; if actual contradictions are found, make source-supported corrections rather than hiding errors behind appended paragraphs.
- Human legal/academic reviewers must examine the full 523-lesson queue, written-final scenarios, rubric calibration, and representative actual student work. No independent sign-off or bar exam eligibility claim is justified by these automated checks.
- No merges, deployments, student-progress changes, Firebase work or design changes.

**CI evidence:** academic integration run https://github.com/gcfd8hy5mb-ai/law-academy/actions/runs/43463119478 (verify terminal conclusion before reporting full pass).
