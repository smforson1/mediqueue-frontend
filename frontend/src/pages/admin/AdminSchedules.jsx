import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FolderOpen, LogOut, ChevronLeft, ChevronRight, ChevronDown, Clock, MapPin, Plus, UserCircle2 } from 'lucide-react';
import api from '../../api';

const AdminSchedules = ({ onLogout }) => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [activeScheduleDays, setActiveScheduleDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Dummy week generation starting from today (for demo purposes)
  const today = new Date();
  const weekDates = Array.from({length: 7}).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      dateObj: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' })
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, apptsRes] = await Promise.all([
          api.get('/api/doctors'),
          api.get('/api/appointments')
        ]);
        setDoctors(docsRes.data);
        setAppointments(apptsRes.data.filter(a => a.status !== 'cancelled'));
        
        if (docsRes.data.length > 0) {
          setActiveDoctor(docsRes.data[0].id);
          setActiveScheduleDays(docsRes.data[0].availableDays || []);
        }
      } catch (err) {
        console.error('Failed to load data.', err);
      }
    };
    fetchData();
  }, []);

  const handleDoctorChange = (docId) => {
    setActiveDoctor(docId);
    const doc = doctors.find(d => d.id === docId);
    if (doc) setActiveScheduleDays(doc.availableDays || []);
  };

  const toggleDay = (day) => {
    setActiveScheduleDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const saveSchedule = async () => {
    if (!activeDoctor) return;
    setIsSaving(true);
    try {
      await api.patch(`/api/doctors/${activeDoctor}`, {
        available_days: activeScheduleDays
      });
      
      // Update local doctors array
      setDoctors(docs => docs.map(d => 
        d.id === activeDoctor ? { ...d, availableDays: activeScheduleDays } : d
      ));
      alert('Schedule updated securely!');
    } catch (err) {
      console.error('Failed to save schedule', err);
      alert('Failed to save schedule.');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate Grid Data Dynamically
  const generateGridData = () => {
    const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const activeAppts = appointments.filter(a => a.doctorId === activeDoctor);
    
    return times.map(time => {
      const slots = weekDates.map(day => {
        if (!activeScheduleDays.includes(day.dayName)) return 'unavail';
        
        // Check if an appointment exists for this exact day + time
        const isOccupied = activeAppts.some(a => a.date === day.dateStr && a.time === time);
        return isOccupied ? 'occ' : 'avail';
      });
      return { time, slots };
    });
  };

  const gridData = generateGridData();

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
            <Link to="/admin/schedules" className="flex items-center gap-3 bg-blue-500/10 text-white border-l-4 border-blue-500 px-4 py-3 rounded-r-lg font-medium">
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
      <div className="flex-1 overflow-y-auto p-10 flex flex-col h-screen">
        
        <div className="flex flex-1 gap-8 max-w-7xl mx-auto w-full">
          
          {/* Left Column: Doctors List */}
          <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-lg font-bold text-[#1b253b] mb-6 flex items-center gap-2">
              <div className="bg-slate-100 p-1.5 rounded-md"><Users size={18} className="text-slate-600" /></div> Doctors
            </h2>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {doctors.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm">Loading doctors...</div>
              ) : (
                doctors.map((doc, idx) => (
                  <div 
                    key={doc.id}
                    onClick={() => handleDoctorChange(doc.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors border ${
                      activeDoctor === doc.id ? 'bg-[#1b253b] text-white border-transparent' : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-500 border-2 border-slate-100">
                      {doc.name ? doc.name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${activeDoctor === doc.id ? 'text-white' : 'text-slate-800'}`}>{doc.name.startsWith('Dr. ') ? doc.name : `Dr. ${doc.name}`}</h3>
                      <p className={`text-xs ${activeDoctor === doc.id ? 'text-blue-300' : 'text-slate-500'}`}>{doc.specialty || 'General Practice'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="mt-6 w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              <Plus size={16} /> ADD NEW DOCTOR
            </button>
          </div>

          {/* Right Column: Schedule and Details */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Weekly Calendar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1b253b] mb-1">Weekly Calendar</h2>
                  <p className="text-sm font-medium text-slate-500">Viewing schedule for {doctors.find(d => d.id === activeDoctor)?.name ? (doctors.find(d => d.id === activeDoctor).name.startsWith('Dr. ') ? doctors.find(d => d.id === activeDoctor).name : `Dr. ${doctors.find(d => d.id === activeDoctor).name}`) : 'Unknown'}</p>
                </div>
                <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-2 text-sm font-bold text-[#1b253b]">
                  <ChevronLeft size={16} className="text-slate-500 cursor-pointer hover:text-slate-800" />
                  <span>{weekDates[0].dateObj.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - {weekDates[6].dateObj.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
                  <ChevronRight size={16} className="text-slate-500 cursor-pointer hover:text-slate-800" />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl relative">
                {isSaving && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-[#1b253b] font-bold">Saving...</div>
                  </div>
                )}
                <table className="w-full text-center table-fixed border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50">
                      <th className="w-24 py-5 border-b border-r border-slate-200">TIME</th>
                      {weekDates.map((day, i) => (
                        <th key={i} className={`py-5 border-b ${i !== 6 ? 'border-r' : ''} border-slate-200`}>
                          {day.dayName.substring(0, 3)}
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">{day.dateObj.getDate()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gridData.map((row, i) => (
                      <tr key={i}>
                        <td className={`text-[13px] font-bold text-slate-600 border-r border-slate-200 ${i !== gridData.length - 1 ? 'border-b' : ''} py-4`}>
                          {row.time}
                        </td>
                        {row.slots.map((slot, j) => (
                          <td key={j} className={`border-slate-200 p-3 h-full ${i !== gridData.length - 1 ? 'border-b' : ''} ${j !== 6 ? 'border-r' : ''}`}>
                            {slot === 'occ' ? (
                              <div className="w-full h-12 bg-[#1b253b] rounded-md shadow-sm"></div>
                            ) : slot === 'avail' ? (
                              <div className="w-full h-12 bg-[#e6fbf4] rounded-md"></div>
                            ) : (
                              <div className="w-full h-12 border border-slate-200 rounded-md flex items-center justify-center text-slate-300 font-light bg-slate-50/50 text-xl">
                                &times;
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                  <div className="w-4 h-4 rounded-md bg-[#1b253b]"></div> Occupied Slot
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                  <div className="w-4 h-4 rounded-md bg-[#e6fbf4] border border-teal-100/50"></div> Available Slot
                </div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                  <div className="w-4 h-4 rounded-md border border-slate-200 bg-slate-50/50"></div> Unavailable
                </div>
              </div>
            </div>


            {/* Edit Schedule Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-lg font-bold text-[#1b253b] mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" /> Edit Schedule Details
              </h2>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-widest">Available Working Days</label>
                <div className="flex flex-wrap gap-3">
                  {WEEKDAYS.map(day => (
                    <label key={day} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm cursor-pointer transition-colors ${activeScheduleDays.includes(day) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <input 
                        type="checkbox" 
                        checked={activeScheduleDays.includes(day)}
                        onChange={() => toggleDay(day)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      {day.substring(0, 3)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Shift Start Time</label>
                  <div className="relative">
                    <input type="text" defaultValue="09:00 AM" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pl-12 text-sm font-semibold text-slate-700" disabled />
                    <Clock size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Shift End Time</label>
                  <div className="relative">
                    <input type="text" defaultValue="05:00 PM" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pl-12 text-sm font-semibold text-slate-700" disabled />
                    <Clock size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => {
                    const doc = doctors.find(d => d.id === activeDoctor);
                    if (doc) setActiveScheduleDays(doc.availableDays || []);
                  }} 
                  className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50"
                  disabled={isSaving}
                >
                  RESET
                </button>
                <button 
                  onClick={saveSchedule}
                  disabled={isSaving}
                  className="bg-[#1b253b] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 flex items-center gap-2 disabled:opacity-50"
                >
                  <Calendar size={16} /> {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSchedules;
