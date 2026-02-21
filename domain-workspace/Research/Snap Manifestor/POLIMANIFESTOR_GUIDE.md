# PoliManifestor™: The Truth Manifestation Engine

**Mantra: "Idea to Institutional Truth in a Single Sprint."**

The **PoliManifestor™** is the high-velocity orchestration layer of the Politickit platform. It encapsulates the complex **HVDF (High-Velocity, Design-First)** methodology into a turn-key execution engine, allowing the "Visionary" to manifest production-ready features from simple business scenarios.

---

## 🚀 1. How to Use the PoliManifestor™

To trigger a manifestation, use the following command prefix (or its alias **POLIFEST**) in your prompt:

> **MANIFEST [Scenario Name] [Classifiers]: [Business Case / User Story]**

### 🕒 Setting the Session Scope

To set default classifiers, scope, or bridging rules for the duration of your session, use:

> **SESSION [Classifiers]** or **POLISESSION [Classifiers]**

Example: `POLISESSION region:national tier:2 bridge:manual`

- All subsequent `POLIFEST` calls will inherit `region:national`.
- Any `POLIFEST` call will stay in "Design-First" (Mock) mode until you explicitly call `BRIDGE`.

### � Bridging the Stack (Rounding Off)

To transition a manifested design into a full-stack, data-driven implementation that connects the UI to the App tier and Institutional Oracles, use:

> **BRIDGE [Snap Class/Scenario Name]**

This rounds off the architecture by generating the remaining backend ingestion logic, API endpoints, and mobile data-sync rules.

### �🎨 Exploring Genres (Discovery)

To see "Best-in-Class" potential for a specific category of truth before you manifest, use:

> **POLIGENRE [Genre Name]**

This delivers blueprints, molecule recommendations, and data-staging strategies specific to that category (e.g., _Fiscal_, _Ethics_, _Sentiment_).

### Classifiers & Scope

You can declare the scope of the snap using `key:value` pairs before the colon:

- `region:state:co` (Colorado) or `region:national:us`
- `policy:energy`
- `tier:intelligence`

### Multi-Track Manifestation

If the core business case allows for different "Truth Perspectives" (e.g., a fiscal-primary vs. a social-primary approach), the Manifestor will present these as **Tracks**. You must choose a track before code is generated.

### Example Workflow:

1.  **Input**: `POLIFEST Veteran Pivot region:state:tx policy:veterans : I want to show a snap for Texas reps who voted against the recent health bill.`
2.  **Orchestration**: The PoliManifestor™ identifies required molecules, checks legit developer APIs (avoiding scraping), and verifies compliance.
3.  **Approval Gate**: You are presented with **Track A (The Money Trace)** and **Track B (The Voting Pattern)**.
4.  **Selection**: You choose "Track A".
5.  **Execution**: Code is fully updated across the .NET and Mobile stacks.

---

## 🔄 2. The Manifestation Lifecycle

The PoliManifestor™ automates the four stages of the **Truth Continuum**:

### Stage 1: The Blueprint (Design-First)

- **Generalization by Default**: Treat every request as a **Snap Class**. Even if a specific representative is mentioned, design a template applicable to any rep, policy, or government level (stored in `libs/contracts/snap-classes/`).
- Selection of **PoliSnap Molecules** from the Element Catalog.
- Mapping of the **Trust Thread™** to official institutional oracles.
- Assignment of the **Participation Tier** (Standard to Institutional).
- **Visionary Presentation**: Before execution, the Manifestor presents the use case in business-centric value terms.
- **Backlog-Ready Preview**: An analysis summary is provided so the feature can be deprioritized/backlogged immediately if needed.

### Stage 2: The Ingestion Bridge (Backend)

- **Universal Ingestion**: Manifestation of a metadata-driven configuration for the `UniversalIngestionEngine` rather than redundant boilerplate code.
- **Data Staging & Batching**: If batch data is available, the Manifestor provides a technical write-up on how to stage this data as "Always Available Content."
- Establishment of **Multi-Oracle Normalization** rules.

### Stage 3: The Sovereign Ledger (Mobile)

- Updating the local SQLite schema for interaction logging.
- **Universal Rendering**: Mapping content to existing molecules in the catalog. The creation of specialized UI components is avoided in favor of metadata-driven updates to the `PoliSnapRenderer`.
- Injecting molecules into the rendering pipeline.

### Stage 4: The Maverick Audit

- Applying the **Maverick Shield** to the generated summary for bias and factual integrity.

---

## 🛡️ 3. Checkpoints & Verification

To finalize a sprint and synchronize the platform state, use the trigger word:

> **POLI-CHECK**

To maintain the global **Doc Hub** and ensure documentation integrity, use the trigger:

> **POLI-DOC**

Every manifestation concludes with:

1.  **Code Commit**: Full E2E implementation.
2.  **Documentation Sync**: Update of relevant `README`, `BACKLOG`, and `REGISTRY` files.
3.  **Priority Roadmap**: A recommendation for the 2-3 strongest next steps for the project.

---

_Trademark Notice: PoliManifestor™ and The Truth Manifestation Engine are protected within the Politickit Institutional Framework._
