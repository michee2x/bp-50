import React, { useEffect, useRef } from 'react';

const logos = [
  { src: 'https://www.brandpawa.com/logos/emeka-nobis-logo.png', alt: 'Emeka Nobis logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/jamie-pajoel-black.png', alt: 'Jamie Pajoel logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/jpi-logo.png', alt: 'JPI logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/tedx-ada-george-road-youth.png', alt: 'TEDx Ada George Road Youth logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/made-in-nigeria.png', alt: 'Made In Nigeria logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/talkaholic-unlimited.png', alt: 'Talkaholic Unlimited logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/bereeth-travel-and-tours.png', alt: 'Bereeth Travel & Tours logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/yali-rlc-logo-1.png', alt: 'YALI RLC logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/promptearn-blue-green.png', alt: 'PromptEarn logo — trusted BrandPawa partner' },
  { src: 'https://www.brandpawa.com/logos/kobabayc-logo.png', alt: 'KOBABAYC logo — trusted BrandPawa partner' },
];

export default function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refs = [headRef.current, founderRef.current].filter(Boolean) as HTMLDivElement[];

    refs.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLDivElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );

    refs.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="trust" ref={sectionRef} className="py-28 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Trust</p>
          <h2 className="text-section-xl font-serif font-light leading-none mb-4">
            Trusted by builders shaping{' '}
            <span className="italic">the next generation.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            BrandPawa is trusted by founders, creators, and organizations building the future of African brands.
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-24">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center p-4 bg-card border border-border rounded-xl hover:border-accent transition-colors duration-300 h-16"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        {/* Founder's Note */}
        <div
          ref={founderRef}
          id="about"
          className="grid lg:grid-cols-2 gap-12 items-center rounded-3xl p-10 lg:p-14"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-6">From The Founder&apos;s Desk</p>
            <h3 className="text-section-xl font-serif font-light italic leading-none mb-8">
              Building the Brand Infrastructure for Africa
            </h3>
            <p className="text-base text-white/70 font-light leading-relaxed mb-8">
              Our vision is to become the brand infrastructure layer for Africa, giving millions of businesses the clarity, power, and systems to compete globally.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-sm font-bold text-accent-foreground">D</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-foreground">Dunamis Shiloh Okonwor</p>
                <p className="text-xs text-white/40">Founder, BrandPawa</p>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="font-serif text-5xl italic font-light text-accent">BP</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                Africa&apos;s #1
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
