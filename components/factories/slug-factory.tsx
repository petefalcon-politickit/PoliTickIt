import React from "react";
import { SlugType } from "../../types/slug";
import { ParticipationSlug } from "../ui/participation-slug";

export type SlugRenderer = (props: any) => React.ReactNode;

class SlugFactory {
  private registry: Map<SlugType, SlugRenderer> = new Map();

  constructor() {
    // Register default slug types
    this.register("participation", (props) => <ParticipationSlug {...props} />);

    // Future expansion points
    this.register(
      "alert",
      (props) =>
        // Placeholder for Alert Slug
        null,
    );
  }

  register(type: SlugType, renderer: SlugRenderer) {
    this.registry.set(type, renderer);
  }

  render(type: SlugType, props: any): React.ReactNode {
    const renderer = this.registry.get(type);
    if (!renderer) {
      console.warn(`No renderer registered for slug type: ${type}`);
      return null;
    }
    return renderer(props);
  }
}

export const slugFactory = new SlugFactory();
