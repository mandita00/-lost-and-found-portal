import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config';

function MyReports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_URL}/api/reports/mine`, { withCredentials: true })
      .then(res => { setReports(res.data); setLoading(false) })
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">Lost & Found Portal</h1>
        <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:underline">
          ← Back to Home
        </button>
      </nav>

      <main className="max-w-3xl mx-auto mt-10 px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">My Reports</h2>

        {loading && <p className="text-gray-400">Loading...</p>}

        {!loading && reports.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-400">You haven't submitted any reports yet.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {reports.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    r.type === 'lost'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {r.type.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    r.status === 'open'    ? 'bg-yellow-100 text-yellow-600' :
                    r.status === 'matched' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {r.status.toUpperCase()}
                  </span>
                </div>
                <p className="font-medium text-gray-800">{r.item_name}</p>
                {r.description && <p className="text-sm text-gray-500 mt-1">{r.description}</p>}
                {r.location && <p className="text-xs text-gray-400 mt-1">📍 {r.location}</p>}
              </div>
              <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default MyReports