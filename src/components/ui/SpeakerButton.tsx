import { Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '../../hooks/useSpeech';

interface SpeakerButtonProps {
    text: string;
    lang?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeMap = {
    sm: { icon: 14, button: 'h-7 w-7' },
    md: { icon: 18, button: 'h-9 w-9' },
    lg: { icon: 22, button: 'h-11 w-11' },
};

export function SpeakerButton({
    text,
    lang,
    size = 'md',
    className = '',
}: SpeakerButtonProps) {
    const { t } = useTranslation();
    const { speak, cancel, isSpeaking, isSupported } = useSpeech({
        lang: lang || 'vi-VN',
    });

    if (!isSupported) return null;

    const handleClick = () => {
        if (isSpeaking) {
            cancel();
        } else {
            speak(text, lang);
        }
    };

    const { icon, button } = sizeMap[size];

    return (
        <button
            onClick={handleClick}
            title={isSpeaking ? t('common.stopReading') : t('common.readAloud')}
            className={`flex items-center justify-center rounded-full transition-all ${isSpeaking
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                : 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105'
                } ${button} ${className}`}
        >
            {isSpeaking ? <VolumeX size={icon} /> : <Volume2 size={icon} />}
        </button>
    );
}
