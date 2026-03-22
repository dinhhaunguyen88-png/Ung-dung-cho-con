import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowUp, Crown, Flame, Medal, Star, Trophy } from 'lucide-react';
import { PetAvatar } from '../pet/PetAvatar';
import { getLeaderboard, type LeaderboardEntry } from '../../services/api';

type LeaderboardMetric = 'correct' | 'xp';

const FALLBACK_ENTRIES: LeaderboardEntry[] = [
    { id: '1', name: 'Minh Anh', avatar: 'cat', avatar_color: '#ec4899', xp: 2450, level: 13, stars: 0, pet_type: 'cat', pet_name: 'Luna', pet_color: '#ec4899', totalCorrect: 245, totalQuestions: 280, accuracy: 88, sessionsCount: 18 },
    { id: '2', name: 'Bao', avatar: 'dragon', avatar_color: '#30e86e', xp: 2100, level: 11, stars: 0, pet_type: 'dragon', pet_name: 'Rong Con', pet_color: '#30e86e', totalCorrect: 210, totalQuestions: 246, accuracy: 85, sessionsCount: 16 },
    { id: '3', name: 'Ha My', avatar: 'bunny', avatar_color: '#8b5cf6', xp: 1800, level: 10, stars: 0, pet_type: 'bunny', pet_name: 'Bong', pet_color: '#8b5cf6', totalCorrect: 182, totalQuestions: 220, accuracy: 83, sessionsCount: 15 },
    { id: '4', name: 'Duc', avatar: 'dog', avatar_color: '#3b82f6', xp: 1500, level: 8, stars: 0, pet_type: 'dog', pet_name: 'Buddy', pet_color: '#3b82f6', totalCorrect: 146, totalQuestions: 183, accuracy: 80, sessionsCount: 12 },
    { id: '5', name: 'Linh', avatar: 'cat', avatar_color: '#f97316', xp: 1200, level: 7, stars: 0, pet_type: 'cat', pet_name: 'Mimi', pet_color: '#f97316', totalCorrect: 118, totalQuestions: 150, accuracy: 79, sessionsCount: 11 },
    { id: '6', name: 'Khoa', avatar: 'dragon', avatar_color: '#ef4444', xp: 950, level: 5, stars: 0, pet_type: 'dragon', pet_name: 'Lua', pet_color: '#ef4444', totalCorrect: 92, totalQuestions: 120, accuracy: 77, sessionsCount: 9 },
    { id: '7', name: 'Thao', avatar: 'bunny', avatar_color: '#06b6d4', xp: 700, level: 4, stars: 0, pet_type: 'bunny', pet_name: 'Bi', pet_color: '#06b6d4', totalCorrect: 71, totalQuestions: 96, accuracy: 74, sessionsCount: 8 },
    { id: '8', name: 'Nam', avatar: 'dog', avatar_color: '#eab308', xp: 400, level: 3, stars: 0, pet_type: 'dog', pet_name: 'Rex', pet_color: '#eab308', totalCorrect: 43, totalQuestions: 65, accuracy: 66, sessionsCount: 5 },
];

function sortEntries(entries: LeaderboardEntry[], metric: LeaderboardMetric): LeaderboardEntry[] {
    return [...entries].sort((a, b) => {
        const primary = metric === 'correct'
            ? (b.totalCorrect ?? 0) - (a.totalCorrect ?? 0)
            : (b.xp ?? 0) - (a.xp ?? 0);

        if (primary !== 0) return primary;
        return (b.xp ?? 0) - (a.xp ?? 0);
    });
}

function getRankIcon(rank: number) {
    if (rank === 1) return <Crown size={24} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={24} className="text-slate-400" />;
    if (rank === 3) return <Medal size={24} className="text-amber-600" />;
    return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
}

function getRankBg(rank: number) {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-lg shadow-yellow-100/50';
    if (rank === 2) return 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
    return 'bg-white border-slate-100';
}

