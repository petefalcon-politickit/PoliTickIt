# React Native Mock API Specification
## PoliSnap Metadata-Driven UI Development

**Document Version**: 1.0  
**Last Updated**: 2026  
**Target Framework**: React Native / Expo  
**Target Platform**: iOS, Android  

---

## Overview

This specification provides AI systems with complete context to generate realistic **mock API responses** that follow the PoliSnap metadata architecture. Mock data should be semantically accurate, hierarchically sound, and immediately renderable without additional data resolution.

### Key Principles for Mock Generation

1. **Self-Contained Elements** - Every element includes both data and metadata
2. **Template-Driven** - Elements reference templates that define rendering behavior
3. **Type Safety** - All properties follow strict TypeScript interfaces
4. **Semantic Over Visual** - Metadata describes intent, not CSS/styling
5. **Hierarchy Support** - Elements can nest children for complex layouts
6. **Navigation Metadata** - All interactive elements include navigation/action intent

---

## Core Data Structures

### 1. PoliSnap Root Object

```typescript
interface PoliSnap {
  /**
   * Unique identifier for this PoliSnap instance
   * Format: UUID v4
   * Example: "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;

  /**
   * Human-readable title of the screen/feature
   * Example: "Representative Profile", "Bill Details"
   */
  title: string;

  /**
   * Machine-readable type identifier
   * Examples: "representative_profile", "bill_details", "voting_record"
   */
  type: string;

  /**
   * RFC 3339 ISO 8601 timestamp
   * Indicates when this metadata was generated
   * Example: "2026-01-15T10:30:45.123Z"
   */
  createdAt: string;

  /**
   * Structured metadata about the PoliSnap itself
   */
  metadata?: {
    /**
     * Long-form description of screen content
     * Example: "Profile information for U.S. Representative John Smith"
     */
    description?: string;

    /**
     * Keywords for indexing/search
     * Example: ["representative", "senate", "colorado"]
     */
    keywords?: string[];

    /**
     * Version of the metadata schema
     * Example: "1.0.0"
     */
    schemaVersion?: string;

    /**
     * Access control indicators
     */
    accessLevel?: "public" | "authenticated" | "restricted";

    /**
     * Feature flags relevant to this PoliSnap
     */
    featureFlags?: Record<string, boolean>;
  };

  /**
   * Array of UI elements to render in order
   */
  elements: Element[];

  /**
   * Navigation context for the current screen
   */
  navigation?: {
    /**
     * Screen name in navigation stack
     */
    screenName?: string;

    /**
     * Parameters passed to this screen
     */
    screenParams?: Record<string, any>;

    /**
     * Available navigation actions
     */
    availableActions?: ("back" | "home" | "refresh" | "share" | "save")[];
  };

  /**
   * Theme identifier for this PoliSnap
   * Example: "light", "dark", "highContrast"
   */
  theme?: string;

  /**
   * Locale/language code (RFC 5646)
   * Example: "en-US", "es-MX", "fr-CA"
   */
  locale?: string;
}
```

---

### 2. Element Structure

```typescript
interface Element {
  /**
   * Unique identifier within the PoliSnap
   * Format: UUID v4 or unique string
   * Example: "elem-header-001", "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;

  /**
   * Element type/component category
   * Examples: "header", "text", "card", "section", "button", "list", "grid"
   */
  type: string;

  /**
   * Human-readable display name
   * Used for debugging, accessibility labels, and empty states
   * Example: "Representative Name", "District Information"
   */
  displayName: string;

  /**
   * The actual data to render
   * Type is flexible: can be string, number, object, array, boolean
   * Example data:
   * - String: "John Smith"
   * - Number: 5000000
   * - Object: { name: "John", party: "Democratic" }
   * - Array: ["Colorado", "Wyoming"]
   */
  data?: string | number | boolean | object | any[];

  /**
   * Template definition that describes how to render this element
   * Provides schema, component mapping, and rendering guidance
   */
  template?: Template;

  /**
   * Metadata for text behavior (for text-based elements)
   */
  textMetadata?: TextMetadata;

  /**
   * Navigation configuration (for clickable elements)
   */
  navigation?: NavigationMetadata;

  /**
   * Presentation hints (layout, styling, visibility)
   */
  presentation?: PresentationMetadata;

  /**
   * Control features for complex behaviors (carousel, grid, etc.)
   */
  controlFeatures?: ControlFeatures;

  /**
   * Child elements (for hierarchical layouts like sections, cards)
   */
  children?: Element[];

  /**
   * Data binding metadata (for reference)
   * Describes source path and transformation if applicable
   */
  dataBinding?: {
    /**
     * Path in the original data source
     * Example: "representative.profile", "metrics.votes"
     */
    sourcePath?: string;

    /**
     * Data type declaration
     * Examples: "Text", "Number", "DateTime", "Boolean", "Object", "Array"
     */
    dataType?: string;

    /**
     * Transformation applied (if any)
     * Examples: "uppercase", "currency_usd", "date_short", "truncate"
     */
    transformation?: string;

    /**
     * Whether this binding is required
     */
    isRequired?: boolean;
  };

  /**
   * Accessibility properties
   */
  accessibility?: {
    /**
     * Screen reader label
     */
    label?: string;

    /**
     * Describes interactive element purpose
     */
    hint?: string;

    /**
     * ARIA role (for web context)
     */
    role?: "button" | "link" | "heading" | "region" | "image" | "text";

    /**
     * Alternative text for images
     */
    alternativeText?: string;
  };

  /**
   * Analytics metadata
   */
  analytics?: {
    /**
     * Event name to track when element is interacted with
     */
    eventName?: string;

    /**
     * Properties to include in analytics event
     */
    eventProperties?: Record<string, any>;
  };
}
```

