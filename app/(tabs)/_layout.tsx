import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="pokedex" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="favorite" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
