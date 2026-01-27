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
    keywords?: string[];
    schemaVersion?: string;
    accessLevel?: "public" | "authenticated" | "restricted";
    featureFlags?: Record<string, boolean>;
  };
  elements: Element[];
  navigation?: {
    screenName?: string;
    screenParams?: Record<string, any>;
    availableActions?: ("back" | "home" | "refresh" | "share" | "save")[];
  };
  theme?: string;
  locale?: string;
}
