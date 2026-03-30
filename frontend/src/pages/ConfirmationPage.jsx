import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, User, Hash, ArrowRight } from 'lucide-react';

const ConfirmationPage = () => {
  const location = useLocation();
  const { appointment, doctor } = location.state || {};

  if (!appointment) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="bg-white rounded-medical shadow-medical p-10 border border-slate-100">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-secondary-green rounded-full mb-8">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Appointment Confirmed!</h1>
        <p className="text-slate-600 mb-10">
          Your appointment has been successfully booked. Please arrive 10 minutes early.
        </p>

        <div className="bg-medical-blue bg-opacity-40 rounded-medical p-8 mb-10 text-left space-y-4 border border-blue-100">
          <div className="flex items-center justify-between border-b border-blue-200 pb-3">
             <div className="flex items-center gap-3 text-slate-700 font-semibold">
               <User className="text-primary" size={20} /> Doctor
             </div>
             <span className="text-slate-900 font-bold">{doctor?.name}</span>
          </div>

          <div className="flex items-center justify-between border-b border-blue-200 pb-3">
             <div className="flex items-center gap-3 text-slate-700 font-semibold">
               <Calendar className="text-primary" size={20} /> Date
             </div>
             <span className="text-slate-900 font-bold">{appointment.date}</span>
          </div>

          <div className="flex items-center justify-between border-b border-blue-200 pb-3">
             <div className="flex items-center gap-3 text-slate-700 font-semibold">
               <Clock className="text-primary" size={20} /> Time
             </div>
             <span className="text-slate-900 font-bold">{appointment.time}</span>
          </div>

          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3 text-slate-700 font-semibold">
               <Hash className="text-primary" size={20} /> Queue Position
             </div>
             <div className="flex items-center gap-1">
               <span className="text-2xl font-black text-primary">#{appointment.queuePosition}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn-primary px-8">
            Go to Dashboard
          </Link>
          <Link to="/queue" className="bg-white border-2 border-primary text-primary hover:bg-blue-50 px-8 py-2 rounded-medical font-medium transition-all inline-flex items-center">
            View Live Queue
          </Link>
        </div>
      </div>

      <div className="mt-8 text-slate-500 text-sm flex items-center justify-center gap-2">
        Need to change? <Link to="/dashboard" className="text-primary hover:underline font-bold">Reschedule or Cancel</Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
