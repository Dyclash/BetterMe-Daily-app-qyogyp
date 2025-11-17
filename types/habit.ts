
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  targetCount: number;
  icon: string;
  color: string;
  createdAt: string;
  completions: HabitCompletion[];
}

export interface HabitCompletion {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
}
