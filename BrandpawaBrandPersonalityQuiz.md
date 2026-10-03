# BrandPawa Brand Personality Quiz
## (Updated Architecture)

This update refines the entire diagnostic flow. It leverages our #0ABCFE Cyan Blue UI taxonomy for Discovery Quizzes and implements progressive access control. Unverified or non-logged-in visitors receive an immediate hook, logged-in users receive deeper strategic value, and paid members unlock full execution blueprints.

---

## Access Control & Feature Hierarchy

- [ Non-Logged In User ] ──> Takes Quiz ──> Gets Teaser Scorecard (Gated at Output)
- [ Free Verified User ] ──> Unlocks Full Primary/Secondary Analysis + Shareable Card
- [ Paid / Pro Member ] ──> Unlocks Full Playbook, Content Prompts & Activation Blueprint

### 1. Non-Logged-In Users (The Hook)

- **Access Level:** Can take all 10 questions without friction.
- **On Completion Output:**
  - Displays the Primary Archetype Label (e.g., "THE STRATEGIST").
  - Shows a blurred breakdown of the Supporting Archetype and Behavioral Rules.
  - **Hard Gate Overlay:** "Enter your email to verify and reveal your Supporting Archetype, Full Breakdown, and Exportable Social Card."

### 2. Logged-In / Verified Users (Free Level)

- **Access Level:** Persistent saving to workspace, unblurred Archetype breakdown.
- **On Completion Output:**
  - Primary & Secondary Archetype Analysis (What it signals, who it attracts).
  - Positioning Alignment Formula (e.g., Strategist + Authority = "Strategic Authority").
  - Exportable Brand Scorecard Image formatted for social sharing.
  - 1-Line Authority Gap Alert (e.g., "Gap Detected: High strategy, low public proof").

### 3. Paid / Pro Tier (Execution Level)

- **Access Level:** Full Activation Playbook.
- **On Completion Output:**
  - **Brand Voice Lexicon:** 10 Words your brand should use, 10 words to ban.
  - **5 Content Pillars & Prompts** configured specifically to your archetype combo.
  - **Visual & Style Archetype Specs:** Color psychology, typography pairs, and layout rules that match your personality.
  - **Competitive Counter-Positioning Rules:** How to out-position competitors using your exact personality traits.

---

## Diagnostic Inputs & Frictionless Onboarding

- **Non-Logged In (Input Modal at End of Quiz):**
  - Full Name (Input)
  - Email Address (Input)
  - Account Creation Password (Input)
- **Logged In (Automatically Pulled from Workspace):**
  - Industry / Business Category
  - Current Business Stage (Early / Growth / Scale)
  - Primary Audience (B2B / B2C / Premium)

---

## Questions & Logic Map (10 Questions)

Each selection awards +10 points to the primary mapped personality and +5 spillover points to a complementary personality to ensure nuanced secondary results.

**Legend:**

- AUT: The Authority
- STR: The Strategist
- PER: The Performer
- NUR: The Nurturer
- VIS: The Visionary
- BUI: The Builder

### Q1. How should clients describe your brand after working with you?

- **A.** "They command total authority and know precisely what they are doing."
  - Primary: AUT (+10) | Spillover: STR (+5)
- **B.** "They think deeply, give clear frameworks, and simplify complexity."
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** "They move fast, eliminate friction, and drive immediate results."
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** "They truly care, support us personally, and build safety."
  - Primary: NUR (+10) | Spillover: PER (+5)
- **E.** "They see around corners and show us the future of our industry."
  - Primary: VIS (+10) | Spillover: STR (+5)
- **F.** "They execute constantly, test new ideas, and build in real time."
  - Primary: BUI (+10) | Spillover: VIS (+5)

### Q2. What is your brand's primary weapon of influence?

- **A.** Confidence, high standards, and explicit command.
  - Primary: AUT (+10) | Spillover: PER (+5)
- **B.** Proven logic, proprietary systems, and structured breakdowns.
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** Public wins, speed, case studies, and performance proof.
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** Reassurance, genuine empathy, and long-term relationships.
  - Primary: NUR (+10) | Spillover: STR (+5)
- **E.** Bold ideas, challenging the status quo, and high-concept strategy.
  - Primary: VIS (+10) | Spillover: AUT (+5)
