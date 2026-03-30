import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit2, Save, X, Clock, User, AlertCircle, CheckCircle2, Loader2, UserCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const DoctorManagement = ({ onLogout }) => {
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
    <div className="flex bg-[#f4f7fb] min-h-screen font-sans">
      
      {/* Sidebar - Consistent with Admin Panel */}
      <div className="w-64 bg-[#1b253b] text-slate-300 flex flex-col shadow-xl z-20 shrink-0 sticky top-0 h-screen">
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
      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-10 border-b border-slate-200 pb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Staff Management</h1>
              <p className="text-slate-500 font-medium tracking-tight">Maintain the directory of medical professionals and their specialties.</p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-[#1b253b] text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Plus size={20} /> Add New Doctor
            </button>
          </div>

          {successMsg && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
              <CheckCircle2 size={20} /> 
              <span className="font-bold text-sm">{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Sidebar List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Medical Staff ({doctors.length})</h2>
              
              {isLoading ? (
                <div className="flex flex-col items-center py-20 text-slate-400">
                  <Loader2 size={32} className="animate-spin mb-4" />
                  <p className="font-medium">Loading Directory...</p>
                </div>
              ) : doctors.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                  <User size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500 text-sm font-medium">No doctors registered.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {doctors.map((doctor) => (
                    <div 
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        selectedDoctor?.id === doctor.id 
                          ? 'border-[#1b253b] bg-white shadow-xl shadow-slate-100' 
                          : 'border-transparent bg-white hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                          selectedDoctor?.id === doctor.id ? 'bg-[#1b253b] text-white' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {doctor.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className={`font-black text-sm truncate ${selectedDoctor?.id === doctor.id ? 'text-slate-900' : 'text-slate-700'}`}>
                            {doctor.name.startsWith('Dr. ') ? doctor.name : `Dr. ${doctor.name}`}
                          </div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter truncate">{doctor.specialty}</div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(doctor.id); }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
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
            <div className="lg:col-span-2">
              {selectedDoctor ? (
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden sticky top-12">
                  <div className="h-32 bg-[#1b253b] relative">
                    <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-3xl shadow-lg border-4 border-white flex items-center justify-center text-3xl font-black text-[#1b253b]">
                      {selectedDoctor.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="pt-16 px-10 pb-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-1">
                          {selectedDoctor.name.startsWith('Dr. ') ? selectedDoctor.name : `Dr. ${selectedDoctor.name}`}
                        </h2>
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 size={14} /> {selectedDoctor.specialty}
                        </div>
                      </div>
                      <Link 
                        to="/admin/schedules"
                        className="bg-slate-50 border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black shadow-sm hover:bg-slate-100 transition-all"
                      >
                        <Calendar size={16} /> Edit Schedule
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-10">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Professional Rank</div>
                        <div className="text-xl font-black text-slate-800">{selectedDoctor.experience || '8+ Years'} Experience</div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Current Status</div>
                        <div className="flex items-center gap-2 text-xl font-black text-green-600">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                          Available
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 italic">Standard Availability</h3>
                      {(selectedDoctor.availableDays && selectedDoctor.availableDays.length > 0) ? (
                        <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wider text-slate-600">
                          {selectedDoctor.availableDays.map(day => (
                            <span key={day} className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">{day}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-slate-400 italic flex items-center gap-2 uppercase tracking-tight">
                          <AlertCircle size={14} /> No schedule days defined yet. Click "Edit Schedule" to set them up.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-32 text-center text-slate-400 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <UserCircle2 size={48} className="opacity-20" />
                  </div>
                  <p className="text-xl font-black text-slate-900 mb-2">Detailed Profile</p>
                  <p className="text-sm font-medium max-w-xs leading-relaxed">Select a medical professional from the directory to view their full credentials and managed availability.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal Overlay */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#1b253b]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-[#1b253b] p-8 text-white relative">
              <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-black mb-1">Onboard Staff</h3>
              <p className="text-slate-400 text-sm font-medium">Enter details for the new medical professional.</p>
            </div>
            
            <form onSubmit={handleAddDoctor} className="p-8 space-y-6">
              {formError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} /> {formError}
                </div>
              )}
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. Sarah Johnson" 
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                  <User size={18} className="absolute left-4 top-3.5 text-slate-300" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Specialty</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cardiologist" 
                  value={newDoc.specialty}
                  onChange={(e) => setNewDoc({...newDoc, specialty: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Experience Level</label>
                <input 
                  type="text" 
                  placeholder="e.g. 12 Years" 
                  value={newDoc.experience}
                  onChange={(e) => setNewDoc({...newDoc, experience: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#1b253b] text-white py-4 rounded-xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] mt-4"
              >
                CONFIRM ONBOARDING
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Simplified icon component if lucide-react doesn't have it by this name 
const LayoutDashboardIcon = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
);

export default DoctorManagement;
