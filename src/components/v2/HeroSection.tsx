import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const leaderboard = [
  { rank: 1, name: 'Ada C.', score: 91, color: 'bg-accent' },
  { rank: 2, name: 'Maya O.', score: 84, color: 'bg-primary' },
  { rank: 3, name: 'David A.', score: 77, color: 'bg-secondary' },
];

// Inline SVG icons — no AppIcon dependency
function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={16} height={16} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={16} height={16} aria-hidden="true">
      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
    </svg>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const leaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // CSS-based staggered entrance — no GSAP dependency needed
    const els: { el: Element | null; delay: number }[] = [
      { el: tagRef.current,    delay: 200 },
      { el: line1Ref.current,  delay: 400 },
      { el: line2Ref.current,  delay: 550 },
      { el: subRef.current,    delay: 900 },
      { el: ctaRef.current,    delay: 1100 },
      { el: leaderRef.current, delay: 1300 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    els.forEach(({ el, delay }) => {
      if (!el) return;
      // Start hidden
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(24px)';
      (el as HTMLElement).style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';

      const t = setTimeout(() => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, delay);
      timers.push(t);
    });

    // Reveal-inner text lines
    [line1Ref, line2Ref].forEach((ref, i) => {
      const inner = ref.current;
      if (!inner) return;
      (inner as HTMLElement).style.transform = 'translateY(100%)';
      (inner as HTMLElement).style.transition = `transform 1.4s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.15}s`;
      const t = setTimeout(() => {
        (inner as HTMLElement).style.transform = 'translateY(0%)';
      }, (0.4 + i * 0.15) * 1000);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 px-6 overflow-hidden bg-background"
    >
      {/* Decorative rings */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] aspect-square rounded-full border border-border opacity-30 pointer-events-none"
        style={{ borderWidth: '0.5px' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[600px] aspect-square rounded-full border border-border opacity-20 pointer-events-none"
        style={{ borderWidth: '0.5px' }}
      />

      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-5xl">
          {/* Tag */}
          <div
            ref={tagRef}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-xs font-bold tracking-widest uppercase text-muted-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            The #1 Brand Operating System
            <span className="ml-1 opacity-50">— Take the tour</span>
          </div>

          {/* Headline */}
          <h1 className="text-hero-xl font-serif font-light mb-6 leading-none tracking-tight">
            <div className="reveal-overflow mb-1">
              <span ref={line1Ref} className="reveal-inner block">
                Build a Brand
              </span>
            </div>
            <div className="reveal-overflow">
              <span ref={line2Ref} className="reveal-inner block italic gold-gradient-text">
                that Wins.
              </span>
            </div>
          </h1>

          {/* Subheadline */}
          <div ref={subRef} className="mb-10">
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl leading-relaxed">
              BrandPawa is the brand operating system for founders, creators, and businesses that intend to{' '}
              <span className="text-foreground font-medium">own attention</span>,{' '}
              <span className="text-foreground font-medium">earn trust</span>, and{' '}
              <span className="text-foreground font-medium">scale with precision</span>.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 mb-16">
            <Link
              href="#ecosystem"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Take the BrandPawa Test
              <ArrowRightIcon />
            </Link>
            <Link
              href="#ecosystem"
              className="inline-flex items-center gap-2 border border-border text-foreground px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-secondary transition-colors"
            >
              Start a Quiz
              <SparklesIcon />
            </Link>
          </div>

          {/* Leaderboard */}
          <div ref={leaderRef} className="inline-block">
            <div className="bg-card border border-border rounded-2xl p-5 min-w-72">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Leaderboard</p>
                <span className="text-xs text-muted-foreground">Top scores this week</span>
              </div>
              <div className="space-y-1">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className="leaderboard-row">
                    <span className="text-xs font-bold text-muted-foreground w-4">{entry.rank}</span>
                    <div className={`w-6 h-6 rounded-full ${entry.color} flex items-center justify-center`}>
                      <span className="text-[10px] font-bold text-primary-foreground">{entry.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground flex-1">{entry.name}</span>
                    <span className="text-sm font-bold text-accent">{entry.score}</span>
                    <span className="text-xs text-muted-foreground">BrandPawa Score</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical scroll hint */}
      <div className="absolute bottom-10 right-8 hidden lg:flex flex-col items-center gap-3">
        <span className="vertical-text-label">Scroll to explore</span>
        <div className="w-px h-16 bg-border" />
      </div>
    </section>
  );
}
