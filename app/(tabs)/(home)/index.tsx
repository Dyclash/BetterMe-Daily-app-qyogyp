
import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
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
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { fontSize: headerFontSize.title }]}>
            My Habits
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: headerFontSize.subtitle }]}>
            Build better habits, one day at a time
          </Text>
        </View>

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
    paddingTop: Platform.OS === 'android' ? 56 : 16,
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
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
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }
    }),
  },
});
