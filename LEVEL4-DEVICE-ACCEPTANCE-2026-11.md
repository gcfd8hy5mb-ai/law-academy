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

## Updated cloud acceptance — November 9, 2026

The Level 4 cloud work now has **two separate manual** Firebase backup records under the verified Law Academy account: lesson drafts at `snapshots/level4-v1` and practical finals at `snapshots/finals-v1`. The other course levels remain on `snapshots/progress-v1`. No record is silently imported or overwritten by the new finals function.

The practical-final backup is opened through **Cloud Account → Level 4 finals manual cloud backup**. It first offers **Compare finals copies (read-only)** and **Download backup of visible copies**. Only after checking the remote snapshot and expressly confirming a previously saved backup may a signed-in user create the first cloud copy or merge nonconflicting final records. Conflicts in the same exam are blocked; a separate document and revision checks protect existing work.

For actual Firebase and physical-device acceptance, manually perform the following using a verified account and ordinary (non-sensitive) test answers:

1. On Safari with a completed trial essay, download a local backup before any cloud operation. Confirm the backup JSON can be opened independently.
2. In Cloud Account, select **Level 4 finals manual cloud backup**, choose **Compare** and record whether Firebase read succeeds or returns `permission-denied`. An unsuccessful read is **not** evidence that cloud backup is connected. Firestore rules for `snapshots/finals-v1` may need deployment or modification.
3. If no cloud record exists, create the first copy after saving the backup and confirming. Recompare; verify that a revision is present.
4. Sign into the same verified account on a computer, compare finals without importing automatically, and merge only when there are no conflicting exam records. Confirm the computer's draft matches the original iPhone draft after reopening.
5. Edit the *same* exam independently on both devices, compare again, and confirm conflict detection blocks overwriting. Preserve both responses.
6. Repeat the separate lesson backup with a completed advanced knowledge check. Verify `advancedQuiz2026Choice` and `advancedQuiz2026Correct` survive comparison, along with IDs through `L4-7-16`.
7. Recheck the app after restarting Safari and the installed Home Screen app. Only mark actual-device acceptance once the user confirms the results.

**Test status:** The repository includes simulated Firebase transactions and real Chromium/WebKit browser tests, but it cannot prove the production Firestore permission rules, an actual account's state or an iPhone's installed PWA behavior. Do not clear the app or trust finals as automatically synchronized.
