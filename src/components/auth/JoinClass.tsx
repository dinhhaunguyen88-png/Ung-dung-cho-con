import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { joinClass } from '../../services/api';

interface JoinClassProps {
    userId: string;
    onBack: () => void;
    onSuccess: (className: string) => void;
}

export function JoinClass({ userId, onBack, onSuccess }: JoinClassProps) {
    const { t } = useTranslation();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length < 6) return;

        setError('');
        setLoading(true);
        try {
            const { className } = await joinClass(code, userId);
            onSuccess(className);
        } catch (err: any) {
            setError(err.message || 'Failed to join class');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                <div className="bg-primary p-8 text-center text-white">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">{t('joinClass.title')}</h1>
                    <p className="mt-1 opacity-90">{t('joinClass.subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 p-8">
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700 uppercase tracking-wider">
                            {t('joinClass.codeLabel')}
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
                            placeholder={t('joinClass.codePlaceholder')}
                            className="w-full rounded-2xl border-4 border-slate-100 bg-slate-50 p-4 text-center text-3xl font-mono font-bold tracking-widest text-primary transition-all focus:border-primary focus:bg-white focus:outline-none"
                            required
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading || code.length < 6}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary p-5 text-xl font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="h-7 w-7 animate-spin rounded-full border-4 border-white border-t-transparent" />
                        ) : (
                            <>
                                {t('joinClass.submit')}
                                <Send className="h-5 w-5" />
                            </>
                        )}
                    </motion.button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="flex w-full items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('joinClass.backToDashboard')}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
