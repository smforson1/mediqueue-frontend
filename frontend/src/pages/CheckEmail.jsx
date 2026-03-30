import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useState } from 'react';

const BG_URL = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&q=80';

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState('');

  const handleResend = async () => {
    setResending(true);
    setResentMsg('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setResentMsg('Reset link resent! Please check your inbox.');
    } catch {
      setResentMsg('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center font-sans relative"
      style={{ backgroundImage: `url(${BG_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/30" />

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md mx-4 text-center">
        {/* Envelope Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#1b253b] p-5 rounded-2xl shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#1b253b] mb-3">Check Your Email</h1>
        <p className="text-sm text-slate-500 mb-1">
          We've sent a password reset link to
        </p>
        <p className="text-sm font-bold text-blue-600 mb-4">{email}</p>
        <p className="text-sm text-slate-500 mb-8">
          Please check your inbox and follow the instructions to reset your account access.
        </p>

        <Link
          to="/login"
          id="back-to-login-btn"
          className="block w-full py-3.5 bg-[#1b253b] hover:bg-blue-900 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors mb-6"
        >
          Back to Login
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Link>

        <p className="text-sm text-slate-500 mb-1">
          Didn't receive the email?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Resend link'}
          </button>
        </p>
        {resentMsg && <p className="text-xs text-green-600 font-medium mt-1">{resentMsg}</p>}

        <p className="text-sm text-slate-400 mt-3">
          Need help?{' '}
          <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
            Contact our support team
          </span>
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
