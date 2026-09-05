import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ReportLost from './pages/ReportLost'
import ReportFound from './pages/ReportFound'
import MyReports from './pages/MyReports'
import AdminDashboard from './pages/AdminDashboard'
import SearchResults from './pages/SearchResults'
import FAQ from './pages/FAQ'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/dashboard"    element={<Navigate to="/" replace />} />
        <Route path="/report-lost"  element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/my-reports"   element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/search"       element={<SearchResults />} />
        <Route path="/faq"          element={<FAQ />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App