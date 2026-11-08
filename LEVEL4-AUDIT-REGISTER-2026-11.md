# Law Academy — Level 4 Academic and Legal Audit Register
Date: 2026-11-08
Scope: 3L courses and supplemental case labs.
Status: INTERNAL DESK AUDIT ONLY. No qualified lawyer, faculty member, jurisdiction-specific subject expert, or accredited body has signed off.

## Coverage inventory
- L4-1 Advanced Civil Trial Practice — foundational lessons plus supplemental trials, evidence, Rule 50/59 workshops.
- L4-2 Criminal Litigation and Defense/Prosecution — litigation, disclosure, suppression, sentencing, ineffective-assistance workshops.
- L4-3 Business Transactions, M&A and Negotiation — fiduciary process, purchase agreements, securities disclosure, sanctions/export controls.
- L4-4 Constitutional and Appellate Advocacy — constitutional cases, stays, harmless error, emergency Supreme Court process.
- L4-5 Administrative, Regulatory and Compliance Practice — APA interpretation, subpoenas, agency hearing and whistleblower investigations.
- L4-6 Client Counseling, Mediation and Professional Judgment — settlement authority, conflicts, investigations, privileges and joint representation.
- L4-7 Complex Practice, Remedies and Integrated Capstone — integrated general counsel crisis and 3L practical final.

## Findings / issues requiring action
| Priority | Finding | Owner needed | Completion condition |
|---|---|---|---|
| P0 | No independent legal or academic sign-off | External subject-matter experts | Written, dated review of each course with professional credentials and issue log |
| P0 | Source lists and lesson text are not a validated citator pass | Qualified legal editor | Verify controlling text, effective dates, subsequent treatment and precise holdings for each cited authority |
| P0 | State-law topics cannot be treated as universal | Jurisdictional reviewers | Identify state and operative law for ethics, torts, entity law, family law, remedies and client obligations |
| P0 | Lesson quizzes do not objectively grade written work | Assessment designer + law professor | Human-graded sample, analytic rubric, calibrated grading examples and remediation checks |
| P1 | Clinical exercises do not establish competence to represent clients | Academic program evaluator | Supervised performance criteria and nonmisleading student-facing disclosures |
| P1 | Some case lessons use hypothetical legal-library summaries | Legal editor | Mark fictional rules as fictional and link current primary law for every real-world proposition |
| P1 | Accessibility, iPhone Safari, desktop and PWA navigation need live acceptance tests | QA tester | Test lesson display, saved drafts, source links, keyboard input and navigation |
| P1 | Level 4 saving is browser local, with optional manual cloud backup | Application engineer | Cross-device verified sync and conflict-safe migration; preserve existing draft keys |
| P1 | Bar simulator sample is too small to benchmark bar passage | Bar assessment specialist | Jurisdiction-specific blueprint, substantial vetted item bank, performance scoring and validity work |
| P2 | Source-review status exists in data but is not always surfaced as a review workflow | Curriculum engineer | Reviewer records, timestamps and exceptions surfaced in UI after validation |

## Legal authority categories for verification
1. **Federal procedure and evidence:** FRCP 26, 37, 50, 59; FRE 103, 403, 602, 701–703, 801–805, 901; current amendments and local variations.
2. **Criminal procedure:** Brady materiality, Strickland performance/prejudice, Miranda warnings, suppression exceptions, applicable sentencing guidance and collateral review.
3. **Corporate and transaction law:** Delaware statutory provisions as amended, fiduciary review, securities disclosures, OFAC/export controls and scope of actual transaction language.
4. **Appellate and constitutional practice:** appellate jurisdiction, issue preservation, Rule 8, standards of review, Supreme Court emergency procedures, relevant controlling decisions.
5. **Administrative/regulatory:** agency organic statutes, APA §§ 556 and 706, post-Loper Bright case law, hearing and enforcement rules.
6. **Professional responsibility:** governing state's adopted ethics rules, organizational client identity, conflicts, mediation confidentiality, privilege and settlement authority.
7. **Integrated capstones:** source validity, fact-to-rule mapping, realistic opposing theories, remedies and ethical instructions.

