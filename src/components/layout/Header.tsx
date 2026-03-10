import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Home,
    BookOpen,
    Dog,
    Users,
    Settings,
    Star,
    School,
    Trophy,
} from 'lucide-react';
import type { Screen } from '../../types';
import i18n from '../../i18n';

export function Header({
    currentScreen,
    setCurrentScreen,
    stars,
}: {
    currentScreen: Screen;
    setCurrentScreen: (s: Screen) => void;
    stars: number;
}) {
    const { t } = useTranslation();

    const toggleLang = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
        localStorage.setItem('math-buddy-lang', newLang);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-4 z-50 mx-auto mt-4 flex w-[95%] items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-6 py-4 backdrop-blur-lg shadow-xl lg:px-10"
        >
            <div className="flex items-center gap-3">
                <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="rounded-xl bg-gradient-to-br from-primary to-emerald-500 p-2 text-white shadow-lg shadow-primary/30"
                >
                    <School size={24} />
                </motion.div>
                <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    {t('app.name')}
                </h2>
            </div>

            <nav className="hidden flex-1 justify-center gap-4 md:flex">
                <NavButton
                    active={currentScreen === 'dashboard'}
                    onClick={() => setCurrentScreen('dashboard')}
                    icon={<Home size={20} />}
                    label={t('nav.home')}
                />
                <NavButton
                    active={currentScreen === 'learning'}
                    onClick={() => setCurrentScreen('learning')}
                    icon={<BookOpen size={20} />}
                    label={t('nav.learning')}
                />
                <NavButton
                    active={currentScreen === 'pet-room'}
                    onClick={() => setCurrentScreen('pet-room')}
                    icon={<Dog size={20} />}
                    label={t('nav.petRoom')}
                />
                <NavButton
                    active={currentScreen === 'leaderboard'}
                    onClick={() => setCurrentScreen('leaderboard')}
                    icon={<Trophy size={20} />}
                    label={t('nav.leaderboard')}
                />
            </nav>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleLang}
                    className="flex items-center rounded-full border border-primary/20 bg-white/50 px-3 py-1.5 text-sm font-bold text-primary shadow-sm transition-all hover:bg-primary/10 active:scale-95"
                >
                    {i18n.language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
                </button>
                <div className="flex items-center rounded-full border border-yellow-200 bg-yellow-400/20 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                    <Star size={18} className="mr-1 fill-yellow-500 text-yellow-600 animate-pulse" />
                    <span className="text-sm font-black text-yellow-700">{stars.toLocaleString()}</span>
                </div>
                <motion.button
                    whileHover={{ rotate: 90 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/50 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                >
                    <Settings size={20} />
                </motion.button>
                <div className="group relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-primary ring-2 ring-primary/20 transition-all hover:scale-110">
                    <img
                        src="https://picsum.photos/seed/student/100/100"
                        alt="Avatar"
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </div>
        </motion.header>
    );
}

export function NavButton({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`group relative flex items-center gap-2 rounded-xl px-4 py-2 font-bold transition-all ${active
                ? 'text-primary'
                : 'text-slate-500 hover:text-slate-900'
                }`}
        >
            {active && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                />
            )}
            <span className={`relative z-10 transition-transform group-active:scale-90`}>
                {icon}
            </span>
            <span className="relative z-10">{label}</span>
        </button>
    );
}
