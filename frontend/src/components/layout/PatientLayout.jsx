import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  Calendar, Clock, User, LogOut, LayoutDashboard, PlusCircle, 
  Menu, X, CheckCircle2, BellRing, UserCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import api from '../../api';

const PatientLayout = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [calledNotification, setCalledNotification] = useState(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Live Notification Polling ---
  const checkIfCalled = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/api/notifications/called?userId=${user.id}`);
      if (res.data.called && res.data.notification) {
        setCalledNotification(res.data.notification);
      }
    } catch (err) {
      // silently fail
    }
  }, [user?.id]);

  useEffect(() => {
    checkIfCalled();
    const interval = setInterval(checkIfCalled, 5000);
    return () => clearInterval(interval);
  }, [checkIfCalled]);

  const dismissCalledAlert = async () => {
    if (!calledNotification) return;
    setIsDismissing(true);
    try {
      await api.patch(`/api/notifications/${calledNotification.id}/read`);
      setCalledNotification(null);
    } catch (err) {
      console.error('Failed to dismiss notification', err);
    } finally {
      setIsDismissing(false);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: PlusCircle, label: 'Book Visit', path: '/book' },
    { icon: Clock, label: 'Queue Status', path: '/queue' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* Mobile Sidebar Toggle Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-slate-200' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 border-b border-slate-50">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-100 transition-transform group-hover:scale-105">
                <UserCircle2 size={24} strokeWidth={2.5} />
              </div>
              <div className="overflow-hidden">
                <span className="text-xl font-black text-slate-800 tracking-tight block leading-tight">MediQueue</span>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mt-0.5">Patient Portal</span>
              </div>
            </Link>
          </div>

          {/* User Profile Hook */}
          <div className="px-6 py-8">
            <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 font-black text-lg border border-slate-100">
                 {user?.name?.charAt(0) || 'U'}
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-black text-slate-800 truncate">{user?.name || 'Hello!'}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Patient ID: {user?.id?.substring(0, 8)}</p>
               </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Navigation</p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center justify-between group px-5 py-4 rounded-2xl font-black transition-all duration-300
                  ${isActive(item.path) 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </div>
                {!isActive(item.path) && <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all" />}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-slate-50 bg-slate-50/20 mt-auto">
            <button
               onClick={onLogout}
               className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 font-black transition-all duration-300"
            >
              <LogOut size={20} />
              <span className="text-sm tracking-tight">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex items-center justify-between p-6 bg-white border-b border-slate-100 z-30">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-1.5 rounded-lg text-white"><UserCircle2 size={18} /></div>
             <span className="font-black text-slate-800">MediQueue</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-201 transition-colors"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth bg-slate-50">
           {/* We inject the page content here */}
           <Outlet />
        </main>
      </div>

      {/* ============================================================
          LIVE GLOBAL NOTIFICATION POPUP
          ============================================================ */}
      {calledNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={dismissCalledAlert} />
          
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border-4 border-teal-400">
             <div className="h-2 bg-teal-400 animate-pulse" />
             <div className="p-10 text-center">
                <div className="mx-auto w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-8 border-4 border-teal-100">
                  <BellRing size={48} className="text-teal-500 animate-bounce" />
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">It's Your Turn!</h2>
                <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                   <p className="text-slate-600 font-bold leading-relaxed">{calledNotification.message}</p>
                </div>
                
                <button
                  onClick={dismissCalledAlert}
                  disabled={isDismissing}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-5 rounded-2xl text-lg transition-all shadow-xl shadow-teal-200 active:scale-[0.98] disabled:opacity-50"
                >
                  I'm On My Way!
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientLayout;
