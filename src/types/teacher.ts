/**
 * Teacher & Class Management types for Phase 2.
 */

// ─── User Roles ──────────────────────────────────────

export type UserRole = 'student' | 'teacher';

// ─── Class ───────────────────────────────────────────

export interface ClassData {
    id: string;
    name: string;
    teacher_id: string;
    join_code: string;
    created_at?: string;
}

export interface ClassWithMembers extends ClassData {
    members: ClassMember[];
    member_count: number;
}

export interface ClassMember {
    id: string;
    class_id: string;
    user_id: string;
    joined_at?: string;
    // Joined user data (from query)
    user_name?: string;
    user_avatar?: string;
    user_avatar_color?: string;
    user_xp?: number;
    user_level?: number;
}

// ─── Assignment ──────────────────────────────────────

export interface AssignmentData {
    id: string;
    class_id: string;
    title: string;
    subject: string;
    topic?: string;
    question_count: number;
    due_date?: string;
    created_at?: string;
}

export interface AssignmentWithProgress extends AssignmentData {
    completed_count: number;
    total_members: number;
    avg_score?: number;
}

// ─── Teacher Auth ────────────────────────────────────

export interface TeacherLoginRequest {
    email: string;
    password: string;
}

export interface TeacherRegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface TeacherAuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        avatar: string;
        avatar_color: string;
        xp: number;
        level: number;
        stars: number;
    };
    token: string;
}

// ─── Student Progress (Teacher View) ─────────────────

export interface StudentProgressSummary {
    id: string;
    name: string;
    avatar: string;
    avatar_color: string;
    xp: number;
    level: number;
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
    sessionsCount: number;
}

export interface ProgressRecord {
    id: string | number;
    user_id: string;
    subject: string;
    topic: string;
    correct: number;
    total: number;
    completed_at?: string | null;
    created_at?: string;
}

export interface StudentAssignmentData extends AssignmentData {
    class_name: string;
}

export interface ClassProgressReport {
    class_id: string;
    class_name: string;
    total_members: number;
    avg_accuracy: number;
    students: StudentProgressSummary[];
}
