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

## Third instructional batch — November 3, 2026

Level 4 now contains **35 authored draft lessons (five per course)**. Commit `ac69dcc` added fourteen lessons in trial exhibits and settlements, identification and criminal disclosure, purchase adjustments and cybersecurity diligence, qualified-immunity appeals and harmless error, retaliation and agency rulemaking comments, trust-account safeguards and release drafting, and cross-border production/insurance negotiation. The seven previous tracks and all existing lesson IDs remain unchanged.

Every new lesson has an individual fictional fact pattern, primary-law research targets, competing legal positions, a written practice deliverable, and a case-specific multiple-choice explanation. Commit `a1af124` updated the 35-lesson structure checks; `504fd2b` refreshed the course catalog; `826b44f` recognized evidence-model building as a practical assignment type.

**Verification boundary:** Repository-content inspection confirmed seven tracks of five lessons, 35 unique IDs, 35 distinct knowledge-check questions, adequate reading and assignment fields, and intact draft status. The real Node validator, GitHub Actions, deployed browser flows, cloud synchronization, and independent legal case-status verification remain unconfirmed. A 70-lesson Level 4 count is a provisional planning target, not an academic accreditation standard.

## Fourth expansion checkpoint — November 3, 2026

Level 4 now contains **49 authored draft lessons (seven in each of seven courses)**. The 14 newest lessons develop trial preservation and judgment enforcement, sentencing and postconviction procedure, board conflict oversight and earnout interpretation, mootness and municipal liability, administrative hearings and compliance audits, common-interest discussions and negotiation ethics, plus corporate crisis communication and integrated deadline triage. All 49 case knowledge checks are distinct; existing lesson IDs were retained.

- Curriculum commit `32a78ca`; validation update `28e0b2d`; catalog count update `dc9feff`.
- A repository-content audit checked seven courses, 49 uniquely numbered lessons, 49 distinct questions, substantial reading and written assignment fields, and the interface script references. It passed.
- **Not yet independently confirmed:** running the full Node validation script in CI, browser and installed iPhone PWA functionality, any cloud sync of Level 4 written drafts, case-citation currency, qualified external academic or legal assessment.
- The 70-lesson target is provisional; current authoring progress is 49/70, or 70% **by count only**, not by rigor or independently validated instructional hours.

## Level 4 lesson-count authoring milestone — November 3, 2026

The provisional Level 4 **70-lesson authoring target has been reached**: seven courses with ten drafted lessons each, including one written course final per course. This is an authored-content milestone, not equivalent to completion of substantive review.

- Coursework commit: `6aad765`; regulatory-exam deliverable refinement: `6991866`.
- Validation requirements updated in `387c09e`: 70 unique ordered lessons, 70 distinct knowledge questions, substantial writing and reading fields, seven course finals with 100-point assessment rubrics, and human substantive-review gates.
- App catalog updated in `2fa4643` to show 70 draft lessons and written finals available.
- Repository-content inspection after the refinement passed for course/lesson counts, IDs, quiz uniqueness, writing deliverables, and final rubric totals. A **successful execution** of the Node test suite and deployed browser workflow has not yet been confirmed.
- **Remaining substantive work:** provide independently verified primary-source citations and current-law review for each lesson, deeper model answers and individualized rubric exemplars, qualified exam calibration, integrated Level 4 capstone assessment, accessibility and iPhone/desktop acceptance checks, and non-destructive cloud synchronization of Level 3/4 written drafts. External academic review is independent of course authoring.

Status wording: **70/70 lessons authored as drafts; not academically verified, not independently approved and not a representation of law school credit, degree or bar eligibility.**

## Worked-final examiner-aid batch — November 3, 2026

Seven provisional `workedGuide` reasoning comparisons have been added to Level 4's written finals, one per course. Each guide distinguishes threshold procedure, stepwise application, the adverse position, changed facts, legal source verification, and an explicitly **conditional** model disposition. These are educational aids rather than reviewed answer keys or independently assessed candidate submissions.

- Curriculum update `4a58eee`: adds the seven case-specific reasoning guides without changing lesson IDs or existing completion/draft records.
- Interface update `52d93d5`: displays a comparison only after the student writes at least 100 words; it does not overwrite the student's draft and does not represent an independent grade.
- Validator update `244f7bb`: requires all seven guide sections, clear draft status, human-assessment boundary, and the reveal-after-attempt control.
- Connected-repository content checks confirmed 70 lesson IDs, seven final guides, required guide sections and valid JavaScript parsing. **These checks are not an executed Node CI run, deployed browser acceptance test, professional legal citation/citator review, or academic sign-off.**

**Next quality gates:** source-by-source law-currency verification with qualified reviewers; calibrated exemplar scoring by two human examiners; iPhone/desktop browser and cloud-draft persistence tests. The `law-academy-level4-v1` browser-local draft key remains unchanged.

## Verification batch — November 3, 2026: primary authority and cloud compatibility

