import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabase';
import { BrandLoader } from '../../../components/BrandLoader';
import {
  FiArrowLeft,
  FiAward,
  FiCheck,
  FiClock,
  FiLock,
  FiMessageCircle,
  FiShield,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap
} from 'react-icons/fi';

const AUTHORITY_PILLARS = [
  'Clarity - what you should be trusted for',
  'Proof - evidence and credibility assets',
  'Perspective - how you think differently',
  'Consistency - repeated authority signals',
  'Trust Assets - systems that build belief'
];

const WEEK_STRUCTURE = [
  {
    title: 'Week 1: Authority Clarity',
    goal: 'Define what you should be trusted for',
    examples: ['Authority identity', 'Niche compression', 'Authority statement', 'Category mapping']
  },
  {
    title: 'Week 2: Proof & Credibility',
    goal: 'Build visible evidence and trust signals',
    examples: ['Proof inventory', 'Proof gaps', 'Authority asset creation', 'Social proof signal']
  },
  {
    title: 'Week 3: Perspective & Voice',
    goal: 'Sound like a leader, not a follower',
    examples: ['Opinion development', 'Framework thinking', 'Thought leadership post', 'Anti-positioning']
  },
  {
    title: 'Week 4: Trust & Monetization',
    goal: 'Turn authority into leverage',
    examples: ['Offer alignment', 'Pricing confidence', 'Conversion trust asset', 'Authority consolidation']
  }
];

const NEXT_STEPS = [
  'Strong authority → Audience Growth Challenge',
  'Authority + demand → Marketing Challenge',
  'Authority but weak revenue → Monetization Readiness Diagnostic'
];

