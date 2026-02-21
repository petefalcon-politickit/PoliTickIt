# PoliTickIt: Hybrid Ingestion Strategy (HIS)

## 1. The Strategy: "Velocity-Aware Ingestion"

Since Federal Oracles (Treasury, FEC, Congress) do not support webhooks, PolTickIt employs a **Multi-Modal Hybrid Ingestion (MMHI)** approach. We moving away from "Blind Polling" towards **Adaptive Pulse Monitoring**.

### Three-Tier Trigger System

| Tier       | Name                        | Mechanism                             | Frequency                | Goal                                           |
| :--------- | :-------------------------- | :------------------------------------ | :----------------------- | :--------------------------------------------- |
| **Tier 1** | **Heartbeat Monitor**       | ETag / `If-Modified-Since` / RSS Head | Every 30m                | Minimal bandwidth, detects "Fresh Truth."      |
| **Tier 2** | **Precision Pulse**         | Full API GET at known release windows | Daily (e.g., 4:10 PM ET) | Guaranteed refresh after official SLA window.  |
| **Tier 3** | **On-Demand Manifestation** | User-triggered "Pulse to Earn"        | Ad-hoc                   | Resolves specific information gaps for a user. |

---

## 2. Oracle-Specific Implementation Profiles

### **TREAS-01: U.S. Treasury**

- **SLA**: Daily updates at ~4:00 PM ET.
- **Monitoring**: We use `HttpClient` with `If-Modified-Since` headers.
- **Optimization**: Poll only the `last_updated` field in the API metadata before fetching the result set.

### **FEC-01: Federal Election Commission**

- **SLA**: Nightly materialized view refreshes.
- **Monitoring**: Daily "Precision Pulse" at 2:00 AM ET.
- **Optimization**: Monitor the `/efile/` endpoint for real-time candidate filing spikes.

### **CONG-01: Congress.gov**

- **SLA**: Daily updates for Legislation/Congressional Record.
- **Monitoring**: Nightly "Precision Pulse."
- **Optimization**: Filter by `updateDate` query parameter to only fetch deltas.

### **GRN-01: Grants.gov**

- **SLA**: Daily extracts.
- **Monitoring**: **RSS Feed Scraping** (Primary).
- **Optimization**: Polling the RSS XML is 100x cheaper than the full Search API. We trigger a "Manifestation" only when a new UID appears in the feed.

### **USA-01: USAspending**

- **SLA**: Nightly pipeline.
- **Monitoring**: Polling `/api/v2/awards/last_updated/`.
- **Optimization**: Never run ingestion unless the `last_updated` timestamp has advanced.

---

## 3. Scheduled Tasks (Infrastructure)

We utilize a **Background Job Orchestrator** (Hangfire or Azure Functions) to manage these schedules:

1. **`PulseHeartbeatJob`**: Runs every 30 minutes. Checks Tiers 1-5 for ETag changes.
2. **`PrecisionReleaseJob`**: Scheduled at specific UTC times mapped to agency SLAs (e.g., GMT 21:10 for Treasury).
3. **`ConsistencyAuditJob`**: Weekly deep-sync to ensure no drifts occurred during incremental pulses.

## 4. Error Handling & Backoff

- **Adaptive Backoff**: If an Oracle returns `429 Too Many Requests`, the ingestion engine automatically doubles the heartbeat interval for that provider.
- **Circuit Breaker**: If an Oracle is down for >3 cycles, the provider is marked "Degraded" in the Registry, and users are notified via the mobile app's `Context.Thread` molecule (e.g., "Truth Source Lagging").
