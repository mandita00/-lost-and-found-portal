import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const howItWorksRef = useRef(null)

  useEffect(() => {
    axios.get(`${API_URL}/auth/me`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
  }, [])

  const handleSignIn = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  const handleLogout = () => {
    window.location.href = `${API_URL}/auth/logout`
  }

  const handleReportLost = () => {
    if (!user) return navigate('/login')
    navigate('/report-lost')
  }

  const handleReportFound = () => {
    if (!user) return navigate('/login')
    navigate('/report-found')
  }

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 relative">
      {/* Grid overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(139, 92, 246, 0.3) 25%, rgba(139, 92, 246, 0.3) 26%, transparent 27%, transparent 74%, rgba(139, 92, 246, 0.3) 75%, rgba(139, 92, 246, 0.3) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(139, 92, 246, 0.3) 25%, rgba(139, 92, 246, 0.3) 26%, transparent 27%, transparent 74%, rgba(139, 92, 246, 0.3) 75%, rgba(139, 92, 246, 0.3) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Navbar */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-lg text-gray-900">Find</span>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Wise</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-purple-100 text-purple-700">Home</span>
            <button onClick={handleReportLost} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition">Report Lost</button>
            <button onClick={handleReportFound} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition">Report Found</button>
            <button onClick={() => navigate('/my-reports')} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition">My Reports</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Search..."
                className="bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 w-32"
              />
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-500 transition">Logout</button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-purple-200 bg-purple-50">
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-medium text-purple-700">Campus Lost & Found Portal</span>
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          <span className="block text-gray-900">Lost Something?</span>
          <span className="block bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            We'll Help You Find It
          </span>
        </h1>

        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12">
          A centralized platform for students to report and recover lost items <br className="hidden sm:block" />
          within the university campus. Fast, secure, and verified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleReportLost}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/30 transition inline-flex items-center justify-center gap-2"
          >
            Report Lost Item
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={handleReportFound}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium hover:shadow-lg hover:shadow-teal-500/30 transition inline-flex items-center justify-center gap-2"
          >
            Report Found Item
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex items-center bg-white rounded-full border-2 border-gray-300 p-2 shadow-md hover:border-purple-400 transition">
            <svg className="w-5 h-5 text-gray-500 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for lost or found items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-900 placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:shadow-lg transition m-1"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Our simple 4-step process helps you report and recover lost items quickly and securely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gray-200"></div>

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-purple-200 bg-purple-50 mb-6 mx-auto relative z-10">
              <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-xs font-medium text-purple-700 mb-4">Step 1</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Report Item</h3>
            <p className="text-gray-500 text-sm">Fill out a detailed report form with photos and item details</p>
          </div>

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-blue-200 bg-blue-50 mb-6 mx-auto relative z-10">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-xs font-medium text-blue-700 mb-4">Step 2</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Search & Match</h3>
            <p className="text-gray-500 text-sm">Browse existing reports or get auto-matched with found items</p>
          </div>

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-indigo-200 bg-indigo-50 mb-6 mx-auto relative z-10">
              <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
              </svg>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-xs font-medium text-indigo-700 mb-4">Step 3</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Connect Safely</h3>
            <p className="text-gray-500 text-sm">Secure messaging between finder and owner for coordination</p>
          </div>

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-teal-200 bg-teal-50 mb-6 mx-auto relative z-10">
              <svg className="w-8 h-8 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-teal-100 border border-teal-200 text-xs font-medium text-teal-700 mb-4">Step 4</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Recover Item</h3>
            <p className="text-gray-500 text-sm">Meet safely and mark the report as resolved</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-bold text-lg text-gray-900">FindWise</span>
              </div>
              <p className="text-gray-600 text-sm">Helping students recover their belongings on campus since 2024.</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={handleReportLost} className="text-gray-600 hover:text-purple-600 text-sm transition">Report Lost Item</button></li>
                <li><button onClick={handleReportFound} className="text-gray-600 hover:text-purple-600 text-sm transition">Report Found Item</button></li>
                <li><button onClick={() => navigate('/my-reports')} className="text-gray-600 hover:text-purple-600 text-sm transition">My Reports</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Help & Support</h4>
              <ul className="space-y-2">
                <li><button onClick={scrollToHowItWorks} className="text-gray-600 hover:text-purple-600 text-sm transition">How It Works</button></li>
                <li><button onClick={() => navigate('/faq')} className="text-gray-600 hover:text-purple-600 text-sm transition">FAQs</button></li>
                {user?.role === 'admin' && (
                  <li><button onClick={() => navigate('/admin')} className="text-gray-600 hover:text-purple-600 text-sm transition">Admin Panel</button></li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0116 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  info@findwise.edu
                </li>
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 011 .894l.851 4.687a1 1 0 01-.96 1.159H5.5a1 1 0 00-.96 1.159l.851 4.687a1 1 0 001 .894h2.153a1 1 0 011-1h2.153a1 1 0 011 .894l.851 4.687a1 1 0 01-.96 1.159H5.5a1 1 0 00-.96 1.159l.851 4.687a1 1 0 001 .894h2.153a1 1 0 011-1v2a1 1 0 11-2 0v-.5H5a1 1 0 100 2h10a1 1 0 100-2h-2.5v.5a1 1 0 11-2 0" />
                  </svg>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  University Campus
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© 2026 FindWise. University Campus.</p>
            <p className="text-gray-600 text-sm">Made with ❤️ for students</p>
          </div>
        </div>
      </footer>

      {/* Floating Support Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition z-40">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
        </svg>
      </button>
    </div>
  )
}

export default Home
