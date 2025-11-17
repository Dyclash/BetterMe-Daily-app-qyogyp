
import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export const EmptyState = React.memo(({ icon, title, message }: EmptyStateProps) => {
  const { width: screenWidth } = useWindowDimensions();

  // Responsive sizing
  const isSmallScreen = screenWidth < 375;
  const iconContainerSize = isSmallScreen ? 72 : 80;
  const fontSize = {
    icon: isSmallScreen ? 36 : 40,
    title: isSmallScreen ? 18 : 20,
    message: isSmallScreen ? 14 : 16,
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer,
        {
          width: iconContainerSize,
          height: iconContainerSize,
          borderRadius: iconContainerSize / 2,
        }
      ]}>
        <Text style={[styles.icon, { fontSize: fontSize.icon }]}>{icon}</Text>
      </View>
      <Text style={[styles.title, { fontSize: fontSize.title }]}>{title}</Text>
      <Text style={[styles.message, { fontSize: fontSize.message }]}>{message}</Text>
    </View>
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    // fontSize set dynamically
  },
  title: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
