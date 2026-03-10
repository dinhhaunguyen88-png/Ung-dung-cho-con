export type Screen =
    | 'dashboard'
    | 'learning'
    | 'pet-room'
    | 'parent-report'
    | 'leaderboard'
    | 'profile-setup'
    | 'teacher-login'
    | 'teacher-register'
    | 'teacher-dashboard'
    | 'join-class';

// Re-export teacher types
export type { UserRole, ClassData, ClassWithMembers, ClassMember, AssignmentData, AssignmentWithProgress, TeacherLoginRequest, TeacherRegisterRequest, TeacherAuthResponse, StudentProgressSummary, ClassProgressReport } from './teacher';
