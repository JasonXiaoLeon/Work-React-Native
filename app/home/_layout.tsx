import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { ColorValue } from 'react-native'; // 导入 ColorValue 类型

export default function HomeLayout() {
  const pathname = usePathname();

  const shouldHideTabBar = pathname === '/home/profile/Edit'|| pathname === '/home/schedule/booking'|| pathname === '/home/profile/MyCalendar';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: shouldHideTabBar
        ? { display: 'none' }
        : {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            height: 60,
            paddingTop: 10,
            paddingBottom:10,
          },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: '时间表',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workspace"
        options={{
          title: '工作区',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
