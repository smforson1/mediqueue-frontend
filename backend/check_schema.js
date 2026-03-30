const supabase = require('./supabaseClient');

async function check() {
  const { data: appts } = await supabase.from('appointments').select('*').limit(5);
  console.log('APPOINTMENTS:', JSON.stringify(appts, null, 2));
  
  const { data: users } = await supabase.from('users').select('id, name, username').limit(10);
  console.log('USERS:', JSON.stringify(users, null, 2));
  process.exit(0);
}
check();
