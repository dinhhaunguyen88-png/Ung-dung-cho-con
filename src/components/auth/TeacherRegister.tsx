import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, ArrowLeft, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { teacherRegister } from '../../services/api';

interface TeacherRegisterProps {
    onRegister: (userData: any) => void;
    onNavigate: (screen: string) => void;
}

export function TeacherRegister({ onRegister, onNavigate }: TeacherRegisterProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (password.length < 6) {
            setError(t('teacherAuth.passwordTooShort'));
            return;
        }
        if (password !== confirmPassword) {
            setError(t('teacherAuth.passwordMismatch'));
            return;
        }

        setLoading(true);
        try {
            const { user } = await teacherRegister(name, email, password);
            onRegister(user);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl bg-white shadow-xl"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center text-white">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <UserPlus className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">{t('teacherAuth.registerTitle')}</h1>
                    <p className="mt-2 text-emerald-100">{t('teacherAuth.registerSubtitle')}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 p-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl bg-red-50 p-4 text-sm text-red-600"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            {t('teacherAuth.name')}
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('teacherAuth.namePlaceholder')}
                                required
                                className="w-full rounded-xl border-2 border-slate-200 py-3 pl-12 pr-4 text-slate-800 transition-colors focus:border-emerald-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            {t('teacherAuth.email')}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('teacherAuth.emailPlaceholder')}
                                required
                                className="w-full rounded-xl border-2 border-slate-200 py-3 pl-12 pr-4 text-slate-800 transition-colors focus:border-emerald-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            {t('teacherAuth.password')}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('teacherAuth.passwordPlaceholder')}
                                required
                                minLength={6}
                                className="w-full rounded-xl border-2 border-slate-200 py-3 pl-12 pr-4 text-slate-800 transition-colors focus:border-emerald-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            {t('teacherAuth.confirmPassword')}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t('teacherAuth.confirmPlaceholder')}
                                required
                                className="w-full rounded-xl border-2 border-slate-200 py-3 pl-12 pr-4 text-slate-800 transition-colors focus:border-emerald-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-200 transition-opacity disabled:opacity-50"
                    >
                        {loading ? t('teacherAuth.loading') : t('teacherAuth.register')}
                    </motion.button>

                    {/* Links */}
                    <div className="space-y-3 text-center text-sm">
                        <p className="text-slate-500">
                            {t('teacherAuth.hasAccount')}{' '}
                            <button
                                type="button"
                                onClick={() => onNavigate('teacher-login')}
                                className="font-semibold text-emerald-500 hover:text-emerald-600"
                            >
                                {t('teacherAuth.loginHere')}
                            </button>
                        </p>
                        <button
                            type="button"
                            onClick={() => onNavigate('profile-setup')}
                            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t('teacherAuth.backToStudent')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
