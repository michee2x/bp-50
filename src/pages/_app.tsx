// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { AuthProvider } from '../components/AuthProvider';
import PwaManager from '../components/PwaManager';
import { initializeDatabase } from '../lib/initDatabase';
import '../styles/globals.css';

import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize database on app start
    initializeDatabase();
  }, []);

  return (
    <AuthProvider>
      <Head>
        <title>BrandPawa - Build Your Dominant Brand</title>
      </Head>
      <Component {...pageProps} />
      <PwaManager />
    </AuthProvider>
  );
}
