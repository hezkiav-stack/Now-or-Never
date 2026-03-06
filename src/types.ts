export type TaskUrgency = 'urgent' | 'not-urgent';
export type TaskImportance = 'important' | 'not-important';

export interface Task {
  id: string;
  text: string;
  urgency: TaskUrgency;
  importance: TaskImportance;
  completed: boolean;
  createdAt: number;
  deadline?: string;
}

export interface UserStats {
  exp: number;
  level: number;
  name: string;
  themeColor: string;
  darkMode: boolean;
}

export type TabType = 'home' | 'eisenhower' | 'pomodoro' | 'lockout';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

export interface PomodoroState {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  sessionsCompleted: number;
  settings: PomodoroSettings;
  lastTick: number;
}
