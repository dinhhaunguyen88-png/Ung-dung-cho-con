import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createUser,
    getUser,
    updateUser,
    getPet,
    updatePet,
    saveProgress,
    getProgress,
    getQuestions,
    getQuestionCounts,
    getServerStatus,
    getLeaderboard,
    teacherRegister,
    teacherLogin,
    createClass,
    getTeacherClasses,
    joinClass,
    getClassMembers,
    removeClassMember,
    createAssignment,
    getClassAssignments,
    getStudentAssignments,
    getClassProgress,
    getStudentProgress,
    ApiError,
} from './api';

// ─── Mock fetch globally ─────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockResponse(data: unknown, status = 200) {
    mockFetch.mockResolvedValueOnce({
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        json: () => Promise.resolve(data),
    });
}

function mockNetworkError() {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
}

beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
});

// ─── createUser ──────────────────────────────────────

describe('createUser', () => {
    it('should POST to /api/users with correct body', async () => {
        const mockUser = { id: 'abc-123', name: 'Minh', avatar: 'cat', avatar_color: '#ec4899', xp: 0, level: 1 };
        mockResponse(mockUser);

        const result = await createUser('Minh', 'cat', '#ec4899');

        expect(mockFetch).toHaveBeenCalledWith('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Minh', avatar: 'cat', avatarColor: '#ec4899' }),
        });
        expect(result).toEqual(mockUser);
    });

    it('should use defaults for avatar and color', async () => {
        mockResponse({ id: '1', name: 'Test', avatar: 'dragon', avatar_color: '#30e86e', xp: 0, level: 1 });

        await createUser('Test');

        const call = mockFetch.mock.calls[0];
        const body = JSON.parse(call[1].body);
        expect(body.avatar).toBe('dragon');
        expect(body.avatarColor).toBe('#30e86e');
    });

    it('should throw ApiError on server error', async () => {
        mockResponse({ error: 'Name is required' }, 400);

        await expect(createUser('')).rejects.toThrow(ApiError);
    });
});

// ─── getUser ─────────────────────────────────────────

describe('getUser', () => {
    it('should GET /api/users/:id', async () => {
        const mockUser = { id: 'abc', name: 'Minh', avatar: 'cat', avatar_color: '#30e86e', xp: 100, level: 2 };
        mockResponse(mockUser);

        const result = await getUser('abc');

        expect(mockFetch).toHaveBeenCalledWith('/api/users/abc', {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(result).toEqual(mockUser);
    });

    it('should throw ApiError when user not found', async () => {
        mockResponse({ error: 'User not found' }, 404);

        await expect(getUser('not-exist')).rejects.toThrow(ApiError);
    });
});

// ─── getPet ──────────────────────────────────────────

describe('updateUser', () => {
    it('should PUT /api/users/:id with correct body', async () => {
        const mockUser = { id: 'abc', name: 'Minh Moi', avatar: 'cat', avatar_color: '#30e86e', xp: 100, level: 2 };
        mockResponse(mockUser);

        const result = await updateUser('abc', { name: 'Minh Moi' });

        expect(mockFetch).toHaveBeenCalledWith('/api/users/abc', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Minh Moi' }),
        });
        expect(result).toEqual(mockUser);
    });
});

describe('getPet', () => {
    it('should GET /api/pets/:userId', async () => {
        const mockPet = { id: 1, user_id: 'abc', type: 'dragon', name: 'Sparky', color: '#30e86e' };
        mockResponse(mockPet);

        const result = await getPet('abc');

        expect(mockFetch).toHaveBeenCalledWith('/api/pets/abc', {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(result).toEqual(mockPet);
    });
});

// ─── updatePet ───────────────────────────────────────

describe('updatePet', () => {
    it('should PUT /api/pets/:userId with partial data', async () => {
        const updated = { id: 1, user_id: 'abc', type: 'cat', name: 'Luna', color: '#ec4899' };
        mockResponse(updated);

        const result = await updatePet('abc', { type: 'cat', name: 'Luna', color: '#ec4899' });

        expect(mockFetch).toHaveBeenCalledWith('/api/pets/abc', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'cat', name: 'Luna', color: '#ec4899' }),
        });
        expect(result).toEqual(updated);
    });
});

// ─── saveProgress ────────────────────────────────────

