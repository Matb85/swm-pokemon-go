export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export const POKEMON_TYPE_CONFIG: Record<PokemonTypeName, { color: string; label: string }> = {
  normal: { color: '#A8A878', label: 'Normal' },
  fire: { color: '#F08030', label: 'Fire' },
  water: { color: '#6890F0', label: 'Water' },
  electric: { color: '#F8D030', label: 'Electric' },
  grass: { color: '#78C850', label: 'Grass' },
  ice: { color: '#98D8D8', label: 'Ice' },
  fighting: { color: '#C03028', label: 'Fighting' },
  poison: { color: '#A040A0', label: 'Poison' },
  ground: { color: '#D97845', label: 'Ground' },
  flying: { color: '#A890F0', label: 'Flying' },
  psychic: { color: '#F85888', label: 'Psychic' },
  bug: { color: '#A8B820', label: 'Bug' },
  rock: { color: '#B8A038', label: 'Rock' },
  ghost: { color: '#705898', label: 'Ghost' },
  dragon: { color: '#7038F8', label: 'Dragon' },
  dark: { color: '#705848', label: 'Dark' },
  steel: { color: '#5A8EA2', label: 'Steel' },
  fairy: { color: '#EE99AC', label: 'Fairy' },
};

export function getTypeConfig(type: string) {
  return (
    POKEMON_TYPE_CONFIG[type as PokemonTypeName] ?? {
      color: '#A8A878',
      label: type,
    }
  );
}

export function formatPokemonName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
