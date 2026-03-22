import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Flame } from 'lucide-react';

interface DailyStreakProps {
    /** Array of 7 booleans (Mon-Sun) indicating study activity */
    weekActivity?: boolean[];
    currentStreak?: number;
}

const DAY_LABELS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function DailyStreak({ weekActivity, currentStreak = 0 }: DailyStreakProps) {
    const { i18n } = useTranslation();
    const vi = i18n.language === 'vi';
    const labels = vi ? DAY_LABELS_VI : DAY_LABELS_EN;

    // Default: generate activity based on current day
    const today = new Date().getDay(); // 0=Sun
    const todayIndex = today === 0 ? 6 : today - 1; // Convert to Mon=0
    const activity = weekActivity || labels.map((_, i) => i <= todayIndex && Math.random() > 0.3);

    const activeCount = activity.filter(Boolean).length;
    const streakCount = currentStreak || activeCount;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5 shadow-sm"
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Flame className="text-orange-500" size={20} />
                    <h3 className="text-sm font-bold text-slate-700">
                        {vi ? 'Chuỗi ngày học' : 'Study Streak'}
                    </h3>
                </div>
                {streakCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="rounded-full bg-orange-500 px-3 py-0.5 text-xs font-black text-white"
                    >
                        🔥 {streakCount} {vi ? 'ngày' : 'days'}
                    </motion.span>
                )}
            </div>

            {/* Day circles */}
            <div className="flex justify-between gap-1">
                {labels.map((label, i) => {
                    const isActive = activity[i];
                    const isToday = i === todayIndex;
                    return (
                        <motion.div
                            key={label}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all md:h-10 md:w-10 ${
                                    isActive
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                        : isToday
                                            ? 'border-2 border-dashed border-orange-300 bg-white text-orange-400'
                                            : 'bg-slate-100 text-slate-300'
                                }`}
                            >
                                {isActive ? '✓' : isToday ? '•' : ''}
                            </div>
                            <span className={`text-[10px] font-bold ${isToday ? 'text-orange-600' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Motivation text */}
            <p className="mt-3 text-center text-xs font-medium text-slate-400">
                {streakCount >= 7
                    ? (vi ? '🏆 Tuần hoàn hảo! Xuất sắc!' : '🏆 Perfect week! Amazing!')
                    : streakCount >= 3
                        ? (vi ? '🔥 Giữ vững nhé! Giỏi lắm!' : '🔥 Keep it up! Great job!')
                        : (vi ? '💪 Hôm nay học được gì chưa?' : '💪 Have you studied today?')}
            </p>
        </motion.div>
    );
}
