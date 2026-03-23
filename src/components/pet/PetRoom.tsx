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
import { PET_COLORS, PET_ACCESSORIES, PET_INFO, getPetEvolutionStage } from '../../types/pet';
import type { PetConfig, PetType } from '../../types/pet';
import { getUserInventory, type UserItem } from '../../services/api';
import { useEffect } from 'react';
import { GlassCard, NeonButton } from '../ui/GlassCard';
import { SciFiProgress } from '../ui/SciFiProgress';

type Tab = 'customize' | 'accessories' | 'food';

interface PetRoomProps {
    onBack: () => void;
    pet: PetConfig;
    userId: string;
    onSetType: (type: PetType) => void;
    onSetColor: (color: string) => void;
    onSetName: (name: string) => void;
    onToggleAccessory: (id: string) => void;
    onVisitShop?: () => void;
}

export function PetRoom({
    onBack,
    pet,
    userId,
    onSetType,
    onSetColor,
    onSetName,
    onToggleAccessory,
    onVisitShop,
}: PetRoomProps) {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('customize');
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(pet.name);
    const [inventory, setInventory] = useState<UserItem[]>([]);
    const [isLoadingInventory, setIsLoadingInventory] = useState(false);

    const isVi = i18n.language === 'vi';
    const stage = getPetEvolutionStage(pet.level);

    useEffect(() => {
        const fetchInventory = async () => {
            if (!userId) return;
            setIsLoadingInventory(true);
            try {
                const data = await getUserInventory(userId);
                setInventory(data);
            } catch (err) {
                console.error('Failed to fetch inventory:', err);
            } finally {
                setIsLoadingInventory(false);
            }
        };
        fetchInventory();
    }, [userId]);

    const handleNameSave = () => {
        if (nameInput.trim()) {
            onSetName(nameInput.trim());
        }
        setIsEditingName(false);
    };

    return (
        <div className="flex flex-col gap-6 min-h-screen bg-slate-900 p-4 md:p-8 font-sans text-slate-200"
            style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col">
                    <div className="mb-1 flex items-center gap-2">
                        <button onClick={onBack} className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                            {t('petRoom.breadcrumb')}
                        </button>
                        <ChevronRight size={14} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-500">{t('petRoom.petCare')}</span>
                    </div>
                    <h1 className="flex items-center gap-3 text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {t('petRoom.title')}
                        <span className="rounded-md border border-cyan-500/50 bg-cyan-950/30 px-2 py-1 text-xs uppercase tracking-widest text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                            Level {pet.level}
                        </span>
                        <span className="rounded-md border border-purple-500/50 bg-purple-950/30 px-2 py-1 text-[10px] uppercase tracking-widest text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                            {stage === 'baby' ? '🥚 Baby' : stage === 'teen' ? '⚡ Teen' : '🌟 Adult'}
                        </span>
                    </h1>
                </div>
                
                <GlassCard className="flex items-center gap-6 p-4 w-full md:w-auto">
                    <div className="w-32">
                        <SciFiProgress value={85} max={100} label={t('petRoom.happiness')} variant="amber" />
                    </div>
                    <div className="w-32">
                        <SciFiProgress value={pet.xp % 200} max={200} label="XP" variant="cyan" />
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left: Pet Display */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <GlassCard className="relative w-full overflow-hidden min-h-[460px] flex flex-col items-center justify-center p-8 group">
                        {/* Sci-Fi Background grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
                        
                        {/* Sci-Fi glowing pedestal */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-16 bg-cyan-500/10 blur-[20px] rounded-full" />
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-4 border border-cyan-500/30 rounded-[100%] shadow-[0_0_20px_rgba(6,182,212,0.5)] transform rotate-x-60" />

                        {/* Pet */}
                        <div className="relative z-10 flex flex-1 items-center justify-center w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${pet.type}-${pet.color}`}
                                    initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                                    exit={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                                    transition={{ type: 'spring', damping: 20 }}
                                >
                                    <PetAvatar
                                        type={pet.type}
                                        color={pet.color}
                                        level={pet.level}
                                        size={280}
                                        accessories={pet.equippedAccessories}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-6 z-20">
                            <CircleButton icon={<Gamepad2 size={24} />} onClick={() => {}} />
                            <CircleButton icon={<Heart size={26} className="text-rose-400" />} primary onClick={() => {}} />
                            <CircleButton icon={<Camera size={24} />} onClick={() => {}} />
                        </div>
                    </GlassCard>

                    {/* Pet Info Card */}
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-3">
                            {isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                        onBlur={handleNameSave}
                                        className="rounded-lg border border-cyan-500 bg-slate-900/50 px-3 py-1 text-lg font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500/50"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group/name">
                                    <h3 className="text-xl font-black tracking-wide text-white">{pet.name}</h3>
                                    <span className="text-2xl drop-shadow-md">{PET_INFO[pet.type].emoji}</span>
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        className="rounded-full p-2 text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors opacity-0 group-hover/name:opacity-100"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-slate-400 font-medium">
                            {pet.name}{' '}
                            {isVi
                                ? `là một ${PET_INFO[pet.type].nameVi} đang ở dạng ${stage === 'baby' ? 'Bé' : stage === 'teen' ? 'Thiếu niên' : 'Trưởng thành'}. Cấp ${pet.level} với ${pet.xp} XP!`
                                : `is a ${PET_INFO[pet.type].name} at the ${stage} stage. Level ${pet.level} with ${pet.xp} XP!`}
                        </p>
                    </GlassCard>
                </div>

                {/* Right: Customization Panel */}
                <div className="lg:col-span-5 h-[calc(100vh-[header]-2rem)]">
                    <GlassCard className="flex h-full min-h-[600px] flex-col overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-700/50 bg-slate-900/30">
                            <TabButton
                                active={activeTab === 'customize'}
                                onClick={() => setActiveTab('customize')}
                                icon={<Palette size={18} />}
                                label={isVi ? 'Tùy chỉnh' : 'Customize'}
                            />
                            <TabButton
                                active={activeTab === 'accessories'}
                                onClick={() => setActiveTab('accessories')}
                                icon={<Sparkles size={18} />}
                                label={isVi ? 'Phụ kiện' : 'Accessories'}
                            />
                            <TabButton
                                active={activeTab === 'food'}
                                onClick={() => setActiveTab('food')}
                                icon={<ShoppingBag size={18} />}
                                label={isVi ? 'Kho đồ' : 'Inventory'}
                            />
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
                            <AnimatePresence mode="wait">
                                {activeTab === 'customize' && (
                                    <motion.div
                                        key="customize"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col gap-6"
                                    >
                                        <div>
                                            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                                {isVi ? 'Định dạng mã gen' : 'DNA Sequence'}
                                            </h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {(Object.keys(PET_INFO) as PetType[]).map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => onSetType(type)}
                                                        className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-300 ${pet.type === type
                                                                ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105'
                                                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
                                                            }`}
                                                    >
                                                        <PetAvatar type={type} color={pet.color} level={pet.level} size={64} disableAnimation />
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${pet.type === type ? 'text-cyan-400' : 'text-slate-300'}`}>
                                                            {isVi ? PET_INFO[type].nameVi : PET_INFO[type].name}
                                                        </span>
                                                        {pet.type === type && (
                                                            <div className="absolute top-2 right-2 rounded-full bg-cyan-500 p-0.5 shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                                                                <Check size={12} className="text-white" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                                {isVi ? 'Màu sắc module' : 'Module Color'}
                                            </h4>
                                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                                {PET_COLORS.map((c) => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => onSetColor(c.value)}
                                                        className={`group relative flex aspect-square items-center justify-center rounded-xl transition-all duration-300 ${pet.color === c.value
                                                                ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                                                                : 'hover:scale-105 hover:shadow-lg'
                                                            }`}
                                                        style={{ backgroundColor: c.value }}
                                                    >
                                                        {pet.color === c.value && (
                                                            <Check size={20} className="text-white mix-blend-difference" />
                                                        )}
                                                        <span className="absolute -bottom-6 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {c.label}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
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
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
                                                {isVi ? 'Phụ kiện' : 'Accessories'} ({PET_ACCESSORIES.length})
                                            </h4>
                                            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/50 px-2 py-1 rounded-full border border-cyan-500/30">
                                                {pet.equippedAccessories.length} / 3 {isVi ? 'Đang kích hoạt' : 'Active'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {PET_ACCESSORIES.map((acc) => {
                                                const isUnlocked = pet.xp >= acc.requiredXp;
                                                const isEquipped = pet.equippedAccessories.includes(acc.id);

                                                return (
                                                    <button
                                                        key={acc.id}
                                                        onClick={() => isUnlocked && onToggleAccessory(acc.id)}
                                                        disabled={!isUnlocked}
                                                        className={`relative flex flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-300 ${isEquipped
                                                                ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                                                                : isUnlocked
                                                                    ? 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
                                                                    : 'cursor-not-allowed border-slate-800 bg-slate-900/50 opacity-40 grayscale'
                                                            }`}
                                                    >
                                                        <span className="text-4xl drop-shadow-lg">{acc.emoji}</span>
                                                        <span className="text-xs font-bold text-slate-200 mt-2 text-center">
                                                            {isVi ? acc.nameVi : acc.name}
                                                        </span>
                                                        {!isUnlocked ? (
                                                            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
                                                                <Lock size={10} className="text-rose-400" /> {acc.requiredXp} XP
                                                            </div>
                                                        ) : isEquipped ? (
                                                            <span className="mt-1 rounded-full bg-amber-500/20 border border-amber-500/50 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                                                                {isVi ? 'Đang trang bị' : 'Equipped'}
                                                            </span>
                                                        ) : (
                                                            <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-400">
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
                                        <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                            {isVi ? 'Kho lương thực' : 'Inventory'} ({inventory.length})
                                        </h4>
                                        {isLoadingInventory ? (
                                             <div className="flex h-32 items-center justify-center">
                                                 <Sparkles className="animate-spin text-cyan-400" />
                                             </div>
                                        ) : inventory.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                                                <div className="p-6 bg-slate-800/50 rounded-full border border-slate-700">
                                                    <ShoppingBag size={48} className="text-slate-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-300">
                                                        {isVi ? 'Khoang chứa trống.' : 'Cargo bay empty.'}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {isVi ? 'Hãy làm nhiệm vụ hoặc ghé cửa hàng để mua vật phẩm.' : 'Complete quests or visit the shop to acquire items.'}
                                                    </p>
                                                </div>
                                                <NeonButton 
                                                    onClick={onVisitShop}
                                                    variant="secondary"
                                                    className="mt-2 text-xs py-2 px-4"
                                                >
                                                    {isVi ? 'Mở cửa hàng không gian' : 'Open Space Shop'}
                                                </NeonButton>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                {inventory.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
                                                    >
                                                        <span className="text-4xl drop-shadow-md transition-transform group-hover:scale-110 duration-300">{item.item?.image_url}</span>
                                                        <span className="text-xs font-bold text-slate-200 mt-2 text-center h-8 flex items-center">
                                                            {item.item?.name}
                                                        </span>
                                                        <span className="rounded bg-slate-900 border border-slate-700 px-2 py-0.5 text-xs font-black text-cyan-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                                                            x{item.quantity}
                                                        </span>
                                                        {item.item?.category === 'accessory' && (
                                                            <button 
                                                                onClick={() => onToggleAccessory(item.item_id)}
                                                                className={`mt-2 w-full rounded py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                                                                    pet.equippedAccessories.includes(item.item_id) 
                                                                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30' 
                                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600'
                                                                }`}
                                                            >
                                                                {pet.equippedAccessories.includes(item.item_id) ? (isVi ? 'Bỏ thẻ' : 'Unequip') : (isVi ? 'Sử dụng' : 'Use')}
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom CTA */}
                        <div className="border-t border-slate-700/50 bg-slate-900/50 p-6">
                            <NeonButton
                                onClick={onVisitShop}
                                className="w-full flex justify-center items-center gap-2 py-3.5 text-sm uppercase tracking-widest"
                            >
                                <ShoppingBag size={18} /> {t('petRoom.visitPetShop')}
                            </NeonButton>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

function CircleButton({ icon, primary, onClick }: { icon: ReactNode; primary?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center rounded-full p-4 transition-all duration-300 hover:scale-110 active:scale-95 ${
                primary 
                ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:bg-rose-400 w-16 h-16' 
                : 'bg-slate-800/80 text-cyan-400 border border-slate-700 backdrop-blur shadow-lg hover:bg-slate-700 hover:text-cyan-300 w-14 h-14 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
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
            className={`flex flex-1 flex-col items-center justify-center gap-1.5 border-b-2 py-4 px-2 transition-all duration-300 ${active
                ? 'border-cyan-400 bg-cyan-950/30 text-cyan-400 shadow-[inset_0_-10px_20px_-15px_rgba(6,182,212,0.5)]'
                : 'border-transparent text-slate-500 hover:bg-slate-800/30 hover:text-slate-300'
                }`}
        >
            <span className={active ? 'drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : ''}>{icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </button>
    );
}
