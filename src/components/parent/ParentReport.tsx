import { useTranslation } from 'react-i18next';
import {
    Trophy,
    CheckCircle2,
    TrendingUp,
    BrainCircuit,
    History,
    Lightbulb,
    Share2,
    Gamepad2,
} from 'lucide-react';

export function ParentReport() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">{t('parentReport.title')}</h1>
                <p className="font-medium text-secondary">{t('parentReport.subtitle')}</p>
            </div>

            {/* Student Profile */}
            <div className="flex flex-col items-center gap-6 rounded-xl border border-primary/10 bg-white p-6 shadow-sm md:flex-row">
                <div className="h-32 w-32 rounded-full border-4 border-primary/20 p-1">
                    <img
                        src="https://picsum.photos/seed/kid/200/200"
                        alt="Student"
                        className="h-full w-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900">{t('parentReport.studentName')}</h2>
                    <div className="mt-2 flex flex-wrap justify-center gap-4 md:justify-start">
                        <div className="flex items-center gap-2 text-secondary">
                            <Trophy size={20} />
                            <span className="font-medium">{t('parentReport.levelExplorer')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-secondary">
                            <CheckCircle2 size={20} />
                            <span className="font-medium">{t('parentReport.questsCompleted', { count: 142 })}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="rounded-lg border border-primary/20 bg-primary/10 px-6 py-2.5 font-bold text-secondary transition-all hover:bg-primary/20">
                        {t('parentReport.viewStats')}
                    </button>
                    <button className="rounded-lg border border-primary/20 p-2.5 text-secondary hover:bg-slate-50">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Learning Progress */}
                <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <TrendingUp className="rounded-lg bg-primary/10 p-2 text-primary" size={40} />
                        <h3 className="text-lg font-bold">{t('parentReport.learningProgress')}</h3>
                    </div>
                    <div className="flex flex-col items-center py-4">
                        <div className="relative h-40 w-40">
                            <svg className="h-full w-full -rotate-90 transform">
                                <circle
                                    className="text-slate-100"
                                    cx="80"
                                    cy="80"
                                    fill="transparent"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                />
                                <circle
                                    className="text-primary"
                                    cx="80"
                                    cy="80"
                                    fill="transparent"
                                    r="70"
                                    stroke="currentColor"
                                    strokeDasharray="440"
                                    strokeDashoffset="154"
                                    strokeWidth="12"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-900">65%</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                                    {t('parentReport.complete')}
                                </span>
                            </div>
                        </div>
                        <div className="mt-8 w-full space-y-4">
                            <ProgressRow label={t('parentReport.numbersTo1000')} value={90} />
                            <ProgressRow label={t('parentReport.geometryMeasurement')} value={45} />
                            <ProgressRow label={t('parentReport.englishVocabulary')} value={70} />
                            <ProgressRow label={t('parentReport.englishGrammar')} value={55} />
                        </div>
                    </div>
                </div>

                {/* Performance Analysis */}
                <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <BrainCircuit className="rounded-lg bg-blue-100 p-2 text-blue-600" size={40} />
                        <h3 className="text-lg font-bold">{t('parentReport.performanceAnalysis')}</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">
                                {t('parentReport.keyStrengths')}
                            </h4>
                            <div className="space-y-3">
                                <StrengthItem title={t('parentReport.additionWithin100')} level={t('parentReport.advanced')} />
                                <StrengthItem title={t('parentReport.comparingLengths')} level={t('parentReport.advanced')} />
                                <StrengthItem title={t('parentReport.englishVocabulary')} level={t('parentReport.intermediate')} />
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">
                                {t('parentReport.focusAreas')}
                            </h4>
                            <div className="space-y-3">
                                <FocusItem
                                    title={t('parentReport.identifyingCylinders')}
                                    action={t('parentReport.practiceRecommended')}
                                />
                                <FocusItem
                                    title={t('parentReport.subtractionRegrouping')}
                                    action={t('parentReport.videoSuggested')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <History className="rounded-lg bg-primary/10 p-2 text-secondary" size={40} />
                        <h3 className="text-lg font-bold">{t('parentReport.recentActivity')}</h3>
                    </div>
                    <div className="space-y-4">
                        <ActivityItem
                            title="Shapes Quest #42"
                            time={`${t('parentReport.today')}, 10:45 AM`}
                            xp={50}
                            score="9/10"
                            reward="Silver Star"
                        />
                        <ActivityItem
                            title="Numbers to 500 Review"
                            time={`${t('parentReport.yesterday')}, 4:20 PM`}
                            xp={25}
                            score="10/10"
                        />
                        <button className="w-full py-2 text-sm font-bold text-primary transition-all hover:underline">
                            {t('parentReport.viewAll')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommendation */}
            <div className="flex items-center gap-4 rounded-lg border border-primary/10 bg-primary/5 p-4">
                <Lightbulb className="text-primary" />
                <p className="text-sm leading-relaxed text-secondary">
                    {t('parentReport.recommendation', { defaultValue: '' })}
                    {/* Fallback inline since Trans component would add complexity */}
                    Minh Anh {t('parentReport.advanced').toLowerCase() === 'nâng cao'
                        ? 'học giỏi hơn mức trung bình Lớp 2. Để tiến bộ hơn, hãy khuyến khích bé tập trung vào phần'
                        : 'is performing above average for Grade 2. To further improve, encourage focusing on the'
                    }{' '}
                    <strong>{t('parentReport.geometryMeasurement')}</strong>{' '}
                    {t('parentReport.advanced').toLowerCase() === 'nâng cao' ? 'trong tuần này.' : 'section this week.'}
                </p>
            </div>
        </div>
    );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <div className="mb-1 flex justify-between text-sm font-medium">
                <span>{label}</span>
                <span className="text-primary">{value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-primary" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function StrengthItem({ title, level }: { title: string; level: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <TrendingUp className="text-emerald-600" size={20} />
            <div className="flex-1">
                <p className="text-sm font-bold">{title}</p>
                <p className="text-[10px] font-medium text-emerald-600">Mastery Level: {level}</p>
            </div>
        </div>
    );
}

function FocusItem({ title, action }: { title: string; action: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 p-3">
            <Lightbulb className="text-amber-600" size={20} />
            <div className="flex-1">
                <p className="text-sm font-bold">{title}</p>
                <p className="text-[10px] font-medium text-amber-600">Action: {action}</p>
            </div>
        </div>
    );
}

function ActivityItem({
    title,
    time,
    xp,
    score,
    reward,
}: {
    title: string;
    time: string;
    xp: number;
    score: string;
    reward?: string;
}) {
    return (
        <div className="flex items-start gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                <Gamepad2 size={20} />
            </div>
            <div className="flex-1">
                <div className="flex items-start justify-between">
                    <p className="text-sm font-bold">{title}</p>
                    <span className="text-xs font-bold text-primary">+{xp} XP</span>
                </div>
                <p className="mb-2 text-[10px] text-secondary">{time}</p>
                <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[8px] font-bold text-blue-700">
                        Score: {score}
                    </span>
                    {reward && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[8px] font-bold text-amber-700">
                            Reward: {reward}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
