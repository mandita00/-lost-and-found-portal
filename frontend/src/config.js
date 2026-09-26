
// Ensure VITE_BACKEND_URL defaults to /backend when proxying on Vercel
export const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://lost-and-found-backend-6pzs.onrender.com';