# Law Academy — direct legal-currency contradiction corrections, Batch 4
**Date:** 2026-11-13
**Branch:** `integration/level4-audit-level5-20261112` — Draft PR #6.
**Scope:** Correct contradictory/misleading original legal instructions, not merely append new generic text. No merge, deployment, Firebase or student-data changes.

## Correction A — Delaware DGCL §144 applicability
**Directly edited `level4.js`**, including the Level 4 M&A final `L4-3-10` and a second board-analysis passage. Replaced a transaction-date-driven rule-selection instruction, which was misleading after the 2025 amendment, with the actual application language:
- Delaware **85 Del. Laws ch. 6 §3** specifies §§1–2 apply to acts and transactions **before, on or after** enactment.
- Statutory exceptions protect specified proceedings commenced and books-and-records demands made **on or before February 17, 2025**.
- The relevant exception depends on the actual proceeding/demand history, not transaction date alone.
- Primary source: https://legis.delaware.gov/json/BillDetail/GenerateHtmlDocument?docTypeId=2&legislationId=141930&legislationName=SS1forSB21&legislationTypeId=6 ; Delaware Code: https://delcode.delaware.gov/title8/c001/sc04/

**Also edited `level4-legal-updates-final-2026.js`** so its `DE144_2025` legal-currency alert does not reintroduce the erroneous shortcut in `L4-3-6`, `L4-3-11`, `L4-3-13` and `L4-7-11`. This is directly revised source language; no new IDs or answers were issued.

## Correction B — Federal Rule of Evidence 801(d)(1)(A), November 2026
**Directly edited `level4-legal-updates-final-2026.js`** in the `FRE801_PENDING` alert for lessons `L4-1-3`, `L4-1-4`, `L4-1-12`.
- The Supreme Court **adopted and transmitted** the Rule 801 amendment to Congress on April 8, 2026, rather than its being merely an unadopted proposal.
- As of this audit's **November 13, 2026** date, the stated operative date is **December 1, 2026**; the change is **not yet effective**, so teaching must not prematurely apply it to a proceeding set before December 1.
- The Court's order addresses pending proceedings insofar as just and practicable, requiring separate applicability analysis once effective.
- Authority: https://www.supremecourt.gov/orders/courtorders/frev26_da3i.pdf ; https://www.uscourts.gov/forms-rules/pending-rules-and-forms-amendments

## Regression and evidence
Added `scripts/verify-legal-currency-contradictions-20261113.cjs` and a new CI step. Its test assembles the **complete 100-lesson Level 4 source sequence**, checks the corrected original M&A teaching, the Section 3 applicability exception, three Rule 801 alerts and their Supreme Court source pointer, and retains all 100 lesson IDs and original quiz/answer/explanation fields. The full curriculum integration continues to validate **34 courses, 523 lesson records**, advanced exams, 34-course blueprint and 523-row primary-law human-review queue.

GitHub Actions [combined integration run 43472310144](https://github.com/gcfd8hy5mb-ai/law-academy/actions/runs/43472310144): **PASS** at code commit `2a682406bbb87577695769ff3304310519bfec27`. Earlier diagnostic runs failed due to an incomplete 70/100 core-versus-supplement test setup and then malformed escaped test regex, both corrected without changing any assessment answer. No earlier failures are silently treated as passes.

## Limitations and next substantive checks
These are **specific source-supported direct corrections**, not independent professional approval. Verify broader contradictory statements in the remaining pre-law, Level 2, Level 3 and Level 5 materials, including updates to procedures, tax-year-specific limits, individual case subsequent treatment, local court rules and statutory source-jurisdiction differences. Require independent attorney/faculty review before asserting complete doctrinal accuracy, bar preparation equivalency, credit or accreditation.

**User's sequencing preserved:** curriculum and academic audits first; website redesign afterward; Firebase, real-device acceptance and production release later, with authorization.