## Current internal quality gates
- Stable lesson IDs; append-only supplements.
- All lesson records include an educational scenario, authority field, instruction, counterarguments, substantive assignment, quiz and explanation.
- SourceReview fields are *review targets*, **not** proof of source verification.
- No quiz answer by itself verifies essay, oral advocacy or practical skills.
- A course can be **authored** while its legal accuracy, academic equivalency, usability, assessment validity and sign-off remain **unverified**.

## Sign-off worksheet (all remain pending)
For each of seven Level 4 tracks, obtain:
- Reviewer name, credentials, jurisdiction, employer/institution and independence/conflict disclosure.
- Review date and legal currency cutoff.
- Coverage and doctrinal correctness evaluation, including citations/holdings and exceptions.
- Academic rigor and intended learning outcomes assessment.
- Exam-item and writing-rubric assessment.
- Issue log (severity, owner, fixed commit, retest) and reviewer acceptance.
- A signed written conclusion, with limits of equivalency and scope explicitly stated.

Do not represent this document as a completed accreditation or a qualified independent review.

## Assessment expansion — November 8, 2026
- Added seven separate course-specific Level 4 practical finals (L4-1-FINAL2 to L4-7-FINAL2).
- Each final requires an extended written memorandum, primary-authority ledger, competing arguments, changed-facts analysis, oral-defense outline, a check question and a six-part rubric totaling 100.
- Written answers, self-ratings and up to eight local snapshots use `law-academy-level4-finals-v1`; **do not** convert self-ratings to legally certified marks or mastery.
- Data-structure checks: seven IDs unique; answer indices valid; all rubrics sum to 100; HTML load order and Exam Center integration checked.
- Outstanding acceptance tests: start/pause/restore/write/submit on mobile Safari, desktop keyboard accessibility, browser-storage quota and cross-device sync.
- Authority desk-check sampling: U.S. Courts identifies **2025 amendments to Civil Rules 16 and 26** and new Rule 16.1; reviewers must use the currently applicable versions, including applicability of amendments. Reference: https://www.uscourts.gov/forms-rules/current-rules-practice-procedure
- Authority desk-check sampling: Loper Bright (2024) rejects mandatory Chevron deference because a statute is ambiguous, but does not categorically invalidate lawful agency discretion. Reference: https://www.supremecourt.gov/opinions/23pdf/22-451_7m58.pdf
- Authority desk-check sampling: ABA Model Rule 1.2(a) allocates settlement decisions to the client; Model Rule 1.13 represents the organization as client. Actual jurisdiction-specific ethics rules remain to be verified. References: https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_2_scope_of_representation_allocation_of_authority_between_client_lawyer/ and https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_13_organization_as_client/
- These checks cover selected propositions, **not** an entire lesson-by-lesson citation audit. No external examiner engaged or sign-off granted.

## All-lesson structural audit and current-law checkpoint — November 8, 2026

### Results
- 100 Level 4 lesson IDs unique across 7 courses (14 each in L4-1 to L4-6; 16 in L4-7).
- 100/100 include an authority, scenario, reading, counterarguments, written assignment, knowledge-check answer and explanation.
- 100/100 contain at least one source-review URL. Such links do not establish independently verified citations or holdings.
- 86 older lessons have bounded internal source-check dates/scopes; 14 newer lessons request current-law and jurisdiction verification. Neither counts as independent academic or legal approval.
- Only 7/100 lessons have a dedicated `examRubric` field. The other 93 have writing prompts but no lesson-specific calibrated examiner rubric. The separately created seven practical finals have self-rating rubrics.
- A per-lesson audit inventory (`level4-audit-inventory-2026.js`) sets `approved:false` and `reviewer:null` on every record.
- The lesson UI now displays limitations and links to the author's review-source leads. No existing learner storage keys have been changed.

