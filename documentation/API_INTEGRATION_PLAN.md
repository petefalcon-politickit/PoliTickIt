# PoliTickIt Mobile — API Integration Plan

**Created**: 2026-05-31  
**Status**: Approved for Execution  
**Author**: Architecture Review

---

## 1. Executive Summary

The PoliTickIt mobile app has a well-designed service abstraction layer with repository interfaces, API clients, and SQLite caches already built. The critical gap is **activation**: the IoC container (`container.ts`) is wiring `Mock*` implementations instead of `Api*` implementations, and several backend endpoints required by the mobile are missing or incomplete.

This plan is organized into **4 sequential phases**. Each phase is independently deployable and delivers measurable user-facing value. Phases 1–2 are P1 blockers. Phases 3–4 complete the personalization layer.

### What stays static (no API needed)

| Data                                 | Reason                                          |
| ------------------------------------ | ----------------------------------------------- |
| Policy Area list (38 CRS categories) | Standard congressional codes; infrequent change |
| Participation tier definitions       | Product-defined business rules                  |
| Theme / color constants              | UI-only, no server dependency                   |

---

## 2. Current State Assessment

### Data Source Inventory

| Data Domain                                  | Mobile Source                         | Repository Used                 | API Client                       | Backend Endpoint                                 | Gap                                      |
| -------------------------------------------- | ------------------------------------- | ------------------------------- | -------------------------------- | ------------------------------------------------ | ---------------------------------------- |
| PoliSnaps                                    | `snapLibrary.ts` (4 hardcoded)        | `MockSnapRepository`            | `ApiSnapRepository` ✅           | `GET /api/snaps` (basic, no category/pagination) | Container wiring + backend filter params |
| Representatives                              | `mockData.ts` (6 hardcoded)           | `MockRepresentativeRepository`  | `ApiRepresentativeRepository` ✅ | `GET /api/representatives` (stub)                | Container wiring + data population       |
| Current User / Auth                          | `mockData.ts` hardcoded `Pete Falcon` | None                            | None                             | ❌ Missing entirely                              | Full auth system                         |
| User Registration                            | 6-step form, data not sent            | None                            | None                             | ❌ Missing                                       | Register endpoint                        |
| User Preferences (interests, reps, agencies) | Not persisted                         | `MockSettingsProvider`          | None                             | ❌ Missing                                       | Preferences endpoints                    |
| Community Snaps                              | Empty array in `snapLibrary.ts`       | `MockSnapRepository`            | `ApiSnapRepository` ✅           | Depends on ingestion categories                  | Ingestion activation                     |
| Knowledge Snaps                              | Empty array in `snapLibrary.ts`       | `MockSnapRepository`            | `ApiSnapRepository` ✅           | Depends on ingestion categories                  | Ingestion activation                     |
| Participation Actions                        | Local SQLite                          | `SqliteParticipationRepository` | `ApiParticipationRepository` ✅  | `POST /api/participation/upload` ✅              | Container activation                     |
| FEC Correlations                             | Local SQLite                          | `SqliteCorrelationRepository`   | `ApiCorrelationRepository` ✅    | `GET /api/correlations/**` ✅                    | Ingestion pipeline activation            |
| Sentiment / Polls                            | `AsyncSentimentRepository`            | `AsyncSentimentRepository`      | None                             | ❌ Missing                                       | New endpoint                             |
| Watchlist                                    | `WatchlistService` (local only)       | Local                           | None                             | ❌ Missing                                       | Persist server-side                      |

### Service Container Status (`services/container.ts`)

```
MockSnapRepository          → REPLACE with ApiSnapRepository (Phase 2)
MockRepresentativeRepository → REPLACE with ApiRepresentativeRepository (Phase 3)
MockSettingsProvider         → REPLACE with ApiSettingsProvider (Phase 4)
ApiParticipationRepository   → Already wired; ACTIVATE sync (Phase 2)
ApiCorrelationRepository     → Already wired; ACTIVATE ingestion (Phase 3)
```

---

## 3. Phase 1 — Authentication & User Session

**Priority**: 🔴 P1 — Foundational blocker for all other phases  
**Goal**: Replace hardcoded user identity with a real authenticated session. Every API call in Phases 2–4 requires a bearer token from this phase.

### 3.1 Backend Changes

#### New Endpoints Required

