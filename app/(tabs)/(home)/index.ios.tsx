
import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/HabitCard';
import { EmptyState } from '@/components/EmptyState';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();
  const { habits, loading, toggleHabitCompletion } = useHabits();

  const handleAddHabit = () => {
    router.push('/add-habit');
  };

  const handleHabitPress = (habitId: string) => {
    router.push(`/habit-details?id=${habitId}`);
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'My Habits',
            headerLargeTitle: true,
          }}
        />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Habits',
          headerLargeTitle: true,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {habits.length === 0 ? (
            <EmptyState
              icon="🎯"
              title="No habits yet"
              message="Start building better habits by adding your first one!"
            />
          ) : (
            <View style={styles.habitsList}>
              {habits.map((habit, index) => (
                <React.Fragment key={index}>
                  <HabitCard
                    habit={habit}
                    onPress={() => handleHabitPress(habit.id)}
                    onToggle={() => toggleHabitCompletion(habit.id)}
                  />
                </React.Fragment>
              ))}
            </View>
          )}
        </ScrollView>

        <Pressable style={styles.fab} onPress={handleAddHabit}>
          <IconSymbol
            ios_icon_name="plus"
            android_material_icon_name="add"
            size={28}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  habitsList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 6,
  },
});
