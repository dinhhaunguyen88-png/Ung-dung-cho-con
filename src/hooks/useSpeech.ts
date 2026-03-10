import { useCallback, useRef, useState, useEffect } from 'react';

interface UseSpeechOptions {
    rate?: number;
    pitch?: number;
    lang?: string;
}

export function useSpeech(options: UseSpeechOptions = {}) {
    const { rate = 0.85, pitch = 1, lang: defaultLang = 'vi-VN' } = options;
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
        setIsSupported(supported);

        if (supported) {
            const updateVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
            };

            window.speechSynthesis.onvoiceschanged = updateVoices;
            updateVoices();

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    const cancel = useCallback(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    const speak = useCallback(
        (text: string, overrideLang?: string) => {
            if (!isSupported) return;

            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            const targetLang = (overrideLang || defaultLang).toLowerCase();

            utterance.lang = targetLang;
            utterance.rate = rate;
            utterance.pitch = pitch;

            // Find best voice
            const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();

            // Priority selection for quality:
            // 1. Exact lang + "Google" (Higher quality)
            // 2. Exact lang + "Natural" or "Neural"
            // 3. Exact lang
            // 4. Lang group (e.g. 'vi')

            let bestVoice = availableVoices.find(v =>
                v.lang.toLowerCase() === targetLang && v.name.toLowerCase().includes('google')
            );

            if (!bestVoice) {
                bestVoice = availableVoices.find(v =>
                    v.lang.toLowerCase() === targetLang &&
                    (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural'))
                );
            }

            if (!bestVoice) {
                bestVoice = availableVoices.find(v => v.lang.toLowerCase() === targetLang);
            }

            if (!bestVoice) {
                const langGroup = targetLang.split('-')[0];
                bestVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith(langGroup));
            }

            if (bestVoice) {
                utterance.voice = bestVoice;
                // console.log(`Selected voice: ${bestVoice.name} (${bestVoice.lang})`);
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => {
                console.error('Speech error:', e);
                setIsSpeaking(false);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        },
        [isSupported, defaultLang, rate, pitch, voices]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return { speak, cancel, isSpeaking, isSupported, voices };
}
