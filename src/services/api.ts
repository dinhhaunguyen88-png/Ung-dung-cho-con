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

// ─── Teacher Auth ────────────────────────────────────

export interface TeacherUserData extends UserData {
    role: 'teacher' | 'student';
    email: string;
}

export interface TeacherAuthResponse {
    user: TeacherUserData;
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

export async function createClass(name: string, teacherId: string): Promise<ClassData> {
    return request<ClassData>('/api/classes', {
        method: 'POST',
        body: JSON.stringify({ name, teacherId }),
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

export interface ProgressRecord {
    id: string;
    user_id: string;
    subject: string;
    correct_answers: number;
    total_questions: number;
    created_at: string;
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

export async function getClassProgress(classId: string): Promise<StudentProgressSummary[]> {
    return request<StudentProgressSummary[]>(`/api/teacher/progress/${encodeURIComponent(classId)}`);
}

export async function getStudentProgress(classId: string, userId: string): Promise<ProgressRecord[]> {
    return request<ProgressRecord[]>(`/api/teacher/progress/${encodeURIComponent(classId)}/${encodeURIComponent(userId)}`);
}
