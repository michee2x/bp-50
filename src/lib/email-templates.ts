// src/lib/email-templates.ts
// BrandPawa email HTML templates — Welcome Flow & Post-Test Flow

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://brandpawa-app.vercel.app';

const baseStyle = 'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#FAF0FF;margin:0;padding:0;';
const cardStyle = 'max-width:560px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(80,43,133,0.10);';
const headerStyle = 'background:linear-gradient(135deg,#28163f 0%,#5826a4 52%,#e4559f 100%);padding:36px 32px 28px;text-align:center;';
const bodyStyle = 'padding:32px;';
const footerStyle = 'padding:20px 32px;border-top:1px solid #f3e8ff;text-align:center;color:#94a3b8;font-size:12px;';
const ctaStyle = 'display:inline-block;background:linear-gradient(135deg,#5826a4,#e4559f);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;margin:20px 0 8px;';
const h2Style = 'color:#1e1040;font-size:20px;font-weight:700;margin:0 0 12px;';
const pStyle = 'color:#475569;font-size:15px;line-height:1.7;margin:0 0 16px;';
const boxStyle = 'background:#f5f0ff;border-left:4px solid #7c3aed;border-radius:8px;padding:16px 20px;margin:20px 0;';

function buildEmail(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}"><div style="${cardStyle}">
  <div style="${headerStyle}">
    <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">BrandPawa</div>
    <div style="font-size:10px;color:rgba(255,255,255,0.6);letter-spacing:3px;text-transform:uppercase;margin-top:4px;">The Brand Intelligence Layer</div>
  </div>
  <div style="${bodyStyle}">${content}</div>
  <div style="${footerStyle}"><p style="margin:0 0 4px;">&copy; 2026 BrandPawa. All rights reserved.</p><p style="margin:0;">Africa&apos;s Brand Infrastructure Engine</p></div>
