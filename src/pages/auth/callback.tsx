import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { BrandLoader } from '../../components/BrandLoader';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        setStatus('Something went wrong. Redirecting…');
        setTimeout(() => router.replace('/'), 2000);
        return;
      }

      if (session) {
        await handleNewUserSetup(session.user);
        setStatus('Verified! Taking you to your dashboard…');
        const redirectPath = (router.query.redirect as string) || '/dashboard';
        router.replace(redirectPath);
        return;
      }

      // Session not yet available — listen for the auth state change that fires
      // once supabase-js finishes exchanging the fragment tokens.
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          subscription.unsubscribe();
          await handleNewUserSetup(newSession.user);
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

/**
 * Called after every OAuth sign-in.
 * - Returning user (profile already exists) → skips silently
 * - New user → creates profile + queues welcome emails
 */
async function handleNewUserSetup(user: { id: string; email?: string; user_metadata?: Record<string, any> }) {
  if (!user?.id) return;

  try {
    // Check if profile already exists (returning user logging in via Google)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile) return; // Returning user — nothing to do

    // --- New user via Google OAuth ---
    const email = user.email ?? '';
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split('@')[0] ||
      'there';

    // 1. Create profile via sync-profile API (uses service role, bypasses RLS)
    const syncRes = await fetch('/api/sync-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, email, full_name: name }),
    });

    if (!syncRes.ok) {
      console.error('OAuth profile sync failed:', await syncRes.text());
    }

    // 2. Queue welcome emails
    const welcomeRes = await fetch('/api/email/queue-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email, name }),
    });

    if (!welcomeRes.ok) {
      console.error('OAuth queue-welcome failed:', await welcomeRes.text());
    }
  } catch (err) {
    console.error('handleNewUserSetup error:', err);
  }
}
