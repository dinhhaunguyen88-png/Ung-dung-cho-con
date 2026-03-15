import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trash2, User, Trophy, Calendar, BookOpen, BarChart3, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getClassMembers, removeClassMember, getClassAssignments, UserData, AssignmentData } from '../../services/api';
import { PetAvatar } from '../pet/PetAvatar';
import { AssignmentCreator } from './AssignmentCreator';
import { StudentProgress } from './StudentProgress';

interface ClassManagerProps {
    classId: string;
    className: string;
    onBack: () => void;
}

type Tab = 'members' | 'assignments' | 'progress';

export function ClassManager({ classId, className, onBack }: ClassManagerProps) {
    const { t } = useTranslation();
    const [members, setMembers] = useState<UserData[]>([]);
    const [assignments, setAssignments] = useState<AssignmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>('members');
    const [showCreator, setShowCreator] = useState(false);

    useEffect(() => {
        fetchData();
    }, [classId]);

    const fetchData = async () => {
        try {
            const [membersData, assignmentsData] = await Promise.all([
                getClassMembers(classId),
                getClassAssignments(classId),
            ]);
            setMembers(membersData);
            setAssignments(assignmentsData);
        } catch (err) {
            console.error('Failed to fetch class data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!window.confirm('Remove this student from class?')) return;
        try {
            await removeClassMember(classId, userId);
            setMembers(members.filter(m => m.id !== userId));
        } catch (err) {
            console.error('Failed to remove member:', err);
        }
    };

    const handleAssignmentCreated = (assignment: AssignmentData) => {
        setAssignments([assignment, ...assignments]);
        setShowCreator(false);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: 'members', label: t('teacherDashboard.studentList', { className: '' }), icon: <User className="h-4 w-4" /> },
        { key: 'assignments', label: t('assignments.title'), icon: <BookOpen className="h-4 w-4" /> },
        { key: 'progress', label: t('progress.title'), icon: <BarChart3 className="h-4 w-4" /> },
    ];

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-600"
            >
                <ArrowLeft className="h-4 w-4" />
                {t('teacherDashboard.backToClasses')}
            </button>

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">{className}</h2>
                <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-500">
                    {t('teacherDashboard.membersCount', { count: members.length })}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 rounded-2xl bg-slate-100 p-1.5">
                {TABS.map((tabItem) => (
                    <button
                        key={tabItem.key}
                        onClick={() => setTab(tabItem.key)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${tab === tabItem.key
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tabItem.icon}
                        {tabItem.label}
                    </button>
                ))}
            </div>

            {/* Members Tab */}
            {tab === 'members' && (
                <>
                    {members.length === 0 ? (
                        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-16 text-center">
                            <User className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                            <p className="text-lg font-medium text-slate-400">{t('teacherDashboard.noMembers')}</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {members.map((member) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-md border-2 border-transparent hover:border-primary/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50">
                                            <PetAvatar type={member.avatar as any} color={member.avatar_color} size={56} level={member.level} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-800">{member.name}</h4>
                                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Trophy className="h-3 w-3 text-yellow-500" />
                                                    <span>{member.xp} XP</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-blue-400" />
                                                    <span>Level {member.level}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="rounded-xl p-3 text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
                                        title={t('teacherDashboard.removeMember')}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Assignments Tab */}
            {tab === 'assignments' && (
                <div className="space-y-4">
                    {!showCreator && (
                        <button
                            onClick={() => setShowCreator(true)}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="h-5 w-5" />
                            {t('assignments.create')}
                        </button>
                    )}

                    {showCreator && (
                        <AssignmentCreator
                            classId={classId}
                            onCreated={handleAssignmentCreated}
                            onBack={() => setShowCreator(false)}
                        />
                    )}

                    {assignments.length === 0 && !showCreator ? (
                        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                            <p className="font-medium text-slate-400">{t('assignments.noAssignments')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {assignments.map((a) => (
                                <motion.div
                                    key={a.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border-2 border-transparent hover:border-primary/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.subject === 'math' ? 'bg-emerald-100 text-emerald-600' :
                                                a.subject === 'english' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-purple-100 text-purple-600'
                                            }`}>
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{a.title}</h4>
                                            <p className="text-xs text-slate-400">
                                                {t(`assignments.${a.subject}`)} · {t('assignments.questions', { count: a.question_count })}
                                                {a.due_date ? ` · ${t('assignments.due', { date: new Date(a.due_date).toLocaleDateString() })}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Progress Tab */}
            {tab === 'progress' && (
                <StudentProgress classId={classId} className={className} />
            )}
        </div>
    );
}
