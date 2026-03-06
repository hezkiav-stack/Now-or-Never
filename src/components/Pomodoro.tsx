import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { PomodoroState, TimerMode, PomodoroSettings, UserStats } from '../types';

const MODES: Record<TimerMode, { label: string; color: string }> = {
  work: { label: 'Fokus', color: 'theme-text' },
  shortBreak: { label: 'Istirahat Singkat', color: 'text-emerald-500' },
  longBreak: { label: 'Istirahat Panjang', color: 'text-blue-500' },
};

interface PomodoroProps {
  state: PomodoroState;
  setState: React.Dispatch<React.SetStateAction<PomodoroState>>;
  userStats: UserStats;
}

const TomatoCharacter = () => (
  <motion.div 
    animate={{ y: [0, -8, 0] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    className="relative w-64 h-64"
  >
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      {/* Tomato Body */}
      <circle cx="100" cy="100" r="75" fill="#e53935" stroke="#4a1414" strokeWidth="4" />
      
      {/* Stem and Leaves */}
      <g fill="#7cb342" stroke="#4a1414" strokeWidth="3" strokeLinejoin="round">
        <path d="M92 30 L92 0 Q100 -10 108 0 L108 30 Z" />
        <path d="M100 30 Q150 30 175 80 Q130 70 100 30" />
        <path d="M100 30 Q50 30 25 80 Q70 70 100 30" />
        <path d="M100 30 Q110 75 135 90 Q120 65 100 30" />
        <path d="M100 30 Q90 75 65 90 Q80 65 100 30" />
        <path d="M100 30 Q100 65 100 85" fill="none" stroke="#4a1414" strokeWidth="2" opacity="0.3" />
      </g>

      {/* Sunglasses */}
      <g>
        <rect x="55" y="80" width="42" height="28" rx="6" fill="#1a1a1a" />
        <rect x="103" y="80" width="42" height="28" rx="6" fill="#1a1a1a" />
        <rect x="95" y="88" width="10" height="8" fill="#1a1a1a" />
        <path d="M60 87 L75 103" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <path d="M108 87 L123 103" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <circle cx="58" cy="85" r="2" fill="white" opacity="0.8" />
        <circle cx="106" cy="85" r="2" fill="white" opacity="0.8" />
      </g>
      
      {/* Mouth */}
      <circle cx="100" cy="130" r="10" fill="#1a1a1a" />
    </svg>
  </motion.div>
);

export default function Pomodoro({ state, setState, userStats }: PomodoroProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<PomodoroSettings>(state.settings);

  const resetTimer = (newMode?: TimerMode) => {
    const targetMode = newMode || state.mode;
    setState(prev => ({
      ...prev,
      mode: targetMode,
      timeLeft: prev.settings[targetMode] * 60,
      isActive: false,
    }));
  };

  const toggleTimer = () => {
    setState(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const saveSettings = () => {
    setState(prev => ({
      ...prev,
      settings: tempSettings,
      timeLeft: !prev.isActive ? tempSettings[prev.mode] * 60 : prev.timeLeft
    }));
    setIsSettingsOpen(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (state.timeLeft / (state.settings[state.mode] * 60)) * 100;
  const radius = 135;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray * (progress / 100);

  return (
    <div className="flex flex-col items-center max-w-md mx-auto theme-bg-card rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-zinc-100 dark:border-zinc-800 min-h-[720px] relative transition-colors">
      <div className="flex-1 flex flex-col items-center justify-center w-full p-8 space-y-12">
        {/* Timer Circle */}
        <div className="relative flex items-center justify-center w-80 h-80">
          <svg className="w-full h-full transform -rotate-90 overflow-visible">
            {/* Background Track */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              className="text-zinc-200/50 dark:text-zinc-800/50"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Bar */}
            <motion.circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              className="theme-text"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
              strokeLinecap="round"
            />
            {/* Decorative Glow */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              className="theme-text opacity-10 blur-md"
              strokeWidth="20"
              fill="transparent"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <TomatoCharacter />
          </div>
        </div>

        {/* Time Display */}
        <div className="text-center space-y-1">
          <motion.h2 
            key={state.timeLeft}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-6xl font-black tracking-tighter text-zinc-900 dark:text-white"
          >
            {formatTime(state.timeLeft)}
          </motion.h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
            {MODES[state.mode].label}
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className="w-full max-w-[240px] theme-bg theme-contrast-text py-4 rounded-2xl font-black text-xl theme-shadow-lg transition-all uppercase tracking-widest"
        >
          {state.isActive ? 'Jeda' : 'Mulai'}
        </motion.button>

        {/* Settings Trigger */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Settings2 className="w-4 h-4" />
          Pengaturan
        </button>
      </div>

      {/* Settings Modal (Simplified) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm z-50 p-8 flex flex-col justify-center transition-colors"
          >
            <h3 className="text-2xl font-black mb-8 dark:text-white">Pengaturan</h3>
            <div className="space-y-6 mb-12">
              {(Object.keys(tempSettings) as Array<keyof PomodoroSettings>).map((key) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    {key === 'work' ? 'Durasi Fokus' : key === 'shortBreak' ? 'Istirahat Singkat' : 'Istirahat Panjang'}
                  </label>
                  <input
                    type="number"
                    value={tempSettings[key]}
                    onChange={(e) => setTempSettings({ ...tempSettings, [key]: parseInt(e.target.value) || 1 })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 text-lg font-bold theme-ring focus:ring-2 outline-none dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                Batal
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 theme-bg theme-contrast-text py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <Check className="w-5 h-5" /> Simpan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Switcher (Bottom Bar Style) */}
      <div className="w-full theme-bg p-4 flex justify-around items-center theme-contrast-text">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => resetTimer(m)}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest transition-all",
              state.mode === m ? "scale-110 opacity-100" : "opacity-50 hover:opacity-80"
            )}
          >
            {MODES[m].label}
          </button>
        ))}
        <button
          onClick={() => resetTimer()}
          className="p-2 opacity-50 hover:opacity-100"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
