
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      label: 'Habits',
      image_source: require('@/assets/images/d102075f-cfa3-43c2-a9a3-5764d412ff4e.png'),
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      label: 'Profile',
      image_source: require('@/assets/images/d102075f-cfa3-43c2-a9a3-5764d412ff4e.png'),
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
