/**
 * PoliSnap Metadata-Driven UI Types
 * Based on REACT_NATIVE_MOCK_API_SPEC.md
 */

export interface TextMetadata {
  maxCharacters?: number;
  showMoreAction?: boolean;
  truncationType?: "Ellipsis" | "Fade" | "Clip";
  isClickable?: boolean;
  level?: "Default" | "Emphasized" | "Muted" | "Caption";
  textTransform?:
    | "uppercase"
    | "lowercase"
    | "capitalize"
    | "capitalize_all_words"
    | "none";
  lineClamp?: number;
  selectable?: boolean;
  monospace?: boolean;
}

export interface NavigationMetadata {
  route: string;
  parameters?: Record<string, any>;
  isClickable: boolean;
  actionType: "navigate" | "push" | "link" | "back" | "custom";
  customAction?: string;
  feedbackType?: "highlight" | "underline" | "button" | "none";
}

export interface PresentationMetadata {
  layout?: "horizontal" | "vertical";
  styling?: string;
  order?: number;
  visible?: boolean;
  size?: "small" | "medium" | "large" | "full";
  attributes?: {
    responsive_size?: "small" | "medium" | "large" | "full";
    emphasis?: "low" | "medium" | "high";
    border?: "none" | "light" | "heavy";
    spacing?: "compact" | "normal" | "spacious";
    background?: "none" | "subtle" | "solid" | "gradient";
    [key: string]: any;
  };
}

/**
 * ProvenanceMetadata
 * Defines the "Institutional Receipt" or audit trail for a snap or element.
 */
export interface ProvenanceMetadata {
  url: string;
  label?: string; // e.g., "View FEC Filing", "Congress.gov Record"
  type?: "official" | "news" | "archive" | "blockchain" | "custom";
  isVerified?: boolean;
  timestamp?: string; // ISO string of when the snapshot/data was verified
  provider?: string; // e.g., "FEC.gov", "Perma.cc", "Archive.org"
  auditTrailId?: string; // Internal unique ID for the proof chain
  [key: string]: any;
}

export interface Template {
  id: string;
  name: string;
  elementType: string;
  dataSchema: Record<string, string>;
  requiredFields: string[];
  componentMap: Record<string, string>;
  renderingGuidance: string;
  version?: string;
}

export interface ControlFeatures {
  template?: string;
  collectionMode?: "carousel" | "grid" | "list" | "stack" | "tabs";
  carousel?: "auto-scroll" | "manual";
  truncation?: "none" | "truncate" | "expand" | "expand-inline";
  customSettings?: {
    autoScrollInterval?: number;
    showPagingIndicators?: boolean;
    columns?: number;
    itemSpacing?: "compact" | "normal" | "spacious";
    truncationLimit?: number;
    pageSize?: number;
    hidden?: boolean;
    animation?: {
      type?: "fade" | "slide" | "scale" | "none";
      duration?: number;
      delay?: number;
    };
    [key: string]: any;
  };
}

export interface Element {
  id: string;
  type: string;
  displayName?: string;
  data?: any;
  template?: Template;
  textMetadata?: TextMetadata;
  navigation?: NavigationMetadata;
  presentation?: PresentationMetadata;
  controlFeatures?: ControlFeatures;
  provenance?: ProvenanceMetadata;
  children?: Element[];
  dataBinding?: {
    sourcePath?: string;
    dataType?: string;
    transformation?: string;
    isRequired?: boolean;
  };
  accessibility?: {
    label?: string;
    hint?: string;
    role?: "button" | "link" | "heading" | "region" | "image" | "text";
    alternativeText?: string;
  };
  analytics?: {
    eventName?: string;
    eventProperties?: Record<string, any>;
  };
}

export interface PoliSnap {
  id: string;
  sku: string;
  title: string;
  type: string;
  createdAt: string;
  /** Set to createdAt on first save; updated when content changes. Used by delta-sync. */
  updatedAt?: string;
  sources: {
    name: string;
    url?: string;
  }[];
  metadata?: {
    policyArea?: string;
    insightType?: string;
    representativeId?: string; // Aid in filtering without scanning elements
    applicationTier?:
      | "Standard"
      | "Intelligence"
      | "ROI Auditor"
      | "Institutional";
    headerElementId?: string;
    laymanSummary?: string;
    description?: string;
    districtId?: string;
    mechanismType?: string;
    termId?: string;
    provenance?: ProvenanceMetadata;
    keywords?: string[];
    schemaVersion?: string;
    accessLevel?: "public" | "authenticated" | "restricted";
    featureFlags?: Record<string, boolean>;
    author?: string;
    // ── Domain entity reference fields ──────────────────────────────
    /** Bill identifier in Congress.gov format: "H.R.1041", "S.J.Res.185" */
    billId?: string;
    /** Congressional chamber: "House" | "Senate" */
    chamber?: string;
    /** ISO-8601 date of the primary vote: "2026-05-21" */
    voteDate?: string;
    /** Plain-text vote outcome: "Passed", "Failed", "Agreed to (50-47)" */
    voteOutcome?: string;
    /** Congressional session number: "119" */
    congress?: string;
    /**
     * Plain-text body of the document (HTML stripped), up to ~3 000 chars.
     * Populated at ingest for ExecutiveOrder snaps.
     */
    bodyText?: string;
    /** URL to the authoritative HTML page for the full document body. */
    bodyHtmlUrl?: string;
    contentKey?: string;
    policyAreaId?: string;
  };
  elements: Element[];
  navigation?: {
    screenName?: string;
    screenParams?: Record<string, any>;
    availableActions?: ("back" | "home" | "refresh" | "share" | "save")[];
  };
  theme?: string;
  locale?: string;
  /** Geographic jurisdiction for this snap (e.g., "US", "US-TX-17"). */
  jurisdiction?: string;
  /** When true the snap has been officially retracted and should not be displayed. */
  isRetracted?: boolean;
  /** ISO-8601 timestamp when the snap was retracted. Populated only if isRetracted is true. */
  retractedAt?: string;

  // ── Process Correlation ───────────────────────────────────────────────────────
  /** Groups all snaps in the same political process. e.g. "bill:H.R.1041". */
  correlationKey?: string;
  /** ID of the root snap. Null if this snap is the root. */
  parentSnapId?: string;
  /** Ordinal process step. Meaning defined per snap type. */
  processStep?: number;
  /** Human-readable stage label verbatim from source. e.g. "In Committee". */
  processStage?: string;
}
