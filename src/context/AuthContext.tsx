import { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole, getCurrentUser, login as apiLogin, logout as apiLogout } from "@/utils/authApi";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const existing = getCurrentUser();
    setUser(existing);
    setIsAuthLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    const result = apiLogin(email, password, role);
    if (!result) return false;
    setUser(result);
    return true;
  };

  const handleLogout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
