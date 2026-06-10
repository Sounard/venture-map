# Cédric Sounard — Venture Map

An interactive 3D knowledge graph of my ventures and how they connect. One person,
many threads: Seven Events, HRMano, Commons Hub Brussels, Civic / Democracy, plus the
cross-cutting Content and Tech threads — and the real relationships between them
(hackathons co-hosted at Commons Hub, the founder community feeding HRMano, civic
track record, and so on).

Built as a glowing force-directed graph in the spirit of
[map.ingram.tech](https://github.com/ingram-technologies/map.ingram.tech/):
Vite + TypeScript + [`3d-force-graph`](https://github.com/vasturiano/3d-force-graph)
+ Three.js with an UnrealBloom pass.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # typecheck + production build to dist/
npm run preview  # serve the build
```

## How it's structured

- **`src/data.ts`** — the single source of truth. Every node is an entity in my world,
  every link a real relationship. A node's `group` sets its colour (sub-entities inherit
  the hue of their venture); its `type` sets geometry and size. Edit this file to change
  the map — the renderer needs no changes.
- **`src/main.ts`** — the renderer: geometries, glow, particle links, camera focus, the
  side panel, and the legend.
- **`src/style.css`** — the UI chrome (masthead, panel, legend).

## Interactions

- Drag to orbit, scroll to zoom (slow auto-rotate until you touch it).
- Click any node — or a legend row — to fly to it and open its detail panel.
- The panel lists everything that node is **connected to**; click through to traverse.
