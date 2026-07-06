import { Text } from '@/components/ui/text';
import { getTypeConfig, formatPokemonName } from '@/lib/pokemon-types';
import { fetchPokemon } from '@/services/pokeapi';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TypeBadge } from '@/components/pokemon/TypeBadge';

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState<Awaited<ReturnType<typeof fetchPokemon>> | null>(
    null
  );

  useEffect(() => {
    if (!id) return;

    fetchPokemon(Number(id))
      .then(setPokemon)
      .finally(() => setLoading(false));
  }, [id]);

  const primaryColor = pokemon?.types[0]
    ? getTypeConfig(pokemon.types[0]).color
    : '#5A8EA2';

  return (
    <>
      <Stack.Screen
        options={{
          title: pokemon ? formatPokemonName(pokemon.name) : 'Pokémon',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#173EA5',
        }}
      />
      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        {loading || !pokemon ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#173EA5" />
          </View>
        ) : (
          <ScrollView contentContainerClassName="items-center gap-6 p-6">
            <View
              className="h-64 w-full items-center justify-center rounded-[15px]"
              style={{ backgroundColor: primaryColor }}>
              {pokemon.image ? (
                <Image
                  source={{ uri: pokemon.image }}
                  className="size-52"
                  resizeMode="contain"
                />
              ) : null}
            </View>

            <View className="w-full gap-2">
              <Text className="text-sm font-semibold text-[#333]">
                #{pokemon.id.toString().padStart(3, '0')}
              </Text>
              <Text className="text-3xl font-semibold text-black">
                {formatPokemonName(pokemon.name)}
              </Text>
              <View className="flex-row flex-wrap gap-2 pt-2">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
