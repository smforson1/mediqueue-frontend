import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FolderOpen, LogOut, Search, UserPlus, Edit3, ClipboardList, Plus, UserCircle2 } from 'lucide-react';
import api from '../../api';

const AdminPatients = ({ onLogout }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activePatientId, setActivePatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patRes, appRes] = await Promise.all([
          api.get('/api/users/patients'),
          api.get('/api/appointments')
        ]);
        setPatients(patRes.data);
        setAppointments(appRes.data);
        if (patRes.data.length > 0) setActivePatientId(patRes.data[0].id);
      } catch (err) {
        console.error('Error fetching patient data:', err);
      }
    };
    fetchData();
  }, []);

  const filteredPatients = patients.filter(p => 
    searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery)
  );

  const activePatient = patients.find(p => p.id === activePatientId) || null;
  const activeAppts = appointments.filter(a => a.patientId === activePatientId).sort((a,b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex bg-[#f4f7fb] min-h-screen font-sans">
      
      {/* Sidebar - Reused layout */}
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
            <Link to="/admin/queue" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <Users size={18} /> Manage Queue
            </Link>
            <Link to="/admin/schedules" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <Calendar size={18} /> Schedules
            </Link>
            <Link to="/admin/patients" className="flex items-center gap-3 bg-blue-500/10 text-white border-l-4 border-blue-500 px-4 py-3 rounded-r-lg font-medium">
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
      <div className="flex-1 overflow-y-auto p-10 flex flex-col h-screen">
        
        <div className="flex flex-1 gap-8 max-w-7xl mx-auto w-full">
          
          {/* Left Column: Patients List */}
          <div className="w-[340px] bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-lg font-bold text-[#1b253b] mb-4 flex items-center gap-2">
              <Users size={18} className="text-slate-600" /> Patients
            </h2>

            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search patients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 pl-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" 
              />
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
              {filteredPatients.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm">No patients found.</div>
              ) : (
                filteredPatients.map(pat => (
                  <div 
                    key={pat.id}
                    onClick={() => setActivePatientId(pat.id)}
                    className={`flex flex-col p-4 rounded-xl cursor-pointer transition-colors border ${
                      activePatientId === pat.id ? 'bg-[#1b253b] text-white border-transparent shadow-md' : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <h3 className={`font-bold text-sm ${activePatientId === pat.id ? 'text-white' : 'text-slate-800'}`}>{pat.name}</h3>
                      {activePatientId === pat.id && <span className="text-blue-300 font-black text-sm">&rsaquo;</span>}
                    </div>
                    <p className={`text-xs mt-1 font-medium ${activePatientId === pat.id ? 'text-blue-300/80' : 'text-slate-500'}`}>ID: PT-{pat.id.toString().padStart(4, '0')}</p>
                  </div>
                ))
              )}
            </div>

            <button className="mt-6 w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              <UserPlus size={16} /> ADD NEW PATIENT
            </button>
            <div className="text-center mt-4">
              <span className="text-[10px] text-slate-400">&copy; {new Date().getFullYear()} MEDIQUEUE SYSTEMS - ADMIN PORTAL</span>
            </div>
          </div>

          {/* Right Column: Patient Details */}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {activePatient ? (
              <>
                {/* Top Detail Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-100">
                    <div className="flex gap-5 items-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                        {activePatient.name ? activePatient.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-[#1b253b] flex items-center gap-3">
                          {activePatient.name}
                        </h1>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mt-2 inline-block">Active Patient</span>
                      </div>
                    </div>
                    <button className="bg-white border text-xs font-bold border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-slate-50">
                      <Edit3 size={14} /> EDIT INFO
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-y-8 gap-x-6 text-sm">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">PATIENT ID</h4>
                      <p className="font-semibold text-slate-800">PT-{activePatient.id.toString().padStart(4, '0')}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">REGISTERED</h4>
                      <p className="font-semibold text-slate-800">{new Date(activePatient.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">GENDER</h4>
                      <p className="font-semibold text-slate-800">Unspecified</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">PHONE NUMBER</h4>
                      <p className="font-semibold text-slate-800">{activePatient.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">EMAIL</h4>
                      <p className="font-semibold text-blue-600 hover:underline cursor-pointer">{activePatient.email || 'N/A'}</p>
                    </div>
                    <div></div>
                  </div>
                </div>

                {/* Medical Notes - Kept Static for Demo */}
                <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-6">
                  <h3 className="text-[11px] font-bold text-[#991b1b] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ClipboardList size={16} /> KEY MEDICAL NOTES
                  </h3>
                  <div className="space-y-1.5 text-sm text-[#7f1d1d] font-medium">
                    <p><span className="font-bold">Allergies:</span> N/A</p>
                    <p><span className="font-bold">Chronic conditions:</span> None recorded</p>
                    <p><span className="font-bold">Blood Type:</span> Unknown</p>
                  </div>
                </div>

                {/* Appointment History */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-[#1b253b]">Appointment History</h2>
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-200">
                      <Plus size={14} /> NEW APPT
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                          <th className="pb-4">DATE & TIME</th>
                          <th className="pb-4">DOCTOR</th>
                          <th className="pb-4">REASON</th>
                          <th className="pb-4">STATUS</th>
                          <th className="pb-4 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {activeAppts.length === 0 ? (
                          <tr><td colSpan="5" className="py-6 text-center text-slate-500 text-sm">No appointment history.</td></tr>
                        ) : (
                          activeAppts.map(appt => (
                            <tr key={appt.id} className="hover:bg-slate-50/50">
                              <td className="py-4 text-sm font-semibold text-slate-700">{appt.date} - {appt.time}</td>
                              <td className="py-4 text-sm font-bold text-slate-800">{appt.doctorName ? (appt.doctorName.startsWith('Dr. ') ? appt.doctorName : `Dr. ${appt.doctorName}`) : 'Dr. Unknown'}</td>
                              <td className="py-4 text-sm font-medium text-slate-500">{appt.reason || 'General Checkup'}</td>
                              <td className="py-4">
                                {appt.status === 'confirmed' ? (
                                  <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider">Upcoming</span>
                                ) : appt.status === 'cancelled' ? (
                                  <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider">Cancelled</span>
                                ) : (
                                  <span className="bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider">Completed</span>
                                )}
                              </td>
                              <td className="py-4 text-right text-sm font-bold flex justify-end gap-3 text-blue-600">
                                <span className="hover:underline cursor-pointer">View Notes</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center p-8">
                <div className="text-center">
                  <UserCircle2 size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 mb-2">No Patient Selected</h3>
                  <p className="text-slate-500 text-sm">Select a patient from the sidebar to view their full details and appointment history.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPatients;
