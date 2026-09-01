// src/pages/index.tsx
import Link from 'next/link';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import {
  FiX, FiCheck, FiArrowRight, FiUsers,
  FiBarChart2, FiDownload,
  FiTrendingUp, FiTarget, FiEye, FiPlay,
  FiGlobe, FiBookOpen,
  FiHeart, FiZap, FiSend, FiMessageSquare, FiBriefcase, FiPhoneCall,
  FiEyeOff, FiEye as FiEyeIcon, FiAward
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BsTwitter, BsInstagram, BsFacebook, BsTelegram, BsWhatsapp } from 'react-icons/bs';
import { MdColorLens } from 'react-icons/md';
import { BrandPawaLogo } from '../components/BrandPawaLogo';
import { PublicFooter, PublicHeader } from '../components/PublicSiteChrome';
import { LiveBrandWall } from '../components/LiveBrandWall';
import { blogPosts } from '../data/blogPosts';
import {
  StartFlowGoal,
  StartFlowIntent,
  StartFlowProfileType,
  getStartFlowRoute,
  isStartFlowReady,
  navigateToSavedStartFlow,
  readStartFlowState,
  saveStartFlowState,
} from '../lib/startFlow';

const startFlowIntentOptions: Array<{ value: StartFlowIntent; label: string; description: string }> = [
  {
    value: 'test',
    label: 'Take the Brand Test',
    description: 'Recommended. Start with the BrandPawa Test for a full picture of your brand strength.',
  },
  {
    value: 'quiz',
    label: 'Start with a Quick Quiz',
    description: 'Jump into a faster discovery quiz if you want a lighter starting point.',
  },
];

const startFlowProfileOptions: Array<{ value: StartFlowProfileType; label: string }> = [
  { value: 'founder-business', label: 'Founder / Business' },
  { value: 'creator', label: 'Creator' },
  { value: 'professional', label: 'Professional' },
];

const startFlowGoalOptions: Array<{ value: StartFlowGoal; label: string }> = [
  { value: 'clarity', label: 'Clarity' },
  { value: 'growth', label: 'Growth' },
  { value: 'positioning', label: 'Positioning' },
  { value: 'visibility', label: 'Visibility' },
];

