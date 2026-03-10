import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronRight,
    ShoppingBag,
    Palette,
    Sparkles,
    Heart,
    Lock,
    Check,
    Gamepad2,
    Camera,
    Edit3,
} from 'lucide-react';
import { PetAvatar } from './PetAvatar';
import {
    PET_COLORS,
    PET_ACCESSORIES,
    PET_INFO,
    getPetEvolutionStage,
} from '../../types/pet';
import type { PetConfig, PetType } from '../../types/pet';

type Tab = 'customize' | 'accessories' | 'food';

interface PetRoomProps {
    onBack: () => void;
    pet: PetConfig;
    onSetType: (type: PetType) => void;
    onSetColor: (color: string) => void;
    onSetName: (name: string) => void;
    onToggleAccessory: (id: string) => void;
}

export function PetRoom({
    onBack,
    pet,
    onSetType,
    onSetColor,
    onSetName,
    onToggleAccessory,
}: PetRoomProps) {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('customize');
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(pet.name);
    const isVi = i18n.language === 'vi';
    const stage = getPetEvolutionStage(pet.level);

    const handleNameSave = () => {
        if (nameInput.trim()) {
            onSetName(nameInput.trim());
        }
        setIsEditingName(false);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col">
                    <div className="mb-1 flex items-center gap-2">
                        <button onClick={onBack} className="text-sm font-medium text-primary hover:underline">
                            {t('petRoom.breadcrumb')}
                        </button>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-400">{t('petRoom.petCare')}</span>
                    </div>
                    <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
                        {t('petRoom.title')}
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs uppercase tracking-tighter text-blue-600">
                            Level {pet.level}
                        </span>
                        <span className="rounded-md bg-purple-100 px-2 py-1 text-[10px] uppercase tracking-tighter text-purple-600">
                            {stage === 'baby' ? '🥚 Baby' : stage === 'teen' ? '⚡ Teen' : '🌟 Adult'}
                        </span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex w-32 flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                            <span>{t('petRoom.happiness')}</span>
                            <span>85%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full bg-primary" style={{ width: '85%' }} />
                        </div>
                    </div>
                    <div className="flex w-32 flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                            <span>XP</span>
                            <span>{pet.xp}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full bg-yellow-500" style={{ width: `${(pet.xp % 200) / 2}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left: Pet Display */}
                <div className="lg:col-span-7">
                    <div className="relative w-full overflow-hidden rounded-xl border-4 border-white bg-gradient-to-b from-blue-100 via-sky-50 to-green-100 shadow-xl"
                        style={{ minHeight: 420 }}
                    >
                        {/* Background decorations */}
                        <div className="absolute left-5 top-5 h-16 w-24 rounded-full bg-white/50 blur-md" />
                        <div className="absolute right-10 top-10 h-12 w-20 rounded-full bg-white/40 blur-lg" />
                        <div className="absolute bottom-0 left-0 right-0 h-20 rounded-t-[50%] bg-green-300/30" />

                        {/* Pet */}
                        <div className="flex h-full min-h-[420px] items-center justify-center py-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${pet.type}-${pet.color}`}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                >
                                    <PetAvatar
                                        type={pet.type}
                                        color={pet.color}
                                        level={pet.level}
                                        size={260}
                                        accessories={pet.equippedAccessories}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-4">
                            <CircleButton icon={<Gamepad2 size={22} />} />
                            <CircleButton icon={<Heart size={22} />} primary />
                            <CircleButton icon={<Camera size={22} />} />
                        </div>
                    </div>

                    {/* Pet Info Card */}
                    <div className="mt-4 rounded-xl border border-slate-100 bg-white p-6">
                        <div className="flex items-center gap-3">
                            {isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                        onBlur={handleNameSave}
                                        className="rounded-lg border-2 border-primary px-3 py-1 text-lg font-bold text-slate-900 outline-none"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold">{pet.name}</h3>
                                    <span className="text-xl">{PET_INFO[pet.type].emoji}</span>
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-primary"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="mt-2 leading-relaxed text-slate-600">
                            {pet.name}{' '}
                            {isVi
                                ? `là một ${PET_INFO[pet.type].nameVi} đang ở giai đoạn ${stage === 'baby' ? 'Bé' : stage === 'teen' ? 'Thiếu niên' : 'Trưởng thành'}. Cấp ${pet.level} với ${pet.xp} XP!`
                                : `is a ${PET_INFO[pet.type].name} at the ${stage} stage. Level ${pet.level} with ${pet.xp} XP!`}
                        </p>
                    </div>
                </div>

                {/* Right: Customization Panel */}
                <div className="lg:col-span-5">
                    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-100">
                            <TabButton
                                active={activeTab === 'customize'}
                                onClick={() => setActiveTab('customize')}
                                icon={<Palette size={20} />}
                                label={isVi ? 'Tùy chỉnh' : 'Customize'}
                            />
                            <TabButton
                                active={activeTab === 'accessories'}
                                onClick={() => setActiveTab('accessories')}
                                icon={<Sparkles size={20} />}
                                label={isVi ? 'Phụ kiện' : 'Accessories'}
                            />
                            <TabButton
                                active={activeTab === 'food'}
                                onClick={() => setActiveTab('food')}
                                icon={<ShoppingBag size={20} />}
                                label={isVi ? 'Kho đồ' : 'Inventory'}
                            />
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <AnimatePresence mode="wait">
                                {activeTab === 'customize' && (
                                    <motion.div
                                        key="customize"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        {/* Pet Type Selection */}
                                        <h4 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-400">
                                            {isVi ? 'Chọn Pet' : 'Choose Pet'}
                                        </h4>
                                        <div className="mb-6 grid grid-cols-4 gap-3">
                                            {(Object.keys(PET_INFO) as PetType[]).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => onSetType(type)}
                                                    className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all hover:scale-105 ${pet.type === type
                                                        ? 'border-primary bg-primary/5 shadow-md'
                                                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                                                        }`}
                                                >
                                                    <PetAvatar type={type} color={pet.color} level={pet.level} size={56} />
                                                    <span className="text-[10px] font-bold uppercase">
                                                        {isVi ? PET_INFO[type].nameVi : PET_INFO[type].name}
                                                    </span>
                                                    {pet.type === type && (
                                                        <Check size={12} className="text-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Color Picker */}
                                        <h4 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-400">
                                            {isVi ? 'Màu sắc' : 'Color'}
                                        </h4>
                                        <div className="grid grid-cols-4 gap-3">
                                            {PET_COLORS.map((c) => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => onSetColor(c.value)}
                                                    className={`group relative flex aspect-square items-center justify-center rounded-xl border-2 transition-all hover:scale-110 ${pet.color === c.value
                                                        ? 'border-slate-900 shadow-lg'
                                                        : 'border-transparent hover:border-slate-200'
                                                        }`}
                                                    style={{ backgroundColor: c.value }}
                                                >
                                                    {pet.color === c.value && (
                                                        <Check size={20} className="text-white drop-shadow-md" />
                                                    )}
                                                    <span className="absolute -bottom-5 text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100">
                                                        {c.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'accessories' && (
                                    <motion.div
                                        key="accessories"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h4 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-400">
                                            {isVi ? 'Phụ kiện' : 'Accessories'} ({PET_ACCESSORIES.length})
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {PET_ACCESSORIES.map((acc) => {
                                                const isUnlocked = pet.xp >= acc.requiredXp;
                                                const isEquipped = pet.equippedAccessories.includes(acc.id);
                                                return (
                                                    <button
                                                        key={acc.id}
                                                        onClick={() => isUnlocked && onToggleAccessory(acc.id)}
                                                        disabled={!isUnlocked}
                                                        className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${isEquipped
                                                            ? 'border-primary bg-primary/5 shadow-md'
                                                            : isUnlocked
                                                                ? 'border-slate-100 bg-white hover:border-primary/30 hover:shadow-sm'
                                                                : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50'
                                                            }`}
                                                    >
                                                        <span className="text-3xl">{acc.emoji}</span>
                                                        <span className="text-xs font-bold">
                                                            {isVi ? acc.nameVi : acc.name}
                                                        </span>
                                                        {!isUnlocked ? (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                                <Lock size={10} /> {acc.requiredXp} XP
                                                            </div>
                                                        ) : isEquipped ? (
                                                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                                                                {isVi ? 'Đang đeo' : 'Equipped'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-primary">
                                                                {isVi ? 'Nhấn để đeo' : 'Tap to equip'}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'food' && (
                                    <motion.div
                                        key="food"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h4 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-400">
                                            {t('petRoom.foodSnacks', { count: 3 })}
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { emoji: '🍎', name: isVi ? 'Táo phép thuật' : 'Magic Apple', count: 5 },
                                                { emoji: '🍪', name: isVi ? 'Bánh quy' : 'Cookie', count: 2 },
                                                { emoji: '🥛', name: isVi ? 'Sữa tươi' : 'Fresh Milk', count: 8 },
                                            ].map((food) => (
                                                <div
                                                    key={food.emoji}
                                                    className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-transparent bg-yellow-50 p-4 transition-all hover:border-yellow-400 hover:shadow-sm"
                                                >
                                                    <span className="text-3xl">{food.emoji}</span>
                                                    <span className="text-[10px] font-bold">{food.name}</span>
                                                    <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-black text-yellow-400">
                                                        x{food.count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <h4 className="mb-3 mt-8 text-sm font-black uppercase tracking-widest text-slate-400">
                                            {isVi ? 'Đồ chơi' : 'Toys'} (2)
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { emoji: '⚽', name: isVi ? 'Bóng' : 'Ball' },
                                                { emoji: '🧸', name: isVi ? 'Gấu bông' : 'Teddy Bear' },
                                            ].map((toy) => (
                                                <div
                                                    key={toy.emoji}
                                                    className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-transparent bg-blue-50 p-4 transition-all hover:border-blue-400 hover:shadow-sm"
                                                >
                                                    <span className="text-3xl">{toy.emoji}</span>
                                                    <span className="text-[10px] font-bold">{toy.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom CTA */}
                        <div className="border-t border-slate-100 bg-slate-50 p-4">
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                                <ShoppingBag size={20} /> {t('petRoom.visitPetShop')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CircleButton({ icon, primary }: { icon: ReactNode; primary?: boolean }) {
    return (
        <button
            className={`rounded-full p-4 shadow-lg transition-transform hover:scale-110 ${primary ? 'bg-primary text-white shadow-primary/40' : 'bg-white/90 text-slate-700 backdrop-blur'
                }`}
        >
            {icon}
        </button>
    );
}

function TabButton({
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
            className={`flex flex-1 flex-col items-center gap-1 border-b-4 py-4 transition-all ${active
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
        >
            {icon}
            <span className="text-[10px] font-bold uppercase">{label}</span>
        </button>
    );
}
