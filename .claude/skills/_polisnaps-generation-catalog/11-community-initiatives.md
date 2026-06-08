# Category 11 — Community Organization Initiative

**Snap Type:** `Community Initiative`
**Feed Section:** `accountabilitySnaps` (temporary — target `communitySnaps` once that array is created)
**Schedule:** On-event — triggered by community organization announcements, event postings, or seasonal campaigns
**Prompt File:** _(not yet created)_ — see Prompt Invocation stub below

---

## Purpose

Mobilizes citizens around local community initiatives — non-profit events, volunteer drives, food drives, neighborhood programs, and civic campaigns. This is the only snap type that is **not accountability-focused** — it is community-focused.

Unlike all other snap categories, this type does NOT feature a representative or bill. Instead, it features a verified **community organization** as the identity anchor. The action CTA is the core value — make it easy for citizens to volunteer, donate, or attend.

**Note on feed routing**: Currently distributed to `accountabilitySnaps` because `communitySnaps` does not yet exist in `snapLibrary.ts`. When the `communitySnaps` array is created, all existing community snaps must be migrated.

---

## Element Stack

| Order | Element Type | Purpose | Required? |
|---|---|---|---|
| 1 | `Identity.Organization.Header` | Organization identity anchor — name, logo URL, location, verification status, tags | Required |
| 2 | `Narrative.Insight.Summary` | Plain-English description of the initiative — what the org is doing and why | Required |
| 3 | `Narrative.Event.Details` | Structured event info — date, time, location, requirements | Conditional (for event-based initiatives) |
| 4 | `Interaction.Action.Card` | CTA button — volunteer sign-up, donation link, registration | Required |

---

## Data Sources

| Source | What It Provides | URL Pattern |
|---|---|---|
| **Organization website** | Event details, mission statement, sign-up link | Org-specific |
| **Local news** | Event coverage, announcements | Local newspaper or community news site |
| **Event listing sites** | Volunteermatch.org, Idealist.org, Eventbrite | Search by org name |
| **org social media** | Announcements, photos, sign-up links | Org's Twitter/Facebook/Instagram |

**Verification**: Check that the organization has a `.org` domain, IRS 501(c)(3) registration (can verify via `irs.gov/pub/irs-tege/eo_xx.csv` for nonprofit status), and that the event is publicly posted.

---

## Snap ID Pattern

```
snap-community-{orgSlug}-{eventSlug}-{YYYYMMDD}
```

Examples:
- `snap-community-ctfoodbank-mobile-pantry-20231014`
- `snap-community-austin-habitat-build-20261115`

---

## `Identity.Organization.Header` Structure

```typescript
{
  id: "org-header",
  type: "Identity.Organization.Header",
  data: {
    orgName: "[Full organization name]",
    logoUrl: "[https://... — org's official logo URL]",
    location: "[City, State]",
    isVerified: true,              // true only when IRS 501(c)(3) confirmed
    tags: ["Food Security", "Community Services"]   // 1–3 descriptive tags
  }
}
```

**Tag vocabulary** (use consistent labels):
- `"Food Security"`, `"Housing"`, `"Education"`, `"Veterans Services"`, `"Youth Programs"`, `"Environmental"`, `"Disaster Relief"`, `"Healthcare Access"`, `"Community Services"`

---

## `Narrative.Event.Details` Structure

```typescript
{
  id: "event-details",
  type: "Narrative.Event.Details",
  data: {
    date: "YYYY-MM-DD",
    time: "[HH:MM AM/PM – HH:MM AM/PM TZ]",
    location: {
      name: "[Venue name]",
      address: "[Street address, City, State ZIP]"
    },
    requirements: "[Any prerequisites — e.g., 'Background check required', 'Must be 18+', 'No experience needed']"
  }
}
```

---

## `Interaction.Action.Card` Structure

```typescript
{
  id: "action-cta",
  type: "Interaction.Action.Card",
  data: {
    actionLabel: "[Imperative verb — e.g., 'Volunteer Now', 'Sign Up', 'Donate', 'Register']",
    actionUrl: "[https://... — direct link to sign-up or donation page]",
    description: "[1–2 sentences explaining what citizen does next]"
  }
}
```

