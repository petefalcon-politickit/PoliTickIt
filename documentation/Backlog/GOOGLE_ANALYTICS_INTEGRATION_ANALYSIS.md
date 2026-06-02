# **Analysis: Google Analytics Integration — iOS & Android**

- **Subject**: Wiring Google Analytics (via Firebase) to PoliTickIt's React Native / Expo app on iOS and Android
- **Status**: ANALYSIS — Ready for Implementation
- **Date**: 2026-06-01
- **References**: `apps/mobile/package.json`, `app.json`, `hooks/use-telemetry.ts`, `services/implementations/ApiTelemetryService.ts`, `forensicSignalCoordinator`

---

## 1. Overview

PoliTickIt already has an internal telemetry system (`useTelemetry` → `forensicSignalCoordinator` → `ApiTelemetryService`) wired to the participation credit economy. This is **domain telemetry** — it drives credit awards, signal weighting, and rep dashboard data.

**Google Analytics (GA4 via Firebase)** sits alongside this as **product analytics** — it answers different questions:

| Internal Telemetry                 | Google Analytics                                         |
| ---------------------------------- | -------------------------------------------------------- |
| "How many users pulsed on snap X?" | "Which tab retains users longest?"                       |
| "Did user earn 25 credits?"        | "Where do users drop off in the ZK verification funnel?" |
| "What is the district's RS score?" | "What is the 30-day retention by acquisition channel?"   |
| Feeds rep dashboards               | Feeds product roadmap decisions                          |

Both systems run in parallel. GA4 gets product/UX data. Internal telemetry gets civic signal data.

---

## 2. SDK Stack (Recommended)

### Why Firebase / GA4 and not a standalone SDK?

Google Analytics for mobile apps is accessed through **Firebase Analytics** — there is no standalone GA4 mobile SDK. Firebase is the correct path for both iOS and Android.

### Recommended Packages

```bash
# Core Firebase + Analytics
npm install @react-native-firebase/app @react-native-firebase/analytics

# ATT (App Tracking Transparency) — REQUIRED for iOS App Store compliance
npx expo install expo-tracking-transparency
```

> **Important**: `@react-native-firebase` requires Expo bare workflow or custom dev client. Since `app.json` uses `newArchEnabled: true` and the project uses EAS, this is achievable via `expo-dev-client`. The managed workflow does **not** support Firebase natively.

### Alternative: `expo-firebase-analytics` (deprecated)

This package was deprecated by Expo. Do not use it. Use `@react-native-firebase/analytics` directly.

---

## 3. Setup Requirements

### 3.1 Firebase Project

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) — **"PoliTickIt"**
2. Register two apps:
   - **iOS**: Bundle ID `com.politickit` (matches `app.json`)
   - **Android**: Package `com.politickit` (matches `app.json`)
3. Download config files:
   - iOS: `GoogleService-Info.plist` → place in `apps/mobile/ios/`
   - Android: `google-services.json` → place in `apps/mobile/android/app/`

### 3.2 `app.json` Changes

```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app",
      [
        "expo-tracking-transparency",
        {
          "userTrackingPermission": "This identifier will be used to measure how you interact with the app and improve your experience."
        }
      ]
    ],
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "infoPlist": {
        "NSUserTrackingUsageDescription": "This identifier will be used to measure how you interact with the app and improve your experience."
      }
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 3.3 iOS — App Tracking Transparency (ATT)

Apple requires an ATT permission prompt before collecting any IDFA-linked data. This must be shown **before** Firebase Analytics initializes tracking.

```typescript
// apps/mobile/app/_layout.tsx (or analytics service init)
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

const { status } = await requestTrackingPermissionsAsync();
// Firebase Analytics automatically respects ATT — if denied, it uses aggregate/anonymous data only
```

### 3.4 Android — No Extra Permission Required

On Android, GA4 via Firebase uses the Advertising ID. No explicit permission is required for Android 12 and below. For Android 13+ (`targetSdkVersion >= 33`), add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="com.google.android.gms.permission.AD_ID"/>
```

### 3.5 Build Requirements

Firebase requires a **custom dev client** (not Expo Go):

```bash
# Build a custom dev client with Firebase included
eas build --profile development --platform ios
eas build --profile development --platform android
```

---

## 4. Analytics Service Wrapper

Create a dedicated service so GA4 calls are never scattered inline. This keeps the existing `useTelemetry` hook for internal credit tracking and adds a separate `useAnalytics` hook for GA4.

