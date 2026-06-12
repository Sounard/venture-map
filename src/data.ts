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
  | "audience"; // a community he reaches

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  /** Mix across the three core activities; absent ⇒ neutral colour. */
  pillars?: PillarWeights;
  /** Size multiplier on top of the type's base size. */
  prominence?: number;
  kicker?: string;
  blurb?: string;
  facts?: string[];
  url?: string;
}

export type LinkKind =
  | "role" // Cédric -> venture/thread
  | "flagship" // venture -> its headline programme
  | "event" // programme -> a specific edition
  | "venue" // hosted at a place
  | "pipeline" // feeds another venture
  | "partner" // partner / sponsor of
  | "client" // buys from
  | "track-record" // civic engagement evidence
  | "community" // ties into the founder community
  | "audience"; // reaches a market

export interface GraphLink {
  source: string;
  target: string;
  kind: LinkKind;
  label?: string;
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
    kicker: "Founder",
    blurb:
      "Brussels-based full-service event agency — high-impact business forums, startup summits, demo days, investor and EU institutional events. Premium positioning: high-impact, not budget. Cédric runs BD and client relationships.",
    facts: [
      "Premium, high-impact positioning",
      "Brussels + international (e.g. Albania Forum)",
      "Current focus: hackathons",
    ],
  },
  {
    id: "hrmano",
    label: "HRMano",
    type: "venture",
    pillars: { tech: 1, education: 0.35 },
    kicker: "Go-to-market",
    blurb:
      "hrmano.com — a social secretariat and remuneration cockpit for early-stage entrepreneurs in Belgium. Gives incorporated freelancers a clear view of what they earn and pay in tax, without an expensive social secretariat. Pre-launch (waitlist / early access).",
    facts: [
      "Go-to-market lead",
      "Pre-launch · early-access waitlist",
      "Built for young (serial) founders",
      "Speaking to peers, not strangers",
    ],
    url: "https://hrmano.com",
  },
  {
    id: "commons-hub",
    label: "Commons Hub Brussels",
    type: "venture",
    pillars: { events: 1, education: 0.5, tech: 0.4 },
    prominence: 1.1,
    kicker: "Cofounder & board member",
    blurb:
      "A collaborative space near Brussels Central run as a commons: shared governance, a dual economy (euros + CHT tokens), and a community of community builders. A solarpunk place of experimentation and an incubator for communities — and the natural physical home for many of Cédric's events.",
    facts: [
      "Cofounder & board member since 2026",
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
    facts: ["Education × Events × Tech", "Own playbook & builder voice", "Usually at Commons Hub"],
  },
  {
    id: "ai-defence-summit",
    label: "AI in Defence Summit",
    type: "format",
    pillars: { events: 1, tech: 0.85, education: 0.25 },
    kicker: "Cédric — Chief of Staff",
    blurb:
      "A summit at the intersection of AI and defence. Cédric serves as Chief of Staff for the summit, run through Seven Events.",
    facts: ["Chief of Staff", "Defence × AI", "via Seven Events"],
  },
  {
    id: "stripe-community-builder",
    label: "Stripe Community Builder",
    type: "format",
    pillars: { tech: 1, events: 0.7, education: 0.3 },
    kicker: "Recognised programme",
    blurb:
      "Stripe Community Builder — convening Belgian founders and builders around Stripe. Ties together the hackathons, Seven Events and the founder community.",
  },
  {
    id: "spreds",
    label: "Spreds campaign",
    type: "format",
    pillars: { tech: 0.8, events: 0.3, education: 0.1 },
    kicker: "Live now · equity crowdfunding",
    blurb:
      "Equity campaign on Spreds to fund the HRMano launch. Belgian tax shelter — investors deduct 45% of the amount on their next tax return, and the stake grows with hrmano.",
    facts: ["45% tax deduction (Belgian tax shelter)", "Funds the launch"],
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
    kicker: "Education-first hackathon",
    blurb: "Teaching kids to build with AI — with Lovable, Rosebud.ai and Hugging Face.",
  },
  {
    id: "hk-media",
    label: "Decentralised European Media Hackathon",
    type: "event",
    pillars: { education: 0.7, events: 0.7, tech: 0.9 },
    kicker: "Civic-tech hackathon",
    blurb:
      "Building tools for a healthier, decentralised European media landscape — a hackathon with a civic mission.",
  },
  {
    id: "hk-energy",
    label: "Energy Data Visualisation Hackathon",
    type: "event",
    pillars: { tech: 1, education: 0.5, events: 0.6 },
    kicker: "Data-viz hackathon",
    blurb: "Making energy data legible and actionable through visualisation.",
  },
  {
    id: "hk-collibra",
    label: "Agentic Commerce & E-invoicing Hackathon",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.2 },
    kicker: "with Collibra & Stripe",
    blurb: "Agentic commerce and e-invoicing, with Collibra and Stripe. Run through Seven Events.",
  },

  // ── Partners / sponsors (all one level) ─────────────────────────────────
  { id: "stripe", label: "Stripe", type: "partner", kicker: "Partner" },
  { id: "collibra", label: "Collibra", type: "partner", kicker: "Partner" },
  { id: "lovable", label: "Lovable", type: "partner", kicker: "Partner — Kids AI Coding" },
  { id: "rosebud", label: "Rosebud.ai", type: "partner", kicker: "Partner — Kids AI Coding" },
  { id: "huggingface", label: "Hugging Face", type: "partner", kicker: "Partner — Kids AI Coding" },

  // Commons Hub partner communities
  { id: "beimpact", label: "BeImpact", type: "partner", kicker: "Commons Hub community" },
  { id: "dao-brussels", label: "DAO.brussels", type: "partner", kicker: "Commons Hub community" },
  { id: "regens-unite", label: "Regens Unite", type: "partner", kicker: "Commons Hub community" },
  { id: "open-collective", label: "Open Collective", type: "partner", kicker: "Commons Hub community" },
  { id: "rebel-studio", label: "Rebel Studio", type: "partner", kicker: "Commons Hub community" },
  { id: "founders-running-club", label: "Founders Running Club", type: "partner", kicker: "Commons Hub community" },
  { id: "contentors", label: "Contentors", type: "partner", kicker: "Commons Hub community" },
  { id: "open-source-village", label: "Open Source Village", type: "partner", kicker: "Commons Hub community" },

  // ── Clients ─────────────────────────────────────────────────────────────
  { id: "ku-leuven", label: "KU Leuven", type: "client", kicker: "Client — universities" },
  {
    id: "eu-institutions",
    label: "EU institutions",
    type: "client",
    kicker: "Client — institutional events",
    blurb: "Brussels is democracy's HQ — EU institutional events are a core Seven Events segment.",
  },
  { id: "vcs-corporates", label: "VCs & corporates", type: "client", kicker: "Clients — forums & summits" },

  // ── The community at the centre of it all ───────────────────────────────
  {
    id: "founder-community",
    label: "Belgian founders",
    type: "audience",
    prominence: 1.7,
    kicker: "The community at the centre",
    blurb:
      "Young (serial) founders across Belgium — the community Cédric is part of and builds for. Hackathons, HRMano, the Stripe Community Builder programme and Commons Hub all orbit it. He isn't selling to strangers; he's one of them, talking to peers.",
    facts: ["Early-access waitlist", "Reach into 30+ ecosystems", "Peers, not prospects"],
  },

  // ── Civic track record ──────────────────────────────────────────────────
  {
    id: "assemblee-citoyenne",
    label: "Assemblée Citoyenne (Food)",
    type: "initiative",
    pillars: { education: 1, events: 0.3 },
    kicker: "Burgerraad voor het klimaat · cycle 2",
    blurb:
      "Citizens' assembly on Food. Of three pillars Cédric focused on LESS WASTE — concretely matching event caterers with associations to save large quantities of food post-events. Also drove theme 3 ('shared economy') on the agenda committee, then the follow-up committee with the minister's cabinet.",
  },
];

