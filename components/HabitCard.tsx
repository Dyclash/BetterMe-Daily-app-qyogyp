
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, useWindowDimensions } from 'react-native';
import { Habit } from '@/types/habit';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { getProgressPercentage, calculateStreak } from '@/utils/habitHelpers';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  useSharedValue,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
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
  
  const scale = useSharedValue(1);
  const glowIntensity = useSharedValue(0);

  // Responsive sizing based on screen width
  const isSmallScreen = screenWidth < 375;
  const cardPadding = isSmallScreen ? 14 : 18;
  const iconSize = isSmallScreen ? 44 : 52;
  const fontSize = {
    habitName: isSmallScreen ? 17 : 19,
    habitDescription: isSmallScreen ? 13 : 14,
    progressText: isSmallScreen ? 12 : 13,
    statText: isSmallScreen ? 11 : 12,
  };

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Animate on toggle
    scale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    
    glowIntensity.value = withSequence(
      withSpring(1, { damping: 10 }),
      withSpring(0, { damping: 10 })
    );
    
    onToggle();
  };

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      glowIntensity.value,
      [0, 1],
      [0.2, 0.6],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, scaleStyle]}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={[styles.cardWrapper, { 
          borderLeftColor: habit.color, 
          borderLeftWidth: 3,
          ...Platform.select({
            web: {
              boxShadow: `0 0 30px ${habit.color}40, 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px ${colors.glassLight}`,
            },
            default: {
              shadowColor: habit.color,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 16,
              elevation: 12,
            }
          })
        }]}>
          <BlurView
            intensity={Platform.OS === 'android' ? 40 : 60}
            tint="dark"
            style={styles.blurContainer}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
          >
            <Animated.View style={[styles.glowOverlay, glowStyle, { backgroundColor: habit.color }]} />
            
            <View style={[styles.card, { padding: cardPadding }]}>
              <View style={styles.header}>
                <View style={[styles.iconContainer, { 
                  width: iconSize,
                  height: iconSize,
                  borderRadius: iconSize / 2,
                  backgroundColor: `${habit.color}15`,
                  borderColor: `${habit.color}60`,
                  borderWidth: 2,
                  ...Platform.select({
                    web: {
                      boxShadow: `0 0 20px ${habit.color}50`,
                    },
                    default: {
                      shadowColor: habit.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.6,
                      shadowRadius: 10,
                    }
                  })
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
                <Pressable 
                  onPress={handleToggle} 
                  style={styles.checkButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <IconSymbol
                    ios_icon_name={isCompleted ? 'checkmark.circle.fill' : 'circle'}
                    android_material_icon_name={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
                    size={38}
                    color={isCompleted ? colors.success : colors.textSecondary}
                  />
                </Pressable>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { 
                    width: `${progress}%`, 
                    backgroundColor: habit.color,
                    ...Platform.select({
                      web: {
                        boxShadow: `0 0 15px ${habit.color}90, inset 0 0 10px ${habit.color}40`,
                      },
                      default: {
                        shadowColor: habit.color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 8,
                      }
                    })
                  }]} />
                </View>
                <Text style={[styles.progressText, { fontSize: fontSize.progressText, color: habit.color }]}>
                  {Math.round(progress)}%
                </Text>
              </View>

              <View style={styles.footer}>
                <View style={styles.statItem}>
                  <IconSymbol
                    ios_icon_name="flame.fill"
                    android_material_icon_name="local-fire-department"
                    size={18}
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
                    size={18}
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
    </Animated.View>
  );
});

HabitCard.displayName = 'HabitCard';

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  pressable: {
    width: '100%',
  },
  cardWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.backgroundSecondary,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 24,
    position: 'relative',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  card: {
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    // fontSize set dynamically
  },
  headerContent: {
    flex: 1,
    marginRight: 8,
  },
  habitName: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  habitDescription: {
    color: colors.textSecondary,
    letterSpacing: 0.2,
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
    marginBottom: 14,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontWeight: '700',
    minWidth: 45,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: colors.textSecondary,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
});
