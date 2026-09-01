import { useRouter } from 'next/router';
import { FiArrowLeft, FiHeart, FiZap } from 'react-icons/fi';

export default function BrandPersonalityDiagnostic() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF0FF] p-4">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push('/dashboard?section=diagnostics')}
          className="mb-6 flex items-center gap-2 text-purple-600 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          <span>Back to Quizzes</span>
        </button>

        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(80,43,133,0.12)]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_30%),linear-gradient(135deg,#5d2dbf_0%,#e6559d_100%)] p-8 text-white">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              Free Quiz
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <FiHeart className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Brand Personality</h1>
                <p className="mt-2 text-sm text-white/82 sm:text-base">
                  This quiz has been moved into the free tier and is being finalized for launch.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="rounded-[24px] bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FiZap className="text-purple-600" />
                What happens next
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The full Brand Personality quiz is being polished so it feels as intentional as the rest of BrandPawa.
                For now, BrandPawa Score and Color Power are fully available, and this page is unlocked so free users no longer hit a paywall.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => router.push('/dashboard/diagnostic/1')}
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 font-semibold text-white transition hover:shadow-lg"
              >
                Run BrandPawa Score
              </button>
              <button
                onClick={() => router.push('/dashboard/diagnostic/2')}
                className="rounded-2xl border border-purple-200 bg-white px-5 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
              >
                Run Color Power
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