```
POST   /api/auth/register     — Create new user account
POST   /api/auth/login        — Authenticate; return JWT access + refresh token
POST   /api/auth/refresh      — Refresh expired access token
POST   /api/auth/logout       — Invalidate refresh token
GET    /api/auth/me           — Return authenticated user profile
```

#### User Registration Payload

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "zip": "string",
  "interests": ["string"],
  "party": "Republican | Democrat | Independent"
}
```

#### Auth Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": 3600,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "state": "string",
    "district": "string"
  }
}
```

### 3.2 Mobile Changes

| File                                         | Change                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `services/implementations/ApiAuthService.ts` | Create; POST login/register, GET me, store JWT via SecureStore                     |
| `contexts/auth-context.tsx`                  | Create; replace hardcoded user; expose `user`, `login()`, `logout()`, `register()` |
| `app/(auth)/login.tsx`                       | Wire form submit → `authContext.login()`                                           |
| `app/(auth)/signup.tsx`                      | Wire final step → `authContext.register()` with all 6-step form data               |
| `services/container.ts`                      | Register `ApiAuthService`; inject into `ServiceProvider`                           |
| All `context.user` refs                      | Replace `mockData.currentUser` with `authContext.user`                             |

### 3.3 Definition of Done

- [ ] User can register via 6-step signup form (data POSTed to backend)
- [ ] User can log in; JWT stored securely
- [ ] `GET /api/auth/me` populates current user state (name, state, district)
- [ ] Token refresh works silently on 401
- [ ] Logout clears token and redirects to login
- [ ] Hardcoded `Pete Falcon` user removed from `mockData.ts`

---

## 4. Phase 2 — PoliSnaps Feed

**Priority**: 🔴 P1 — Highest visible impact; ~80% of infrastructure already built  
**Goal**: Replace `snapLibrary.ts` with live snaps from the ingestion pipeline. Switch container from `MockSnapRepository` to `ApiSnapRepository`.

### 4.1 Backend Changes

#### Enhance Existing Endpoint

```
GET  /api/snaps                    — Already exists; ADD query params:
     ?category=accountability|community|knowledge|notifications|trending
     &page=1&limit=20
     &repId=string
     &policyArea=string
     &chamber=Senate|House
     &sortBy=createdAt|relevance

GET  /api/snaps/registry           — Already used by ApiSnapRepository; keep
GET  /api/snaps/{id}               — Already exists
GET  /api/snaps/recent             — Already used; confirm category filter support
POST /api/snaps/batch              — Already used; confirm multi-ID support
```

#### Activate Ingestion Pipeline

- Enable `IngestionController.POST /api/ingestion/run` for scheduled/manual ingestion
- Ensure `CongressionalActivityProvider` and `EthicsCommitteeProvider` produce snaps with correct `channels` for category routing
- Populate `accountabilitySnaps`, `communitySnaps`, `knowledgeSnaps` categories via ingestion

### 4.2 Mobile Changes

| File                                            | Change                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `services/container.ts`                         | Swap `MockSnapRepository` → `ApiSnapRepository`                     |
| `services/implementations/ApiSnapRepository.ts` | Add `Authorization: Bearer {token}` header from auth context        |
| `constants/snapLibrary.ts`                      | Deprecate; retain only as dev fallback behind `MOCK_MODE` flag      |
| `contexts/service-provider.tsx`                 | Trigger `ApiSyncService.syncWithBackend()` on app foreground resume |

### 4.3 Definition of Done

- [ ] Accountability feed loads snaps from API (not `snapLibrary.ts`)
- [ ] Community feed loads community-category snaps from API
- [ ] Knowledge feed loads knowledge-category snaps from API
- [ ] Category filter (policy area, rep, sort) sends query params to API
- [ ] Pull-to-refresh calls API
- [ ] Offline fallback: SQLite cache serves last-synced snaps
- [ ] `snapLibrary.ts` no longer drives production UI

---

## 5. Phase 3 — Representatives

**Priority**: 🔴 P1 — Required for rep detail screens, feed filters, and "my reps" logic  
**Goal**: Replace 6 hardcoded reps with full congressional dataset via `CongressionalActivityProvider`.

### 5.1 Backend Changes

#### Enhance Existing Endpoints

```
GET  /api/representatives                      — Already exists; ADD:
     ?state=string&district=string&party=string&chamber=Senate|House

GET  /api/representatives/{id}                 — Already exists
GET  /api/representatives/me                   — NEW: return user's reps by district (from auth session zip/district)
POST /api/representatives/{id}/follow          — Already stubbed; ACTIVATE
DELETE /api/representatives/{id}/follow        — Already stubbed; ACTIVATE
```

