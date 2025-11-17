
import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/HabitCard';
import { EmptyState } from '@/components/EmptyState';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();
  const { habits, loading, toggleHabitCompletion } = useHabits();
  const { width: screenWidth } = useWindowDimensions();

  // Responsive sizing
  const isSmallScreen = screenWidth < 375;
  const headerFontSize = {
    title: isSmallScreen ? 28 : 32,
    subtitle: isSmallScreen ? 14 : 16,
  };
  const fabSize = isSmallScreen ? 52 : 56;
  const fabBottom = isSmallScreen ? 90 : 100;

  const handleAddHabit = () => {
    router.push('/add-habit');
  };

  const handleHabitPress = (habitId: string) => {
    router.push(`/habit-details?id=${habitId}`);
  };

  if (loading) {
    return (
      <React.Fragment>
        <Stack.Screen
          options={{
            title: 'My Habits',
            headerLargeTitle: true,
          }}
        />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
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

        <Pressable 
          style={[
            styles.fab, 
            { 
              width: fabSize, 
              height: fabSize, 
              borderRadius: fabSize / 2,
              bottom: fabBottom,
            }
          ]} 
          onPress={handleAddHabit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol
            ios_icon_name="plus"
            android_material_icon_name="add"
            size={28}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </React.Fragment>
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
    paddingBottom: 140,
  },
  habitsList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
