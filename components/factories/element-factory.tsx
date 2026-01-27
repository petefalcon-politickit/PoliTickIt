import { JSX } from "react";
import ComponentFactory from "./component-factory";

export class ElementFactory {
  private static renderers: Map<
    string,
    (element: any, extraProps?: any) => JSX.Element | null
  > = new Map();

  static register(
    role: string,
    fn: (element: any, extraProps?: any) => JSX.Element | null,
  ) {
    this.renderers.set(String(role).toLowerCase(), fn);
  }

  static render(element: any, extraProps?: any) {
    const role = element?.type || (element?.template && element.template.id);

    if (!role) return null;
    const key = String(role).toLowerCase();

    // 1. Try specialized element-level renderer (e.g. Layout, Collection)
    const fn = this.renderers.get(key);
    if (fn) {
      return fn(element, extraProps);
    }

    // 2. Try Cohesive Element from ComponentFactory (Primary Pattern)
    if (ComponentFactory.has(role)) {
      return ComponentFactory.render(role, {
        dataField: "root",
        value: element.data,
        metadata: element.textMetadata,
        presentation: element.presentation,
        extraProps,
      });
    }

    return null;
  }
}

export default ElementFactory;
