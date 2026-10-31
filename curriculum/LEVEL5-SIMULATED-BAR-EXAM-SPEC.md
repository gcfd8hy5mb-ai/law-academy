# Law Academy — Final Simulated Bar Examination Specification

**Role:** A private, educational capstone at the end of Level 5. This is **not** the official bar exam, an NCBE product, a professional license, legal qualification, or an accredited degree.

## Candidate experience
The learner unlocks a full realistic **Simulated Bar Examination** after completing all five academic levels and prerequisite practice tasks. A dedicated exam dashboard shows exam-day instructions, accessibility settings, permitted materials, a readiness checklist and an explicit start control. Draft work is automatically saved on-device without revealing answers during the exam. Include a safe recovery procedure for device interruption.

## Blueprint and formats
Map items to the then-current **NCBE NextGen UBE content scope and format** plus a separate Texas-law component reflecting the Texas BLE's applicable requirements. Version the blueprint and date reviewed. Include:
- Multiple-choice questions that require accurate application of facts and rules.
- Integrated question sets using shared client files or scenarios, with mixed question formats where appropriate.
- Performance tasks, legal research, document interpretation, issue spotting, analysis and written responses.
- Texas-specific law assessments and ethics/professional-responsibility study, distinguishing actual jurisdictional requirements.
- Full exam-length sessions with appropriate time limits, breaks, navigation rules and accommodations; configure length and format to published requirements in force when deployed, not a guessed fixed question count.

## Security and academic standards
- An independent, **held-out** exam bank that was never used in lessons, practice exams, tutor feedback, or examples. No answer-key leakage before an attempt is submitted.
- Balanced answer-option distribution, plausible distractors and checked correct keys, multiple versions and item-quality audits.
- An evidence-based blueprint matrix tagging each item by tested skill, doctrinal area, jurisdiction, source, reviewer, date, complexity, and revised version.
- Timed sessions, accurate scoring for objectively gradable tasks, and **human or independently validated rubric-based evaluation** for written/performance work. Do not mistake keyword matching or length for valid grading.
- A detailed results report after full completion: domain-level diagnostics, missed issues, answer rationales, writing rubric feedback, time management and a personalized retake plan.
- Multiple fresh full-length attempts, including at least two held-out forms, for consistent performance assessment. Do not translate homemade raw percentages into an official NCBE scaled score or say the learner officially passed Texas's bar.

## Completion label
When prerequisites and rigorous scoring are satisfied, display **“Law Academy Simulated Bar Exam — Completed”** with a dated educational score report, assessed components and evaluator details. If readiness is supported, separately display **“Practice bar-readiness benchmark met”** with caveats on calibration. Never show “Licensed Attorney,” “Passed the Texas Bar,” “NCBE Certified,” or an official-looking bar result.

## Build and release acceptance tests
1. Exam locked until Level 5 requirements are met; practice mode is separate.
2. Session can survive reloads without losing student answers or accidentally exposing keys.
3. Timer, interruptions, submission rules, scoring and accommodations tested on iPhone and desktop.
4. Written answers export cleanly for review, while review-status remains honest if no evaluator is available.
5. Scoring verifies every correct answer against expert-reviewed keys and aligns with published exam requirements.
6. Blueprint reviewed for version drift at each official exam update.
7. Clear warning that completing this simulated exam does **not** confer legal eligibility to sit the real exam.

**Status as of 2026-10-31:** Specification approved as an architectural goal; exam question bank, engine, calibrated grading and final exams are **not yet built**. Continue Pre-Law accuracy audit before implementation of later levels.
