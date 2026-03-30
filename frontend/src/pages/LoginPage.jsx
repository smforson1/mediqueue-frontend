import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', formData);
      onLogin(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2653&auto=format&fit=crop")' }}
      ></div>

      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden mt-[-8vh]">
        
        {/* Header / Tabs */}
        <div className="pt-10 px-10 text-center">
          <h2 className="text-3xl font-bold text-primary mb-1">MediQueue</h2>
          <p className="text-slate-500 text-sm mb-8">Patient Flow Management</p>
          
          <div className="flex border-b border-slate-200">
            <div className="w-1/2 pb-4 border-b-2 border-primary text-primary font-bold text-lg">
              Login
            </div>
            <Link to="/register" className="w-1/2 pb-4 text-slate-400 font-bold hover:text-slate-600 transition-colors text-lg">
              Register
            </Link>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-secondary-red rounded-lg flex items-center gap-3 border border-red-100">
              <AlertCircle size={20} className="shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="adminCheck" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary accent-primary" />
              <label htmlFor="adminCheck" className="text-sm text-slate-600 font-medium cursor-pointer">
                I am a Clinic Administrator
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-4 text-base font-bold shadow-md shadow-blue-200 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'SIGNING IN...' : 'LOGIN'}
            </button>
            
            <div className="text-center mt-6">
              <Link to="/forgot-password" className="text-sm text-primary font-bold hover:underline">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
