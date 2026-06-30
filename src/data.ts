/**
 * The venture map of Cédric Sounard.
 *
 * One person, many threads. This file is the single source of truth for the
 * graph: every node is an entity in Cédric's world, every link a real
 * relationship between them. The renderer (main.ts) is deliberately dumb — all
 * the meaning lives here.
 *
 * Colour is driven by three core activities — EDUCATION · EVENTS · TECH.
 * Each node carries a weight across those pillars and the renderer blends them,
 * so a node that's purely tech reads blue, a kids-coding event reads green, and
 * the hackathons (all three) sit in the middle. Nodes with no pillars (partners,
 * clients, the community) render neutral — they're the people and orgs Cédric
 * connects to, not the activities themselves.
 */

export type Pillar = "education" | "events" | "tech";

export const PILLAR_COLORS: Record<Pillar, string> = {
  education: "#2dd4bf", // teal-green
  events: "#fb7185", // rose
  tech: "#60a5fa", // sky blue
};

export const PILLAR_LABELS: Record<Pillar, string> = {
  education: "Education",
  events: "Events",
  tech: "Tech",
};

/** Colour for nodes that aren't activities (partners, clients, community). */
export const NEUTRAL_COLOR = "#9aa6c2";

/** Colour for the people layer — the humans Cédric builds with. */
export const PEOPLE_COLOR = "#e8b06a";

export type PillarWeights = Partial<Record<Pillar, number>>;

export type NodeType =
  | "person" // Cédric himself — the connecting node
  | "venture" // a thing he builds / operates
  | "thread" // cross-cutting concern
  | "format" // a marquee programme (hackathons, the summit, a campaign)
  | "event" // a specific past hackathon / edition
  | "partner" // partner org / collaborator / sponsor (all one level)
  | "client" // an organisation that buys events
  | "initiative" // a civic engagement / track-record item
  | "audience" // a community he reaches
  | "collaborator"; // a person Cédric builds with

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  /** Mix across the three core activities; absent ⇒ neutral colour. */
  pillars?: PillarWeights;
  /** Size multiplier on top of the type's base size. */
  prominence?: number;
  /** Past vs present — past nodes render dimmed & smaller so "now" stands out. Default present. */
  era?: "present" | "past";
  /** Force a permanent floating label even when the type wouldn't get one. */
  showLabel?: boolean;
  kicker?: string;
  blurb?: string;
  facts?: string[];
  url?: string;
  /** Free-form attributes (city, theme, org) — powers link discovery & JSON-LD. */
  tags?: string[];
}

export type LinkKind =
  | "role" // Cédric -> venture/thread
  | "team" // a person on a venture / programme team
  | "flagship" // venture -> its headline programme
  | "event" // programme -> a specific edition
  | "venue" // hosted at a place
  | "pipeline" // feeds another venture
  | "group" // sibling/parent company within a holding
  | "partner" // partner / sponsor of
  | "sponsor" // headline / main sponsor of
  | "client" // buys from
  | "track-record" // civic engagement evidence
  | "community" // ties into the founder community
  | "audience"; // reaches a market

export interface GraphLink {
  source: string;
  target: string;
  kind: LinkKind;
  label?: string;
  /** If set, the link is hidden until the node with this id is hovered. */
  reveal?: string;
}

