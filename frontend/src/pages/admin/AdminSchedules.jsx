import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FolderOpen, LogOut, ChevronLeft, ChevronRight, ChevronDown, Clock, MapPin, Plus, UserCircle2 } from 'lucide-react';
import api from '../../api';

const AdminSchedules = () => {
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
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full min-h-screen font-sans">
      
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* Left Column: Doctors List */}
        <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 flex flex-col">
          <h2 className="text-lg font-bold text-[#1b253b] mb-4 md:mb-6 flex items-center gap-2">
            <div className="bg-slate-100 p-1.5 rounded-md"><Users size={18} className="text-slate-600" /></div> Doctors
          </h2>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none">
            {doctors.length === 0 ? (
              <div className="text-center text-slate-500 py-8 text-sm italic">Loading doctors...</div>
            ) : (
              doctors.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => handleDoctorChange(doc.id)}
                  className={`flex items-center gap-4 p-3 md:p-4 rounded-xl cursor-pointer transition-colors border ${
                    activeDoctor === doc.id ? 'bg-[#1b253b] text-white border-transparent shadow-md' : 'bg-white hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-500 border-2 border-slate-100 shrink-0">
                    {doc.name ? doc.name.charAt(0) : 'D'}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className={`font-bold text-xs md:text-sm truncate ${activeDoctor === doc.id ? 'text-white' : 'text-slate-800'}`}>
                      {doc.name.startsWith('Dr. ') ? doc.name : `Dr. ${doc.name}`}
                    </h3>
                    <p className={`text-[10px] md:text-xs truncate ${activeDoctor === doc.id ? 'text-blue-300' : 'text-slate-500'}`}>
                      {doc.specialty || 'General Practice'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="mt-4 md:mt-6 w-full py-3 md:py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            <Plus size={16} /> ADD NEW DOCTOR
          </button>
        </div>

        {/* Right Column: Schedule and Details */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Weekly Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-8 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#1b253b] mb-1">Weekly Calendar</h2>
                <p className="text-xs md:text-sm font-medium text-slate-500">
                  {doctors.find(d => d.id === activeDoctor)?.name || 'Select a doctor'}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-2 text-[10px] md:text-xs font-bold text-[#1b253b] w-full sm:w-auto justify-center">
                <ChevronLeft size={16} className="text-slate-500 cursor-pointer hover:text-slate-800" />
                <span>{weekDates[0].dateObj.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - {weekDates[6].dateObj.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
                <ChevronRight size={16} className="text-slate-500 cursor-pointer hover:text-slate-800" />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl relative -mx-4 sm:mx-0 px-4 sm:px-0">
              {isSaving && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-[#1b253b] font-bold text-sm">Saving...</div>
                </div>
              )}
              <table className="w-full text-center min-w-[600px] border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50">
                    <th className="w-20 py-4 border-b border-r border-slate-200">TIME</th>
                    {weekDates.map((day, i) => (
                      <th key={i} className={`py-4 border-b ${i !== 6 ? 'border-r' : ''} border-slate-200`}>
                        {day.dayName.substring(0, 3)}
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">{day.dateObj.getDate()}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gridData.map((row, i) => (
                    <tr key={i}>
                      <td className={`text-[11px] md:text-[12px] font-bold text-slate-600 border-r border-slate-200 ${i !== gridData.length - 1 ? 'border-b' : ''} py-3 md:py-4`}>
                        {row.time}
                      </td>
                      {row.slots.map((slot, j) => (
                        <td key={j} className={`border-slate-200 p-2 md:p-3 ${i !== gridData.length - 1 ? 'border-b' : ''} ${j !== 6 ? 'border-r' : ''}`}>
                          {slot === 'occ' ? (
                            <div className="w-full h-8 md:h-10 bg-[#1b253b] rounded shadow-sm"></div>
                          ) : slot === 'avail' ? (
                            <div className="w-full h-8 md:h-10 bg-[#e6fbf4] rounded"></div>
                          ) : (
                            <div className="w-full h-8 md:h-10 border border-slate-200 rounded flex items-center justify-center text-slate-300 font-light bg-slate-50/50 text-lg">
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

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-500">
                <div className="w-3 h-3 rounded bg-[#1b253b]"></div> Occupied
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-500">
                <div className="w-3 h-3 rounded bg-[#e6fbf4] border border-teal-100/50"></div> Available
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-500">
                <div className="w-3 h-3 rounded border border-slate-200 bg-slate-50/50"></div> Unavailable
              </div>
            </div>
          </div>


          {/* Edit Schedule Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-8">
            <h2 className="text-lg font-bold text-[#1b253b] mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-slate-400" /> Settings
            </h2>
            
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-slate-700 mb-3 uppercase tracking-widest">Working Days</label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {WEEKDAYS.map(day => (
                  <label key={day} className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-xs cursor-pointer transition-colors ${activeScheduleDays.includes(day) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <input 
                      type="checkbox" 
                      checked={activeScheduleDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    {day.substring(0, 3)}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Start Time</label>
                <div className="relative">
                  <input type="text" defaultValue="09:00 AM" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 pl-10 text-xs md:text-sm font-semibold text-slate-700" disabled />
                  <Clock size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-widest">End Time</label>
                <div className="relative">
                  <input type="text" defaultValue="05:00 PM" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 pl-10 text-xs md:text-sm font-semibold text-slate-700" disabled />
                  <Clock size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
              <button 
                onClick={() => {
                  const doc = doctors.find(d => d.id === activeDoctor);
                  if (doc) setActiveScheduleDays(doc.availableDays || []);
                }} 
                className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50"
                disabled={isSaving}
              >
                RESET
              </button>
              <button 
                onClick={saveSchedule}
                disabled={isSaving}
                className="w-full sm:w-auto bg-[#1b253b] text-white px-8 py-2.5 rounded-lg text-xs font-bold shadow-md hover:bg-slate-800 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Calendar size={14} /> {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSchedules;
