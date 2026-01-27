# Strategy: Unviewed Activity & Navigation Badges

This document outlines the architectural approach for maintaining real-time and persistent notification badges on the PoliTickIt navigation bar.

---

## 🏛️ 1. The Core Objectives

1.  **Settings Badge**: Dynamically display the total number of "Followed" entities (Representatives, Interest Areas, and Agencies).
2.  **Activity Feed Badges**: Display the count of new PoliSnaps added to specific feeds since the user's last interaction with that specific feed.
3.  **Cross-Session Persistence**: Ensure badge counts survive app restarts and reflect the user's actual behavior.

---

## 🛠️ 2. Architectural Components

### A. Persistence Layer (Local Intelligence)

We will utilize `AsyncStorage` to store a `CategoricalPulse` map. This map tracks the timestamp of the last time the user "ActiveViewed" a tab.

```json
{
  "last_viewed_stamps": {
    "accountability": "2026-01-25T10:00:00Z",
    "community": "2026-01-24T18:00:00Z",
    "knowledge": "2026-01-25T09:00:00Z",
    "notifications": "2026-01-25T11:00:00Z"
  }
}
```

### B. State Management (`ActivityProvider` Enhancement)

The `ActivityContext` will be refactored from a mock-data fetcher to a comparative engine.

1.  **On App Startup**:
    - Fetch the `last_viewed_stamps` from storage.
    - Query the `PoliSnapRepository` for counts where `createdAt > LastViewedTimestamp`.
    - Set the `tabBarBadge` global state.
2.  **On Navigation**:
    - When a user selects a tab (e.g., "Knowledge"), trigger `onTabActive`.
    - Update the local timestamp for that category.
    - Clear the badge for that tab.

---

## 📊 3. Element-Specific Logic

### The Settings "Follow" Badge

Unlike the feeds, the Settings badge is **Additive**.

- **Logic**: `Count(FollowedReps) + Count(FollowedInterests) + Count(SubscribedAgencies)`.
- **Reasoning**: It serves as a visual indicator of the user's "Accountability Reach."
- **UX Note**: We should evaluate if this should be a "permanent" badge or only show when a _new_ follow is added and hasn't been reviewed in the settings sub-menu.

### The Feed "New Items" Badge

- **Logic**: Count of Snaps where `Snap.createdAt > User.lastViewed[Category]`.
- **Trigger**: New snaps are detected during the background "Normalizer Processor" sync or on manual refresh.

---

## ⚖️ 4. Practicality & UX Assessment

### The "Sisyphus" Risk (Cons)

- **Visual Noise**: If a user follows dozens of interests, the badges might become "Permanent Red Dots" that never clear, leading to "Notification Fatigue."
- **Performance**: Performing a timestamp comparison across the entire local snap cache on every app mount could introduce a slight 50-100ms latency on the JS thread.
- **Client/Server Drift**: If the user uses the web app, their "Last Viewed" status won't sync unless we move the `LastViewedTimestamp` to the Application Tier (Backend).

### The "Freshness Signal" (Pros)

- **Retention**: Badges are the strongest driver for re-opening a specific feed.
- **Pro-Tier Value**: We can offer "Intensity Gating" for badges—only showing badges for "High Impact" or "Priority" snaps to reduce noise for paid users.

---

## 🚀 5. Implementation Roadmap

1.  **Phase 1 (Storage)**: Implement `CategoricalPulseService` to manage the timestamp map in `AsyncStorage`.
2.  **Phase 2 (Telemetry Hook)**: Add `useLastViewed` hook to the Tab Navigation to auto-update timestamps on `Focus`.
3.  **Phase 3 (Aggregation)**: Update `ActivityProvider` to perform the `Repository` count comparison.
4.  **Phase 4 (UI)**: Wire up the `tabBarBadge` property in `app/(tabs)/_layout.tsx`.

---

## 🔗 Related Resources

- [PRO_FEATURES_MONETIZATION.md](PRO_FEATURES_MONETIZATION.md) - Context on "High-Signal Alerting."
- [ARCHITECTURE.md](ARCHITECTURE.md) - Details on the Distributor Processor data flow.
