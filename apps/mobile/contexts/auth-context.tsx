import {
    apiAuthService,
    AuthUser,
    RegisterPayload,
} from "@/services/implementations/ApiAuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useServices } from "./service-provider";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    payload: RegisterPayload,
  ) => Promise<{ requiresVerification: true; email: string }>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiSyncService } = useServices();

  // Restore session from AsyncStorage on mount
  useEffect(() => {
    apiAuthService
      .initialize()
      .then((storedUser) => {
        setUser(storedUser);
        if (storedUser) {
          // Reinstall guard: hydrate SQLite follow state from Cosmos
          apiSyncService.syncFollowState().catch(() => {});
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const loggedInUser = await apiAuthService.login(email, password);
        setUser(loggedInUser);
        // Reinstall guard: hydrate SQLite follow state from Cosmos after fresh login
        apiSyncService.syncFollowState().catch(() => {});
        router.replace("/accountability");
      } catch (err: any) {
        setError(err.message ?? "Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [apiSyncService],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await apiAuthService.register(payload);
      return result;
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(
    async (email: string, code: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const verifiedUser = await apiAuthService.verifyEmail(email, code);
        setUser(verifiedUser);
        // Seed SQLite follow state from the Cosmos follows just created on the API
        apiSyncService.syncFollowState().catch(() => {});
        // Flag for welcome banner — AsyncStorage survives tab pre-mounting
        await AsyncStorage.setItem("@politickit:showWelcomeBanner", "1").catch(
          () => {},
        );
        router.replace("/accountability");
      } catch (err: any) {
        setError(err.message ?? "Verification failed. Please check your code.");
      } finally {
        setIsLoading(false);
      }
    },
    [apiSyncService],
  );

  const resendVerification = useCallback(async (email: string) => {
    setError(null);
    try {
      await apiAuthService.resendVerification(email);
    } catch (err: any) {
      setError(err.message ?? "Could not resend code. Please try again.");
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await apiAuthService.logout();
    setUser(null);
    setIsLoading(false);
    router.replace("/login");
  }, []);

  const deleteAccount = useCallback(async (password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await apiAuthService.deleteAccount(password);
      setUser(null);
      router.replace("/login");
    } catch (err: any) {
      setError(err.message ?? "Could not delete account. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        verifyEmail,
        resendVerification,
        logout,
        deleteAccount,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