</div></body></html>`;
}

// ─── WELCOME FLOW ─────────────────────────────────────────────────────────────

export function welcomeEmail1(name: string) {
  const firstName = name.split(' ')[0];
  return {
    subject: `${firstName}, your brand growth starts here`,
    html: buildEmail(`
      <h2 style="${h2Style}">Welcome to BrandPawa, ${firstName}.</h2>
      <p style="${pStyle}">You've just joined Africa's brand intelligence engine. That's not just a tagline — it's what we actually do.</p>
      <p style="${pStyle}">Most brands guess. They post, they hustle, they try things. BrandPawa ends the guessing. We start with a diagnosis — a real score — so you know exactly where your brand stands <em>today</em>.</p>
      <div style="${boxStyle}">
        <strong style="color:#5826a4;">Your first move:</strong>
        <p style="color:#475569;margin:8px 0 0;font-size:14px;">Take the BrandPawa Score Test. 10 questions. 2 minutes. You'll walk away knowing your brand's real strength score out of 100.</p>
      </div>
      <div style="text-align:center;"><a href="${APP_URL}/dashboard/diagnostic/1" style="${ctaStyle}">Take My BrandPawa Score</a></div>
      <p style="${pStyle}">— The BrandPawa Team</p>
    `),
  };
}

export function welcomeEmail2(name: string) {
  const firstName = name.split(' ')[0];
  return {
    subject: `The positioning mistake killing most African brands`,
    html: buildEmail(`
      <h2 style="${h2Style}">${firstName}, this is why most brands stay stuck.</h2>
      <p style="${pStyle}">They post consistently. They invest in graphics. They show up every day. And still — no real traction.</p>
      <p style="${pStyle}">The problem isn't effort. It's positioning. Most brands are loud but unclear. Active but not aligned. Visible but not trusted.</p>
      <div style="${boxStyle}">
        <strong style="color:#5826a4;">The #1 positioning mistake:</strong>
        <p style="color:#475569;margin:8px 0 0;font-size:14px;">Trying to speak to everyone and ending up speaking to no one. Sharp positioning isn't about shrinking your audience — it's about being undeniably clear to the right one.</p>
      </div>
      <p style="${pStyle}">BrandPawa's diagnostic tests surface exactly where your brand breaks down — and what to fix first.</p>
      <div style="text-align:center;"><a href="${APP_URL}/dashboard/diagnostic/1" style="${ctaStyle}">Run My Brand Diagnostic</a></div>
    `),
  };
}

export function welcomeEmail3(name: string) {
  const firstName = name.split(' ')[0];
  return {
    subject: `${firstName}, your brand might be stronger than you think… or not`,
    html: buildEmail(`
      <h2 style="${h2Style}">Only one way to find out, ${firstName}.</h2>
      <p style="${pStyle}">Most founders and creators assume they know where their brand stands. Some underestimate it. Some overestimate it. Almost none of them <em>actually know</em>.</p>
      <p style="${pStyle}">That's the gap BrandPawa fills. Not opinions. Not vibes. A structured diagnostic built around what actually determines brand growth.</p>
      <div style="${boxStyle}">
        <strong style="color:#5826a4;">What you get from a BrandPawa Score:</strong>
        <ul style="color:#475569;margin:8px 0 0;padding-left:20px;font-size:14px;line-height:1.8;">
          <li>Your overall brand strength score out of 100</li>
          <li>A 5-pillar breakdown: Positioning, Messaging, Identity, Influence, Growth</li>
          <li>Your brand stage: Dominant, Active, Emerging, or Weak Pawa</li>
          <li>Specific next steps based on your actual gaps</li>
        </ul>
      </div>
      <div style="text-align:center;"><a href="${APP_URL}/quizzes" style="${ctaStyle}">Explore All Quizzes &amp; Tests</a></div>
    `),
  };
}

// ─── POST-TEST FLOW ───────────────────────────────────────────────────────────

export function postTestEmail1(name: string, score: number, stage: string) {
  const firstName = name.split(' ')[0];
  const scoreColor = score >= 81 ? '#16a34a' : score >= 61 ? '#2563eb' : score >= 31 ? '#ca8a04' : '#dc2626';
  return {
    subject: `Your BrandPawa Score: ${score}/100 — here's what it means`,
    html: buildEmail(`
      <h2 style="${h2Style}">Your results are in, ${firstName}.</h2>
      <div style="text-align:center;background:#faf5ff;border-radius:16px;padding:24px;margin:20px 0;">
        <div style="font-size:72px;font-weight:900;color:${scoreColor};line-height:1;">${score}</div>
        <div style="color:#94a3b8;font-size:14px;margin-top:4px;">out of 100</div>
        <div style="display:inline-block;background:${scoreColor};color:#fff;padding:6px 16px;border-radius:99px;font-size:13px;font-weight:700;margin-top:12px;">${stage}</div>
      </div>
      <p style="${pStyle}">That score tells a story. Not a final verdict — a starting point. The brands that grow fastest aren't the ones who scored highest right now. They're the ones who used the diagnosis to act with precision.</p>
      <div style="${boxStyle}">
        <strong style="color:#5826a4;">Unlock your full breakdown (Pro):</strong>
        <ul style="color:#475569;margin:8px 0 0;padding-left:20px;font-size:14px;line-height:1.8;">
          <li>Full 5-pillar brand breakdown with specific action steps per pillar</li>
          <li>Personalized growth stage analysis</li>
          <li>Downloadable PDF brand report</li>
          <li>Access to all advanced diagnostics</li>
        </ul>
      </div>
      <div style="text-align:center;"><a href="${APP_URL}/dashboard/diagnostic/1" style="${ctaStyle}">View My Full Score Breakdown</a></div>
    `),
  };
}

