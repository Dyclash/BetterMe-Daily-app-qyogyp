
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Habit } from '@/types/habit';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { getProgressPercentage, calculateStreak } from '@/utils/habitHelpers';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onToggle: () => void;
}

export function HabitCard({ habit, onPress, onToggle }: HabitCardProps) {
  const progress = getProgressPercentage(habit);
  const streak = calculateStreak(habit);
  const isCompleted = progress >= 100;

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onToggle();
  };

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isCompleted ? 1 : 1) }],
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.card, { borderLeftColor: habit.color, borderLeftWidth: 4 }]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{habit.icon}</Text>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.habitName}>{habit.name}</Text>
            {habit.description && (
              <Text style={styles.habitDescription} numberOfLines={1}>
                {habit.description}
              </Text>
            )}
          </View>
          <Animated.View style={scaleStyle}>
            <Pressable onPress={handleToggle} style={styles.checkButton}>
              <IconSymbol
                ios_icon_name={isCompleted ? 'checkmark.circle.fill' : 'circle'}
                android_material_icon_name={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
                size={32}
                color={isCompleted ? colors.success : colors.textSecondary}
              />
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: habit.color }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.statItem}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local-fire-department"
              size={16}
              color={colors.accent}
            />
            <Text style={styles.statText}>{streak} day streak</Text>
          </View>
          <View style={styles.statItem}>
            <IconSymbol
              ios_icon_name="target"
              android_material_icon_name="track-changes"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.statText}>
              {habit.targetCount}x {habit.frequency}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  habitDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkButton: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
