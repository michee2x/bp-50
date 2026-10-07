import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const productLinks = [
  { label: 'BrandPawa Test', href: '#ecosystem' },
  { label: 'Quizzes', href: '#ecosystem' },
  { label: 'Growth Challenges', href: '#ecosystem' },
];

const learnLinks = [
  { label: 'Shop', href: '#learn' },
  { label: 'MasterClass', href: '#learn' },
];

// Inline Heroicons (no extra dependency)
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={14} height={14} className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  );
}

function Bars3Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (productRef.current && !productRef.current.contains(e.target as Node)) {
        setProductOpen(false);
      }
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) {
        setLearnOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="https://www.brandpawa.com/_next/image?url=%2Fimages%2FBrandPawa%20logo2.png&w=384&q=75"
              alt="BrandPawa logo — brand operating system"
              width={140}
              height={36}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Product Dropdown */}
            <div ref={productRef} className="relative">
              <button
                onClick={() => { setProductOpen(!productOpen); setLearnOpen(false); }}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors nav-link-underline"
              >
                Product
                <ChevronDownIcon className={`transition-transform duration-200 ${productOpen ? 'rotate-180' : ''}`} />
              </button>
              {productOpen && (
                <div className="absolute top-full left-0 mt-3 w-52 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                  {productLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setProductOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors nav-link-underline">
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors nav-link-underline">
              Pricing
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors nav-link-underline">
              About Us
            </Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors nav-link-underline">
              Blog
            </Link>

            {/* Learn Dropdown */}
            <div ref={learnRef} className="relative">
              <button
                onClick={() => { setLearnOpen(!learnOpen); setProductOpen(false); }}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors nav-link-underline"
              >
                Learn
                <ChevronDownIcon className={`transition-transform duration-200 ${learnOpen ? 'rotate-180' : ''}`} />
              </button>
              {learnOpen && (
                <div className="absolute top-full left-0 mt-3 w-44 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                  {learnLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setLearnOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors">
              Login
            </button>
            <Link
              href="#hero"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <XMarkIcon /> : <Bars3Icon />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-8 overflow-y-auto lg:hidden">
          <nav className="flex flex-col gap-1">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2 px-2">Product</p>
            {productLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-2 py-3 text-base font-medium text-foreground hover:text-accent transition-colors border-b border-border"
              >
                {item.label}
              </Link>
            ))}
            <Link href="#how-it-works" onClick={() => setMobileOpen(false)} className="px-2 py-3 text-base font-medium text-foreground hover:text-accent transition-colors border-b border-border">
              How it Works
            </Link>
            <Link href="#pricing" onClick={() => setMobileOpen(false)} className="px-2 py-3 text-base font-medium text-foreground hover:text-accent transition-colors border-b border-border">
              Pricing
            </Link>
            <Link href="#about" onClick={() => setMobileOpen(false)} className="px-2 py-3 text-base font-medium text-foreground hover:text-accent transition-colors border-b border-border">
              About Us
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="px-2 py-3 text-base font-medium text-foreground hover:text-accent transition-colors border-b border-border">
              Blog
            </Link>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mt-4 mb-2 px-2">Learn</p>
            {learnLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-2 py-3 text-base font-medium text-foreground hover:text-accent transition-colors border-b border-border"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <button className="w-full py-3 text-base font-semibold text-foreground border border-border rounded-xl hover:bg-secondary transition-colors">
              Login
            </button>
            <Link
              href="#hero"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 text-base font-semibold text-center bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
