import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, FolderOpen, 
  LogOut, UserCircle2, Menu, X 
} from 'lucide-react';

const AdminLayout = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Queue', path: '/admin/queue', icon: Users },
    { name: 'Schedules', path: '/admin/schedules', icon: Calendar },
    { name: 'Staff Management', path: '/admin/doctors', icon: UserCircle2 },
    { name: 'Patient Records', path: '/admin/patients', icon: FolderOpen },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex bg-[#f4f7fb] min-h-screen font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1b253b] flex items-center justify-between px-4 z-30 shadow-md">
        <Link to="/" className="flex items-center gap-2 text-white">
          <div className="bg-blue-500 text-white p-1 rounded-md">
            <UserCircle2 size={20} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">MediQueue</span>
        </Link>
        <button 
          onClick={toggleSidebar}
          className="text-white p-2 hover:bg-slate-800 rounded-md transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1b253b] text-slate-300 flex flex-col shadow-xl transition-transform duration-300 lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <Link to="/" className="hidden lg:flex items-center gap-3 text-white mb-10">
            <div className="bg-blue-500 text-white p-1.5 rounded-md">
              <UserCircle2 size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block">MediQueue</span>
              <span className="text-[10px] text-blue-300 uppercase tracking-widest block font-medium">Admin Panel</span>
            </div>
          </Link>

          {/* User Info on Sidebar for Mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8 pb-6 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-blue-300/80 uppercase tracking-wider font-medium">Administrator</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive 
                    ? 'bg-blue-500/10 text-white border-l-4 border-blue-500 rounded-l-none' 
                    : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} /> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-700/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 font-bold transition-colors w-full px-4 py-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 pt-16 lg:pt-0 overflow-x-hidden">
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
