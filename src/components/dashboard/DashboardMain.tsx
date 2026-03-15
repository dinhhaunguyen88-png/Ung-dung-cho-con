import { ReactNode } from 'react';
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
} from 'lucide-react';
import { PetAvatar } from '../pet/PetAvatar';
import { PET_INFO } from '../../types/pet';
import type { PetConfig } from '../../types/pet';

export function DashboardMain({
    pet,
    onFeed,
    onPlay,
    onStartQuest,
    onJoinClass,
}: {
    pet: PetConfig;
    onFeed: () => void;
    onPlay: () => void;
    onStartQuest: (subject: string) => void;
    onJoinClass: () => void;
}) {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';

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
                    icon={<Languages size={32} />}
                    title={t('dashboard.activity.englishPractice')}
                    subtitle={t('dashboard.activity.vocabGrammar')}
                    action={t('dashboard.activity.startTraining')}
                    color="bg-teal-100 text-teal-600 shadow-teal-100"
                    onClick={() => onStartQuest('english')}
                />
                <ActivityCard
                    icon={<Users size={32} />}
                    title={t('joinClass.title')}
                    subtitle={t('joinClass.subtitle')}
                    action={t('joinClass.submit')}
                    color="bg-orange-100 text-orange-600 shadow-orange-100"
                    onClick={onJoinClass}
                />
            </div>
        </section>
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
