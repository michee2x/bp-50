// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>BrandPawa - Build Your Dominant Brand</title>
          <meta property="og:title" content="BrandPawa - Build Your Dominant Brand" />
          <meta name="twitter:title" content="BrandPawa - Build Your Dominant Brand" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#8b5cf6" />
          <meta name="theme-color" content="#8b5cf6" />
          <meta name="description" content="Complete brand building platform with diagnostics, challenges, and analytics to help you build a dominant brand." />
          <meta name="keywords" content="brand building, brand diagnostics, personal branding, business branding, brand strategy" />
          <meta name="author" content="BrandPawa" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://brandpawa.com" />
          <meta property="og:title" content="BrandPawa - Build Your Dominant Brand" />
          <meta property="og:description" content="Complete brand building platform with diagnostics, challenges, and analytics to help you build a dominant brand." />
          <meta property="og:image" content="https://brandpawa.com/og-image.svg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:site_name" content="BrandPawa" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://brandpawa.com" />
          <meta name="twitter:title" content="BrandPawa - Build Your Dominant Brand" />
          <meta name="twitter:description" content="Complete brand building platform with diagnostics, challenges, and analytics to help you build a dominant brand." />
          <meta name="twitter:image" content="https://brandpawa.com/twitter-image.svg" />
          <meta name="twitter:creator" content="@brandpawa" />
          <link rel="canonical" href="https://brandpawa.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
