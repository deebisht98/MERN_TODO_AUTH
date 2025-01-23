import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotFound } from "@/components/NotFound";

export const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="bg-background text-foreground">
          <TooltipProvider>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </div>
        <Outlet />
        <TanStackRouterDevtools />
      </AuthProvider>
    </QueryClientProvider>
  ),
  notFoundComponent: () => <NotFound />,
});

export const Route = rootRoute;