---

### 3. Template Structure

```typescript
interface Template {
  /**
   * Unique template identifier
   * Format: TemplateCategory.TemplateName
   * Examples: "Header.Representative", "Card.Bill", "List.Votes"
   */
  id: string;

  /**
   * Human-readable template name
   * Example: "Representative Header", "Bill Summary Card"
   */
  name: string;

  /**
   * Element type this template applies to
   * Example: "header", "card", "list"
   */
  elementType: string;

  /**
   * Data schema describing expected data properties
   * Key: property name
   * Value: data type string
   * Example:
   * {
   *   "name": "Text",
   *   "profilePic": "Object",
   *   "party": "Text",
   *   "votes": "Array"
   * }
   */
  dataSchema: Record<string, string>;

  /**
   * Array of required field names (keys in dataSchema)
   * Must have corresponding data for template to render
   * Example: ["name", "profilePic"]
   */
  requiredFields: string[];

  /**
   * Component mapping: data field ? UI component type
   * Key: property name from dataSchema
   * Value: component type string
   * Example:
   * {
   *   "name": "text-primary",
   *   "profilePic": "image",
   *   "party": "badge",
   *   "votes": "chips"
   * }
   *
   * Common component types:
   * - text-primary, text-secondary, text-muted, text-emphasized
   * - image
   * - badge, chips
   * - list, grid
   * - chart, graph
   * - button, link
   */
  componentMap: Record<string, string>;

  /**
   * Semantic rendering guidance (NOT CSS-based)
   * Examples: "horizontal-card", "vertical-list", "grid-2col", "banner"
   * Guides layout intent without specifying actual CSS
   */
  renderingGuidance: string;

  /**
   * Optional version for template evolution
   * Example: "1.0.0", "2.1.0"
   */
  version?: string;

  /**
   * Optional metadata about the template itself
   */
  metadata?: {
    /**
     * Framework that designed this template
     */
    designedFor?: string;

    /**
     * Minimum and maximum complexity
     */
    complexityLevel?: "simple" | "moderate" | "complex";

    /**
     * Supported platforms
     */
    supportedPlatforms?: ("ios" | "android" | "web")[];
  };
}
```

---

### 4. TextMetadata Structure

```typescript
interface TextMetadata {
  /**
   * Maximum character count before truncation
   * Example: 300
   */
  maxCharacters?: number;

  /**
   * Whether to show "Show More" action when truncated
   * Example: true
   */
  showMoreAction?: boolean;

  /**
   * Type of truncation to apply
   * - "Ellipsis": "Hello world..."
   * - "Fade": "Hello world" (with fade effect)
   * - "Clip": "Hello worl" (hard cutoff)
   */
  truncationType?: "Ellipsis" | "Fade" | "Clip";

  /**
   * Whether the text is clickable/interactive
   * Example: false (most text is not clickable)
   */
  isClickable?: boolean;

  /**
   * Semantic text level (NOT a CSS font-size)
   * Describes intent, framework applies actual styling
   * - "Default": Standard body text
   * - "Emphasized": Important, stands out more
   * - "Muted": Secondary, less important
   * - "Caption": Small supplementary text
   */
  level?: "Default" | "Emphasized" | "Muted" | "Caption";

  /**
   * Text transformation (if any)
   * - "uppercase": "JOHN SMITH"
   * - "lowercase": "john smith"
   * - "capitalize": "John Smith"
   * - "capitalize_all_words": "John Smith"
   * - "none": no transformation
   */
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "capitalize_all_words" | "none";

  /**
   * Line clamp (max lines before truncation)
   * Example: 3 (show max 3 lines)
   */
  lineClamp?: number;

  /**
   * Whether to allow text selection
   * Example: true (default)
   */
  selectable?: boolean;

  /**
   * Monospace font flag
   * Example: false (use default font)
   */
  monospace?: boolean;
}
```

---

### 5. NavigationMetadata Structure

```typescript
interface NavigationMetadata {
  /**
   * Route/screen name or URL to navigate to
   * Examples:
   * - "/representative/details"
   * - "RepresentativeDetails"
   * - "https://example.com/bill/123"
   */
  route: string;

  /**
   * Navigation parameters to pass to the route
   * Example: { id: "rep-123", name: "John Smith" }
   */
  parameters?: Record<string, any>;

  /**
   * Whether this element is interactive/clickable
   * Example: true
   */
  isClickable: boolean;

  /**
   * Type of navigation action to perform
   * - "navigate": Use React Navigation navigate()
   * - "push": Use React Navigation push()
   * - "link": Open external URL with Linking.openURL()
   * - "back": Navigate back in stack
   * - "custom": Custom action (app-defined)
   */
  actionType: "navigate" | "push" | "link" | "back" | "custom";

  /**
   * Optional: for custom actions, what handler to call
   * Example: "openShareDialog", "showComments"
   */
  customAction?: string;

  /**
   * Optional: how to visually indicate this is clickable
   * Example: "highlight", "underline", "button"
   */
  feedbackType?: "highlight" | "underline" | "button" | "none";
}
```

