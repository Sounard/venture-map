import { defineConfig } from "vite";

// Served from the apex custom domain (sounard.net), so assets live at the root.
export default defineConfig({
  base: "/",
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 1600, // three.js is large; this is expected, not a problem
  },
});
