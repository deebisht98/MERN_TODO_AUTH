import { createContext, useState, useEffect, use } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { User } from "@/types/User";
import { checkAuth, logoutUser } from "@/api/authApi";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

interface AuthContextType {
  user: User | null;
  setUser: (userData: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user;
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await checkAuth();
        if (response.success && response.data) {
          setUser(response.data as User);
          if (isPublicRoute) {
            navigate({ to: "/tasks" });
          }
        }
      } catch (error) {
        setUser(null);
        if (!isPublicRoute) {
          navigate({ to: "/login" });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate, isPublicRoute]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && isPublicRoute) {
        navigate({ to: "/tasks" });
      } else if (!isAuthenticated && !isPublicRoute) {
        navigate({ to: "/login" });
      }
    }
  }, [isAuthenticated, isPublicRoute, isLoading, navigate]);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isLoading) {
    return null; // or your loading component
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
