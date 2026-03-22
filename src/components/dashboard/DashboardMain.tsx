import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
    BookOpen,
    BrainCircuit,
    Languages,
    Utensils,
    Heart,
    Gamepad2,
    Star,
    Users,
    ClipboardList,
    Clock3,
} from 'lucide-react';
import { PetAvatar } from '../pet/PetAvatar';
import { PET_INFO } from '../../types/pet';
import type { PetConfig } from '../../types/pet';
import {
    getServerStatus,
    getQuestionCounts,
    getStudentAssignments,
    type QuestionCounts,
    type ServerStatus,
    type StudentAssignmentData,
} from '../../services/api';

export function DashboardMain({
    pet,
    userId,
    onFeed,
    onPlay,
    onStartQuest,
    onStartAssignment,
    onJoinClass,
}: {
    pet: PetConfig;
    userId?: string;
    onFeed: () => void;
    onPlay: () => void;
    onStartQuest: (subject: string) => void;
    onStartAssignment: (assignment: StudentAssignmentData) => void;
    onJoinClass: () => void;
}) {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const [assignments, setAssignments] = useState<StudentAssignmentData[]>([]);
    const [assignmentsLoading, setAssignmentsLoading] = useState(false);
    const [questionCounts, setQuestionCounts] = useState<QuestionCounts | null>(null);
    const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

    useEffect(() => {
        if (!userId) {
            setAssignments([]);
            return;
        }

        let cancelled = false;

        const loadAssignments = async () => {
            setAssignmentsLoading(true);
            try {
                const data = await getStudentAssignments(userId);
                if (!cancelled) {
                    setAssignments(data);
                }
            } catch (err) {
                console.error('Failed to fetch student assignments:', err);
                if (!cancelled) {
                    setAssignments([]);
                }
            } finally {
                if (!cancelled) {
                    setAssignmentsLoading(false);
                }
            }
        };

        loadAssignments();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    useEffect(() => {
        let cancelled = false;

        const loadQuestionCounts = async () => {
            try {
                const data = await getQuestionCounts();
                if (!cancelled) {
                    setQuestionCounts(data);
                }
            } catch (err) {
                console.error('Failed to fetch question counts:', err);
                if (!cancelled) {
                    setQuestionCounts(null);
                }
            }
        };

        loadQuestionCounts();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadServerStatus = async () => {
            try {
                const data = await getServerStatus();
                if (!cancelled) {
                    setServerStatus(data);
                }
            } catch (err) {
                console.error('Failed to fetch server status:', err);
                if (!cancelled) {
                    setServerStatus(null);
                }
            }
        };

        loadServerStatus();

        return () => {
            cancelled = true;
        };
    }, []);

    const serverWarnings = [
        serverStatus?.supabase.error,
        serverStatus?.supabase.warning,
        serverStatus?.auth.warning,
    ].filter((message): message is string => Boolean(message));
    const missingEnvVars = Array.from(new Set([
        ...(serverStatus?.supabase.missingVars ?? []),
        ...(serverStatus?.auth.missingVars ?? []),
    ]));

    const supabaseStatusLabel = !serverStatus
        ? ''
        : serverStatus.supabase.accessMode === 'service_role'
            ? 'service role'
            : serverStatus.supabase.accessMode === 'anon'
                ? 'anon fallback'
                : isVi
                    ? 'thieu cau hinh'
                    : 'missing config';

    return (
        <section className="flex flex-1 flex-col gap-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative min-h-[500px] flex-1 overflow-hidden rounded-3xl border-4 border-white/50 bg-gradient-to-b from-blue-400/20 to-emerald-400/20 shadow-2xl backdrop-blur-sm"
            >
                {/* Dynamic Background Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/20 blur-3xl animate-pulse" />
                    <div className="absolute right-20 top-40 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                </div>

                {/* The Island */}
                <div className="absolute inset-0 flex items-center justify-center island-float">
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="h-32 w-80 translate-y-24 scale-x-125 rounded-full bg-emerald-600 opacity-20 blur-xl"
                        />
                        <div className="relative flex h-32 w-80 items-end justify-center overflow-hidden rounded-full border-b-[12px] border-emerald-900 bg-gradient-to-b from-emerald-400 to-emerald-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                            <div className="absolute top-0 h-10 w-full bg-gradient-to-b from-white/30 to-transparent" />
                            <div className="mb-4">
                                <PetAvatar
                                    type={pet.type}
                                    color={pet.color}
                                    level={pet.level}
                                    size={180}
                                    accessories={pet.equippedAccessories}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pet Status UI */}
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="w-72 space-y-4 rounded-2xl glass-card p-5"
                    >
                        <div className="flex items-center justify-between border-b border-slate-200/20 pb-2">
                            <h4 className="font-black text-slate-900">{pet.name}</h4>
                            <span className="rounded-lg bg-orange-400/20 px-2.5 py-1 text-[10px] font-black uppercase text-orange-700 ring-1 ring-orange-400/30">
                                {isVi ? PET_INFO[pet.type].nameVi : PET_INFO[pet.type].name}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <StatusProgress
                                label={t('dashboard.pet.hunger')}
                                value={80}
                                color="bg-gradient-to-r from-rose-500 to-red-400"
                                icon={<Utensils size={14} className="text-rose-500" />}
                            />
                            <StatusProgress
                                label={t('dashboard.pet.happiness')}
                                value={95}
                                color="bg-gradient-to-r from-amber-400 to-orange-400"
                                icon={<Heart size={14} className="text-orange-500" />}
                            />
                        </div>
                    </motion.div>
                    <div className="flex flex-col gap-4">
                        <PetActionButton
                            onClick={onFeed}
                            icon={<Utensils size={32} />}
                            label={t('dashboard.pet.feed')}
                            color="bg-rose-50 text-rose-500 shadow-rose-200/50"
                        />
                        <PetActionButton
                            onClick={onPlay}
                            icon={<Gamepad2 size={32} />}
                            label={t('dashboard.pet.play')}
                            color="bg-sky-50 text-sky-500 shadow-sky-200/50"
                        />
                    </div>
                </div>
            </motion.div>

            {(assignmentsLoading || assignments.length > 0) && (
                <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">{t('assignments.title')}</h3>
                                <p className="text-sm text-slate-500">
                                    {assignmentsLoading
                                        ? t('assignments.loading')
                                        : `${assignments.length} ${t('assignments.available')}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {assignmentsLoading ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {[0, 1].map((i) => (
                                <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {assignments.slice(0, 3).map((assignment) => (
                                <motion.div
                                    key={assignment.id}
                                    whileHover={{ y: -4 }}
                                    className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wider text-primary">
                                                {assignment.class_name}
                                            </p>
                                            <h4 className="mt-1 text-lg font-black text-slate-900">{assignment.title}</h4>
                                        </div>
                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm">
                                            {t(`assignments.${assignment.subject}`)}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-500">
                                        <p>
                                            {assignment.topic || t('assignments.noTopic')}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Clock3 size={14} />
                                            <span>
                                                {assignment.due_date
                                                    ? t('assignments.due', { date: new Date(assignment.due_date).toLocaleDateString() })
                                                    : t('assignments.noDue')}
                                            </span>
                                        </div>
                                        <p>{t('assignments.questions', { count: assignment.question_count })}</p>
                                    </div>

                                    <button
                                        onClick={() => onStartAssignment(assignment)}
                                        className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95"
                                    >
                                        {t('assignments.startAssignment')}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {serverWarnings.length > 0 && (
                <section className="rounded-3xl border border-amber-200 bg-amber-50/90 p-6 shadow-lg backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                            <Clock3 size={24} />
                        </div>
                        <div className="space-y-2">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    {isVi ? 'Trang thai backend' : 'Backend status'}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {isVi
                                        ? `Supabase dang chay o che do ${supabaseStatusLabel}`
                                        : `Supabase is currently running in ${supabaseStatusLabel} mode`}
                                </p>
                            </div>

                            <div className="space-y-2 text-sm text-slate-700">
                                {serverWarnings.map((warning) => (
                                    <p key={warning} className="rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                                        {warning}
                                    </p>
                                ))}
                                {missingEnvVars.length > 0 && (
                                    <p className="rounded-2xl bg-white/70 px-4 py-3 font-mono text-xs shadow-sm">
                                        Missing env: {missingEnvVars.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {questionCounts && (
                <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    {isVi ? 'Ngan hang cau hoi' : 'Question Bank'}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {isVi
                                        ? `${questionCounts.total} cau hoi san sang`
                                        : `${questionCounts.total} questions ready`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <QuestionBankCard
                            icon={<BookOpen size={22} />}
                            label={t('assignments.math')}
                            count={questionCounts.bySubject.math}
                            accent="bg-emerald-100 text-emerald-600"
                            countLabel={isVi ? 'cau hoi' : 'questions'}
                        />
                        <QuestionBankCard
                            icon={<Languages size={22} />}
                            label={t('assignments.vietnamese')}
                            count={questionCounts.bySubject.vietnamese}
                            accent="bg-violet-100 text-violet-600"
                            countLabel={isVi ? 'cau hoi' : 'questions'}
                        />
                        <QuestionBankCard
                            icon={<Languages size={22} />}
                            label={t('assignments.english')}
                            count={questionCounts.bySubject.english}
                            accent="bg-sky-100 text-sky-600"
                            countLabel={isVi ? 'cau hoi' : 'questions'}
                        />
                        <QuestionBankCard
                            icon={<BrainCircuit size={22} />}
                            label={t('assignments.science')}
                            count={questionCounts.bySubject.science}
                            accent="bg-orange-100 text-orange-600"
                            countLabel={isVi ? 'cau hoi' : 'questions'}
                        />
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ActivityCard
                    icon={<BookOpen size={32} />}
                    title={t('dashboard.activity.mathPractice')}
                    subtitle={t('dashboard.activity.addSubtract')}
                    action={t('dashboard.activity.startTraining')}
                    color="bg-emerald-100 text-emerald-600 shadow-emerald-100"
                    onClick={() => onStartQuest('math')}
                />
                <ActivityCard
                    icon={<BrainCircuit size={32} />}
                    title={t('dashboard.activity.vietnamesePractice')}
                    subtitle={t('dashboard.activity.readingWriting')}
                    action={t('dashboard.activity.startTraining')}
                    color="bg-purple-100 text-purple-600 shadow-purple-100"
                    onClick={() => onStartQuest('vietnamese')}
                />
                <ActivityCard
                    icon={<Star size={32} />}
                    title={t('dashboard.activity.currentChapter')}
                    subtitle={t('dashboard.activity.numbersTo1000')}
                    action={t('dashboard.activity.continueLesson')}
                    color="bg-blue-100 text-blue-600 shadow-blue-100"
                    onClick={() => onStartQuest('math')}
                />
                <ActivityCard
                    icon={<BrainCircuit size={32} />}
                    title={t('dashboard.activity.sciencePractice')}
                    subtitle={t('dashboard.activity.scienceTopics')}
                    action={t('dashboard.activity.startTraining')}
                    color="bg-orange-100 text-orange-600 shadow-orange-100"
                    onClick={() => onStartQuest('science')}
                />
                <ActivityCard
                    icon={<Users size={32} />}
                    title={t('joinClass.title')}
                    subtitle={t('joinClass.subtitle')}
                    action={t('joinClass.submit')}
                    color="bg-slate-100 text-slate-600 shadow-slate-100"
                    onClick={onJoinClass}
                />
            </div>
        </section>
    );
}

function QuestionBankCard({
    icon,
    label,
    count,
    accent,
    countLabel,
}: {
    icon: ReactNode;
    label: string;
    count: number;
    accent: string;
    countLabel: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className={`rounded-2xl p-3 ${accent}`}>
                    {icon}
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">
                    {count}
                </span>
            </div>
            <p className="text-sm font-bold text-slate-900">{label}</p>
            <p className="mt-1 text-xs text-slate-500">
                {count} {countLabel}
            </p>
        </div>
    );
}

function StatusProgress({
    label,
    value,
    color,
    icon,
}: {
    label: string;
    value: number;
    color: string;
    icon: ReactNode;
}) {
    return (
        <div>
            <div className="mb-1 flex justify-between text-xs">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                    {icon} {label}
                </span>
                <span className="font-bold text-slate-900">{value}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    );
}

function PetActionButton({
    onClick,
    icon,
    label,
    color,
}: {
    onClick: () => void;
    icon: ReactNode;
    label: string;
    color: string;
}) {
    return (
        <button onClick={onClick} className="group flex flex-col items-center gap-1">
            <div
                className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-lg transition-all group-hover:scale-110 group-active:scale-95 ${color}`}
            >
                {icon}
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-sm">
                {label}
            </span>
        </button>
    );
}

function ActivityCard({
    icon,
    title,
    subtitle,
    action,
    color,
    onClick,
}: {
    icon: ReactNode;
    title: string;
    subtitle: string;
    action: string;
    color: string;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-5 rounded-xl border border-slate-100 bg-white p-6 shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
        >
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-900">{title}</h4>
                <p className="text-sm text-slate-500">{subtitle}</p>
                <button className="mt-1 inline-block text-xs font-bold text-primary hover:underline">
                    {action}
                </button>
            </div>
        </div>
    );
}
