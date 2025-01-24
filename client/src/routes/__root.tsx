import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotFound } from "@/components/NotFound";
import { InactivityDialog } from "@/components/InactivityDialog";
import { useSilentRenew } from "@/hooks/useSilentRenew";
import { ThemeProvider } from "@/context/ThemeContext";

export const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: () => <NotFound />,
});

function App() {
  useSilentRenew();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <div className="bg-background text-foreground">
            <TooltipProvider>
              <Toaster />
              <Sonner />
            </TooltipProvider>
            <Outlet />
            <InactivityDialog />
          </div>
        </ThemeProvider>
        <TanStackRouterDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export const Route = rootRoute;
