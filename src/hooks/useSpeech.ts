import { useCallback, useRef, useState, useEffect } from 'react';

interface UseSpeechOptions {
    rate?: number;
    pitch?: number;
    lang?: string;
}

/**
 * Splits text into chunks of max ~200 chars (Google Translate TTS limit),
 * breaking at sentence boundaries or commas.
 */
function splitTextForTTS(text: string, maxLen = 180): string[] {
    if (text.length <= maxLen) return [text];

    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > 0) {
        if (remaining.length <= maxLen) {
            chunks.push(remaining);
            break;
        }

        // Try to break at sentence end
        let breakPoint = -1;
        const searchRange = remaining.substring(0, maxLen);

        // Priority: sentence end (. ? !)  > comma > space
        for (const sep of ['. ', '? ', '! ', ', ', ' ']) {
            const idx = searchRange.lastIndexOf(sep);
            if (idx > 0) {
                breakPoint = idx + sep.length;
                break;
            }
        }

        if (breakPoint <= 0) breakPoint = maxLen;

        chunks.push(remaining.substring(0, breakPoint).trim());
        remaining = remaining.substring(breakPoint).trim();
    }

    return chunks;
}

export function useSpeech(options: UseSpeechOptions = {}) {
    const { rate = 0.85, pitch = 1, lang: defaultLang = 'vi-VN' } = options;
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [hasNativeVoice, setHasNativeVoice] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const supported = typeof window !== 'undefined' && ('speechSynthesis' in window || true);
        setIsSupported(supported);

        if ('speechSynthesis' in window) {
            const updateVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);

                const targetLang = defaultLang.toLowerCase();
                const langGroup = targetLang.split('-')[0];
                const hasVoice = availableVoices.some(v =>
                    v.lang.toLowerCase() === targetLang ||
                    v.lang.toLowerCase().startsWith(langGroup)
                );
                setHasNativeVoice(hasVoice);

                if (!hasVoice && availableVoices.length > 0) {
                    console.info(
                        `ℹ️ No native voice for "${defaultLang}". Will use Google Translate TTS as fallback.`
                    );
                }
            };

            window.speechSynthesis.onvoiceschanged = updateVoices;
            updateVoices();

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, [defaultLang]);

    const cancel = useCallback(() => {
        // Cancel native speech
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        // Cancel audio fallback
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        audioQueueRef.current = [];
        isPlayingRef.current = false;
        setIsSpeaking(false);
    }, []);

    /**
     * Play audio chunks sequentially from Google Translate TTS
     */
    const playGoogleTTS = useCallback((textChunks: string[], lang: string) => {
        audioQueueRef.current = textChunks.map(chunk => {
            const encoded = encodeURIComponent(chunk);
            return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`;
        });
        isPlayingRef.current = true;
        setIsSpeaking(true);

        const playNext = () => {
            if (audioQueueRef.current.length === 0 || !isPlayingRef.current) {
                isPlayingRef.current = false;
                setIsSpeaking(false);
                return;
            }

            const url = audioQueueRef.current.shift()!;
            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => playNext();
            audio.onerror = (e) => {
                console.error('Google TTS audio error:', e);
                // Try next chunk anyway
                playNext();
            };

            audio.play().catch(err => {
                console.error('Failed to play Google TTS:', err);
                isPlayingRef.current = false;
                setIsSpeaking(false);
            });
        };

        playNext();
    }, []);

    /**
     * Normalizes mathematical symbols to Vietnamese words for natural speech
     */
    const normalizeVietnameseMath = (text: string): string => {
        return text
            .replace(/\+/g, ' cộng ')
            .replace(/-/g, ' trừ ')
            .replace(/x/g, ' nhân ')
            .replace(/\*/g, ' nhân ')
            .replace(/:/g, ' chia ')
            .replace(/\//g, ' chia ')
            .replace(/=/g, ' bằng ')
            .replace(/\?/g, ' bao nhiêu ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const speak = useCallback(
        (text: string, overrideLang?: string) => {
            if (!isSupported || !text) return;

            // Cancel any ongoing speech
            cancel();

            const targetLang = (overrideLang || defaultLang).toLowerCase();
            const langGroup = targetLang.split('-')[0];

            // Normalize Vietnamese math if applicable
            let processedText = text;
            if (langGroup === 'vi') {
                processedText = normalizeVietnameseMath(text);
                console.log(`🔊 Normalized text: "${processedText}"`);
            }

            // Get available voices
            const availableVoices = voices.length > 0 ? voices : (
                'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []
            );

            // Check if native voice is available
            const nativeVoice = findBestVoice(availableVoices, targetLang, langGroup);

            if (nativeVoice) {
                // Use native Web Speech API
                const utterance = new SpeechSynthesisUtterance(processedText);
                utterance.lang = targetLang;
                utterance.rate = rate;
                utterance.pitch = pitch;
                utterance.voice = nativeVoice;

                console.log(`🔊 Using native voice: ${nativeVoice.name} (${nativeVoice.lang})`);

                // Vietnamese-specific tuning
                if (langGroup === 'vi') {
                    utterance.rate = Math.min(rate, 0.8);
                    utterance.pitch = 1.0;
                }

                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = (e) => {
                    console.error('Speech error:', e);
                    setIsSpeaking(false);
                };

                utteranceRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            } else {
                // Fallback: Use Google Translate TTS
                console.log(`🔊 Using Google Translate TTS fallback for "${langGroup}"`);
                const chunks = splitTextForTTS(processedText);
                playGoogleTTS(chunks, langGroup);
            }
        },
        [isSupported, defaultLang, rate, pitch, voices, cancel, playGoogleTTS]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return {
        speak,
        cancel,
        isSpeaking,
        isSupported,
        hasTargetVoice: hasNativeVoice || true, // Always true since we have Google TTS fallback
        voices
    };
}

/**
 * Find the best quality voice for the target language
 */
function findBestVoice(
    voices: SpeechSynthesisVoice[],
    targetLang: string,
    langGroup: string
): SpeechSynthesisVoice | undefined {
    // Priority 1: Exact lang + Google
    let best = voices.find(v =>
        v.lang.toLowerCase() === targetLang && v.name.toLowerCase().includes('google')
    );
    if (best) return best;

    // Priority 2: Exact lang + Natural/Neural
    best = voices.find(v =>
        v.lang.toLowerCase() === targetLang &&
        (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural'))
    );
    if (best) return best;

    // Priority 3: Exact lang + Online
    best = voices.find(v =>
        v.lang.toLowerCase() === targetLang &&
        v.name.toLowerCase().includes('online')
    );
    if (best) return best;

    // Priority 4: Exact lang match
    best = voices.find(v => v.lang.toLowerCase() === targetLang);
    if (best) return best;

    // Priority 5: Language group match (e.g. 'vi')
    best = voices.find(v => v.lang.toLowerCase().startsWith(langGroup));
    if (best) return best;

    return undefined;
}
