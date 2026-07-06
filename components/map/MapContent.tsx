import { LocationBottomSheet } from '@/components/map/LocationBottomSheet';
import { PokeballPin } from '@/components/map/PokeballPin';
import {
  DISCOVERED_LOCATIONS,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  type DiscoveredLocation,
} from '@/lib/map-locations';
import { ensureMapboxInitialized } from '@/lib/mapbox';
import { fetchPokemon } from '@/services/pokeapi';
import Mapbox, { Camera, MapView, MarkerView } from '@rnmapbox/maps';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

export function MapContent() {
  const [selectedLocation, setSelectedLocation] = useState<DiscoveredLocation | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Awaited<
    ReturnType<typeof fetchPokemon>
  > | null>(null);
  const [loadingPokemon, setLoadingPokemon] = useState(false);

  useEffect(() => {
    ensureMapboxInitialized();
  }, []);

  useEffect(() => {
    if (!selectedLocation) {
      setSelectedPokemon(null);
      return;
    }

    let cancelled = false;
    setLoadingPokemon(true);

    fetchPokemon(selectedLocation.pokemonId)
      .then((pokemon) => {
        if (!cancelled) {
          setSelectedPokemon(pokemon);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSelectedPokemon(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingPokemon(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLocation]);

  const handleSelectLocation = useCallback((location: DiscoveredLocation) => {
    setSelectedLocation((current) => (current?.id === location.id ? null : location));
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const handleMapPress = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  return (
    <View className="flex-1 bg-[#f5f5f5]">
      <MapView
        style={{ flex: 1 }}
        styleURL={Mapbox.StyleURL.Light}
        compassEnabled={false}
        scaleBarEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        onPress={handleMapPress}>
        <Camera
          defaultSettings={{
            centerCoordinate: MAP_DEFAULT_CENTER,
            zoomLevel: MAP_DEFAULT_ZOOM,
          }}
        />

        {DISCOVERED_LOCATIONS.map((location) => {
          const isSelected = selectedLocation?.id === location.id;

          return (
            <MarkerView
              key={location.id}
              coordinate={location.coordinate}
              anchor={{ x: 0.5, y: 0.5 }}
              allowOverlap
              isSelected={isSelected}>
              <Pressable
                onPress={() => handleSelectLocation(location)}
                accessibilityRole="button"
                accessibilityLabel={`Discovered Pokémon location ${location.id}`}
                hitSlop={8}>
                <PokeballPin selected={isSelected} />
              </Pressable>
            </MarkerView>
          );
        })}
      </MapView>

      {loadingPokemon && selectedLocation && !selectedPokemon ? (
        <View className="absolute inset-x-0 top-16 items-center">
          <ActivityIndicator color="#173EA5" />
        </View>
      ) : null}

      {selectedLocation ? (
        <LocationBottomSheet
          location={selectedLocation}
          pokemon={selectedPokemon}
          loading={loadingPokemon}
          onClose={handleCloseSheet}
        />
      ) : null}
    </View>
  );
}
