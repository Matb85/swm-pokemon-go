import { Stack } from 'expo-router';

export default function PokedexLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
