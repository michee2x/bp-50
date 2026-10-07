import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={16} height={16} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowTopRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={16} height={16} aria-hidden="true">
      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5ZM10 3a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V4.56l-4.72 4.72a.75.75 0 1 1-1.06-1.06l4.72-4.72H10.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
    </svg>
  );
}

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const children = Array.from(
      sectionRef.current.querySelectorAll<HTMLElement>('.cta-reveal')
    );

    // Initial hidden state
    children.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // Stagger children sequentially
          children.forEach((el, i) => {
            setTimeout(() => {
              el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, i * 150); // 150ms stagger matches GSAP stagger: 0.15
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 px-6 bg-primary text-primary-foreground text-center relative overflow-hidden"
    >
      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] max-w-[1200px] aspect-square rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] aspect-square rounded-full border border-white/5 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <p className="cta-reveal text-xs font-bold tracking-widest uppercase text-white/40 mb-6">
          Stop the Guesswork
        </p>
        <h2 className="cta-reveal text-section-xl font-serif font-light leading-none mb-6">
          Stop the Guesswork.{' '}
          <span className="italic gold-gradient-text">Build with Structure.</span>
        </h2>
        <p className="cta-reveal text-lg text-white/70 font-light leading-relaxed mb-10 max-w-xl mx-auto">
          Your brand already has potential. BrandPawa helps you unlock it.
        </p>
        <div className="cta-reveal flex flex-wrap gap-4 justify-center">
          <Link
            href="#hero"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Take the BrandPawa Test
            <ArrowRightIcon />
          </Link>
          <a
            href="https://t.me/BrandPawa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 text-primary-foreground px-8 py-4 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Join the BrandPawa Tribe
            <ArrowTopRightIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
