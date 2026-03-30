import { useState, useEffect } from 'react';
import { Clock, Users, ArrowRight, PlayCircle, SkipForward, RefreshCcw } from 'lucide-react';
import api from '../api';

const QueueStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await api.get('/api/appointments');
      // Filter for today's confirmed appointments and sort by queue position
      const today = new Date().toISOString().split('T')[0];
      const activeQueue = response.data
        .filter(a => a.date === today && a.status === 'confirmed')
        .sort((a, b) => a.queuePosition - b.queuePosition);
      setAppointments(activeQueue);
    } catch (err) {
      console.error('Failed to fetch queue');
    } finally {
      setIsLoading(false);
    }
  };

  const currentPatient = appointments[0];
  const nextUp = appointments.slice(1, 6);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16 md:text-left">
        <h1 className="text-4xl font-black text-slate-900 mb-4 flex items-center gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl shadow-blue-100">
            <Clock className="animate-pulse" size={32} />
          </div>
          Live Clinic Queue
        </h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
          Track real-time progress. If your position is within the next 3 slots, please move towards the medical consultation rooms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Currently Serving */}
        <div className="lg:col-span-2">
          <div className="bg-[#1b253b] rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-900/10 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />
            
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-8 border border-blue-500/30 px-6 py-2 rounded-full">Currently Serving</div>
            
            {currentPatient ? (
              <>
                <div className="text-[140px] leading-none font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 select-none">
                  #{currentPatient.queuePosition?.toString().padStart(2, '0')}
                </div>
                
                <div className="bg-white/10 border border-white/5 backdrop-blur-md px-10 py-4 rounded-3xl mb-12 shadow-inner">
                   <p className="text-xs font-black text-blue-300 uppercase tracking-widest mb-1">PATIENT</p>
                   <p className="text-2xl font-black">{currentPatient.patientName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-lg border-t border-white/10 pt-10">
                  <div className="flex flex-col gap-2">
                    <div className="text-blue-300 text-[10px] uppercase font-black tracking-widest opacity-60">Consulting With</div>
                    <div className="text-xl font-black leading-tight italic">
                      {currentPatient.doctorName ? (currentPatient.doctorName.startsWith('Dr. ') ? currentPatient.doctorName : `Dr. ${currentPatient.doctorName}`) : 'Dr. Assigning...'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-blue-300 text-[10px] uppercase font-black tracking-widest opacity-60">Session Status</div>
                    <div className="flex items-center justify-center gap-2 text-xl font-black">
                       <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                       IN PROGRESS
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-32 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                   <Users className="opacity-20" size={40} />
                </div>
                <p className="text-2xl font-black italic opacity-40 uppercase tracking-widest tracking-tighter">Queue is currently clear</p>
              </div>
            )}

            {/* Decoration */}
            <div className="absolute -right-20 -bottom-20 text-white/5 group-hover:text-white/10 transition-colors duration-1000">
               <Users size={300} strokeWidth={0.5} />
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button 
              onClick={fetchQueue} 
              className="flex items-center gap-3 bg-white border-2 border-slate-100 hover:border-blue-200 text-slate-800 px-8 py-3.5 rounded-2xl font-black transition-all shadow-xl shadow-slate-200/50 active:scale-95"
            >
              <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} /> 
              {isLoading ? 'SYNCING...' : 'REFRESH STATUS'}
            </button>
          </div>
        </div>

        {/* Up Next List */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/50">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 pb-4 border-b border-slate-50 flex items-center justify-between">
              Next in Line <span className="text-blue-600">({nextUp.length})</span>
            </h2>
            
            <div className="space-y-4">
              {nextUp.length > 0 ? (
                nextUp.map((appt, idx) => (
                  <div key={appt.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="bg-[#1b253b] text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                        #{appt.queuePosition?.toString().padStart(2, '0')}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-sm">{appt.patientName}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Est: ~{(idx + 1) * 15} MINS</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50/30 rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No pending patients</p>
                </div>
              )}
            </div>

            {appointments.length > 6 && (
              <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] bg-blue-50 px-4 py-2 rounded-full">
                  +{appointments.length - 6} more in queue
                </span>
              </div>
            )}
          </div>

          <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-100">
             <div className="flex items-center gap-3 mb-4">
                <PlayCircle size={24} className="text-blue-200" />
                <h3 className="font-black text-lg">Queue Advisory</h3>
             </div>
             <p className="text-sm font-medium text-blue-50 leading-relaxed mb-6">
               Please notify the reception if you need to step out. We will call your device when your turn is imminent.
             </p>
             <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest">Avg Wait Time</span>
                <span className="font-black">12-15 MINS</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
