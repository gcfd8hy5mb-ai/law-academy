# Pre-Law Level 1 — Academic Quality Review, Phase 1
Date: 2026-10-31
Status: Internal curriculum/design audit, **not independent academic sign-off**

## Confirmed structure
- Six authored Pre-Law courses and 85 lessons, verified by the repository's content validator on commit c85cf07.
- Each lesson has instructional sections and a formative multiple-choice question with an explanatory answer.
- Browser flow tests cover lessons, exams, writing, case scenarios, oral notes, research portfolio, persistence and graduation restrictions.
- The Level 1 progress screen correctly separates nine formative milestones from independent written-work evaluation and supervised final evaluation. Graduation stays locked.

## Critical distinction
Authoring 85 lessons is **not** equivalent to a student's passing them, a formal university course, or verified mastery of law. The app cannot grant a degree, credit, bar eligibility or professional qualification.

## Audit findings and work queue

### P0 — Technical verification
The previous GitHub Actions browser workflow failed before executing tests because Playwright WebKit 1.56.1 was incompatible with the ubuntu-26.04 runner. The browser job was pinned to ubuntu-24.04 in c85cf07. Confirm the new run actually passes; inspect individual failures and screenshots/traces if not. The syntax/content job passed separately.

### P0 — Independent doctrinal and citation review (still outstanding)
Existing reference documents describe introductory content, not a verified casebook-equivalent course. For **each** lesson, record a current primary source (constitution, statute, regulation or case where appropriate), jurisdiction, retrieval/check date, authoritative holding/rule, and whether the source fully supports the teaching and quiz explanation. Escalate outdated or jurisdiction-dependent statements for revision. A qualified reviewer must check the source/statement correspondence.

### P1 — Assessment rigor
A single formative question per lesson cannot establish deep mastery. For each course, create a blueprint with topic coverage, several independent issue-spotting problems, explanations of wrong choices, realistic multi-step fact patterns, source-supported analysis prompts, and rubric-based written work. Measure performance separately from word count or mere submission. Avoid repeating answer patterns.

### P1 — Feedback, fairness and practice quality
Assess legal writing using explicit IRAC/CRAC-based criteria: issue identification, accurate rule, authority and jurisdiction, application to favorable/adverse facts, counterarguments, and qualified conclusion. A minimum word count is a drafting indicator only. Mark unsupervised auto-feedback as practice guidance, not final grading.

### P1 — Research and ethics
Train students to distinguish binding from persuasive authority, check whether precedent remains good law, use primary over secondary sources for dispositive rules, and distinguish ABA Model Rules from locally adopted ethical rules. Include dated sources and jurisdiction context in hypotheticals.

### P2 — Student readiness and app experience
Confirm saved responses survive reload and reconnection on iPhone Safari, home-screen PWA and desktop. Test keyboard/screen reader labels, narrow layout, back navigation, writing export and reset/recovery workflows. Do not change localStorage keys without an explicit migration.

## Reviewed materials
- `scripts/validate-content.mjs`
- `tests/flows.spec.mjs`
- `.github/workflows/validate.yml`
- `curriculum/LAW102-sources-and-outcomes.md`
- `curriculum/LAW103-104-sources-and-outcomes.md`
- `curriculum/LAW105-106-sources-and-outcomes.md`
- `curriculum/law-school-benchmarks.json`
- `curriculum/LEVEL1-GRADUATION-STANDARDS.md`
- `app.js` lesson and progress-screen examples

## Status and next decision
Curriculum **authored**, not independently certified. Preserve Level 1 lessons and student progress; complete a verified source-and-rubric matrix and browser suite before declaring the Pre-Law development phase closed. Independent academic sign-off is a separate later step, not something an automated script or AI-only review can certify.
