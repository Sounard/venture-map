import { defineConfig } from "vite";
import { resolve } from "node:path";

// Served at the root of https://cedric.sounard.net/
//   /             → homepage (index.html)
//   /venture-map/ → the 3D map (venture-map/index.html)
export default defineConfig({
  base: "/",
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 1600, // three.js is large; this is expected, not a problem
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        map: resolve(__dirname, "venture-map/index.html"),
      },
    },
  },
});
