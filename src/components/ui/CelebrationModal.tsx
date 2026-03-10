import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
    Star,
    Trophy,
    Heart,
    Utensils,
    Ticket,
    ThumbsUp,
} from 'lucide-react';

export function CelebrationModal({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-100/60 p-4 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-[3.5rem] border-8 border-white bg-white/95 p-8 text-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] lg:p-14"
            >
                {/* Decorative Elements */}
                <div className="pointer-events-none absolute inset-0">
                    <Star className="absolute left-10 top-10 animate-bounce text-yellow-400 opacity-60" size={40} />
                    <Star className="absolute right-20 top-20 animate-pulse text-blue-400 opacity-60" size={32} />
                    <Trophy
                        className="absolute bottom-20 left-20 animate-bounce text-pink-400 opacity-60"
                        size={40}
                    />
                    <Heart className="absolute right-10 top-1/2 animate-pulse text-purple-400 opacity-60" size={32} />
                </div>

                <div className="mb-10 flex h-48 items-end justify-center gap-12">
                    <div className="animate-jump-joy relative">
                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-100 shadow-lg">
                            <Utensils size={64} className="text-orange-500" />
                        </div>
                    </div>
                    <div className="relative">
                        <Trophy size={130} className="text-yellow-400 drop-shadow-lg" />
                    </div>
                </div>

                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl font-black tracking-tight text-blue-600 lg:text-5xl">
                        {t('celebration.congratulations', { name: 'Minh Anh' })}
                    </h1>
                    <p className="mx-auto max-w-md text-lg font-medium text-slate-600 lg:text-xl">
                        {t('celebration.weeklyGoal')} <br />
                        <span className="text-2xl font-black text-primary drop-shadow-sm">
                            {t('celebration.achievement', { count: 10 })}
                        </span>
                    </p>
                </div>

                <div className="group relative mb-10 mt-8 overflow-hidden rounded-[2rem] border-2 border-dashed border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-100 p-8 shadow-md">
                    <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
                        {t('celebration.specialGift')}
                    </div>
                    <div className="relative z-10 flex items-center justify-center gap-6">
                        <div className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-inner">
                            <Ticket size={48} className="text-orange-500" />
                        </div>
                        <div className="text-left">
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-600">
                                {t('celebration.parentReward')}
                            </p>
                            <p className="text-2xl font-black leading-tight text-slate-800 lg:text-3xl">
                                {t('celebration.movieTrip')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={onClose}
                        className="animate-extra-bounce group relative flex items-center gap-2 rounded-full border-b-4 border-green-600 bg-primary px-16 py-6 text-3xl font-black text-white shadow-[0_12px_0_0_#22c55e] transition-all duration-75 hover:bg-green-400 active:translate-y-2 active:shadow-none"
                    >
                        {t('celebration.awesome')} <ThumbsUp size={36} />
                    </button>
                    <p className="mt-4 text-sm font-medium text-slate-400">{t('celebration.continueJourney')}</p>
                </div>
            </motion.div>
        </div>
    );
}
