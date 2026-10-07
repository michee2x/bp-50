import React, { useEffect, useRef } from 'react';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={22} height={22} className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.742-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z" clipRule="evenodd" />
    </svg>
  );
}

function AcademicCapIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={22} height={22} className={className} aria-hidden="true">
      <path d="M10.394 2.08a1 1 0 0 0-.788 0l-7 3a1 1 0 0 0 0 1.84L5.25 8.051a.999.999 0 0 1 .356-.257l4-1.714a1 1 0 1 1 .788 1.838l-2.727 1.17 1.94.831a1 1 0 0 0 .787 0l7-3a1 1 0 0 0 0-1.838l-7-3ZM3.31 9.397 5 10.12v4.102a8.969 8.969 0 0 0-1.05-.174 1 1 0 0 1-.89-.89 11.115 11.115 0 0 1 .25-3.762Zm5.99 7.176A9.026 9.026 0 0 0 10 17c.85 0 1.669-.105 2.452-.302L10 14.46l-2.268.97a.52.52 0 0 1-.432-.028ZM15.5 9.132l-1.19-.51v3.934a9.006 9.006 0 0 0 2.5-2.978 1.046 1.046 0 0 0-.12-.127 1 1 0 0 1-.23-.67c.027-.224.07-.445.127-.662Z" />
    </svg>
  );
}

const iconMap = { ShoppingBagIcon, AcademicCapIcon } as const;
type LearnIconName = keyof typeof iconMap;

// ─── Data ─────────────────────────────────────────────────────────────────────
const items: { name: string; tag: string; subtitle: string; body: string; icon: LearnIconName }[] = [
  {
    name: 'Shop',
    tag: 'Coming Soon',
    subtitle: 'Templates, guides, and operator resources',
    body: "We're packaging the most useful BrandPawa resources into sharper products that help builders move faster without losing strategic clarity.",
    icon: 'ShoppingBagIcon',
  },
  {
    name: 'MasterClass',
    tag: 'Coming Soon',
    subtitle: 'Structured learning for builders who want depth',
    body: 'MasterClass is being shaped as a focused learning path around brand operating systems, growth discipline, and authority-building execution.',
    icon: 'AcademicCapIcon',
  },
];

export default function LearnSection() {
  const headRef  = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const allEls = [headRef.current, ...cardRefs.current].filter(Boolean) as HTMLDivElement[];

    allEls.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLDivElement;
          const i  = allEls.indexOf(el);
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 150);
          observer.unobserve(el);
        });
      },
      { threshold: 0.08 }
    );

    allEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="learn" className="py-28 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headRef} className="mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Learn</p>
          <h2 className="text-section-xl font-serif font-light leading-none">
            Shop tools and MasterClass{' '}
            <span className="italic">experiences are on the way.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, i) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div
                key={item.name}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="relative bg-secondary border border-border rounded-2xl p-8 flex flex-col gap-5 overflow-hidden"
              >
                {/* Coming soon badge */}
                <div className="absolute top-5 right-5">
                  <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {item.tag}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                  <IconComponent className="text-accent" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm font-medium text-accent mb-3">{item.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>

                {/* Decorative pattern */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5">
                  <div className="w-full h-full rounded-tl-full border border-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