- **F.** Live creation, constant iterations, and building in the open.
  - Primary: BUI (+10) | Spillover: PER (+5)

### Q3. Which internal motto defines how your business operates?

- **A.** "Follow our lead—we've mastered this terrain."
  - Primary: AUT (+10) | Spillover: STR (+5)
- **B.** "Measure twice, cut once—strategy dictates execution."
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** "Speed wins—out-execute the competition daily."
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** "People first—growth is a byproduct of trust."
  - Primary: NUR (+10) | Spillover: PER (+5)
- **E.** "Invent the future before someone else forces you to adapt."
  - Primary: VIS (+10) | Spillover: BUI (+5)
- **F.** "Stop overthinking—build it, launch it, refine it."
  - Primary: BUI (+10) | Spillover: PER (+5)

### Q4. What communication tone feels most natural for your content?

- **A.** Bold, assertive, and direct—zero fluff.
  - Primary: AUT (+10) | Spillover: PER (+5)
- **B.** Clear, analytical, educational, and structured.
  - Primary: STR (+10) | Spillover: NUR (+5)
- **C.** High-energy, motivating, punchy, and result-focused.
  - Primary: PER (+10) | Spillover: AUT (+5)
- **D.** Warm, accessible, encouraging, and deeply relatable.
  - Primary: NUR (+10) | Spillover: STR (+5)
- **E.** Thought-provoking, inspiring, poetic, and forward-looking.
  - Primary: VIS (+10) | Spillover: STR (+5)
- **F.** Practical, candid, experimental, and transparent.
  - Primary: BUI (+10) | Spillover: VIS (+5)

### Q5. How should clients feel right after making a payment to you?

- **A.** "I am paying an elite specialist who commands the market."
  - Primary: AUT (+10) | Spillover: STR (+5)
- **B.** "This was a logical, risk-free, highly intelligent investment."
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** "I'm about to see rapid momentum and immediate ROI."
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** "I am in safe hands with someone who genuinely has my back."
  - Primary: NUR (+10) | Spillover: STR (+5)
- **E.** "I am gaining access to a transformational, next-level vision."
  - Primary: VIS (+10) | Spillover: AUT (+5)
- **F.** "I am part of an active building process that gets things done."
  - Primary: BUI (+10) | Spillover: PER (+5)

### Q6. What industry behavior frustrates you the most?

- **A.** Timid creators who lack opinions or compromise on standards.
  - Primary: AUT (+10) | Spillover: STR (+5)
- **B.** Shallow surface-level tips and advice without root-cause thinking.
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** Slow, bureaucratic operators who talk without delivering metrics.
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** Transactional, cold businesses that treat customers like numbers.
  - Primary: NUR (+10) | Spillover: STR (+5)
- **E.** Copycat brands playing small and refusing to innovate.
  - Primary: VIS (+10) | Spillover: AUT (+5)
- **F.** Endless planning sessions and strategy decks with no tangible output.
  - Primary: BUI (+10) | Spillover: PER (+5)

### Q7. What content format drives the best response for your brand?

- **A.** Strong commentary, teardowns, and industry positions.
  - Primary: AUT (+10) | Spillover: STR (+5)
- **B.** Step-by-step breakdowns, visual frameworks, and tactical guides.
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** Before-and-after transformations, metrics, and client wins.
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** Q&As, community spotlights, behind-the-scenes support, and lessons.
  - Primary: NUR (+10) | Spillover: STR (+5)
- **E.** Big-picture essays, manifesto posts, and future trend predictions.
  - Primary: VIS (+10) | Spillover: AUT (+5)
- **F.** "Build in public" updates, experiment logs, and product walkthroughs.
  - Primary: BUI (+10) | Spillover: PER (+5)

### Q8. What type of buyer is naturally drawn to your business?

- **A.** Decision-makers who want an expert to tell them what to do.
  - Primary: AUT (+10) | Spillover: STR (+5)
- **B.** Analytical buyers who need clarity and structured solutions.
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** High-intent buyers who need fast execution and measurable growth.
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** Clients seeking a trusted mentor and long-term partner.
  - Primary: NUR (+10) | Spillover: STR (+5)
