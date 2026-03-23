import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Crown, Medal, Star, Trophy } from 'lucide-react';
import { PetAvatar } from '../pet/PetAvatar';
import { getLeaderboard, type LeaderboardEntry } from '../../services/api';
import { GlassCard, NeonButton } from '../ui/GlassCard';

type LeaderboardMetric = 'correct' | 'xp';

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
    if (rank === 1) return <Crown size={24} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />;
    if (rank === 2) return <Medal size={24} className="text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]" />;
    if (rank === 3) return <Medal size={24} className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />;
    return <span className="text-lg font-black text-slate-400 drop-shadow-sm">#{rank}</span>;
}

function getRankStyle(rank: number) {
    if (rank === 1) return 'border-yellow-400/50 bg-yellow-950/20 shadow-[0_0_15px_rgba(250,204,21,0.15)]';
    if (rank === 2) return 'border-slate-400/50 bg-slate-800/40 shadow-[0_0_15px_rgba(203,213,225,0.1)]';
    if (rank === 3) return 'border-amber-500/50 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
    return 'border-slate-700/50 bg-slate-800/30 hover:border-cyan-500/30';
}

function getPodiumColor(rank: number) {
    if (rank === 1) return 'from-yellow-500 to-amber-600 shadow-[0_0_30px_rgba(250,204,21,0.4)] border-yellow-400/50';
    if (rank === 2) return 'from-slate-400 to-slate-500 shadow-[0_0_25px_rgba(203,213,225,0.3)] border-slate-300/50';
    if (rank === 3) return 'from-amber-600 to-orange-700 shadow-[0_0_25px_rgba(245,158,11,0.3)] border-amber-500/50';
    return '';
}

function shouldTreatAsEmptyLeaderboard(error: unknown) {
    const message = error instanceof Error
        ? error.message.toLowerCase()
        : String(error ?? '').toLowerCase();

    return (
        message.includes('fetch failed')
        || message.includes('failed to fetch')
        || message.includes('network')
        || message.includes('request failed')
        || message.includes('relation')
        || message.includes('column')
        || message.includes('supabase')
    );
}

