import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={10} height={10} className={className} aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={18} height={18} className={className} aria-hidden="true">
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 9.5 6ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5a1.5 1.5 0 0 0 3 0v-5A1.5 1.5 0 0 0 3.5 10Z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={18} height={18} className={className} aria-hidden="true">
      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
    </svg>
  );
}

function RocketLaunchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={18} height={18} className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-2.08-1.287V9.394c0-.244.065-.487.195-.787l.001-.003A31.31 31.31 0 0 0 9.664 1.319Zm3.394 10.727c.01.06.018.12.022.18a6.85 6.85 0 0 1-.035.695.75.75 0 0 1-.516.61l-2.25.75a.75.75 0 0 1-.926-.57L8.5 11.4a31.688 31.688 0 0 0 3.386 1.53c.058.022.12.046.172.116ZM7.364 9.575l-.002.003-.003.003-.003.003a.75.75 0 0 1-.53.22H3.75a.75.75 0 0 1-.75-.75V5.625a.75.75 0 0 1 .22-.53l.003-.003.003-.003.003-.002A41.036 41.036 0 0 1 7.84 1.319a.75.75 0 0 1 .826 1.236 31.508 31.508 0 0 0-3.303 7.02Z" clipRule="evenodd" />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={18} height={18} className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  );
}

const solutionIconMap = { ChartBarIcon, SparklesIcon, RocketLaunchIcon, CogIcon } as const;
type SolutionIconName = keyof typeof solutionIconMap;

// ─── Data ────────────────────────────────────────────────────────────────────
const problems = [
  'Why they keep showing up but nothing converts',
  "What's actually blocking their growth",
  'Where their credibility and positioning breaks down',
  'What to fix first — before doing more',
];

const solutions: { icon: SolutionIconName; label: string; desc: string }[] = [
  { icon: 'ChartBarIcon',    label: 'The BrandPawa Test',       desc: 'see exactly where you stand' },
  { icon: 'SparklesIcon',    label: 'Discovery Quizzes',         desc: 'clarity on every key brand decision' },
  { icon: 'RocketLaunchIcon',label: 'Guided Growth Challenges',  desc: 'structured execution, not random action' },
  { icon: 'CogIcon',         label: 'Automation Tools',          desc: 'consistent brand presence without burnout' },
];

export default function WhyBrandPawaSection() {
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refs = [leftRef.current, rightRef.current].filter(Boolean) as HTMLDivElement[];

    // Initial hidden state
    refs.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
      el.style.transition = 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)';
    });

    // IntersectionObserver replaces GSAP ScrollTrigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLDivElement;
          const i = refs.indexOf(el);
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 150); // 150ms stagger matches GSAP delay: i * 0.15
          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    refs.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why" className="py-28 px-6 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Why BrandPawa</p>
          <h2 className="text-section-xl font-serif font-light leading-none max-w-3xl">
            You&apos;re Doing the Work.{' '}
            <span className="italic gold-gradient-text">So Why Isn&apos;t It Working?</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ── Problem (left) ── */}
          <div ref={leftRef} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-white/20" />
                <p className="text-sm font-semibold text-white/50 uppercase tracking-widest">The Problem</p>
              </div>
              <p className="text-xl font-light text-white/70 leading-relaxed mb-10">
                Most brands are active but not aligned. Most brands don&apos;t know:
              </p>
              <div>
                {problems.map((p, i) => (
                  <div
                    key={i}
                    className="problem-item"
                    style={{ borderBottomColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <XMarkIcon className="text-white/40" />
                    </div>
                    <p className="text-base text-white/70 font-light leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pull quote */}
            <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-sm text-white/50 font-light leading-relaxed italic">
                &ldquo;Most brands don&apos;t fail because they lack effort. They fail because they lack clarity, positioning, and systems.&rdquo;
              </p>
            </div>
          </div>

          {/* ── Solution (right) ── */}
          <div ref={rightRef} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-accent/60" />
                <p className="text-sm font-semibold text-accent uppercase tracking-widest">What BrandPawa Changes</p>
              </div>
              <p className="text-xl font-light text-white/80 leading-relaxed mb-10">
                BrandPawa ends the guesswork. We start with a diagnosis, not a template. Then we give you the strategy, execution system, and support to build a brand that compounds.
              </p>
              <div className="space-y-4">
                {solutions.map((s, i) => {
                  const IconComponent = solutionIconMap[s.icon];
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                        <IconComponent className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-foreground">{s.label}</p>
                        <p className="text-sm text-white/50">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                See How It Works
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
