const polisnap1 = {
  id: "polisnap-large",
  title: "PoliSnap — Full Feature Demo",
  metadata: {
    description: "Contains four large elements demonstrating common features.",
  },
  elements: [
    // 1) Large header with image and text
    {
      id: "large-header",
      type: "header",
      displayName: "Representative Header",
      data: {
        name: "Senator Jane Doe",
        position: "State of Example",
        profilePic: { url: "https://placekitten.com/400/400" },
      },
      template: {
        id: "Header.Representative",
        componentMap: {
          profilePic: "image",
          name: "text-primary",
          position: "text-secondary",
        },
        renderingGuidance: "horizontal-card",
      },
      presentation: {
        layout: "horizontal",
        styling: "card",
        attributes: { responsive_size: "full" },
      },
      navigation: {
        isClickable: true,
        actionType: "link",
        route: "https://example.com/rep/jane-doe",
      },
    },

    // 2) Long paragraph with textMetadata (truncation + show more)
    {
      id: "long-paragraph",
      type: "text",
      displayName: "Long Intro",
      data: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lacinia, velit a cursus fermentum, urna nibh placerat nisl, vitae convallis justo lacus id lorem. Sed vulputate, nisl in eleifend dictum, augue orci lacinia lectus, sit amet vulputate lectus lorem sit amet urna. Integer non risus eu odio dapibus fermentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      },
      template: {
        id: "Text.Truncatable",
        componentMap: { text: "text-primary" },
        renderingGuidance: "vertical",
      },
      textMetadata: { maxCharacters: 220, showMoreAction: true },
      presentation: { layout: "vertical", styling: "default" },
    },

    // 3) Carousel / gallery
    {
      id: "gallery",
      type: "collection",
      displayName: "Image Gallery",
      controlFeatures: {
        collectionMode: "carousel",
        carousel: "auto-scroll",
        customSettings: { autoScrollInterval: 4000 },
      },
      children: [
        {
          id: "g1",
          template: { componentMap: { img: "image" } },
          data: { img: { url: "https://placekitten.com/800/400" } },
        },
        {
          id: "g2",
          template: { componentMap: { img: "image" } },
          data: { img: { url: "https://placekitten.com/801/400" } },
        },
        {
          id: "g3",
          template: { componentMap: { img: "image" } },
          data: { img: { url: "https://placekitten.com/802/400" } },
        },
      ],
      presentation: { layout: "vertical", styling: "card" },
    },

    // 4) Chips / tags and a small stats card
    {
      id: "chips-and-stats",
      type: "composite",
      displayName: "Tags & Stats",
      data: {
        tags: ["Healthcare", "Education", "Infrastructure", "Budget"],
        supporters: 12453,
      },
      template: {
        id: "Composite.TagsStats",
        componentMap: { tags: "chips", supporters: "text-secondary" },
      },
      presentation: { layout: "vertical", styling: "default" },
    },
  ],
};

const polisnap2 = {
  id: "polisnap-list",
  title: "PoliSnap — Compact List",
  metadata: {
    description:
      "A shorter PoliSnap to validate vertical spacing between PoliSnaps.",
  },
  elements: [
    {
      id: "list-item-1",
      type: "listItem",
      data: { title: "Meeting with constituents", date: "2026-02-02" },
      template: {
        componentMap: { title: "text-primary", date: "text-secondary" },
      },
      presentation: { layout: "vertical", styling: "default" },
    },
    {
      id: "list-item-2",
      type: "listItem",
      data: { title: "Bill signing", date: "2026-03-10" },
      template: {
        componentMap: { title: "text-primary", date: "text-secondary" },
      },
      presentation: { layout: "vertical", styling: "default" },
    },
  ],
};

const polisnap3 = {
  id: "polisnap-cards",
  title: "PoliSnap — Cards",
  metadata: {
    description: "A few small cards to help validate scrolling and paddings.",
  },
  elements: Array.from({ length: 4 }).map((_, idx) => ({
    id: `card-${idx}`,
    type: "card",
    data: {
      title: `Quick card ${idx + 1}`,
      body: "Short description for card.",
    },
    template: {
      componentMap: { title: "text-primary", body: "text-secondary" },
    },
    presentation: { layout: "vertical", styling: "card" },
  })),
};

export const samplePoliSnaps = [polisnap1, polisnap2, polisnap3];

// Default export is the collection of sample PoliSnaps for demo purposes
export default samplePoliSnaps;
