import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Users, LayoutDashboard, Copy, Trash2, ChevronRight, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTeacherClasses, createClass, ClassData } from '../../services/api';

interface TeacherDashboardProps {
    teacherId: string;
    onViewClass: (classId: string, className: string) => void;
}

export function TeacherDashboard({ teacherId, onViewClass }: TeacherDashboardProps) {
    const { t } = useTranslation();
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClasses();
    }, [teacherId]);

    const fetchClasses = async () => {
        try {
            const data = await getTeacherClasses(teacherId);
            setClasses(data);
        } catch (err: any) {
            console.error('Failed to fetch classes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClassName.trim()) return;

        setError('');
        try {
            const newClass = await createClass(newClassName);
            setClasses([newClass, ...classes]);
            setNewClassName('');
            setIsCreating(false);
        } catch (err: any) {
            setError(err.message || 'Failed to create class');
        }
    };

    const copyJoinCode = (code: string) => {
        navigator.clipboard.writeText(code);
        // Show subtle toast or feedback here if available
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">{t('teacherDashboard.classes')}</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    {t('teacherDashboard.createClass')}
                </button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="rounded-3xl bg-white p-6 shadow-xl border-2 border-primary/20"
                    >
                        <form onSubmit={handleCreateClass} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label className="mb-2 block text-sm font-bold text-slate-600 uppercase tracking-wider">
                                    {t('teacherDashboard.className')}
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    placeholder={t('teacherDashboard.classNamePlaceholder')}
                                    className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 text-lg transition-all focus:border-primary focus:bg-white focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 sm:flex-none"
                                >
                                    {t('teacherDashboard.createClass')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-bold text-slate-500 transition-all hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                    </motion.div>
                )}
            </AnimatePresence>

            {classes.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center">
                    <Users className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                    <p className="text-lg font-medium text-slate-500">{t('teacherDashboard.noClasses')}</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {classes.map((cls) => (
                        <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all hover:shadow-xl border-2 border-transparent hover:border-primary/10"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                        {t('teacherDashboard.joinCode')}
                                    </span>
                                    <button
                                        onClick={() => copyJoinCode(cls.join_code)}
                                        className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-sm font-mono font-bold text-slate-700 hover:bg-slate-100"
                                    >
                                        {cls.join_code}
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="mb-1 text-xl font-bold text-slate-800">{cls.name}</h3>
                            <p className="mb-6 text-sm text-slate-500">Created {new Date(cls.created_at).toLocaleDateString()}</p>

                            <button
                                onClick={() => onViewClass(cls.id, cls.name)}
                                className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 transition-all hover:bg-primary group-hover:text-white"
                            >
                                <span className="font-bold">{t('teacherDashboard.viewMembers')}</span>
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
