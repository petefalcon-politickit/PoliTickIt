# Capability Specification: Corruption Index (Correlation Intelligence)

This document defines the interface, models, and business logic for the **Corruption Index**—a Pro-tier intelligence feature that maps campaign contributions to legislative actions.

---

## 🎯 Business Logic: The "Correlation Score"

The Corruption Index is derived from a **Correlation Score (0-100)** calculated by comparing FEC donation timestamps and amounts against floor vote records.

### Scoring Factors:

1.  **Temporal Proximity (30% Weight)**: Proximity of the donation to the vote date.
    - _0-7 days_: 100% factor (Max 30 points).
    - _8-30 days_: 50% factor (15 points).
2.  **Financial Magnitude (70% Weight)**: The size of the donation relative to the individual's average.
    - _Example_: A $5,000 donation (The max individual limit) is scored higher than a $50 donation.
3.  **Entity Mapping**: The logic must resolve whether a donor's industry (identifiable by PAC name or Corporate affiliation) has a "Vested Interest" in the specific Bill's policy area.

---

## 🏗️ Data Models (Application Tier)

### `CorrelationIntelligence`

The primary resource returned by the Intelligence Repository.

```typescript
interface CorrelationIntelligence {
  id: string;
  representativeId: string;
  billId: string;
  score: number; // 0-100 (The Corruption Index)
  confidence: number; // 0-1 (Quality of the available data)
  donor: {
    name: string;
    industry: string;
    amount: number;
    date: string;
  };
  vote: {
    action: "YEA" | "NAY" | "PRESENT";
    date: string;
    result: "Passed" | "Failed";
  };
  insight: string; // The AI-generated "Connect-the-dots" narrative
}
```

---

## 📡 Repository Pattern: `ICorrelationRepository`

The UI interacts exclusively with this interface to retrieve intelligence data.

### Methods:

- `getCorruptionIndex(repId: string): Promise<CorrelationIntelligence[]>`
- `getBillCorrelations(billId: string): Promise<CorrelationIntelligence[]>`
- `getTopInfluencers(policyArea: string): Promise<CorrelationIntelligence[]>`

---

## 🧪 UI Sample Data Requirement

To deliver the **Corruption Index Card** (Activity #2), the following mock data set is required:

- **Rep**: Greg Casar (TX-35)
- **Bill**: H.R. 882 (Infrastructure)
- **Donor**: "Global Energy PAC"
- **Timing**: Donation 4 days before floor vote.
- **Score**: 88 (High Significance).

---

## 🔗 Implementation Trace

- Interface: `services/interfaces/ICorrelationRepository.ts`
- Mock: `services/implementations/MockCorrelationRepository.ts`
- Logic: `services/implementations/FECVoteNormalizer.ts`
