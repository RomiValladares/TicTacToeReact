type WindowWithWebkitAudio = Window & {
    webkitAudioContext?: typeof AudioContext;
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        const AudioContextCtor =
            window.AudioContext
            ?? (window as WindowWithWebkitAudio).webkitAudioContext;

        if (!AudioContextCtor) {
            throw new Error('Web Audio API is not supported in this browser');
        }

        audioCtx = new AudioContextCtor();
    }
    return audioCtx;
}

export type SoundType = 'clickX' | 'clickO' | 'win' | 'draw';

export const playSound = (type: SoundType) => {
    try {
        const ctx = getAudioContext();

        // Browsers block audio until a user interaction happens
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'clickX':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(440, now); // A4 note
                oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.04); // Quick upward blip
                gainNode.gain.setValueAtTime(0.08, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;

            case 'clickO':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(349.23, now); // F4 note
                oscillator.frequency.exponentialRampToValueAtTime(523.25, now + 0.04); // Slightly lower blip
                gainNode.gain.setValueAtTime(0.08, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;

            case 'win':
                oscillator.type = 'sine';
                // Classic arpeggio chord progression (C5 -> E5 -> G5 -> C6)
                oscillator.frequency.setValueAtTime(523.25, now);
                oscillator.frequency.setValueAtTime(659.25, now + 0.06);
                oscillator.frequency.setValueAtTime(783.99, now + 0.12);
                oscillator.frequency.setValueAtTime(1046.50, now + 0.18);
                gainNode.gain.setValueAtTime(0.06, now);
                gainNode.gain.linearRampToValueAtTime(0.06, now + 0.18);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                oscillator.start(now);
                oscillator.stop(now + 0.35);
                break;

            case 'draw':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(293.66, now); // D4 note
                oscillator.frequency.linearRampToValueAtTime(146.83, now + 0.25); // Sad slide down
                gainNode.gain.setValueAtTime(0.08, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                oscillator.start(now);
                oscillator.stop(now + 0.25);
                break;
        }
    } catch (error) {
        console.warn('Web Audio API is not supported or was blocked by the browser:', error);
    }
};