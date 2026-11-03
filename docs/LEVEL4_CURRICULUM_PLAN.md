# Level 4 — Third-Year Law (3L): Development Blueprint

**Status:** scope and design authorized for development; coursework not yet authored or published.  
**Date:** November 3, 2026  
**Prerequisites:** preserve all existing Pre-Law, 1L and 2L/Level 3 content and progress keys. Level 3 is structurally authored but independent academic sign-off is outstanding.

## Educational objective
Advance from issue spotting and doctrinal analysis to supervised lawyering skills: interviewing, counseling, drafting, negotiations, discovery, advocacy, transactional design, regulation and professional judgment. Emphasize realistic legal tasks over additional generic summaries. Federal and state laws vary; each problem must state the operative jurisdiction and date.

## Proposed seven-course sequence (initial design, not a certification)
| Course ID | Course | Core competencies | Integrative deliverable |
|---|---|---|---|
| L4-1 | Advanced Civil Trial Practice | pleadings, discovery planning, motions, evidence, jury instructions, appeals | litigate a fictional commercial dispute from intake to judgment |
| L4-2 | Criminal Litigation and Defense/Prosecution | charging ethics, discovery, motions, plea negotiation, trial, sentencing | prosecution and defense case files with court-ready motions |
| L4-3 | Business Transactions, M&A and Negotiation | diligence, contract drafting, risk allocation, governance, regulatory conditions | acquisition agreement redlines and board memo |
| L4-4 | Constitutional and Appellate Advocacy | preservation, standards of review, appellate briefs, oral argument | adversarial appellate brief and argument |
| L4-5 | Administrative, Regulatory and Compliance Practice | agency investigations, rulemaking comments, enforcement, internal compliance | regulatory response and defensible remediation program |
| L4-6 | Client Counseling, Mediation and Professional Judgment | interviews, conflict checks, negotiation, settlement, privilege, client communication | confidential client portfolio and settlement exercise |
| L4-7 | Complex Practice, Remedies and Integrated Capstone | multi-party strategy, remedy selection, ethical issues, litigation and transactional intersection | multi-stage litigation/transaction simulation and full portfolio |

## Proposed pedagogy per lesson
1. Actual learning objectives and terms, not filler.
2. Statute, rule or reported decision clearly typed as such; reliable primary source and explicit research-as-of date.
3. A worked example with **facts → issues → governing law → adverse arguments → application → decision**.
4. A practical client/court document or numerical exercise with a worked explanation that reveals only after the student's own attempt.
5. Three increasingly difficult variants, with ambiguities and different outcomes.
6. A meaningful knowledge check addressing the *substantive* subject, not generic “verify the law” responses.
7. A course-level written final assessed against specific 100-point criteria by a qualified human examiner. No automated claim of bar readiness, credit, accreditation, or professional competence.

## Development and quality gates
- Stage A: author course architecture, mapping of dependencies and competencies; avoid duplication with Level 3's seven doctrinal courses.
- Stage B: expand substantive lessons and source-anchored casework in coordinated batches; distinguish pedagogical drafts from independently checked sources.
- Stage C: build a connected practice environment, issue maps, document editing, and assessment navigation in existing approved Supreme-Court / university-inspired visual style.
- Stage D: add substantive issue-specific examinations, rubrics, source validity checks and written portfolio requirements.
- Stage E: run automated curriculum validation, iPhone Safari and desktop checks, accessibility review, and progress/cloud synchronization acceptance tests before labeling the new level ready for learners.
- Stage F: qualified human legal-currency and academic review. Independently approved does not equal a law degree or bar eligibility.

## Critical transition defect to resolve
The existing `level3-ui.js` uses `localStorage` key `law-academy-level3-v1` for written Level 3 drafts and explicitly describes them as device-local. This is separate from the app's foundation progress key `law-academy-progress-v1`. Do **not** silently repoint these keys, replace existing data, overwrite cloud records, or claim cloud syncing has passed. Before promoting 3L or Level 4 to a ready state:
- Identify the actual connected cloud-save system and records, authentication scope, and conflict-resolution semantics.
- Back up current Level 3 drafts; implement non-destructive field-level merging that preserves nonempty writing on both devices.
- Check same-device reload, separate-device login, offline edits, two-device conflict, sign out/in, iOS installed PWA versus Safari origin behavior.
- Retain a manual export/restore pathway until cross-device saving is verified.

## Readiness status
- Level 3 authored lessons and distinct quizzes: structural data inspection passed November 3, 2026.
- GitHub Actions full suite: **not independently confirmed**.
- Human case-law currency / exam calibration: **open**.
- Level 3 cloud synchronization for written work: **open**.
- Level 4 source-verified lessons: **not yet developed**.

## Implementation checkpoint — November 3, 2026

- Seven initial Level 4 lessons are authored in `level4.js`.
- `level4-ui.js` adds navigation from seven course tracks to lessons, scenario and instructional reading, long-form writing, local draft persistence, a multiple-choice knowledge check with explanatory feedback, and manual backup.
- `app.js` now routes the Third-Year Law School catalog option to Level 4 and advertises the seven authored **draft** lessons. `index.html` loads the new data and UI scripts.
- Level 4 uses only the new browser-local key `law-academy-level4-v1`. **It does not read or change existing Pre-Law, Level 2, or Level 3 progress records.** Level 3 and 4 draft writings are not yet confirmed to synchronize via the existing cloud sign-in.
- `scripts/validate-level4.mjs` checks structure, navigation assets and draft-storage messaging. The existing GitHub Actions workflow now invokes the Level 4 checks alongside Level 3. A successful CI run or interactive Safari/desktop test remains to be confirmed.
- Lessons remain draft, not independently checked. A knowledge-check answer must not be presented as legal expertise, a law-school credit, or a certified examination result.

## Practical coursework expansion — 2026-11-03

- Level 4 now contains **21 authored draft lessons: three in each of seven course tracks** (initial seven plus fourteen newly added practical lessons). Main curriculum changes: `432790d`, `833e143`.
- New practice covers summary judgment and depositions, search suppression and plea counsel, M&A indemnity/clearance, appellate briefing and oral argument, regulatory investigations/settlements, mediation/engagement scope, and parallel proceedings/board crisis briefing.
- Every added lesson includes a distinct fictional legal scenario, legal concepts to research, opposing positions, practical written deliverables, a fact-sensitive knowledge check, and an explicit qualified-review limitation.
- `scripts/validate-level4.mjs` now requires 21 unique ordered lessons, substantial instructional readings, drafted deliverables, and 21 distinct questions. The main academy catalog displays 21 draft lessons (`33b2c12`).
- Repository-content checks passed for lesson counts, distinct questions, assignments, quiz structure, route/script presence, and isolated Level 4 draft-storage key. **GitHub Actions execution, legal source-by-source checking, iPhone Safari and desktop acceptance, and cross-device persistence are not confirmed.**
- Preserve Level 3 and all older local/cloud data; Level 4 remains under construction and should not be described as completed or academically endorsed.
