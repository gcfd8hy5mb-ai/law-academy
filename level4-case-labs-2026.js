// Additional Level 4 applied legal case labs, November 2026.
// Additive only: stable lesson IDs, no changes to user drafts or grading keys.
(function(){
 'use strict';
 const courses=window.LAW_LEVEL4;
 if(!Array.isArray(courses))return;
 const additions=[
  {
    "id": "L4-1-11",
    "title": "Case lab — preservation, sanctions and proportional discovery",
    "authority": "Fed. R. Civ. P. 26(b)(1), 26(f), 37(e); distinguish actual prejudice from intent to deprive",
    "scenario": "A supplier's messaging platform deletes 45 days of chats after a litigation hold email was sent to managers but not IT. Archived customer emails survive. Buyer requests an adverse-inference instruction.",
    "reading": "STAGE 1 — Identify exactly when litigation became reasonably anticipated, which custodians and systems carried relevant electronically stored information (ESI), and what preservation steps were reasonable. Do not conflate breach of a retention policy with a court's Rule 37(e) findings. STAGE 2 — Determine whether relevant ESI was lost because reasonable steps were not taken and whether it can be restored or replaced by email archives, devices, or recipients. A finding of prejudice can permit measures no greater than necessary to cure prejudice under 37(e)(1). A presumption that lost information was unfavorable, an adverse-inference instruction, or terminating sanctions under 37(e)(2) require a finding of intent to deprive another party of the information's use in litigation. STAGE 3 — For discovery, tie each request to a contested claim or defense and discuss proportionality, expense, accessibility and alternatives. STAGE 4 — Compare the genuine uncertainty in deleted chat content with what can be proved from intact records. Write both parties' proposed orders, making findings conditional on proof rather than assuming wrongdoing. REAL CASE RESEARCH: Read the rule text and committee note, identify later controlling circuit authority and local practice; this fictional case does not reproduce a reported opinion.",
    "counterarguments": "Buyer says managers knew suit was likely and chose not to stop deletion; supplier says IT was unaware, routine deletion was not calculated to deprive, and near-identical messages can be restored elsewhere.",
    "assignment": "Submit a preservation chronology; a 12-row custodian/system evidence matrix; a 1,200-word sanctions brief with separate Rule 37(e)(1) and (e)(2) analyses; a proportional discovery plan; and two conditional bench rulings. Add a variation proving an intentional deletion instruction and explain the different remedy.",
    "question": "What additional finding is required for an adverse-inference instruction under federal Rule 37(e)(2)?",
    "options": [
      "Any unpreserved message automatically suffices",
      "Intent to deprive another party of the information's use in litigation",
      "Only that discovery was expensive"
    ],
    "answer": 1,
    "why": "Rule 37(e)(2) reserves specified severe measures for intentional deprivation, subject to the rule's threshold conditions.",
    "sourceUrls": [
      "https://www.law.cornell.edu/rules/frcp/rule_37",
      "https://www.law.cornell.edu/rules/frcp/rule_26"
    ],
    "status": "draft — practice only; qualified legal review and independent grading pending",
    "sourceReview": {
      "checkedAsOf": "2026-11-07",
      "scope": "targeted primary-source review; not a full citator or jurisdiction review",
      "sourceUrls": [
        "https://www.law.cornell.edu/rules/frcp/rule_37",
        "https://www.law.cornell.edu/rules/frcp/rule_26"
      ]
    }
  },
  {
    "id": "L4-2-11",
    "title": "Real-case workshop — Brady disclosure and postconviction review",
    "authority": "Brady v. Maryland, 373 U.S. 83 (1963); Strickland v. Washington, 466 U.S. 668 (1984); later controlling disclosure and collateral-review rules",
    "scenario": "After a robbery conviction, counsel learns that a prosecution investigator had an interview undermining the eyewitness identification. The defendant also argues trial counsel failed to investigate a transit-card alibi.",
    "reading": "REAL CASE 1 — Brady v. Maryland held that suppressing material favorable evidence violates due process; read the original opinion and distinguish the trial's guilt and penalty phases. For modern applications, identify later cases governing the prosecution team's knowledge, impeachment evidence, cumulative materiality and remedies. The legal question is not whether evidence is labeled favorable but whether the established disclosure standard and materiality are satisfied on this record. REAL CASE 2 — Strickland v. Washington requires deficient performance and prejudice, normally framed as a reasonable probability of a different result. Analyze trial counsel's investigation using information available at the relevant time, not hindsight. Applied hypothetical: first create a timeline of who learned what and when. Separate evidence that the State possessed from materials only defense counsel could obtain. Evaluate reliability of the investigator's notes, witness confidence, alibi records and other trial evidence together. Determine the proper filing vehicle, exhaustion, procedural default, limitations and deference rules for the chosen court before promising relief. Draft separately a disclosure claim and an ineffective-assistance claim, even if facts overlap; do not substitute one test for the other.",
    "counterarguments": "State claims the notes were cumulative and the remaining evidence strong; defense argues undisclosed impeachment affects confidence in verdict. Counsel claims the alibi route was explored but contradicted by records.",
    "assignment": "Read and brief Brady and Strickland; produce two 900-word IRAC analyses, a prejudice/materiality evidence chart, a verification checklist for postconviction procedure, and an appellate-style argument for each side. Show changed outcomes if the transit logs conclusively place defendant elsewhere or if three independent camera angles corroborate the identification.",
    "question": "Under Strickland, which two components ordinarily must a defendant establish?",
    "options": [
      "Attorney error alone and an apology",
      "Deficient performance and resulting prejudice",
      "A Brady violation and a civil damages award"
    ],
    "answer": 1,
    "why": "Strickland requires both objectively deficient representation and prejudice, evaluated under the governing standards.",
    "sourceUrls": [
      "https://www.law.cornell.edu/supremecourt/text/373/83",
      "https://supreme.justia.com/cases/federal/us/466/668/"
    ],
    "status": "draft — practice only; qualified legal review and independent grading pending",
    "sourceReview": {
      "checkedAsOf": "2026-11-07",
      "scope": "targeted primary-source review; not a full citator or jurisdiction review",
      "sourceUrls": [
        "https://www.law.cornell.edu/supremecourt/text/373/83",
        "https://supreme.justia.com/cases/federal/us/466/668/"
      ]
    }
  },
  {
    "id": "L4-5-11",
    "title": "Real-case workshop — judicial review after Loper Bright",
    "authority": "Loper Bright Enterprises v. Raimondo, 603 U.S. 369 (2024); Administrative Procedure Act, 5 U.S.C. § 706",
    "scenario": "A federal agency adopts a regulation requiring operators to pay for a new monitoring process. The statute authorizes oversight but does not expressly describe this fee; the agency says its technical expertise warrants deference.",
    "reading": "READ THE REAL OPINION: In Loper Bright Enterprises v. Raimondo, the Supreme Court overruled Chevron's instruction that courts defer to an agency interpretation merely because a statute is ambiguous. Under the APA, a reviewing court exercises independent judgment on relevant questions of law, although agency expertise may be persuasive. Do not infer that every prior regulation or every agency interpretation is automatically invalid; analyze statutory authorization, any delegation, the agency's interpretation, standards of review and procedural posture. BUILD THE RECORD: Identify the enabling statute, delegation terms, statutory limits, regulatory record, agency's explanations, submitted comments and plaintiffs' standing. Separate questions of law from fact-dependent technical judgments and explain any remaining legally applicable forms of review. ARGUE BOTH SIDES: operators contend that the fee lacks congressional authorization; agency responds that the structure and purpose of the statute permit the specific arrangement. RESEARCH CURRENCY: compare the actual Loper Bright holding to subsequent controlling appellate decisions and the particular statute involved; this hypothetical's outcome is not supplied by the general holding alone.",
    "counterarguments": "Agency argues that technical context supports its reading and Congress conferred implementation discretion. Operators respond that policy expertise cannot create fee authority not provided by law.",
    "assignment": "Brief Loper Bright; create a statutory text/delegation/record table; draft a 1,200-word judicial-review bench memorandum; identify standing, preservation and remedy; write two competing dispositions with citations. Variation: Congress expressly authorizes reasonable monitoring fees subject to a formula.",
    "question": "What did Loper Bright change about agency statutory interpretations?",
    "options": [
      "It invalidated every agency rule automatically",
      "Courts no longer must apply Chevron deference merely because a statute is ambiguous",
      "It abolished all agency factfinding"
    ],
    "answer": 1,
    "why": "The Court requires independent judicial judgment on statutory interpretation; the precise delegation and review framework still matter.",
    "sourceUrls": [
      "https://www.law.cornell.edu/supremecourt/text/22-451",
      "https://www.law.cornell.edu/uscode/text/5/706"
    ],
    "status": "draft — practice only; qualified legal review and independent grading pending",
    "sourceReview": {
      "checkedAsOf": "2026-11-07",
      "scope": "targeted primary-source review; not a full citator or jurisdiction review",
      "sourceUrls": [
        "https://www.law.cornell.edu/supremecourt/text/22-451",
        "https://www.law.cornell.edu/uscode/text/5/706"
      ]
    }
  },
  {
    "id": "L4-6-11",
    "title": "Professional responsibility lab — conflicts, confidentiality and settlement authority",
    "authority": "ABA Model Rules of Professional Conduct 1.4, 1.6, 1.7, 1.9, 1.16 and 1.2(a); verify local adopted rules",
    "scenario": "A firm negotiating for a software company receives an approach from a new client seeking to sue that same company. Meanwhile a junior lawyer learns a proposed settlement omits a significant data-breach fact.",
    "reading": "STEP 1 — Confirm the actual jurisdiction's ethics rules: ABA Model Rules are teaching models, not automatically controlling. Identify existing client, former client and prospective client duties separately. STEP 2 — Document who is owed loyalty and confidentiality; evaluate direct adversity and material limitation under the applicable Rule 1.7 standard, and test whether a conflict is consentable with informed written consent. Confidential information does not become free to disclose because it might be helpful in negotiating another client's case. STEP 3 — Separate settlement authority from litigation strategy. Under Model Rule 1.2(a), the client decides whether to settle; Model Rule 1.4 requires adequate consultation and communication. STEP 4 — Analyze whether the omitted fact makes any affirmative statement misleading or triggers disclosure under controlling law and ethics rules. Never assume that a lawyer can unilaterally reveal confidential information; identify any exceptions, mandatory duties, or withdrawal requirements with jurisdiction-specific citations. STEP 5 — Prepare client-facing options describing conflict remediation, independent counsel, permissible negotiation positions, timing and risks.",
    "counterarguments": "Firm claims its teams are screened and work is unrelated; affected client says the direct adversity and material limitation undermine loyalty. A client requests nondisclosure of a fact whose legal significance is disputed.",
    "assignment": "Draft a conflicts matrix, a 1,000-word ethics memorandum, client consultation script, proposed decision record and withdrawal contingency. Describe how conclusions change when the litigating client was formerly represented rather than currently represented.",
    "question": "Who ordinarily decides whether to accept a civil settlement under ABA Model Rule 1.2(a)?",
    "options": [
      "The client after adequate consultation",
      "The lawyer alone in every case",
      "The opposing party's lawyer"
    ],
    "answer": 0,
    "why": "The client controls the settlement decision; the lawyer advises and communicates under governing rules.",
    "sourceUrls": [
      "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_2_scope_of_representation_allocation_of_authority_between_client_lawyer/",
      "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_7_conflict_of_interest_current_clients/"
    ],
    "status": "draft — practice only; qualified legal review and independent grading pending",
    "sourceReview": {
      "checkedAsOf": "2026-11-07",
      "scope": "targeted primary-source review; not a full citator or jurisdiction review",
      "sourceUrls": [
        "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_2_scope_of_representation_allocation_of_authority_between_client_lawyer/",
        "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_7_conflict_of_interest_current_clients/"
      ]
    }
  }
];
 const targets=["L4-1","L4-2","L4-5","L4-6"];
 additions.forEach((lesson,i)=>{const course=courses.find(c=>c.id===targets[i]);if(course&&Array.isArray(course.lessons)&&!course.lessons.some(x=>x.id===lesson.id))course.lessons.push(lesson)});
})();
