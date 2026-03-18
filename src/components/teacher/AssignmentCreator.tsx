import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, BookOpen, Calendar, ArrowLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createAssignment, AssignmentData } from '../../services/api';

interface AssignmentCreatorProps {
    classId: string;
    onCreated: (assignment: AssignmentData) => void;
    onBack: () => void;
}

const SUBJECTS = ['math', 'vietnamese', 'english', 'science'];

export function AssignmentCreator({ classId, onCreated, onBack }: AssignmentCreatorProps) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('math');
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(5);
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setError('');
        setLoading(true);
        try {
            const assignment = await createAssignment({
                classId,
                title,
                subject,
                topic: topic || undefined,
                questionCount,
                dueDate: dueDate || undefined,
            });
            onCreated(assignment);
        } catch (err: any) {
            setError(err.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white p-8 shadow-xl border-2 border-primary/10"
        >
            <div className="mb-6 flex items-center gap-3">
                <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-bold text-slate-800">{t('assignments.create')}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
                )}

                <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-600 uppercase tracking-wider">
                        {t('assignments.assignmentTitle')}
                    </label>
                    <input
                        autoFocus
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('assignments.titlePlaceholder')}
                        className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 transition-all focus:border-primary focus:bg-white focus:outline-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-slate-600 uppercase tracking-wider">
                            {t('assignments.subject')}
                        </label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 transition-all focus:border-primary focus:outline-none"
                        >
                            {SUBJECTS.map((s) => (
                                <option key={s} value={s}>
                                    {t(`assignments.${s}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-slate-600 uppercase tracking-wider">
                            {t('assignments.topic')}
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={t('assignments.topicPlaceholder')}
                            className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 transition-all focus:border-primary focus:bg-white focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-slate-600 uppercase tracking-wider">
                            {t('assignments.questionCount')}
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={20}
                            value={questionCount}
                            onChange={(e) => setQuestionCount(Number(e.target.value))}
                            className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 transition-all focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-slate-600 uppercase tracking-wider">
                            {t('assignments.dueDate')}
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-3 transition-all focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={loading || !title.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary p-4 font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            {t('assignments.create')}
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
}
