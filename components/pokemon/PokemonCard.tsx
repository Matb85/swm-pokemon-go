import { Text } from '@/components/ui/text';
import { formatPokemonName, getTypeConfig } from '@/lib/pokemon-types';
import type { Pokemon } from '@/services/pokeapi';
import { Heart } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PokemonImage } from './PokemonImage';
import { TypeBadge } from './TypeBadge';

type PokemonCardProps = {
  pokemon: Pokemon;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
};

export const PokemonCard = memo(function PokemonCard({
  pokemon,
  isFavorite = false,
  onPress,
  onToggleFavorite,
}: PokemonCardProps) {
  const primaryTypeColor = pokemon.types[0]
    ? getTypeConfig(pokemon.types[0]).color
    : '#5A8EA2';

  return (
    <Pressable
      onPress={onPress}
      className="h-[102px] flex-row overflow-hidden rounded-[15px] bg-[#ecf1f3]">
      <View className="flex-1 justify-center gap-1 py-3 pl-4">
        <Text className="text-[12px] font-semibold text-[#333]">
          #{pokemon.id.toString().padStart(3, '0')}
        </Text>
        <Text className="text-[21px] font-semibold text-black">
          {formatPokemonName(pokemon.name)}
        </Text>
        <View className="flex-row flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </View>
      </View>

      <View
        className="relative h-full w-[126px] items-center justify-center rounded-[15px]"
        style={{ backgroundColor: primaryTypeColor }}>
        <HexOutline className="absolute size-[94px]" />
        {pokemon.image ? (
          <PokemonImage uri={pokemon.image} id={pokemon.id} size={94} />
        ) : null}
        <Pressable
          onPress={onToggleFavorite}
          className="absolute right-2 top-2 size-8 items-center justify-center"
          hitSlop={8}>
          <View className="size-8 items-center justify-center rounded-full border border-white/80">
            <Heart
              size={16}
              color="#fff"
              fill={isFavorite ? '#fff' : 'transparent'}
            />
          </View>
        </Pressable>
      </View>
    </Pressable>
  );
});

function HexOutline({ className }: { className?: string }) {
  return (
    <View className={className}>
      <Svg width="100%" height="100%" viewBox="0 0 94 94" fill="none">
        <Path
          d="M47 4L84.5 25.5V68.5L47 90L9.5 68.5V25.5L47 4Z"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={2}
          fill="rgba(255,255,255,0.08)"
        />
      </Svg>
    </View>
  );
}
