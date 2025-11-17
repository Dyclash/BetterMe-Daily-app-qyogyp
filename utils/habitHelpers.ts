
import { Habit, HabitStats } from '@/types/habit';

export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getCompletionForDate(habit: Habit, date: string): number {
  const completion = habit.completions.find(c => c.date === date);
  return completion ? completion.count : 0;
}

export function calculateStreak(habit: Habit): number {
  if (habit.completions.length === 0) return 0;

  const sortedCompletions = [...habit.completions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date);
    completionDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (completionDate.getTime() === expectedDate.getTime() && sortedCompletions[i].count >= habit.targetCount) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateLongestStreak(habit: Habit): number {
  if (habit.completions.length === 0) return 0;

  const sortedCompletions = [...habit.completions]
    .filter(c => c.count >= habit.targetCount)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const completion of sortedCompletions) {
    const currentDate = new Date(completion.date);
    currentDate.setHours(0, 0, 0, 0);

    if (lastDate === null) {
      currentStreak = 1;
    } else {
      const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    lastDate = currentDate;
  }

  return Math.max(longestStreak, currentStreak);
}

export function calculateHabitStats(habit: Habit): HabitStats {
  const totalCompletions = habit.completions.reduce((sum, c) => sum + c.count, 0);
  const currentStreak = calculateStreak(habit);
  const longestStreak = calculateLongestStreak(habit);
  
  const daysSinceCreation = Math.max(1, Math.floor(
    (new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ));
  
  const completionRate = (habit.completions.filter(c => c.count >= habit.targetCount).length / daysSinceCreation) * 100;

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate: Math.min(100, completionRate),
  };
}

export function getProgressPercentage(habit: Habit): number {
  const today = getTodayString();
  const todayCount = getCompletionForDate(habit, today);
  return Math.min(100, (todayCount / habit.targetCount) * 100);
}
