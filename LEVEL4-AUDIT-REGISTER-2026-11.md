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
