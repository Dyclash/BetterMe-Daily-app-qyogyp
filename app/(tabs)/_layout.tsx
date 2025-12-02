
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      label: 'Habits',
      image_source: require('@/assets/images/88a0b5bf-d788-45a4-aade-c41418392a30.png'),
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      label: 'Profile',
      image_source: require('@/assets/images/88a0b5bf-d788-45a4-aade-c41418392a30.png'),
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
