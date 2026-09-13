// src/pages/quizzes/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  FiArrowRight, FiDroplet, FiHeart, FiEye,
  FiTrendingUp, FiInstagram, FiMessageSquare,
  FiGlobe, FiUsers, FiCreditCard, FiLock, FiX
} from 'react-icons/fi';
import { BrandPawaLogo } from '../../components/BrandPawaLogo';
import { supabase } from '../../lib/supabase';

const QUIZZES = [
  {
    id: '2',
    name: 'Color Power',
    icon: FiDroplet,
    category: 'Visual Identity',
    description: 'Discover the brand colors that best represent your identity and attract your ideal audience.',
    duration: '~3 min',
    pro: false,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
  {
    id: '3',
    name: 'Brand Personality',
    icon: FiHeart,
    category: 'Positioning',
    description: "Uncover your brand archetype — the personality that makes your brand magnetic and memorable.",
    duration: '~4 min',
    pro: false,
    color: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: '4',
    name: 'Logo Identity',
    icon: FiEye,
    category: 'Visual Identity',
    description: 'Find out which logo style and visual direction aligns with your brand story and goals.',
    duration: '~4 min',
    pro: true,
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    id: '5',
    name: 'Brand Stage',
    icon: FiTrendingUp,
    category: 'Growth',
    description: 'Understand exactly where your brand is in its growth journey and what to focus on next.',
    duration: '~5 min',
    pro: true,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: '6',
    name: 'Social Platform',
    icon: FiInstagram,
    category: 'Marketing',
    description: "Stop guessing which platform to focus on. This quiz reveals where your audience actually is.",
    duration: '~3 min',
    pro: true,
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    id: '7',
    name: 'Positioning Clarity',
    icon: FiMessageSquare,
    category: 'Positioning',
    description: 'Is your brand message landing or leaving people confused? Find out and fix it.',
    duration: '~4 min',
    pro: true,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    id: '8',
    name: 'Trust & Authority',
    icon: FiGlobe,
    category: 'Credibility',
    description: 'Measure your brand credibility and discover what steps build unshakeable trust.',
    duration: '~4 min',
    pro: true,
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  {
    id: '9',
    name: 'Audience Fit',
    icon: FiUsers,
    category: 'Audience',
    description: 'How well does your brand resonate with the people you want to serve? Get clarity here.',
    duration: '~3 min',
    pro: true,
    color: 'from-lime-500 to-green-600',
    bg: 'bg-lime-50',
    iconColor: 'text-lime-600',
  },
  {
    id: '10',
    name: 'Monetization',
    icon: FiCreditCard,
    category: 'Growth',
    description: 'Discover your brand revenue potential and the monetization model that fits you best.',
    duration: '~5 min',
    pro: true,
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
];

const CATEGORIES = ['All', 'Visual Identity', 'Positioning', 'Growth', 'Marketing', 'Credibility', 'Audience'];

export default function QuizListPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const loggedIn = !!data?.user;
      setIsLoggedIn(loggedIn);
      setAuthChecked(true);

      // Signed-in users go straight to their dashboard quiz section
      if (loggedIn) {
        router.replace('/dashboard?section=diagnostics');
      }
    });
  }, [router]);

  const handleQuizClick = (quiz: typeof QUIZZES[number]) => {
    if (!isLoggedIn) {
      // Gate behind auth — send them to signup with redirect
      router.push(`/?auth=signup&redirect=/dashboard/diagnostic/${quiz.id}`);
    } else {
      router.push(`/dashboard/diagnostic/${quiz.id}`);
    }
  };

  const filteredQuizzes =
    selectedCategory === 'All'
      ? QUIZZES
      : QUIZZES.filter((q) => q.category === selectedCategory);

  // While checking auth, show nothing (avoids flash)
  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-[#FAF0FF]">
      <Head>
        <title>Brand Quizzes | BrandPawa</title>
        <meta
          name="description"
          content="Take a BrandPawa discovery quiz to get clarity on your colors, personality, platform, positioning, and more."
        />
      </Head>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <BrandPawaLogo className="h-8 w-auto text-purple-600" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/onboarding"
              className="text-sm font-medium text-gray-600 hover:text-purple-700 transition hidden sm:block"
            >
              Take the Full Test
            </Link>
            <button
              onClick={() => router.push('/?auth=signup')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold shadow hover:shadow-lg transition"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/')}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
              aria-label="Go back to homepage"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-32 md:pt-14 md:pb-40">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Discovery Quizzes
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Get clarity on every brand decision
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            Fast, focused quizzes that decode what fits your brand — from color psychology
            to platform strategy to brand personality.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quiz grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <button
                key={quiz.id}
                onClick={() => handleQuizClick(quiz)}
                className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex flex-col gap-3 relative overflow-hidden"
              >
                {/* Pro badge */}
                {quiz.pro && (
                  <span className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wide">
                    <FiLock size={9} /> Pro
                  </span>
                )}

                <div className={`w-11 h-11 rounded-xl ${quiz.bg} flex items-center justify-center`}>
                  <Icon size={20} className={quiz.iconColor} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-purple-700 transition">
                      {quiz.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
                    {quiz.category} · {quiz.duration}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{quiz.description}</p>
                </div>

                <div className={`mt-auto flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r ${quiz.color} bg-clip-text text-transparent`}>
                  Start Quiz <FiArrowRight size={13} className={quiz.iconColor} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA for non-signed-in */}
        {!isLoggedIn && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-3">
              Create a free account to save your quiz results and unlock your full brand report.
            </p>
            <button
              onClick={() => router.push('/?auth=signup')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow hover:shadow-xl transition"
            >
              Get Started Free <FiArrowRight size={15} />
            </button>
          </div>
        )}
      </main>

      {/* Fixed Bottom CTA banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="max-w-5xl mx-auto pointer-events-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl border border-white/20">
          <div className="text-white text-center sm:text-left">
            <p className="font-bold text-lg md:text-xl">Not sure where your brand stands right now?</p>
            <p className="text-purple-100 text-sm md:text-base mt-1">
              Get a complete, 360-degree audit across all 5 brand pillars in under 10 minutes.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="flex-shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-white text-purple-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-sm md:text-base"
          >
            Take a BrandPawa Test <FiArrowRight size={16} className="text-purple-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
