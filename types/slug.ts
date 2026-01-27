export type SlugType =
  | "participation"
  | "survey"
  | "ad"
  | "alert"
  | "separator";

export interface SlugProps {
  type: SlugType;
  message?: string;
  onPress?: () => void;
  data?: any;
}

export interface SlugConfig {
  id: string;
  type: SlugType;
  props?: any;
  // Cell styling overrides
  height?: number;
  backgroundColor?: string;
  showLine?: boolean;
}
