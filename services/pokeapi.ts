const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export type PokemonStatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

export type PokemonStats = Record<PokemonStatName, number>;

export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  stats: PokemonStats;
};

const STAT_LABELS: Record<PokemonStatName, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export function getStatLabel(stat: PokemonStatName) {
  return STAT_LABELS[stat];
}

type PokemonPageResult = {
  name: string;
  url: string;
};

function extractIdFromUrl(url: string) {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export async function fetchPokemonPage(offset: number, limit = 20) {
  const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();

  return {
    results: data.results as PokemonPageResult[],
    hasMore: Boolean(data.next),
  };
}

const typePokemonIdsCache = new Map<string, number[]>();

export async function fetchPokemonIdsByType(typeName: string): Promise<number[]> {
  const cached = typePokemonIdsCache.get(typeName);
  if (cached) return cached;

  const response = await fetch(`${POKEAPI_BASE}/type/${typeName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch type: ${typeName}`);
  }

  const data = await response.json();
  const ids = (data.pokemon as { pokemon: { url: string } }[])
    .map((entry) => extractIdFromUrl(entry.pokemon.url))
    .filter((id) => id > 0);

  typePokemonIdsCache.set(typeName, ids);
  return ids;
}

function parsePokemonStats(entries: { stat: { name: string }; base_stat: number }[]): PokemonStats {
  const stats = Object.fromEntries(
    Object.keys(STAT_LABELS).map((name) => [name, 0])
  ) as PokemonStats;

  for (const entry of entries) {
    const name = entry.stat.name as PokemonStatName;
    if (name in STAT_LABELS) {
      stats[name] = entry.base_stat;
    }
  }

  return stats;
}

export async function fetchPokemon(id: number): Promise<Pokemon> {
  const response = await fetch(`${POKEAPI_BASE}/pokemon/${id}`);
  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default,
    types: data.types.map((entry: { type: { name: string } }) => entry.type.name),
    height: data.height / 10,
    weight: data.weight / 10,
    stats: parsePokemonStats(data.stats),
  };
}

export type FetchPokemonListOptions = {
  type?: string | null;
};

export async function fetchPokemonListWithDetails(
  offset: number,
  limit = 20,
  options: FetchPokemonListOptions = {}
) {
  if (options.type) {
    const allIds = await fetchPokemonIdsByType(options.type);
    const pageIds = allIds.slice(offset, offset + limit);
    const pokemon = await Promise.all(pageIds.map((id) => fetchPokemon(id)));

    return {
      pokemon,
      hasMore: offset + limit < allIds.length,
    };
  }

  const page = await fetchPokemonPage(offset, limit);
  const ids = page.results.map((result) => extractIdFromUrl(result.url)).filter((id) => id > 0);
  const pokemon = await Promise.all(ids.map((id) => fetchPokemon(id)));

  return {
    pokemon,
    hasMore: page.hasMore,
  };
}

export async function fetchPokemonByIds(ids: number[]): Promise<Pokemon[]> {
  if (ids.length === 0) return [];

  const pokemon = await Promise.all(ids.map((id) => fetchPokemon(id)));
  return pokemon;
}
