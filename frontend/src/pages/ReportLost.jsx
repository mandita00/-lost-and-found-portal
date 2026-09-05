import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config';

function ReportLost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ item_name: '', description: '', location: '' })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePhoto = e => {
    const file = e.target.files[0]
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = new FormData()
      data.append('item_name', form.item_name)
      data.append('description', form.description)
      data.append('location', form.location)
      if (photo) data.append('photo', photo)

      await axios.post(`${API_URL}/api/reports/lost`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      navigate('/my-reports')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">Lost & Found Portal</h1>
        <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:underline">
          ← Back to Home
        </button>
      </nav>

      <main className="max-w-lg mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Report a Lost Item</h2>
          <p className="text-sm text-gray-400 mb-6">Your photo is private and never shown publicly</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Item Name *</label>
              <input
                name="item_name"
                value={form.item_name}
                onChange={handleChange}
                required
                placeholder="e.g. Blue backpack"
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Black Nike backpack with a laptop inside, red keychain"
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Where did you lose it?</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Library, 2nd floor"
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Photo of the item</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="mt-1 w-full text-sm text-gray-500"
              />
              {preview && (
                <img src={preview} alt="preview" className="mt-3 rounded-lg w-full max-h-48 object-cover" />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Lost Report'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default ReportLost