**Path**: `apps/mobile/services/implementations/GoogleAnalyticsService.ts`

```typescript
import analytics from "@react-native-firebase/analytics";

export class GoogleAnalyticsService {
  async logScreenView(screenName: string, screenClass?: string) {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  }

  async logEvent(eventName: string, params?: Record<string, any>) {
    await analytics().logEvent(eventName, params);
  }

  async setUserId(userId: string | null) {
    await analytics().setUserId(userId);
  }

  async setUserProperty(name: string, value: string | null) {
    await analytics().setUserProperty(name, value);
  }
}
```

**Path**: `apps/mobile/hooks/use-analytics.ts`

```typescript
import { useServices } from "@/contexts/service-provider";
import { useCallback } from "react";

export const useAnalytics = () => {
  const { analyticsService } = useServices();

  const logScreen = useCallback(
    (screenName: string) => {
      analyticsService?.logScreenView(screenName);
    },
    [analyticsService],
  );

  const logEvent = useCallback(
    (eventName: string, params?: Record<string, any>) => {
      analyticsService?.logEvent(eventName, params);
    },
    [analyticsService],
  );

  return { logScreen, logEvent };
};
```

Register `GoogleAnalyticsService` in the Awilix container (`service-provider.tsx`) alongside existing services.

---

## 5. Screen Tracking Plan

Every tab and screen should fire `logScreenView` on mount via `useEffect` or `useFocusEffect`.

| Screen                            | `screen_name`              | Priority |
| --------------------------------- | -------------------------- | -------- |
| `(tabs)/accountability.tsx`       | `Accountability_Feed`      | P1       |
| `(tabs)/knowledge.tsx`            | `Knowledge_Feed`           | P1       |
| `(tabs)/community.tsx`            | `Community_Feed`           | P1       |
| `(tabs)/watchlist.tsx`            | `Watchlist`                | P1       |
| `(tabs)/participation.tsx`        | `Participation_Capital`    | P1       |
| `(tabs)/representative.tsx`       | `Representative_Feed`      | P1       |
| `(tabs)/notifications.tsx`        | `Notifications`            | P2       |
| `(tabs)/settings.tsx`             | `Settings`                 | P2       |
| `profile.tsx`                     | `User_Profile`             | P1       |
| `representative.tsx`              | `Representative_Detail`    | P1       |
| `snap-viewer.tsx`                 | `Snap_Viewer`              | P1       |
| `settings-voter-verification.tsx` | `Voter_Verification`       | P1       |
| `settings-reps.tsx`               | `Settings_Representatives` | P2       |
| `settings-agencies.tsx`           | `Settings_Policy_Areas`    | P2       |
| `settings-interests.tsx`          | `Settings_Interests`       | P2       |
| `notifications-settings.tsx`      | `Notification_Settings`    | P2       |
| `(auth)/login.tsx`                | `Auth_Login`               | P1       |
| `(auth)/register.tsx`             | `Auth_Register`            | P1       |

---

## 6. Event Tracking Plan

### 6.1 Authentication Events

| Event Name                 | Trigger          | Key Parameters    |
| -------------------------- | ---------------- | ----------------- |
| `login` _(GA4 built-in)_   | Successful login | `method: "email"` |
| `sign_up` _(GA4 built-in)_ | Account creation | `method: "email"` |
| `auth_logout`              | User logs out    | —                 |

---

### 6.2 Feed & Content Events

| Event Name                   | Trigger                                                          | Key Parameters                                       |
| ---------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- | ---- |
| `snap_viewed`                | PoliSnap enters viewport / expanded                              | `snap_id`, `snap_type`, `policy_area`                |
| `snap_opened`                | User taps to open snap detail                                    | `snap_id`, `snap_type`                               |
| `snap_shared`                | Share action on a snap                                           | `snap_id`, `snap_type`, `platform` (e.g., `twitter`) |
| `feed_tab_switched`          | User switches feed type (Accountability / Knowledge / Community) | `from_tab`, `to_tab`                                 |
| `snap_viewer_scrolled_depth` | User scrolls past 50% / 100% of snap content                     | `snap_id`, `depth_percent: 50                        | 100` |
| `source_link_tapped`         | User taps a source URL within a snap                             | `snap_id`, `source_name`                             |

---

### 6.3 Civic Engagement Events

