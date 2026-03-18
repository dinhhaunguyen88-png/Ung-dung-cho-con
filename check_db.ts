
import { supabase } from './src/server/supabaseClient.js';

async function checkDb() {
    const { data, error } = await supabase.from('questions').select('subject');
    if (error) {
        console.error('❌ DB Check Error:', error.message);
        return;
    }
    
    const counts = data.reduce((acc, q) => {
        acc[q.subject] = (acc[q.subject] || 0) + 1;
        return acc;
    }, {});
    
    console.log('📊 Current question counts by subject:', counts);
}

checkDb();
