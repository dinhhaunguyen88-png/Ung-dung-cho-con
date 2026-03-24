import { supabase } from './supabaseClient.js';

async function checkCounts() {
    const subjects = ['math', 'vietnamese', 'science', 'english'];
    console.log('📊 Database Verification:');
    
    for (const s of subjects) {
        const { count, error } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subject', s);
        
        if (error) {
            console.error(`❌ Error fetching count for ${s}:`, error.message);
        } else {
            console.log(`- ${s.charAt(0).toUpperCase() + s.slice(1)}: ${count} questions`);
        }
    }
}

checkCounts().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
