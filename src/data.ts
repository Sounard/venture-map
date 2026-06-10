/**
 * The venture map of Cédric Sounard.
 *
 * One person, many threads. This file is the single source of truth for the
 * graph: every node is an entity in Cédric's world, every link is a real
 * relationship between them. The renderer (main.ts) is deliberately dumb — all
 * the meaning lives here.
 *
 * Node `group` decides colour, so sub-entities inherit the hue of the venture
 * they belong to. Node `type` decides geometry and base size.
 */

export type NodeType =
  | "person" // Cédric himself — the connecting node
  | "venture" // a thing he builds / operates
  | "thread" // cross-cutting concern, not a venture
  | "format" // a recurring format or product (hackathons, crowdfunding)
  | "partner" // partner community / collaborator
  | "sponsor" // budget / commercial partner
  | "client" // an organisation that buys events
  | "initiative" // a civic engagement / track-record item
  | "audience"; // a market / community he reaches

export type Group =
  | "person"
  | "seven-events"
  | "hrmano"
  | "commons-hub"
  | "civic"
  | "content"
  | "tech";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  group: Group;
  /** Short tag shown under the title in the panel. */
  kicker?: string;
  /** Markdown-ish plaintext shown in the side panel. */
  blurb?: string;
  /** Key facts rendered as a small list. */
  facts?: string[];
  url?: string;
}

export type LinkKind =
  | "role" // Cédric -> venture/thread (what he does there)
  | "flagship" // venture -> its headline format
  | "venue" // something hosted at a place
  | "pipeline" // feeds commercial pipeline into another venture
  | "partner" // partner community of
  | "sponsor" // funds / sponsors
  | "client" // buys from
  | "track-record" // civic engagement evidence
  | "audience" // reaches a market
  | "amplifies"; // content layer over a venture

export interface GraphLink {
  source: string;
  target: string;
  kind: LinkKind;
  /** Optional human label for the relationship. */
  label?: string;
}

export const GROUP_COLORS: Record<Group, string> = {
  person: "#fbbf24", // gold
  "seven-events": "#ff7849", // ember orange
  hrmano: "#34d399", // emerald
  "commons-hub": "#22d3ee", // cyan
  civic: "#a78bfa", // violet
  content: "#f472b6", // pink
  tech: "#818cf8", // indigo
};

export const GROUP_LABELS: Record<Group, string> = {
  person: "Cédric",
  "seven-events": "Seven Events",
  hrmano: "HRMano",
  "commons-hub": "Commons Hub Brussels",
  civic: "Civic / Democracy",
  content: "Content & public image",
  tech: "Tech setup",
};

