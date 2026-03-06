import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function HelpDialog({ isOpen, onClose, title, children }: HelpDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg theme-bg-card rounded-3xl shadow-2xl z-[101] overflow-hidden border border-zinc-100 dark:border-zinc-800"
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between theme-bg-subtle">
              <h3 className="text-xl font-bold tracking-tight dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors dark:text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto dark:text-zinc-300">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
