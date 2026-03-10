import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Gift,
    Star,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';
import { SpeakerButton } from '../ui/SpeakerButton';
import { useSpeech } from '../../hooks/useSpeech';
import { saveProgress } from '../../services/api';

export function LearningQuest({
    subject = 'math',
    userId = null,
    onComplete,
    onBack,
}: {
    subject?: string;
    userId?: string | null;
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

    const { speak } = useSpeech({ lang: i18n.language === 'vi' ? 'vi-VN' : 'en-US' });

    const fetchQuestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/questions?subject=${subject}&limit=5`);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data);
            } else {
                setError(t('learning.errorFetch') || 'Failed to load questions');
            }
        } catch (err) {
            console.error('Failed to fetch questions:', err);
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch questions on mount
    useEffect(() => {
        fetchQuestions();
    }, [subject]);

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
            <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
        // Use loose equality to handle string vs number IDs (e.g. "1" == 1)
        const isCorrect = selected == currentQuestion.correct_answer_id;

        if (isCorrect) {
            setCorrectCount((c) => c + 1);
            const msg = i18n.language === 'vi' ? 'Đúng rồi! Giỏi lắm!' : 'Correct! Great job!';
            speak(msg);
        } else {
            const correctAnswer = currentQuestion.choices.find((c: any) => c.id == currentQuestion.correct_answer_id);
            const msg = i18n.language === 'vi'
                ? `Chưa đúng rồi! Đáp án là ${correctAnswer?.value || ''} cơ.`
                : `Not quite! The answer is ${correctAnswer?.value || ''}.`;
            speak(msg);
            // No alert() here as it blocks the thread/UI
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelected(null);
        } else {
            setIsFinishing(true);
            // Save progress to backend using API service
            const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
            if (userId) {
                try {
                    await saveProgress(
                        userId,
                        subject,
                        questions[0]?.topic || 'general',
                        finalCorrect,
                        questions.length,
                    );
                } catch (err) {
                    console.error('Failed to save progress:', err);
                }
            }
            onComplete();
        }
    };

    const choiceColors = [
        { color: 'bg-pink-300', shadow: 'shadow-[0_10px_0_0_#e6a1bc]' },
        { color: 'bg-orange-300', shadow: 'shadow-[0_10px_0_0_#e6c8a7]' },
        { color: 'bg-yellow-200', shadow: 'shadow-[0_10px_0_0_#e6e6a7]' },
        { color: 'bg-blue-300', shadow: 'shadow-[0_10px_0_0_#a8cbe6]' },
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="mb-8 w-full rounded-xl border-2 border-primary/5 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Gift className="text-primary" />
                        <p className="text-lg font-bold text-slate-900">{t('learning.questProgress')}</p>
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
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <h1 className="text-6xl font-black text-slate-900 drop-shadow-sm md:text-8xl">
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

                <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                    {currentQuestion.choices.map((choice: any, index: number) => {
                        const val = String(choice.value);
                        const isLong = val.length > 3;
                        const fontSize = isLong
                            ? (val.length > 15 ? 'text-lg md:text-xl' : 'text-xl md:text-2xl')
                            : 'text-4xl md:text-5xl';

                        return (
                            <button
                                key={choice.id}
                                onClick={() => setSelected(choice.id)}
                                className={`group relative flex flex-col items-center transition-all hover:scale-105 active:scale-95 ${selected === choice.id ? 'scale-110' : ''
                                    }`}
                            >
                                <div
                                    className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white p-4 text-center md:h-44 md:w-44 ${choiceColors[index % 4].color} ${choiceColors[index % 4].shadow}`}
                                >
                                    <span className={`${fontSize} font-black leading-tight text-white drop-shadow-md break-words line-clamp-3`}>
                                        {choice.value}
                                    </span>
                                </div>
                                <div
                                    className={`mt-4 rounded-full border-2 bg-white px-6 py-2 shadow-sm transition-colors ${selected === choice.id
                                        ? 'border-primary bg-primary/10'
                                        : `border-slate-200`
                                        }`}
                                >
                                    <span className={`text-xl font-extrabold ${selected === choice.id ? 'text-primary' : 'text-slate-400'}`}>
                                        {choice.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <footer className="mt-16 flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-inner">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-primary"
                >
                    <ArrowLeft size={20} /> {t('learning.quitLesson')}
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleNext}
                        disabled={selected === null || isFinishing}
                        className="flex items-center gap-2 rounded-full bg-primary px-10 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:brightness-110 disabled:opacity-50"
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
