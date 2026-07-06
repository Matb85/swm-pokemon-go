import { FilterButtons } from '@/components/pokemon/FilterButtons';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { SearchBar } from '@/components/pokemon/SearchBar';
import { Text } from '@/components/ui/text';
import { formatPokemonName } from '@/lib/pokemon-types';
import {
  fetchPokemonListWithDetails,
  type Pokemon,
} from '@/services/pokeapi';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 20;

export default function PokedexScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const loadPokemon = useCallback(async (nextOffset: number, reset = false) => {
    const page = await fetchPokemonListWithDetails(nextOffset, PAGE_SIZE);

    setPokemon((current) =>
      reset ? page.pokemon : [...current, ...page.pokemon]
    );
    setOffset(nextOffset + PAGE_SIZE);
    setHasMore(page.hasMore);
  }, []);

  useEffect(() => {
    loadPokemon(0, true)
      .catch(() => setPokemon([]))
      .finally(() => setLoading(false));
  }, [loadPokemon]);

  const filteredPokemon = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return pokemon;

    return pokemon.filter((item) => {
      const name = item.name.toLowerCase();
      const formatted = formatPokemonName(item.name).toLowerCase();
      const id = item.id.toString();
      return (
        name.includes(query) ||
        formatted.includes(query) ||
        id.includes(query)
      );
    });
  }, [pokemon, search]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPokemon(0, true);
    } finally {
      setRefreshing(false);
    }
  }, [loadPokemon]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading || search.trim()) return;

    setLoadingMore(true);
    try {
      await loadPokemon(offset);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, loading, search, offset, loadPokemon]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#173EA5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <SearchBar value={search} onChangeText={setSearch} />

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="px-4 pb-4"
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={
          <View className="pb-4 pt-2">
            <FilterButtons
              typeFilter="All types"
              sortOrder="A-Z"
            />
          </View>
        }
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            isFavorite={favorites.has(item.id)}
            onPress={() => router.push(`/pokedex/${item.id}`)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-base text-[#999]">
              No Pokémon found.
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4">
              <ActivityIndicator color="#173EA5" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
