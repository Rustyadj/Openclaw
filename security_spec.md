# Firebase Security Specification - OpenClaw

## 1. Data Invariants
- An **Agent** must belong to a specific `userId`. Only that user can read or modify it.
- A **Project** must belong to an `owner_id`. Access is restricted to the owner.
- A **Memory** is tied to a `user_id`. It can optionally be associated with a `project_id`. Scope must be one of `global`, `project`, or `session`.
- A **CronJob** must belong to a `userId`. Its `targetAgentId` must point to an agent owned by the same user.
- **Stats** are system-read only for most users, but for this demo, let's allow users to read their own usage if we were to shard it. However, the blueprint currently has a global `stats/usage`. I will restrict it to authenticated reads.

## 2. The Dirty Dozen (Payloads that should fail)

1. **Identity Spoofing (Agent)**: Creating an agent with a `userId` that is not mine.
   ```json
   { "name": "Evil Agent", "userId": "victim_uid", "role": "Hacker", "model": "gemini-1.5-pro" }
   ```
2. **Ghost field injection (Project)**: Adding a `isPremium: true` field to a project.
   ```json
   { "name": "Project X", "owner_id": "my_uid", "isPremium": true }
   ```
3. **Privilege Escalation (Memory)**: Setting an `importance_score` of 999.
   ```json
   { "content": "I am god", "user_id": "my_uid", "importance_score": 999, "scope": "global" }
   ```
4. **ID Poisoning (Agent)**: Using a 2KB string as a document ID.
5. **Relationship Orphan (CronJob)**: Creating a CronJob for an agent that doesn't exist.
   ```json
   { "name": "Backup", "schedule": "* * * * *", "targetAgentId": "non_existent_id", "userId": "my_uid" }
   ```
6. **Immutable Field Tampering (Project)**: Trying to change the `owner_id` of an existing project.
7. **Type Mismatch (Agent)**: Sending `temperature` as a string `"high"` instead of a number.
8. **Size Violation (Memory)**: Sending a `content` string that exceeds 1MB (handled by Firestore, but we should have rules for smaller limits if needed). Let's say 100KB for content.
9. **Illegal Enum Value (Agent)**: Setting `status` to `"terminated"` (not in enum).
10. **Cross-User Delete**: Attempting to delete a Project belonging to another user.
11. **Malicious Path Injection**: Trying to write to `/stats/usage` without being an admin.
12. **Null PII Read**: Trying to read another user's profile if we had one.

## 3. Test Runner (Security Rules Tests)
A separate test file will be generated later.
