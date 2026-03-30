import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PlusCircle, CheckCircle2 } from 'lucide-react';
import api from '../api';

const PatientDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/appointments?patientId=${user?.id}&status=confirmed`);
      const sorted = (response.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
      setAppointments(sorted);
    } catch (err) {
      console.error('Failed to load appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentAppt = appointments[0]; // Simplified: assume first is current

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome back, {user?.name || 'Patient'}!</h1>
        <p className="text-slate-500 font-medium text-lg italic">Today is {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
      </header>

      {/* Live System Indicator */}
      <div className="flex items-center gap-3 mb-10 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl w-fit mx-auto md:mx-0">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] text-blue-700 font-black uppercase tracking-[0.2em]">Queue Monitoring System Active</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Status Widget */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-10 relative overflow-hidden group">
          <div className="flex items-center gap-3 text-slate-900 font-black text-xs uppercase tracking-widest mb-10 pb-4 border-b border-slate-50">
            <ActivityIcon size={20} className="text-blue-500" /> Real-time Queue Status
          </div>

          {currentAppt ? (
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Medical Officer</p>
                <p className="text-2xl font-black text-slate-800">
                  {currentAppt.doctorName
                    ? (currentAppt.doctorName.startsWith('Dr. ') ? currentAppt.doctorName : `Dr. ${currentAppt.doctorName}`)
                    : 'Dr. Unknown'}
                </p>
                <p className="text-sm font-bold text-slate-400">{currentAppt.doctorSpecialty || 'General Wellness'}</p>
              </div>
              <div className="text-center bg-slate-50 border border-slate-100 px-10 py-8 rounded-[2rem] shadow-inner shadow-slate-200/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">POSITION</p>
                <p className="text-6xl font-black text-blue-600 tracking-tighter">#{currentAppt.queuePosition?.toString().padStart(2, '0') || '01'}</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">EST. WAIT</p>
                <p className="text-2xl font-black text-teal-600 uppercase tracking-tighter">~{currentAppt.queuePosition ? currentAppt.queuePosition * 15 : 15} MINS</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12 relative z-10 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
               <Calendar size={32} className="mx-auto mb-4 opacity-20 text-slate-300" />
               <p className="font-black text-sm uppercase tracking-widest leading-relaxed">No visits record found<br/>for today.</p>
            </div>
          )}

          <div className="absolute right-[-20px] top-[-20px] text-slate-50 group-hover:text-slate-100/50 transition-colors duration-700 z-0">
             <ActivityIcon size={240} strokeWidth={0.5} />
          </div>
        </div>

        {/* Quick Action Widget */}
        <div className="bg-[#1b253b] rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-10 flex flex-col items-center justify-center text-center text-white relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500 group-hover:h-3 transition-all duration-300" />
          <div className="w-20 h-20 bg-white/10 text-white rounded-[1.5rem] flex items-center justify-center mb-6 border border-white/5 shadow-inner">
            <PlusCircle size={40} />
          </div>
          <h3 className="font-black text-2xl mb-3 tracking-tight">Need a Consultation?</h3>
          <p className="text-white/50 text-sm font-medium mb-10 leading-relaxed px-4">Skip the physical waiting room and reserve your spot in the digital queue.</p>
          <Link to="/book" className="w-full bg-white text-[#1b253b] hover:bg-slate-50 font-black py-4 rounded-xl transition-all shadow-xl active:scale-[0.97] text-lg uppercase tracking-widest">
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/30 border border-slate-50 p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3 text-slate-900 font-black text-sm uppercase tracking-[0.2em]">
            <Calendar size={20} className="text-blue-600" /> Upcoming Directory
          </div>
          <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors">Generate Report</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                <th className="pb-8 font-black">SCHEDULE</th>
                <th className="pb-8 font-black">MEDICAL TEAM</th>
                <th className="pb-8 font-black">FACILITY</th>
                <th className="pb-8 font-black text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr><td colSpan="4" className="py-24 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Synchronizing records...</p>
                  </div>
                </td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan="4" className="py-24 text-center">
                  <p className="text-slate-300 font-black text-sm uppercase tracking-[0.2em]">Your visit history is currently empty</p>
                </td></tr>
              ) : (
                appointments.map((appt, idx) => (
                  <tr key={appt.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                    <td className="py-8">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-800 text-base">{new Date(appt.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{appt.time}</span>
                      </div>
                    </td>
                    <td className="py-8">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base transition-all group-hover:rotate-6 ${idx % 2 === 0 ? 'bg-[#1b253b] text-white' : 'bg-blue-600 text-white'}`}>
                          {appt.doctorName ? appt.doctorName.replace('Dr. ', '').charAt(0) : 'D'}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-slate-800 text-base">{appt.doctorName ? (appt.doctorName.startsWith('Dr. ') ? appt.doctorName : `Dr. ${appt.doctorName}`) : 'Dr. Unknown'}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{appt.doctorSpecialty || 'General Care'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-8">
                       <div className="flex flex-col gap-0.5">
                          <span className="font-black text-slate-800 text-sm">Main Branch</span>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Dept. B-12</span>
                       </div>
                    </td>
                    <td className="py-8 text-right">
                       <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Linked
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ActivityIcon = ({ size, className, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default PatientDashboard;
