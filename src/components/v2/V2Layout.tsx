import React from 'react';
import Head from 'next/head';
import { DM_Sans, Fraunces } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

interface V2LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function V2Layout({
  children,
  title = 'BrandPawa — The #1 Brand Operating System',
  description = 'BrandPawa is the brand operating system for founders, creators, and businesses that intend to own attention, earn trust, and scale with precision.',
}: V2LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://www.brandpawa.com/favicon.ico" type="image/x-icon" />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.brandpawa.com/v2" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <div
        className={`v2-page ${dmSans.variable} ${fraunces.variable} ${dmSans.className}`}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </div>
    </>
  );
}
