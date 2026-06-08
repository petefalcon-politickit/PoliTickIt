/**
 * canonical-model.ts
 *
 * Hand-maintained mirror of PoliTickIt.Domain/CanonicalModel/ElementAttributes.cs
 *
 * RULES:
 *  - Every interface here MUST have a matching C# record in ElementAttributes.cs.
 *  - Required C# fields (annotated [Required]) become non-optional TypeScript properties.
 *  - Optional C# fields (nullable with ?) become optional TypeScript properties (?).
 *  - Mobile renderer handlers MUST import from this file — never define element
 *    attribute shapes inline.
 *  - When adding a new element type: update ElementAttributes.cs first, then mirror
 *    the change here. See Recipe 2 in documentation/Plans/POLISNAP_OPERATIONALIZATION_PLAN.md.
 *
 * DECISION: D1 — DCM is single authoritative type system for all element attributes
 */

// ── Enums ────────────────────────────────────────────────────────────────────

/** Display mode for a gauge element. Server: GaugeMode enum. */
export type GaugeMode = "Linear" | "Progress" | "Circular";

/**
 * Trust verification tier indicating the quality level of the source.
 * Tier1 = primary official source; Tier3 = inferred/derived.
 * Server: VerificationTier enum.
 */
export type VerificationTier = "Tier1" | "Tier2" | "Tier3";

/** Canonical source identifier used in trust thread elements. Server: TrustSource enum. */
export type TrustSource =
  | "FederalRegister"
  | "CongressGov"
  | "Fec"
  | "OpenStates"
  | "Derived";

// ── Element Attribute Interfaces ─────────────────────────────────────────────

/**
 * Text block element — primary content card (title, subtitle, body).
 * Maps to element type "Universal.TextBlock".
 * Server: TextBlockAttributes in ElementAttributes.cs
 */
export interface TextBlockAttributes {
  title: string; // required
  subtitle?: string;
  subtext?: string;
  /** Plain-text body, truncated to ~3 000 chars at ingest time. */
  bodyText?: string;
  /** Deep-link to the authoritative HTML rendering of the full document. */
  bodyHtmlUrl?: string;
}

/**
 * Gauge element — progress or intensity indicator.
 * Maps to element type "Universal.Gauge".
 * Server: GaugeAttributes in ElementAttributes.cs
 */
export interface GaugeAttributes {
  value: number; // required, 0–100
  label: string; // required
  mode: GaugeMode; // required
  subtext?: string;
  /** Optional CSS-compatible colour override (e.g. "#FF5733"). */
  color?: string;
}

/**
 * Trust thread element — institutional provenance / verification signal.
 * Maps to element type "Trust.Thread".
 * Server: TrustThreadAttributes in ElementAttributes.cs
 */
export interface TrustThreadAttributes {
  verificationLevel: VerificationTier; // required
  source: TrustSource; // required
  sourceUrl?: string;
  /** ISO 8601 timestamp. */
  lastVerified?: string;
}

/**
 * Representative identity element — links a snap to a specific legislator/official.
 * Maps to element type "Identity.Representative".
 * Server: RepresentativeIdentityAttributes in ElementAttributes.cs
 */
export interface RepresentativeIdentityAttributes {
  /** Stable representative identifier, e.g. "S-TX-001" or bioguideId. */
  representativeId: string; // required
  displayName: string; // required
  role?: string;
  avatarUrl?: string;
  /** Party abbreviation: "D", "R", "I", etc. */
  party?: string;
}

/**
 * Context thread element — AI-generated contextual enrichment summary.
 * Maps to element type "Context.Thread".
 * Server: ContextThreadAttributes in ElementAttributes.cs
 */
export interface ContextThreadAttributes {
  summary: string; // required
  enrichedAt: string; // required, ISO 8601
  /** Model identifier used to generate the summary, e.g. "gpt-4o". */
  model?: string;
}