#### Data Population

- Run `CongressionalActivityProvider` ingestion to seed all current House + Senate members
- Map `unitedstates.github.io` profile images to rep records
- Populate `stats` (productivityScore, attendanceRate, bipartisanIndex) from Congress.gov votes

### 5.2 Mobile Changes

| File                                                                   | Change                                                                                    |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `services/container.ts`                                                | Swap `MockRepresentativeRepository` → `ApiRepresentativeRepository`                       |
| `services/implementations/ApiRepresentativeRepository.ts`              | Add auth header; implement `getMyRepresentatives()` call                                  |
| `constants/mockData.ts`                                                | Remove hardcoded representative array                                                     |
| `app/(tabs)/representative.tsx`                                        | Load rep list from API; wire district-based "my reps" using `GET /api/representatives/me` |
| `components/ui/representative-and-policy-area-filter-bottom-sheet.tsx` | Load rep list dynamically from API (not hardcoded 6)                                      |

### 5.3 Definition of Done

- [ ] Representative tab shows full congressional dataset (not 6 hardcoded)
- [ ] "My Representatives" section auto-populates based on authenticated user's district
- [ ] Follow/unfollow persists to backend
- [ ] Rep detail screen (alignment report, voting record) loads from API
- [ ] Rep filter in feed bottom sheet shows full rep list
- [ ] Hardcoded reps removed from `mockData.ts`

---

## 6. Phase 4 — User Preferences & Personalization

**Priority**: 🟡 P2 — Completes the personalization layer  
**Goal**: Persist user preferences (interests, followed reps, watchlist, notification settings) server-side so they survive reinstalls and support multi-device sync.

### 6.1 Backend Changes

#### New Endpoints Required

```
GET    /api/users/me/preferences              — Interests, party, notification settings
PUT    /api/users/me/preferences              — Update preferences

GET    /api/users/me/followed-reps            — List of followed representative IDs
POST   /api/users/me/followed-reps/{repId}    — Follow a rep
DELETE /api/users/me/followed-reps/{repId}    — Unfollow a rep

GET    /api/users/me/watchlist                — Tracked bills/snaps
POST   /api/users/me/watchlist                — Add item to watchlist
DELETE /api/users/me/watchlist/{itemId}       — Remove item

GET    /api/users/me/agencies                 — Tracked agencies (federal/state/county)
PUT    /api/users/me/agencies                 — Update tracked agencies
```

#### Preferences Payload

```json
{
  "interests": ["Health", "Education", "Accountability"],
  "party": "Independent",
  "notifications": {
    "frequency": "daily",
    "channels": ["accountability", "watchlist"]
  },
  "intensityThreshold": 60
}
```

### 6.2 Mobile Changes

| File                                              | Change                                                      |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `services/implementations/ApiSettingsProvider.ts` | Create; implement `getPreferences()`, `updatePreferences()` |
| `services/container.ts`                           | Swap `MockSettingsProvider` → `ApiSettingsProvider`         |
| `app/settings-interests.tsx`                      | Load interests from API; save on change                     |
| `app/settings-reps.tsx`                           | Load/persist followed reps from API                         |
| `app/settings-agencies.tsx`                       | Load/persist tracked agencies from API                      |
| `app/notifications-settings.tsx`                  | Load/persist notification preferences from API              |
| `services/implementations/WatchlistService.ts`    | Add API sync layer; persist watchlist server-side           |
| `contexts/activity-context.tsx`                   | Pull `intensitySettings` from user preferences API          |

### 6.3 Supplementary: Sentiment / Poll Responses

```
POST /api/sentiment                           — Submit poll vote
     { snapId, elementId, optionId, userId }

GET  /api/sentiment/{snapId}                  — Get live poll results for a snap
```

Mobile: `AsyncSentimentRepository` already structured; wire to new endpoints.

### 6.4 Definition of Done

- [ ] Interests selection in signup and settings saved to backend
- [ ] Followed reps survive app reinstall (loaded from API on login)
- [ ] Watchlist syncs between sessions
- [ ] Notification preferences respected by backend (future push notification integration)
- [ ] Sentiment votes POST to API; live results displayed from API response
- [ ] `MockSettingsProvider` removed from production container

---

## 7. API Contract Summary

### Authentication

