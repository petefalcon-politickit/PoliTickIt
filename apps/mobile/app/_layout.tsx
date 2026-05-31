import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import NavigationDrawer from "@/components/navigation/drawer";
import { GlobalStyles } from "@/constants/theme";
import { ActivityProvider } from "@/contexts/activity-context";
import { AuthProvider } from "@/contexts/auth-context";
import { DrawerProvider } from "@/contexts/drawer-context";
import { PresentationProvider } from "@/contexts/PresentationContext";
import { ServiceProvider } from "@/contexts/service-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { View } from "react-native";

function NavigationGuard({ children }: { children: React.ReactNode }) {
  useProtectedRoute();
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PresentationProvider>
        <ServiceProvider>
          <AuthProvider>
            <NavigationGuard>
              <ActivityProvider>
                <DrawerProvider>
                  <ThemeProvider
                    value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                  >
                    <View style={GlobalStyles.container}>
                      <Stack
                        screenOptions={{
                          headerShown: false,
                        }}
                      >
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="index" />
                        <Stack.Screen
                          name="modal"
                          options={{ presentation: "modal" }}
                        />
                      </Stack>
                      <NavigationDrawer />
                    </View>
                    <StatusBar style="auto" />
                  </ThemeProvider>
                </DrawerProvider>
              </ActivityProvider>
            </NavigationGuard>
          </AuthProvider>
        </ServiceProvider>
      </PresentationProvider>
    </GestureHandlerRootView>
  );
}
