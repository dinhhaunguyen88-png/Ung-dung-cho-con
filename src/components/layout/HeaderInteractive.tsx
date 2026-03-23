import { AnimatePresence, motion } from 'motion/react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BookOpen,
    Check,
    Dog,
    Home,
    LogOut,
    Moon,
    Save,
    School,
    Settings,
    Star,
    Sun,
    Trophy,
    UserRound,
    X,
} from 'lucide-react';
import type { User } from '../../hooks/useUser';
import i18n from '../../i18n';
import type { Screen } from '../../types';
import { PET_COLORS, PET_INFO } from '../../types/pet';
import { PetAvatar } from '../pet/PetAvatar';
import type { PetConfig, PetType } from '../../types/pet';

function isPetType(value: unknown): value is PetType {
    return value === 'dragon' || value === 'cat' || value === 'dog' || value === 'bunny';
}

function getProfilePetType(user?: User | null, pet?: PetConfig | null): PetType {
    if (pet?.type && isPetType(pet.type)) {
        return pet.type;
    }

    if (user?.avatar && isPetType(user.avatar)) {
        return user.avatar;
    }

    return 'dragon';
}

function getProfilePetColor(user?: User | null, pet?: PetConfig | null): string {
    return pet?.color || user?.avatar_color || '#30e86e';
}

