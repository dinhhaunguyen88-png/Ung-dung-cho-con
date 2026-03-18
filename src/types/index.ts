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
    | 'join-class'
    | 'pet-shop';

// Re-export teacher types
export type { UserRole, ClassData, ClassWithMembers, ClassMember, AssignmentData, StudentAssignmentData, AssignmentWithProgress, TeacherLoginRequest, TeacherRegisterRequest, TeacherAuthResponse, StudentProgressSummary, ClassProgressReport } from './teacher';
