import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchQuery = searchParams.get('q') || ''
  
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/api/reports/search`, {
          params: { q: searchQuery }
        })
        setResults(res.data || [])
        setError('')
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to load search results')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [searchQuery])

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
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            {searchQuery && `Results for "${searchQuery}"`}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No items found</h2>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all open reports.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(report => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition hover:border-purple-200"
              >
                {/* Photo */}
                {report.photo_url && (
                  <img
                    src={report.photo_url}
                    alt={report.item_name}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-4">
                  {/* Type Badge */}
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-3 ${
                    report.type === 'lost'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-teal-100 text-teal-600'
                  }`}>
                    {report.type === 'lost' ? '🔍 LOST ITEM' : '✓ FOUND ITEM'}
                  </span>

                  <h3 className="font-bold text-gray-900 mb-1">{report.item_name}</h3>
                  
                  {report.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {report.description}
                    </p>
                  )}

                  {report.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {report.location}
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-xs text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Results Info */}
        {results.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