---

### 6. PresentationMetadata Structure

```typescript
interface PresentationMetadata {
  /**
   * Layout direction for children
   * - "horizontal": Row layout (left to right)
   * - "vertical": Column layout (top to bottom)
   * Example: "vertical"
   */
  layout?: "horizontal" | "vertical";

  /**
   * Semantic styling intent (NOT CSS class names)
   * Examples: "primary", "secondary", "card", "banner", "subtle", "alert"
   * Framework applies actual colors/styling based on theme
   */
  styling?: string;

  /**
   * Ordering/priority in parent collection
   * Lower numbers render first
   * Example: 1
   */
  order?: number;

  /**
   * Whether element is visible
   * Example: true
   */
  visible?: boolean;

  /**
   * Semantic sizing information
   * - "small": Compact size
   * - "medium": Standard size
   * - "large": Expanded size
   * - "full": Full width/height
   */
  size?: "small" | "medium" | "large" | "full";

  /**
   * Additional semantic attributes (not CSS)
   * Key-value pairs describing semantic properties
   */
  attributes?: {
    /**
     * Responsive sizing hint
     * - "small": 33% width
     * - "medium": 66% width
     * - "large": 100% width
     */
    responsive_size?: "small" | "medium" | "large" | "full";

    /**
     * Visual emphasis level
     * - "low": Subtle
     * - "medium": Standard
     * - "high": Prominent
     */
    emphasis?: "low" | "medium" | "high";

    /**
     * Border treatment
     * - "none": No border
     * - "light": Subtle border
     * - "heavy": Prominent border
     */
    border?: "none" | "light" | "heavy";

    /**
     * Spacing/padding hint
     * - "compact": Minimal spacing
     * - "normal": Standard spacing
     * - "spacious": Extra spacing
     */
    spacing?: "compact" | "normal" | "spacious";

    /**
     * Background style (semantic)
     * - "none": Transparent
     * - "subtle": Light background
     * - "solid": Solid background color
     * - "gradient": Gradient background
     */
    background?: "none" | "subtle" | "solid" | "gradient";

    /**
     * Additional custom attributes
     */
    [key: string]: any;
  };
}
```

---

### 7. ControlFeatures Structure

```typescript
interface ControlFeatures {
  /**
   * Template variant to use for children
   * Example: "featured", "compact", "detailed"
   */
  template?: string;

  /**
   * How to layout child elements
   * - "carousel": Horizontal scrolling carousel
   * - "grid": Multi-column grid
   * - "list": Vertical list
   * - "stack": Stacked/accordion layout
   * - "tabs": Tabbed interface
   */
  collectionMode?: "carousel" | "grid" | "list" | "stack" | "tabs";

  /**
   * Carousel-specific configuration
   * - "auto-scroll": Automatically scroll through items
   * - "manual": User scrolls manually
   */
  carousel?: "auto-scroll" | "manual";

  /**
   * Truncation/expansion behavior
   * - "none": Show all content
   * - "truncate": Truncate by default, show more available
   * - "expand": Show all by default
   * - "expand-inline": Inline expansion
   */
  truncation?: "none" | "truncate" | "expand" | "expand-inline";

  /**
   * Custom settings for collection behavior
   * Used for carousel, grid, truncation, etc.
   */
  customSettings?: {
    /**
     * For carousels: interval in milliseconds for auto-scroll
     * Example: 5000
     */
    autoScrollInterval?: number;

    /**
     * For carousels: show page dots/indicators
     * Example: true
     */
    showPagingIndicators?: boolean;

    /**
     * For grids: number of columns
     * Example: 2
     */
    columns?: number;

    /**
     * For grids: spacing between items
     * Example: "normal", "compact", "spacious"
     */
    itemSpacing?: "compact" | "normal" | "spacious";

    /**
     * For truncation: character limit for truncation
     * Example: 200
     */
    truncationLimit?: number;

    /**
     * For lists: pagination size
     * Example: 20
     */
    pageSize?: number;

    /**
     * Visibility flag (alternative to presentation.visible)
     * Example: false
     */
    hidden?: boolean;

    /**
     * Animation/transition configuration
     */
    animation?: {
      /**
       * Animation type
       */
      type?: "fade" | "slide" | "scale" | "none";

      /**
       * Duration in milliseconds
       */
      duration?: number;

      /**
       * Delay before starting animation
       */
      delay?: number;
    };

    /**
     * Custom settings (app-defined)
     */
    [key: string]: any;
  };
}
```

---

## Common Element Patterns

### Pattern 1: Simple Text Element

```typescript
const simpleText: Element = {
  id: "text-001",
  type: "text",
  displayName: "Representative Name",
  data: "John Smith",
  textMetadata: {
    level: "Emphasized",
    textTransform: "capitalize_all_words",
    selectable: true
  },
  presentation: {
    styling: "primary",
    order: 1,
    visible: true
  }
};
```

