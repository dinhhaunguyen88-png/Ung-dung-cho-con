import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
    LayoutDashboard,
    Star,
    CheckCircle2,
    Lightbulb,
} from 'lucide-react';
import { DailyStreak } from './DailyStreak';

export function DashboardRight() {
    const { t } = useTranslation();

    return (
        <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-80">
            {/* Daily Streak Calendar */}
            <DailyStreak />
            <motion.div
                whileHover={{ y: -5 }}
                className="overflow-hidden rounded-2xl glass-card transition-all"
            >
                <div className="bg-gradient-to-br from-purple-500/10 to-quest-purple/20 p-6 border-b border-white/40">
                    <h3 className="flex items-center gap-2 text-lg font-black text-purple-900">
                        <LayoutDashboard size={20} className="text-purple-600" /> {t('dashboard.quest.dailyQuest')}
                    </h3>
                    <p className="text-xs font-bold text-purple-700/70 uppercase tracking-wider">{t('dashboard.quest.completeToEarn')}</p>
                </div>
                <div className="space-y-4 p-4">
                    <QuestItem title={t('dashboard.quest.quickAddition')} progress="3/5" xp={50} percent={60} />
                    <QuestItem title={t('dashboard.quest.shapeHunter')} progress="1/5" xp={80} percent={20} />
                    <QuestItem title={t('dashboard.quest.vocabBuilder')} progress="2/5" xp={60} percent={40} />
                    <QuestItem
                        title={t('dashboard.quest.morningMath')}
                        progress={t('dashboard.quest.done')}
                        xp={0}
                        percent={100}
                        completed
                    />
                    <button className="w-full rounded-xl bg-slate-100/50 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-200/50 hover:text-slate-700 active:scale-95">
                        {t('dashboard.quest.showAll')}
                    </button>
                </div>
            </motion.div>

            <div className="group relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-6 shadow-xl backdrop-blur-sm">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl group-hover:bg-blue-400/20 transition-colors" />
                <Lightbulb className="absolute -right-4 -top-4 h-24 w-24 -rotate-12 text-blue-400/10 transition-transform group-hover:rotate-0 group-hover:scale-110" />
                <h3 className="relative z-10 mb-2 font-black text-blue-900 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    {t('dashboard.tip.title')}
                </h3>
                <p className="relative z-10 text-sm font-medium leading-relaxed text-blue-700/80">
                    {t('dashboard.tip.content')}
                </p>
            </div>
        </aside>
    );
}

function QuestItem({
    title,
    progress,
    xp,
    percent,
    completed,
}: {
    title: string;
    progress: string;
    xp: number;
    percent: number;
    completed?: boolean;
}) {
    return (
        <div
            className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all hover:border-primary/50 ${completed ? 'bg-primary/5 border-primary/20 opacity-75' : 'bg-slate-50 border-slate-100'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h5 className={`text-sm font-bold text-slate-900 ${completed ? 'line-through' : ''}`}>
                        {title}
                    </h5>
                    <p className="text-xs text-slate-500">{progress}</p>
                </div>
                {completed ? (
                    <span className="flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        <CheckCircle2 size={10} /> DONE
                    </span>
                ) : (
                    <span className="flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
                        <Star size={10} className="fill-yellow-500" /> {xp}
                    </span>
                )}
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className="h-full rounded-full bg-primary"
                />
            </div>
        </div>
    );
}
