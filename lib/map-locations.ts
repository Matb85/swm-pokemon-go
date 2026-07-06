export type DiscoveredLocation = {
  id: string;
  pokemonId: number;
  coordinate: [number, number];
  description: string;
};

/** Sample discovered spots around central Amsterdam. */
export const DISCOVERED_LOCATIONS: DiscoveredLocation[] = [
  {
    id: 'amsterdam-pikachu',
    pokemonId: 25,
    coordinate: [4.9041, 52.3676],
    description:
      'A cheerful Pikachu was seen near the canals, drawn to the city lights at dusk.',
  },
  {
    id: 'amsterdam-bulbasaur',
    pokemonId: 1,
    coordinate: [4.892, 52.3731],
    description:
      'Bulbasaur was resting in a quiet park, its bulb soaking up the morning sun.',
  },
  {
    id: 'amsterdam-charmander',
    pokemonId: 4,
    coordinate: [4.918, 52.3612],
    description:
      'The tip of Charmander’s tail flickered warmly on a cobblestone side street.',
  },
  {
    id: 'amsterdam-squirtle',
    pokemonId: 7,
    coordinate: [4.8835, 52.3598],
    description:
      'Squirtle splashed playfully by the waterfront before darting behind a bench.',
  },
  {
    id: 'amsterdam-eevee',
    pokemonId: 133,
    coordinate: [4.9115, 52.3545],
    description:
      'An curious Eevee watched passersby from a flower bed, ears twitching at every sound.',
  },
];

export const MAP_DEFAULT_CENTER: [number, number] = [4.9041, 52.3645];

export const MAP_DEFAULT_ZOOM = 13.5;