### Pattern 2: Image Element with Navigation

```typescript
const imageWithNav: Element = {
  id: "image-001",
  type: "image",
  displayName: "Profile Picture",
  data: {
    url: "https://api.example.com/representatives/rep-123/profile.jpg",
    altText: "John Smith profile photo"
  },
  template: {
    id: "Image.ProfilePic",
    name: "Profile Picture",
    elementType: "image",
    dataSchema: {
      url: "Text",
      altText: "Text"
    },
    requiredFields: ["url"],
    componentMap: {
      url: "image",
      altText: "accessibility-text"
    },
    renderingGuidance: "circular-avatar"
  },
  navigation: {
    route: "/representative/rep-123",
    parameters: { id: "rep-123" },
    isClickable: true,
    actionType: "navigate"
  },
  presentation: {
    styling: "card",
    order: 1,
    visible: true,
    attributes: {
      responsive_size: "small",
      emphasis: "high"
    }
  }
};
```

### Pattern 3: Card with Multiple Fields

```typescript
const cardElement: Element = {
  id: "card-001",
  type: "card",
  displayName: "Representative Summary",
  data: {
    name: "John Smith",
    party: "Democratic",
    state: "Colorado",
    profilePic: { url: "https://..." },
    district: "1st District"
  },
  template: {
    id: "Card.RepresentativeSummary",
    name: "Representative Summary Card",
    elementType: "card",
    dataSchema: {
      name: "Text",
      party: "Text",
      state: "Text",
      profilePic: "Object",
      district: "Text"
    },
    requiredFields: ["name", "profilePic"],
    componentMap: {
      profilePic: "image",
      name: "text-primary",
      party: "badge",
      state: "text-secondary",
      district: "text-muted"
    },
    renderingGuidance: "horizontal-card"
  },
  presentation: {
    layout: "horizontal",
    styling: "card",
    order: 1,
    attributes: {
      spacing: "normal",
      border: "light"
    }
  },
  navigation: {
    route: "/representative/rep-123",
    parameters: { id: "rep-123" },
    isClickable: true,
    actionType: "navigate"
  }
};
```

### Pattern 4: Carousel Collection

```typescript
const carouselElement: Element = {
  id: "carousel-001",
  type: "section",
  displayName: "Featured Representatives",
  controlFeatures: {
    collectionMode: "carousel",
    carousel: "auto-scroll",
    customSettings: {
      autoScrollInterval: 5000,
      showPagingIndicators: true
    }
  },
  children: [
    {
      id: "carousel-item-1",
      type: "card",
      displayName: "Rep. John Smith",
      data: { name: "John Smith", party: "Democratic" },
      // ... template and metadata ...
    },
    {
      id: "carousel-item-2",
      type: "card",
      displayName: "Rep. Jane Doe",
      data: { name: "Jane Doe", party: "Republican" },
      // ... template and metadata ...
    }
  ],
  presentation: {
    layout: "horizontal",
    order: 2,
    visible: true
  }
};
```

### Pattern 5: Grid Collection

```typescript
const gridElement: Element = {
  id: "grid-001",
  type: "section",
  displayName: "Bills Grid",
  controlFeatures: {
    collectionMode: "grid",
    customSettings: {
      columns: 2,
      itemSpacing: "normal"
    }
  },
  children: [
    // Multiple bill card elements...
  ],
  presentation: {
    layout: "vertical",
    order: 3,
    visible: true
  }
};
```

### Pattern 6: Section with Truncated Text

```typescript
const truncatedSection: Element = {
  id: "section-001",
  type: "section",
  displayName: "Bill Summary",
  data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  textMetadata: {
    maxCharacters: 300,
    showMoreAction: true,
    truncationType: "Ellipsis",
    level: "Default"
  },
  presentation: {
    layout: "vertical",
    styling: "subtle",
    order: 4,
    visible: true
  }
};
```

### Pattern 7: List with Multiple Items

```typescript
const listElement: Element = {
  id: "list-001",
  type: "section",
  displayName: "Committee Memberships",
  data: [
    "Ways and Means Committee",
    "Appropriations Committee",
    "Joint Economic Committee"
  ],
  template: {
    id: "List.Committees",
    name: "Committee List",
    elementType: "section",
    dataSchema: {
      "0": "Text",
      "1": "Text",
      "2": "Text"
    },
    requiredFields: [],
    componentMap: {
      "0": "text-secondary",
      "1": "text-secondary",
      "2": "text-secondary"
    },
    renderingGuidance: "vertical-list"
  },
  controlFeatures: {
    collectionMode: "list"
  },
  presentation: {
    layout: "vertical",
    styling: "subtle",
    order: 5,
    attributes: {
      spacing: "compact"
    }
  }
};
```

### Pattern 8: Badge/Chip Collection