export const nodes: GraphNode[] = [
  // ── The connecting node ───────────────────────────────────────────────
  {
    id: "cedric",
    label: "Cédric Sounard",
    type: "person",
    pillars: { education: 1, events: 1, tech: 1 },
    prominence: 1.25,
    kicker: "Your Most Extroverted Geek",
    blurb:
      "Philosopher by training, AI-startup founder, operator and connector. The less-technical one — strengths are sales, events, partnerships, people and taste. Works where his three core activities meet: education, events and tech.",
    facts: ["Brussels", "Founder · operator · connector", "200+ events/year"],
  },

  // ── Ventures ──────────────────────────────────────────────────────────
  {
    id: "seven-events",
    label: "Seven Events",
    type: "venture",
    pillars: { events: 1, tech: 0.3, education: 0.15 },
    prominence: 1.25,
    era: "present",
    kicker: "Cofounder · BD & clients",
    blurb:
      "Brussels-based event agency co-founded by Cédric with Jérôme Leclanche and Sona Stepanjan — high-impact business forums and tech summits, premium positioning. Cédric runs BD and client relationships. Flagship: the AI in Defence Summit, with more AI summits incoming.",
    facts: [
      "Incorporated April 2026 · first event Feb 2026",
      "Cofounders: Sona Stepanjan (CEO, ex-EEAS) · Jérôme Leclanche (CTO/CFO, €10M+ exit)",
      "Flagship: AI in Defence Summit",
      "More AI summits incoming",
    ],
  },
  {
    id: "hrmano",
    label: "HRMano",
    type: "venture",
    pillars: { tech: 1, education: 0.35 },
    prominence: 1.1,
    era: "present",
    kicker: "GTM Associate",
    blurb:
      "hrmano.com — a social secretariat and remuneration cockpit for early-stage entrepreneurs in Belgium. Gives incorporated freelancers a clear view of what they earn and pay in tax, without an expensive social secretariat. Pre-launch (waitlist / early access).",
    facts: [
      "GTM Associate",
      "Pre-launch · early-access waitlist",
      "Built for young (serial) founders",
      "Speaking to peers, not strangers",
    ],
    url: "https://hrmano.com",
  },
  {
    id: "triscale",
    label: "Triscale.co",
    type: "venture",
    pillars: { tech: 0.8, events: 0.3, education: 0.2 },
    prominence: 0.9,
    era: "present",
    kicker: "GTM advisory · new",
    blurb:
      "Triscale.co — AI-leveraged, fractional GTM advisory for startups, run with Thibault Le Meur. The ICP-finder tool is the lead magnet — the wedge that earns the advisory conversation. A second GTM thread alongside HRMano, serving the Belgian founder ecosystem.",
    facts: ["New", "AI-leveraged GTM advisory (with Thibault Le Meur)", "ICP-finder tool = lead magnet", "Startup founders, Belgium first"],
    url: "https://triscale.co",
  },
  {
    id: "commons-hub",
    label: "Commons Hub Brussels",
    type: "venture",
    pillars: { events: 1, education: 0.5, tech: 0.4 },
    prominence: 1.2,
    era: "present",
    kicker: "Cofounder & board member",
    blurb:
      "A collaborative space near Brussels Central run as a commons: shared governance, a dual economy (euros + CHT tokens), and a community of community builders. A solarpunk place of experimentation and an incubator for communities — and the natural physical home for many of Cédric's events.",
    facts: [
      "Cofounder since 2024 · board member since 2026",
      "100 members · 5,000 visitors / year",
      "Dual economy: euros + CHT tokens",
      "Rooms for 10–80 · coworking · events",
      "Solarpunk commons & community incubator",
    ],
  },
  {
    id: "civic",
    label: "Civic / Democracy",
    type: "venture",
    pillars: { education: 1, events: 0.4, tech: 0.3 },
    kicker: 'The long game · "Civic Engine"',
    blurb:
      "Thought leadership and public-life work — building reputation capital and a coherent body of work over the long term. Core thesis: modern democracy runs on absurdly low bandwidth, and we can now let citizens participate far more granularly on the topics where they have genuine skin in the game.",
    facts: ["Substance over virality", "Thesis: democracy's low bandwidth", "Lived track record, not commentary"],
  },

  // ── Cross-cutting thread ────────────────────────────────────────────────
  {
    id: "tech-setup",
    label: "Tech setup",
    type: "thread",
    pillars: { tech: 1, education: 0.25 },
    kicker: 'Cross-cutting thread · "the Harness"',
    blurb:
      "The software / AI / hardware stack and the sparring thread on what setup to use. Wants the bleeding edge of AI working for him without becoming a full-time tinkerer: high-leverage tools, open-source / free tiers a plus, fewer well-integrated tools over many.",
    facts: ["High-leverage > hype", "Google Suite · Claude", "Open-source / free tiers a plus"],
  },

  // ── Marquee programmes ──────────────────────────────────────────────────
  {
    id: "hackathons",
    label: "Hackathons",
    type: "format",
    pillars: { education: 1, events: 1, tech: 1 },
    prominence: 1.3,
    kicker: "Flagship format · current focus",
    blurb:
      "The most common events Cédric runs and his current operating focus — where education, events and tech all meet. Their own playbook, voice and partner network. Frequently co-hosted at Commons Hub Brussels and a direct feeder for the Belgian founder community.",
    facts: [
      "10 hackathons delivered",
      "Education × Events × Tech",
      "Sponsors: Stripe · Collibra · Ville de Bruxelles",
      "Usually at Commons Hub",
    ],
  },
  {
    id: "ai-defence-summit",
    label: "AI in Defence Summit",
    type: "format",
    pillars: { events: 1, tech: 0.85, education: 0.25 },
    prominence: 1.15,
    kicker: "Cédric — Chief of Staff",
    blurb:
      "The flagship of Seven Events and a summit at the intersection of AI and defence. 620 approved delegates from 1,000 registrations — including NATO, six national Ministries of Defence, EU Defence Commissioner Andrius Kubilius, Oracle, Thales and Axelera. Cédric serves as Chief of Staff.",
    facts: [
      "1,000 registrations · 620 approved delegates",
      "NATO · 6 Ministries of Defence · Commissioner Kubilius",
      "Delegates incl. Oracle · Thales · Axelera",
      "Chief of Staff: Cédric",
    ],
    url: "https://aidefencesummit.eu",
  },
  {
    id: "stripe-community-builder",
    label: "Stripe Community Builder",
    type: "format",
    pillars: { tech: 1, events: 0.7, education: 0.3 },
    kicker: "Recognised programme",
    blurb:
      "Stripe Community Builder — convening Belgian founders and builders around Stripe. Ties together the hackathons, Seven Events and the founder community.",
    facts: ["Builder since Oct 2025", "3 meetups · 3 hackathons"],
  },
  {
    id: "spreds",
    label: "Spreds campaign",
    type: "format",
    pillars: { tech: 0.8, events: 0.3, education: 0.1 },
    kicker: "Live now · equity crowdfunding",
    blurb:
      "Equity campaign on Spreds to fund the HRMano launch. Belgian tax shelter — investors deduct 45% of the amount on their next tax return, and the stake grows with hrmano.",
    facts: [
      "Round: €25k–€190k",
      "Pre-money: €1.8M",
      "45% tax deduction (Belgian tax shelter)",
      "Funds the HRMano launch",
    ],
    url: "https://www.spreds.com/fr/compartments/10909-hrmano",
  },

  // ── Past hackathons ─────────────────────────────────────────────────────
  {
    id: "hk-stripe",
    label: "Stripe Hackathons",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.35 },
    kicker: "with Stripe",
    blurb: "Recurring Stripe-backed hackathons — co-hosted across Commons Hub and Seven Events.",
  },
  {
    id: "hk-kids",
    label: "Kids AI Coding",
    type: "event",
    pillars: { education: 1, events: 0.6, tech: 0.5 },
    era: "past",
    kicker: "Education-first hackathon",
    blurb:
      "Teaching kids to build with AI — with Lovable, Rosebud.ai and Hugging Face. 102 kids across 8 locations in 6 cities, on a shoestring €1k budget (including a professional aftermovie). The team dreamed bigger and doubled the location count from four.",
    facts: [
      "102 kids · 8 locations · 6 cities",
      "Doubled locations: 4 → 8",
      "Shoestring €1k budget (incl. aftermovie)",
      "Past edition",
    ],
  },
  {
    id: "hk-media",
    label: "Decentralised European Media Hackathon",
    type: "event",
    pillars: { education: 0.7, events: 0.7, tech: 0.9 },
    kicker: "Civic-tech hackathon",
    blurb:
      "Building tools for a healthier, decentralised European media landscape — a hackathon with a civic mission. A multi-sector, multi-generation room: senior policy and media figures building alongside students vibe-coding, with the sponsor in the mix.",
    facts: ["40 participants", "Multi-sector · multi-generation", "Senior policy & media + students"],
  },
  {
    id: "hk-energy",
    label: "Energy Data Visualisation Hackathon",
    type: "event",
    pillars: { tech: 1, education: 0.5, events: 0.6 },
    kicker: "Data-viz hackathon",
    blurb: "Making energy data legible and actionable through visualisation.",
    facts: ["8 teams · 6 pitched"],
  },
  {
    id: "hk-collibra",
    label: "Agentic Commerce & E-invoicing Hackathon",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.2 },
    kicker: "with Collibra & Stripe · upcoming",
    blurb:
      "Agentic commerce and e-invoicing, with Collibra and Stripe. Run through Seven Events. Next edition: Saturday 27 June 2026.",
    facts: ["Upcoming · Sat 27 June 2026", "with Collibra & Stripe", "via Seven Events"],
    url: "https://luma.com/t0vqp8cc",
  },

  // ── Partners / sponsors (all one level) ─────────────────────────────────
  { id: "stripe", label: "Stripe", type: "partner", kicker: "Partner" },
  { id: "collibra", label: "Collibra", type: "partner", kicker: "Partner" },
  { id: "bxl-ville", label: "BXL Ville · de Stad", type: "partner", kicker: "City of Brussels — main sponsor" },
  { id: "sibelga", label: "Sibelga", type: "partner", kicker: "Partner" },
  { id: "lovable", label: "Lovable", type: "partner", kicker: "Partner — Kids AI Coding" },
  { id: "rosebud", label: "Rosebud.ai", type: "partner", kicker: "Partner — Kids AI Coding" },
  { id: "huggingface", label: "Hugging Face", type: "partner", kicker: "Partner — Kids AI Coding" },

  // Commons Hub partner communities
  { id: "beimpact", label: "BeImpact", type: "partner", kicker: "Commons Hub community" },
  { id: "dao-brussels", label: "DAO.brussels", type: "partner", kicker: "Commons Hub community" },
  { id: "regens-unite", label: "Regens Unite", type: "partner", kicker: "Commons Hub community" },
  { id: "open-collective", label: "Open Collective", type: "partner", kicker: "Commons Hub community" },
  { id: "rebel-studio", label: "Rebel Studio", type: "partner", kicker: "Commons Hub community" },
  {
    id: "founders-running-club",
    label: "Founders Running Club",
    type: "partner",
    showLabel: true,
    kicker: "Brussels chapter — cofounder",
    blurb:
      "Founders Running Club, Brussels chapter — cofounded by Cédric. Where the founder community runs together, every Saturday at 9:30.",
    facts: ["Created Nov 2025", "Weekly · Saturday 9:30", "130 in the group · ~12 run each week"],
  },
  { id: "contentors", label: "Contentors", type: "partner", kicker: "Commons Hub community" },
  { id: "open-source-village", label: "Open Source Village", type: "partner", kicker: "Commons Hub community" },

  // ── Kids AI Coding partners (names on hover; links revealed on hover) ────
  {
    id: "north-star",
    label: "North Star AGI",
    type: "venture",
    pillars: { tech: 1, education: 0.5, events: 0.4 },
    prominence: 0.85,
    era: "past",
    kicker: "Past role · Chief of Relations + Events (2025)",
    blurb:
      "North Star AGI — making Europe the place to build in AI & robotics. Cédric was Chief of Relations + Events (Aug–Dec 2025): partnerships with Stripe, Lovable, Ingram.tech and Hugging Face, and co-led the country's most active kids' AI-coding hackathon.",
    facts: [
      "Chief of Relations + Events (2025)",
      "Partnerships: Stripe · Lovable · Ingram.tech · Hugging Face",
      "Co-led kids' AI-coding hackathon (8 venues, 6 cities)",
    ],
  },
  { id: "watbeta", label: "WATbeta", type: "partner", kicker: "In-kind partner · innovative location" },
  { id: "wintercircus", label: "Wintercircus", type: "partner", kicker: "In-kind partner · innovative location" },
  { id: "e6k", label: "E6K Charleroi", type: "partner", kicker: "In-kind partner · innovative location" },
  { id: "grand-poste", label: "La Grand Poste Liège", type: "partner", kicker: "In-kind partner · innovative location" },
  { id: "the-beacon", label: "The Beacon Antwerp", type: "partner", kicker: "In-kind partner · innovative location" },
  { id: "young-engineers", label: "Young Engineers Liège", type: "partner", kicker: "Partner" },
  { id: "nerdlab", label: "Nerdlab", type: "partner", kicker: "Partner" },

  // ── Seven Events clients & community ────────────────────────────────────
  { id: "vcs-corporates", label: "VCs & corporates", type: "client", kicker: "Clients — forums & summits" },
  { id: "agoria", label: "Agoria", type: "partner", kicker: "Community member" },

  // ── The community at the centre of it all ───────────────────────────────
  {
    id: "founder-community",
    label: "Belgian founders",
    type: "audience",
    prominence: 1.7,
    kicker: "The community at the centre",
    blurb:
      "Young (serial) founders across Belgium — the community Cédric is part of and builds for. Hackathons, HRMano, the Stripe Community Builder programme and Commons Hub all orbit it. He plays connective tissue across the ecosystem — from Wintercircus in Ghent to WAT, Betacowork, BeCentral, Pulse Foundation and Commons Hub, along a North-West to South-East axis. He isn't selling to strangers; he's one of them, talking to peers.",
    facts: [
      "Warm across 30+ incubators, communities & coworkings",
      "Wintercircus · WAT · Betacowork · BeCentral · Pulse · Commons Hub",
      "Connective tissue · NW–SE axis",
      "Peers, not prospects",
    ],
  },

  // ── Civic track record ──────────────────────────────────────────────────
  {
    id: "assemblee-citoyenne",
    label: "Assemblée Citoyenne (Food)",
    type: "initiative",
    pillars: { education: 1, events: 0.3 },
    kicker: "Burgerraad voor het klimaat · cycle 2",
    blurb:
      "Citizens' assembly on Food (Burgerraad voor het klimaat, cycle 2): 70 citizens, 33 initiatives. Cédric led initiatives on food waste and data, and sits on the 7-person follow-up committee tracking implementation with the minister's cabinet. Concretely, he coordinated saving 1+ metric tonne of food by matching event catering with local associations (with VBO-FEB and Commons Hub).",
    facts: [
      "70 citizens · 33 initiatives",
      "Led food-waste & data initiatives",
      "Comité de suivi (7) — with minister's cabinet",
      "Coordinated 1+ tonne of food saved",
    ],
  },

  // ── People — the humans Cédric builds with ──────────────────────────────
  {
    id: "p-sona",
    label: "Sona Stepanjan",
    type: "collaborator",
    showLabel: true,
    kicker: "Seven Events — CEO & cofounder",
    blurb:
      "CEO and cofounder of Seven Events. 10 years in high-level events — ex-EEAS, working with European ambassadors across Asia (South Korea) and the Universal Exposition in Osaka, Japan.",
  },
  {
    id: "p-jerome",
    label: "Jérôme Leclanche",
    type: "collaborator",
    showLabel: true,
    kicker: "Seven Events — cofounder, CTO/CFO",
    blurb: "Entrepreneur and operator; a €10M+ exit under his belt. Cofounder, CTO/CFO of Seven Events.",
  },
  // Commons Hub board — names surface on hovering the hub
  { id: "p-xavier-damman", label: "Xavier Damman", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-leen-schelfout", label: "Leen Schelfout", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-inge-williams", label: "Inge Williams", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-mathieu-hanquin", label: "Mathieu Hanquin", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-friedger-muffke", label: "Friedger Müffke", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-miriam-dean", label: "Miriam Dean", type: "collaborator", kicker: "Commons Hub — board" },
  // HRMano cofounders — names surface on hovering HRMano
  { id: "p-salvatore", label: "Salvatore", type: "collaborator", kicker: "HRMano — cofounder" },
  { id: "p-alexandre", label: "Alexandre", type: "collaborator", kicker: "HRMano — cofounder" },
  { id: "p-thibault", label: "Thibault Le Meur", type: "collaborator", kicker: "Triscale — GTM advisory partner" },
  // AI in Defence Summit team — names surface on hovering the summit
  { id: "p-giulia", label: "Giulia", type: "collaborator", kicker: "AI in Defence Summit — Partnerships" },
  { id: "p-julia", label: "Julia", type: "collaborator", kicker: "AI in Defence Summit — Marketing" },

  // ── The Seven Seed ecosystem (Jérôme's umbrella) ────────────────────────
  {
    id: "seven-seed-group",
    label: "Seven Seed Group",
    type: "partner",
    prominence: 1.1,
    kicker: "Jérôme's umbrella · incubator",
    blurb:
      "Brussels umbrella behind Seven Capital, Seven Camp and Seven Events. Seven Seed itself is an incubator helping foreign founders land and build in Europe — the bridge into the Belgian founder ecosystem.",
    tags: ["brussels", "founders", "incubator", "seven"],
  },
  {
    id: "seven-capital",
    label: "Seven Capital",
    type: "partner",
    kicker: "Defence & dual-use VC",
    blurb:
      "Brussels VC backing dual-use and defence tech (AI, autonomous systems, drones, cybersecurity) to re-arm Europe with innovation. Organiser-partner of the AI in Defence Summit. Managing partners include Jérôme Leclanche.",
    tags: ["brussels", "defence", "ai", "vc", "seven"],
  },
  {
    id: "seven-camp",
    label: "Seven Camp",
    type: "partner",
    kicker: "Defence & dual-use accelerator",
    blurb:
      "Seven Capital's Brussels accelerator for defence and dual-use startups — cohorts with networking, grant/funding access and go-to-market support. Tied to the AI in Defence Summit.",
    tags: ["brussels", "defence", "accelerator", "seven"],
  },

  // ── AI in Defence Summit — partners & speakers (reveal on the summit) ────
  {
    id: "ingram",
    label: "Ingram Technologies",
    type: "partner",
    kicker: "AI R&D lab · Summit partner",
    blurb:
      "Brussels EU-based AI R&D lab building production-ready, security-first AI systems (custom agents, LLM workflows) with GDPR / EU AI Act baked in. Partner of the AI in Defence Summit; gave the opening research talk at its AI-in-Cybersec evening.",
    tags: ["brussels", "ai", "defence", "stripe"],
  },
  { id: "oracle", label: "Oracle", type: "partner", kicker: "Summit speaker / delegate" },
  { id: "sap", label: "SAP", type: "partner", kicker: "Summit partner" },
  { id: "pwc", label: "PwC", type: "partner", kicker: "Summit partner" },
  { id: "baker-mckenzie", label: "Baker McKenzie", type: "partner", kicker: "Summit partner" },
  { id: "indra", label: "Indra", type: "partner", kicker: "Summit partner" },
  { id: "defender", label: "Defender", type: "partner", kicker: "Summit media partner" },
  { id: "axelera", label: "Axelera", type: "partner", kicker: "Summit partner · AI chips" },

  // Seven ecosystem people
  { id: "p-pierre-elie", label: "Pierre-Elie Mathijs", type: "collaborator", kicker: "Seven Capital & Seven Camp" },
  { id: "p-andriy", label: "Andriy Kolodyuk", type: "collaborator", kicker: "Seven Capital & Seven Camp — managing partner" },
  // Triscale cofounder
  { id: "p-thibault", label: "Thibault Le Meur", type: "collaborator", kicker: "Triscale — cofounder" },
  // AI in Defence Summit speakers
  { id: "p-theo-francken", label: "Theo Francken", type: "collaborator", kicker: "Belgian Defence Minister · Summit speaker" },
  { id: "p-kubilius", label: "Andrius Kubilius", type: "collaborator", kicker: "EU Defence Commissioner · Summit speaker" },
  { id: "p-michael-oracle", label: "Michael Galkovsky", type: "collaborator", kicker: "Oracle — CTO Defence · Summit speaker" },
];

