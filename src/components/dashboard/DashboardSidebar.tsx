import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    ShoppingBag,
    Star,
} from 'lucide-react';

export function DashboardSidebar({
    xp,
    level,
    onOpenShop,
}: {
    xp: number;
    level: number;
    onOpenShop: () => void;
}) {
    const { t } = useTranslation();
    const xpTarget = Math.max(level * 200, 200);

    return (
        <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-72">
            <motion.div
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-6 transition-all"
            >
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 text-xl font-black text-white shadow-lg shadow-primary/20">
                        {level}
                        <div className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-emerald-300 opacity-75" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900">{t('dashboard.level', { level })}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('dashboard.levelTitle')}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="mb-1 flex justify-between px-1 text-[10px] font-black uppercase tracking-wider">
                        <span className="text-slate-400">{t('dashboard.experience')}</span>
                        <span className="text-primary">{t('dashboard.xpProgress', { current: xp, max: xpTarget })}</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 p-1 ring-1 ring-slate-200/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((xp / xpTarget) * 100, 100)}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 animate-gradient shadow-sm"
                        />
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col gap-1.5 glass-card rounded-2xl p-2">
                <SidebarNavButton active icon={<LayoutDashboard size={20} />} label={t('dashboard.sidebar.dashboard')} />
                <SidebarNavButton icon={<BookOpen size={20} />} label={t('dashboard.sidebar.curriculum')} />
                <SidebarNavButton icon={<Trophy size={20} />} label={t('dashboard.sidebar.achievements')} />
                <SidebarNavButton icon={<ShoppingBag size={20} />} label={t('dashboard.sidebar.petShop')} />
            </div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-dragon-orange to-orange-600 p-6 text-white shadow-2xl animate-gradient"
            >
                <div className="relative z-10">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-100">{t('dashboard.promo.newArrival')}</p>
                    <h4 className="mb-4 text-xl font-black leading-tight">{t('dashboard.promo.dragonWings')}</h4>
                    <button
                        onClick={onOpenShop}
                        className="rounded-xl bg-white px-5 py-2.5 text-sm font-black text-orange-600 shadow-xl shadow-orange-900/20 transition-all hover:bg-orange-50 active:scale-95"
                    >
                        {t('dashboard.promo.viewShop')}
                    </button>
                </div>
                <ShoppingBag className="absolute -bottom-6 -right-6 h-32 w-32 rotate-12 opacity-20 transition-transform group-hover:scale-125 group-hover:rotate-0" />
            </motion.div>
        </aside>
    );
}

function SidebarNavButton({
    active,
    icon,
    label,
}: {
    active?: boolean;
    icon: ReactNode;
    label: string;
}) {
    return (
        <button
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all ${active ? 'bg-primary/10 font-bold text-primary' : 'text-slate-600 hover:bg-slate-50'
                }`}
        >
            {icon} {label}
        </button>
    );
}