```typescript
const chipElement: Element = {
  id: "chips-001",
  type: "chips",
  displayName: "Tags",
  data: ["Healthcare", "Economy", "Education"],
  template: {
    id: "Chips.Tags",
    name: "Tag Chips",
    elementType: "chips",
    dataSchema: {
      "0": "Text",
      "1": "Text",
      "2": "Text"
    },
    requiredFields: [],
    componentMap: {
      "0": "chips",
      "1": "chips",
      "2": "chips"
    },
    renderingGuidance: "inline-chips"
  },
  presentation: {
    layout: "horizontal",
    styling: "subtle",
    order: 6,
    attributes: {
      spacing: "compact",
      responsive_size: "full"
    }
  }
};
```

---

## Mock API Response Examples

### Example 1: Representative Profile Screen

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Representative Profile",
  "type": "representative_profile",
  "createdAt": "2026-01-15T10:30:45.123Z",
  "metadata": {
    "description": "Complete profile for U.S. Representative John Smith",
    "keywords": ["representative", "senate", "colorado", "profile"],
    "accessLevel": "public"
  },
  "theme": "light",
  "locale": "en-US",
  "elements": [
    {
      "id": "header-001",
      "type": "header",
      "displayName": "Representative Header",
      "data": {
        "name": "John Smith",
        "party": "Democratic",
        "state": "Colorado",
        "district": "1st District",
        "profilePic": {
          "url": "https://api.example.com/representatives/john-smith/profile.jpg",
          "altText": "John Smith headshot"
        }
      },
      "template": {
        "id": "Header.Representative",
        "name": "Representative Header",
        "elementType": "header",
        "dataSchema": {
          "name": "Text",
          "party": "Text",
          "state": "Text",
          "district": "Text",
          "profilePic": "Object"
        },
        "requiredFields": ["name", "profilePic", "party"],
        "componentMap": {
          "profilePic": "image",
          "name": "text-primary",
          "party": "badge",
          "state": "text-secondary",
          "district": "text-muted"
        },
        "renderingGuidance": "horizontal-card"
      },
      "presentation": {
        "layout": "horizontal",
        "styling": "primary",
        "order": 1,
        "visible": true,
        "attributes": {
          "spacing": "normal",
          "emphasis": "high",
          "border": "light"
        }
      },
      "navigation": {
        "route": "/representative/john-smith",
        "parameters": { "id": "john-smith" },
        "isClickable": true,
        "actionType": "navigate"
      }
    },
    {
      "id": "text-bio-001",
      "type": "text",
      "displayName": "Biography",
      "data": "John Smith is a Democratic Representative from Colorado's 1st Congressional District. He has served in Congress since 2019 and focuses on healthcare reform, environmental protection, and economic opportunity.",
      "textMetadata": {
        "maxCharacters": 300,
        "showMoreAction": true,
        "truncationType": "Ellipsis",
        "level": "Default",
        "lineClamp": 3
      },
      "presentation": {
        "layout": "vertical",
        "styling": "card",
        "order": 2,
        "visible": true,
        "attributes": {
          "spacing": "normal"
        }
      }
    },
    {
      "id": "section-committees-001",
      "type": "section",
      "displayName": "Committee Memberships",
      "data": [
        "Ways and Means Committee",
        "Appropriations Committee",
        "Joint Economic Committee"
      ],
      "template": {
        "id": "List.CommitteeList",
        "name": "Committee List",
        "elementType": "section",
        "dataSchema": {},
        "requiredFields": [],
        "componentMap": {},
        "renderingGuidance": "vertical-list"
      },
      "controlFeatures": {
        "collectionMode": "list",
        "customSettings": {
          "spacing": "compact"
        }
      },
      "presentation": {
        "layout": "vertical",
        "styling": "subtle",
        "order": 3,
        "visible": true
      },
      "children": [
        {
          "id": "chip-comm-001",
          "type": "badge",
          "displayName": "Committee",
          "data": "Ways and Means Committee",
          "textMetadata": {
            "level": "Muted"
          },
          "presentation": {
            "styling": "secondary",
            "order": 1,
            "attributes": {
              "spacing": "compact"
            }
          }
        },
        {
          "id": "chip-comm-002",
          "type": "badge",
          "displayName": "Committee",
          "data": "Appropriations Committee",
          "textMetadata": {
            "level": "Muted"
          },
          "presentation": {
            "styling": "secondary",
            "order": 2,
            "attributes": {
              "spacing": "compact"
            }
          }
        },
        {
          "id": "chip-comm-003",
          "type": "badge",
          "displayName": "Committee",
          "data": "Joint Economic Committee",
          "textMetadata": {
            "level": "Muted"
          },
          "presentation": {
            "styling": "secondary",
            "order": 3,
            "attributes": {
              "spacing": "compact"
            }
          }
        }
      ]
    },
    {
      "id": "carousel-featured-001",
      "type": "section",
      "displayName": "Featured Bills",
      "controlFeatures": {
        "collectionMode": "carousel",
        "carousel": "auto-scroll",
        "customSettings": {
          "autoScrollInterval": 5000,
          "showPagingIndicators": true
        }
      },
      "presentation": {
        "layout": "horizontal",
        "styling": "card",
        "order": 4,
        "visible": true
      },
      "children": [
        {
          "id": "carousel-bill-001",
          "type": "card",
          "displayName": "Bill Card",
          "data": {
            "billNumber": "H.R. 1234",
            "title": "Healthcare Reform Act of 2026",
            "status": "In Committee",
            "introduced": "2025-03-15"
          },
          "template": {
            "id": "Card.BillSummary",
            "name": "Bill Summary Card",
            "elementType": "card",
            "dataSchema": {
              "billNumber": "Text",
              "title": "Text",
              "status": "Text",
              "introduced": "DateTime"
            },
            "requiredFields": ["billNumber", "title"],
            "componentMap": {
              "billNumber": "text-primary",
              "title": "text-secondary",
              "status": "badge",
              "introduced": "text-muted"
            },
            "renderingGuidance": "vertical-card"
          },
          "navigation": {
            "route": "/bill/H.R.1234",
            "parameters": { "billNumber": "H.R.1234" },
            "isClickable": true,
            "actionType": "navigate"
          },
          "presentation": {
            "styling": "subtle",
            "order": 1
          }
        },
        {
          "id": "carousel-bill-002",
          "type": "card",
          "displayName": "Bill Card",
          "data": {
            "billNumber": "H.R. 5678",
            "title": "Clean Energy Initiative",
            "status": "Passed",
            "introduced": "2025-06-10"
          },
          "template": {
            "id": "Card.BillSummary",
            "name": "Bill Summary Card",
            "elementType": "card",
            "dataSchema": {
              "billNumber": "Text",
              "title": "Text",
              "status": "Text",
              "introduced": "DateTime"
            },
            "requiredFields": ["billNumber", "title"],
            "componentMap": {
              "billNumber": "text-primary",
              "title": "text-secondary",
              "status": "badge",
              "introduced": "text-muted"
            },
            "renderingGuidance": "vertical-card"
          },
          "navigation": {
            "route": "/bill/H.R.5678",
            "parameters": { "billNumber": "H.R.5678" },
            "isClickable": true,
            "actionType": "navigate"
          },
          "presentation": {
            "styling": "subtle",
            "order": 2
          }
        }
      ]
    }
  ]
}
```

### Example 2: Bill Details Screen

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Bill Details",
  "type": "bill_details",
  "createdAt": "2026-01-15T11:15:32.456Z",
  "metadata": {
    "description": "Detailed information for Healthcare Reform Act of 2026",
    "keywords": ["bill", "healthcare", "reform", "h.r. 1234"],
    "accessLevel": "public"
  },
  "theme": "light",
  "locale": "en-US",
  "elements": [
    {
      "id": "header-bill-001",
      "type": "header",
      "displayName": "Bill Header",
      "data": {
        "billNumber": "H.R. 1234",
        "title": "Healthcare Reform Act of 2026",
        "sponsor": "Rep. John Smith",
        "status": "In Committee"
      },
      "presentation": {
        "layout": "vertical",
        "styling": "primary",
        "order": 1,
        "visible": true
      }
    },
    {
      "id": "section-summary-001",
      "type": "section",
      "displayName": "Summary",
      "data": "The Healthcare Reform Act aims to expand coverage for underserved populations, reduce prescription drug costs, and improve access to mental health services across the United States.",
      "textMetadata": {
        "maxCharacters": 500,
        "showMoreAction": true,
        "truncationType": "Ellipsis",
        "level": "Default"
      },
      "presentation": {
        "layout": "vertical",
        "styling": "card",
        "order": 2,
        "visible": true
      }
    },
    {
      "id": "grid-sponsors-001",
      "type": "section",
      "displayName": "Co-Sponsors",
      "controlFeatures": {
        "collectionMode": "grid",
        "customSettings": {
          "columns": 2,
          "itemSpacing": "normal"
        }
      },
      "presentation": {
        "layout": "vertical",
        "styling": "subtle",
        "order": 3,
        "visible": true
      },
      "children": [
        {
          "id": "sponsor-card-001",
          "type": "card",
          "displayName": "Co-Sponsor",
          "data": {
            "name": "Rep. Jane Doe",
            "party": "Democratic",
            "state": "California"
          },
          "template": {
            "id": "Card.CoSponsor",
            "name": "Co-Sponsor Card",
            "elementType": "card",
            "dataSchema": {
              "name": "Text",
              "party": "Text",
              "state": "Text"
            },
            "requiredFields": ["name"],
            "componentMap": {
              "name": "text-primary",
              "party": "badge",
              "state": "text-secondary"
            },
            "renderingGuidance": "vertical-card"
          },
          "navigation": {
            "route": "/representative/jane-doe",
            "parameters": { "id": "jane-doe" },
            "isClickable": true,
            "actionType": "navigate"
          },
          "presentation": {
            "styling": "card",
            "order": 1
          }
        },
        {
          "id": "sponsor-card-002",
          "type": "card",
          "displayName": "Co-Sponsor",
          "data": {
            "name": "Rep. Bob Wilson",
            "party": "Democratic",
            "state": "New York"
          },
          "template": {
            "id": "Card.CoSponsor",
            "name": "Co-Sponsor Card",
            "elementType": "card",
            "dataSchema": {
              "name": "Text",
              "party": "Text",
              "state": "Text"
            },
            "requiredFields": ["name"],
            "componentMap": {
              "name": "text-primary",
              "party": "badge",
              "state": "text-secondary"
            },
            "renderingGuidance": "vertical-card"
          },
          "navigation": {
            "route": "/representative/bob-wilson",
            "parameters": { "id": "bob-wilson" },
            "isClickable": true,
            "actionType": "navigate"
          },
          "presentation": {
            "styling": "card",
            "order": 2
          }
        }
      ]
    }
  ]
}
```

