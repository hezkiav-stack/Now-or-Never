import React, { useState } from 'react';
import { Zap, User, Palette, Edit2, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { TabType, UserStats } from '../types';
import { cn } from '../lib/utils';

interface HomeProps {
  onNavigate: (tab: TabType) => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

const Tree = ({ level }: { level: number }) => {
  // Tree evolves naturally based on level
  // Level 1: Tiny Sprout
  // Level 2: Seedling
  // Level 3: Young Tree
  // Level 4: Mature Tree
  // Level 5: Grand Tree with Fruits
  // Level 6: Flowering Tree
  // Level 7+: Enchanted Tree with Butterflies
  
  return (
    <motion.div 
      className="relative w-80 h-80 flex items-center justify-center"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        {/* Ground/Shadow */}
        <ellipse cx="100" cy="185" rx="45" ry="6" fill="currentColor" className="text-zinc-200 dark:text-zinc-800/40" />
        
        {/* Level 1: Tiny Sprout */}
        {level === 1 && (
          <motion.g initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 100 }}>
            <path d="M100 185 C100 175 98 170 102 165" stroke="#5D4037" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M102 165 C112 158 118 162 122 168 C115 172 108 170 102 165" fill="#8BC34A" stroke="#33691E" strokeWidth="0.5" />
            <path d="M102 165 C92 158 86 162 82 168 C89 172 96 170 102 165" fill="#8BC34A" stroke="#33691E" strokeWidth="0.5" />
          </motion.g>
        )}

        {/* Level 2: Seedling */}
        {level === 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <path d="M100 185 C100 165 102 155 100 135" stroke="#5D4037" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M100 165 C112 158 118 162 122 168 C115 172 108 170 100 165" fill="#689F38" />
            <path d="M100 155 C88 148 82 152 78 158 C85 162 92 160 100 155" fill="#689F38" />
            <path d="M100 145 C112 138 118 142 122 148 C115 152 108 150 100 145" fill="#8BC34A" />
            <path d="M100 135 C105 120 115 120 120 130 C110 135 105 135 100 135" fill="#AED581" />
            <path d="M100 135 C95 120 85 120 80 130 C90 135 95 135 100 135" fill="#AED581" />
          </motion.g>
        )}

        {/* Level 3: Young Tree */}
        {level === 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <path d="M98 185 C100 160 98 140 100 105" stroke="#4E342E" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M100 145 C115 135 125 130 135 115" stroke="#4E342E" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M100 135 C85 125 75 120 65 105" stroke="#4E342E" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M135 115 C150 105 155 90 140 85 C125 80 115 100 135 115" fill="#4CAF50" />
            <path d="M65 105 C50 95 45 80 60 75 C75 70 85 90 65 105" fill="#4CAF50" />
            <path d="M100 105 C115 85 110 65 100 60 C90 65 85 85 100 105" fill="#388E3C" />
          </motion.g>
        )}

        {/* Level 4: Mature Tree */}
        {level === 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <path d="M96 185 C98 150 98 120 100 75" stroke="#3E2723" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M100 145 C125 135 140 120 155 95" stroke="#3E2723" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M100 135 C75 125 60 110 45 85" stroke="#3E2723" strokeWidth="5" fill="none" strokeLinecap="round" />
            <g fill="#2E7D32">
              <path d="M155 95 C180 80 185 55 165 45 C145 35 130 70 155 95" />
              <path d="M45 85 C20 70 15 45 35 35 C55 25 70 60 45 85" />
              <path d="M100 75 C130 50 125 20 100 15 C75 20 70 50 100 75" />
              <path d="M100 85 C125 65 120 45 100 40 C80 45 75 65 100 85" fill="#43A047" opacity="0.8" />
              <path d="M130 80 C150 65 145 50 130 45 C115 50 115 65 130 80" fill="#43A047" opacity="0.6" />
              <path d="M70 80 C50 65 55 50 70 45 C85 50 85 65 70 80" fill="#43A047" opacity="0.6" />
            </g>
          </motion.g>
        )}

        {/* Level 5+: Grand Tree Base */}
        {level >= 5 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <path d="M94 185 C98 140 98 100 100 65" stroke="#211512" strokeWidth="14" fill="none" strokeLinecap="round" />
            <path d="M100 140 C135 130 155 110 170 80" stroke="#211512" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M100 130 C65 120 45 100 30 70" stroke="#211512" strokeWidth="7" fill="none" strokeLinecap="round" />
            <g fill="#1B5E20">
              <path d="M170 80 C200 60 205 30 180 20 C155 10 140 50 170 80" />
              <path d="M30 70 C0 50 -5 20 20 10 C45 0 60 40 30 70" />
              <path d="M100 65 C140 30 135 0 100 -10 C65 0 60 30 100 65" />
              <path d="M100 75 C130 50 125 20 100 15 C75 20 70 50 100 75" fill="#2E7D32" opacity="0.7" />
              <path d="M140 70 C165 50 160 25 140 20 C120 25 120 50 140 70" fill="#2E7D32" opacity="0.5" />
              <path d="M60 70 C35 50 40 25 60 20 C80 25 80 50 60 70" fill="#2E7D32" opacity="0.5" />
            </g>

            {/* Level 5 Specific: Fruits */}
            {level === 5 && (
              <motion.g animate={{ y: [0, 1.5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                <circle cx="165" cy="50" r="5.5" fill="#E53935" />
                <circle cx="35" cy="40" r="5.5" fill="#E53935" />
                <circle cx="100" cy="10" r="5.5" fill="#E53935" />
                <circle cx="135" cy="35" r="5.5" fill="#E53935" />
                <circle cx="65" cy="30" r="5.5" fill="#E53935" />
              </motion.g>
            )}

            {/* Level 6+: Flowers (Blossoms) */}
            {level >= 6 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Pink Blossoms */}
                <circle cx="160" cy="40" r="4" fill="#F48FB1" />
                <circle cx="175" cy="60" r="4" fill="#F48FB1" />
                <circle cx="40" cy="30" r="4" fill="#F48FB1" />
                <circle cx="25" cy="50" r="4" fill="#F48FB1" />
                <circle cx="100" cy="0" r="4" fill="#F48FB1" />
                <circle cx="110" cy="30" r="4" fill="#F48FB1" />
                <circle cx="85" cy="25" r="4" fill="#F48FB1" />
                {/* White Highlights */}
                <circle cx="160" cy="40" r="1.5" fill="white" />
                <circle cx="40" cy="30" r="1.5" fill="white" />
                <circle cx="100" cy="0" r="1.5" fill="white" />
              </motion.g>
            )}

            {/* Level 7+: Butterflies */}
            {level >= 7 && (
              <motion.g>
                {/* Butterfly 1 */}
                <motion.g
                  animate={{ 
                    x: [0, 20, -10, 0],
                    y: [0, -30, -15, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                >
                  <path d="M150 20 L155 15 L160 20 L155 25 Z" fill="#FFD54F" />
                  <path d="M150 20 L145 15 L140 20 L145 25 Z" fill="#FFD54F" />
                </motion.g>
                {/* Butterfly 2 */}
                <motion.g
                  animate={{ 
                    x: [0, -30, 10, 0],
                    y: [0, -20, -40, 0],
                    rotate: [0, -15, 15, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
                >
                  <path d="M50 40 L55 35 L60 40 L55 45 Z" fill="#4FC3F7" />
                  <path d="M50 40 L45 35 L40 40 L45 45 Z" fill="#4FC3F7" />
                </motion.g>
              </motion.g>
            )}

            {/* Level 8+: Magical Glow (Enchanted Tree) */}
            {level >= 8 && (
              <motion.g
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <circle cx="100" cy="40" r="60" fill="url(#magicalGlow)" />
                <defs>
                  <radialGradient id="magicalGlow">
                    <stop offset="0%" stopColor="#81C784" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#81C784" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Floating particles */}
                <motion.circle cx="140" cy="20" r="1.5" fill="white" animate={{ y: [-5, 5, -5], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
                <motion.circle cx="60" cy="10" r="1.5" fill="white" animate={{ y: [5, -5, 5], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} />
                <motion.circle cx="100" cy="-20" r="1.5" fill="white" animate={{ y: [-10, 10, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
              </motion.g>
            )}
          </motion.g>
        )}
      </svg>
      {/* Level Badge with Dark Mode optimization */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 dark:bg-emerald-900/40 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl border border-white/10 dark:border-emerald-500/20">
        Pohon Lvl {level}
      </div>
    </motion.div>
  );
};

export default function Home({ onNavigate, userStats, setUserStats }: HomeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userStats.name);

  const handleSaveName = () => {
    setUserStats(prev => ({ ...prev, name: tempName }));
    setIsEditing(false);
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section with Tree */}
      <section className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight theme-text-bold"
            >
              Halo, <br /> 
              {isEditing ? (
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-3xl font-bold outline-none theme-ring focus:ring-2 w-full max-w-xs dark:text-white"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <button onClick={handleSaveName} className="p-2 theme-bg theme-contrast-text rounded-xl theme-shadow">
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <span className="text-zinc-400 flex items-center gap-4 justify-center md:justify-start">
                  {userStats.name}
                  <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                    <Edit2 className="w-5 h-5 text-zinc-300" />
                  </button>
                </span>
              )}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-8 justify-center md:justify-start"
          >
            <div className="text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Total EXP</p>
              <p className="text-3xl font-black tracking-tighter theme-text-bold">{userStats.exp}</p>
            </div>
            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800" />
            <div className="text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Level</p>
              <p className="text-3xl font-black tracking-tighter theme-text-bold">{userStats.level}</p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-md"
          >
            Setiap tugas yang Anda selesaikan akan membantu pohon produktivitas Anda tumbuh. Teruslah melangkah!
          </motion.p>
        </div>

        <div className="flex-1 flex justify-center relative">
          {/* Garden & Sky Background behind the tree */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-[3rem] pointer-events-none">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-100/50 to-white dark:from-sky-900/20 dark:to-zinc-950 transition-colors duration-500" />
            
            {/* Sun/Moon Glow */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-200/20 dark:bg-blue-400/10 blur-[80px] rounded-full" />
            
            {/* Simple Hills/Garden */}
            <svg viewBox="0 0 400 200" className="absolute bottom-0 w-full h-1/2 text-emerald-500/10 dark:text-emerald-900/10 preserve-3d">
              <path d="M0 150 Q100 100 200 150 T400 150 V200 H0 Z" fill="currentColor" />
              <path d="M-50 170 Q150 120 350 170 T750 170 V200 H-50 Z" fill="currentColor" opacity="0.5" />
            </svg>
            
            {/* Floating Clouds */}
            <motion.div 
              animate={{ x: [-20, 20, -20] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute top-20 left-10 w-24 h-8 bg-white/40 dark:bg-white/5 blur-xl rounded-full" 
            />
            <motion.div 
              animate={{ x: [20, -20, 20] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute top-32 right-10 w-32 h-10 bg-white/30 dark:bg-white/5 blur-xl rounded-full" 
            />
          </div>
          
          <Tree level={userStats.level} />
        </div>
      </section>

      {/* Personalization Section */}
      <section className="glass rounded-[2rem] p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden theme-shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 theme-bg opacity-5 blur-[100px] pointer-events-none" />
        <div className="flex-1 space-y-8 relative z-10">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-zinc-400" />
            <h2 className="text-3xl font-bold tracking-tight theme-text-bold">Personalisasi</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Warna Tema</p>
            <div className="flex flex-wrap gap-4">
              {['#10b981', '#6366f1', '#ef4444', '#f59e0b', '#ec4899', '#06b6d4', '#ffffff'].map((color) => {
                const isWhite = color.toLowerCase() === '#ffffff';
                const effectiveButtonColor = (userStats.darkMode && isWhite) ? '#000000' : color;
                
                return (
                  <button
                    key={color}
                    onClick={() => setUserStats(prev => ({ ...prev, themeColor: color }))}
                    className={cn(
                      "w-12 h-12 rounded-2xl border-4 transition-all shadow-sm",
                      userStats.themeColor === color ? 'border-zinc-900 dark:border-white scale-110 theme-shadow-lg' : 'border-transparent hover:scale-105',
                      isWhite && "border-zinc-200 dark:border-zinc-700"
                    )}
                    style={{ backgroundColor: effectiveButtonColor }}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mode Tampilan</p>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl w-fit theme-shadow">
              <button
                onClick={() => setUserStats(prev => ({ ...prev, darkMode: false }))}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                  !userStats.darkMode ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500"
                )}
              >
                <Sun className="w-4 h-4" />
                Terang
              </button>
              <button
                onClick={() => setUserStats(prev => ({ ...prev, darkMode: true }))}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                  userStats.darkMode ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500"
                )}
              >
                <Moon className="w-4 h-4" />
                Gelap
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 theme-bg-card p-8 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 relative group theme-shadow">
          <div className="absolute inset-0 theme-bg opacity-0 group-hover:opacity-[0.02] transition-opacity rounded-[2.5rem]" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl theme-bg flex items-center justify-center theme-contrast-text theme-shadow">
              <User className="w-7 h-7" />
            </div>
            <div>
              <p className="text-lg font-bold theme-text-bold">{userStats.name}</p>
              <p className="text-sm text-zinc-400">Level {userStats.level} Ahli Fokus</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full theme-bg" 
                initial={{ width: 0 }}
                animate={{ width: `${(userStats.exp % 100)}%` }}
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              {100 - (userStats.exp % 100)} EXP menuju Level {userStats.level + 1}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
