import React from 'react';
import Head from 'next/head';
import V2Layout from '@/components/v2/V2Layout';
import Header from '@/components/v2/Header';
import Footer from '@/components/v2/Footer';
import HeroSection from '@/components/v2/HeroSection';
import HowItWorksSection from '@/components/v2/HowItWorksSection';
import EcosystemSection from '@/components/v2/EcosystemSection';
import WhyBrandPawaSection from '@/components/v2/WhyBrandPawaSection';
import PricingSection from '@/components/v2/PricingSection';
import AudienceSection from '@/components/v2/AudienceSection';
import SocialProofSection from '@/components/v2/SocialProofSection';
import BlogSection from '@/components/v2/BlogSection';
import CommunitySection from '@/components/v2/CommunitySection';
import ContactSection from '@/components/v2/ContactSection';
import LearnSection from '@/components/v2/LearnSection';
import FinalCTASection from '@/components/v2/FinalCTASection';
import CustomCursor from '@/components/v2/CustomCursor';

// Import v2-specific styles (isolated — does NOT affect the main site)
import '@/styles/v2/tailwind.css';

const structuredDataApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BrandPawa',
  description: 'The #1 Brand Operating System for founders, creators, and businesses.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'NGN',
  },
  url: 'https://www.brandpawa.com',
};

const structuredDataOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BrandPawa',
  url: 'https://www.brandpawa.com',
  logo: 'https://www.brandpawa.com/_next/image?url=%2Fimages%2FBrandPawa%20logo2.png&w=384&q=75',
  sameAs: [
    'https://t.me/BrandPawa',
    'https://web.facebook.com/groups/brandpawa',
  ],
};

export default function V2HomePage() {
  return (
    <V2Layout
      title="BrandPawa — The #1 Brand Operating System"
      description="BrandPawa is the brand operating system for founders, creators, and businesses that intend to own attention, earn trust, and scale with precision."
    >
      <Head>
        {/* Canonical */}
        <link rel="canonical" href="https://www.brandpawa.com/v2" />

        {/* Open Graph */}
        <meta property="og:title" content="BrandPawa — Build a Brand that Wins" />
        <meta property="og:description" content="Replace brand guesswork with structure, insight, and execution." />
        <meta property="og:image" content="/assets/images/app_logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataOrg) }}
        />
      </Head>

      {/* Grain texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Header />

      <main>
        {/* Hero — Massive typography + leaderboard proof */}
        <HeroSection />

        {/* How It Works — 4-step process */}
        <HowItWorksSection />

        {/* Ecosystem — Bento grid of platform pillars */}
        <EcosystemSection />

        {/* Why BrandPawa — Problem/solution dark section */}
        <WhyBrandPawaSection />

        {/* Audience — Who it's built for */}
        <AudienceSection />

        {/* Pricing — Transparent 3-tier */}
        <PricingSection />

        {/* Social Proof + Founder's Note */}
        <SocialProofSection />

        {/* Blog — Articles grid */}
        <BlogSection />

        {/* Community — WhatsApp, Telegram, Facebook */}
        <CommunitySection />

        {/* Contact — Work with us form */}
        <ContactSection />

        {/* Learn — Coming soon */}
        <LearnSection />

        {/* Final CTA */}
        <FinalCTASection />
      </main>

      <Footer />
    </V2Layout>
  );
}
