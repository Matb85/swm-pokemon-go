import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Search } from 'lucide-react-native';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { POKEMON_LIST_ITEM_GAP, PokemonListCard } from '@/components/pokemon/PokemonListCard';
import { Text } from '@/components/ui/text';
import { formatPokemonName } from '@/lib/pokemon-types';
import { fetchPokemonListWithDetails, type Pokemon } from '@/services/pokeapi';

const TAB_BAR_HEIGHT = 72;
const PAGE_SIZE = 20;

export type AddPinBottomSheetRef = {
  present: (coordinate: [number, number]) => void;
  dismiss: () => void;
};

type AddPinBottomSheetProps = {
  onSelectPokemon: (pokemonId: number) => void;
  onDismiss?: () => void;
};

export const AddPinBottomSheet = forwardRef<AddPinBottomSheetRef, AddPinBottomSheetProps>(
  function AddPinBottomSheet({ onSelectPokemon, onDismiss }, ref) {
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetModal>(null);
    const [search, setSearch] = useState('');
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const snapPoints = useMemo(() => ['65%'], []);
    const tabBarInset = TAB_BAR_HEIGHT + insets.bottom;

    useImperativeHandle(ref, () => ({
      present() {
        setSearch('');
        sheetRef.current?.present();
      },
      dismiss() {
        sheetRef.current?.dismiss();
      },
    }));

    const loadPokemon = useCallback(async (nextOffset: number, reset = false) => {
      const page = await fetchPokemonListWithDetails(nextOffset, PAGE_SIZE);
      setPokemon((current) => (reset ? page.pokemon : [...current, ...page.pokemon]));
      setOffset(nextOffset + PAGE_SIZE);
      setHasMore(page.hasMore);
    }, []);

    useEffect(() => {
      setLoading(true);
      loadPokemon(0, true)
        .catch(() => {
          setPokemon([]);
          setHasMore(false);
        })
        .finally(() => setLoading(false));
    }, [loadPokemon]);

    const filteredPokemon = useMemo(() => {
      const query = search.trim().toLowerCase();
      if (!query) return pokemon;

      return pokemon.filter((item) => {
        const name = item.name.toLowerCase();
        const formatted = formatPokemonName(item.name).toLowerCase();
        const id = item.id.toString();
        return name.includes(query) || formatted.includes(query) || id.includes(query);
      });
    }, [pokemon, search]);

    const handleLoadMore = useCallback(async () => {
      if (loadingMore || !hasMore || search.trim()) return;

      setLoadingMore(true);
      try {
        await loadPokemon(offset);
      } finally {
        setLoadingMore(false);
      }
    }, [hasMore, loadingMore, loadPokemon, offset, search]);

    const handleSelect = useCallback(
      (item: Pokemon) => {
        onSelectPokemon(item.id);
        sheetRef.current?.dismiss();
      },
      [onSelectPokemon]
    );

    const handleDismiss = useCallback(() => {
      setSearch('');
      onDismiss?.();
    }, [onDismiss]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.45}
          style={{ bottom: tabBarInset }}
        />
      ),
      [tabBarInset]
    );

    const renderItem = useCallback(
      ({ item }: { item: Pokemon }) => (
        <View style={{ marginBottom: POKEMON_LIST_ITEM_GAP }}>
          <PokemonListCard pokemon={item} onPress={() => handleSelect(item)} />
        </View>
      ),
      [handleSelect]
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

    const listEmpty = useMemo(
      () => (
        <View className="items-center py-10">
          <Text className="text-sm text-[#999]">No Pokémon found.</Text>
        </View>
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        bottomInset={tabBarInset}
        onDismiss={handleDismiss}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ borderRadius: 20 }}
        handleIndicatorStyle={{ backgroundColor: '#e6e6e6', width: 40 }}>
        <View className="border-b border-[#f2f2f2] px-4 pb-4 pt-1">
          <Text className="mb-3 text-lg font-semibold text-black">Add Pokémon Pin</Text>
          <View className="h-12 flex-row items-center gap-2 rounded-full border border-[#ccc] px-4">
            <Search size={20} color="#666" />
            <BottomSheetTextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search Pokémon..."
              placeholderTextColor="#999"
              className="flex-1 text-sm text-[#333]"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#173EA5" />
          </View>
        ) : (
          <BottomSheetFlatList
            data={filteredPokemon}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={listEmpty}
            ListFooterComponent={listFooter}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: insets.bottom + 16,
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
          />
        )}
      </BottomSheetModal>
    );
  }
);
