import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["zaban-lang"],
  },
});