export const nodes: GraphNode[] = [
  // ── The connecting node ───────────────────────────────────────────────
  {
    id: "cedric",
    label: "Cédric Sounard",
    type: "person",
    group: "person",
    kicker: "Your Most Extroverted Geek",
    blurb:
      "Philosopher by training, AI-startup founder, operator and connector. The less-technical one — strengths are sales, events, partnerships, people and taste. Based in Brussels, moving fast across many threads at once.",
    facts: ["Brussels", "Founder · operator · connector", "200+ events/year"],
  },

  // ── Ventures ──────────────────────────────────────────────────────────
  {
    id: "seven-events",
    label: "Seven Events",
    type: "venture",
    group: "seven-events",
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
    group: "hrmano",
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
    group: "commons-hub",
    kicker: "Board member (1 of 7)",
    blurb:
      "A collaborative space near Brussels Central run as a commons: shared governance, a dual economy (euros + CHT tokens), and a community of community builders. A solarpunk place of experimentation and incubator for communities. Cédric is an ecosystem steward and board member.",
    facts: [
      "Board member since June 2026",
      "Dual economy: euros + CHT tokens",
      "Rooms for 10–80 · coworking · events",
      "Ecosystem steward",
    ],
  },
  {
    id: "civic",
    label: "Civic / Democracy",
    type: "venture",
    group: "civic",
    kicker: 'The long game · "Civic Engine"',
    blurb:
      "Thought leadership and public-life work — building reputation capital and a coherent body of work over the long term. Core thesis: modern democracy runs on absurdly low bandwidth, and we can now let citizens participate far more granularly on the topics where they have genuine skin in the game.",
    facts: [
      "Substance over virality",
      "Thesis: democracy's low bandwidth",
      "Lived track record, not commentary",
      "Bridges the FR/NL divide",
    ],
  },

  // ── Cross-cutting threads ───────────────────────────────────────────────
  {
    id: "content",
    label: "Content & public image",
    type: "thread",
    group: "content",
    kicker: "Cross-cutting thread",
    blurb:
      "LinkedIn presence and public image across all ventures, built from a lived experience as a hyper-connected Brussels entrepreneur. One post = one narrative thread; never all ventures at once. Cadence target: 3×/week.",
    facts: ["Audience: Belgian/EU startup ecosystem", "Engine: content-creation skill", "3×/week target"],
  },
  {
    id: "tech-setup",
    label: "Tech setup",
    type: "thread",
    group: "tech",
    kicker: 'Cross-cutting thread · "the Harness"',
    blurb:
      "The software / AI / hardware stack and the sparring thread on what setup to use. Wants the bleeding edge of AI working for him without becoming a full-time tinkerer: high-leverage tools, open-source / free tiers a plus, fewer well-integrated tools over many.",
    facts: ["High-leverage > hype", "Google Suite · Claude", "Open-source / free tiers a plus"],
  },

  // ── Seven Events orbit ──────────────────────────────────────────────────
  {
    id: "hackathons",
    label: "Hackathons",
    type: "format",
    group: "seven-events",
    kicker: "Flagship format · current focus",
    blurb:
      "The most common events Cédric runs through Seven Events and his current operating focus. Their own playbook, voice and partner network. Frequently co-hosted at Commons Hub Brussels and a direct feeder for the HRMano founder community.",
    facts: ["Own playbook & builder voice", "Co-hosted at Commons Hub", "Stripe / Collibra / Ingram budgets"],
  },
  {
    id: "ku-leuven",
    label: "KU Leuven",
    type: "client",
    group: "seven-events",
    kicker: "Client — universities",
  },
  {
    id: "eu-institutions",
    label: "EU institutions",
    type: "client",
    group: "seven-events",
    kicker: "Client — institutional events",
    blurb: "Brussels is democracy's HQ — EU institutional events are a core Seven Events segment.",
  },
  {
    id: "vcs-corporates",
    label: "VCs & corporates",
    type: "client",
    group: "seven-events",
    kicker: "Clients — forums & summits",
  },

  // ── HRMano orbit ────────────────────────────────────────────────────────
  {
    id: "crowdfunding",
    label: "Spreds campaign",
    type: "format",
    group: "hrmano",
    kicker: "Live now · equity crowdfunding",
    blurb:
      "Equity campaign on Spreds to fund the HRMano launch. Belgian tax shelter — investors deduct 45% of the amount on their next tax return, and the stake grows with hrmano.",
    facts: ["45% tax deduction (Belgian tax shelter)", "Funds the launch"],
    url: "https://www.spreds.com/fr/compartments/10909-hrmano",
  },
  {
    id: "founder-community",
    label: "Brussels founder community",
    type: "audience",
    group: "hrmano",
    kicker: "ICP & community",
    blurb:
      "Young (serial) founders struggling with admin & finance — focused elsewhere but wanting clarity. Cédric isn't selling to strangers; he's one of them, talking to peers. Reached through events, LinkedIn and 30+ ecosystems across Belgium.",
    facts: ["Early-access waitlist", "Friendly reach into 30+ ecosystems"],
  },

  // ── Commons Hub orbit — partner communities ─────────────────────────────
  { id: "beimpact", label: "BeImpact", type: "partner", group: "commons-hub", kicker: "Partner community" },
  { id: "dao-brussels", label: "DAO.brussels", type: "partner", group: "commons-hub", kicker: "Partner community" },
  { id: "regens-unite", label: "Regens Unite", type: "partner", group: "commons-hub", kicker: "Partner community" },
  { id: "open-collective", label: "Open Collective", type: "partner", group: "commons-hub", kicker: "Partner community" },
  { id: "rebel-studio", label: "Rebel Studio", type: "partner", group: "commons-hub", kicker: "Partner community" },

  // ── Hackathon sponsors / budget partners ────────────────────────────────
  { id: "stripe", label: "Stripe", type: "sponsor", group: "seven-events", kicker: "Hackathon budget partner" },
  { id: "collibra", label: "Collibra", type: "sponsor", group: "seven-events", kicker: "Hackathon / community sponsor" },
  { id: "ingram", label: "Ingram", type: "sponsor", group: "seven-events", kicker: "Hackathon budget partner" },

  // ── Civic track record ──────────────────────────────────────────────────
  {
    id: "assemblee-citoyenne",
    label: "Assemblée Citoyenne (Food)",
    type: "initiative",
    group: "civic",
    kicker: "Burgerraad voor het klimaat · cycle 2",
    blurb:
      "Citizens' assembly on Food. Of three pillars Cédric focused on LESS WASTE — concretely matching event caterers with associations to save large quantities of food post-events. Also drove theme 3 ('shared economy') on the agenda committee, then the follow-up committee ping-ponging with the minister's cabinet.",
  },
  {
    id: "shifters",
    label: "The Shifters",
    type: "initiative",
    group: "civic",
    kicker: "Jancovici initiative",
    blurb: "A highly structured sociocratic nonprofit (the Jancovici initiative).",
  },
  {
    id: "cronos-flagey",
    label: "Designing Dialogue at Scale",
    type: "initiative",
    group: "civic",
    kicker: "with Cronos Europa · Flagey",
    blurb: "Recent civic-tech / deliberative-democracy event at Flagey.",
  },
  {
    id: "degrowth-eu",
    label: "Degrowth conference",
    type: "initiative",
    group: "civic",
    kicker: "EU Parliament · 2024",
  },

  // ── Content audience ────────────────────────────────────────────────────
  {
    id: "linkedin",
    label: "LinkedIn / EU ecosystem",
    type: "audience",
    group: "content",
    kicker: "Authority across all ventures",
    blurb:
      "Belgian/EU startup ecosystem — entrepreneurs, investors, community builders, event professionals. The surface where the content engine builds authority simultaneously across every venture.",
  },
];

