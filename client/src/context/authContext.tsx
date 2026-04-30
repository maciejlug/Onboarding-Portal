import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser } from "../services/authApi";

type AuthUser = {
  isAuthenticated: boolean;
  email: string;
};

type AuthContextValue = {
  user: AuthUser;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>({
    isAuthenticated: false,
    email: "",
  });

  const refreshUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();

      setUser({
        isAuthenticated: data.is_authenticated,
        email: data.email,
      });
    } catch {
      setUser({
        isAuthenticated: false,
        email: "",
      });
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadCurrentUser() {
      try {
        const data = await getCurrentUser();

        if (ignore) return;

        setUser({
          isAuthenticated: data.is_authenticated,
          email: data.email,
        });
      } catch {
        if (ignore) return;

        setUser({
          isAuthenticated: false,
          email: "",
        });
      }
    }

    void loadCurrentUser();

    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      refreshUser,
    }),
    [user, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
