/**
 * Centralized API service layer for Math Buddy.
 * All backend calls go through here for consistent error handling and typing.
 */

// ─── Types ───────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export interface UserData {
    id: string;
    name: string;
    avatar: string;
    avatar_color: string;
    xp: number;
    level: number;
    created_at?: string;
}

export interface PetData {
    id?: number;
    user_id: string;
    type: string;
    name: string;
    color: string;
    accessories?: string;
    level?: number;
    xp?: number;
}

export interface ProgressData {
    id?: number;
    user_id: string;
    subject: string;
    topic: string;
    correct: number;
    total: number;
    completed_at?: string;
}

export interface ProgressResponse {
    xpGain: number;
    user: UserData | null;
}

export interface QuestionData {
    id: number;
    subject: string;
    topic: string;
    difficulty: string;
    content: Record<string, { questionText: string; questionReadText: string }>;
    choices: Array<{ id: number; value: number | string; label: string }>;
    correct_answer_id: number;
}

export interface LeaderboardEntry extends UserData {
    pet_type?: string;
    pet_name?: string;
    pet_color?: string;
}

// ─── Helper ──────────────────────────────────────────

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!response.ok) {
        let message = `Request failed: ${response.statusText}`;
        try {
            const body = await response.json();
            message = body.error || message;
        } catch { /* ignore parse error */ }
        throw new ApiError(response.status, message);
    }

    return response.json();
}

// ─── Users ───────────────────────────────────────────

export async function createUser(
    name: string,
    avatar: string = 'dragon',
    avatarColor: string = '#30e86e',
): Promise<UserData> {
    return request<UserData>('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, avatar, avatarColor }),
    });
}

export async function getUser(id: string): Promise<UserData> {
    return request<UserData>(`/api/users/${encodeURIComponent(id)}`);
}

// ─── Pets ────────────────────────────────────────────

export async function getPet(userId: string): Promise<PetData> {
    return request<PetData>(`/api/pets/${encodeURIComponent(userId)}`);
}

export async function updatePet(
    userId: string,
    petData: Partial<Pick<PetData, 'type' | 'name' | 'color' | 'accessories'>>,
): Promise<PetData> {
    return request<PetData>(`/api/pets/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        body: JSON.stringify(petData),
    });
}

// ─── Progress ────────────────────────────────────────

export async function saveProgress(
    userId: string,
    subject: string,
    topic: string,
    correct: number,
    total: number,
): Promise<ProgressResponse> {
    return request<ProgressResponse>('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ userId, subject, topic, correct, total }),
    });
}

export async function getProgress(userId: string): Promise<ProgressData[]> {
    return request<ProgressData[]>(`/api/progress/${encodeURIComponent(userId)}`);
}

// ─── Questions ───────────────────────────────────────

export async function getQuestions(
    subject: string = 'math',
    limit: number = 5,
): Promise<QuestionData[]> {
    return request<QuestionData[]>(`/api/questions?subject=${encodeURIComponent(subject)}&limit=${limit}`);
}

// ─── Leaderboard ─────────────────────────────────────

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    return request<LeaderboardEntry[]>('/api/leaderboard');
}
