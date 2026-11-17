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
  | "collaborator" // a person Cédric builds with
  | "build"; // something Cédric shipped — a site, a tool, an agent, a game

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
      "Brussels-based event agency co-founded by Cédric with Jerome Leclanche and Sona Stepanjan — high-impact business forums and tech summits, premium positioning. Cédric runs BD and client relationships. Flagship: the AI in Defence Summit, with more AI summits incoming.",
    facts: [
      "Incorporated April 2026 · first event Feb 2026",
      "Cofounders: Sona Stepanjan (CEO, ex-EEAS) · Jerome Leclanche (CTO/CFO, €10M+ exit)",
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
    facts: ["New", "AI-leveraged GTM advisory (with Thibault Le Meur)", "ICP-finder tool = lead magnet", "Client: Shifter (NL) · GTM", "Startup founders, Belgium first"],
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

  // ── Advisory roles (Cédric advises; separate entities) ─────────────────
  {
    id: "u-regenerative",
    label: "U-Regenerative",
    type: "venture",
    pillars: { education: 0.7, events: 0.3 },
    prominence: 0.8,
    era: "present",
    kicker: "Advisor · with Michelle Hung",
    blurb:
      "Regenerative and ocean-restoration venture. Cédric advises, and ran field support and visual documentation for its Bali ridge-to-reef field mission with the Livingseas Foundation (Aug 2026).",
    facts: ["Advisor", "Bali field mission · Aug 2026", "With the Livingseas Foundation"],
  },
  {
    id: "uhope",
    label: "U'Hope",
    type: "venture",
    pillars: { education: 1 },
    prominence: 0.8,
    era: "present",
    kicker: "Advisor · with Ulysse Baguida",
    blurb: "Education venture. Cédric advises on go-to-market; his earlier fractional GTM work brought TV opportunities.",
    facts: ["Advisor", "Education", "Go-to-market"],
  },
  {
    id: "ecosfeeria",
    label: "Ecosfeeria",
    type: "venture",
    pillars: { education: 0.5, events: 0.5 },
    prominence: 0.8,
    era: "present",
    kicker: "Advisor · organic art · with Didier Bouillon",
    blurb: "Organic art project led by Didier Bouillon. Cédric advises.",
    facts: ["Advisor", "Organic art"],
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
    url: "https://cedric.sounard.net/hackathons/",
    blurb:
      "The most common events Cédric runs and his current operating focus — where education, events and tech all meet. Their own playbook, voice and partner network. Frequently co-hosted at Commons Hub Brussels and a direct feeder for the Belgian founder community.",
    facts: [
      "13 hackathons organised or facilitated",
      "20 on the line · 3 wins · 6 more coming",
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

  // ── Hackathon editions (from ~/snippets/hackathons/HACKATHONS.md) ──────
  {
    id: "hk-aws-gameday",
    label: "AWS GameDay",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    era: "past",
    kicker: "Competed · 4 Oct 2023",
    blurb:
      "AWS GameDay: Chaotic Commencement, at Trefdag Vlaanderen Digitaal in Brussels. The first hackathon on the line.",
    facts: ["Participated", "Brussels · 2023"],
  },
  {
    id: "hk-ai-outcome",
    label: "AI Hackathon III: Change the Outcome",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.4 },
    era: "past",
    kicker: "Facilitated · 30 Aug 2025",
    blurb:
      "Facilitation role on the third AI Hackathon, 'Change the Outcome'.",
    facts: ["Facilitated"],
  },
  {
    id: "hk-kids",
    label: "Kids AI Coding",
    type: "event",
    pillars: { education: 1, events: 0.6, tech: 0.5 },
    era: "past",
    showLabel: true,
    kicker: "Co-led · 11 Oct 2025",
    blurb:
      "Teaching kids to build with AI, with Lovable, Rosebud.ai and Hugging Face. 102 kids across 8 locations in 6 cities, on a €1k budget (including a professional aftermovie). The team doubled the location count from four to eight.",
    facts: ["102 kids · 8 locations · 6 cities", "Doubled locations: 4 → 8", "€1k budget, aftermovie included"],
    url: "https://kidsaicoding.com",
  },
  {
    id: "hk-agentic-payments",
    label: "Agentic Payments Hackathon",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.4 },
    era: "past",
    kicker: "Co-host · 22 Nov 2025",
    blurb:
      "The first Stripe hackathon in Brussels, co-hosted with the Stripe Community.",
    facts: ["First Stripe hackathon in Brussels", "Co-host"],
  },
  {
    id: "hk-media",
    label: "Decentralised European Media Hackathon",
    type: "event",
    pillars: { education: 0.7, events: 0.7, tech: 0.9 },
    era: "past",
    showLabel: true,
    kicker: "Co-host · 30 Jan 2026 (FOSDEM week)",
    blurb:
      "Tools for a healthier, decentralised European media landscape, with Europe MédiaLab and Eurosky. A multi-sector, multi-generation room: senior policy and media figures building alongside students. “Very successful hackathon… many contacts were made IRL that could lead to cooperation.” (Christophe Leclercq, Europe MédiaLab)",
    facts: ["40 builders", "Multi-sector · multi-generation"],
  },
  {
    id: "hk-polderr",
    label: "Polderr Hackathon",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    era: "past",
    showLabel: true,
    kicker: "🏆 Won · 7 Feb 2026 · Rotterdam",
    blurb:
      "Interactive learning for heavy machinery, in Rotterdam. Team SWAG built it in 12 hours and took first place.",
    facts: ["🏆 Winner · €1,000 cash", "12-hour build", "Rotterdam (NL)"],
    url: "https://polderr.org",
  },
  {
    id: "hk-edth",
    label: "EDTH Brussels",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    era: "past",
    kicker: "Helped organise · 14 Mar 2026",
    blurb:
      "European Defence Tech Hackathon, Brussels edition.",
    facts: ["Helped organise", "Defence tech"],
  },
  {
    id: "hk-stripe-bxl",
    label: "The Brussels Stripe Hackathon",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.4 },
    era: "past",
    kicker: "Co-host · 18 Apr 2026",
    blurb:
      "A 6-hour build at Commons Hub with the Stripe Community. Stripe Press books as prizes.",
    facts: ["Co-host", "6-hour build", "Stripe Press prizes"],
  },
  {
    id: "hk-makers-exchange",
    label: "Hackathon Makers Exchange",
    type: "event",
    pillars: { education: 1, events: 0.8, tech: 0.4 },
    era: "past",
    kicker: "Founded & organised · 25 May 2026",
    blurb:
      "Training the next generation of hackathon organisers: Hackers & Ravers, the Habitat team, Volonteurope and more, in one room to swap what works.",
    facts: ["Founder", "Organisers training organisers"],
  },
  {
    id: "hk-wintercircus",
    label: "Hackers & Ravers, Wintercircus",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    era: "past",
    showLabel: true,
    kicker: "🏆 Solo win · 30 May 2026 · Ghent",
    blurb:
      "A 20-partner hackathon at Wintercircus in Ghent. Cédric won the Loop (earplugs) track solo. The prize: a drive at Spa-Francorchamps.",
    facts: ["🏆 Solo win · Loop track", "20 partners", "Prize: Spa-Francorchamps drive"],
  },
  {
    id: "hk-make",
    label: "Make Hackathon",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    era: "past",
    kicker: "Competed · 9 Jun 2026",
    blurb:
      "The 'Pipeline Builder' hackathon by Make. No prize, but shipped a working HRMano funnel.",
    facts: ["Participated", "Shipped a working HRMano funnel"],
  },
  {
    id: "hk-energy",
    label: "Energy Data Visualisation Hackathon",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    era: "past",
    kicker: "Organised · 13 Jun 2026",
    blurb:
      "Making energy data legible, with the City of Brussels as main sponsor, at Commons Hub during EU Sustainable Energy Week.",
    facts: ["8 teams · 6 pitched", "Main sponsor: City of Brussels", "EUSEW 2026"],
  },
  {
    id: "hk-megathon",
    label: "Megathon, Amsterdam",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    era: "past",
    kicker: "Competed solo · 19–21 Jun 2026",
    blurb:
      "500 vetted builders at The HUBB, Amsterdam. Built solo; lanyards.lol came out of it.",
    facts: ["500 builders", "Solo"],
  },
  {
    id: "hk-agentic-commerce",
    label: "Agentic Commerce & E-invoicing",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.4 },
    era: "past",
    showLabel: true,
    kicker: "Co-host · 27 Jun & 3 Oct 2026",
    blurb:
      "Two editions with Stripe, Collibra and e-invoice.be. The October edition drew 105 signups, a record.",
    facts: ["II · 27 Jun: ~40 in the room, 14 teams", "III · 3 Oct: 105 signups, a record", "with Stripe · Collibra · e-invoice.be"],
    url: "https://luma.com/t0vqp8cc",
  },
  {
    id: "hk-volonteurope",
    label: "Volonteurope Hacktive Youth",
    type: "event",
    pillars: { education: 1, events: 0.6, tech: 0.5 },
    era: "past",
    kicker: "Facilitator & judge · 19 Sep 2026",
    blurb:
      "Youth hackathon with Volonteurope. Facilitated and judged.",
    facts: ["Facilitator + judge"],
  },
  {
    id: "hk-tectonic",
    label: "Tectonic Brussels",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.4 },
    era: "past",
    kicker: "Facilitated · 30 Sep 2026",
    blurb:
      "Tectonic 2026, Brussels Hub preselection, at BeCentral.",
    facts: ["Facilitated", "BeCentral"],
  },
  {
    id: "hk-eu-agri",
    label: "EU Agri-Hackathon",
    type: "event",
    pillars: { education: 0.7, events: 0.7, tech: 0.9 },
    era: "past",
    showLabel: true,
    kicker: "Facilitator · 16–18 Oct 2026",
    blurb:
      "The first online EU Agri-Hackathon, run by the European Commission's DG AGRI with ICF Next. One of three facilitators.",
    facts: ["Up to 30 teams", "1 of 3 facilitators", "Winners at EU Agri-Food Days, 9 Dec"],
  },
  {
    id: "hk-google-bspho",
    label: "Solve with Google · BSPHO",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    era: "past",
    kicker: "Competed · 29 Oct 2026 · Ghent",
    blurb:
      "Google Hack for Good, edition 3, for the Belgian Society of Paediatric Haemato-Oncology. Built with Jerome Leclanche and Alexandre De Groodt.",
    facts: ["Trial protocols → searchable consult sheets", "EN / FR / NL"],
    url: "https://ingram.tech/posts/we-built-a-fancy-pdf-viewer",
  },
  {
    id: "hk-rails",
    label: "Hack the Rails",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.4 },
    prominence: 1.2,
    showLabel: true,
    kicker: "Next · 21 Nov 2026",
    blurb:
      "Night-train hackathon with European Sleeper and the City of Brussels.",
    facts: ["Confirmed", "European Sleeper · City of Brussels · HackathonHub"],
    url: "https://luma.com/f0eeirec",
  },
  {
    id: "hk-minecraft",
    label: "Minecraft Family Hack",
    type: "event",
    pillars: { education: 1, events: 0.6, tech: 0.5 },
    showLabel: true,
    kicker: "19 Dec 2026 · ages 9+",
    blurb:
      "A family build day in Minecraft, with Toon & Otto Vanagt, Discord, Maker Camp and an official Minecraft Education partner.",
    facts: ["Confirmed"],
  },
  {
    id: "hk-edge-cv",
    label: "Edge Computer Vision Hackathon",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    kicker: "Dec 2026 · tentative",
    blurb:
      "Computer vision on the edge, with AI-Blox.",
    facts: ["Tentative"],
  },
  {
    id: "hk-open-source",
    label: "Open Source Hackathon",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.4 },
    kicker: "Jan 2027 · announced",
    blurb:
      "With Open Source Village.",
    facts: ["Announced"],
  },
  {
    id: "hk-eventtech",
    label: "Event Tech Hackathon",
    type: "event",
    pillars: { events: 1, tech: 0.8, education: 0.4 },
    kicker: "Feb 2027 · tentative",
    blurb:
      "Building the tools events run on, with exhibitly.ai and SpeakSoon.",
    facts: ["Tentative"],
  },
  {
    id: "hk-batteries",
    label: "Batteries Hackathon",
    type: "event",
    pillars: { tech: 1, events: 0.6, education: 0.3 },
    kicker: "May 2027 · tentative",
    blurb:
      "Batteries and energy storage, with the European Innovation Council, the European Space Agency and a French cyclotron.",
    facts: ["Tentative", "EIC · ESA"],
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

  // ── More ventures & roles (from ~/snippets/cedlocal) ────────────────────
  {
    id: "artcrecon",
    label: "ArtCreCon",
    type: "venture",
    pillars: { events: 0.8, education: 0.6 },
    prominence: 0.9,
    kicker: "Co-founder · with Dritan Kiçi",
    blurb:
      "Art and Creativity Consortium: international by nature, plurilingual, rooted in Brussels. “Unapologetically open to 2000 languages, unapologetically bruxellois too.” The Brussels Review is a founding member.",
    facts: ["Founded Oct 2026", "Founding member: The Brussels Review"],
  },
  {
    id: "matrics-solve",
    label: "Matrics Solve",
    type: "venture",
    pillars: { events: 0.8, tech: 0.4 },
    prominence: 0.8,
    kicker: "Owner · first company",
    blurb:
      "Cédric's first company. Born in July 2024 from the pivot of Matrics App: from an app about events to event services and founding event brands. Today it's his consulting vehicle.",
    facts: ["SRL/BV · since 2024", "Pivot: events app → event services"],
  },
  {
    id: "matrics-app",
    label: "Matrics App",
    type: "venture",
    pillars: { tech: 1, events: 0.6 },
    prominence: 0.7,
    era: "past",
    kicker: "Founder · 2023–2024",
    blurb:
      "An event-discovery app, incubated at WeAreFounders (Google & BeAngels-backed, 25% selection). It never hit the market: the defining First Attempt In Learning. Speed beats polish, which is why Cédric now ships and wins hackathons solo.",
    facts: ["WeAreFounders incubator", "Attempt #1 at event discovery", "Lesson: speed beats polish"],
  },
  {
    id: "hackathonhub",
    label: "Hackathon Hub",
    type: "format",
    pillars: { events: 1, tech: 0.7, education: 0.4 },
    kicker: "Ambassador · Belgium / Brussels",
    blurb:
      "hackathonhub.eu: an EU-wide platform and ~100-person ambassador team, focused only on hackathons. Cédric is its most active ambassador for Belgium. His third run at the event-discovery thesis, after Matrics App and belgiumtech.events.",
    facts: ["Ambassador since 2026", "~100 ambassadors across Europe", "Event discovery, attempt #3"],
    url: "https://hackathonhub.eu",
  },
  {
    id: "content",
    label: "Content",
    type: "thread",
    pillars: { education: 0.7, events: 0.5, tech: 0.3 },
    kicker: "Cross-cutting thread · LinkedIn",
    blurb: "Building authority across every venture at once, from lived experience: 200+ events a year turned into posts.",
    facts: ["LinkedIn · 3× a week target", "Every post routed to one venture"],
    url: "https://www.linkedin.com/in/cedric-sounard/",
  },

  // ── Builds — things Cédric shipped (one per ~/snippets folder) ──────────
  {
    id: "b-venture-map",
    label: "This venture map",
    type: "build",
    pillars: { tech: 1, education: 0.3 },
    kicker: "Build · 3D graph",
    blurb: "The map you're looking at: every node and link rebuilt from the folders Cédric works in.",
    url: "https://cedric.sounard.net/",
  },
  {
    id: "b-mindmap-canvas",
    label: "Mindmap Canvas",
    type: "build",
    pillars: { tech: 1, education: 0.4 },
    kicker: "Build · generate your own map",
    blurb: "A blank-canvas fork of this map: paste what you do, and Claude turns it into your own glowing 3D graph.",
  },
  {
    id: "b-playbook",
    label: "The Hackathon Playbook",
    type: "build",
    pillars: { education: 1, events: 0.8, tech: 0.4 },
    showLabel: true,
    kicker: "Build · open source",
    blurb:
      "The distilled operating system for running exceptional hackathons, built from 35+ playbooks, retrospectives and research papers. Open source and participatory: the doctrine belongs to Europe's hackathon organisers.",
    facts: ["35+ playbooks distilled", "Open source"],
    url: "https://befounders.eu",
  },
  {
    id: "b-agent-pack",
    label: "Hackathon Organiser Agent Pack",
    type: "build",
    pillars: { education: 0.8, events: 0.8, tech: 1 },
    kicker: "Build · Claude Code skill pack",
    blurb:
      "Bachelor student to world-class organiser in one prompt and 10 minutes: an agent that generates the whole event as files (timeline, budget, sponsor prospectus, run of show, judging plan).",
  },
  {
    id: "b-kith",
    label: "Kith",
    type: "build",
    pillars: { tech: 1, events: 0.6 },
    kicker: "Build · the agentic Meetup",
    blurb:
      "Not social media: no feed, no likes. Describe your week in plain language and an agent returns five concrete things to join or create. MCP-first: the product is an MCP server, the app is Claude talking to it.",
  },
  {
    id: "b-tandem",
    label: "Tandem",
    type: "build",
    pillars: { education: 0.8, tech: 1 },
    kicker: "Build · AI deliberation engine",
    blurb:
      "“You generate a thousand signals a day; your democracy hears one per year.” An assembly companion that takes a room of opposed citizens to an actionable local plan, while making every participant feel heard.",
  },
  {
    id: "b-lanyards",
    label: "Lanyards & Dragons",
    type: "build",
    pillars: { tech: 1, events: 0.7 },
    kicker: "Build · game",
    blurb:
      "A platformer roguelike where going to tech conferences is reskinned as medieval fantasy. Clear a level, earn a lanyard. Born at the Megathon as lanyards.lol.",
  },
  {
    id: "b-abyssal",
    label: "Abyssal Descent",
    type: "build",
    pillars: { tech: 1 },
    kicker: "Build · game experiment",
    blurb: "A browser game, from 2D to a 3D signed-distance-field labyrinth across five iterations.",
  },
  {
    id: "b-hrmano-site",
    label: "hrmano.com",
    type: "build",
    pillars: { tech: 1 },
    kicker: "Build · landing & early access",
    blurb: "The bilingual FR/EN landing and early-access page for HRMano.",
    url: "https://hrmano.com",
  },
  {
    id: "b-bali",
    label: "Bali field mission",
    type: "build",
    pillars: { education: 0.6, tech: 0.6 },
    kicker: "Build · field guide",
    blurb: "Ridge-to-reef field itinerary and media guide for U-Regenerative's Bali mission, with the Livingseas Foundation.",
    url: "https://sounard.github.io/u-regenerative-bali/",
  },
  {
    id: "b-bspho-viewer",
    label: "Protocol consult-sheet viewer",
    type: "build",
    pillars: { tech: 1, education: 0.4 },
    kicker: "Build · with Jerome & Alexandre",
    blurb: "A one-day viewer turning paediatric oncology trial protocols into searchable consult sheets, in English, French and Dutch.",
    url: "https://ingram.tech/posts/we-built-a-fancy-pdf-viewer",
  },
  {
    id: "b-hackathons-page",
    label: "Hackathon timeline",
    type: "build",
    pillars: { events: 1, tech: 0.5 },
    kicker: "Build · the record",
    blurb: "Every hackathon on one line: twenty hackathons, three wins, more on the way.",
    url: "https://cedric.sounard.net/hackathons/",
  },

  // ── Hackathon partners (from the editions) ──────────────────────────────
  { id: "european-sleeper", label: "European Sleeper", type: "partner", kicker: "Lead partner · Hack the Rails" },
  { id: "e-invoice", label: "e-invoice.be", type: "partner", kicker: "Partner · Agentic Commerce" },
  { id: "europe-medialab", label: "Europe MédiaLab", type: "partner", kicker: "Partner · European Media" },
  { id: "eurosky", label: "Eurosky", type: "partner", kicker: "Partner · European Media" },
  { id: "dg-agri", label: "European Commission · DG AGRI", type: "client", kicker: "EU Agri-Hackathon" },
  { id: "icf-next", label: "ICF Next", type: "partner", kicker: "EU Agri-Hackathon" },
  { id: "volonteurope", label: "Volonteurope", type: "partner", kicker: "Partner" },
  { id: "becentral", label: "BeCentral", type: "partner", kicker: "Venue · Tectonic Brussels" },
  { id: "ai-blox", label: "AI-Blox", type: "partner", kicker: "Partner · tentative" },
  { id: "exhibitly", label: "exhibitly.ai", type: "partner", kicker: "Partner · tentative" },
  { id: "speaksoon", label: "SpeakSoon", type: "partner", kicker: "Partner · tentative" },
  { id: "eic", label: "EIC", type: "partner", kicker: "European Innovation Council · tentative" },
  { id: "esa", label: "ESA", type: "partner", kicker: "European Space Agency · tentative" },
  { id: "minecraft-edu", label: "Minecraft Education partner", type: "partner", kicker: "Minecraft Family Hack" },
  { id: "the-brussels-review", label: "The Brussels Review", type: "partner", kicker: "Founding member · ArtCreCon", url: "https://thebrusselsreview.com" },
  { id: "livingseas", label: "Livingseas Foundation", type: "partner", kicker: "Partner · Bali mission" },
  { id: "wearefounders", label: "WeAreFounders", type: "partner", kicker: "Incubator · Matrics App" },
  { id: "make", label: "Make", type: "partner", kicker: "Make Hackathon" },

  // ── More people ─────────────────────────────────────────────────────────
  { id: "p-dritan-kici", label: "Dritan Kiçi", type: "collaborator", kicker: "ArtCreCon co-founder · The Brussels Review" },
  { id: "p-alexandre-de-groodt", label: "Alexandre De Groodt", type: "collaborator", kicker: "Built the BSPHO viewer" },
  { id: "p-vanagt", label: "Toon & Otto Vanagt", type: "collaborator", kicker: "Minecraft Family Hack" },

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
    label: "Jerome Leclanche",
    type: "collaborator",
    showLabel: true,
    kicker: "Seven Events — cofounder, CTO/CFO",
    blurb: "Entrepreneur and operator; a €10M+ exit under his belt. Cofounder, CTO/CFO of Seven Events.",
  },
  // Commons Hub board — names surface on hovering the hub
  { id: "p-xavier-damman", label: "Xavier Damman", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-leen-schelfhoud", label: "Leen Schelfhoud", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-inge-williams", label: "Inge Williams", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-mathieu-hanquin", label: "Mathieu Hanquin", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-friedger-muffke", label: "Friedger Müffke", type: "collaborator", kicker: "Commons Hub — board" },
  { id: "p-miriam-dean", label: "Miriam Dean", type: "collaborator", kicker: "Commons Hub — board" },
  // HRMano cofounders — names surface on hovering HRMano
  { id: "p-salvatore", label: "Salvatore", type: "collaborator", kicker: "HRMano — cofounder" },
  { id: "p-alexandre", label: "Alexandre", type: "collaborator", kicker: "HRMano — cofounder" },
  { id: "p-thibault", label: "Thibault Le Meur", type: "collaborator", kicker: "Triscale — GTM advisory partner" },
  { id: "shifter", label: "Shifter", type: "client", kicker: "Triscale client · NL", blurb: "Workforce orchestration, Netherlands. Go-to-market delivered through Triscale.", url: "https://shifter.nl" },
  // Advisory — the founders Cédric advises
  { id: "p-michelle-hung", label: "Michelle Hung", type: "collaborator", kicker: "U-Regenerative" },
  { id: "p-ulysse-baguida", label: "Ulysse Baguida", type: "collaborator", kicker: "U'Hope" },
  { id: "p-didier-bouillon", label: "Didier Bouillon", type: "collaborator", kicker: "Ecosfeeria · organic art" },
  // AI in Defence Summit team — names surface on hovering the summit
  { id: "p-giulia", label: "Giulia", type: "collaborator", kicker: "AI in Defence Summit — Partnerships" },
  { id: "p-julia", label: "Julia", type: "collaborator", kicker: "AI in Defence Summit — Marketing" },

  // ── The Seven Seed ecosystem (Jerome's umbrella) ────────────────────────
  {
    id: "seven-seed-group",
    label: "Seven Seed Group",
    type: "partner",
    prominence: 1.1,
    kicker: "Jerome's umbrella · incubator",
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
      "Brussels VC backing dual-use and defence tech (AI, autonomous systems, drones, cybersecurity) to re-arm Europe with innovation. Organiser-partner of the AI in Defence Summit. Managing partners include Jerome Leclanche.",
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
  { source: "cedric", target: "u-regenerative", kind: "role", label: "Advisor" },
  { source: "cedric", target: "uhope", kind: "role", label: "Advisor" },
  { source: "cedric", target: "ecosfeeria", kind: "role", label: "Advisor" },
  { source: "shifter", target: "triscale", kind: "client", label: "GTM client" },
  { source: "p-michelle-hung", target: "u-regenerative", kind: "team", label: "Founder", reveal: "u-regenerative" },
  { source: "p-ulysse-baguida", target: "uhope", kind: "team", label: "Founder", reveal: "uhope" },
  { source: "p-didier-bouillon", target: "ecosfeeria", kind: "team", label: "Artist", reveal: "ecosfeeria" },
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

  // Hackathons → every edition, in date order
  { source: "hackathons", target: "hk-aws-gameday", kind: "event" },
  { source: "hackathons", target: "hk-ai-outcome", kind: "event" },
  { source: "hackathons", target: "hk-kids", kind: "event" },
  { source: "hackathons", target: "hk-agentic-payments", kind: "event" },
  { source: "hackathons", target: "hk-media", kind: "event" },
  { source: "hackathons", target: "hk-polderr", kind: "event" },
  { source: "hackathons", target: "hk-edth", kind: "event" },
  { source: "hackathons", target: "hk-stripe-bxl", kind: "event" },
  { source: "hackathons", target: "hk-makers-exchange", kind: "event" },
  { source: "hackathons", target: "hk-wintercircus", kind: "event" },
  { source: "hackathons", target: "hk-make", kind: "event" },
  { source: "hackathons", target: "hk-energy", kind: "event" },
  { source: "hackathons", target: "hk-megathon", kind: "event" },
  { source: "hackathons", target: "hk-agentic-commerce", kind: "event" },
  { source: "hackathons", target: "hk-volonteurope", kind: "event" },
  { source: "hackathons", target: "hk-tectonic", kind: "event" },
  { source: "hackathons", target: "hk-eu-agri", kind: "event" },
  { source: "hackathons", target: "hk-google-bspho", kind: "event" },
  { source: "hackathons", target: "hk-rails", kind: "event" },
  { source: "hackathons", target: "hk-minecraft", kind: "event" },
  { source: "hackathons", target: "hk-edge-cv", kind: "event" },
  { source: "hackathons", target: "hk-open-source", kind: "event" },
  { source: "hackathons", target: "hk-eventtech", kind: "event" },
  { source: "hackathons", target: "hk-batteries", kind: "event" },

  // Where the hackathons happen, and what they feed
  { source: "hackathons", target: "commons-hub", kind: "venue", label: "Usually co-hosted at" },
  { source: "hackathons", target: "founder-community", kind: "pipeline", label: "Feeds the community" },
  { source: "hackathons", target: "hackathonhub", kind: "community", label: "Ambassador" },
  { source: "hackathons", target: "b-hackathons-page", kind: "flagship", label: "The record" },
  { source: "hackathons", target: "b-playbook", kind: "pipeline", label: "Lessons → playbook" },
  { source: "b-playbook", target: "b-agent-pack", kind: "pipeline", label: "Doctrine → agent" },
  { source: "hk-makers-exchange", target: "b-playbook", kind: "pipeline", label: "Organisers → playbook" },

  // Stripe editions
  { source: "hk-agentic-payments", target: "stripe", kind: "partner" },
  { source: "hk-agentic-payments", target: "stripe-community-builder", kind: "event" },
  { source: "hk-stripe-bxl", target: "stripe", kind: "partner" },
  { source: "hk-stripe-bxl", target: "commons-hub", kind: "venue" },
  { source: "hk-stripe-bxl", target: "stripe-community-builder", kind: "event" },
  { source: "hk-agentic-commerce", target: "seven-events", kind: "event" },
  { source: "hk-agentic-commerce", target: "stripe", kind: "partner" },
  { source: "hk-agentic-commerce", target: "collibra", kind: "partner", label: "Host venue" },
  { source: "hk-agentic-commerce", target: "e-invoice", kind: "partner", reveal: "hk-agentic-commerce" },
  { source: "hk-agentic-commerce", target: "stripe-community-builder", kind: "event" },

  // Kids AI Coding — venue + partners, hidden until hovered
  { source: "north-star", target: "hk-kids", kind: "flagship", label: "Co-led / operated" },
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
  { source: "hk-kids", target: "commons-hub", kind: "venue", reveal: "hk-kids" },

  // Civic-tech editions
  { source: "hk-media", target: "commons-hub", kind: "venue" },
  { source: "hk-media", target: "civic", kind: "track-record", label: "Civic mission" },
  { source: "hk-media", target: "europe-medialab", kind: "partner" },
  { source: "hk-media", target: "eurosky", kind: "partner", reveal: "hk-media" },
  { source: "hk-eu-agri", target: "dg-agri", kind: "client", label: "Run by" },
  { source: "hk-eu-agri", target: "icf-next", kind: "partner", reveal: "hk-eu-agri" },
  { source: "hk-eu-agri", target: "civic", kind: "track-record", label: "Public-sector" },

  // Energy Data Visualisation
  { source: "hk-energy", target: "commons-hub", kind: "venue" },
  { source: "hk-energy", target: "bxl-ville", kind: "sponsor", label: "Main sponsor" },
  { source: "hk-energy", target: "collibra", kind: "partner", reveal: "hk-energy" },
  { source: "hk-energy", target: "sibelga", kind: "partner", reveal: "hk-energy" },
  { source: "hk-energy", target: "seven-events", kind: "event" },

  // Competed — and what came out of it
  { source: "hk-wintercircus", target: "wintercircus", kind: "venue" },
  { source: "hk-make", target: "make", kind: "partner", reveal: "hk-make" },
  { source: "hk-make", target: "hrmano", kind: "pipeline", label: "Shipped an HRMano funnel" },
  { source: "hk-megathon", target: "b-lanyards", kind: "pipeline", label: "Born here" },
  { source: "hk-google-bspho", target: "b-bspho-viewer", kind: "pipeline", label: "Built here" },
  { source: "hk-google-bspho", target: "wintercircus", kind: "venue", reveal: "hk-google-bspho" },
  { source: "p-jerome", target: "b-bspho-viewer", kind: "team", label: "Co-built" },
  { source: "p-alexandre-de-groodt", target: "b-bspho-viewer", kind: "team", label: "Co-built" },
  { source: "b-bspho-viewer", target: "ingram", kind: "partner", label: "Published on ingram.tech" },

  // Facilitated
  { source: "hk-volonteurope", target: "volonteurope", kind: "partner" },
  { source: "hk-makers-exchange", target: "volonteurope", kind: "partner", reveal: "hk-makers-exchange" },
  { source: "hk-tectonic", target: "becentral", kind: "venue" },

  // Upcoming — with Seven Events
  { source: "hk-rails", target: "seven-events", kind: "event" },
  { source: "hk-rails", target: "european-sleeper", kind: "sponsor", label: "Lead partner" },
  { source: "hk-rails", target: "bxl-ville", kind: "partner" },
  { source: "hk-rails", target: "hackathonhub", kind: "partner" },
  { source: "hk-minecraft", target: "p-vanagt", kind: "team", label: "Partners", reveal: "hk-minecraft" },
  { source: "hk-minecraft", target: "minecraft-edu", kind: "partner", reveal: "hk-minecraft" },
  { source: "hk-edge-cv", target: "ai-blox", kind: "partner", reveal: "hk-edge-cv" },
  { source: "hk-open-source", target: "open-source-village", kind: "partner" },
  { source: "hk-eventtech", target: "exhibitly", kind: "partner", reveal: "hk-eventtech" },
  { source: "hk-eventtech", target: "speaksoon", kind: "partner", reveal: "hk-eventtech" },
  { source: "hk-batteries", target: "eic", kind: "partner", reveal: "hk-batteries" },
  { source: "hk-batteries", target: "esa", kind: "partner", reveal: "hk-batteries" },

  // New ventures, the event-discovery thread, builds
  { source: "cedric", target: "artcrecon", kind: "role", label: "Co-founder" },
  { source: "p-dritan-kici", target: "artcrecon", kind: "team", label: "Co-founder" },
  { source: "the-brussels-review", target: "artcrecon", kind: "partner", label: "Founding member" },
  { source: "p-dritan-kici", target: "the-brussels-review", kind: "team", label: "Founder", reveal: "artcrecon" },
  { source: "cedric", target: "matrics-solve", kind: "role", label: "Owner" },
  { source: "matrics-app", target: "matrics-solve", kind: "pipeline", label: "Pivot, July 2024" },
  { source: "wearefounders", target: "matrics-app", kind: "partner", label: "Incubator" },
  { source: "matrics-app", target: "north-star", kind: "pipeline", label: "Event discovery, attempt #2" },
  { source: "north-star", target: "hackathonhub", kind: "pipeline", label: "Event discovery, attempt #3" },
  { source: "cedric", target: "hackathonhub", kind: "role", label: "Ambassador · Belgium" },
  { source: "matrics-solve", target: "seven-events", kind: "client", label: "Invoices project work" },
  { source: "cedric", target: "content", kind: "role", label: "Voice" },
  { source: "tech-setup", target: "b-venture-map", kind: "flagship", label: "Built with Claude" },
  { source: "b-venture-map", target: "b-mindmap-canvas", kind: "pipeline", label: "Forked into" },
  { source: "tech-setup", target: "b-kith", kind: "event" },
  { source: "b-kith", target: "founders-running-club", kind: "community", label: "Runs, padel, plans", reveal: "b-kith" },
  { source: "civic", target: "b-tandem", kind: "flagship", label: "AI for assemblies" },
  { source: "b-tandem", target: "assemblee-citoyenne", kind: "track-record", label: "Lessons from the room" },
  { source: "tech-setup", target: "b-lanyards", kind: "event" },
  { source: "tech-setup", target: "b-abyssal", kind: "event" },
  { source: "hrmano", target: "b-hrmano-site", kind: "flagship", label: "Landing & waitlist" },
  { source: "u-regenerative", target: "b-bali", kind: "flagship", label: "Field mission, Aug 2026" },
  { source: "b-bali", target: "livingseas", kind: "partner" },
  { source: "b-hackathons-page", target: "b-venture-map", kind: "pipeline", label: "Same site" },

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
  { source: "p-leen-schelfhoud", target: "commons-hub", kind: "team", label: "Board", reveal: "commons-hub" },
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

  // Seven Seed ecosystem — Jerome's umbrella; Seven Events sits inside it
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

  // Ingram Technologies — Jerome's company; strong Stripe + AI Defence Summit partner
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
