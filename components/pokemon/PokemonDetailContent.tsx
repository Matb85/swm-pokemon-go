import { ActivityIndicator, View } from 'react-native';
import { PokemonImage } from '@/components/pokemon/PokemonImage';
import { PokemonStatsTable } from '@/components/pokemon/PokemonStatsTable';
import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { Text } from '@/components/ui/text';
import { formatPokemonName, getTypeConfig } from '@/lib/pokemon-types';
import type { Pokemon } from '@/services/pokeapi';

type PokemonDetailContentProps = {
  pokemon: Pokemon | null;
  loading: boolean;
};

export function PokemonDetailContent({ pokemon, loading }: PokemonDetailContentProps) {
  if (loading || !pokemon) {
    return (
      <View className="min-h-48 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#173EA5" />
      </View>
    );
  }

  const primaryColor = pokemon.types[0] ? getTypeConfig(pokemon.types[0]).color : '#5A8EA2';

  return (
    <View className="items-center gap-6 p-6">
      <View
        className="h-64 w-full items-center justify-center rounded-[15px]"
        style={{ backgroundColor: primaryColor }}>
        {pokemon.image ? <PokemonImage uri={pokemon.image} id={pokemon.id} size={208} /> : null}
      </View>

      <View className="w-full gap-2">
        <Text className="text-sm font-semibold text-[#333]">
          #{pokemon.id.toString().padStart(3, '0')}
        </Text>
        <Text className="text-3xl font-semibold text-black">{formatPokemonName(pokemon.name)}</Text>
        <View className="flex-row flex-wrap gap-2 pt-2">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </View>
      </View>

      <PokemonStatsTable pokemon={pokemon} />
    </View>
  );
}
