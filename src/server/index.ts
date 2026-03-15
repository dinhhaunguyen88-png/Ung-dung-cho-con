import express from 'express';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { supabase } from './supabaseClient.js';

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

// ─── Users ───────────────────────────────────────────
app.post('/api/users', async (req, res) => {
    const { name, avatar, avatarColor } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    console.log('👤 Creating user on Supabase:', name);

    try {
        const { data: user, error: userError } = await withRetry(() => supabase
            .from('users')
            .insert([{ name, avatar: avatar || 'dragon', avatar_color: avatarColor || '#30e86e' }])
            .select()
            .single()
        );

        if (userError) return res.status(500).json({ error: userError.message });

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

        res.json(user);
    } catch (err: any) {
        console.error('❌ User creation error:', err.message);
        res.status(500).json({ error: err.message });
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
                id, name, avatar, avatar_color, xp, level,
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
        // Save progress
        const { error: progressError } = await withRetry(() => supabase
            .from('progress')
            .insert([{
                user_id: userId,
                subject: subject || 'math',
                topic: topic || '',
                correct: correct || 0,
                total: total || 0
            }])
        );

        if (progressError) console.error('❌ Progress save error:', progressError.message);

        // Award XP (10 per correct answer)
        const xpGain = (correct || 0) * 10;
        let user = null;

        if (xpGain > 0) {
            // Get current XP
            const { data: currentUser } = await withRetry(() => supabase
                .from('users')
                .select('xp')
                .eq('id', userId)
                .single()
            );

            if (currentUser) {
                const newXp = (currentUser.xp || 0) + xpGain;
                const newLevel = Math.floor(newXp / 200) + 1;

                const { data: updatedUser } = await withRetry(() => supabase
                    .from('users')
                    .update({ xp: newXp, level: newLevel })
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
        res.json(data);
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
    const { subject = 'math', limit = 5 } = req.query;
    const subjectStr = String(subject);
    console.log(`🔍 Fetching questions for subject: ${subjectStr}`);

    try {
        // Check cache first
        const now = Date.now();
        if (questionCache[subjectStr] && (now - questionCache[subjectStr].timestamp < CACHE_TTL)) {
            console.log(`⚡ Serving ${subjectStr} from cache`);
            const cached = questionCache[subjectStr].data;
            const shuffled = [...cached].sort(() => 0.5 - Math.random()).slice(0, Number(limit));
            return res.json(shuffled);
        }

        // To avoid fetching ~1000 questions into memory, fetch a broad slice or let Supabase limit the raw pull.
        // We fetch up to 100 random rows directly via the Supabase client logic to shuffle locally, 
        // to prevent node hang 'fetch failed' exceptions on huge subject datasets.
        const { data, error } = await withRetry(() => supabase
            .from('questions')
            .select('*')
            .eq('subject', subjectStr)
            .limit(100) // CRITICAL: Stop V8 engine timeouts on big datasets
        );

        if (error) {
            console.error('❌ Questions fetch error:', error.message);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            console.warn(`⚠️ No questions found for subject: ${subjectStr}`);
            return res.json([]);
        }

        console.log(`✅ Found ${data.length} questions for ${subjectStr}`);

        // Normalize question format for frontend compatibility
        const normalized = data.map((q: any) => {
            let content = q.content || {}; // Defensive default

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
            } else if (typeof content === 'object' && content !== null && !content.vi && !content.en) {
                content = { vi: content, en: content };
            }

            // Defensively handle choices array to prevent iteration TypeError
            const rawChoices = Array.isArray(q.choices) ? q.choices : [];
            const choices = rawChoices.map((c: any) => ({
                ...c,
                value: c?.value ?? c?.text ?? '',
            }));

            return { ...q, content, choices };
        });

        // Save to cache
        questionCache[subjectStr] = { data: normalized, timestamp: now };

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
            .select('id, name, email, role, avatar, avatar_color, xp, level')
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

        console.log(`👩‍🏫 Teacher registered: ${email}`);
        res.json({ user });
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
            .select('id, name, email, role, avatar, avatar_color, xp, level, password_hash')
            .eq('email', email)
            .eq('role', 'teacher')
            .maybeSingle()
        );

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const [salt, storedHash] = user.password_hash.split(':');
        const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
        const storedBuffer = Buffer.from(storedHash, 'hex');

        if (!timingSafeEqual(derivedKey, storedBuffer)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return user without password_hash
        const { password_hash: _, ...safeUser } = user;
        console.log(`👩‍🏫 Teacher logged in: ${email}`);
        res.json({ user: safeUser });
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
    const { name, teacherId } = req.body;
    if (!name || !teacherId) {
        return res.status(400).json({ error: 'Name and teacherId are required' });
    }

    try {
        const join_code = generateJoinCode();
        const { data, error } = await withRetry(() => supabase
            .from('classes')
            .insert([{ name, teacher_id: teacherId, join_code }])
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
    try {
        const { data, error } = await withRetry(() => supabase
            .from('classes')
            .select('*')
            .eq('teacher_id', req.params.teacherId)
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
    try {
        const { data, error } = await withRetry(() => supabase
            .from('class_members')
            .select(`
                user_id,
                users ( id, name, xp, level, avatar, avatar_color )
            `)
            .eq('class_id', req.params.classId)
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
    try {
        const { error } = await withRetry(() => supabase
            .from('class_members')
            .delete()
            .eq('class_id', req.params.classId)
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
    const { classId, title, subject, topic, questionCount, dueDate } = req.body;
    if (!classId || !title) {
        return res.status(400).json({ error: 'classId and title are required' });
    }

    try {
        const { data, error } = await withRetry(() => supabase
            .from('assignments')
            .insert([{
                class_id: classId,
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
    try {
        const { data, error } = await withRetry(() => supabase
            .from('assignments')
            .select('*')
            .eq('class_id', req.params.classId)
            .order('created_at', { ascending: false })
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Teacher Progress ───────────────────────────────

app.get('/api/teacher/progress/:classId', async (req, res) => {
    try {
        // Get class members
        const { data: members, error: membersError } = await withRetry(() => supabase
            .from('class_members')
            .select('user_id, users ( id, name, xp, level, avatar, avatar_color )')
            .eq('class_id', req.params.classId)
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
            const totalCorrect = studentProgress.reduce((sum: number, p: any) => sum + (p.correct_answers || 0), 0);
            const totalQuestions = studentProgress.reduce((sum: number, p: any) => sum + (p.total_questions || 0), 0);
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
    try {
        const { data, error } = await withRetry(() => supabase
            .from('progress')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('created_at', { ascending: false })
            .limit(20)
        );

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Start Server ───────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Math Buddy API running at http://localhost:${PORT}`);
    console.log('☁️ Connected to Supabase');
});
