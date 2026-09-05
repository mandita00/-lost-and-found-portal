import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FAQ() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(null)

  const faqs = [
    {
      question: 'How do I report a lost item?',
      answer: 'Click the "Report Lost Item" button on the homepage or in the navigation menu. Fill in the item details, location where you lost it, and upload a photo if possible. Once submitted, our AI system will automatically search for matching found items.'
    },
    {
      question: 'How do I report a found item?',
      answer: 'Click the "Report Found Item" button and provide details about the item you found. Include a description, location, and photos. Our system will search for matching lost item reports and notify owners of potential matches.'
    },
    {
      question: 'How does the matching system work?',
      answer: 'When you report a found item, our AI analyzes photos and descriptions to find potential matches with lost items. Matches are reviewed by our admin team and both parties are notified if there is a likely match.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes. We use secure authentication and all communications between finder and owner go through our platform to protect your privacy. Personal contact information is only shared after both parties agree.'
    },
    {
      question: 'What if I found my item before receiving a match?',
      answer: 'You can mark your report as resolved in your "My Reports" section. Simply click the report and select "Mark as Found" to close it.'
    },
    {
      question: 'Can I delete my report?',
      answer: 'Yes, you can delete your report from the "My Reports" section. Once deleted, the report will be removed from the system.'
    },
    {
      question: 'How long do reports stay active?',
      answer: 'Reports remain open indefinitely until you mark them as resolved or delete them. We recommend checking periodically for matches and updating your report if needed.'
    },
    {
      question: 'Who can I contact for support?',
      answer: 'You can reach our support team at info@lostandfound.edu or call +1 (555) 123-4567. We typically respond within 24 hours.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fc] to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="font-bold text-lg cursor-pointer"
          >
            <span className="text-gray-800">Find</span>
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Wise
            </span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about FindWise
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-purple-200 transition"
            >
              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold text-gray-900 text-left">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition ${expanded === idx ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              {expanded === idx && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Didn't find your answer?</h2>
          <p className="text-gray-700 mb-6">
            Reach out to our support team for additional help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:info@lostandfound.edu"
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition text-center"
            >
              Email Support
            </a>
            <a
              href="tel:+15551234567"
              className="px-6 py-2 border-2 border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition text-center"
            >
              Call Support
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-600">
          <p>© 2026 FindWise. University Campus.</p>
        </div>
      </footer>
    </div>
  )
}
