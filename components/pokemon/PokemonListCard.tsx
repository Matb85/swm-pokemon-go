import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { formatPokemonName, getTypeConfig } from '@/lib/pokemon-types';
import type { Pokemon } from '@/services/pokeapi';
import { PokemonImage } from './PokemonImage';
import { TypeBadge } from './TypeBadge';

export const POKEMON_LIST_CARD_HEIGHT = 102;
export const POKEMON_LIST_ITEM_GAP = 12;

type PokemonListCardProps = {
  pokemon: Pokemon;
  onPress?: () => void;
  trailingAction?: ReactNode;
};

export function PokemonListCard({ pokemon, onPress, trailingAction }: PokemonListCardProps) {
  const primaryTypeColor = pokemon.types[0] ? getTypeConfig(pokemon.types[0]).color : '#5A8EA2';

  return (
    <View className="relative h-[102px] flex-row overflow-hidden rounded-[15px] bg-[#ecf1f3]">
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        className="h-full flex-1 flex-row"
        accessibilityRole={onPress ? 'button' : undefined}>
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
          className="h-full w-[126px] items-center justify-center rounded-[15px]"
          style={{ backgroundColor: primaryTypeColor }}>
          <HexOutline className="absolute size-[94px]" />
          {pokemon.image ? <PokemonImage uri={pokemon.image} id={pokemon.id} size={94} /> : null}
        </View>
      </Pressable>

      {trailingAction ? (
        <View className="absolute right-2 top-2 z-10">{trailingAction}</View>
      ) : null}
    </View>
  );
}

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
