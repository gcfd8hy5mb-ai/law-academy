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

## Batch 3 — constitutional remedies, jurisdiction, governance and forensic evidence (2026-11-10)

**New source:** `level5-batch3-coursework.js`; append-only after Batches 1 and 2. Adds **35 original advanced lessons** across the same seven courses, including seven third-module written finals, case comparisons, disputed-fact exercises, professional deliverables, primary-law research starting points, opposing briefs and provisional worked reasoning. Original IDs and drafts from Batches 1–2 remain unchanged.

| Course | Module III lessons |
|---|---|
| L5-1 | Bivens, Ziglar v. Abbasi, Egbert v. Boule, City of Los Angeles v. Lyons; Brown v. Plata structural-relief final |
| L5-2 | Bristol-Myers specific jurisdiction; Ford relatedness; Daimler corporate general jurisdiction; Amchem settlement class; Matsushita coordinated litigation final |
| L5-3 | Marchand board oversight; Zuckerberg demand futility; Corwin informed stockholder approval; MFW controller processes; Caremark governance final |
| L5-4 | Davis v. Washington; Michigan v. Bryant; Ohio v. Clark; Hemphill v. New York; Crawford statement-by-statement evidence final |
| L5-5 | ABA Model Rules 1.10, 1.11, 4.2, 8.4 and 1.16 professional withdrawal final |
| L5-6 | Skidmore interpretive weight; Mead and later deference changes; West Virginia v. EPA; Sackett wetlands; Loper Bright judicial opinion final |
| L5-7 | 28 USC 1332 federal diversity; FRCP 12 defenses; FRE 801 hearsay definition; 28 USC 2255 collateral constraints; original integrated bar final |

**Current authored inventory:** 98 unique lessons across seven courses, each with 14 lessons; 21 written finals (three per course); 98 lesson knowledge checks; 21 additional original cross-course diagnostic questions; and existing six-exhibit fictional integrated counsel capstone. These are **authored practice records**, not 98 independently verified legal source conclusions.

**Additional practical assessment export:** `level5-written-final-review-export.js` creates a student-initiated *blind review packet* for each of the 21 written finals. It includes a fictional fact pattern, deliverables, the student's original answer, a human-only 100-point scoring grid, source-checking prompts, reviewer qualifications, conflict-of-interest check and empty examiner approval fields. It deliberately excludes hidden multiple-choice answers, student account IDs and fabricated scores. It does not transmit anything by itself; clipboard copy or manual copying is initiated by the student. Written exams remain ungraded until a qualified examiner actually assesses them.

**QA updates:** `scripts/verify-level5.cjs` now loads all three coursework modules and reviewer exporter; validates 98 unique IDs, 21 finals, 21-item diagnostic, the existing fictional capstone packet, balanced keyed answers and no false approval flags. Mobile WebKit regressions navigate the third-module finals for every course and exercise examiner export without writing an exam score. Latest branch-head GitHub Actions must be checked before a release claim.

**Caution on legal research:** Bivens/ATS, statutory administrative deference, controller Delaware fiduciary law, testimonial forensic statements and federal jurisdiction are dynamic and intensely fact-specific. Many linked opinions predate subsequent Supreme Court or statutory developments. Model Rules are not binding in a jurisdiction until adopted in governing form. The teaching notes contain cautionary language but **do not constitute a later-treatment citator audit**. A qualified lawyer or law-faculty reviewer must identify material later authority, controlling effective dates, accurate holdings, and any corrections before sign-off.

**Existing defects outside Level 5:** The Level 3 curriculum workflow has previously failed on the separate unmerged Level 4-audit branch and on this branch built from `main`; Level 4 audit PR #3 remains separate. This third authoring batch does not alter old Level 3 lessons, cloud settings or Level 4 audit flags. Do not merge this draft PR solely because Level 5 structural QA succeeds.

**Release requirements still open:** complete doctrine review of all 98 lessons, independent score calibration across 21 written finals, real iPhone and desktop acceptance, production-safe cloud sync if requested, passing applicable repository-wide CI, and separately approved merge/deployment.

## Module IV and authoring closeout — 140 lessons (2026-11-10)

**Authoring scope completed:** seven Level 5 courses have 20 lessons each (140 total), comprised of four modules per course. New fourth-module course material is in `level5-final-module-coursework.js`. The first three module files, early student drafts, lesson IDs, the existing six-exhibit general counsel capstone, the 21 separate bar-style questions, CSS/approved academy design and prior cloud configuration were not replaced.

**Final authored inventory**
- 140 distinct case- or rule-based lessons with extensive reading, authority starting points, factual hypotheticals, opposing arguments, changed-fact exercises, written assignments and individual formative MCQs
- 28 written course finals, **four per course**, requiring qualified human examiners; the last lesson of each course (`L5-N-20`) is an original exit final
- 140 formative in-lesson MCQs; 21 additional original diagnostic items (161 formative items total)
- An integrated six-exhibit fictional enterprise legal capstone and its professional source/evidence analysis tasks
- Existing blind qualified-examiner packet export, without student PII or fictional scores, supports all **28** written finals
- `audit/LEVEL5_140_LESSON_INDEPENDENT_REVIEW_REGISTER.csv` tracks all 140 lessons, authority category, sourced link, precise legal holdings, subsequent treatment, jurisdiction, rule effective date, scenario consistency, question key, 28 written-exam rubrics and signatures. **Every independent sign-off field is PENDING/UNREVIEWED.**

