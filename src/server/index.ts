import express from 'express';
import { supabase } from './supabaseClient.js';

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

// ─── Start Server ───────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Math Buddy API running at http://localhost:${PORT}`);
    console.log('☁️ Connected to Supabase');
});
