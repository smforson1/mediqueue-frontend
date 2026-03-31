import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FolderOpen, LogOut, CalendarDays, Clock, CheckCircle2, XCircle, Search, Edit2, Phone, MoreHorizontal, UserCircle2 } from 'lucide-react';
import api from '../../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [callingId, setCallingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch Stats
      const statsRes = await api.get('/api/stats');
      setStats({
        waiting: statsRes.data.confirmed, 
        appts: statsRes.data.totalBookings,
        completed: statsRes.data.completed, 
        cancelled: statsRes.data.cancelled
      });

      // Fetch Today's Queue
      const apptsRes = await api.get('/api/appointments');
      
      const activeAppts = apptsRes.data.filter(a => a.status === 'confirmed' || a.status === 'in_progress');
      const pendingAppts = apptsRes.data.filter(a => a.status === 'pending');
      
      setQueue(activeAppts.map(a => ({
        id: a.id,
        name: a.patientName || 'Unknown',
        time: a.time,
        status: a.status === 'in_progress' ? 'In Progress' : 'Waiting'
      })));

      setPendingRequests(pendingAppts);

    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  const handleCallPatient = async (pat) => {
    setCallingId(pat.id);
    try {
      await api.post(`/api/appointments/${pat.id}/call`);
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to call patient', err);
    } finally {
      setCallingId(null);
    }
  };

  const handleCompleteAppointment = async (apptId) => {
    try {
      await api.post(`/api/appointments/${apptId}/complete`);
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to complete appointment', err);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      
      <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium tracking-tight text-sm md:text-base">Manage patient queues and requests efficiently.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors shrink-0">
          <CalendarDays size={16} className="text-slate-400" />
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waiting</span>
            <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><Clock size={16} /></div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">{stats?.waiting || 0}</div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <Clock size={14} className="text-slate-400" /> Avg. wait: 15 mins
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Appt's</span>
            <div className="bg-green-50 p-2 rounded-lg text-green-500"><CalendarDays size={16} /></div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">{stats?.appts || 0}</div>
            <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 size={14} /> {stats?.completed || 0} completed
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cancellations</span>
            <div className="bg-red-50 p-2 rounded-lg text-red-500"><XCircle size={16} /></div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#1b253b] mb-2">{stats?.cancelled?.toString().padStart(2, '0') || '00'}</div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <Clock size={14} className="text-slate-400" /> Low priority
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Active Queue ListView */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-800">Active Queue</h2>
            <Link to="/admin/queue" className="text-blue-600 text-sm font-bold flex items-center hover:opacity-80">
              View All &rarr;
            </Link>
          </div>
          
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                   <th className="pb-4">Patient</th>
                   <th className="pb-4">Time</th>
                   <th className="pb-4">Status</th>
                   <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-slate-500 text-sm italic">No patients in queue.</td>
                  </tr>
                ) : (
                  queue.map((pat) => (
                    <tr key={pat.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="py-4 md:py-5 font-bold text-slate-800 text-sm">{pat.name}</td>
                      <td className="py-4 md:py-5 text-slate-500 text-sm font-medium">{pat.time}</td>
                      <td className="py-4 md:py-5">
                        {pat.status === 'In Progress' ? (
                          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Waiting
                          </span>
                        )}
                      </td>
                      <td className="py-4 md:py-5 text-right flex items-center justify-end gap-2">
                        {pat.status === 'In Progress' ? (
                          <div className="flex items-center gap-2">
                            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-green-600 font-bold">
                              <CheckCircle2 size={13} /> Called
                            </span>
                            <button
                              onClick={() => handleCompleteAppointment(pat.id)}
                              className="bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-900 transition-all"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCallPatient(pat)}
                              disabled={callingId === pat.id}
                              className="bg-blue-600 disabled:bg-blue-400 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm shadow-blue-200 hover:bg-blue-700 flex items-center gap-1.5 transition-all"
                            >
                              <Phone size={12} />
                              <span className="hidden sm:inline">{callingId === pat.id ? 'Calling...' : 'Call'}</span>
                            </button>
                            <button
                              onClick={() => handleCompleteAppointment(pat.id)}
                              className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                            >
                              Del
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Requests Column */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-800">Requests</h2>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">{pendingRequests.length} New</span>
          </div>
          
          <div className="space-y-4 flex-1">
            {pendingRequests.length === 0 ? (
              <div className="text-center text-slate-500 py-8 text-sm italic">No pending requests.</div>
            ) : (
              pendingRequests.slice(0, 5).map(req => (
                <div key={req.id} className="border border-slate-100 p-4 rounded-xl shadow-sm bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{req.patientName || 'Unknown Patient'}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
                    <Clock size={12} className="text-slate-400" />
                    {req.reason || 'General Checkup'} - {req.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold py-2 rounded-lg transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold py-2 rounded-lg transition-colors">
                      Deny
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {pendingRequests.length > 5 && (
            <div className="mt-6 text-center">
              <button className="text-blue-600 text-xs font-bold hover:underline">
                View all {pendingRequests.length} requests
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
