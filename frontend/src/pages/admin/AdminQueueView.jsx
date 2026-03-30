import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, FolderOpen, LogOut,
  Search, Printer, Download, ChevronDown, UserCircle2,
  Phone, RefreshCw, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import api from '../../api';

const AdminQueueView = ({ onLogout }) => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterDoctor, setFilterDoctor] = useState('All Doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [callingId, setCallingId] = useState(null);
  const [callSuccess, setCallSuccess] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [docsRes, apptsRes] = await Promise.all([
        api.get('/api/doctors'),
        api.get('/api/appointments')
      ]);
      setDoctors(docsRes.data);
      setQueue(apptsRes.data.filter(a => a.status !== 'cancelled'));
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch queue data', err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleCallPatient = async (appt) => {
    setCallingId(appt.id);
    try {
      await api.post(`/api/appointments/${appt.id}/call`);
      setCallSuccess({ id: appt.id, name: appt.patientName });
      // Refresh queue to reflect new status
      await fetchData(true);
      setTimeout(() => setCallSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to call patient', err);
      alert('Failed to send notification. Please try again.');
    } finally {
      setCallingId(null);
    }
  };

  const handleCompleteAppointment = async (apptId) => {
    try {
      await api.post(`/api/appointments/${apptId}/complete`);
      await fetchData(true);
    } catch (err) {
      console.error('Failed to complete appointment', err);
      alert('Failed to complete appointment. Please try again.');
    }
  };

  const filteredQueue = queue.filter(apt => {
    const docMatch =
      filterDoctor === 'All Doctors' ||
      apt.doctorId === filterDoctor ||
      (apt.doctorName && (
        apt.doctorName === filterDoctor ||
        apt.doctorName === filterDoctor.replace('Dr. ', '') ||
        `Dr. ${apt.doctorName}` === filterDoctor
      ));
    const searchMatch =
      searchQuery === '' ||
      (apt.patientName && apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
    return docMatch && searchMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            In Progress
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Waiting
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            Checked In
          </span>
        );
      default:
        return <span className="text-slate-500 text-xs">{status}</span>;
    }
  };

  return (
    <div className="flex bg-[#f4f7fb] min-h-screen font-sans">

      {/* Sidebar */}
      <div className="w-64 bg-[#1b253b] text-slate-300 flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 text-white mb-10">
            <div className="bg-blue-500 text-white p-1.5 rounded-md">
              <UserCircle2 size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block">MediQueue</span>
              <span className="text-[10px] text-blue-300 uppercase tracking-widest block font-medium">Admin Panel</span>
            </div>
          </Link>

          <nav className="space-y-1">
            <Link to="/admin" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/admin/queue" className="flex items-center gap-3 bg-blue-500/10 text-white border-l-4 border-blue-500 px-4 py-3 rounded-r-lg font-medium">
              <Users size={18} /> Manage Queue
            </Link>
            <Link to="/admin/schedules" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <Calendar size={18} /> Schedules
            </Link>
            <Link to="/admin/patients" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <FolderOpen size={18} /> Patient Records
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-700/50">
          <button
            onClick={() => { onLogout(); navigate('/login'); }}
            className="flex items-center gap-3 text-red-300 hover:text-red-200 font-medium transition-colors w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12 flex justify-center items-start">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full max-w-5xl overflow-hidden p-10">

          {/* Call Success Banner */}
          {callSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <div>
                <p className="font-bold text-green-800 text-sm">Patient Called Successfully</p>
                <p className="text-green-700 text-xs mt-0.5">
                  <strong>{callSuccess.name}</strong> has received a live notification that it's their turn.
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-10 pb-8 border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-bold text-[#1b253b] mb-1">MediQueue Admin</h1>
              <div className="flex items-center gap-3">
                <p className="text-slate-500 font-medium">
                  Daily Queue Snapshot — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <button
                  onClick={() => fetchData()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 15s
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#1b253b] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md hover:bg-slate-800 transition-colors">
                <Printer size={16} /> PRINT
              </button>
              <button className="bg-white border border-slate-200 text-[#1b253b] px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                <Download size={16} /> EXPORT CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-10 flex gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-2">Filter by Doctor</label>
              <div className="relative">
                <select
                  className="appearance-none w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                  value={filterDoctor}
                  onChange={(e) => setFilterDoctor(e.target.value)}
                >
                  <option value="All Doctors">All Doctors</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={`Dr. ${doc.name}`}>Dr. {doc.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-[2] relative">
              <label className="block text-xs font-bold text-slate-700 mb-2">Search Patient Name</label>
              <input
                type="text"
                placeholder="Type name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 pl-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={16} className="absolute left-4 top-[34px] text-slate-400" />
            </div>
          </div>

          {/* Queue Table */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1b253b] mb-4">Current Queue List</h2>
            <div className="rounded-xl border border-[#e0e8f0] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#eaf3fa] text-[#4f6b88] text-[11px] font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">TIME</th>
                    <th className="px-6 py-4">PATIENT NAME</th>
                    <th className="px-6 py-4">DOCTOR</th>
                    <th className="px-6 py-4">REASON</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <AlertCircle size={32} className="text-slate-300" />
                          <p className="font-medium">No patients in the queue matching your filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredQueue.map((pat, idx) => (
                      <tr
                        key={pat.id}
                        className={`hover:bg-slate-50 transition-colors ${pat.status === 'in_progress' ? 'bg-green-50/40' : ''}`}
                      >
                        <td className="px-6 py-5 text-sm font-bold text-slate-400">
                          {(pat.queuePosition || idx + 1).toString().padStart(2, '0')}
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-slate-600">{pat.time}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                              {(pat.patientName || '?').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              {pat.patientName || 'Unknown Patient'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600">
                          {pat.doctorName
                            ? (pat.doctorName.startsWith('Dr. ') ? pat.doctorName : `Dr. ${pat.doctorName}`)
                            : 'Dr. Unknown'}
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">{pat.reason || 'General Checkup'}</td>
                        <td className="px-6 py-5">{getStatusBadge(pat.status)}</td>
                        <td className="px-6 py-5 text-right">
                          {pat.status === 'in_progress' ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                <CheckCircle size={14} /> Called
                              </span>
                              <button
                                onClick={() => handleCompleteAppointment(pat.id)}
                                className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-900 transition-all"
                              >
                                Complete
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleCallPatient(pat)}
                                disabled={callingId === pat.id}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-blue-200 transition-all"
                              >
                                <Phone size={13} />
                                {callingId === pat.id ? 'Calling...' : 'Call'}
                              </button>
                              <button
                                onClick={() => handleCompleteAppointment(pat.id)}
                                className="bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold px-3 py-2 rounded-lg transition-all"
                              >
                                Remove
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

          {/* Footer */}
          <div className="flex justify-between items-end border-t border-slate-100 pt-6 mt-6">
            <div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                Total Patients in Queue: <span className="font-normal text-slate-600">{filteredQueue.length.toString().padStart(2, '0')}</span>
              </p>
              <p className="text-sm font-bold text-slate-800">
                In Progress: <span className="font-normal text-green-600">{filteredQueue.filter(q => q.status === 'in_progress').length}</span>
                &nbsp;· Waiting: <span className="font-normal text-slate-600">{filteredQueue.filter(q => q.status === 'confirmed').length}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">Generated by MediQueue v1.0.4</p>
              <p className="text-xs text-slate-400">Confidential Medical Document — For Internal Use Only</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminQueueView;
