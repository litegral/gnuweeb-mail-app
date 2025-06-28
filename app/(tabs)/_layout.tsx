import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useColorScheme } from '~/hooks/useColorScheme';
import { Home } from '~/lib/icons/Home';
import { User } from '~/lib/icons/User';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#666666' : '#999999',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
          },
          default: {
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
            borderTopWidth: 1,
            borderTopColor: colorScheme === 'dark' ? '#333333' : '#e0e0e0',
            elevation: 0,
            shadowOpacity: 0,
          },
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size || 24} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 24} />,
        }}
      />
    </Tabs>
  );
}
