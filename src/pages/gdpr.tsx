// src/pages/gdpr.tsx
import { useRouter } from 'next/router';
import { FiDownload, FiMail, FiGlobe, FiUserCheck, FiDatabase, FiLock, FiEye, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { MdSecurity, MdGppGood } from 'react-icons/md';
import { PublicFooter, PublicHeader } from '../components/PublicSiteChrome';

export default function GDPRCompliance() {
  const router = useRouter();

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: 'This GDPR Addendum applies to users in the European Economic Area (EEA), United Kingdom (UK), and Switzerland ("European Users"). It supplements our Privacy Policy and explains GDPR compliance. If conflict exists, this Addendum prevails for European Users.'
    },
    {
      id: 'controller',
      title: '2. Data Controller Information',
      content: 'Data Controller: BrandPawa, Address: Port Harcourt, Nigeria, Email: privacy@brandpawa.com. For European Users, BrandPawa acts as Data Controller for personal data processed through our Services.'
    },
    {
      id: 'legal-basis',
      title: '3. Legal Basis for Processing',
      content: 'We process data based on: Contractual Necessity (providing Services), Legitimate Interests (business operations), Consent (marketing, non-essential cookies), Legal Obligation (compliance), and Vital Interests (safety protection).'
    },
    {
      id: 'categories',
      title: '4. Categories of Personal Data We Process',
      content: 'Identity Data (name, business), Contact Data (email, phone), Account Data (login, preferences), Brand/Business Data (industry, test responses), Financial Data (payment info), Technical Data (IP, device), Usage Data (pages visited, features used), Marketing Data (preferences, engagement). We do not intentionally collect special categories of data.'
    },
    {
      id: 'rights',
      title: '5. Your Rights Under GDPR',
      content: 'European Users have rights to: Access, Rectification, Erasure ("Right to be Forgotten"), Restriction of Processing, Data Portability, Object to Processing, Withdraw Consent, Lodge Complaint with supervisory authority. No solely automated decisions with legal effects.'
    },
    {
      id: 'response',
      title: '6. Response Times and Procedures',
      content: 'We respond within 1 month (extendable to 2 months for complex requests). First request free; fees may apply for manifestly unfounded/excessive requests. Verification required to protect privacy. We consider third-party rights.'
    },
    {
      id: 'transfers',
      title: '7. International Data Transfers',
      content: 'Based in Nigeria, we transfer data from EEA using Standard Contractual Clauses (SCCs) with service providers, adequacy decisions (when applicable), and supplementary measures (encryption, access controls). Third-party processors comply with GDPR.'
    },
    {
      id: 'retention',
      title: '8. Data Retention',
      content: 'We retain data only as necessary: Account Information (account duration + 30 days), Test Results (account duration + 30 days), Payment Records (7 years after last transaction), Marketing Data (until consent withdrawn + 30 days), Usage Analytics (26 months), Security Logs (12 months).'
    },
    {
      id: 'security',
      title: '9. Data Security Measures',
      content: 'Technical measures: Encryption (TLS/SSL, AES-256), Access Controls (role-based, MFA), Firewalls, Regular Updates, Vulnerability Scanning, Secure Development. Organizational measures: Staff Training, Confidentiality Agreements, Access Policies, Incident Response, Vendor Management, Regular Audits.'
    },
    {
      id: 'cookies',
      title: '10. Cookies and Tracking',
      content: 'For European Users, we obtain consent before non-essential cookies. Categories: Strictly Necessary (no consent, essential), Performance (consent, analytics), Functional (consent, preferences), Targeting/Advertising (consent, marketing). Manage via consent banner, account settings, or browser.'
    },
    {
      id: 'children',
      title: '11. Children\'s Data',
      content: 'We do not knowingly process personal data of children under 16 (or applicable age of digital consent). If discovered, we delete data immediately, terminate account, and notify parent/guardian if identifiable.'
    },
    {
      id: 'automated-decisions',
      title: '12. Automated Decision-Making and Profiling',
      content: 'We use algorithms for brand diagnostics, recommendations, matching. All automated outputs are advisory, supplemented with human-created content, subject to user discretion, reviewed by experts. No automated decisions with legal/significant effects.'
    },
    {
      id: 'design',
      title: '13. Data Protection by Design and Default',
      content: 'We implement: Data Minimization (collect only necessary), Privacy by Default (highest privacy settings default), Pseudonymization (separate identifying info, use unique identifiers).'
    },
    {
      id: 'processors',
      title: '14. Third-Party Processors (Sub-Processors)',
      content: 'We work with sub-processors for hosting, payments, email, analytics. Current list available. We notify of new/replacement sub-processors; you have 30 days to object. If objection cannot be accommodated, you may terminate account.'
    },
    {
      id: 'representative',
      title: '15. EU Representative',
      content: 'BrandPawa is not currently required to appoint an EU representative under Article 27 GDPR.'
    },
    {
      id: 'records',
      title: '16. Record of Processing Activities',
      content: 'We maintain internal records per Article 30 GDPR, including purposes, categories, recipients, transfers, retention, security. Available to supervisory authorities upon request.'
    },
    {
      id: 'dpias',
      title: '17. Data Protection Impact Assessments (DPIA)',
      content: 'We conduct DPIAs for high-risk processing, particularly: brand diagnostic algorithm, user profiling/recommendation systems, third-party data sharing. DPIAs identify/mitigate risks to rights/freedoms.'
    },
    {
      id: 'contact',
      title: '18. Contact and Complaints',
      content: 'GDPR inquiries: privacy@brandpawa.com. Data Protection Officer: dpo@brandpawa.com. Complaint procedure: Contact us first, internal review within required timeframes, then supervisory authority if unsatisfied.'
    },
    {
      id: 'updates',
      title: '19. Updates to This GDPR Addendum',
      content: 'We may update to reflect legal changes, new processing, supervisory feedback, Service changes. Material changes notified via email, in-app, website notice. Continued use after changes constitutes acceptance.'
    },
    {
      id: 'glossary',
      title: '20. Glossary of GDPR Terms',
      content: 'Personal Data: Information relating to identifiable person. Processing: Operations on personal data. Data Controller: Determines purposes/means. Data Processor: Processes on behalf. Data Subject: Individual data relates to. Consent: Freely given agreement. Supervisory Authority: Independent public authority. Third Country: Outside EEA/UK/Switzerland.'
    }
  ];

  const userRights = [
    {
      icon: <FiEye />,
      title: 'Right to Access',
      article: 'Article 15',
      description: 'Confirm processing and receive copy of your data'
    },
    {
      icon: <FiCheckCircle />,
      title: 'Right to Rectification',
      article: 'Article 16',
      description: 'Correct inaccurate or incomplete data'
    },
    {
      icon: <FiDatabase />,
      title: 'Right to Erasure',
      article: 'Article 17',
      description: 'Request deletion ("Right to be Forgotten")'
    },
    {
      icon: <FiLock />,
      title: 'Right to Restriction',
      article: 'Article 18',
      description: 'Restrict processing in certain circumstances'
    },
    {
      icon: <FiGlobe />,
      title: 'Data Portability',
      article: 'Article 20',
      description: 'Receive data in machine-readable format'
    },
    {
      icon: <FiUserCheck />,
      title: 'Right to Object',
      article: 'Article 21',
      description: 'Object to processing, especially marketing'
    }
  ];

  const securityMeasures = [
    {
      category: 'Technical',
      measures: ['TLS/SSL Encryption', 'AES-256 Encryption at Rest', 'Multi-Factor Authentication', 'Role-Based Access Controls']
    },
    {
      category: 'Organizational',
      measures: ['Staff Data Protection Training', 'Confidentiality Agreements', 'Incident Response Plan', 'Vendor Security Assessments']
    },
    {
      category: 'Procedural',
      measures: ['Regular Security Audits', 'Data Protection Impact Assessments', 'Privacy by Design Implementation', 'Data Breach Notification Procedures']
    }
  ];

  return (
    <div className="site-shell text-gray-800">
      <PublicHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
        ]}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-green-50 to-emerald-50 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
              <MdGppGood className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">GDPR Compliance</h1>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm sm:text-base text-gray-600">
              <div className="flex items-center">
                <FiAlertCircle className="mr-2 text-green-500" />
                General Data Protection Regulation Addendum
              </div>
              <div className="flex items-center">
                <FiAlertCircle className="mr-2 text-green-500" />
                Effective: 01/03/2026
              </div>
            </div>
            <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
              For users in the European Economic Area, United Kingdom, and Switzerland
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* EU User Notice */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <FiGlobe className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">For European Users</h3>
                <p className="text-gray-700">
                  This GDPR Addendum applies specifically to users in the <strong>European Economic Area (EEA)</strong>,{' '}
                  <strong>United Kingdom (UK)</strong>, and <strong>Switzerland</strong>. It supplements our main 
                  Privacy Policy and provides additional rights and protections under European data protection laws.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiUserCheck className="mr-3 text-purple-500" />
              Your GDPR Rights
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRights.map((right) => (
                <div key={right.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <div className="text-purple-600">{right.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold">{right.title}</h3>
                      <div className="text-xs text-purple-600 font-medium">{right.article}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{right.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Measures */}
          <div className="mb-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MdSecurity className="mr-3 text-blue-500" />
              Our Security Measures
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {securityMeasures.map((category) => (
                <div key={category.category} className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-4">{category.category}</h3>
                  <ul className="space-y-3">
                    {category.measures.map((measure) => (
                      <li key={measure} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-gray-700">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Data Transfer Info */}
          <div className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiGlobe className="mr-3 text-pink-500" />
              International Data Transfers
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Transfer Mechanism</h3>
                <p className="text-gray-700 mb-4">
                  BrandPawa is based in Nigeria. When we transfer your data from the EEA, we use:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Standard Contractual Clauses (SCCs)</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Encryption in transit and at rest</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Strict access controls</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Your Rights</h3>
                <p className="text-gray-700 mb-4">
                  You may request information about safeguards for international transfers:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Request</div>
                    <div className="font-medium">Copies of SCCs</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Request</div>
                    <div className="font-medium">Third-country processor details</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Contact</div>
                    <div className="font-medium">privacy@brandpawa.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full GDPR Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-600 font-bold">
                        {section.title.split('.')[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-4 text-green-700">{section.title}</h2>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed">{section.content}</p>
                      </div>
                      
                      {section.id === 'rights' && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <h4 className="font-bold mb-2 text-blue-800">How to Exercise Your Rights:</h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <div className="font-medium mb-1">Email Request</div>
                              <div className="text-sm text-blue-700">privacy@brandpawa.com</div>
                            </div>
                            <div>
                              <div className="font-medium mb-1">Response Time</div>
                              <div className="text-sm text-blue-700">Within 1 month (max 2 months)</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.id === 'contact' && (
                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                          <h4 className="font-bold mb-2 text-green-800">Supervisory Authorities:</h4>
                          <p className="text-green-700 mb-2">
                            You have the right to lodge a complaint with your national data protection authority.
                          </p>
                          <a 
                            href="https://edpb.europa.eu/about-edpb/board/members_en" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                          >
                            Find your EU supervisory authority →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Contact Card */}
          <div className="mt-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">GDPR Questions?</h2>
              <p className="mb-6 text-green-100">
                Contact our Data Protection team for GDPR-specific inquiries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:privacy@brandpawa.com"
                  className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center space-x-2"
                >
                  <FiMail />
                  <span>Email Privacy Team</span>
                </a>
                <a
                  href="mailto:dpo@brandpawa.com"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Contact DPO
                </a>
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
                element.download = 'BrandPawa-GDPR-Compliance.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
            >
              <FiDownload />
              <span>Download GDPR Addendum</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter
        tagline="Committed to GDPR compliance, NDPR alignment, and visible data protection standards across the platform."
        links={[
          { href: '/', label: 'Home' },
          { href: '/privacy', label: 'Privacy Policy' },
          { href: '/terms', label: 'Terms of Service' },
        ]}
        contactLabel="GDPR Contact"
        contactHref="mailto:privacy@brandpawa.com"
        note="This GDPR Addendum is effective from March 1, 2026."
        badges={['GDPR Compliant', 'NDPR Compliant', 'Data Protected']}
      />
    </div>
  );
}
