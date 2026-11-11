# Law Academy — Batch 1 primary-authority audit, Levels 1–4

**Audit date:** 2026-11-09  
**Status:** internal bounded review, **not** independent legal or academic approval.  
**Baseline:** `main` at `acccb7a1ef6c5afb5a049c0943ea7bf941e1d52c`.  
**Method:** inspected actual repository file inventory, `LEVEL4-AUDIT-REGISTER-2026-11.md`, `LEVEL4-LEGAL-ACCURACY-SOURCE-REGISTER-2026-11.md`, `docs/LEVEL3_ACADEMIC_REVIEW_REGISTER.md`, and the current-law overlays. Independently checked the *limited propositions below* against linked rulemaking or rule text. No tests were executed, no citator service was run, no device was operated, and no individual lesson or exam was completely substantively audited.

## Coverage register — actual scope

| Unit | Authored/registered baseline | This batch's work | Full legal accuracy | Independent sign-off |
|---|---|---|---|---|
| Pre-law/Level 1 | Existing prelaw audit files and source-review batches | Repository inventory confirmed; prior findings carried forward | PENDING | PENDING |
| Level 2 | Completion gate, lesson-depth audit and exam frameworks | Repository inventory confirmed; prior findings carried forward | PENDING | PENDING |
| Level 3 | Seven courses, 70 lessons listed in `docs/LEVEL3_ACADEMIC_REVIEW_REGISTER.md` | Inspected audit register; tracked 21 authority expansion review targets and prior generic-question defect/correction claims | PENDING | PENDING |
| Level 4 | Seven tracks, 100 lesson-specific entries in legal-accuracy source register | Inspected all register structure and sampled targeted current-law addenda; verified three narrow rule propositions below | PENDING | PENDING |

**Important:** a source URL, rule citation, logged correction, structural validator, or author's label of “source-confirmed” is *not* a comprehensive lesson/answer-key accuracy finding. Do not equate 100 source rows with 100 verified lessons.

## B1 issues and verified rule checks

