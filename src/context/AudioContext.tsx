import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  playTone: (value: number, maxValue: number, type: 'compare' | 'swap' | 'sorted') => void;
  playSuccessMelody: () => void;
}

const AudioSettingsContext = createContext<AudioContextType | undefined>(undefined);

export const AudioSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved === 'true'; // sound is disabled by default
  });

  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('volume');
    return saved !== null ? parseInt(saved, 10) : 50; // default to 50%
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  // Sync sound settings to localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', String(isSoundEnabled));
  }, [isSoundEnabled]);

  useEffect(() => {
    localStorage.setItem('volume', String(volume));
    if (masterGainRef.current && audioCtxRef.current) {
      // Set volume gain on master connection
      masterGainRef.current.gain.setValueAtTime((volume / 100) * 0.08, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime((volume / 100) * 0.08, ctx.currentTime);
      gainNode.connect(ctx.destination);
      masterGainRef.current = gainNode;
    } catch (e) {
      console.error('Web Audio API not supported in this browser:', e);
    }
  };

  const playTone = (value: number, maxValue: number, type: 'compare' | 'swap' | 'sorted') => {
    if (!isSoundEnabled) return;
    initAudio();

    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    // Resume context if suspended (browser auto-blocker check)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const realTimeNow = performance.now();

    // Throttling for performance:
    // If elements N > 150, increase threshold spacing to avoid muddy audio clipping
    const isLargeArray = maxValue > 150;
    const throttleTime = isLargeArray ? 22 : 12;

    if (realTimeNow - lastPlayTimeRef.current < throttleTime) {
      return;
    }

    // Skip a percentage of comparison tones for large arrays to maintain performance and prevent chaotic noise
    if (isLargeArray && type === 'compare' && Math.random() > 0.3) {
      return;
    }

    lastPlayTimeRef.current = realTimeNow;

    // Map value to log-like linear frequency range (130Hz to 950Hz)
    const minFreq = 130;
    const maxFreq = 950;
    let frequency = minFreq + (value / maxValue) * (maxFreq - minFreq);

    let duration = 0.04;
    let oscType: OscillatorType = 'sine';
    let localGainFactor = 1.0;

    if (type === 'swap') {
      oscType = 'triangle'; // triangle wave has richer tone, sounds clearly different
      duration = 0.08;
      localGainFactor = 1.2;
    } else if (type === 'sorted') {
      oscType = 'sine';
      frequency += 150; // offset frequency for confirmation note
      duration = 0.06;
      localGainFactor = 0.8;
    }

    // Create oscillator and gain nodes for clean envelope control
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = oscType;
    osc.frequency.setValueAtTime(frequency, now);

    // Prevent popping by ramping gain down exponentially
    gainNode.gain.setValueAtTime(localGainFactor, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration);
  };

  const playSuccessMelody = () => {
    if (!isSoundEnabled) return;
    initAudio();

    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    // Ascending melody notes (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const noteDuration = 0.12;
    const overlap = 0.02;

    notes.forEach((freq, index) => {
      const startTime = now + index * (noteDuration - overlap);
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0.6, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);
    });
  };

  return (
    <AudioSettingsContext.Provider
      value={{
        isSoundEnabled,
        setIsSoundEnabled,
        volume,
        setVolume,
        playTone,
        playSuccessMelody
      }}
    >
      {children}
    </AudioSettingsContext.Provider>
  );
};

export const useAudioSettings = () => {
  const context = useContext(AudioSettingsContext);
  if (context === undefined) {
    throw new Error('useAudioSettings must be used within an AudioSettingsProvider');
  }
  return context;
};