---

## Data Type Reference

### Primitive Data Types

```typescript
// Text - String values
"John Smith" | "Colorado" | "Democratic Party"

// Number - Numeric values
42 | 3.14 | 1000000 | -50

// Boolean - True/false values
true | false

// DateTime - ISO 8601 formatted strings
"2026-01-15T10:30:45.123Z"

// Currency - Numeric values (metadata indicates formatting)
5000000 | 1234.56
```

### Complex Data Types

```typescript
// Object - Structured data
{
  "name": "John Smith",
  "party": "Democratic",
  "state": "Colorado"
}

// Array - Collection of values
[
  "Ways and Means Committee",
  "Appropriations Committee"
]

// Nested Object with Array
{
  "representativeName": "John Smith",
  "committees": [
    {
      "name": "Ways and Means",
      "role": "Member"
    },
    {
      "name": "Appropriations",
      "role": "Ranking Member"
    }
  ]
}
```

---

## Common Component Types Reference

| Component Type | Use Case | Data Type | Example |
|---|---|---|---|
| `text-primary` | Main text content | String | "John Smith" |
| `text-secondary` | Secondary text | String | "Colorado" |
| `text-muted` | Tertiary/muted text | String | "District 1" |
| `text-emphasized` | Highlighted text | String | "Passed" |
| `image` | Image display | Object with `url` | `{ url: "..." }` |
| `badge` | Small labeled indicator | String | "Democratic" |
| `chips` | Tag/chip collection | Array | `["Tag1", "Tag2"]` |
| `button` | Interactive button | String | "Submit" |
| `link` | Interactive link | String | "View Details" |
| `list` | Vertical list | Array | `["Item1", "Item2"]` |
| `grid` | Multi-column grid | Array | `[{...}, {...}]` |
| `card` | Contained layout | Object | `{ title, content }` |
| `chart` | Data visualization | Object | `{ type: "bar", data: [...] }` |

