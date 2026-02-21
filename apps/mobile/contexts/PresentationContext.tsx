import React, { createContext, ReactNode, useContext, useState } from "react";
import { OmniTheme, ThemeMarkers } from "../types/theme";

interface PresentationContextType {
  theme: OmniTheme;
  setTheme: (theme: OmniTheme) => void;
  isGenotypeMode: boolean;
  toggleMode: () => void;
}

const defaultPhenotypeMarkers: ThemeMarkers = {
  visual_intensity: 0.8,
  branding_sovereignty: true,
  palette: {
    primary: "#164570",
    secondary: "#2271ba",
    accent: "#E11D48",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textSecondary: "#475569",
    status: {
      success: "#38A169",
      warning: "#D69E2E",
      error: "#C53030",
      info: "#2C5282",
      intelligence: "#6B46C1",
    },
  },
};

const defaultGenotypeMarkers: ThemeMarkers = {
  visual_intensity: 0.4,
  branding_sovereignty: false,
  palette: {
    primary: "#2D3748", // Slate 700
    secondary: "#4A5568", // Slate 600
    accent: "#3182CE", // Blue 600
    background: "#EDF2F7", // Slate 100
    surface: "#F7FAFC", // Slate 50
    text: "#1A202C", // Slate 900
    textSecondary: "#718096", // Slate 500
    status: {
      success: "#48BB78",
      warning: "#ECC94B",
      error: "#F56565",
      info: "#4299E1",
      intelligence: "#9F7AEA",
    },
  },
};

const defaultTheme: OmniTheme = {
  id: "politickit-default",
  version: "1.0.0",
  name: "PoliTickIt Phenotype",
  markers: defaultPhenotypeMarkers,
};

const PresentationContext = createContext<PresentationContextType | undefined>(
  undefined,
);

export const PresentationProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<OmniTheme>(defaultTheme);
  const [isGenotypeMode, setIsGenotypeMode] = useState(false);

  const toggleMode = () => {
    setIsGenotypeMode((prev) => !prev);
    setTheme((prev) => ({
      ...prev,
      name: !isGenotypeMode ? "Omni-OS Genotype" : "PoliTickIt Phenotype",
      markers: !isGenotypeMode
        ? defaultGenotypeMarkers
        : defaultPhenotypeMarkers,
    }));
  };

  return (
    <PresentationContext.Provider
      value={{ theme, setTheme, isGenotypeMode, toggleMode }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error(
      "usePresentation must be used within a PresentationProvider",
    );
  }
  return context;
};
