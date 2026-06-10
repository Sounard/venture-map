import { defineConfig } from "vite";

// Served at https://cedric.sounard.net/venture-map/ — assets live under that path.
export default defineConfig({
  base: "/venture-map/",
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 1600, // three.js is large; this is expected, not a problem
  },
});
