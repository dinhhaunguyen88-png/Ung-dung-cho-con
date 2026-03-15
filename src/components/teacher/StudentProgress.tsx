import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Trophy, Target, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getClassProgress, StudentProgressSummary } from '../../services/api';
import { PetAvatar } from '../pet/PetAvatar';

interface StudentProgressProps {
    classId: string;
    className: string;
}

export function StudentProgress({ classId, className }: StudentProgressProps) {
    const { t } = useTranslation();
    const [students, setStudents] = useState<StudentProgressSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, [classId]);

    const fetchProgress = async () => {
        try {
            const data = await getClassProgress(classId);
            setStudents(data);
        } catch (err) {
            console.error('Failed to fetch progress:', err);
        } finally {
            setLoading(false);
        }
    };

    const getAccuracyLabel = (accuracy: number) => {
        if (accuracy >= 90) return { text: t('progress.excellent'), color: 'text-emerald-600 bg-emerald-50' };
        if (accuracy >= 70) return { text: t('progress.good'), color: 'text-blue-600 bg-blue-50' };
        if (accuracy >= 50) return { text: t('progress.average'), color: 'text-amber-600 bg-amber-50' };
        return { text: t('progress.needsWork'), color: 'text-red-600 bg-red-50' };
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // Aggregate stats
    const totalStudents = students.length;
    const avgAccuracy = totalStudents > 0
        ? Math.round(students.reduce((sum, s) => sum + s.accuracy, 0) / totalStudents)
        : 0;
    const totalSessions = students.reduce((sum, s) => sum + s.sessionsCount, 0);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">
                {t('progress.title')} — {className}
            </h3>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white p-5 text-center shadow-md">
                    <Target className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                    <p className="text-2xl font-black text-slate-800">{avgAccuracy}%</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('progress.accuracy')}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 text-center shadow-md">
                    <Trophy className="mx-auto mb-2 h-8 w-8 text-amber-500" />
                    <p className="text-2xl font-black text-slate-800">{totalStudents}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Students</p>
                </div>
                <div className="rounded-2xl bg-white p-5 text-center shadow-md">
                    <TrendingUp className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                    <p className="text-2xl font-black text-slate-800">{totalSessions}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('progress.sessions')}</p>
                </div>
            </div>

            {/* Student List */}
            {students.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center">
                    <BarChart3 className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                    <p className="font-medium text-slate-400">{t('progress.noData')}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {students
                        .sort((a, b) => b.accuracy - a.accuracy)
                        .map((student, i) => {
                            const label = getAccuracyLabel(student.accuracy);
                            return (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border-2 border-transparent hover:border-primary/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg font-black text-slate-400">
                                            {i + 1}
                                        </div>
                                        <div className="h-12 w-12">
                                            <PetAvatar
                                                type={student.avatar as any}
                                                color={student.avatar_color}
                                                size={48}
                                                level={student.level}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{student.name}</h4>
                                            <p className="text-xs text-slate-400">
                                                {t('progress.correct')}: {student.totalCorrect}/{student.totalQuestions} · {student.sessionsCount} {t('progress.sessions').toLowerCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Accuracy Bar */}
                                        <div className="hidden sm:block w-32">
                                            <div className="h-2.5 w-full rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all"
                                                    style={{ width: `${student.accuracy}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="font-black text-slate-700 w-12 text-right">{student.accuracy}%</span>
                                        <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase ${label.color}`}>
                                            {label.text}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
