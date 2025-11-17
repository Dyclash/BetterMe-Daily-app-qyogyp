
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

const HABIT_ICONS = ['🎯', '📚', '💪', '🧘', '💧', '🥗', '🏃', '😴', '🎨', '🎵', '✍️', '🧠'];
const HABIT_COLORS = [
  colors.primary,
  colors.secondary,
  colors.accent,
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DFE6E9',
  '#A29BFE',
  '#FD79A8',
  '#FDCB6E',
];

export default function AddHabitScreen() {
  const router = useRouter();
  const { addHabit } = useHabits();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetCount, setTargetCount] = useState('1');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  // Responsive sizing
  const isSmallScreen = screenWidth < 375;
  const iconButtonSize = isSmallScreen ? 52 : 56;
  const colorButtonSize = isSmallScreen ? 44 : 48;

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

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
            <Pressable 
              onPress={handleSave} 
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.headerButtonText, styles.saveButton]}>Save</Text>
            </Pressable>
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
                placeholderTextColor={colors.textSecondary}
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
                placeholderTextColor={colors.textSecondary}
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
                placeholderTextColor={colors.textSecondary}
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
                          size={20}
                          color="#FFFFFF"
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
  headerButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
  saveButton: {
    fontWeight: '600',
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
    padding: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  frequencyButtonTextActive: {
    color: '#FFFFFF',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  iconText: {
    // fontSize set dynamically
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: colors.text,
  },
});
