import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Clock, User, ChevronRight, 
  AlertCircle, CheckCircle2, MapPin, Award, Stethoscope,
  Info, CalendarDays, Loader2
} from 'lucide-react';
import api from '../api';

const BookingPage = ({ user }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availError, setAvailError] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isSlotLoading, setIsSlotLoading] = useState(false);
  const navigate = useNavigate();

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/api/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
      }
    };
    fetchDoctors();
  }, []);

  // Check availability whenever date or doctor changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const date = new Date(selectedDate);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const isAvailable = selectedDoctor.availableDays?.includes(dayName);
      
      if (!isAvailable) {
        setAvailError(`${selectedDoctor.name.startsWith('Dr. ') ? selectedDoctor.name : `Dr. ${selectedDoctor.name}`} is only available on: ${selectedDoctor.availableDays?.join(', ')}.`);
        setBookedTimes([]);
        setSelectedTime(''); // Clear time if day is invalid
      } else {
        setAvailError('');
        fetchBookedSlots();
      }
    } else {
      setAvailError('');
      setBookedTimes([]);
    }
  }, [selectedDate, selectedDoctor]);

  const fetchBookedSlots = async () => {
    setIsSlotLoading(true);
    try {
      const res = await api.get(`/api/appointments/booked`, {
        params: { doctorId: selectedDoctor.id, date: selectedDate }
      });
      setBookedTimes(res.data.bookedTimes || []);
    } catch (err) {
      console.error('Failed to fetch booked slots', err);
    } finally {
      setIsSlotLoading(false);
    }
  };

  const availableSlots = timeSlots.filter(slot => !bookedTimes.includes(slot));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || availError) {
      if (!availError) setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/appointments', {
        doctorId: selectedDoctor.id,
        patientId: user.id,
        date: selectedDate,
        time: selectedTime,
        reason: reason
      });
      // Pass appointment details to confirmation page via state
      navigate('/confirmation', { state: { appointment: response.data, doctor: selectedDoctor } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. This slot might be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDayStatus = (doctor) => {
    if (!doctor.availableDays || doctor.availableDays.length === 0) return 'No schedule set';
    if (doctor.availableDays.length === 7) return 'Available Daily';
    return `${doctor.availableDays.length} days / week`;
  };

  return (
    <div className="py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-black text-[#1b253b] mb-3 tracking-tight">Reserve Your Slot</h1>
          <p className="text-slate-500 font-medium text-lg">Secure your appointment with our top-tier medical specialists in just a few clicks.</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-4 animate-shake">
            <AlertCircle size={24} className="shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Booking Controls */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. Doctor Selection */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">1. Select Specialist</h2>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-0.5">Primary Care & Specialists</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`group relative cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-blue-600 bg-blue-50/30'
                        : 'border-slate-50 bg-slate-50/20 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${
                        selectedDoctor?.id === doctor.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm'
                      }`}>
                        {doctor.name.charAt(0)}
                      </div>
                      {selectedDoctor?.id === doctor.id && (
                        <CheckCircle2 size={24} className="text-blue-600 fill-blue-50" />
                      )}
                    </div>
                    
                    <h3 className="font-black text-slate-800 text-lg mb-0.5">
                      {doctor.name.startsWith('Dr. ') ? doctor.name : `Dr. ${doctor.name}`}
                    </h3>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-tight mb-4">{doctor.specialty}</p>
                    
                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                        <Award size={12} className="text-blue-400" /> {doctor.experience || '8+ Yrs'} Exp.
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doctor.availableDays && doctor.availableDays.length > 0 ? (
                          doctor.availableDays.map(day => (
                            <span key={day} className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                              selectedDoctor?.id === doctor.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {day.substring(0, 3)}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400">Schedule not set</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Schedule Section */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-green-500 text-white p-3 rounded-2xl shadow-lg shadow-green-100">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">2. Preferred Schedule</h2>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-0.5">Date & Time Availability</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 italic">Choose Date</label>
                  <div className="relative group">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full bg-slate-50 border-2 rounded-2xl py-5 px-6 pl-14 text-sm font-black focus:ring-4 focus:ring-blue-100 outline-none transition-all ${
                        availError ? 'border-red-200 bg-red-50/30' : 'border-slate-50 group-hover:border-slate-200'
                      }`}
                    />
                    <CalendarDays size={20} className={`absolute left-5 top-5 transition-colors ${availError ? 'text-red-400' : 'text-slate-300'}`} />
                  </div>
                  
                  {availError && (
                    <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold animate-fade-in bg-red-50 p-3 rounded-xl border border-red-100">
                      <AlertCircle size={14} /> {availError}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 italic">Choose Time</label>
                  {isSlotLoading ? (
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold py-4">
                      <Loader2 className="animate-spin" size={14} /> checking availability...
                    </div>
                  ) : !selectedDate || availError ? (
                    <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                       <Clock size={24} className="mx-auto text-slate-200 mb-2" />
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select date first</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="py-8 text-center bg-red-50 border-2 border-red-100 rounded-2xl">
                       <AlertCircle size={24} className="mx-auto text-red-300 mb-2" />
                       <p className="text-xs text-red-700 font-black uppercase tracking-tight">Fully Booked</p>
                       <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-widest">Try another date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3.5 px-2 text-[11px] font-black rounded-xl border-2 transition-all active:scale-95 ${
                            selectedTime === slot
                              ? 'bg-[#1b253b] text-white border-[#1b253b] shadow-lg shadow-slate-200'
                              : 'bg-white text-slate-500 border-slate-50 hover:border-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Reason Section */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-purple-500 text-white p-3 rounded-2xl shadow-lg shadow-purple-100">
                  <Info size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">3. Visit Context</h2>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-0.5">Brief Medical Purpose</p>
                </div>
              </div>
              
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Annual blood work, severe headache, prescription renewal..."
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl p-6 min-h-[140px] outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-slate-200 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
              ></textarea>
            </section>
          </div>

          {/* Right Column: Checkout Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 bg-[#1b253b] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-300">
              <h2 className="text-xl font-black mb-8 border-b border-white/10 pb-6 flex items-center gap-2">
                Booking Details
              </h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex flex-col gap-1.5 px-4 border-l-4 border-blue-500">
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Medical Professional</span>
                  <span className="font-black text-lg">
                    {selectedDoctor ? (selectedDoctor.name.startsWith('Dr. ') ? selectedDoctor.name : `Dr. ${selectedDoctor.name}`) : <span className="text-white/20 italic font-medium tracking-normal text-base">Not chosen</span>}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 px-4 border-l-4 border-green-500">
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Schedule Window</span>
                  <span className="font-black text-lg">
                    {selectedDate && selectedTime ? (
                      `${new Date(selectedDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} at ${selectedTime}`
                    ) : <span className="text-white/20 italic font-medium tracking-normal text-base">Select date & time</span>}
                  </span>
                </div>
                {reason && (
                  <div className="flex flex-col gap-1.5 px-4 border-l-4 border-purple-500">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Note to staff</span>
                    <span className="font-bold text-sm text-white/70 line-clamp-2">{reason}</span>
                  </div>
                )}
              </div>

              <div className="bg-white/5 p-6 rounded-3xl mb-8 flex items-center gap-4 text-sm text-white/50 border border-white/5 font-medium leading-relaxed">
                <Info size={24} className="shrink-0 text-blue-400" />
                You'll receive a live notification on your dashboard when it's your turn.
              </div>

              <button
                type="submit"
                disabled={isLoading || !selectedDoctor || !selectedDate || !selectedTime || availError}
                className={`w-full py-5 rounded-2xl text-lg font-black flex items-center justify-center gap-3 transition-all active:scale-[0.97] ${
                  isLoading || !selectedDoctor || !selectedDate || !selectedTime || availError 
                    ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5' 
                    : 'bg-white text-[#1b253b] hover:bg-slate-50 shadow-xl shadow-black/20'
                }`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                {!isLoading && <ChevronRight size={20} />}
              </button>
              
              <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-8">
                MediQueue Secure Booking &bull; v1.0.4
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
