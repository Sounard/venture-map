import "./style.css";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  nodes,
  links,
  PILLAR_COLORS,
  PILLAR_LABELS,
  NEUTRAL_COLOR,
  type Pillar,
  type GraphNode,
  type GraphLink,
  type NodeType,
} from "./data.ts";

const PILLARS: Pillar[] = ["education", "events", "tech"];

// ── Colour: blend the three core activities; neutral for orgs/people ────────
function resolveColor(n: GraphNode): string {
  if (!n.pillars) return NEUTRAL_COLOR;
  let r = 0,
    g = 0,
    b = 0,
    tot = 0;
  for (const k of PILLARS) {
    const w = n.pillars[k] ?? 0;
    if (w <= 0) continue;
    const c = new THREE.Color(PILLAR_COLORS[k]);
    r += c.r * w;
    g += c.g * w;
    b += c.b * w;
    tot += w;
  }
  if (tot === 0) return NEUTRAL_COLOR;
  // Blending desaturates toward grey — push saturation back up so the
  // Education/Events/Tech hues stay legible even when a node mixes all three.
  const c = new THREE.Color(r / tot, g / tot, b / tot);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(1, hsl.s * 1.45), Math.min(0.62, hsl.l));
  return `#${c.getHexString()}`;
}

function lighten(hex: string, amt: number): string {
  const c = new THREE.Color(hex);
  c.lerp(new THREE.Color("#ffffff"), amt);
  return `#${c.getHexString()}`;
}

// ── Visual scale + geometry per node type ───────────────────────────────────
const SIZE: Record<NodeType, number> = {
  person: 11,
  venture: 7.5,
  thread: 6,
  format: 5.5,
  event: 4,
  partner: 3.2,
  client: 3.2,
  initiative: 3.6,
  audience: 5,
};

const LABEL_TYPES: Set<NodeType> = new Set(["person", "venture", "thread", "format", "event", "audience", "initiative"]);

const TYPE_LABEL: Record<NodeType, string> = {
  person: "",
  venture: "Venture",
  thread: "Thread",
  format: "Programme",
  event: "Hackathon",
  partner: "Partner",
  client: "Client",
  initiative: "Civic track record",
  audience: "Community",
};

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
    case "event":
      return new THREE.TetrahedronGeometry(r * 1.25, 0);
    case "partner":
      return new THREE.DodecahedronGeometry(r, 0);
    case "client":
      return new THREE.ConeGeometry(r, r * 1.8, 5);
    case "initiative":
      return new THREE.TetrahedronGeometry(r * 1.3, 0);
    case "audience":
      return new THREE.SphereGeometry(r, 28, 28);
  }
}

// Labels are DOM elements (CSS2D), rendered on top of the WebGL canvas AFTER
// the bloom pass — so they stay crisp and never pick up the node glow.
function makeLabel(text: string, color: string): CSS2DObject {
  const div = document.createElement("div");
  div.className = "node-label";
  div.textContent = text;
  div.style.color = color;
  return new CSS2DObject(div);
}

// Eyebrow text: pillar mix for activities, type label for everything else.
function eyebrowText(n: GraphNode): string {
  if (n.pillars) {
    const tags = PILLARS.filter((k) => (n.pillars![k] ?? 0) >= 0.45)
      .sort((a, b) => (n.pillars![b] ?? 0) - (n.pillars![a] ?? 0))
      .map((k) => PILLAR_LABELS[k]);
    if (tags.length) return tags.join(" · ");
  }
  return TYPE_LABEL[n.type] || "";
}

// ── Adjacency (panel's connection list) ─────────────────────────────────────
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
  event: "edition",
  venue: "venue",
  pipeline: "pipeline",
  partner: "partner",
  client: "client",
  "track-record": "track record",
  community: "community",
  audience: "audience",
};

// ── Hover-reveal links (e.g. Kids AI Coding's partner web) ──────────────────
// Links carrying a `reveal` id stay hidden until that node is hovered, then
// linger a couple of seconds so you can move onto a partner to read its name.
let revealNode: string | null = null;
function linkVisible(l: any): boolean {
  const r = l.reveal as string | undefined;
  return !r || r === revealNode;
}

// ── Build the graph ─────────────────────────────────────────────────────────
const el = document.getElementById("graph")!;

// DOM-based labels (immune to the WebGL bloom).
const labelRenderer = new CSS2DRenderer();

