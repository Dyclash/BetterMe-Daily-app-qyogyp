

import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      label: 'Habits',
      image_source: require('@/assets/images/6cb9802c-37e5-40d5-9468-27fe8aa377b8.png'),
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      label: 'Profile',
      image_source: require('@/assets/images/6cb9802c-37e5-40d5-9468-27fe8aa377b8.png'),
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
