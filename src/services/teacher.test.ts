import { describe, it, expect, vi, beforeEach } from 'vitest';
import { teacherRegister, teacherLogin, ApiError } from './api';

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

beforeEach(() => {
    mockFetch.mockReset();
});

describe('Teacher Advanced Auth Flow', () => {
    describe('Registration Errors', () => {
        it('should throw error when email already exists', async () => {
            mockResponse({ error: 'Email already registered' }, 409);
            await expect(teacherRegister('Name', 'taken@e.com', 'pass'))
                .rejects.toThrow('Email already registered');
        });

        it('should throw error on invalid password format', async () => {
            mockResponse({ error: 'Password too weak' }, 400);
            await expect(teacherRegister('Name', 't@e.com', '123'))
                .rejects.toThrow('Password too weak');
        });
    });

    describe('Login Errors', () => {
        it('should throw error on invalid credentials', async () => {
            mockResponse({ error: 'Invalid email or password' }, 401);
            await expect(teacherLogin('wrong@e.com', 'bad'))
                .rejects.toThrow('Invalid email or password');
        });

        it('should handle server 500 errors gracefully', async () => {
            mockResponse({ error: 'Internal Server Error' }, 500);
            try {
                await teacherLogin('t@e.com', 'pass');
                expect.fail('Should fail');
            } catch (err) {
                expect(err).toBeInstanceOf(ApiError);
                expect((err as ApiError).status).toBe(500);
            }
        });
    });

    describe('Success Scenarios', () => {
        it('should return teacher role on successful login', async () => {
            mockResponse({ user: { id: 't1', role: 'teacher', email: 't@e.com' } });
            const res = await teacherLogin('t@e.com', 'pass');
            expect(res.user.role).toBe('teacher');
        });
    });
});
