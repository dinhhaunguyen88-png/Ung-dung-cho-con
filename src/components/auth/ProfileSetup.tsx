import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PetAvatar } from '../pet/PetAvatar';
import type { PetType } from '../../types/pet';

interface ProfileSetupProps {
    onComplete: (userData: any) => void;
    onTeacherLogin?: () => void;
}

const PET_TYPES: PetType[] = ['dragon', 'cat', 'dog', 'bunny'];
const COLORS = [
    '#30e86e', // Green
    '#30a5e8', // Blue
    '#e83030', // Red
    '#e8a530', // Orange
    '#a530e8', // Purple
    '#e830a5', // Pink
    '#facc15', // Yellow
    '#475569', // Slate
];

export function ProfileSetup({ onComplete, onTeacherLogin }: ProfileSetupProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [selectedPet, setSelectedPet] = useState<PetType>('dragon');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
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
            }
        } catch (error) {
            console.error('Failed to create profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                <div className="bg-primary p-8 text-center text-white">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 10 }}
                        transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                        className="mb-4 inline-block"
                    >
                        <Sparkles size={48} />
                    </motion.div>
                    <h1 className="text-3xl font-bold">{t('setup.welcome')}</h1>
                    <p className="mt-2 opacity-90">{t('setup.subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-8">
                        {/* Name Input */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700 uppercase tracking-wider">
                                {t('setup.nameLabel')}
                            </label>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('setup.namePlaceholder')}
                                className="w-full rounded-2xl border-4 border-slate-100 bg-slate-50 p-4 text-xl font-medium transition-all focus:border-primary-400 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        {/* Pet Selection */}
                        <div>
                            <label className="mb-4 block text-sm font-bold text-slate-700 uppercase tracking-wider">
                                {t('setup.choosePet')}
                            </label>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {PET_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setSelectedPet(type)}
                                        className={`relative flex flex-col items-center rounded-2xl border-4 p-4 transition-all ${selectedPet === type
                                            ? 'border-primary bg-primary/10'
                                            : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className="h-20 w-20">
                                            <PetAvatar type={type} color={selectedColor} size={80} level={1} />
                                        </div>
                                        <span className="mt-2 font-bold capitalize text-slate-700">
                                            {t(`setup.pets.${type}`)}
                                        </span>
                                        {selectedPet === type && (
                                            <div className="absolute top-2 right-2 rounded-full bg-primary p-1 text-white">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <label className="mb-4 block text-sm font-bold text-slate-700 uppercase tracking-wider">
                                {t('setup.chooseColor')}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={`h-10 w-10 rounded-full border-4 transition-all hover:scale-110 ${selectedColor === color
                                            ? 'border-slate-400'
                                            : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary p-5 text-xl font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="h-7 w-7 animate-spin rounded-full border-4 border-white border-t-transparent" />
                            ) : (
                                <>
                                    {t('setup.startReady')}
                                    <ArrowRight />
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>

                {/* Teacher Link */}
                {onTeacherLogin && (
                    <div className="border-t border-slate-100 px-8 py-5 text-center">
                        <p className="text-sm text-slate-400">
                            {t('setup.teacherLink')}{' '}
                            <button
                                type="button"
                                onClick={onTeacherLogin}
                                className="font-semibold text-blue-500 hover:text-blue-600"
                            >
                                {t('setup.teacherLinkAction')}
                            </button>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
