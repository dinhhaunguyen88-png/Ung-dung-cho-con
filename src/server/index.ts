import express, { type Request, type Response } from 'express';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createTeacherSessionToken, type TeacherSession, verifyTeacherSessionToken } from './auth.js';
import { getSupabaseAccessMode, getSupabaseConfigError, supabase } from './supabaseRuntimeClient.js';

const scryptAsync = promisify(scrypt);

const app = express();
app.use(express.json());

// Simple in-memory cache
const questionCache: Record<string, { data: any[], timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Helper for retrying Supabase calls
// We use 'any' for the result to handle Supabase's Postgrest response objects easily
async function withRetry<T = any>(fn: () => Promise<T> | any, retries = 3, delay = 500): Promise<T> {
    try {
        const result = await fn();
        return result as T;
    } catch (err: any) {
        if (retries <= 0) {
            console.error('❌ All retries failed:', err.message);
            throw err;
        }
        console.warn(`⚠️ Supabase call failed: ${err.message}. Retrying in ${delay}ms... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay + 500); // Linear backoff
    }
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
        return (error as { message: string }).message;
    }
    return 'Unknown server error';
}

function buildSupabaseWriteError(action: string, error: unknown): string {
    const configError = getSupabaseConfigError();
    if (configError) return configError;

    const rawMessage = getErrorMessage(error);
    const normalizedMessage = rawMessage.toLowerCase();

    if (normalizedMessage.includes('row-level security') || normalizedMessage.includes('permission denied')) {
        if (getSupabaseAccessMode() !== 'service_role') {
            return `Supabase denied ${action}. Add SUPABASE_SERVICE_ROLE_KEY in Vercel or create INSERT/UPDATE policies for the affected tables.`;
        }
        return `Supabase denied ${action}. Check the RLS policies for the affected tables.`;
    }

    if (normalizedMessage.includes('relation') && normalizedMessage.includes('does not exist')) {
        return `Supabase schema is incomplete for ${action}. Run the SQL files in migrations/ on the deployed Supabase project.`;
    }

    if (normalizedMessage.includes('column') && normalizedMessage.includes('does not exist')) {
        return `Supabase is missing a required column for ${action}. Run the latest migrations on the deployed Supabase project.`;
    }

    return rawMessage;
}

function requireTeacherSession(req: Request, res: Response): TeacherSession | null {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Teacher authentication is required' });
        return null;
    }

    const session = verifyTeacherSessionToken(authHeader.slice('Bearer '.length).trim());
    if (!session) {
        res.status(401).json({ error: 'Teacher session is invalid or expired' });
        return null;
    }

    return session;
}

async function requireOwnedClass(
    classId: string,
    teacherId: string,
    res: Response,
): Promise<{ id: string; name: string; teacher_id: string } | null> {
    const { data: classObj, error } = await withRetry(() => supabase
        .from('classes')
        .select('id, name, teacher_id')
        .eq('id', classId)
        .maybeSingle()
    );

    if (error) {
        res.status(500).json({ error: error.message });
        return null;
    }

    if (!classObj) {
        res.status(404).json({ error: 'Class not found' });
        return null;
    }

    if (classObj.teacher_id !== teacherId) {
        res.status(403).json({ error: 'You do not have access to this class' });
        return null;
    }

    return classObj;
}

function getProgressCorrectCount(progress: any): number {
    return Number(progress?.correct ?? progress?.correct_answers ?? 0);
}

function getProgressTotalCount(progress: any): number {
    return Number(progress?.total ?? progress?.total_questions ?? 0);
}

function getProgressCompletedAt(progress: any): string | null {
    return progress?.completed_at ?? progress?.created_at ?? null;
}

function normalizeProgressRecord(progress: any) {
    return {
        ...progress,
        correct: getProgressCorrectCount(progress),
        total: getProgressTotalCount(progress),
        completed_at: getProgressCompletedAt(progress),
    };
}

// ─── Users ───────────────────────────────────────────
app.post('/api/users', async (req, res) => {
    const { name, avatar, avatarColor } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const configError = getSupabaseConfigError();
    if (configError) {
        return res.status(500).json({ error: configError });
    }

    console.log('👤 Creating user on Supabase:', name);

    try {
        const { data: user, error: userError } = await withRetry(() => supabase
            .from('users')
            .insert([{ name, avatar: avatar || 'dragon', avatar_color: avatarColor || '#30e86e' }])
            .select()
            .single()
        );

        if (userError) {
            return res.status(500).json({
                error: buildSupabaseWriteError('student profile creation', userError),
                details: userError.message,
            });
        }

        // Also create a pet for the user
        const { error: petError } = await withRetry(() => supabase
            .from('pets')
            .insert([{
                user_id: user.id,
                type: avatar || 'dragon',
                name: 'Sparky',
                color: avatarColor || '#30e86e'
            }])
        );

        if (petError) console.error('❌ Error creating pet:', petError.message);

        if (petError) {
            try {
                await withRetry(() => supabase
                    .from('users')
                    .delete()
                    .eq('id', user.id)
                );
            } catch (cleanupError) {
                console.error('Failed to rollback user after pet creation error:', getErrorMessage(cleanupError));
            }

            return res.status(500).json({
                error: buildSupabaseWriteError('starter pet creation', petError),
                details: petError.message,
            });
        }

        res.json(user);
    } catch (err: any) {
        const details = getErrorMessage(err);
        console.error('❌ User creation error:', err.message);
        res.status(500).json({
            error: buildSupabaseWriteError('student profile creation', err),
            details,
        });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const { data: user, error } = await withRetry(() => supabase
            .from('users')
            .select('*')
            .eq('id', req.params.id)
            .single()
        );

        if (error) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Leaderboard ─────────────────────────────────────
app.get('/api/leaderboard', async (_req, res) => {
    try {
        const { data, error } = await withRetry(() => supabase
            .from('users')
            .select(`
                id, name, avatar, avatar_color, xp, level, stars,
                pets ( type, name, color )
            `)
            .order('xp', { ascending: false })
            .limit(50)
        );

        if (error) return res.status(500).json({ error: error.message });

        // Flatten result to match existing frontend expectations if needed
        const formatted = data.map((u: any) => ({
            ...u,
            pet_type: u.pets?.[0]?.type,
            pet_name: u.pets?.[0]?.name,
            pet_color: u.pets?.[0]?.color
        }));

        res.json(formatted);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── XP & Progress ───────────────────────────────────
app.post('/api/progress', async (req, res) => {
    const { userId, subject, topic, correct, total } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    try {
        const safeCorrect = Math.max(0, Number(correct) || 0);
        const safeTotal = Math.max(safeCorrect, Number(total) || 0);
        const completedAt = new Date().toISOString();

        // Save progress
        const { error: progressError } = await withRetry(() => supabase
            .from('progress')
            .insert([{
                user_id: userId,
                subject: subject || 'math',
                topic: topic || '',
                correct: safeCorrect,
                total: safeTotal,
                completed_at: completedAt
            }])
        );

        if (progressError) console.error('❌ Progress save error:', progressError.message);

        // Award XP (10 per correct answer)
        const xpGain = safeCorrect * 10;
        let user = null;

        if (xpGain > 0) {
            // Get current XP
            const { data: currentUser } = await withRetry(() => supabase
                .from('users')
                .select('xp, stars')
                .eq('id', userId)
                .single()
            );

            if (currentUser) {
                const newXp = (currentUser.xp || 0) + xpGain;
                const starsGain = safeCorrect * 10;
                const newStars = (currentUser.stars || 0) + starsGain;
                const newLevel = Math.floor(newXp / 200) + 1;

                const { data: updatedUser } = await withRetry(() => supabase
                    .from('users')
                    .update({ xp: newXp, level: newLevel, stars: newStars })
                    .eq('id', userId)
                    .select()
                    .single()
                );

                user = updatedUser;

                // Also update pet
                await withRetry(() => supabase
                    .from('pets')
                    .update({ xp: newXp, level: newLevel })
                    .eq('user_id', userId)
                );
            }
        }

        res.json({ xpGain, user });
    } catch (err: any) {
        console.error('❌ Progress save fatal error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/progress/:userId', async (req, res) => {
    try {
        const { data, error } = await withRetry(() => supabase
            .from('progress')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('completed_at', { ascending: false })
            .limit(20)
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json((data || []).map(normalizeProgressRecord));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Pet Config ──────────────────────────────────────
app.get('/api/pets/:userId', async (req, res) => {
    try {
        const { data, error } = await withRetry(() => supabase
            .from('pets')
            .select('*')
            .eq('user_id', req.params.userId)
            .single()
        );

        if (error) return res.status(404).json({ error: 'Pet not found' });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pets/:userId', async (req, res) => {
    const { type, name, color, accessories } = req.body;

    try {
        const { data, error } = await withRetry(() => supabase
            .from('pets')
            .update({
                type,
                name,
                color,
                accessories
            })
            .eq('user_id', req.params.userId)
            .select()
            .single()
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Questions ──────────────────────────────────────
app.get('/api/questions', async (req, res) => {
    const { subject = 'math', limit = 15, topic } = req.query;
    const subjectStr = String(subject);
    const topicStr = typeof topic === 'string' ? topic.trim() : '';
    const cacheKey = `${subjectStr}::${topicStr || '__all__'}`;
    console.log(`🔍 Fetching questions for subject: ${subjectStr}${topicStr ? ` topic: ${topicStr}` : ''}`);

    try {
        // Check cache first
        const now = Date.now();
        if (questionCache[cacheKey] && (now - questionCache[cacheKey].timestamp < CACHE_TTL)) {
            console.log(`⚡ Serving ${cacheKey} from cache`);
            const cached = questionCache[cacheKey].data;
            const shuffled = [...cached].sort(() => 0.5 - Math.random()).slice(0, Number(limit));
            return res.json(shuffled);
        }

        let query = supabase
            .from('questions')
            .select('*')
            .eq('subject', subjectStr)
            .limit(1000);

        if (topicStr) {
            query = query.ilike('topic', topicStr);
        }

        const { data, error } = await withRetry(() => query);

        if (error) {
            console.error('❌ Questions fetch error:', error.message);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            console.warn(`⚠️ No questions found for subject: ${subjectStr}${topicStr ? ` topic: ${topicStr}` : ''}`);
            return res.json([]);
        }

        console.log(`✅ Found ${data.length} questions for ${subjectStr}${topicStr ? ` / ${topicStr}` : ''}`);

        // Normalize question format for frontend compatibility
        const normalized = data.map((q: any) => {
            let content = q.content; // Try nested first

            // If it's the old flat format (content_vi/content_en)
            if (!content && (q.content_vi || q.content_en)) {
                content = {
                    vi: { questionText: q.content_vi || '', questionReadText: q.content_vi || '' },
                    en: { questionText: q.content_en || q.content_vi || '', questionReadText: q.content_en || q.content_vi || '' },
                };
            }

            // If it's just a string (legacy math format)
            if (typeof content === 'string') {
                const normalizeForReading = (text: string) => {
                    if (!text) return '';
                    return text
                        .replace(/:/g, ' chia ')
                        .replace(/x/g, ' nhân ')
                        .replace(/\*/g, ' nhân ')
                        .replace(/\+/g, ' cộng ')
                        .replace(/-/g, ' trừ ')
                        .replace(/=/g, ' bằng ')
                        .replace(/\?/g, ' mấy ')
                        .trim();
                };

                const readTextVi = normalizeForReading(content);
                const readTextEn = content
                    .replace(/:/g, ' divide ')
                    .replace(/x/g, ' multiple ')
                    .replace(/\*/g, ' multiple ')
                    .replace(/\+/g, ' plus ')
                    .replace(/-/g, ' minus ')
                    .replace(/=/g, ' equals ')
                    .replace(/\?/g, ' how much ')
                    .trim();

                content = {
                    vi: { questionText: content, questionReadText: readTextVi },
                    en: { questionText: content, questionReadText: readTextEn },
                };
            }

            // Final fallback
            if (!content || typeof content !== 'object') {
                content = {
                    vi: { questionText: '', questionReadText: '' },
                    en: { questionText: '', questionReadText: '' },
                };
            }

            // Defensively handle choices array to prevent iteration TypeError
            const rawChoices = Array.isArray(q.choices) ? q.choices : [];
            const choices = rawChoices.map((c: any) => ({
                id: c?.id ?? '',
                label: c?.label ?? '',
                value: c?.value ?? c?.text ?? '',
            }));

            // Normalize correct_answer_id to string for consistency
            const correctAnswerId = String(q.correct_answer_id || '');

            return { ...q, content, choices, correct_answer_id: correctAnswerId };
        });

        // Save to cache
        questionCache[cacheKey] = { data: normalized, timestamp: now };

        const shuffled = [...normalized].sort(() => 0.5 - Math.random()).slice(0, Number(limit));
        res.json(shuffled);
    } catch (err: any) {
        console.error('❌ Questions fatal error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ─── Teacher Auth ───────────────────────────────────
app.post('/api/auth/teacher/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // Check if email already exists
        const { data: existing } = await withRetry(() => supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle()
        );

        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password with scrypt
        const salt = randomBytes(16).toString('hex');
        const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
        const password_hash = `${salt}:${derivedKey.toString('hex')}`;

        // Create teacher user
        const { data: user, error: userError } = await withRetry(() => supabase
            .from('users')
            .insert([{
                name,
                email,
                password_hash,
                role: 'teacher',
                avatar: 'dragon',
                avatar_color: '#30a5e8',
            }])
            .select('id, name, email, role, avatar, avatar_color, xp, level, stars')
            .single()
        );

        if (userError) return res.status(500).json({ error: userError.message });

        // Create default pet
        await withRetry(() => supabase
            .from('pets')
            .insert([{
                user_id: user.id,
                type: 'dragon',
                name: 'Sparky',
                color: '#30a5e8',
            }])
        );

        const token = createTeacherSessionToken({ userId: user.id, email: user.email });

        console.log(`👩‍🏫 Teacher registered: ${email}`);
        res.json({ user, token });
    } catch (err: any) {
        console.error('❌ Teacher register error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/teacher/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find teacher by email
        const { data: user, error } = await withRetry(() => supabase
            .from('users')
            .select('id, name, email, role, avatar, avatar_color, xp, level, stars, password_hash')
            .eq('email', email)
            .eq('role', 'teacher')
            .maybeSingle()
        );

        if (error || !user || !user.password_hash) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const [salt, storedHash] = user.password_hash.split(':');
        const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
        const storedBuffer = Buffer.from(storedHash, 'hex');

        if (!timingSafeEqual(derivedKey, storedBuffer)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = createTeacherSessionToken({ userId: user.id, email: user.email });

        // Return user without password_hash
        const { password_hash: _, ...safeUser } = user;
        console.log(`👩‍🏫 Teacher logged in: ${email}`);
        res.json({ user: safeUser, token });
    } catch (err: any) {
        console.error('❌ Teacher login error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ─── Classes ────────────────────────────────────────

const generateJoinCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars 0, 1, I, O
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

app.post('/api/classes', async (req, res) => {
    const teacher = requireTeacherSession(req, res);
    if (!teacher) return;

    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Class name is required' });
    }

    try {
        const join_code = generateJoinCode();
        const { data, error } = await withRetry(() => supabase
            .from('classes')
            .insert([{ name, teacher_id: teacher.userId, join_code }])
            .select()
            .single()
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/classes/:teacherId', async (req, res) => {
    const teacher = requireTeacherSession(req, res);
    if (!teacher) return;
    if (req.params.teacherId !== teacher.userId) {
        return res.status(403).json({ error: 'You can only view your own classes' });
    }

    try {
        const { data, error } = await withRetry(() => supabase
            .from('classes')
            .select('*')
            .eq('teacher_id', teacher.userId)
            .order('created_at', { ascending: false })
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/classes/join', async (req, res) => {
    const { joinCode, userId } = req.body;
    if (!joinCode || !userId) {
        return res.status(400).json({ error: 'joinCode and userId are required' });
    }

    try {
        // Find class by code
        const { data: classObj, error: classError } = await withRetry(() => supabase
            .from('classes')
            .select('id, name')
            .eq('join_code', joinCode.toUpperCase())
            .maybeSingle()
        );

        if (classError || !classObj) {
            return res.status(404).json({ error: 'Invalid join code' });
        }

        // Join class
        const { error: joinError } = await withRetry(() => supabase
            .from('class_members')
            .insert([{ class_id: classObj.id, user_id: userId }])
        );

        if (joinError) {
            if (joinError.code === '23505') { // postgres unique_violation
                return res.status(409).json({ error: 'You are already in this class' });
            }
            return res.status(500).json({ error: joinError.message });
        }

        res.json({ success: true, className: classObj.name, classId: classObj.id });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/classes/:classId/members', async (req, res) => {
    const teacher = requireTeacherSession(req, res);
    if (!teacher) return;

    const classObj = await requireOwnedClass(req.params.classId, teacher.userId, res);
    if (!classObj) return;

    try {
        const { data, error } = await withRetry(() => supabase
            .from('class_members')
            .select(`
                user_id,
                joined_at,
                users ( id, name, xp, level, avatar, avatar_color )
            `)
            .eq('class_id', classObj.id)
        );

        if (error) return res.status(500).json({ error: error.message });

        // Flatten student data
        const members = data.map((m: any) => ({
            ...m.users,
            joined_at: m.joined_at
        }));

        res.json(members);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/classes/:classId/members/:userId', async (req, res) => {
    const teacher = requireTeacherSession(req, res);
    if (!teacher) return;

    const classObj = await requireOwnedClass(req.params.classId, teacher.userId, res);
    if (!classObj) return;

    try {
        const { error } = await withRetry(() => supabase
            .from('class_members')
            .delete()
            .eq('class_id', classObj.id)
            .eq('user_id', req.params.userId)
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Assignments ────────────────────────────────────

app.post('/api/assignments', async (req, res) => {
    const teacher = requireTeacherSession(req, res);
    if (!teacher) return;

    const { classId, title, subject, topic, questionCount, dueDate } = req.body;
    if (!classId || !title) {
        return res.status(400).json({ error: 'classId and title are required' });
    }

    try {
        const classObj = await requireOwnedClass(classId, teacher.userId, res);
        if (!classObj) return;

        const { data, error } = await withRetry(() => supabase
            .from('assignments')
            .insert([{
                class_id: classObj.id,
                title,
                subject: subject || 'math',
                topic: topic || null,
                question_count: questionCount || 5,
                due_date: dueDate || null,
            }])
            .select()
            .single()
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/assignments/:classId', async (req, res) => {
    const teacher = requireTeacherSession(req, res);
    if (!teacher) return;

    try {
        const classObj = await requireOwnedClass(req.params.classId, teacher.userId, res);
        if (!classObj) return;

        const { data, error } = await withRetry(() => supabase
            .from('assignments')
            .select('*')
            .eq('class_id', classObj.id)
            .order('created_at', { ascending: false })
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Teacher Progress ───────────────────────────────

app.get('/api/student/assignments/:userId', async (req, res) => {
    try {
        const { data: memberships, error: membershipError } = await withRetry(() => supabase
            .from('class_members')
            .select('class_id')
            .eq('user_id', req.params.userId)
        );

        if (membershipError) return res.status(500).json({ error: membershipError.message });

        const classIds = (memberships || []).map((membership: any) => membership.class_id);
        if (classIds.length === 0) return res.json([]);

        const [{ data: classes, error: classesError }, { data: assignments, error: assignmentsError }] = await Promise.all([
            withRetry(() => supabase
                .from('classes')
                .select('id, name')
                .in('id', classIds)
            ),
            withRetry(() => supabase
                .from('assignments')
                .select('*')
                .in('class_id', classIds)
                .order('due_date', { ascending: true, nullsFirst: false })
                .order('created_at', { ascending: false })
            ),
        ]);

        if (classesError) return res.status(500).json({ error: classesError.message });
        if (assignmentsError) return res.status(500).json({ error: assignmentsError.message });

        const classNames = new Map((classes || []).map((classObj: any) => [classObj.id, classObj.name]));
        const enrichedAssignments = (assignments || []).map((assignment: any) => ({
            ...assignment,
            class_name: classNames.get(assignment.class_id) || 'Class',
        }));

        res.json(enrichedAssignments);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/teacher/progress/:classId', async (req, res) => {
    const teacher = requireTeacherSession(req, res);
    if (!teacher) return;

    try {
        const classObj = await requireOwnedClass(req.params.classId, teacher.userId, res);
        if (!classObj) return;

        // Get class members
        const { data: members, error: membersError } = await withRetry(() => supabase
            .from('class_members')
            .select('user_id, users ( id, name, xp, level, avatar, avatar_color )')
            .eq('class_id', classObj.id)
        );

        if (membersError) return res.status(500).json({ error: membersError.message });

        // Get progress for all members
        const userIds = members.map((m: any) => m.user_id);
        const { data: progressData, error: progressError } = await withRetry(() => supabase
            .from('progress')
            .select('*')
            .in('user_id', userIds.length > 0 ? userIds : ['__none__'])
        );

        if (progressError) return res.status(500).json({ error: progressError.message });

        // Build summary per student
        const summary = members.map((m: any) => {
            const studentProgress = (progressData || []).filter((p: any) => p.user_id === m.user_id);
            const totalCorrect = studentProgress.reduce((sum: number, p: any) => sum + getProgressCorrectCount(p), 0);
            const totalQuestions = studentProgress.reduce((sum: number, p: any) => sum + getProgressTotalCount(p), 0);
            const sessionsCount = studentProgress.length;

            return {
                ...m.users,
                totalCorrect,
                totalQuestions,
                accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
                sessionsCount,
            };
        });

        res.json(summary);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/teacher/progress/:classId/:userId', async (req, res) => {
    const teacher = requireTeacherSession(req, res);
    if (!teacher) return;

    try {
        const classObj = await requireOwnedClass(req.params.classId, teacher.userId, res);
        if (!classObj) return;

        const { data: member, error: memberError } = await withRetry(() => supabase
            .from('class_members')
            .select('user_id')
            .eq('class_id', classObj.id)
            .eq('user_id', req.params.userId)
            .maybeSingle()
        );

        if (memberError) return res.status(500).json({ error: memberError.message });
        if (!member) return res.status(404).json({ error: 'Student is not in this class' });

        const { data, error } = await withRetry(() => supabase
            .from('progress')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('completed_at', { ascending: false })
            .limit(20)
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json((data || []).map(normalizeProgressRecord));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Shop & Inventory ───────────────────────────────

app.get('/api/shop/items', async (_req, res) => {
    try {
        const { data, error } = await withRetry(() => supabase
            .from('shop_items')
            .select('*')
            .order('price', { ascending: true })
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/shop/buy', async (req, res) => {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) return res.status(400).json({ error: 'userId and itemId are required' });

    try {
        // 1. Get user stars and item price
        const { data: user } = await withRetry(() => supabase.from('users').select('stars').eq('id', userId).single());
        const { data: item } = await withRetry(() => supabase.from('shop_items').select('price').eq('id', itemId).single());

        if (!user || !item) return res.status(404).json({ error: 'User or Item not found' });
        if (user.stars < item.price) return res.status(400).json({ error: 'Not enough stars' });

        // 2. Perform transaction (Update stars and add to inventory)
        const newStars = user.stars - item.price;
        
        await withRetry(() => supabase.from('users').update({ stars: newStars }).eq('id', userId));
        
        const { error: invError } = await withRetry(() => supabase
            .from('user_inventory')
            .upsert([{ 
                user_id: userId, 
                item_id: itemId, 
                quantity: 1 // For now just 1, could be quantity + 1 in future
            }], { onConflict: 'user_id,item_id' })
        );

        if (invError) throw invError;

        res.json({ success: true, stars: newStars });
    } catch (err: any) {
        console.error('❌ Purchase error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/shop/inventory/:userId', async (req, res) => {
    try {
        const { data, error } = await withRetry(() => supabase
            .from('user_inventory')
            .select(`
                *,
                item:shop_items (*)
            `)
            .eq('user_id', req.params.userId)
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/shop/inventory/equip', async (req, res) => {
    const { userId, userItemId, isEquipped } = req.body;
    
    try {
        // If equipping accessories, unequip others in same category? 
        // For simplicity now, just update the specific item
        const { error } = await withRetry(() => supabase
            .from('user_inventory')
            .update({ is_equipped: isEquipped })
            .eq('id', userItemId)
            .eq('user_id', userId)
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Start Server ───────────────────────────────────
const PORT = process.env.PORT || 3001;
const currentFilePath = fileURLToPath(import.meta.url);
const entryFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';
const isDirectServerStart = entryFilePath === currentFilePath;
if (isDirectServerStart) {
    app.listen(PORT, () => {
    console.log(`🚀 Math Buddy API running at http://localhost:${PORT}`);
    console.log('☁️ Connected to Supabase');
});
}

export default app;