export function LeaderboardV2() {
    const { i18n } = useTranslation();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [metric, setMetric] = useState<LeaderboardMetric>('correct');
    const isVi = i18n.language === 'vi';

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        getLeaderboard(metric)
            .then((data) => {
                if (cancelled) return;
                setEntries(sortEntries(data, metric));
                setLoading(false);
            })
            .catch(() => {
                if (cancelled) return;
                setEntries(sortEntries(FALLBACK_ENTRIES, metric));
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [metric]);

    const getMetricValue = (entry: LeaderboardEntry) => (
        metric === 'correct' ? entry.totalCorrect ?? 0 : entry.xp ?? 0
    );

    const getMetricText = (entry: LeaderboardEntry) => {
        const value = getMetricValue(entry);
        if (metric === 'correct') {
            return isVi ? `${value} cau dung` : `${value} correct`;
        }
        return `${value} XP`;
    };

    const getSubtitle = (entry: LeaderboardEntry) => {
        if (metric === 'correct') {
            return isVi
                ? `Do chinh xac ${entry.accuracy ?? 0}%`
                : `Accuracy ${entry.accuracy ?? 0}%`;
        }

        return isVi
            ? `${entry.pet_name ?? 'Pet'} · Cap ${entry.level}`
            : `${entry.pet_name ?? 'Pet'} · Level ${entry.level}`;
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
            <div className="mb-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                    <Trophy size={36} className="text-yellow-500" />
                    <h1 className="text-3xl font-black text-slate-900">
                        {isVi ? 'Bang Xep Hang' : 'Leaderboard'}
                    </h1>
                    <Trophy size={36} className="text-yellow-500" />
                </div>
                <p className="text-slate-500">
                    {metric === 'correct'
                        ? (isVi ? 'Xep theo tong so cau tra loi dung' : 'Ranked by total correct answers')
                        : (isVi ? 'Xep theo tong XP tich luy' : 'Ranked by total XP')}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMetric('correct')}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                            metric === 'correct'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'
                        }`}
                    >
                        {isVi ? 'Dung nhieu nhat' : 'Most Correct'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMetric('xp')}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                            metric === 'xp'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'
                        }`}
                    >
                        XP
                    </button>
                </div>
            </div>

            <div className="mb-10 flex items-end justify-center gap-4">
                {entries.slice(0, 3).map((_entry, i) => {
                    const order = [1, 0, 2];
                    const idx = order[i];
                    const entry = entries[idx];
                    if (!entry) return null;

                    const rank = idx + 1;
                    const height = rank === 1 ? 'h-36' : rank === 2 ? 'h-28' : 'h-20';

                    return (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative mb-2">
                                <PetAvatar
                                    type={entry.pet_type || 'dragon'}
                                    color={entry.pet_color || entry.avatar_color}
                                    level={entry.level}
                                    size={rank === 1 ? 80 : 64}
                                />
                                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md">
                                    {getRankIcon(rank)}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{entry.name}</p>
                            <p className="text-xs font-semibold text-primary">{getMetricText(entry)}</p>
                            <div
                                className={`mt-2 flex w-24 items-center justify-center rounded-t-xl ${rank === 1
                                    ? 'bg-gradient-to-b from-yellow-400 to-yellow-500'
                                    : rank === 2
                                        ? 'bg-gradient-to-b from-slate-300 to-slate-400'
                                        : 'bg-gradient-to-b from-amber-500 to-amber-600'
                                    } ${height}`}
                            >
                                <span className="text-2xl font-black text-white">{rank}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

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
                                type={entry.pet_type || 'dragon'}
                                color={entry.pet_color || entry.avatar_color}
                                level={entry.level}
                                size={48}
                            />

                            <div className="flex-1">
                                <p className="font-bold text-slate-900">{entry.name}</p>
                                <p className="text-xs text-slate-500">{getSubtitle(entry)}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                                    <Star size={14} className="fill-primary text-primary" />
                                    <span className="text-sm font-bold text-primary">{getMetricValue(entry)}</span>
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