### Official-site legal currency checkpoints
1. **2025 civil procedure amendments.** The U.S. Courts current rules page confirms Civil Rules 16 and 26 were amended, and new Rule 16.1 took effect December 1, 2025. Lessons involving case management, privilege logs, discovery planning and MDLs need text-by-text review against the operative provisions. Source: https://www.uscourts.gov/forms-rules/current-rules-practice-procedure
2. **Pending 2026 evidence change.** As of this audit's November 8, 2026 cutoff, the U.S. Courts pending amendments page lists an amendment to FRE 801 with projected December 1, 2026 effectiveness. It could alter substantive treatment of certain prior inconsistent statements. Do not teach the amendment as already effective; review all affected FRE 801/613 content again after the actual effective date is established. Source: https://www.uscourts.gov/forms-rules/pending-rules-and-forms-amendments
3. **State ethics and entity law.** ABA Model Rules do not replace the state's adopted ethical requirements. Confirm jurisdiction, effective date, statutory changes and controlling judicial gloss for each rule.
4. **Legal case holdings.** Each proposition still requires independent confirmation of the source text, controlling status, subsequent treatment and facts. A reachable URL does not equal qualified legal review.

### Open fixes
- **P0-A:** Complete a qualified, cited review of doctrine and substantive holdings for each Level 4 lesson.
- **P0-B:** Correct and retest every relevant Civil Rules 16/26/16.1 and FRE 801/613 lesson against applicable effective dates.
- **P0-C:** Obtain dated independent reviewer identity, credentials, jurisdiction, recommendations and sign-off per course.
- **P1-D:** Expand essay assessments with calibrated human-grading rubrics, excluding purely formative lessons as appropriate.
- **P1-E:** Test mobile Safari, desktop, source links, user drafts, local backup and manual cloud backup.
- **P1-F:** Preserve separate exam/student storage keys, and verify sync before claiming cloud support.

**Conclusion:** This is an automated structural audit and a limited official-source currency check. No full doctrinal validation, accreditation or external academic review has been conducted.

## Targeted corrective addenda — November 8, 2026
**Committed extension:** `level4-rule-currency-2026.js`, rendered inside the affected Level 4 lessons.

Nine lessons received dated supplementary legal instruction and applied assignments: `L4-1-1`, `L4-1-2`, `L4-1-3`, `L4-1-4`, `L4-1-8`, `L4-1-10`, `L4-1-12`, `L4-7-4`, `L4-7-8`.

- Federal Civil Rules 16 and 26 and new Rule 16.1 are in effect from December 1, 2025. Corrective sections emphasize privilege-log planning, initial case management, and distinct MDL procedures. Source: https://www.uscourts.gov/forms-rules/current-rules-practice-procedure
- FRE 801(d)(1)(A) has a projected December 1, 2026 amendment. This November 8, 2026 instructional update explicitly distinguishes the then-operative sworn-statement requirement for substantive use under that subdivision from impeachment-only use, and does not treat the scheduled amendment as presently effective. Source: https://www.uscourts.gov/forms-rules/pending-rules-and-forms-amendments
- Additional written tasks test dated sources, evidentiary purposes, and differing procedural responsibilities.
- The preexisting legal text remains intact in versioned addenda for traceability; future reviewers must evaluate potential contradictions, not assume the supplement by itself fixes every sentence.
- Internal integration checks: 100 unique lessons loaded, nine targeted addenda present, audit inventory still has 100 records, JavaScript syntax and script order passed.
- Review closure: **Not closed.** No independent attorney/academic confirmation, comprehensive legal cite check, live mobile-browser acceptance, or student-outcome validation occurred. Remaining unreviewed lessons and older prior-source check dates stay in the backlog.

## Formative written-rubric coverage — November 8, 2026
- Added `level4-formative-rubrics-2026.js`: 93 missing lesson-specific **formative** writing rubrics were attached without rewriting existing lessons, preserving 7 pre-existing more detailed `examRubric` objects.
- Rubrics address issue spotting (15), operative primary authority (20), factual application and professional deliverables (30), adverse arguments and missing evidence (20), and client advice/ethics/clarity (15), totaling 100 points per lesson.
- Criteria include lesson-specific titles, listed authorities, required deliverables, and adverse positions. This **does not** represent 93 human-calibrated grading standards. It is structured self-review scaffolding with no automated essay score or independent examiner validation.
- Level 4 UI displays the new rubrics in expandable sections while retaining prior dedicated final-exam and worked-guide displays.
- Internal test: 100 authored lessons, 7 preexisting examiner-style rubrics, 93 new formative rubric records, all 93 numeric totals 100; JavaScript syntax and script order passed.
- Remaining P1 ASSESSMENT: obtain human review of grading anchors and full model answers, inter-rater calibration, actual performance grading and student remediation validation. Existing student drafts/keys remain unchanged.
- Remaining P0: verify legal authorities and current amendments by a qualified independent legal editor and document per-course sign-off. No academic equivalence or bar readiness certification.

