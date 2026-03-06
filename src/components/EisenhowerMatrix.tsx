import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle, Clock, Zap, Target, Calendar, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, TaskUrgency, TaskImportance } from '../types';
import { cn } from '../lib/utils';

interface EisenhowerMatrixProps {
  onAwardExp: (amount: number) => void;
}

export default function EisenhowerMatrix({ onAwardExp }: EisenhowerMatrixProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('now-or-never-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<TaskUrgency>('urgent');
  const [selectedImportance, setSelectedImportance] = useState<TaskImportance>('important');

  useEffect(() => {
    localStorage.setItem('now-or-never-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask,
      urgency: selectedUrgency,
      importance: selectedImportance,
      completed: false,
      createdAt: Date.now(),
      deadline: newDeadline || undefined,
    };

    setTasks([task, ...tasks]);
    setNewTask('');
    setNewDeadline('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
        if (newCompleted) {
          // Award EXP
          let exp = 0;
          if (t.urgency === 'urgent' && t.importance === 'important') exp = 10;
          else if (t.urgency === 'not-urgent' && t.importance === 'important') exp = 6;
          else if (t.urgency === 'urgent' && t.importance === 'not-important') exp = 2;
          
          if (exp > 0) onAwardExp(exp);
        }
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const quadrants = [
    {
      title: 'Lakukan Segera',
      subtitle: 'Mendesak & Penting',
      urgency: 'urgent' as TaskUrgency,
      importance: 'important' as TaskImportance,
      color: 'bg-rose-50/90 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/50 text-rose-900 dark:text-rose-200',
      icon: <Zap className="w-4 h-4" />,
      emptyIcon: <CheckCircle2 className="w-12 h-12 mb-2" />,
    },
    {
      title: 'Jadwalkan',
      subtitle: 'Tidak Mendesak tapi Penting',
      urgency: 'not-urgent' as TaskUrgency,
      importance: 'important' as TaskImportance,
      color: 'bg-amber-50/90 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200',
      icon: <Target className="w-4 h-4" />,
      emptyIcon: <Calendar className="w-12 h-12 mb-2" />,
    },
    {
      title: 'Delegasikan',
      subtitle: 'Mendesak tapi Tidak Penting',
      urgency: 'urgent' as TaskUrgency,
      importance: 'not-important' as TaskImportance,
      color: 'bg-blue-50/90 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50 text-blue-900 dark:text-blue-200',
      icon: <Clock className="w-4 h-4" />,
      emptyIcon: <UserPlus className="w-12 h-12 mb-2" />,
    },
    {
      title: 'Hapus',
      subtitle: 'Tidak Mendesak & Tidak Penting',
      urgency: 'not-urgent' as TaskUrgency,
      importance: 'not-important' as TaskImportance,
      color: 'bg-zinc-100/90 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-200',
      icon: <AlertCircle className="w-4 h-4" />,
      emptyIcon: <Trash2 className="w-12 h-12 mb-2" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-end glass p-6 rounded-2xl">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">Tugas Baru</label>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask(e)}
              placeholder="Apa yang harus dikerjakan?"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 theme-ring focus:ring-2 transition-all outline-none dark:text-white"
            />
          </div>
          <div className="w-full md:w-48 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">Tenggat Waktu</label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 theme-ring focus:ring-2 transition-all outline-none text-sm dark:text-white"
            />
          </div>
        <div className="flex gap-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">Urgensi</label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setSelectedUrgency('urgent')}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedUrgency === 'urgent' ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500"
                )}
              >
                Mendesak
              </button>
              <button
                onClick={() => setSelectedUrgency('not-urgent')}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedUrgency === 'not-urgent' ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500"
                )}
              >
                Nanti
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">Kepentingan</label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setSelectedImportance('important')}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedImportance === 'important' ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500"
                )}
              >
                Tinggi
              </button>
              <button
                onClick={() => setSelectedImportance('not-important')}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedImportance === 'not-important' ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500"
                )}
              >
                Rendah
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={addTask}
          className="theme-bg theme-contrast-text p-3 rounded-xl hover:opacity-90 transition-colors theme-shadow"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map((q) => (
          <div key={q.title} className={cn("flex flex-col rounded-2xl border min-h-[300px] overflow-hidden theme-shadow", q.color)}>
            <div className="p-4 border-b border-inherit flex items-center justify-between">
              <div>
                <h3 className="font-black flex items-center gap-2 text-lg tracking-tight">
                  {q.icon}
                  {q.title}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{q.subtitle}</p>
              </div>
              <span className="text-xs font-mono font-bold bg-white/20 dark:bg-black/20 px-2 py-1 rounded-lg border border-inherit">
                {tasks.filter(t => t.urgency === q.urgency && t.importance === q.importance).length}
              </span>
            </div>
            <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[400px]">
              <AnimatePresence mode="popLayout">
                {tasks
                  .filter(t => t.urgency === q.urgency && t.importance === q.importance)
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex items-center gap-3 bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 p-3 rounded-xl transition-all shadow-sm"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "transition-colors",
                          task.completed ? "text-emerald-500" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                        )}
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div className="flex-1 flex flex-col">
                        <span className={cn(
                          "text-sm font-medium transition-all text-zinc-900 dark:text-zinc-100",
                          task.completed && "line-through opacity-40"
                        )}>
                          {task.text}
                        </span>
                        {task.deadline && (
                          <span className="text-[10px] font-bold opacity-60 flex items-center gap-1 text-inherit">
                            <Clock className="w-3 h-3" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {tasks.filter(t => t.urgency === q.urgency && t.importance === q.importance).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-12">
                  {q.emptyIcon}
                  <p className="text-xs font-bold uppercase tracking-widest">{q.title}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
