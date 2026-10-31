# Academy cross-device progress sync — implementation plan

Status: preparatory design only; no Firebase project is configured here. Do not enable remote sync or replace local storage until migration tests pass.

## Confirmed current storage
- Business Academy uses browser localStorage key `business-academy-v1` for application state; additional coursework storage must be audited.
- Law Academy uses `law-academy-progress-v1`, `law-academy-exam-results-v1`, `law-academy-capstone-v1` and additional localStorage keys for writing, oral responses, reviews, etc.
- Ethical Hacking Academy repository not yet found; design future app to use same identity with isolated learner records.

## Proposed Firebase architecture
- One Firebase Authentication project shared across the three academy applications; email/password login (individual UID per student).
- Firestore path: `users/{uid}/academies/{academyId}/snapshots/{storageKey}`.
- Allowlisted `academyId`: `business`, `law`, `ethical-hacking`.
- Document fields: `data` (JSON-compatible object), `schemaVersion`, `updatedAt` (server timestamp), `deviceId`, `revision`. Never store plaintext passwords/tokens.
- Access is per authenticated UID; admin reporting, if added, uses explicit roles and dedicated read-only aggregates. Never expose student records to another student.

## Migration safety — mandatory
1. Inventory *all* localStorage/IndexedDB keys and the actual save call sites before integration; this file is not that inventory.
2. On first sign-in, preserve a local export/backup before any remote writes.
3. If remote record is absent, offer importing current-device data to the authenticated user's account.
4. If both local and remote records exist, compare and present a non-destructive import/review decision. Never overwrite silently; merge completed achievements only where semantically safe.
5. Keep local write behavior working offline; queue changes and retry on reconnection.
6. Explicitly display statuses: Saved on device / Syncing / Synced / Needs attention.
7. Test on iPhone Safari and Home Screen PWA plus a second device; sign out/in and verify independent second-student accounts.
8. Make database security rules and automated emulator tests a release blocker.

## Suggested Firestore rules (review and test with emulator before deploy)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/academies/{academyId}/snapshots/{storageKey} {
      allow read, write: if request.auth != null
        && request.auth.uid == uid
        && academyId in ['business', 'law', 'ethical-hacking'];
    }
  }
}
```

Additional schema validation, size limits and least-privilege constraints should be added before production. Firestore documents have a size limit, so large snapshots may require splitting per course or record.

## Go-live conditions
- Firebase project and web-app config provided through legitimate configuration mechanisms (no secrets committed).
- Email authentication domains reviewed.
- Migration backup/export, conflicts and multi-device tests pass.
- Both existing academies retain their current appearance and curriculum.
