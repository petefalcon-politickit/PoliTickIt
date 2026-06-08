# Category 13 — Judicial Opinion Alert

**Snap Type:** `Judicial Opinion Alert`
**Feed Section:** `accountabilitySnaps`
**Schedule:** On-event — triggered by significant court rulings with direct policy impact on citizens
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Translates a significant court ruling into plain-English policy impact for citizens. Courts shape policy just as much as Congress — but legal opinions are written for lawyers, not constituents. This snap bridges the gap.

The citizen reads: What did the court decide? What does it mean for my daily life? Who does it affect, and how? This is civic literacy in snap form.

Currently the most minimal snap type (single `Narrative.Insight.Summary` element) — but designed for future expansion. Rulings that relate to specific bills, reps, or agencies can be connected to those elements as the snap type matures.

---

## Scope

**Covered rulings:**
- State Supreme Court decisions with broad policy impact (statewide effect)
- Federal Circuit Court decisions affecting multi-state policy
- U.S. Supreme Court decisions (major rulings only — not cert. denials)
- Administrative law decisions (agency rule struck down or upheld)

**Not covered by this snap type:**
- Trial court verdicts
- Ongoing litigation (not yet decided)
- Civil or criminal verdicts not involving government policy

---

## Element Stack (Current — Minimal)

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Narrative.Insight.Summary` | Plain-English ruling summary — what was decided, what it means for citizens | Required |
| 2 | `Trust.Thread` | Source: court record + legal reporting | Recommended |
| 3 | `Interaction.Sentiment.Pulse` | "Do you agree with this ruling?" | Optional |

Note: **No `Header.Representative`** — judicial opinions are institutional, not attributed to a rep.

**Planned future expansion:**
- `Metric.Dual.Comparison` — "Before this ruling" vs. "After this ruling" (legal standard shift)
- `Header.Bill` — when the ruling directly interprets or invalidates a specific bill
- `Interaction.Sentiment.Pulse` — more commonly added once court topics gain traction

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **PACER (Federal courts)** | Federal court opinions | `https://www.pacer.gov/` |
| **State court websites** | State supreme court opinions | State-specific (e.g., `courts.ca.gov`, `txcourts.gov`) |
| **SCOTUSblog** | SCOTUS case tracking, plain-English summaries | `https://www.scotusblog.com/` |
| **CourtListener / Free Law Project** | Searchable opinion database | `https://www.courtlistener.com/` |
| **Legal reporting** | AP, Reuters, Law360, Bloomberg Law | For context and plain-English translation |

---

## Snap ID Pattern

```
snap-judicial-{docketSlug}-{YYYYMMDD}
```

Where `{docketSlug}` is derived from the docket number:
- `2026-EN-44` → `2026-en-44`
- `24-884` (SCOTUS) → `scotus-24-884`

Examples:
- `snap-judicial-2026-en-44-20260601`
- `snap-judicial-scotus-24-884-20250701`

---

## `Narrative.Insight.Summary` Structure for Judicial Snaps

```typescript
{
  id: "ruling-summary",
  type: "Narrative.Insight.Summary",
  data: {
    title: "[Plain-English ruling title — what happened]",
    text: "[2–4 sentences: what the court decided, who it affects, and what changes]",
    insightType: "Judicial Alert",
    policyArea: "[Primary affected area — e.g., 'Environmental', 'Healthcare', 'Privacy']"
  }
}
```

**`title` examples (NOT legal docket titles):**
- `"State Supreme Court Shifts Environmental Liability to Polluters"`
- `"Federal Appeals Court Blocks New Agency Emissions Rule"`
- `"Supreme Court Expands Fourth Amendment Digital Privacy Protections"`

**`text` guidance:**
- Sentence 1: State what the court decided, in plain terms
- Sentence 2: Who is directly affected (industries, agencies, individuals)
- Sentence 3: What specifically changes as a result
- Sentence 4 (optional): Any immediate practical implications (e.g., "enforcement stays pending further review")

---

## `Trust.Thread` for Judicial Snaps

