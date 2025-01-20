import { createContext, useState, useEffect, use } from "react";
import { useNavigate } from "@tanstack/react-router";
import { User } from "@/types/User";

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        navigate({ to: "/login" });
      } else {
        navigate({ to: "/tasks" });
      }
    };
    checkAuth();
  }, [user, navigate]);

  const login = (userData: User) => {
    setUser(userData);
    navigate({ to: "/tasks" });
  };

  const logout = () => {
    setUser(null);
    navigate({ to: "/login" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
