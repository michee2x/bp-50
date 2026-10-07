import React, { useEffect, useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Measure Strength',
    body: 'Take the BrandPawa Test to see where your brand really stands today.',
  },
  {
    number: '02',
    title: 'Discover Fit',
    body: 'Quick quizzes reveal what works for your brand: the right colors, archetype, platform strategy, and visual style.',
  },
  {
    number: '03',
    title: 'Identify the Gap',
    body: "We show you what's working, what's missing, and what's quietly killing your growth.",
  },
  {
    number: '04',
    title: 'Execute with Precision',
    body: 'Take action with guided challenges, systems, and next-step execution paths to close gaps and accelerate growth.',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLDivElement[];

    // Set initial hidden state
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
      el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
    });

    // Reveal on scroll via IntersectionObserver (replaces GSAP ScrollTrigger)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLDivElement;
          const i = els.indexOf(el);
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 120); // stagger: 120ms per item (same as GSAP delay: i * 0.12)
          observer.unobserve(el);
        });
      },
      { threshold: 0.12 } // ~"top 88%" equivalent
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-28 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Process</p>
            <h2 className="text-section-xl font-serif font-light leading-none">
              Brand Growth,{' '}
              <span className="italic">Systemized.</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-lg">
            Most brands work hard but grow slow because they&apos;re guessing. BrandPawa replaces guesswork with structure, insight, and execution.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="relative bg-card border border-border rounded-2xl p-8 flex flex-col gap-6 hover:border-accent transition-colors duration-300 group"
            >
              {/* Connector line — desktop only */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 -right-3 w-6 h-px bg-border z-10" />
              )}
              <div className="step-number">{step.number}</div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