### Authority review (scoped, not comprehensive)
Four lessons gained explicit source review records, linked controlling texts, and jurisdiction/procedural qualifications (curriculum commit `cf22add`; regression assertions `b94b719`):
- `L4-1-4`: Rule 702 as amended in 2023; distinguish Rule 104(a) proponent's burden from jury weight and appellate review. Reference: https://www.uscourts.gov/forms-rules/current-rules-practice-procedure/federal-rules-evidence and https://www.law.cornell.edu/rules/fre/rule_702
- `L4-1-6`: Rule 50(a)/(b), renewed motion requirements, and 28-day deadline in the stated circumstances. Reference: https://www.law.cornell.edu/rules/frcp/rule_50
- `L4-4-5`: *Johnson v. Jones*, 515 U.S. 304 (1995), with the distinction between interlocutory legal review and factual sufficiency disputes. Reference: https://supreme.justia.com/cases/federal/us/515/304/
- `L4-4-9`: *Nken v. Holder*, 556 U.S. 418 (2009), four-factor stay standard and actual immigration-removal procedural context. Reference: https://supreme.justia.com/cases/federal/us/556/418/

These checks establish initial accuracy of cited propositions, **not** complete treatment/citator checks for every jurisdiction or all 70 lessons.

### Cloud migration blocker (identified by inspection)
The current `law-firebase-cloud-v4.js` includes the Level 3 browser key `law-academy-level3-v1` in its fixed `KEYS` snapshot schema but omits `law-academy-level4-v1`. Its `valid()` requires a fixed key set, and `parseCloud()`, `equal()` and initial comparison operate across that set. Simply appending the Level 4 key risks invalidating legacy snapshots or producing a conflict state if one device runs an earlier build.

**Required migration design before any cloud write change:**
1. Preserve the existing Firebase record and local device versions; export backups on both devices.
2. Introduce a schema version that recognizes both legacy snapshots and the new optional Level 4 key, normalizing *missing* keys to null without replacing real values. Do not interpret an absent key as permission to erase local drafts.
3. Validate each known key's storage type and enforce bounded payload size; prevent untrusted keys from being introduced via backup restore.
4. On initial migration, compare device/cloud differences explicitly and use additive, field-level merges only when nonconflicting. Preserve both copies and stop on same-lesson differing nonempty draft content.
5. Use Firebase transaction revision guards and verify login identity, plus test sign-out, two devices, offline changes, iOS Home Screen versus Safari, concurrent edits and schema rollback.
6. Deploy only after tests against old and new snapshots, including non-destructive failure paths. Keep manual local backup during migration.

No migration was deployed in this checkpoint. Written Level 4 drafts remain local until compatibility and persistence acceptance tests pass.

### Execution boundary
The checked-out repository is not available for execution from this runtime (GitHub DNS resolution failed). Connected GitHub content checks and JavaScript parser inspection do not constitute a passed Node test suite or a verified GitHub Actions run. External qualified academic evaluation remains outstanding.

## Source verification expansion — November 3, 2026

Added **seven additional bounded source checks** to `level4.js` (`abdf739`) and corresponding regression assertions (`91f4edf`). The documented targeted checkpoints now total **11 of 70 lessons**, but neither this count nor the checks means full lesson-by-lesson legal accuracy has been certified.

| Lesson | Primary authority checkpoint | Limit still outstanding |
|---|---|---|
| L4-1-1 | Fed. R. Civ. P. 37(e), ESI loss and distinction between prejudice and intent-based remedies | Application to actual evidence and current circuit treatment |
| L4-1-2 | Fed. R. Civ. P. 56(a),(c),(d), genuine material dispute and properly supported record | Local practice, later decisions, underlying merits law |
| L4-2-8 | *Batson v. Kentucky*, 476 U.S. 79 (1986), discriminatory strikes | Later three-stage doctrine, jurisdictional expansions |
| L4-2-9 | 28 U.S.C. §§2254(b), 2244(d), state habeas exhaustion and statutory timing | Actual limitations computation, tolling and procedural default |
| L4-4-7 | *Monell*, 436 U.S. 658 (1978), municipal policy/custom rather than automatic vicarious liability | Later policymaker, training and causation precedent |
| L4-5-2 | *Upjohn*, 449 U.S. 383 (1981), qualified corporate privilege and distinction from underlying facts | Waiver, local privilege standards, representation details |
| L4-7-2 | Fed. R. Civ. P. 37(e), preservation/loss across parallel disputes | Forum-specific procedural rules and foreign-law application |

Primary sources: https://www.law.cornell.edu/rules/frcp/rule_37 ; https://www.law.cornell.edu/rules/frcp/rule_56 ; https://www.law.cornell.edu/supremecourt/text/476/79 ; https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title28-section2254 ; https://uscode.house.gov/us/usc/119-124/t28/s2244/ ; https://www.law.cornell.edu/supremecourt/text/436/658 ; https://www.law.cornell.edu/supremecourt/text/449/383 .

Repository-content consistency checks passed: 70 unique lesson IDs, 70 distinct questions, eleven source-review markers, stable final rubrics, and no cloud migration performed. The complete Node CI suite, browser acceptance and qualified external academic sign-off are still **not confirmed**.