const Graph = new ForceGraph3D(el, { extraRenderers: [labelRenderer as any] })
  .backgroundColor("#05060a")
  .showNavInfo(false)
  .nodeRelSize(1)
  .graphData({
    nodes: nodes.map((n) => ({ ...n })),
    links: links.map((l) => ({ ...l })),
  })
  .nodeThreeObject((node: any) => {
    const n = node as GraphNode;
    const color = resolveColor(n);
    const r = SIZE[n.type] * (n.prominence ?? 1);
    const group = new THREE.Group();

    const mesh = new THREE.Mesh(
      geometryFor(n.type, r),
      new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: n.type === "person" ? 0.85 : n.pillars ? 0.6 : 0.4,
        roughness: 0.35,
        metalness: 0.1,
        transparent: !n.pillars,
        opacity: n.pillars ? 1 : 0.82,
      }),
    );
    group.add(mesh);

    if (LABEL_TYPES.has(n.type) || n.showLabel) {
      const label = makeLabel(n.label, lighten(color, 0.4));
      label.position.set(0, r + 7, 0);
      group.add(label);
    }
    return group;
  })
  .nodeLabel((node: any) => {
    const n = node as GraphNode;
    return `<div style="font-family:Inter,sans-serif;font-size:12px;color:#e9ecf5">${n.label}${
      n.kicker ? ` · <span style="color:#8b93a7">${n.kicker}</span>` : ""
    }</div>`;
  })
  .linkColor((l: any) => {
    const src = typeof l.source === "object" ? l.source : byId.get(l.source);
    return lighten(resolveColor(src as GraphNode), 0.1);
  })
  .linkVisibility((l: any) => linkVisible(l))
  .linkOpacity(0.26)
  .linkWidth((l: any) => (l.kind === "role" || l.kind === "flagship" || l.kind === "pipeline" ? 0.7 : 0.35))
  .linkDirectionalParticles((l: any) =>
    l.kind === "pipeline" || l.kind === "community" || l.kind === "venue" ? 3 : 1,
  )
  .linkDirectionalParticleWidth(1.6)
  .linkDirectionalParticleSpeed(0.006)
  .linkDirectionalParticleColor((l: any) => {
    const src = typeof l.source === "object" ? l.source : byId.get(l.source);
    return lighten(resolveColor(src as GraphNode), 0.35);
  })
  .onNodeClick((node: any) => focusNode(node as GraphNode))
  .onBackgroundClick(() => closePanel());

// Force tuning — give the hub room to breathe.
Graph.d3Force("charge")?.strength(-210);
const linkForce = Graph.d3Force("link") as any;
linkForce?.distance((l: any) => {
  if (l.kind === "role") return 90;
  if (l.kind === "client") return 45;
  return 55;
});

// Reveal a node's hidden links on hover; linger so partners stay reachable.
const revealMembers = new Set<string>(["hk-kids"]);
links.forEach((l) => {
  if (l.reveal === "hk-kids") revealMembers.add(l.target);
});
let hideTimer: number | undefined;
function refreshLinks() {
  Graph.linkVisibility((l: any) => linkVisible(l));
}
Graph.onNodeHover((node: any) => {
  const id = node?.id ?? null;
  if (id === "hk-kids") {
    clearTimeout(hideTimer);
    if (revealNode !== "hk-kids") {
      revealNode = "hk-kids";
      refreshLinks();
    }
  } else if (id && revealMembers.has(id)) {
    clearTimeout(hideTimer); // keep the web up while inspecting a partner
  } else if (revealNode) {
    clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      revealNode = null;
      refreshLinks();
    }, 2500);
  }
});

// Bloom for the sci-fi glow.
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.6, 0.16);
Graph.postProcessingComposer().addPass(bloom);
Graph.scene().add(new THREE.AmbientLight(0xffffff, 0.4));

// Slow auto-rotate until the user interacts.
let autoRotate = true;
const controls = Graph.controls() as any;
controls.addEventListener("start", () => (autoRotate = false));
(function spin() {
  if (autoRotate) {
    const t = Date.now() * 0.00006;
    const dist = 360;
    Graph.cameraPosition({ x: dist * Math.sin(t), z: dist * Math.cos(t) });
  }
  requestAnimationFrame(spin);
})();

setTimeout(() => Graph.zoomToFit(800, 90), 600);

// ── Camera focus on a node ──────────────────────────────────────────────────
function focusNode(n: GraphNode) {
  autoRotate = false;
  const node = (Graph.graphData().nodes as any[]).find((x) => x.id === n.id);
  if (!node) return;
  const dist = 100;
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
  const color = resolveColor(n);
  const conns = (neighbors.get(n.id) || []).slice().sort((a, b) => a.node.label.localeCompare(b.node.label));

  panelBody.innerHTML = `
    <div class="p-eyebrow" style="color:${color}">
      <span class="p-dot" style="background:${color}"></span>${esc(eyebrowText(n))}
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
                 <span class="dot" style="background:${resolveColor(c.node)}"></span>
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

// ── Legend — the three core activities (colour blends between them) ─────────
const legend = document.getElementById("legend")!;
legend.innerHTML =
  `<div class="legend-title">Core activities</div>` +
  PILLARS.map(
    (p) => `<div class="legend-row" style="color:${PILLAR_COLORS[p]}">
      <span class="legend-swatch" style="background:${PILLAR_COLORS[p]}"></span>
      <span style="color:#cfd4e3">${esc(PILLAR_LABELS[p])}</span>
    </div>`,
  ).join("") +
  `<div class="legend-note">node colour blends the three</div>
   <div class="legend-row" style="color:${NEUTRAL_COLOR}">
     <span class="legend-swatch" style="background:${NEUTRAL_COLOR};box-shadow:none"></span>
     <span style="color:#cfd4e3">Partners · people</span>
   </div>`;

// ── Controls ────────────────────────────────────────────────────────────────
document.getElementById("reset-view")!.addEventListener("click", () => {
  closePanel();
  autoRotate = false;
  Graph.zoomToFit(800, 90);
});

window.addEventListener("resize", () => {
  Graph.width(window.innerWidth).height(window.innerHeight);
  bloom.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
Graph.width(window.innerWidth).height(window.innerHeight);
