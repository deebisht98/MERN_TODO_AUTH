import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useAuth } from "./AuthContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={user?.preferences.theme}
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
