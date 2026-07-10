import Mapbox, { Camera, type CameraRef, MapView, MarkerView } from '@rnmapbox/maps';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { AddPinBottomSheet, type AddPinBottomSheetRef } from '@/components/map/AddPinBottomSheet';
import { LocateMeButton } from '@/components/map/LocateMeButton';
import { MapPinsBottomSheet } from '@/components/map/MapPinsBottomSheet';
import { PokeballPin } from '@/components/map/PokeballPin';
import { useMapPins } from '@/hooks/useMapPins';
import { createMapPin, MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '@/lib/map-locations';
import { ensureMapboxInitialized } from '@/lib/mapbox';
import { getUserCoordinate } from '@/lib/user-location';

const USER_LOCATION_ZOOM = 15;

export function MapContent() {
  const { pins, addPin, removePin } = useMapPins();
  const addPinSheetRef = useRef<AddPinBottomSheetRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const [pendingCoordinate, setPendingCoordinate] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (__DEV__) console.log('[MapContent] mounted');
    const mapboxInitStart = Date.now();
    ensureMapboxInitialized();
    if (__DEV__) {
      console.log('[MapContent] ensureMapboxInitialized finished', {
        mapboxInitMs: Date.now() - mapboxInitStart,
      });
    }
  }, []);

  const handleMapLongPress = (feature: GeoJSON.Feature) => {
    const geometry = feature.geometry;
    if (geometry.type !== 'Point') return;

    const coordinate = geometry.coordinates as [number, number];
    setPendingCoordinate(coordinate);
    addPinSheetRef.current?.present(coordinate);
  };

  const handleSelectPokemon = (pokemonId: number) => {
    if (!pendingCoordinate) return;

    addPin(createMapPin(pokemonId, pendingCoordinate));
    setPendingCoordinate(null);
  };

  const handleLocateMe = async () => {
    const coordinate = await getUserCoordinate();
    if (!coordinate) return;

    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: USER_LOCATION_ZOOM,
      animationDuration: 1000,
    });
  };

  return (
    <View className="flex-1 bg-[#f5f5f5]">
      <MapView
        style={{ flex: 1 }}
        styleURL={Mapbox.StyleURL.Light}
        compassEnabled={false}
        scaleBarEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        onWillStartLoadingMap={() => {
          if (__DEV__) console.log('[MapContent] MapView will start loading');
        }}
        onDidFinishLoadingStyle={() => {
          if (__DEV__) console.log('[MapContent] MapView style loaded');
        }}
        onDidFinishLoadingMap={() => {
          if (__DEV__) console.log('[MapContent] MapView map loaded');
        }}
        onLongPress={handleMapLongPress}>
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: MAP_DEFAULT_CENTER,
            zoomLevel: MAP_DEFAULT_ZOOM,
          }}
        />

        {pins.map((pin) => (
          <MarkerView
            key={pin.id}
            coordinate={pin.coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            allowOverlap>
            <PokeballPin />
          </MarkerView>
        ))}
      </MapView>

      <LocateMeButton onLocate={handleLocateMe} />

      <MapPinsBottomSheet pins={pins} onDeletePin={removePin} />

      <AddPinBottomSheet
        ref={addPinSheetRef}
        onSelectPokemon={handleSelectPokemon}
        onDismiss={() => setPendingCoordinate(null)}
      />
    </View>
  );
}
