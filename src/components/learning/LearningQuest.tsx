import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Gift,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SpeakerButton } from '../ui/SpeakerButton';
import { useSpeech } from '../../hooks/useSpeech';
import { getQuestions, saveProgress } from '../../services/api';
import { useSound } from '../../hooks/useSound';
import { ResultScreen } from './ResultScreen';

export function LearningQuest({
    subject = 'math',
    userId = null,
    topic,
    questionLimit = 15,
    title,
    onComplete,
    onBack,
}: {
    subject?: string;
    userId?: string | null;
    topic?: string;
    questionLimit?: number;
    title?: string;
    onComplete: () => void;
    onBack: () => void;
}) {
    const { t, i18n } = useTranslation();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinishing, setIsFinishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [streak, setStreak] = useState(0);
    const [showCombo, setShowCombo] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState<any[]>([]);
    const [showResult, setShowResult] = useState(false);

    const { speak } = useSpeech({ lang: i18n.language === 'vi' ? 'vi-VN' : 'en-US' });
    const { playCorrect, playWrong, playCombo, playComplete } = useSound();

    const fetchQuestions = async () => {
        setIsLoading(true);
        setError(null);
        setCurrentIndex(0);
        setSelected(null);
        setCorrectCount(0);
        setIsFinishing(false);
        try {
            const data = await getQuestions(subject, questionLimit, topic);
            if (data.length === 0) {
                setQuestions([]);
                setError(t('learning.noQuestions') || 'No questions match this lesson yet.');
                return;
            }
            setQuestions(data);
        } catch (err) {
            console.error('Failed to fetch questions:', err);
            setError(t('learning.errorFetch') || 'Failed to load questions');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch questions on mount
    useEffect(() => {
        fetchQuestions();
    }, [subject, topic, questionLimit]);

    const currentQuestion = questions[currentIndex];
    const currentLang = i18n.language === 'vi' ? 'vi' : 'en';
    const localizedContent = currentQuestion?.content?.[currentLang] || currentQuestion?.content?.['vi'] || {};

    // Auto-read question when it changes
    useEffect(() => {
        if (localizedContent?.questionReadText) {
            const timer = setTimeout(() => speak(localizedContent.questionReadText), 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, currentQuestion, currentLang]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center gap-8 p-6">
                {/* Skeleton: progress bar */}
                <div className="w-full rounded-xl bg-white p-6 shadow-sm">
                    <div className="mb-3 flex justify-between">
                        <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-200" />
                        <div className="h-5 w-16 animate-pulse rounded-lg bg-slate-200" />
                    </div>
                    <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
                </div>
                {/* Skeleton: question */}
                <div className="w-full rounded-3xl border-8 border-blue-50 bg-white p-12 md:p-20">
                    <div className="mx-auto mb-4 h-6 w-24 animate-pulse rounded-lg bg-slate-200" />
                    <div className="mx-auto h-16 w-48 animate-pulse rounded-2xl bg-slate-100" />
                </div>
                {/* Skeleton: choices */}
                <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200 md:h-32 md:w-32 lg:h-44 lg:w-44" />
                            <div className="mt-4 h-8 w-12 animate-pulse rounded-full bg-slate-100" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
                <p className="text-xl font-bold text-rose-500 mb-4">{error}</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={onBack} className="px-6 py-2 rounded-full bg-slate-100 font-bold text-slate-600">
                        {i18n.language === 'vi' ? 'Quay lại' : 'Go back'}
                    </button>
                    <button onClick={fetchQuestions} className="px-6 py-2 rounded-full bg-primary font-bold text-white shadow-lg shadow-primary/30">
                        {i18n.language === 'vi' ? 'Thử lại' : 'Try again'}
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
                <p className="text-xl font-bold text-slate-600">
                    {i18n.language === 'vi' ? 'Hết câu hỏi rồi! Chờ em nạp thêm nhé 🐾' : 'No more questions! Wait for more 🐾'}
                </p>
                <button onClick={onBack} className="mt-6 px-8 py-3 rounded-full bg-primary font-bold text-white shadow-lg shadow-primary/30">
                    {i18n.language === 'vi' ? 'Quay lại' : 'Go back'}
                </button>
            </div>
        );
    }

    const handleNext = async () => {
        if (answerState !== 'idle') return; // Prevent double-tap
        // Use loose equality to handle string vs number IDs (e.g. "1" == 1)
        const isCorrect = selected == currentQuestion.correct_answer_id;

        if (isCorrect) {
            setCorrectCount((c) => c + 1);
            setAnswerState('correct');
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak >= 3) {
                setShowCombo(true);
                playCombo();
            } else {
                playCorrect();
            }
            const comboMsg = newStreak >= 5
                ? (i18n.language === 'vi' ? `SIÊU COMBO ${newStreak}! Xuất sắc!` : `SUPER COMBO ${newStreak}! Amazing!`)
                : newStreak >= 3
                    ? (i18n.language === 'vi' ? `Combo ${newStreak}! Giỏi lắm!` : `Combo ${newStreak}! Great job!`)
                    : (i18n.language === 'vi' ? 'Đúng rồi! Giỏi lắm!' : 'Correct! Great job!');
            speak(comboMsg);
        } else {
            setAnswerState('wrong');
            setStreak(0);
            setShowCombo(false);
            playWrong();
            const correctAnswer = currentQuestion.choices.find((c: any) => c.id == currentQuestion.correct_answer_id);
            setWrongAnswers((prev) => [...prev, {
                question: localizedContent.questionText,
                userAnswer: currentQuestion.choices.find((c: any) => c.id == selected)?.value,
                correctAnswer: correctAnswer?.value,
            }]);
            const msg = i18n.language === 'vi'
                ? `Chưa đúng rồi! Đáp án là ${correctAnswer?.value || ''} cơ.`
                : `Not quite! The answer is ${correctAnswer?.value || ''}.`;
            speak(msg);
        }

        // Delay 1.5s to show visual feedback, then advance
        setTimeout(async () => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelected(null);
                setAnswerState('idle');
            } else {
                setIsFinishing(true);
                const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
                if (userId) {
                    try {
                        await saveProgress(
                            userId,
                            subject,
                            topic || questions[0]?.topic || 'general',
                            finalCorrect,
                            questions.length,
                        );
                    } catch (err) {
                        console.error('Failed to save progress:', err);
                    }
                }
                playComplete();
                setShowResult(true);
            }
        }, 1500);
    };

    const choiceColors = [
        { color: 'bg-pink-300', shadow: 'shadow-[0_10px_0_0_#e6a1bc]' },
        { color: 'bg-orange-300', shadow: 'shadow-[0_10px_0_0_#e6c8a7]' },
        { color: 'bg-yellow-200', shadow: 'shadow-[0_10px_0_0_#e6e6a7]' },
        { color: 'bg-blue-300', shadow: 'shadow-[0_10px_0_0_#a8cbe6]' },
    ];

    const getChoiceFeedbackClass = (choiceId: number) => {
        if (answerState === 'idle') return '';
        const isThisCorrect = choiceId == currentQuestion.correct_answer_id;
        const isThisSelected = choiceId == selected;
        if (isThisCorrect) return 'ring-4 ring-emerald-400 !bg-emerald-400 scale-110';
        if (isThisSelected && !isThisCorrect) return 'ring-4 ring-red-400 !bg-red-400 animate-shake opacity-70';
        return 'opacity-40';
    };

    // Show result screen after quest completion
    if (showResult) {
        return (
            <ResultScreen
                correctCount={correctCount}
                totalQuestions={questions.length}
                wrongAnswers={wrongAnswers}
                streak={streak}
                onRetry={() => {
                    setShowResult(false);
                    setWrongAnswers([]);
                    setStreak(0);
                    setShowCombo(false);
                    fetchQuestions();
                }}
                onHome={onComplete}
            />
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="mb-8 w-full rounded-xl border-2 border-primary/5 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Gift className="text-primary" />
                        <div>
                            <p className="text-lg font-bold text-slate-900">{t('learning.questProgress')}</p>
                            {title && (
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
                            )}
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-600">
                        {t('learning.solved', { current: currentIndex + 1, total: questions.length })}
                    </p>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="relative w-full">
                <div className="relative mb-12 flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-8 border-blue-100 bg-white p-12 text-center shadow-xl md:p-20">
                    <h3 className="mb-4 text-xl font-bold uppercase tracking-widest text-slate-500">
                        {t('learning.question', { number: currentIndex + 1 })}
                    </h3>
                    {localizedContent.imageUrl && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-6 w-full max-w-sm overflow-hidden rounded-2xl border-4 border-slate-50 shadow-inner"
                        >
                            <img
                                src={localizedContent.imageUrl}
                                alt="Question illustration"
                                className="h-48 w-full object-cover md:h-64"
                            />
                        </motion.div>
                    )}
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <h1 className={`font-black text-slate-900 drop-shadow-sm ${
                            (localizedContent.questionText?.length || 0) > 30
                                ? 'text-xl md:text-2xl leading-relaxed'
                                : (localizedContent.questionText?.length || 0) > 15
                                    ? 'text-3xl md:text-4xl'
                                    : 'text-6xl md:text-8xl'
                        }`}>
                            {localizedContent.questionText}
                        </h1>
                        <SpeakerButton
                            text={localizedContent.questionReadText}
                            lang={i18n.language === 'vi' ? 'vi-VN' : 'en-US'}
                            size="lg"
                        />
                    </div>
                    <p className="text-lg font-medium text-slate-600 md:text-xl">
                        {t('learning.chooseCorrect')}
                    </p>
                </div>

                {/* Combo indicator */}
                {showCombo && answerState === 'idle' && (
                    <motion.div
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="absolute -top-4 right-4 z-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 text-lg font-black text-white shadow-lg"
                    >
                        🔥 {streak >= 5 ? 'SUPER ' : ''}Combo x{streak}!
                    </motion.div>
                )}

                <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                    {currentQuestion.choices.map((choice: any, index: number) => {
                        const val = String(choice.value);
                        const isLong = val.length > 3;
                        const fontSize = isLong
                            ? (val.length > 15 ? 'text-base md:text-lg lg:text-xl' : 'text-lg md:text-xl lg:text-2xl')
                            : 'text-2xl md:text-4xl lg:text-5xl';

                        return (
                            <button
                                key={choice.id}
                                onClick={() => answerState === 'idle' && setSelected(choice.id)}
                                disabled={answerState !== 'idle'}
                                className={`group relative flex flex-col items-center transition-all duration-300 ${answerState === 'idle' ? 'hover:scale-105 active:scale-95' : ''} ${selected === choice.id && answerState === 'idle' ? 'scale-110' : ''}`}
                            >
                                <div
                                    className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white p-3 text-center transition-all duration-300 md:h-32 md:w-32 md:p-4 lg:h-44 lg:w-44 ${choiceColors[index % 4].color} ${choiceColors[index % 4].shadow} ${getChoiceFeedbackClass(choice.id)}`}
                                >
                                    <span className={`${fontSize} font-black leading-tight text-white drop-shadow-md break-words line-clamp-3`}>
                                        {choice.value}
                                    </span>
                                    {/* Correct checkmark overlay */}
                                    {answerState !== 'idle' && choice.id == currentQuestion.correct_answer_id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg md:h-10 md:w-10"
                                        >
                                            ✓
                                        </motion.div>
                                    )}
                                    {/* Wrong X overlay */}
                                    {answerState === 'wrong' && choice.id == selected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg md:h-10 md:w-10"
                                        >
                                            ✗
                                        </motion.div>
                                    )}
                                </div>
                                <div
                                    className={`mt-3 rounded-full border-2 bg-white px-4 py-1.5 shadow-sm transition-colors md:mt-4 md:px-6 md:py-2 ${selected === choice.id && answerState === 'idle'
                                        ? 'border-primary bg-primary/10'
                                        : `border-slate-200`
                                        }`}
                                >
                                    <span className={`text-lg font-extrabold md:text-xl ${selected === choice.id && answerState === 'idle' ? 'text-primary' : 'text-slate-400'}`}>
                                        {choice.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Correct/Wrong feedback banner */}
            {answerState !== 'idle' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 flex w-full items-center justify-center gap-3 rounded-2xl p-4 text-lg font-black shadow-lg ${
                        answerState === 'correct'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {answerState === 'correct' ? (
                        <>{streak >= 3 ? `🔥 ${i18n.language === 'vi' ? `Combo ${streak}! Tuyệt vời!` : `Combo ${streak}! Amazing!`}` : (i18n.language === 'vi' ? '✅ Đúng rồi! Giỏi lắm!' : '✅ Correct! Great job!')}</>
                    ) : (
                        <>{i18n.language === 'vi' ? '❌ Chưa đúng! Xem đáp án bên trên nhé.' : '❌ Not quite! See the correct answer above.'}</>
                    )}
                </motion.div>
            )}

            <footer className="mt-8 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-inner md:mt-16 md:p-4">
                <button
                    onClick={onBack}
                    disabled={answerState !== 'idle'}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-primary md:text-base"
                >
                    <ArrowLeft size={18} /> {t('learning.quitLesson')}
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleNext}
                        disabled={selected === null || isFinishing || answerState !== 'idle'}
                        className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:brightness-110 disabled:opacity-50 md:px-10 md:py-3 md:text-base"
                    >
                        {isFinishing ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {i18n.language === 'vi' ? 'Đang nạp XP...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                {currentIndex < questions.length - 1 ? t('learning.nextQuestion') : (i18n.language === 'vi' ? 'Hoàn thành' : 'Finish')}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
}
