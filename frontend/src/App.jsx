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

// Layouts
import PatientLayout from './components/layout/PatientLayout';

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
        {/* Only show Navbar if not logged in (since Dashboards have sidebars now) */}
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
            
            {/* Admin specific */}
            <Route 
              path="/admin" 
              element={user?.role === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/admin/queue" 
              element={user?.role === 'admin' ? <AdminQueueView onLogout={handleLogout} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/admin/schedules" 
              element={user?.role === 'admin' ? <AdminSchedules onLogout={handleLogout} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/admin/patients" 
              element={user?.role === 'admin' ? <AdminPatients onLogout={handleLogout} /> : <Navigate to="/dashboard" />} 
            />
            {/* Keeping doctors route just in case */}
            <Route 
              path="/admin/doctors" 
              element={user?.role === 'admin' ? <DoctorManagement /> : <Navigate to="/dashboard" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;