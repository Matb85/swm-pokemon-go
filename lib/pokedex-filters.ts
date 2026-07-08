import { POKEMON_TYPE_CONFIG, type PokemonTypeName } from '@/lib/pokemon-types';

export type PokedexSortOrder = 'name-asc' | 'name-desc' | 'id-asc' | 'id-desc';

export const POKEDEX_SORT_OPTIONS: { value: PokedexSortOrder; label: string }[] = [
  { value: 'id-asc', label: 'Dex #' },
  { value: 'name-asc', label: 'A-Z' },
  { value: 'name-desc', label: 'Z-A' },
  { value: 'id-desc', label: 'Dex # ↓' },
];

export type PokedexTypeFilter = PokemonTypeName | null;

export const POKEDEX_TYPE_OPTIONS: { value: PokedexTypeFilter; label: string }[] = [
  { value: null, label: 'All types' },
  ...Object.entries(POKEMON_TYPE_CONFIG).map(([value, config]) => ({
    value: value as PokemonTypeName,
    label: config.label,
  })),
];

export function getSortLabel(sortOrder: PokedexSortOrder) {
  return POKEDEX_SORT_OPTIONS.find((option) => option.value === sortOrder)?.label ?? 'A-Z';
}

export function getTypeFilterLabel(typeFilter: PokedexTypeFilter) {
  if (!typeFilter) return 'All types';
  return POKEMON_TYPE_CONFIG[typeFilter].label;
}

export function sortPokemon<T extends { id: number; name: string }>(
  items: T[],
  sortOrder: PokedexSortOrder
): T[] {
  const sorted = [...items];

  switch (sortOrder) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'id-desc':
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}
