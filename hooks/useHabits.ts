
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { habitStorage } from '@/utils/habitStorage';
import { getTodayString, getCompletionForDate } from '@/utils/habitHelpers';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    setLoading(true);
    const loadedHabits = await habitStorage.getHabits();
    setHabits(loadedHabits);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const addHabit = useCallback(async (habit: Habit) => {
    await habitStorage.addHabit(habit);
    await loadHabits();
  }, [loadHabits]);

  const updateHabit = useCallback(async (habit: Habit) => {
    await habitStorage.updateHabit(habit);
    await loadHabits();
  }, [loadHabits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    await habitStorage.deleteHabit(habitId);
    await loadHabits();
  }, [loadHabits]);

  const toggleHabitCompletion = useCallback(async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = getTodayString();
    const currentCount = getCompletionForDate(habit, today);
    const newCount = currentCount >= habit.targetCount ? 0 : currentCount + 1;

    const updatedCompletions = habit.completions.filter(c => c.date !== today);
    if (newCount > 0) {
      updatedCompletions.push({ date: today, count: newCount });
    }

    const updatedHabit = {
      ...habit,
      completions: updatedCompletions,
    };

    await updateHabit(updatedHabit);
  }, [habits, updateHabit]);

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    refreshHabits: loadHabits,
  };
}