---

## Template Rendering Guidance Reference

| Guidance | Usage | Layout | Example |
|---|---|---|---|
| `horizontal-card` | Side-by-side layout | Row with center alignment | Profile header with image + text |
| `vertical-card` | Stacked layout | Column | Bill summary card |
| `vertical-list` | Bulleted list | Column | Committee memberships |
| `inline-chips` | Horizontal tag collection | Row with wrap | Topic tags |
| `banner` | Full-width header | 100% width | Page title banner |
| `grid-2col` | Two-column grid | 2-column flex | Representative grid |
| `grid-3col` | Three-column grid | 3-column flex | Thumbnail grid |
| `hero` | Large featured section | Full width, tall | Featured representative |
| `carousel` | Horizontal scroll | Scrollable row | Featured bills |
| `accordion` | Expandable sections | Stacked collapsible | Bill details sections |

---

## Best Practices for Mock Data Generation

### 1. **Always Include Required Fields**

```typescript
// ? GOOD: Includes all required template fields
const element = {
  id: "elem-001",
  type: "card",
  displayName: "Representative Card",
  data: {
    name: "John Smith",          // Required
    profilePic: { url: "..." }   // Required
  },
  template: {
    requiredFields: ["name", "profilePic"]
  }
};

// ? BAD: Missing required "profilePic" field
const element = {
  id: "elem-001",
  type: "card",
  data: {
    name: "John Smith"
    // Missing profilePic!
  }
};
```

### 2. **Match Data to ComponentMap**

```typescript
// ? GOOD: All data fields have corresponding component mappings
const template = {
  dataSchema: {
    name: "Text",
    party: "Text",
    state: "Text"
  },
  componentMap: {
    name: "text-primary",      // Maps to schema
    party: "badge",            // Maps to schema
    state: "text-secondary"    // Maps to schema
  }
};

// ? BAD: Missing component mapping for "state"
const template = {
  dataSchema: {
    name: "Text",
    party: "Text",
    state: "Text"
  },
  componentMap: {
    name: "text-primary",
    party: "badge"
    // Missing mapping for state!
  }
};
```

### 3. **Use Realistic Navigation Routes**

```typescript
// ? GOOD: Routes follow app structure
navigation: {
  route: "/representative/john-smith",
  parameters: { id: "john-smith" },
  isClickable: true,
  actionType: "navigate"
}

// ? BAD: Vague, non-actionable route
navigation: {
  route: "something",
  isClickable: true,
  actionType: "navigate"
}
```

### 4. **Include Meaningful Metadata**

```typescript
// ? GOOD: Rich metadata for context
presentation: {
  layout: "horizontal",
  styling: "primary",
  order: 1,
  attributes: {
    responsive_size: "large",
    emphasis: "high",
    spacing: "normal"
  }
}

// ? BAD: Minimal metadata
presentation: {
  order: 1
}
```

### 5. **Use Semantic Styling, Not CSS**

