import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import {
  POKEMON_LIST_CARD_HEIGHT,
  POKEMON_LIST_ITEM_GAP,
} from '@/components/pokemon/PokemonListCard';
import { Text } from '@/components/ui/text';
import type { MapPin } from '@/lib/map-locations';
import { fetchPokemonByIds, type Pokemon } from '@/services/pokeapi';

const COLLAPSED_HEIGHT = 120;

type MapPinsBottomSheetProps = {
  pins: MapPin[];
  onDeletePin: (id: string) => void;
};

type PinListItem = MapPin & {
  pokemon: Pokemon | null;
};

export function MapPinsBottomSheet({ pins, onDeletePin }: MapPinsBottomSheetProps) {
  const [pokemonById, setPokemonById] = useState<Record<number, Pokemon>>({});
  const [loading, setLoading] = useState(false);

  const snapPoints = useMemo(() => [COLLAPSED_HEIGHT, '50%'], []);

  useEffect(() => {
    const ids = [...new Set(pins.map((pin) => pin.pokemonId))];
    if (ids.length === 0) {
      setPokemonById({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchPokemonByIds(ids)
      .then((pokemon) => {
        if (cancelled) return;
        setPokemonById(Object.fromEntries(pokemon.map((item) => [item.id, item])));
      })
      .catch(() => {
        if (!cancelled) {
          setPokemonById({});
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pins]);

  const listData = useMemo<PinListItem[]>(
    () =>
      pins.map((pin) => ({
        ...pin,
        pokemon: pokemonById[pin.pokemonId] ?? null,
      })),
    [pins, pokemonById]
  );

  const renderItem = useCallback(
    ({ item }: { item: PinListItem }) => {
      if (!item.pokemon) {
        return (
          <View
            className="items-center justify-center rounded-[15px] bg-[#ecf1f3]"
            style={{ height: POKEMON_LIST_CARD_HEIGHT, marginBottom: POKEMON_LIST_ITEM_GAP }}>
            <ActivityIndicator color="#173EA5" />
          </View>
        );
      }

      return (
        <View style={{ marginBottom: POKEMON_LIST_ITEM_GAP }}>
          <PokemonCard pokemon={item.pokemon} onDelete={() => onDeletePin(item.id)} />
        </View>
      );
    },
    [onDeletePin]
  );

  const listHeader = useMemo(
    () => (
      <View className="pb-4 pt-1">
        <Text className="text-lg font-semibold text-black">Mapped Pins</Text>
        <Text className="text-sm text-[#777]">
          {pins.length === 0
            ? 'Long press on the map to add a pin.'
            : `${pins.length} pin${pins.length === 1 ? '' : 's'} on the map`}
        </Text>
      </View>
    ),
    [pins.length]
  );

  const listEmpty = useMemo(
    () => (
      <View className="items-center px-6 py-8">
        <Text className="text-center text-sm leading-5 text-[#999]">
          No pins yet. Long press anywhere on the map to place one.
        </Text>
      </View>
    ),
    []
  );

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={{ borderRadius: 20 }}
      handleIndicatorStyle={{ backgroundColor: '#e6e6e6', width: 40 }}>
      {loading && pins.length > 0 ? (
        <View className="absolute inset-x-0 top-16 z-10 items-center">
          <ActivityIndicator color="#173EA5" />
        </View>
      ) : null}

      <BottomSheetFlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    </BottomSheet>
  );
}
