import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const RootComponent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/tasks" /> : <Navigate to="/login" />;
};

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RootComponent,
});

const Navigate = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to });
  }, [navigate, to]);
  return null;
};
