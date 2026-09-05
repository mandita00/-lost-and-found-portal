import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_URL as BASE_URL } from '../config';
const API_URL = `${BASE_URL}/api/admin`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('pending'); // 'pending' | 'history'
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
        if (res.data.role !== 'admin') {
          navigate('/');
        }
      } catch (err) {
        navigate('/login');
      }
    }
    checkAuth();
  }, [navigate]);

  const fetchMatches = async (which) => {
    setLoading(true);
    try {
      const endpoint = which === 'pending' ? '/matches' : '/matches/history';
      const res = await fetch(`${API_URL}${endpoint}`, { credentials: 'include' });
      if (res.status === 401) {
  window.location.href = '/login';
  return;
}
if (res.status === 403) {
  setError('You do not have admin access.');
  setMatches([]);
  return;
}
      const data = await res.json();
      setMatches(data);
      setError('');
    } catch (err) {
      setError('Failed to load matches.');
    } finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    fetchMatches(tab);
  }, [tab]);

  const handleAction = async (matchId, action) => {
    try {
      await fetch(`${API_URL}/matches/${matchId}/${action}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      setMatches(prev => prev.filter(m => m.match_id !== matchId));
    } catch (err) {
      alert(`Failed to ${action} match.`);
    }
  };

  const statusColor = {
    approved: '#2e7d32',
    rejected: '#c62828',
    pending: '#f9a825',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setTab('pending')}
          style={{ fontWeight: tab === 'pending' ? 'bold' : 'normal', marginRight: '12px' }}
        >
          Pending
        </button>
        <button
          onClick={() => setTab('history')}
          style={{ fontWeight: tab === 'history' ? 'bold' : 'normal' }}
        >
          History
        </button>
      </div>

      {loading && <p>Loading matches...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && matches.length === 0 && (
        <p>{tab === 'pending' ? 'No pending matches right now.' : 'No match history yet.'}</p>
      )}

      {matches.map((m) => (
        <div
          key={m.match_id}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3>Found Item: {m.found_item_name}</h3>
            {m.found_photo_url && (
              <img
                src={m.found_photo_url}
                alt="found item"
                style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
              />
            )}
            <p>{m.found_description}</p>
            <p><b>Location:</b> {m.found_location}</p>
            <p><b>Reported by:</b> {m.finder_email}</p>
          </div>

          <div style={{ textAlign: 'center', minWidth: '140px' }}>
            <p><b>Confidence:</b> {m.confidence}</p>
            <p>Score: {m.similarity_score}</p>
            {tab === 'history' && (
              <p style={{ color: statusColor[m.status], fontWeight: 'bold', textTransform: 'uppercase' }}>
                {m.status}
              </p>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3>Lost Item: {m.lost_item_name}</h3>
            {m.lost_photo_url && (
              <img
                src={m.lost_photo_url}
                alt="lost item"
                style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
              />
            )}
            <p>{m.lost_description}</p>
            <p><b>Location:</b> {m.lost_location}</p>
            <p><b>Reported by:</b> {m.owner_email}</p>
          </div>

          {tab === 'pending' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => handleAction(m.match_id, 'approve')}>
                Approve
              </button>
              <button onClick={() => handleAction(m.match_id, 'reject')}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}