describe('saveProgress', () => {
    it('should POST /api/progress with correct body', async () => {
        mockResponse({ xpGain: 40, user: { id: 'abc', xp: 140, level: 1 } });

        const result = await saveProgress('abc', 'math', 'addition', 4, 5);

        expect(mockFetch).toHaveBeenCalledWith('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'abc', subject: 'math', topic: 'addition', correct: 4, total: 5 }),
        });
        expect(result.xpGain).toBe(40);
    });
});

// ─── getProgress ─────────────────────────────────────

describe('getProgress', () => {
    it('should GET /api/progress/:userId', async () => {
        const mockData = [{ id: 1, user_id: 'abc', subject: 'math', topic: 'addition', correct: 5, total: 5 }];
        mockResponse(mockData);

        const result = await getProgress('abc');

        expect(result).toHaveLength(1);
        expect(result[0].correct).toBe(5);
    });
});

// ─── getQuestions ────────────────────────────────────

describe('getQuestions', () => {
    it('should GET /api/questions with default params', async () => {
        mockResponse([]);

        await getQuestions();

        expect(mockFetch).toHaveBeenCalledWith('/api/questions?subject=math&limit=15', {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should pass custom subject and limit', async () => {
        mockResponse([]);

        await getQuestions('vietnamese', 10);

        expect(mockFetch).toHaveBeenCalledWith('/api/questions?subject=vietnamese&limit=10', {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should pass optional topic filter', async () => {
        mockResponse([]);

        await getQuestions('math', 12, 'addition');

        expect(mockFetch).toHaveBeenCalledWith('/api/questions?subject=math&limit=12&topic=addition', {
            headers: { 'Content-Type': 'application/json' },
        });
    });
});

// ─── getLeaderboard ──────────────────────────────────

describe('getLeaderboard', () => {
    it('should GET /api/leaderboard', async () => {
        const mockData = [{ id: '1', name: 'Minh', xp: 2000, level: 10 }];
        mockResponse(mockData);

        const result = await getLeaderboard();

        expect(mockFetch).toHaveBeenCalledWith('/api/leaderboard', {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(result).toHaveLength(1);
    });
});

// ─── Teacher Auth ────────────────────────────────────

describe('Teacher Auth', () => {
    const mockTeacher = { user: { id: 't1', name: 'Teacher', email: 't@e.com', role: 'teacher' }, token: 'token-123' };

    it('teacherRegister should POST to /api/auth/teacher/register', async () => {
        mockResponse(mockTeacher);
        const result = await teacherRegister('Teacher', 't@e.com', 'pass123');

        expect(mockFetch).toHaveBeenCalledWith('/api/auth/teacher/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Teacher', email: 't@e.com', password: 'pass123' }),
        });
        expect(result).toEqual(mockTeacher);
    });

    it('teacherLogin should POST to /api/auth/teacher/login', async () => {
        mockResponse(mockTeacher);
        const result = await teacherLogin('t@e.com', 'pass123');

        expect(mockFetch).toHaveBeenCalledWith('/api/auth/teacher/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 't@e.com', password: 'pass123' }),
        });
        expect(result).toEqual(mockTeacher);
    });
});

// ─── Classes ─────────────────────────────────────────

describe('Classes', () => {
    it('createClass should POST to /api/classes', async () => {
        const mockClass = { id: 'c1', name: 'Math 101', teacher_id: 't1', join_code: 'MX123' };
        mockResponse(mockClass);

        const result = await createClass('Math 101');

        expect(mockFetch).toHaveBeenCalledWith('/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Math 101' }),
        });
        expect(result).toEqual(mockClass);
    });

    it('getTeacherClasses should GET /api/classes/:teacherId', async () => {
        mockResponse([]);
        await getTeacherClasses('t1');
        expect(mockFetch).toHaveBeenCalledWith('/api/classes/t1', expect.any(Object));
    });

    it('teacher requests should include bearer token from stored session', async () => {
        localStorage.setItem('math-buddy-user', JSON.stringify({
            id: 't1',
            role: 'teacher',
            auth_token: 'token-123',
        }));
        mockResponse([]);

        await getTeacherClasses('t1');

        expect(mockFetch).toHaveBeenCalledWith('/api/classes/t1', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer token-123',
            },
        });
    });

    it('joinClass should POST to /api/classes/join', async () => {
        mockResponse({ success: true, className: 'Math 101', classId: 'c1' });
        const result = await joinClass('MX123', 'u1');

        expect(mockFetch).toHaveBeenCalledWith('/api/classes/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ joinCode: 'MX123', userId: 'u1' }),
        });
        expect(result.success).toBe(true);
    });

    it('getClassMembers should GET members list', async () => {
        mockResponse([]);
        await getClassMembers('c1');
        expect(mockFetch).toHaveBeenCalledWith('/api/classes/c1/members', expect.any(Object));
    });

    it('removeClassMember should DELETE member', async () => {
        mockResponse({ success: true });
        await removeClassMember('c1', 'u1');
        expect(mockFetch).toHaveBeenCalledWith('/api/classes/c1/members/u1', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
    });
});

