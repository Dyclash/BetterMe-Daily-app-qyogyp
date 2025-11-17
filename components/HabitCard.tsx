
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Habit } from '@/types/habit';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { getProgressPercentage, calculateStreak } from '@/utils/habitHelpers';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
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
      <View style={[styles.cardWrapper, { 
        borderLeftColor: habit.color, 
        borderLeftWidth: 4,
        ...Platform.select({
          web: {
            boxShadow: `0 0 20px ${habit.color}40, 0 8px 32px rgba(0, 0, 0, 0.12)`,
          },
          default: {
            shadowColor: habit.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }
        })
      }]}>
        <BlurView
          intensity={Platform.OS === 'android' ? 60 : 80}
          tint="light"
          style={styles.blurContainer}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={[styles.iconContainer, { 
                backgroundColor: `${habit.color}20`,
                borderColor: `${habit.color}40`,
                borderWidth: 1,
              }]}>
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
                <View style={[styles.progressFill, { 
                  width: `${progress}%`, 
                  backgroundColor: habit.color,
                  ...Platform.select({
                    web: {
                      boxShadow: `0 0 10px ${habit.color}80`,
                    },
                    default: {
                      shadowColor: habit.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                    }
                  })
                }]} />
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
        </BlurView>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 16,
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
