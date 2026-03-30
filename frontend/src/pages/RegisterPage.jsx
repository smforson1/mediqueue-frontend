import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api';

const RegisterPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/register', {
        name: formData.name, email: formData.email, phone: formData.phone, password: formData.password
      });
      onLogin(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center p-4 relative overflow-hidden bg-slate-900 py-12">
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2653&auto=format&fit=crop")' }}
      ></div>

      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header / Tabs */}
        <div className="pt-10 px-10 text-center">
          <h2 className="text-3xl font-bold text-primary mb-1">MediQueue</h2>
          <p className="text-slate-500 text-sm mb-8">Patient Flow Management</p>
          
          <div className="flex border-b border-slate-200">
            <Link to="/login" className="w-1/2 pb-4 text-slate-400 font-bold hover:text-slate-600 transition-colors text-lg">
              Login
            </Link>
            <div className="w-1/2 pb-4 border-b-2 border-primary text-primary font-bold text-lg">
              Register
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-10 pt-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-secondary-red rounded-lg flex items-center gap-3 border border-red-100">
              <AlertCircle size={20} className="shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="email@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="+1 555-0000" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Confirm</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="••••••••" />
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className={`w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-4 text-base font-bold shadow-md shadow-blue-200 transition-all mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
