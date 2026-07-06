import { Text } from '@/components/ui/text';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type FilterButtonsProps = {
  typeFilter: string;
  sortOrder: string;
  onTypePress?: () => void;
  onSortPress?: () => void;
};

export function FilterButtons({
  typeFilter,
  sortOrder,
  onTypePress,
  onSortPress,
}: FilterButtonsProps) {
  return (
    <View className="flex-row gap-4">
      <Pressable
        onPress={onTypePress}
        className="h-[42px] flex-1 flex-row items-center justify-center gap-2 rounded-full bg-[#333] px-4">
        <Text className="text-sm font-semibold text-white">{typeFilter}</Text>
        <ChevronDown size={16} color="#fff" />
      </Pressable>
      <Pressable
        onPress={onSortPress}
        className="h-[42px] flex-1 flex-row items-center justify-center gap-2 rounded-full bg-[#333] px-4">
        <Text className="text-sm font-semibold text-white">{sortOrder}</Text>
        <ChevronDown size={16} color="#fff" />
      </Pressable>
    </View>
  );
}
