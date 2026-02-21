# Snap Authoring Guide: The Anatomy of a Truth Molecule

**Standard Operating Procedures for PoliSnap Creation**

## 1. The Metadata Hierarchy

Every Snap must include the following metadata layers to be valid for the **Distribution Tier**:

- **Layman Summary**: A 2-sentence non-partisan translation of the institutional data.
- **Significance Score (0-100)**: Used by the **Signal Intensity™** engine to gate notifications.
- **Rational Sentiment ($RS$ Alignment)**: Every snap must define the **Forensic Weight** for ZK-Residency ($1.5x$) and Signal Participation multipliers.
- **Provenance Link**: The technical audit path to the official record (e.g., `congress.gov/bill/118-hr882`).

## 2. Choosing Visual Elements (VBA)

Refer to the [Element Catalog](../Product/2_ELEMENT_CATALOG.md) for available molecules.

- **High-Density Data**: Use `Metric` elements for financial or voting tallies.
- **Sentiment Pulse**: Always include the `Universal.Gauge` molecule to display the live **$RS$ Signal**.
- **Human Narrative**: Use `Narrative.Congress.Statement` for quotes or floor text.
- **Call to Action**: Every Snap must end with an `Interaction` element (e.g., Sentiment Slider).

## 3. Forensic Tone & Voice

- **Neutrality**: Avoid adjectives like "disastrous," "heroic," or "unprecedented." Use "Legislative Pivot," "Metric Shift," or "Voting Record."
- **Green Shield Standard**: Mention the **ZK-Verification Handshake** requirements where data sensitivity or verification status impacts the visibility of the Snap.
- **Clarity**: Write for a high-school reading level while maintaining technical precision.
- **Authority**: Use the **PoliProof™** serif fonts for all primary institutional data.

## 4. The Authoring Workflow

1. **Source Discovery**: Identify a high-impact event in the FEC or Congressional records.
2. **Molecule Mapping**: Align the raw data into the `polisnap.schema.json` structure.
3. **Rational Sentiment Calibration**: Apply the $RS = S \times (R_w + P_w)$ calculation to the sentiment baseline.
4. **Visual Audit**: Verify the vertical rhythm (15px grid) in the mobile viewer.
5. **Push to Nexus**: Commit the metadata to the Ingestion database for distribution.
