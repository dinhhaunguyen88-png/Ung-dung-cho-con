import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PetAvatar } from '../pet/PetAvatar';
import type { PetType } from '../../types/pet';
import { GlassCard, NeonButton } from '../ui/GlassCard';

interface ProfileSetupProps {
    onComplete: (userData: any) => void;
    onTeacherLogin?: () => void;
}

const PET_TYPES: PetType[] = ['dragon', 'cat', 'dog', 'bunny'];
const COLORS = [
    '#30e86e', // Green
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#eab308', // Yellow
];

export function ProfileSetup({ onComplete, onTeacherLogin }: ProfileSetupProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [selectedPet, setSelectedPet] = useState<PetType>('dragon');
    const [selectedColor, setSelectedColor] = useState(COLORS[1]); // Default to Cyan for sci-fi theme
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    avatar: selectedPet,
                    avatarColor: selectedColor,
                }),
            });

            if (response.ok) {
                const userData = await response.json();
                onComplete(userData);
            } else {
                const rawError = await response.text();
                let errorMessage = '';

                if (rawError) {
                    try {
                        const errData = JSON.parse(rawError);
                        errorMessage = errData.error || errData.details || '';
                    } catch {
                        const plainText = rawError.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                        if (plainText && !plainText.toLowerCase().startsWith('<!doctype')) {
                            errorMessage = plainText;
                        }
                    }
                }
                const errData = { error: errorMessage };
                setError(errData.error || t('setup.errorGeneric', 'Không thể tạo hồ sơ. Vui lòng thử lại!'));
            }
        } catch (err) {
            console.error('Failed to create profile:', err);
            setError(t('setup.errorConnection', 'Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối và thử lại!'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-900"
            style={{ backgroundImage: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)' }}>
            
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Glow behind card */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl opacity-50 pointer-events-none" />
                
                <GlassCard className="overflow-hidden p-0 rounded-3xl border-cyan-500/30">
                    <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 p-8 text-center text-white border-b border-cyan-500/30 relative overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent skew-x-12" />
                        
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 10 }}
                            transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                            className="mb-4 inline-block drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] text-cyan-400"
                        >
                            <Sparkles size={48} />
                        </motion.div>
                        <h1 className="text-3xl font-black tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {t('setup.welcome')}
                        </h1>
                        <p className="mt-2 text-cyan-200/80 font-medium tracking-wide">
                            {t('setup.subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="space-y-8">
                            {/* Name Input */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                                    {t('setup.nameLabel')}
                                </label>
                                <div className="relative">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t('setup.namePlaceholder')}
                                        className="w-full rounded-2xl border-2 border-slate-700 bg-slate-800/50 p-4 text-xl font-bold text-white transition-all placeholder:text-slate-600 focus:border-cyan-500 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Pet Selection */}
                            <div>
                                <label className="mb-4 block text-sm font-bold text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                                    {t('setup.choosePet')}
                                </label>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {PET_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setSelectedPet(type)}
                                            className={`relative flex flex-col items-center rounded-2xl border-2 p-4 transition-all duration-300 ${selectedPet === type
                                                ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]'
                                                : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="h-20 w-20 flex justify-center items-center">
                                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full blur-[15px] pointer-events-none transition-opacity duration-300 ${
                                                    selectedPet === type ? 'opacity-100' : 'opacity-0'
                                                }`} style={{ backgroundColor: `${selectedColor}40` }} />
                                                <PetAvatar 
                                                    type={type} 
                                                    color={selectedColor} 
                                                    size={80} 
                                                    level={1} 
                                                    disableAnimation={selectedPet !== type}
                                                />
                                            </div>
                                            <span className={`mt-3 font-bold capitalize tracking-wide transition-colors ${
                                                selectedPet === type ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-slate-400'
                                            }`}>
                                                {t(`setup.pets.${type}`)}
                                            </span>
                                            {selectedPet === type && (
                                                <motion.div 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-3 -right-3 rounded-full bg-cyan-500 p-1.5 text-slate-900 border-2 border-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                                                >
                                                    <Check size={16} strokeWidth={4} />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <label className="mb-4 block text-sm font-bold text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                                    {t('setup.chooseColor')}
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`relative h-12 w-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${selectedColor === color
                                                ? 'border-white scale-110 z-10'
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                                }`}
                                            style={{ 
                                                backgroundColor: color,
                                                boxShadow: selectedColor === color ? `0 0 15px ${color}80, inset 0 0 10px rgba(0,0,0,0.3)` : `inset 0 0 10px rgba(0,0,0,0.3)`
                                            }}
                                        >
                                            {selectedColor === color && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-4 h-4 rounded-full bg-white/30 backdrop-blur-sm" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl bg-red-950/50 border border-red-500/50 p-4 text-center text-red-400 font-bold backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                >
                                    ⚠️ {error}
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <NeonButton
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !name.trim()}
                                className="w-full flex items-center justify-center gap-2 py-4"
                            >
                                {isSubmitting ? (
                                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <span className="text-xl">{t('setup.startReady')}</span>
                                        <ArrowRight className="text-xl" />
                                    </>
                                )}
                            </NeonButton>
                        </div>
                    </form>

                    {/* Teacher Link */}
                    {onTeacherLogin && (
                        <div className="border-t border-slate-700/50 bg-slate-800/30 px-8 py-5 text-center">
                            <p className="text-sm font-medium text-slate-400">
                                {t('setup.teacherLink')}{' '}
                                <button
                                    type="button"
                                    onClick={onTeacherLogin}
                                    className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
                                >
                                    {t('setup.teacherLinkAction')}
                                </button>
                            </p>
                        </div>
                    )}
                </GlassCard>
            </motion.div>
        </div>
    );
}