export default function HomePage() {
  type ContactFormState = {
    name: string;
    email: string;
    company: string;
    budget: string;
    message: string;
  };

  type ContactStatus = {
    type: 'success' | 'error';
    message: string;
  } | null;

  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistType, setWaitlistType] = useState<'talent' | 'automation'>('automation');
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isStartFlowOpen, setIsStartFlowOpen] = useState(false);
  const [startFlowStep, setStartFlowStep] = useState(0);
  const [startFlowIntent, setStartFlowIntent] = useState<StartFlowIntent>('test');
  const [startFlowProfileType, setStartFlowProfileType] = useState<StartFlowProfileType>('founder-business');
  const [startFlowGoal, setStartFlowGoal] = useState<StartFlowGoal>('clarity');
  const [startFlowBrandName, setStartFlowBrandName] = useState('');
  const [typedWelcomeHeadline, setTypedWelcomeHeadline] = useState('');
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: ''
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<ContactStatus>(null);
  const [heroMessageIndex, setHeroMessageIndex] = useState(0);

  // Trusted logos data
  const trustedLogos = [
    { name: 'Emeka Nobis', src: '/logos/emeka-nobis-logo.png' },
    { name: 'Jamie Pajoel', src: '/logos/jamie-pajoel-black.png' },
    { name: 'JPI', src: '/logos/jpi-logo.png' },
    { name: 'TEDx Ada George Road Youth', src: '/logos/tedx-ada-george-road-youth.png' },
    { name: 'Made In Nigeria', src: '/logos/made-in-nigeria.png' },
    { name: 'Talkaholic Unlimited', src: '/logos/talkaholic-unlimited.png' },
    { name: 'Bereeth Travel & Tours', src: '/logos/bereeth-travel-and-tours.png' },
    { name: 'YALI RLC', src: '/logos/yali-rlc-logo-1.png' },
    { name: 'PromptEarn', src: '/logos/promptearn-blue-green.png' },
    { name: 'KOBABAYC', src: '/logos/kobabayc-logo.png' },
  ];

  const ecosystemTools = [
    {
      title: 'BrandPawa Test',
      description: 'A structured test that measures your brand\'s real strength, positioning and growth readiness.',
      icon: <FiTarget className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Discovery Quizzes',
      description: 'Fast, focused quizzes that decode what fits your brand — from color psychology to platform strategy to brand personality.',
      icon: <FiBookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Guided Growth Challenges',
      description: 'Step-by-step execution programs that translate insights into tangible results: audience growth, authority building, and revenue.',
      icon: <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Brand Strategy & Intelligence',
      description: 'Strategic frameworks that sharpen your positioning, messaging, and market perception so you stand out, not blend in.',
      icon: <FiBarChart2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Talent & Resources',
      description: 'Pre-vetted designers, marketers, and strategists ready to execute when you need expert hands on deck.',
      icon: <FiUsers className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-indigo-500 to-purple-500',
      comingSoon: true
    },
    {
      title: 'Learn with BrandPawa',
      description: 'Structured brand education for builders who want to master growth, not just chase tactics.',
      icon: <FiGlobe className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'from-pink-500 to-rose-500',
      comingSoon: true
    }
  ];

  const heroStats = [
    { number: '1000+', label: 'Active Brands' },
    { number: '98%', label: 'Alignment Score' },
    { number: '10x', label: 'Growth Potential' },
    { number: '24/7', label: 'Brand Intelligence' }
  ];

  const heroMessages = [
    'Measure brand strength with clarity.',
    'Get clarity on every brand decision with guided quizzes.',
    'Turn insight into execution with guided action.'
  ];
  const welcomeHeadline = 'Let’s build your brand with clarity';

  const audienceGroups = [
    {
      title: 'Founders and business owners',
      label: 'Built for operators',
      description: 'For builders shaping serious companies and brands with long-term market ambition.',
      image: 'https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg?cs=srgb&dl=pexels-startup-stock-photos-7097.jpg&fm=jpg'
    },
    {
      title: 'Creators building serious brands',
      label: 'Made for creators',
      description: 'For creators turning visibility into trust, systems, and stronger monetization.',
      image: 'https://images.pexels.com/photos/29065467/pexels-photo-29065467.jpeg?cs=srgb&dl=pexels-leticiacurveloph-29065467.jpg&fm=jpg'
    },
    {
      title: 'Startups scaling beyond survival',
      label: 'Designed for growth',
      description: 'For teams moving from survival mode into sharper positioning, traction, and market clarity.',
      image: 'https://images.pexels.com/photos/6913217/pexels-photo-6913217.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-6913217.jpg&fm=jpg'
    },
    {
      title: 'Consultants, coaches, and professionals with expertise to monetize',
      label: 'For experts',
      description: 'For experts building authority, premium perception, and repeatable demand around what they know.',
      image: 'https://images.pexels.com/photos/7821908/pexels-photo-7821908.jpeg?cs=srgb&dl=pexels-rdne-7821908.jpg&fm=jpg'
    }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!sessionUser) return;

    const savedStartFlow = readStartFlowState();
    if (!savedStartFlow || isStartFlowReady(savedStartFlow)) return;

    setStartFlowIntent(savedStartFlow.intent);
    setStartFlowBrandName(savedStartFlow.brandName ?? '');
    setStartFlowStep(0);
    setIsStartFlowOpen(true);
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
    setAuthError('');
    setAuthSuccess('');
  }, [sessionUser]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroMessageIndex((current) => (current + 1) % heroMessages.length);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [heroMessages.length]);

  useEffect(() => {
    if (!isStartFlowOpen || startFlowStep !== 0) return;

    setTypedWelcomeHeadline('');
    let currentIndex = 0;

    const intervalId = window.setInterval(() => {
      currentIndex += 1;
      setTypedWelcomeHeadline(welcomeHeadline.slice(0, currentIndex));

      if (currentIndex >= welcomeHeadline.length) {
        window.clearInterval(intervalId);
      }
    }, 28);

    return () => window.clearInterval(intervalId);
  }, [isStartFlowOpen, startFlowStep, welcomeHeadline]);

  const openStartFlow = (intent: StartFlowIntent) => {
    setStartFlowIntent(intent);
    setAuthError('');
    setAuthSuccess('');

    if (!sessionUser) {
      saveStartFlowState({
        intent,
        source: 'landing',
        updatedAt: new Date().toISOString(),
      });
      setIsLoginModalOpen(false);
      setIsSignupModalOpen(true);
      return;
    }

    setStartFlowStep(0);
    setIsStartFlowOpen(true);
  };

  const closeStartFlow = () => {
    setIsStartFlowOpen(false);
    setStartFlowStep(0);
  };

  const goToNextStartFlowStep = () => {
    setStartFlowStep((current) => Math.min(current + 1, 2));
  };

  const goToPreviousStartFlowStep = () => {
    setStartFlowStep((current) => Math.max(current - 1, 0));
  };

  const beginSavedExperience = async (intent: StartFlowIntent) => {
    await router.push(getStartFlowRoute(intent));
  };

  const saveGuidedStartFlow = () => {
    saveStartFlowState({
      intent: startFlowIntent,
      profileType: startFlowProfileType,
      goal: startFlowGoal,
      brandName: startFlowBrandName.trim() || undefined,
      source: 'landing',
      updatedAt: new Date().toISOString(),
    });
  };

  const startExperience = async (mode: 'signup' | 'login' | 'direct' = 'direct') => {
    saveGuidedStartFlow();

    if (sessionUser) {
      closeStartFlow();
      await beginSavedExperience(startFlowIntent);
      return;
    }

    closeStartFlow();

    if (mode === 'login') {
      setIsLoginModalOpen(true);
      return;
    }

    if (mode === 'signup') {
      setIsSignupModalOpen(true);
    }
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedForm = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      company: contactForm.company.trim(),
      budget: contactForm.budget.trim(),
      message: contactForm.message.trim(),
    };

    if (!trimmedForm.name || !trimmedForm.email || !trimmedForm.budget || !trimmedForm.message) {
      setContactStatus({
        type: 'error',
        message: 'Please fill in your name, email, budget, and message.',
      });
      return;
    }

    setIsContactSubmitting(true);
    setContactStatus(null);

    const webhookUrl = process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL;
    let webhookSucceeded = false;
    let backupSucceeded = false;

    try {
      if (webhookUrl) {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trimmedForm),
        });

        webhookSucceeded = webhookResponse.ok;

        if (!webhookResponse.ok) {
          const webhookErrorText = await webhookResponse.text();
          console.error('Google Sheets webhook failed:', webhookErrorText);
        }
      } else {
        console.warn('NEXT_PUBLIC_CONTACT_WEBHOOK_URL is not set. Skipping Google Sheets webhook.');
      }

      const backupResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedForm),
      });

      backupSucceeded = backupResponse.ok;

      if (!backupResponse.ok) {
        const backupPayload = await backupResponse.json().catch(() => null);
        console.error('Supabase backup failed:', backupPayload);
      }

      if (!webhookSucceeded && !backupSucceeded) {
        throw new Error('We could not send your message right now. Please try again in a moment.');
      }

      setContactStatus({
        type: 'success',
        message: webhookSucceeded && backupSucceeded
          ? 'Thanks. Your message has been sent successfully.'
          : 'Thanks. Your message was received, and we saved a backup copy while one delivery path catches up.',
      });

      setContactForm({
        name: '',
        email: '',
        company: '',
        budget: '',
        message: ''
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'We could not send your message right now. Please try again.';

      setContactStatus({
        type: 'error',
        message,
      });
    } finally {
      setIsContactSubmitting(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');

    if (!loginEmail || !loginPassword) {
      setAuthError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    // Success - redirect to dashboard
    setLoading(false);
    setIsLoginModalOpen(false);

    const savedStartFlow = readStartFlowState();
    if (savedStartFlow && !isStartFlowReady(savedStartFlow)) {
      return;
    }

    await navigateToSavedStartFlow(router);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');

    // Validation
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setAuthError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          full_name: signupName,
          plan: 'free',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    // Create user profile in profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          full_name: signupName,
          email: signupEmail,
          plan: 'free',
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    if (data.session) {
      setLoading(false);
      setIsSignupModalOpen(false);

      const savedStartFlow = readStartFlowState();
      if (savedStartFlow && !isStartFlowReady(savedStartFlow)) {
        return;
      }

      await navigateToSavedStartFlow(router);
      return;
    }

    setLoading(false);
    
    // Show success message inside modal (not alert)
    setAuthSuccess('Account created successfully! Please check your email to verify your account.');
    
    // Clear form
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    
    // Don't close modal immediately - let user see the success message
    setTimeout(() => {
      setIsSignupModalOpen(false);
      setAuthSuccess('');
    }, 3000);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    // Here you would typically send this to your backend
    console.log(`${waitlistType} waitlist signup:`, waitlistEmail);
    
    setWaitlistMessage(`You're on the ${waitlistType} waitlist. We'll notify you when it launches.`);
    setWaitlistEmail('');
  };

  const Modal = ({ isOpen, onClose, children }: any) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.42),_transparent_25%),rgba(250,240,255,0.72)] p-4 backdrop-blur-md">
        <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/80 bg-white/92 shadow-2xl backdrop-blur">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="site-shell text-gray-800">
      <PublicHeader
        links={[
          {
            href: '#product',
            label: 'Product',
            items: [
              { href: '#ecosystem', label: 'BrandPawa Test' },
              { href: '#ecosystem', label: 'Quizzes' },
              { href: '#ecosystem', label: 'Growth Challenges' },
            ],
          },
          { href: '#how-it-works', label: 'How it Works' },
          { href: '#about-us', label: 'About Us' },
          { href: '#blog', label: 'Blog' },
          {
            href: '#learn',
            label: 'Learn',
            items: [
              { href: '#learn', label: 'Shop' },
              { href: '#learn', label: 'MasterClass' },
            ],
          },
        ]}
        ctaSecondary={{ label: sessionUser ? 'Dashboard' : 'Login', onClick: () => (sessionUser ? router.push('/dashboard') : setIsLoginModalOpen(true)) }}
        ctaPrimary={{ label: sessionUser ? 'Open App' : 'Sign Up', onClick: () => (sessionUser ? router.push('/dashboard') : setIsSignupModalOpen(true)) }}
      />

      <main>
        <section className="site-section">
          <div className="site-container">
            <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <span className="mb-5 inline-flex rounded-full border border-purple-200 bg-white/90 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
                  <span>The #1 Brand Operating System</span>
                  <FiAward className="ml-2" />
                </span>
                <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                  Build a Brand that Wins
                </h1>
                <p className="mt-6 max-w-3xl text-lg text-slate-700 sm:text-xl lg:text-2xl">
                  BrandPawa is the brand operating system for founders, creators, and businesses that intend to own attention, earn trust, and scale with precision.
                </p>
                <div className="mt-6 max-w-2xl">
                  <div className="inline-flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-600 shadow-[0_0_0_6px_rgba(168,85,247,0.14)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-purple-700">
                      INSIDE BRANDPAWA
                    </p>
                  </div>
                  <div className="mt-4 min-h-[5rem] border-l-4 border-purple-500 pl-5 sm:pl-6">
                    <p
                      key={heroMessages[heroMessageIndex]}
                      className="max-w-xl text-lg font-bold leading-8 text-slate-900 transition-all duration-500 sm:text-2xl sm:leading-10"
                    >
                      {heroMessages[heroMessageIndex]}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => openStartFlow('test')}
                    className="site-primary-button justify-center sm:justify-start"
                  >
                    <span>Take the BrandPawa Test</span>
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => openStartFlow('quiz')}
                    className="site-ghost-button justify-center sm:justify-start"
                  >
                    <span>Start a Quiz</span>
                    <FiPlay />
                  </button>
                </div>
              </div>

              <div className="site-card overflow-hidden p-4 sm:p-5">
                <LiveBrandWall
                  hideHeader
                  compact
                  showRecent={false}
                />
              </div>
            </div>

          </div>
        </section>

      {/* How It Works */}
      <section id="how-it-works" className="site-section bg-white/80">
        <div className="site-container">
          <div className="mb-10 text-center">
            <span className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
              Process
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-bold">
              Brand Growth, Systemized
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600">
              Most brands work hard but grow slow because they&apos;re guessing. BrandPawa replaces guesswork with structure, insight, and execution.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Measure Strength',
                description: 'Take the BrandPawa Test to see where your brand really stands today.',
                icon: <FiTarget className="w-6 h-6 sm:w-8 sm:h-8" />
              },
              {
                step: '02',
                title: 'Discover Fit',
                description: 'Quick quizzes reveal what works for your brand: the right colors, archetype, platform strategy, and visual style.',
                icon: <FiBookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
              },
              {
                step: '03',
                title: 'Identify the Gap',
                description: 'We show you what\'s working, what\'s missing, and what\'s quietly killing your growth.',
                icon: <FiEye className="w-6 h-6 sm:w-8 sm:h-8" />
              },
              {
                step: '04',
                title: 'Execute with Precision',
                description: 'Take action with guided challenges, systems, and next-step execution paths to close gaps and accelerate growth.',
                icon: <FiZap className="w-6 h-6 sm:w-8 sm:h-8" />
              }
            ].map((step) => (
              <div key={step.step} className="bg-gradient-to-b from-purple-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg border border-purple-100">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-white text-lg sm:text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BrandPawa */}
      <section id="about-us" className="site-section bg-gradient-to-b from-white to-gray-50/80">
        <div className="site-container">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                Why BrandPawa
              </span>
              <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-bold">
                You&apos;re Doing the Work. So Why Isn&apos;t It Working?
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">
                Most brands are active but not aligned. BrandPawa gives you the diagnosis, strategy, and systems to turn effort into outcomes.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="site-card p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  The Problem
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  Most brands don&apos;t know:
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    'Why they keep showing up but nothing converts',
                    'What’s actually blocking their growth',
                    'Where their credibility and positioning breaks down',
                    'What to fix first — before doing more'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                        <FiX className="h-3 w-3 text-red-500" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white shadow-xl sm:p-8 md:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">What BrandPawa Changes</p>
                <p className="mt-4 text-2xl font-bold">
                  BrandPawa ends the guesswork.
                </p>
                <p className="mt-4 text-white/85">
                  We start with a diagnosis, not a template. Then we give you the strategy, execution system, and support to build a brand that compounds.
                </p>
                <div className="mt-8 grid gap-4">
                  {[
                    'The BrandPawa Test — see exactly where you stand',
                    'Discovery Quizzes — clarity on every key brand decision',
                    'Guided Growth Challenges — structured execution, not random action',
                    'Automation Tools — consistent brand presence without burnout'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/90">
                      <FiCheck className="mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BrandPawa Ecosystem */}
      <section id="product" className="site-section">
        <div id="ecosystem" className="site-container">
          <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <span className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
              Ecosystem
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-bold">
              One Platform. Everything Your Brand Runs On.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              BrandPawa moves you from measurement to clarity to execution without breaking the flow of your brand decisions.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {ecosystemTools.map((tool) => (
              <div key={tool.title} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-transform duration-300 hover:-translate-y-1">
                <div className={`h-1.5 bg-gradient-to-r ${tool.color}`} />
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                      <div className={`bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`}>
                        {tool.icon}
                      </div>
                    </div>
                    {tool.comingSoon && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3">{tool.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Who is BrandPawa For */}
      <section className="site-section bg-gradient-to-b from-gray-50 to-white">
        <div className="site-container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-3xl">
                <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                  Audience
                </span>
                <h2 className="mt-5 text-2xl font-bold sm:text-3xl md:text-4xl">
                  Built for People Who Play the Long Game
                </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                {audienceGroups.map((audience) => (
                  <div key={audience.title} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div
                      className="relative min-h-[240px] bg-cover bg-center p-6 text-white"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.16), rgba(15, 23, 42, 0.78)), url('${audience.image}')`
                      }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_26%),linear-gradient(to_top,rgba(15,23,42,0.46),transparent)]" />
                      <div className="relative flex h-full flex-col justify-between">
                        <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                          {audience.label}
                        </span>
                        <div>
                          <p className="max-w-[16rem] text-xl font-bold leading-8 text-white">
                            {audience.title}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 sm:p-7">
                      <p className="text-base font-semibold leading-7 text-slate-800">
                        {audience.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section bg-white/80">
        <div className="site-container">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white shadow-xl sm:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.82)_0%,rgba(15,23,42,0.58)_45%,rgba(15,23,42,0.24)_100%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.14),transparent_28%)]" />
            <div className="absolute right-0 top-0 h-full w-full bg-[url('/images/founderimg.JPG')] bg-cover bg-right opacity-[0.4]" />
            <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              From The Founder&apos;s Desk
            </p>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-bold">
              Building the Brand Infrastructure for Africa
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
              Our vision is to become the brand infrastructure layer for Africa, giving millions of businesses the clarity, power, and systems to compete globally.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/65">Dunamis Shiloh Okonwor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Community */}
      <section id="community" className="site-section overflow-hidden">
        <div className="site-container">
          <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              Trust
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-bold">
              Trusted by builders shaping the next generation
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              BrandPawa is trusted by founders, creators, and organizations building the future of African brands.
            </p>
          </div>
          
          {/* Animated Logos */}
          <div className="relative overflow-hidden mb-8">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...trustedLogos, ...trustedLogos].map((logo, index) => (
                <div 
                  key={index} 
                  className="inline-flex mx-4 items-center justify-center min-w-[200px] h-24 bg-white rounded-2xl shadow-lg border border-gray-100 px-6"
                >
                  <img src={logo.src} alt={logo.name} className="max-h-12 w-auto max-w-[150px] object-contain" />
                </div>
              ))}
            </div>
            
            <style jsx>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 30s linear infinite;
                display: flex;
                width: max-content;
              }
            `}</style>
          </div>
          
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-left text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Work with us</p>
              <h3 className="mt-4 text-2xl font-bold">Bring BrandPawa into your next brand build.</h3>
              <p className="mt-4 text-sm leading-7 text-white/75">Strategy, diagnostics, and execution work better when they move together. Tell us what you are building and where you need help.</p>
              <div className="mt-8 space-y-3">
                {[
                  'Brand diagnostics and growth planning',
                  'Challenge-led execution support',
                  'Creator, founder, and business brand systems'
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/85">
                    <FiBriefcase className="mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="contact" className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-xl sm:p-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Contact</p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900">Tell us about your project</h3>
                  <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm((current) => ({ ...current, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((current) => ({ ...current, email: e.target.value }))}
                      placeholder="Email address"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm((current) => ({ ...current, company: e.target.value }))}
                      placeholder="Company or brand"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                      value={contactForm.budget}
                      onChange={(e) => setContactForm((current) => ({ ...current, budget: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Budget range</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1500">$500 - $1,500</option>
                      <option value="1500-5000">$1,500 - $5,000</option>
                      <option value="5000-plus">$5,000+</option>
                    </select>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm((current) => ({ ...current, message: e.target.value }))}
                      placeholder="What are you building and where do you need help?"
                      rows={5}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isContactSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span>{isContactSubmitting ? 'Sending...' : 'Send Enquiry'}</span>
                      <FiArrowRight />
                    </button>
                    {contactStatus && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          contactStatus.type === 'success'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {contactStatus.message}
                      </div>
                    )}
                  </form>
                </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 text-left shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-600">BrandPawa Tribe</p>
            <h3 className="mt-3 text-2xl font-bold text-slate-900">Join the communities building with BrandPawa</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Stay close to builders growing with clarity, consistency, and brand momentum across our community channels.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: 'WhatsApp',
                  href: 'https://chat.whatsapp.com/JFhzaTnEjOD9vUan4KbCzx?mode=gi_t',
                  accent: 'from-emerald-500 to-green-600',
                  icon: <BsWhatsapp className="h-5 w-5" />
                },
                {
                  label: 'Telegram',
                  href: 'https://t.me/BrandPawa',
                  accent: 'from-sky-500 to-cyan-600',
                  icon: <BsTelegram className="h-5 w-5" />
                },
                {
                  label: 'Facebook',
                  href: 'https://web.facebook.com/groups/brandpawa',
                  accent: 'from-blue-600 to-indigo-700',
                  icon: <BsFacebook className="h-5 w-5" />
                }
              ].map((community) => (
                <a
                  key={community.label}
                  href={community.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${community.accent} text-white shadow-md`}>
                      {community.icon}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">{community.label}</p>
                      <p className="text-sm text-slate-500">Join community</p>
                    </div>
                  </div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition group-hover:text-slate-900">
                    <FiArrowRight className="h-4 w-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="blog" className="site-section bg-white/80">
        <div className="site-container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                Blog
              </span>
              <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-bold">Ideas, insights, and brand thinking worth revisiting</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogPosts.map((post) => (
                <article key={post.slug} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <img src={post.image} alt={post.title} className="h-52 w-full object-cover" />
                  <div className="p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-600">
                      Published by {post.publishedBy}
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">{post.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Read article
                      <FiArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
              >
                View all blog posts
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="learn" className="site-section">
        <div className="site-container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <span className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
                Learn
              </span>
              <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-bold">Shop tools and MasterClass experiences are on the way</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Shop</div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">Templates, guides, and operator resources</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  We&apos;re packaging the most useful BrandPawa resources into sharper products that help builders move faster without losing strategic clarity.
                </p>
              </div>
              <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">MasterClass</div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">Structured learning for builders who want depth</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  MasterClass is being shaped as a focused learning path around brand operating systems, growth discipline, and authority-building execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="site-container text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Stop the Guesswork. Build with Structure.
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Your brand already has potential. BrandPawa helps you unlock it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openStartFlow('test')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 rounded-xl text-base sm:text-lg font-semibold hover:shadow-xl transition"
            >
              Take the BrandPawa Test
            </button>
            <a
              href="https://t.me/BrandPawa"
              target="_blank"
              rel="noreferrer"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-white/10 transition"
            >
              Join the BrandPawa Tribe
            </a>
          </div>
        </div>
      </section>

        <PublicFooter
          tagline="The #1 Brand Operating System"
          links={[
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Service' },
            { href: '/gdpr', label: 'GDPR Compliance' },
            { href: 'https://t.me/BrandPawa', label: 'PAWA Creators Community' },
          ]}
          contactLabel="Contact BrandPawa"
          contactHref="#contact"
        />
      </main>

      {/* Waitlist Modal */}
      <Modal
        isOpen={isWaitlistModalOpen}
        onClose={() => {
          setIsWaitlistModalOpen(false);
          setWaitlistMessage('');
        }}
      >
        <div className="p-6 sm:p-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
            <FiZap className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">
            Join the {waitlistType === 'automation' ? 'Automation' : 'Talent Network'} Waitlist
          </h3>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
            {waitlistType === 'automation'
              ? 'Be the first to know when our automation tools launch!'
              : 'Get notified when our talent network goes live!'}
          </p>
          
          <form onSubmit={handleWaitlistSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="you@company.com"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition text-sm sm:text-base"
            >
              Join Waitlist
            </button>
          </form>
          {waitlistMessage && (
            <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {waitlistMessage}
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={isStartFlowOpen} onClose={closeStartFlow}>
        <div className="p-6 sm:p-8">
          {startFlowStep === 0 && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-purple-100">
                <BrandPawaLogo href="" size="sm" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-600">Guided Start</p>
              <h3 className="mt-3 min-h-[3.5rem] text-2xl font-bold text-slate-900 sm:text-3xl">
                {typedWelcomeHeadline || '\u00A0'}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                We&apos;ll ask a few quick questions to understand your brand and recommend the right path.
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Takes less than 2 minutes
              </p>
              <button
                type="button"
                onClick={goToNextStartFlowStep}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 font-semibold text-white transition hover:shadow-lg"
              >
                <span>Start</span>
                <FiArrowRight />
              </button>
            </div>
          )}

          {startFlowStep === 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-600">Step 1 of 2</p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">How do you want to start?</h3>
              <p className="mt-3 text-sm text-slate-600">
                We&apos;ve suggested a starting point based on where you came from.
              </p>

              <div className="mt-6 space-y-3">
                {startFlowIntentOptions.map((option) => {
                  const isSelected = startFlowIntent === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStartFlowIntent(option.value)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-purple-400 bg-purple-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-purple-200 hover:bg-purple-50/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{option.label}</span>
                            {option.value === 'test' && (
                              <span className="rounded-full bg-purple-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-purple-700">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                        </div>
                        <div
                          className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                            isSelected ? 'border-purple-500 bg-purple-500 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <FiCheck className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={goToPreviousStartFlowStep}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goToNextStartFlowStep}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-semibold text-white transition hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {startFlowStep === 2 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-600">Step 2 of 2</p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">Tell us about yourself so we can guide you right</h3>
              <p className="mt-3 text-sm text-slate-600">
                A little context helps BrandPawa guide you with more intention from the start.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">What best describes you?</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {startFlowProfileOptions.map((option) => {
                      const isSelected = startFlowProfileType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setStartFlowProfileType(option.value)}
                          className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                            isSelected
                              ? 'border-purple-400 bg-purple-50 text-purple-700'
                              : 'border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-purple-50/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">What&apos;s your primary goal?</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {startFlowGoalOptions.map((option) => {
                      const isSelected = startFlowGoal === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setStartFlowGoal(option.value)}
                          className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                            isSelected
                              ? 'border-purple-400 bg-purple-50 text-purple-700'
                              : 'border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-purple-50/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">Brand name</label>
                  <input
                    type="text"
                    value={startFlowBrandName}
                    onChange={(event) => setStartFlowBrandName(event.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                {startFlowIntent === 'test'
                  ? 'You’ll go straight into the BrandPawa Test after this.'
                  : 'You’ll go straight into a quick quiz after this.'}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {sessionUser ? (
                  <button
                    type="button"
                    onClick={() => startExperience('direct')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 font-semibold text-white transition hover:shadow-lg"
                  >
                    <span>{startFlowIntent === 'test' ? 'Start BrandPawa Test' : 'Start Quick Quiz'}</span>
                    <FiArrowRight />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startExperience('signup')}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 font-semibold text-white transition hover:shadow-lg"
                    >
                      <span>Create Free Account and Start</span>
                      <FiArrowRight />
                    </button>
                    <button
                      type="button"
                      onClick={() => startExperience('login')}
                      className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      I already have an account
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={goToPreviousStartFlowStep}
                  className="rounded-2xl px-5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <div className="p-6 sm:p-8">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <BrandPawaLogo href="" size="md" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Sign in to BrandPawa</h3>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">Access your brand Workspace</p>
          
          {authError && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs sm:text-sm">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-xs sm:text-sm">
              {authSuccess}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showLoginPassword ? <FiEyeOff size={18} /> : <FiEyeIcon size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-purple-600 w-4 h-4" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!loginEmail) {
                    setAuthError('Please enter your email first');
                    return;
                  }
                  // Handle password reset
                  supabase.auth.resetPasswordForEmail(loginEmail, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                  }).then(() => {
                    setAuthSuccess('Password reset email sent! Check your inbox.');
                  }).catch((error) => {
                    setAuthError(error.message);
                  });
                }}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                Forgot password?
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Signing in...' : 'Sign In to Workspace'}
            </button>
            
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 sm:py-3 border border-gray-300 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition disabled:opacity-50 text-sm sm:text-base"
            >
              <FcGoogle size={18} className="sm:w-5 sm:h-5" />
              <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
            
            <div className="text-center mt-3 sm:mt-4">
              <span className="text-gray-600 text-sm">Don&apos;t have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsSignupModalOpen(true);
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Signup Modal */}
      <Modal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)}>
        <div className="p-6 sm:p-8">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <BrandPawaLogo href="" size="md" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Create Account</h3>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">Start your brand&apos;s journey today</p>
          
          {authError && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs sm:text-sm">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-xs sm:text-sm">
              {authSuccess}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                placeholder="John Smith"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                placeholder="you@company.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showSignupPassword ? <FiEyeOff size={18} /> : <FiEyeIcon size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEyeIcon size={18} />}
                </button>
              </div>
            </div>
            
            <label className="flex items-start space-x-2 text-xs sm:text-sm">
              <input 
                type="checkbox" 
                className="mt-0.5 sm:mt-1 rounded text-purple-600 w-4 h-4" 
                required 
              />
              <span className="text-gray-600">
                I agree to the{' '}
                <a href="/terms" className="text-purple-600 hover:text-purple-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-purple-600 hover:text-purple-700">
                  Privacy Policy
                </a>
              </span>
            </label>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 sm:py-3 border border-gray-300 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition disabled:opacity-50 text-sm sm:text-base"
              >
                <FcGoogle size={18} className="sm:w-5 sm:h-5" />
                <span>Google</span>
              </button>
            </div>
            
            <div className="text-center mt-3 sm:mt-4">
              <span className="text-gray-600 text-sm">Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignupModalOpen(false);
                  setIsLoginModalOpen(true);
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
