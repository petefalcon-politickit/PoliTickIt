import { useFeatureGate } from "@/hooks/use-feature-gate";
import React from "react";
import { StyleSheet } from "react-native";
import { GatedFeatureSlug } from "./gated-feature-slug";

interface FeatureGateProps {
  level: number;
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
  featureTitle?: string;
  featureDescription?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  level,
  children,
  fallbackContent,
  featureTitle,
  featureDescription,
}) => {
  const { isLocked, requirement, tierName } = useFeatureGate(level);

  if (!isLocked) {
    return <>{children}</>;
  }

  // Use the extensible GatedFeatureSlug for all locked features.
  // This replaces a full component with a descriptive interstitial to drive participation.
  return (
    <GatedFeatureSlug
      tierName={tierName}
      requirement={requirement}
      featureTitle={featureTitle}
      featureDescription={featureDescription}
    />
  );
};

const styles = StyleSheet.create({});
