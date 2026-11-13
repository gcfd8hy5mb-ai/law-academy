# Law Academy — Five-level assessment progression and independent grading blueprint
**Date:** 2026-11-13
**Branch:** `integration/level4-audit-level5-20261112` (Draft PR #6)
**Status:** internal academic alignment framework only; no external legal/academic endorsement.

## Academic purpose and boundaries
The five-stage program offers original educational exercises across 34 courses and 523 lesson records. A valid multiple-choice checkpoint is **not** the same as demonstrated legal analysis. A case packet, model reasoning and a point rubric are scaffolding, not proof that an unobserved student's written work was graded. All summative written assessments must be actually administered, scored, source-checked, moderated and documented before describing mastery or academic equivalence.

### Stage-by-stage progression
| Stage | Verified structure | Expected student performance | Minimum written evidence for human review |
|---|---|---|---|
| Pre-Law / Level 1 | 6 courses, 85 lessons: legal institutions, constitutional foundations, research, writing, everyday law and ethics | Identify source hierarchy and jurisdiction; distinguish holding from dicta; practice fact-rule-application-conclusion without overclaiming certainty | Source ledger; short IRAC/CREAC opinions; initial adverse-authority and ethics analysis |
| Level 2 | 7 courses, 128 lessons: contracts, torts, civil procedure, criminal law, constitutional law, property, research/writing | Classify multiple plausible claims, select governing statute and procedural posture, produce bilateral legal arguments and remedy proof | The seven course-specific expanded capstones, original fact matrices, citations verified for the selected forum, written predictive memo and changed-fact response |
| Level 3 | 7 courses, 70 lessons: evidence, business organizations, administrative law, professional responsibility, federal taxation, remedies/civil litigation, criminal procedure | Resolve overlapping doctrines and evidence admissibility, identify authority hierarchy, professional duties and procedural options | Complex factual exercises with adversarial response, record exhibits, jurisdiction and citation log, ethics assessment |
| Level 4 | 7 courses, 100 lessons: trial, criminal practice, transactions, appellate advocacy, regulation, counseling and integrated remedies | Manage contested proof, procedural strategy, client/board decisions and professional work product across multiple issues | Seven original practical finals with exhibit packets, six-category 100-point examiner calibration, change-of-facts response and independent human review |
| Level 5 | 7 courses, 140 lessons: advanced constitutional, complex litigation, corporate/international, evidence/trial, ethics, judicial writing, bar-style capstone | Prioritize cross-doctrinal issues, advise under uncertainty, defend conclusions against adverse authority, distinguish jurisdiction and remedy alternatives | Advanced written finals, worked case studies, source-validity ledger, capstone product, independent examiner feedback; no claim of official bar questions or eligibility |

## Examiner scoring protocol for all long-form assignments
Each grader should verify **actual jurisdiction-specific operative primary law and subsequent treatment** before assessing substance. Do not score a confident but unfounded legal conclusion as correct simply because it matches a stored model answer. Provide a transparent criterion ledger: (1) issue formulation and source hierarchy, (2) precise statutory/rule elements, (3) application to stated record, (4) adverse position and alternative factual outcome, (5) remedies/ethics/procedural posture, (6) written clarity and accurate citations. A model exam's original rubric controls its exact weighting; do not silently replace recorded rubric percentages with this conceptual ledger.

For independent substantive exam review, record the examiner's role and qualifications, primary authorities consulted, date, written rationale, criterion scores, disagreement with the model reasoning, factual uncertainty, and disposition. Two independent examiners should assess representative anonymized scripts and reconcile meaningful score differences. Do not generate learner grades or mark a course passed without a real response and the required grader.

## Seven Level 4 practical finals — specific human review targets
| Course | Review focus | Common error examiner must test |
|---|---|---|
| L4-1 Civil litigation | ESI preservation, hearsay layers, expert proof, trial motion timing | Treat all lost records as deliberate evidence destruction |
| L4-2 Criminal practice | Suppression, identification, plea duties and sentencing posture | Infer guilt or admissibility without separate constitutional and statutory tests |
| L4-3 Business transactions | Reps and warranties, governance, conditions, financial disclosures | Treat alleged undisclosed issues as proven breach without contract text and causation |
| L4-4 Appellate advocacy | Preserved errors, standards of review, remedy scope | Argue facts not contained in the appellate record |
| L4-5 Regulation | Subpoena authority, response duties, privilege, corrective action | Assume a regulator's voluntary request has the same force as every subpoena |
| L4-6 Client counseling | Conflicts, consent, settlement authority and fee duties | Treat confidentiality as permission to mislead or to ignore conflicts |
| L4-7 Integrated capstone | Multiple proceedings, board duties, evidence security and cross-border risk | Invent one nationwide compliance deadline or privilege rule |

The automation `scripts/audit-level4-practical-final-examiner-queue.cjs` verifies seven distinct finals, evidence packets, altered-fact cases, a valid lesson checkpoint, and 100-point case-specific rubric and calibration totals. The generated `audit/level4-seven-practical-finals-examiner-queue.csv` is a reviewer queue, **not** a document certifying actual examiner performance.

## Outstanding curriculum-only sign-off gates
1. **Authority review:** qualified reviewers check every material statute, current rule, reported judicial holding, jurisdiction and negative treatment; outdated sources require specific corrections.
2. **Substantive depth:** review the 24 Level 4 short main readings alongside their existing worked guides. Presence of a guide does not validate its accuracy or student comprehension.
3. **Written final quality:** human experts evaluate the seven Level 4 practical finals, Level 5 written finals, and representative foundational essays using original responses and documented criterion moderation.
4. **Progression validity:** compare matched skill demonstrations at Pre-Law, Level 2, Level 3, Level 4 and Level 5 for increasing complexity and record-based work, and address gaps revealed by actual grading.
5. **Independent evaluation:** only an external qualified reviewer can provide independent academic equivalency findings. This curriculum does not by itself confer a JD, credits, professional admission or authorization to sit for a bar exam.

**Release constraints:** Do not merge, deploy, alter Firebase or cloud records, change student grades/progress, or start website redesign in this curriculum-only batch.
