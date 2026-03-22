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
    stars: number;
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
    id?: number | string;
    user_id: string;
    subject: string;
    topic: string;
    correct: number;
    total: number;
    completed_at?: string | null;
    created_at?: string;
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
    content: Record<string, { questionText: string; questionReadText: string; imageUrl?: string }>;
    choices: Array<{ id: number | string; value: number | string; label: string }>;
    correct_answer_id: number | string;
}

export interface QuestionCounts {
    total: number;
    bySubject: {
        math: number;
        vietnamese: number;
        science: number;
        english: number;
    };
}

export interface ServerStatus {
    summary: {
        ready: boolean;
        hasWarnings: boolean;
    };
    supabase: {
        configured: boolean;
        accessMode: 'service_role' | 'anon' | 'missing';
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

export interface LeaderboardEntry extends UserData {
    pet_type?: string;
    pet_name?: string;
    pet_color?: string;
    totalCorrect?: number;
    totalQuestions?: number;
    sessionsCount?: number;
    accuracy?: number;
    rankMetric?: number;
}

// ─── Helper ──────────────────────────────────────────

const USER_STORAGE_KEY = 'math-buddy-user';

function readStoredAuthToken(): string | null {
    if (typeof localStorage === 'undefined') return null;

    try {
        const saved = localStorage.getItem(USER_STORAGE_KEY);
        if (!saved) return null;
        const parsed = JSON.parse(saved);
        return typeof parsed?.auth_token === 'string' ? parsed.auth_token : null;
    } catch {
        return null;
    }
}

const HEADER_NAME_MAP: Record<string, string> = {
    'authorization': 'Authorization',
    'content-type': 'Content-Type',
};

function canonicalHeaderName(name: string): string {
    return HEADER_NAME_MAP[name.toLowerCase()] ?? name;
}

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
    const normalized: Record<string, string> = {};

    if (!headers) {
        return normalized;
    }

    const assignHeader = (name: string, value: string) => {
        normalized[canonicalHeaderName(name)] = value;
    };

    if (headers instanceof Headers) {
        headers.forEach((value, name) => {
            assignHeader(name, value);
        });
        return normalized;
    }

    if (Array.isArray(headers)) {
        headers.forEach(([name, value]) => {
            assignHeader(name, value);
        });
        return normalized;
    }

    Object.entries(headers).forEach(([name, value]) => {
        if (value !== undefined) {
            assignHeader(name, String(value));
        }
    });

    return normalized;
}

function hasHeader(headers: Record<string, string>, name: string): boolean {
    const target = name.toLowerCase();
    return Object.keys(headers).some((headerName) => headerName.toLowerCase() === target);
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const headers = normalizeHeaders(options?.headers);
    if (!hasHeader(headers, 'Content-Type')) {
        headers['Content-Type'] = 'application/json';
    }

    const authToken = readStoredAuthToken();
    if (authToken && !hasHeader(headers, 'Authorization')) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
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

export async function updateUser(
    id: string,
    userData: {
        name: string;
    },
): Promise<UserData> {
    return request<UserData>(`/api/users/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
}

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
    limit: number = 15,
    topic?: string,
): Promise<QuestionData[]> {
    const params = new URLSearchParams({
        subject,
        limit: String(limit),
    });
    if (topic?.trim()) {
        params.set('topic', topic.trim());
    }

    return request<QuestionData[]>(`/api/questions?${params.toString()}`);
}

export async function getQuestionCounts(): Promise<QuestionCounts> {
    return request<QuestionCounts>('/api/questions/counts');
}

export async function getServerStatus(): Promise<ServerStatus> {
    return request<ServerStatus>('/api/system/status');
}

// ─── Leaderboard ─────────────────────────────────────

export async function getLeaderboard(metric?: 'xp' | 'correct'): Promise<LeaderboardEntry[]> {
    const params = new URLSearchParams();
    if (metric) {
        params.set('metric', metric);
    }

    const url = params.size > 0
        ? `/api/leaderboard?${params.toString()}`
        : '/api/leaderboard';

    return request<LeaderboardEntry[]>(url);
}

// ─── Teacher Auth ────────────────────────────────────

export interface TeacherUserData extends UserData {
    role: 'teacher' | 'student';
    email: string;
    auth_token?: string;
}

export interface TeacherAuthResponse {
    user: TeacherUserData;
    token: string;
}

export async function teacherRegister(
    name: string,
    email: string,
    password: string,
): Promise<TeacherAuthResponse> {
    return request<TeacherAuthResponse>('/api/auth/teacher/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
}

export async function teacherLogin(
    email: string,
    password: string,
): Promise<TeacherAuthResponse> {
    return request<TeacherAuthResponse>('/api/auth/teacher/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

// ─── Classes ────────────────────────────────────────

export interface ClassData {
    id: string;
    name: string;
    teacher_id: string;
    join_code: string;
    created_at: string;
}

export interface JoinClassResponse {
    success: boolean;
    className: string;
    classId: string;
}

export async function createClass(name: string): Promise<ClassData> {
    return request<ClassData>('/api/classes', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
}

export async function getTeacherClasses(teacherId: string): Promise<ClassData[]> {
    return request<ClassData[]>(`/api/classes/${encodeURIComponent(teacherId)}`);
}

export async function joinClass(joinCode: string, userId: string): Promise<JoinClassResponse> {
    return request<JoinClassResponse>('/api/classes/join', {
        method: 'POST',
        body: JSON.stringify({ joinCode, userId }),
    });
}

export async function getClassMembers(classId: string): Promise<UserData[]> {
    return request<UserData[]>(`/api/classes/${encodeURIComponent(classId)}/members`);
}

export async function removeClassMember(classId: string, userId: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/classes/${encodeURIComponent(classId)}/members/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
    });
}

// ─── Assignments ────────────────────────────────────

export interface AssignmentData {
    id: string;
    class_id: string;
    title: string;
    subject: string;
    topic: string | null;
    question_count: number;
    due_date: string | null;
    created_at: string;
}

export interface StudentAssignmentData extends AssignmentData {
    class_name: string;
}

export interface StudentProgressSummary {
    id: string;
    name: string;
    xp: number;
    level: number;
    avatar: string;
    avatar_color: string;
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
    sessionsCount: number;
}

export type ProgressRecord = ProgressData;

// ─── Shop & Inventory ───────────────────────────────

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    category: 'food' | 'accessory' | 'toy';
    price: number;
    image_url: string;
    properties?: Record<string, any>;
}

export interface UserItem {
    id: string;
    user_id: string;
    item_id: string;
    is_equipped: boolean;
    quantity: number;
    item?: ShopItem;
}

export async function getShopItems(): Promise<ShopItem[]> {
    return request<ShopItem[]>('/api/shop/items');
}

export async function buyItem(userId: string, itemId: string): Promise<{ success: boolean; stars: number }> {
    return request<{ success: boolean; stars: number }>('/api/shop/buy', {
        method: 'POST',
        body: JSON.stringify({ userId, itemId }),
    });
}

export async function getUserInventory(userId: string): Promise<UserItem[]> {
    return request<UserItem[]>(`/api/shop/inventory/${encodeURIComponent(userId)}`);
}

export async function equipItem(userId: string, userItemId: string, isEquipped: boolean): Promise<{ success: boolean }> {
    return request<{ success: boolean }>('/api/shop/inventory/equip', {
        method: 'POST',
        body: JSON.stringify({ userId, userItemId, isEquipped }),
    });
}

export async function createAssignment(params: {
    classId: string;
    title: string;
    subject?: string;
    topic?: string;
    questionCount?: number;
    dueDate?: string;
}): Promise<AssignmentData> {
    return request<AssignmentData>('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

export async function getClassAssignments(classId: string): Promise<AssignmentData[]> {
    return request<AssignmentData[]>(`/api/assignments/${encodeURIComponent(classId)}`);
}

export async function getStudentAssignments(userId: string): Promise<StudentAssignmentData[]> {
    return request<StudentAssignmentData[]>(`/api/student/assignments/${encodeURIComponent(userId)}`);
}

export async function getClassProgress(classId: string): Promise<StudentProgressSummary[]> {
    return request<StudentProgressSummary[]>(`/api/teacher/progress/${encodeURIComponent(classId)}`);
}

export async function getStudentProgress(classId: string, userId: string): Promise<ProgressRecord[]> {
    return request<ProgressRecord[]>(`/api/teacher/progress/${encodeURIComponent(classId)}/${encodeURIComponent(userId)}`);
}
