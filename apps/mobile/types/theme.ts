export interface ThemeMarkers {
  visual_intensity: number; // 0.0 - 1.0
  branding_sovereignty: boolean;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
      intelligence: string;
    };
  };
}

export interface OmniTheme {
  id: string;
  version: string;
  name: string;
  markers: ThemeMarkers;
}
