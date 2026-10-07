import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={16} height={16} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowTopRightOnSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={16} height={16} aria-hidden="true">
      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm6.5-3a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V3.56l-3.97 3.97a.75.75 0 0 1-1.06-1.06l3.97-3.97h-1.69a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const children = sectionRef.current?.querySelectorAll('.cta-reveal');
    if (!children) return;

    children.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = '0';
      htmlEl.style.transform = 'translateY(40px)';
      htmlEl.style.transition = `opacity 1s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const childEls = entry.target.querySelectorAll('.cta-reveal');
          childEls.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.opacity = '1';
            htmlEl.style.transform = 'translateY(0)';
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
      className="py-28 px-6 text-center relative overflow-hidden"
      style={{ backgroundColor: '#0D0D0D', color: '#FAFAF8' }}
    >
      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] max-w-[1200px] aspect-square rounded-full pointer-events-none" style={{ border: '1px solid rgba(255,255,255,0.05)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] aspect-square rounded-full pointer-events-none" style={{ border: '1px solid rgba(255,255,255,0.05)' }} />

      <div className="max-w-3xl mx-auto relative">
        <p className="cta-reveal text-xs font-bold tracking-widest uppercase mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Stop the Guesswork
        </p>
        <h2 className="cta-reveal text-section-xl font-serif font-light leading-none mb-6" style={{ color: '#FAFAF8' }}>
          Stop the Guesswork.{' '}
          <span className="italic gold-gradient-text">Build with Structure.</span>
        </h2>
        <p className="cta-reveal text-lg font-light leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Your brand already has potential. BrandPawa helps you unlock it.
        </p>
        <div className="cta-reveal flex flex-wrap gap-4 justify-center">
          <Link
            href="#hero"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#D4A853', color: '#0D0D0D' }}
          >
            Take the BrandPawa Test
            <ArrowRightIcon />
          </Link>
          <a
            href="https://t.me/BrandPawa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#FAFAF8', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Join the BrandPawa Tribe
            <ArrowTopRightOnSquareIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
