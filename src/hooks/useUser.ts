import { useState, useCallback } from 'react';

const STORAGE_KEY = 'math-buddy-user';

export interface User {
    id: string;
    name: string;
    avatar: string;
    avatar_color: string;
    xp: number;
    level: number;
    stars: number;
    role?: 'student' | 'teacher';
    email?: string;
    auth_token?: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return null;
            const parsed = JSON.parse(saved);
            // Migration: Clear old integer IDs from SQLite era
            if (typeof parsed.id === 'number') {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            if (parsed.role === 'teacher' && typeof parsed.auth_token !== 'string') {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return parsed;
        } catch {
            return null;
        }
    });

    const login = useCallback((userData: User) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    const isTeacher = user?.role === 'teacher';

    return { user, login, logout, isLoggedIn: !!user, isTeacher };
}
