import { LegendList } from '@legendapp/list/react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterButtons } from '@/components/pokemon/FilterButtons';
import {
  FilterPickerBottomSheet,
  type FilterPickerBottomSheetRef,
} from '@/components/pokemon/FilterPickerBottomSheet';
import { usePokemonBottomSheet } from '@/components/pokemon/PokemonBottomSheet';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { SearchBar } from '@/components/pokemon/SearchBar';
import { Text } from '@/components/ui/text';
import { useFavorites } from '@/hooks/useFavorites';
import {
  getSortLabel,
  getTypeFilterLabel,
  POKEDEX_SORT_OPTIONS,
  POKEDEX_TYPE_OPTIONS,
  type PokedexSortOrder,
  type PokedexTypeFilter,
  sortPokemon,
} from '@/lib/pokedex-filters';
import { formatPokemonName } from '@/lib/pokemon-types';
import { scheduleIdleTask } from '@/lib/schedule-idle';
import { fetchPokemonListWithDetails, type Pokemon } from '@/services/pokeapi';

const PAGE_SIZE = 20;
const ITEM_HEIGHT = 102;
const ITEM_GAP = 12;
const LIST_ITEM_SIZE = ITEM_HEIGHT + ITEM_GAP;

function EmptyList() {
  return (
    <View className="items-center py-12">
      <Text className="text-base text-[#999]">No Pokémon found.</Text>
    </View>
  );
}

export default function PokedexScreen() {
  const { openPokemon } = usePokemonBottomSheet();
  const isMountedRef = useRef(false);
  const loadMoreLockRef = useRef(false);
  const filterSheetRef = useRef<FilterPickerBottomSheetRef>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<PokedexTypeFilter>(null);
  const [sortOrder, setSortOrder] = useState<PokedexSortOrder>('name-asc');
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadPokemon = useCallback(
    async (nextOffset: number, reset = false) => {
      const page = await fetchPokemonListWithDetails(nextOffset, PAGE_SIZE, {
        type: typeFilter,
      });

      if (!isMountedRef.current) return;

      setPokemon((current) => (reset ? page.pokemon : [...current, ...page.pokemon]));
      setOffset(nextOffset + PAGE_SIZE);
      setHasMore(page.hasMore);
    },
    [typeFilter]
  );

  useEffect(() => {
    setLoading(true);
    setCanLoadMore(false);

    loadPokemon(0, true)
      .catch(() => {
        if (isMountedRef.current) {
          setPokemon([]);
          setHasMore(false);
        }
      })
      .finally(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      });
  }, [loadPokemon]);

  useEffect(() => {
    if (loading) {
      setCanLoadMore(false);
      return;
    }

    return scheduleIdleTask(() => {
      if (isMountedRef.current) {
        setCanLoadMore(true);
      }
    });
  }, [loading]);

  const filteredPokemon = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchesSearch = query
      ? pokemon.filter((item) => {
          const name = item.name.toLowerCase();
          const formatted = formatPokemonName(item.name).toLowerCase();
          const id = item.id.toString();
          return name.includes(query) || formatted.includes(query) || id.includes(query);
        })
      : pokemon;

    return sortPokemon(matchesSearch, sortOrder);
  }, [pokemon, search, sortOrder]);

  const handleRefresh = useCallback(async () => {
    if (!isMountedRef.current) return;

    setRefreshing(true);
    try {
      await loadPokemon(0, true);
    } finally {
      if (isMountedRef.current) {
        setRefreshing(false);
      }
    }
  }, [loadPokemon]);

  const handleLoadMore = useCallback(async () => {
    if (!canLoadMore || !isMountedRef.current || loadMoreLockRef.current) return;
    if (!hasMore || loadingMore || loading || search.trim()) return;

    loadMoreLockRef.current = true;
    setLoadingMore(true);

    try {
      await loadPokemon(offset);
    } finally {
      if (isMountedRef.current) {
        setLoadingMore(false);
      }
      loadMoreLockRef.current = false;
    }
  }, [canLoadMore, hasMore, loadingMore, loading, search, offset, loadPokemon]);

  const handlePokemonPress = useCallback(
    (id: number) => {
      openPokemon(id);
    },
    [openPokemon]
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

  const handleTypePress = useCallback(() => {
    filterSheetRef.current?.present({
      title: 'Filter by type',
      options: POKEDEX_TYPE_OPTIONS,
      selectedValue: typeFilter,
      onSelect: setTypeFilter,
    });
  }, [typeFilter]);

  const handleSortPress = useCallback(() => {
    filterSheetRef.current?.present({
      title: 'Sort by',
      options: POKEDEX_SORT_OPTIONS,
      selectedValue: sortOrder,
      onSelect: setSortOrder,
    });
  }, [sortOrder]);

  const listHeader = useMemo(
    () => (
      <View className="pb-4 pt-2">
        <FilterButtons
          typeFilter={getTypeFilterLabel(typeFilter)}
          sortOrder={getSortLabel(sortOrder)}
          onTypePress={handleTypePress}
          onSortPress={handleSortPress}
        />
      </View>
    ),
    [typeFilter, sortOrder, handleTypePress, handleSortPress]
  );

  const listFooter = useMemo(
    () =>
      loadingMore ? (
        <View className="py-4">
          <ActivityIndicator color="#173EA5" />
        </View>
      ) : null,
    [loadingMore]
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
      <SearchBar value={search} onChangeText={setSearch} />

      <LegendList
        data={filteredPokemon}
        extraData={favoriteIds}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        recycleItems
        estimatedItemSize={LIST_ITEM_SIZE}
        getFixedItemSize={getFixedItemSize}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={EmptyList}
        ListFooterComponent={listFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
      />

      <FilterPickerBottomSheet ref={filterSheetRef} />
    </SafeAreaView>
  );
}