export const links: GraphLink[] = [
  // Cédric's roles — the spokes of the wheel
  { source: "cedric", target: "seven-events", kind: "role", label: "Cofounder · BD & clients" },
  { source: "cedric", target: "hrmano", kind: "role", label: "GTM Associate" },
  { source: "cedric", target: "triscale", kind: "role", label: "GTM advisory" },
  { source: "cedric", target: "commons-hub", kind: "role", label: "Cofounder & board" },
  { source: "cedric", target: "civic", kind: "role", label: "Author / voice" },
  { source: "cedric", target: "tech-setup", kind: "role", label: "Operator" },
  { source: "cedric", target: "stripe-community-builder", kind: "role", label: "Stripe Community Builder" },
  { source: "cedric", target: "north-star", kind: "role", label: "Chief of Relations + Events (past)" },

  // Seven Events
  { source: "seven-events", target: "hackathons", kind: "flagship", label: "Flagship format" },
  { source: "seven-events", target: "ai-defence-summit", kind: "event", label: "Chief of Staff: Cédric" },
  { source: "seven-events", target: "vcs-corporates", kind: "client" },
  { source: "seven-events", target: "stripe", kind: "community", label: "Community member" },
  { source: "seven-events", target: "agoria", kind: "community", label: "Community member" },
  { source: "agoria", target: "ai-defence-summit", kind: "partner", label: "Partner" },

  // Hackathons → the editions
  { source: "hackathons", target: "hk-stripe", kind: "event" },
  { source: "hackathons", target: "hk-kids", kind: "event" },
  { source: "hackathons", target: "hk-media", kind: "event" },
  { source: "hackathons", target: "hk-energy", kind: "event" },
  { source: "hackathons", target: "hk-collibra", kind: "event" },
  { source: "hackathons", target: "commons-hub", kind: "venue", label: "Usually co-hosted at" },
  { source: "hackathons", target: "founder-community", kind: "pipeline", label: "Feeds the community" },

  // Stripe Hackathons — both venues
  { source: "hk-stripe", target: "commons-hub", kind: "venue" },
  { source: "hk-stripe", target: "seven-events", kind: "event" },
  { source: "hk-stripe", target: "stripe", kind: "partner" },
  { source: "hk-stripe", target: "founder-community", kind: "community" },

  // Kids AI Coding — venue + partners, all hidden until the node is hovered
  { source: "north-star", target: "hk-kids", kind: "flagship", label: "Co-led / operated" },
  { source: "hk-kids", target: "commons-hub", kind: "venue", reveal: "hk-kids" },
  { source: "hk-kids", target: "lovable", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "rosebud", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "huggingface", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "watbeta", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "wintercircus", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "e6k", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "grand-poste", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "the-beacon", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "young-engineers", kind: "partner", reveal: "hk-kids" },
  { source: "hk-kids", target: "nerdlab", kind: "partner", reveal: "hk-kids" },

  // Decentralised European Media — Commons Hub + civic
  { source: "hk-media", target: "commons-hub", kind: "venue" },
  { source: "hk-media", target: "civic", kind: "track-record", label: "Civic mission" },

  // Energy Data Visualisation — Commons Hub venue, City of Brussels main sponsor, partners
  { source: "hk-energy", target: "commons-hub", kind: "venue" },
  { source: "hk-energy", target: "bxl-ville", kind: "sponsor", label: "Main sponsor" },
  { source: "hk-energy", target: "collibra", kind: "partner" },
  { source: "hk-energy", target: "lovable", kind: "partner" },
  { source: "hk-energy", target: "sibelga", kind: "partner" },

  // Agentic Commerce & E-invoicing — Seven Events only (NOT Commons Hub)
  { source: "hk-collibra", target: "seven-events", kind: "event" },
  { source: "hk-collibra", target: "collibra", kind: "partner" },
  { source: "hk-collibra", target: "stripe", kind: "partner" },

  // Stripe Community Builder
  { source: "stripe-community-builder", target: "hackathons", kind: "event" },
  { source: "stripe-community-builder", target: "seven-events", kind: "partner" },
  { source: "stripe-community-builder", target: "founder-community", kind: "community" },
  { source: "stripe-community-builder", target: "stripe", kind: "partner" },

  // HRMano
  { source: "hrmano", target: "spreds", kind: "flagship", label: "Live campaign" },
  { source: "hrmano", target: "founder-community", kind: "audience", label: "ICP / waitlist" },
  { source: "triscale", target: "founder-community", kind: "audience", label: "Serves Belgian founders" },
  { source: "triscale", target: "hrmano", kind: "pipeline", label: "Sister GTM thread" },
  { source: "commons-hub", target: "hrmano", kind: "pipeline", label: "Venue network → pipeline" },

  // Commons Hub — community at the centre + civic + partner communities
  { source: "commons-hub", target: "founder-community", kind: "community" },
  { source: "commons-hub", target: "civic", kind: "venue", label: "Venue for democracy events" },
  { source: "commons-hub", target: "beimpact", kind: "partner" },
  { source: "commons-hub", target: "dao-brussels", kind: "partner" },
  { source: "commons-hub", target: "regens-unite", kind: "partner" },
  { source: "commons-hub", target: "open-collective", kind: "partner" },
  { source: "commons-hub", target: "rebel-studio", kind: "partner" },
  { source: "commons-hub", target: "founders-running-club", kind: "partner" },
  { source: "commons-hub", target: "contentors", kind: "partner" },
  { source: "commons-hub", target: "open-source-village", kind: "partner" },
  { source: "founders-running-club", target: "founder-community", kind: "community", label: "Where founders run" },

  // Civic track record
  { source: "civic", target: "assemblee-citoyenne", kind: "track-record" },
  { source: "assemblee-citoyenne", target: "commons-hub", kind: "partner", label: "Food-saving partner" },

  // People — the teams they're part of
  { source: "p-sona", target: "seven-events", kind: "team", label: "CEO & cofounder" },
  { source: "p-jerome", target: "seven-events", kind: "team", label: "Cofounder · CTO/CFO" },
  { source: "p-jerome", target: "hackathons", kind: "team", label: "Co-host" },
  // Commons Hub board — links revealed on hovering the hub
  { source: "p-xavier-damman", target: "commons-hub", kind: "team", label: "Board", reveal: "commons-hub" },
  { source: "p-leen-schelfout", target: "commons-hub", kind: "team", label: "Board", reveal: "commons-hub" },
  { source: "p-inge-williams", target: "commons-hub", kind: "team", label: "Board", reveal: "commons-hub" },
  { source: "p-mathieu-hanquin", target: "commons-hub", kind: "team", label: "Board", reveal: "commons-hub" },
  { source: "p-friedger-muffke", target: "commons-hub", kind: "team", label: "Board", reveal: "commons-hub" },
  { source: "p-miriam-dean", target: "commons-hub", kind: "team", label: "Board", reveal: "commons-hub" },
  // Xavier Damman cofounded Open Collective — connective tissue, shown with the board web
  { source: "p-xavier-damman", target: "open-collective", kind: "team", label: "Cofounder", reveal: "commons-hub" },
  // HRMano cofounders — revealed on hovering HRMano
  { source: "p-salvatore", target: "hrmano", kind: "team", label: "Cofounder", reveal: "hrmano" },
  { source: "p-alexandre", target: "hrmano", kind: "team", label: "Cofounder", reveal: "hrmano" },
  { source: "p-thibault", target: "triscale", kind: "team", label: "GTM advisory partner", reveal: "triscale" },
  // AI in Defence Summit team — revealed on hovering the summit
  { source: "p-giulia", target: "ai-defence-summit", kind: "team", label: "Partnerships", reveal: "ai-defence-summit" },
  { source: "p-julia", target: "ai-defence-summit", kind: "team", label: "Marketing", reveal: "ai-defence-summit" },

  // Seven Seed ecosystem — Jérôme's umbrella; Seven Events sits inside it
  { source: "p-jerome", target: "seven-seed-group", kind: "team", label: "Founder" },
  { source: "seven-seed-group", target: "seven-capital", kind: "group", label: "Group company" },
  { source: "seven-seed-group", target: "seven-camp", kind: "group", label: "Group company" },
  { source: "seven-seed-group", target: "seven-events", kind: "group", label: "Group company" },
  { source: "seven-seed-group", target: "founder-community", kind: "community", label: "Foreign founders → Europe" },
  { source: "seven-capital", target: "ai-defence-summit", kind: "partner", label: "Organiser / partner" },
  { source: "seven-camp", target: "ai-defence-summit", kind: "partner", label: "Related programme" },
  { source: "p-pierre-elie", target: "seven-capital", kind: "team", label: "Partner" },
  { source: "p-pierre-elie", target: "seven-camp", kind: "team", label: "Partner" },
  { source: "p-andriy", target: "seven-capital", kind: "team", label: "Managing partner" },
  { source: "p-andriy", target: "seven-camp", kind: "team", label: "Managing partner" },

  // Triscale cofounder
  { source: "p-thibault", target: "triscale", kind: "team", label: "Cofounder" },

  // Ingram Technologies — Jérôme's company; strong Stripe + AI Defence Summit partner
  { source: "p-jerome", target: "ingram", kind: "team", label: "Founder & CEO" },
  { source: "ingram", target: "ai-defence-summit", kind: "partner", label: "Partner" },
  { source: "ingram", target: "stripe", kind: "partner", label: "Partner" },

  // AI in Defence Summit — partner orgs (revealed on hovering the summit)
  { source: "sap", target: "ai-defence-summit", kind: "partner", reveal: "ai-defence-summit" },
  { source: "pwc", target: "ai-defence-summit", kind: "partner", reveal: "ai-defence-summit" },
  { source: "baker-mckenzie", target: "ai-defence-summit", kind: "partner", reveal: "ai-defence-summit" },
  { source: "indra", target: "ai-defence-summit", kind: "partner", reveal: "ai-defence-summit" },
  { source: "defender", target: "ai-defence-summit", kind: "partner", label: "Media partner", reveal: "ai-defence-summit" },
  { source: "axelera", target: "ai-defence-summit", kind: "partner", reveal: "ai-defence-summit" },
  { source: "oracle", target: "ai-defence-summit", kind: "partner", label: "Delegate / speaker", reveal: "ai-defence-summit" },

  // AI in Defence Summit — speakers (revealed on hovering the summit)
  { source: "p-theo-francken", target: "ai-defence-summit", kind: "team", label: "Speaker", reveal: "ai-defence-summit" },
  { source: "p-kubilius", target: "ai-defence-summit", kind: "team", label: "Speaker", reveal: "ai-defence-summit" },
  { source: "p-michael-oracle", target: "ai-defence-summit", kind: "team", label: "Speaker", reveal: "ai-defence-summit" },
  { source: "p-michael-oracle", target: "oracle", kind: "team", label: "CTO Defence", reveal: "ai-defence-summit" },
  { source: "p-jerome", target: "ai-defence-summit", kind: "team", label: "Speaker", reveal: "ai-defence-summit" },
];
