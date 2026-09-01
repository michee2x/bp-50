import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  FiAward,
  FiBarChart2,
  FiCheck,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiTarget,
  FiX,
  FiZap,
} from 'react-icons/fi';

interface Step {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  section?: string;
  icon?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const STORAGE_KEY = 'brandpawa_onboarding_completed';

const steps: Step[] = [
  {
    id: 'welcome',
    title: 'Welcome to BrandPawa!',
    description: "Let's take a quick tour so you know where everything lives in your dashboard.",
    targetSelector: 'body',
    position: 'bottom',
  },
  {
    id: 'overview',
    title: 'Overview',
    description: 'See your score, momentum, recent activity, and the quickest next move from one place.',
    targetSelector: '[data-tour="overview"]',
    section: 'overview',
    icon: <FiBarChart2 className="h-5 w-5" />,
    position: 'bottom',
  },
  {
    id: 'brand-test',
    title: 'Brand Test',
    description: 'BrandPawa Score lives on its own here because it is your main test and first product.',
    targetSelector: '[data-tour="brand-test"]',
    section: 'brand-test',
    icon: <FiAward className="h-5 w-5" />,
    position: 'bottom',
  },
  {
    id: 'diagnostics',
    title: 'Quizzes',
    description: 'Use these supporting quizzes after the Brand Test when you want focused insight.',
    targetSelector: '[data-tour="diagnostics"]',
    section: 'diagnostics',
    icon: <FiTarget className="h-5 w-5" />,
    position: 'bottom',
  },
  {
    id: 'challenges',
    title: 'Challenges',
    description: 'Join guided challenges to build momentum and turn insight into action.',
    targetSelector: '[data-tour="challenges"]',
    section: 'challenges',
    icon: <FiZap className="h-5 w-5" />,
    position: 'bottom',
  },
  {
    id: 'results',
    title: 'Results',
    description: 'Review completed quiz scores and open detailed results whenever you need them.',
    targetSelector: '[data-tour="results"]',
    section: 'results',
    icon: <FiAward className="h-5 w-5" />,
    position: 'bottom',
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Manage plan access here whenever you want more quizzes, challenges, or premium tools.',
    targetSelector: '[data-tour="billing"]',
    section: 'settings',
    icon: <FiCreditCard className="h-5 w-5" />,
    position: 'top',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Update your profile, rerun the tour, and manage your account preferences here.',
    targetSelector: '[data-tour="settings"]',
    section: 'settings',
    icon: <FiSettings className="h-5 w-5" />,
    position: 'top',
  },
];

interface OnboardingTourProps {
  onComplete?: () => void;
  onStepSectionChange?: (section: string) => void;
}

export default function OnboardingTour({
  onComplete,
  onStepSectionChange,
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const missingStepAttemptsRef = useRef(0);

  const step = steps[currentStep];
  const progress = useMemo(
    () => ((currentStep + 1) / steps.length) * 100,
    [currentStep]
  );

  useEffect(() => {
    const hasCompleted = window.localStorage.getItem(STORAGE_KEY);
    if (!hasCompleted) {
      setIsOpen(true);
      setCurrentStep(0);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !step) return;

    activeElementRef.current = null;
    setTargetRect(null);

    if (step.section) {
      onStepSectionChange?.(step.section);
    }

    const timer = window.setTimeout(() => {
      locateStepTarget();
    }, 220);

    const handleViewportChange = () => {
      if (resizeFrameRef.current) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        syncTargetRect();
      });
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.clearTimeout(timer);
      if (resizeFrameRef.current) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isOpen, step, onStepSectionChange]);

  const syncTargetRect = () => {
    const element = activeElementRef.current;
    if (!element) {
      setTargetRect(null);
      return;
    }

    setTargetRect(element.getBoundingClientRect());
  };

  const locateStepTarget = () => {
    if (!step) return;

    if (step.id === 'welcome') {
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(step.targetSelector);
    if (!(element instanceof HTMLElement)) {
      missingStepAttemptsRef.current += 1;

      if (missingStepAttemptsRef.current < 5) {
        window.setTimeout(() => {
          locateStepTarget();
        }, 180);
        return;
      }

      handleNext();
      return;
    }

    missingStepAttemptsRef.current = 0;
    activeElementRef.current = element;
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
    window.requestAnimationFrame(() => {
      syncTargetRect();
    });
  };

  const completeOnboarding = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
    onComplete?.();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((value) => value + 1);
      return;
    }

    completeOnboarding();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((value) => value - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const getTooltipStyle = (): CSSProperties => {
    if (!targetRect) {
      return { display: 'none' };
    }

    const spacing = 20;
    const position = step.position ?? 'bottom';
    const viewportPadding = 16;
    const tooltipWidth = Math.min(352, window.innerWidth - 32);
    const isCompactViewport = window.innerWidth < 1024 || window.innerHeight < 720;
    const clampLeft = (value: number) =>
      Math.min(
        window.innerWidth - tooltipWidth / 2 - viewportPadding,
        Math.max(tooltipWidth / 2 + viewportPadding, value)
      );
    const hasRoomAbove = targetRect.top > 260;
    const hasRoomBelow = window.innerHeight - targetRect.bottom > 260;

    if (isCompactViewport || (!hasRoomAbove && !hasRoomBelow)) {
      return {
        position: 'fixed',
        left: viewportPadding,
        right: viewportPadding,
        bottom: viewportPadding,
        width: 'auto',
        maxWidth: 480,
        margin: '0 auto',
        zIndex: 60,
      };
    }

    if (position === 'top') {
      return {
        position: 'fixed',
        top: Math.max(16, targetRect.top - spacing),
        left: clampLeft(targetRect.left + targetRect.width / 2),
        transform: 'translate(-50%, -100%)',
        zIndex: 60,
      };
    }

    if (position === 'left') {
      return {
        position: 'fixed',
        top: targetRect.top + targetRect.height / 2,
        left: Math.max(16, targetRect.left - spacing),
        transform: 'translate(-100%, -50%)',
        zIndex: 60,
      };
    }

    if (position === 'right') {
      return {
        position: 'fixed',
        top: targetRect.top + targetRect.height / 2,
        left: Math.min(window.innerWidth - 16, targetRect.right + spacing),
        transform: 'translateY(-50%)',
        zIndex: 60,
      };
    }

    return {
      position: 'fixed',
      top: targetRect.bottom + spacing,
      left: clampLeft(targetRect.left + targetRect.width / 2),
      transform: 'translateX(-50%)',
      zIndex: 60,
    };
  };

  if (!isOpen || !step) {
    return null;
  }

  if (step.id === 'welcome') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
        <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 sm:p-6 text-white">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 sm:h-16 sm:w-16">
              <FiAward className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h2 className="text-center text-xl font-bold sm:text-2xl">{step.title}</h2>
            <p className="mt-2 text-center text-sm text-white/85">{step.description}</p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-6">
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>Getting started</span>
                <span>
                  {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleSkip}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 font-medium text-white transition hover:shadow-lg"
              >
                <span>Start Tour</span>
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/55">
        {targetRect && (
          <div
            className="absolute rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] transition-all duration-200"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
          />
        )}
      </div>

      <div
        className="fixed z-[60] max-h-[min(24rem,calc(100vh-2rem))] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl animate-fade-in sm:p-5"
        style={getTooltipStyle()}
      >
        <button
          onClick={handleSkip}
          className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-600"
          aria-label="Close onboarding tour"
        >
          <FiX size={18} />
        </button>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600">
            {step.icon ?? <FiTarget className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
            <div className="text-xs text-gray-400">
              {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>

        <p className="mb-4 text-sm text-gray-600">{step.description}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between sm:justify-start">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                aria-label="Previous step"
              >
                <FiChevronLeft size={20} />
              </button>
            )}

            <div className="text-xs text-gray-400 sm:hidden">
              {currentStep + 1} of {steps.length}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:shadow-lg sm:w-auto"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <span>Finish</span>
                <FiCheck size={16} />
              </>
            ) : (
              <>
                <span>Next</span>
                <FiChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
