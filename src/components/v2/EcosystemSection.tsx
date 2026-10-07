import React, { useEffect, useRef } from 'react';

// ─── Inline SVG icons (replaces AppIcon) ────────────────────────────────────
function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={20} height={20} className={className} aria-hidden="true">
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 9.5 6ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5a1.5 1.5 0 0 0 3 0v-5A1.5 1.5 0 0 0 3.5 10Z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={20} height={20} className={className} aria-hidden="true">
      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
    </svg>
  );
}

function RocketLaunchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={20} height={20} className={className} aria-hidden="true">
      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192Z" />
      <path d="M3 5.75A2.75 2.75 0 0 1 5.75 3h1.836a.75.75 0 0 1 0 1.5H5.75c-.69 0-1.25.56-1.25 1.25v8.5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-1.836a.75.75 0 0 1 1.5 0V14.25A2.75 2.75 0 0 1 14.25 17H5.75A2.75 2.75 0 0 1 3 14.25V5.75Z" />
    </svg>
  );
}

function LightBulbIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={20} height={20} className={className} aria-hidden="true">
      <path d="M10 1a6 6 0 0 1 3.182 11.073A1 1 0 0 1 12 13H8a1 1 0 0 1-1.182-.927A6 6 0 0 1 10 1ZM8.55 14.5h2.9a.75.75 0 0 1 0 1.5h-2.9a.75.75 0 0 1 0-1.5ZM9 17.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 9 17.25Z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={20} height={20} className={className} aria-hidden="true">
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.015-.18 6.5 6.5 0 0 1 13 0 .79.79 0 0 1-.015.18A.5.5 0 0 1 14.1 17H.9a.5.5 0 0 1-.485-.572ZM14.5 16h2.5a.5.5 0 0 0 .5-.5 5.5 5.5 0 0 0-6.191-5.473A.75.75 0 0 1 11 9.5a4 4 0 0 1 0 8h-.5a.75.75 0 0 1 0-1.5h.5Z" />
    </svg>
  );
}

const iconMap = { ChartBarIcon, SparklesIcon, RocketLaunchIcon, LightBulbIcon, UsersIcon } as const;
type IconName = keyof typeof iconMap;

// ─── Bento card data ─────────────────────────────────────────────────────────
const cards: {
  id: string;
  title: string;
  body: string;
  icon: IconName;
  tag: string;
  colSpan: string;
  rowSpan: string;
  variant: 'dark' | 'accent' | 'muted' | 'light';
}[] = [
  {
    id: 'test',
    title: 'BrandPawa Test',
    body: "A structured test that measures your brand's real strength, positioning and growth readiness.",
    icon: 'ChartBarIcon',
    tag: 'Core Diagnostic',
    colSpan: 'lg:col-span-1',
    rowSpan: 'lg:row-span-2',
    variant: 'dark',
  },
  {
    id: 'quizzes',
    title: 'Discovery Quizzes',
    body: 'Fast, focused quizzes that decode what fits your brand — from color psychology to platform strategy to brand personality.',
    icon: 'SparklesIcon',
    tag: 'Insight Engine',
    colSpan: 'lg:col-span-1',
    rowSpan: 'lg:row-span-1',
    variant: 'light',
  },
  {
    id: 'challenges',
    title: 'Guided Growth Challenges',
    body: 'Step-by-step execution programs that translate insights into tangible results: audience growth, authority building, and revenue.',
    icon: 'RocketLaunchIcon',
    tag: 'Execution',
    colSpan: 'lg:col-span-1',
    rowSpan: 'lg:row-span-1',
    variant: 'accent',
  },
  {
    id: 'strategy',
    title: 'Brand Strategy & Intelligence',
    body: 'Strategic frameworks that sharpen your positioning, messaging, and market perception so you stand out, not blend in.',
    icon: 'LightBulbIcon',
    tag: 'Strategy',
    colSpan: 'lg:col-span-2',
    rowSpan: 'lg:row-span-1',
    variant: 'light',
  },
  {
    id: 'talent',
    title: 'Talent & Resources',
    body: 'Pre-vetted designers, marketers, and strategists ready to execute when you need expert hands on deck. Plus structured brand education for builders who want to master growth.',
    icon: 'UsersIcon',
    tag: 'Coming Soon',
    colSpan: 'lg:col-span-3',
    rowSpan: 'lg:row-span-1',
    variant: 'muted',
  },
];

export default function EcosystemSection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLDivElement[];

    // Set initial hidden state
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
          }, i * 80); // 80ms stagger matches GSAP delay: i * 0.08
          observer.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="ecosystem" className="py-28 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Ecosystem</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-section-xl font-serif font-light leading-none max-w-xl">
              One Platform.{' '}
              <span className="italic">Everything Your Brand Runs On.</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
              BrandPawa moves you from measurement to clarity to execution without breaking the flow of your brand decisions.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {cards.map((card, i) => {
            const isDark   = card.variant === 'dark';
            const isAccent = card.variant === 'accent';
            const isMuted  = card.variant === 'muted';
            const IconComponent = iconMap[card.icon];

            let cardClass = '';
            if (isDark)       cardClass = 'bento-card-dark h-full flex flex-col justify-between min-h-64';
            else if (isAccent) cardClass = 'bento-card-accent h-full flex flex-col justify-between min-h-52';
            else if (isMuted)  cardClass = 'bento-card h-full flex flex-col md:flex-row md:items-center md:gap-10 min-h-40 bg-muted';
            else               cardClass = 'bento-card h-full flex flex-col justify-between min-h-52';

            return (
              <div
                key={card.id}
                ref={(el) => { itemRefs.current[i] = el; }}
                className={`${card.colSpan} ${card.rowSpan} ${cardClass}`}
              >
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between">
                    {/* Icon wrapper */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark   ? 'bg-white/10'  :
                      isAccent ? 'bg-black/10'  :
                      'bg-secondary'
                    }`}>
                      <IconComponent
                        className={
                          isDark   ? 'text-accent'            :
                          isAccent ? 'text-accent-foreground' :
                          'text-foreground'
                        }
                      />
                    </div>

                    {/* Tag badge */}
                    <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                      isDark   ? 'bg-white/10 text-white/60'                         :
                      isAccent ? 'bg-black/10 text-accent-foreground/70'             :
                      isMuted  ? 'bg-border text-muted-foreground'                   :
                                 'bg-secondary text-muted-foreground'
                    }`}>
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-card-lg font-semibold mb-2 ${
                      isDark   ? 'text-primary-foreground' :
                      isAccent ? 'text-accent-foreground'  :
                      'text-foreground'
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      isDark   ? 'text-white/60'            :
                      isAccent ? 'text-accent-foreground/70':
                      'text-muted-foreground'
                    }`}>
                      {card.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
