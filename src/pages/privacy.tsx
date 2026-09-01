// src/pages/privacy.tsx
import { useRouter } from 'next/router';
import { FiDownload, FiMail, FiShield, FiLock, FiEye, FiUser, FiDatabase, FiGlobe, FiAlertCircle } from 'react-icons/fi';
import { MdPrivacyTip, MdSecurity, MdCookie } from 'react-icons/md';
import { PublicFooter, PublicHeader } from '../components/PublicSiteChrome';

export default function PrivacyPolicy() {
  const router = useRouter();

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: 'Welcome to BrandPawa ("we," "us," "our"). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information. This Privacy Policy explains how BrandPawa collects, uses, discloses, and protects information when you use our website, platform, services, quizzes, tests, challenges, and related offerings (collectively, the "Services").'
    },
    {
      id: 'information-collected',
      title: '2. Information We Collect',
      content: 'We collect information you provide when creating an account, taking quizzes/tests, participating in challenges, contacting us, subscribing to communications, and making payments. We also automatically collect device and usage information, log data, and use cookies/tracking technologies. Information may be received from third parties including social media platforms, payment processors, and analytics providers.'
    },
    {
      id: 'how-we-use',
      title: '3. How We Use Your Information',
      content: 'We use your information to provide and improve our Services, communicate with you (test results, support, updates), operate our business (payments, security, compliance), and personalize your experience (customized content, recommendations, talent matching).'
    },
    {
      id: 'how-we-share',
      title: '4. How We Share Your Information',
      content: 'We do not sell your personal information. We may share with trusted service providers, talent marketplace participants (with consent), during business transfers, for legal compliance, and as aggregated/anonymized data. All sharing is governed by strict confidentiality agreements.'
    },
    {
      id: 'cookies',
      title: '5. Cookies and Tracking Technologies',
      content: 'We use cookies, pixels, local storage, and similar technologies to remember preferences, analyze usage, deliver personalized content, and track marketing effectiveness. You can control cookies through browser settings, though disabling may limit certain features. We use third-party analytics tools that may track online activities.'
    },
    {
      id: 'data-retention',
      title: '6. Data Retention',
      content: 'We retain information as long as necessary to provide Services, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion of your account and data at any time as described in Section 9.'
    },
    {
      id: 'data-security',
      title: '7. Data Security',
      content: 'We implement industry-standard security measures including encryption (in transit and at rest), secure authentication, regular security audits, access controls, and employee training. While we strive to protect your information, no system is completely secure and we cannot guarantee absolute security.'
    },
    {
      id: 'international-transfers',
      title: '8. International Data Transfers',
      content: 'BrandPawa operates primarily in Nigeria and Africa. If you access our Services from outside these regions, your information may be transferred to and processed in countries with different data protection laws. By using our Services, you consent to such transfers.'
    },
    {
      id: 'your-rights',
      title: '9. Your Rights and Choices',
      content: 'Depending on your location, you may have rights to access, correct, delete, object to, restrict processing of, and receive portable copies of your data. You may withdraw consent for marketing communications. Contact privacy@brandpawa.com or use account settings to exercise rights.'
    },
    {
      id: 'children',
      title: '10. Children\'s Privacy',
      content: 'BrandPawa is not intended for users under 18. We do not knowingly collect information from children. If we discover we have collected information from a child, we will delete it promptly.'
    },
    {
      id: 'marketing',
      title: '11. Marketing Communications',
      content: 'We only send marketing emails with consent or where permitted by law. You can unsubscribe anytime using links in emails or account settings. Transactional emails (test results, account notifications) are essential for Services and cannot be opted out of.'
    },
    {
      id: 'third-party-links',
      title: '12. Third-Party Links',
      content: 'Our Services may contain links to third-party websites, tools, or resources. We are not responsible for their privacy practices. Review third-party privacy policies before providing information.'
    },
    {
      id: 'changes',
      title: '13. Changes to This Privacy Policy',
      content: 'We may update this policy to reflect changes in practices, new features, or legal requirements. Material changes will be notified via website posting, updated dates, and email notifications. Continued use after changes constitutes acceptance.'
    },
    {
      id: 'contact',
      title: '14. Contact Us',
      content: 'For questions, concerns, or requests regarding this Privacy Policy or our data practices: BrandPawa, Email: privacy@brandpawa.com, Support: support@brandpawa.com, Address: Port Harcourt, Nigeria'
    },
    {
      id: 'governing-law',
      title: '15. Governing Law',
      content: 'This Privacy Policy is governed by Nigerian law. Any disputes shall be resolved in accordance with Nigerian law.'
    }
  ];

  const dataCategories = [
    { icon: <FiUser />, title: 'Identity Data', items: ['Full name', 'Email', 'Business name'] },
    { icon: <FiDatabase />, title: 'Account Data', items: ['Login credentials', 'Preferences', 'Security info'] },
    { icon: <FiGlobe />, title: 'Usage Data', items: ['Pages visited', 'Features used', 'Test results'] },
    { icon: <MdCookie />, title: 'Technical Data', items: ['IP address', 'Browser type', 'Device info'] }
  ];

  return (
    <div className="site-shell text-gray-800">
      <PublicHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/terms', label: 'Terms' },
          { href: '/gdpr', label: 'GDPR' },
        ]}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-50 to-blue-50 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
              <MdPrivacyTip className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm sm:text-base text-gray-600">
              <div className="flex items-center">
                <FiAlertCircle className="mr-2 text-purple-500" />
                Effective: 01/03/2026
              </div>
              <div className="flex items-center">
                <FiAlertCircle className="mr-2 text-purple-500" />
                Last Updated: 01/03/2026
              </div>
            </div>
            <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
              Protecting your privacy and being transparent about how we handle your information is fundamental to our mission.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quick Navigation */}
          <div className="mb-12 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FiEye className="mr-2 text-purple-500" />
              Quick Navigation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {sections.slice(0, 8).map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition text-sm font-medium"
                >
                  {section.title.split('. ')[1]}
                </a>
              ))}
            </div>
          </div>

          {/* Data Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiDatabase className="mr-3 text-purple-500" />
              What Data We Handle
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {dataCategories.map((category) => (
                <div key={category.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <div className="text-purple-600">{category.icon}</div>
                    </div>
                    <h3 className="font-bold text-lg">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Principles */}
          <div className="mb-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MdSecurity className="mr-3 text-blue-500" />
              Our Privacy Principles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <FiLock className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Transparency</h3>
                <p className="text-gray-600 text-sm">We clearly explain how we collect, use, and protect your data.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <FiShield className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Security</h3>
                <p className="text-gray-600 text-sm">Industry-standard measures to protect your information.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <FiUser className="text-purple-600 w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">Control</h3>
                <p className="text-gray-600 text-sm">You control your data with clear rights and choices.</p>
              </div>
            </div>
          </div>

          {/* Full Policy Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-4 text-purple-700">{section.title}</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                  {section.id === 'your-rights' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-bold mb-2 text-blue-800">How to Exercise Your Rights:</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                        <li>Email us at privacy@brandpawa.com</li>
                        <li>Use the settings in your BrandPawa account</li>
                        <li>Allow 30 days for us to process your request</li>
                      </ol>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Card */}
          <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
              <p className="mb-6 text-purple-100">
                We&apos;re here to help you understand how we protect your information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:privacy@brandpawa.com"
                  className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center space-x-2"
                >
                  <FiMail />
                  <span>Email Our Privacy Team</span>
                </a>
                <button
                  onClick={() => router.push('/support')}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Visit Support Center
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
                element.download = 'BrandPawa-Privacy-Policy.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
            >
              <FiDownload />
              <span>Download Privacy Policy</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter
        tagline="Protecting your brand and your privacy with clear terms and visible safeguards."
        links={[
          { href: '/', label: 'Home' },
          { href: '/terms', label: 'Terms of Service' },
          { href: '/gdpr', label: 'GDPR Compliance' },
        ]}
        contactLabel="Contact Privacy"
        contactHref="mailto:privacy@brandpawa.com"
        note="This Privacy Policy is effective from March 1, 2026."
      />
    </div>
  );
}