**Fourth-module focus by track**
1. Civil rights, First Amendment restrictions, public employment speech, due process, voting and tailored equitable relief
2. Registration-by-consent jurisdiction, forum clauses, arbitration, ESI preservation, Rule 68 and complex federal proceedings
3. Securities pleading/disclosures, transnational discovery and trade/sanctions compliance
4. Trial and appellate jury instructions, forensic confrontation, business records, impeachment and sentencing review
5. Candor, client property, joint representation, lawyer advertising, multijurisdictional practice and firm leadership
6. APA rationality, agency benefits hearings, removal, reliance interests, statutory review and judicial opinion writing
7. Contract remedies, negligence, property, criminal attempts, mixed civil procedure and an original cross-subject exit examination

**Structural controls:** `scripts/verify-level5.cjs` evaluates four cumulative modules, 140 IDs, seven exit finals, 28 human-scored written finals, 140 substantial scenarios and source links, quiz keys, rubric totals, unchanged older-progress storage, original 21 diagnostic items and reviewer exports. `tests/level5-coursework.spec.mjs` checks fourth-module navigation/draft recovery and prior 1–3 module exams in mobile WebKit.

**Authoring closed; approval remains open.** These records are **not** a qualified law school, a diploma, a fully Shepardized corpus, verified correct bar-examination scoring, professional legal advice or confirmation of eligibility to sit for the bar exam. Historical authorities, evolving Supreme Court holdings, Delaware corporate legislation, state variations and current agency rules require substantive external rechecking. URL presence and programmatic structure do not prove a case citation's factual correctness or the validity of its legal statement. No automatic course-completion or graduation certificate has been issued.

**Remaining acceptance work:** (1) browser and real-device PWA QA, (2) manual reviewed-source signoff and correction tracking for every row, (3) calibrated human written exam review for 28 finals, (4) Level 5 cloud persistence implementation and verification if demanded, and (5) independent academic equivalency or accreditation opinion if desired. The separate Level 4 audit and sign-off stay in their own PR.

## Substantive depth improvement — case-specific workshop batch 1 (2026-11-10)

The prior `140`-lesson authoring total is unchanged. A separate non-destructive overlay, `level5-depth-workshops-batch1.js`, attaches **14 individualized case-reasoning workshops**, exactly two per Level 5 course. Each covers (1) actual procedural setting, (2) a bounded holding and legal reasoning, (3) what the decision does **not** establish, (4) a new evidentiary fact file, (5) a procedural legal-work sequence, (6) a worked conclusion, (7) an adverse brief, (8) a changed-fact problem, and (9) limitations of source review. The teaching view renders eight preparation sections as expandable text adjacent to the original reading and assignment. The individualized worked conclusion appears **only after the student writes 100 words and selects Reveal worked reasoning**, preserving the existing attempt-first pedagogy. No old lesson IDs, drafts or assessment questions are replaced.

| Course | Individually developed workshops |
| --- | --- |
| Constitutional litigation | `L5-1-2` Rahimi and historical analogues; `L5-1-13` Lyons and prospective standing |
| Complex litigation | `L5-2-2` Brady favorable evidence; `L5-2-10` Bristol-Myers forum contacts |
| Corporate governance | `L5-3-10` Marchand board oversight; `L5-3-11` Zuckerberg director-specific demand futility |
| Evidence and trial | `L5-4-7` Smith forensic substitute experts; `L5-4-13` Hemphill open-door confrontation |
| Ethics | `L5-5-1` Upjohn organizational privilege; `L5-5-16` model trust-account and lien dispute |
| Judicial writing | `L5-6-2` Loper Bright independent statutory judgment; `L5-6-15` State Farm record review |
| Bar capstone | `L5-7-10` diversity citizenship of LLCs; `L5-7-12` human hearsay versus machine output |

**Purpose and remaining gap:** This is a focused **14/140 = 10%** in-depth teaching upgrade; the other 126 records still have their original substantive readings, individual scenarios and rubric scaffolding, but do not yet have this enhanced case-specific workshop. A substantial individualized deepening of all 140 lessons is **not** finished. The comparison between levels should not be represented as independent academic equivalency.

**Source and academic warnings:** These study sections use reported case law and model/federal rules as *teaching starting points*, not certified later-treatment searches. In particular, state-law ethics adoption, Delaware statutory changes, case disposition versus later merits, and 2024–2026 Supreme Court doctrine must be independently reviewed. No existing legal certification flags or human grade claims were altered. `scripts/verify-level5.cjs` checks exact workshop coverage and substantive fields; mobile WebKit tests check seven lesson displays and device-local draft continuity. A passing build is not a signed professional legal audit.
