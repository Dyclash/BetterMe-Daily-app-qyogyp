
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '@/types/habit';

const HABITS_STORAGE_KEY = '@habits_storage';

export const habitStorage = {
  async getHabits(): Promise<Habit[]> {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      console.log('Raw habits from storage:', habitsJson);
      if (habitsJson) {
        const habits = JSON.parse(habitsJson);
        console.log('Parsed habits count:', habits.length);
        return habits;
      }
      console.log('No habits found in storage');
      return [];
    } catch (error) {
      console.log('Error loading habits:', error);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      console.log('Saving habits to storage, count:', habits.length);
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      console.log('Habits saved successfully');
    } catch (error) {
      console.log('Error saving habits:', error);
    }
  },

  async addHabit(habit: Habit): Promise<void> {
    try {
      console.log('Adding habit to storage:', habit.name);
      const habits = await this.getHabits();
      console.log('Current habits count before add:', habits.length);
      habits.push(habit);
      await this.saveHabits(habits);
      console.log('Habit added, new count:', habits.length);
    } catch (error) {
      console.log('Error adding habit:', error);
    }
  },

  async updateHabit(updatedHabit: Habit): Promise<void> {
    try {
      console.log('Updating habit in storage:', updatedHabit.name);
      const habits = await this.getHabits();
      const index = habits.findIndex(h => h.id === updatedHabit.id);
      if (index !== -1) {
        console.log('Found habit at index:', index);
        habits[index] = updatedHabit;
        await this.saveHabits(habits);
        console.log('Habit updated successfully');
      } else {
        console.log('Habit not found for update:', updatedHabit.id);
      }
    } catch (error) {
      console.log('Error updating habit:', error);
    }
  },

  async deleteHabit(habitId: string): Promise<void> {
    try {
      console.log('Deleting habit from storage:', habitId);
      const habits = await this.getHabits();
      console.log('Current habits count before delete:', habits.length);
      const filteredHabits = habits.filter(h => h.id !== habitId);
      await this.saveHabits(filteredHabits);
      console.log('Habit deleted, new count:', filteredHabits.length);
    } catch (error) {
      console.log('Error deleting habit:', error);
    }
  },
};
