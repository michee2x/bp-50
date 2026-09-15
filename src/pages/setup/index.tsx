// src/pages/setup/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../../lib/supabase';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { BrandPawaLogo } from '../../components/BrandPawaLogo';

const roles = [
  { id: 'founder-business', label: 'Founder / Business Owner', desc: 'Building a company or product brand' },
  { id: 'creator', label: 'Creator', desc: 'Building a personal brand and audience' },
  { id: 'professional', label: 'Professional / Expert', desc: 'Building authority in a specific field' }
];

const goals = [
  { id: 'clarity', label: 'Clarity & Positioning', desc: 'Figuring out exactly what my brand stands for' },
  { id: 'growth', label: 'Audience Growth', desc: 'Reaching more of the right people' },
  { id: 'visibility', label: 'Visibility & Authority', desc: 'Becoming a known voice in my space' },
  { id: 'monetization', label: 'Monetization', desc: 'Turning my audience into paying clients' }
];

const focuses = [
  { id: 'score', label: 'Show my brand score breakdown', desc: 'See the results of your BrandPawa Test' },
  { id: 'authority', label: 'Build my authority fast', desc: 'Take a targeted diagnostic quiz' },
  { id: 'challenge', label: 'Take a challenge', desc: 'Join an active community growth challenge' }
];

export default function SetupProfiling() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState('');
  const [focus, setFocus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.replace('/?auth=login&redirect=/setup');
      } else {
        setIsVerifyingAuth(false);
      }
    });
  }, [router]);

  const handleComplete = async (selectedFocus: string) => {
    setIsLoading(true);
    setFocus(selectedFocus);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to Auth Metadata (highly reliable fallback)
        await supabase.auth.updateUser({
          data: {
            onboarding_role: role,
            onboarding_goal: goal,
            onboarding_focus: selectedFocus,
            onboarding_completed: true,
          }
        });

        // Try to update profiles table
        await supabase
          .from('profiles')
          .update({
            role: role,
            goal: goal,
            focus: selectedFocus,
            onboarding_completed: true
          })
          .eq('id', user.id)
          .catch(() => {
            console.log("Profile table update skipped - relying on metadata");
          });
        try {
          await supabase
            .from('profiles')
            .update({
              role: role,
              goal: goal,
              focus: selectedFocus,
              onboarding_completed: true
            })
            .eq('id', user.id);
        } catch {
          console.log("Profile table update skipped - relying on metadata");
        }
      }

      // Dynamic Routing based on Focus
      if (selectedFocus === 'score') {
        router.push('/dashboard/diagnostic/1?migrate=true');
      } else if (selectedFocus === 'authority') {
        router.push('/quizzes');
      } else if (selectedFocus === 'challenge') {
        router.push('/challenges');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsLoading(false);
    }
  };

  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col font-sans">
      <Head>
        <title>Set up your workspace - BrandPawa</title>
      </Head>

      <header className="px-6 py-4 flex justify-center bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <BrandPawaLogo href="/" size="md" />
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        
        {/* Progress Bar */}
        <div className="mb-8 max-w-md mx-auto w-full">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`text-xs font-semibold uppercase tracking-wider ${step >= num ? 'text-purple-600' : 'text-gray-400'}`}
              >
                Step {num}
              </div>
            ))}
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
            <div className="h-full bg-purple-600 transition-all duration-500 ease-in-out" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 transition-all duration-300">
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Welcome to BrandPawa.</h1>
              <p className="text-gray-500 text-center mb-8">Let's personalize your workspace. What best describes you?</p>
              
              <div className="space-y-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                      role === r.id 
                        ? 'border-purple-600 bg-purple-50 shadow-md ring-1 ring-purple-600 ring-opacity-50' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-lg">{r.label}</div>
                    <div className="text-gray-500 text-sm mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!role}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  Continue <FiArrowRight />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm font-medium transition-colors">
                <FiArrowLeft /> Back
              </button>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">What is your primary goal right now?</h1>
              <p className="text-gray-500 text-center mb-8">We'll tailor your insights and recommendations around this.</p>
              
              <div className="space-y-4">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                      goal === g.id 
                        ? 'border-purple-600 bg-purple-50 shadow-md ring-1 ring-purple-600 ring-opacity-50' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-lg">{g.label}</div>
                    <div className="text-gray-500 text-sm mt-1">{g.desc}</div>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => setStep(3)}
                  disabled={!goal}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  Continue <FiArrowRight />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm font-medium transition-colors">
                <FiArrowLeft /> Back
              </button>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Where do you want to start?</h1>
              <p className="text-gray-500 text-center mb-8">Choose your immediate focus.</p>
              
              <div className="space-y-4">
                {focuses.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleComplete(f.id)}
                    disabled={isLoading}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                      focus === f.id 
                        ? 'border-purple-600 bg-purple-50 shadow-md ring-1 ring-purple-600 ring-opacity-50' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    } disabled:opacity-70`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg">{f.label}</div>
                        <div className="text-gray-500 text-sm mt-1">{f.desc}</div>
                      </div>
                      {isLoading && focus === f.id && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
