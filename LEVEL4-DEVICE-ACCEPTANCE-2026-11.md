# Law Academy — Level 4 device acceptance checklist
Date prepared: November 8, 2026

## Automated verification
- GitHub Actions workflow `.github/workflows/level4-qa.yml` checks all 100 lessons, worked guides and rubrics, all seven practical exams, and a simulated exam lifecycle.
- Automated simulated lifecycle: open seven exams, save a 180-word draft, snapshot, finish, reopen with draft and reviews restored, reset timer without destroying draft, hide review after reset, generate blind reviewer worksheet and exercise the no-clipboard fallback.
- Final workflow run on the latest mobile-layout commit **passed**. This is not a live browser/device run.
- These tests use a JavaScript DOM/storage simulator and do not cover every browser or Firebase/cloud interaction.

## iPhone Safari and home-screen app — manually verify
1. Launch the live academy from Safari and separately from the saved home-screen app. If one behaves differently, note which one, iOS version and build.
2. Open Exam Center > Level 4 Practical Finals > Civil Litigation. Confirm timeline, evidence and rubric panels expand/collapse and all buttons are visible without horizontal scrolling.
3. Type a unique 160+ word draft; close Safari/the PWA, reopen the same exam and confirm the draft text exactly matches.
4. Save a revision snapshot. Make a visible draft change and restore the older snapshot. Confirm the restored text persists and the old examiner comparison is hidden until the answer is finished again.
5. Submit the draft. Confirm the provisional comparison and category scoring anchors appear. Navigate back and reopen: confirm both are still visible.
6. Choose **Start / reset timer**. Confirm a confirmation prompt appears after an existing timer has started, the unfinished status is saved, the review guides are hidden again, and the draft remains.
7. Tap **Copy reviewer worksheet**. Paste it into Notes. Confirm the draft and six blank scoring categories are present, but your self-score, saved status and example model reasoning are absent. Your own draft may include identifying details; redact before sending it to anyone.
8. If automatic clipboard access fails, confirm the manually selectable worksheet appears and can be copied using the system menu.
9. Repeat steps 2–7 on one other final and verify the first final's draft was not overwritten.
10. Sign out and in only if this is part of the user's normal workflow. **Do not assume Level 4 practical final local drafts sync through Firebase**; independently verify cloud-backup behavior before clearing app data or switching devices.

## Desktop browser — manually verify
1. Open finals at a laptop/desktop browser width; validate readable layout, no horizontal overflow and keyboard access to buttons, disclosure summaries and radio choices.
2. Type, save, reopen, submit, reset and copy a reviewer worksheet as on iPhone.
3. Open two tabs to the same final, edit the draft in the second tab and return to the first; verify conflicting writes are blocked instead of silently overwriting.
4. Verify completed exams render the comparison, and a reset hides it without deleting the draft.
5. Verify clipboard permission denial falls back to selectable text.

## Important limitations
- No live iPhone Safari, iOS PWA or desktop browser acceptance was completed by the assistant on November 8, 2026.
- Structural/virtual-DOM tests are not independent legal review, independent examiner marking, accreditation, bar eligibility or a cloud backup verification.
- Do not clear browser storage or delete a saved home-screen app before exporting/backing up student work and separately checking its persistence.
