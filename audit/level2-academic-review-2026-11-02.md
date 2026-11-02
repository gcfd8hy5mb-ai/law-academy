# Level 2 academic completion review — November 2, 2026

Status: **IN PROGRESS — NOT ACADEMICALLY SIGNED OFF**

This record tracks the first-year law studies (Level 2) without confusing presence of content, automated checks, and substantive academic approval. The initial 128 lessons span Contracts, Torts, Civil Procedure, Criminal Law, Constitutional Law, Property, and Legal Research & Writing.

## Criteria for sign-off

1. **Structural checks:** Run `node --check level2.js` and `node scripts/validate-content.mjs` on the exact reviewed commit. Record successful command output and commit SHA. A committed assertion alone is not proof the test passed.
2. **Functional checks:** Verify each course opens on iPhone-size WebKit, all 128 lesson links resolve, knowledge checks behave correctly, written answers persist and can be revisited, and capstone materials are reachable. Attach browser test results and exact revision.
3. **Primary-law verification:** For each legal rule and case citation, record jurisdiction, authoritative source URL, reporter or statute citation, holding/operative text, court/date, publication or effective date, later treatment and verification date. Verify that cases are used for the correct doctrinal proposition. Flag uncited or outdated claims.
4. **Substantive review:** A qualified independent reviewer examines accuracy, incomplete or misleading doctrines, state/federal distinctions, fairness of alternate arguments and adequacy of remedies/defenses. Track critical defects to resolution.
5. **Examination quality:** Independently grade representative written work with the course rubric and separately scrutinize all seven capstone prompts, marking guidance, source requirements and expected solutions. A multiple-choice score does not constitute passing a written capstone.
6. **Release gate:** Record reviewer name or role, date, scope, findings, unresolved defects and approved commit. Do not state “Year 1 academically complete” or proceed to Year 2 on structural checks alone.

## Initial review queues

| Course | Specific authorities and topics to verify | Substantive sign-off |
| --- | --- | --- |
| Contracts | UCC §§ 2-207, 2-609, 2-712–715; Hadley v. Baxendale and applicable state damages law | Pending |
| Torts | Palsgraf majority/dissent; applicable state's duty, NIED and pure-economic-loss rules | Pending |
| Civil Procedure | 28 U.S.C. §§ 1332, 1441; Fed. R. Civ. P. 4, 12, 15; Erie and Hanna | Pending |
| Criminal Law | Relevant conspiracy statute and jurisdiction; Katz, Riley, interrogation and exclusion cases | Pending |
| Constitutional Law | State action, standing, U.S. v. Virginia, Washington v. Davis, constitutional remedies | Pending |
| Property | State-specific adverse possession, tacking, easement, habitability and nuisance rules; Howard v. Kunto | Pending |
| Legal Research & Writing | Full-text holding and treatment of Erie and Hanna; citation method and authority hierarchy | Pending |

## Verified development events

- Level 2 curriculum currently contains 128 lesson entries, including seven supplemental authority laboratories and seven integrated capstone packets.
- GitHub repository changes added structural assertions; their execution and success must still be independently confirmed.
- Capstone scenario text-formatting fix committed November 2, 2026.
- **No independent academic sign-off has been obtained.** Case-law citations above are a research queue, not a claim that current subsequent treatment has been verified.

## Required reviewer record format

For each authority: `Course | Lesson ID | Proposition | Jurisdiction | Primary citation | Source URL | Holding/section | Subsequent treatment | Verified on | Reviewer | Status | Notes`.

For each capstone: `Course | ID | Scoring rubric reviewed | Model analysis reviewed | Writing graded by | Evidence of review | Defects | Outcome`.

Any unresolved defect affecting a material legal rule or examination answer blocks academic sign-off.


## Primary-source spot checks — November 2, 2026 (partial; not final sign-off)

These are bounded spot checks of named authorities, not full legal currency or subsequent-treatment certifications. The full lesson-by-lesson audit remains pending.

