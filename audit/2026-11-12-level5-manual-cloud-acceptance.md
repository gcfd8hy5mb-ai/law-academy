# Law Academy Level 5 manual Firebase backup — acceptance and permissions gate
Date: November 12, 2026
Branch: `integration/level4-audit-level5-20261112`, draft PR #6.

## Implemented on this branch
- Separate `law-academy-level5-v1` local drafts and diagnostic records; no change to legacy Level 1–4 keys.
- Optional, **manual** `Cloud Account → Level 5 manual cloud backup` entry for verified users.
- Isolated Firestore target `users/{uid}/academies/law/snapshots/level5-v1` with `academy: law`, `snapshotType: level5`, `schemaVersion: 1`, numeric `revision` and `raw` fields.
- Read/compare before write; explicit dual-copy backup download; first-copy transaction requires no preexisting cloud document; merge transaction checks remote revision, raw content, user identity and local draft stability.
- Conflicting answers to the same lesson/diagnostic ID cause a fail-closed block; disjoint drafts can merge without losing either record.
- Separate source-only tests in `tests/level5-cloud-plan.test.mjs`, plus mocked Firebase browser acceptance `tests/level5-cloud-backup.spec.mjs`.

## Not implemented or not verified
1. **Not automatic sync.** Device-local drafts are the live working copy. Use manual compare and backup when changing devices.
2. **Firestore security rule permission unknown.** No production Firestore rules were changed. A verified user may receive `permission-denied` on the new `snapshots/level5-v1` path. Review existing rules carefully; authorize only the user's own UID and an explicitly constrained Level 5 snapshot schema. Do not weaken restrictions on `progress-v1`, `level4-v1` or `finals-v1`.
3. **No real Firebase test account or iPhone/desktop round trip was used.** Mocked tests do not establish production access, multi-device performance, true offline behavior or secure rules.
4. **No independent legal, academic or bar examination sign-off** is implied.

## Authorized manual acceptance (test account and private preview only)
1. Record exact preview SHA, device OS/browser, account alias and local draft counts. Back up any existing data first.
2. On iPhone Safari, open Level 5; write a unique draft; close/reopen; confirm exact restored text.
3. Open Cloud Account with a verified *test* account; open Level 5 manual backup. Click Compare; verify only the dedicated snapshot is read, without a write.
4. Download a Level 5 backup and verify its contents. Only on a **test account**, authorize first cloud copy. Verify revision 1 and expected JSON without any changes to prior-level Firebase documents.
5. Sign into the same test account on desktop; open Level 5 backup; compare cloud and local; import cloud-only draft via safe merge. Verify correct restored text and revision 2 (if a merge was required).
6. Create nonoverlapping drafts on iPhone and desktop; compare, export and merge; verify both remain present after refresh.
7. Alter the **same** lesson on both devices; verify the conflict is explicitly flagged and neither copy is overwritten automatically. Download both and resolve outside the app.
8. Sign out; verify another test account cannot access the first account's snapshot. Inspect security rules and Firestore audit records; no IDs, secrets, answers or screenshots with personal data in public issues.
9. Test denied permission, interrupted connection, stale revision, storage quota errors and local work changed during a merge. Keep both copies and show an error instead of claiming success.
10. Test Safari installed-to-Home-Screen separately, desktop keyboard navigation and a previously enrolled learner's historical Level 1–4 grades. Repeat against the final exact SHA.

**Release gate:** DO NOT MERGE/DEPLOY on automated green alone. Record independent technical acceptance and authorized rule review before enabling this in production. Existing student data and grade history must stay unchanged.