- **E.** Early adopters and pioneers who want to stay ahead of the curve.
  - Primary: VIS (+10) | Spillover: AUT (+5)
- **F.** Doers and builders who want practical assets and tools.
  - Primary: BUI (+10) | Spillover: PER (+5)

### Q9. What does market victory look like for your brand?

- **A.** Being recognized as the undisputed benchmark in our space.
  - Primary: AUT (+10) | Spillover: STR (+5)
- **B.** Owning the intellectual framework and methodology everyone uses.
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** Setting the industry record for speed, efficiency, and customer ROI.
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** Cultivating the most loyal, active community of advocacy.
  - Primary: NUR (+10) | Spillover: PER (+5)
- **E.** Redefining the category and creating a new standard of value.
  - Primary: VIS (+10) | Spillover: STR (+5)
- **F.** Creating an interconnected engine of products, tools, and assets.
  - Primary: BUI (+10) | Spillover: VIS (+5)

### Q10. In a room full of competitors, your brand is the one that:

- **A.** Captures the room instantly when speaking.
  - Primary: AUT (+10) | Spillover: STR (+5)
- **B.** Maps out the hidden problem everyone else missed.
  - Primary: STR (+10) | Spillover: AUT (+5)
- **C.** Shows up with receipts, data, and closed deals.
  - Primary: PER (+10) | Spillover: BUI (+5)
- **D.** Makes everyone feel welcomed, heard, and supported.
  - Primary: NUR (+10) | Spillover: STR (+5)
- **E.** Challenges standard thinking and proposes a new path.
  - Primary: VIS (+10) | Spillover: AUT (+5)
- **F.** Is already building the solution while others are still debating.
  - Primary: BUI (+10) | Spillover: PER (+5)

---

## Positioning Matrix (Auto-Generated Formulas)

The system calculates the highest and second-highest scores to assign a precise positioning title:

| Primary | Secondary | Positioning Identity | Authority Signature |
|---|---|---|---|
| Strategist | Authority | Strategic Authority | "Calculated clarity backed by decisive leadership." |
| Strategist | Builder | Systems Architect | "Methodical thinking turned into repeatable engines." |
| Authority | Performer | Market Commander | "High-status execution with zero tolerance for mediocrity." |
| Visionary | Strategist | Category Pioneer | "Future-focused concepts mapped into executable blueprints." |
| Builder | Performer | Execution Engine | "Unstoppable momentum that builds and scales in public." |
| Nurturer | Authority | Trusted Advisor | "Deep human connection paired with unwavering standard." |

---

## Result Screen Delivery Architecture

```
+---------------------------------------------------------------------------+
| [FREE TEASER - NON-LOGGED IN]                                             |
| Your Dominant Archetype: THE STRATEGIST                                   |
| "You bring deep clarity, logical frameworks, and structured thinking."    |
|                                                                           |
| [!] Enter your email to reveal your Secondary Archetype & Social Card     |
| [ Sign Up To Unlock Free Report → ]                                       |
+---------------------------------------------------------------------------+


+---------------------------------------------------------------------------+
| [FREE FULL REPORT - LOGGED IN]                                            |
| Primary Archetype: THE STRATEGIST (75 pts)                                |
| Supporting Archetype: THE AUTHORITY (60 pts)                              |
| Position Title: STRATEGIC AUTHORITY                                       |
|                                                                           |
| Authority Gap: Your strategy is clear, but public proof is lagging.       |
| [ Download Exportable Card ] | [ Run Positioning Diagnostic → ]           |
+---------------------------------------------------------------------------+


+---------------------------------------------------------------------------+
| [PAID PRO BLUEPRINT - SUBSCRIBERS]                                        |
| • 10 Approved Voice Words / 10 Banned Cliché Words                        |
| • 5 Custom Content Prompts for Strategic Authorities                      |
| • Visual Identity Specs (Typography, Layout Rules, Color Direction)       |
| • Competitive Counter-Positioning Manual                                  |
+---------------------------------------------------------------------------+
```

---

## The Complete 30-Pairing Matrix (Positioning Identity & Authority Signatures)

When the diagnostic engine calculates the top two scores, it auto-generates the user's Positioning Identity and Authority Signature:

