# Category 9 — Legislative Sentiment Pulse

**Snap Type:** `Legislative Sentiment Pulse`
**Feed Section:** `accountabilitySnaps`
**Schedule:** On-event (bill introduction, hearings, major policy announcements) or weekly active-bills sweep
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Connects a specific policy position or legislative issue to a citizen interaction — letting users vote on, slide a spectrum, advocate via action card, or view projected sentiment trends. This is the primary **citizen engagement** snap type; it pairs a rep's association with a bill against the public's actual sentiment.

Unlike accountability snaps that present forensic data, sentiment pulse snaps invite active participation. The goal is to give citizens a voice on the specific policy their rep is advancing or opposing.

Four interaction variants exist — each matches a different policy question type.

---

## Variants

| Variant | Interaction Element | Best For |
|---|---|---|
| **A — Multi-option Pulse** | `Interaction.Sentiment.Pulse` | Binary or 3–4 option discrete choice questions |
| **B — Spectrum Slider** | `Interaction.Sentiment.Slider` | Policy positions on a left-right or risk-reward spectrum |
| **C — Action Card** | `Interaction.Action.Card` | When the most useful citizen response is an action (contact rep, sign petition, attend hearing) |
| **D — Trend Chart** | `Visual.Chart.SentimentTrend` | When projecting how sentiment is expected to evolve over a timeline |

---

## Element Stack — Variant A (Pulse)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor — who is advancing this position | Required |
| 2 | `Narrative.Insight.Summary` | Plain-English description of the policy issue | Required |
| 3 | `Interaction.Sentiment.Pulse` | 2–4 option discrete citizen vote | Required |

### Element Stack — Variant B (Slider)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Narrative.Insight.Summary` | Policy context | Required |
| 3 | `Interaction.Sentiment.Slider` | Spectrum slider — left endpoint label ↔ right endpoint label | Required |

### Element Stack — Variant C (Action Card)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Narrative.Insight.Summary` | Policy issue + call to action justification | Required |
| 3 | `Interaction.Action.Card` | CTA button — links to external action (contact rep, petition, etc.) | Required |

### Element Stack — Variant D (Trend Chart)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Header.Representative` | Rep identity anchor | Required |
| 2 | `Narrative.Insight.Summary` | Policy context + what the trend shows | Required |
| 3 | `Visual.Chart.SentimentTrend` | Projected support/oppose trend over time | Required |
| 4 | `Visual.Chart.Bar` | Optional — supplemental data (e.g., energy mix breakdown) | Optional |
| 5 | `Interaction.Sentiment.Pulse` | Optional — follow-up discrete vote | Optional |

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **Congress.gov** | Bill text, status, sponsor, committee assignments | `https://api.congress.gov/v3/bill/{congress}/{type}/{number}` |
| **Agency policy docs** | Detailed policy context for specific issue areas | See per-policy table below |
| **PoliTickIt Analytics** | Existing sentiment baseline for trend projections | Internal aggregator |

**Policy-specific sources by issue area:**

| Area | Source |
|---|---|
| Energy | DOE.gov, EIA.gov |
| Veterans | VA.gov, VFW.org |
| Small Business | SBA.gov |
| Cybersecurity | CISA.gov, NIST.gov |
| Healthcare | HHS.gov, CMS.gov |
| Housing | HUD.gov |

---

## Snap ID Patterns

```
snap-pulse-{repLastName}-{policySlug}      // Variant A
snap-slider-{repLastName}-{policySlug}     // Variant B
snap-action-{repLastName}-{policySlug}     // Variant C
snap-trend-{repLastName}-{policySlug}      // Variant D
```

Examples:
- `snap-pulse-schumer-energy-roadmap-2026`
- `snap-slider-schumer-quantum-cybersec`
- `snap-action-thune-veteran-health-act`
- `snap-trend-casar-main-street-grant`

---

## Interaction Element Structures

### `Interaction.Sentiment.Pulse`

```typescript
{
  id: "sentiment-pulse",
  type: "Interaction.Sentiment.Pulse",
  data: {
    question: "[Policy-focused question text?]",
    options: [
      { id: "opt1", label: "[Option 1]" },
      { id: "opt2", label: "[Option 2]" },
      { id: "opt3", label: "[Option 3]" }     // optional 3rd/4th options
    ]
  }
}
```

### `Interaction.Sentiment.Slider`

```typescript
{
  id: "sentiment-slider",
  type: "Interaction.Sentiment.Slider",
  data: {
    question: "[Spectrum question text?]",
    leftLabel: "[Left endpoint description]",
    rightLabel: "[Right endpoint description]"
  }
}
```

### `Interaction.Action.Card`

