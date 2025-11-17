
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, useWindowDimensions } from 'react-native';
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

export const HabitCard = React.memo(({ habit, onPress, onToggle }: HabitCardProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const progress = getProgressPercentage(habit);
  const streak = calculateStreak(habit);
  const isCompleted = progress >= 100;

  // Responsive sizing based on screen width
  const isSmallScreen = screenWidth < 375;
  const cardPadding = isSmallScreen ? 12 : 16;
  const iconSize = isSmallScreen ? 40 : 48;
  const fontSize = {
    habitName: isSmallScreen ? 16 : 18,
    habitDescription: isSmallScreen ? 12 : 14,
    progressText: isSmallScreen ? 11 : 12,
    statText: isSmallScreen ? 11 : 12,
  };

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
          <View style={[styles.card, { padding: cardPadding }]}>
            <View style={styles.header}>
              <View style={[styles.iconContainer, { 
                width: iconSize,
                height: iconSize,
                borderRadius: iconSize / 2,
                backgroundColor: `${habit.color}20`,
                borderColor: `${habit.color}40`,
                borderWidth: 1,
              }]}>
                <Text style={[styles.icon, { fontSize: iconSize * 0.5 }]}>{habit.icon}</Text>
              </View>
              <View style={styles.headerContent}>
                <Text style={[styles.habitName, { fontSize: fontSize.habitName }]}>{habit.name}</Text>
                {habit.description && (
                  <Text style={[styles.habitDescription, { fontSize: fontSize.habitDescription }]} numberOfLines={1}>
                    {habit.description}
                  </Text>
                )}
              </View>
              <Animated.View style={scaleStyle}>
                <Pressable 
                  onPress={handleToggle} 
                  style={styles.checkButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <IconSymbol
                    ios_icon_name={isCompleted ? 'checkmark.circle.fill' : 'circle'}
                    android_material_icon_name={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
                    size={36}
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
              <Text style={[styles.progressText, { fontSize: fontSize.progressText }]}>
                {Math.round(progress)}%
              </Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.statItem}>
                <IconSymbol
                  ios_icon_name="flame.fill"
                  android_material_icon_name="local-fire-department"
                  size={16}
                  color={colors.accent}
                />
                <Text style={[styles.statText, { fontSize: fontSize.statText }]}>
                  {streak} day streak
                </Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol
                  ios_icon_name="target"
                  android_material_icon_name="track-changes"
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.statText, { fontSize: fontSize.statText }]}>
                  {habit.targetCount}x {habit.frequency}
                </Text>
              </View>
            </View>
          </View>
        </BlurView>
      </View>
    </Pressable>
  );
});

HabitCard.displayName = 'HabitCard';

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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    // fontSize set dynamically
  },
  headerContent: {
    flex: 1,
    marginRight: 8,
  },
  habitName: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  habitDescription: {
    color: colors.textSecondary,
  },
  checkButton: {
    padding: 4,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
