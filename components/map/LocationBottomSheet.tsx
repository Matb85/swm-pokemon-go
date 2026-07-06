import { PokemonImage } from '@/components/pokemon/PokemonImage';
import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { Text } from '@/components/ui/text';
import { formatPokemonName, getTypeConfig } from '@/lib/pokemon-types';
import type { DiscoveredLocation } from '@/lib/map-locations';
import type { Pokemon } from '@/services/pokeapi';
import { Pressable, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 72;

type LocationBottomSheetProps = {
  location: DiscoveredLocation;
  pokemon: Pokemon | null;
  loading: boolean;
  onClose: () => void;
};

export function LocationBottomSheet({
  location,
  pokemon,
  loading,
  onClose,
}: LocationBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = TAB_BAR_HEIGHT + insets.bottom + 12;
  const primaryColor = pokemon?.types[0]
    ? getTypeConfig(pokemon.types[0]).color
    : '#5A8EA2';

  return (
    <Animated.View
      entering={SlideInDown.duration(280).springify().damping(18)}
      exiting={SlideOutDown.duration(200)}
      className="absolute inset-x-4 rounded-[20px] bg-white shadow-lg"
      style={{
        bottom: bottomOffset,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 12,
      }}>
      <View className="items-center pt-3">
        <View className="h-1 w-10 rounded-full bg-[#e6e6e6]" />
      </View>

      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close location details"
        className="absolute right-3 top-3 z-10 size-8 items-center justify-center rounded-full bg-[#f5f5f5]">
        <Text className="text-base text-[#666]">×</Text>
      </Pressable>

      <View className="gap-4 p-4 pt-5">
        {loading || !pokemon ? (
          <View className="h-28 items-center justify-center">
            <Text className="text-sm text-[#999]">Loading discovery…</Text>
          </View>
        ) : (
          <>
            <View className="flex-row items-center gap-4">
              <View
                className="size-20 items-center justify-center rounded-2xl"
                style={{ backgroundColor: primaryColor }}>
                {pokemon.image ? (
                  <PokemonImage uri={pokemon.image} id={pokemon.id} size={64} />
                ) : null}
              </View>

              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold text-[#999]">
                  #{pokemon.id.toString().padStart(3, '0')}
                </Text>
                <Text className="text-xl font-semibold text-black">
                  {formatPokemonName(pokemon.name)}
                </Text>
                <View className="flex-row flex-wrap gap-1.5 pt-1">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </View>
              </View>
            </View>

            <Text className="text-sm leading-5 text-[#555]">{location.description}</Text>
          </>
        )}
      </View>
    </Animated.View>
  );
}