export const links: GraphLink[] = [
  // Cédric's roles — the spokes of the wheel
  { source: "cedric", target: "seven-events", kind: "role", label: "Founder · BD & clients" },
  { source: "cedric", target: "hrmano", kind: "role", label: "Fractional GTM" },
  { source: "cedric", target: "commons-hub", kind: "role", label: "Board member" },
  { source: "cedric", target: "civic", kind: "role", label: "Author / voice" },
  { source: "cedric", target: "content", kind: "role", label: "Public image" },
  { source: "cedric", target: "tech-setup", kind: "role", label: "Operator" },

  // Seven Events structure
  { source: "seven-events", target: "hackathons", kind: "flagship", label: "Flagship format" },
  { source: "seven-events", target: "ku-leuven", kind: "client" },
  { source: "seven-events", target: "eu-institutions", kind: "client" },
  { source: "seven-events", target: "vcs-corporates", kind: "client" },

  // Hackathons as the great connector
  { source: "hackathons", target: "commons-hub", kind: "venue", label: "Co-hosted at" },
  { source: "hackathons", target: "stripe", kind: "sponsor" },
  { source: "hackathons", target: "collibra", kind: "sponsor" },
  { source: "hackathons", target: "ingram", kind: "sponsor" },
  { source: "hackathons", target: "founder-community", kind: "pipeline", label: "Feeds HRMano community" },

  // HRMano structure
  { source: "hrmano", target: "crowdfunding", kind: "flagship", label: "Live campaign" },
  { source: "hrmano", target: "founder-community", kind: "audience", label: "ICP / waitlist" },
  { source: "commons-hub", target: "hrmano", kind: "pipeline", label: "Venue network → pipeline" },

  // Commons Hub partner communities
  { source: "commons-hub", target: "beimpact", kind: "partner" },
  { source: "commons-hub", target: "dao-brussels", kind: "partner" },
  { source: "commons-hub", target: "regens-unite", kind: "partner" },
  { source: "commons-hub", target: "open-collective", kind: "partner" },
  { source: "commons-hub", target: "rebel-studio", kind: "partner" },

  // Civic web
  { source: "civic", target: "commons-hub", kind: "venue", label: "Cofounder · venue for democracy events" },
  { source: "civic", target: "assemblee-citoyenne", kind: "track-record" },
  { source: "civic", target: "shifters", kind: "track-record" },
  { source: "civic", target: "cronos-flagey", kind: "track-record" },
  { source: "civic", target: "degrowth-eu", kind: "track-record" },

  // Content amplifies every venture; reaches the ecosystem
  { source: "content", target: "linkedin", kind: "audience" },
  { source: "content", target: "seven-events", kind: "amplifies" },
  { source: "content", target: "hrmano", kind: "amplifies" },
  { source: "content", target: "commons-hub", kind: "amplifies" },
  { source: "content", target: "civic", kind: "amplifies" },
  { source: "founder-community", target: "linkedin", kind: "audience", label: "Reached via LinkedIn" },
];