| Event Name                | Trigger                                               | Key Parameters                                            |
| ------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| `pulse_cast`              | User casts a Pulse sentiment vote                     | `snap_id`, `sentiment: "agree"│"disagree"`, `policy_area` |
| `consensus_ripple_signed` | User signs a Consensus Ripple                         | `snap_id`, `district`, `credits_earned: 250`              |
| `voter_audit_triggered`   | User triggers a Voter Audit (Tier 3 required)         | `snap_id`, `rep_id`                                       |
| `action_card_submitted`   | User submits a Direct Action (town hall, contact rep) | `snap_id`, `action_type`                                  |
| `watchlist_add`           | User adds snap to Watchlist                           | `snap_id`, `snap_type`                                    |
| `watchlist_remove`        | User removes snap from Watchlist                      | `snap_id`                                                 |

---

### 6.4 Participation Capital Events

| Event Name                    | Trigger                          | Key Parameters                                            |
| ----------------------------- | -------------------------------- | --------------------------------------------------------- |
| `credits_earned`              | Any credit award                 | `credits_amount`, `source_action`, `new_total`            |
| `tier_unlocked`               | User crosses a tier threshold    | `tier_level: 1│2│3│4`, `tier_name`, `credits_total`       |
| `diamond_dialog_opened`       | User opens Diamond Dialog        | `trigger_source` (e.g., `"watchlist_gate"`, `"nav_icon"`) |
| `participation_screen_viewed` | Participation Capital tab opened | `current_tier`, `current_credits`                         |

---

### 6.5 Voter Verification Funnel Events

This is a critical funnel — track each step to measure drop-off.

| Event Name                     | Trigger                                | Key Parameters              |
| ------------------------------ | -------------------------------------- | --------------------------- |
| `verification_started`         | User taps "INITIALIZE ZK-HANDSHAKE"    | `current_tier`              |
| `verification_tier1_completed` | Device Attestation passes              | `platform: "ios"│"android"` |
| `verification_tier1_failed`    | Device Attestation fails               | `error_code`                |
| `verification_tier2_completed` | Geo-fence verification passes          | `district_resolved`         |
| `verification_tier2_failed`    | Geo-fence fails (outside district)     | `reason`                    |
| `verification_tier3_completed` | ZK-Residency proof passes              | —                           |
| `verification_tier3_failed`    | ZK-Residency fails (not in voter roll) | `reason`                    |
| `verification_abandoned`       | User exits verification mid-flow       | `abandoned_at_tier`         |

---

### 6.6 Representative & District Events

| Event Name               | Trigger                             | Key Parameters                                    |
| ------------------------ | ----------------------------------- | ------------------------------------------------- |
| `rep_profile_viewed`     | User opens a representative profile | `rep_id`, `rep_name`, `chamber: "senate"│"house"` |
| `rep_followed`           | User follows a representative       | `rep_id`, `rep_state`, `rep_district`             |
| `rep_unfollowed`         | User unfollows a representative     | `rep_id`                                          |
| `policy_area_followed`   | User follows a policy area          | `policy_area_id`, `policy_area_name`              |
| `policy_area_unfollowed` | User unfollows a policy area        | `policy_area_id`                                  |

---

### 6.7 Feature Gate Events

Understanding where users hit gates is critical for conversion decisions.

| Event Name               | Trigger                                              | Key Parameters                                              |
| ------------------------ | ---------------------------------------------------- | ----------------------------------------------------------- |
| `feature_gate_hit`       | User reaches a gated feature without sufficient tier | `feature_name`, `required_tier`, `user_tier`, `screen_name` |
| `feature_gate_converted` | User unlocks a feature after hitting a gate          | `feature_name`, `required_tier`                             |

---

### 6.8 Notifications Events

| Event Name                        | Trigger                                 | Key Parameters                 |
| --------------------------------- | --------------------------------------- | ------------------------------ |
| `notification_permission_granted` | User approves push notifications        | —                              |
| `notification_permission_denied`  | User denies push notifications          | —                              |
| `notification_tapped`             | User opens app from a push notification | `notification_type`, `snap_id` |

---

## 7. User Properties

Set once on login/session start to segment all events by civic profile.

