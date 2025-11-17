
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { Habit, HabitFrequency } from '@/types/habit';
import { useHabits } from '@/hooks/useHabits';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue
} from 'react-native-reanimated';

const HABIT_ICONS = ['🎯', '📚', '💪', '🧘', '💧', '🥗', '🏃', '😴', '🎨', '🎵', '✍️', '🧠'];
const HABIT_COLORS = [
  colors.primary,
  colors.secondary,
  '#00FF88',
  '#FF3366',
  '#FFB800',
  '#B026FF',
  '#FF006E',
  '#00D9FF',
  '#00FFF0',
  '#7B2CBF',
  '#06FFA5',
  '#FF0080',
];

export default function AddHabitScreen() {
  const router = useRouter();
  const { addHabit } = useHabits();
  const { width: screenWidth } = useWindowDimensions();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetCount, setTargetCount] = useState('1');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  const saveButtonScale = useSharedValue(1);

  // Responsive sizing
  const isSmallScreen = screenWidth < 375;
  const iconButtonSize = isSmallScreen ? 56 : 60;
  const colorButtonSize = isSmallScreen ? 48 : 52;

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    saveButtonScale.value = withSpring(0.9, { damping: 10 });
    setTimeout(() => {
      saveButtonScale.value = withSpring(1, { damping: 10 });
    }, 100);

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      frequency,
      targetCount: parseInt(targetCount) || 1,
      icon: selectedIcon,
      color: selectedColor,
      createdAt: new Date().toISOString(),
      completions: [],
    };

    await addHabit(newHabit);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    router.back();
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    router.back();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const saveButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveButtonScale.value }],
    };
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Pressable 
              onPress={handleCancel} 
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.headerButtonText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>New Habit</Text>
            <Animated.View style={saveButtonStyle}>
              <Pressable 
                onPress={handleSave} 
                style={styles.headerButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.headerButtonText, styles.saveButton]}>Save</Text>
              </Pressable>
            </Animated.View>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.label}>Habit Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Morning Exercise"
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a description..."
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="done"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.frequencyContainer}>
                {(['daily', 'weekly', 'monthly'] as HabitFrequency[]).map((freq, index) => (
                  <React.Fragment key={index}>
                    <Pressable
                      style={[
                        styles.frequencyButton,
                        frequency === freq && styles.frequencyButtonActive,
                      ]}
                      onPress={() => {
                        setFrequency(freq);
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          frequency === freq && styles.frequencyButtonTextActive,
                        ]}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Target Count</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor={colors.textTertiary}
                value={targetCount}
                onChangeText={setTargetCount}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Choose Icon</Text>
              <View style={styles.iconGrid}>
                {HABIT_ICONS.map((icon, index) => (
                  <React.Fragment key={index}>
                    <Pressable
                      style={[
                        styles.iconButton,
                        { width: iconButtonSize, height: iconButtonSize },
                        selectedIcon === icon && styles.iconButtonActive,
                      ]}
                      onPress={() => {
                        setSelectedIcon(icon);
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    >
                      <Text style={[styles.iconText, { fontSize: iconButtonSize * 0.5 }]}>
                        {icon}
                      </Text>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Choose Color</Text>
              <View style={styles.colorGrid}>
                {HABIT_COLORS.map((color, index) => (
                  <React.Fragment key={index}>
                    <Pressable
                      style={[
                        styles.colorButton,
                        { 
                          width: colorButtonSize, 
                          height: colorButtonSize,
                          borderRadius: colorButtonSize / 2,
                          backgroundColor: color 
                        },
                        selectedColor === color && styles.colorButtonActive,
                      ]}
                      onPress={() => {
                        setSelectedColor(color);
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    >
                      {selectedColor === color && (
                        <IconSymbol
                          ios_icon_name="checkmark"
                          android_material_icon_name="check"
                          size={24}
                          color={colors.background}
                        />
                      )}
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
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
  headerButtonText: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    color: colors.secondary,
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
    padding: 20,
    paddingBottom: 140,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
    minHeight: 56,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 18,
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  frequencyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  frequencyButtonTextActive: {
    color: colors.background,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundTertiary,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  iconText: {
    // fontSize set dynamically
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  colorButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: colors.text,
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
  },
});
