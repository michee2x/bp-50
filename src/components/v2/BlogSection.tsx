import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
function ArrowRightIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={size} height={size} className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Article data ─────────────────────────────────────────────────────────────
const articles = [
  {
    title: '20 Brand Prophecies for 2026',
    excerpt: 'Twenty shifts shaping the brands that will win trust, attention, and commercial power in 2026.',
    author: 'Shiloh',
    href: '/blog/20-brand-prophecies-for-2026',
    image: 'https://images.pexels.com/photos/7821908/pexels-photo-7821908.jpeg?cs=srgb&dl=pexels-rdne-7821908.jpg&fm=jpg',
    category: 'Strategy',
  },
  {
    title: '5 Ways Branding Directly Drives Revenue Growth',
    excerpt: 'A clear brand is not decoration. It is a revenue system that pulls buyers in, protects pricing, and shortens your sales cycle.',
    author: 'Shiloh',
    href: '/blog/5-ways-branding-directly-drives-revenue-growth',
    image: 'https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg?cs=srgb&dl=pexels-startup-stock-photos-7097.jpg&fm=jpg',
    category: 'Revenue',
  },
  {
    title: 'Why Most African Businesses Are Invisible',
    excerpt: 'Many African businesses are not invisible because they lack funds. They are invisible because the brand is unclear.',
    author: 'Shiloh',
    href: '/blog/why-most-african-businesses-are-invisible',
    image: 'https://images.pexels.com/photos/6913217/pexels-photo-6913217.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-6913217.jpg&fm=jpg',
    category: 'Africa',
  },
  {
    title: 'The Difference Between a Brand That Gets Ignored and One That Gets Paid',
    excerpt: 'The gap between chasing clients and commanding premium fees is usually not talent. It is brand authority.',
    author: 'Shiloh',
    href: '/blog/the-difference-between-a-brand-that-gets-ignored-and-one-that-gets-paid',
    image: 'https://images.pexels.com/photos/11381964/pexels-photo-11381964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Authority',
  },
  {
    title: "You Don't Have a Marketing Problem. You Have a Brand Problem.",
    excerpt: 'Marketing amplifies whatever already exists. If the brand is weak, marketing only scales the confusion.',
    author: 'Shiloh',
    href: '/blog/you-do-not-have-a-marketing-problem-you-have-a-brand-problem',
    image: 'https://images.pexels.com/photos/29065467/pexels-photo-29065467.jpeg?cs=srgb&dl=pexels-leticiacurveloph-29065467.jpg&fm=jpg',
    category: 'Branding',
  },
];

export default function BlogSection() {
  const headRef  = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const allEls = [headRef.current, ...cardRefs.current].filter(Boolean) as HTMLDivElement[];

    allEls.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
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
          }, i * 80);
          observer.unobserve(el);
        });
      },
      { threshold: 0.08 }
    );

    allEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const [featured, ...restArticles] = articles;

  return (
    <section id="blog" className="py-28 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Blog</p>
            <h2 className="text-section-xl font-serif font-light leading-none">
              Ideas, insights, and brand{' '}
              <span className="italic">thinking worth revisiting.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors shrink-0"
          >
            View all posts
            <ArrowRightIcon size={16} />
          </Link>
        </div>

        {/* Featured article */}
        <div ref={(el) => { cardRefs.current[0] = el; }} className="mb-6 group">
          <Link
            href={featured.href}
            className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border hover:border-accent transition-colors duration-300 bg-card"
          >
            {/* Featured image */}
            <div className="blog-card-img relative aspect-video md:aspect-auto min-h-[240px] overflow-hidden">
              <img
                src={featured.image}
                alt={`${featured.title} — blog article cover`}
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-secondary text-muted-foreground mb-4">
                  {featured.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 group-hover:text-accent transition-colors leading-tight">
                  {featured.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{featured.excerpt}</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <span className="text-xs text-muted-foreground">Published by {featured.author}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  Read article <ArrowRightIcon size={12} />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Article grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {restArticles.map((article, i) => (
            <div
              key={article.href}
              ref={(el) => { cardRefs.current[i + 1] = el; }}
              className="group"
            >
              <Link
                href={article.href}
                className="block rounded-xl overflow-hidden border border-border hover:border-accent transition-colors duration-300 bg-card h-full flex flex-col"
              >
                <div className="blog-card-img aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={`${article.title} — article cover`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="inline-block text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-secondary text-muted-foreground mb-3 self-start">
                    {article.category}
                  </span>
                  <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors leading-snug flex-1">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">By {article.author}</span>
                    <ArrowRightIcon size={14} className="text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
