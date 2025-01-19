import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
// vitest automatically sets NODE_ENV to 'test' when running tests
const isTest = process.env.NODE_ENV === "test";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [!isTest && TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
