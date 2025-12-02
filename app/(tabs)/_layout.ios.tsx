
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      label: 'Habits',
      image_source: require('@/assets/images/831992cc-9b7a-4198-8f35-1c73ec8550eb.png'),
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      label: 'Profile',
      image_source: require('@/assets/images/831992cc-9b7a-4198-8f35-1c73ec8550eb.png'),
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
