import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { BrandLoader } from '../../components/BrandLoader';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Supabase implicit flow puts tokens in the URL hash fragment (#access_token=...).
      // supabase-js v2 auto-detects and exchanges these via detectSessionInUrl.
      // We just need to wait for onAuthStateChange to fire, or call getSession()
      // after a brief tick to let the SDK parse the fragment.
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        setStatus('Something went wrong. Redirecting…');
        setTimeout(() => router.replace('/'), 2000);
        return;
      }

      if (session) {
        setStatus('Verified! Taking you to your dashboard…');
        const redirectPath = (router.query.redirect as string) || '/dashboard';
        router.replace(redirectPath);
        return;
      }

      // Session not yet available — listen for the auth state change that fires
      // once supabase-js finishes exchanging the fragment tokens.
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          subscription.unsubscribe();
          setStatus('Verified! Taking you to your dashboard…');
          const redirectPath = (router.query.redirect as string) || '/dashboard';
          router.replace(redirectPath);
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          subscription.unsubscribe();
          router.replace('/dashboard');
        }
      });

      // Fallback: if no auth event fires within 5 seconds, go home
      const fallback = setTimeout(() => {
        subscription.unsubscribe();
        setStatus('Verification timed out. Redirecting…');
        router.replace('/');
      }, 5000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(fallback);
      };
    };

    handleAuthCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-purple-50">
      <div className="text-center">
        <BrandLoader size="md" className="mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
        <p className="text-gray-600 mt-2">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}
