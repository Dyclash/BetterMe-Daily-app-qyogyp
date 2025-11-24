
import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/HabitCard';
import { EmptyState } from '@/components/EmptyState';
import { IconSymbol } from '@/components/IconSymbol';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { habits, loading, toggleHabitCompletion, refreshHabits } = useHabits();
  const { width: screenWidth } = useWindowDimensions();
  
  const fabScale = useSharedValue(1);
  const fabRotation = useSharedValue(0);

  // Responsive sizing
  const isSmallScreen = screenWidth < 375;
  const fabSize = isSmallScreen ? 60 : 68;
  const fabBottom = isSmallScreen ? 90 : 100;

  // Refresh habits when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Home screen focused, refreshing habits...');
      refreshHabits();
    }, [refreshHabits])
  );

  useEffect(() => {
    // Subtle pulsing animation for FAB
    fabScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const handleAddHabit = () => {
    fabRotation.value = withSequence(
      withSpring(90, { damping: 10 }),
      withSpring(0, { damping: 10 })
    );
    router.push('/add-habit');
  };

  const handleHabitPress = (habitId: string) => {
    router.push(`/habit-details?id=${habitId}`);
  };

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: fabScale.value },
        { rotate: `${fabRotation.value}deg` }
      ],
    };
  });

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
        {habits.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="No habits yet"
            message="Start building better habits by adding your first one!"
          />
        ) : (
          <View style={styles.habitsList}>
            {habits.map((habit, index) => (
              <React.Fragment key={habit.id}>
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

      <Animated.View style={[
        styles.fabContainer,
        fabAnimatedStyle,
        { 
          width: fabSize, 
          height: fabSize, 
          borderRadius: fabSize / 2,
          bottom: fabBottom,
        }
      ]}>
        <Pressable 
          style={styles.fab}
          onPress={handleAddHabit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol
            ios_icon_name="plus"
            android_material_icon_name="add"
            size={32}
            color={colors.background}
          />
        </Pressable>
      </Animated.View>
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
    paddingTop: Platform.OS === 'android' ? 64 : 24,
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  habitsList: {
    width: '100%',
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    ...Platform.select({
      web: {
        boxShadow: `0 0 40px ${colors.neonBlue}80, 0 8px 24px rgba(0, 0, 0, 0.6)`,
      },
      default: {
        shadowColor: colors.neonBlue,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 16,
      }
    }),
  },
  fab: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
});
