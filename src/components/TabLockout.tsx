import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, ShieldAlert, Zap, AlertTriangle, Timer, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { PomodoroState } from '../types';

interface TabLockoutProps {
  pomodoro: PomodoroState;
  setPomodoro: React.Dispatch<React.SetStateAction<PomodoroState>>;
}

export default function TabLockout({ pomodoro, setPomodoro }: TabLockoutProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [focusText, setFocusText] = useState('');
  const [hasCheated, setHasCheated] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on user interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playAlarm = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    if (isLocked) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          setHasCheated(true);
          playAlarm();
          // Pause pomodoro when tab is hidden
          setPomodoro(prev => ({ ...prev, isActive: false }));
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isLocked, setPomodoro]);

  // Play continuous alarm if cheated
  useEffect(() => {
    let alarmInterval: any;
    if (hasCheated && isLocked) {
      alarmInterval = setInterval(playAlarm, 1000);
    }
    return () => clearInterval(alarmInterval);
  }, [hasCheated, isLocked]);

  const handleStart = () => {
    if (focusText) {
      initAudio();
      setIsLocked(true);
      setHasCheated(false);
      // Automatically switch to work mode and start pomodoro
      setPomodoro(prev => ({ 
        ...prev, 
        mode: 'work',
        timeLeft: prev.settings.work * 60,
        isActive: true 
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center p-8">
      <AnimatePresence mode="wait">
        {!isLocked ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-md w-full glass p-10 rounded-3xl space-y-8 text-center"
          >
            <div className="w-20 h-20 theme-bg-subtle theme-text rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Kunci Fokus</h2>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm">
                Masukkan tujuan utama Anda. Setelah terkunci, meninggalkan tab ini akan memicu alarm.
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={focusText}
                onChange={(e) => setFocusText(e.target.value)}
                placeholder="Apa fokus Anda saat ini?"
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-4 theme-ring focus:ring-2 transition-all outline-none text-center font-medium dark:text-white"
              />
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <Timer className="w-3 h-3" />
                Akan disinkronkan dengan Pomodoro
              </div>
            <button
              onClick={handleStart}
              disabled={!focusText}
              className="w-full theme-bg theme-contrast-text py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all theme-shadow"
            >
                <Lock className="w-5 h-5" />
                Mulai Sesi Fokus
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center text-white p-6 overflow-hidden"
          >
            {/* Cheating Warning Overlay */}
            <AnimatePresence>
              {hasCheated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[110] bg-rose-600 flex flex-col items-center justify-center text-white p-12 text-center space-y-8"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <AlertTriangle className="w-32 h-32" />
                  </motion.div>
                  <div className="space-y-4">
                    <h2 className="text-6xl font-black tracking-tighter uppercase">Gangguan Terdeteksi!</h2>
                    <p className="text-2xl font-medium opacity-80">Anda meninggalkan zona fokus. Segera kembali ke tugas Anda.</p>
                  </div>
                  <button
                    onClick={() => setHasCheated(false)}
                    className="bg-white text-rose-600 px-12 py-6 rounded-2xl text-2xl font-black uppercase tracking-widest hover:bg-zinc-100 transition-all"
                  >
                    Saya Kembali, Saya Janji
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-12 left-12 flex items-center gap-2 text-zinc-500 font-mono text-sm tracking-widest uppercase">
              <Zap className="w-4 h-4 theme-text" />
              Now Or Never / Mode Fokus
            </div>

            <div className="space-y-12 text-center max-w-2xl">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                  {focusText}
                </h1>
                <p className="text-zinc-500 text-xl font-medium italic">
                  Tetap fokus. Jangan tinggalkan tab ini.
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className={cn(
                  "text-9xl font-mono font-bold tracking-tighter transition-colors duration-500",
                  pomodoro.mode === 'work' ? "theme-text" : "text-emerald-500"
                )}>
                  {formatTime(pomodoro.timeLeft)}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                    {pomodoro.mode === 'work' ? 'Sesi Fokus' : 'Waktu Istirahat'}
                  </span>
                  <button
                    onClick={() => setPomodoro(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    {pomodoro.isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-20 flex flex-col items-center gap-12">
                <button
                  onClick={() => {
                    setIsLocked(false);
                    setHasCheated(false);
                  }}
                  className="group flex flex-col items-center gap-3 opacity-30 hover:opacity-100 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-zinc-950 transition-all">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Akhiri Sesi</span>
                </button>

                <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] pointer-events-none">
                  Produktivitas Anda adalah prioritas Anda
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
