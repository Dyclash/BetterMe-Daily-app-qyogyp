
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
import Animated, { 
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  withSpring,
  useSharedValue
} from 'react-native-reanimated';

export default function HabitDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { habits, deleteHabit } = useHabits();
  const [habit, setHabit] = useState<Habit | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  
  const deleteButtonScale = useSharedValue(1);
  const editButtonScale = useSharedValue(1);

  // Responsive sizing
  const isSmallScreen = screenWidth < 375;
  const fontSize = {
    habitName: isSmallScreen ? 26 : 30,
    habitDescription: isSmallScreen ? 15 : 17,
    statValue: isSmallScreen ? 32 : 36,
    statLabel: isSmallScreen ? 12 : 13,
    sectionTitle: isSmallScreen ? 20 : 22,
  };

  useEffect(() => {
    const foundHabit = habits.find(h => h.id === id);
    if (foundHabit) {
      setHabit(foundHabit);
    }
  }, [id, habits]);

  const handleEdit = () => {
    editButtonScale.value = withSpring(0.9, { damping: 10 });
    setTimeout(() => {
      editButtonScale.value = withSpring(1, { damping: 10 });
    }, 100);

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    router.push(`/edit-habit?id=${id}`);
  };

  const handleDelete = () => {
    console.log('Delete button pressed for habit:', habit?.name);
    
    deleteButtonScale.value = withSpring(0.9, { damping: 10 });
    setTimeout(() => {
      deleteButtonScale.value = withSpring(1, { damping: 10 });
    }, 100);

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this habit? This action cannot be undone.');
      if (confirmed && habit) {
        console.log('Web: Deleting habit:', habit.id);
        deleteHabit(habit.id).then(() => {
          console.log('Web: Habit deleted, navigating back');
          router.replace('/(tabs)/(home)/');
        }).catch((error) => {
          console.log('Web: Error deleting habit:', error);
        });
      }
    } else {
      Alert.alert(
        'Delete Habit',
        'Are you sure you want to delete this habit? This action cannot be undone.',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => {
              console.log('Delete cancelled');
            }
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              if (habit) {
                console.log('Native: Deleting habit:', habit.id);
                try {
                  await deleteHabit(habit.id);
                  console.log('Native: Habit deleted successfully');
                  
                  if (Platform.OS !== 'web') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }
                  
                  // Navigate back to home
                  router.replace('/(tabs)/(home)/');
                } catch (error) {
                  console.log('Native: Error deleting habit:', error);
                  Alert.alert('Error', 'Failed to delete habit. Please try again.');
                }
              } else {
                console.log('Native: No habit found to delete');
              }
            },
          },
        ]
      );
    }
  };

  const deleteButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: deleteButtonScale.value }],
    };
  });

  const editButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: editButtonScale.value }],
    };
  });

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
            size={26}
            color={colors.text}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Habit Details</Text>
        <View style={styles.headerActions}>
          <Animated.View style={editButtonStyle}>
            <Pressable 
              onPress={handleEdit} 
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol
                ios_icon_name="pencil"
                android_material_icon_name="edit"
                size={24}
                color={colors.primary}
              />
            </Pressable>
          </Animated.View>
          <Animated.View style={deleteButtonStyle}>
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
          </Animated.View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInUp.duration(600).springify()}
          style={[styles.habitHeader, { 
            backgroundColor: habit.color,
            ...Platform.select({
              web: {
                boxShadow: `0 0 50px ${habit.color}60, 0 12px 40px rgba(0, 0, 0, 0.6)`,
              },
              default: {
                shadowColor: habit.color,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.7,
                shadowRadius: 24,
                elevation: 16,
              }
            })
          }]}
        >
          <Text style={styles.habitIcon}>{habit.icon}</Text>
          <Text style={[styles.habitName, { fontSize: fontSize.habitName }]}>
            {habit.name}
          </Text>
          {habit.description && (
            <Text style={[styles.habitDescription, { fontSize: fontSize.habitDescription }]}>
              {habit.description}
            </Text>
          )}
        </Animated.View>

        <View style={styles.statsContainer}>
          <Animated.View 
            entering={FadeInDown.delay(100).duration(600).springify()}
            style={styles.statCard}
          >
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local-fire-department"
              size={36}
              color={colors.accent}
            />
            <Text style={[styles.statValue, { fontSize: fontSize.statValue }]}>
              {stats.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.statLabel }]}>
              Current Streak
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200).duration(600).springify()}
            style={styles.statCard}
          >
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="bar-chart"
              size={36}
              color={colors.primary}
            />
            <Text style={[styles.statValue, { fontSize: fontSize.statValue }]}>
              {stats.longestStreak}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.statLabel }]}>
              Longest Streak
            </Text>
          </Animated.View>
        </View>

        <View style={styles.statsContainer}>
          <Animated.View 
            entering={FadeInDown.delay(300).duration(600).springify()}
            style={styles.statCard}
          >
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={36}
              color={colors.success}
            />
            <Text style={[styles.statValue, { fontSize: fontSize.statValue }]}>
              {stats.totalCompletions}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.statLabel }]}>
              Total Completions
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).duration(600).springify()}
            style={styles.statCard}
          >
            <IconSymbol
              ios_icon_name="percent"
              android_material_icon_name="percent"
              size={36}
              color={colors.secondary}
            />
            <Text style={[styles.statValue, { fontSize: fontSize.statValue }]}>
              {Math.round(stats.completionRate)}%
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.statLabel }]}>
              Completion Rate
            </Text>
          </Animated.View>
        </View>

        <Animated.View 
          entering={FadeInDown.delay(500).duration(600).springify()}
          style={styles.infoCard}
        >
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
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {new Date(habit.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600).duration(600).springify()}
          style={styles.recentActivity}
        >
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
                    <View style={[
                      styles.activityItem,
                      index === Math.min(9, habit.completions.length - 1) && { borderBottomWidth: 0 }
                    ]}>
                      <Text style={styles.activityDate}>
                        {new Date(completion.date).toLocaleDateString()}
                      </Text>
                      <View style={[styles.activityBadge, { backgroundColor: habit.color }]}>
                        <Text style={styles.activityCount}>{completion.count}</Text>
                      </View>
                    </View>
                  </React.Fragment>
                ))}
            </View>
          )}
        </Animated.View>
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
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 64,
    backgroundColor: colors.backgroundSecondary,
  },
  headerButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  habitHeader: {
    padding: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  habitIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  habitName: {
    fontWeight: '900',
    color: colors.background,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  habitDescription: {
    color: colors.background,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 14,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: {
        boxShadow: `0 0 30px ${colors.neonBlue}20, 0 8px 24px rgba(0, 0, 0, 0.4)`,
      },
      default: {
        shadowColor: colors.neonBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }
    }),
  },
  statValue: {
    fontWeight: '900',
    color: colors.text,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  statLabel: {
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  infoCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: {
        boxShadow: `0 0 30px ${colors.neonBlue}20, 0 8px 24px rgba(0, 0, 0, 0.4)`,
      },
      default: {
        shadowColor: colors.neonBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }
    }),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 52,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 17,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  recentActivity: {
    marginTop: 28,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontWeight: '900',
    color: colors.text,
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: {
        boxShadow: `0 0 30px ${colors.neonBlue}20, 0 8px 24px rgba(0, 0, 0, 0.4)`,
      },
      default: {
        shadowColor: colors.neonBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }
    }),
  },
  emptyText: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  activityList: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: {
        boxShadow: `0 0 30px ${colors.neonBlue}20, 0 8px 24px rgba(0, 0, 0, 0.4)`,
      },
      default: {
        shadowColor: colors.neonBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }
    }),
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 52,
  },
  activityDate: {
    fontSize: 17,
    color: colors.text,
    letterSpacing: 0.3,
  },
  activityBadge: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 48,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  activityCount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.background,
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 20,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
});
