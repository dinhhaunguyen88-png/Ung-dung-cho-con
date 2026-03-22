/**
 * useSound - Web Audio API sound effects hook (no mp3 files needed)
 * Generates tones using oscillators for lightweight, instant feedback sounds.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch {
        // Silently fail - audio not critical
    }
}

function playSequence(notes: { freq: number; dur: number; delay: number }[], type: OscillatorType = 'sine') {
    notes.forEach(({ freq, dur, delay }) => {
        setTimeout(() => playTone(freq, dur, type), delay * 1000);
    });
}

export function useSound() {
    const playCorrect = () => {
        playSequence([
            { freq: 523, dur: 0.15, delay: 0 },    // C5
            { freq: 659, dur: 0.15, delay: 0.1 },   // E5
            { freq: 784, dur: 0.25, delay: 0.2 },   // G5
        ]);
    };

    const playWrong = () => {
        playSequence([
            { freq: 300, dur: 0.2, delay: 0 },
            { freq: 250, dur: 0.3, delay: 0.15 },
        ], 'sawtooth');
    };

    const playCombo = () => {
        playSequence([
            { freq: 523, dur: 0.1, delay: 0 },
            { freq: 659, dur: 0.1, delay: 0.08 },
            { freq: 784, dur: 0.1, delay: 0.16 },
            { freq: 1047, dur: 0.3, delay: 0.24 },
        ]);
    };

    const playComplete = () => {
        playSequence([
            { freq: 523, dur: 0.15, delay: 0 },
            { freq: 659, dur: 0.15, delay: 0.12 },
            { freq: 784, dur: 0.15, delay: 0.24 },
            { freq: 1047, dur: 0.15, delay: 0.36 },
            { freq: 1319, dur: 0.4, delay: 0.48 },
        ]);
    };

    const playClick = () => {
        playTone(800, 0.05, 'sine', 0.15);
    };

    return { playCorrect, playWrong, playCombo, playComplete, playClick };
}
