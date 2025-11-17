
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { Habit } from '@/types/habit';
import { useHabits } from '@/hooks/useHabits';
import { IconSymbol } from '@/components/IconSymbol';
import { calculateHabitStats } from '@/utils/habitHelpers';
import * as Haptics from 'expo-haptics';

export default function HabitDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { habits, deleteHabit } = useHabits();
  const [habit, setHabit] = useState<Habit | null>(null);
  const { width: screenWidth } = useWindowDimensions();

  // Responsive sizing
  const isSmallScreen = screenWidth < 375;
  const fontSize = {
    habitName: isSmallScreen ? 24 : 28,
    habitDescription: isSmallScreen ? 14 : 16,
    statValue: isSmallScreen ? 28 : 32,
    statLabel: isSmallScreen ? 11 : 12,
    sectionTitle: isSmallScreen ? 18 : 20,
  };

  useEffect(() => {
    const foundHabit = habits.find(h => h.id === id);
    if (foundHabit) {
      setHabit(foundHabit);
    }
  }, [id, habits]);

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this habit?');
      if (confirmed && habit) {
        deleteHabit(habit.id);
        router.back();
      }
    } else {
      Alert.alert(
        'Delete Habit',
        'Are you sure you want to delete this habit? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              if (habit) {
                await deleteHabit(habit.id);
                if (Platform.OS !== 'web') {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
                router.back();
              }
            },
          },
        ]
      );
    }
  };

  if (!habit) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Habit not found</Text>
      </View>
    );
  }

  const stats = calculateHabitStats(habit);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.text}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Habit Details</Text>
        <Pressable 
          onPress={handleDelete} 
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol
            ios_icon_name="trash"
            android_material_icon_name="delete"
            size={24}
            color={colors.error}
          />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.habitHeader, { backgroundColor: habit.color }]}>
          <Text style={styles.habitIcon}>{habit.icon}</Text>
          <Text style={[styles.habitName, { fontSize: fontSize.habitName }]}>
            {habit.name}
          </Text>
          {habit.description && (
            <Text style={[styles.habitDescription, { fontSize: fontSize.habitDescription }]}>
              {habit.description}
            </Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local-fire-department"
              size={32}
              color={colors.accent}
            />
            <Text style={[styles.statValue, { fontSize: fontSize.statValue }]}>
              {stats.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.statLabel }]}>
              Current Streak
            </Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="bar-chart"
              size={32}
              color={colors.primary}
            />
            <Text style={[styles.statValue, { fontSize: fontSize.statValue }]}>
              {stats.longestStreak}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.statLabel }]}>
              Longest Streak
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={32}
              color={colors.success}
            />
            <Text style={[styles.statValue, { fontSize: fontSize.statValue }]}>
              {stats.totalCompletions}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.statLabel }]}>
              Total Completions
            </Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="percent"
              android_material_icon_name="percent"
              size={32}
              color={colors.secondary}
            />
            <Text style={[styles.statValue, { fontSize: fontSize.statValue }]}>
              {Math.round(stats.completionRate)}%
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.statLabel }]}>
              Completion Rate
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Frequency</Text>
            <Text style={styles.infoValue}>
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Target</Text>
            <Text style={styles.infoValue}>{habit.targetCount}x per {habit.frequency}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {new Date(habit.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.recentActivity}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize.sectionTitle }]}>
            Recent Activity
          </Text>
          {habit.completions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No activity yet. Start tracking today!</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {habit.completions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((completion, index) => (
                  <React.Fragment key={index}>
                    <View style={styles.activityItem}>
                      <Text style={styles.activityDate}>
                        {new Date(completion.date).toLocaleDateString()}
                      </Text>
                      <View style={styles.activityBadge}>
                        <Text style={styles.activityCount}>{completion.count}</Text>
                      </View>
                    </View>
                  </React.Fragment>
                ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 60,
  },
  headerButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  habitHeader: {
    padding: 32,
    alignItems: 'center',
  },
  habitIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  habitName: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  habitDescription: {
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }
    }),
  },
  statValue: {
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }
    }),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 48,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  recentActivity: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }
    }),
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  activityList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }
    }),
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 48,
  },
  activityDate: {
    fontSize: 16,
    color: colors.text,
  },
  activityBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 44,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});