| ID | Scope | Exact source checked | Bounded result | Remaining reviewer action | Status |
|---|---|---|---|---|---|
| B1-001 | L4-1-11 — lost electronic evidence | [FRCP 37(e)](https://www.law.cornell.edu/rules/frcp/rule_37), [official federal-rule text](https://www.uscourts.gov/sites/default/files/2025-02/federal-rules-of-civil-procedure-dec-1-2024.pdf) | The rule first requires ESI that should have been preserved, loss from failure to take reasonable preservation steps, and inability to restore/replace. Under 37(e)(1), prejudice supports only curative measures no greater than necessary. Severe adverse-inference/default/dismissal remedies under 37(e)(2) require intent to deprive. **Do not treat negligence alone as enough for an adverse-inference instruction.** | Compare the entire lesson, case lab, all answer options, rubric, and fact pattern to these distinct conditions; verify subsequent amendments and controlling circuit decisions | Rule proposition CHECKED; full lesson PENDING |
| B1-002 | L4-1-14 — judgment as a matter of law | [FRCP 50](https://www.law.cornell.edu/rules/frcp/rule_50) | In a federal jury trial, a 50(a) motion follows being fully heard on the issue and occurs before submission to the jury; a 50(b) renewed motion generally follows a prior 50(a) motion and is due within 28 days after entry of judgment, with the special jury-discharge timing in the rule. Do not grade “directed verdict” as a separate modern federal motion or omit preservation/timing. | Inspect exact lesson narrative and answer key; check what grounds were preserved, any Rule 59 alternative, local procedure and pertinent appellate decisions | Rule proposition CHECKED; full lesson PENDING |
| B1-003 | L4-1-12 and L4-1-3 — prior inconsistent statements | [U.S. Courts pending amendments](https://www.uscourts.gov/forms-rules/pending-rules-and-forms-amendments), [Supreme Court 2026 transmitted amendment](https://www.supremecourt.gov/orders/courtorders/frev26_da3i.pdf) | The Rule 801 amendment is **projected to take effect December 1, 2026**, not operative as of this review's 2026-11-09 cutoff. Existing lessons must distinguish current substantive-hearsay use from impeachment and not teach the prospective change as effective today. | On/after 2026-12-01 re-check actual effective status, transition and future scenarios; audit each keyed answer and Rule 613 interaction | Rulemaking status CHECKED; full lesson PENDING |
| B1-004 | Level 4 register across 100 lessons | `LEVEL4-LEGAL-ACCURACY-SOURCE-REGISTER-2026-11.md` | Many rows are explicitly tagged “source-family only.” This is **a research starting point, not a proposition-level authority audit**, regardless of source count. | For each lesson record controlling jurisdiction, as-of date, proposition, pinpoint authority, contrary authority and later treatment; check every distractor and model answer | OPEN — process defect |
| B1-005 | Level 3 21 authority expansions | `docs/LEVEL3_ACADEMIC_REVIEW_REGISTER.md` | Register documents prior confusion between agency guidance, statute, court rule and judicial opinion, plus previously corrected generic case questions. Commits are mentioned but not independently re-executed in this batch. | Inspect final content, source classifications, current holdings and regression results | OPEN |
| B1-006 | Professional/academic attestation | `LEVEL4-AUDIT-REGISTER-2026-11.md` | No signed independent review demonstrated in reviewed register. | Qualified external reviewer per specialty must document credentials, conflicts, citations, corrections, grading calibration and signed conclusion | OPEN — external |

## Required per-lesson audit record (copy for every item, Levels 1–4)

- Lesson ID and revision SHA:
- Course, jurisdiction, as-of date and facts' operative date:
- Every substantive legal proposition and pinpoint primary citation:
- Source type (opinion / statute / enacted rule / agency guidance / hypothetical):
- Opinion posture, holding, limits, later history and citator treatment:
- Exact statute/rule text and effective-date applicability:
- Original quiz: each option, designated answer and explanation verified?:
- Advanced quiz/case lab/essay rubric and worked guide verified?:
- Counterargument, jurisdictional exception and competing interpretation:
- Findings (severity, file/line, evidence, precise correction, commit SHA):
- Internal desk reviewer, date, retest record:
- Qualified independent reviewer, credentials, date and signature (**blank until genuinely received**):

## Acceptance gates

1. **Internal editorial gate:** 100% of lesson-specific, problem-specific and distractor-specific entries documented with reproducible source evidence; issues fixed and retested, not merely assigned a generic source family.
2. **Assessment gate:** examiner-calibrated written samples and a defensible mastery rubric; do not treat a self-rated memo as independently graded.
3. **Software gate:** relevant test execution logs, live-account Firestore read/write on two devices, iPhone Safari / installed PWA acceptance, and conflict behavior.
4. **External gate:** written independent legal and academic review. **No accreditation, bar eligibility, equivalency or professional sign-off can be asserted without an authorized process.**

## Immediate continuation queue

- Audit the entirety of L4-1-11, L4-1-12 and L4-1-14 from their actual lesson and assessment data, not just their headings or source-family links.
- Expand rule-level citation and pinpoint checks to the remaining Level 4 evidence/civil-practice lessons, then work across all seven tracks in blocks.
- Revisit Level 3 authority classifications, Level 2 audits and prelaw open exceptions; retain original unresolved findings until actual content and tests are rechecked.
- Check production rule changes on the applicable date and retain effective-date history per lesson.

**Outcome for this batch:** Three *narrow legal rule/rulemaking propositions checked*, two inventory/register classifications assessed, and one sign-off blocker recorded. **Zero lessons wholly certified; zero independent sign-offs; zero live device tests.**

## Batch 1 follow-up: inspected actual lesson and assessment records (2026-11-09)

Actual lesson source locations:
- L4-1-11: `level4-case-labs-2026.js`; its scenario, reading, multiple-choice distractors, keyed answer and explanatory rationale explicitly distinguish Rule 37(e)(1) prejudice remedies from (e)(2) intent-to-deprive sanctions. Compared against federal rule text. **No correction warranted on the inspected narrow point**, but full citator and multi-asset review remain pending.
- L4-1-12: `level4-case-labs-batch3-2026.js`; the reported warehouse video is a fictional assessment, not a reported case. The embedded-hearsay answer requires separately evaluating each layer, consistent with FRE 805. Source-review URLs previously supplied a general rules landing page and Rule 805, but not the other specifically invoked authentication, business-record, balancing and summary-judgment provisions. **Corrected source-review URLs** to include FRE 901, 803, 403 and FRCP 56. Commit `99f8411`. The changed URLs constitute a better research trail, not certification of all answers.
- L4-1-14: `level4-case-labs-batch4-2026.js`; verified scenario, question choices and key correctly identify a prior Rule 50(a) motion as normally necessary before Rule 50(b). **Corrected erroneous expert-evidence Rule 702 source reference** to the relevant Rules 50, 59 and FRE 103. Clarified when a Rule 50(a) motion is made and Rule 50(b)'s ordinary 28-day judgment deadline (including rule's special discharged-jury provision). Commit `485f3da`. Subsequent treatment, alternate grounds and case-law qualifications still need legal-editor verification.

**Precise limits:** the source links and focused text now better match the exercises; no full independent substantive verification of the worked guides, 100-lesson advanced-question bank, all distractors, legal updates, or nonfederal jurisdictions has occurred. No browser or automated test was executed in this follow-up. The draft PR must be reviewed and merged before these changes can affect `main` or deployment.

## Large-batch follow-up — 2026-11-10

### Audited scope and reproducible inventory

A cross-file repository examination reconciled 100/100 distinct Level 4 authored lesson IDs among `level4-100-lesson-completion-audit-2026.js`, `level4-audit-inventory-2026.js`, and the 100-row source register, distributed across seven tracks as 14,14,14,14,14,14,16. The 100 advanced-answer authority review records consist of **8 narrowly checked primary-law propositions** and **92 source-family-level checks**. These are already-documented classifications, *not* 100 verified legal answer keys. All completion-register flags for legal proposition accuracy, subsequent authority treatment, jurisdiction/effective date, qualified human grading, independent reviewer approval and live browser acceptance remain **false** until supported.

Added `scripts/audit-level4-traceability.cjs` and wired it into `.github/workflows/level4-qa.yml` to enforce source/completion inventory alignment, 100 advanced-answer metadata/fingerprints, 30 supplemental-case question/source structures, and non-certification status across all records. On the 2026-11-10 batch, GitHub Actions Level 4 curriculum QA successfully ran at commit `597bc3b` (runs 42945913243 / 42945908791), confirming internal automated structural and scripted browser checks at *that commit*. **This is not physical-device acceptance nor legal verification.** Later commits require their own successful workflow evidence.

### Correction and teaching-quality register

| ID | Finding | Correction / supporting authority | Commit | Status |
|---|---|---|---|---|
| L4-3-12 | Merger statute §251 alone is an inapt source for a **fictional contract-defined** postclosing net-working-capital adjustment | Linked *Chicago Bridge & Iron Company N.V. v. Westinghouse Electric Co. LLC*, 166 A.3d 912 (Del. 2017), as a purchase-agreement interpretation comparison; clarified the fictional contract's definitions still govern | `b7af37f` | targeted source repair, full case citator pending |
| L4-5-12 | APA §706 judicial review and an FTC business-guidance landing page do not by themselves grant an unnamed agency investigative-demand authority | Added FTC Act §20, 15 U.S.C. §57b-1 as **expressly illustrative**, and FTC enforcement overview; differentiated FTC CIDs from subpoenas; requires actual agency organic statute and notice | `d42e98b` | targeted rule source repair, full agency-specific legal review pending |
| L4-3-11 | Generic choice tested whether fiduciary duty analysis is separate from DGCL §251 | Replaced with fact-dependent Delaware merger/conflict application | `85e2af2` | question improved; qualification and human calibration pending |
| L4-4-12 | Generic stay question did not test FRAP 8(a)(1)-(2) prerequisite | Replaced with first-motion-in-district-court/impracticability-or-denial application | `85e2af2` | question improved; legal examiner validation pending |
| L4-6-12 | Generic settlement-control question missed specific aggregate-settlement consent requirements | Replaced with Model Rule 1.8(g) signed-writing/disclosure scenario, while requiring state-adopted-rule check | `1ca84b2` | question improved; jurisdiction-specific review pending |
| L4-7-14 | Generic apparent-authority question insufficiently distinguished principal from agent assertions | Replaced with principal-linked manifestations and supplier reasonable-reliance scenario | `1ca84b2` | question improved; governing state agency law pending |
| L4-5-13 | Generic agency/FRE comparison did not test formal adjudication statute | Replaced with specific 5 U.S.C. §556(d) evidence admissibility and exclusion standards | `02e351a` | question improved; agency organic-statute applicability pending |

Supporting research snapshots: [Delaware Supreme Court decision](https://law.justia.com/cases/delaware/supreme-court/2017/573-2016.html), [FTC §57b-1 official US Code](https://uscode.house.gov/us/usc/119-120/t15/s57b-1/), [FRAP Rule 8](https://www.law.cornell.edu/rules/frap/rule_8), [ABA Model Rule 1.8(g)](https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_8_current_clients_specific_rules/), [APA §556(d) official US Code](https://uscode.house.gov/us/usc/119-134/t5/s556/). Verifying one proposition and suitable source does **not** constitute opinion-wide holding-and-citator validation.

### Remaining Level 4 acceptance blockers

1. **92 source-family-only advanced-question checks and all lesson-wide narratives, alternatives, case labs and worked guides** still need rule-by-rule substantive legal verification, competing authorities, jurisdiction/operative-date checking and dated evidence for each legal proposition.
2. A qualified reviewer must assess all items and written rubrics, and a qualified independent examiner must calibrate human grading. **No independent legal/faculty approval exists.**
3. Physical iPhone Safari / PWA and two-account/device Firestore production rules acceptance remain to be performed. Automated Chromium/WebKit browser checks do not substitute for these.
4. Branch changes require complete CI green on the final head SHA, reviewer approval and merge/deployment checks. Do not describe the audit branch as live before merge.

**Status decision:** Level 4 *authoring and structural inventory* are complete, with a meaningful additional batch of targeted source and assessment corrections. **Level 4 has NOT met full legal accuracy, academic approval, or live-device release acceptance gates.**