| Property Name         | Value                        | Purpose                                            |
| --------------------- | ---------------------------- | -------------------------------------------------- |
| `user_state`          | e.g., `"TX"`                 | Segment engagement by state                        |
| `user_district`       | e.g., `"TX-21"`              | District-level product insight                     |
| `verification_tier`   | `"0"` through `"3"`          | Measure engagement by verification depth           |
| `participation_tier`  | `"1"` through `"4"`          | Measure engagement by capital tier                 |
| `rep_count`           | Number of reps followed      | Content personalization signal                     |
| `policy_area_count`   | Number of interests followed | Content depth signal                               |
| `onboarding_complete` | `"true"` / `"false"`         | Exclude incomplete onboards from retention metrics |

---

## 8. Key Funnels to Build in GA4

Once events are flowing, configure these funnels in the GA4 **Explore** tab:

### Funnel 1: Onboarding to First Civic Action

```
sign_up → rep_followed → policy_area_followed → pulse_cast
```

**Goal**: Measure what % of new users complete the full onboarding and reach their first meaningful action.

### Funnel 2: Verification Completion

```
verification_started → tier1_completed → tier2_completed → tier3_completed
```

**Goal**: Identify the specific tier where users drop off the ZK-Residency funnel.

### Funnel 3: Feature Gate to Tier Upgrade

```
feature_gate_hit → diamond_dialog_opened → [civic action] → tier_unlocked
```

**Goal**: Measure conversion rate from gate-hit to actual tier upgrade.

### Funnel 4: Feed Engagement Depth

```
snap_viewed → snap_opened → pulse_cast │ watchlist_add │ snap_shared
```

**Goal**: Identify which snap types and policy areas drive the highest engagement depth.

---

## 9. Privacy Considerations

| Concern                 | Mitigation                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ATT prompt on iOS       | Required before Firebase Analytics activates. Use `expo-tracking-transparency`.                                                                                                      |
| User identity in events | **Never** send PII in event params (no name, email, DOB). User identity via Firebase `userId` only.                                                                                  |
| Civic data sensitivity  | Policy area follows and rep follows are **low sensitivity** — they are public stances. Do not send pulse values tied to specific issues in GA4 (that belongs to internal telemetry). |
| CCPA / data deletion    | Firebase supports user data deletion via the [Firebase User Data Export API](https://firebase.google.com/docs/projects/user-data) — document in privacy policy.                      |
| Children's data         | Ensure `analytics().setAnalyticsCollectionEnabled(false)` is called if a user reports age under 13 (COPPA).                                                                          |

---

## 10. Tasks

### Foundation

- [ ] Create Firebase project "PoliTickIt" and register iOS + Android apps
- [ ] Download `GoogleService-Info.plist` and `google-services.json`; add to repo (gitignored for public; stored in EAS Secrets or CI vault)
- [ ] Install `@react-native-firebase/app` and `@react-native-firebase/analytics`
- [ ] Install `expo-tracking-transparency`
- [ ] Update `app.json` with Firebase plugins and ATT permission string
- [ ] Add ATT prompt call to `_layout.tsx` on app startup (iOS only)
- [ ] Rebuild custom dev client via EAS

### Service Layer

- [ ] Create `GoogleAnalyticsService.ts` (wrapper over `@react-native-firebase/analytics`)
- [ ] Create `use-analytics.ts` hook
- [ ] Register `analyticsService` in Awilix container in `service-provider.tsx`
- [ ] Add `analyticsService` interface `IAnalyticsService.ts` in `services/interfaces/`

### Screen Tracking (P1)

- [ ] Wire `logScreenView` into all P1 screens via `useFocusEffect`

### Event Tracking (P1)

- [ ] `login` / `sign_up` — fire from auth context on success
- [ ] `pulse_cast` — fire from `SentimentPulse` molecule
- [ ] `consensus_ripple_signed` — fire from `ConsensusRippleMolecule`
- [ ] `snap_opened` — fire from `PoliSnapRenderer` tap handler
- [ ] `watchlist_add` / `watchlist_remove` — fire from `ActionCardMolecule`
- [ ] `verification_*` funnel events — fire from `settings-voter-verification.tsx`
- [ ] `feature_gate_hit` — fire from `FeatureGate` component
- [ ] `credits_earned` / `tier_unlocked` — fire from `UserLedgerService` credit award path

### User Properties

- [ ] Set `user_state`, `user_district`, `verification_tier`, `participation_tier` after login and on tier changes

### GA4 Configuration

- [ ] Configure GA4 funnels (Onboarding, Verification, Gate Conversion, Feed Depth) in GA4 Explore
- [ ] Set up GA4 audiences: Verified Users (tier3), High Capital (tier4), New Users (< 7 days)
- [ ] Link Firebase to Google Analytics 4 property
