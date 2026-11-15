# Law Academy — internal academic review register (2026-11-15)

**Status:** Automated source/structure triage completed; independent legal and academic review NOT completed.  
**Scope:** Draft PR #8 only. No website, lesson identifiers, academic results or student records altered.

## Authored content recognized in the current repository

| Area | Courses | Authored lessons | Dated bounded source-check markers | Triage flags* |
|---|---:|---:|---:|---:|
| Pre-Law | 6 | 85 | 0 | 85 |
| 1L | 7 | 128 | 0 | 128 |
| 2L | 7 | 70 | 0 | 70 |
| 3L | 7 | 70 | 70 | 29 |
| **Total** | **27** | **353** | **70** | **312** |

*Each flagged lesson has at least one review-queue condition: short reading, missing direct primary-law URL in lesson text, missing bounded dated source-check metadata, or an absent written assignment (for post-Pre-Law material). A missing URL or marker is not proof of legal error; a present marker is not legal approval.

**Important:** The present bar simulator's base bank contains 12 questions and 2 writing tasks; additional bank supplements may extend those counts. It is a formative examination destination, **not evidence that an additional seven-course fifth academic level is complete**. The audit does not assign a graduation or equivalence designation.

## Prioritized qualified-review workflow

1. **Jurisdiction and effective dates.** For each flagged lesson, identify federal/state jurisdiction and the applicable date. Compare asserted rules against current primary sources; flag law that differs by state, circuit, or tax year.
2. **Primary authority mapping.** Identify the precise statute, rule, regulation, or reported case supporting each legal proposition. Distinguish agency guidance from a binding holding and record statutory amendments.
3. **Subsequent case treatment.** Independently check reversal, abrogation, limitation, or conflicting appellate authority using an appropriate up-to-date legal citator. A public opinion URL alone cannot establish good-law status.
4. **Doctrinal and case accuracy.** Have a qualified reviewer assess factual posture, legal issue, holding, dicta, procedure, conflicting reasoning and hypothetical application. Record corrections with citations and reasoning.
5. **Teaching depth and evaluation.** Review issue-spotting skills, worked answers, counterarguments, writing rubrics, actual learning outcomes and exam integrity; separate practice responses from qualified human grades.
6. **Level 5 scope review.** Define a genuine course-based Level 5 syllabus independently from the existing bar-preparation simulator before making any claim of five-level curricular completion.

## Hard boundaries

- Source-marker presence and word counts are **triage signals only**, not verified legal accuracy.
- No independent attorney, professor, accreditation body, or bar examiner has signed off through this automated audit.
- Do not retroactively mark legal-source checks as approved, grant completion, assign grades or treat an automatically generated report as professional review.
- Preserve student grades, essays, local saved-work keys, authentication and Firebase snapshots.
- All changes remain on the audit branch until a separate explicit merge approval.

## Reproduction

`node scripts/audit-five-level-readiness.mjs`

Outputs:
- `audit/five-level-academic-review-queue.csv`
- `audit/five-level-readiness-summary.json`

The GitHub Actions job **Law Academy independent-review preparation** uploads both files as an artifact for review without committing generated student or curriculum changes.
