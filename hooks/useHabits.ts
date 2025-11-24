
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { habitStorage } from '@/utils/habitStorage';
import { getTodayString, getCompletionForDate } from '@/utils/habitHelpers';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    console.log('Loading habits...');
    setLoading(true);
    try {
      const loadedHabits = await habitStorage.getHabits();
      console.log('Loaded habits:', loadedHabits.length);
      setHabits(loadedHabits);
    } catch (error) {
      console.log('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const addHabit = useCallback(async (habit: Habit) => {
    console.log('Adding habit:', habit.name);
    try {
      await habitStorage.addHabit(habit);
      console.log('Habit added to storage, reloading...');
      await loadHabits();
    } catch (error) {
      console.log('Error adding habit:', error);
    }
  }, [loadHabits]);

  const updateHabit = useCallback(async (habit: Habit) => {
    console.log('Updating habit:', habit.name);
    try {
      await habitStorage.updateHabit(habit);
      console.log('Habit updated in storage, reloading...');
      await loadHabits();
    } catch (error) {
      console.log('Error updating habit:', error);
    }
  }, [loadHabits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    console.log('Deleting habit:', habitId);
    try {
      await habitStorage.deleteHabit(habitId);
      console.log('Habit deleted from storage, reloading...');
      await loadHabits();
    } catch (error) {
      console.log('Error deleting habit:', error);
    }
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