## Worked reasoning expansion — November 8, 2026
- Added `level4-worked-guides-batch2-2026.js`: fourteen **distinct authored legal-analysis comparisons**, two per Level 4 course, without modifying older lesson IDs, source notices, or learner storage.
- Each new comparison addresses threshold issue, fact-to-rule reasoning, opposing position, changed-facts analysis, authority-currency verification checklist and conditional disposition.
- The existing Level 4 interface already requires a student to write at least 100 words before revealing worked guides. The new entries use that established display path.
- Automated structural checks found 100 unique lessons, 100 lessons with formative or existing examination rubrics, and **21 lessons with worked reasoning guides** (7 earlier plus 14 new). **79 lessons still lack a worked guide.**
- The model reasoning is provisional educational guidance. It is neither a qualified attorney's review nor a validated mark scheme, and should not be presented as proof of legal correctness or bar readiness.
- Outstanding: 79 substantive worked analyses; item-by-item primary authority validation; academic grading calibration; browser-based acceptance and manual cloud backup testing; independent professional review and sign-off.

## Worked reasoning expansion — Batch 3, November 8, 2026
- Added `level4-worked-guides-batch3-2026.js` (24 detailed, case-specific worked examples in L4-1 through L4-6).
- Added `level4-worked-guides-batch3-capstone-2026.js` (4 integrated general-counsel examples in L4-7). **28 new worked guides** total, two files, additive and idempotent.
- Coverage increased from **21/100 to 49/100**, with exactly **7 worked guides in each of the 7 third-year tracks**. **51 lessons still lack worked guides.**
- Every added guide contains threshold issue, substantive case-specific rule/fact application, counterargument, changed-facts consequences, provisional disposition and source-currency caution.
- The existing reveal-after-100-words interface presents the guides; new scripts are loaded after prior guides and before the Level 4 UI. Existing IDs, student drafts and progress keys were not changed.
- Internal checks: all ten audited script/data files parse; 100 total unique lesson IDs; 49 complete worked guide structures; no duplicate IDs, script load order correct.
- **Open:** Independent legal verification of every rule and factual conclusion, full case-law subsequent-treatment review, comprehensive model answers for remaining 51 lessons, qualified essay marking/calibration, Safari acceptance, and academic sign-off.
- These guides are authoring drafts, not examiner-validated model answers, official bar material or evidence of accreditation.

## Complete Level 4 worked-guide coverage — November 8, 2026
- Added `level4-worked-guides-batch4a-2026.js` with 26 remaining lesson guides, and `level4-worked-guides-batch4b-2026.js` with 25 guides.
- **Total worked-guide coverage is 100/100 authored Level 4 lessons.** Prior 49 were retained and not overwritten. Distribution: L4-1 through L4-6 each have 14/14; L4-7 has 16/16.
- Every newly supplied guide has seven populated fields: threshold, analysis, counterposition, changed-facts variants, primary-law research instructions, conditional exemplar and review-status notice. The batch combines case-specific legal-issue analysis with material already authored in the original lesson. These guides are **provisional teaching comparisons**, not independently researched or fully validated reference opinions.
- The lesson UI still requires students to draft at least 100 words before revealing comparisons. Existing progress keys and lesson identifiers are unchanged.
- Automated checks: all included scripts parse; 100 IDs unique; all 100 lessons have formative or existing essay rubric; 100/100 have complete worked-guide structures; 100 source-audit records retained; new scripts load before the UI.
- **Remaining P0:** full independently researched and cited authority checks; effective-date and subsequent-treatment verification; corrections for state-specific rules and hypothetical materials; qualified academic/legal reviewer sign-off.
- **Remaining P1:** richer full model memoranda and genuinely calibrated grading anchors, human scoring reliability, app behavior on Safari and desktop, and cross-device sync testing.
- Do **not** equate 100% worked-guide structural coverage with accredited academic equivalence, legal correctness, validated bar readiness, or demonstrated practical competence.