| Method | Endpoint             | Auth Required      |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | ❌                 |
| POST   | `/api/auth/login`    | ❌                 |
| POST   | `/api/auth/refresh`  | ❌ (refresh token) |
| POST   | `/api/auth/logout`   | ✅                 |
| GET    | `/api/auth/me`       | ✅                 |

### PoliSnaps

| Method | Endpoint                                               | Auth Required |
| ------ | ------------------------------------------------------ | ------------- |
| GET    | `/api/snaps?category=&page=&limit=&repId=&policyArea=` | ✅            |
| GET    | `/api/snaps/{id}`                                      | ✅            |
| GET    | `/api/snaps/recent`                                    | ✅            |
| POST   | `/api/snaps/batch`                                     | ✅            |
| POST   | `/api/ingestion/run`                                   | ✅ (admin)    |

### Representatives

| Method | Endpoint                           | Auth Required |
| ------ | ---------------------------------- | ------------- |
| GET    | `/api/representatives`             | ✅            |
| GET    | `/api/representatives/me`          | ✅            |
| GET    | `/api/representatives/{id}`        | ✅            |
| POST   | `/api/representatives/{id}/follow` | ✅            |
| DELETE | `/api/representatives/{id}/follow` | ✅            |

### User Preferences

| Method          | Endpoint                              | Auth Required |
| --------------- | ------------------------------------- | ------------- |
| GET/PUT         | `/api/users/me/preferences`           | ✅            |
| GET/POST/DELETE | `/api/users/me/followed-reps/{repId}` | ✅            |
| GET/POST/DELETE | `/api/users/me/watchlist/{itemId}`    | ✅            |
| GET/PUT         | `/api/users/me/agencies`              | ✅            |

### Sentiment

| Method | Endpoint                  | Auth Required |
| ------ | ------------------------- | ------------- |
| POST   | `/api/sentiment`          | ✅            |
| GET    | `/api/sentiment/{snapId}` | ✅            |

---

## 8. Execution Checklist

### Phase 1 — Auth

- [ ] Backend: Implement auth endpoints (register, login, refresh, logout, me)
- [ ] Backend: JWT middleware + user entity in DB
- [ ] Mobile: Create `ApiAuthService` + `auth-context`
- [ ] Mobile: Wire login/signup forms
- [ ] Mobile: Replace `mockData.currentUser` everywhere
- [ ] Test: Register → Login → me → Logout flow end-to-end

### Phase 2 — PoliSnaps

- [ ] Backend: Add category/pagination query params to `GET /api/snaps`
- [ ] Backend: Activate ingestion pipeline; verify snap `channels` map to categories
- [ ] Mobile: Swap container to `ApiSnapRepository`
- [ ] Mobile: Add auth header to all snap API calls
- [ ] Mobile: Verify offline SQLite fallback
- [ ] Test: Pull-to-refresh populates live snaps in all 4 feed tabs

### Phase 3 — Representatives

- [ ] Backend: Seed full congressional dataset via `CongressionalActivityProvider`
- [ ] Backend: `GET /api/representatives/me` (by district from auth session)
- [ ] Mobile: Swap container to `ApiRepresentativeRepository`
- [ ] Mobile: Remove hardcoded rep array from `mockData.ts`
- [ ] Test: Rep filter shows 535 members; "My Reps" shows user's correct district reps

### Phase 4 — Preferences

- [ ] Backend: Implement preferences, watchlist, followed-reps, agencies, sentiment endpoints
- [ ] Mobile: Create `ApiSettingsProvider`; swap container
- [ ] Mobile: Wire all settings screens to API
- [ ] Mobile: Wire sentiment POST/GET to API
- [ ] Test: Preferences survive logout → login cycle

---

## 9. Notes & Constraints

- **Dev Base URL**: `http://10.0.0.252:5000/api` — update to environment variable via `EXPO_PUBLIC_API_URL` in `.env`
- **Offline-first**: All API responses should sync to SQLite via `ApiSyncService`. The feed must work with cached data when offline.
- **Mock fallback**: Keep `MOCK_MODE=true` feature flag available in `feature-flags.ts` for local development without a running backend.
- **Token storage**: Use `expo-secure-store` for JWT tokens, not AsyncStorage.
- **Rep images**: Continue using `unitedstates.github.io/images/congress/...` — no backend image hosting needed.
- **Policy areas**: The 38-category list remains static in the mobile app. No `/api/policy-areas` endpoint is needed.
