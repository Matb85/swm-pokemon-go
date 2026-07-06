import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { Text } from '@/components/ui/text';
import { useFavorites } from '@/hooks/useFavorites';
import { fetchPokemonByIds, type Pokemon } from '@/services/pokeapi';
import { LegendList } from '@legendapp/list/react-native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ITEM_HEIGHT = 102;
const ITEM_GAP = 12;
const LIST_ITEM_SIZE = ITEM_HEIGHT + ITEM_GAP;

function EmptyFavorites() {
  return (
    <View className="items-center px-8 py-16">
      <Text className="text-center text-lg font-semibold text-[#333]">No favorites yet</Text>
      <Text className="mt-2 text-center text-sm text-[#999]">
        Tap the heart on a Pokémon card in the Pokédex to add it here.
      </Text>
    </View>
  );
}

export default function FavoriteScreen() {
  const router = useRouter();
  const isMountedRef = useRef(false);
  const { favoriteIds } = useFavorites();

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setPokemon([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetchPokemonByIds(favoriteIds)
      .then((results) => {
        if (!isMountedRef.current) return;

        const byId = new Map(results.map((item) => [item.id, item]));
        setPokemon(favoriteIds.map((id) => byId.get(id)).filter(Boolean) as Pokemon[]);
      })
      .catch(() => {
        if (isMountedRef.current) {
          setPokemon([]);
        }
      })
      .finally(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      });
  }, [favoriteIds]);

  const handlePokemonPress = useCallback(
    (id: number) => {
      router.push(`/pokedex/${id}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Pokemon }) => (
      <View style={{ marginBottom: ITEM_GAP }}>
        <PokemonCard pokemon={item} onPress={() => handlePokemonPress(item.id)} />
      </View>
    ),
    [handlePokemonPress]
  );

  const keyExtractor = useCallback((item: Pokemon) => item.id.toString(), []);

  const getFixedItemSize = useCallback(() => LIST_ITEM_SIZE, []);

  const listHeader = useMemo(
    () => (
      <View className="pb-4 pt-2">
        <Text className="text-2xl font-semibold text-black">Favorites</Text>
        {pokemon.length > 0 ? (
          <Text className="mt-1 text-sm text-[#999]">
            {pokemon.length} Pokémon{pokemon.length === 1 ? '' : 's'} saved
          </Text>
        ) : null}
      </View>
    ),
    [pokemon.length]
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#173EA5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <LegendList
        data={pokemon}
        extraData={favoriteIds}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        recycleItems
        estimatedItemSize={LIST_ITEM_SIZE}
        getFixedItemSize={getFixedItemSize}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={EmptyFavorites}
      />
    </SafeAreaView>
  );
}