export function LeaderboardV2() {
    const { i18n } = useTranslation();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metric, setMetric] = useState<LeaderboardMetric>('correct');
    const isVi = i18n.language === 'vi';

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        getLeaderboard(metric)
            .then((data) => {
                if (cancelled) return;
                setError(null);
                setEntries(sortEntries(data, metric));
                setLoading(false);
            })
            .catch((err: unknown) => {
                if (cancelled) return;

                if (shouldTreatAsEmptyLeaderboard(err)) {
                    setEntries([]);
                    setError(null);
                    setLoading(false);
                    return;
                }

                const fallbackMessage = isVi
                    ? 'Khong tai duoc bang xep hang. Vui long thu lai sau.'
                    : 'Unable to load the leaderboard. Please try again later.';
                const message = err instanceof Error && err.message ? err.message : fallbackMessage;
                setEntries([]);
                setError(message);
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isVi, metric]);

    const getMetricValue = (entry: LeaderboardEntry) => (
        metric === 'correct' ? entry.totalCorrect ?? 0 : entry.xp ?? 0
    );

    const getMetricText = (entry: LeaderboardEntry) => {
        const value = getMetricValue(entry);
        if (metric === 'correct') {
            return isVi ? `${value} câu đúng` : `${value} correct`;
        }
        return `${value} XP`;
    };

    const getSubtitle = (entry: LeaderboardEntry) => {
        if (metric === 'correct') {
            return isVi
                ? `Độ chính xác ${entry.accuracy ?? 0}%`
                : `Accuracy ${entry.accuracy ?? 0}%`;
        }

        return isVi
            ? `${entry.pet_name ?? 'Pet'} · Cấp ${entry.level}`
            : `${entry.pet_name ?? 'Pet'} · Level ${entry.level}`;
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center bg-slate-900">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 px-4 py-8 text-slate-200 md:px-8"
                style={{ backgroundImage: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)' }}>
                <div className="mx-auto max-w-3xl">
                    <GlassCard className="border border-rose-500/40 bg-rose-950/20 p-8 text-center shadow-[0_0_30px_rgba(244,63,94,0.12)]">
                        <h2 className="text-2xl font-black text-white">
                            {isVi ? 'Bang xep hang tam thoi chua san sang' : 'Leaderboard is temporarily unavailable'}
                        </h2>
                        <p className="mt-3 text-sm font-medium text-slate-300">{error}</p>
                    </GlassCard>
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="min-h-screen bg-slate-900 px-4 py-8 text-slate-200 md:px-8"
                style={{ backgroundImage: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)' }}>
                <div className="mx-auto max-w-3xl">
                    <GlassCard className="border border-cyan-500/20 bg-slate-800/40 p-8 text-center shadow-[0_0_30px_rgba(6,182,212,0.08)]">
                        <h2 className="text-2xl font-black text-white">
                            {isVi ? 'Chua co bang xep hang' : 'No leaderboard yet'}
                        </h2>
                        <p className="mt-3 text-sm font-medium text-slate-300">
                            {isVi
                                ? 'Du lieu xep hang se xuat hien sau khi he thong co du lieu hoc tap.'
                                : 'Leaderboard data will appear after the system has saved learning progress.'}
                        </p>
                    </GlassCard>
                </div>
            </div>
        );
    }

    // Prepare top 3 podium order: 2nd, 1st, 3rd
    const top3 = entries.slice(0, 3);
    const podiumOrder = [
        top3.length > 1 ? top3[1] : null,
        top3.length > 0 ? top3[0] : null,
        top3.length > 2 ? top3[2] : null,
    ];

    return (
        <div className="min-h-screen bg-slate-900 px-4 py-8 md:px-8 text-slate-200"
            style={{ backgroundImage: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)' }}>
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-10 text-center relative z-10">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-4 inline-flex items-center justify-center gap-4 rounded-full border border-cyan-500/30 bg-slate-800/50 px-8 py-3 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-md"
                    >
                        <Trophy size={36} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                        <h1 className="text-3xl font-black text-white tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {isVi ? 'Bảng Xếp Hạng' : 'Leaderboard'}
                        </h1>
                        <Trophy size={36} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                    </motion.div>
                    
                    <p className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
                        {metric === 'correct'
                            ? (isVi ? 'Nhiều câu đúng nhất' : 'Most correct answers')
                            : (isVi ? 'Nhiều XP nhất' : 'Highest XP total')}
                    </p>
                    
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <NeonButton
                            variant={metric === 'correct' ? 'primary' : 'secondary'}
                            onClick={() => setMetric('correct')}
                        >
                            {isVi ? 'Câu Đúng' : 'Most Correct'}
                        </NeonButton>
                        <NeonButton
                            variant={metric === 'xp' ? 'primary' : 'secondary'}
                            onClick={() => setMetric('xp')}
                        >
                            XP
                        </NeonButton>
                    </div>
                </div>

                {/* Podium for Top 3 */}
                <div className="mb-16 mt-16 flex items-end justify-center gap-2 sm:gap-6 relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 -top-20 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                    {podiumOrder.map((entry, i) => {
                        if (!entry) return <div key={`empty-${i}`} className="w-24 sm:w-32" />;
                        
                        const trueRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                        const height = trueRank === 1 ? 'h-40 sm:h-48' : trueRank === 2 ? 'h-32 sm:h-36' : 'h-24 sm:h-28';
                        
                        return (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, type: 'spring', damping: 15 }}
                                className={`flex flex-col items-center relative z-10 w-28 sm:w-36 ${trueRank === 1 ? 'z-20' : 'z-10'}`}
                            >
                                <div className="relative mb-4 flex justify-center w-full">
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[20px] pointer-events-none ${
                                        trueRank === 1 ? 'bg-yellow-500/30' : 
                                        trueRank === 2 ? 'bg-slate-400/20' : 'bg-amber-600/20'
                                    }`} />
                                    <PetAvatar
                                        type={entry.pet_type || 'dragon'}
                                        color={entry.pet_color || entry.avatar_color}
                                        level={entry.level}
                                        size={trueRank === 1 ? 110 : 90}
                                        className="drop-shadow-2xl"
                                    />
                                    <div className="absolute -bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                                        {getRankIcon(trueRank)}
                                    </div>
                                </div>
                                
                                <GlassCard className={`mt-2 flex w-full flex-col items-center justify-start rounded-t-xl rounded-b-none border-b-0 p-3 bg-gradient-to-b ${getPodiumColor(trueRank)} ${height}`}>
                                    <span className="text-sm font-black text-white text-center truncate w-full drop-shadow-md pb-1">{entry.name}</span>
                                    <span className="text-3xl font-black text-white drop-shadow-lg opacity-90">{trueRank}</span>
                                    <div className="mt-auto w-full rounded bg-black/30 py-1 text-center backdrop-blur-sm">
                                        <span className="text-xs font-bold text-white tracking-wider">{getMetricText(entry)}</span>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Rest of the list */}
                <div className="space-y-4">
                    {entries.slice(3).map((entry, index) => {
                        const rank = index + 4;

                        return (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard
                                    className={`flex items-center gap-4 border p-4 transition-all hover:scale-[1.02] ${getRankStyle(rank)}`}
                                >
                                    <div className="flex w-12 items-center justify-center border-r border-slate-700/50 pr-4">
                                        {getRankIcon(rank)}
                                    </div>

                                    <div className="shrink-0 bg-slate-900/50 rounded-full p-2 border border-slate-700/50 shadow-inner">
                                        <PetAvatar
                                            type={entry.pet_type || 'dragon'}
                                            color={entry.pet_color || entry.avatar_color}
                                            level={entry.level}
                                            size={48}
                                            disableAnimation
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white truncate text-lg tracking-wide">{entry.name}</p>
                                        <p className="text-xs font-medium text-slate-400 truncate uppercase tracking-wider">{getSubtitle(entry)}</p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                            <Star size={14} className="fill-cyan-400 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                                            <span className="text-sm font-black text-white">{getMetricValue(entry)}</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
