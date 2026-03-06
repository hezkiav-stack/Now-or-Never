import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Timer, Shield, Home as HomeIcon, Zap, HelpCircle, LogOut } from 'lucide-react';
import { TabType, PomodoroState, TimerMode, UserStats } from './types';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import Home from './components/Home';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import Pomodoro from './components/Pomodoro';
import TabLockout from './components/TabLockout';
import HelpDialog from './components/HelpDialog';
import Auth from './components/Auth';
import { cn } from './lib/utils';

const DEFAULT_SETTINGS = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [helpOpen, setHelpOpen] = useState<'eisenhower' | 'pomodoro' | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // User Stats State
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('now-or-never-user-stats');
    if (saved) return JSON.parse(saved);
    return {
      exp: 0,
      level: 1,
      name: 'User',
      themeColor: '#10b981', // Default emerald
      darkMode: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('now-or-never-user-stats', JSON.stringify(userStats));
    
    // Apply dark mode class
    if (userStats.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply theme color variable
    let themeColor = userStats.themeColor;
    let contentColor = themeColor;
    let contrastColor = '#ffffff';
    
    const isWhite = themeColor.toLowerCase() === '#ffffff';
    
    if (userStats.darkMode) {
      if (isWhite) {
        themeColor = '#000000';
        contentColor = '#ffffff';
        contrastColor = '#ffffff';
      } else if (themeColor.toLowerCase() === '#000000') {
        contentColor = '#ffffff';
        contrastColor = '#ffffff';
      }
    } else {
      if (isWhite) {
        contentColor = '#000000';
        contrastColor = '#000000';
      }
    }
    
    document.documentElement.style.setProperty('--theme-color', themeColor);
    document.documentElement.style.setProperty('--theme-content-color', contentColor);
    document.documentElement.style.setProperty('--theme-contrast-color', contrastColor);
  }, [userStats]);

  const awardExp = useCallback((amount: number) => {
    setUserStats(prev => {
      const newExp = prev.exp + amount;
      const newLevel = Math.floor(newExp / 100) + 1;
      return { ...prev, exp: newExp, level: newLevel };
    });
  }, []);
  
  // Global Pomodoro State
  const [pomodoro, setPomodoro] = useState<PomodoroState>(() => {
    const saved = localStorage.getItem('now-or-never-pomodoro');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If it was active, we might want to account for missed time, 
      // but for simplicity we'll just resume from where it was or stop it.
      return { ...parsed, isActive: false }; 
    }
    return {
      mode: 'work',
      timeLeft: DEFAULT_SETTINGS.work * 60,
      isActive: false,
      sessionsCompleted: 0,
      settings: DEFAULT_SETTINGS,
      lastTick: Date.now(),
    };
  });

  useEffect(() => {
    localStorage.setItem('now-or-never-pomodoro', JSON.stringify(pomodoro));
  }, [pomodoro]);

  useEffect(() => {
    let interval: any = null;
    if (pomodoro.isActive && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1),
          lastTick: Date.now()
        }));
      }, 1000);
    } else if (pomodoro.isActive && pomodoro.timeLeft === 0) {
      // Timer finished logic
      const nextMode = (current: PomodoroState): TimerMode => {
        if (current.mode === 'work') {
          const newSessions = current.sessionsCompleted + 1;
          return newSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
        }
        return 'work';
      };

      const mode = nextMode(pomodoro);
      const sessionsCompleted = pomodoro.mode === 'work' ? pomodoro.sessionsCompleted + 1 : pomodoro.sessionsCompleted;
      
      setPomodoro(prev => ({
        ...prev,
        mode,
        timeLeft: prev.settings[mode] * 60,
        isActive: false, // Stop to let user start next session
        sessionsCompleted,
      }));

      // Alert user
      alert(`Sesi selesai! Berikutnya: ${mode === 'work' ? 'Fokus' : mode === 'shortBreak' ? 'Istirahat Singkat' : 'Istirahat Panjang'}`);
    }
    return () => clearInterval(interval);
  }, [pomodoro.isActive, pomodoro.timeLeft, pomodoro.mode, pomodoro.settings, pomodoro.sessionsCompleted]);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: HomeIcon },
    { id: 'eisenhower', label: 'Matriks Eisenhower', icon: LayoutGrid },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'lockout', label: 'Kunci Fokus', icon: Shield },
  ] as const;

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex flex-col theme-page-bg transition-colors duration-300">
      {/* Help Dialogs */}
      <HelpDialog
        isOpen={helpOpen === 'eisenhower'}
        onClose={() => setHelpOpen(null)}
        title="Matriks Eisenhower"
      >
        <div className="space-y-4 dark:text-zinc-300">
          <p>Penggunaan Matriks Eisenhower dapat membantu kita untuk menghindari penundaan tugas karena kita memiliki pemetaan mengenai tugas atau kegiatan mana yang harus dikerjakan terlebih dahulu.</p>
          <div className="space-y-2">
            <h4 className="font-bold dark:text-white">Cara kerja</h4>
            <ol className="list-decimal pl-4 space-y-1">
              <li><strong>Daftar semua tugas</strong>: Catat semua hal yang harus dikerjakan</li>
              <li><strong>Sortir berdasarkan empat kuadran</strong>:
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li><strong>Lakukan Segera</strong>: Tugas yang mendesak dan penting.</li>
                  <li><strong>Jadwalkan</strong>: Tugas yang penting namun tidak mendesak.</li>
                  <li><strong>Delegasikan</strong>: Tugas yang mendesak namun tidak penting. (bisa diselesaikan oleh orang lain)</li>
                  <li><strong>Hapus</strong>: Tugas yang tidak penting dan tidak mendesak. (bisa dihapus sepenuhnya)</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </HelpDialog>

      <HelpDialog
        isOpen={helpOpen === 'pomodoro'}
        onClose={() => setHelpOpen(null)}
        title="Pomodoro"
      >
        <div className="space-y-4 dark:text-zinc-300">
          <p>Pomodoro adalah timer yang digunakan dengan pola 25, 5, 15, di mana 25 menit waktu fokus, 5 menit istirahat singkat, dan 15 menit istirahat panjang. Teknik ini membantu meningkatkan konsentrasi dan mencegah kelelahan sehingga penundaan dapat dihindari.</p>
          <div className="space-y-2">
            <h4 className="font-bold dark:text-white">Cara Kerja</h4>
            <ol className="list-decimal pl-4 space-y-1">
              <li><strong>Pilih Tugas</strong>: Tentukan satu tugas yang ingin diselesaikan.</li>
              <li><strong>Atur Timer (25 Menit)</strong>: Setel timer selama 25 menit (satu sesi Pomodoro).</li>
              <li><strong>Fokus</strong>: Kerjakan tugas tanpa distraksi (tutup media sosial, matikan notifikasi) sampai timer selesai.</li>
              <li><strong>Istirahat Singkat (5 Menit)</strong>: Ambil 5 menit untuk peregangan, minum air, atau mengalihkan pandangan.</li>
              <li><strong>Ulangi</strong>: Lakukan kembali langkah 2-4.</li>
              <li><strong>Istirahat Panjang</strong>: Setelah empat sesi Pomodoro, ambil istirahat panjang selama 15-30 menit.</li>
            </ol>
          </div>
        </div>
      </HelpDialog>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
              <motion.div 
                whileHover={{ rotate: -5 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 theme-bg blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <svg viewBox="0 0 100 100" className="w-12 h-12 flex-shrink-0 relative z-10">
                    <g transform="rotate(-12, 50, 50)">
                      <ellipse cx="50" cy="50" rx="30" ry="38" fill="none" stroke="currentColor" strokeWidth="10" className="theme-text" />
                      <path d="M40 34 L72 50 L40 66 L50 50 Z" fill="currentColor" className="theme-text" />
                    </g>
                  </svg>
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-xl font-black tracking-tight uppercase leading-none font-logo theme-text-bold">Now Or</span>
                  <span className="text-xl font-black tracking-tight uppercase leading-none font-logo theme-text-bold">Never</span>
                </div>
              </motion.div>
            </div>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                      activeTab === item.id 
                        ? "theme-bg theme-contrast-text theme-shadow" 
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
              
              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-2" />
              
              <button
                onClick={() => supabase.auth.signOut()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>

            {/* Mobile Nav Trigger (Simplified) */}
            <div className="md:hidden flex items-center">
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        activeTab === item.id ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-400"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && (
              <Home 
                onNavigate={setActiveTab} 
                userStats={userStats} 
                setUserStats={setUserStats}
              />
            )}
            {activeTab === 'eisenhower' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-4xl font-bold tracking-tight dark:text-white">Matriks Eisenhower</h1>
                    <button
                      onClick={() => setHelpOpen('eisenhower')}
                      className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Prioritaskan tugas Anda berdasarkan urgensi dan kepentingan.</p>
                </div>
                <EisenhowerMatrix onAwardExp={awardExp} />
              </div>
            )}
            {activeTab === 'pomodoro' && (
              <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-4xl font-bold tracking-tight dark:text-white">Pomodoro Timer</h1>
                    <button
                      onClick={() => setHelpOpen('pomodoro')}
                      className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Gunakan teknik Pomodoro untuk menjaga fokus yang berkelanjutan.</p>
                </div>
                <Pomodoro state={pomodoro} setState={setPomodoro} userStats={userStats} />
              </div>
            )}
            {activeTab === 'lockout' && (
              <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <h1 className="text-4xl font-bold tracking-tight dark:text-white">Kunci Fokus</h1>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Masuk ke mode fokus mendalam tanpa gangguan.</p>
                </div>
                <TabLockout pomodoro={pomodoro} setPomodoro={setPomodoro} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
