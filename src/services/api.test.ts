import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createUser,
    getUser,
    getPet,
    updatePet,
    saveProgress,
    getProgress,
    getQuestions,
    getLeaderboard,
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
        await expect(createUser('')).rejects.toThrow(); // reset needed
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

        expect(mockFetch).toHaveBeenCalledWith('/api/questions?subject=math&limit=5', {
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
