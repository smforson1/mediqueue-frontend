import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FolderOpen, LogOut, Search, UserPlus, Edit3, ClipboardList, Plus, UserCircle2 } from 'lucide-react';
import api from '../../api';

const AdminPatients = () => {
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
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full min-h-screen">
      
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 min-h-screen lg:h-[calc(100vh-120px)]">
        
        {/* Left Column: Patients List */}
        <div className="w-full lg:w-[340px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 flex flex-col lg:h-full">
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

          <div className="space-y-2 flex-1 overflow-y-auto pr-2 max-h-[300px] lg:max-h-none">
            {filteredPatients.length === 0 ? (
              <div className="text-center text-slate-500 py-8 text-sm italic">No patients found.</div>
            ) : (
              filteredPatients.map(pat => (
                <div 
                  key={pat.id}
                  onClick={() => {
                    setActivePatientId(pat.id);
                    // On mobile, we might want to scroll to details or use a different view
                    if (window.innerWidth < 1024) {
                      document.getElementById('patient-details')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`flex flex-col p-3 md:p-4 rounded-xl cursor-pointer transition-colors border ${
                    activePatientId === pat.id ? 'bg-[#1b253b] text-white border-transparent shadow-md' : 'bg-white hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <h3 className={`font-bold text-sm ${activePatientId === pat.id ? 'text-white' : 'text-slate-800'}`}>{pat.name}</h3>
                    {activePatientId === pat.id && <span className="text-blue-300 font-black text-sm">&rsaquo;</span>}
                  </div>
                  <p className={`text-[10px] md:text-xs mt-1 font-medium ${activePatientId === pat.id ? 'text-blue-300/80' : 'text-slate-500'}`}>ID: PT-{pat.id.toString().padStart(4, '0')}</p>
                </div>
              ))
            )}
          </div>

          <button className="mt-4 md:mt-6 w-full py-3 md:py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            <UserPlus size={16} /> ADD NEW PATIENT
          </button>
        </div>

        {/* Right Column: Patient Details */}
        <div id="patient-details" className="flex-1 flex flex-col gap-6 lg:overflow-hidden">
          {activePatient ? (
            <>
              {/* Top Detail Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-10 pb-6 border-b border-slate-100">
                  <div className="flex gap-4 md:gap-5 items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg md:text-xl font-bold">
                      {activePatient.name ? activePatient.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-[#1b253b] flex items-center gap-3">
                        {activePatient.name}
                      </h1>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mt-1 inline-block">Active Patient</span>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto bg-white border text-[10px] md:text-xs font-bold border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50">
                    <Edit3 size={14} /> EDIT INFO
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 md:gap-y-8 gap-x-6 text-sm">
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
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">PHONE</h4>
                    <p className="font-semibold text-slate-800">{activePatient.phone || 'N/A'}</p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-1 overflow-hidden">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">EMAIL</h4>
                    <p className="font-semibold text-blue-600 truncate hover:underline cursor-pointer">{activePatient.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Medical Notes */}
              <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 md:p-6">
                <h3 className="text-[10px] md:text-[11px] font-bold text-[#991b1b] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ClipboardList size={16} /> KEY MEDICAL NOTES
                </h3>
                <div className="space-y-1.5 text-xs md:text-sm text-[#7f1d1d] font-medium">
                  <p><span className="font-bold">Allergies:</span> N/A</p>
                  <p><span className="font-bold">Chronic conditions:</span> None</p>
                </div>
              </div>

              {/* Appointment History */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-8 flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-bold text-[#1b253b]">History</h2>
                  <button className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md">
                    <Plus size={14} /> NEW APPT
                  </button>
                </div>

                <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                        <th className="pb-4">DATE</th>
                        <th className="pb-4">DOCTOR</th>
                        <th className="pb-4">STATUS</th>
                        <th className="pb-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {activeAppts.length === 0 ? (
                        <tr><td colSpan="4" className="py-6 text-center text-slate-500 text-sm italic">No history found.</td></tr>
                      ) : (
                        activeAppts.map(appt => (
                          <tr key={appt.id} className="hover:bg-slate-50/50">
                            <td className="py-4 text-xs md:text-sm font-semibold text-slate-700 whitespace-nowrap">{appt.date} - {appt.time}</td>
                            <td className="py-4 text-xs md:text-sm font-bold text-slate-800 whitespace-nowrap">{appt.doctorName || 'Dr. Unknown'}</td>
                            <td className="py-4">
                              <span className={`font-bold px-2 py-0.5 rounded text-[9px] md:text-[10px] uppercase tracking-wider ${
                                appt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 
                                appt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                'bg-green-100 text-green-700'
                              }`}>
                                {appt.status === 'confirmed' ? 'Upcoming' : appt.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                              </span>
                            </td>
                            <td className="py-4 text-right text-[10px] md:text-xs font-bold text-blue-600">
                              <span className="hover:underline cursor-pointer">NOTES</span>
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
                <p className="text-slate-500 text-sm">Select a patient to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;
