import "./style.css";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  nodes,
  links,
  GROUP_COLORS,
  GROUP_LABELS,
  type GraphNode,
  type GraphLink,
  type Group,
  type NodeType,
} from "./data.ts";

// ── Visual scale per node type ──────────────────────────────────────────────
const SIZE: Record<NodeType, number> = {
  person: 11,
  venture: 7.5,
  thread: 6,
  format: 5,
  client: 3.4,
  sponsor: 3.4,
  partner: 3.6,
  initiative: 3.6,
  audience: 4.2,
};

const LABEL_TYPES: Set<NodeType> = new Set(["person", "venture", "thread", "format", "audience"]);

function geometryFor(type: NodeType, r: number): THREE.BufferGeometry {
  switch (type) {
    case "person":
      return new THREE.IcosahedronGeometry(r, 1);
    case "venture":
      return new THREE.SphereGeometry(r, 32, 32);
    case "thread":
      return new THREE.TorusGeometry(r * 0.8, r * 0.32, 16, 40);
    case "format":
      return new THREE.OctahedronGeometry(r, 0);
    case "partner":
      return new THREE.DodecahedronGeometry(r, 0);
    case "sponsor":
      return new THREE.BoxGeometry(r * 1.5, r * 1.5, r * 1.5);
    case "client":
      return new THREE.ConeGeometry(r, r * 1.8, 5);
    case "initiative":
      return new THREE.TetrahedronGeometry(r * 1.3, 0);
    case "audience":
      return new THREE.SphereGeometry(r, 24, 24);
  }
}

// A floating text label as a canvas sprite.
function makeLabel(text: string, color: string): THREE.Sprite {
  const pad = 8;
  const font = 26;
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `600 ${font}px "Space Grotesk", sans-serif`;
  const w = Math.ceil(measure.measureText(text).width) + pad * 2;
  const h = font + pad * 2;

  const canvas = document.createElement("canvas");
  const dpr = 2;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.font = `600 ${font}px "Space Grotesk", sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillText(text, pad, h / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  const scale = 0.16;
  sprite.scale.set(w * scale, h * scale, 1);
  return sprite;
}

function lighten(hex: string, amt: number): string {
  const c = new THREE.Color(hex);
  c.lerp(new THREE.Color("#ffffff"), amt);
  return `#${c.getHexString()}`;
}

// ── Adjacency (for the panel's connection list + hover highlight) ───────────
const byId = new Map(nodes.map((n) => [n.id, n]));
const neighbors = new Map<string, Array<{ node: GraphNode; kind: string }>>();
nodes.forEach((n) => neighbors.set(n.id, []));
for (const l of links) {
  neighbors.get(l.source)?.push({ node: byId.get(l.target)!, kind: l.kind });
  neighbors.get(l.target)?.push({ node: byId.get(l.source)!, kind: l.kind });
}

const RELATION_VERB: Record<GraphLink["kind"], string> = {
  role: "role",
  flagship: "flagship",
  venue: "venue",
  pipeline: "pipeline",
  partner: "partner",
  sponsor: "sponsor",
  client: "client",
  "track-record": "track record",
  audience: "audience",
  amplifies: "amplifies",
};

// ── Build the graph ─────────────────────────────────────────────────────────
const el = document.getElementById("graph")!;

const Graph = new ForceGraph3D(el)
  .backgroundColor("#05060a")
  .showNavInfo(false)
  .nodeRelSize(1)
  .graphData({
    nodes: nodes.map((n) => ({ ...n })),
    links: links.map((l) => ({ ...l })),
  })
  .nodeThreeObject((node: any) => {
    const n = node as GraphNode;
    const color = GROUP_COLORS[n.group];
    const r = SIZE[n.type];
    const group = new THREE.Group();

    const mesh = new THREE.Mesh(
      geometryFor(n.type, r),
      new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: n.type === "person" ? 1.1 : 0.75,
        roughness: 0.35,
        metalness: 0.1,
        transparent: n.type === "audience",
        opacity: n.type === "audience" ? 0.78 : 1,
      }),
    );
    group.add(mesh);

    if (LABEL_TYPES.has(n.type)) {
      const label = makeLabel(n.label, lighten(color, 0.55));
      label.position.set(0, r + 6, 0);
      group.add(label);
    }
    return group;
  })
  .nodeLabel((node: any) => {
    const n = node as GraphNode;
    return `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#cfd4e3">${n.label}${
      n.kicker ? ` · <span style="color:#8b93a7">${n.kicker}</span>` : ""
    }</div>`;
  })
  .linkColor((l: any) => {
    const src = typeof l.source === "object" ? l.source : byId.get(l.source);
    return lighten(GROUP_COLORS[(src as GraphNode).group], 0.1);
  })
  .linkOpacity(0.28)
  .linkWidth((l: any) => (l.kind === "role" || l.kind === "flagship" || l.kind === "pipeline" ? 0.7 : 0.35))
  .linkDirectionalParticles((l: any) => (l.kind === "pipeline" || l.kind === "venue" ? 3 : 1))
  .linkDirectionalParticleWidth(1.6)
  .linkDirectionalParticleSpeed(0.006)
  .linkDirectionalParticleColor((l: any) => {
    const src = typeof l.source === "object" ? l.source : byId.get(l.source);
    return lighten(GROUP_COLORS[(src as GraphNode).group], 0.35);
  })
  .onNodeClick((node: any) => focusNode(node as GraphNode))
  .onBackgroundClick(() => closePanel());