---

## Recurring Generation Procedure

### When to Generate

- An org sends a new event announcement or press release
- A seasonal campaign begins (holiday food drives, back-to-school supplies, disaster relief)
- A partner org is launching a new program (new mobile clinic, new job training cohort, etc.)
- A recurring annual event approaches (annual gala, seasonal pantry expansion, etc.)

### Stage 1 — Mine

- `mineMode: "freeform"` (pull from org website + local news + event listings)
- Collect: org name, mission (1–2 sentences), specific event details (date/time/location)
- Find the direct action URL (volunteer sign-up, donation page, or event registration)
- Verify nonprofit status (IRS.gov or GuideStar/Candid)

### Stage 2 — Normalize

- `snapCategory: "Community"` _(note: type field is "Community" even though currently routed to accountabilitySnaps)_
- **No `validatedRepresentativeId`** — org-centric snap
- `sentimentEligible: false` — community snaps do not have sentiment polls (action CTA replaces sentiment)
- `contentSignal: "active"` — all community snaps are active (they are time-sensitive events)
- `policyArea`: tag with relevant policy area for channel routing (`"Food Security"`, `"Housing"`, etc.)

### Stage 3 — Generate

- `Identity.Organization.Header.isVerified`: only set to `true` when IRS 501(c)(3) confirmed
- `Narrative.Insight.Summary.text`: start with the impact ("Each year, the Central Texas Food Bank provides meals to...") then describe the specific initiative
- `Narrative.Event.Details.requirements`: always include — even if there are no requirements, say `"No experience necessary — all welcome"`
- `Interaction.Action.Card.actionUrl`: test the link before generating the snap; link must be a real active URL
- No `Trust.Thread` required for community snaps (org website IS the source)

### Stage 4 — Distribute

- Current target array: `accountabilitySnaps`
- When `communitySnaps` array is created: migrate to `communitySnaps`
- Prepend to array

---

## Existing Production Examples

| Snap ID | Organization | Initiative | Date |
|---|---|---|---|
| `community-org-001` | Central Texas Food Bank (Austin, TX) | Mobile pantry seasonal expansion — volunteer recruitment drive | Oct 14, 2023 |

---

## Prompt Invocation

```
Generate a community initiative PoliSnap.

Organization: [ORG_NAME]
  Location: [City, State]
  Type: [e.g., Food Bank, Habitat for Humanity, Voter Registration, Disaster Relief]
  IRS 501(c)(3) verified: [yes/no] (check: https://apps.irs.gov/app/eos/ )
  Website: [ORG_URL]
  Tags: [Tag1, Tag2]

Initiative description:
  What: [1–2 sentences describing what they're doing and why it matters]
  Context: [seasonal, annual, emergency response, new program, etc.]

Event details (if applicable):
  Date: [YYYY-MM-DD]
  Time: [HH:MM AM/PM – HH:MM AM/PM TZ]
  Location: [Venue, Address, City State ZIP]
  Requirements: [prerequisites, or "none"]

Action CTA:
  Button label: [e.g., "Volunteer Now"]
  URL: [direct sign-up or donation link]
  Description: [what citizen does after tapping — 1 sentence]

Use: polisnap-miner, polisnap-normalizer, polisnap-generator, polisnap-distributor skills.
Target array: accountabilitySnaps in snapLibrary.ts
Snap ID: snap-community-[orgSlug]-[eventSlug]-[YYYYMMDD]
snapCategory: "Community"
No Header.Representative — organization snap.
```

---

## Content Quality Rules

- **Action URL**: Must be real, active, and direct (not a homepage — link to the specific sign-up page)
- **`isVerified`**: Only set to `true` when IRS EIN lookup or Candid (GuideStar) confirms 501(c)(3) status
- **Org name**: Use the exact official legal name (check their IRS registration or `.org` site)
- **Event requirements**: always provide — "No experience needed, all welcome" is a valid and valuable requirement entry
- **No sentiment pulse** on community snaps — the Action Card IS the engagement mechanism
- **Tone**: warm and civic; community snaps should feel inviting, not urgent or alarming