export function postTestEmail2(name: string, score: number) {
  const firstName = name.split(' ')[0];
  const isStrong = score >= 61;
  return {
    subject: `What your ${score}/100 actually means for your brand`,
    html: buildEmail(`
      <h2 style="${h2Style}">Let's interpret your score, ${firstName}.</h2>
      <p style="${pStyle}">${isStrong
        ? `A score of ${score}/100 puts you ahead of most brands. You have real foundations — recognition, some conversion, presence. The question now is: what's your ceiling?`
        : `A score of ${score}/100 is honest data. Your brand has potential that isn't being fully activated — whether that's unclear messaging, inconsistent identity, or gaps in your visibility systems.`
      }</p>
      <p style="${pStyle}">The diagnostic maps out exactly where the gaps are across 5 brand pillars: Positioning, Messaging, Identity, Influence, and Growth.</p>
      <div style="${boxStyle}">
        <strong style="color:#5826a4;">Your next assessment:</strong>
        <p style="color:#475569;margin:8px 0 0;font-size:14px;">The Color Power Quiz and Brand Personality Quiz are both free and take under 5 minutes each. They reveal the visual and psychological layers of your brand.</p>
      </div>
      <div style="text-align:center;"><a href="${APP_URL}/quizzes" style="${ctaStyle}">Take My Next Quiz</a></div>
    `),
  };
}

export function postTestEmail3(name: string, score: number) {
  const firstName = name.split(' ')[0];
  return {
    subject: `What's actually holding your brand back, ${firstName}`,
    html: buildEmail(`
      <h2 style="${h2Style}">The gap between where you are and where you want to be.</h2>
      <p style="${pStyle}">You scored ${score}/100. There's a measurable distance between your brand's current state and its potential. What fills that gap?</p>
      <p style="${pStyle}">Not more content. Not a rebrand. Not more followers. Most brands that stall do so because they're executing without a system — moving fast in the wrong direction.</p>
      <div style="${boxStyle}">
        <strong style="color:#5826a4;">BrandPawa Challenges are built for this:</strong>
        <p style="color:#475569;margin:8px 0 0;font-size:14px;">Structured, day-by-day execution programs that turn brand gaps into brand wins. The 7-Day Visibility Challenge is free and starts the moment you join.</p>
      </div>
      <div style="text-align:center;"><a href="${APP_URL}/challenges" style="${ctaStyle}">Start a Growth Challenge</a></div>
      <p style="${pStyle}">Or upgrade to Growth to unlock your full pillar breakdown, PDF report, and all advanced diagnostics.</p>
      <div style="text-align:center;">
        <a href="${APP_URL}/dashboard/billing" style="display:inline-block;border:2px solid #7c3aed;color:#7c3aed;text-decoration:none;padding:12px 28px;border-radius:12px;font-weight:700;font-size:14px;">Upgrade to Growth Plan</a>
      </div>
    `),
  };
}

// ─── INACTIVE USER NUDGE ──────────────────────────────────────────────────────

export function inactiveNudgeEmail(name: string, score: number | null) {
  const firstName = name.split(' ')[0];
  return {
    subject: `${firstName}, you checked your score… then stopped.`,
    html: buildEmail(`
      <h2 style="${h2Style}">Your brand hasn't grown itself, ${firstName}.</h2>
      <p style="${pStyle}">${score
        ? `You took the BrandPawa Score and got ${score}/100. Then things got quiet.`
        : `You created your BrandPawa account. Then things got quiet.`
      }</p>
      <p style="${pStyle}">That's okay — life happens. But the gap between where your brand is and where it could be doesn't close on its own. It closes with precision and consistency.</p>
      <div style="${boxStyle}">
        <strong style="color:#5826a4;">Pick up where you left off:</strong>
        <p style="color:#475569;margin:8px 0 0;font-size:14px;">Your dashboard has your score, your progress, and your next recommended step — all waiting for you.</p>
      </div>
      <div style="text-align:center;"><a href="${APP_URL}/dashboard" style="${ctaStyle}">Back to My Dashboard</a></div>
    `),
  };
}
