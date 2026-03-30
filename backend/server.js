const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to map snake_case to camelCase for frontend
const mapToCamel = (obj) => {
  if (!obj) return null;
  const newObj = {};
  for (let key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj;
};

// --- API ROUTES ---

// 1. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json(mapToCamel({ ...userWithoutPassword, token: `mock-jwt-${user.role}` }));
  } else {
    res.status(401).json({ message: 'Invalid credentials or user not found' });
  }
});

// 1b. Auth: Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  const { data: user, error } = await supabase
    .from('users')
    .insert([{ name, username: email, phone, password, role: 'patient' }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return res.status(400).json({ message: 'Email already registered' });
    return res.status(500).json({ error: error.message });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(mapToCamel({ ...userWithoutPassword, token: 'mock-jwt-patient' }));
});

// 1c. Auth: Forgot Password (send reset link)
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  // Check user exists
  const { data: user } = await supabase
    .from('users')
    .select('id, name, username')
    .eq('username', email)
    .single();

  // Always respond OK to prevent email enumeration
  if (!user) return res.json({ message: 'If that email is registered, a reset link was sent.' });

  // Generate a simple token and store it
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour

  await supabase
    .from('users')
    .update({ reset_token: token, reset_token_expires: expiresAt })
    .eq('id', user.id);

  // In real app: send email with link → /reset-password?token=<token>
  // For demo, log to console so developer can test
  console.log(`[RESET] Link for ${email}: http://localhost:5173/reset-password?token=${token}`);

  res.json({ message: 'If that email is registered, a reset link was sent.' });
});

// 1d. Auth: Reset Password (set new password)
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required.' });

  const { data: user } = await supabase
    .from('users')
    .select('id, reset_token_expires')
    .eq('reset_token', token)
    .single();

  if (!user) return res.status(400).json({ message: 'Invalid or expired reset link.' });
  if (new Date(user.reset_token_expires) < new Date()) {
    return res.status(400).json({ message: 'Reset link has expired. Please request a new one.' });
  }

  await supabase
    .from('users')
    .update({ password: newPassword, reset_token: null, reset_token_expires: null })
    .eq('id', user.id);

  res.json({ message: 'Password updated successfully.' });
});

// 2. Doctors: List all
app.get('/api/doctors', async (req, res) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) return res.status(500).json({ error: error.message });
  res.json((data || []).map(mapToCamel));
});

// 2b. Doctors: Update Schedule
app.patch('/api/doctors/:id', async (req, res) => {
  const { available_days } = req.body;
  const { data, error } = await supabase
    .from('doctors')
    .update({ available_days })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(mapToCamel(data));
});

