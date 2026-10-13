# Security Specification: Students Connect

## 1. Data Invariants
- **Identity Invariant**: Users can only create or edit their own profile document (`/users/{userId}`). `userId` must equal `request.auth.uid`.
- **Campus Attribution Invariant**: A user or study circle must belong to an approved accredited university domain or 'Cross-University'.
- **Group Ownership Invariant**: Only the group creator or authorized members can manage group settings; `creatorId` is immutable after creation.
- **Message Integrity Invariant**: Direct and circle messages can only be sent if `request.resource.data.senderId == request.auth.uid`.
- **E2EE Privacy Invariant**: Private chat content and keys are strictly scoped between sender and designated recipient.
- **Task & Resource Scoping**: Tasks and shared resources must belong to an existing group and can only be created by authenticated members.
- **Path Variable Hardening**: Document IDs in paths must conform to alphanumeric characters, dashes, and underscores (`^[a-zA-Z0-9_-]+$`) and be bounded in size (<= 128 characters).

## 2. The "Dirty Dozen" Threat Payloads
1. **Admin Role Spoofing**: Payload attempting to write `role: 'admin'` or `isAdmin: true` inside a student profile.
2. **Buffer Overflow Denial of Wallet**: Payload sending 2MB junk text into `bio` or `description`.
3. **Ghost / Shadow Field Injection**: Payload including unauthorized fields like `isSystemVerified: true` during group creation.
4. **Identity Impersonation on Update**: Writing to `/users/{targetUserId}` when `request.auth.uid != targetUserId`.
5. **Group Creator Takeover**: Payload attempting to modify `creatorId` on `/groups/{groupId}`.
6. **Orphaned Sub-Resource Write**: Creating a task or resource with a malformed or non-existent `groupId`.
7. **Message Sender Spoofing**: Creating `/messages/{msgId}` with `senderId: "victim-uid"` while authenticated as an attacker.
8. **Path ID Poisoning**: Target document ID containing invalid path traversal characters like `../../users/evil`.
9. **Status State-Machine Bypass**: Transitioning task or membership to illegal state (e.g. `status: 'hacked'`).
10. **PII Harvesting via Blanket Read**: Unauthenticated querying of `/users` collection.
11. **E2EE Key Tampering**: Overwriting a user's `e2eeFingerprint` from another user account.
12. **Unauthorized Group Deletion**: Sending delete request to `/groups/{groupId}` from a non-creator account.
