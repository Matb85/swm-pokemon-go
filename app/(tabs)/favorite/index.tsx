import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoriteScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-semibold text-[#333]">Favorites</Text>
      <Text className="mt-2 text-sm text-[#999]">Coming soon</Text>
    </SafeAreaView>
  );
}