// Force tuning — give the hub room to breathe.
Graph.d3Force("charge")?.strength(-190);
const linkForce = Graph.d3Force("link") as any;
linkForce?.distance((l: any) => {
  if (l.kind === "role") return 95;
  if (l.kind === "amplifies") return 130;
  return 55;
});

// Bloom for the sci-fi glow.
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.1, 0.7, 0.05);
Graph.postProcessingComposer().addPass(bloom);

// Gentle ambient + the renderer's default lights keep emissive materials readable.
Graph.scene().add(new THREE.AmbientLight(0xffffff, 0.35));

// Slow auto-rotate until the user interacts.
let autoRotate = true;
const controls = Graph.controls() as any;
controls.addEventListener("start", () => (autoRotate = false));
(function spin() {
  if (autoRotate) {
    const t = Date.now() * 0.00006;
    const dist = 320;
    Graph.cameraPosition({ x: dist * Math.sin(t), z: dist * Math.cos(t) });
  }
  requestAnimationFrame(spin);
})();

// Initial framing.
setTimeout(() => Graph.zoomToFit(800, 80), 600);

// ── Camera focus on a node ──────────────────────────────────────────────────
function focusNode(n: GraphNode) {
  autoRotate = false;
  const node = (Graph.graphData().nodes as any[]).find((x) => x.id === n.id);
  if (!node) return;
  const dist = 90;
  const ratio = 1 + dist / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
  Graph.cameraPosition(
    { x: (node.x || 0) * ratio, y: (node.y || 0) * ratio, z: (node.z || 0) * ratio },
    node,
    900,
  );
  openPanel(n);
}

// ── Side panel ──────────────────────────────────────────────────────────────
const panel = document.getElementById("panel")!;
const panelBody = document.getElementById("panel-body")!;
document.getElementById("panel-close")!.addEventListener("click", closePanel);

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function openPanel(n: GraphNode) {
  const color = GROUP_COLORS[n.group];
  const conns = (neighbors.get(n.id) || []).slice().sort((a, b) => a.node.label.localeCompare(b.node.label));

  panelBody.innerHTML = `
    <div class="p-eyebrow" style="color:${color}">
      <span class="p-dot" style="background:${color}"></span>${esc(GROUP_LABELS[n.group])}
    </div>
    <h1 class="p-title">${esc(n.label)}</h1>
    ${n.kicker ? `<p class="p-kicker">${esc(n.kicker)}</p>` : ""}
    ${n.blurb ? `<p class="p-blurb">${esc(n.blurb)}</p>` : ""}
    ${
      n.facts && n.facts.length
        ? `<ul class="p-facts" style="color:${color}">${n.facts
            .map((f) => `<li><span style="color:#d6dae8">${esc(f)}</span></li>`)
            .join("")}</ul>`
        : ""
    }
    ${n.url ? `<a class="p-url" href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.url)} ↗</a>` : ""}
    ${
      conns.length
        ? `<div class="p-section-label">Connected to</div>
           <div class="p-links">${conns
             .map(
               (c) => `<button class="p-link" data-id="${c.node.id}">
                 <span class="dot" style="background:${GROUP_COLORS[c.node.group]}"></span>
                 ${esc(c.node.label)}
                 <span class="rel">${esc(RELATION_VERB[c.kind as GraphLink["kind"]] || c.kind)}</span>
               </button>`,
             )
             .join("")}</div>`
        : ""
    }
  `;

  panelBody.querySelectorAll<HTMLButtonElement>(".p-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = byId.get(btn.dataset.id!);
      if (target) focusNode(target);
    });
  });

  panel.classList.remove("hidden");
}

function closePanel() {
  panel.classList.add("hidden");
}

// ── Legend (also acts as a colour key per venture) ──────────────────────────
const legend = document.getElementById("legend")!;
const groupsInOrder: Group[] = ["person", "seven-events", "hrmano", "commons-hub", "civic", "content", "tech"];
legend.innerHTML =
  `<div class="legend-title">Ventures & threads</div>` +
  groupsInOrder
    .map((g) => {
      const color = GROUP_COLORS[g];
      const root = nodes.find((n) => n.group === g && (n.type === "venture" || n.type === "thread" || n.type === "person"));
      return `<div class="legend-row" data-id="${root?.id ?? ""}" style="color:${color}">
        <span class="legend-swatch" style="background:${color}"></span>
        <span style="color:#cfd4e3">${esc(GROUP_LABELS[g])}</span>
      </div>`;
    })
    .join("");

legend.querySelectorAll<HTMLDivElement>(".legend-row").forEach((row) => {
  row.addEventListener("click", () => {
    const node = byId.get(row.dataset.id!);
    if (node) focusNode(node);
  });
});

// ── Controls ────────────────────────────────────────────────────────────────
document.getElementById("reset-view")!.addEventListener("click", () => {
  closePanel();
  autoRotate = false;
  Graph.zoomToFit(800, 80);
});

// Keep the renderer + bloom sized to the window.
window.addEventListener("resize", () => {
  Graph.width(window.innerWidth).height(window.innerHeight);
  bloom.setSize(window.innerWidth, window.innerHeight);
});
Graph.width(window.innerWidth).height(window.innerHeight);
