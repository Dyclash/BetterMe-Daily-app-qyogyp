
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useHabits } from '@/hooks/useHabits';
import { IconSymbol } from '@/components/IconSymbol';
import { calculateHabitStats } from '@/utils/habitHelpers';

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
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerLargeTitle: true,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>🎯</Text>
            </View>
            <Text style={styles.userName}>Habit Tracker</Text>
            <Text style={styles.userSubtitle}>Building better habits</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol
                ios_icon_name="list.bullet"
                android_material_icon_name="list"
                size={28}
                color={colors.primary}
              />
              <Text style={styles.statValue}>{totalHabits}</Text>
              <Text style={styles.statLabel}>Total Habits</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={28}
                color={colors.success}
              />
              <Text style={styles.statValue}>{totalCompletions}</Text>
              <Text style={styles.statLabel}>Completions</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local-fire-department"
                size={28}
                color={colors.accent}
              />
              <Text style={styles.statValue}>{averageStreak}</Text>
              <Text style={styles.statLabel}>Avg Streak</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol
                ios_icon_name="trophy.fill"
                android_material_icon_name="emoji-events"
                size={28}
                color={colors.highlight}
              />
              <Text style={styles.statValue}>{bestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <Text style={styles.aboutText}>
                Welcome to your habit tracker! This app helps you build and maintain positive habits by tracking your daily progress.
              </Text>
              <Text style={styles.aboutText}>
                Set goals, track your streaks, and watch yourself grow one day at a time.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
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
          </View>
        </ScrollView>
      </View>
    </>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  aboutText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
});
