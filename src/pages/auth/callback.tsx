// src/pages/auth/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { BrandLoader } from '../../components/BrandLoader';
import { isStartFlowReady, navigateToSavedStartFlow, readStartFlowState } from '../../lib/startFlow';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        router.push('/');
        return;
      }

      if (session) {
        const startFlow = readStartFlowState();

        if (startFlow && !isStartFlowReady(startFlow)) {
          router.replace('/');
          return;
        }

        await navigateToSavedStartFlow(router);
      } else {
        // No session, redirect to login
        router.replace('/');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-purple-50">
      <div className="text-center">
        <BrandLoader size="md" className="mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Completing authentication...</h2>
        <p className="text-gray-600 mt-2">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}
