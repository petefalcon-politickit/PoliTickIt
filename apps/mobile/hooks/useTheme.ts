import { usePresentation } from "../contexts/PresentationContext";

export const useTheme = () => {
  const { theme } = usePresentation();
  return theme.markers;
};
