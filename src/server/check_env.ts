import { getSystemStatus } from './configStatus.js';

function printSection(title: string, lines: string[]) {
    console.log(title);
    for (const line of lines) {
        console.log(`- ${line}`);
    }
}

const status = getSystemStatus();
const missingVars = Array.from(new Set([
    ...status.supabase.missingVars,
    ...status.auth.missingVars,
]));

printSection('Environment status', [
    `Ready: ${status.summary.ready ? 'yes' : 'no'}`,
    `Warnings: ${status.summary.hasWarnings ? 'yes' : 'no'}`,
    `Supabase access mode: ${status.supabase.accessMode}`,
]);

if (missingVars.length > 0) {
    printSection('Missing variables', missingVars);
} else {
    console.log('Missing variables');
    console.log('- none');
}

if (status.supabase.error) {
    console.error(`Supabase error: ${status.supabase.error}`);
}

if (status.supabase.warning) {
    console.warn(`Supabase warning: ${status.supabase.warning}`);
}

if (status.auth.warning) {
    console.warn(`Auth warning: ${status.auth.warning}`);
}

if (missingVars.length > 0) {
    console.log('Copy the missing keys from .env.example into your local .env or Vercel Environment Variables.');
}

process.exitCode = status.summary.ready ? 0 : 1;
