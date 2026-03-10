import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, Crown, Flame, ArrowUp } from 'lucide-react';
import { PetAvatar } from '../pet/PetAvatar';
import type { PetType } from '../../types/pet';

interface LeaderboardEntry {
    id: string;
    name: string;
    avatar: string;
    avatar_color: string;
    xp: number;
    level: number;
    pet_type: PetType;
    pet_name: string;
    pet_color: string;
}

export function Leaderboard() {
    const { i18n } = useTranslation();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const isVi = i18n.language === 'vi';

    useEffect(() => {
        fetch('/api/leaderboard')
            .then((r) => r.json())
            .then((data) => {
                setEntries(data);
                setLoading(false);
            })
            .catch(() => {
                // Fallback mock data if server not running
                setEntries([
                    { id: 1, name: 'Minh Anh', avatar: 'cat', avatar_color: '#ec4899', xp: 2450, level: 13, pet_type: 'cat', pet_name: 'Luna', pet_color: '#ec4899' },
                    { id: 2, name: 'Bảo', avatar: 'dragon', avatar_color: '#30e86e', xp: 2100, level: 11, pet_type: 'dragon', pet_name: 'Rồng Con', pet_color: '#30e86e' },
                    { id: 3, name: 'Hà My', avatar: 'bunny', avatar_color: '#8b5cf6', xp: 1800, level: 10, pet_type: 'bunny', pet_name: 'Bông', pet_color: '#8b5cf6' },
                    { id: 4, name: 'Đức', avatar: 'dog', avatar_color: '#3b82f6', xp: 1500, level: 8, pet_type: 'dog', pet_name: 'Buddy', pet_color: '#3b82f6' },
                    { id: 5, name: 'Linh', avatar: 'cat', avatar_color: '#f97316', xp: 1200, level: 7, pet_type: 'cat', pet_name: 'Mimi', pet_color: '#f97316' },
                    { id: 6, name: 'Khoa', avatar: 'dragon', avatar_color: '#ef4444', xp: 950, level: 5, pet_type: 'dragon', pet_name: 'Lửa', pet_color: '#ef4444' },
                    { id: 7, name: 'Thảo', avatar: 'bunny', avatar_color: '#06b6d4', xp: 700, level: 4, pet_type: 'bunny', pet_name: 'Bi', pet_color: '#06b6d4' },
                    { id: 8, name: 'Nam', avatar: 'dog', avatar_color: '#eab308', xp: 400, level: 3, pet_type: 'dog', pet_name: 'Rex', pet_color: '#eab308' },
                ]);
                setLoading(false);
            });
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown size={24} className="text-yellow-500" />;
        if (rank === 2) return <Medal size={24} className="text-slate-400" />;
        if (rank === 3) return <Medal size={24} className="text-amber-600" />;
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    };

    const getRankBg = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-lg shadow-yellow-100/50';
        if (rank === 2) return 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200';
        if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
        return 'bg-white border-slate-100';
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                    <Trophy size={36} className="text-yellow-500" />
                    <h1 className="text-3xl font-black text-slate-900">
                        {isVi ? 'Bảng Xếp Hạng' : 'Leaderboard'}
                    </h1>
                    <Trophy size={36} className="text-yellow-500" />
                </div>
                <p className="text-slate-500">
                    {isVi
                        ? 'Thi đua với các bạn — Ai giỏi Toán nhất?'
                        : 'Compete with friends — Who is the Math champion?'}
                </p>
            </div>

            {/* Top 3 Podium */}
            <div className="mb-10 flex items-end justify-center gap-4">
                {entries.slice(0, 3).map((entry, i) => {
                    const order = [1, 0, 2]; // 2nd, 1st, 3rd
                    const idx = order[i];
                    const e = entries[idx];
                    if (!e) return null;
                    const rank = idx + 1;
                    const height = rank === 1 ? 'h-36' : rank === 2 ? 'h-28' : 'h-20';

                    return (
                        <motion.div
                            key={e.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative mb-2">
                                <PetAvatar
                                    type={e.pet_type}
                                    color={e.pet_color}
                                    level={e.level}
                                    size={rank === 1 ? 80 : 64}
                                />
                                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md">
                                    {getRankIcon(rank)}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{e.name}</p>
                            <p className="text-xs font-semibold text-primary">{e.xp} XP</p>
                            <div
                                className={`mt-2 w-24 rounded-t-xl ${rank === 1
                                    ? 'bg-gradient-to-b from-yellow-400 to-yellow-500'
                                    : rank === 2
                                        ? 'bg-gradient-to-b from-slate-300 to-slate-400'
                                        : 'bg-gradient-to-b from-amber-500 to-amber-600'
                                    } ${height} flex items-center justify-center`}
                            >
                                <span className="text-2xl font-black text-white">{rank}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Full List */}
            <div className="space-y-3">
                {entries.map((entry, index) => {
                    const rank = index + 1;
                    return (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all hover:scale-[1.01] ${getRankBg(rank)}`}
                        >
                            <div className="flex w-10 items-center justify-center">
                                {getRankIcon(rank)}
                            </div>

                            <PetAvatar
                                type={entry.pet_type}
                                color={entry.pet_color}
                                level={entry.level}
                                size={48}
                            />

                            <div className="flex-1">
                                <p className="font-bold text-slate-900">{entry.name}</p>
                                <p className="text-xs text-slate-500">
                                    {entry.pet_name} · Level {entry.level}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                                    <Star size={14} className="fill-primary text-primary" />
                                    <span className="text-sm font-bold text-primary">{entry.xp}</span>
                                </div>
                                {rank <= 3 && (
                                    <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1">
                                        <Flame size={12} className="text-orange-500" />
                                        <ArrowUp size={12} className="text-orange-500" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
