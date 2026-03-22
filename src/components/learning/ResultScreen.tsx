import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, ChevronDown, ChevronUp, Star, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WrongAnswer {
    question: string;
    userAnswer: string;
    correctAnswer: string;
}

interface ResultScreenProps {
    correctCount: number;
    totalQuestions: number;
    wrongAnswers: WrongAnswer[];
    streak: number;
    onRetry: () => void;
    onHome: () => void;
}

export function ResultScreen({
    correctCount,
    totalQuestions,
    wrongAnswers,
    streak,
    onRetry,
    onHome,
}: ResultScreenProps) {
    const { i18n } = useTranslation();
    const vi = i18n.language === 'vi';
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const xpEarned = correctCount * 10 + (streak >= 5 ? 50 : streak >= 3 ? 25 : 0);
    const starsEarned = Math.floor(correctCount / 3);
    const isPerfect = percentage === 100;
    const isGreat = percentage >= 80;
    const [showWrong, setShowWrong] = useState(false);
    const [confettiPieces, setConfettiPieces] = useState<{ id: number; x: number; delay: number; color: string; size: number }[]>([]);

    useEffect(() => {
        if (isGreat) {
            const pieces = Array.from({ length: 40 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 2,
                color: ['#30e86e', '#ff7e47', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 6)],
                size: Math.random() * 8 + 4,
            }));
            setConfettiPieces(pieces);
        }
    }, [isGreat]);

    const getMessage = () => {
        if (isPerfect) return vi ? '🏆 Hoàn hảo! Xuất sắc!' : '🏆 Perfect Score! Amazing!';
        if (percentage >= 80) return vi ? '🌟 Giỏi lắm! Tuyệt vời!' : '🌟 Great Job! Awesome!';
        if (percentage >= 60) return vi ? '👍 Khá tốt! Cố gắng thêm!' : '👍 Good effort! Keep going!';
        return vi ? '💪 Cố gắng lên! Lần sau sẽ tốt hơn!' : '💪 Keep trying! You\'ll do better!';
    };

    const getEmoji = () => {
        if (isPerfect) return '🎉';
        if (percentage >= 80) return '🌟';
        if (percentage >= 60) return '😊';
        return '💪';
    };

    return (
        <div className="relative flex flex-col items-center overflow-hidden">
            {/* Confetti */}
            {isGreat && confettiPieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
                    animate={{ y: '100vh', opacity: 0, rotate: 720 }}
                    transition={{ duration: 3 + Math.random() * 2, delay: piece.delay, ease: 'easeIn' }}
                    className="pointer-events-none fixed top-0 z-50"
                    style={{ width: piece.size, height: piece.size, backgroundColor: piece.color, borderRadius: Math.random() > 0.5 ? '50%' : '2px' }}
                />
            ))}

            {/* Main Result Card */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="w-full max-w-lg rounded-3xl border-4 border-white bg-white p-8 shadow-2xl md:p-12"
            >
                {/* Emoji & Message */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
                    className="mb-6 text-center"
                >
                    <span className="text-7xl">{getEmoji()}</span>
                </motion.div>
                <h1 className="mb-2 text-center text-2xl font-black text-slate-900 md:text-3xl">
                    {getMessage()}
                </h1>

                {/* Score Circle */}
                <div className="my-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className={`flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 shadow-inner md:h-44 md:w-44 ${
                            isPerfect ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50' :
                            isGreat ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50' :
                            'border-blue-300 bg-gradient-to-br from-blue-50 to-sky-50'
                        }`}
                    >
                        <span className="text-4xl font-black text-slate-900 md:text-5xl">{percentage}%</span>
                        <span className="text-sm font-bold text-slate-500">{correctCount}/{totalQuestions}</span>
                    </motion.div>
                </div>

                {/* Stats Row */}
                <div className="mb-8 grid grid-cols-3 gap-3">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col items-center rounded-2xl bg-purple-50 px-3 py-4"
                    >
                        <Zap className="mb-1 text-purple-500" size={22} />
                        <span className="text-xl font-black text-purple-700">+{xpEarned}</span>
                        <span className="text-xs font-bold text-purple-400">XP</span>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col items-center rounded-2xl bg-yellow-50 px-3 py-4"
                    >
                        <Star className="mb-1 fill-yellow-400 text-yellow-500" size={22} />
                        <span className="text-xl font-black text-yellow-700">+{starsEarned}</span>
                        <span className="text-xs font-bold text-yellow-400">{vi ? 'Sao' : 'Stars'}</span>
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-col items-center rounded-2xl bg-orange-50 px-3 py-4"
                    >
                        <span className="mb-1 text-lg">🔥</span>
                        <span className="text-xl font-black text-orange-700">x{streak}</span>
                        <span className="text-xs font-bold text-orange-400">Streak</span>
                    </motion.div>
                </div>

                {/* Wrong Answers Accordion */}
                {wrongAnswers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mb-6"
                    >
                        <button
                            onClick={() => setShowWrong(!showWrong)}
                            className="flex w-full items-center justify-between rounded-xl bg-red-50 px-5 py-3 font-bold text-red-600 transition-colors hover:bg-red-100"
                        >
                            <span>❌ {vi ? `${wrongAnswers.length} câu sai` : `${wrongAnswers.length} wrong`}</span>
                            {showWrong ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {showWrong && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="mt-2 space-y-2 overflow-hidden"
                            >
                                {wrongAnswers.map((wa, i) => (
                                    <div key={i} className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
                                        <p className="mb-1 text-sm font-bold text-slate-700">{wa.question}</p>
                                        <div className="flex gap-4 text-sm">
                                            <span className="text-red-500">
                                                ✗ {wa.userAnswer}
                                            </span>
                                            <span className="font-bold text-emerald-600">
                                                ✓ {wa.correctAnswer}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onRetry}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary bg-white px-6 py-3 font-bold text-primary shadow-sm transition-colors hover:bg-primary/5"
                    >
                        <RotateCcw size={18} /> {vi ? 'Làm lại' : 'Try Again'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onHome}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-colors hover:brightness-110"
                    >
                        <Home size={18} /> {vi ? 'Về trang chủ' : 'Go Home'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
