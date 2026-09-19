import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../../lib/supabase';
import { BrandPawaLogo } from '../../components/BrandPawaLogo';

type Stage = 'idle' | 'verifying' | 'success' | 'error';

export default function VerifyEmail() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [tokenHash, setTokenHash] = useState('');
  const [tokenType, setTokenType] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const { token_hash, type } = router.query;
    if (token_hash && type) {
      setTokenHash(token_hash as string);
      setTokenType(type as string);
    }
  }, [router.isReady, router.query]);

  const handleVerify = async () => {
    if (!tokenHash || !tokenType) {
      setErrorMsg('Verification link is missing required parameters. Please request a new verification email.');
      setStage('error');
      return;
    }
    setStage('verifying');
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: tokenType as any,
      });
      if (error) {
        setErrorMsg(
          error.message.toLowerCase().includes('expired') || error.message.toLowerCase().includes('invalid')
            ? 'This verification link has expired or was already used. Please sign in and request a new one.'
            : error.message
        );
        setStage('error');
        return;
      }
      setStage('success');
      setTimeout(() => {
        const redirect = (router.query.redirect as string) || '/dashboard';
        router.replace(redirect);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStage('error');
    }
  };

  return (
    <>
      <Head>
        <title>Verify Your Email — BrandPawa</title>
        <meta name="description" content="Verify your BrandPawa account email address to get started." />
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 50%, #f0f9ff 100%)',
        padding: '2rem', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <BrandPawaLogo href="/" size="md" />
        </div>

        <div style={{
          background: 'white', borderRadius: '1.5rem',
          boxShadow: '0 20px 60px rgba(124,58,237,0.12)',
          padding: '3rem 2.5rem', maxWidth: '460px', width: '100%',
          textAlign: 'center', border: '1px solid rgba(124,58,237,0.08)',
        }}>

          {(stage === 'idle' || stage === 'verifying') && (
            <>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #0ABCFE)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', fontSize: '2rem',
              }}>✉️</div>
              <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#1e1b4b', margin: '0 0 0.75rem', lineHeight: 1.3 }}>
                Confirm your email
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
                Click the button below to verify your email address and activate your BrandPawa account.
              </p>
              <button
                id="verify-email-btn"
                onClick={handleVerify}
                disabled={stage === 'verifying' || !tokenHash}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  background: stage === 'verifying' ? '#a78bfa' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: 'white', border: 'none', borderRadius: '0.75rem',
                  padding: '0.9rem 2.25rem', fontSize: '1rem', fontWeight: 600,
                  cursor: (stage === 'verifying' || !tokenHash) ? 'not-allowed' : 'pointer',
                  width: '100%', transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(124,58,237,0.35)', letterSpacing: '0.01em',
                }}
              >
                {stage === 'verifying' ? (
                  <>
                    <span style={{
                      width: '16px', height: '16px',
                      border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
                      borderRadius: '50%', animation: 'spin 0.75s linear infinite',
                      display: 'inline-block', flexShrink: 0,
                    }} />
                    Verifying…
                  </>
                ) : '✓  Verify My Email'}
              </button>
              {!tokenHash && router.isReady && (
                <p style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '1rem' }}>
                  Missing verification token. Please use the exact link from your email.
                </p>
              )}
            </>
          )}

          {stage === 'success' && (
            <>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', fontSize: '2rem',
              }}>✅</div>
              <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#1e1b4b', margin: '0 0 0.75rem' }}>
                Email verified!
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                Your account is now active. Taking you to your dashboard…
              </p>
              <div style={{
                display: 'inline-block', background: '#f0fdf4',
                border: '1px solid #bbf7d0', borderRadius: '0.5rem',
                padding: '0.5rem 1.25rem', color: '#16a34a', fontSize: '0.875rem', fontWeight: 500,
              }}>Redirecting…</div>
            </>
          )}

          {stage === 'error' && (
            <>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f87171, #dc2626)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', fontSize: '2rem',
              }}>⚠️</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1b4b', margin: '0 0 0.75rem' }}>
                Verification failed
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                {errorMsg}
              </p>
              <button
                onClick={() => router.push('/')}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white',
                  border: 'none', borderRadius: '0.75rem', padding: '0.9rem 2rem',
                  fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer',
                  width: '100%', boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                }}
              >Back to Homepage</button>
            </>
          )}
        </div>

        <p style={{ color: '#9ca3af', fontSize: '0.8125rem', marginTop: '1.5rem', textAlign: 'center' }}>
          Didn&apos;t request this? You can safely ignore it.
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
