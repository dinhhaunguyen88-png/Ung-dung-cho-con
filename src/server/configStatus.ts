import { getAuthConfigStatus } from './auth.js';
import { getSupabaseAccessMode, getSupabaseConfigError } from './supabaseRuntimeClient.js';

type SupabaseAccessMode = 'service_role' | 'anon' | 'missing';

export interface SystemStatus {
    summary: {
        ready: boolean;
        hasWarnings: boolean;
    };
    supabase: {
        configured: boolean;
        accessMode: SupabaseAccessMode;
        error: string | null;
        warning: string | null;
        missingVars: string[];
    };
    auth: {
        secure: boolean;
        mode: 'env' | 'fallback';
        warning: string | null;
        missingVars: string[];
    };
}

function hasEnvVar(name: string): boolean {
    const value = process.env[name];
    return typeof value === 'string' && value.trim().length > 0;
}

function getSupabaseMissingVars(accessMode: SupabaseAccessMode): string[] {
    const missingVars: string[] = [];

    if (!hasEnvVar('VITE_SUPABASE_URL')) {
        missingVars.push('VITE_SUPABASE_URL');
    }

    if (accessMode === 'missing') {
        missingVars.push('SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_ANON_KEY');
    } else if (accessMode === 'anon' && !hasEnvVar('SUPABASE_SERVICE_ROLE_KEY')) {
        missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
    }

    return missingVars;
}

export function getSystemStatus(): SystemStatus {
    const supabaseAccessMode = getSupabaseAccessMode();
    const supabaseError = getSupabaseConfigError();
    const authStatus = getAuthConfigStatus();

    const supabaseWarning = !supabaseError && supabaseAccessMode !== 'service_role'
        ? 'SUPABASE_SERVICE_ROLE_KEY is not set. Server is currently using the anon key.'
        : null;

    const systemStatus: SystemStatus = {
        summary: {
            ready: !supabaseError,
            hasWarnings: Boolean(supabaseWarning || authStatus.warning),
        },
        supabase: {
            configured: !supabaseError,
            accessMode: supabaseAccessMode,
            error: supabaseError,
            warning: supabaseWarning,
            missingVars: getSupabaseMissingVars(supabaseAccessMode),
        },
        auth: {
            secure: authStatus.secure,
            mode: authStatus.mode,
            warning: authStatus.warning,
            missingVars: authStatus.mode === 'fallback' ? ['AUTH_SECRET'] : [],
        },
    };

    return systemStatus;
}
