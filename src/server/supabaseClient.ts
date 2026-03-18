import { createClient } from '@supabase/supabase-js';
import { Agent, setGlobalDispatcher } from 'undici';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Increase undici connect timeout from default 10s to 30s
// Fixes ConnectTimeoutError when Supabase is freshly restored
setGlobalDispatcher(new Agent({ connect: { timeout: 30_000 } }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServerKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServerKey) {
    console.error('❌ Missing Supabase environment variables! Check your .env file at root.');
} else {
    // Only substring if it's a valid string
    console.log(`☁️ Supabase configured for: ${supabaseUrl.length > 15 ? supabaseUrl.substring(0, 15) : supabaseUrl}...`);
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is not set. Server is falling back to the anon key.');
    }
}

export const supabase = createClient(supabaseUrl, supabaseServerKey);
console.log('☁️ Supabase client initialized and ready');
