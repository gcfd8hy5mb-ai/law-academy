# Law Academy — curriculum Batch 8 (2026-11-13)
**Scope:** Curriculum authoring and internal assessment controls only.
**Branch:** `integration/level4-audit-level5-20261112`; draft PR #6. No production merge, redesign or Firebase changes.

## Authored
Added `level2-instructional-depth-batch8-2026.js` with 12 original case-specific instructional supplements (approximately **1,246 words**) in existing Level 2 subject courses:
- Criminal law `L2-4-4` to `L2-4-9`: defensive force, attempt, exclusion/inevitable discovery, emergency entry versus digital search, double jeopardy, and custody/right-to-counsel.
- Constitutional law `L2-5-5` through `L2-5-10`: public forums and permits, cellphone search, school speech, equal-protection intent, enumerated commerce authority, and private/state conduct.

Each supplement develops the existing fictional fact pattern, examines opposing positions, tests an altered fact and requires a written legal product. Claims about exact jurisdictional rules, subsequent precedent and available remedies require current primary-source verification; these are educational illustrations.

## Completed automated checks
The integration workflow [run 43457722849](https://github.com/gcfd8hy5mb-ai/law-academy/actions/runs/43457722849) **PASSED** at commit `0ce90a719af4d637a12a560ea211240bdf09dba6`.
- `scripts/verify-level2-depth-batch8.cjs` confirms 12 targets and retention of all **128 Level 2 lesson IDs, existing case problems, quiz questions, keyed answers and feedback explanations**; subsequent overlay loading is idempotent.
- Whole program remains **34 courses, 523 unique lesson IDs and 523 structurally valid lesson questions**.
- Level 2 lesson `reading` fields with fewer than 220 words decreased from **39 to 27** after loading the new supplements. Main reading field total is **32,485 words**, excluding other external instructional materials.
- Level 4 still has **24** main reading fields below the 220-word screening cutoff in the assembled curriculum data, even though independent case labs and worked explanations are available. An under-threshold field does **not** prove the total lesson is deficient.
- Level 5 contains 140 authored lesson assignments after the supplemental assignment module loads.

## Open review
1. Assess 27 remaining Level 2 readings *in context* with separate practice modules; expand only specific deficiencies.
2. Review the 24 flagged Level 4 main reading fields with the corresponding case laboratories, worked guides and assessment rubrics. Do not mechanically add filler.
3. Independently verify cited rules/case holdings and subsequent treatment, jurisdiction and effective dates.
4. Validate academic progression and actual written final quality through trained human grading. The generated 34-course exam blueprint is a coverage inventory, not a complete performance exam calibration or a claim of bar eligibility.

No change to learner answers, progress identifiers, grades, local storage keys, Firebase, deployment or approved visual theme.