```typescript
{
  id: "action-card",
  type: "Interaction.Action.Card",
  data: {
    actionLabel: "[Button text — imperative verb]",
    actionUrl: "[https://...]",
    description: "[1–2 sentence justification for the action]"
  }
}
```

### `Visual.Chart.SentimentTrend`

```typescript
{
  id: "sentiment-trend",
  type: "Visual.Chart.SentimentTrend",
  data: {
    title: "[Chart title]",
    xAxis: "[time label — e.g., Q1–Q4]",
    series: [
      { label: "Support", color: "#4CAF50", data: [42, 48, 55, 62] },
      { label: "Oppose",  color: "#FF5722", data: [38, 32, 28, 25] }
    ],
    projectionNote: "Projections based on PoliTickIt historical trend data"
  }
}
```

---

## Recurring Generation Procedure

### When to Generate

- A rep introduces or co-sponsors a bill on a significant policy area
- A committee hearing is scheduled on an active bill
- A major policy announcement from a relevant agency (DOE, VA, SBA, etc.)
- Weekly sweep: any bill with >50 cosponsors that lacks a citizen sentiment snap

### Stage 1 — Mine

- `mineMode: "freeform"` (policy context from Congress.gov + agency sources)
- Determine the right variant based on the question type (see variant selection guide above)
- Record: bill ID, policy area, rep's position, key policy details

**Variant selection guide:**
- Clear binary or small-N discrete choice → Variant A (Pulse)
- Policy sits on a spectrum (privacy vs security, growth vs sustainability) → Variant B (Slider)
- Citizens can take a real action (contact office, attend hearing, sign petition) → Variant C (Action Card)
- Policy has measurable time-based projections → Variant D (Trend Chart)

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- `validatedRepresentativeId`: the rep associated with the policy position
- `sentimentEligible: true` — always (sentiment snaps ARE the pulse)
- `contentSignal: "active"` if bill is in consideration; `"historical"` if passed or stalled

### Stage 3 — Generate

- `Narrative.Insight.Summary.text`: Focus on the policy issue, not the rep's personal politics; explain what the bill would actually do
- Sentiment question: Policy-focused ("Do you support X?") not character-focused ("Is Rep. Y doing a good job?")
- For Variant D: Clearly label projections as projections — not actual polling data
- `Trust.Thread` is optional but recommended for Variant A when linking to bill text

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Rep | Policy Issue | Variant |
|---|---|---|---|
| `acc-pulse-cyber-security` | Sen. Chuck Schumer | Quantum cybersecurity framework | B — Slider ("Privacy Concerns" ↔ "Strengthen Security") |
| `acc-pulse-veterans-bill` | Sen. John Thune | Veteran Health Access Act | C — Action Card ("Advocate for Rural Vets") |
| `acc-pulse-small-biz-incentive` | Rep. Greg Casar | Main Street Revitalization Grant | D — Trend Chart (Q1–Q4 support/oppose projections) |
| `acc-pulse-energy-roadmap` | Sen. Chuck Schumer | National Energy Roadmap 2026 | D + A — Bar Chart (energy mix) + 4-option Pulse |
| `acc-pulse-arctic-res` | Sen. John Thune | Arctic Wilderness Protection | A — Pulse (via `acc-pulse-arctic-res`) |

---

## Prompt Invocation

```
Generate a legislative sentiment pulse PoliSnap.

Representative: [REP_NAME] ([BIOGUIDE_ID]) — [PARTY], [STATE/DISTRICT]
Bill: [BILL_ID] — [BILL_TITLE]
Policy issue summary: [2–3 sentences explaining what the bill does]
Policy area: [e.g., Energy, Veterans, Cybersecurity, Housing, Healthcare]
Bill status: [current stage from Congress.gov]

Interaction type: [Pulse / Slider / Action Card / Trend Chart]
  For Pulse:       options: ["[Option 1]", "[Option 2]", "[Optional 3rd]"]
  For Slider:      leftLabel: "[Left]", rightLabel: "[Right]"
  For Action Card: actionLabel: "[Button text]", actionUrl: "[URL]"
  For Trend Chart: provide quarterly support/oppose projection data (or note "project from baseline")

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-[variantSlug]-[repLastName]-[policySlug]
```

---

## Content Quality Rules

- **Question neutrality**: sentiment questions must be policy-neutral — avoid framing that predisposes a response ("Do you support common-sense gun safety?" biases the question)
- **Trend projections** (Variant D): label them explicitly as projections; never present projected figures as actual polling results
- **Action Card URLs**: must be real, working URLs — government contact pages, official petition sites, or hearing registration pages
- **Policy explanation**: must accurately describe what the bill would do, based on its actual text — not news framing
- **Slider endpoints**: both endpoints must be legitimate policy positions — not "good vs bad"