**Technical blocker persists:** `law-firebase-cloud-v4.js` uses a fixed snapshot list including Level 3 but not Level 4. Do not add the key and automatically sync to legacy records without implementing and testing backward-compatible, nondestructive migration and conflict resolution.

## Fifth authority batch — November 3, 2026

Eight more scoped legal authority reviews were embedded into the relevant coursework (`eacdcccb`) and made regression-checkable (`ddbc0f9`). Total: **19 of 70 lessons with limited primary-source/model-rule checkpoints**. The new checks concern:
- `L4-1-3`: Fed. R. Civ. P. 30(c)(2), directions not to answer; **Federal Evidence Rule 613(b) amendment effective December 1, 2024**. Specific federal foundation requirements must not be conflated with Texas or other state evidence rules.
- `L4-1-5`: Fed. R. Civ. P. 68, formal offers of judgment and associated cost consequences, distinct from all settlement negotiations.
- `L4-1-7`: Fed. R. Civ. P. 69, execution and related state-law procedures; an affiliate is not automatically liable for a corporate judgment.
- `L4-1-8`: Fed. R. Civ. P. 16(e), **manifest injustice** standard for changes to a final pretrial order, distinguished from scheduling-order good cause.
- `L4-1-9`: Fed. R. Civ. P. 51(c),(d), instruction requests, objections, definite trial rulings and issue preservation.
- `L4-4-1`: 28 U.S.C. §1292(a)(1), interlocutory injunction appeal authority and limitations.
- `L4-4-2`: Fed. R. App. P. 28(a),(e), brief jurisdiction statements, record references and standards of review.
- `L4-6-7`: ABA Model Rule 4.1, material truthfulness and qualified nondisclosure duty; **state adoption remains to be checked**.

Linked authority texts appear in each lesson's `sourceReview.sourceUrls`. These are bounded checks of selected propositions, **not** complete research on all doctrine in those lessons, academic sign-off, or a certified bar-preparation review.

Repository-content consistency inspection preserved all 70 lesson IDs and distinct quiz questions, with 19 marked source checkpoints. The updated test script's JavaScript syntax was parse-checked with import-module syntax substituted for the parser environment, but the actual Node test suite, GitHub Actions and deployed iPhone/browser acceptance still have **not** been independently confirmed.

The legacy `law-firebase-cloud-v4.js` remains unchanged; migration of Level 4 writing to Firebase is pending a backward-compatible conflict-safe design and real-device verification.

## Sixth legal-authority expansion — November 3, 2026

This batch added 14 more **scoped** authority checkpoints, increasing the total from 19 to **33 of 70 Level 4 lessons**. Curriculum commits: `445e760` (twelve legal and ethics notes), `231859a` (two M&A guidance updates). Test extension: `e79b36d`.

**Authorities and practical corrections:**
- `L4-2-1`, `L4-2-5`: *Brady v. Maryland*, 373 U.S. 83 (1963); distinguish favorable evidence, materiality, pretrial disclosure obligations and the standard for postconviction relief.
- `L4-3-1`, `L4-3-3`: FTC Hart–Scott–Rodino notification; applicable thresholds, filing triggers, waiting periods and the **March 19, 2026 change back to the pre-February 2025 HSR form** following a district court vacatur and denial of a stay. Current official filing guidance must be rechecked at the transaction date.
- `L4-5-1`, `L4-5-5`: 5 U.S.C. §553(b)-(c), applicable federal notice-and-comment rulemaking, exceptions and difference from agency subpoena/adjudication authority.
- `L4-6-1`, `L4-6-3`, `L4-6-4`, `L4-6-8`: ABA Model Rules 1.7, 1.2, 1.15 and 1.9, including nonconsentable conflicts, reasonable limited scope and client settlement authority, advance fee safeguarding, former-client material adversity. Model rules are not automatically the adopted law in each state.
- `L4-7-1`: ABA Model Rule 1.13, entity client and constituent relationships.
- `L4-7-4`, `L4-7-8`: Federal Rules of Civil Procedure 26 and 34, relevance/proportionality and possession/custody/control in complex and cross-border discovery.
- `L4-7-5`: Federal Rule of Civil Procedure 41, dismissal by stipulation and the distinction between private settlement and court-filed dismissal.

Official or legal primary texts: https://www.law.cornell.edu/supremecourt/text/373/83 ; https://www.ftc.gov/enforcement/premerger-notification-program ; https://search.ftc.gov/enforcement/premerger-notification-program/hsr-notification-forms-instructions-guidance ; https://www.law.cornell.edu/uscode/text/5/553 ; https://www.law.cornell.edu/rules/frcp/rule_26 ; https://www.law.cornell.edu/rules/frcp/rule_34 ; https://www.law.cornell.edu/rules/frcp/rule_41 ; official ABA Model Rules at https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/ .

Repository-content checks passed for seven courses, seventy stable lesson IDs, seventy distinct knowledge checks, thirty-three targeted review markers, and syntactic validation of the amended regression script (parser substitution for module syntax, **not** Node test execution). No Firebase migration or cloud-data write was performed. Independent academic review, primary-law citator checks, full automated test execution and iPhone/desktop acceptance remain outstanding.
