# Level 3 — Academic review and primary-authority register

Status: **OPEN — editorial and technical review in progress; no independent legal or academic sign-off.**
Repository baseline: `main` commits `814eeb3` (third seven-study expansion) and `6d1b600` (structural validation).
Authored inventory: 7 courses × 10 lessons = 70 lessons; 21 lessons with dedicated authority expansions. These numbers measure authored content, **not** law-school equivalency, examination mastery, legal currency, or accreditation.

## Preliminary editorial findings (2026-11-03)

The validator `scripts/validate-level3.mjs` checks presence, minimum lengths, and UI tokens. It **does not** establish that a quotation, case holding, source URL, statutory subsection, current law, or grading conclusion is legally accurate. The 21 entries must be classified by source type before calling all of them judicial case studies.

### Highest-priority corrections

| Lesson | Current source in Level 3 | Finding | Required action |
|---|---|---|---|
| L3-5-6 — Payroll tax and worker classification | IRS common-law employee guidance | Agency guidance, **not** a judicial opinion | Label as agency-guidance exercise; add an actual reported employment-tax classification decision, holding, jurisdiction, and fact-based comparison |
| L3-5-7 — Depreciation and cost recovery | IRS Publication 946 | Publication, **not** a judicial opinion | Keep guidance as applied statutory exercise; add a genuine depreciation/capitalization decision with verified holding and treatment |
| L3-5-9 — Tax audit procedure | 26 U.S.C. §6213 | Statute, **not** a judicial opinion | Label statutory interpretation; add a reported deficiency-procedure case and any relevant Tax Court rules |
| L3-6-9 — Complex litigation discovery | Federal Rule of Civil Procedure 37 | Procedural rule, **not** a judicial opinion | Label rule application; add a reported sanctions/proportionality decision and check Rule 26(b)(1) alongside Rule 37 |
| L3-3-6 through L3-3-9 — Administrative Law | Historical agency-review cases | Authority hierarchy and post-2024 development must be checked | Verify implications of *Loper Bright Enterprises v. Raimondo*, 603 U.S. 369 (2024), and other subsequent decisions; distinguish statutory interpretation from agency factual review |

These are preliminary classifications based on the authored URLs, **not findings that the linked legal texts are false or that the lessons must be removed**.

### Reviewed inventory requiring full verification

| Course | Authority-expanded lessons |
|---|---|
| Evidence | L3-1-6, L3-1-7, L3-1-9 |
| Business Organizations | L3-2-6, L3-2-7, L3-2-9 |
| Administrative Law | L3-3-6, L3-3-7, L3-3-9 |
| Professional Responsibility | L3-4-6, L3-4-7, L3-4-9 |
| Federal Taxation | L3-5-6, L3-5-7, L3-5-9 |
| Remedies and Advanced Civil Litigation | L3-6-6, L3-6-7, L3-6-9 |
| Criminal Procedure and Constitutional Litigation | L3-7-6, L3-7-7, L3-7-9 |

## Reviewer acceptance criteria for each of the 21 expansions

1. Record source type (judicial opinion, statute, court rule, agency guidance); precise case name, court, year, reporter citation or official rule/section, jurisdiction, and stable source URL.
2. Read the primary authority and check procedural posture, legally relevant facts, actual holding, rationale, limits, concurrences/dissents where relevant, and whether the syllabus/headnotes are being mistaken for the opinion.
3. Verify subsequent history and current treatment with a reliable citator or qualified manual research. Record the **as-of date** and jurisdiction; flag superseded, vacated, overruled, amended, or limited authorities. A live URL does not prove good law.
4. Match the authority to the hypothetical: governing rule, best argument on both sides, meaningful fact variations, remedy, evidentiary uncertainty, and a source-grounded model answer.
5. Verify every linked statute, regulation, rule, or agency policy against official/current text. Explicitly distinguish federal and state law and law applicable to the historical facts.
6. Have a separate reviewer check any material disputed legal assertion. Log reviewer name/qualifications, finding, severity, proposed correction, date, and evidence.

## Examination and app verification

- Independently review all seven course finals and capstone against the grading rubric for correct issue spotting, weighting, law application, counterarguments, and legal citations.
- Conduct blind grading on sample strong, borderline, and weak written answers; calibrate against qualified human graders. The current automated feedback is **not** a human-assessed grade.
- Execute `node scripts/validate-level3.mjs`; then browser-test each lesson, case source, workbook, assessment, saved draft, reveal control, and cloud persistence on iPhone Safari and desktop.
- Require a traceable review log, a passed test transcript, and qualified human sign-off before changing status from **draft** to **academically reviewed**. Academic review does not imply ABA accreditation or eligibility to sit for a state bar examination.

## Sign-off register

| Workstream | Status | Owner / evidence |
|---|---|---|
| 70-lesson structural inventory | Implemented; test execution not reproduced in this review | `level3.js`, `scripts/validate-level3.mjs` |
| Classification of 21 authority expansions | Preliminary review complete; corrections pending | This register |
| Legal citations and current-law accuracy | Not signed off | Qualified legal reviewer required |
| Seven final examinations + capstone | Not signed off | Independent examiner required |
| Runtime, mobile UX and persistence | Not independently retested | Browser test report required |
| Academic comparability / external evaluation | Not signed off | External academic assessor required |

## Development batch — 2026-11-03: case-review and final-examination strengthening

Committed in `e6f24c1` (curriculum) and `697ee60` (structural checks).

- All 17 remaining judicial-case expansions now contain a court-and-holding review task tailored to the assigned decision. **This adds reviewer instructions; it is NOT evidence that judicial treatment has already been independently checked.**
- Four previously mislabeled guidance/statute/rule studies retain their source type and contain reported-case comparison assignments (`4b57609`).
- Current-law crosschecks added to five lessons: the 2023 FRE 702 amendment; `Loper Bright` (2024) and its limits in three administrative-law lessons; and `Smith v. Arizona` (2024) in criminal evidence.
- All seven course finals now have individually tailored examiner checks without changing the total lesson count or grading status.
- The review script includes text-presence assertions for these additions. A repository-content inspection confirmed the authored JSON has 7 courses, 70 unique lesson IDs, 17 review-task sections, 5 current-law crosschecks, and 7 examiner-control additions. **The Node test suite was not executed and browser grading/persistence was not tested in this batch.**

### Remaining blockers

1. Independently read and verify every assigned case, appellate history, citations, source link and current binding treatment; counsel/examiner to document findings.
2. Confirm the newly paired decisions are appropriately sourced and describe their scope accurately; source-link availability and case status were not fully verified in the repository-content checks.
3. Test `node scripts/validate-level3.mjs`, run browser flows and cloud persistence on iPhone and desktop, inspect exam grading against human-scored samples.
4. Seek independent professional and academic review. No ABA accreditation, academic equivalency, bar eligibility or mastery certification is claimed.