// 2c. Doctors: Create New
app.post('/api/doctors', async (req, res) => {
  const { name, specialty, experience } = req.body;
  if (!name || !specialty) return res.status(400).json({ message: 'Name and specialty are required.' });

  const { data, error } = await supabase
    .from('doctors')
    .insert([{ name, specialty, experience, available_days: [] }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(mapToCamel(data));
});

// 2d. Doctors: Delete Staff
app.delete('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  
  // First, check if there are appointments for this doctor
  const { data: hasAppts } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', id)
    .limit(1);

  if (hasAppts && hasAppts.length > 0) {
    return res.status(400).json({ message: 'Cannot delete doctor with active appointments.' });
  }

  const { error } = await supabase
    .from('doctors')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Staff member removed successfully.' });
});

// 2e. Doctors: Check Booked Slots
app.get('/api/appointments/booked', async (req, res) => {
  const { doctorId, date } = req.query;
  if (!doctorId || !date) return res.status(400).json({ message: 'doctorId and date are required.' });

  const { data, error } = await supabase
    .from('appointments')
    .select('time')
    .eq('doctor_id', doctorId)
    .eq('date', date)
    .neq('status', 'cancelled'); // Don't count cancelled appointments

  if (error) return res.status(500).json({ error: error.message });
  
  const bookedTimes = data.map(appt => appt.time);
  res.json({ bookedTimes });
});

// 3. Appointments: List with filters
app.get('/api/appointments', async (req, res) => {
  let query = supabase.from('appointments').select('*');
  
  if (req.query.patientId) query = query.eq('patient_id', req.query.patientId);
  if (req.query.doctorId) query = query.eq('doctor_id', req.query.doctorId);
  if (req.query.date) query = query.eq('date', req.query.date);
  if (req.query.status) query = query.eq('status', req.query.status);
  
  // order by time by default
  query = query.order('time', { ascending: true });
  
  const { data: appts, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  // Manual join - fetch users and doctors for enriched names
  const { data: users, error: userErr } = await supabase.from('users').select('id, name, phone, username');
  const { data: doctors, error: docErr } = await supabase.from('doctors').select('id, name, specialty');
  
  if (userErr || docErr) console.error('Enrichment fetch error:', userErr || docErr);

  const enrichedAppts = (appts || []).map(appt => {
    // Robust UUID matching
    const patientRel = (users || []).find(u => String(u.id).toLowerCase() === String(appt.patient_id).toLowerCase());
    const doctorRel = (doctors || []).find(d => String(d.id).toLowerCase() === String(appt.doctor_id).toLowerCase());
    
    // Improved name resolution chain
    let patientName = 'Unknown Patient';
    if (patientRel) {
      if (patientRel.name && patientRel.name.trim().length > 0) {
        patientName = patientRel.name.trim();
      } else if (patientRel.username && patientRel.username.trim().length > 0) {
        // If username is an email (from registration), split it
        const raw = patientRel.username.trim();
        patientName = raw.includes('@') ? raw.split('@')[0] : raw;
      }
    }
    
    return {
      ...appt,
      patient_name: patientName,
      patient_email: patientRel?.username, // username column holds the email
      patient_phone: patientRel?.phone,
      doctor_name: doctorRel ? doctorRel.name : 'Unknown Doctor',
      doctor_specialty: doctorRel?.specialty
    };
  });

  res.json(enrichedAppts.map(mapToCamel));
});

// 4. Smart Booking
app.post('/api/appointments', async (req, res) => {
  const { doctorId, date, time, patientId, reason } = req.body;

  // Conflict Prevention
  const { data: conflict } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', doctorId)
    .eq('date', date)
    .eq('time', time)
    .eq('status', 'confirmed')
    .maybeSingle();

  if (conflict) {
    return res.status(400).json({ message: 'Doctor is already booked for this slot.' });
  }

  // Auto Queue: Count existing confirmed appointments for this doctor/date
  const { count } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('doctor_id', doctorId)
    .eq('date', date)
    .eq('status', 'confirmed');

  const newAppointment = {
    patient_id: patientId,
    doctor_id: doctorId,
    date,
    time,
    reason,
    status: 'confirmed',
    queue_position: (count || 0) + 1
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert([newAppointment])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Auto Notification
  const { data: doctor } = await supabase.from('doctors').select('name').eq('id', doctorId).single();
  
  await supabase.from('notifications').insert([{
    user_id: patientId,
    message: `Appointment confirmed with ${doctor?.name || 'Doctor'} on ${date} at ${time}. Queue #${data.queue_position}`,
    read: false
  }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(mapToCamel(data));
});

// 5. Update Appointment (Cancel/Confirm)
app.patch('/api/appointments/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 5b. Call Patient — marks them as 'in_progress' and sends a live notification
app.post('/api/appointments/:id/call', async (req, res) => {
  const { id } = req.params;

  // Get the appointment to find patient + doctor info
  const { data: appt, error: apptErr } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (apptErr || !appt) return res.status(404).json({ message: 'Appointment not found.' });

  // Update appointment status to in_progress
  await supabase
    .from('appointments')
    .update({ status: 'in_progress' })
    .eq('id', id);

  // Get doctor name
  const { data: doctor } = await supabase
    .from('doctors')
    .select('name')
    .eq('id', appt.doctor_id)
    .single();

  // Insert a "called" notification for the patient
  const { error: notifErr } = await supabase
    .from('notifications')
    .insert([{
      user_id: appt.patient_id,
      message: `🔔 It's your turn! Please proceed to see ${doctor?.name || 'your doctor'} now.`,
      type: 'called',
      read: false
    }]);

  if (notifErr) return res.status(500).json({ error: notifErr.message });
  res.json({ success: true, message: 'Patient called successfully.' });
});

// 5c. Check if patient has been called (for live polling)
app.get('/api/notifications/called', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'called')
    .eq('read', false)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ called: data && data.length > 0, notification: data?.[0] || null });
});

// 5d. Mark notification as read (dismiss)
app.patch('/api/notifications/:id/read', async (req, res) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// 5e. Complete/Terminate appointment — removes it from the active queue
app.post('/api/appointments/:id/complete', async (req, res) => {
  const { id } = req.params;

  const { data: appt, error: apptErr } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (apptErr || !appt) return res.status(404).json({ message: 'Appointment not found.' });

  // Mark as completed
  await supabase
    .from('appointments')
    .update({ status: 'completed' })
    .eq('id', id);

  // Send a completion notification to the patient
  const { data: doctor } = await supabase
    .from('doctors')
    .select('name')
    .eq('id', appt.doctor_id)
    .single();

  await supabase.from('notifications').insert([{
    user_id: appt.patient_id,
    message: `✅ Your appointment with ${doctor?.name || 'your doctor'} has been completed. Thank you for visiting!`,
    type: 'general',
    read: false
  }]);

  res.json({ success: true, message: 'Appointment marked as completed.' });
});

// 6. Stats: Aggregates
app.get('/api/stats', async (req, res) => {
  const { data: appts, error } = await supabase.from('appointments').select('status');
  
  if (error) return res.status(500).json({ error: error.message });
  
  res.json({
    totalBookings: appts.length,
    confirmed: appts.filter(a => a.status === 'confirmed').length,
    pending: appts.filter(a => a.status === 'pending').length,
    cancelled: appts.filter(a => a.status === 'cancelled').length,
    completed: appts.filter(a => a.status === 'completed').length,
  });
});

// 7. Notifications: User specific
app.get('/api/notifications', async (req, res) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', req.query.userId)
    .order('created_at', { ascending: false });
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 8. Users: Patients List
app.get('/api/users/patients', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone, created_at')
    .eq('role', 'patient');
    
  if (error) return res.status(500).json({ error: error.message });
  res.json((data || []).map(mapToCamel));
});

app.listen(port, () => {
  console.log(`MediQueue Backend (Supabase) running on http://localhost:${port}`);
});