// ─── Assignments ─────────────────────────────────────

describe('Assignments', () => {
    it('createAssignment should POST to /api/assignments', async () => {
        const params = { classId: 'c1', title: 'Work', subject: 'math', questionCount: 10 };
        mockResponse({ id: 'a1', ...params });

        await createAssignment(params);

        expect(mockFetch).toHaveBeenCalledWith('/api/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
    });

    it('getClassAssignments should GET list', async () => {
        mockResponse([]);
        await getClassAssignments('c1');
        expect(mockFetch).toHaveBeenCalledWith('/api/assignments/c1', expect.any(Object));
    });

    it('getStudentAssignments should GET list for one student', async () => {
        mockResponse([]);
        await getStudentAssignments('u1');
        expect(mockFetch).toHaveBeenCalledWith('/api/student/assignments/u1', expect.any(Object));
    });

    it('getClassProgress should GET class progress summary', async () => {
        mockResponse([]);
        await getClassProgress('c1');
        expect(mockFetch).toHaveBeenCalledWith('/api/teacher/progress/c1', expect.any(Object));
    });

    it('getStudentProgress should GET specific student records', async () => {
        mockResponse([]);
        await getStudentProgress('c1', 'u1');
        expect(mockFetch).toHaveBeenCalledWith('/api/teacher/progress/c1/u1', expect.any(Object));
    });
});

// ─── Error handling ──────────────────────────────────

describe('error handling', () => {
    it('should throw ApiError with status and message from response', async () => {
        mockResponse({ error: 'Something went wrong' }, 500);

        try {
            await getLeaderboard();
            expect.fail('Should have thrown');
        } catch (err) {
            expect(err).toBeInstanceOf(ApiError);
            expect((err as ApiError).status).toBe(500);
            expect((err as ApiError).message).toBe('Something went wrong');
        }
    });

    it('should propagate network errors', async () => {
        mockNetworkError();

        await expect(getLeaderboard()).rejects.toThrow('Failed to fetch');
    });
});

describe('question counts api', () => {
    it('should GET /api/questions/counts', async () => {
        mockResponse({
            total: 526,
            bySubject: {
                math: 221,
                vietnamese: 85,
                science: 120,
                english: 100,
            },
        });

        const result = await getQuestionCounts();

        expect(mockFetch).toHaveBeenCalledWith('/api/questions/counts', {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(result.total).toBe(526);
        expect(result.bySubject.math).toBe(221);
    });
});

describe('server status api', () => {
    it('should GET /api/system/status', async () => {
        mockResponse({
            summary: {
                ready: true,
                hasWarnings: true,
            },
            supabase: {
                configured: true,
                accessMode: 'anon',
                error: null,
                warning: 'SUPABASE_SERVICE_ROLE_KEY is not set. Server is currently using the anon key.',
                missingVars: ['SUPABASE_SERVICE_ROLE_KEY'],
            },
            auth: {
                secure: false,
                mode: 'fallback',
                warning: 'AUTH_SECRET is not set. Server is using an insecure development fallback secret.',
                missingVars: ['AUTH_SECRET'],
            },
        });

        const result = await getServerStatus();

        expect(mockFetch).toHaveBeenCalledWith('/api/system/status', {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(result.supabase.accessMode).toBe('anon');
        expect(result.auth.secure).toBe(false);
        expect(result.summary.hasWarnings).toBe(true);
        expect(result.supabase.missingVars).toContain('SUPABASE_SERVICE_ROLE_KEY');
    });
});
