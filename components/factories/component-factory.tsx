import React, { JSX } from "react";

export type ComponentRenderProps = {
  dataField: string;
  value: any;
  metadata?: any;
  theme?: any;
  presentation?: any;
  extraProps?: any;
};

export class ComponentFactory {
  private static renderers: Map<
    string,
    (props: ComponentRenderProps) => JSX.Element
  > = new Map();

  static register(
    type: string,
    fn: (props: ComponentRenderProps) => JSX.Element,
  ) {
    this.renderers.set(String(type).toLowerCase(), fn);
  }

  static render(type: string, props: ComponentRenderProps) {
    const fn = this.renderers.get(String(type).toLowerCase());
    if (!fn) {
      return <>{String(props.value)}</>;
    }
    return fn(props);
  }

  static has(type: string): boolean {
    return this.renderers.has(String(type).toLowerCase());
  }
}

export default ComponentFactory;