export function HeaderInteractive({
    currentScreen,
    setCurrentScreen,
    stars,
    onOpenShop,
    user,
    pet,
    onSaveSettings,
    onLogout,
}: {
    currentScreen: Screen;
    setCurrentScreen: (screen: Screen) => void;
    stars: number;
    onOpenShop?: () => void;
    user?: User | null;
    pet?: PetConfig | null;
    onSaveSettings?: (input: {
        name: string;
        petName: string;
        petType: PetType;
        petColor: string;
    }) => Promise<void>;
    onLogout?: () => void;
}) {
    const { t } = useTranslation();
    const isVi = i18n.language === 'vi';
    const [isDark, setIsDark] = useState(() => localStorage.getItem('math-buddy-dark') === 'true');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [displayName, setDisplayName] = useState(user?.name || '');
    const [petName, setPetName] = useState(pet?.name || '');
    const [petType, setPetType] = useState<PetType>(getProfilePetType(user, pet));
    const [petColor, setPetColor] = useState(getProfilePetColor(user, pet));
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('math-buddy-dark', String(isDark));
    }, [isDark]);

    useEffect(() => {
        if (!isSettingsOpen) return;
        setDisplayName(user?.name || '');
        setPetName(pet?.name || '');
        setPetType(getProfilePetType(user, pet));
        setPetColor(getProfilePetColor(user, pet));
        setSaveMessage(null);
        setSaveError(null);
    }, [isSettingsOpen]);

    useEffect(() => {
        setIsProfileMenuOpen(false);
    }, [currentScreen]);

    const toggleLang = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
        localStorage.setItem('math-buddy-lang', newLang);
    };

    const profileType = useMemo(() => getProfilePetType(user, pet), [pet, user]);
    const profileColor = useMemo(() => getProfilePetColor(user, pet), [pet, user]);
    const profileName = user?.name || (isVi ? 'Hoc sinh' : 'Student');
    const profilePetName = pet?.name || (isVi ? 'Pet cua ban' : 'Your pet');
    const profileLevel = pet?.level || user?.level || 1;
    const settingsPreviewType = isSettingsOpen ? petType : profileType;
    const settingsPreviewColor = isSettingsOpen ? petColor : profileColor;

    const openSettings = () => {
        setIsProfileMenuOpen(false);
        setIsSettingsOpen(true);
    };

    const handleSaveSettings = async () => {
        const nextName = displayName.trim();
        const nextPetName = petName.trim();

        if (!nextName) {
            setSaveError(isVi ? 'Ten hoc sinh khong duoc de trong.' : 'Student name is required.');
            setSaveMessage(null);
            return;
        }

        if (!nextPetName) {
            setSaveError(isVi ? 'Ten pet khong duoc de trong.' : 'Pet name is required.');
            setSaveMessage(null);
            return;
        }

        if (!onSaveSettings) {
            setSaveError(isVi ? 'Tinh nang luu chua san sang.' : 'Saving is not available yet.');
            setSaveMessage(null);
            return;
        }

        try {
            setIsSaving(true);
            setSaveError(null);
            await onSaveSettings({
                name: nextName,
                petName: nextPetName,
                petType,
                petColor,
            });
            setSaveMessage(isVi ? 'Da luu thay doi thanh cong.' : 'Changes saved successfully.');
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : (isVi ? 'Khong the luu thay doi.' : 'Could not save changes.'));
            setSaveMessage(null);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-3 z-50 mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-[1600px] items-center justify-between rounded-[26px] border border-white/60 bg-white/82 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:w-[calc(100%-2rem)] lg:px-6"
            >
                <div className="flex items-center gap-2.5">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="rounded-2xl bg-gradient-to-br from-primary to-emerald-500 p-2 text-white shadow-lg shadow-primary/25"
                    >
                        <School size={22} />
                    </motion.div>
                    <h2 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-lg font-black tracking-tight text-transparent sm:text-xl">
                        {t('app.name')}
                    </h2>
                </div>

                <nav className="hidden flex-1 justify-center gap-2.5 md:flex">
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

                <div className="relative flex items-center gap-2.5">
                    <button
                        onClick={toggleLang}
                        className="flex items-center rounded-full border border-primary/20 bg-white/60 px-3 py-1.5 text-[13px] font-black text-primary shadow-sm transition-all hover:bg-primary/10 active:scale-95"
                    >
                        {i18n.language === 'vi' ? 'VN VI' : 'EN US'}
                    </button>
                    <button
                        onClick={() => setIsDark((value) => !value)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/60 text-slate-600 shadow-sm transition-all hover:bg-slate-100 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-yellow-400"
                        title={isDark ? 'Light mode' : 'Dark mode'}
                    >
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        onClick={onOpenShop}
                        className="flex items-center rounded-full border border-yellow-200 bg-yellow-400/20 px-3.5 py-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                    >
                        <Star size={18} className="mr-1 animate-pulse fill-yellow-500 text-yellow-600" />
                        <motion.span
                            key={stars}
                            initial={{ scale: 1.5, color: '#f59e0b' }}
                            animate={{ scale: 1, color: '#a16207' }}
                            className="text-sm font-black text-yellow-700"
                        >
                            {stars.toLocaleString()}
                        </motion.span>
                    </button>
                    <motion.button
                        whileHover={{ rotate: 90 }}
                        onClick={openSettings}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/60 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                        title={isVi ? 'Cai dat' : 'Settings'}
                    >
                        <Settings size={18} />
                    </motion.button>
                    {user && (
                        <button
                            onClick={() => setIsProfileMenuOpen((open) => !open)}
                            className="group flex items-center gap-2.5 rounded-[20px] border border-primary/20 bg-white/88 px-1.5 py-1 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="hidden min-w-0 sm:block">
                                <p className="truncate text-sm font-black text-slate-900">{profileName}</p>
                                <p className="truncate text-xs font-medium text-slate-500">{profilePetName}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/40 bg-white ring-1 ring-primary/15">
                                <PetAvatar
                                    type={profileType}
                                    color={profileColor}
                                    level={profileLevel}
                                    size={34}
                                />
                            </div>
                        </button>
                    )}

                    <AnimatePresence>
                        {isProfileMenuOpen && user && (
                            <motion.div
                                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                className="absolute right-0 top-[calc(100%+12px)] z-50 w-80 overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-3 shadow-2xl backdrop-blur-xl"
                            >
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-white">
                                            <PetAvatar
                                                type={profileType}
                                                color={profileColor}
                                                level={profileLevel}
                                                size={48}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-base font-black text-slate-900">{profileName}</p>
                                            <p className="truncate text-sm text-slate-500">{profilePetName}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                                            {isVi ? `Cap ${profileLevel}` : `Level ${profileLevel}`}
                                        </span>
                                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                                            {stars.toLocaleString()} {isVi ? 'sao' : 'stars'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <ProfileAction
                                        icon={<UserRound size={16} />}
                                        label={isVi ? 'Chinh sua ten va ho so' : 'Edit name and profile'}
                                        onClick={openSettings}
                                    />
                                    <ProfileAction
                                        icon={<Dog size={16} />}
                                        label={isVi ? 'Mo phong Pet' : 'Open pet room'}
                                        onClick={() => {
                                            setCurrentScreen('pet-room');
                                            setIsProfileMenuOpen(false);
                                        }}
                                    />
                                    <ProfileAction
                                        icon={<Trophy size={16} />}
                                        label={isVi ? 'Xem bang xep hang' : 'Open leaderboard'}
                                        onClick={() => {
                                            setCurrentScreen('leaderboard');
                                            setIsProfileMenuOpen(false);
                                        }}
                                    />
                                    {onLogout && (
                                        <ProfileAction
                                            icon={<LogOut size={16} />}
                                            label={isVi ? 'Dang xuat' : 'Log out'}
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                onLogout();
                                            }}
                                            variant="danger"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.header>

            <AnimatePresence>
                {isSettingsOpen && (
                    <>
                        <motion.button
                            type="button"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="fixed inset-0 z-[60] bg-slate-900/30 backdrop-blur-sm"
                        />
                        <motion.section
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            className="fixed inset-x-4 top-24 z-[70] mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="border-b border-slate-100 bg-gradient-to-r from-primary/8 via-white to-emerald-500/10 px-6 py-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-[0.2em] text-primary/70">
                                            SETTINGS
                                        </p>
                                        <h3 className="mt-1 text-2xl font-black text-slate-900">
                                            {isVi ? 'Ho so va cai dat' : 'Profile and settings'}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {isVi
                                                ? 'Chinh ten hoc sinh, ten pet va cac tuy chon giao dien ngay trong app.'
                                                : 'Edit the student name, pet name, and preferences directly in the app.'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsSettingsOpen(false)}
                                        className="rounded-full bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6 px-6 py-6">
                                <div className="grid gap-4 md:grid-cols-[auto,1fr]">
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-primary/15 bg-slate-50">
                                        <PetAvatar
                                            type={settingsPreviewType}
                                            color={settingsPreviewColor}
                                            level={profileLevel}
                                            size={72}
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="space-y-2">
                                            <span className="text-sm font-black text-slate-700">
                                                {isVi ? 'Ten hoc sinh' : 'Student name'}
                                            </span>
                                            <input
                                                value={displayName}
                                                onChange={(event) => setDisplayName(event.target.value)}
                                                placeholder={isVi ? 'Nhap ten hoc sinh' : 'Enter student name'}
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />
                                        </label>
                                        <label className="space-y-2">
                                            <span className="text-sm font-black text-slate-700">
                                                {isVi ? 'Ten pet' : 'Pet name'}
                                            </span>
                                            <input
                                                value={petName}
                                                onChange={(event) => setPetName(event.target.value)}
                                                placeholder={isVi ? 'Nhap ten pet' : 'Enter pet name'}
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-sm font-black text-slate-900">{isVi ? 'Loai pet' : 'Pet type'}</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {isVi ? 'Chon nhan vat pet hien trong avatar va pet room.' : 'Choose which pet appears in the avatar and pet room.'}
                                        </p>
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            {(Object.keys(PET_INFO) as PetType[]).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setPetType(type)}
                                                    className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                                                        petType === type
                                                            ? 'border-primary bg-primary/8 shadow-sm'
                                                            : 'border-slate-200 bg-white hover:border-primary/30 hover:bg-primary/5'
                                                    }`}
                                                >
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
                                                        <PetAvatar
                                                            type={type}
                                                            color={petColor}
                                                            level={profileLevel}
                                                            size={32}
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-black text-slate-900">
                                                            {isVi ? PET_INFO[type].nameVi : PET_INFO[type].name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {PET_INFO[type].emoji}
                                                        </p>
                                                    </div>
                                                    {petType === type && <Check size={16} className="text-primary" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-sm font-black text-slate-900">{isVi ? 'Mau pet' : 'Pet color'}</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {isVi ? 'Doi mau va xem truoc ngay trong khung ho so.' : 'Change the color and preview it directly in the profile card.'}
                                        </p>
                                        <div className="mt-4 grid grid-cols-4 gap-3">
                                            {PET_COLORS.map((colorOption) => (
                                                <button
                                                    key={colorOption.id}
                                                    onClick={() => setPetColor(colorOption.value)}
                                                    className={`relative flex aspect-square items-center justify-center rounded-2xl border-2 transition-transform hover:scale-105 ${
                                                        petColor === colorOption.value
                                                            ? 'border-slate-900 shadow-lg'
                                                            : 'border-transparent hover:border-slate-200'
                                                    }`}
                                                    style={{ backgroundColor: colorOption.value }}
                                                    title={colorOption.id}
                                                >
                                                    {petColor === colorOption.value && (
                                                        <Check size={18} className="text-white drop-shadow-md" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-sm font-black text-slate-900">{isVi ? 'Ngon ngu' : 'Language'}</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {isVi ? 'Chuyen nhanh giua tieng Viet va tieng Anh.' : 'Quickly switch between Vietnamese and English.'}
                                        </p>
                                        <button
                                            onClick={toggleLang}
                                            className="mt-4 rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm font-black text-primary transition-colors hover:bg-primary/5"
                                        >
                                            {i18n.language === 'vi' ? 'Dang dung: Tieng Viet' : 'Current: English'}
                                        </button>
                                    </div>
                                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-sm font-black text-slate-900">{isVi ? 'Giao dien' : 'Appearance'}</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {isVi ? 'Bat tat che do sang toi ngay tai day.' : 'Toggle light and dark mode directly here.'}
                                        </p>
                                        <button
                                            onClick={() => setIsDark((value) => !value)}
                                            className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition-colors hover:bg-slate-100"
                                        >
                                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                                            {isDark
                                                ? (isVi ? 'Dang o dark mode' : 'Dark mode enabled')
                                                : (isVi ? 'Dang o light mode' : 'Light mode enabled')}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <button
                                        onClick={() => {
                                            setCurrentScreen('pet-room');
                                            setIsSettingsOpen(false);
                                        }}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        {isVi ? 'Mo phong Pet' : 'Open pet room'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCurrentScreen('leaderboard');
                                            setIsSettingsOpen(false);
                                        }}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        {isVi ? 'Mo bang xep hang' : 'Open leaderboard'}
                                    </button>
                                </div>

                                {saveError && (
                                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                                        {saveError}
                                    </div>
                                )}
                                {saveMessage && (
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                        {saveMessage}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                                <p className="text-sm text-slate-500">
                                    {isVi ? 'Thong tin se duoc luu vao tai khoan hien tai.' : 'Changes are saved to the current account.'}
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsSettingsOpen(false)}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition-colors hover:bg-slate-100"
                                    >
                                        {isVi ? 'Dong' : 'Close'}
                                    </button>
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={isSaving || !user}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Save size={16} />
                                        {isSaving
                                            ? (isVi ? 'Dang luu...' : 'Saving...')
                                            : (isVi ? 'Luu thay doi' : 'Save changes')}
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function ProfileAction({
    icon,
    label,
    onClick,
    variant = 'default',
}: {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
}) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition-colors ${
                variant === 'danger'
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function NavButton({
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
            className={`group relative flex items-center gap-2 rounded-full px-3.5 py-2 text-[15px] font-bold transition-all ${
                active
                    ? 'text-primary'
                    : 'text-slate-500 hover:text-slate-900'
            }`}
        >
            {active && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary/10"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                />
            )}
            <span className="relative z-10 transition-transform group-active:scale-90">
                {icon}
            </span>
            <span className="relative z-10">{label}</span>
        </button>
    );
}
