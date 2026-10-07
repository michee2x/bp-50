import React, { useEffect, useRef } from 'react';

const audiences = [
  {
    tag: 'Built for operators',
    title: 'Founders and business owners',
    body: 'For builders shaping serious companies and brands with long-term market ambition.',
  },
  {
    tag: 'Made for creators',
    title: 'Creators building serious brands',
    body: 'For creators turning visibility into trust, systems, and stronger monetization.',
  },
  {
    tag: 'Designed for growth',
    title: 'Startups scaling beyond survival',
    body: 'For teams moving from survival mode into sharper positioning, traction, and market clarity.',
  },
  {
    tag: 'For experts',
    title: 'Consultants, coaches, and professionals',
    body: 'For experts building authority, premium perception, and repeatable demand around what they know.',
  },
];

export default function AudienceSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    // Initial hidden state
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
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
          }, i * 100); // 100ms stagger matches GSAP delay: i * 0.1
          observer.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="audience" className="py-28 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Audience</p>
          <h2 className="text-section-xl font-serif font-light leading-none max-w-2xl">
            Built for People Who{' '}
            <span className="italic">Play the Long Game.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {audiences.map((a, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="audience-card"
            >
              <div className="mb-4">
                <span className="audience-tag inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-secondary text-muted-foreground transition-all duration-300">
                  {a.tag}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 transition-colors duration-300">
                {a.title}
              </h3>
              <p className="audience-body text-sm text-muted-foreground leading-relaxed transition-colors duration-300">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
