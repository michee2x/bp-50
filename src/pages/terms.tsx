// src/pages/terms.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiDownload, FiMail, FiAlertTriangle, FiCheck, FiFileText, FiCreditCard, FiUsers, FiShield, FiBook } from 'react-icons/fi';
import { MdGavel } from 'react-icons/md';
import { PublicFooter, PublicHeader } from '../components/PublicSiteChrome';

export default function TermsOfService() {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const sections = [
    {
      id: 'agreement',
      title: '1. Agreement to Terms',
      content: 'Welcome to BrandPawa. These Terms of Service ("Terms") constitute a legally binding agreement between you ("you," "your," "user") and BrandPawa ("we," "us," "our") regarding your access to and use of our website, platform, services, quizzes, tests, challenges, and related offerings (collectively, the "Services"). By accessing or using BrandPawa, you agree to be bound by these Terms and our Privacy Policy.'
    },
    {
      id: 'description',
      title: '2. Description of Services',
      content: 'BrandPawa is a brand operating system providing brand diagnostics, discovery quizzes, guided growth challenges, strategy insights, educational content, talent marketplace (when available), and automation tools. We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time.'
    },
    {
      id: 'eligibility',
      title: '3. Eligibility and Account Registration',
      content: 'You must be at least 18 years old. By using our Services, you represent you have legal capacity and comply with all laws. Account creation requires accurate information. We may suspend or terminate accounts for violations, false information, fraud, abuse, or non-payment.'
    },
    {
      id: 'conduct',
      title: '4. User Obligations and Conduct',
      content: 'Use BrandPawa lawfully. Do not violate laws, impersonate others, upload harmful content, disrupt Services, gain unauthorized access, use automated systems improperly, reverse engineer, copy content, spam, harass, or collect user information without consent.'
    },
    {
      id: 'intellectual-property',
      title: '5. Intellectual Property Rights',
      content: 'BrandPawa content is protected by copyright, trademark, patent, and trade secret laws. You receive a limited license for personal/business use. You retain ownership of your content but grant us license to use it to provide Services. Feedback may be used without compensation.'
    },
    {
      id: 'payments',
      title: '6. Payments and Subscriptions',
      content: 'Some features require payment. Fees in Nigerian Naira. Payment due immediately. Subscriptions auto-renew unless cancelled. Refunds case-by-case within 7 days. Non-payment may result in suspension, termination, or collection efforts.'
    },
    {
      id: 'third-party',
      title: '7. Third-Party Services and Links',
      content: 'We integrate with third-party services (payment processors, social media, analytics). Your use of third parties subject to their terms. Talent Marketplace (when available) connects users with service providers; we facilitate but do not control engagements.'
    },
    {
      id: 'test-results',
      title: '8. Test Results and Recommendations',
      content: 'BrandPawa provides brand diagnostics and recommendations based on your inputs and our algorithms. IMPORTANT: No guarantees of specific results, revenue growth, accuracy, or suitability. You are solely responsible for evaluating and implementing recommendations.'
    },
    {
      id: 'disclaimers',
      title: '9. Disclaimers and Limitations of Liability',
      content: 'Services provided "AS IS" without warranties. To maximum extent permitted by law, BrandPawa not liable for indirect, incidental, special, consequential, or punitive damages. Total liability limited to amount paid in 12 months or NGN 50,000, whichever greater.'
    },
    {
      id: 'indemnification',
      title: '10. Indemnification',
      content: 'You agree to indemnify and hold BrandPawa harmless from claims arising from your use/misuse of Services, violation of Terms, violation of third-party rights, your content, or business decisions based on our Services.'
    },
    {
      id: 'privacy',
      title: '11. Privacy and Data Protection',
      content: 'Use governed by our Privacy Policy, incorporated by reference. We comply with Nigeria Data Protection Regulation (NDPR) and applicable laws.'
    },
    {
      id: 'communications',
      title: '12. Communications',
      content: 'By using BrandPawa, you consent to electronic communications (transactional emails, service announcements, marketing if opted in). May opt out of marketing but not essential transactional/administrative messages.'
    },
    {
      id: 'dispute-resolution',
      title: '13. Dispute Resolution',
      content: 'Terms governed by Nigerian law. Before legal claim, contact legal@brandpawa.com to resolve informally. Jurisdiction in Port Harcourt, Nigeria courts. Class action waiver: disputes on individual basis only.'
    },
    {
      id: 'modifications',
      title: '14. Modifications to Terms',
      content: 'We may modify Terms at any time. Changes posted with updated date. Material changes notified via email/in-app. Continued use after changes constitutes acceptance.'
    },
    {
      id: 'termination',
      title: '15. Term and Termination',
      content: 'Terms remain effective while using Services. You may terminate account anytime. We may suspend/terminate for violations, inactivity, legal requirements, or Service discontinuation. Termination ends access but surviving provisions remain.'
    },
    {
      id: 'general',
      title: '16. General Provisions',
      content: 'Entire agreement includes Terms, Privacy Policy. If provision invalid, remainder continues. Failure to enforce not waiver. You may not assign Terms; we may. No agency relationship. Force majeure applies. Notices to legal@brandpawa.com.'
    },
    {
      id: 'contact',
      title: '17. Contact Information',
      content: 'Questions: BrandPawa, Email: legal@brandpawa.com, Support: support@brandpawa.com, Address: Port Harcourt, Nigeria'
    },
    {
      id: 'acknowledgment',
      title: '18. Acknowledgment',
      content: 'BY CLICKING "I ACCEPT," REGISTERING FOR AN ACCOUNT, OR USING THE SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.'
    }
  ];

  const importantPoints = [
    {
      icon: <FiAlertTriangle />,
      title: 'No Guarantees',
      description: 'Test results and recommendations are informational only - no guarantees of business outcomes'
    },
    {
      icon: <FiCreditCard />,
      title: 'Payment Terms',
      description: 'Subscriptions auto-renew unless cancelled. Review refund policy carefully'
    },
    {
      icon: <FiShield />,
      title: 'Your Responsibilities',
      description: 'You are responsible for content you submit and decisions based on our Services'
    },
    {
      icon: <FiUsers />,
      title: 'Talent Marketplace',
      description: 'When available, we facilitate connections but do not control service providers'
    }
  ];

  return (
    <div className="site-shell text-gray-800">
      <PublicHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/gdpr', label: 'GDPR' },
        ]}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-50 to-cyan-50 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6">
              <MdGavel className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm sm:text-base text-gray-600">
              <div className="flex items-center">
                <FiFileText className="mr-2 text-blue-500" />
                Effective: 01/03/2026
              </div>
              <div className="flex items-center">
                <FiFileText className="mr-2 text-blue-500" />
                Last Updated: 01/03/2026
              </div>
            </div>
            <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
              These terms govern your use of BrandPawa. Please read them carefully.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Acceptance Banner */}
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <FiCheck className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Acceptance Required</h3>
                  <p className="text-gray-600">By using BrandPawa, you accept these Terms</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded"
                  />
                  <span className="text-gray-700">I have read and agree</span>
                </label>
                <button
                  onClick={() => router.push('/')}
                  className={`px-6 py-2 rounded-xl font-semibold transition ${acceptedTerms ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  disabled={!acceptedTerms}
                >
                  Continue to BrandPawa
                </button>
              </div>
            </div>
          </div>

          {/* Important Points */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiAlertTriangle className="mr-3 text-orange-500" />
              Key Points to Understand
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {importantPoints.map((point) => (
                <div key={point.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="text-orange-600">{point.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{point.title}</h3>
                      <p className="text-gray-600 text-sm">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Summary */}
          <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiBook className="mr-3 text-purple-500" />
              Terms Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <FiCheck className="text-blue-600 w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="font-bold">You Must</h4>
                    <p className="text-gray-600 text-sm">Be 18+, provide accurate info, use Services lawfully</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <FiCheck className="text-blue-600 w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="font-bold">You Keep</h4>
                    <p className="text-gray-600 text-sm">Ownership of content you create and submit</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <FiAlertTriangle className="text-red-600 w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="font-bold">You Must Not</h4>
                    <p className="text-gray-600 text-sm">Violate laws, abuse Services, share accounts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <FiAlertTriangle className="text-red-600 w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="font-bold">We Do Not</h4>
                    <p className="text-gray-600 text-sm">Guarantee business results from recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Terms Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-600 font-bold">
                        {section.title.split('.')[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-4 text-blue-700">{section.title}</h2>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed">{section.content}</p>
                      </div>
                      {section.id === 'test-results' && (
                        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                          <h4 className="font-bold mb-2 text-red-800">Important Disclaimer:</h4>
                          <p className="text-red-700">
                            BrandPawa provides educational and informational content only. We are not providing business, 
                            legal, financial, or professional advice. Always consult qualified professionals for specific 
                            business decisions.
                          </p>
                        </div>
                      )}
                      {section.id === 'payments' && (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                          <h4 className="font-bold mb-2 text-yellow-800">Payment Information:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-yellow-700">
                            <li>All fees in Nigerian Naira (NGN)</li>
                            <li>Subscriptions auto-renew monthly/annually</li>
                            <li>Cancellation stops future charges only</li>
                            <li>Contact support@brandpawa.com for refund requests</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Contact Card */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Questions About Terms?</h2>
              <p className="mb-6 text-blue-100">
                Contact our legal team for clarification or concerns about these Terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:legal@brandpawa.com"
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center space-x-2"
                >
                  <FiMail />
                  <span>Email Legal Team</span>
                </a>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                const element = document.createElement('a');
                const text = sections.map(s => `${s.title}\n${s.content}\n\n`).join('');
                const blob = new Blob([text], { type: 'text/plain' });
                element.href = URL.createObjectURL(blob);
                element.download = 'BrandPawa-Terms-of-Service.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
            >
              <FiDownload />
              <span>Download Terms of Service</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter
        tagline="Building brands with integrity, clarity, and a product structure that stays consistent across pages."
        links={[
          { href: '/', label: 'Home' },
          { href: '/privacy', label: 'Privacy Policy' },
          { href: '/gdpr', label: 'GDPR Compliance' },
        ]}
        contactLabel="Contact Legal"
        contactHref="mailto:legal@brandpawa.com"
        note="These Terms of Service are effective from March 1, 2026."
      />
    </div>
  );
}
