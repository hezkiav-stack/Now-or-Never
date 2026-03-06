import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, Zap } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Cek email Anda untuk konfirmasi pendaftaran!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat autentikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-10">
          <div className="flex items-center justify-center gap-4">
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-black flex-shrink-0">
              <g transform="rotate(-12, 50, 50)">
                <ellipse cx="50" cy="50" rx="30" ry="38" fill="none" stroke="currentColor" strokeWidth="10" />
                <path d="M40 34 L72 50 L40 66 L50 50 Z" fill="currentColor" />
              </g>
            </svg>
            <div className="flex flex-col -space-y-1">
              <h1 className="text-3xl font-logo font-black tracking-tighter text-black uppercase leading-none">
                NOW OR
              </h1>
              <h1 className="text-3xl font-logo font-black tracking-tighter text-black uppercase leading-none">
                NEVER
              </h1>
            </div>
          </div>
          <p className="text-center text-zinc-500 mt-6 font-medium">
            {isSignUp ? 'Buat akun baru untuk mulai produktif' : 'Masuk untuk melanjutkan progres Anda'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/50">
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="p-4 text-sm bg-red-50 text-red-600 rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition-all text-black placeholder:text-zinc-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white transition-all text-black placeholder:text-zinc-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-bold rounded-2xl shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isSignUp ? (
                <>
                  <UserPlus size={20} /> Create Account
                </>
              ) : (
                <>
                  <LogIn size={20} /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-zinc-400 hover:text-black transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