```typescript
// ? GOOD: Semantic intent
presentation: {
  styling: "primary",  // Framework applies color
  attributes: {
    emphasis: "high"
  }
}

// ? BAD: CSS-like properties
presentation: {
  styling: "color-blue padding-16px font-bold"  // Too specific!
}
```

### 6. **Add Accessibility Metadata**

```typescript
// ? GOOD: Accessibility support
accessibility: {
  label: "John Smith Representative Profile",
  hint: "Double tap to view full profile",
  role: "button",
  alternativeText: "Portrait of John Smith"
}

// ? BAD: No accessibility metadata
// (missing accessibility object entirely)
```

### 7. **Validate Component Types**

```typescript
// ? GOOD: Standard, known component types
componentMap: {
  name: "text-primary",
  party: "badge",
  votes: "chips"
}

// ? BAD: Made-up, non-standard types
componentMap: {
  name: "custom-super-text",
  party: "my-badge-variant"
}
```

---

## Validation Rules for Mock Data

### Element Validation

- [ ] Element has unique `id` within PoliSnap
- [ ] Element has `type` from known types (text, card, section, etc.)
- [ ] Element has `displayName` for accessibility and debugging
- [ ] If element has `template`, all required fields in `template.requiredFields` are present in `data`
- [ ] If element is navigable (`navigation.isClickable === true`), has valid `route` and `actionType`

### Template Validation

- [ ] Template has unique `id` (format: Category.Name)
- [ ] Template has `dataSchema` with property-to-type mappings
- [ ] Template has `componentMap` with all schema properties mapped
- [ ] Template has `renderingGuidance` (semantic, not CSS)
- [ ] All keys in `requiredFields` exist in `dataSchema`

### Data Validation

- [ ] All required fields are populated (non-null)
- [ ] Data types match template schema declarations
- [ ] URLs (if present) are absolute paths or valid protocols
- [ ] Dates follow ISO 8601 format
- [ ] Numbers don't have unexpected precision issues

### Metadata Validation

- [ ] `textMetadata.level` is one of: "Default", "Emphasized", "Muted", "Caption"
- [ ] `presentation.layout` is "horizontal" or "vertical"
- [ ] `presentation.styling` is semantic (not CSS class name)
- [ ] Navigation `actionType` is valid: "navigate", "push", "link", "back", "custom"
- [ ] Control features `collectionMode` is one of: "carousel", "grid", "list", "stack", "tabs"

---

## Checklist for AI: Generating Mock Data

When an AI system generates mock data for this architecture, verify:

### Pre-Generation
- [ ] Understand the target screen/feature type
- [ ] Identify primary data entities (representative, bill, vote, etc.)
- [ ] Plan element hierarchy (what's top-level, what's nested)
- [ ] Identify navigation targets (what screens should elements link to)

### During Generation
- [ ] Start with PoliSnap root object
- [ ] Define elements in logical order
- [ ] Create templates for element patterns
- [ ] Map data to components via template
- [ ] Add semantic metadata (presentation, navigation, features)
- [ ] Include accessibility hints
- [ ] Validate all required fields

### Post-Generation
- [ ] Verify no broken navigation references
- [ ] Check all data types match schema
- [ ] Ensure all component types are standard
- [ ] Test that metadata is semantic (not CSS-like)
- [ ] Confirm all required fields are populated
- [ ] Validate against provided examples

---

## Integration with React Native App

### 1. API Call Pattern

```typescript
async function fetchPoliSnapData(type: string, id: string): Promise<PoliSnap> {
  const response = await fetch(
    `https://api.example.com/polisnap/${type}/${id}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch PoliSnap: ${response.status}`);
  }
  
  return response.json();
}
```

### 2. Error Handling Pattern

```typescript
async function loadPoliSnapScreen(type: string, id: string) {
  try {
    const poliSnap = await fetchPoliSnapData(type, id);
    
    // Validate structure
    if (!poliSnap.elements || poliSnap.elements.length === 0) {
      throw new Error("No elements in PoliSnap response");
    }
    
    // Render
    return <PoliSnapScreen poliSnap={poliSnap} />;
  } catch (error) {
    return <ErrorScreen error={error.message} />;
  }
}
```

### 3. Caching Pattern

```typescript
class PoliSnapCache {
  private cache = new Map<string, PoliSnap>();
  
  async getOrFetch(type: string, id: string): Promise<PoliSnap> {
    const key = `${type}:${id}`;
    
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    const poliSnap = await fetchPoliSnapData(type, id);
    this.cache.set(key, poliSnap);
    return poliSnap;
  }
  
  invalidate(type: string, id: string) {
    const key = `${type}:${id}`;
    this.cache.delete(key);
  }
}
```

---

## Conclusion

This specification provides AI systems with complete context to:

1. **Generate realistic mock data** following PoliSnap metadata patterns
2. **Create semantic templates** that describe intent, not implementation
3. **Structure API responses** with self-contained, renderable elements
4. **Support complex layouts** (carousels, grids, nested structures)
5. **Enable navigation** with meaningful routing and parameters
6. **Maintain accessibility** throughout the design

Use this document when prompting AI to generate mock API responses, React Native components, or metadata schemas for the PoliSnap architecture.
