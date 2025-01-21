import { createContext, useState, useEffect, use } from "react";
import { useNavigate } from "@tanstack/react-router";
import { User } from "@/types/User";
import { checkAuth } from "@/api/authApi";
import axiosInstance from "@/api/axiosInstance";

interface AuthContextType {
  user: User | null;
  setUser: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const data = await checkAuth();
        setUser(data.user);
      } catch (error) {
        setUser(null);
        navigate({ to: "/login" });
      }
    };

    authenticate();
  }, [navigate]);

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
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
