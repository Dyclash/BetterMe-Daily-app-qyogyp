
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useHabits } from '@/hooks/useHabits';
import { IconSymbol } from '@/components/IconSymbol';
import { calculateHabitStats } from '@/utils/habitHelpers';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { habits } = useHabits();

  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, habit) => {
    const stats = calculateHabitStats(habit);
    return sum + stats.totalCompletions;
  }, 0);

  const averageStreak = habits.length > 0
    ? Math.round(
        habits.reduce((sum, habit) => {
          const stats = calculateHabitStats(habit);
          return sum + stats.currentStreak;
        }, 0) / habits.length
      )
    : 0;

  const bestStreak = habits.reduce((max, habit) => {
    const stats = calculateHabitStats(habit);
    return Math.max(max, stats.longestStreak);
  }, 0);

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLargeTitleStyle: {
            color: colors.text,
          },
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeInDown.duration(600).springify()}
            style={styles.header}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>🎯</Text>
            </View>
            <Text style={styles.userName}>Habit Tracker</Text>
            <Text style={styles.userSubtitle}>Building better habits</Text>
          </Animated.View>

          <View style={styles.statsGrid}>
            <Animated.View 
              entering={FadeInDown.delay(100).duration(600).springify()}
              style={styles.statCard}
            >
              <IconSymbol
                ios_icon_name="list.bullet"
                android_material_icon_name="list"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.statValue}>{totalHabits}</Text>
              <Text style={styles.statLabel}>Total Habits</Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(200).duration(600).springify()}
              style={styles.statCard}
            >
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={32}
                color={colors.success}
              />
              <Text style={styles.statValue}>{totalCompletions}</Text>
              <Text style={styles.statLabel}>Completions</Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(300).duration(600).springify()}
              style={styles.statCard}
            >
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local-fire-department"
                size={32}
                color={colors.accent}
              />
              <Text style={styles.statValue}>{averageStreak}</Text>
              <Text style={styles.statLabel}>Avg Streak</Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(400).duration(600).springify()}
              style={styles.statCard}
            >
              <IconSymbol
                ios_icon_name="trophy.fill"
                android_material_icon_name="emoji-events"
                size={32}
                color={colors.warning}
              />
              <Text style={styles.statValue}>{bestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </Animated.View>
          </View>

          <Animated.View 
            entering={FadeInDown.delay(500).duration(600).springify()}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <Text style={styles.aboutText}>
                Welcome to your habit tracker! This app helps you build and maintain positive habits by tracking your daily progress.
              </Text>
              <Text style={styles.aboutText}>
                Set goals, track your streaks, and watch yourself grow one day at a time.
              </Text>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(600).duration(600).springify()}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Tips for Success</Text>
            <View style={styles.card}>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>💡</Text>
                <Text style={styles.tipText}>Start small - consistency beats intensity</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>📅</Text>
                <Text style={styles.tipText}>Track daily to build momentum</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🎯</Text>
                <Text style={styles.tipText}>Focus on a few key habits at a time</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipEmoji}>🔥</Text>
                <Text style={styles.tipText}>Don&apos;t break the chain!</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
  },
  avatarEmoji: {
    fontSize: 56,
  },
  userName: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  userSubtitle: {
    fontSize: 17,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  aboutText: {
    fontSize: 17,
    color: colors.text,
    lineHeight: 26,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  tipEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 17,
    color: colors.text,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
});
