import { useState, useEffect, useCallback, useRef } from 'react';
import type { PetConfig, PetType } from '../types/pet';
import { getPet, updatePet } from '../services/api';

const STORAGE_KEY = 'math-buddy-pet';

const DEFAULT_PET: PetConfig = {
    type: 'dragon',
    name: 'Sparky',
    color: '#30e86e',
    equippedAccessories: ['party-hat'],
    xp: 0,
    level: 1,
};

/** Load pet from localStorage as cache/fallback */
function loadPetFromStorage(): PetConfig {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return DEFAULT_PET;
}

/** Save pet to localStorage for offline cache */
function savePetToStorage(pet: PetConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
}

/**
 * Pet state hook with backend sync.
 * - When userId is provided: loads from backend API, falls back to localStorage.
 * - Debounces PUT /api/pets/:userId by 500ms on mutations.
 * - Always keeps localStorage in sync as a cache.
 */
export function usePet(userId?: string | null) {
    const [pet, setPet] = useState<PetConfig>(loadPetFromStorage);
    const [isLoading, setIsLoading] = useState(!!userId);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestPet = useRef(pet);

    // Keep ref in sync
    latestPet.current = pet;

    // Load pet from backend when userId is available
    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        getPet(userId)
            .then((serverPet) => {
                if (cancelled) return;
                const parseAccessories = (data: any): string[] => {
                    if (!data) return DEFAULT_PET.equippedAccessories;
                    if (Array.isArray(data)) return data;
                    if (typeof data === 'string') {
                        try {
                            const parsed = JSON.parse(data);
                            return Array.isArray(parsed) ? parsed : [data];
                        } catch {
                            return [data];
                        }
                    }
                    return DEFAULT_PET.equippedAccessories;
                };

                const config: PetConfig = {
                    type: (serverPet.type as PetType) || DEFAULT_PET.type,
                    name: serverPet.name || DEFAULT_PET.name,
                    color: serverPet.color || DEFAULT_PET.color,
                    equippedAccessories: parseAccessories(serverPet.accessories),
                    xp: serverPet.xp ?? 0,
                    level: serverPet.level ?? 1,
                };
                setPet(config);
                savePetToStorage(config);
            })
            .catch((err) => {
                if (cancelled) return;
                console.warn('⚠️ Failed to load pet from backend, using local cache:', err);
                // Keep localStorage fallback, already loaded
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => { cancelled = true; };
    }, [userId]);

    // Persist to localStorage on every change
    useEffect(() => {
        savePetToStorage(pet);
    }, [pet]);

    // Debounced sync to backend
    const syncToBackend = useCallback(() => {
        if (!userId) return;

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            const current = latestPet.current;
            updatePet(userId, {
                type: current.type,
                name: current.name,
                color: current.color,
                accessories: JSON.stringify(current.equippedAccessories),
            }).catch((err) => {
                console.warn('⚠️ Failed to sync pet to backend:', err);
            });
        }, 500);
    }, [userId]);

    const setType = useCallback((type: PetType) => {
        setPet((p) => ({ ...p, type }));
        syncToBackend();
    }, [syncToBackend]);

    const setColor = useCallback((color: string) => {
        setPet((p) => ({ ...p, color }));
        syncToBackend();
    }, [syncToBackend]);

    const setName = useCallback((name: string) => {
        setPet((p) => ({ ...p, name }));
        syncToBackend();
    }, [syncToBackend]);

    const toggleAccessory = useCallback((accessoryId: string) => {
        setPet((p) => {
            const has = p.equippedAccessories.includes(accessoryId);
            return {
                ...p,
                equippedAccessories: has
                    ? p.equippedAccessories.filter((id) => id !== accessoryId)
                    : [...p.equippedAccessories, accessoryId],
            };
        });
        syncToBackend();
    }, [syncToBackend]);

    const addXp = useCallback((amount: number) => {
        setPet((p) => {
            const newXp = p.xp + amount;
            const newLevel = Math.floor(newXp / 200) + 1;
            return { ...p, xp: newXp, level: newLevel };
        });
        // XP is managed by backend via progress endpoint, no need to PUT here
    }, []);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    return { pet, isLoading, setType, setColor, setName, toggleAccessory, addXp };
}
