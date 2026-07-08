import { useCallback } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import type { MapPin } from '@/lib/map-locations';
import { MAP_PINS_KEY } from '@/lib/storage';

const EMPTY_PINS: MapPin[] = [];

export function useMapPins() {
  const [pins, setPins] = useMMKVObject<MapPin[]>(MAP_PINS_KEY);

  const mappedPins = pins ?? EMPTY_PINS;

  const addPin = useCallback(
    (pin: MapPin) => {
      const current = pins ?? EMPTY_PINS;
      setPins([...current, pin]);
    },
    [pins, setPins]
  );

  const removePin = useCallback(
    (id: string) => {
      const current = pins ?? EMPTY_PINS;
      setPins(current.filter((pin) => pin.id !== id));
    },
    [pins, setPins]
  );

  return {
    pins: mappedPins,
    addPin,
    removePin,
  };
}