export const links: GraphLink[] = [
  // Cédric's roles — the spokes of the wheel
  { source: "cedric", target: "seven-events", kind: "role", label: "Founder · BD & clients" },
  { source: "cedric", target: "hrmano", kind: "role", label: "Go-to-market" },
  { source: "cedric", target: "commons-hub", kind: "role", label: "Cofounder & board" },
  { source: "cedric", target: "civic", kind: "role", label: "Author / voice" },
  { source: "cedric", target: "tech-setup", kind: "role", label: "Operator" },

  // Seven Events
  { source: "seven-events", target: "hackathons", kind: "flagship", label: "Flagship format" },
  { source: "seven-events", target: "ai-defence-summit", kind: "event", label: "Chief of Staff: Cédric" },
  { source: "seven-events", target: "ku-leuven", kind: "client" },
  { source: "seven-events", target: "eu-institutions", kind: "client" },
  { source: "seven-events", target: "vcs-corporates", kind: "client" },

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

  // Kids AI Coding — Commons Hub + its partners
  { source: "hk-kids", target: "commons-hub", kind: "venue" },
  { source: "hk-kids", target: "lovable", kind: "partner" },
  { source: "hk-kids", target: "rosebud", kind: "partner" },
  { source: "hk-kids", target: "huggingface", kind: "partner" },

  // Decentralised European Media — Commons Hub + civic
  { source: "hk-media", target: "commons-hub", kind: "venue" },
  { source: "hk-media", target: "civic", kind: "track-record", label: "Civic mission" },

  // Energy Data Visualisation — Commons Hub
  { source: "hk-energy", target: "commons-hub", kind: "venue" },

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

  // Civic track record
  { source: "civic", target: "assemblee-citoyenne", kind: "track-record" },
];
