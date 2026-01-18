import { useRef, useCallback } from 'react';

// Free paper and wax seal sound URLs
const SOUNDS = {
  paperUnfold: 'https://assets.mixkit.co/active_storage/sfx/2651/2651-preview.mp3',
  waxBreak: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
};

export const useEnvelopeSounds = () => {
  const paperAudioRef = useRef<HTMLAudioElement | null>(null);
  const waxAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef(false);

  const preloadSounds = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    paperAudioRef.current = new Audio(SOUNDS.paperUnfold);
    paperAudioRef.current.volume = 0.4;
    paperAudioRef.current.preload = 'auto';
    
    waxAudioRef.current = new Audio(SOUNDS.waxBreak);
    waxAudioRef.current.volume = 0.5;
    waxAudioRef.current.preload = 'auto';
    
    hasInteracted.current = true;
  }, []);

  const playPaperSound = useCallback(() => {
    if (paperAudioRef.current && hasInteracted.current) {
      paperAudioRef.current.currentTime = 0;
      paperAudioRef.current.play().catch(() => {});
    }
  }, []);

  const playWaxSound = useCallback(() => {
    if (waxAudioRef.current && hasInteracted.current) {
      waxAudioRef.current.currentTime = 0;
      waxAudioRef.current.play().catch(() => {});
    }
  }, []);

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20, 10, 20],
        heavy: [30, 20, 30, 20, 30],
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  return {
    preloadSounds,
    playPaperSound,
    playWaxSound,
    triggerHaptic,
  };
};
