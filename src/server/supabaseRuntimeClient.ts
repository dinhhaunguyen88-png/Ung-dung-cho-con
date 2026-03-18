import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Agent, setGlobalDispatcher } from 'undici';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

setGlobalDispatcher(new Agent({ connect: { timeout: 30_000 } }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServerKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseAccessMode = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? 'service_role'
    : process.env.VITE_SUPABASE_ANON_KEY
        ? 'anon'
        : 'missing';

let supabaseConfigError: string | null = null;

if (!supabaseUrl || !supabaseServerKey) {
    supabaseConfigError = 'Supabase server configuration is missing. Set VITE_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY in Vercel Environment Variables.';
    console.error(`Supabase config error: ${supabaseConfigError}`);
} else {
    console.log(`Supabase configured for: ${supabaseUrl.length > 15 ? supabaseUrl.substring(0, 15) : supabaseUrl}...`);
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Server is falling back to the anon key.');
    }
}

type SupabaseClientInstance = SupabaseClient<any, 'public', any>;

let supabaseClient: SupabaseClientInstance | null = null;

if (!supabaseConfigError) {
    try {
        supabaseClient = createClient(supabaseUrl, supabaseServerKey);
        console.log('Supabase client initialized and ready');
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown Supabase initialization error';
        supabaseConfigError = `Failed to initialize Supabase client: ${message}`;
        console.error(`Supabase config error: ${supabaseConfigError}`);
    }
}

const supabaseUnavailableProxy = new Proxy({} as SupabaseClientInstance, {
    get() {
        throw new Error(supabaseConfigError || 'Supabase client is unavailable.');
    },
});

export const supabase = supabaseClient || supabaseUnavailableProxy;

export function getSupabaseConfigError() {
    return supabaseConfigError;
}

export function getSupabaseAccessMode() {
    return supabaseAccessMode;
}
