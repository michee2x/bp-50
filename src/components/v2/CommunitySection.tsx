import React, { useEffect, useRef } from 'react';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={20} height={20} className={className} aria-hidden="true">
      <path d="M3.505 2.365A41.369 41.369 0 0 1 9 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 0 0-.577-.069 43.141 43.141 0 0 0-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 0 1 5 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914Z" />
      <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 0 0 1.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0 0 14 6Z" />
    </svg>
  );
}

function PaperAirplaneIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={20} height={20} className={className} aria-hidden="true">
      <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
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

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={14} height={14} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

const iconMap = { ChatIcon, PaperAirplaneIcon, UsersIcon } as const;
type CommunityIconName = keyof typeof iconMap;

// ─── Data ─────────────────────────────────────────────────────────────────────
const communities: {
  name: string;
  label: string;
  href: string;
  color: string;
  description: string;
  icon: CommunityIconName;
}[] = [
  {
    name: 'WhatsApp',
    label: 'Join community',
    href: 'https://chat.whatsapp.com/JFhzaTnEjOD9vUan4KbCzx?mode=gi_t',
    color: 'bg-green-500',
    description: 'Join our active WhatsApp community for real-time brand discussions and peer support.',
    icon: 'ChatIcon',
  },
  {
    name: 'Telegram',
    label: 'Join community',
    href: 'https://t.me/BrandPawa',
    color: 'bg-blue-500',
    description: 'Follow our Telegram channel for brand insights, updates, and exclusive content.',
    icon: 'PaperAirplaneIcon',
  },
  {
    name: 'Facebook',
    label: 'Join community',
    href: 'https://web.facebook.com/groups/brandpawa',
    color: 'bg-blue-700',
    description: 'Connect with the BrandPawa Facebook group for community discussions and brand support.',
    icon: 'UsersIcon',
  },
];

export default function CommunitySection() {
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
          }, i * 120);
          observer.unobserve(el);
        });
      },
      { threshold: 0.08 }
    );

    allEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="community" className="py-28 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headRef} className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">BrandPawa Tribe</p>
          <h2 className="text-section-xl font-serif font-light leading-none mb-4">
            Join the communities{' '}
            <span className="italic">building with BrandPawa.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Stay close to builders growing with clarity, consistency, and brand momentum across our community channels.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {communities.map((c, i) => {
            const IconComponent = iconMap[c.icon];
            return (
              <div key={c.name} ref={(el) => { cardRefs.current[i] = el; }}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="community-card flex flex-col gap-5 h-full"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center`}>
                      <IconComponent className="text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                      {c.name}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{c.name} Community</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-accent">
                    {c.label}
                    <ArrowRightIcon />
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
