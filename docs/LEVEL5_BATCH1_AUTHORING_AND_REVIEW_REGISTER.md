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
