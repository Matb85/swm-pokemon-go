export type MapPin = {
  id: string;
  pokemonId: number;
  coordinate: [number, number];
};

export const MAP_DEFAULT_CENTER: [number, number] = [4.9041, 52.3645];

export const MAP_DEFAULT_ZOOM = 13.5;

export function createMapPin(pokemonId: number, coordinate: [number, number]): MapPin {
  return {
    id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    pokemonId,
    coordinate,
  };
}