| Subject / lesson | Primary source checked | Supported point | Limits still requiring review |
| --- | --- | --- | --- |
| Civil Procedure L2-3-18 | 28 U.S.C. § 1332, Office of the Law Revision Counsel, https://uscode.house.gov/us/usc/119-118/t28/s1332/ (text through Pub. L. 119-120, October 7, 2026) | Diversity amount must exceed $75,000 exclusive of interest and costs; corporate citizenship must be separately analyzed under subsection (c). | Fact-specific complete diversity, case law on principal place of business, and later statutory updates not certified. |
| Civil Procedure L2-3-10 | U.S. Courts, current Federal Rules of Civil Procedure landing page, https://www.uscourts.gov/forms-rules/current-rules-practice-procedure/federal-rules-civil-procedure (consulted November 2, 2026) | Official rules compilation identifies Civil Rules as last amended in 2025; Rule 15 should be verified against the current full text before instructing on relation back. | Current Rule 15(c) text, relevant interpretations and subsequent cases still pending detailed checking. |
| Criminal Law L2-4-18 | Riley v. California, 573 U.S. 373 (2014), Supreme Court opinion reproduced at https://supreme.justia.com/cases/federal/us/573/373/ (consulted November 2, 2026) | Search incident to arrest generally does not justify searching digital contents of a seized cell phone without a warrant; genuine exigent circumstances may provide a distinct exception. | Later Supreme Court/circuit/state treatment, suppression exceptions and scenario-specific emergency facts not yet fully checked. |

**Audit methodology:** For each claim distinguish the actual source text from a syllabus or summary; note court hierarchy and jurisdiction; search later binding authority before certifying currency. No reviewer has signed off on these entries. Remaining first-year courses and case examples are unreviewed, and the table must not be treated as an exhaustive audit.


## Four-course authority spot-check batch — November 2, 2026

This batch verifies limited teaching propositions against publicly available state statutory text and reported opinions. It does **not** constitute current-law certification in every jurisdiction or independent academic sign-off.

| Course / lesson | Authority and source | Finding | Unresolved review |
| --- | --- | --- | --- |
| Contracts / L2-1-10 | New York UCC § 2-609, official state legislature: https://www.nysenate.gov/legislation/laws/UCC/2-609 | Where reasonable grounds for insecurity exist, a party may demand adequate assurance in writing; after a justified demand, failure to provide adequate assurance within a reasonable period not exceeding 30 days may constitute repudiation. Between merchants, apply commercial standards. The lesson should not teach that **every** late reply automatically triggers repudiation. | Determine the selected governing state's enactment, contract type, valid demand, reasonable period, and any later interpretive cases. |
| Torts / L2-2-18 | *Palsgraf v. Long Island Railroad Co.*, 248 N.Y. 339 (1928), University of Minnesota Law Library: https://lawlibrarycollections.umn.edu/classic-cases-tort-palsgraf-v-long-island-railroad-co | Cardozo's majority treats foreseeability relationally for negligence duty; it is necessary to differentiate the majority's legal holding from competing dissent analysis. This case does **not** by itself establish a universally applicable rule barring pure economic loss. | Research controlling state duty/economic-loss doctrine and later treatment; verify full opinion and dissent before certification. |
| Constitutional Law / L2-5-19 | *United States v. Virginia*, 518 U.S. 515 (1996), full opinion: https://supreme.justia.com/cases/federal/us/518/515/ | The Court requires heightened scrutiny and an exceedingly persuasive justification for sex-based government classifications. The opinion's majority must be distinguished from the separate concurrence and dissent; avoid characterizing the dissent as the governing test. | Check subsequent controlling decisions and specific challenged program facts; independently verify the separate *Washington v. Davis* proposition. |
| Property / L2-6-19 | *Howard v. Kunto*, 3 Wash. App. 393, 477 P.2d 210 (1970), reported opinion: https://law.justia.com/cases/washington/court-of-appeals/1970/3-wash-app-393.html | The Washington Court of Appeals considered whether summer occupancy can satisfy continuous use, and whether predecessors' occupancy of adjoining land mistakenly believed conveyed may be tacked. Do not use it as a national limitation period or as proof that all seasonal possession automatically qualifies. | Check current state statutes, privity, statutory period, later Washington decisions and facts relevant to a chosen jurisdiction. |

**Next audit actions:** (1) review full texts and later authority; (2) cross-check every lesson's exact claimed proposition; (3) record finding as pass, correction needed, or unresolved with reviewer/date; (4) check every related quiz answer and capstone model analysis. The four entries above are bounded spot checks, not final scholarly accreditation or bar-exam readiness certification.
