import {
    apiAuthService,
    AuthUser,
    RegisterPayload,
} from "@/services/implementations/ApiAuthService";
import { router } from "expo-router";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

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
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session from AsyncStorage on mount
  useEffect(() => {
    apiAuthService
      .initialize()
      .then((storedUser) => {
        setUser(storedUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const loggedInUser = await apiAuthService.login(email, password);
      setUser(loggedInUser);
      router.replace("/accountability");
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const verifyEmail = useCallback(async (email: string, code: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const verifiedUser = await apiAuthService.verifyEmail(email, code);
      setUser(verifiedUser);
      router.replace("/accountability");
    } catch (err: any) {
      setError(err.message ?? "Verification failed. Please check your code.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
