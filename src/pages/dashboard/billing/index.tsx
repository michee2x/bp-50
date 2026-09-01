// src/pages/dashboard/billing/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabase';
import { BrandLoader } from '../../../components/BrandLoader';
import { FREE_PLAN_DIAGNOSTIC_ATTEMPT_LIMIT } from '../../../lib/diagnosticAccess';
import {
  FiCheck, FiCreditCard, FiDollarSign, FiCalendar,
  FiDownload, FiFileText, FiShield, FiClock,
  FiUsers, FiZap, FiStar, FiAward, FiBarChart2,
  FiTarget, FiEye, FiMessageSquare, FiGlobe,
  FiInstagram, FiHeart, FiDroplet, FiRefreshCw,
  FiAlertCircle, FiHelpCircle, FiArrowLeft,
  FiExternalLink, FiLock, FiUnlock, FiPercent
} from 'react-icons/fi';

interface Plan {
  id: string;
  name: string;
  description: string;
  tierLabel: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  popular?: boolean;
  color: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'inactive' | 'past_due' | 'canceled';
  current_period_end: string;
  current_period_start: string;
  cancel_at_period_end: boolean;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  description: string;
  download_url?: string;
}

const BankTransferIcon = () => (
  <svg viewBox="0 0 64 40" className="h-10 w-16" aria-hidden="true">
    <rect x="1.5" y="1.5" width="61" height="37" rx="12" fill="#EFF6FF" stroke="#BFDBFE" />
    <path d="M32 10L46 16V18H18V16L32 10Z" fill="#2563EB" />
    <path d="M22 20H26V28H22V20ZM29 20H35V28H29V20ZM38 20H42V28H38V20Z" fill="#1D4ED8" />
    <path d="M18 30H46V32H18V30Z" fill="#2563EB" />
    <path d="M47 25L52 20M52 20H48M52 20V24" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const paymentMethods = [
  {
    name: 'Visa',
    logoSrc: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Visa_2021.svg',
    logoAlt: 'Visa logo',
  },
  {
    name: 'Mastercard',
    logoSrc: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mastercard_2019_logo.svg',
    logoAlt: 'Mastercard logo',
  },
  {
    name: 'Verve',
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Verve_%28logo%29.svg/512px-Verve_%28logo%29.svg.png',
    logoAlt: 'Verve logo',
  },
  { name: 'Bank Transfer', Icon: BankTransferIcon },
];

export default function BillingPage() {
  const router = useRouter();
  const { reference, trxref, tab } = router.query;
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plans' | 'subscription' | 'invoices' | 'usage'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Plans configuration
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Starter',
      tierLabel: 'For discovering where your brand stands',
      description: 'Entry point. Awareness plus curiosity.',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        'BrandPawa Score (Basic)',
        'Color Power Quiz',
        'Brand Personality Quiz',
        'Limited Results Insight',
        '7-Day Visibility Challenge',
        'Basic Dashboard',
        'Email Summary'
      ],
      color: 'from-slate-100 to-slate-200'
    },
    {
      id: 'pro',
      name: 'Growth',
      tierLabel: 'For building a clear, visible, and consistent brand',
      description: 'For people actively building.',
      priceMonthly: 499900,
      priceYearly: 4999900,
      features: [
        'Everything in Starter',
        'Full Brand Score Breakdown',
        'All Quizzes + Core Diagnostics',
        '14-Day & 30-Day Challenges',
        'Growth Dashboard (Track Progress)',
        'Personalized Recommendations',
        'Downloadable Reports (PDF)',
        'Content & Positioning Guidance'
      ],
      popular: true,
      color: 'from-purple-100 to-pink-100'
    },
    {
      id: 'enterprise',
      name: 'Authority',
      tierLabel: 'For building a premium, dominant brand',
      description: 'For serious brand dominance.',
      priceMonthly: 1499900,
      priceYearly: 14999900,
      features: [
        'Everything in Growth',
        'All Advanced Diagnostics',
        'Authority Score System',
        'Premium Challenges (Authority, Marketing, Audience Growth)',
        'Brand Positioning Intelligence Engine',
        'Custom Brand Guides',
        'Strategy-Level Insights',
        'Priority Support'
      ],
      color: 'from-amber-100 to-orange-100'
    }
  ];

  const formatPlanHeading = (plan: Plan) => {
    if (plan.id === 'free') {
      return 'STARTER (Free)';
    }

    if (plan.popular) {
      return 'GROWTH (Most Popular)';
    }

    return plan.name.toUpperCase();
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (!router.isReady || typeof tab !== 'string') return;

    if (tab === 'plans' || tab === 'subscription' || tab === 'invoices' || tab === 'usage') {
      setActiveTab(tab);
    }
  }, [router.isReady, tab]);

  useEffect(() => {
    if (!router.isReady || !user) return;

    const paystackReference =
      (typeof reference === 'string' && reference) ||
      (typeof trxref === 'string' && trxref) ||
      '';

    if (!paystackReference) return;

    verifyReturnedPayment(paystackReference);
  }, [router.isReady, reference, trxref, user]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);
      
      // Fetch subscription data
      await fetchSubscriptionData(user.id);
      
      // Fetch invoices
      await fetchInvoices(user.id);
      
    } catch (error) {
      console.error('Error loading billing data:', error);
      setError('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionData = async (userId: string) => {
    try {
      const { data: subscriptionData, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'canceled'])
        .order('current_period_end', { ascending: false })
        .limit(1);
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
      }
      
      if (subscriptionData?.length) {
        setSubscription(subscriptionData[0]);
      }
    } catch (error) {
      console.error('Error in fetchSubscriptionData:', error);
    }
  };

  const fetchInvoices = async (userId: string) => {
    try {
      const { data: invoicesData, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching invoices:', error);
        return;
      }
      
      if (invoicesData) {
        const formattedInvoices: Invoice[] = invoicesData.map(inv => ({
          id: inv.id,
          invoice_number: `INV-${inv.id.substring(0, 8).toUpperCase()}`,
          amount: inv.amount / 100, // Convert from kobo to Naira
          currency: inv.currency || 'NGN',
          status: inv.status,
          date: new Date(inv.created_at).toLocaleDateString(),
          description: inv.description || `${inv.plan} Plan Subscription`,
          download_url: inv.invoice_url
        }));
        
        setInvoices(formattedInvoices);
      }
    } catch (error) {
      console.error('Error in fetchInvoices:', error);
    }
  };

  const handleUpgrade = async (plan: Plan) => {
    if (!user || !user.email) {
      setError('Please login to upgrade your plan');
      return;
    }

    if (plan.id === 'free') {
      // Handle downgrade to free
      await handleDowngrade();
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleDowngrade = async () => {
    if (!user) return;
    
    if (!window.confirm('Are you sure you want to downgrade to the Free plan? You will lose access to Pro features.')) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      if (subscription && new Date(subscription.current_period_end).getTime() > Date.now()) {
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .update({ 
            cancel_at_period_end: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id);
        
        if (subscriptionError) throw subscriptionError;

        await supabase
          .from('user_activity')
          .insert({
            user_id: user.id,
            activity_type: 'plan_downgrade',
            metadata: { from: profile?.plan || 'pro', to: 'free', effective_at_period_end: true },
            created_at: new Date().toISOString()
          });

        setSuccess('Free plan has been scheduled for the end of your current billing period. Your Pro access stays active until then.');
        await checkUser();
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          plan: 'free',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Add activity
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'plan_downgrade',
          metadata: { from: profile?.plan || 'free', to: 'free' },
          created_at: new Date().toISOString()
        });
      
      setSuccess('Successfully moved to the Free plan.');
      router.reload();
      
    } catch (error: any) {
      console.error('Downgrade error:', error);
      setError(error.message || 'Failed to downgrade plan');
    } finally {
      setProcessing(false);
    }
  };

  const processPayment = async () => {
    if (!selectedPlan || !user || !user.email) {
      setError('Missing required information for payment');
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const amount = billingCycle === 'monthly' 
        ? selectedPlan.priceMonthly 
        : selectedPlan.priceYearly;
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount,
          plan: selectedPlan.id,
          billingCycle,
          userId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok || !data.authorization_url) {
        throw new Error(data.error || 'Unable to initialize payment');
      }

      window.location.href = data.authorization_url;
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  const verifyPayment = async (reference: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
      });
      
      const data = await response.json();
      return {
        success: response.ok && Boolean(data.success),
        data: data.data,
        error: data.error
      };
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, error: 'Network error while verifying payment' };
    }
  };

  const verifyReturnedPayment = async (paystackReference: string) => {
    if (verifyingPayment) return;

    setVerifyingPayment(true);
    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const verificationResponse = await verifyPayment(paystackReference);

      if (!verificationResponse.success) {
        throw new Error(verificationResponse.error || 'Payment verification failed. Please contact support.');
      }

      await checkUser();
      setShowPaymentModal(false);
      setSelectedPlan(null);
      setSuccess(`Payment confirmed. Your ${verificationResponse.data?.plan || 'Pro'} plan is now active.`);
      setActiveTab('subscription');

      const cleanedQuery = { ...router.query };
      delete cleanedQuery.reference;
      delete cleanedQuery.trxref;

      router.replace(
        { pathname: router.pathname, query: { ...cleanedQuery, tab: 'subscription' } },
        undefined,
        { shallow: true }
      );
    } catch (error: any) {
      console.error('Returned payment verification error:', error);
      setError(error.message || 'Unable to verify payment right now.');
    } finally {
      setProcessing(false);
      setVerifyingPayment(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !window.confirm('Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing period.')) {
      return;
    }
    
    setProcessing(true);
    
    try {
      // Update subscription status
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id);
      
      if (error) throw error;
      
      // Add activity
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'subscription_canceled',
          metadata: { plan: subscription.plan },
          created_at: new Date().toISOString()
        });
      
      setSuccess('Subscription cancelled. You will continue to have access until the end of your billing period.');
      
      // Refresh data
      setTimeout(() => {
        router.reload();
      }, 2000);
      
    } catch (error: any) {
      console.error('Cancellation error:', error);
      setError(error.message || 'Failed to cancel subscription');
    } finally {
      setProcessing(false);
    }
  };

  const handleKeepSubscription = async () => {
    if (!subscription) return;

    setProcessing(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: false,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id);

      if (error) throw error;

      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'subscription_resumed',
          metadata: { plan: subscription.plan },
          created_at: new Date().toISOString()
        });

      setSuccess('Your Pro plan will continue as normal. Auto-renewal has been restored.');
      await checkUser();
    } catch (error: any) {
      console.error('Resume subscription error:', error);
      setError(error.message || 'Failed to keep subscription active.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const getSavingsPercentage = (plan: Plan) => {
    if (plan.priceYearly === 0) return 0;
    const monthlyTotal = plan.priceMonthly * 12;
    const savings = monthlyTotal - plan.priceYearly;
    return Math.round((savings / monthlyTotal) * 100);
  };

  const getApproximateSavings = (plan: Plan) => {
    if (plan.priceYearly === 0) return 0;
    const yearlyGap = (plan.priceMonthly * 12) - plan.priceYearly;
    return Math.round(yearlyGap / 100000) * 1000;
  };

  const renderPlans = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-purple-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
          Pricing
        </div>
        <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">Choose the BrandPawa tier that matches your next move</h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Starter for awareness, Growth for serious building, and Authority for premium brand dominance.
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-white">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Yearly (Save up to 17%)
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = profile?.plan === plan.id;
          const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isFree = plan.id === 'free';
          const savings = getSavingsPercentage(plan);
          const approxSavings = getApproximateSavings(plan);
          
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-8 transition-all bg-gradient-to-b ${plan.color} ${
                plan.popular
                  ? 'border-purple-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-purple-300'
              } ${isCurrentPlan ? 'ring-2 ring-purple-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              {savings > 0 && billingCycle === 'yearly' && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    Save {savings}%
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{formatPlanHeading(plan)}</h3>
                <p className="text-sm text-gray-600">{plan.tierLabel}</p>

                <div className="mb-6 mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">{formatCurrency(price)}</span>
                    {!isFree && (
                      <span className="text-gray-500 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && !isFree && (
                    <p className="text-sm text-gray-500 mt-2">
                      Approximately ₦{approxSavings.toLocaleString()} saved ({savings}%)
                    </p>
                  )}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleUpgrade(plan)}
                disabled={processing || (isCurrentPlan && !isFree)}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  isCurrentPlan
                    ? 'bg-gray-100 text-gray-700 cursor-default'
                    : isFree
                    ? 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-300'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {processing
                  ? 'Processing...'
                  : isCurrentPlan
                  ? 'Current Plan'
                  : isFree
                  ? 'Start Free'
                  : plan.id === 'pro'
                  ? 'Upgrade to Growth'
                  : 'Go Authority'}
              </button>
              
              {isCurrentPlan && !isFree && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleCancelSubscription}
                    disabled={processing || subscription?.cancel_at_period_end}
                    className="w-full py-2 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                  >
                    {subscription?.cancel_at_period_end ? 'Cancellation Scheduled' : 'Cancel Subscription'}
                  </button>
                  {subscription?.cancel_at_period_end && (
                    <button
                      onClick={handleKeepSubscription}
                      disabled={processing}
                      className="w-full py-2 text-purple-700 hover:text-purple-800 text-sm font-medium disabled:opacity-50"
                    >
                      Keep Premium Plan
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_30%),linear-gradient(135deg,#28163f_0%,#5826a4_52%,#e4559f_100%)] p-8 text-white shadow-[0_20px_60px_rgba(80,43,133,0.14)]">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Why Upgrade?</div>
          <h3 className="mt-4 text-3xl font-bold">Most brands do not fail because they lack effort.</h3>
          <p className="mt-4 text-base leading-8 text-white/82">
            They fail because they lack clarity, positioning, and systems.
          </p>
          <p className="mt-2 text-base leading-8 text-white/82">
            BrandPawa gives you all three.
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6">Secure Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {paymentMethods.map(({ name, Icon, logoSrc, logoAlt }) => (
            <div key={name} className="bg-gray-50 p-4 rounded-xl text-center">
              <div className="flex h-12 items-center justify-center">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={logoAlt}
                    className="h-10 max-w-[7rem] object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : Icon ? (
                  <Icon />
                ) : null}
              </div>
              <div className="mt-3 font-semibold text-gray-700">{name}</div>
              <div className="text-sm text-gray-500 mt-1">Secured by Paystack</div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <FiShield className="text-green-500 text-xl" />
            <div>
              <div className="font-semibold">Your payment is secure</div>
              <div className="text-sm text-gray-600">
                All payments are processed through Paystack with bank-level security. We never store your card details.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. Cancellation only stops the next renewal. Your Pro access stays active until your current billing period ends, and you can undo the cancellation before then.'
            },
            {
              q: 'Is there a free trial?',
              a: 'The Free plan includes basic features forever. For Pro features, we offer a 14-day money-back guarantee.'
            },
            {
              q: 'Can I switch plans?',
              a: 'You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing period.'
            },
            {
              q: 'Do you offer refunds?',
              a: 'We offer a 14-day money-back guarantee for all paid plans if you\'re not satisfied with our service.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-xl">
              <h4 className="font-bold mb-2">{faq.q}</h4>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSubscription = () => (
    subscription ? (
      <div className="space-y-8">
        {/* Current Subscription Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Current Subscription</h3>
              <div className="flex items-center space-x-3">
                <span className="px-4 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold">
                  {subscription.plan.toUpperCase()}
                </span>
                <span className={`px-4 py-1 rounded-full font-medium ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : subscription.status === 'canceled'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold">
                {formatCurrency(subscription.amount)}
                <span className="text-lg text-gray-500">/{subscription.interval}</span>
              </div>
              <div className="text-sm text-gray-600">
                Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Billing Period</div>
                <div className="font-semibold">
                  {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Payment Method</div>
                <div className="font-semibold">Paystack ••••</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Auto-Renewal</div>
                <div className="font-semibold">
                  {subscription.cancel_at_period_end ? 'Cancellation scheduled at period end' : 'Enabled'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Plan Value</div>
                <div className="font-semibold">
                  Access to {subscription.plan === 'pro' ? 'all 10' : 'all'} features
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t">
            <button
              onClick={() => setActiveTab('plans')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Change Plan
            </button>
            {!subscription.cancel_at_period_end && (
              <button
                onClick={handleCancelSubscription}
                disabled={processing}
                className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
              >
                Cancel Subscription
              </button>
            )}
            {subscription.cancel_at_period_end && (
              <button
                onClick={handleKeepSubscription}
                disabled={processing}
                className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition disabled:opacity-50"
              >
                Keep Premium Plan
              </button>
            )}
            <button
              onClick={() => window.open('https://paystack.com', '_blank')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center space-x-2"
            >
              <FiExternalLink />
              <span>Manage Payment Methods</span>
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Your Plan Usage</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                label: 'Diagnostics Used', 
                value: '7/10', 
                icon: <FiTarget />,
                color: 'text-purple-600',
                progress: 70
              },
              { 
                label: 'Challenges Completed', 
                value: '2/5', 
                icon: <FiZap />,
                color: 'text-purple-600',
                progress: 40
              },
              { 
                label: 'Team Members', 
                value: '1/3', 
                icon: <FiUsers />,
                color: 'text-green-600',
                progress: 33
              }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <div>
                    <div className="font-semibold">{stat.label}</div>
                    <div className="text-2xl font-bold mt-1">{stat.value}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCreditCard className="text-purple-600 text-2xl" />
        </div>
        <h3 className="text-2xl font-bold mb-4">No Active Subscription</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You're currently on the Free plan. Upgrade to unlock all features and take your brand to the next level.
        </p>
        <button
          onClick={() => setActiveTab('plans')}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
        >
          View Upgrade Options
        </button>
      </div>
    )
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Billing History</h3>
          <button 
            onClick={() => window.open('https://paystack.com', '_blank')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2"
          >
            <FiExternalLink />
            <span>View All on Paystack</span>
          </button>
        </div>
        
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold">Invoice #</th>
                  <th className="text-left py-3 font-semibold">Date</th>
                  <th className="text-left py-3 font-semibold">Amount</th>
                  <th className="text-left py-3 font-semibold">Status</th>
                  <th className="text-left py-3 font-semibold">Plan</th>
                  <th className="text-left py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 font-mono text-sm">
                      {invoice.invoice_number}
                    </td>
                    <td className="py-4">
                      {invoice.date}
                    </td>
                    <td className="py-4 font-semibold">
                      {formatCurrency(invoice.amount * 100)}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">
                      {invoice.description.includes('Pro') ? 'Pro' : 'Free'}
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        {invoice.download_url && (
                          <button 
                            onClick={() => window.open(invoice.download_url, '_blank')}
                            className="text-purple-600 hover:text-purple-700 text-sm flex items-center space-x-1"
                          >
                            <FiDownload />
                            <span>PDF</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No invoices found</p>
            <p className="text-sm text-gray-500 mt-2">Your billing history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-8">
      {/* Usage Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6">Usage Summary</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Diagnostics', 
              value: '10', 
              icon: <FiTarget />, 
              max: profile?.plan === 'free' ? `${FREE_PLAN_DIAGNOSTIC_ATTEMPT_LIMIT} attempts each on BrandPawa Score, Color Power, and Brand Personality` : 'Unlimited',
              color: 'bg-purple-100 text-purple-600'
            },
            { 
              label: 'Challenges', 
              value: '2', 
              icon: <FiZap />, 
              max: profile?.plan === 'free' ? '1' : 'All',
              color: 'bg-purple-100 text-purple-600'
            },
            { 
              label: 'Points Earned', 
              value: '350', 
              icon: <FiAward />, 
              max: '∞',
              color: 'bg-green-100 text-green-600'
            },
            { 
              label: 'Active Days', 
              value: '45', 
              icon: <FiCalendar />, 
              max: '∞',
              color: 'bg-orange-100 text-orange-600'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 ${stat.color.split(' ')[0]} rounded-lg flex items-center justify-center`}>
                  <div className={stat.color.split(' ')[1]}>{stat.icon}</div>
                </div>
                <div className="font-semibold">{stat.label}</div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">
                {profile?.plan === 'free' ? 'Limit: ' : 'Available: '}{stat.max}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-100 p-6 rounded-xl">
            <h4 className="font-bold mb-4">Premium Features Status</h4>
            <div className="space-y-4">
              {[
                { feature: '8 Additional Pro Diagnostics', enabled: profile?.plan !== 'free', icon: <FiTarget /> },
                { feature: 'Authority Challenge', enabled: profile?.plan !== 'free', icon: <FiZap /> },
                { feature: 'PDF Reports', enabled: profile?.plan !== 'free', icon: <FiFileText /> },
                { feature: 'Priority Support', enabled: profile?.plan !== 'free', icon: <FiShield /> }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className={item.enabled ? 'font-medium' : 'text-gray-500'}>{item.feature}</span>
                  </div>
                  {item.enabled ? (
                    <FiCheck className="text-green-500" />
                  ) : (
                    <FiLock className="text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <h4 className="font-bold mb-4">Get More Value</h4>
            <div className="space-y-4">
              {[
                { feature: 'Unlimited diagnostics', upgrade: 'Pro', icon: <FiTarget /> },
                { feature: 'Authority Challenge access', upgrade: 'Pro', icon: <FiZap /> },
                { feature: 'Detailed reports', upgrade: 'Pro', icon: <FiFileText /> },
                { feature: 'Priority support', upgrade: 'Pro', icon: <FiAward /> }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.feature}</span>
                  </div>
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {item.upgrade}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('plans')}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Upgrade for More Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentModal = () => {
    if (!selectedPlan) return null;
    
    const amount = billingCycle === 'monthly' 
      ? selectedPlan.priceMonthly 
      : selectedPlan.priceYearly;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCreditCard className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Upgrade to {selectedPlan.name}</h3>
            <p className="text-gray-600">Complete your payment to activate your new plan</p>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-bold">{selectedPlan.name} Plan</div>
                <div className="text-sm text-gray-600">
                  {billingCycle === 'monthly' ? 'Monthly billing' : 'Yearly billing (Save 17%)'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
                <div className="text-sm text-gray-600">
                  {billingCycle === 'monthly' ? 'per month' : 'per year'}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600 mb-2">What you get:</div>
              <ul className="space-y-2">
                {selectedPlan.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {selectedPlan.features.length > 3 && (
                  <li className="text-sm text-gray-500">
                    +{selectedPlan.features.length - 3} more features
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Payment Button */}
          <button
            onClick={processPayment}
            disabled={processing}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {processing ? (
              <>
                <BrandLoader size="sm" variant="inline" className="text-white" textClassName="text-white" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <FiCreditCard />
                <span>Pay {formatCurrency(amount)} Now</span>
              </>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Secured by Paystack • 14-day money-back guarantee
          </p>
          
          <button
            onClick={() => setShowPaymentModal(false)}
            disabled={processing}
            className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF0FF] flex items-center justify-center">
        <BrandLoader label="Loading billing information..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF0FF]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <FiArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Billing & Subscription</h1>
              <p className="text-gray-600">Manage your plan, billing, and usage</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full font-semibold ${
                profile?.plan === 'free'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
              }`}>
                Current: {profile?.plan?.toUpperCase() || 'FREE'}
              </div>
              <button
                onClick={() => window.open('mailto:support@brandpawa.com', '_blank')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center space-x-2"
              >
                <FiHelpCircle />
                <span>Help</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2 text-red-700">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2 text-green-700">
              <FiCheck className="text-green-500" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { id: 'plans', label: 'Plans & Pricing', icon: <FiCreditCard /> },
              { id: 'subscription', label: 'Subscription', icon: <FiCalendar /> },
              { id: 'invoices', label: 'Invoices', icon: <FiFileText /> },
              { id: 'usage', label: 'Usage', icon: <FiBarChart2 /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          {activeTab === 'plans' && renderPlans()}
          {activeTab === 'subscription' && renderSubscription()}
          {activeTab === 'invoices' && renderInvoices()}
          {activeTab === 'usage' && renderUsage()}
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Need Help with Billing?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you with any billing questions or issues you may have.
              We typically respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open('mailto:support@brandpawa.com', '_blank')}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Contact Support
              </button>
              <button
                onClick={() => window.open('https://help.brandpawa.com', '_blank')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                View Help Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && renderPaymentModal()}
    </div>
  );
}
