# Law Academy — curriculum depth Batch 4, 2026-11-13
**Location:** Draft integration PR #6, `integration/level4-audit-level5-20261112`.
**Scope:** curriculum-only authoring and audit reliability; production/Firebase and visual design unchanged.

## Authored instructional additions
Added `level2-instructional-depth-batch4-2026.js`, approximately **1,975 new words** across 14 distinct Level 2 lessons. Every case includes an identified legal problem, adverse position, changed fact, further source research and a concrete written product:
- Contracts: L2-1-11 to L2-1-16 (specific performance; mistaken assumptions; restitution; mitigation; alternative damage measures; online assent)
- Torts: L2-2-11 to L2-2-16 (conversion; public-official defamation; consent; responsibility allocation; premises injury; medical negligence)
- Civil Procedure: L2-3-11 and L2-3-12 (class certification and supplemental jurisdiction)

The added seminar material is appended only to the relevant preexisting `reading` fields. Student IDs, notes, quizzes, keyed responses, core problem statements, grades and Firebase records are untouched.

## Quality gates
`scripts/verify-level2-depth-batch4.cjs` protects all 128 Level 2 lesson IDs, all unchanged original `problem`/`question`/`options`/`answer`/`why` fields, and ensures new seminars are substantial, exhibit adverse positions and have counterfactual variations. Double execution must not duplicate content. This test and earlier Level 2/Level 5 content guards run in the existing combined academic CI.

The five-level academic inventory was corrected to load the **real supplementary Level 2 and Level 5 coursework scripts**, rather than counting only raw base files. This is a measurement correction, not an additional teaching-content claim. The corrected combined audit [GitHub Actions 43451963690](https://github.com/gcfd8hy5mb-ai/law-academy/actions/runs/43451963690) confirms:
- 34 courses / 523 unique lesson IDs / 523 valid assessment questions.
- Level 2: 128 lessons, 26,148 words in primary `reading` fields including all currently loaded supplements, **75 under the 220-word screening cutoff**. Earlier baseline count was 110, but raw and enhanced readings were not comparable until the audit was fixed; these are flags, not confirmed deficient lessons.
- Level 4: 100 lessons, **24 shorter `reading` fields** in the assembled instructional data, with supplementary worked guides and case labs excluded from word counts.
- Level 5: 140 lessons with **140 written work instructions** when the recently committed assignment overlay is loaded; all 140 have a case/application field.
- All external approval, primary-law later-treatment verification, human grades and academic sign-off fields remain unapproved.

## Remaining academic depth and quality review
1. Inspect 75 Level 2 shorter readings alongside existing case modules, avoiding padding where adequate support already exists.
2. Inspect 24 Level 4 short readings with all attached worked guides, overlays, questions and independent legal authority review records.
3. Compare written exam blueprints and the progression of difficulty across the five levels; subject-matter validity and doctrinal currentness need qualified human source verification.
4. Do not label the curriculum independently reviewed, JD-equivalent, bar-qualification-approved or production-ready based on automated structural testing.

**Deferred by user:** Firebase, cloud-saving changes, website redesign and device acceptance.
