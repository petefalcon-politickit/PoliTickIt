import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function LogoutScreen() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return null;
}
