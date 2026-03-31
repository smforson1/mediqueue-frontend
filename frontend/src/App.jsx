import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQueueView from './pages/admin/AdminQueueView';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminPatients from './pages/admin/AdminPatients';
import DoctorManagement from './pages/admin/DoctorManagement';
import QueueStatus from './pages/QueueStatus';
import ForgotPassword from './pages/ForgotPassword';
import CheckEmail from './pages/CheckEmail';
import ResetPassword from './pages/ResetPassword';

import AdminLayout from './components/layout/AdminLayout';

// Components
import Navbar from './components/common/Navbar';

function App() {
  const [user, setUser] = useState(null);

  // Simple auth check from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('mediqueue_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('mediqueue_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('mediqueue_user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Only show Navbar if not logged in (Dashboards have their own layouts) */}
        {!user && <Navbar user={user} onLogout={handleLogout} />}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Patient Protected Routes with Consistent Sidebar */}
            <Route element={user?.role === 'patient' || user?.role === 'staff' ? <PatientLayout user={user} onLogout={handleLogout} /> : user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/login" />}>
              <Route path="/dashboard" element={<PatientDashboard user={user} onLogout={handleLogout} />} />
              <Route path="/book" element={<BookingPage user={user} />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/queue" element={<QueueStatus />} />
            </Route>
            
            {/* Admin specific with shared Layout */}
            <Route element={user?.role === 'admin' ? <AdminLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/queue" element={<AdminQueueView />} />
              <Route path="/admin/schedules" element={<AdminSchedules />} />
              <Route path="/admin/patients" element={<AdminPatients />} />
              <Route path="/admin/doctors" element={<DoctorManagement />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;