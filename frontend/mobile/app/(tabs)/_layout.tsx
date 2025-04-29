import { Tabs } from 'expo-router';
import React, { ReactNode } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import IdentityProvider from '@/components/securestore';

export default function TabLayout({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();

  return (
    <>
      <IdentityProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
              },
              default: {},
            }),
          }}>
          <Tabs.Screen
            name="jobsites"
            options={{
              title: 'Jobsites',
              tabBarIcon: ({ color }) => <Ionicons size={28} name="construct" color={color} />,
            }}
          />
          <Tabs.Screen
            name="material"
            options={{
              title: 'Materials',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="alpha-m-circle" color={color} />,
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="home" color={color} />,
            }}
          />
          <Tabs.Screen
            name="contacts"
            options={{
              title: 'Contacts',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account-group" color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account-circle" color={color} />,
            }}
          />
          <Tabs.Screen
            name="editProfile"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </IdentityProvider>
    </>
  );
}