| Primary | Secondary | Positioning Identity | Authority Signature |
|---|---|---|---|
| Authority | Strategist | Dominant Architect | "High-status leadership backed by bulletproof, logical frameworks." |
| Authority | Performer | Market Commander | "Decisive direction that drives rapid, measurable results." |
| Authority | Nurturer | Protective Leader | "Uncompromising standards balanced with deep advocate protection." |
| Authority | Visionary | Industry Sovereign | "Bending the future through sheer market presence and conviction." |
| Authority | Builder | Operational Giant | "Commanding authority established through visible, relentless execution." |
| Strategist | Authority | Strategic Authority | "Calculated clarity backed by decisive, high-value leadership." |
| Strategist | Performer | Efficiency Architect | "Systemic thinking optimized for fast, undeniable performance." |
| Strategist | Nurturer | Guided Mentor | "Structured clarity that safely leads clients out of complexity." |
| Strategist | Visionary | Category Pioneer | "Future-focused concepts mapped into clean, executable blueprints." |
| Strategist | Builder | Systems Architect | "Methodical logic engineered into repeatable, scalable engines." |
| Performer | Authority | Proof Sovereign | "Unstoppable velocity backed by high-status market standards." |
| Performer | Strategist | Tactical Operator | "High-speed execution guided by sharp, strategic precision." |
| Performer | Nurturer | Results Advocate | "Relentless drive to secure win after win for their community." |
| Performer | Visionary | Breakthrough Force | "Fast-moving execution that brings futuristic ideas into reality." |
| Performer | Builder | Execution Engine | "Pure, unadulterated momentum that builds and scales in public." |
| Nurturer | Authority | Trusted Advisor | "Deep human connection paired with an unwavering, elite standard." |
| Nurturer | Strategist | Clarity Guide | "Compassionate support backed by clear, step-by-step direction." |
| Nurturer | Performer | Impact Champion | "Heart-centered service fueled by rapid, visible transformation." |
| Nurturer | Visionary | Empowerment Catalyst | "Nurturing communities to embrace and inhabit a bigger future." |
| Nurturer | Builder | Community Craftsman | "Hands-on care that builds safe, highly engaging spaces." |
| Visionary | Authority | Market Prophet | "Bold predictions delivered with absolute, unquestioned conviction." |
| Visionary | Strategist | Futurist Strategist | "High-level category transformation backed by logical roadmaps." |
| Visionary | Performer | Disruptive Vector | "Radical concepts deployed into the market with intense speed." |
| Visionary | Nurturer | Movement Builder | "Inspiring a legacy vision that deeply protects and elevates people." |
| Visionary | Builder | Innovation Lab | "Imagining bold possibilities and immediately building prototype systems." |
| Builder | Authority | Foundational Leader | "Proving authority not by talking, but by what they've built." |
| Builder | Strategist | Engine Craftsman | "Practical execution governed by deep system architecture." |
| Builder | Performer | Velocity Maker | "Building in public with aggressive, high-converting speed." |
| Builder | Nurturer | User-Centric Builder | "Relentlessly shipping tools shaped directly by client feedback." |
| Builder | Visionary | Prototyping Pioneer | "Constantly launching experimental products that shape tomorrow." |

---

## Non-Logged-In User Output (The Conversion Hook)

When an unauthenticated user completes the 10 questions, they land on a Teaser View:

- **Primary Archetype Badge:** Displays their primary archetype name and raw score percentage (e.g., THE STRATEGIST — 85% Match).
- **The High-Level Hook:** A 2-sentence summary of how they operate (e.g., "You compete on clarity and frameworks rather than hype. Clients trust you because you make complex problems look simple.").
- **The Gated Overlay (Hard Wall):**
  - The Supporting Archetype, Positioning Identity, Authority Gap, and Shareable Card are blurred out.
  - **CTA Modal:** "Enter your email to verify your workspace, unlock your full Positioning Formula, and download your exportable Brand Card."

---

## Free Verified User Output (Value & Social Currency)

Once logged in/verified, the full breakdown unlocks inside their workspace:

### A. Archetype Profile

