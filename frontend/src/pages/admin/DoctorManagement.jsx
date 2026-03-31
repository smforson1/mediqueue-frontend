import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit2, Save, X, Clock, User, AlertCircle, CheckCircle2, Loader2, UserCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const DoctorManagement = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // New Doctor Form State
  const [newDoc, setNewDoc] = useState({ name: '', specialty: '', experience: '' });
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/doctors');
      setDoctors(response.data);
      if (response.data.length > 0 && !selectedDoctor) {
        setSelectedDoctor(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newDoc.name || !newDoc.specialty) {
      setFormError('Name and Specialty are required.');
      return;
    }

    try {
      const res = await api.post('/api/doctors', newDoc);
      setDoctors([...doctors, res.data]);
      setSuccessMsg('Doctor added successfully!');
      setNewDoc({ name: '', specialty: '', experience: '' });
      setIsAdding(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setFormError('Failed to add doctor.');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/api/doctors/${id}`);
      setDoctors(doctors.filter(d => d.id !== id));
      if (selectedDoctor?.id === id) {
        setSelectedDoctor(doctors.find(d => d.id !== id) || null);
      }
      setSuccessMsg('Staff member removed.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete doctor.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Staff Management</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Maintain the directory of medical professionals.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto bg-[#1b253b] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus size={20} /> Onboard Staff
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={20} /> 
          <span className="font-bold text-sm">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        
        {/* Directory List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Directory ({doctors.length})</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center py-20 text-slate-400">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p className="font-medium text-sm">Loading...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
              <User size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 text-sm font-medium">No records found.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] lg:max-h-none overflow-y-auto pr-1">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    if (window.innerWidth < 1024) {
                      document.getElementById('profile-view')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedDoctor?.id === doctor.id 
                      ? 'border-[#1b253b] bg-white shadow-xl' 
                      : 'border-transparent bg-white hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-lg ${
                      selectedDoctor?.id === doctor.id ? 'bg-[#1b253b] text-white' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {doctor.name.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className={`font-black text-xs md:text-sm truncate ${selectedDoctor?.id === doctor.id ? 'text-slate-900' : 'text-slate-700'}`}>
                        {doctor.name.startsWith('Dr. ') ? doctor.name : `Dr. ${doctor.name}`}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{doctor.specialty}</div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(doctor.id); }}
                      className="p-2 text-slate-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Detail Card */}
        <div id="profile-view" className="lg:col-span-2">
          {selectedDoctor ? (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden lg:sticky lg:top-12">
              <div className="h-24 md:h-32 bg-[#1b253b] relative">
                <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-8 w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl shadow-lg border-4 border-white flex items-center justify-center text-2xl md:text-3xl font-black text-[#1b253b]">
                  {selectedDoctor.name.charAt(0)}
                </div>
              </div>
              
              <div className="pt-14 md:pt-16 px-6 md:px-10 pb-8 md:pb-10 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 mb-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">
                      {selectedDoctor.name.startsWith('Dr. ') ? selectedDoctor.name : `Dr. ${selectedDoctor.name}`}
                    </h2>
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 size={14} /> {selectedDoctor.specialty}
                    </div>
                  </div>
                  <Link 
                    to="/admin/schedules"
                    className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-[10px] md:text-xs font-black shadow-sm hover:bg-slate-100 transition-all"
                  >
                    <Calendar size={16} /> Schedule
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-10">
                  <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Experience</div>
                    <div className="text-lg md:text-xl font-black text-slate-800">{selectedDoctor.experience || '8+ Years'}</div>
                  </div>
                  <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100 text-center sm:text-left">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Availability</div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-lg md:text-xl font-black text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Online
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 italic">Standard Availability</h3>
                  {(selectedDoctor.availableDays && selectedDoctor.availableDays.length > 0) ? (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-600">
                      {selectedDoctor.availableDays.map(day => (
                        <span key={day} className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{day}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-slate-400 italic flex items-center justify-center sm:justify-start gap-2 uppercase tracking-tight">
                      <AlertCircle size={14} /> No schedule days set.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 md:p-32 text-center text-slate-400 flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <UserCircle2 size={48} className="opacity-20" />
              </div>
              <p className="text-lg md:text-xl font-black text-slate-900 mb-2">Detailed Profile</p>
              <p className="text-xs md:text-sm font-medium max-w-xs leading-relaxed">Select a professional from the directory.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#1b253b]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-[#1b253b] p-6 md:p-8 text-white relative">
              <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h3 className="text-xl md:text-2xl font-black mb-1">Onboard Staff</h3>
              <p className="text-slate-400 text-xs md:text-sm font-medium">Enter professional details.</p>
            </div>
            
            <form onSubmit={handleAddDoctor} className="p-6 md:p-8 space-y-5 md:space-y-6">
              {formError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold flex items-center gap-2">
                  <AlertCircle size={14} /> {formError}
                </div>
              )}
              
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. Sarah Johnson" 
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 md:py-4 px-4 pl-12 text-sm font-bold outline-none"
                  />
                  <User size={18} className="absolute left-4 top-2.5 md:top-3.5 text-slate-300" />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Specialty</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cardiologist" 
                  value={newDoc.specialty}
                  onChange={(e) => setNewDoc({...newDoc, specialty: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 md:py-4 px-4 text-sm font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Experience Level</label>
                <input 
                  type="text" 
                  placeholder="e.g. 12 Years" 
                  value={newDoc.experience}
                  onChange={(e) => setNewDoc({...newDoc, experience: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 md:py-4 px-4 text-sm font-bold outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#1b253b] text-white py-4 rounded-xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorManagement;
