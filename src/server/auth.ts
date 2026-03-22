import { createHmac, timingSafeEqual } from 'node:crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

export interface TeacherSession {
    userId: string;
    email: string;
    role: 'teacher';
    exp: number;
}

export interface AuthConfigStatus {
    secure: boolean;
    mode: 'env' | 'fallback';
    warning: string | null;
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
const authSecret = process.env.AUTH_SECRET || 'dev-only-auth-secret-change-me';
const authSecretMode: AuthConfigStatus['mode'] = process.env.AUTH_SECRET ? 'env' : 'fallback';

if (!process.env.AUTH_SECRET) {
    console.warn('⚠️ AUTH_SECRET is not set. Using an insecure development fallback secret.');
}

export function getAuthConfigStatus(): AuthConfigStatus {
    return {
        secure: authSecretMode === 'env',
        mode: authSecretMode,
        warning: authSecretMode === 'fallback'
            ? 'AUTH_SECRET is not set. Server is using an insecure development fallback secret.'
            : null,
    };
}

function sign(encodedPayload: string): string {
    return createHmac('sha256', authSecret).update(encodedPayload).digest('base64url');
}

export function createTeacherSessionToken(input: { userId: string; email: string }): string {
    const payload: TeacherSession = {
        userId: input.userId,
        email: input.email,
        role: 'teacher',
        exp: Date.now() + SESSION_TTL_MS,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = sign(encodedPayload);
    return `${encodedPayload}.${signature}`;
}

export function verifyTeacherSessionToken(token: string): TeacherSession | null {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expectedSignature = sign(encodedPayload);
    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (signatureBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as TeacherSession;
        if (payload.role !== 'teacher' || !payload.userId || !payload.email) return null;
        if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}
