import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

// Hospital hallway background matching the mockup
const BG_URL = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&q=80';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/forgot-password', { email });
      navigate('/check-email', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center font-sans relative"
      style={{ backgroundImage: `url(${BG_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md mx-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <svg className="w-8 h-8 text-[#1b253b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#1b253b] text-center mb-2">Reset Your Password</h1>
        <p className="text-sm text-slate-500 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="name@company.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pl-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            id="send-reset-btn"
            className="w-full py-3.5 bg-[#1b253b] hover:bg-blue-900 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? 'Sending...' : (
              <>
                Send Reset Link
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
