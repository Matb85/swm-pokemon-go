import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { PokemonBottomSheetProvider } from '@/components/pokemon/PokemonBottomSheet';

export const unstable_settings = {
  initialRouteName: 'pokedex',
};

export default function TabLayout() {
  return (
    <PokemonBottomSheetProvider>
      <Tabs
        initialRouteName="pokedex"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen name="pokedex" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="favorite" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </PokemonBottomSheetProvider>
  );
}
