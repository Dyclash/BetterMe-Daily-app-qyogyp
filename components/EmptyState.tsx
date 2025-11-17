
import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue,
  Easing
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export const EmptyState = React.memo(({ icon, title, message }: EmptyStateProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // Responsive sizing
  const isSmallScreen = screenWidth < 375;
  const iconContainerSize = isSmallScreen ? 80 : 96;
  const fontSize = {
    icon: isSmallScreen ? 40 : 48,
    title: isSmallScreen ? 22 : 26,
    message: isSmallScreen ? 15 : 17,
  };

  useEffect(() => {
    // Fade in animation
    opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    
    // Breathing animation for icon
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[
        styles.iconContainer,
        animatedStyle,
        {
          width: iconContainerSize,
          height: iconContainerSize,
          borderRadius: iconContainerSize / 2,
        }
      ]}>
        <Text style={[styles.icon, { fontSize: fontSize.icon }]}>{icon}</Text>
      </Animated.View>
      <Text style={[styles.title, { fontSize: fontSize.title }]}>{title}</Text>
      <Text style={[styles.message, { fontSize: fontSize.message }]}>{message}</Text>
    </Animated.View>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  icon: {
    // fontSize set dynamically
  },
  title: {
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
});