- **Primary Archetype Analysis:** Deep breakdown of how their dominant archetype shows up in messaging, sales calls, and content.
- **Supporting Archetype Integration:** How their secondary archetype balances their primary (e.g., "Your Authority stops your Strategy from sounding like an academic textbook").
- **Positioning Identity Title:** The official title from the matrix above (e.g., Strategic Authority).
- **Authority Signature:** Their 1-sentence brand positioning statement.

### B. Diagnostic Gap Analysis (The Bridge to Platform Features)

The system automatically detects their Gaps & Vulnerabilities based on their primary type:

- **Authority Lead:** Gap: Can sound arrogant or distant if unbacked by client empathy.
- **Strategist Lead:** Gap: Over-analyzes content; lacks high-converting, direct sales offers.
- **Performer Lead:** Gap: Chases short-term metrics; lacks a deep, lasting brand narrative.
- **Nurturer Lead:** Gap: Struggles with undercharging and setting firm client boundaries.
- **Visionary Lead:** Gap: Sells abstract concepts that confuse everyday buyers.
- **Builder Lead:** Gap: Focuses too much on features/tools instead of business positioning.

### C. Exportable Social Scorecard

A dynamic 1080x1350 downloadable image displaying:

- User Name, Photo & Brand Name
- Primary + Secondary Archetype Tags
- Overall Positioning Identity Title
- brandpawa.com verification badge & QR code

---

## 4. Paid / Pro Tier Output (The Complete Execution Blueprint)

Paid subscribers receive the Brand Activation Playbook, converting diagnostic data into immediate operational assets:

### A. Brand Voice Lexicon

- **10 Power Phrases to Use:** Specific vocabulary that reinforces their exact pairing (e.g., for Strategic Authority: "The framework," "Root-cause," "Non-negotiable," "Architecting," "Systemic gap").
- **10 Banned Phrases:** Industry clichés that ruin their credibility (e.g., "Hustle hard," "Secret sauce," "Game-changer").

### B. 5-Pillar Content Engine

Custom content hooks designed for their exact identity:

1. **The Teardown Hook:** How to critique industry mistakes using their archetype.
2. **The Framework Hook:** How to turn their daily work into shareable visual diagrams.
3. **The Proof Hook:** How to present client results without sounding boastful.
4. **The Belief Hook:** How to share opinions that polarize competitors and attract ideal clients.
5. **The Offer Hook:** How to pitch their core service or product naturally.

### C. Visual & Style Guidelines

- **Typography Direction:** Font pairing suggestions (e.g., Serif headers for Authority, Clean Geometric Sans for Builder).
- **UI/Layout Rules:** Preferred layout density, visual balance, and image style recommendations.

### D. Competitive Counter-Positioning Rules

A step-by-step breakdown on how to out-position competitors who are using louder, hype-driven marketing by leaning heavily into their diagnostic strengths.

---
---

# How the Backend Delivers Pro Output for the Brand Personality Quiz

## 1. The Automated AI Prompt Template (Recommended for Pro Tier)

When a Pro user finishes the quiz, your backend takes their calculated results (e.g., Primary: Strategist, Secondary: Authority, Positioning: Strategic Authority) and sends them to your AI pipeline (using OpenAI API, Anthropic, or PawaAI).

**Backend Prompt Template Example:**

```plaintext
System: You are PawaAI, the Brand Intelligence Engine.
Input: User Archetype = Primary: [Primary], Secondary: [Secondary], Positioning Title: [Title].
Generate the Pro Activation Playbook for this exact combination:
1. Brand Voice Lexicon: 10 power words to use, 10 banned cliché words.
2. 5 Content Engine Hooks: Provide 5 tailored content templates (Teardown, Framework,
Proof, Belief, Offer) matching this archetype.
3. Visual & Style Guidelines: Recommend header typography styles, UI layout density, and
visual mood rules.
4. Competitive Counter-Positioning Rules: How to out-position competitors using this
identity.
Format the output cleanly in JSON so the frontend can render it inside card components.
```

## The Zero-Cost Technical Architecture

```
[ User Finishes Diagnostic ] ──> Frontend Calculates Top 2 Archetypes
                                              │
                                              ▼
                                [ Local JSON Lookup Engine ]
                                              │
                                              ▼
                                [ Renders Instant Pro Blueprint UI ]
```