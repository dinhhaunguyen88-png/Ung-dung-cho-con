import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables! Check your .env file at root.');
} else {
    // Only substring if it's a valid string
    console.log(`☁️ Supabase configured for: ${supabaseUrl.length > 15 ? supabaseUrl.substring(0, 15) : supabaseUrl}...`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('☁️ Supabase client initialized and ready');
