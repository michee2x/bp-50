// src/pages/onboarding/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiArrowLeft, FiCheck, FiChevronRight, FiChevronLeft, FiLock } from 'react-icons/fi';
import { BrandPawaLogo } from '../../components/BrandPawaLogo';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    value: 'yes' | 'somewhat' | 'no';
    points: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "When people hear your brand name, do they instantly connect it with a specific solution, feeling, or category?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Somewhat", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 2,
    text: "Does your brand have a clear promise or transformation that sets you apart from competitors?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "It needs work", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 3,
    text: "Is your visual identity (logo, colors, design style) consistent across all platforms?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Inconsistently", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 4,
    text: "Do people discover and reach out to you because of your online presence?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Occasionally", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 5,
    text: "Does your website or landing page instantly communicate what you do, who it's for, and why it matters?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Needs clarity", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 6,
    text: "Is your social media strategically aligned to attract the audience you want — not just active?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Somewhat", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 7,
    text: "Do people recommend you because they clearly understand and trust your value?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Rarely", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 8,
    text: "Can your audience describe your brand in one clear sentence without confusion?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Not always", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 9,
    text: "Do you have a structured system for creating and distributing content that nurtures leads into clients?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Partially", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  },
  {
    id: 10,
    text: "Is your brand currently generating paying clients, partnerships, or speaking opportunities?",
    options: [
      { text: "Yes", value: "yes", points: 10 },
      { text: "Not enough", value: "somewhat", points: 5 },
      { text: "No", value: "no", points: 0 }
    ]
  }
];

export const ONBOARDING_ANSWERS_KEY = 'brandpawa_onboarding_answers';

export default function OnboardingDiagnostic() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    // Load any existing progress from localStorage
    const saved = localStorage.getItem(ONBOARDING_ANSWERS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        const answeredCount = Object.keys(parsed).length;
        if (answeredCount === questions.length) {
          calculateResults(parsed);
        } else if (answeredCount > 0) {
          setCurrentQuestion(answeredCount);
        }
      } catch (e) {
        console.error('Failed to parse onboarding answers', e);
      }
    }
  }, []);

  const handleAnswer = (questionId: number, points: number) => {
    const newAnswers = { ...answers, [questionId]: points };
    setAnswers(newAnswers);
    localStorage.setItem(ONBOARDING_ANSWERS_KEY, JSON.stringify(newAnswers));

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(newAnswers);
      }
    }, 300);
  };

  const calculateResults = (finalAnswers: Record<number, number>) => {
    const total = Object.values(finalAnswers).reduce((sum, points) => sum + points, 0);
    setTotalScore(total);
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-[#FAF0FF] p-4 flex items-center justify-center">
        <Head>
          <title>BrandPawa Score | Free Assessment</title>
        </Head>
        <div className="w-full max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BrandPawaLogo className="h-8 w-auto text-purple-600" />
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center space-x-1"
            >
              <span>Exit</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 leading-relaxed">
                {question.text}
              </h2>
            </div>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, option.points)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all ${
                    answers[question.id] === option.points
                      ? 'border-purple-500 bg-purple-50 shadow-sm'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{option.text}</span>
                    {answers[question.id] === option.points && (
                      <FiCheck className="text-green-500 text-xl" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentQuestion === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiChevronLeft />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!answers[question.id] || currentQuestion === questions.length - 1}
                className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                  !answers[question.id]
                    ? 'text-gray-400 bg-gray-100'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg'
                } transition`}
              >
                <span>Next</span>
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="min-h-screen bg-[#FAF0FF] p-4 flex flex-col items-center justify-center">
        <Head>
          <title>Your BrandPawa Score | Results</title>
        </Head>
        
        <div className="w-full max-w-2xl text-center mb-8">
          <BrandPawaLogo className="h-10 w-auto text-purple-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">You've completed the test!</h1>
          <p className="text-gray-600 text-lg">Your initial brand score is ready.</p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
          
          <div className="p-8 text-center border-b border-gray-100">
            <div className="text-gray-500 font-semibold tracking-wider text-sm mb-2 uppercase">Your BrandPawa Score</div>
            <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {totalScore}
            </div>
            <div className="text-gray-400 mt-1">out of 100</div>
          </div>

          <div className="p-8 bg-gray-50/50">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <FiLock className="text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium">Detailed 5-pillar breakdown locked</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <FiLock className="text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium">Personalized growth stage locked</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <FiLock className="text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium">Custom action plan locked</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  // Direct to homepage but with a query param to trigger signup modal
                  router.push('/?auth=signup&redirect=dashboard');
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
              >
                Sign up to unlock full report
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                Already have an account? <button onClick={() => router.push('/?auth=login&redirect=dashboard')} className="text-purple-600 font-semibold hover:underline">Log in</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showResults) return renderResults();
  return renderQuestion();
}
