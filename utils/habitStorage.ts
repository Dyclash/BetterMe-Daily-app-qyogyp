
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '@/types/habit';

const HABITS_STORAGE_KEY = '@habits_storage';

export const habitStorage = {
  async getHabits(): Promise<Habit[]> {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      if (habitsJson) {
        return JSON.parse(habitsJson);
      }
      return [];
    } catch (error) {
      console.log('Error loading habits:', error);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.log('Error saving habits:', error);
    }
  },

  async addHabit(habit: Habit): Promise<void> {
    try {
      const habits = await this.getHabits();
      habits.push(habit);
      await this.saveHabits(habits);
    } catch (error) {
      console.log('Error adding habit:', error);
    }
  },

  async updateHabit(updatedHabit: Habit): Promise<void> {
    try {
      const habits = await this.getHabits();
      const index = habits.findIndex(h => h.id === updatedHabit.id);
      if (index !== -1) {
        habits[index] = updatedHabit;
        await this.saveHabits(habits);
      }
    } catch (error) {
      console.log('Error updating habit:', error);
    }
  },

  async deleteHabit(habitId: string): Promise<void> {
    try {
      const habits = await this.getHabits();
      const filteredHabits = habits.filter(h => h.id !== habitId);
      await this.saveHabits(filteredHabits);
    } catch (error) {
      console.log('Error deleting habit:', error);
    }
  },
};
