// src/pages/dashboard/diagnostic/3/index.tsx
// Brand Personality Quiz — 3-tier progressive access
// Tier 1: Guest → primary archetype + hook + hard gate
// Tier 2: Free (logged-in) → full analysis + scorecard
// Tier 3: Pro/Enterprise → everything + activation playbook

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../../../../lib/supabase';
import { BrandLoader } from '../../../../components/BrandLoader';
import {
  createShareCardFile,
  downloadFile,
  openSocialComposer,
  shareViaNative,
} from '../../../../lib/share';
import {
  FiArrowLeft, FiArrowRight, FiCheck, FiChevronRight,
  FiDownload, FiShare2, FiLock, FiUnlock, FiX,
  FiZap, FiAlertCircle, FiStar, FiTrendingUp,
  FiTwitter, FiLinkedin, FiEye, FiEyeOff,
  FiRefreshCw,
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

// ─── Archetype keys ────────────────────────────────────────────────────────────
type ArchetypeKey = 'AUT' | 'STR' | 'PER' | 'NUR' | 'VIS' | 'BUI';

// ─── Scoring Map ───────────────────────────────────────────────────────────────
interface OptionScore {
  primary: ArchetypeKey;
  spillover: ArchetypeKey;
}

const QUESTIONS: {
  id: number;
  text: string;
  options: { label: string; text: string; scores: OptionScore }[];
}[] = [
  {
    id: 1,
    text: 'How should clients describe your brand after working with you?',
    options: [
      { label: 'A', text: 'They command total authority and know precisely what they are doing.', scores: { primary: 'AUT', spillover: 'STR' } },
      { label: 'B', text: 'They think deeply, give clear frameworks, and simplify complexity.', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: 'They move fast, eliminate friction, and drive immediate results.', scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: 'They truly care, support us personally, and build safety.', scores: { primary: 'NUR', spillover: 'PER' } },
      { label: 'E', text: 'They see around corners and show us the future of our industry.', scores: { primary: 'VIS', spillover: 'STR' } },
      { label: 'F', text: 'They execute constantly, test new ideas, and build in real time.', scores: { primary: 'BUI', spillover: 'VIS' } },
    ],
  },
  {
    id: 2,
    text: "What is your brand's primary weapon of influence?",
    options: [
      { label: 'A', text: 'Confidence, high standards, and explicit command.', scores: { primary: 'AUT', spillover: 'PER' } },
      { label: 'B', text: 'Proven logic, proprietary systems, and structured breakdowns.', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: 'Public wins, speed, case studies, and performance proof.', scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: 'Reassurance, genuine empathy, and long-term relationships.', scores: { primary: 'NUR', spillover: 'STR' } },
      { label: 'E', text: 'Bold ideas, challenging the status quo, and high-concept strategy.', scores: { primary: 'VIS', spillover: 'AUT' } },
      { label: 'F', text: 'Live creation, constant iterations, and building in the open.', scores: { primary: 'BUI', spillover: 'PER' } },
    ],
  },
  {
    id: 3,
    text: 'Which internal motto defines how your business operates?',
    options: [
      { label: 'A', text: "\"Follow our lead — we've mastered this terrain.\"", scores: { primary: 'AUT', spillover: 'STR' } },
      { label: 'B', text: '"Measure twice, cut once — strategy dictates execution."', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: '"Speed wins — out-execute the competition daily."', scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: '"People first — growth is a byproduct of trust."', scores: { primary: 'NUR', spillover: 'PER' } },
      { label: 'E', text: '"Invent the future before someone else forces you to adapt."', scores: { primary: 'VIS', spillover: 'BUI' } },
      { label: 'F', text: '"Stop overthinking — build it, launch it, refine it."', scores: { primary: 'BUI', spillover: 'PER' } },
    ],
  },
  {
    id: 4,
    text: 'What communication tone feels most natural for your content?',
    options: [
      { label: 'A', text: 'Bold, assertive, and direct — zero fluff.', scores: { primary: 'AUT', spillover: 'PER' } },
      { label: 'B', text: 'Clear, analytical, educational, and structured.', scores: { primary: 'STR', spillover: 'NUR' } },
      { label: 'C', text: 'High-energy, motivating, punchy, and result-focused.', scores: { primary: 'PER', spillover: 'AUT' } },
      { label: 'D', text: 'Warm, accessible, encouraging, and deeply relatable.', scores: { primary: 'NUR', spillover: 'STR' } },
      { label: 'E', text: 'Thought-provoking, inspiring, poetic, and forward-looking.', scores: { primary: 'VIS', spillover: 'STR' } },
      { label: 'F', text: 'Practical, candid, experimental, and transparent.', scores: { primary: 'BUI', spillover: 'VIS' } },
    ],
  },
  {
    id: 5,
    text: 'How should clients feel right after making a payment to you?',
    options: [
      { label: 'A', text: '"I am paying an elite specialist who commands the market."', scores: { primary: 'AUT', spillover: 'STR' } },
      { label: 'B', text: '"This was a logical, risk-free, highly intelligent investment."', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: "\"I'm about to see rapid momentum and immediate ROI.\"", scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: '"I am in safe hands with someone who genuinely has my back."', scores: { primary: 'NUR', spillover: 'STR' } },
      { label: 'E', text: '"I am gaining access to a transformational, next-level vision."', scores: { primary: 'VIS', spillover: 'AUT' } },
      { label: 'F', text: '"I am part of an active building process that gets things done."', scores: { primary: 'BUI', spillover: 'PER' } },
    ],
  },
  {
    id: 6,
    text: 'What industry behaviour frustrates you the most?',
    options: [
      { label: 'A', text: 'Timid creators who lack opinions or compromise on standards.', scores: { primary: 'AUT', spillover: 'STR' } },
      { label: 'B', text: 'Shallow surface-level tips and advice without root-cause thinking.', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: 'Slow, bureaucratic operators who talk without delivering metrics.', scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: 'Transactional, cold businesses that treat customers like numbers.', scores: { primary: 'NUR', spillover: 'STR' } },
      { label: 'E', text: 'Copycat brands playing small and refusing to innovate.', scores: { primary: 'VIS', spillover: 'AUT' } },
      { label: 'F', text: 'Endless planning sessions and strategy decks with no tangible output.', scores: { primary: 'BUI', spillover: 'PER' } },
    ],
  },
  {
    id: 7,
    text: 'What content format drives the best response for your brand?',
    options: [
      { label: 'A', text: 'Strong commentary, teardowns, and industry positions.', scores: { primary: 'AUT', spillover: 'STR' } },
      { label: 'B', text: 'Step-by-step breakdowns, visual frameworks, and tactical guides.', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: 'Before-and-after transformations, metrics, and client wins.', scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: 'Q&As, community spotlights, behind-the-scenes support, and lessons.', scores: { primary: 'NUR', spillover: 'STR' } },
      { label: 'E', text: 'Big-picture essays, manifesto posts, and future trend predictions.', scores: { primary: 'VIS', spillover: 'AUT' } },
      { label: 'F', text: '"Build in public" updates, experiment logs, and product walkthroughs.', scores: { primary: 'BUI', spillover: 'PER' } },
    ],
  },
  {
    id: 8,
    text: 'What type of buyer is naturally drawn to your business?',
    options: [
      { label: 'A', text: 'Decision-makers who want an expert to tell them what to do.', scores: { primary: 'AUT', spillover: 'STR' } },
      { label: 'B', text: 'Analytical buyers who need clarity and structured solutions.', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: 'High-intent buyers who need fast execution and measurable growth.', scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: 'Clients seeking a trusted mentor and long-term partner.', scores: { primary: 'NUR', spillover: 'STR' } },
      { label: 'E', text: 'Early adopters and pioneers who want to stay ahead of the curve.', scores: { primary: 'VIS', spillover: 'AUT' } },
      { label: 'F', text: 'Doers and builders who want practical assets and tools.', scores: { primary: 'BUI', spillover: 'PER' } },
    ],
  },
  {
    id: 9,
    text: 'What does market victory look like for your brand?',
    options: [
      { label: 'A', text: 'Being recognized as the undisputed benchmark in our space.', scores: { primary: 'AUT', spillover: 'STR' } },
      { label: 'B', text: 'Owning the intellectual framework and methodology everyone uses.', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: 'Setting the industry record for speed, efficiency, and customer ROI.', scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: 'Cultivating the most loyal, active community of advocacy.', scores: { primary: 'NUR', spillover: 'PER' } },
      { label: 'E', text: 'Redefining the category and creating a new standard of value.', scores: { primary: 'VIS', spillover: 'STR' } },
      { label: 'F', text: 'Creating an interconnected engine of products, tools, and assets.', scores: { primary: 'BUI', spillover: 'VIS' } },
    ],
  },
  {
    id: 10,
    text: 'In a room full of competitors, your brand is the one that:',
    options: [
      { label: 'A', text: 'Captures the room instantly when speaking.', scores: { primary: 'AUT', spillover: 'STR' } },
      { label: 'B', text: 'Maps out the hidden problem everyone else missed.', scores: { primary: 'STR', spillover: 'AUT' } },
      { label: 'C', text: 'Shows up with receipts, data, and closed deals.', scores: { primary: 'PER', spillover: 'BUI' } },
      { label: 'D', text: 'Makes everyone feel welcomed, heard, and supported.', scores: { primary: 'NUR', spillover: 'STR' } },
      { label: 'E', text: 'Challenges standard thinking and proposes a new path.', scores: { primary: 'VIS', spillover: 'AUT' } },
      { label: 'F', text: 'Is already building the solution while others are still debating.', scores: { primary: 'BUI', spillover: 'PER' } },
    ],
  },
];

// ─── Archetype Meta ────────────────────────────────────────────────────────────
const ARCHETYPE_META: Record<ArchetypeKey, {
  name: string;
  label: string;
  tagline: string;
  teaserHook: string;
  description: string;
  gap: string;
  accentStart: string;
  accentEnd: string;
}> = {
  AUT: {
    name: 'The Authority',
    label: 'THE AUTHORITY',
    tagline: 'Command. Standard. Benchmark.',
    teaserHook: "You don't compete for attention — you command it. Clients don't compare you to others; they simply recognize you as the standard.",
    description: "Your dominant archetype shows up as unwavering conviction across your messaging, sales conversations, and content. You lead with expertise and hold the line on standards — clients follow because they trust your judgement completely.",
    gap: 'Gap Detected: High authority presence — low client empathy signals. Risk of sounding arrogant or distant without strong human connection.',
    accentStart: '#1a1a2e',
    accentEnd: '#16213e',
  },
  STR: {
    name: 'The Strategist',
    label: 'THE STRATEGIST',
    tagline: 'Clarity. Frameworks. Root-cause.',
    teaserHook: "You compete on clarity and frameworks rather than hype. Clients trust you because you make complex problems look simple.",
    description: "Your dominant archetype shows up as deep analytical thinking across your messaging, content, and offers. You make the complex feel clear — clients invest in you because you show the map when everyone else is guessing.",
    gap: 'Gap Detected: Strong frameworks — weak direct sales energy. Risk of over-educating without converting, or sounding academic instead of actionable.',
    accentStart: '#0a2540',
    accentEnd: '#0d3b6e',
  },
  PER: {
    name: 'The Performer',
    label: 'THE PERFORMER',
    tagline: 'Speed. Proof. Measurable wins.',
    teaserHook: "You don't talk about results — you produce them, publicly and fast. Your brand wins trust the moment the scoreboard shows up.",
    description: "Your dominant archetype shows up as aggressive execution and public proof across every touchpoint. You attract clients who are tired of waiting and need a partner who moves as fast as they think.",
    gap: 'Gap Detected: Strong short-term performance signals — weak long-term brand narrative. Risk of being seen as transactional rather than transformational.',
    accentStart: '#7f1d1d',
    accentEnd: '#991b1b',
  },
  NUR: {
    name: 'The Nurturer',
    label: 'THE NURTURER',
    tagline: 'Trust. Loyalty. Long-term partnership.',
    teaserHook: "You build businesses on loyalty no competitor can buy. Clients don't just pay you — they protect you, refer you, and stay.",
    description: "Your dominant archetype shows up as deep relational investment across your client experience, content, and community. You attract clients who are tired of feeling like a number and want a genuine advocate in their corner.",
    gap: 'Gap Detected: Strong relational depth — weak boundary-setting and premium pricing signals. Risk of undercharging and over-delivering without a framework for value.',
    accentStart: '#14532d',
    accentEnd: '#166534',
  },
  VIS: {
    name: 'The Visionary',
    label: 'THE VISIONARY',
    tagline: 'Category-defining. Pioneering. Forward.',
    teaserHook: "You see what the market hasn't named yet. Your brand isn't chasing trends — it's setting the direction others will eventually follow.",
    description: "Your dominant archetype shows up as bold category-level thinking across your content, offers, and public positioning. You attract early adopters and forward-thinking clients who want to be on the right side of what's coming.",
    gap: 'Gap Detected: Strong visionary signals — weak buyer-level accessibility. Risk of selling abstract futures that confuse everyday buyers who need concrete next steps.',
    accentStart: '#3b0764',
    accentEnd: '#581c87',
  },
  BUI: {
    name: 'The Builder',
    label: 'THE BUILDER',
    tagline: 'Ship. Iterate. Prove in public.',
    teaserHook: "While others plan, you ship. Your brand proves itself in public, through consistent output, not promises.",
    description: "Your dominant archetype shows up as relentless output and visible execution across your content, products, and community. You attract doers who want a partner that builds alongside them, not one that just advises from a distance.",
    gap: 'Gap Detected: Strong execution output — weak positioning narrative. Risk of being seen as a feature factory rather than a strategic business asset.',
    accentStart: '#1c1917',
    accentEnd: '#292524',
  },
};

// ─── 30-Pair Positioning Matrix ────────────────────────────────────────────────
type PairKey = `${ArchetypeKey}_${ArchetypeKey}`;

const POSITIONING_MATRIX: Partial<Record<PairKey, { identity: string; signature: string }>> = {
  AUT_STR: { identity: 'Dominant Architect', signature: 'High-status leadership backed by bulletproof, logical frameworks.' },
  AUT_PER: { identity: 'Market Commander', signature: 'Decisive direction that drives rapid, measurable results.' },
  AUT_NUR: { identity: 'Protective Leader', signature: 'Uncompromising standards balanced with deep advocate protection.' },
  AUT_VIS: { identity: 'Industry Sovereign', signature: 'Bending the future through sheer market presence and conviction.' },
  AUT_BUI: { identity: 'Operational Giant', signature: 'Commanding authority established through visible, relentless execution.' },
  STR_AUT: { identity: 'Strategic Authority', signature: 'Calculated clarity backed by decisive, high-value leadership.' },
  STR_PER: { identity: 'Efficiency Architect', signature: 'Systemic thinking optimised for fast, undeniable performance.' },
  STR_NUR: { identity: 'Guided Mentor', signature: 'Structured clarity that safely leads clients out of complexity.' },
  STR_VIS: { identity: 'Category Pioneer', signature: 'Future-focused concepts mapped into clean, executable blueprints.' },
  STR_BUI: { identity: 'Systems Architect', signature: 'Methodical logic engineered into repeatable, scalable engines.' },
  PER_AUT: { identity: 'Proof Sovereign', signature: 'Unstoppable velocity backed by high-status market standards.' },
  PER_STR: { identity: 'Tactical Operator', signature: 'High-speed execution guided by sharp, strategic precision.' },
  PER_NUR: { identity: 'Results Advocate', signature: 'Relentless drive to secure win after win for their community.' },
  PER_VIS: { identity: 'Breakthrough Force', signature: 'Fast-moving execution that brings futuristic ideas into reality.' },
  PER_BUI: { identity: 'Execution Engine', signature: 'Pure, unadulterated momentum that builds and scales in public.' },
  NUR_AUT: { identity: 'Trusted Advisor', signature: 'Deep human connection paired with an unwavering, elite standard.' },
  NUR_STR: { identity: 'Clarity Guide', signature: 'Compassionate support backed by clear, step-by-step direction.' },
  NUR_PER: { identity: 'Impact Champion', signature: 'Heart-centred service fuelled by rapid, visible transformation.' },
  NUR_VIS: { identity: 'Empowerment Catalyst', signature: 'Nurturing communities to embrace and inhabit a bigger future.' },
  NUR_BUI: { identity: 'Community Craftsman', signature: 'Hands-on care that builds safe, highly engaging spaces.' },
  VIS_AUT: { identity: 'Market Prophet', signature: 'Bold predictions delivered with absolute, unquestioned conviction.' },
  VIS_STR: { identity: 'Futurist Strategist', signature: 'High-level category transformation backed by logical roadmaps.' },
  VIS_PER: { identity: 'Disruptive Vector', signature: 'Radical concepts deployed into the market with intense speed.' },
  VIS_NUR: { identity: 'Movement Builder', signature: 'Inspiring a legacy vision that deeply protects and elevates people.' },
  VIS_BUI: { identity: 'Innovation Lab', signature: 'Imagining bold possibilities and immediately building prototype systems.' },
  BUI_AUT: { identity: 'Foundational Leader', signature: "Proving authority not by talking, but by what they've built." },
  BUI_STR: { identity: 'Engine Craftsman', signature: 'Practical execution governed by deep system architecture.' },
  BUI_PER: { identity: 'Velocity Maker', signature: 'Building in public with aggressive, high-converting speed.' },
  BUI_NUR: { identity: 'User-Centric Builder', signature: 'Relentlessly shipping tools shaped directly by client feedback.' },
  BUI_VIS: { identity: 'Prototyping Pioneer', signature: 'Constantly launching experimental products that shape tomorrow.' },
};

// ─── Pro Playbook (keyed by primary archetype) ─────────────────────────────────
const PRO_PLAYBOOK: Record<ArchetypeKey, {
  powerWords: string[];
  bannedWords: string[];
  contentHooks: { title: string; prompt: string }[];
  visualDirection: string;
  typography: string;
  counterPositioning: string;
}> = {
  AUT: {
    powerWords: ['Non-negotiable', 'Definitive', 'Benchmark', 'Command', 'Standard', 'Elite', 'Precision', 'Established', 'Unmatched', 'Criteria'],
    bannedWords: ['Hustle', 'Secret sauce', 'Game-changer', 'Guru', 'Life-changing', 'Authentic', 'Passionate', 'Disruptive', 'Synergy', 'Hack'],
    contentHooks: [
      { title: 'The Teardown Hook', prompt: 'Name one thing your industry accepts as "standard practice" that actively limits your clients — then dismantle it with your exact POV and the standard you hold instead.' },
      { title: 'The Framework Hook', prompt: 'Show your decision-making criteria as a visual matrix: the exact filter you use to accept or reject clients, projects, or strategies. Make the bar visible.' },
      { title: 'The Proof Hook', prompt: 'Share a before/after where a client adopted your standard and immediately saw a market differentiation or pricing shift as a result.' },
      { title: 'The Belief Hook', prompt: 'State your hardest non-negotiable in your field. Be polarising. Make the right clients self-select in and the wrong ones exit.' },
      { title: 'The Offer Hook', prompt: 'Frame your service as setting the market benchmark — not just solving a problem. Lead with what clients gain in certainty, status, and competitive distance.' },
    ],
    visualDirection: 'High contrast dark editorial: deep navy or near-black backgrounds, white space used sparingly, structured typographic hierarchy.',
    typography: 'Serif headers (Playfair Display or EB Garamond) paired with clean sans-serif body copy. Commands visual weight and signals mastery.',
    counterPositioning: "When competitors chase visibility and shout louder, you raise the standard. Publish the criteria for excellence in your category — then demonstrate it publicly. Never match their energy; set the benchmark they'll be measured against.",
  },
  STR: {
    powerWords: ['Framework', 'Root-cause', 'Architecting', 'Systemic gap', 'Methodology', 'Blueprint', 'Proprietary', 'Clarity', 'Structured', 'Diagnostic'],
    bannedWords: ['Mindset shift', 'Just start', 'Hustle harder', 'Tips and tricks', 'Simple hack', 'Feel-good', 'Overnight', 'Quick win', 'Game-changer', 'Secret formula'],
    contentHooks: [
      { title: 'The Teardown Hook', prompt: "Pick a common strategy in your space and show why it fails at the root level — not just why it's wrong, but what the actual root cause of failure is." },
      { title: 'The Framework Hook', prompt: 'Turn your diagnostic process into a shareable visual: a 3-5 step system that shows exactly how you think through a client problem from intake to solution.' },
      { title: 'The Proof Hook', prompt: 'Share a client case where your framework uncovered a hidden problem no one else caught — and document specifically what changed when it was fixed.' },
      { title: 'The Belief Hook', prompt: 'State your most controversial position on how your industry operates. Back it entirely with logic and evidence — not emotion or consensus.' },
      { title: 'The Offer Hook', prompt: 'Present your service as the intelligent alternative to guesswork. Lead with the measurable cost of operating without a proper diagnostic and strategic system.' },
    ],
    visualDirection: 'Clean utility-first layout: white or light backgrounds, structured grids, data-adjacent visual elements, generous white space, blue or navy accent tones.',
    typography: 'Geometric sans-serif (Inter, DM Sans, or Neue Haas Grotesk). Signals precision, intelligence, and clear thinking without decoration.',
    counterPositioning: "While competitors sell tactics and hacks, you sell architecture. Publish the diagnosis, not just the prescription. Position every piece of content as the logical antidote to surface-level advice your audience is drowning in.",
  },
  PER: {
    powerWords: ['Proof', 'Velocity', 'Conversion', 'Delivered', 'Measurable', 'Execution', 'Outperform', 'Accelerate', 'Compounding', 'ROI'],
    bannedWords: ['Journey', 'Authentic process', 'Behind-the-scenes feelings', 'Slow and steady', 'Passion-driven', 'Holistic', 'Transformational', 'Empowering', 'Vibrant community', 'Heart-centred'],
    contentHooks: [
      { title: 'The Teardown Hook', prompt: 'Take a slow or inefficient process in your industry and show exactly where the time and money leak is — then show your faster, proven path with actual numbers.' },
      { title: 'The Framework Hook', prompt: 'Share your execution stack: the exact tools, systems, and sequence you use to compress results for clients from intake to delivery.' },
      { title: 'The Proof Hook', prompt: 'Post a transformation timeline. Day 1 vs Day 30 or 90. Hard numbers, real client, specific outcome — no vague language.' },
      { title: 'The Belief Hook', prompt: "Make the case that speed isn't reckless — that moving fast with the right system is the most responsible, highest-leverage thing you can do for clients." },
      { title: 'The Offer Hook', prompt: "Lead your pitch with the metric. Not 'we help you grow' — but 'our last 10 clients averaged X result in Y timeframe.' Let the track record close." },
    ],
    visualDirection: 'High-energy bold layout: strong typographic contrast, asymmetric grid, red or amber accent energy, motion-forward design, result cards and metric displays.',
    typography: 'Bold display sans-serif (Space Grotesk, Monument Extended, or Barlow Condensed). Signals confidence, speed, and no-nonsense delivery.',
    counterPositioning: "When competitors slow-play brand building and lead with storytelling, you lead with the scoreboard. Show results publicly and frequently. Make your track record impossible to scroll past.",
  },
  NUR: {
    powerWords: ['Protected', 'Partnership', 'Invested', 'Community', 'Sustained', 'Trusted', 'Guided', 'Advocated', 'Belonging', 'Safe'],
    bannedWords: ['High-ticket close', 'Scale fast', 'Crush it', 'Dominate', 'Aggressive growth', 'Sales machine', 'Convert', 'Cold traffic', 'Funnel', 'Close the deal'],
    contentHooks: [
      { title: 'The Teardown Hook', prompt: 'Call out the transactional brand model — where clients are treated like numbers in a pipeline — and contrast it with what genuine long-term partnership actually produces.' },
      { title: 'The Framework Hook', prompt: 'Show your client journey as a relationship map: the exact touchpoints where you invest in the human behind the business, not just the deliverable.' },
      { title: 'The Proof Hook', prompt: "Share a long-term client story. Not a quick win — a 12-month-plus relationship and what compounded from it in their business and confidence." },
      { title: 'The Belief Hook', prompt: 'Defend the business case for trust and loyalty as a growth strategy. Show that retention and advocacy, not acquisition tactics, produce the highest LTV.' },
      { title: 'The Offer Hook', prompt: 'Frame your service as a genuine partnership, not a product transaction. Show what clients gain beyond the deliverable — safety, clarity, and an advocate in their corner.' },
    ],
    visualDirection: 'Warm, human-first layout: soft neutral or earth-tone palettes, rounded UI elements, organic textures, generous photography, approachable typography.',
    typography: 'Humanist sans-serif (Nunito, Lato, or Sora). Signals warmth, accessibility, and genuine care without sacrificing clarity or professionalism.',
    counterPositioning: "When competitors optimise for conversion rates and lead volume, you optimise for retention and lifetime value. Build your case studies around LTV, advocacy, and relationships that outlast any campaign. Let your clients speak louder than your marketing.",
  },
  VIS: {
    powerWords: ['Category-defining', 'Reframe', 'Inevitable', 'Pioneer', 'Signal', 'Paradigm', 'Trajectory', 'Before mainstream', 'Ahead of the curve', 'Architecture'],
    bannedWords: ['Best practices', 'Proven formula', 'Trending now', "What's working", 'Copy what works', 'Industry standard', 'Template', 'Mainstream', 'Safe bet', 'Conventional wisdom'],
    contentHooks: [
      { title: 'The Teardown Hook', prompt: 'Identify a belief your entire industry holds as true that will be obsolete or actively harmful in 3 years — and explain precisely why you already moved past it.' },
      { title: 'The Framework Hook', prompt: 'Map the future of your category in a visual timeline: where the market is today, where it is heading, where the gap is, and exactly where you fit.' },
      { title: 'The Proof Hook', prompt: "Share a prediction you made 12+ months ago that has since come true — and then publicly state what you're calling next with the same specificity." },
      { title: 'The Belief Hook', prompt: 'State your most unpopular opinion about where your industry is heading. Be specific. Be early. Let the people who see it too find you through the disagreement.' },
      { title: 'The Offer Hook', prompt: "Sell access to your foresight and category thinking. Position your service as a map through what's coming — not a solution to what's already well understood." },
    ],
    visualDirection: 'Futuristic editorial layout: dark gradient or deep space backgrounds, electric cyan or violet accent tones, abstract geometric shapes, high-contrast typographic statements.',
    typography: 'Editorial display (Clash Display, Syne, or PP Neue Montreal). Signals original thinking, cultural relevance, and category leadership.',
    counterPositioning: "When competitors fight over current market share and compete on existing category terms, you define the next category. Publish bold predictions publicly. Challenge orthodoxy with specificity. Make your thought leadership the standard that early adopters cite.",
  },
  BUI: {
    powerWords: ['Shipped', 'Live', 'Built', 'Deployed', 'Iterated', 'Operational', 'Asset', 'Engine', 'Output', 'System'],
    bannedWords: ['Strategy session', 'Coming soon', 'Whiteboard', 'Thought leadership', 'In the pipeline', 'Roadmap', 'Ideation', 'Eventually', 'Planning phase', 'Visioning'],
    contentHooks: [
      { title: 'The Teardown Hook', prompt: "Show a business that's been 'planning' a feature or product for months — then contrast it with what you've already shipped, tested, and iterated on in the same window." },
      { title: 'The Framework Hook', prompt: 'Share your build stack: the exact tools, workflows, and process you use to take something from idea to live in compressed time. Make the process visible.' },
      { title: 'The Proof Hook', prompt: "Post a build log: what you shipped this week, what broke, what worked, what the numbers said, and what's next. Radical transparency is your brand asset." },
      { title: 'The Belief Hook', prompt: 'Make the case — with evidence — that shipping an imperfect product beats a perfect plan every single time. Name the opportunity cost of waiting.' },
      { title: 'The Offer Hook', prompt: 'Lead with your output and velocity, not your process description. Show the volume of what you have already built. Let the body of work be the pitch.' },
    ],
    visualDirection: 'Utility-forward or terminal-adjacent layout: dark or neutral backgrounds, monospaced accent fonts for data/code elements, build metrics, progress indicators, green or cyan accents.',
    typography: 'Clean utility sans-serif with monospace accents (IBM Plex Sans + JetBrains Mono, or Inter + Fira Code). Signals practical intelligence, transparency, and relentless output.',
    counterPositioning: "When competitors pitch decks and promise roadmaps, you show the live product. Make your public build log your content strategy. Out-ship, out-document, and out-iterate — on the record, where everyone can see it.",
  },
};

// ─── Scoring Engine ────────────────────────────────────────────────────────────
type ScoreMap = Record<ArchetypeKey, number>;

function calculateScores(answers: Record<number, string>): ScoreMap {
  const scores: ScoreMap = { AUT: 0, STR: 0, PER: 0, NUR: 0, VIS: 0, BUI: 0 };
  Object.entries(answers).forEach(([qIdStr, optionLabel]) => {
    const qId = parseInt(qIdStr);
    const question = QUESTIONS.find(q => q.id === qId);
    if (!question) return;
    const option = question.options.find(o => o.label === optionLabel);
    if (!option) return;
    scores[option.scores.primary] += 10;
    scores[option.scores.spillover] += 5;
  });
  return scores;
}

function getRankedArchetypes(scores: ScoreMap): ArchetypeKey[] {
  return (Object.keys(scores) as ArchetypeKey[]).sort((a, b) => scores[b] - scores[a]);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BrandPersonalityQuiz() {
  const router = useRouter();

  // Auth state
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isProUser, setIsProUser] = useState(false);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  // Results state
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState<ScoreMap | null>(null);
  const [primaryKey, setPrimaryKey] = useState<ArchetypeKey | null>(null);
  const [secondaryKey, setSecondaryKey] = useState<ArchetypeKey | null>(null);
  const [hasExistingResult, setHasExistingResult] = useState(false);

  // Guest gate state
  const [showGate, setShowGate] = useState(false);
  const [gateName, setGateName] = useState('');
  const [gateEmail, setGateEmail] = useState('');
  const [gatePassword, setGatePassword] = useState('');
  const [gateShowPassword, setGateShowPassword] = useState(false);
  const [gateLoading, setGateLoading] = useState(false);
  const [gateError, setGateError] = useState('');

  // Share state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Pro tab
  const [activeProTab, setActiveProTab] = useState<'voice' | 'content' | 'visual' | 'counter'>('voice');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        await loadUserProfile(authUser);
      }
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      setAuthChecked(true);
    }
  };

  const loadUserProfile = async (authUser: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      if (profile) {
        setUserProfile(profile);
        setIsProUser(profile.plan === 'pro' || profile.plan === 'enterprise');
      }
      const { data: existingResult } = await supabase
        .from('user_diagnostics')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('diagnostic_id', 3)
        .eq('is_completed', true)
        .single();
      if (existingResult) {
        setHasExistingResult(true);
        const saved = existingResult.result_data;
        const savedScores: ScoreMap = saved?.scores || { AUT: 0, STR: 0, PER: 0, NUR: 0, VIS: 0, BUI: 0 };
        setScores(savedScores);
        const ranked = getRankedArchetypes(savedScores);
        setPrimaryKey(ranked[0]);
        setSecondaryKey(ranked[1]);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Profile load error:', err);
    }
  };

  const handleSelectOption = (label: string) => {
    if (animating) return;
    setSelectedOption(label);
  };

  const handleNext = () => {
    if (!selectedOption || animating) return;
    const qId = QUESTIONS[currentQuestion].id;
    const newAnswers = { ...answers, [qId]: selectedOption };
    setAnswers(newAnswers);
    setAnimating(true);
    setSelectedOption(null);
    setTimeout(() => {
      setAnimating(false);
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        finalizeQuiz(newAnswers);
      }
    }, 280);
  };

  const handleBack = () => {
    if (currentQuestion === 0 || animating) return;
    const prevQ = QUESTIONS[currentQuestion - 1];
    setCurrentQuestion(prev => prev - 1);
    setSelectedOption(answers[prevQ.id] || null);
  };

  const finalizeQuiz = (finalAnswers: Record<number, string>) => {
    const computed = calculateScores(finalAnswers);
    const ranked = getRankedArchetypes(computed);
    setScores(computed);
    setPrimaryKey(ranked[0]);
    setSecondaryKey(ranked[1]);
    setShowResults(true);
    if (!user) {
      setShowGate(true);
    } else {
      saveResults(computed, ranked[0], ranked[1], finalAnswers);
    }
  };

  const saveResults = async (
    computed: ScoreMap,
    primary: ArchetypeKey,
    secondary: ArchetypeKey,
    finalAnswers: Record<number, string>
  ) => {
    if (!user) return;
    setSaving(true);
    try {
      const pairKey = `${primary}_${secondary}` as PairKey;
      const positioning = POSITIONING_MATRIX[pairKey];
      await supabase.from('user_diagnostics').upsert({
        user_id: user.id,
        diagnostic_id: 3,
        diagnostic_name: 'Brand Personality',
        score: computed[primary],
        result_data: {
          scores: computed,
          primary,
          secondary,
          positioning_identity: positioning?.identity,
          authority_signature: positioning?.signature,
          answers: finalAnswers,
        },
        is_completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,diagnostic_id' });
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateName.trim() || !gateEmail.trim() || gatePassword.length < 6) {
      setGateError('Please fill all fields. Password must be at least 6 characters.');
      return;
    }
    setGateLoading(true);
    setGateError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email: gateEmail.trim(),
        password: gatePassword,
        options: { data: { full_name: gateName.trim() } },
      });
      if (error) { setGateError(error.message); return; }
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: gateEmail.trim(),
          full_name: gateName.trim(),
          plan: 'free',
          brand_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        setUser(data.user);
        setUserProfile({ full_name: gateName.trim(), plan: 'free' });
        setIsProUser(false);
        setShowGate(false);
        if (scores && primaryKey && secondaryKey) {
          await saveResults(scores, primaryKey, secondaryKey, answers);
        }
        setFeedback({ type: 'success', message: 'Account created! Your full report is now unlocked.' });
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err: any) {
      setGateError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setGateLoading(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!primaryKey || !secondaryKey || !scores) return;
    setShareLoading(true);
    setShareError('');
    try {
      const pairKey = `${primaryKey}_${secondaryKey}` as PairKey;
      const positioning = POSITIONING_MATRIX[pairKey] || { identity: 'Brand', signature: '' };
      const primaryMeta = ARCHETYPE_META[primaryKey];
      const secondaryMeta = ARCHETYPE_META[secondaryKey];
      const userName = userProfile?.full_name || user?.email?.split('@')[0] || 'Your Brand';
      const file = await createShareCardFile(
        {
          eyebrow: 'BRAND PERSONALITY · BRANDPAWA.COM',
          title: positioning.identity.toUpperCase(),
          subtitle: `${primaryMeta.label} + ${secondaryMeta.label}`,
          accentStart: primaryMeta.accentStart,
          accentEnd: primaryMeta.accentEnd,
          badge: 'AUTHORITY SIGNATURE',
          highlight: positioning.signature.length > 42 ? positioning.signature.substring(0, 42) + '...' : positioning.signature,
          footer: `${userName} · brandpawa.com`,
        },
        `brandpawa-personality-${primaryKey.toLowerCase()}-${secondaryKey.toLowerCase()}`
      );
      const shared = await shareViaNative({
        title: `My Brand Personality: ${positioning.identity}`,
        text: `I just discovered I'm a ${positioning.identity} — ${primaryMeta.label} + ${secondaryMeta.label}. Find out yours at brandpawa.com`,
        url: 'https://brandpawa.com',
        file,
      });
      if (!shared) downloadFile(file);
    } catch (err: any) {
      setShareError('Could not generate card. Try again.');
    } finally {
      setShareLoading(false);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
    if (!primaryKey || !secondaryKey) return;
    const pairKey = `${primaryKey}_${secondaryKey}` as PairKey;
    const positioning = POSITIONING_MATRIX[pairKey] || { identity: 'Brand', signature: '' };
    openSocialComposer(platform, {
      title: `My Brand Personality: ${positioning.identity}`,
      text: `Just discovered my brand archetype — ${ARCHETYPE_META[primaryKey].label} + ${ARCHETYPE_META[secondaryKey].label} = ${positioning.identity}. Find yours at`,
      url: 'https://brandpawa.com',
    });
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResults(false);
    setScores(null);
    setPrimaryKey(null);
    setSecondaryKey(null);
    setHasExistingResult(false);
    setShowGate(false);
  };

  const progress = showResults ? 100 : Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);
  const pairKey = primaryKey && secondaryKey ? `${primaryKey}_${secondaryKey}` as PairKey : null;
  const positioning = pairKey ? (POSITIONING_MATRIX[pairKey] || { identity: 'Brand', signature: '' }) : null;
  const primaryMeta = primaryKey ? ARCHETYPE_META[primaryKey] : null;
  const secondaryMeta = secondaryKey ? ARCHETYPE_META[secondaryKey] : null;
  const proPlaybook = primaryKey ? PRO_PLAYBOOK[primaryKey] : null;
  const isLoggedIn = !!user;

  if (!authChecked) return <BrandLoader />;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e0f7fe 0%, #f0f9ff 40%, #faf5ff 100%)' }}>
      <Head>
        <title>Brand Personality Quiz | BrandPawa</title>
        <meta name="description" content="Discover your brand archetype — the personality that makes your brand magnetic and commands the market." />
      </Head>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-cyan-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => isLoggedIn ? router.push('/dashboard?section=diagnostics') : router.push('/quizzes')}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-cyan-700 transition"
          >
            <FiArrowLeft size={16} />
            {isLoggedIn ? 'Back to Dashboard' : 'Back to Quizzes'}
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
            Brand Personality
          </span>
          {isLoggedIn ? (
            <span className="text-xs text-gray-400 font-medium hidden sm:block">
              {userProfile?.full_name || user?.email?.split('@')[0]}
            </span>
          ) : (
            <button
              onClick={() => router.push('/?auth=login')}
              className="text-xs font-semibold text-cyan-700 hover:underline"
            >
              Log in
            </button>
          )}
        </div>
      </nav>

      {/* Feedback toast */}
      {feedback && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          <FiCheck size={14} /> {feedback.message}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 pt-8 pb-24">

        {/* ─── QUIZ SCREEN ─── */}
        {!showResults && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-4">
                <FiZap size={11} /> Discovery Quiz · Free
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                Brand Personality Diagnostic
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                10 questions. No fluff. Your brand archetype in under 4 minutes.
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
                <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                <span>{progress}% complete</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #0ABCFE, #7c3aed)' }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className={`rounded-3xl bg-white border border-gray-100 shadow-[0_8px_40px_rgba(10,188,254,0.10)] p-6 sm:p-8 transition-all duration-280 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <p className="text-base sm:text-lg font-bold text-gray-900 mb-6 leading-snug">
                {QUESTIONS[currentQuestion].text}
              </p>

              <div className="flex flex-col gap-3">
                {QUESTIONS[currentQuestion].options.map((opt) => {
                  const isSelected = selectedOption === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectOption(opt.label)}
                      className={`group w-full text-left rounded-2xl border-2 px-4 py-3.5 flex items-start gap-3 transition-all duration-200 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50 shadow-md'
                          : 'border-gray-100 bg-gray-50 hover:border-cyan-300 hover:bg-cyan-50/50'
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected ? 'text-white' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-cyan-300 group-hover:text-cyan-600'
                        }`}
                        style={isSelected ? { background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' } : {}}
                      >
                        {isSelected ? <FiCheck size={12} /> : opt.label}
                      </span>
                      <span className={`text-sm sm:text-base leading-snug ${isSelected ? 'text-cyan-900 font-medium' : 'text-gray-700'}`}>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  disabled={currentQuestion === 0 || animating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
                >
                  <FiChevronRight size={16} className="rotate-180" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedOption || animating}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all shadow-sm hover:shadow-md active:scale-[0.97]"
                  style={selectedOption ? { background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' } : { backgroundColor: '#e5e7eb', color: '#9ca3af' }}
                >
                  {currentQuestion < QUESTIONS.length - 1 ? <><span>Next</span> <FiChevronRight size={15} /></> : <><span>See My Results</span> <FiZap size={13} /></>}
                </button>
              </div>
            </div>

            {!isLoggedIn && (
              <p className="text-center text-xs text-gray-400 mt-5">
                Already have an account?{' '}
                <button onClick={() => router.push('/?auth=login')} className="text-cyan-600 font-semibold hover:underline">
                  Log in to save your results
                </button>
              </p>
            )}
          </div>
        )}

        {/* ─── RESULTS SCREEN ─── */}
        {showResults && primaryKey && secondaryKey && scores && primaryMeta && secondaryMeta && (
          <div>

            {/* TIER 1: Guest Teaser */}
            {!isLoggedIn && (
              <div>
                <div
                  className="rounded-3xl text-white p-8 sm:p-10 mb-6 relative overflow-hidden shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${primaryMeta.accentStart}, ${primaryMeta.accentEnd})` }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.10), transparent 60%)' }} />
                  <div className="relative">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest mb-4">
                      Your Dominant Archetype
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{primaryMeta.label}</h2>
                    <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">{primaryMeta.tagline}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-sm font-bold">
                      <FiTrendingUp size={13} />
                      Dominant Archetype Identified
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 mb-4">
                  <p className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed italic">
                    &ldquo;{primaryMeta.teaserHook}&rdquo;
                  </p>
                </div>

                {/* Blurred lock preview */}
                <div className="relative rounded-2xl overflow-hidden mb-6 border border-gray-100">
                  <div className="filter blur-sm pointer-events-none select-none p-6 bg-white">
                    <div className="h-5 bg-gray-200 rounded-lg mb-3 w-1/3" />
                    <div className="h-8 bg-gray-300 rounded-lg mb-2 w-2/3" />
                    <div className="h-4 bg-gray-100 rounded mb-1 w-full" />
                    <div className="h-4 bg-gray-100 rounded mb-4 w-3/4" />
                    <div className="h-10 bg-amber-100 rounded-xl w-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/90 flex flex-col items-center justify-end pb-6">
                    <FiLock size={22} className="text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Supporting Archetype, Positioning Formula & Gap Analysis locked</p>
                  </div>
                </div>
              </div>
            )}

            {/* TIER 2 + 3: Logged-in full report */}
            {isLoggedIn && positioning && (
              <div>
                {/* Identity header */}
                <div
                  className="rounded-3xl text-white p-8 sm:p-10 mb-6 relative overflow-hidden shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${primaryMeta.accentStart}, ${primaryMeta.accentEnd})` }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.10), transparent 60%)' }} />
                  <div className="relative">
                    {hasExistingResult && (
                      <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/15 text-white/80 text-xs font-bold uppercase tracking-widest">Saved Result</span>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-white/20 border border-white/25 text-white/95 text-xs font-bold uppercase tracking-widest">Primary: {primaryMeta.label}</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-bold uppercase tracking-widest">+ {secondaryMeta.label}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{positioning.identity.toUpperCase()}</h2>
                    <p className="text-white/75 text-sm leading-relaxed max-w-lg">&ldquo;{positioning.signature}&rdquo;</p>
                  </div>
                </div>

                {/* Score bars */}
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Archetype Score Distribution</h3>
                  <div className="flex flex-col gap-3">
                    {getRankedArchetypes(scores).map((key, i) => {
                      const maxPossible = 150;
                      const pct = Math.min(Math.round((scores[key] / maxPossible) * 100), 100);
                      const meta = ARCHETYPE_META[key];
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="w-28 text-xs font-semibold text-gray-600 flex-shrink-0">
                            {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : ''}{meta.name.replace('The ', '')}
                          </span>
                          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: i === 0
                                  ? `linear-gradient(90deg, ${meta.accentStart}, ${meta.accentEnd})`
                                  : i === 1
                                  ? `linear-gradient(90deg, ${meta.accentStart}99, ${meta.accentEnd}99)`
                                  : '#e5e7eb',
                                transition: 'width 0.7s ease',
                              }}
                            />
                          </div>
                          <span className="w-10 text-right text-xs font-bold text-gray-500">{scores[key]}pts</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary deep dive */}
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Primary Archetype Analysis</h3>
                  <h4 className="text-lg font-black text-gray-900 mb-3">{primaryMeta.label}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{primaryMeta.description}</p>
                </div>

                {/* Supporting archetype */}
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Supporting Archetype Integration</h3>
                  <h4 className="text-lg font-black text-gray-900 mb-3">{secondaryMeta.label}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Your <strong>{secondaryMeta.name}</strong> layer balances your primary {primaryMeta.name} energy — preventing your dominant traits from becoming liabilities. Your <strong>{positioning.identity}</strong> positioning is defined precisely by how these two forces work together.
                  </p>
                </div>

                {/* Authority gap */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-4 flex gap-3">
                  <FiAlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-700">1-Line Authority Gap Alert</span>
                    <p className="text-amber-900 text-sm font-medium mt-1 leading-snug">{primaryMeta.gap}</p>
                  </div>
                </div>

                {/* Scorecard CTA */}
                <div
                  className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  style={{ background: 'linear-gradient(135deg, rgba(10,188,254,0.08), rgba(124,58,237,0.08))' }}
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm mb-1">Exportable Brand Scorecard</p>
                    <p className="text-gray-500 text-xs leading-snug">Download a branded image to share your Positioning Identity on social media.</p>
                    {shareError && <p className="text-red-500 text-xs mt-1">{shareError}</p>}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      onClick={handleDownloadCard}
                      disabled={shareLoading}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow transition-all active:scale-[0.97] disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' }}
                    >
                      <FiDownload size={14} /> {shareLoading ? 'Generating...' : 'Download Card'}
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-cyan-700 bg-white border border-cyan-200 shadow-sm transition hover:shadow-md"
                    >
                      <FiShare2 size={14} /> Share Result
                    </button>
                  </div>
                </div>

                {/* TIER 3: Pro Playbook */}
                {isProUser && proPlaybook ? (
                  <div className="rounded-3xl border border-cyan-200 bg-white shadow-lg overflow-hidden mb-6">
                    <div
                      className="px-6 py-5 flex items-center gap-3"
                      style={{ background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' }}
                    >
                      <FiStar className="text-white" size={18} />
                      <div>
                        <p className="text-white font-black text-base">Brand Activation Playbook</p>
                        <p className="text-white/70 text-xs">Personalised execution blueprint for {positioning.identity}</p>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50">
                      {([
                        { key: 'voice' as const, label: 'Voice Lexicon' },
                        { key: 'content' as const, label: 'Content Engine' },
                        { key: 'visual' as const, label: 'Visual Specs' },
                        { key: 'counter' as const, label: 'Counter-Position' },
                      ]).map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveProTab(tab.key)}
                          className={`flex-shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-widest transition border-b-2 ${activeProTab === tab.key ? 'border-cyan-500 text-cyan-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6">
                      {activeProTab === 'voice' && (
                        <div>
                          <div className="mb-5">
                            <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                              10 Power Phrases — USE These
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {proPlaybook.powerWords.map(word => (
                                <span key={word} className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">{word}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                              10 Banned Phrases — AVOID These
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {proPlaybook.bannedWords.map(word => (
                                <span key={word} className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold line-through decoration-red-400">{word}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeProTab === 'content' && (
                        <div className="flex flex-col gap-4">
                          {proPlaybook.contentHooks.map((hook, i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className="w-6 h-6 rounded-lg text-xs font-black text-white flex items-center justify-center flex-shrink-0"
                                  style={{ background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' }}
                                >
                                  {i + 1}
                                </span>
                                <span className="text-sm font-black text-gray-900">{hook.title}</span>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed pl-8">{hook.prompt}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeProTab === 'visual' && (
                        <div className="flex flex-col gap-4">
                          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            <h4 className="text-sm font-black text-gray-900 mb-2">Visual & Layout Direction</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{proPlaybook.visualDirection}</p>
                          </div>
                          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            <h4 className="text-sm font-black text-gray-900 mb-2">Typography Direction</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{proPlaybook.typography}</p>
                          </div>
                          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            <h4 className="text-sm font-black text-gray-900 mb-2">Archetype Colour Accent</h4>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="w-10 h-10 rounded-xl shadow" style={{ background: primaryMeta.accentStart }} />
                              <div className="w-10 h-10 rounded-xl shadow" style={{ background: primaryMeta.accentEnd }} />
                              <span className="text-xs text-gray-500 font-medium">{primaryMeta.name} identity tones</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeProTab === 'counter' && (
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                          <h4 className="text-sm font-black text-gray-900 mb-3">Competitive Counter-Positioning Rulebook</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{proPlaybook.counterPositioning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  !isProUser && (
                    <div className="rounded-3xl border-2 border-dashed border-cyan-200 bg-cyan-50/50 p-8 mb-6 text-center">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' }}
                      >
                        <FiLock className="text-white" size={20} />
                      </div>
                      <h3 className="text-base font-black text-gray-900 mb-2">Unlock the Brand Activation Playbook</h3>
                      <p className="text-gray-500 text-sm mb-4 max-w-xs mx-auto leading-relaxed">
                        Get your Voice Lexicon, 5 Content Engine hooks, Visual Style specs, and Competitive Counter-Positioning rules — all tuned to your exact {positioning.identity} archetype.
                      </p>
                      <button
                        onClick={() => router.push('/dashboard/billing')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' }}
                      >
                        <FiUnlock size={14} /> Upgrade to Pro
                      </button>
                    </div>
                  )
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={handleRetake}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <FiRefreshCw size={13} /> Retake Quiz
                  </button>
                  <button
                    onClick={() => router.push('/dashboard?section=diagnostics')}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 shadow-sm hover:shadow-md transition"
                  >
                    View All Quizzes <FiArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* GUEST GATE OVERLAY */}
            {showGate && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div
                    className="px-6 pt-8 pb-5 text-white text-center relative"
                    style={{ background: `linear-gradient(135deg, ${primaryMeta.accentStart}, ${primaryMeta.accentEnd})` }}
                  >
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.12), transparent 60%)' }} />
                    <p className="relative text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Your Dominant Archetype</p>
                    <h2 className="relative text-2xl font-black mb-1">{primaryMeta.label}</h2>
                    <p className="relative text-white/80 text-xs max-w-xs mx-auto leading-snug mt-2">
                      Create a free account to reveal your Supporting Archetype, full Positioning Formula, and exportable Brand Card.
                    </p>
                  </div>

                  <div className="px-6 py-6">
                    <div className="flex flex-col gap-2 mb-5">
                      {[
                        'Supporting Archetype & full score breakdown',
                        'Your Positioning Identity title',
                        'Authority Signature & gap alert',
                        'Downloadable Brand Scorecard',
                      ].map(item => (
                        <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                          <FiCheck className="text-emerald-500 flex-shrink-0" size={14} />
                          {item}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleGateSubmit} className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={gateName}
                        onChange={e => setGateName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={gateEmail}
                        onChange={e => setGateEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                      />
                      <div className="relative">
                        <input
                          type={gateShowPassword ? 'text' : 'password'}
                          placeholder="Create Password (min 6 chars)"
                          value={gatePassword}
                          onChange={e => setGatePassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setGateShowPassword(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {gateShowPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>

                      {gateError && (
                        <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                          <FiAlertCircle size={12} /> {gateError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={gateLoading}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-lg transition active:scale-[0.97] disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' }}
                      >
                        {gateLoading ? 'Creating account...' : 'Unlock My Full Report — Free \u2192'}
                      </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-4">
                      Already have an account?{' '}
                      <button
                        onClick={() => router.push('/?auth=login&redirect=/dashboard/diagnostic/3')}
                        className="text-cyan-600 font-semibold hover:underline"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 relative">
            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
              <FiX size={18} />
            </button>
            <h3 className="font-black text-gray-900 text-base mb-1">Share Your Result</h3>
            {positioning && (
              <p className="text-sm text-gray-500 mb-5">Let your network know you&apos;re a <strong>{positioning.identity}</strong>.</p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-sm font-semibold hover:bg-sky-100 transition"
              >
                <FiTwitter size={16} /> Share on X / Twitter
              </button>
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition"
              >
                <FiLinkedin size={16} /> Share on LinkedIn
              </button>
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition"
              >
                <BsWhatsapp size={16} /> Share via WhatsApp
              </button>
              <button
                onClick={handleDownloadCard}
                disabled={shareLoading}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-semibold transition active:scale-[0.97] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #0ABCFE, #7c3aed)' }}
              >
                <FiDownload size={16} /> {shareLoading ? 'Generating...' : 'Download Brand Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
