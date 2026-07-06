import { Text } from '@/components/ui/text';
import { getTypeConfig } from '@/lib/pokemon-types';
import { View } from 'react-native';

type TypeBadgeProps = {
  type: string;
};

export function TypeBadge({ type }: TypeBadgeProps) {
  const { color, label } = getTypeConfig(type);

  return (
    <View
      className="flex-row items-center gap-1 rounded-full p-0.5 pr-1.5"
      style={{ backgroundColor: color }}>
      <View className="size-5 items-center justify-center rounded-full bg-white/90">
        <View className="size-2 rounded-full" style={{ backgroundColor: color }} />
      </View>
      <Text className="text-[11px] font-medium text-white">{label}</Text>
    </View>
  );
}