export default function AuthorityChallenge() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [hasVisibilityChallenge, setHasVisibilityChallenge] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/');
      return;
    }

    setUser(user);

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    setIsPro(profile?.plan === 'pro' || profile?.plan === 'enterprise');

    const { data: visibilityChallenge } = await supabase
      .from('user_challenges')
      .select(`
        id,
        challenges:challenge_id (name)
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed');

    const hasVisibility = (visibilityChallenge || []).some((item: any) =>
      item.challenges?.name?.toLowerCase().includes('visibility')
    );

    setHasVisibilityChallenge(hasVisibility);
    setLoading(false);
  };

  const renderGateCard = (type: 'pro' | 'prerequisite') => {
    const isProGate = type === 'pro';

    return (
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(80,43,133,0.1)]">
        <div className={`bg-gradient-to-r ${isProGate ? 'from-purple-600 to-pink-500' : 'from-amber-500 to-orange-500'} p-8 text-white`}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              {isProGate ? <FiLock className="text-2xl" /> : <FiTarget className="text-2xl" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Authority Challenge</h1>
              <p className="mt-2 text-white/85">
                Transform a visible brand into a trusted, premium-positioned authority.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {isProGate ? 'This challenge is part of Pro' : 'Complete Visibility first'}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {isProGate
                ? 'Authority is a growth and monetization suite. It is designed for Pro users who are ready to build proof assets, stronger positioning, and pricing confidence.'
                : 'Authority works best after visibility. The Visibility Challenge builds the consistency and public signal that authority needs to convert attention into trust.'}
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
            {[
              'Clear authority positioning',
              'Proof assets and trust signals',
              'Authority-driven content system'
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-md space-y-3">
            <button
              onClick={() => router.push(isProGate ? '/dashboard/billing' : '/challenges/visibility')}
              className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition ${
                isProGate ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg'
              }`}
            >
              {isProGate ? 'Go Premium' : 'Start Visibility Challenge'}
            </button>
            <button
              onClick={() => router.push(isProGate ? '/challenges/visibility' : '/dashboard?section=diagnostics')}
              className="w-full rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {isProGate ? 'Explore Free Visibility Challenge' : 'Run Diagnostics First'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF0FF]">
        <BrandLoader label="Loading challenge..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF0FF] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push('/dashboard?section=challenges')}
          className="mb-8 flex items-center space-x-2 text-purple-600 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          <span>Back to Challenges</span>
        </button>

        {!isPro ? (
          renderGateCard('pro')
        ) : !hasVisibilityChallenge ? (
          renderGateCard('prerequisite')
        ) : (
          <div className="space-y-8">
            <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_30%),linear-gradient(135deg,#28163f_0%,#5826a4_52%,#e4559f_100%)] px-8 py-10 text-white shadow-[0_30px_70px_rgba(80,43,133,0.18)]">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                    Pro Growth Challenge
                  </div>
                  <h1 className="text-3xl font-bold leading-tight sm:text-4xl">BrandPawa Authority Challenge</h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
                    Visibility gets attention. Authority earns trust, pricing power, and opportunity.
                    This challenge helps founders, experts, and business brands move from being seen to being believed.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/65">Duration</div>
                      <div className="mt-2 font-semibold">30 days MVP</div>
                    </div>
                    <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/65">Time</div>
                      <div className="mt-2 font-semibold">20-35 min/day</div>
                    </div>
                    <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/65">Outcome</div>
                      <div className="mt-2 font-semibold">Trust + monetization signal</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">What success looks like</div>
                  <div className="mt-4 space-y-3">
                    {[
                      'Clear authority positioning',
                      'Documented proof assets',
                      'Stronger messaging confidence',
                      'Improved perceived value',
                      'Authority-based content system'
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm">
                        <FiCheck className="mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                    <FiShield />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Problem</div>
                    <h2 className="text-xl font-bold text-slate-900">What this fixes</h2>
                  </div>
                </div>
                <ul className="space-y-3 text-sm leading-7 text-slate-600">
                  <li>Weak positioning</li>
                  <li>Low trust signals</li>
                  <li>Content with no authority signal</li>
                  <li>Competing on price instead of perception</li>
                </ul>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
                    <FiUsers />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Target Users</div>
                    <h2 className="text-xl font-bold text-slate-900">Built for expertise-led brands</h2>
                  </div>
                </div>
                <ul className="space-y-3 text-sm leading-7 text-slate-600">
                  <li>Founders</li>
                  <li>Consultants and coaches</li>
                  <li>Creators monetizing expertise</li>
                  <li>Business brands seeking stronger credibility</li>
                </ul>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <FiClock />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Entry Flow</div>
                    <h2 className="text-xl font-bold text-slate-900">How it starts</h2>
                  </div>
                </div>
                <ul className="space-y-3 text-sm leading-7 text-slate-600">
                  <li>Choose duration and brand type</li>
                  <li>Understand visibility vs authority</li>
                  <li>Review outcomes and time commitment</li>
                  <li>Start the 30-day authority foundation</li>
                </ul>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Core Authority Pillars</div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">The 5-pillar system</h2>
                <div className="mt-6 space-y-3">
                  {AUTHORITY_PILLARS.map((pillar) => (
                    <div key={pillar} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {pillar}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">30-Day Structure</div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Weekly authority progression</h2>
                <div className="mt-6 space-y-4">
                  {WEEK_STRUCTURE.map((week) => (
                    <div key={week.title} className="rounded-3xl border border-slate-200 p-5">
                      <div className="font-semibold text-slate-900">{week.title}</div>
                      <p className="mt-2 text-sm text-slate-600">{week.goal}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {week.examples.map((example) => (
                          <span key={example} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Completion Output</div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">What the user receives</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: <FiAward />, title: 'Authority Score', text: 'A final score showing the strength of your authority build.' },
                    { icon: <FiTarget />, title: 'Asset List', text: 'A record of proof assets, signals, and outputs created during the challenge.' },
                    { icon: <FiTrendingUp />, title: 'Signal Breakdown', text: 'A clearer view of strong vs weak authority indicators.' },
                    { icon: <FiMessageCircle />, title: 'Next Move', text: 'Recommended diagnostics, challenges, and monetization steps.' }
                  ].map((item) => (
                    <div key={item.title} className="rounded-3xl bg-slate-50 p-5">
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-purple-700 shadow-sm">
                        {item.icon}
                      </div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(80,43,133,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Auto-Recommended Next Steps</div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Where authority leads next</h2>
                <div className="mt-6 space-y-3">
                  {NEXT_STEPS.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => router.push('/challenges/authority/start')}
                    className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 font-semibold text-white transition hover:shadow-lg"
                  >
                    Start Authority Challenge
                  </button>
                  <button
                    onClick={() => router.push('/dashboard?section=billing')}
                    className="w-full rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Manage Pro Plan
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