```typescript
{
  id: "trust-thread",
  type: "Trust.Thread",
  data: {
    sources: [
      {
        label: "[COURT NAME] — Docket #[DOCKET]",
        type: "Court Record",
        url: "[https://... — direct link to opinion PDF or case page]"
      },
      {
        label: "[NEWS SOURCE]",
        type: "Legal Reporting",
        url: "[https://...]"
      }
    ],
    verificationLevel: "Tier 3",
    auditDate: "YYYY-MM-DD"
  }
}
```

---

## Recurring Generation Procedure

### When to Generate

1. Monitor SCOTUSblog for SCOTUS decisions (check each Monday and Thursday during term)
2. Monitor CourtListener + state court RSS feeds for significant state supreme court decisions
3. Review federal register for major administrative law rulings (agency rules struck down)
4. Evaluate significance: **only generate when the ruling directly changes policy that affects citizens in PoliTickIt's target districts**

### Significance Filter

Generate only when the ruling meets at least one of these criteria:
- Directly affects the legal rights of a significant portion of citizens in a PoliTickIt district
- Overturns or significantly modifies an existing law or regulation
- Resolves a circuit split (creates uniform federal standard)
- Has immediate enforcement or operational effect (not academic)

### Stage 1 — Mine

- `mineMode: "freeform"` (primary source: court opinion; secondary: legal reporting)
- Read the syllabus or headnotes of the opinion (not the full opinion) for accuracy
- Record: docket number, court name, deciding judges (majority), date of opinion, policy area

### Stage 2 — Normalize

- `snapCategory: "Accountability"`
- **No `validatedRepresentativeId`** — institutional snap
- `policyArea`: use the primary affected legal/policy domain
- `sentimentEligible`: set to `true` for high-impact rulings; `false` for narrow technical decisions

### Stage 3 — Generate

- Ensure title is in plain English — not the court's formal case name
- `Narrative.Insight.Summary.text`: do not interpret beyond what the syllabus or headnotes state
- If a specific bill was at issue, note the bill ID in the summary text
- `Trust.Thread`: always link to the actual opinion (PACER, CourtListener, or court's own website)

### Stage 4 — Distribute

- Target array: `accountabilitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Court | Docket | Ruling Summary |
|---|---|---|---|
| `acc-judicial-001` | [State Supreme Court] | 2026-EN-44 | Groundwater contamination liability — burden of proof shifts to industrial operators in Tier 1 zones |

---

## Prompt Invocation

```
Generate a judicial opinion alert PoliSnap.

Court: [e.g., Texas Supreme Court / 9th Circuit / U.S. Supreme Court]
Docket: [e.g., 2026-EN-44 / 24-884]
Date decided: [YYYY-MM-DD]
Case name (formal): [PLAINTIFF v. DEFENDANT] (for internal reference only — not for display)

What was decided (plain English): [1-2 sentences]
Who it affects: [industries, agencies, or individuals affected]
What changes: [what the legal standard or enforcement rule is now]
Policy area: [Environmental / Healthcare / Privacy / etc.]

Opinion source: [URL to opinion PDF or court case page]
Secondary source: [legal news URL]

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-judicial-[docketSlug]-[YYYYMMDD]
No Header.Representative — institutional snap.
```

---

## Content Quality Rules

- **Plain English only** — no legalese in the `Narrative.Insight.Summary.text`; if a legal term is unavoidable, explain it in the same sentence ("burden of proof — who must prove their case in court")
- **Cite the actual opinion** — not news reporting alone; link to the primary source court document
- **Do not interpret beyond the syllabus** — accurately reflect what the court said, not what commentators project it to mean
- **No rep attribution** — courts are independent; never connect a ruling to a specific rep unless the ruling directly names legislation that rep sponsored
- **Docket slugs**: always derived from the actual docket number — never invented

---

## Known Limitations

- Currently uses only `Narrative.Insight.Summary` — lacks a dedicated judicial opinion element
- Future work: add `Metric.Dual.Comparison` for "Before ruling" vs. "After ruling" legal standards
- State court coverage is limited to states with PoliTickIt active districts
- PACER federal court access requires a paid account for full text retrieval; SCOTUSblog + CourtListener cover most SCOTUS and significant federal circuit cases for free
