import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={16} height={16} className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={16} height={16} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Pricing data ─────────────────────────────────────────────────────────────
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Understand your brand',
    monthlyPrice: null as number | null,
    yearlyPrice: null as number | null,
    cta: 'Start Free',
    ctaVariant: 'outline',
    popular: false,
    features: [
      'Basic BrandPawa Score',
      'Color Power Quiz',
      'Brand Personality Quiz',
      'Limited Results Insight',
      '7-Day Visibility Challenge',
      'Basic Dashboard & Email Summary',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Build your brand',
    monthlyPrice: 4999,
    yearlyPrice: Math.round(4999 * 12 * 0.83),
    cta: 'Upgrade to Growth',
    ctaVariant: 'primary',
    popular: true,
    features: [
      'Everything in Starter',
      'Full Brand Score Breakdown',
      'All Quizzes + Core Diagnostics',
      '14-Day & 30-Day Challenges',
      'Growth Dashboard (Track Progress)',
      'Downloadable PDF Reports',
      'Content & Positioning Guidance',
    ],
  },
  {
    id: 'authority',
    name: 'Authority',
    tagline: 'Dominate your category',
    monthlyPrice: 14999,
    yearlyPrice: Math.round(14999 * 12 * 0.83),
    cta: 'Go Authority',
    ctaVariant: 'outline',
    popular: false,
    features: [
      'Everything in Growth',
      'Advanced Diagnostics & Authority Engine',
      'Authority Score System',
      'Premium Challenges (Authority, Growth)',
      'Custom Brand Guides & Strategy Insights',
      'Priority Support',
    ],
  },
];

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // Initial hidden state
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
    });

    // IntersectionObserver replaces GSAP ScrollTrigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLDivElement;
          const i = els.indexOf(el);
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 120); // 120ms stagger matches GSAP delay: i * 0.12
          observer.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const getPrice = (plan: (typeof plans)[0]) => {
    if (!plan.monthlyPrice) return 'Free';
    if (billing === 'yearly') {
      return `₦${Math.round(plan.monthlyPrice * 0.83).toLocaleString()}`;
    }
    return `₦${plan.monthlyPrice.toLocaleString()}`;
  };

  return (
    <section id="pricing" ref={sectionRef} className="py-28 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Pricing</p>
          <h2 className="text-section-xl font-serif font-light leading-none mb-6">
            Simple, <span className="italic">Transparent</span> Pricing
          </h2>
          <p className="text-base text-muted-foreground max-w-md mx-auto mb-8">
            Start free. Upgrade when you&apos;re ready to go deeper.
          </p>

          {/* Billing toggle */}
          <div className="toggle-pill inline-flex">
            <button
              onClick={() => setBilling('monthly')}
              className={`toggle-option ${billing === 'monthly' ? 'active' : ''}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`toggle-option ${billing === 'yearly' ? 'active' : ''}`}
            >
              Yearly
              <span className="ml-1.5 text-accent text-xs font-bold">−17%</span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`relative flex flex-col rounded-2xl overflow-hidden ${
                plan.popular
                  ? 'pricing-card-popular shadow-2xl'
                  : 'bg-card border border-border'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-5 right-5">
                  <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-accent text-accent-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 flex-1">
                {/* Plan name */}
                <div className="mb-8">
                  <h3 className={`text-2xl font-semibold mb-1 ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-white/50' : 'text-muted-foreground'}`}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {getPrice(plan)}
                    </span>
                    {plan.monthlyPrice && (
                      <span className={`text-sm mb-1 ${plan.popular ? 'text-white/40' : 'text-muted-foreground'}`}>
                        /mo
                      </span>
                    )}
                  </div>
                  {billing === 'yearly' && plan.monthlyPrice && (
                    <p className={`text-xs mt-1 ${plan.popular ? 'text-white/40' : 'text-muted-foreground'}`}>
                      Billed ₦{Math.round(plan.monthlyPrice * 0.83 * 12).toLocaleString()}/year
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <CheckIcon className="shrink-0 mt-0.5 text-accent" />
                      <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-8 pb-8">
                <Link
                  href="#hero"
                  className={`block w-full text-center py-3 rounded-full text-sm font-semibold transition-all ${
                    plan.ctaVariant === 'primary'
                      ? 'bg-accent text-accent-foreground hover:opacity-90'
                      : plan.popular
                      ? 'border border-white/20 text-primary-foreground hover:bg-white/10'
                      : 'border border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Why Upgrade banner */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Why Upgrade?</p>
            <p className="text-base text-white/80 font-light max-w-xl leading-relaxed">
              Most brands don&apos;t fail because they lack effort. They fail because they lack clarity, positioning, and systems. BrandPawa gives you all three.
            </p>
          </div>
          <Link
            href="#hero"
            className="shrink-0 inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Go Premium
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
