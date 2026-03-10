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
    };
}

// ─── Student Progress (Teacher View) ─────────────────

export interface StudentProgressSummary {
    user_id: string;
    user_name: string;
    user_avatar: string;
    user_avatar_color: string;
    total_quests: number;
    total_correct: number;
    total_questions: number;
    accuracy: number; // percentage
    xp: number;
    level: number;
}

export interface ClassProgressReport {
    class_id: string;
    class_name: string;
    total_members: number;
    avg_accuracy: number;
    students: StudentProgressSummary[];
}
