# Security Specification - SonicStream

## Data Invariants
1. A user can only read/write their own profile in `/users/{userId}`.
2. A user can only read/write their own history and liked songs.
3. Playlists can be public (read-only for others) or private (only owner).
4. Tracks within a playlist follow the playlist's privacy.
5. `createdAt` is immutable.
6. `email` in user profile must match authenticated email.

## The Dirty Dozen Payloads
1. Attempt to update another user's `favoriteGenres`.
2. Attempt to create a playlist for another `userId`.
3. Attempt to set `hasSeenOnboarding` to `true` for another user.
4. Attempt to write a 1MB string to a track title.
5. Attempt to update `createdAt` on a user document.
6. Attempt to delete a public playlist not owned by the user.
7. Attempt to inject a field `isAdmin: true` into a user profile.
8. Attempt to write to `/users/global/config` (catch-all fail).
9. Attempt to read a private playlist of another user.
10. Attempt to create a track with an invalid `streamUrl` (too long).
11. Attempt to spoof `uid` in the document while authenticated as a different user.
12. Attempt to list all users in the system.

## Test Runner Plan
I will implement a robust set of rules that prevent these operations.
Rules will include size checks, identity checks, and relational sync for subcollections.
