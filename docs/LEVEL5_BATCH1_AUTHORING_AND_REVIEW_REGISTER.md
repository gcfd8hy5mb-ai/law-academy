# Law Academy — Level 5 Batch 1 Authoring and Legal Accuracy Register
**Created:** 2026-11-10  
**Branch:** `feature/level5-advanced-law-batch1-2026-11-10` (based on `main`, not the unfinished Level 4 audit branch)  
**Status:** original draft advanced study material; not legally certified, NCBE-sponsored, accredited or a JD/bar qualification.

## Authored curriculum

| Course | Course ID | Four Batch 1 lessons |
|---|---|---|
| Advanced Constitutional Litigation | L5-1 | Standing; Rahimi and historical analogues; relief scope after CASA; Mathews due-process final |
| Complex Civil and Criminal Litigation | L5-2 | Work product and proportional discovery; Brady disclosures; Strickland postconviction limits; combined litigation final |
| Corporate Law and International Transactions | L5-3 | Caremark oversight; acquisition true-ups; FCPA jurisdiction; M&A final |
| Advanced Evidence and Trial Advocacy | L5-4 | Daubert/FRE702 experts; Crawford/805 hearsay; Rule 50 preservation; Old Chief trial final |
| Legal Ethics and Professional Responsibility | L5-5 | Upjohn corporate client; aggregate settlements; candor and false evidence; conflicts final |
| Advanced Legal Research and Judicial Writing | L5-6 | Erie source hierarchy; Loper Bright statutory interpretation; Nken stays; Marbury opinion final |
| Comprehensive Bar Preparation and Final Capstone | L5-7 | Diagnostic method; closed-universe performance; remediation simulation; Asterion integrated counsel final |

**Totals:** 7 course tracks, 28 authored lesson records, 7 original 100-point written finals, 28 in-lesson knowledge checks, and 21 additional original cross-course multiple-choice diagnostics.

### Comprehensive capstone dossier
The capstone `L5-7-4` has a separate **fictional** source-labeled dossier in `level5-capstone-case-packet.js`, including a chronology, **six simulated evidentiary exhibits**, legal unknowns, factual variations, six specified written/oral deliverables, and a 100-point rubric. No fictional evidence is presented as a real court record.

## Student interaction and saving

- Uses the approved existing academy navigation, CSS typography, charcoal-and-gold identity and the existing `shell(...,'courses')` rendering.
- `level5-ui.js` stores only under `law-academy-level5-v1` (device-local). It reads current stored values before merging a changed field and warns rather than overwriting another tab's draft. It offers a manual copy fallback if clipboard permission fails.
- Worked solution revealed only after a 100-word writing attempt. Multiple-choice diagnostics are **formative**, not official bar scores, real legal opinions or graded essays.
- Existing `renderBarSimulator()` remains available via Level 5 home screen; its storage and source files are unchanged. Existing Level 1–4 local keys and Firebase configuration are not modified.
- No Level 5 cloud synchronization has been implemented or validated; do not claim student responses are backed up to the cloud.

## Evidence and audit limits

The reported-opinion links are **source starting points**. Lesson text includes a distinction between the opinion's holding and fictional application, competing arguments and changed facts, but these outputs have NOT received line-by-line attorney legal-review, Shepard's/KeyCite later-treatment review, effective-date/jurisdiction review or external academic sign-off. Some links are model rules or exam descriptions rather than cases and are labeled accordingly; a qualified reviewer must independently validate each link/holding.

**Automated QA:** `scripts/verify-level5.cjs` checks IDs, presence of detailed lessons, answer indices, seven original finals/rubrics, capstone dossier, 21 diagnostic prompts and explicit non-approval flags. Workflow `.github/workflows/level5-qa.yml` additionally parses script syntax and runs the unchanged Level 4 structure test. Structural pass does not prove browser interactions, legal accuracy, human grading or professional competency.

## Next authoring/acceptance batches

1. Expand each track with additional progressively advanced seminars and multiple real-case comparisons, including dissent, procedural posture, limits and subsequent-treatment questions.
2. Expand original diagnostic bank into subject-specific timed blocks with reported answers, explanations, source versioning and adaptive remediation — no official NCBE reproduction.
3. Add detailed independent reviewer export and calibration protocol for each written final; do not automatically grade original legal reasoning.
4. Run mobile WebKit, desktop and actual iPhone Safari PWA acceptance; validate device-local saving/recovery, no older-level regression, and independent cloud synchronization if later developed.
5. Perform independent licensed legal and faculty source reviews, calibrate writing exams, and document deficiencies. Level 4's separate audit PR and QA failures must remain a separate workstream.

## Merge boundary

