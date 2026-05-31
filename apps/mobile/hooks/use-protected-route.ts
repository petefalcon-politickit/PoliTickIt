import { useAuth } from "@/contexts/auth-context";
import { router, useSegments } from "expo-router";
import { useEffect } from "react";

const AUTH_GROUP = "(auth)";

/**
 * Redirects unauthenticated users to the login screen.
 * Must be called from a component that is a descendant of AuthProvider.
 */
export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === AUTH_GROUP;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/accountability");
    }
  }, [isAuthenticated, isLoading, segments]);
}
