import { defineConfig } from "vite";

// Served at the root of https://cedric.sounard.net/
export default defineConfig({
  base: "/",
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 1600, // three.js is large; this is expected, not a problem
  },
});