Do not merge this Level 5 branch merely because a draft curriculum is structurally complete. Confirm latest branch-head checks, complete a human diff review, preserve production and existing progress, and label any academic/independent legal certification as pending.

## Batch 2 — Seven additional advanced modules (2026-11-10)

**Source file:** `level5-batch2-coursework.js`. Appended to the seven original course records after `level5.js`, with stable new IDs **L5-1-5 through L5-7-9**. The original 28 `L5-*-1..4` records, original written exams, established device-local storage key and existing Level 1–4 assets are unchanged.

| Track | Advanced seminars and second-module final (5 new lessons each) |
|---|---|
| L5-1 constitutional | Ex parte Young prospective relief; Monell municipal policy; Pearson qualified immunity; Arlington Heights discriminatory purpose; Harlow integrated litigation final |
| L5-2 complex litigation | Wal-Mart v Dukes class proof; Twombly pleadings; Carpenter historical location records; Kyles cumulative Brady review; Nixon parallel proceedings final |
| L5-3 multinational corporate | Morrison transaction reach; RJR Nabisco private civil RICO domestic injury; Kiobel and ATS extraterritoriality; Digital Realty SEC-reporting whistleblower framework; Basic securities-disclosure final |
| L5-4 evidence and trial | Melendez-Diaz forensic certificates; Bullcoming surrogate witnesses; Smith v Arizona 2024 forensic expert testimony; Giles forfeiture-by-wrongdoing intent; Crawford integrated forensic-trial final |
| L5-5 legal ethics | ABA Model Rules 1.5 legal fees, 1.6 confidentiality/technology, 1.9 former clients, 5.3 nonlawyer supervision; 1.18 prospective clients capstone |
| L5-6 research and judicial writing | Already covenant/mootness; Steel Co Article III sequence; Arbaugh statutory jurisdictional clear statement; Kisor regulatory interpretation; FRAP 28 judicial-writing final |
| L5-7 bar integration | FRCP 56 summary judgment; FRE 403 trial proof; 18 USC 3553 sentencing; ABA 1.7 conflict remediation; original mixed NextGen-format-informed practice final |

**Batch 2 additions:** 35 original advanced applied lessons, including seven new written finals; 35 additional 3-option formative assessments with answer-position balancing; 35 written assignments, source-comparison guides and changed-fact exercises. **Overall Level 5 authoring totals:** 63 lessons (9 in each of 7 courses), 14 original written finals (two modules per course), 63 lesson knowledge checks, plus the existing 21-item cross-course diagnostic. A drafted exercise or correct index does *not* establish doctrinal correctness or human-graded mastery.

Each new record includes a named judicial opinion or properly labeled official statute, federal procedural rule, ABA model rule, or NCBE public-information starting source. Model Rules and bar-exam guidance are not judicial opinions; historical opinions require contemporaneous citator and governing-law verification. The primary-link assignments are starting points **only**. No lawyer/faculty has signed off on the holdings, later treatment, answer keys, exam rubrics or selected citations. The new second-module finals remain ungraded; do not infer professional licensure, academic credit or bar eligibility.

### Second-batch QA and compatibility

- `scripts/verify-level5.cjs` now loads the batch-two overlay before the existing case dossier and diagnostic overlays and checks 63 distinct lesson IDs, nine authored lessons per course, 14 100-point written finals, current answer distributions, existing 21 diagnostic questions, and all non-certification flags.
- `tests/level5-coursework.spec.mjs` includes a regression that navigates all seven course lists, validates nine lessons in each course, and checks draft saves under every new `L5-N-9` final ID. The app's course-home count is computed from the actual loaded array; it is no longer hardcoded to Batch 1.
- The new overlay is loaded **after** `level5.js` and **before** capstone/diagnostic/UI from `index.html`. It checks for duplicate IDs before appending and never resets earlier levels or local progress.
- Physical device, Safari Home Screen/PWA and Level 5 cloud-sync tests remain separate and **unverified**. Production Firebase configuration remains untouched.
- Earlier Law Academy Level 3 and repository-wide QA failures were inherited from `main` and are not evidence of Level 5 legal-content failures. They must still be resolved before merge or release.

### Next gates

1. Inspect final GitHub Actions runs **for the final head SHA**, not only intermediate green runs. Record outstanding failures without attributing inherited failures to the new module.
2. Inspect substantive legal precision of all 63 lesson briefs and the 14 finals, especially reported holdings, subsequent history, current jurisdiction, model rules and forfeiture/confrontation nuance.
3. Extend original timed exams and independent examiner packets; preserve actual written attempts rather than issuing fabricated passing grades.
4. Obtain qualified legal accuracy and academic review, device acceptance and merge approval before presenting Level 5 as production-complete.
